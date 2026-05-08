'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function SharePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const url = searchParams.get('url')
  const title = searchParams.get('title')

  useEffect(() => {
    if (url) {
      saveBookmark(url)
    } else {
      router.push('/')
    }
  }, [url])

  const saveBookmark = async (targetUrl: string) => {
    try {
      const res = await fetch('/api/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      })
      
      if (res.ok) {
        router.push('/')
      }
    } catch (error) {
      console.error('Failed to save shared bookmark:', error)
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white p-6">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-neutral-500" />
        <p className="text-lg font-medium">Saving to Recall...</p>
        {title && <p className="text-sm text-neutral-400">{title}</p>}
      </div>
    </div>
  )
}
