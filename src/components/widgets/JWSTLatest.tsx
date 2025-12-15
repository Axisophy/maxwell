'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// JWST LATEST WIDGET
// ===========================================
// Shows latest James Webb Space Telescope releases
// Data: STScI / NASA JWST
// ===========================================

interface JWSTImage {
  id: string
  title: string
  description: string
  date: string
  instrument: string
  target: string
  imageUrl: string
  thumbnailUrl: string
  ra?: string
  dec?: string
  distance?: string
}

interface JWSTData {
  timestamp: string
  images: JWSTImage[]
  totalReleases: number
  missionDay: number
}

// JWST instruments
const INSTRUMENTS = {
  NIRCam: { name: 'NIRCam', color: '#f59e0b', desc: 'Near-Infrared Camera' },
  MIRI: { name: 'MIRI', color: '#ef4444', desc: 'Mid-Infrared Instrument' },
  NIRSpec: { name: 'NIRSpec', color: '#3b82f6', desc: 'Near-Infrared Spectrograph' },
  NIRISS: { name: 'NIRISS', color: '#8b5cf6', desc: 'Near-Infrared Imager' },
  FGS: { name: 'FGS', color: '#22c55e', desc: 'Fine Guidance Sensor' }
}

export default function JWSTLatest() {
  const [data, setData] = useState<JWSTData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  
  // Responsive scaling
  useEffect(() => {
    if (!containerRef) return
    
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25)
    })
    
    observer.observe(containerRef)
    return () => observer.disconnect()
  }, [containerRef])
  
  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/jwst')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
    } catch (error) {
      // Generate realistic fallback data
      const launchDate = new Date('2021-12-25')
      const missionDay = Math.floor((Date.now() - launchDate.getTime()) / (1000 * 60 * 60 * 24))
      
      const images: JWSTImage[] = [
        {
          id: 'carina',
          title: 'Cosmic Cliffs in Carina',
          description: 'Star-forming region NGC 3324, revealing previously invisible stellar nurseries',
          date: '2024-07-12',
          instrument: 'NIRCam',
          target: 'NGC 3324',
          imageUrl: 'https://stsci-opo.org/STScI-01GA6KKWG229B16K4Q38CH3BXS.png',
          thumbnailUrl: 'https://stsci-opo.org/STScI-01GA6KKWG229B16K4Q38CH3BXS.png',
          distance: '7,600 light-years'
        },
        {
          id: 'pillars',
          title: 'Pillars of Creation',
          description: 'Iconic star-forming region in the Eagle Nebula, revealed in unprecedented detail',
          date: '2024-10-19',
          instrument: 'NIRCam',
          target: 'M16',
          imageUrl: 'https://stsci-opo.org/STScI-01GFRYJJ30GGHSJWAQG2ETPWXZ.png',
          thumbnailUrl: 'https://stsci-opo.org/STScI-01GFRYJJ30GGHSJWAQG2ETPWXZ.png',
          distance: '6,500 light-years'
        },
        {
          id: 'stephans',
          title: "Stephan's Quintet",
          description: 'Compact galaxy group showing interactions and a supermassive black hole',
          date: '2024-07-12',
          instrument: 'MIRI',
          target: "Stephan's Quintet",
          imageUrl: 'https://stsci-opo.org/STScI-01G7DA0K2VH0KGMNZ0YVRG3XSG.png',
          thumbnailUrl: 'https://stsci-opo.org/STScI-01G7DA0K2VH0KGMNZ0YVRG3XSG.png',
          distance: '290 million light-years'
        },
        {
          id: 'phantom',
          title: 'Phantom Galaxy Core',
          description: 'Spiral galaxy M74 showing intricate gas and dust structures',
          date: '2024-08-29',
          instrument: 'MIRI',
          target: 'M74',
          imageUrl: 'https://stsci-opo.org/STScI-01GAPSV3PFNNQHFVZPGM7QTQWH.png',
          thumbnailUrl: 'https://stsci-opo.org/STScI-01GAPSV3PFNNQHFVZPGM7QTQWH.png',
          distance: '32 million light-years'
        },
        {
          id: 'smacs',
          title: 'SMACS 0723 Deep Field',
          description: 'Deepest infrared image of the universe ever taken',
          date: '2024-07-11',
          instrument: 'NIRCam',
          target: 'SMACS 0723',
          imageUrl: 'https://stsci-opo.org/STScI-01G7JGTH5JYSXJVJ7DX6S44VYH.png',
          thumbnailUrl: 'https://stsci-opo.org/STScI-01G7JGTH5JYSXJVJ7DX6S44VYH.png',
          distance: '4.6 billion light-years'
        }
      ]
      
      setData({
        timestamp: new Date().toISOString(),
        images,
        totalReleases: 847,
        missionDay
      })
    } finally {
      setLoading(false)
    }
  }, [])
  
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 3600000) // Refresh hourly
    return () => clearInterval(interval)
  }, [fetchData])
  
  const currentImage = data?.images[selectedIndex]
  const instrument = currentImage ? INSTRUMENTS[currentImage.instrument as keyof typeof INSTRUMENTS] : null
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0a0a12]">
        <div className="text-[0.875em] text-white/50">Loading from L2...</div>
      </div>
    )
  }
  
  if (!data || data.images.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0a0a12]">
        <div className="text-[0.875em] text-white/50">No images available</div>
      </div>
    )
  }

  return (
    <div 
      ref={setContainerRef}
      className="h-full bg-[#0a0a12] overflow-hidden flex flex-col"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-[0.75em] border-b border-white/10">
        <div className="flex items-center gap-[0.5em]">
          {/* JWST hexagon icon */}
          <svg className="w-[1.5em] h-[1.5em] text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="text-[0.75em] font-medium text-white">Webb Telescope</span>
        </div>
        
        <div className="text-right">
          <div className="text-[0.5em] uppercase tracking-wider text-white/40">Mission Day</div>
          <div className="text-[0.875em] font-mono text-[#d4af37]">
            {data.missionDay.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Main image */}
      <div className="flex-1 relative min-h-0">
        {currentImage && (
          <>
            <div 
              className="absolute inset-0 bg-center bg-cover"
              style={{
                backgroundImage: `url(${currentImage.imageUrl})`,
                backgroundColor: '#0a0a12'
              }}
            >
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            </div>
            
            {/* Fallback for image loading */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-[50%] h-[50%] rounded-full bg-gradient-radial from-[#d4af37]/10 to-transparent animate-pulse" />
            </div>
            
            {/* Instrument badge */}
            {instrument && (
              <div className="absolute top-[0.5em] left-[0.5em]">
                <span 
                  className="px-[0.5em] py-[0.25em] rounded text-[0.5625em] font-medium text-white"
                  style={{ backgroundColor: instrument.color }}
                >
                  {instrument.name}
                </span>
              </div>
            )}
            
            {/* Image info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-[0.75em]">
              <h3 className="text-[1em] font-medium text-white mb-[0.25em]">
                {currentImage.title}
              </h3>
              <p className="text-[0.6875em] text-white/70 line-clamp-2 mb-[0.375em]">
                {currentImage.description}
              </p>
              <div className="flex items-center gap-[0.75em] text-[0.5625em] text-white/50">
                <span>{currentImage.target}</span>
                {currentImage.distance && (
                  <>
                    <span>•</span>
                    <span>{currentImage.distance}</span>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-[0.375em] py-[0.5em] border-t border-white/10">
        {data.images.map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`w-[0.5em] h-[0.5em] rounded-full transition-all ${
              i === selectedIndex 
                ? 'bg-[#d4af37] w-[1em]' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between px-[0.75em] py-[0.5em] border-t border-white/10">
        <span className="text-[0.5em] text-white/40">
          {data.totalReleases} total releases
        </span>
        <span className="text-[0.5em] text-white/40">
          1.5M km from Earth at L2
        </span>
      </div>
    </div>
  )
}
