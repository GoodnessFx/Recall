import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createSupabaseServerClient() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for demo mode if keys are missing
    return {
      auth: {
        getUser: async () => ({ data: { user: { id: 'demo-user', email: 'demo@recall.app' } }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithOAuth: async () => ({ data: {}, error: null }),
        exchangeCodeForSession: async () => ({ data: {}, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => ({
              limit: () => ({ 
                data: [
                  {
                    id: '1',
                    url: 'https://instagram.com',
                    title: 'Instagram Inspiration',
                    summary: 'A collection of saved posts from Instagram.',
                    category: 'Inspiration',
                    platform: 'instagram',
                    created_at: new Date().toISOString(),
                    keywords: ['design', 'art']
                  },
                  {
                    id: '2',
                    url: 'https://twitter.com',
                    title: 'X Tech Trends',
                    summary: 'Insights into the latest technology from X.',
                    category: 'Education',
                    platform: 'twitter',
                    created_at: new Date().toISOString(),
                    keywords: ['ai', 'nextjs']
                  }
                ], 
                error: null 
              })
            }),
            single: () => ({ data: null, error: null })
          })
        }),
        insert: () => ({ select: () => ({ single: () => ({ data: { id: 'new-id' }, error: null }) }) }),
        update: () => ({ eq: () => ({ error: null }) }),
        delete: () => ({ eq: () => ({ error: null }) }),
      })
    } as any
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value: '', ...options })
          } catch (error) {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
