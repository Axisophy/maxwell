'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// SHIPS LIVE
// ===========================================
// Shows ships nearby based on AIS data
// Data: AIS (currently mock, upgrade for production)
// Design: Dark theme (#1a1a1e) with nautical feel
// ===========================================

interface Ship {
  mmsi: string
  name: string
  type: 'cargo' | 'tanker' | 'passenger' | 'fishing' | 'tug' | 'sailing' | 'other'
  flag: string
  latitude: number
  longitude: number
  course: number
  speed: number
  destination?: string
  distanceNm: number
}

interface ShipData {
  timestamp: string
  location: { lat: number; lon: number }
  radius: number
  count: number
  ships: Ship[]
  nearest: Ship | null
  stats: {
    cargoCount: number
    tankerCount: number
    passengerCount: number
    otherCount: number
  }
}

const TYPE_COLORS: Record<string, string> = {
  cargo: '#3b82f6',
  tanker: '#f59e0b',
  passenger: '#22c55e',
  fishing: '#06b6d4',
  tug: '#8b5cf6',
  sailing: '#ec4899',
  military: '#ef4444',
  other: '#6b7280',
}

const TYPE_LABELS: Record<string, string> = {
  cargo: 'Cargo',
  tanker: 'Tanker',
  passenger: 'Passenger',
  fishing: 'Fishing',
  tug: 'Tug',
  sailing: 'Sailing',
  military: 'Military',
  other: 'Other',
}

export default function ShipsLive() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [data, setData] = useState<ShipData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setUserCoords({ lat: 50.8, lon: -1.1 }) // Default to Southampton
      )
    } else {
      setUserCoords({ lat: 50.8, lon: -1.1 })
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (!userCoords) return
    try {
      const response = await fetch(
        `/api/ships-nearby?lat=${userCoords.lat}&lon=${userCoords.lon}&radius=100`
      )
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError('Unable to load ship data')
    } finally {
      setLoading(false)
    }
  }, [userCoords])

  useEffect(() => {
    if (userCoords) {
      fetchData()
      const interval = setInterval(fetchData, 60 * 1000) // 1 minute
      return () => clearInterval(interval)
    }
  }, [fetchData, userCoords])

  const displayShips = showAll ? data?.ships : data?.ships.slice(0, 5)
  const remainingCount = (data?.ships.length || 0) - 5

  if (loading || !userCoords) {
    return (
      <div
        ref={containerRef}
        className="bg-[#1a1a1e] p-[1em] h-full flex items-center justify-center"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-white/50 text-[0.875em]">
          {!userCoords ? 'Getting location...' : 'Scanning sea traffic...'}
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
        <span className="text-[1.75em] font-bold text-blue-400">
          {data.count}
        </span>
        <span className="text-[0.875em] font-medium text-white/70 uppercase tracking-wider">
          Ships Nearby
        </span>
      </div>

      {/* Nearest ship */}
      {data.nearest && (
        <div className="bg-white/5 rounded-[0.5em] p-[0.75em] mb-[0.75em]">
          <div className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.25em]">
            Nearest Vessel
          </div>
          <div className="text-[1.125em] font-bold text-white">
            {data.nearest.name}
          </div>
          <div className="flex items-center gap-[0.5em] text-[0.75em] text-white/60 mt-[0.25em]">
            <span>{TYPE_LABELS[data.nearest.type]}</span>
            <span>·</span>
            <span>{data.nearest.flag}</span>
          </div>
          <div className="text-[0.875em] text-white/80 mt-[0.375em]">
            <span className="font-mono">{data.nearest.distanceNm.toFixed(1)}</span> nm away
            {data.nearest.speed > 0 && (
              <span className="text-white/50">
                {' '}· {data.nearest.speed.toFixed(1)} knots
              </span>
            )}
          </div>
          {data.nearest.destination && (
            <div className="text-[0.6875em] text-white/40 mt-[0.25em]">
              → {data.nearest.destination}
            </div>
          )}
        </div>
      )}

      {/* Type breakdown */}
      <div className="grid grid-cols-2 gap-[0.375em] mb-[0.75em]">
        {[
          { type: 'cargo', count: data.stats.cargoCount },
          { type: 'tanker', count: data.stats.tankerCount },
          { type: 'passenger', count: data.stats.passengerCount },
          { type: 'other', count: data.stats.otherCount },
        ].map(({ type, count }) => (
          <div key={type} className="flex items-center gap-[0.375em]">
            <div
              className="w-[0.5em] h-[0.5em] rounded-sm"
              style={{ backgroundColor: TYPE_COLORS[type] }}
            />
            <span className="text-[0.6875em] text-white/60">
              {TYPE_LABELS[type]} ({count})
            </span>
          </div>
        ))}
      </div>

      {/* Ship list */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.375em]">
          Nearby Vessels
        </div>
        <div className="flex-1 overflow-y-auto space-y-[0.25em]">
          {displayShips?.map((ship) => (
            <div
              key={ship.mmsi}
              className="flex items-center justify-between py-[0.25em] border-b border-white/5"
            >
              <div className="flex items-center gap-[0.375em] min-w-0">
                <div
                  className="w-[0.375em] h-[0.375em] rounded-sm flex-shrink-0"
                  style={{ backgroundColor: TYPE_COLORS[ship.type] }}
                />
                <span className="text-[0.75em] text-white/80 truncate">
                  {ship.name}
                </span>
              </div>
              <span className="text-[0.625em] font-mono text-white/50 flex-shrink-0">
                {ship.distanceNm.toFixed(1)} nm
              </span>
            </div>
          ))}
        </div>

        {remainingCount > 0 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-[0.75em] text-white/40 hover:text-white/60 py-[0.5em] mt-[0.25em]"
          >
            {showAll ? 'Show less' : `+${remainingCount} more vessels`}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] mt-auto border-t border-white/10">
        <span className="text-[0.625em] text-white/40">
          {data.radius}nm radius
        </span>
        <span className="text-[0.625em] text-white/40">
          AIS data
        </span>
      </div>
    </div>
  )
}
