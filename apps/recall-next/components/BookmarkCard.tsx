'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface Bookmark {
  id: string
  url: string
  title: string
  description: string
  thumbnail_url: string
  platform: string
  category: string
  summary: string
  keywords: string[]
  created_at: string
}

const CATEGORY_CONFIG = {
  Education: { color: '#4A9EFF', label: 'Learn' },
  Inspiration: { color: '#A855F7', label: 'Feel' },
  Archive: { color: '#64748B', label: 'Later' },
  Reference: { color: '#10B981', label: 'Use' },
  Fun: { color: '#F59E0B', label: 'Play' },
}

const PLATFORM_ICONS: Record<string, string> = {
  twitter: '𝕏',
  instagram: '◉',
  tiktok: '♪',
  youtube: '▶',
  linkedin: 'in',
  reddit: '●',
  other: '↗',
}

export function BookmarkCard({ bookmark, onDelete }: { bookmark: Bookmark; onDelete?: (id: string) => void }) {
  const [isHovered, setIsHovered] = useState(false)
  const cat = CATEGORY_CONFIG[bookmark.category as keyof typeof CATEGORY_CONFIG]

  return (
    <motion.div
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: '#0F0F1A',
        border: `1px solid rgba(255,255,255,${isHovered ? '0.1' : '0.06'})`,
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => window.open(bookmark.url, '_blank', 'noopener')}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#161626]">
        {bookmark.thumbnail_url ? (
          <img
            src={bookmark.thumbnail_url}
            alt={bookmark.title || 'Bookmark'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
            <span className="text-4xl">{PLATFORM_ICONS[bookmark.platform || 'other']}</span>
          </div>
        )}
        {/* Platform badge — top right of thumbnail */}
        <div
          className="absolute top-2 right-2 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <span className="text-white">{PLATFORM_ICONS[bookmark.platform || 'other']}</span>
        </div>
        {/* Gradient overlay at bottom of thumbnail */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0F0F1A] to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category + time */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              color: cat?.color || '#64748B',
              background: `${cat?.color || '#64748B'}18`,
            }}
          >
            {cat?.label || bookmark.category || 'Archive'}
          </span>
          <span className="text-[10px] text-[#3A3850]">
            {bookmark.created_at ? formatDistanceToNow(new Date(bookmark.created_at)) + ' ago' : ''}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[#F2F0FF] text-sm font-medium leading-snug mb-1.5 line-clamp-2">
          {bookmark.title || bookmark.url}
        </h3>

        {/* AI Summary */}
        {bookmark.summary && (
          <p className="text-[#5A5870] text-xs leading-relaxed line-clamp-2">
            {bookmark.summary}
          </p>
        )}

        {/* Keywords */}
        {bookmark.keywords && bookmark.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {bookmark.keywords.slice(0, 3).map((kw: string) => (
              <span key={kw} className="text-[10px] text-[#3A3850] bg-white/4 rounded-md px-1.5 py-0.5">
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hover accent line at bottom — slides in */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: cat?.color || '#6E56CF' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  )
}
