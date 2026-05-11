import { NextResponse, NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/require-auth'
import { detectPlatform } from '@/lib/platform-detector'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireAuth(request)
  if (authError) return authError

  const supabase = createSupabaseServerClient()
  const urls: string[] = []

  // 1. TikTok
  try {
    const tiktokPath = path.join(process.cwd(), 'data/tiktok/user_data_tiktok.json')
    if (fs.existsSync(tiktokPath)) {
      const raw = JSON.parse(fs.readFileSync(tiktokPath, 'utf8'))
      
      // Version 1
      const favVideos = raw['Likes and Favorites']?.['Favorite Videos']?.FavoriteVideoList
      if (Array.isArray(favVideos)) {
        favVideos.forEach((item: any) => {
          if (item.Link) urls.push(item.Link)
        })
      }
      
      // Version 2
      const activityFavs = raw.Activity?.['Favorite Videos']?.FavoriteVideoList
      if (Array.isArray(activityFavs)) {
        activityFavs.forEach((item: any) => {
          const url = item.VideoLink || item.Link
          if (url) urls.push(url)
        })
      }
    }
  } catch (e) {
    console.error('Local TikTok import error:', e)
  }

  // 2. Instagram
  try {
    const igDir = path.join(process.cwd(), 'data/instagram')
    if (fs.existsSync(igDir)) {
      const files = ['saved_posts.json', 'liked_posts.json']
      for (const file of files) {
        const filePath = path.join(igDir, file)
        if (fs.existsSync(filePath)) {
          const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'))
          if (Array.isArray(raw)) {
            raw.forEach((item: any) => {
              const urlLabel = item.label_values?.find((lv: any) => lv.label === 'URL')
              if (urlLabel?.value) urls.push(urlLabel.value)
              else if (item.href) urls.push(item.href)
            })
          }
        }
      }
    }
  } catch (e) {
    console.error('Local Instagram import error:', e)
  }

  if (urls.length === 0) {
    return NextResponse.json({ error: 'No data found in local files. Ensure data/ folders exist with JSON exports.' }, { status: 404 })
  }

  // Bulk insert
  const inserts = [...new Set(urls)].map(url => ({
    user_id: user!.id,
    url,
    platform: detectPlatform(url),
    category: 'Archive',
  }))

  const { data, error } = await supabase
    .from('bookmarks')
    .insert(inserts)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ 
    imported: data?.length || 0,
    status: 'success'
  })
}
