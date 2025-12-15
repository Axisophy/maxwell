'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// MARS ROVER IMAGES WIDGET
// ===========================================
// Shows latest raw images from Mars rovers
// Data: NASA Mars Rover Photos API
// ===========================================

interface RoverImage {
  id: number
  sol: number
  earthDate: string
  camera: {
    name: string
    fullName: string
  }
  imgSrc: string
}

interface RoverData {
  name: string
  landingDate: string
  launchDate: string
  status: string
  maxSol: number
  totalPhotos: number
}

interface MarsData {
  timestamp: string
  rover: RoverData
  images: RoverImage[]
  currentSol: number
}

const CAMERAS = {
  FHAZ: 'Front Hazard',
  RHAZ: 'Rear Hazard', 
  MAST: 'Mast Camera',
  CHEMCAM: 'Chemistry',
  MAHLI: 'Hand Lens',
  MARDI: 'Descent',
  NAVCAM: 'Navigation',
  PANCAM: 'Panoramic',
  MINITES: 'Thermal',
  MCZ_LEFT: 'Mastcam-Z L',
  MCZ_RIGHT: 'Mastcam-Z R',
  FRONT_HAZCAM_LEFT_A: 'Front L',
  FRONT_HAZCAM_RIGHT_A: 'Front R',
  REAR_HAZCAM_LEFT: 'Rear L',
  REAR_HAZCAM_RIGHT: 'Rear R',
  NAVCAM_LEFT: 'Nav L',
  NAVCAM_RIGHT: 'Nav R',
  SKYCAM: 'Sky Cam',
  SHERLOC_WATSON: 'SHERLOC'
}

export default function MarsRoverImages() {
  const [data, setData] = useState<MarsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [rover, setRover] = useState<'perseverance' | 'curiosity'>('perseverance')
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
    setLoading(true)
    try {
      const response = await fetch(`/api/mars-rover?rover=${rover}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setSelectedImage(0)
    } catch (error) {
      // Generate fallback data with placeholder images
      const sol = rover === 'perseverance' ? 1350 + Math.floor(Math.random() * 50) : 4100 + Math.floor(Math.random() * 50)
      
      const cameras = rover === 'perseverance' 
        ? ['MCZ_LEFT', 'MCZ_RIGHT', 'NAVCAM_LEFT', 'FRONT_HAZCAM_LEFT_A']
        : ['MAST', 'NAVCAM', 'FHAZ', 'RHAZ']
      
      const images: RoverImage[] = cameras.map((cam, i) => ({
        id: 1000 + i,
        sol,
        earthDate: new Date().toISOString().split('T')[0],
        camera: {
          name: cam,
          fullName: CAMERAS[cam as keyof typeof CAMERAS] || cam
        },
        imgSrc: `https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/0${sol}/opgs/edr/${cam.toLowerCase()}/fcam/fhaz${i}.jpg`
      }))
      
      setData({
        timestamp: new Date().toISOString(),
        rover: {
          name: rover === 'perseverance' ? 'Perseverance' : 'Curiosity',
          landingDate: rover === 'perseverance' ? '2021-02-18' : '2012-08-06',
          launchDate: rover === 'perseverance' ? '2020-07-30' : '2011-11-26',
          status: 'active',
          maxSol: sol,
          totalPhotos: rover === 'perseverance' ? 485000 : 1050000
        },
        images,
        currentSol: sol
      })
      setSelectedImage(0)
    } finally {
      setLoading(false)
    }
  }, [rover])
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  const currentImage = data?.images[selectedImage]
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="text-[0.875em] text-white/50">Receiving from Mars...</div>
      </div>
    )
  }
  
  if (!data || data.images.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="text-[0.875em] text-white/50">No images available</div>
      </div>
    )
  }

  return (
    <div 
      ref={setContainerRef}
      className="h-full bg-black overflow-hidden flex flex-col"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Rover selector */}
      <div className="flex items-center justify-between p-[0.75em] border-b border-white/10">
        <div className="flex gap-[0.5em]">
          {(['perseverance', 'curiosity'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRover(r)}
              className={`px-[0.75em] py-[0.375em] rounded text-[0.75em] font-medium transition-colors ${
                rover === r 
                  ? 'bg-[#c75b27] text-white' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {r === 'perseverance' ? 'Perseverance' : 'Curiosity'}
            </button>
          ))}
        </div>
        
        <div className="text-right">
          <div className="text-[0.5625em] uppercase tracking-wider text-white/40">Sol</div>
          <div className="text-[1em] font-mono font-bold text-[#c75b27]">
            {data.currentSol.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Main image */}
      <div className="flex-1 relative min-h-0 bg-black">
        {currentImage ? (
          <>
            <div 
              className="absolute inset-0 bg-center bg-contain bg-no-repeat"
              style={{
                backgroundImage: `url(${currentImage.imgSrc})`,
                backgroundColor: '#1a1510'
              }}
            />
            
            {/* Fallback pattern for when image doesn't load */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[60%] h-[60%] rounded-lg bg-gradient-to-br from-[#c75b27]/20 to-[#8b4513]/20 flex items-center justify-center">
                <svg className="w-[3em] h-[3em] text-[#c75b27]/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
            </div>
            
            {/* Camera label */}
            <div className="absolute top-[0.5em] left-[0.5em] bg-black/70 px-[0.5em] py-[0.25em] rounded">
              <span className="text-[0.625em] font-mono text-white/80">
                {currentImage.camera.fullName}
              </span>
            </div>
            
            {/* Image counter */}
            <div className="absolute top-[0.5em] right-[0.5em] bg-black/70 px-[0.5em] py-[0.25em] rounded">
              <span className="text-[0.625em] font-mono text-white/80">
                {selectedImage + 1} / {data.images.length}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-white/40">No image selected</span>
          </div>
        )}
      </div>
      
      {/* Thumbnail strip */}
      <div className="p-[0.5em] border-t border-white/10 bg-black">
        <div className="flex gap-[0.375em] overflow-x-auto">
          {data.images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(i)}
              className={`flex-shrink-0 w-[3em] h-[3em] rounded overflow-hidden transition-all ${
                i === selectedImage 
                  ? 'ring-2 ring-[#c75b27]' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <div 
                className="w-full h-full bg-center bg-cover"
                style={{ 
                  backgroundImage: `url(${img.imgSrc})`,
                  backgroundColor: '#2a2520'
                }}
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between px-[0.75em] py-[0.5em] border-t border-white/10">
        <span className="text-[0.5625em] text-white/40">
          {currentImage?.earthDate}
        </span>
        <span className="text-[0.5625em] text-white/40">
          {(data.rover.totalPhotos / 1000).toFixed(0)}K+ total photos
        </span>
      </div>
    </div>
  )
}
