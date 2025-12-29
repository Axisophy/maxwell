'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// CO2 NOW
// ===========================================
// Current atmospheric CO2 concentration
// Data: NOAA Mauna Loa via /api/co2
//
// Design notes:
// - NO title/source (WidgetFrame handles those)
// - Hero number with context
// - Milestone bar showing historical range
// ===========================================

interface CO2Data {
  current: number
  currentDate: string
  yearAgo: number
  yearChange: number
  preIndustrial: number
  abovePreIndustrial: number
  percentAbovePreIndustrial: number
  timestamp: string
}

export default function CO2Now() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [data, setData] = useState<CO2Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/co2')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      console.error('Error fetching CO2 data:', err)
      setError('Unable to fetch data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full bg-white p-[1em]"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-[0.875em] text-black/50">Loading CO₂ data...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full bg-white p-[1em]"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-[0.875em] text-red-500">{error || 'No data'}</div>
      </div>
    )
  }

  // Milestone bar calculations
  const min = 280  // Pre-industrial
  const max = 450  // Projection headroom
  const range = max - min
  const position = ((data.current - min) / range) * 100

  const milestones = [
    { value: 280, label: 'Pre-industrial' },
    { value: 350, label: 'Safe level' },
    { value: 400, label: '2016' },
  ]

  return (
    <div
      ref={containerRef}
      className="h-full bg-white overflow-hidden flex flex-col p-[1em]"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Hero number */}
      <div className="text-center mb-[0.5em]">
        <div className="text-[3em] font-mono font-bold text-black leading-none">
          {data.current.toFixed(1)}
        </div>
        <div className="text-[0.875em] text-black/50 mt-[0.25em]">
          parts per million
        </div>
        <div className="text-[0.75em] text-black/40 mt-[0.125em]">
          {data.currentDate}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-[0.75em] mb-[0.75em]">
        <div className="bg-[#fef2f2] rounded-[0.5em] p-[0.625em] text-center">
          <div className="text-[0.6875em] text-black/50 uppercase tracking-wider mb-[0.125em]">
            vs last year
          </div>
          <div className="text-[1.25em] font-mono font-medium text-red-600">
            +{data.yearChange.toFixed(1)}
          </div>
        </div>
        <div className="bg-[#fef2f2] rounded-[0.5em] p-[0.625em] text-center">
          <div className="text-[0.6875em] text-black/50 uppercase tracking-wider mb-[0.125em]">
            above pre-industrial
          </div>
          <div className="text-[1.25em] font-mono font-medium text-red-600">
            +{data.percentAbovePreIndustrial.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Milestone bar */}
      <div className="mt-auto">
        <div className="relative h-[0.5em] bg-black/10 rounded-full overflow-visible">
          {/* Gradient fill */}
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              width: `${position}%`,
              background: 'linear-gradient(90deg, #fcd34d 0%, #f97316 50%, #ef4444 100%)',
            }}
          />

          {/* Current marker */}
          <div
            className="absolute top-[-0.125em] w-[0.25em] h-[0.75em] bg-red-500 rounded-sm"
            style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
          />

          {/* Milestone markers */}
          {milestones.map(m => (
            <div
              key={m.value}
              className="absolute top-0 w-px h-[0.5em] bg-black/30"
              style={{ left: `${((m.value - min) / range) * 100}%` }}
              title={m.label}
            />
          ))}
        </div>

        {/* Scale labels */}
        <div className="flex justify-between mt-[0.25em]">
          <span className="text-[0.625em] text-black/40 font-mono">{min}</span>
          <span className="text-[0.625em] text-black/40 font-mono">{max} ppm</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] mt-[0.5em] border-t border-black/5">
        <span className="text-[0.625em] text-black/40">
          Mauna Loa Observatory
        </span>
        <span className="text-[0.625em] text-black/40">
          Updated monthly
        </span>
      </div>
    </div>
  )
}
