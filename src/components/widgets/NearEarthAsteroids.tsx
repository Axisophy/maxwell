'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { format, addDays } from 'date-fns'

// ===========================================
// NEAR-EARTH ASTEROIDS WIDGET
// ===========================================
// Upcoming asteroid close approaches
// Data: NASA JPL Small-Body Database (CAD API)
// ===========================================

interface Asteroid {
  id: string
  name: string
  closeApproachDate: Date
  distanceKm: number
  distanceLunar: number
  velocityKmS: number
  diameterMin: number
  diameterMax: number
  isPotentiallyHazardous: boolean
}

// Size comparisons
function getSizeComparison(diameterM: number): string {
  if (diameterM < 10) return 'car-sized'
  if (diameterM < 25) return 'bus-sized'
  if (diameterM < 50) return 'house-sized'
  if (diameterM < 100) return 'airplane-sized'
  if (diameterM < 200) return 'football field'
  if (diameterM < 500) return 'stadium-sized'
  return 'mountain-sized'
}

// Distance color
function getDistanceColor(lunarDistance: number): string {
  if (lunarDistance < 1) return '#ef4444'
  if (lunarDistance < 5) return '#f59e0b'
  if (lunarDistance < 10) return '#84cc16'
  return '#22c55e'
}

// ===========================================
// ASTEROID CARD
// ===========================================

interface AsteroidCardProps {
  asteroid: Asteroid
  isNext: boolean
}

