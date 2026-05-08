import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithOAuth: async () => ({ data: {}, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => ({
              limit: () => ({ data: [], error: null })
            }),
            single: () => ({ data: null, error: null })
          })
        }),
      })
    } as any
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}

