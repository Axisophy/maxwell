'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// SATELLITES ABOVE
// ===========================================
// Shows satellites currently overhead
// Data: N2YO API
//
// Design notes:
// - NO title/live dot/source (WidgetFrame handles those)
// - Warm grey background (#A6A09B)
// - Black sky dome with cream grid lines
// - All satellites visible (no Starlink toggle)
// ===========================================

interface Satellite {
  satid: number
  satname: string
  intDesignator: string
  launchDate: string
  satlat: number
  satlng: number
  satalt: number
  azimuth: number
  elevation: number
  category: string
}

interface SatellitesData {
  count: number
  satellites: Satellite[]
  location: {
    lat: number
    lon: number
    name?: string
  }
  timestamp: string
}

// Category colors (bright on black)
const CATEGORY_COLORS: Record<string, string> = {
  'starlink': '#22d3ee',
  'gps': '#22c55e',
  'weather': '#f59e0b',
  'science': '#a855f7',
  'military': '#ef4444',
  'amateur': '#ec4899',
  'station': '#ffffff',
  'other': '#9ca3af',
}

const CATEGORY_LABELS: Record<string, string> = {
  'starlink': 'Starlink',
  'gps': 'GPS',
  'weather': 'Weather',
  'science': 'Science',
  'military': 'Military',
  'amateur': 'Amateur',
  'station': 'Station',
  'other': 'Other',
}

// Sky dome visualization component
function SkyDome({
  satellites,
  size
}: {
  satellites: Satellite[]
  size: number
}) {
  const padding = size * 0.06
  const domeRadius = (size - padding * 2) / 2
  const centerX = size / 2
  const centerY = size / 2

  // Convert azimuth/elevation to x,y on dome
  const toXY = (azimuth: number, elevation: number) => {
    const r = domeRadius * (1 - elevation / 90)
    const angle = (azimuth - 90) * (Math.PI / 180)
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    }
  }

  return (
    <svg width={size} height={size} className="block">
      {/* Background circle - black */}
      <circle
        cx={centerX}
        cy={centerY}
        r={domeRadius}
        fill="#000000"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={1}
      />

      {/* Elevation rings (30°, 60°) */}
      {[30, 60].map((elev) => (
        <circle
          key={elev}
          cx={centerX}
          cy={centerY}
          r={domeRadius * (1 - elev / 90)}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={0.5}
          strokeDasharray="4 4"
        />
      ))}

      {/* Cardinal direction lines */}
      <line x1={centerX} y1={centerY - domeRadius} x2={centerX} y2={centerY + domeRadius} stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
      <line x1={centerX - domeRadius} y1={centerY} x2={centerX + domeRadius} y2={centerY} stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />

      {/* Cardinal labels - cream on black */}
      <text x={centerX} y={centerY - domeRadius + 14} textAnchor="middle" fill="#d4d0c8" fontSize={11} fontFamily="system-ui">N</text>
      <text x={centerX} y={centerY + domeRadius - 6} textAnchor="middle" fill="#d4d0c8" fontSize={11} fontFamily="system-ui">S</text>
      <text x={centerX - domeRadius + 10} y={centerY + 4} textAnchor="middle" fill="#d4d0c8" fontSize={11} fontFamily="system-ui">W</text>
      <text x={centerX + domeRadius - 10} y={centerY + 4} textAnchor="middle" fill="#d4d0c8" fontSize={11} fontFamily="system-ui">E</text>

      {/* Zenith marker */}
      <circle cx={centerX} cy={centerY} r={2} fill="#d4d0c8" />

      {/* Satellites */}
      {satellites.map((sat) => {
        const pos = toXY(sat.azimuth, sat.elevation)
        const color = CATEGORY_COLORS[sat.category] || CATEGORY_COLORS.other
        const dotSize = sat.category === 'station' ? 4 : 2 + (sat.elevation / 90) * 2

        return (
          <circle
            key={sat.satid}
            cx={pos.x}
            cy={pos.y}
            r={dotSize}
            fill={color}
            opacity={0.9}
          />
        )
      })}
    </svg>
  )
}

