'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { format, addDays, formatDistanceToNow } from 'date-fns'

// ===========================================
// NEAR-EARTH ASTEROIDS WIDGET
// ===========================================
// Upcoming asteroid close approaches
// Data: NASA JPL Small-Body Database (CAD API)
//
// Design notes:
// - NO title/live dot/source (WidgetFrame handles those)
// - Warm grey background (#A6A09B)
// - 3/4 circle radar display (black)
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
  if (diameterM < 10) return 'car'
  if (diameterM < 25) return 'bus'
  if (diameterM < 50) return 'house'
  if (diameterM < 100) return 'aircraft'
  if (diameterM < 200) return 'stadium'
  if (diameterM < 500) return 'skyscraper'
  return 'mountain'
}

// Status based on distance
function getDistanceStatus(lunarDistance: number): { color: string; label: string } {
  if (lunarDistance < 1) return { color: '#ef4444', label: 'VERY CLOSE' }
  if (lunarDistance < 5) return { color: '#f59e0b', label: 'CLOSE' }
  if (lunarDistance < 10) return { color: '#22c55e', label: 'MODERATE' }
  return { color: '#22c55e', label: 'DISTANT' }
}

// ===========================================
// 3/4 CIRCLE RADAR DISPLAY
// ===========================================

interface RadarDisplayProps {
  asteroids: Asteroid[]
}

