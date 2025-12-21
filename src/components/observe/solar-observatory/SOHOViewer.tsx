'use client'

import { useState, useEffect } from 'react'

interface SOHOViewerProps {
  instrument?: 'c2' | 'c3'
  showSelector?: boolean
}

const CORONAGRAPHS = {
  c2: {
    label: 'LASCO C2',
    description: 'Inner corona',
    range: '2-6 solar radii',
    url: 'https://soho.nascom.nasa.gov/data/realtime/c2/512/latest.jpg',
  },
  c3: {
    label: 'LASCO C3',
    description: 'Outer corona',
    range: '3.7-30 solar radii',
    url: 'https://soho.nascom.nasa.gov/data/realtime/c3/512/latest.jpg',
  },
} as const

type CoronagraphKey = keyof typeof CORONAGRAPHS

export default function SOHOViewer({
  instrument = 'c2',
  showSelector = false,
}: SOHOViewerProps) {
  const [view, setView] = useState<CoronagraphKey>(instrument)
  const [isLoading, setIsLoading] = useState(true)
  const [imageKey, setImageKey] = useState(0)

  const currentView = CORONAGRAPHS[view]

  useEffect(() => {
    const interval = setInterval(() => {
      setImageKey(prev => prev + 1)
      setIsLoading(true)
    }, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#1a1a1e] rounded-xl overflow-hidden h-full flex flex-col">
      {/* Image container */}
      <div className="relative aspect-square bg-black flex-shrink-0">
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-white/50 text-sm font-mono">Loading corona...</div>
          </div>
        )}

        {/* Coronagraph image */}
        <img
          key={`${view}-${imageKey}`}
          src={`${currentView.url}?t=${imageKey}`}
          alt={`SOHO ${currentView.label}`}
          className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        {/* LASCO label */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-xs font-mono text-white/80">{currentView.label}</span>
        </div>

        {/* Sun size indicator */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
          <div className="w-2 h-2 rounded-full bg-white/70 border border-white/30" />
          <span className="text-[10px] font-mono text-white/60">Sun size</span>
        </div>

        {/* Live indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
          </span>
          <span className="text-[10px] font-mono text-white/60">LIVE</span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        {showSelector && (
          <div className="flex bg-white/5 rounded-lg p-1 mb-3">
            {(Object.keys(CORONAGRAPHS) as CoronagraphKey[]).map((key) => (
              <button
                key={key}
                onClick={() => { setView(key); setIsLoading(true) }}
                className={`
                  flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors
                  ${view === key
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/60'
                  }
                `}
              >
                {key.toUpperCase()}
                <span className="ml-1 opacity-60">{CORONAGRAPHS[key].description}</span>
              </button>
            ))}
          </div>
        )}

        {/* Range info */}
        <div className="text-center">
          <p className="text-xs text-white/40">
            Viewing {currentView.range} from the Sun
          </p>
          <p className="text-[10px] text-white/20 mt-1">
            SOHO at L1 point
          </p>
        </div>
      </div>
    </div>
  )
}
