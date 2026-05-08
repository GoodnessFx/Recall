'use client'

import { useState } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: (count: number) => void
}

export default function ImportModal({ isOpen, onClose, onImportSuccess }: ImportModalProps) {
  const [platform, setPlatform] = useState('urls')
  const [rawJson, setRawJson] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleImport = async () => {
    setIsImporting(true)
    setError('')
    try {
      let parsed = platform === 'urls' ? rawJson.split('\n').filter(l => l.trim()) : JSON.parse(rawJson)
      
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, raw: parsed }),
      })
      
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      onImportSuccess(data.imported)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to import. Check your JSON format.')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Import Bookmarks</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Select Platform</label>
            <div className="flex flex-wrap gap-2">
              {['urls', 'twitter', 'instagram', 'reddit'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                    platform === p ? 'bg-white text-black' : 'bg-white/5 text-neutral-400 hover:bg-white/10'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
            <p className="text-xs text-neutral-400 leading-relaxed">
              {platform === 'instagram' && "Upload your 'saved_posts.json' from Instagram export. We'll extract all your saved links."}
              {platform === 'twitter' && "Upload your 'bookmarks.js' or 'tweets.js' from X archive."}
              {platform === 'reddit' && "Upload your 'saved.json' from Reddit."}
              {platform === 'urls' && "Paste a list of URLs, one per line."}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              {platform === 'urls' ? 'Paste URLs (one per line)' : 'Paste Raw JSON Export'}
            </label>
            <textarea
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              className="w-full h-48 bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              placeholder={platform === 'urls' ? 'https://example.com\nhttps://another.com' : '{ "bookmarks": [...] }'}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleImport}
            disabled={isImporting || !rawJson.trim()}
            className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {isImporting ? 'Importing...' : 'Start Import'}
          </button>
        </div>
      </div>
    </div>
  )
}