function RadarDisplay({ asteroids }: RadarDisplayProps) {
  // Show ALL asteroids
  const maxLD = Math.max(10, Math.ceil(Math.max(...asteroids.map(a => a.distanceLunar)) / 5) * 5)

  const generateRings = (max: number): number[] => {
    if (max <= 10) return [1, 5, 10]
    if (max <= 20) return [1, 5, 10, 20]
    return [1, 5, 10, 20, Math.ceil(max / 5) * 5]
  }
  const rings = generateRings(maxLD)

  // 3/4 circle geometry
  // Arc runs from 135° (bottom-left) clockwise through top to 45° (bottom-right)
  const startAngle = 135
  const arcSpan = 270

  // Distribute asteroids evenly around the arc by approach date
  const sortedAsteroids = [...asteroids].sort(
    (a, b) => a.closeApproachDate.getTime() - b.closeApproachDate.getTime()
  )

  return (
    <div className="relative w-full" style={{ aspectRatio: '1' }}>
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Black background - 3/4 circle */}
        <path
          d={`M 200 200 L ${200 + 165 * Math.cos(135 * Math.PI / 180)} ${200 + 165 * Math.sin(135 * Math.PI / 180)} A 165 165 0 1 1 ${200 + 165 * Math.cos(45 * Math.PI / 180)} ${200 + 165 * Math.sin(45 * Math.PI / 180)} Z`}
          fill="#000000"
        />

        {/* Distance ring arcs */}
        {rings.map((ring) => {
          const r = (ring / maxLD) * 165
          const x1 = 200 + r * Math.cos(135 * Math.PI / 180)
          const y1 = 200 + r * Math.sin(135 * Math.PI / 180)
          const x2 = 200 + r * Math.cos(45 * Math.PI / 180)
          const y2 = 200 + r * Math.sin(45 * Math.PI / 180)
          return (
            <g key={ring}>
              <path
                d={`M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />
              {/* Distance label at E position */}
              <text
                x={200 + r + 5}
                y={200}
                fill="#d4d0c8"
                fontSize="9"
                fontFamily="monospace"
                dominantBaseline="middle"
              >
                {ring}
              </text>
            </g>
          )
        })}

        {/* Cardinal labels */}
        <text x="200" y="30" fill="#d4d0c8" fontSize="11" textAnchor="middle">N</text>
        <text x="370" y="205" fill="#d4d0c8" fontSize="11" textAnchor="middle">E</text>
        <text x="30" y="205" fill="#d4d0c8" fontSize="11" textAnchor="middle">W</text>

        {/* Earth at centre */}
        <circle cx="200" cy="200" r="6" fill="#0ea5e9" />
        <text x="200" y="220" fill="#d4d0c8" fontSize="8" textAnchor="middle" fontFamily="monospace">EARTH</text>

        {/* Moon marker at 1 LD (on the N axis) */}
        <circle cx="200" cy={200 - (1 / maxLD) * 165} r="3" fill="rgba(255,255,255,0.5)" />

        {/* All asteroids */}
        {sortedAsteroids.map((asteroid, index) => {
          const distance = Math.min(asteroid.distanceLunar, maxLD)
          const arcPosition = sortedAsteroids.length > 1
            ? index / (sortedAsteroids.length - 1)
            : 0.5
          // Map position to angle
          const angle = (startAngle + arcPosition * arcSpan) * Math.PI / 180
          const r = (distance / maxLD) * 165
          const x = 200 + r * Math.cos(angle)
          const y = 200 + r * Math.sin(angle)
          const status = getDistanceStatus(asteroid.distanceLunar)
          const dotSize = asteroid.isPotentiallyHazardous ? 5 : 3

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

        {/* LD legend */}
        <text x="350" y="380" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace" textAnchor="end">
          LD = lunar distance
        </text>
      </svg>
    </div>
  )
}

// ===========================================
// ASTEROID CARD (Compact)
// ===========================================

interface AsteroidCardProps {
  asteroid: Asteroid
  isNext: boolean
}

function AsteroidCard({ asteroid, isNext }: AsteroidCardProps) {
  const [expanded, setExpanded] = useState(false)
  const avgDiameter = (asteroid.diameterMin + asteroid.diameterMax) / 2
  const sizeDesc = getSizeComparison(avgDiameter)
  const status = getDistanceStatus(asteroid.distanceLunar)
  const timeUntil = formatDistanceToNow(asteroid.closeApproachDate, { addSuffix: false })

  return (
    <div
      className={`rounded-[0.375em] transition-colors ${
        isNext
          ? 'bg-black/15 border border-black/20'
          : 'bg-black/10 hover:bg-black/[0.12]'
      }`}
    >
      {/* Main row - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-[0.625em] text-left"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left: Name + badges */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {isNext && (
              <span className="flex-shrink-0 px-[0.375em] py-[0.125em] bg-black/20 text-black text-[0.5625em] font-semibold rounded uppercase tracking-wider">
                Next
              </span>
            )}
            {asteroid.isPotentiallyHazardous && (
              <span className="flex-shrink-0 w-[0.5em] h-[0.5em] rounded-full bg-red-500" />
            )}
            <span className="font-mono text-[0.875em] text-black truncate">
              {asteroid.name}
            </span>
          </div>

          {/* Right: Distance */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[0.75em] text-black/50">
              {timeUntil}
            </span>
            <div className="text-right">
              <span
                className="font-mono text-[1.125em] font-bold"
                style={{ color: status.color }}
              >
                {asteroid.distanceLunar.toFixed(1)}
              </span>
              <span className="text-[0.625em] text-black/50 ml-1">LD</span>
            </div>
            <svg
              className={`w-4 h-4 text-black/30 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-[0.625em] pb-[0.625em] pt-0">
          <div className="pt-[0.5em] border-t border-black/10">
            {/* Date/time */}
            <div className="text-[0.75em] text-black/50 mb-[0.75em]">
              {format(asteroid.closeApproachDate, 'EEEE, MMMM d, yyyy')} at {format(asteroid.closeApproachDate, 'HH:mm')} UTC
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-[0.5em]">
              <div className="bg-black/5 rounded-[0.25em] p-[0.5em] text-center">
                <div className="text-[0.625em] text-black/40 uppercase tracking-wider mb-[0.25em]">Distance</div>
                <div className="font-mono text-[0.875em] text-black">
                  {(asteroid.distanceKm / 1000000).toFixed(2)}M
                </div>
                <div className="text-[0.5625em] text-black/40">km</div>
              </div>
              <div className="bg-black/5 rounded-[0.25em] p-[0.5em] text-center">
                <div className="text-[0.625em] text-black/40 uppercase tracking-wider mb-[0.25em]">Size</div>
                <div className="font-mono text-[0.875em] text-black">
                  ~{avgDiameter.toFixed(0)}m
                </div>
                <div className="text-[0.5625em] text-black/40">{sizeDesc}</div>
              </div>
              <div className="bg-black/5 rounded-[0.25em] p-[0.5em] text-center">
                <div className="text-[0.625em] text-black/40 uppercase tracking-wider mb-[0.25em]">Velocity</div>
                <div className="font-mono text-[0.875em] text-black">
                  {asteroid.velocityKmS.toFixed(1)}
                </div>
                <div className="text-[0.5625em] text-black/40">km/s</div>
              </div>
            </div>

            {/* Hazard notice */}
            {asteroid.isPotentiallyHazardous && (
              <div className="mt-[0.5em] flex items-center gap-2 text-[0.6875em] text-red-600">
                <span className="w-1 h-1 rounded-full bg-red-500" />
                Potentially Hazardous Asteroid (PHA)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Compact row for overflow list
function CompactAsteroidRow({ asteroid }: { asteroid: Asteroid }) {
  const status = getDistanceStatus(asteroid.distanceLunar)

  return (
    <div className="flex items-center justify-between py-[0.375em] px-[0.5em] rounded-[0.25em] hover:bg-black/5 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        {asteroid.isPotentiallyHazardous && (
          <span className="flex-shrink-0 w-[0.375em] h-[0.375em] rounded-full bg-red-500" />
        )}
        <span className="font-mono text-[0.75em] text-black/70 truncate">{asteroid.name}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-[0.6875em] text-black/50">
          {format(asteroid.closeApproachDate, 'MMM d')}
        </span>
        <span
          className="font-mono text-[0.75em] font-medium w-10 text-right"
          style={{ color: status.color }}
        >
          {asteroid.distanceLunar.toFixed(1)}
        </span>
      </div>
    </div>
  )
}

// ===========================================
// ASTEROID LIST WITH OVERFLOW
// ===========================================

interface AsteroidListProps {
  asteroids: Asteroid[]
}

function AsteroidList({ asteroids }: AsteroidListProps) {
  const [showAll, setShowAll] = useState(false)

  if (asteroids.length === 0) {
    return (
      <div className="text-center text-[0.875em] text-black/50 py-[1.5em]">
        No close approaches in selected period
      </div>
    )
  }

  const topAsteroids = asteroids.slice(0, 4)
  const remainingAsteroids = asteroids.slice(4)

  return (
    <div className="space-y-[0.375em]">
      {topAsteroids.map((asteroid, i) => (
        <AsteroidCard key={asteroid.id} asteroid={asteroid} isNext={i === 0} />
      ))}

      {remainingAsteroids.length > 0 && (
        <div className="pt-[0.25em]">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center gap-2 py-[0.5em] text-[0.75em] text-black/50 hover:text-black/70 transition-colors"
          >
            <span>{showAll ? 'Show less' : `${remainingAsteroids.length} more approaches`}</span>
            <svg
              className={`w-3 h-3 transition-transform ${showAll ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAll && (
            <div className="mt-[0.25em] border-t border-black/10 pt-[0.375em]">
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

// ===========================================
// MAIN WIDGET
// ===========================================

type TimeRange = 'week' | 'month' | '3months'

export default function NearEarthAsteroids() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const [showHazardousOnly, setShowHazardousOnly] = useState(false)

  // Responsive scaling
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Calculate date range
  const dateRange = useMemo(() => {
    const now = new Date()
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90
    return {
      start: format(now, 'yyyy-MM-dd'),
      end: format(addDays(now, days), 'yyyy-MM-dd'),
    }
  }, [timeRange])

  // Fetch data
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
    let result = [...asteroids]
    if (showHazardousOnly) {
      result = result.filter((a) => a.isPotentiallyHazardous)
    }
    // Sort by approach date
    return result.sort((a, b) => a.closeApproachDate.getTime() - b.closeApproachDate.getTime())
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
      <div
        ref={containerRef}
        className="p-[1em] min-h-[300px] flex items-center justify-center"
        style={{ fontSize: `${baseFontSize}px`, backgroundColor: '#A6A09B' }}
      >
        <div className="flex items-center gap-3 text-black/50">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[0.875em] font-mono tracking-wide">SCANNING NEO TRAJECTORIES</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        ref={containerRef}
        className="p-[1em]"
        style={{ fontSize: `${baseFontSize}px`, backgroundColor: '#A6A09B' }}
      >
        <div className="bg-red-500/10 border border-red-500/30 rounded-[0.5em] p-[0.75em] flex items-center justify-between">
          <span className="text-[0.875em] text-red-700">{error}</span>
          <button
            onClick={fetchAsteroids}
            className="px-[0.75em] py-[0.375em] bg-red-600 text-white text-[0.75em] font-medium rounded-[0.25em] hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="p-[1em] h-full overflow-hidden flex flex-col"
      style={{ fontSize: `${baseFontSize}px`, backgroundColor: '#A6A09B' }}
    >
      {/* Header stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-[0.5em] mb-[1em]">
          <div className="bg-black/10 rounded-[0.375em] p-[0.625em] text-center">
            <div className="font-mono text-[1.5em] font-bold text-black">{stats.total}</div>
            <div className="text-[0.625em] text-black/50 uppercase tracking-wider">Approaches</div>
          </div>
          <div className="bg-black/10 rounded-[0.375em] p-[0.625em] text-center">
            <div
              className="font-mono text-[1.5em] font-bold"
              style={{ color: getDistanceStatus(stats.closest.distanceLunar).color }}
            >
              {stats.closest.distanceLunar.toFixed(1)}
            </div>
            <div className="text-[0.625em] text-black/50 uppercase tracking-wider">Closest (LD)</div>
          </div>
          <div className="bg-black/10 rounded-[0.375em] p-[0.625em] text-center">
            <div className="font-mono text-[1.5em] font-bold text-black">
              {stats.hazardous}
            </div>
            <div className="text-[0.625em] text-black/50 uppercase tracking-wider">Hazardous</div>
          </div>
        </div>
      )}

      {/* Radar display */}
      {filteredAsteroids.length > 0 && (
        <div className="mb-[1em]">
          <RadarDisplay asteroids={filteredAsteroids} />
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between gap-[0.5em] mb-[0.75em]">
        {/* Time range */}
        <div className="flex bg-black/10 rounded-[0.5em] p-[0.25em]">
          {(['week', 'month', '3months'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`
                px-[0.625em] py-[0.375em] text-[0.75em] font-medium
                rounded-[0.375em] transition-colors
                ${timeRange === range
                  ? 'bg-black/20 text-black'
                  : 'text-black/50 hover:text-black/70'
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
            flex items-center gap-[0.375em] px-[0.625em] py-[0.375em]
            text-[0.75em] font-medium rounded-[0.375em] transition-colors
            ${showHazardousOnly
              ? 'bg-red-500/20 text-red-700 border border-red-500/30'
              : 'bg-black/10 text-black/50 hover:text-black/70'
            }
          `}
        >
          <span className="w-[0.5em] h-[0.5em] rounded-full bg-red-500" />
          PHA
        </button>
      </div>

      {/* Asteroid list */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <AsteroidList asteroids={filteredAsteroids} />
      </div>
    </div>
  )
}
