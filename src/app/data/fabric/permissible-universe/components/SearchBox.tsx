'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { CosmicObject } from '../lib/types'
import { CATEGORIES } from '../lib/constants'

interface Props {
  value: string
  onChange: (value: string) => void
  results: CosmicObject[]
  onResultClick: (id: string) => void
}

export function SearchBox({
  value,
  onChange,
  results,
  onResultClick,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResultClick = (id: string) => {
    onResultClick(id)
    setIsOpen(false)
    onChange('')
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search objects..."
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-8 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
        />
        {value && (
          <button onClick={() => onChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors">
            <X className="w-3 h-3 text-white/40" />
          </button>
        )}
      </div>

      {isOpen && value && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1f] border border-white/10 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
          {results.slice(0, 10).map((obj) => (
            <button
              key={obj.id}
              onClick={() => handleResultClick(obj.id)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors text-left"
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORIES[obj.category].color }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">{obj.name}</div>
                <div className="text-xs text-white/40 truncate">{obj.tagline}</div>
              </div>
            </button>
          ))}
          {results.length > 10 && (
            <div className="px-3 py-2 text-xs text-white/30 text-center">+{results.length - 10} more results</div>
          )}
        </div>
      )}

      {isOpen && value && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1f] border border-white/10 rounded-lg p-3 text-sm text-white/40 text-center">
          No objects found
        </div>
      )}
    </div>
  )
}
