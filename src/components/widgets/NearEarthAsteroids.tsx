'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { format, addDays, formatDistanceToNow } from 'date-fns'

// ===========================================
// NEAR-EARTH ASTEROIDS WIDGET
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

function getSizeComparison(diameterM: number): string {
  if (diameterM < 10) return 'car'
  if (diameterM < 25) return 'bus'
  if (diameterM < 50) return 'house'
  if (diameterM < 100) return 'aircraft'
  if (diameterM < 200) return 'stadium'
  if (diameterM < 500) return 'skyscraper'
  return 'mountain'
}

function getDistanceStatus(lunarDistance: number): { color: string; label: string } {
  if (lunarDistance < 1) return { color: '#ef4444', label: 'VERY CLOSE' }
  if (lunarDistance < 5) return { color: '#f59e0b', label: 'CLOSE' }
  if (lunarDistance < 10) return { color: '#22c55e', label: 'MODERATE' }
  return { color: '#22c55e', label: 'DISTANT' }
}

// ===========================================
// RADAR DISPLAY - Full Circle
// ===========================================

interface RadarDisplayProps {
  asteroids: Asteroid[]
}

function RadarDisplay({ asteroids }: RadarDisplayProps) {
  const maxLD = Math.max(10, Math.ceil(Math.max(...asteroids.map(a => a.distanceLunar)) / 5) * 5)
  const rings = maxLD <= 10 ? [1, 5, 10] : maxLD <= 20 ? [1, 5, 10, 20] : [1, 5, 10, 20, maxLD]

  // Distribute asteroids evenly around circle by approach date
  const sortedAsteroids = [...asteroids].sort(
    (a, b) => a.closeApproachDate.getTime() - b.closeApproachDate.getTime()
  )

  return (
    <div className="bg-black rounded-lg p-3">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Distance rings */}
        {rings.map((ring) => {
          const r = (ring / maxLD) * 85
          return (
            <circle
              key={ring}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
          )
        })}

        {/* Cross hairs */}
        <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

        {/* Earth at centre */}
        <circle cx="100" cy="100" r="3" fill="#3b82f6" />

        {/* Moon orbit indicator (1 LD) */}
        <circle
          cx="100"
          cy="100"
          r={(1 / maxLD) * 85}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.5"
          strokeDasharray="2,2"
        />

        {/* Asteroids */}
        {sortedAsteroids.map((asteroid, index) => {
          const distance = Math.min(asteroid.distanceLunar, maxLD)
          const angle = sortedAsteroids.length > 1
            ? (index / sortedAsteroids.length) * 2 * Math.PI - Math.PI / 2
            : -Math.PI / 2
          const r = (distance / maxLD) * 85
          const x = 100 + r * Math.cos(angle)
          const y = 100 + r * Math.sin(angle)
          const status = getDistanceStatus(asteroid.distanceLunar)
          const dotSize = asteroid.isPotentiallyHazardous ? 3 : 2

          return (
            <circle
              key={asteroid.id}
              cx={x}
              cy={y}
              r={dotSize}
              fill={status.color}
            />
          )
        })}

        {/* Scale label */}
        <text x="100" y="196" fill="rgba(255,255,255,0.3)" fontSize="6" textAnchor="middle" fontFamily="monospace">
          {maxLD} LD
        </text>
      </svg>
    </div>
  )
}

// ===========================================
// ASTEROID LIST ITEM
// ===========================================

interface AsteroidItemProps {
  asteroid: Asteroid
  isNext: boolean
}

