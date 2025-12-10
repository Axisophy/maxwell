'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns'

// ===========================================
// LAUNCH COUNTDOWN WIDGET
// ===========================================
// Next upcoming rocket launch with live countdown
// Data: The Space Devs Launch Library (via /api/launches)
// Server-side caching handles rate limits
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
      <div className="font-mono text-xs text-text-muted mb-1">
        {isPast ? 'T+' : countdown.total > 0 ? 'T−' : ''}
      </div>

      {/* Countdown units */}
      <div className="flex justify-center gap-1">
        {days > 0 && (
          <div className="text-center min-w-[3rem]">
            <div className="font-mono text-3xl font-bold">{days}</div>
            <div className="text-[10px] text-text-muted uppercase tracking-wide">days</div>
          </div>
        )}
        <div className="text-center min-w-[3rem]">
          <div className="font-mono text-3xl font-bold">{String(hours).padStart(2, '0')}</div>
          <div className="text-[10px] text-text-muted uppercase tracking-wide">hrs</div>
        </div>
        <div className="text-center min-w-[3rem]">
          <div className="font-mono text-3xl font-bold">{String(minutes).padStart(2, '0')}</div>
          <div className="text-[10px] text-text-muted uppercase tracking-wide">min</div>
        </div>
        <div className="text-center min-w-[3rem]">
          <div className="font-mono text-3xl font-bold">{String(seconds).padStart(2, '0')}</div>
          <div className="text-[10px] text-text-muted uppercase tracking-wide">sec</div>
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
    <div className="space-y-2">
      <div className="text-xs text-text-muted uppercase tracking-wide">
        Upcoming
      </div>
      {launches.map(launch => {
        const launchDate = new Date(launch.net)
        const timeUntil = formatDistanceToNow(launchDate, { addSuffix: true })

        return (
          <button
            key={launch.id}
            onClick={() => onSelect(launch)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#f5f5f5] transition-colors text-left"
          >
            <div className="text-xs font-medium text-text-muted min-w-[3rem]">
              {launch.launch_service_provider.abbrev}
            </div>
            <div className="flex-1">
              <div className="text-sm">{launch.rocket.configuration.name}</div>
              <div className="text-xs text-text-muted">{timeUntil}</div>
            </div>
            <div
              className="px-1.5 py-0.5 rounded text-[9px] font-semibold text-white"
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
  const [launches, setLaunches] = useState<Launch[]>([])
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null)
  const [countdown, setCountdown] = useState<CountdownValues | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showUpcoming, setShowUpcoming] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isStale, setIsStale] = useState(false)

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
      <div className="p-4 flex items-center justify-center h-48 text-text-muted">
        Fetching launch schedule...
      </div>
    )
  }

  // Error state
  if (error && !selectedLaunch) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-red-700">{error}</span>
          <button
            onClick={fetchLaunches}
            className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!selectedLaunch || !countdown) return null

  return (
    <div className="p-4 space-y-4">
      {/* Stale data indicator */}
      {isStale && (
        <div className="text-center text-xs text-amber-600">
          Showing cached data
        </div>
      )}

      {/* Countdown */}
      <CountdownDisplay countdown={countdown} />

      {/* Status and date */}
      <div className="flex items-center justify-center gap-3">
        <span
          className="px-2 py-1 rounded-full text-[10px] font-semibold text-white uppercase"
          style={{ backgroundColor: getStatusColor(selectedLaunch.status.id) }}
        >
          {selectedLaunch.status.name}
        </span>
        <span className="font-mono text-xs text-text-muted">
          {format(new Date(selectedLaunch.net), 'MMM d, yyyy • HH:mm')} UTC
        </span>
      </div>

      {/* Mission name */}
      <div className="text-center">
        <div className="font-medium">{selectedLaunch.name}</div>
        {selectedLaunch.mission?.description && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="w-full mt-1 text-left"
          >
            <div className={`text-sm text-text-muted ${showFullDescription ? '' : 'line-clamp-2'}`}>
              {selectedLaunch.mission.description}
            </div>
            <div className="flex justify-center mt-1">
              <svg
                className={`w-4 h-4 text-text-muted transition-transform ${showFullDescription ? 'rotate-180' : ''}`}
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
      <div className="border-t border-[#e5e5e5]" />

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wide">Rocket</div>
          <div className="text-sm">{selectedLaunch.rocket.configuration.name}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wide">Provider</div>
          <div className="text-sm">{selectedLaunch.launch_service_provider.name}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wide">Pad</div>
          <div className="text-sm">{selectedLaunch.pad.name}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wide">Location</div>
          <div className="text-sm">{selectedLaunch.pad.location.name}</div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5]" />

      {/* Upcoming launches (expandable) */}
      {upcomingLaunches.length > 0 && (
        <div>
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="w-full flex items-center justify-between"
          >
            <span className="text-sm text-text-muted">
              {upcomingLaunches.length} more launches scheduled
            </span>
            <svg
              className={`w-5 h-5 text-text-muted transition-transform ${showUpcoming ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUpcoming && (
            <div className="mt-3">
              <UpcomingList launches={upcomingLaunches} onSelect={handleSelectLaunch} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}