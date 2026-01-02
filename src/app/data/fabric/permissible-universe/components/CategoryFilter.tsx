'use client'

import React from 'react'
import { ObjectCategory, CategoryMeta } from '../lib/types'

interface Props {
  categories: Record<ObjectCategory, CategoryMeta>
  visible: Set<ObjectCategory>
  onToggle: (category: ObjectCategory) => void
  onShowAll: () => void
  onHideAll: () => void
}

export function CategoryFilter({
  categories,
  visible,
  onToggle,
  onShowAll,
  onHideAll,
}: Props) {
  const categoryList = Object.values(categories).sort((a, b) => a.order - b.order)
  const allVisible = visible.size === categoryList.length
  const noneVisible = visible.size === 0

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex gap-1 mr-2">
        <button
          onClick={onShowAll}
          className={`px-2 py-1 text-xs rounded transition-colors
            ${allVisible ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'}`}
        >
          All
        </button>
        <button
          onClick={onHideAll}
          className={`px-2 py-1 text-xs rounded transition-colors
            ${noneVisible ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'}`}
        >
          None
        </button>
      </div>

      {categoryList.map((cat) => {
        const isVisible = visible.has(cat.id)
        return (
          <button
            key={cat.id}
            onClick={() => onToggle(cat.id)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-all
              ${isVisible ? 'bg-white/10 text-white' : 'bg-transparent text-white/30 hover:text-white/50'}`}
          >
            <span
              className="w-2 h-2 rounded-full transition-opacity"
              style={{ backgroundColor: cat.color, opacity: isVisible ? 1 : 0.3 }}
            />
            <span className="hidden sm:inline">{cat.shortName}</span>
          </button>
        )
      })}
    </div>
  )
}
