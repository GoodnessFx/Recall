'use client'

const CATEGORIES = ['All', 'Education', 'Inspiration', 'Reference', 'Fun', 'Archive']

interface CategoryFilterProps {
  selected: string
  onSelect: (category: string) => void
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat === 'All' ? '' : cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            (selected === cat || (selected === '' && cat === 'All'))
              ? 'bg-white text-black'
              : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
