import { createSupabaseServerClient } from './supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function requireAuth(request: NextRequest) {
  const supabase = createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_REQUIRED' },
        { status: 401 }
      )
    }
  }

  return { user, error: null }
}
