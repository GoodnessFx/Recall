'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Bookmark } from 'lucide-react'

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-white/5">
            <Bookmark className="text-black w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Recall</h1>
          <p className="text-neutral-400 text-lg">Your unified second brain.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6">
          <p className="text-sm text-neutral-400">
            Sign in to save bookmarks from any platform and search them instantly with AI.
          </p>
          
          <button
            onClick={handleLogin}
            className="w-full bg-white text-black font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all active:scale-[0.98]"
          >
            Continue with Google
          </button>
        </div>

        <p className="text-xs text-neutral-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
