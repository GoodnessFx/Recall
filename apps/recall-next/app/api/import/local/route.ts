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
  const urls = new Set<string>()

  // Deep search helper to find all URLs in any JSON structure
  function extractUrls(obj: any) {
    if (!obj || typeof obj !== 'object') return
    
    if (typeof obj === 'string') {
      if (obj.startsWith('http') && (obj.includes('tiktok.com') || obj.includes('instagram.com'))) {
        urls.add(obj)
      }
      return
    }

    if (Array.isArray(obj)) {
      obj.forEach(extractUrls)
      return
    }

    for (const key in obj) {
      // Common keys in social exports
      if (key === 'Link' || key === 'VideoLink' || key === 'href' || key === 'url' || key === 'URL') {
        if (typeof obj[key] === 'string' && obj[key].startsWith('http')) {
          urls.add(obj[key])
        }
      }
      extractUrls(obj[key])
    }
  }

  // 1. TikTok
  try {
    const tiktokLocations = [
      path.join(process.cwd(), 'data/tiktok/user_data_tiktok.json'),
      path.join(process.cwd(), 'user_data_tiktok.json'),
      path.join(process.cwd(), '..', 'user_data_tiktok.json'),
    ]

    for (const tiktokPath of tiktokLocations) {
      if (fs.existsSync(tiktokPath)) {
        console.log('Importing TikTok from:', tiktokPath)
        const raw = JSON.parse(fs.readFileSync(tiktokPath, 'utf8'))
        extractUrls(raw)
      }
    }
  } catch (e) {
    console.error('Local TikTok import error:', e)
  }

  // 2. Instagram
  try {
    const igLocations = [
      path.join(process.cwd(), 'data/instagram'),
      path.join(process.cwd(), 'your_instagram_activity/saved'),
      path.join(process.cwd(), 'your_instagram_activity/likes'),
      path.join(process.cwd(), '..', 'your_instagram_activity/saved'),
      path.join(process.cwd(), '..', 'your_instagram_activity/likes'),
    ]

    for (const igDir of igLocations) {
      if (fs.existsSync(igDir)) {
        console.log('Scanning Instagram dir:', igDir)
        const files = fs.readdirSync(igDir)
        for (const file of files) {
          if (file.endsWith('.json')) {
            const filePath = path.join(igDir, file)
            const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'))
            extractUrls(raw)
          }
        }
      }
    }
  } catch (e) {
    console.error('Local Instagram import error:', e)
  }

  const finalUrls = Array.from(urls)
  if (finalUrls.length === 0) {
    return NextResponse.json({ error: 'No data found in local files. Ensure data/ folders exist with JSON exports.' }, { status: 404 })
  }

  // Bulk insert in batches of 500 to avoid request size limits
  const BATCH_SIZE = 500
  let totalImported = 0

  for (let i = 0; i < finalUrls.length; i += BATCH_SIZE) {
    const batch = finalUrls.slice(i, i + BATCH_SIZE).map(url => ({
      user_id: user!.id,
      url,
      platform: detectPlatform(url),
      category: 'Archive',
      title: 'Imported Save'
    }))

    const { data, error } = await supabase
      .from('bookmarks')
      .upsert(batch, { onConflict: 'user_id,url' }) // Assuming we add a unique constraint or just use upsert
      .select()

    if (error) {
      console.error('Batch insert error:', error)
      // Continue with next batch instead of failing completely
    } else {
      totalImported += data?.length || 0
    }
  }

  return NextResponse.json({ 
    imported: totalImported,
    totalFound: finalUrls.length,
    status: 'success'
  })
}
