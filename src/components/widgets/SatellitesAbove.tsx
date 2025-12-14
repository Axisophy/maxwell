'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// SATELLITES ABOVE WIDGET
// ===========================================
// Shows satellites currently overhead
// Data: N2YO API
// ===========================================

interface Satellite {
  id: number
  name: string
  altitude: number
  latitude: number
  longitude: number
  category: string
}

interface SatelliteData {
  timestamp: string
  location: { lat: number; lng: number }
  satellites: Satellite[]
  counts: {
    total: number
    starlink: number
    gps: number
    weather: number
    other: number
  }
  nearest: { name: string; altitude: number } | null
  error?: string
}

// ===========================================
// SKY DOME VISUALIZATION
// ===========================================

function SkyDome({ satellites, showStarlink }: { satellites: Satellite[]; showStarlink: boolean }) {
  // Filter satellites
  const visibleSats = showStarlink 
    ? satellites.slice(0, 50)
    : satellites.filter(s => s.category !== 'Starlink').slice(0, 30)
  
  // Map position to dome coordinates (simplified)
  const getSatPosition = (sat: Satellite, index: number) => {
    // Spread satellites around the dome based on index
    const angle = (index * 137.5) % 360 // Golden angle distribution
    const radius = 25 + (sat.altitude / 1000) * 10 // Inner = lower, outer = higher
    const x = 50 + Math.cos(angle * Math.PI / 180) * Math.min(radius, 40)
    const y = 50 + Math.sin(angle * Math.PI / 180) * Math.min(radius, 40)
    return { x, y }
  }

  // Color by category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Starlink': return '#94a3b8' // slate
      case 'GPS': return '#22c55e' // green
      case 'Weather': return '#0ea5e9' // sky
      case 'ISS': return '#fbbf24' // amber
      default: return '#a855f7' // purple
    }
  }

  return (
    <div className="relative w-full aspect-square max-w-[12em] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Dome background */}
        <circle cx="50" cy="50" r="45" fill="#0f172a" />
        
        {/* Grid circles */}
        <circle cx="50" cy="50" r="15" fill="none" stroke="#1e3a5f" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#1e3a5f" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="#1e3a5f" strokeWidth="0.5" />
        
        {/* Cross lines */}
        <line x1="50" y1="5" x2="50" y2="95" stroke="#1e3a5f" strokeWidth="0.5" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="#1e3a5f" strokeWidth="0.5" />
        
        {/* Cardinal directions */}
        <text x="50" y="8" textAnchor="middle" className="text-[4px] fill-white/40">N</text>
        <text x="50" y="97" textAnchor="middle" className="text-[4px] fill-white/40">S</text>
        <text x="7" y="51" textAnchor="middle" className="text-[4px] fill-white/40">W</text>
        <text x="93" y="51" textAnchor="middle" className="text-[4px] fill-white/40">E</text>
        
        {/* Satellites */}
        {visibleSats.map((sat, i) => {
          const pos = getSatPosition(sat, i)
          const color = getCategoryColor(sat.category)
          const size = sat.category === 'ISS' ? 3 : sat.category === 'Starlink' ? 1 : 1.5
          
          return (
            <g key={sat.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={size}
                fill={color}
                opacity={sat.category === 'Starlink' ? 0.4 : 0.8}
              />
              {sat.category === 'ISS' && (
                <circle cx={pos.x} cy={pos.y} r={5} fill={color} opacity="0.2">
                  <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0.1;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          )
        })}
        
        {/* Center dot (you) */}
        <circle cx="50" cy="50" r="2" fill="#ef4444" />
      </svg>
    </div>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function SatellitesAbove() {
  const [data, setData] = useState<SatelliteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showStarlink, setShowStarlink] = useState(false)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        () => {
          // Default to London if geolocation fails
          setLocation({ lat: 51.5, lng: -0.1 })
        }
      )
    } else {
      setLocation({ lat: 51.5, lng: -0.1 })
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (!location) return
    
    try {
      const response = await fetch(`/api/satellites-above?lat=${location.lat}&lng=${location.lng}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      console.error('Satellites fetch error:', err)
      setError('Unable to track satellites')
    } finally {
      setIsLoading(false)
    }
  }, [location])

  useEffect(() => {
    if (location) {
      fetchData()
      // Update every 60 seconds
      const interval = setInterval(fetchData, 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [location, fetchData])

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="p-[1em] flex items-center justify-center h-[16em]">
        <div className="text-center">
          <div className="text-black/40 text-[0.875em]">
            {location ? 'Scanning sky...' : 'Getting your location...'}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !data) {
    return (
      <div className="p-[1em] flex items-center justify-center h-[16em]">
        <div className="text-center">
          <div className="text-red-500 text-[0.875em]">{error}</div>
          <button 
            onClick={fetchData}
            className="mt-2 text-[0.75em] text-black/50 hover:text-black"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  // Check if ISS is overhead
  const issOverhead = data.satellites.some(s => s.category === 'ISS')

  return (
    <div className="p-[1em]">
      {/* Header stat */}
      <div className="text-center mb-[0.5em]">
        <div className="flex items-baseline justify-center gap-[0.25em]">
          <span className="font-mono text-[2.5em] font-bold text-black">
            {data.counts.total}
          </span>
          <span className="text-[1em] text-black/50">
            satellites
          </span>
        </div>
        <div className="text-[0.75em] text-black/50">
          overhead right now
        </div>
      </div>

      {/* ISS alert */}
      {issOverhead && (
        <div className="mb-[0.5em] p-[0.5em] bg-amber-50 rounded-[0.5em] text-center border border-amber-200">
          <div className="text-[0.875em] text-amber-800 font-medium">
            🛸 ISS is overhead!
          </div>
          <div className="text-[0.7em] text-amber-600">
            Look up — the space station is passing over
          </div>
        </div>
      )}

      {/* Sky dome */}
      <SkyDome satellites={data.satellites} showStarlink={showStarlink} />

      {/* Legend */}
      <div className="flex justify-center gap-[0.75em] mt-[0.5em] text-[0.65em]">
        <div className="flex items-center gap-[0.25em]">
          <div className="w-[0.5em] h-[0.5em] rounded-full bg-[#22c55e]" />
          <span className="text-black/50">GPS</span>
        </div>
        <div className="flex items-center gap-[0.25em]">
          <div className="w-[0.5em] h-[0.5em] rounded-full bg-[#0ea5e9]" />
          <span className="text-black/50">Weather</span>
        </div>
        <div className="flex items-center gap-[0.25em]">
          <div className="w-[0.5em] h-[0.5em] rounded-full bg-[#a855f7]" />
          <span className="text-black/50">Other</span>
        </div>
        <div className="flex items-center gap-[0.25em]">
          <div className="w-[0.5em] h-[0.5em] rounded-full bg-[#ef4444]" />
          <span className="text-black/50">You</span>
        </div>
      </div>

      {/* Starlink toggle */}
      <div className="flex justify-center mt-[0.5em]">
        <button
          onClick={() => setShowStarlink(!showStarlink)}
          className={`
            text-[0.7em] px-[0.75em] py-[0.25em] rounded-full transition-all
            ${showStarlink 
              ? 'bg-slate-700 text-white' 
              : 'bg-black/5 text-black/50 hover:bg-black/10'
            }
          `}
        >
          {showStarlink ? `Showing ${data.counts.starlink} Starlink` : `+ ${data.counts.starlink} Starlink hidden`}
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5] my-[0.75em]" />

      {/* Breakdown */}
      <div className="grid grid-cols-4 gap-[0.25em] text-center">
        <div>
          <div className="font-mono text-[1.125em] font-bold">{data.counts.starlink}</div>
          <div className="text-[0.6em] text-black/50">Starlink</div>
        </div>
        <div>
          <div className="font-mono text-[1.125em] font-bold">{data.counts.gps}</div>
          <div className="text-[0.6em] text-black/50">GPS</div>
        </div>
        <div>
          <div className="font-mono text-[1.125em] font-bold">{data.counts.weather}</div>
          <div className="text-[0.6em] text-black/50">Weather</div>
        </div>
        <div>
          <div className="font-mono text-[1.125em] font-bold">{data.counts.other}</div>
          <div className="text-[0.6em] text-black/50">Other</div>
        </div>
      </div>

      {/* Nearest satellite */}
      {data.nearest && (
        <div className="mt-[0.75em] text-center text-[0.75em] text-black/60">
          Nearest: <span className="font-medium text-black">{data.nearest.name}</span> at {data.nearest.altitude.toLocaleString()} km
        </div>
      )}

      {/* Location */}
      <div className="mt-[0.5em] text-[0.625em] text-black/30 text-center">
        {location ? `${location.lat.toFixed(2)}°, ${location.lng.toFixed(2)}°` : 'Location unavailable'}
      </div>
    </div>
  )
}
