import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, Search, Import, LogOut, Bookmark } from 'lucide-react'
import { PageTransition } from '@/components/PageTransition'
import { cookies } from 'next/headers'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const cookieStore = await cookies()
  const isDemo = cookieStore.get('recall_demo')?.value === 'true'

  if (!user && !isDemo) {
    redirect('/login')
  }

  const displayEmail = user?.email || 'demo@recall.app'
  const displayLetter = displayEmail[0].toUpperCase()

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col fixed inset-y-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Bookmark className="text-black w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Recall</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-3 flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
              {displayLetter}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayEmail}</p>
            </div>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  )
}
