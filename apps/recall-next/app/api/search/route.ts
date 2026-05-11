import { NextResponse, NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/require-auth'
import { rateLimit } from '@/lib/rate-limiter'

export async function GET(request: NextRequest) {
  const { user, error: authError } = await requireAuth(request)
  if (authError) return authError

  if (!rateLimit(user!.id, 60, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const supabase = createSupabaseServerClient()

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const platform = searchParams.get('platform') || ''

  let dbQuery = supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)

  if (query) {
    dbQuery = dbQuery.textSearch('search_vector', query, { 
      type: 'websearch',
      config: 'english'
    })
  }
  
  if (category && category !== 'All') {
    dbQuery = dbQuery.eq('category', category)
  }
  
  if (platform && platform !== 'All') {
    dbQuery = dbQuery.eq('platform', platform)
  }

  const { data, error } = await dbQuery
    .order('created_at', { ascending: false })
    .limit(50)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ bookmarks: data || [] })
}
