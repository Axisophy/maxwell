'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// METEOR WATCH
// ===========================================
// Shows active and upcoming meteor showers
// Data: International Meteor Organization (IMO)
// Design: Dark theme (#1a1a1e)
// ===========================================

interface MeteorShower {
  name: string
  code: string
  peakDate: string
  peakZHR: number
  active: { start: string; end: string }
  radiant: { constellation: string }
  velocity: number
  parentBody?: string
  description: string
}

interface MeteorData {
  timestamp: string
  currentShower: MeteorShower | null
  upcomingShowers: MeteorShower[]
  currentRate: number
  moonPhase: number
  moonIllumination: number
  viewingCondition: string
  bestViewing: string
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDistanceToNow(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'today'
  if (diffDays === 1) return 'tomorrow'
  if (diffDays < 7) return `in ${diffDays} days`
  if (diffDays < 30) return `in ${Math.ceil(diffDays / 7)} weeks`
  return `in ${Math.ceil(diffDays / 30)} months`
}

export default function MeteorWatch() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [data, setData] = useState<MeteorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/meteors')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError('Unable to load meteor data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 6 * 60 * 60 * 1000) // 6 hours
    return () => clearInterval(interval)
  }, [fetchData])

  // Moon conditions
  const getMoonConditionColor = (condition: string): string => {
    switch (condition) {
      case 'Excellent': return '#22c55e'
      case 'Good': return '#84cc16'
      case 'Fair': return '#f59e0b'
      case 'Poor': return '#ef4444'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="bg-[#1a1a1e] p-[1em] h-full flex items-center justify-center"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-white/50 text-[0.875em]">Scanning the sky...</div>
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

  const hasActiveShower = data.currentShower !== null

  return (
    <div
      ref={containerRef}
      className="bg-[#1a1a1e] p-[1em] h-full flex flex-col"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Current shower or next upcoming */}
      {hasActiveShower ? (
        <div className="mb-[0.75em]">
          <div className="text-[0.625em] text-amber-400/60 uppercase tracking-wider mb-[0.25em]">
            Active Now
          </div>
          <div className="text-[1.5em] font-bold text-white leading-tight">
            {data.currentShower!.name}
          </div>
          <div className="text-[0.75em] text-white/50">
            Peak: {formatDate(data.currentShower!.peakDate)}
          </div>

          {/* Rate bar */}
          <div className="mt-[0.75em] bg-white/5 rounded-[0.375em] p-[0.5em]">
            <div className="flex items-center justify-between mb-[0.25em]">
              <span className="text-[0.625em] text-white/40 uppercase tracking-wider">
                Expected Rate
              </span>
              <span className="text-[0.875em] font-mono text-white">
                ~{data.currentShower!.peakZHR}/hr
              </span>
            </div>
            <div className="h-[0.5em] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: `${Math.min(100, (data.currentShower!.peakZHR / 150) * 100)}%` }}
              />
            </div>
            <div className="text-[0.5625em] text-white/30 mt-[0.25em]">
              ZHR at peak under ideal conditions
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-[0.75em]">
          <div className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.25em]">
            No Major Shower
          </div>
          {data.upcomingShowers.length > 0 && (
            <>
              <div className="text-[1.125em] text-white">
                Next: <span className="font-medium">{data.upcomingShowers[0].name}</span>
              </div>
              <div className="text-[0.75em] text-white/50">
                {formatDistanceToNow(data.upcomingShowers[0].active.start)}
              </div>
            </>
          )}
          <div className="mt-[0.5em] text-[0.75em] text-white/40">
            Sporadic meteors: ~6/hour (background rate)
          </div>
        </div>
      )}

      {/* Conditions */}
      <div className="grid grid-cols-2 gap-[0.375em] mb-[0.75em]">
        <div className="bg-white/5 rounded-[0.375em] p-[0.5em]">
          <div className="text-[0.5625em] text-white/40 uppercase tracking-wider mb-[0.125em]">
            Moon
          </div>
          <div className="flex items-center gap-[0.25em]">
            <div
              className="w-[0.5em] h-[0.5em] rounded-full"
              style={{ backgroundColor: getMoonConditionColor(data.viewingCondition) }}
            />
            <span className="text-[0.75em] text-white">
              {data.moonIllumination}%
            </span>
            <span className="text-[0.625em] text-white/40">
              ({data.viewingCondition})
            </span>
          </div>
        </div>
        <div className="bg-white/5 rounded-[0.375em] p-[0.5em]">
          <div className="text-[0.5625em] text-white/40 uppercase tracking-wider mb-[0.125em]">
            Best Viewing
          </div>
          <div className="text-[0.6875em] text-white leading-tight">
            {data.bestViewing}
          </div>
        </div>
      </div>

      {/* Upcoming showers */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.375em]">
          Upcoming Showers
        </div>
        <div className="space-y-[0.25em]">
          {data.upcomingShowers.slice(0, 4).map((shower) => (
            <div
              key={shower.code}
              className="flex items-center justify-between py-[0.25em] border-b border-white/5"
            >
              <span className="text-[0.75em] text-white/80">{shower.name}</span>
              <div className="flex items-center gap-[0.75em]">
                <span className="text-[0.625em] text-white/40">
                  {formatDate(shower.peakDate)}
                </span>
                <span className="text-[0.625em] font-mono text-white/60 w-[4em] text-right">
                  ~{shower.peakZHR}/hr
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-[0.5em] mt-auto border-t border-white/10">
        <div className="text-[0.5625em] text-white/30 text-center">
          ZHR = Zenithal Hourly Rate under ideal conditions
        </div>
      </div>
    </div>
  )
}
