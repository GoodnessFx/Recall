'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Bookmark, Instagram, Twitter, MessageCircle, Play } from 'lucide-react'

// Simple SVG for X (Twitter)
const XIcon = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

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
    <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-12 text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl shadow-[#6E56CF]/10">
              <Bookmark className="text-[#6E56CF] w-10 h-10" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#6E56CF] border-4 border-[#080810]" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-light tracking-[-2px] mb-2">RECALL<span className="text-[#6E56CF]">.</span></h1>
            <p className="text-[#5A5870] text-lg font-light tracking-wide uppercase text-sm">Your second Brain.</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-8 backdrop-blur-xl">
          <p className="text-sm text-[#5A5870] leading-relaxed">
            Sync your digital fragments from X, Instagram, and TikTok. 
            Indexed by AI. Resurfaced by you.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full bg-white text-black font-medium py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all active:scale-[0.98] shadow-lg shadow-white/5"
            >
              Continue with Google
            </button>

            <button
              onClick={handleDemoLogin}
              className="w-full bg-white/5 text-white font-medium py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-[0.98] border border-white/10"
            >
              Explore Demo
            </button>
          </div>

          <div className="pt-6 border-t border-white/5">
            <p className="text-[10px] text-[#3A3850] uppercase tracking-[0.2em] mb-6">Connected Platforms</p>
            <div className="flex justify-center gap-8 text-[#5A5870]">
              <XIcon size={22} className="hover:text-white transition-colors cursor-pointer" />
              <Instagram size={22} className="hover:text-white transition-colors cursor-pointer" />
              <Play size={22} className="hover:text-white transition-colors cursor-pointer fill-current" />
            </div>
          </div>
        </div>

        <p className="text-xs text-[#3A3850] font-light">
          By signing in, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy</span>.
        </p>
      </div>
    </div>
  )
}
