'use client'

import { AnimalCategory, categoryColors, categoryLabels } from '@/lib/wildlife/types'

interface FilterBarProps {
  filter: AnimalCategory | 'all'
  onFilterChange: (filter: AnimalCategory | 'all') => void
  counts: Record<string, number>
  searchQuery: string
  onSearchChange: (query: string) => void
}

const categories: Array<AnimalCategory | 'all'> = ['all', 'shark', 'whale', 'turtle', 'bird', 'other']

export default function FilterBar({
  filter,
  onFilterChange,
  counts,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => {
        const count = cat === 'all' ? counts.all : counts[cat] || 0
        const isActive = filter === cat

        return (
          <button
            key={cat}
            onClick={() => onFilterChange(cat)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all
              ${isActive
                ? 'bg-black text-white'
                : 'bg-[#e5e5e5] text-black hover:bg-[#d5d5d5]'
              }
            `}
          >
            {cat !== 'all' && (
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: categoryColors[cat as AnimalCategory] }}
              />
            )}
            <span>{cat === 'all' ? 'All' : categoryLabels[cat as AnimalCategory]}</span>
            <span className={isActive ? 'text-white/60' : 'text-black/40'}>
              ({count})
            </span>
          </button>
        )
      })}

      {/* Search */}
      <div className="ml-auto flex-shrink-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name..."
          className="px-4 py-2 rounded-full bg-[#e5e5e5] text-sm w-48 focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>
    </div>
  )
}