function AsteroidCard({ asteroid, isNext }: AsteroidCardProps) {
  const [expanded, setExpanded] = useState(false)
  const avgDiameter = (asteroid.diameterMin + asteroid.diameterMax) / 2
  const sizeDesc = getSizeComparison(avgDiameter)
  const distanceColor = getDistanceColor(asteroid.distanceLunar)

  return (
    <div
      className={`p-3 rounded-lg ${isNext ? 'bg-blue-50 border border-blue-200' : 'bg-[#f5f5f5]'}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isNext && (
              <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[9px] font-semibold rounded">
                NEXT
              </span>
            )}
            {asteroid.isPotentiallyHazardous && (
              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-semibold rounded">
                PHA
              </span>
            )}
          </div>
          <div className="font-mono text-sm font-medium mt-1">{asteroid.name}</div>
          <div className="text-xs text-text-muted">
            {format(asteroid.closeApproachDate, 'MMM d, yyyy • HH:mm')} UTC
          </div>
        </div>

        {/* Distance - always visible */}
        <div className="text-right">
          <div className="font-mono text-lg font-bold" style={{ color: distanceColor }}>
            {asteroid.distanceLunar.toFixed(1)}
          </div>
          <div className="text-[10px] text-text-muted">lunar dist.</div>
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center mt-2 pt-2 border-t border-black/5"
      >
        <svg
          className={`w-4 h-4 text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-black/10 grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-[10px] text-text-muted uppercase tracking-wide">Distance</div>
            <div className="font-mono text-sm font-medium">
              {(asteroid.distanceKm / 1000000).toFixed(2)}M km
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-text-muted uppercase tracking-wide">Size</div>
            <div className="font-mono text-sm font-medium">{avgDiameter.toFixed(0)}m</div>
            <div className="text-[10px] text-text-muted">{sizeDesc}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-text-muted uppercase tracking-wide">Speed</div>
            <div className="font-mono text-sm font-medium">{asteroid.velocityKmS.toFixed(1)} km/s</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===========================================
// DISTANCE SCALE
// ===========================================

interface DistanceScaleProps {
  asteroids: Asteroid[]
}

function DistanceScale({ asteroids }: DistanceScaleProps) {
  const maxLD = 20

  return (
    <div className="p-3 bg-[#f5f5f5] rounded-lg">
      <div className="text-[10px] text-text-muted uppercase tracking-wide mb-3">
        Distance from Earth
      </div>
      <div className="relative h-8">
        {/* Scale line */}
        <div className="absolute bottom-3 left-0 right-0 h-0.5 bg-[#e5e5e5]" />

        {/* Moon marker */}
        <div
          className="absolute bottom-2 flex flex-col items-center"
          style={{ left: `${(1 / maxLD) * 100}%`, transform: 'translateX(-50%)' }}
        >
          <span className="text-sm">🌙</span>
          <span className="text-[8px] text-text-muted">Moon</span>
        </div>

        {/* Asteroid markers */}
        {asteroids.slice(0, 5).map((ast) => {
          const pos = Math.min((ast.distanceLunar / maxLD) * 100, 98)
          return (
            <div
              key={ast.id}
              className="absolute bottom-3"
              style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
              title={`${ast.name}: ${ast.distanceLunar.toFixed(1)} LD`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getDistanceColor(ast.distanceLunar) }}
              />
            </div>
          )
        })}
      </div>

      {/* Scale labels */}
      <div className="flex justify-between font-mono text-[9px] text-text-muted mt-1">
        <span>0</span>
        <span>5 LD</span>
        <span>10 LD</span>
        <span>15 LD</span>
        <span>20 LD</span>
      </div>
    </div>
  )
}

// ===========================================
// ASTEROID LIST WITH EXPANDABLE OVERFLOW
// ===========================================

interface AsteroidListProps {
  asteroids: Asteroid[]
}

function AsteroidList({ asteroids }: AsteroidListProps) {
  const [showAll, setShowAll] = useState(false)

  if (asteroids.length === 0) {
    return (
      <div className="text-center text-sm text-text-muted py-6">
        No close approaches in selected period
      </div>
    )
  }

  const topAsteroids = asteroids.slice(0, 5)
  const remainingAsteroids = asteroids.slice(5)

  return (
    <div className="space-y-2">
      {/* Top 5 as full cards */}
      {topAsteroids.map((asteroid, i) => (
        <AsteroidCard key={asteroid.id} asteroid={asteroid} isNext={i === 0} />
      ))}

      {/* Remaining asteroids */}
      {remainingAsteroids.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            <span>
              {showAll ? 'Hide' : `Show ${remainingAsteroids.length} more`}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAll && (
            <div className="mt-2 border-t border-[#e5e5e5] pt-2 space-y-1">
              {remainingAsteroids.map((asteroid) => (
                <CompactAsteroidRow key={asteroid.id} asteroid={asteroid} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Compact single-line row for overflow asteroids
function CompactAsteroidRow({ asteroid }: { asteroid: Asteroid }) {
  const distanceColor = getDistanceColor(asteroid.distanceLunar)

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#f5f5f5] transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        {asteroid.isPotentiallyHazardous && (
          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
        )}
        <span className="font-mono text-xs truncate">{asteroid.name}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-[10px] text-text-muted">
          {format(asteroid.closeApproachDate, 'MMM d')}
        </span>
        <span className="font-mono text-xs font-medium w-12 text-right" style={{ color: distanceColor }}>
          {asteroid.distanceLunar.toFixed(1)} LD
        </span>
      </div>
    </div>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

type TimeRange = 'week' | 'month' | '3months'

export default function NearEarthAsteroids() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const [showHazardousOnly, setShowHazardousOnly] = useState(false)
  const [showScale, setShowScale] = useState(false)

  // Calculate date range
  const dateRange = useMemo(() => {
    const now = new Date()
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90
    return {
      start: format(now, 'yyyy-MM-dd'),
      end: format(addDays(now, days), 'yyyy-MM-dd'),
    }
  }, [timeRange])

  // Fetch data from local API proxy (avoids CORS issues with JPL API)
  const fetchAsteroids = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const url = new URL('/api/asteroids', window.location.origin)
      url.searchParams.set('date-min', dateRange.start)
      url.searchParams.set('date-max', dateRange.end)
      url.searchParams.set('dist-max', '0.05') // ~20 lunar distances

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error('Failed to fetch asteroid data')

      const data = await response.json()

      if (!data.asteroids || data.asteroids.length === 0) {
        setAsteroids([])
        setLoading(false)
        return
      }

      const parsed: Asteroid[] = data.asteroids.map((ast: {
        id: string
        name: string
        closeApproachDate: string
        distanceKm: number
        distanceLunar: number
        velocityKmS: number
        absoluteMagnitude: number
        distanceAU: number
      }) => {
        const H = ast.absoluteMagnitude
        const diameter = (1329 / Math.sqrt(0.14)) * Math.pow(10, -H / 5) * 1000

        return {
          id: ast.id,
          name: ast.name,
          closeApproachDate: new Date(ast.closeApproachDate),
          distanceKm: ast.distanceKm,
          distanceLunar: ast.distanceLunar,
          velocityKmS: ast.velocityKmS,
          diameterMin: diameter * 0.5,
          diameterMax: diameter * 2,
          isPotentiallyHazardous: H < 22 && ast.distanceAU < 0.05,
        }
      })

      setAsteroids(parsed)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchAsteroids()
  }, [fetchAsteroids])

  // Filter asteroids
  const filteredAsteroids = useMemo(() => {
    if (showHazardousOnly) {
      return asteroids.filter((a) => a.isPotentiallyHazardous)
    }
    return asteroids
  }, [asteroids, showHazardousOnly])

  // Stats
  const stats = useMemo(() => {
    if (asteroids.length === 0) return null

    const closest = asteroids.reduce((min, a) =>
      a.distanceLunar < min.distanceLunar ? a : min
    )
    const hazardous = asteroids.filter((a) => a.isPotentiallyHazardous).length

    return { total: asteroids.length, closest, hazardous }
  }, [asteroids])

  // Loading state
  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-48 text-text-muted">
        Scanning near-Earth space...
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-red-700">{error}</span>
          <button
            onClick={fetchAsteroids}
            className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between gap-2">
        {/* Time range */}
        <div className="flex p-1 rounded-lg" style={{ backgroundColor: '#e5e5e5' }}>
          {(['week', 'month', '3months'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className="px-2 py-1 text-xs font-medium rounded-md transition-colors"
              style={{
                backgroundColor: timeRange === range ? '#ffffff' : 'transparent',
                color: timeRange === range ? '#000000' : 'rgba(0,0,0,0.5)',
              }}
            >
              {range === 'week' ? '7d' : range === 'month' ? '30d' : '90d'}
            </button>
          ))}
        </div>

        {/* PHA filter */}
        <button
          onClick={() => setShowHazardousOnly(!showHazardousOnly)}
          className="px-2 py-1 text-xs font-medium rounded-md transition-colors"
          style={{
            backgroundColor: showHazardousOnly ? '#000000' : '#e5e5e5',
            color: showHazardousOnly ? '#ffffff' : 'rgba(0,0,0,0.5)',
          }}
        >
          PHA only
        </button>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-[#f5f5f5] rounded-lg">
            <div className="font-mono text-xl font-bold">{stats.total}</div>
            <div className="text-[10px] text-text-muted">approaches</div>
          </div>
          <div className="text-center p-2 bg-[#f5f5f5] rounded-lg">
            <div
              className="font-mono text-xl font-bold"
              style={{ color: getDistanceColor(stats.closest.distanceLunar) }}
            >
              {stats.closest.distanceLunar.toFixed(1)}
            </div>
            <div className="text-[10px] text-text-muted">closest (LD)</div>
          </div>
          <div className="text-center p-2 bg-[#f5f5f5] rounded-lg">
            <div className="font-mono text-xl font-bold">{stats.hazardous}</div>
            <div className="text-[10px] text-text-muted">hazardous</div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-[#e5e5e5]" />

      {/* Distance scale (collapsible) */}
      {filteredAsteroids.length > 0 && (
        <div>
          <button
            onClick={() => setShowScale(!showScale)}
            className="w-full flex items-center justify-between"
          >
            <span className="text-sm text-text-muted">Distance scale</span>
            <svg
              className={`w-5 h-5 text-text-muted transition-transform ${showScale ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showScale && (
            <div className="mt-3">
              <DistanceScale asteroids={filteredAsteroids} />
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-[#e5e5e5]" />

      {/* Asteroid list */}
      <AsteroidList asteroids={filteredAsteroids} />
    </div>
  )
}