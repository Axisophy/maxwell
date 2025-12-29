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
// - Hero count with Starlink breakdown
// - Full-width sky dome (no wrapper background)
// - Non-Starlink satellites always visible
// - Starlink satellites in collapsible section
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

// Satellite categories and their colors
const CATEGORIES: Record<string, { color: string; label: string }> = {
  'starlink': { color: '#22d3ee', label: 'Starlink' },
  'gps': { color: '#22c55e', label: 'GPS' },
  'weather': { color: '#f59e0b', label: 'Weather' },
  'science': { color: '#a855f7', label: 'Science' },
  'military': { color: '#ef4444', label: 'Military' },
  'amateur': { color: '#ec4899', label: 'Amateur' },
  'station': { color: '#ffffff', label: 'Station' },
  'other': { color: '#6b7280', label: 'Other' },
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
      {/* Background circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={domeRadius}
        fill="#0f172a"
        stroke="#334155"
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
          stroke="#334155"
          strokeWidth={0.5}
          strokeDasharray="4 4"
        />
      ))}

      {/* Cardinal direction lines */}
      <line x1={centerX} y1={centerY - domeRadius} x2={centerX} y2={centerY + domeRadius} stroke="#334155" strokeWidth={0.5} />
      <line x1={centerX - domeRadius} y1={centerY} x2={centerX + domeRadius} y2={centerY} stroke="#334155" strokeWidth={0.5} />

      {/* Cardinal labels */}
      <text x={centerX} y={centerY - domeRadius + 14} textAnchor="middle" fill="#64748b" fontSize={11} fontFamily="system-ui">N</text>
      <text x={centerX} y={centerY + domeRadius - 6} textAnchor="middle" fill="#64748b" fontSize={11} fontFamily="system-ui">S</text>
      <text x={centerX - domeRadius + 10} y={centerY + 4} textAnchor="middle" fill="#64748b" fontSize={11} fontFamily="system-ui">W</text>
      <text x={centerX + domeRadius - 10} y={centerY + 4} textAnchor="middle" fill="#64748b" fontSize={11} fontFamily="system-ui">E</text>

      {/* Zenith marker */}
      <circle cx={centerX} cy={centerY} r={2} fill="#64748b" />

      {/* Satellites */}
      {satellites.map((sat) => {
        const pos = toXY(sat.azimuth, sat.elevation)
        const category = CATEGORIES[sat.category] || CATEGORIES.other
        const dotSize = 2 + (sat.elevation / 90) * 2

        return (
          <circle
            key={sat.satid}
            cx={pos.x}
            cy={pos.y}
            r={dotSize}
            fill={category.color}
            opacity={0.9}
          />
        )
      })}

      {/* Elevation labels */}
      <text x={centerX + 4} y={centerY - 4} fill="#475569" fontSize={9} fontFamily="system-ui">90°</text>
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
  const [showStarlink, setShowStarlink] = useState(false)

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
          // Default to London
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
        className="flex items-center justify-center h-full bg-[#1a1a1e] p-[1em]"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-[0.875em] text-white/50">Getting location...</div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full bg-[#1a1a1e] p-[1em]"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-[0.875em] text-red-400">{error || 'No data'}</div>
      </div>
    )
  }

  // Separate Starlink from other satellites
  const starlinkSats = data.satellites.filter(s => s.category === 'starlink')
  const otherSats = data.satellites.filter(s => s.category !== 'starlink')
  const starlinkCount = starlinkSats.length
  const otherCount = otherSats.length
  const totalCount = data.count

  // Count by category (excluding Starlink for legend)
  const categoryCounts = otherSats.reduce((acc, sat) => {
    const cat = sat.category || 'other'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate dome size - full width minus padding
  const domeSize = containerWidth - (baseFontSize * 2)

  // Satellites to show on dome (all if showStarlink, otherwise just others)
  const visibleSats = showStarlink ? data.satellites : otherSats

  return (
    <div
      ref={containerRef}
      className="h-full bg-[#1a1a1e] overflow-hidden flex flex-col p-[1em]"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Hero count */}
      <div className="text-center mb-[0.75em]">
        <div className="text-[2.5em] font-light text-white leading-none">
          {totalCount}
        </div>
        <div className="text-[0.875em] text-white/60 mt-[0.25em]">
          satellites overhead
        </div>
        <div className="text-[0.75em] text-white/40 mt-[0.125em]">
          {otherCount} excluding Starlink
        </div>
      </div>

      {/* Sky dome - full width, no wrapper */}
      <div className="flex justify-center mb-[0.75em]">
        <SkyDome satellites={visibleSats} size={domeSize} />
      </div>

      {/* Category legend */}
      <div className="flex flex-wrap justify-center gap-x-[0.75em] gap-y-[0.25em] mb-[0.75em]">
        {Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([cat, count]) => {
            const category = CATEGORIES[cat] || CATEGORIES.other
            return (
              <div key={cat} className="flex items-center gap-[0.25em]">
                <div
                  className="w-[0.5em] h-[0.5em] rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-[0.625em] text-white/50">
                  {category.label} ({count})
                </span>
              </div>
            )
          })}
      </div>

      {/* Non-Starlink satellite list - always visible */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="text-[0.6875em] text-white/40 uppercase tracking-wider mb-[0.375em]">
          Satellites ({otherCount})
        </div>
        <div className="flex-1 overflow-y-auto space-y-[0.25em] pr-[0.25em]">
          {otherSats.slice(0, 10).map((sat) => {
            const category = CATEGORIES[sat.category] || CATEGORIES.other
            return (
              <div
                key={sat.satid}
                className="flex items-center justify-between py-[0.25em] border-b border-white/5"
              >
                <div className="flex items-center gap-[0.375em] min-w-0">
                  <div
                    className="w-[0.375em] h-[0.375em] rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-[0.75em] text-white/80 truncate">
                    {sat.satname}
                  </span>
                </div>
                <div className="flex items-center gap-[0.5em] flex-shrink-0">
                  <span className="text-[0.625em] font-mono text-white/40">
                    {Math.round(sat.satalt)} km
                  </span>
                  <span className="text-[0.625em] font-mono text-white/40">
                    {Math.round(sat.elevation)}°
                  </span>
                </div>
              </div>
            )
          })}
          {otherCount > 10 && (
            <div className="text-[0.625em] text-white/30 text-center py-[0.25em]">
              +{otherCount - 10} more
            </div>
          )}
        </div>

        {/* Starlink section - collapsible */}
        {starlinkCount > 0 && (
          <div className="mt-[0.5em] pt-[0.5em] border-t border-white/10">
            <button
              onClick={() => setShowStarlink(!showStarlink)}
              className="w-full flex items-center justify-between py-[0.375em] text-left"
            >
              <div className="flex items-center gap-[0.375em]">
                <div
                  className="w-[0.375em] h-[0.375em] rounded-full"
                  style={{ backgroundColor: CATEGORIES.starlink.color }}
                />
                <span className="text-[0.75em] text-white/60">
                  Starlink ({starlinkCount})
                </span>
              </div>
              <span className={`text-white/40 text-[0.75em] transition-transform ${showStarlink ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showStarlink && (
              <div className="max-h-[8em] overflow-y-auto space-y-[0.25em] mt-[0.25em] pr-[0.25em]">
                {starlinkSats.slice(0, 20).map((sat) => (
                  <div
                    key={sat.satid}
                    className="flex items-center justify-between py-[0.125em]"
                  >
                    <span className="text-[0.625em] text-white/50 truncate">
                      {sat.satname}
                    </span>
                    <span className="text-[0.5625em] font-mono text-white/30">
                      {Math.round(sat.elevation)}°
                    </span>
                  </div>
                ))}
                {starlinkCount > 20 && (
                  <div className="text-[0.5625em] text-white/30 text-center py-[0.125em]">
                    +{starlinkCount - 20} more
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] mt-[0.5em] border-t border-white/10">
        <span className="text-[0.625em] text-white/40">
          {userCoords.lat.toFixed(1)}°{userCoords.lat >= 0 ? 'N' : 'S'}, {Math.abs(userCoords.lon).toFixed(1)}°{userCoords.lon >= 0 ? 'E' : 'W'}
        </span>
        <span className="text-[0.625em] font-mono text-white/40">
          Radius: 70°
        </span>
      </div>
    </div>
  )
}
