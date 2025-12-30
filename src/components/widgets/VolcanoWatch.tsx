'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// VOLCANO WATCH
// ===========================================
// Shows currently erupting and active volcanoes
// Data: Smithsonian Global Volcanism Program
// Design: Dark theme (#1a1a1e)
// ===========================================

interface Volcano {
  id: string
  name: string
  country: string
  region: string
  latitude: number
  longitude: number
  elevation: number
  type: string
  alertLevel: 'normal' | 'advisory' | 'watch' | 'warning'
  lastEruption: string
  currentActivity?: string
  aviationCode?: 'green' | 'yellow' | 'orange' | 'red'
}

interface VolcanoData {
  timestamp: string
  summary: {
    activeCount: number
    elevatedCount: number
    advisoryCount: number
  }
  volcanoes: Volcano[]
}

const ALERT_COLORS = {
  warning: '#ef4444',
  watch: '#f97316',
  advisory: '#f59e0b',
  normal: '#22c55e',
}

const ALERT_LABELS = {
  warning: 'ERUPTING',
  watch: 'WATCH',
  advisory: 'ADVISORY',
  normal: 'NORMAL',
}

export default function VolcanoWatch() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [data, setData] = useState<VolcanoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

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

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/volcanoes')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError('Unable to load volcano data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Refresh every hour
    const interval = setInterval(fetchData, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Filter to show only elevated+ activity
  const activeVolcanoes = data?.volcanoes.filter(
    v => v.alertLevel !== 'normal'
  ) || []

  const displayVolcanoes = showAll
    ? activeVolcanoes
    : activeVolcanoes.slice(0, 4)

  const remainingCount = activeVolcanoes.length - 4

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="bg-[#1a1a1e] p-[1em] h-full flex items-center justify-center"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-white/50 text-[0.875em]">Loading volcanic activity...</div>
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
      {/* Hero stat */}
      <div className="text-center mb-[0.75em]">
        <div className="text-[2.5em] font-bold text-red-500 leading-none">
          {data.summary.activeCount}
        </div>
        <div className="text-[0.875em] text-white/60 mt-[0.25em]">
          {data.summary.activeCount === 1 ? 'volcano erupting' : 'volcanoes erupting'}
        </div>
        {data.summary.elevatedCount > 0 && (
          <div className="text-[0.75em] text-white/40 mt-[0.125em]">
            {data.summary.elevatedCount} on watch · {data.summary.advisoryCount} advisory
          </div>
        )}
      </div>

      {/* Volcano list */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.375em]">
          Recent Activity
        </div>
        <div className="flex-1 overflow-y-auto space-y-[0.375em]">
          {displayVolcanoes.map((volcano) => (
            <div
              key={volcano.id}
              className="bg-white/5 rounded-[0.375em] p-[0.5em]"
            >
              <div className="flex items-center justify-between mb-[0.25em]">
                <div className="flex items-center gap-[0.375em]">
                  <div
                    className="w-[0.5em] h-[0.5em] rounded-full"
                    style={{ backgroundColor: ALERT_COLORS[volcano.alertLevel] }}
                  />
                  <span className="text-[0.875em] text-white font-medium">
                    {volcano.name}
                  </span>
                </div>
                <span
                  className="text-[0.5625em] font-medium px-[0.5em] py-[0.125em] rounded"
                  style={{
                    backgroundColor: `${ALERT_COLORS[volcano.alertLevel]}20`,
                    color: ALERT_COLORS[volcano.alertLevel],
                  }}
                >
                  {ALERT_LABELS[volcano.alertLevel]}
                </span>
              </div>
              <div className="text-[0.6875em] text-white/50">
                {volcano.country} · {volcano.region}
              </div>
              {volcano.currentActivity && (
                <div className="text-[0.625em] text-white/40 mt-[0.25em] line-clamp-2">
                  {volcano.currentActivity}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show more */}
        {remainingCount > 0 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-[0.75em] text-white/40 hover:text-white/60 py-[0.5em] mt-[0.25em]"
          >
            {showAll ? 'Show less' : `+${remainingCount} more with elevated activity`}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] mt-auto border-t border-white/10">
        <span className="text-[0.625em] text-white/40">
          Updated weekly
        </span>
        <span className="text-[0.625em] text-white/40">
          Smithsonian GVP
        </span>
      </div>
    </div>
  )
}
