'use client'

import { useState, useEffect } from 'react'

// ===========================================
// SOHO CORONAGRAPH WIDGET
// ===========================================
// Shows live coronagraph imagery from SOHO LASCO
// Data: NASA/ESA SOHO (direct image URLs)
// Design: Square format showing full coronagraph
// ===========================================

const CORONAGRAPH_VIEWS = {
  'C2': { label: 'C2', description: 'Inner corona', range: '2-6 solar radii' },
  'C3': { label: 'C3', description: 'Outer corona', range: '3.7-30 solar radii' },
} as const

type CoronagraphKey = keyof typeof CORONAGRAPH_VIEWS

interface SOHOCoronagraphProps {
  defaultView?: CoronagraphKey
}

export default function SOHOCoronagraph({ 
  defaultView = 'C2'
}: SOHOCoronagraphProps) {
  const [view, setView] = useState<CoronagraphKey>(defaultView)
  const [isLoading, setIsLoading] = useState(true)
  const [imageKey, setImageKey] = useState(0)

  // SOHO LASCO direct URLs
  const coronagraphUrls = {
    C2: 'https://soho.nascom.nasa.gov/data/realtime/c2/512/latest.jpg',
    C3: 'https://soho.nascom.nasa.gov/data/realtime/c3/512/latest.jpg',
  }

  const imageUrl = coronagraphUrls[view]
  const currentView = CORONAGRAPH_VIEWS[view]

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setImageKey(prev => prev + 1)
      setIsLoading(true)
    }, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-[1em]">
      {/* Image container - square format, full coronagraph visible */}
      <div className="relative aspect-square bg-black rounded-[0.5em] overflow-hidden">
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-white/50 text-[0.875em] font-mono">Loading corona...</div>
          </div>
        )}

        {/* Coronagraph image - object-contain ensures full view */}
        <img
          key={`${view}-${imageKey}`}
          src={`${imageUrl}?t=${imageKey}`}
          alt={`SOHO LASCO ${view} Coronagraph`}
          className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        {/* LASCO label */}
        <div className="absolute top-[0.5em] left-[0.5em] bg-black/70 backdrop-blur-sm rounded-[0.25em] px-[0.5em] py-[0.25em]">
          <span className="text-[0.6875em] font-mono text-white/80">LASCO {view}</span>
        </div>

        {/* Sun size indicator */}
        <div className="absolute bottom-[0.5em] left-[0.5em] flex items-center gap-[0.375em] bg-black/70 backdrop-blur-sm rounded-[0.25em] px-[0.5em] py-[0.25em]">
          <div className="w-[0.5em] h-[0.5em] rounded-full bg-white/70 border border-white/30" />
          <span className="text-[0.5625em] font-mono text-white/60">Sun size</span>
        </div>

        {/* Live indicator */}
        <div className="absolute top-[0.5em] right-[0.5em] flex items-center gap-[0.375em] bg-black/70 backdrop-blur-sm rounded-[0.25em] px-[0.5em] py-[0.25em]">
          <span className="relative flex h-[0.5em] w-[0.5em]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
          </span>
          <span className="text-[0.5625em] font-mono text-white/60">LIVE</span>
        </div>
      </div>

      {/* View selector */}
      <div className="mt-[0.75em]">
        <div className="flex bg-[#e5e5e5] rounded-[0.5em] p-[0.25em]">
          {(Object.keys(CORONAGRAPH_VIEWS) as CoronagraphKey[]).map((key) => (
            <button
              key={key}
              onClick={() => { setView(key); setIsLoading(true) }}
              className={`
                flex-1 px-[0.75em] py-[0.375em] text-[0.75em] font-medium rounded-[0.375em] transition-colors
                ${view === key 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-black/50 hover:text-black'
                }
              `}
            >
              {key}
              <span className="ml-[0.5em] font-normal opacity-60">
                {CORONAGRAPH_VIEWS[key].description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Range info */}
      <div className="mt-[0.5em] text-center">
        <p className="text-[0.6875em] text-black/50">
          Viewing {currentView.range} from the Sun
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5] my-[0.75em]" />

      {/* Info text */}
      <div className="text-[0.6875em] text-black/40 text-center">
        Corona visible via artificial eclipse • SOHO at L1
      </div>
    </div>
  )
}