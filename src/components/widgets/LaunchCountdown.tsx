'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns'

// ===========================================
// LAUNCH COUNTDOWN WIDGET
// ===========================================

interface Launch {
  id: string
  name: string
  net: string
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

function getStatusColor(statusId: number): string {
  switch (statusId) {
    case 1: return '#22c55e'
    case 2: return '#f59e0b'
    case 3: return '#22c55e'
    case 4: return '#ef4444'
    case 5: return '#6366f1'
    case 6: return '#64748b'
    case 7: return '#64748b'
    case 8: return '#f59e0b'
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
      <div className="font-mono text-xs text-white/40 mb-1">
        {isPast ? 'T+' : countdown.total > 0 ? 'T−' : ''}
      </div>

      <div className="flex justify-center gap-1">
        {days > 0 && (
          <div className="text-center min-w-[48px]">
            <div className="font-mono text-3xl font-bold text-white">{days}</div>
            <div className="text-[10px] text-white/40 uppercase">days</div>
          </div>
        )}
        <div className="text-center min-w-[48px]">
          <div className="font-mono text-3xl font-bold text-white">{String(hours).padStart(2, '0')}</div>
          <div className="text-[10px] text-white/40 uppercase">hrs</div>
        </div>
        <div className="text-center min-w-[48px]">
          <div className="font-mono text-3xl font-bold text-white">{String(minutes).padStart(2, '0')}</div>
          <div className="text-[10px] text-white/40 uppercase">min</div>
        </div>
        <div className="text-center min-w-[48px]">
          <div className="font-mono text-3xl font-bold text-white">{String(seconds).padStart(2, '0')}</div>
          <div className="text-[10px] text-white/40 uppercase">sec</div>
        </div>
      </div>
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

  const fetchLaunches = useCallback(async () => {
    try {
      const response = await fetch('/api/launches')
      const data: APIResponse = await response.json()

      if (data.error && data.launches.length === 0) {
        throw new Error(data.error)
      }

      if (data.launches.length > 0) {
        setLaunches(data.launches)
        if (!selectedLaunch) {
          setSelectedLaunch(data.launches[0])
        }
        setIsStale(data.stale || false)
      }

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch launches')
    } finally {
      setLoading(false)
    }
  }, [selectedLaunch])

  useEffect(() => {
    fetchLaunches()
    const interval = setInterval(fetchLaunches, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchLaunches])

  useEffect(() => {
    if (!selectedLaunch) return

    const targetDate = new Date(selectedLaunch.net)
    const updateCountdown = () => setCountdown(getCountdown(targetDate))

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [selectedLaunch])

  const upcomingLaunches = useMemo(() => {
    return launches.filter(l => l.id !== selectedLaunch?.id).slice(0, 4)
  }, [launches, selectedLaunch])

  const handleSelectLaunch = useCallback((launch: Launch) => {
    setSelectedLaunch(launch)
    setShowFullDescription(false)
  }, [])

  if (loading && !selectedLaunch) {
    return (
      <div className="bg-[#404040] p-2 md:p-4">
        <div className="flex items-center justify-center h-48">
          <span className="text-sm text-white/50 font-mono">Fetching launch schedule...</span>
        </div>
      </div>
    )
  }

  if (error && !selectedLaunch) {
    return (
      <div className="bg-[#404040] p-2 md:p-4">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="text-sm text-red-400 mb-2">{error}</div>
            <button
              onClick={fetchLaunches}
              className="px-3 py-1.5 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!selectedLaunch || !countdown) return null

  return (
    <div className="bg-[#404040] p-2 md:p-4 space-y-px">
      {/* Stale data indicator */}
      {isStale && (
        <div className="text-center text-xs text-amber-400 mb-2">
          Showing cached data
        </div>
      )}

      {/* Countdown - centered at top */}
      <div className="py-4">
        <CountdownDisplay countdown={countdown} />

        {/* Status and date */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white uppercase"
            style={{ backgroundColor: getStatusColor(selectedLaunch.status.id) }}
          >
            {selectedLaunch.status.name}
          </span>
          <span className="font-mono text-xs text-white/40">
            {format(new Date(selectedLaunch.net), 'MMM d, yyyy • HH:mm')} UTC
          </span>
        </div>
      </div>

      {/* Mission name & description - WHITE frame */}
      <div className="bg-white rounded-lg p-3">
        <div className="text-sm font-medium text-black">{selectedLaunch.name}</div>
        {selectedLaunch.mission?.description && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="w-full mt-1 text-left"
          >
            <div className={`text-xs text-black/60 ${showFullDescription ? '' : 'line-clamp-2'}`}>
              {selectedLaunch.mission.description}
            </div>
            <div className="flex justify-center mt-1">
              <svg
                className={`w-4 h-4 text-black/30 transition-transform ${showFullDescription ? 'rotate-180' : ''}`}
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

      {/* Details - BLACK frame */}
      <div className="bg-black rounded-lg p-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Rocket</div>
            <div className="text-sm text-white">{selectedLaunch.rocket.configuration.name}</div>
          </div>
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Provider</div>
            <div className="text-sm text-white">{selectedLaunch.launch_service_provider.name}</div>
          </div>
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Pad</div>
            <div className="text-sm text-white">{selectedLaunch.pad.name}</div>
          </div>
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Location</div>
            <div className="text-sm text-white">{selectedLaunch.pad.location.name}</div>
          </div>
        </div>
      </div>

      {/* Upcoming launches - BLACK frame */}
      {upcomingLaunches.length > 0 && (
        <div className="bg-black rounded-lg overflow-hidden">
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
          >
            <span className="text-sm text-white">
              {upcomingLaunches.length} more launches scheduled
            </span>
            <svg
              className={`w-4 h-4 text-white/40 transition-transform ${showUpcoming ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUpcoming && (
            <div className="border-t border-white/10 p-3">
              <div className="space-y-2">
                {upcomingLaunches.map(launch => {
                  const launchDate = new Date(launch.net)
                  const timeUntil = formatDistanceToNow(launchDate, { addSuffix: true })

                  return (
                    <button
                      key={launch.id}
                      onClick={() => handleSelectLaunch(launch)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="text-xs font-medium text-white/40 min-w-[40px]">
                        {launch.launch_service_provider.abbrev}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white truncate">{launch.rocket.configuration.name}</div>
                        <div className="text-[10px] text-white/40">{timeUntil}</div>
                      </div>
                      <div
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-white"
                        style={{ backgroundColor: getStatusColor(launch.status.id) }}
                      >
                        {launch.status.abbrev}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
