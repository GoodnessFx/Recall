'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Bookmark, Instagram, Twitter, MessageCircle } from 'lucide-react'

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

  const handleDemoLogin = () => {
    // Set a demo cookie that lasts for 7 days
    document.cookie = "recall_demo=true; path=/; max-age=" + 60 * 60 * 24 * 7;
    window.location.href = "/";
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
          
          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full bg-white text-black font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all active:scale-[0.98]"
            >
              Continue with Google
            </button>

            <button
              onClick={handleDemoLogin}
              className="w-full bg-white/5 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-[0.98] border border-white/10"
            >
              Try Demo (No Account)
            </button>
          </div>

          <div className="pt-4 border-t border-white/5">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-4">Supported Socials</p>
            <div className="flex justify-center gap-6 text-neutral-400">
              <Twitter size={20} className="hover:text-white transition-colors cursor-pointer" />
              <Instagram size={20} className="hover:text-white transition-colors cursor-pointer" />
              <MessageCircle size={20} className="hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
