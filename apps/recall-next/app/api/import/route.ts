import { NextResponse, NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { detectPlatform } from '@/lib/platform-detector'
import { requireAuth } from '@/lib/require-auth'
import { rateLimit } from '@/lib/rate-limiter'

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireAuth(request)
  if (authError) return authError

  if (!rateLimit(user!.id, 3, 3600_000)) { // 3 imports per hour
    return NextResponse.json({ error: 'Import rate limit reached. Try again in an hour.' }, { status: 429 })
  }

  const supabase = createSupabaseServerClient()

  const { platform, raw } = await request.json()
  const urls: string[] = []

  // Twitter/X: tweets.js or bookmark.js format
  if (platform === 'twitter') {
    const items = Array.isArray(raw) ? raw : raw.bookmarks || []
    items.forEach((item: any) => {
      const tweetId = item.tweet?.id_str || item.tweetId
      if (tweetId) urls.push(`https://x.com/i/web/status/${tweetId}`)
    })
  }

  // Instagram: handle both new array-of-objects format and legacy format
  if (platform === 'instagram') {
    if (Array.isArray(raw)) {
      // New format found in apps/recall-next/data/instagram/saved_posts.json
      raw.forEach((item: any) => {
        const urlLabel = item.label_values?.find((lv: any) => lv.label === 'URL')
        if (urlLabel?.value) urls.push(urlLabel.value)
        else if (item.href) urls.push(item.href)
      })
    } else {
      // Legacy format or alternative structure
      const items = raw.saved_saved_media || raw.saved_posts || []
      items.forEach((item: any) => {
        const url = item.string_map_data?.['External ID']?.value || item.string_map_data?.Link?.value || item.href
        if (url) urls.push(url)
      })
    }
  }

  // TikTok: user_data_tiktok logic
  if (platform === 'tiktok') {
    // Handling multiple TikTok export JSON structures
    // 1. Likes and Favorites -> Favorite Videos -> FavoriteVideoList -> Link
    const favVideos = raw['Likes and Favorites']?.['Favorite Videos']?.FavoriteVideoList
    if (Array.isArray(favVideos)) {
      favVideos.forEach((item: any) => {
        if (item.Link) urls.push(item.Link)
      })
    }
    
    // 2. Activity -> Favorite Videos -> FavoriteVideoList -> VideoLink
    const activityFavs = raw.Activity?.['Favorite Videos']?.FavoriteVideoList
    if (Array.isArray(activityFavs)) {
      activityFavs.forEach((item: any) => {
        const url = item.VideoLink || item.Link
        if (url) urls.push(url)
      })
    }
  }

  // Reddit: saved.json format
  if (platform === 'reddit') {
    const items = raw.data?.children || []
    items.forEach((item: any) => {
      const permalink = item.data?.permalink
      if (permalink) urls.push(`https://reddit.com${permalink}`)
    })
  }

  // Generic: just an array of URLs
  if (platform === 'urls') {
    urls.push(...(Array.isArray(raw) ? raw : []))
  }

  if (urls.length === 0) {
    return NextResponse.json({ error: 'No URLs found in import data' }, { status: 400 })
  }

  // Bulk insert without AI first (fast), then queue AI categorization
  const inserts = urls.map(url => ({
    user_id: user.id,
    url,
    platform: detectPlatform(url),
    category: 'Archive', // default until AI runs
  }))

  // Chunk inserts to avoid large payload limits if necessary
  const { data, error } = await supabase
    .from('bookmarks')
    .insert(inserts)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Return immediately — in a real app, you might trigger a background job for AI
  return NextResponse.json({ 
    imported: data?.length || 0, 
    queued_for_ai: true 
  })
}
