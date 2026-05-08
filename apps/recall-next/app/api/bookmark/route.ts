import { NextResponse, NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { scrapeOG } from '@/lib/og-scraper'
import { detectPlatform } from '@/lib/platform-detector'
import { categorizeWithGemini } from '@/lib/gemini'
import { requireAuth } from '@/lib/require-auth'
import { rateLimit } from '@/lib/rate-limiter'
import { validateURL } from '@/lib/url-validator'

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireAuth(request)
  if (authError) return authError

  if (!rateLimit(user!.id, 30, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { url } = await request.json()
  const validation = validateURL(url)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const supabase = createSupabaseServerClient()

  // 1. Fetch OG metadata
  const og = await scrapeOG(url)

  // 2. Detect platform
  const platform = detectPlatform(url)

  // 3. AI categorization (fire and forget pattern — save first, update after)
  const { data: saved, error: insertError } = await supabase
    .from('bookmarks')
    .insert({
      user_id: user.id,
      url,
      title: og.title,
      description: og.description,
      thumbnail_url: og.image,
      platform,
      raw_og: og,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Insert error:', insertError)
    return NextResponse.json({ error: 'Failed to save bookmark' }, { status: 500 })
  }

  // 4. Run Gemini categorization async (don't block the response)
  if (saved) {
    categorizeWithGemini(saved.id, og.title || '', og.description || '', url)
      .then(async (result) => {
        const { error: updateError } = await supabase
          .from('bookmarks')
          .update(result)
          .eq('id', saved.id)
        
        if (updateError) {
          console.error('Update error after Gemini:', updateError)
        }
      })
      .catch(console.error)
  }

  return NextResponse.json({ bookmark: saved, status: 'saved' })
}
