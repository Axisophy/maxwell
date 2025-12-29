'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { format, addDays, formatDistanceToNow } from 'date-fns'

// ===========================================
// NEAR-EARTH ASTEROIDS WIDGET
// ===========================================
// Upcoming asteroid close approaches
// Data: NASA JPL Small-Body Database (CAD API)
// Design: Planetary Defense Monitoring aesthetic
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
// RADAR DISTANCE VISUALISATION
// ===========================================

interface RadarDisplayProps {
  asteroids: Asteroid[]
}

function RadarDisplay({ asteroids }: RadarDisplayProps) {
  // Sort by distance and take top 5 for display
  const displayAsteroids = [...asteroids]
    .sort((a, b) => a.distanceLunar - b.distanceLunar)
    .slice(0, 5)

  // Calculate adaptive scale based on data, minimum 10LD for visual consistency
  const furthestAsteroid = Math.max(...asteroids.map(a => a.distanceLunar), 5)
  const maxLD = Math.max(10, Math.ceil(furthestAsteroid / 5) * 5)

  // Generate appropriate ring markers based on maxDistance
  const generateRings = (max: number): number[] => {
    if (max <= 10) return [1, 2, 5, 10]
    if (max <= 15) return [1, 5, 10, 15]
    if (max <= 20) return [1, 5, 10, 15, 20]
    return [1, 5, 10, 15, 20, Math.ceil(max / 5) * 5]
  }
  const rings = generateRings(maxLD)

  return (
    <div className="relative aspect-[2/1] w-full">
      {/* Background grid effect */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Radar arc container - taller viewBox for labels below */}
      <svg
        viewBox="0 0 400 220"
        className="w-full h-full"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          {/* Gradient for sweep effect */}
          <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34,197,94,0)" />
            <stop offset="50%" stopColor="rgba(34,197,94,0.1)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </linearGradient>

          {/* Glow filter for asteroids */}
          <filter id="asteroidGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Distance arcs */}
        {rings.map((ring) => {
          const radius = (ring / maxLD) * 165
          return (
            <g key={ring}>
              <path
                d={`M ${200 - radius} 175 A ${radius} ${radius} 0 0 1 ${200 + radius} 175`}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              {/* Distance labels - below baseline */}
              <text
                x={200 + radius}
                y={195}
                fill="rgba(255,255,255,0.4)"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {ring}
              </text>
            </g>
          )
        })}

        {/* Center line / baseline */}
        <line x1="20" y1="175" x2="380" y2="175" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

        {/* Earth position */}
        <circle cx="200" cy="175" r="5" fill="#0ea5e9" />
        <text
          x="200"
          y="190"
          fill="rgba(255,255,255,0.5)"
          fontSize="8"
          fontFamily="monospace"
          textAnchor="middle"
        >
          EARTH
        </text>

        {/* Moon marker at 1 LD */}
        <circle cx={200 + (1 / maxLD) * 165} cy="175" r="2" fill="rgba(255,255,255,0.5)" />

        {/* LD explanation - bottom right */}
        <text
          x="385"
          y="215"
          fill="rgba(255,255,255,0.3)"
          fontSize="8"
          fontFamily="monospace"
          textAnchor="end"
        >
          LD = lunar distance
        </text>

        {/* Asteroid positions */}
        {displayAsteroids.map((asteroid, index) => {
          const distance = Math.min(asteroid.distanceLunar, maxLD)
          const radius = (distance / maxLD) * 165
          // Spread asteroids across the arc
          const angle = -30 - (index * 30) // Spread from -30° to -150°
          const radian = (angle * Math.PI) / 180
          const x = 200 + radius * Math.cos(radian)
          const y = 175 + radius * Math.sin(radian)
          const status = getDistanceStatus(asteroid.distanceLunar)

          return (
            <g key={asteroid.id}>
              {/* Connection line to Earth */}
              <line
                x1="200"
                y1="175"
                x2={x}
                y2={y}
                stroke={status.color}
                strokeWidth="1"
                strokeOpacity="0.2"
                strokeDasharray="2 2"
              />
              {/* Asteroid dot */}
              <circle
                cx={x}
                cy={y}
                r={asteroid.isPotentiallyHazardous ? 5 : 4}
                fill={status.color}
                filter="url(#asteroidGlow)"
              />
              {/* Asteroid label */}
              <text
                x={x}
                y={y - 10}
                fill="rgba(255,255,255,0.6)"
                fontSize="7"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {asteroid.name.replace(/\(|\)/g, '').slice(0, 12)}
              </text>
            </g>
          )
        })}
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
          ? 'bg-white/10 border border-white/20'
          : 'bg-white/5 hover:bg-white/[0.07]'
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
              <span className="flex-shrink-0 px-[0.375em] py-[0.125em] bg-white/20 text-white text-[0.5625em] font-semibold rounded uppercase tracking-wider">
                Next
              </span>
            )}
            {asteroid.isPotentiallyHazardous && (
              <span className="flex-shrink-0 w-[0.5em] h-[0.5em] rounded-full bg-red-500" />
            )}
            <span className="font-mono text-[0.875em] text-white truncate">
              {asteroid.name}
            </span>
          </div>

          {/* Right: Distance */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[0.75em] text-white/40">
              {timeUntil}
            </span>
            <div className="text-right">
              <span
                className="font-mono text-[1.125em] font-bold"
                style={{ color: status.color }}
              >
                {asteroid.distanceLunar.toFixed(1)}
              </span>
              <span className="text-[0.625em] text-white/40 ml-1">LD</span>
            </div>
            <svg
              className={`w-4 h-4 text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`}
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
          <div className="pt-[0.5em] border-t border-white/10">
            {/* Date/time */}
            <div className="text-[0.75em] text-white/50 mb-[0.75em]">
              {format(asteroid.closeApproachDate, 'EEEE, MMMM d, yyyy')} at {format(asteroid.closeApproachDate, 'HH:mm')} UTC
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-[0.5em]">
              <div className="bg-white/5 rounded-[0.25em] p-[0.5em] text-center">
                <div className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.25em]">Distance</div>
                <div className="font-mono text-[0.875em] text-white">
                  {(asteroid.distanceKm / 1000000).toFixed(2)}M
                </div>
                <div className="text-[0.5625em] text-white/30">km</div>
              </div>
              <div className="bg-white/5 rounded-[0.25em] p-[0.5em] text-center">
                <div className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.25em]">Size</div>
                <div className="font-mono text-[0.875em] text-white">
                  ~{avgDiameter.toFixed(0)}m
                </div>
                <div className="text-[0.5625em] text-white/30">{sizeDesc}</div>
              </div>
              <div className="bg-white/5 rounded-[0.25em] p-[0.5em] text-center">
                <div className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.25em]">Velocity</div>
                <div className="font-mono text-[0.875em] text-white">
                  {asteroid.velocityKmS.toFixed(1)}
                </div>
                <div className="text-[0.5625em] text-white/30">km/s</div>
              </div>
            </div>

            {/* Hazard notice */}
            {asteroid.isPotentiallyHazardous && (
              <div className="mt-[0.5em] flex items-center gap-2 text-[0.6875em] text-red-400/80">
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
    <div className="flex items-center justify-between py-[0.375em] px-[0.5em] rounded-[0.25em] hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        {asteroid.isPotentiallyHazardous && (
          <span className="flex-shrink-0 w-[0.375em] h-[0.375em] rounded-full bg-red-500" />
        )}
        <span className="font-mono text-[0.75em] text-white/70 truncate">{asteroid.name}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-[0.6875em] text-white/40">
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
      <div className="text-center text-[0.875em] text-white/40 py-[1.5em]">
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
            className="w-full flex items-center justify-center gap-2 py-[0.5em] text-[0.75em] text-white/40 hover:text-white/60 transition-colors"
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
            <div className="mt-[0.25em] border-t border-white/10 pt-[0.375em]">
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
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const [showHazardousOnly, setShowHazardousOnly] = useState(false)

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
      <div className="bg-[#1a1a1e] p-[1em] min-h-[300px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/50">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[0.875em] font-mono tracking-wide">SCANNING NEO TRAJECTORIES</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#1a1a1e] p-[1em]">
        <div className="bg-red-500/10 border border-red-500/30 rounded-[0.5em] p-[0.75em] flex items-center justify-between">
          <span className="text-[0.875em] text-red-400">{error}</span>
          <button
            onClick={fetchAsteroids}
            className="px-[0.75em] py-[0.375em] bg-red-500 text-white text-[0.75em] font-medium rounded-[0.25em] hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1e] p-[1em]">
      {/* Header stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-[0.5em] mb-[1em]">
          <div className="bg-white/5 rounded-[0.375em] p-[0.625em] text-center">
            <div className="font-mono text-[1.5em] font-bold text-white">{stats.total}</div>
            <div className="text-[0.625em] text-white/40 uppercase tracking-wider">Approaches</div>
          </div>
          <div className="bg-white/5 rounded-[0.375em] p-[0.625em] text-center">
            <div
              className="font-mono text-[1.5em] font-bold"
              style={{ color: getDistanceStatus(stats.closest.distanceLunar).color }}
            >
              {stats.closest.distanceLunar.toFixed(1)}
            </div>
            <div className="text-[0.625em] text-white/40 uppercase tracking-wider">Closest (LD)</div>
          </div>
          <div className="bg-white/5 rounded-[0.375em] p-[0.625em] text-center">
            <div className="font-mono text-[1.5em] font-bold text-white">
              {stats.hazardous}
            </div>
            <div className="text-[0.625em] text-white/40 uppercase tracking-wider">Hazardous</div>
          </div>
        </div>
      )}

      {/* Radar display */}
      {filteredAsteroids.length > 0 && (
        <div className="mb-[1em] bg-white/[0.02] rounded-[0.5em] p-[0.5em] border border-white/5">
          <RadarDisplay asteroids={filteredAsteroids} />
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between gap-[0.5em] mb-[0.75em]">
        {/* Time range */}
        <div className="flex bg-white/5 rounded-[0.5em] p-[0.25em]">
          {(['week', 'month', '3months'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`
                px-[0.625em] py-[0.375em] text-[0.75em] font-medium
                rounded-[0.375em] transition-colors
                ${timeRange === range
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/60'
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
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-white/5 text-white/40 hover:text-white/60'
            }
          `}
        >
          <span className="w-[0.5em] h-[0.5em] rounded-full bg-red-500" />
          PHA
        </button>
      </div>

      {/* Asteroid list */}
      <AsteroidList asteroids={filteredAsteroids} />

      {/* Attribution */}
      <div className="mt-[1em] pt-[0.75em] border-t border-white/5 text-[0.6875em] text-white/30">
        NASA JPL Small-Body Database
      </div>
    </div>
  )
}
