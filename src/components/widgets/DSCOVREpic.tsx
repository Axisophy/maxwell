'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// DSCOVR EPIC WIDGET
// ===========================================
// Latest Earth image from 1.5 million km
// Always shows the most recent natural color image
// Data: NASA DSCOVR EPIC via /api/dscovr (cached server-side)
// ===========================================

interface EPICData {
  image: {
    url: string
    date: string
    caption: string
  }
  timestamp: string
}

export default function DSCOVREpic() {
  const [data, setData] = useState<EPICData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/dscovr')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      
      setData(result)
      setError(null)
    } catch (err) {
      console.error('Error fetching DSCOVR data:', err)
      setError('Unable to fetch image')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Refresh every hour
    const interval = setInterval(fetchData, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="aspect-square bg-[#0a0a12] rounded-lg flex items-center justify-center">
          <div className="text-center text-white/50">
            <div className="text-4xl mb-2">🌍</div>
            <div className="text-sm animate-pulse">Receiving from L1...</div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div className="w-full aspect-square bg-[#0a0a12] rounded-lg flex items-center justify-center">
        <div className="text-red-400 text-sm">{error || 'No data'}</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Image container */}
      <div className="relative aspect-square bg-[#0a0a12] rounded-lg overflow-hidden">
        {/* Loading shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
        
        {/* Earth image */}
        <img
          src={data.image.url}
          alt={data.image.caption}
          className={`w-full h-full object-contain transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Subtle atmospheric glow */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            boxShadow: 'inset 0 0 60px rgba(100, 150, 255, 0.1)',
          }}
        />
      </div>

      {/* Capture time */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e5e5e5]">
        <span className="text-xs text-text-muted">Captured</span>
        <span className="text-xs font-mono text-text-muted">{data.image.date}</span>
      </div>
    </div>
  )
}