'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// MARS ROVER WIDGET
// ===========================================
// Latest images from Perseverance and Curiosity rovers
// Data: NASA Mars Rover Photos API via /api/mars-rover
// Clean design with minimal Mars accent
// ===========================================

interface RoverPhoto {
  id: number
  sol: number
  camera: string
  cameraFull: string
  img_src: string
  earth_date: string
  rover: string
}

interface RoverManifest {
  name: string
  landing_date: string
  launch_date: string
  status: string
  max_sol: number
  max_date: string
  total_photos: number
}

type RoverName = 'perseverance' | 'curiosity'

const ROVER_INFO: Record<RoverName, { landing: string; site: string }> = {
  perseverance: { landing: '2021-02-18', site: 'Jezero Crater' },
  curiosity: { landing: '2012-08-06', site: 'Gale Crater' },
}

// Mars rust accent - used sparingly
const MARS_ACCENT = '#c75b27'

export default function MarsRover() {
  const [activeRover, setActiveRover] = useState<RoverName>('perseverance')
  const [photos, setPhotos] = useState<RoverPhoto[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [manifest, setManifest] = useState<RoverManifest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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

  const fetchRoverData = useCallback(async () => {
    setIsLoading(true)
    setImageLoaded(false)

    try {
      const response = await fetch(`/api/mars-rover?rover=${activeRover}`)
      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()

      if (data.photos && data.photos.length > 0) {
        setPhotos(data.photos)
        setCurrentIndex(0)
      }

      if (data.manifest) {
        setManifest(data.manifest)
      }
    } catch (err) {
      console.error('Error fetching rover data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [activeRover])

  useEffect(() => {
    fetchRoverData()
    // Refresh every hour
    const interval = setInterval(fetchRoverData, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchRoverData])

  // Calculate active mission duration in sols
  const getMissionDuration = () => {
    const info = ROVER_INFO[activeRover]
    const landing = new Date(info.landing)
    const now = new Date()
    const earthDays = Math.floor((now.getTime() - landing.getTime()) / (1000 * 60 * 60 * 24))
    // Mars sol is ~24h 37m, so roughly earthDays * 0.973
    return Math.floor(earthDays * 0.973)
  }

  const goToNext = () => {
    if (photos.length === 0) return
    setImageLoaded(false)
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const goToPrev = () => {
    if (photos.length === 0) return
    setImageLoaded(false)
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const currentPhoto = photos[currentIndex]
  const missionSols = getMissionDuration()

  // Loading state
  if (isLoading && photos.length === 0) {
    return (
      <div
        ref={containerRef}
        className="bg-[#1a1a1e] p-[1em] h-full flex items-center justify-center"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-center">
          <div className="w-[2em] h-[2em] border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-[0.5em]" />
          <div className="text-[0.75em] text-white/40">Receiving from Mars...</div>
        </div>
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
          <span className="text-[0.875em] font-medium text-white">Mars Rover</span>
        </div>
        <span className="text-[0.6875em] font-mono text-white/40">
          Sol {currentPhoto?.sol || manifest?.max_sol || '--'}
        </span>
      </div>

      {/* Rover toggle */}
      <div className="flex bg-white/10 rounded-[0.375em] p-[0.125em] mb-[0.75em]">
        {(['perseverance', 'curiosity'] as RoverName[]).map((rover) => (
          <button
            key={rover}
            onClick={() => setActiveRover(rover)}
            className={`flex-1 px-[0.625em] py-[0.375em] text-[0.75em] font-medium rounded-[0.25em] transition-colors capitalize ${
              activeRover === rover
                ? 'text-white'
                : 'text-white/50 hover:text-white/70'
            }`}
            style={{
              backgroundColor: activeRover === rover ? MARS_ACCENT : 'transparent',
            }}
          >
            {rover}
          </button>
        ))}
      </div>

      {/* Image container */}
      <div className="bg-white/5 rounded-[0.5em] p-[0.5em] mb-[0.75em]">
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          <div className="absolute inset-0 rounded-[0.375em] overflow-hidden bg-black flex items-center justify-center">
            {/* Loading spinner */}
            {!imageLoaded && currentPhoto && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-[2em] h-[2em] border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            )}

            {/* Mars image */}
            {currentPhoto && (
              <img
                src={currentPhoto.img_src}
                alt={`Mars - ${currentPhoto.camera}`}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            )}

            {/* Camera badge - subtle corner */}
            {currentPhoto && (
              <div className="absolute top-[0.5em] right-[0.5em] px-[0.5em] py-[0.25em] rounded-[0.25em] bg-black/60 text-[0.5625em] font-mono text-white/70">
                {currentPhoto.camera}
              </div>
            )}

            {/* No photos state */}
            {!currentPhoto && !isLoading && (
              <div className="text-[0.75em] text-white/40">No photos available</div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      {photos.length > 1 && (
        <div className="flex items-center justify-center gap-[1em] mb-[0.75em]">
          <button
            onClick={goToPrev}
            className="text-[0.875em] text-white/40 hover:text-white transition-colors px-[0.5em]"
          >
            ◀
          </button>
          <span className="text-[0.75em] font-mono text-white/50">
            {currentIndex + 1} of {photos.length}
          </span>
          <button
            onClick={goToNext}
            className="text-[0.875em] text-white/40 hover:text-white transition-colors px-[0.5em]"
          >
            ▶
          </button>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-[0.5em] mb-[0.75em]">
        <div className="bg-white/5 rounded-[0.375em] p-[0.625em]">
          <div className="text-[0.5625em] uppercase tracking-wider text-white/40 mb-[0.25em]">
            Earth Date
          </div>
          <div className="text-[0.75em] font-mono text-white">
            {currentPhoto?.earth_date || manifest?.max_date || '--'}
          </div>
        </div>
        <div className="bg-white/5 rounded-[0.375em] p-[0.625em]">
          <div className="text-[0.5625em] uppercase tracking-wider text-white/40 mb-[0.25em]">
            Mission
          </div>
          <div className="text-[0.75em] font-mono text-white">
            {missionSols.toLocaleString()} sols active
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] border-t border-white/10">
        <span className="text-[0.6875em] text-white/40">
          {ROVER_INFO[activeRover].site}
        </span>
        <span className="text-[0.6875em] font-mono text-white/40">
          {manifest ? `${(manifest.total_photos / 1000).toFixed(0)}K+ photos` : '--'}
        </span>
      </div>
    </div>
  )
}
