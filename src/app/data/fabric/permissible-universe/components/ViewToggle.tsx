'use client'

import React from 'react'
import { Map, ListTree } from 'lucide-react'
import { ViewMode } from '../lib/types'

interface Props {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
}

export function ViewToggle({ mode, onChange }: Props) {
  return (
    <div className="flex bg-white/5 rounded-lg p-1">
      <button
        onClick={() => onChange('map')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
          ${mode === 'map' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
      >
        <Map className="w-4 h-4" />
        <span>The Map</span>
      </button>
      <button
        onClick={() => onChange('limits')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
          ${mode === 'limits' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
      >
        <ListTree className="w-4 h-4" />
        <span>The Limits</span>
      </button>
    </div>
  )
}
