'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Info } from 'lucide-react'

/**
 * Aurora Widget
 * 
 * Dashboard widget showing NOAA Ovation Prime aurora forecast.
 * Displays the polar projection of current aurora activity with
 * Kp index and visibility information for key viewing locations.
 * 
 * Data Sources:
 * - Aurora forecast imagery: NOAA SWPC Ovation Prime
 * - Kp index: NOAA SWPC Planetary K-index
 * 
 * Update: Every 30 minutes (imagery), 3 hours (Kp)
 */

interface AuroraWidgetProps {
  className?: string
}

type Hemisphere = 'northern' | 'southern'

interface ViewingLocation {
  name: string
  lat: number
  hemisphere: 'N' | 'S'
}

const VIEWING_LOCATIONS: ViewingLocation[] = [
  { name: 'Tromsø', lat: 69.6, hemisphere: 'N' },
  { name: 'Fairbanks', lat: 64.8, hemisphere: 'N' },
  { name: 'Reykjavik', lat: 64.1, hemisphere: 'N' },
  { name: 'Edinburgh', lat: 55.9, hemisphere: 'N' },
]

export default function AuroraWidget({ className = '' }: AuroraWidgetProps) {
  const [hemisphere, setHemisphere] = useState<Hemisphere>('northern')
  const [kpIndex, setKpIndex] = useState<number | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)

  // Dynamic font sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setBaseFontSize(width / 25)
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Fetch Kp index
  useEffect(() => {
    const fetchKp = async () => {
      try {
        const res = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json')
        const data = await res.json()
        if (data && data.length > 1) {
          const latest = data[data.length - 1]
          setKpIndex(parseFloat(latest[1]))
        }
      } catch (err) {
        console.error('Failed to fetch Kp:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchKp()
    const interval = setInterval(fetchKp, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Draw aurora image on canvas
  const drawAuroraImage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Set canvas size
      const size = Math.min(canvas.parentElement?.clientWidth || 300, 300)
      canvas.width = size
      canvas.height = size

      // Clear and draw
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, size, size)

      // Draw circular clip
      ctx.save()
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2)
      ctx.clip()

      // Draw image
      ctx.drawImage(img, 0, 0, size, size)

      // Add gradient overlay for depth
      const gradient = ctx.createRadialGradient(
        size / 2, size / 2, size / 4,
        size / 2, size / 2, size / 2
      )
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)

      ctx.restore()

      // Draw border ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2)
      ctx.stroke()

      setImageLoaded(true)
      setImageError(false)
    }

    img.onerror = () => {
      setImageError(true)
      setImageLoaded(false)
    }

    const url = `https://services.swpc.noaa.gov/images/aurora-forecast-${hemisphere}-hemisphere.jpg`
    img.src = url
  }, [hemisphere])

  useEffect(() => {
    setImageLoaded(false)
    drawAuroraImage()
  }, [hemisphere, drawAuroraImage])

  // Get Kp-based aurora status
  const getAuroraStatus = () => {
    if (kpIndex === null) return { label: 'Loading...', color: 'text-black/40' }
    if (kpIndex >= 7) return { label: 'Extreme', color: 'text-red-500' }
    if (kpIndex >= 5) return { label: 'Strong', color: 'text-orange-500' }
    if (kpIndex >= 4) return { label: 'Moderate', color: 'text-amber-500' }
    if (kpIndex >= 3) return { label: 'Minor', color: 'text-yellow-500' }
    return { label: 'Quiet', color: 'text-green-500' }
  }

  // Get visibility for location based on Kp
  const getVisibility = (lat: number): { status: string; color: string } => {
    if (kpIndex === null) return { status: '...', color: 'text-black/40' }
    
    // Aurora typically visible at latitude = 67 - (Kp * 2.5)
    const auroralLat = 67 - (kpIndex * 2.5)
    const diff = lat - auroralLat
    
    if (diff >= 5) return { status: 'HIGH', color: 'text-green-600' }
    if (diff >= 0) return { status: 'GOOD', color: 'text-emerald-600' }
    if (diff >= -5) return { status: 'POSS', color: 'text-amber-600' }
    return { status: 'LOW', color: 'text-black/40' }
  }

  const status = getAuroraStatus()

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col ${className}`}
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Widget Frame (Header) */}
      <div 
        className="flex items-center justify-between bg-[#e5e5e5] px-[1em] rounded-t-[0.75em]"
        style={{ height: '3em' }}
      >
        <div className="flex items-center gap-[0.5em]">
          <span className="font-normal text-black" style={{ fontSize: '1.125em' }}>
            Aurora
          </span>
          {kpIndex !== null && (
            <span 
              className={`px-[0.4em] py-[0.15em] font-mono rounded ${status.color} bg-black/5`}
              style={{ fontSize: '0.625em' }}
            >
              Kp {kpIndex.toFixed(1)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-[0.5em]">
          {/* Status indicator */}
          <div className="relative">
            <div 
              className={`rounded-full ${imageLoaded ? 'bg-green-500' : imageError ? 'bg-red-500' : 'bg-amber-500'}`}
              style={{ width: '0.5em', height: '0.5em' }}
            />
            {imageLoaded && (
              <div 
                className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"
                style={{ width: '0.5em', height: '0.5em' }}
              />
            )}
          </div>
          {/* Info button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-black/40 hover:text-black transition-colors"
          >
            <Info style={{ width: '1.25em', height: '1.25em' }} />
          </button>
        </div>
      </div>

      {/* Info Panel (expandable) */}
      {showInfo && (
        <div className="bg-[#e5e5e5] px-[1em] py-[0.75em] border-t border-[#d0d0d0]">
          <p className="text-black/60 leading-relaxed mb-[0.5em]" style={{ fontSize: '0.875em' }}>
            The aurora oval shows where the Northern Lights are currently visible. 
            Higher Kp index means aurora visible at lower latitudes.
          </p>
          <div className="border-t border-[#d0d0d0] pt-[0.5em] mt-[0.5em]">
            <span className="text-black/40 uppercase tracking-wider" style={{ fontSize: '0.625em' }}>
              Source
            </span>
            <p className="text-black" style={{ fontSize: '0.75em' }}>
              NOAA Space Weather Prediction Center • Ovation Prime
            </p>
          </div>
        </div>
      )}

      {/* Widget Content */}
      <div 
        className="flex-1 bg-white p-[1em] rounded-b-[0.75em]"
        style={{ marginTop: '0.5em' }}
      >
        {/* Hemisphere toggle */}
        <div className="flex gap-[0.25em] mb-[0.75em]">
          <button
            onClick={() => setHemisphere('northern')}
            className={`
              flex-1 py-[0.4em] rounded-[0.5em] font-medium transition-all
              ${hemisphere === 'northern' 
                ? 'bg-black text-white' 
                : 'bg-[#e5e5e5] text-black/50 hover:bg-[#d5d5d5]'
              }
            `}
            style={{ fontSize: '0.75em' }}
          >
            Northern
          </button>
          <button
            onClick={() => setHemisphere('southern')}
            className={`
              flex-1 py-[0.4em] rounded-[0.5em] font-medium transition-all
              ${hemisphere === 'southern' 
                ? 'bg-black text-white' 
                : 'bg-[#e5e5e5] text-black/50 hover:bg-[#d5d5d5]'
              }
            `}
            style={{ fontSize: '0.75em' }}
          >
            Southern
          </button>
        </div>

        {/* Aurora Image */}
        <div className="relative aspect-square bg-[#0a0a0f] rounded-[0.5em] overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"
                style={{ width: '2em', height: '2em' }}
              />
            </div>
          )}
          
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
              <span style={{ fontSize: '2em' }}>🌌</span>
              <span style={{ fontSize: '0.75em' }}>No data</span>
            </div>
          )}

          <canvas 
            ref={canvasRef}
            className="w-full h-full"
          />
        </div>

        {/* Viewing Locations */}
        {hemisphere === 'northern' && (
          <div className="mt-[0.75em] grid grid-cols-2 gap-[0.5em]">
            {VIEWING_LOCATIONS.map((loc) => {
              const vis = getVisibility(loc.lat)
              return (
                <div 
                  key={loc.name}
                  className="flex justify-between items-center py-[0.3em] px-[0.5em] bg-[#f5f5f5] rounded"
                >
                  <span className="text-black/60" style={{ fontSize: '0.7em' }}>
                    {loc.name}
                  </span>
                  <span className={`font-mono font-medium ${vis.color}`} style={{ fontSize: '0.6em' }}>
                    {vis.status}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Status footer */}
        <div className="flex justify-between items-center mt-[0.5em]">
          <span className={`font-medium ${status.color}`} style={{ fontSize: '0.75em' }}>
            {status.label}
          </span>
          <span className="text-black/40 font-mono" style={{ fontSize: '0.625em' }}>
            Updates 30 min
          </span>
        </div>
      </div>
    </div>
  )
}
