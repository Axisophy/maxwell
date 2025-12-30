'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// COSMIC RAY MONITOR WIDGET
// ===========================================
// Shows cosmic ray flux from neutron monitors
// Data: NMDB (Neutron Monitor Database)
// Design: Dark theme (#1a1a1e)
// ===========================================

interface Station {
  id: string
  name: string
  location: string
  currentCount: number
  baseline: number
  deviation: number
  status: 'online' | 'offline'
}

interface CosmicRayData {
  timestamp: string
  globalDeviation: number
  stations: Station[]
  solarActivity: 'low' | 'moderate' | 'high'
  note: string
  history24h: number[]
  error?: string
}

// ===========================================
// SPARKLINE COMPONENT
// ===========================================

function Sparkline({ data, color = '#22c55e' }: { data: number[]; color?: string }) {
  if (data.length === 0) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const width = 100
  const height = 30
  const padding = 2

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding)
    const y = height - padding - ((value - min) / range) * (height - 2 * padding)
    return `${x},${y}`
  }).join(' ')

  // Area fill
  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[2em]">
      {/* Zero line */}
      <line
        x1={padding}
        y1={height / 2}
        x2={width - padding}
        y2={height / 2}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        strokeDasharray="2,2"
      />

      {/* Area */}
      <polygon
        points={areaPoints}
        fill={color}
        opacity="0.1"
      />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Current point */}
      <circle
        cx={width - padding}
        cy={height - padding - ((data[data.length - 1] - min) / range) * (height - 2 * padding)}
        r="2.5"
        fill={color}
      />
    </svg>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function CosmicRayMonitor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [data, setData] = useState<CosmicRayData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setBaseFontSize(width / 25)
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/cosmic-rays')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()

      if (result.error) {
        setError(result.error)
      } else {
        setData(result)
        setError(null)
      }
    } catch (err) {
      console.error('Cosmic ray fetch error:', err)
      setError('Unable to reach monitors')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Update every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Loading state
  if (isLoading && !data) {
    return (
      <div
        ref={containerRef}
        style={{ fontSize: `${baseFontSize}px` }}
        className="bg-[#1a1a1e] p-[1em] flex items-center justify-center h-full"
      >
        <div className="text-center">
          <div className="text-white/40 text-[0.875em]">Connecting to neutron monitors...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !data) {
    return (
      <div
        ref={containerRef}
        style={{ fontSize: `${baseFontSize}px` }}
        className="bg-[#1a1a1e] p-[1em] flex items-center justify-center h-full"
      >
        <div className="text-center">
          <div className="text-red-400 text-[0.875em]">{error}</div>
          <button
            onClick={fetchData}
            className="mt-2 text-[0.75em] text-white/50 hover:text-white"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  // Determine color based on deviation
  const deviationColor = data.globalDeviation > 1
    ? '#22c55e' // green - elevated (quiet sun)
    : data.globalDeviation < -1
      ? '#ef4444' // red - reduced (active sun)
      : '#f59e0b' // amber - normal

  const solarActivityColor = {
    low: '#22c55e',
    moderate: '#f59e0b',
    high: '#ef4444',
  }[data.solarActivity]

  return (
    <div
      ref={containerRef}
      style={{ fontSize: `${baseFontSize}px` }}
      className="bg-[#1a1a1e] p-[1em] h-full flex flex-col"
    >
      {/* Header - deviation */}
      <div className="text-center mb-[0.75em]">
        <div className="text-[0.7em] text-white/50 uppercase tracking-wider mb-[0.25em]">
          Global Flux Deviation
        </div>
        <div className="flex items-baseline justify-center gap-[0.25em]">
          <span
            className="font-mono text-[2.5em] font-bold"
            style={{ color: deviationColor }}
          >
            {data.globalDeviation > 0 ? '+' : ''}{data.globalDeviation}%
          </span>
        </div>
        <div className="text-[0.75em] text-white/60 mt-[0.25em]">
          vs. monthly average
        </div>
      </div>

      {/* 24h sparkline */}
      <div className="mb-[0.75em]">
        <div className="text-[0.65em] text-white/40 uppercase tracking-wider mb-[0.25em]">
          Last 24 hours
        </div>
        <Sparkline data={data.history24h} color={deviationColor} />
      </div>

      {/* Solar activity indicator */}
      <div className="p-[0.5em] rounded-[0.5em] bg-white/5 mb-[0.75em]">
        <div className="flex items-center justify-between">
          <div className="text-[0.75em] font-medium" style={{ color: solarActivityColor }}>
            Solar Activity: {data.solarActivity.charAt(0).toUpperCase() + data.solarActivity.slice(1)}
          </div>
          <div className="flex gap-[0.25em]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-[0.5em] h-[1em] rounded-[0.125em]"
                style={{
                  backgroundColor: i < (data.solarActivity === 'high' ? 3 : data.solarActivity === 'moderate' ? 2 : 1)
                    ? solarActivityColor
                    : 'rgba(255,255,255,0.1)'
                }}
              />
            ))}
          </div>
        </div>
        <div className="text-[0.65em] text-white/50 mt-[0.25em]">
          {data.solarActivity === 'low' && 'Quiet sun → More cosmic rays reach Earth'}
          {data.solarActivity === 'moderate' && 'Normal solar wind deflecting some cosmic rays'}
          {data.solarActivity === 'high' && 'Active sun → Fewer cosmic rays reach Earth'}
        </div>
      </div>

      {/* Stations */}
      <div className="mb-[0.5em]">
        <div className="text-[0.65em] text-white/40 uppercase tracking-wider mb-[0.375em]">
          Monitoring Stations
        </div>
        <div className="flex flex-wrap gap-[0.375em]">
          {data.stations.slice(0, 6).map((station) => (
            <div
              key={station.id}
              className="flex items-center gap-[0.25em] text-[0.7em] px-[0.5em] py-[0.125em] bg-white/10 rounded-full"
            >
              <div className={`w-[0.4em] h-[0.4em] rounded-full ${
                station.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
              }`} />
              <span className="text-white/70">{station.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 my-[0.75em]" />

      {/* Note/explanation */}
      <div className="text-[0.7em] text-white/50 text-center leading-relaxed">
        <span className="font-medium text-white/70">{data.note}</span>
        <br />
        <span className="text-[0.9em]">
          Cosmic rays from supernovae constantly bombard Earth
        </span>
      </div>
    </div>
  )
}
