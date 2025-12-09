'use client'

import { useState, useEffect, useCallback } from 'react'
import WorldMap, { latLonToXY } from './WorldMap'

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

// ===========================================
// ISS MARKER
// ===========================================

function ISSMarker({ latitude, longitude }: { latitude: number; longitude: number }) {
  const { x, y } = latLonToXY(latitude, longitude)
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Pulse ring */}
      <circle r="12" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.3">
        <animate
          attributeName="r"
          from="12"
          to="35"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="0.5"
          to="0"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      {/* ISS body */}
      <circle r="8" fill="#fbbf24" />
      {/* Solar panels */}
      <rect x="-22" y="-3" width="44" height="6" fill="#fbbf24" rx="2" />
    </g>
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
        <WorldMap>
          <ISSMarker latitude={data.iss.latitude} longitude={data.iss.longitude} />
        </WorldMap>
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