function AsteroidItem({ asteroid, isNext }: AsteroidItemProps) {
  const [expanded, setExpanded] = useState(false)
  const avgDiameter = (asteroid.diameterMin + asteroid.diameterMax) / 2
  const sizeDesc = getSizeComparison(avgDiameter)
  const status = getDistanceStatus(asteroid.distanceLunar)
  const timeUntil = formatDistanceToNow(asteroid.closeApproachDate, { addSuffix: false })

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {isNext && (
              <span className="flex-shrink-0 px-1.5 py-0.5 bg-white/20 text-white text-[10px] font-medium rounded uppercase">
                Next
              </span>
            )}
            {asteroid.isPotentiallyHazardous && (
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
            )}
            <span className="font-mono text-xs text-white truncate">
              {asteroid.name}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[10px] text-white/40">
              {timeUntil}
            </span>
            <div className="text-right">
              <span
                className="font-mono text-sm font-bold"
                style={{ color: status.color }}
              >
                {asteroid.distanceLunar.toFixed(1)}
              </span>
              <span className="text-[10px] text-white/40 ml-1">LD</span>
            </div>
            <svg
              className={`w-3 h-3 text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 border-t border-white/10">
          <div className="text-[10px] text-white/40 mt-2 mb-2">
            {format(asteroid.closeApproachDate, 'EEEE, MMMM d, yyyy')} at {format(asteroid.closeApproachDate, 'HH:mm')} UTC
          </div>

          <div className="grid grid-cols-3 gap-px">
            <div className="bg-white/5 rounded p-2 text-center">
              <div className="text-[10px] text-white/40 uppercase mb-1">Distance</div>
              <div className="font-mono text-sm text-white">
                {(asteroid.distanceKm / 1000000).toFixed(2)}M
              </div>
              <div className="text-[10px] text-white/30">km</div>
            </div>
            <div className="bg-white/5 rounded p-2 text-center">
              <div className="text-[10px] text-white/40 uppercase mb-1">Size</div>
              <div className="font-mono text-sm text-white">
                ~{avgDiameter.toFixed(0)}m
              </div>
              <div className="text-[10px] text-white/30">{sizeDesc}</div>
            </div>
            <div className="bg-white/5 rounded p-2 text-center">
              <div className="text-[10px] text-white/40 uppercase mb-1">Velocity</div>
              <div className="font-mono text-sm text-white">
                {asteroid.velocityKmS.toFixed(1)}
              </div>
              <div className="text-[10px] text-white/30">km/s</div>
            </div>
          </div>

          {asteroid.isPotentiallyHazardous && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-red-400">
              <span className="w-1 h-1 rounded-full bg-red-500" />
              Potentially Hazardous Asteroid (PHA)
            </div>
          )}
        </div>
      )}
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

  const dateRange = useMemo(() => {
    const now = new Date()
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90
    return {
      start: format(now, 'yyyy-MM-dd'),
      end: format(addDays(now, days), 'yyyy-MM-dd'),
    }
  }, [timeRange])

  const fetchAsteroids = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const url = new URL('/api/asteroids', window.location.origin)
      url.searchParams.set('date-min', dateRange.start)
      url.searchParams.set('date-max', dateRange.end)
      url.searchParams.set('dist-max', '0.05')

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchAsteroids()
  }, [fetchAsteroids])

  const filteredAsteroids = useMemo(() => {
    let result = [...asteroids]
    if (showHazardousOnly) {
      result = result.filter((a) => a.isPotentiallyHazardous)
    }
    return result.sort((a, b) => a.closeApproachDate.getTime() - b.closeApproachDate.getTime())
  }, [asteroids, showHazardousOnly])

  const stats = useMemo(() => {
    if (asteroids.length === 0) return null
    const closest = asteroids.reduce((min, a) =>
      a.distanceLunar < min.distanceLunar ? a : min
    )
    const hazardous = asteroids.filter((a) => a.isPotentiallyHazardous).length
    return { total: asteroids.length, closest, hazardous }
  }, [asteroids])

  if (loading) {
    return (
      <div className="bg-[#404040] p-2 md:p-4">
        <div className="flex items-center justify-center h-48">
          <span className="text-sm text-white/50 font-mono">Loading NEO data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#404040] p-2 md:p-4">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="text-sm text-red-400 mb-2">{error}</div>
            <button
              onClick={fetchAsteroids}
              className="px-3 py-1.5 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#404040] p-2 md:p-4 space-y-px">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-px">
          <div className="bg-black rounded-lg p-3 text-center">
            <div className="font-mono text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-[10px] text-white/40 uppercase">Approaches</div>
          </div>
          <div className="bg-black rounded-lg p-3 text-center">
            <div
              className="font-mono text-2xl font-bold"
              style={{ color: getDistanceStatus(stats.closest.distanceLunar).color }}
            >
              {stats.closest.distanceLunar.toFixed(1)}
            </div>
            <div className="text-[10px] text-white/40 uppercase">Closest (LD)</div>
          </div>
          <div className="bg-black rounded-lg p-3 text-center">
            <div className="font-mono text-2xl font-bold text-white">{stats.hazardous}</div>
            <div className="text-[10px] text-white/40 uppercase">Hazardous</div>
          </div>
        </div>
      )}

      {/* Radar */}
      {filteredAsteroids.length > 0 && (
        <RadarDisplay asteroids={filteredAsteroids} />
      )}

      {/* Filters */}
      <div className="bg-black rounded-lg p-3">
        <div className="flex items-center justify-between gap-2">
          {/* Time range - yellow/black selector */}
          <div className="flex gap-px">
            {(['week', 'month', '3months'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  px-2 py-1.5 text-xs font-medium rounded-lg transition-colors uppercase
                  ${timeRange === range
                    ? 'bg-[#ffdf20] text-[#404040]'
                    : 'bg-white/10 text-white/60 hover:text-white'
                  }
                `}
              >
                {range === 'week' ? '7d' : range === 'month' ? '30d' : '90d'}
              </button>
            ))}
          </div>

          {/* PHA filter */}
          <button
            onClick={() => setShowHazardousOnly(!showHazardousOnly)}
            className={`
              flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors
              ${showHazardousOnly
                ? 'bg-red-500/30 text-red-400'
                : 'bg-white/10 text-white/60 hover:text-white'
              }
            `}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            PHA
          </button>
        </div>
      </div>

      {/* Asteroid list */}
      {filteredAsteroids.length === 0 ? (
        <div className="bg-black rounded-lg p-3">
          <div className="text-center text-sm text-white/50">
            No close approaches in selected period
          </div>
        </div>
      ) : (
        <div className="space-y-px">
          {filteredAsteroids.slice(0, 5).map((asteroid, i) => (
            <AsteroidItem key={asteroid.id} asteroid={asteroid} isNext={i === 0} />
          ))}
          {filteredAsteroids.length > 5 && (
            <div className="bg-black rounded-lg p-3 text-center">
              <span className="text-xs text-white/40">
                +{filteredAsteroids.length - 5} more approaches
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
