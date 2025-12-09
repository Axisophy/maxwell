'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// CO2 NOW WIDGET
// ===========================================
// Current atmospheric CO2 concentration
// The sobering number - big, clear, contextualised
// Data: NOAA Mauna Loa via /api/co2 (cached server-side)
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

// Milestone bar showing where we are in the range
function MilestoneBar({ current }: { current: number }) {
  const min = 280  // Pre-industrial
  const max = 450  // Headroom (unfortunately)
  const range = max - min
  const position = ((current - min) / range) * 100

  // Key milestones
  const milestones = [
    { value: 280, label: 'Pre-industrial' },
    { value: 350, label: 'Safe level' },
    { value: 400, label: '2016 threshold' },
  ]

  return (
    <div className="mt-4">
      <div className="relative h-2 bg-[#e5e5e5] rounded-full">
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
          className="absolute top-[-3px] w-1 h-4 bg-red-500 rounded-sm"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        />
        
        {/* Milestone markers */}
        {milestones.map(m => (
          <div
            key={m.value}
            className="absolute top-0 w-px h-2 bg-black/30"
            style={{ left: `${((m.value - min) / range) * 100}%` }}
            title={m.label}
          />
        ))}
      </div>
      
      {/* Scale labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-text-muted font-mono">{min}</span>
        <span className="text-[10px] text-text-muted font-mono">{max} ppm</span>
      </div>
    </div>
  )
}

export default function CO2Now() {
  const [data, setData] = useState<CO2Data | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Refresh daily (data updates monthly anyway)
    const interval = setInterval(fetchData, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="text-center py-8">
          <div className="font-mono text-5xl font-bold text-text-muted animate-pulse">
            ---.-
          </div>
          <div className="text-sm text-text-muted mt-2">Loading...</div>
        </div>
      </div>
    )
  }

  // Error state (still shows if we have no data)
  if (error && !data) {
    return (
      <div className="w-full aspect-[4/3] flex items-center justify-center">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="w-full">
      {/* Source */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-text-primary">Mauna Loa Observatory</span>
        <span className="text-xs text-text-muted font-mono">NOAA</span>
      </div>

      {/* The number */}
      <div className="text-center mb-2">
        <span className="font-mono text-5xl font-bold text-text-primary">
          {data.current.toFixed(1)}
        </span>
        <span className="text-xl text-text-muted ml-1">ppm</span>
      </div>

      {/* Date */}
      <div className="text-center text-sm text-text-muted mb-6">
        {data.currentDate}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 border-t border-[#e5e5e5] pt-4">
        {/* Year change */}
        <div className="text-center">
          <div className="text-xs text-text-muted uppercase tracking-wide mb-1">
            vs last year
          </div>
          <div className="font-mono text-lg font-medium text-red-500">
            +{data.yearChange.toFixed(1)} ppm
          </div>
        </div>

        {/* Above pre-industrial */}
        <div className="text-center">
          <div className="text-xs text-text-muted uppercase tracking-wide mb-1">
            above pre-industrial
          </div>
          <div className="font-mono text-lg font-medium text-red-500">
            +{data.percentAbovePreIndustrial.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Milestone bar */}
      <MilestoneBar current={data.current} />
    </div>
  )
}