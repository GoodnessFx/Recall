import { Bookmark } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
        <Bookmark className="w-8 h-8 text-neutral-500" />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">No bookmarks found</h3>
      <p className="text-neutral-400 max-w-sm">
        Start by saving a link from your favorite social media platform or import your existing bookmarks.
      </p>
    </div>
  )
}
