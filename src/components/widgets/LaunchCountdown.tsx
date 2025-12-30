'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns'

// ===========================================
// LAUNCH COUNTDOWN WIDGET
// ===========================================
// Next upcoming rocket launch with live countdown
// Data: The Space Devs Launch Library (via /api/launches)
// Server-side caching handles rate limits
//
// Design notes:
// - NO title/live dot/source (WidgetFrame handles those)
// - Dark theme with white/opacity text
// ===========================================

interface Launch {
  id: string
  name: string
  net: string // NET = No Earlier Than (ISO date)
  status: {
    id: number
    name: string
    abbrev: string
  }
  rocket: {
    configuration: {
      name: string
      family: string
    }
  }
  mission: {
    name: string
    description: string
    type: string
  } | null
  pad: {
    name: string
    location: {
      name: string
      country_code: string
    }
  }
  launch_service_provider: {
    name: string
    abbrev: string
    type: string
  }
  webcast_live: boolean
  image: string | null
}

interface APIResponse {
  launches: Launch[]
  cached?: boolean
  stale?: boolean
  error?: string
}

interface CountdownValues {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
  isPast: boolean
}

// Calculate countdown values
function getCountdown(targetDate: Date): CountdownValues {
  const now = new Date()
  const total = differenceInSeconds(targetDate, now)
  const isPast = total < 0
  const absTotal = Math.abs(total)

  const days = Math.floor(absTotal / (60 * 60 * 24))
  const hours = Math.floor((absTotal % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((absTotal % (60 * 60)) / 60)
  const seconds = absTotal % 60

  return { days, hours, minutes, seconds, total, isPast }
}

// Status color mapping
function getStatusColor(statusId: number): string {
  switch (statusId) {
    case 1: return '#22c55e' // Go for launch (green)
    case 2: return '#f59e0b' // TBD (amber)
    case 3: return '#22c55e' // Success (green)
    case 4: return '#ef4444' // Failure (red)
    case 5: return '#6366f1' // Hold (purple)
    case 6: return '#64748b' // In Flight (slate)
    case 7: return '#64748b' // Partial Failure (slate)
    case 8: return '#f59e0b' // TBC (amber)
    default: return '#64748b'
  }
}

// ===========================================
// COUNTDOWN DISPLAY
// ===========================================

function CountdownDisplay({ countdown }: { countdown: CountdownValues }) {
  const { days, hours, minutes, seconds, isPast } = countdown

  return (
    <div className={`text-center ${isPast ? 'opacity-60' : ''}`}>
      {/* T-minus or T-plus indicator */}
      <div className="font-mono text-[0.75em] text-white/40 mb-[0.25em]">
        {isPast ? 'T+' : countdown.total > 0 ? 'T−' : ''}
      </div>

      {/* Countdown units */}
      <div className="flex justify-center gap-[0.25em]">
        {days > 0 && (
          <div className="text-center min-w-[3em]">
            <div className="font-mono text-[2em] font-bold text-white">{days}</div>
            <div className="text-[0.625em] text-white/40 uppercase tracking-wide">days</div>
          </div>
        )}
        <div className="text-center min-w-[3em]">
          <div className="font-mono text-[2em] font-bold text-white">{String(hours).padStart(2, '0')}</div>
          <div className="text-[0.625em] text-white/40 uppercase tracking-wide">hrs</div>
        </div>
        <div className="text-center min-w-[3em]">
          <div className="font-mono text-[2em] font-bold text-white">{String(minutes).padStart(2, '0')}</div>
          <div className="text-[0.625em] text-white/40 uppercase tracking-wide">min</div>
        </div>
        <div className="text-center min-w-[3em]">
          <div className="font-mono text-[2em] font-bold text-white">{String(seconds).padStart(2, '0')}</div>
          <div className="text-[0.625em] text-white/40 uppercase tracking-wide">sec</div>
        </div>
      </div>
    </div>
  )
}

// ===========================================
// UPCOMING LAUNCHES LIST
// ===========================================

function UpcomingList({
  launches,
  onSelect,
}: {
  launches: Launch[]
  onSelect: (launch: Launch) => void
}) {
  return (
    <div className="space-y-[0.5em]">
      <div className="text-[0.75em] text-white/40 uppercase tracking-wide">
        Upcoming
      </div>
      {launches.map(launch => {
        const launchDate = new Date(launch.net)
        const timeUntil = formatDistanceToNow(launchDate, { addSuffix: true })

        return (
          <button
            key={launch.id}
            onClick={() => onSelect(launch)}
            className="w-full flex items-center gap-[0.75em] p-[0.5em] rounded-[0.5em] hover:bg-white/5 transition-colors text-left"
          >
            <div className="text-[0.75em] font-medium text-white/40 min-w-[3em]">
              {launch.launch_service_provider.abbrev}
            </div>
            <div className="flex-1">
              <div className="text-[0.875em] text-white">{launch.rocket.configuration.name}</div>
              <div className="text-[0.75em] text-white/40">{timeUntil}</div>
            </div>
            <div
              className="px-[0.375em] py-[0.125em] rounded text-[0.5625em] font-semibold text-white"
              style={{ backgroundColor: getStatusColor(launch.status.id) }}
            >
              {launch.status.abbrev}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function LaunchCountdown() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [launches, setLaunches] = useState<Launch[]>([])
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null)
  const [countdown, setCountdown] = useState<CountdownValues | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showUpcoming, setShowUpcoming] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isStale, setIsStale] = useState(false)

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

  // Fetch launches via API route
  const fetchLaunches = useCallback(async () => {
    try {
      const response = await fetch('/api/launches')
      const data: APIResponse = await response.json()

      if (data.error && data.launches.length === 0) {
        throw new Error(data.error)
      }

      if (data.launches.length > 0) {
        setLaunches(data.launches)
        // Only update selected if we don't have one or it's the first load
        if (!selectedLaunch) {
          setSelectedLaunch(data.launches[0])
        }
        setIsStale(data.stale || false)
      }

      setError(null)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch launches')
      setLoading(false)
    }
  }, [selectedLaunch])

  // Initial fetch and refresh
  useEffect(() => {
    fetchLaunches()
    // Refresh every 5 minutes (server handles actual rate limiting)
    const interval = setInterval(fetchLaunches, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchLaunches])

  // Countdown timer (runs every second, client-side only)
  useEffect(() => {
    if (!selectedLaunch) return

    const targetDate = new Date(selectedLaunch.net)

    const updateCountdown = () => {
      setCountdown(getCountdown(targetDate))
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [selectedLaunch])

  // Upcoming launches (excluding selected)
  const upcomingLaunches = useMemo(() => {
    return launches.filter(l => l.id !== selectedLaunch?.id).slice(0, 4)
  }, [launches, selectedLaunch])

  // Handle selecting a new launch
  const handleSelectLaunch = useCallback((launch: Launch) => {
    setSelectedLaunch(launch)
    setShowFullDescription(false)
  }, [])

  // Loading state
  if (loading && !selectedLaunch) {
    return (
      <div
        ref={containerRef}
        className="bg-[#1a1a1e] p-[1em] flex items-center justify-center h-48"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <span className="text-white/40">Fetching launch schedule...</span>
      </div>
    )
  }

  // Error state
  if (error && !selectedLaunch) {
    return (
      <div
        ref={containerRef}
        className="bg-[#1a1a1e] p-[1em]"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="bg-red-500/10 border border-red-500/30 rounded-[0.5em] p-[0.75em] flex items-center justify-between">
          <span className="text-[0.875em] text-red-400">{error}</span>
          <button
            onClick={fetchLaunches}
            className="px-[0.75em] py-[0.25em] bg-red-600 text-white text-[0.75em] font-medium rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!selectedLaunch || !countdown) return null

  return (
    <div
      ref={containerRef}
      className="bg-[#1a1a1e] p-[1em] space-y-[1em] h-full"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Stale data indicator */}
      {isStale && (
        <div className="text-center text-[0.75em] text-amber-400">
          Showing cached data
        </div>
      )}

      {/* Countdown */}
      <CountdownDisplay countdown={countdown} />

      {/* Status and date */}
      <div className="flex items-center justify-center gap-[0.75em]">
        <span
          className="px-[0.5em] py-[0.25em] rounded-full text-[0.625em] font-semibold text-white uppercase"
          style={{ backgroundColor: getStatusColor(selectedLaunch.status.id) }}
        >
          {selectedLaunch.status.name}
        </span>
        <span className="font-mono text-[0.75em] text-white/40">
          {format(new Date(selectedLaunch.net), 'MMM d, yyyy • HH:mm')} UTC
        </span>
      </div>

      {/* Mission name */}
      <div className="text-center">
        <div className="font-medium text-white">{selectedLaunch.name}</div>
        {selectedLaunch.mission?.description && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="w-full mt-[0.25em] text-left"
          >
            <div className={`text-[0.875em] text-white/60 ${showFullDescription ? '' : 'line-clamp-2'}`}>
              {selectedLaunch.mission.description}
            </div>
            <div className="flex justify-center mt-[0.25em]">
              <svg
                className={`w-[1em] h-[1em] text-white/40 transition-transform ${showFullDescription ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-[0.75em]">
        <div>
          <div className="text-[0.625em] text-white/40 uppercase tracking-wide">Rocket</div>
          <div className="text-[0.875em] text-white">{selectedLaunch.rocket.configuration.name}</div>
        </div>
        <div>
          <div className="text-[0.625em] text-white/40 uppercase tracking-wide">Provider</div>
          <div className="text-[0.875em] text-white">{selectedLaunch.launch_service_provider.name}</div>
        </div>
        <div>
          <div className="text-[0.625em] text-white/40 uppercase tracking-wide">Pad</div>
          <div className="text-[0.875em] text-white">{selectedLaunch.pad.name}</div>
        </div>
        <div>
          <div className="text-[0.625em] text-white/40 uppercase tracking-wide">Location</div>
          <div className="text-[0.875em] text-white">{selectedLaunch.pad.location.name}</div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Upcoming launches (expandable) */}
      {upcomingLaunches.length > 0 && (
        <div>
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="w-full flex items-center justify-between"
          >
            <span className="text-[0.875em] text-white/60">
              {upcomingLaunches.length} more launches scheduled
            </span>
            <svg
              className={`w-[1.25em] h-[1.25em] text-white/40 transition-transform ${showUpcoming ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUpcoming && (
            <div className="mt-[0.75em]">
              <UpcomingList launches={upcomingLaunches} onSelect={handleSelectLaunch} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
