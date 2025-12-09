'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// ISS TRACKER WIDGET
// ===========================================
// Shows current ISS position and crew
// Data: wheretheiss.at + Open Notify
// ===========================================

interface ISSData {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  region: string
  timestamp: string
}

interface Astronaut {
  name: string
  craft: string
}

interface AstronautData {
  count: number
  people: Astronaut[]
}

interface APIResponse {
  iss: ISSData
  astronauts: AstronautData
}

// Convert lat/lng to map coordinates
function latLonToXY(lat: number, lon: number, width: number, height: number) {
  const x = ((lon + 180) / 360) * width
  const y = ((90 - lat) / 180) * height
  return { x, y }
}

// ===========================================
// WORLD MAP WITH ISS
// ===========================================

function ISSMap({ 
  latitude, 
  longitude,
  width = 360, 
  height = 180 
}: { 
  latitude: number
  longitude: number
  width?: number
  height?: number
}) {
  const { x, y } = latLonToXY(latitude, longitude, width, height)
  
  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Ocean */}
      <rect x="0" y="0" width={width} height={height} fill="#0f172a" />
      
      {/* Grid lines */}
      <g stroke="#1e293b" strokeWidth="0.5">
        {[-60, -30, 0, 30, 60].map(lat => {
          const lineY = ((90 - lat) / 180) * height
          return <line key={`lat-${lat}`} x1="0" y1={lineY} x2={width} y2={lineY} />
        })}
        {[-120, -60, 0, 60, 120].map(lon => {
          const lineX = ((lon + 180) / 360) * width
          return <line key={`lon-${lon}`} x1={lineX} y1="0" x2={lineX} y2={height} />
        })}
      </g>
      
      {/* Simplified continents */}
      <g fill="#1e3a5f" opacity="0.6">
        {/* North America */}
        <path d="M 30,30 Q 60,25 90,35 L 95,55 Q 80,70 70,75 L 50,70 Q 35,60 30,45 Z" />
        {/* South America */}
        <path d="M 70,85 Q 85,80 90,90 L 85,130 Q 75,145 65,140 L 60,110 Q 60,95 70,85 Z" />
        {/* Europe */}
        <path d="M 160,30 Q 180,25 195,35 L 200,50 Q 185,55 170,50 L 160,40 Z" />
        {/* Africa */}
        <path d="M 165,55 Q 185,50 200,60 L 195,100 Q 180,115 165,105 L 160,75 Z" />
        {/* Asia */}
        <path d="M 200,25 Q 260,20 310,35 L 320,55 Q 300,70 260,65 L 220,55 Q 205,45 200,35 Z" />
        {/* Australia */}
        <path d="M 280,100 Q 310,95 325,105 L 320,125 Q 300,135 285,125 L 280,110 Z" />
      </g>
      
      {/* ISS marker */}
      <g transform={`translate(${x}, ${y})`}>
        {/* Pulse ring */}
        <circle 
          r="10" 
          fill="none" 
          stroke="#fbbf24"
          strokeWidth="2"
          opacity="0.4"
          className="animate-ping"
          style={{ animationDuration: '2s' }}
        />
        {/* ISS dot */}
        <circle r="5" fill="#fbbf24" />
        {/* ISS icon hint - solar panels */}
        <rect x="-8" y="-1" width="16" height="2" fill="#fbbf24" rx="1" />
      </g>
    </svg>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function ISSTracker() {
  const [data, setData] = useState<APIResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCrew, setShowCrew] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/iss')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      console.error('ISS fetch error:', err)
      setError('Unable to track ISS')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Update every 30 seconds
    const interval = setInterval(fetchData, 30 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Format coordinates
  const formatCoord = (value: number, isLat: boolean): string => {
    const abs = Math.abs(value).toFixed(2)
    const dir = isLat 
      ? (value >= 0 ? 'N' : 'S')
      : (value >= 0 ? 'E' : 'W')
    return `${abs}° ${dir}`
  }

  // Group astronauts by craft
  const astronautsByCraft = data?.astronauts.people.reduce((acc, person) => {
    if (!acc[person.craft]) acc[person.craft] = []
    acc[person.craft].push(person.name)
    return acc
  }, {} as Record<string, string[]>) || {}

  if (isLoading && !data) {
    return (
      <div className="p-4 flex items-center justify-center h-48 text-text-muted">
        Acquiring ISS position...
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="p-4 flex items-center justify-center h-48 text-red-500">
        {error}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="p-4 space-y-4">
      {/* Region - the main answer */}
      <div className="text-center">
        <div className="text-xs text-text-muted uppercase tracking-wide mb-1">
          Currently over
        </div>
        <div className="text-2xl font-medium">
          {data.iss.region}
        </div>
      </div>

      {/* Map */}
      <div className="rounded-lg overflow-hidden">
        <ISSMap 
          latitude={data.iss.latitude} 
          longitude={data.iss.longitude} 
        />
      </div>

      {/* Coordinates */}
      <div className="flex justify-center gap-6">
        <div className="text-center">
          <div className="text-xs text-text-muted uppercase tracking-wide">Lat</div>
          <div className="font-mono text-sm">
            {formatCoord(data.iss.latitude, true)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-text-muted uppercase tracking-wide">Lng</div>
          <div className="font-mono text-sm">
            {formatCoord(data.iss.longitude, false)}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5]" />

      {/* Astronauts */}
      <div>
        <button
          onClick={() => setShowCrew(!showCrew)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold">
              {data.astronauts.count}
            </span>
            <span className="text-text-muted">
              humans in space
            </span>
          </div>
          <svg 
            className={`w-5 h-5 text-text-muted transition-transform ${showCrew ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showCrew && (
          <div className="mt-3 space-y-3">
            {Object.entries(astronautsByCraft).map(([craft, crew]) => (
              <div key={craft}>
                <div className="text-xs text-text-muted uppercase tracking-wide mb-1">
                  {craft}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {crew.map(name => (
                    <span key={name} className="text-sm">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}