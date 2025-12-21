'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface AuroraData {
  observation_time: string
  forecast_time: string
  data: number[][] // [lat, long, probability][]
}

interface ViewingLocation {
  name: string
  lat: number
  long: number
}

const VIEWING_LOCATIONS: ViewingLocation[] = [
  { name: 'Tromsø, Norway', lat: 69.65, long: 18.96 },
  { name: 'Fairbanks, Alaska', lat: 64.84, long: -147.72 },
  { name: 'Reykjavik, Iceland', lat: 64.13, long: -21.90 },
  { name: 'Yellowknife, Canada', lat: 62.45, long: -114.37 },
  { name: 'Rovaniemi, Finland', lat: 66.50, long: 25.73 },
  { name: 'Kiruna, Sweden', lat: 67.86, long: 20.23 },
  { name: 'Anchorage, Alaska', lat: 61.22, long: -149.90 },
  { name: 'Edinburgh, Scotland', lat: 55.95, long: -3.19 },
]

export function AuroraOval() {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [hemisphere, setHemisphere] = useState<'north' | 'south'>('north')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [kpEstimate, setKpEstimate] = useState<number | null>(null)
  const [viewpointVisible, setViewpointVisible] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  
  // Get the aurora forecast image URL
  const getImageUrl = () => {
    const timestamp = Date.now()
    const hemi = hemisphere === 'north' ? 'northern' : 'southern'
    return `https://services.swpc.noaa.gov/images/aurora-forecast-${hemi}-hemisphere.jpg?t=${timestamp}`
  }

  // Fetch current Kp for context
  const fetchKp = useCallback(async () => {
    try {
      const res = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json')
      const data = await res.json()
      if (data && data.length > 1) {
        const latest = data[data.length - 1]
        const kp = parseFloat(latest[1])
        if (!isNaN(kp)) {
          setKpEstimate(kp)
        }
      }
    } catch (e) {
      // Silent fail - Kp is supplementary
    }
  }, [])

  // Load image
  const loadImage = useCallback(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      imageRef.current = img
      setImageLoaded(true)
      setError(false)
      setLastUpdate(new Date())
      drawToCanvas()
    }
    
    img.onerror = () => {
      setError(true)
      setImageLoaded(false)
    }
    
    img.src = getImageUrl()
  }, [hemisphere])

  // Draw image to canvas with overlay
  const drawToCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match image
    canvas.width = img.width
    canvas.height = img.height

    // Draw the aurora forecast image
    ctx.drawImage(img, 0, 0)

    // Optional: Add viewing location markers
    // The NOAA image is a polar projection, would need proper coordinate transformation
    // For now, we'll display location visibility based on Kp separately
  }, [])

  // Calculate aurora visibility for a location based on Kp
  const getVisibilityForKp = (lat: number, kp: number): { visible: boolean; chance: string } => {
    // Approximate auroral oval latitude based on Kp
    // Kp 0-1: ~67°N, Kp 3: ~62°N, Kp 5: ~58°N, Kp 7: ~52°N, Kp 9: ~45°N
    const ovatLat = 67 - (kp * 2.5)
    const latDiff = Math.abs(lat) - ovatLat
    
    if (latDiff >= 5) {
      return { visible: true, chance: 'High' }
    } else if (latDiff >= 0) {
      return { visible: true, chance: 'Good' }
    } else if (latDiff >= -5) {
      return { visible: true, chance: 'Possible' }
    } else {
      return { visible: false, chance: 'Unlikely' }
    }
  }

  useEffect(() => {
    loadImage()
    fetchKp()
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      loadImage()
      fetchKp()
    }, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [hemisphere, loadImage, fetchKp])

  useEffect(() => {
    if (imageLoaded) {
      drawToCanvas()
    }
  }, [imageLoaded, drawToCanvas])

  // Get estimated auroral latitude
  const getAuroralLatitude = () => {
    if (kpEstimate === null) return null
    return Math.round(67 - (kpEstimate * 2.5))
  }

  const auroralLat = getAuroralLatitude()

  return (
    <div className="bg-[#0f0f14] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-medium">Aurora Forecast</h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
            OVATION PRIME
          </span>
        </div>
        
        {/* Hemisphere Toggle */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
          <button
            onClick={() => setHemisphere('north')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              hemisphere === 'north'
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white'
            }`}
          >
            North
          </button>
          <button
            onClick={() => setHemisphere('south')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              hemisphere === 'south'
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white'
            }`}
          >
            South
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative aspect-square bg-[#0a0a0f]">
        {!imageLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white/40 text-sm">Unable to load aurora forecast</p>
              <button 
                onClick={loadImage}
                className="mt-2 text-xs text-white/60 hover:text-white underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        <canvas 
          ref={canvasRef}
          className={`w-full h-full object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Current Kp Overlay */}
        {kpEstimate !== null && (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Current Kp</div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-mono font-bold ${
                kpEstimate >= 7 ? 'text-red-400' :
                kpEstimate >= 5 ? 'text-orange-400' :
                kpEstimate >= 4 ? 'text-yellow-400' :
                kpEstimate >= 2 ? 'text-green-400' :
                'text-blue-400'
              }`}>
                {kpEstimate.toFixed(1)}
              </span>
              <span className="text-xs text-white/40">
                {kpEstimate >= 5 ? 'Storm' : kpEstimate >= 4 ? 'Active' : 'Quiet'}
              </span>
            </div>
          </div>
        )}

        {/* Auroral Latitude Estimate */}
        {auroralLat !== null && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-right">
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Aurora visible to</div>
            <div className="text-lg font-mono text-white">
              {auroralLat}°{hemisphere === 'north' ? 'N' : 'S'}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-[10px] font-mono text-white/40 mb-1">Probability</div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-green-500/40" />
            <span className="text-[10px] text-white/60 mr-2">Low</span>
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <span className="text-[10px] text-white/60 mr-2">Moderate</span>
            <div className="w-3 h-3 rounded-sm bg-green-300" />
            <span className="text-[10px] text-white/60">High</span>
          </div>
        </div>

        {/* Timestamp */}
        {lastUpdate && (
          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/30">
            Updated {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Viewing Locations (Northern hemisphere only) */}
      {hemisphere === 'north' && kpEstimate !== null && (
        <div className="p-4 border-t border-white/10">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-3">
            Viewing Conditions
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {VIEWING_LOCATIONS.map(loc => {
              const visibility = getVisibilityForKp(loc.lat, kpEstimate)
              return (
                <div 
                  key={loc.name}
                  className={`p-2 rounded-lg transition-colors cursor-default ${
                    visibility.chance === 'High' ? 'bg-emerald-500/20 border border-emerald-500/30' :
                    visibility.chance === 'Good' ? 'bg-green-500/15 border border-green-500/20' :
                    visibility.chance === 'Possible' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                    'bg-white/5 border border-white/10'
                  }`}
                  onMouseEnter={() => setViewpointVisible(loc.name)}
                  onMouseLeave={() => setViewpointVisible(null)}
                >
                  <div className="text-xs text-white/80 truncate">{loc.name.split(',')[0]}</div>
                  <div className={`text-[10px] font-mono ${
                    visibility.chance === 'High' ? 'text-emerald-400' :
                    visibility.chance === 'Good' ? 'text-green-400' :
                    visibility.chance === 'Possible' ? 'text-yellow-400' :
                    'text-white/40'
                  }`}>
                    {visibility.chance}
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-[10px] text-white/30 mt-3">
            Visibility depends on clear skies and darkness. Best viewing: midnight local time.
          </p>
        </div>
      )}

      {/* Info Panel */}
      <div className="p-4 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-emerald-400 text-xs">i</span>
          </div>
          <div className="text-xs text-white/50 leading-relaxed">
            <p className="mb-2">
              <strong className="text-white/70">OVATION Prime</strong> predicts aurora location 
              based on real-time solar wind from DSCOVR. The green oval shows where aurora is 
              most likely visible.
            </p>
            <p>
              Higher Kp values push the aurora oval toward lower latitudes. 
              At Kp 5+ (geomagnetic storm), aurora may be visible from Scotland, 
              northern US states, and similar latitudes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuroraOval
