'use client'

import { useState, useEffect } from 'react'

interface SOHOViewerProps {
  instrument: 'c2' | 'c3'
  className?: string
}

const instrumentInfo = {
  c2: {
    label: 'LASCO C2',
    description: 'Inner coronagraph (2-6 solar radii)',
    fov: '2-6 R☉',
  },
  c3: {
    label: 'LASCO C3',
    description: 'Outer coronagraph (3.7-30 solar radii)',
    fov: '3.7-30 R☉',
  },
}

export default function SOHOViewer({ instrument, className = '' }: SOHOViewerProps) {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const info = instrumentInfo[instrument]

  useEffect(() => {
    const loadImage = () => {
      setIsLoading(true)
      setError(null)
      
      // SOHO LASCO image URL pattern
      const url = `https://soho.nascom.nasa.gov/data/realtime/${instrument}/1024/latest.jpg?t=${Date.now()}`
      setImageUrl(url)
      setLastUpdate(new Date())
    }

    loadImage()

    // Refresh every 15 minutes
    const interval = setInterval(loadImage, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [instrument])

  const handleImageLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setError('Coronagraph image unavailable')
  }

  return (
    <div className={`bg-[#0f0f14] rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-white/40">LIVE</span>
          </div>
          <h3 className="text-sm font-medium text-white">{info.label}</h3>
        </div>
        <span className="text-xs text-white/40 font-mono">{info.fov}</span>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              <span className="text-xs text-white/40 font-mono">Loading...</span>
            </div>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="text-white/20 text-4xl mb-2">◎</div>
              <p className="text-xs text-white/40">{error}</p>
            </div>
          </div>
        ) : (
          imageUrl && (
            <img
              src={imageUrl}
              alt={info.label}
              className="w-full h-full object-contain"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )
        )}

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <p className="text-xs text-white/60">{info.description}</p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-white/10 bg-black/20 flex items-center justify-between">
        <div className="text-xs text-white/40">
          SOHO • L1 Lagrange Point
        </div>
        {lastUpdate && (
          <span className="text-xs text-white/30 font-mono">
            {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  )
}
