'use client'

import { useState, useEffect } from 'react'
import CategoryFilter from '@/components/CategoryFilter'
import { BookmarkCard } from '@/components/BookmarkCard'
import EmptyState from '@/components/EmptyState'
import ImportModal from '@/components/ImportModal'
import { RecallAI } from '@/components/RecallAI'
import SplashScreen from '@/app/splash/SplashScreen'
import OnboardingFlow from '@/app/onboard/OnboardingFlow'
import { BookmarkSkeleton } from '@/components/BookmarkSkeleton'
import { Plus, MessageSquare, LayoutGrid, Search as SearchIcon, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
}

export default function HomePage() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isRecallAIOpen, setIsRecallAIOpen] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [hasBookmarks, setHasBookmarks] = useState<boolean | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  const fetchBookmarks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (category) params.append('category', category)
      
      const res = await fetch(`/api/search?${params.toString()}`)
      const data = await res.json()
      setBookmarks(data.bookmarks || [])
      
      if (hasBookmarks === null) {
        setHasBookmarks(data.bookmarks.length > 0)
        if (data.bookmarks.length === 0) {
          setShowOnboarding(true)
        }
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookmarks()
  }, [query, category])

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  if (showOnboarding && !hasBookmarks) {
    return <OnboardingFlow />
  }

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 relative">
      <header className="mb-12 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="text-[#6E56CF] w-6 h-6" />
            <h1 className="text-2xl font-light tracking-tight text-white">My <span className="text-[#6E56CF]">Recall</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsRecallAIOpen(true)}
              className="bg-white/5 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-white/10 border border-white/10 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-[#6E56CF]" />
              Ask AI
            </button>
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="bg-[#6E56CF] text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-[#7C64DC] transition-all shadow-lg shadow-[#6E56CF]/20"
            >
              <Plus className="w-5 h-5" />
              Save Link
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <motion.div 
              className="relative flex-1"
              layout
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div 
                className="flex items-center gap-2 rounded-full border border-white/10 overflow-hidden px-4 py-2"
                animate={{ 
                  width: searchOpen ? '100%' : '200px',
                  background: searchOpen ? 'rgba(15,15,26,1)' : 'rgba(255,255,255,0.04)',
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <SearchIcon size={18} className="text-[#5A5870] flex-shrink-0" />
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => !query && setSearchOpen(false)}
                  placeholder="Search bookmarks..."
                  className="bg-transparent border-none outline-none text-sm text-white placeholder-[#3A3850] w-full"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-[#5A5870] hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </motion.div>
            </motion.div>
          </div>
          <CategoryFilter selected={category} onSelect={setCategory} />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <BookmarkSkeleton key={i} />
          ))}
        </div>
      ) : bookmarks.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {bookmarks.map((bookmark: any) => (
            <motion.div key={bookmark.id} variants={cardVariants}>
              <BookmarkCard 
                bookmark={bookmark} 
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState />
      )}

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImportSuccess={() => fetchBookmarks()}
      />

      <AnimatePresence>
        {isRecallAIOpen && (
          <RecallAI onClose={() => setIsRecallAIOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
