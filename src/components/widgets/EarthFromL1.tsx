'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// EARTH FROM L1 WIDGET
// ===========================================
// Latest Earth image from DSCOVR at L1 (1.5 million km)
// Always shows the most recent natural color image
// Data: NASA DSCOVR EPIC via /api/dscovr (cached server-side)
// Note: Images are typically 12-36 hours old due to transmission delays
// ===========================================

interface EPICData {
  image: {
    url: string
    date: string
    caption: string
  }
  timestamp: string
}

export default function EarthFromL1() {
  const [data, setData] = useState<EPICData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)

  // Responsive scaling
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25)
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

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
    // Refresh every hour (images update slowly anyway)
    const interval = setInterval(fetchData, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Calculate image age
  const getImageAge = () => {
    if (!data?.image?.date) return null

    try {
      const imageDate = new Date(data.image.date)
      const now = new Date()
      const diffMs = now.getTime() - imageDate.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

      if (diffHours < 1) return '<1h ago'
      if (diffHours < 24) return `${diffHours}h ago`
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays}d ago`
    } catch {
      return null
    }
  }

  // Format capture date
  const formatCaptureDate = () => {
    if (!data?.image?.date) return '--'

    try {
      const date = new Date(data.image.date)
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      }) + ' UTC'
    } catch {
      return data.image.date
    }
  }

  const imageAge = getImageAge()

  // Loading state
  if (isLoading) {
    return (
      <div
        ref={containerRef}
        className="bg-[#1a1a1e] p-[1em] h-full flex items-center justify-center"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-center">
          <div className="w-[2em] h-[2em] border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-[0.5em]" />
          <div className="text-[0.75em] text-white/40">Receiving from L1...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div
        ref={containerRef}
        className="bg-[#1a1a1e] p-[1em] h-full flex items-center justify-center"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-[0.875em] text-red-400">{error || 'No data available'}</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="bg-[#1a1a1e] p-[1em] h-full"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.75em]">
        <div className="flex items-center gap-[0.5em]">
          <span className="relative flex h-[0.5em] w-[0.5em]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
          </span>
          <span className="text-[0.875em] font-medium text-white">Earth from L1</span>
        </div>
        <span className="text-[0.6875em] text-white/40">NASA · DSCOVR</span>
      </div>

      {/* Earth image */}
      <div className="bg-white/5 rounded-[0.5em] p-[0.5em] mb-[0.75em]">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0 rounded-[0.375em] overflow-hidden bg-[#0a0a12] flex items-center justify-center">
            {/* Loading spinner */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-[2em] h-[2em] border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
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
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 60px rgba(100, 150, 255, 0.1)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-[0.5em] mb-[0.75em]">
        <div className="bg-white/5 rounded-[0.375em] p-[0.625em]">
          <div className="text-[0.5625em] uppercase tracking-wider text-white/40 mb-[0.25em]">
            Captured
          </div>
          <div className="text-[0.75em] font-mono text-white">
            {formatCaptureDate()}
          </div>
        </div>
        <div className="bg-white/5 rounded-[0.375em] p-[0.625em]">
          <div className="text-[0.5625em] uppercase tracking-wider text-white/40 mb-[0.25em]">
            Image Age
          </div>
          <div className="text-[0.75em] font-mono text-white/60">
            {imageAge || '--'}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] border-t border-white/10">
        <span className="text-[0.6875em] text-white/40">
          EPIC Camera · Full sunlit disc
        </span>
        <span className="text-[0.6875em] font-mono text-white/40">
          1.5M km
        </span>
      </div>
    </div>
  )
}
