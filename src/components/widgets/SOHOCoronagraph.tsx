'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// ===========================================
// SOHO CORONAGRAPH WIDGET
// ===========================================
// Shows the sun's corona via artificial eclipse
// Data: NASA SOHO LASCO (direct image URLs)
// ===========================================

type CoronagraphView = 'C2' | 'C3'

const CORONAGRAPH_INFO = {
  C2: {
    name: 'Inner Corona',
    range: '2-6 solar radii',
    url: 'https://soho.nascom.nasa.gov/data/realtime/c2/512/latest.jpg',
  },
  C3: {
    name: 'Outer Corona', 
    range: '3.7-30 solar radii',
    url: 'https://soho.nascom.nasa.gov/data/realtime/c3/512/latest.jpg',
  },
}

export default function SOHOCoronagraph() {
  const [view, setView] = useState<CoronagraphView>('C2')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Reset loading state when view changes
  useEffect(() => {
    setIsLoading(true)
    setError(false)
  }, [view])

  // Refresh timestamp periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 5 * 60 * 1000) // Check every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const currentInfo = CORONAGRAPH_INFO[view]
  
  // Add cache-busting timestamp (images update ~every 30 min)
  const imageUrl = `${currentInfo.url}?t=${Math.floor(Date.now() / (30 * 60 * 1000))}`

  return (
    <div className="p-[1em]">
      {/* View toggle */}
      <div className="flex justify-center mb-[0.75em]">
        <div className="inline-flex bg-[#e5e5e5] rounded-[0.5em] p-[0.25em]">
          {(['C2', 'C3'] as CoronagraphView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`
                px-[0.75em] py-[0.375em] rounded-[0.375em] text-[0.75em] font-medium
                transition-all
                ${view === v 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-black/50 hover:text-black'
                }
              `}
            >
              {v}
              <span className="hidden sm:inline ml-1 font-normal opacity-60">
                {v === 'C2' ? 'Inner' : 'Outer'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Image container */}
      <div className="relative aspect-square bg-black rounded-[0.5em] overflow-hidden">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-white/50 text-[0.875em]">Loading corona...</div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-center">
              <div className="text-white/50 text-[0.875em]">Image unavailable</div>
              <button 
                onClick={() => { setError(false); setIsLoading(true); setLastUpdate(new Date()) }}
                className="mt-2 text-[0.75em] text-white/30 hover:text-white/60"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Coronagraph image */}
        <img
          src={imageUrl}
          alt={`SOHO LASCO ${view} Coronagraph`}
          className={`w-full h-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setError(true) }}
        />

        {/* Overlay labels */}
        {!isLoading && !error && (
          <>
            {/* LASCO label */}
            <div className="absolute top-[0.5em] left-[0.5em] text-[0.6em] text-white/60 font-mono">
              LASCO {view}
            </div>
            
            {/* Sun size indicator */}
            <div className="absolute bottom-[0.5em] left-[0.5em] flex items-center gap-[0.25em]">
              <div className="w-[0.5em] h-[0.5em] rounded-full bg-white/60" />
              <span className="text-[0.55em] text-white/60 font-mono">Sun size</span>
            </div>
          </>
        )}
      </div>

      {/* Info section */}
      <div className="mt-[0.75em] text-center">
        <div className="text-[0.7em] text-black/50 uppercase tracking-wider">
          {currentInfo.name}
        </div>
        <div className="text-[0.8em] text-black/70 mt-[0.125em]">
          Viewing {currentInfo.range} from the Sun
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5] my-[0.75em]" />

      {/* Description */}
      <div className="text-[0.75em] text-black/60 leading-relaxed">
        <span className="font-medium text-black/80">Artificial eclipse:</span> The coronagraph blocks the Sun's disk to reveal the faint corona. Watch for bright ejections—coronal mass ejections can trigger auroras on Earth.
      </div>

      {/* Update time */}
      <div className="mt-[0.5em] text-[0.625em] text-black/30 text-center">
        Images update approximately every 30 minutes
      </div>
    </div>
  )
}
