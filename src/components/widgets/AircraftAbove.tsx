'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// AIRCRAFT ABOVE
// ===========================================
// Shows aircraft currently overhead
// Data: OpenSky Network
// Design: Dark theme (#1a1a1e) with radar aesthetic
// ===========================================

interface Aircraft {
  icao24: string
  callsign: string
  origin_country: string
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  heading: number
  on_ground: boolean
}

interface AircraftData {
  timestamp: string
  location: { lat: number; lon: number }
  radius: number
  count: number
  estimatedPassengers: number
  aircraft: Aircraft[]
  stats: {
    highestAltitude: number
    lowestAltitude: number
    fastestSpeed: number
  }
}

export default function AircraftAbove() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [containerWidth, setContainerWidth] = useState(400)
  const [data, setData] = useState<AircraftData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setContainerWidth(width)
      setBaseFontSize(width / 25)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setUserCoords({ lat: 51.5074, lon: -0.1278 }) // Default to London
      )
    } else {
      setUserCoords({ lat: 51.5074, lon: -0.1278 })
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (!userCoords) return
    try {
      const response = await fetch(
        `/api/aircraft-above?lat=${userCoords.lat}&lon=${userCoords.lon}&radius=50`
      )
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError('Unable to load aircraft data')
    } finally {
      setLoading(false)
    }
  }, [userCoords])

  useEffect(() => {
    if (userCoords) {
      fetchData()
      const interval = setInterval(fetchData, 30 * 1000) // 30 seconds
      return () => clearInterval(interval)
    }
  }, [fetchData, userCoords])

  // Sort by altitude (highest first) and filter airborne
  const airborneCraft = data?.aircraft
    .filter(a => !a.on_ground && a.altitude > 0)
    .sort((a, b) => b.altitude - a.altitude) || []

  const displayCraft = showAll ? airborneCraft : airborneCraft.slice(0, 4)
  const remainingCount = airborneCraft.length - 4

  // Radar display calculations
  const radarSize = Math.min(containerWidth - (baseFontSize * 2), 200)

  if (loading || !userCoords) {
    return (
      <div
        ref={containerRef}
        className="bg-[#1a1a1e] p-[1em] h-full flex items-center justify-center"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-white/50 text-[0.875em]">
          {!userCoords ? 'Getting location...' : 'Scanning airspace...'}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div
        ref={containerRef}
        className="bg-[#1a1a1e] p-[1em] h-full flex items-center justify-center"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-red-400 text-[0.875em]">{error || 'No data'}</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="bg-[#1a1a1e] p-[1em] h-full flex flex-col"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="flex items-center gap-[0.5em] mb-[0.75em]">
        <span className="text-[1.75em] font-bold text-cyan-400">
          {airborneCraft.length}
        </span>
        <span className="text-[0.875em] font-medium text-white/70 uppercase tracking-wider">
          Aircraft Overhead
        </span>
      </div>

      {/* Radar display */}
      <div className="flex justify-center mb-[0.5em]">
        <svg
          width={radarSize}
          height={radarSize}
          viewBox="0 0 200 200"
          className="block"
        >
          {/* Background */}
          <circle cx="100" cy="100" r="95" fill="#0a0a12" stroke="rgba(255,255,255,0.1)" />

          {/* Range rings */}
          {[30, 60, 90].map((r) => (
            <circle
              key={r}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Cardinal lines */}
          <line x1="100" y1="5" x2="100" y2="195" stroke="rgba(255,255,255,0.1)" />
          <line x1="5" y1="100" x2="195" y2="100" stroke="rgba(255,255,255,0.1)" />

          {/* Cardinal labels */}
          <text x="100" y="18" textAnchor="middle" fill="#d4d0c8" fontSize="10">N</text>
          <text x="100" y="196" textAnchor="middle" fill="#d4d0c8" fontSize="10">S</text>
          <text x="12" y="104" textAnchor="middle" fill="#d4d0c8" fontSize="10">W</text>
          <text x="188" y="104" textAnchor="middle" fill="#d4d0c8" fontSize="10">E</text>

          {/* Center point (user) */}
          <circle cx="100" cy="100" r="3" fill="#22d3ee" />

          {/* Aircraft */}
          {airborneCraft.slice(0, 50).map((aircraft) => {
            // Calculate position relative to user
            const dx = aircraft.longitude - userCoords.lon
            const dy = aircraft.latitude - userCoords.lat
            const maxDelta = 1 // roughly 50nm at mid-latitudes
            const x = 100 + (dx / maxDelta) * 90
            const y = 100 - (dy / maxDelta) * 90

            // Only show if within bounds
            if (x < 5 || x > 195 || y < 5 || y > 195) return null

            return (
              <g key={aircraft.icao24}>
                {/* Aircraft dot */}
                <circle cx={x} cy={y} r="3" fill="#22d3ee" />
                {/* Heading indicator */}
                <line
                  x1={x}
                  y1={y}
                  x2={x + Math.sin(aircraft.heading * Math.PI / 180) * 8}
                  y2={y - Math.cos(aircraft.heading * Math.PI / 180) * 8}
                  stroke="#22d3ee"
                  strokeWidth="1.5"
                />
              </g>
            )
          })}
        </svg>
      </div>

      {/* Passenger estimate */}
      <div className="text-center text-[0.875em] text-white/50 mb-[0.75em]">
        ~{data.estimatedPassengers.toLocaleString()} passengers overhead
      </div>

      {/* Aircraft list */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.375em]">
          Nearest Aircraft
        </div>
        <div className="flex-1 overflow-y-auto space-y-[0.25em]">
          {displayCraft.map((aircraft) => (
            <div
              key={aircraft.icao24}
              className="flex items-center justify-between py-[0.25em] border-b border-white/5"
            >
              <div>
                <span className="text-[0.75em] font-mono text-white">
                  {aircraft.callsign?.trim() || aircraft.icao24}
                </span>
                <span className="text-[0.625em] text-white/40 ml-[0.5em]">
                  {aircraft.origin_country}
                </span>
              </div>
              <span className="text-[0.625em] font-mono text-white/60">
                {Math.round(aircraft.altitude * 3.281).toLocaleString()} ft
              </span>
            </div>
          ))}
        </div>

        {remainingCount > 0 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-[0.75em] text-white/40 hover:text-white/60 py-[0.5em] mt-[0.25em]"
          >
            {showAll ? 'Show less' : `+${remainingCount} more aircraft`}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] mt-auto border-t border-white/10">
        <span className="text-[0.625em] text-white/40">
          {data.radius}nm radius
        </span>
        <span className="text-[0.625em] text-white/40">
          OpenSky Network
        </span>
      </div>
    </div>
  )
}