export default function SatellitesAbove() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [containerWidth, setContainerWidth] = useState(400)
  const [data, setData] = useState<SatellitesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [showAllSatellites, setShowAllSatellites] = useState(false)

  // Responsive scaling
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
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        () => {
          setUserCoords({ lat: 51.5074, lon: -0.1278 })
        },
        { timeout: 5000 }
      )
    } else {
      setUserCoords({ lat: 51.5074, lon: -0.1278 })
    }
  }, [])

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!userCoords) return

    try {
      const response = await fetch(
        `/api/satellites-above?lat=${userCoords.lat}&lon=${userCoords.lon}`
      )
      if (!response.ok) throw new Error('Failed to fetch')

      const result = await response.json()
      if (result.error) throw new Error(result.error)

      setData(result)
      setError(null)
    } catch (err) {
      console.error('Error fetching satellites:', err)
      setError('Unable to fetch data')
    } finally {
      setLoading(false)
    }
  }, [userCoords])

  useEffect(() => {
    if (userCoords) {
      fetchData()
      const interval = setInterval(fetchData, 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [fetchData, userCoords])

  // Loading state
  if (loading || !userCoords) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full p-[1em]"
        style={{ fontSize: `${baseFontSize}px`, backgroundColor: '#A6A09B' }}
      >
        <div className="text-[0.875em] text-black/50">Getting location...</div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full p-[1em]"
        style={{ fontSize: `${baseFontSize}px`, backgroundColor: '#A6A09B' }}
      >
        <div className="text-[0.875em] text-red-700">{error || 'No data'}</div>
      </div>
    )
  }

  // Separate Starlink from other satellites
  const starlinkSats = data.satellites.filter(s => s.category === 'starlink')
  const otherSats = data.satellites.filter(s => s.category !== 'starlink')
  const starlinkCount = starlinkSats.length
  const totalCount = data.count

  // Count by category (all satellites)
  const categoryCounts = data.satellites.reduce((acc, sat) => {
    const cat = sat.category || 'other'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate dome size - full width minus padding
  const domeSize = containerWidth - (baseFontSize * 2)

  // Non-Starlink satellites to display
  const displaySatellites = showAllSatellites ? otherSats : otherSats.slice(0, 10)

  return (
    <div
      ref={containerRef}
      className="h-full overflow-hidden flex flex-col p-[1em]"
      style={{ fontSize: `${baseFontSize}px`, backgroundColor: '#A6A09B' }}
    >
      {/* Hero count */}
      <div className="flex items-center gap-[0.5em] mb-[0.75em]">
        <span className="text-[1.75em] font-bold text-green-600">
          {totalCount}
        </span>
        <span className="text-[0.875em] font-medium text-black/70 uppercase tracking-wider">
          Satellites Overhead
        </span>
      </div>

      {/* Sky dome - full width */}
      <div className="flex justify-center mb-[0.75em]">
        <SkyDome satellites={data.satellites} size={domeSize} />
      </div>

      {/* Category legend */}
      <div className="flex flex-wrap justify-center gap-x-[0.75em] gap-y-[0.25em] mb-[0.75em]">
        {Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([cat, count]) => (
            <div key={cat} className="flex items-center gap-[0.25em]">
              <div
                className="w-[0.5em] h-[0.5em] rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[cat] || CATEGORY_COLORS.other }}
              />
              <span className="text-[0.625em] text-black/60">
                {CATEGORY_LABELS[cat] || cat} ({count})
              </span>
            </div>
          ))}
      </div>

      {/* Non-Starlink satellite list */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="text-[0.6875em] text-black/50 uppercase tracking-wider mb-[0.375em]">
          Satellites ({otherSats.length})
        </div>
        <div className="flex-1 overflow-y-auto space-y-[0.25em] pr-[0.25em]">
          {displaySatellites.map((sat) => {
            const color = CATEGORY_COLORS[sat.category] || CATEGORY_COLORS.other
            return (
              <div
                key={sat.satid}
                className="flex items-center justify-between py-[0.25em] px-[0.375em] bg-black/10 rounded-[0.25em]"
              >
                <div className="flex items-center gap-[0.375em] min-w-0">
                  <div
                    className="w-[0.375em] h-[0.375em] rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[0.75em] text-black/80 truncate">
                    {sat.satname}
                  </span>
                </div>
                <div className="flex items-center gap-[0.5em] flex-shrink-0">
                  <span className="text-[0.625em] font-mono text-black/50">
                    {Math.round(sat.satalt)} km
                  </span>
                  <span className="text-[0.625em] font-mono text-black/50">
                    {Math.round(sat.elevation)}°
                  </span>
                </div>
              </div>
            )
          })}
          {otherSats.length > 10 && (
            <button
              onClick={() => setShowAllSatellites(!showAllSatellites)}
              className="w-full text-[0.625em] text-black/40 hover:text-black/60 text-center py-[0.25em]"
            >
              {showAllSatellites ? 'Show less' : `+${otherSats.length - 10} more`}
            </button>
          )}
        </div>

        {/* Starlink note */}
        {starlinkCount > 0 && (
          <div className="text-[0.6875em] text-black/40 mt-[0.5em] pt-[0.5em] border-t border-black/10">
            Including {starlinkCount} Starlink satellites
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] mt-auto border-t border-black/10">
        <span className="text-[0.625em] text-black/50">
          {userCoords.lat.toFixed(1)}°{userCoords.lat >= 0 ? 'N' : 'S'}, {Math.abs(userCoords.lon).toFixed(1)}°{userCoords.lon >= 0 ? 'E' : 'W'}
        </span>
        <span className="text-[0.625em] font-mono text-black/50">
          Radius: 70°
        </span>
      </div>
    </div>
  )
}
