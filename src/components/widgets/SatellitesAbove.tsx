'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// SATELLITES ABOVE
// ===========================================
// Shows satellites currently overhead
// Data: N2YO API
// ===========================================

interface Satellite {
  satid: number
  satname: string
  intDesignator: string
  launchDate: string
  satlat: number
  satlng: number
  satalt: number
  azimuth: number    // 0-360 degrees from North
  elevation: number  // 0-90 degrees above horizon
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
  const padding = size * 0.08
  const domeRadius = (size - padding * 2) / 2
  const centerX = size / 2
  const centerY = size / 2

  // Convert azimuth/elevation to x,y on dome
  const toXY = (azimuth: number, elevation: number) => {
    // Elevation: 90° = center, 0° = edge
    const r = domeRadius * (1 - elevation / 90)
    // Azimuth: 0° = North (top), clockwise
    const angle = (azimuth - 90) * (Math.PI / 180)
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    }
  }

  return (
    <svg width={size} height={size} className="block">
      {/* Background */}
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

      {/* Cardinal directions */}
      <line x1={centerX} y1={centerY - domeRadius} x2={centerX} y2={centerY + domeRadius} stroke="#334155" strokeWidth={0.5} />
      <line x1={centerX - domeRadius} y1={centerY} x2={centerX + domeRadius} y2={centerY} stroke="#334155" strokeWidth={0.5} />

      {/* Cardinal labels */}
      <text x={centerX} y={centerY - domeRadius + 14} textAnchor="middle" fill="#64748b" fontSize={10} fontFamily="system-ui">N</text>
      <text x={centerX} y={centerY + domeRadius - 6} textAnchor="middle" fill="#64748b" fontSize={10} fontFamily="system-ui">S</text>
      <text x={centerX - domeRadius + 8} y={centerY + 4} textAnchor="middle" fill="#64748b" fontSize={10} fontFamily="system-ui">W</text>
      <text x={centerX + domeRadius - 8} y={centerY + 4} textAnchor="middle" fill="#64748b" fontSize={10} fontFamily="system-ui">E</text>

      {/* Zenith marker */}
      <circle cx={centerX} cy={centerY} r={2} fill="#64748b" />

      {/* Satellites */}
      {satellites.map((sat) => {
        const pos = toXY(sat.azimuth, sat.elevation)
        const category = CATEGORIES[sat.category] || CATEGORIES.other
        // Size based on elevation (higher = closer = larger)
        const dotSize = 2 + (sat.elevation / 90) * 2

        return (
          <g key={sat.satid}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={dotSize}
              fill={category.color}
              opacity={0.9}
            />
          </g>
        )
      })}

      {/* Horizon label */}
      <text x={centerX + domeRadius - 24} y={centerY + domeRadius - 4} fill="#475569" fontSize={8} fontFamily="system-ui">0°</text>
      <text x={centerX + 4} y={centerY - 4} fill="#475569" fontSize={8} fontFamily="system-ui">90°</text>
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
      const interval = setInterval(fetchData, 60 * 1000) // Update every minute
      return () => clearInterval(interval)
    }
  }, [fetchData, userCoords])

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

  // Count by category
  const categoryCounts = data.satellites.reduce((acc, sat) => {
    const cat = sat.category || 'other'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate dome size - use available width minus padding
  const padding = baseFontSize * 2 // 1em padding on each side
  const domeSize = containerWidth - padding

  return (
    <div
      ref={containerRef}
      className="h-full bg-[#1a1a1e] overflow-hidden flex flex-col p-[1em]"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header - single line */}
      <div className="flex items-center justify-between mb-[0.75em]">
        <div className="flex items-center gap-[0.5em]">
          <span className="relative flex h-[0.5em] w-[0.5em]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-cyan-500"></span>
          </span>
          <span className="text-[0.875em] font-medium text-white">
            {data.count} satellites overhead right now
          </span>
        </div>
        <span className="text-[0.6875em] text-white/40">N2YO</span>
      </div>

      {/* Sky dome - full width */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="bg-white/5 rounded-[0.5em] p-[0.5em]">
          <SkyDome satellites={data.satellites} size={domeSize - baseFontSize} />
        </div>
      </div>

      {/* Category legend */}
      <div className="flex flex-wrap justify-center gap-x-[0.75em] gap-y-[0.25em] mt-[0.75em]">
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] mt-[0.5em] border-t border-white/10">
        <span className="text-[0.6875em] text-white/40">
          Sky view from {data.location.name || `${userCoords.lat.toFixed(1)}°, ${userCoords.lon.toFixed(1)}°`}
        </span>
        <span className="text-[0.6875em] font-mono text-white/40">
          Radius: 70°
        </span>
      </div>
    </div>
  )
}
