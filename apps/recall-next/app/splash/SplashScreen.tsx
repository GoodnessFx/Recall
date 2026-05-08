'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'logo' | 'tagline' | 'exit'>('logo')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('tagline'), 800)
    const t2 = setTimeout(() => setPhase('exit'), 2200)
    const t3 = setTimeout(() => onComplete(), 2700)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080810]"
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo wordmark assembles from fragments */}
          <div className="relative flex items-center gap-1 overflow-hidden">
            {'RECALL.'.split('').map((char, i) => (
              <motion.span
                key={i}
                className="text-6xl font-light tracking-[-2px] text-white select-none"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
            {/* Accent dot */}
            <motion.div
              className="w-2 h-2 rounded-full bg-[#6E56CF] mb-1 ml-0.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            />
          </div>

          {/* Tagline */}
          <AnimatePresence>
            {phase === 'tagline' && (
              <motion.p
                className="mt-4 text-sm text-[#5A5870] tracking-widest uppercase"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                Everything you saved. Finally found.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Subtle scanning line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-[#6E56CF] opacity-20"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.2, ease: 'linear' }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
