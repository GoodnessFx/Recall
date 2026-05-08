'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { PlatformGuideSheet } from './PlatformGuideSheet'

const PLATFORMS = [
  {
    id: 'twitter',
    name: 'X / Twitter',
    color: '#E7E9EA',
    bg: 'rgba(231,233,234,0.08)',
    count: '~400M users',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    bg: 'rgba(225,48,108,0.08)',
    count: '~2B users',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: '#FF0050',
    bg: 'rgba(255,0,80,0.08)',
    count: '~1B users',
  },
]

export default function OnboardingFlow() {
  const [selected, setSelected] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [doneCount, setDoneCount] = useState(0)

  const handlePlatformTap = (platformId: string) => {
    setSelected(platformId)
    setShowGuide(true)
  }

  return (
    <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center px-6">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-light text-white tracking-tight mb-2">
            Let's bring your
            <br />
            <span className="text-[#6E56CF]">bookmarks home.</span>
          </h1>
          <p className="text-[#9390A8] text-sm leading-relaxed">
            Tap each platform below. We'll show you exactly how to get your saved posts in 30 seconds.
          </p>
          {doneCount > 0 && (
            <motion.div
              className="mt-3 text-xs text-[#10B981] flex items-center gap-1.5"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="w-4 h-4 rounded-full bg-[#10B981]/20 flex items-center justify-center">✓</span>
              {doneCount} platform{doneCount > 1 ? 's' : ''} imported
            </motion.div>
          )}
        </div>

        {/* Platform buttons */}
        <div className="flex flex-col gap-3 mb-8">
          {PLATFORMS.map((platform, i) => (
            <motion.button
              key={platform.id}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left"
              style={{
                background: platform.bg,
                borderColor: `${platform.color}22`,
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, borderColor: `${platform.color}44` }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePlatformTap(platform.id)}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium"
                style={{ background: `${platform.color}18`, color: platform.color }}
              >
                {platform.name[0]}
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{platform.name}</div>
                <div className="text-[#5A5870] text-xs">{platform.count}</div>
              </div>
              <div className="text-[#5A5870] text-xs">Get JSON →</div>
            </motion.button>
          ))}
        </div>

        {/* Skip option */}
        <motion.button
          className="w-full text-center text-[#5A5870] text-sm py-3 hover:text-[#9390A8] transition-colors"
          onClick={() => window.location.href = '/'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          I'll add bookmarks manually →
        </motion.button>
      </motion.div>

      {/* Guide sheet — slides up from bottom */}
      <AnimatePresence>
        {showGuide && selected && (
          <PlatformGuideSheet
            platform={selected}
            onClose={() => setShowGuide(false)}
            onImported={() => {
              setDoneCount(d => d + 1)
              setShowGuide(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
