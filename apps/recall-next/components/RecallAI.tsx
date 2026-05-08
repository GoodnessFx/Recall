'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { BookmarkCard } from './BookmarkCard'

const OPENING_LINES = [
  "Let me help you remember. What's on your mind today?",
  "What are you thinking about? I'll find what you saved.",
  "What sector do you need ideas from?",
  "You've saved a lot. Let's find the right piece.",
]

type Message = { role: 'ai' | 'user'; content: string; bookmarks?: any[] }

export function RecallAI({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: OPENING_LINES[Math.floor(Math.random() * OPENING_LINES.length)],
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')

    const newMessages = [...messages, { role: 'user' as const, content: userMessage }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/recall-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()

      setMessages(prev => [
        ...prev,
        { role: 'ai', content: data.message, bookmarks: data.bookmarks },
      ])
    } catch (error) {
      console.error('Recall AI failed:', error)
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: "I'm having trouble connecting to my memories right now. Let's try again in a moment." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[#080810]/95 backdrop-blur-md flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6E56CF] animate-pulse" />
          <span className="text-white text-sm font-medium">Recall AI</span>
        </div>
        <button onClick={onClose} className="text-[#5A5870] hover:text-white transition-colors text-sm">
          close ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[80%]">
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#6E56CF] text-white rounded-br-sm'
                      : 'bg-[#0F0F1A] text-[#F2F0FF] rounded-bl-sm border border-white/6'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Inline bookmark results */}
                {msg.bookmarks && msg.bookmarks.length > 0 && (
                  <motion.div
                    className="mt-3 grid grid-cols-1 gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {msg.bookmarks.slice(0, 3).map((bm: any) => (
                      <BookmarkCard key={bm.id} bookmark={bm} />
                    ))}
                    {msg.bookmarks.length > 3 && (
                      <button className="text-[#6E56CF] text-xs py-2 hover:text-[#7C64DC] transition-colors">
                        View all {msg.bookmarks.length} results →
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-1.5 px-4 py-3 bg-[#0F0F1A] rounded-2xl rounded-bl-sm w-fit border border-white/6"
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#6E56CF]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-8 pt-3 border-t border-white/5">
        <div className="flex gap-3 items-end bg-[#0F0F1A] rounded-2xl border border-white/8 p-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Tell me what you're thinking about..."
            className="flex-1 bg-transparent text-[#F2F0FF] text-sm resize-none outline-none placeholder-[#3A3850] max-h-24"
            rows={1}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl bg-[#6E56CF] flex items-center justify-center text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
          >
            ↑
          </button>
        </div>
      </div>
    </motion.div>
  )
}
