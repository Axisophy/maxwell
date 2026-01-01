'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// SPACE WEATHER WIDGET
// ===========================================
// Shows current space weather conditions
// Data: NOAA Space Weather Prediction Center
// ===========================================

interface SpaceWeatherData {
  kp: {
    current: number
    status: string
    recent: number[]
  }
  solarWind: {
    speed: number
    density: number
  }
  xray: {
    flux: string
    class: string
  }
  alerts: string[]
  timestamp: string
}

// Get color for Kp value
function getKpColor(kp: number): string {
  if (kp >= 7) return '#ef4444' // Red - severe
  if (kp >= 5) return '#f97316' // Orange - storm
  if (kp >= 4) return '#eab308' // Yellow - active
  if (kp >= 3) return '#84cc16' // Light green - unsettled
  return '#22c55e' // Green - quiet
}

// Get status text for Kp
function getKpStatus(kp: number): string {
  if (kp >= 8) return 'Severe Storm'
  if (kp >= 7) return 'Strong Storm'
  if (kp >= 6) return 'Moderate Storm'
  if (kp >= 5) return 'Minor Storm'
  if (kp >= 4) return 'Active'
  if (kp >= 3) return 'Unsettled'
  return 'Quiet'
}

// Get color for solar wind speed
function getWindColor(speed: number): string {
  if (speed >= 700) return '#ef4444'
  if (speed >= 500) return '#f97316'
  if (speed >= 400) return '#eab308'
  return '#22c55e'
}

// Get color for X-ray class
function getXrayColor(xrayClass: string): string {
  if (xrayClass.startsWith('X')) return '#ef4444'
  if (xrayClass.startsWith('M')) return '#f97316'
  if (xrayClass.startsWith('C')) return '#eab308'
  if (xrayClass.startsWith('B')) return '#84cc16'
  return '#22c55e'
}

// Kp horizontal bar component
function KpBar({ value }: { value: number }) {
  const color = getKpColor(value)
  const percentage = Math.min(100, (value / 9) * 100)

  return (
    <div className="mt-2">
      {/* Bar track */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        {/* Filled portion */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
        {/* Threshold markers */}
        <div className="absolute inset-0 flex">
          <div className="w-[33.3%] border-r border-white/20" />
          <div className="w-[22.2%] border-r border-white/20" />
          <div className="w-[22.2%] border-r border-white/20" />
          <div className="flex-1" />
        </div>
      </div>
      {/* Scale labels */}
      <div className="flex justify-between mt-1 text-[10px] font-mono text-white/40">
        <span>0</span>
        <span style={{ marginLeft: '30%' }}>3</span>
        <span style={{ marginLeft: '15%' }}>5</span>
        <span style={{ marginLeft: '15%' }}>7</span>
        <span>9</span>
      </div>
    </div>
  )
}

// Kp history mini bar chart
function KpHistory({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null

  const displayData = data.slice(-24)
  const maxKp = 9

  return (
    <div className="bg-black rounded-lg p-3">
      <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-3">
        Kp History (72h)
      </div>
      <div className="bg-[#404040] rounded overflow-hidden">
        <div className="flex items-end gap-0.5 h-16 p-2">
          {displayData.map((kp, i) => (
            <div
              key={i}
              className="flex-1 rounded-t transition-all duration-300"
              style={{
                height: `${(kp / maxKp) * 100}%`,
                backgroundColor: getKpColor(kp),
                opacity: i === displayData.length - 1 ? 1 : 0.7,
                minHeight: kp > 0 ? '2px' : '0',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SpaceWeather() {
  const [data, setData] = useState<SpaceWeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/space-weather')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      console.error('Error fetching space weather:', err)
      setError('Unable to fetch data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (isLoading) {
    return (
      <div className="bg-[#404040] p-2 md:p-4">
        <div className="flex items-center justify-center h-48">
          <div className="text-white/40 text-sm font-mono">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-[#404040] p-2 md:p-4">
        <div className="flex items-center justify-center h-48">
          <div className="text-red-400 text-sm">{error || 'No data available'}</div>
        </div>
      </div>
    )
  }

  const kpColor = getKpColor(data.kp.current)
  const kpStatus = getKpStatus(data.kp.current)
  const windColor = getWindColor(data.solarWind.speed)
  const xrayColor = getXrayColor(data.xray.class)

  // Aurora visibility threshold
  const auroraVisible = data.kp.current >= 5
  const auroraLikely = data.kp.current >= 4

  return (
    <div className="bg-[#404040] p-2 md:p-4 space-y-4">
      {/* Geomagnetic Activity Section - black frame */}
      <div className="bg-black rounded-lg p-4">
        <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">
          Geomagnetic Activity
        </div>

        {/* Kp Value and Status */}
        <div className="flex items-baseline gap-2">
          <span
            className="font-mono text-4xl font-bold leading-none"
            style={{ color: kpColor }}
          >
            {data.kp.current.toFixed(1)}
          </span>
          <span
            className="text-base font-medium"
            style={{ color: kpColor }}
          >
            {kpStatus}
          </span>
        </div>

        {/* Kp Bar */}
        <KpBar value={data.kp.current} />
      </div>

      {/* Solar Wind and X-Ray Grid - black frames with gap-px */}
      <div className="grid grid-cols-2 gap-px">
        {/* Solar Wind */}
        <div className="bg-black rounded-lg p-3">
          <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1">
            Solar Wind
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className="font-mono text-xl font-bold"
              style={{ color: windColor }}
            >
              {data.solarWind.speed.toFixed(0)}
            </span>
            <span className="text-xs text-white/40">km/s</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: windColor }}
            />
            <span className="text-[10px] text-white/50">
              {data.solarWind.speed >= 500 ? 'Elevated' : 'Normal'}
            </span>
          </div>
        </div>

        {/* X-Ray Flux */}
        <div className="bg-black rounded-lg p-3">
          <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1">
            X-Ray Flux
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className="font-mono text-xl font-bold"
              style={{ color: xrayColor }}
            >
              {data.xray.class || 'A'}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: xrayColor }}
            />
            <span className="text-[10px] text-white/50">
              {data.xray.class.startsWith('M') || data.xray.class.startsWith('X') ? 'Flare activity' : 'Low'}
            </span>
          </div>
        </div>
      </div>

      {/* Kp History - grey frame */}
      <KpHistory data={data.kp.recent} />

      {/* Aurora hint */}
      {(auroraVisible || auroraLikely) && (
        <div className="text-center">
          <span
            className="text-sm font-medium"
            style={{ color: auroraVisible ? '#22c55e' : '#eab308' }}
          >
            {auroraVisible
              ? '✨ Aurora may be visible at lower latitudes'
              : '✨ Aurora possible at high latitudes'
            }
          </span>
        </div>
      )}
    </div>
  )
}
