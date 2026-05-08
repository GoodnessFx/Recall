'use client'
import { motion } from 'framer-motion'

const GUIDES: Record<string, { title: string; steps: string[] }> = {
  twitter: {
    title: 'Export your X bookmarks',
    steps: [
      'Go to x.com → Settings → Your Account',
      'Click "Download an archive of your data"',
      'Wait for email (up to 24 hours, usually instant)',
      'Download ZIP → find "data/bookmarks.js"',
      'Drag that file into the box below',
    ],
  },
  instagram: {
    title: 'Export your Instagram saves',
    steps: [
      'Open Instagram → Profile → Menu (☰)',
      'Settings → Accounts Center → Your information and permissions',
      'Download your information → Select "Saved posts"',
      'Request download (JSON format)',
      'Download and find "saved_posts.json"',
    ],
  },
  tiktok: {
    title: 'Export your TikTok favorites',
    steps: [
      'Open TikTok → Profile → Menu (☰)',
      'Settings and privacy → Account → Download your data',
      'Select "Favorite videos" and request',
      'Download TXT file when ready',
      'Drag the file into the box below',
    ],
  },
}

export function PlatformGuideSheet({
  platform,
  onClose,
  onImported,
}: {
  platform: string
  onClose: () => void
  onImported: () => void
}) {
  const guide = GUIDES[platform]

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F0F1A] rounded-t-3xl p-6 pb-10 border-t border-white/8"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-white/10 mx-auto mb-6" />

        <h2 className="text-xl font-light text-white mb-6">{guide?.title}</h2>

        {/* Steps */}
        <div className="flex flex-col gap-4 mb-8">
          {guide?.steps.map((step, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-6 h-6 rounded-full bg-[#6E56CF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#6E56CF] text-xs font-medium">{i + 1}</span>
              </div>
              <p className="text-[#9390A8] text-sm leading-relaxed">{step}</p>
            </motion.div>
          ))}
        </div>

        {/* Drop zone */}
        <div
          className="border-2 border-dashed border-[#6E56CF]/30 rounded-2xl p-8 text-center mb-4 cursor-pointer hover:border-[#6E56CF]/60 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files[0]
            if (file) {
              // trigger upload
              onImported()
            }
          }}
        >
          <div className="text-[#5A5870] text-sm">Drop your JSON or TXT file here</div>
          <div className="text-[#3A3850] text-xs mt-1">or tap to browse</div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 text-[#5A5870] text-sm hover:text-white transition-colors"
        >
          I'll do this later
        </button>
      </motion.div>
    </>
  )
}
