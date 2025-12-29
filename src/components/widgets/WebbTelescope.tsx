'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// WEBB TELESCOPE WIDGET
// ===========================================
// Latest releases from James Webb Space Telescope
// Data: STScI via /api/jwst (cached server-side)
// Image-focused design with minimal text overlay
// ===========================================

interface JWSTImage {
  id: string
  title: string
  target?: string
  distance?: string
  instrument: 'NIRCam' | 'MIRI' | 'NIRSpec' | 'NIRISS'
  url: string
  date: string
}

// Instrument badge colors
const INSTRUMENT_COLORS: Record<string, string> = {
  NIRCam: '#f59e0b',   // Amber
  MIRI: '#ef4444',     // Red
  NIRSpec: '#3b82f6',  // Blue
  NIRISS: '#8b5cf6',   // Purple
}

// Fallback data for when API is unavailable
const FALLBACK_IMAGES: JWSTImage[] = [
  {
    id: '1',
    title: 'Carina Nebula',
    target: 'NGC 3324',
    distance: '7,600 ly',
    instrument: 'NIRCam',
    url: 'https://stsci-opo.org/STScI-01GA6KKWG229B16K4Q38CH3BXS.png',
    date: '2022-07-12',
  },
  {
    id: '2',
    title: 'Southern Ring Nebula',
    target: 'NGC 3132',
    distance: '2,500 ly',
    instrument: 'NIRCam',
    url: 'https://stsci-opo.org/STScI-01GA6KNV0QHSV5PPWZK5EBRC2M.png',
    date: '2022-07-12',
  },
  {
    id: '3',
    title: "Stephan's Quintet",
    target: 'HCG 92',
    distance: '290M ly',
    instrument: 'MIRI',
    url: 'https://stsci-opo.org/STScI-01GA6MTZN8PWSQFJ4BC0V6QBXN.png',
    date: '2022-07-12',
  },
  {
    id: '4',
    title: 'Pillars of Creation',
    target: 'M16',
    distance: '6,500 ly',
    instrument: 'NIRCam',
    url: 'https://stsci-opo.org/STScI-01GK07V3N43CPMYKBWC8F3NNKS.png',
    date: '2022-10-19',
  },
]

export default function WebbTelescope() {
  const [images, setImages] = useState<JWSTImage[]>(FALLBACK_IMAGES)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [missionDay, setMissionDay] = useState(0)
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

  // Calculate mission day (launched Dec 25, 2021)
  useEffect(() => {
    const launchDate = new Date('2021-12-25T12:20:00Z')
    const now = new Date()
    const diffTime = now.getTime() - launchDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    setMissionDay(diffDays)
  }, [])

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch('/api/jwst')
      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()
      if (data.images && data.images.length > 0) {
        setImages(data.images)
      }
    } catch (err) {
      console.error('Error fetching JWST data:', err)
      // Keep fallback data
    }
  }, [])

  useEffect(() => {
    fetchImages()
    // Refresh every 6 hours
    const interval = setInterval(fetchImages, 6 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchImages])

  const currentImage = images[currentIndex]

  const goToNext = () => {
    setImageLoaded(false)
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrev = () => {
    setImageLoaded(false)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const instrumentColor = INSTRUMENT_COLORS[currentImage.instrument] || '#ffffff'

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
          <span className="text-[0.875em] font-medium text-white">Webb Telescope</span>
        </div>
        <span className="text-[0.6875em] text-white/40">
          Day {missionDay.toLocaleString()} · NASA/ESA
        </span>
      </div>

      {/* Image container */}
      <div className="bg-white/5 rounded-[0.5em] p-[0.5em] mb-[0.75em]">
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          <div className="absolute inset-0 rounded-[0.375em] overflow-hidden bg-black flex items-center justify-center">
            {/* Loading spinner */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-[2em] h-[2em] border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            )}

            {/* Main image - NO text overlay */}
            <img
              src={currentImage.url}
              alt={currentImage.title}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Instrument badge - subtle corner */}
            <div
              className="absolute top-[0.5em] right-[0.5em] px-[0.5em] py-[0.25em] rounded-[0.25em] text-[0.5625em] font-mono font-medium"
              style={{
                backgroundColor: `${instrumentColor}20`,
                color: instrumentColor,
              }}
            >
              {currentImage.instrument}
            </div>
          </div>
        </div>
      </div>

      {/* Image info - BELOW image, not overlaid */}
      <div className="mb-[0.75em]">
        <div className="text-[0.875em] font-medium text-white mb-[0.25em]">
          {currentImage.title}
        </div>
        <div className="flex items-center gap-[0.5em] text-[0.75em] text-white/50">
          {currentImage.target && <span>{currentImage.target}</span>}
          {currentImage.target && currentImage.distance && <span>·</span>}
          {currentImage.distance && <span className="font-mono">{currentImage.distance}</span>}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-[0.75em]">
        <button
          onClick={goToPrev}
          className="text-[0.875em] text-white/40 hover:text-white transition-colors px-[0.5em]"
        >
          ◀
        </button>

        {/* Dot indicators */}
        <div className="flex gap-[0.375em]">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setImageLoaded(false)
                setCurrentIndex(idx)
              }}
              className={`w-[0.375em] h-[0.375em] rounded-full transition-colors ${
                idx === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="text-[0.875em] text-white/40 hover:text-white transition-colors px-[0.5em]"
        >
          ▶
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] border-t border-white/10">
        <span className="text-[0.6875em] text-white/40">
          {images.length} releases
        </span>
        <span className="text-[0.6875em] font-mono text-white/40">
          1.5M km at L2
        </span>
      </div>
    </div>
  )
}
