'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// UK ENERGY WIDGET
// ===========================================
// Live data from National Grid ESO showing:
// - Carbon intensity (gCO₂/kWh)
// - Generation mix by fuel type
// - Renewable and low-carbon percentages
// ===========================================

interface UKEnergyData {
  intensity: {
    actual: number | null
    forecast: number
    index: string // 'very low' | 'low' | 'moderate' | 'high' | 'very high'
  }
  generation: {
    gas: number
    coal: number
    nuclear: number
    wind: number
    solar: number
    hydro: number
    imports: number
    biomass: number
    other: number
  }
  renewablePercent: number
  lowCarbonPercent: number
  timestamp: string
}

// Fuel type configuration
const FUELS = [
  { key: 'wind', label: 'Wind', color: '#22c55e', category: 'renewable' },
  { key: 'solar', label: 'Solar', color: '#eab308', category: 'renewable' },
  { key: 'nuclear', label: 'Nuclear', color: '#a855f7', category: 'low-carbon' },
  { key: 'gas', label: 'Gas', color: '#f97316', category: 'fossil' },
  { key: 'biomass', label: 'Biomass', color: '#84cc16', category: 'renewable' },
  { key: 'hydro', label: 'Hydro', color: '#06b6d4', category: 'renewable' },
  { key: 'imports', label: 'Imports', color: '#3b82f6', category: 'other' },
  { key: 'coal', label: 'Coal', color: '#6b7280', category: 'fossil' },
  { key: 'other', label: 'Other', color: '#9ca3af', category: 'other' },
] as const

// Get intensity color
function getIntensityColor(index: string): string {
  switch (index) {
    case 'very low':
      return '#22c55e'
    case 'low':
      return '#84cc16'
    case 'moderate':
      return '#eab308'
    case 'high':
      return '#f97316'
    case 'very high':
      return '#ef4444'
    default:
      return '#6b7280'
  }
}

// Get intensity background (lighter version)
function getIntensityBg(index: string): string {
  switch (index) {
    case 'very low':
      return '#dcfce7'
    case 'low':
      return '#ecfccb'
    case 'moderate':
      return '#fef9c3'
    case 'high':
      return '#ffedd5'
    case 'very high':
      return '#fee2e2'
    default:
      return '#f5f5f5'
  }
}

export default function UKEnergy() {
  const [data, setData] = useState<UKEnergyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/uk-energy')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      console.error('Error fetching UK energy:', err)
      setError('Unable to fetch data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Every 5 minutes
    return () => clearInterval(interval)
  }, [fetchData])

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 space-y-4 animate-pulse">
        <div className="h-20 bg-[#e5e5e5] rounded-lg" />
        <div className="h-6 bg-[#e5e5e5] rounded-full" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-[#e5e5e5] rounded" />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="text-red-500 text-sm mb-2">{error || 'No data available'}</div>
          <button
            onClick={fetchData}
            className="text-sm text-black/50 hover:text-black underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  const intensityValue = data.intensity.actual ?? data.intensity.forecast
  const intensityColor = getIntensityColor(data.intensity.index)
  const intensityBg = getIntensityBg(data.intensity.index)

  // Sort fuels by percentage (descending), filter out zeros
  const sortedFuels = FUELS.map((fuel) => ({
    ...fuel,
    value: data.generation[fuel.key as keyof typeof data.generation] || 0,
  }))
    .filter((f) => f.value > 0)
    .sort((a, b) => b.value - a.value)

  // Time since update
  const getTimeAgo = () => {
    if (!lastUpdated) return ''
    const mins = Math.floor((Date.now() - lastUpdated.getTime()) / 60000)
    if (mins < 1) return 'Just now'
    if (mins === 1) return '1m ago'
    return `${mins}m ago`
  }

  return (
    <div className="p-4 space-y-4">
      {/* Carbon Intensity Hero */}
      <div
        className="p-4 rounded-lg text-center"
        style={{ backgroundColor: intensityBg }}
      >
        <div className="text-[10px] text-black/50 uppercase tracking-wide mb-1">
          Carbon Intensity
        </div>
        <div className="flex items-baseline justify-center gap-1">
          <span
            className="font-mono text-4xl font-bold"
            style={{ color: intensityColor }}
          >
            {intensityValue}
          </span>
          <span className="text-sm text-black/50">gCO₂/kWh</span>
        </div>
        <div
          className="text-sm font-medium capitalize mt-1"
          style={{ color: intensityColor }}
        >
          {data.intensity.index}
        </div>
      </div>

      {/* Summary stats row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-[#f5f5f5] rounded-lg text-center">
          <div className="font-mono text-2xl font-bold text-green-600">
            {data.renewablePercent.toFixed(0)}%
          </div>
          <div className="text-[10px] text-black/50 uppercase tracking-wide">
            Renewable
          </div>
        </div>
        <div className="p-3 bg-[#f5f5f5] rounded-lg text-center">
          <div className="font-mono text-2xl font-bold text-cyan-600">
            {data.lowCarbonPercent.toFixed(0)}%
          </div>
          <div className="text-[10px] text-black/50 uppercase tracking-wide">
            Low Carbon
          </div>
        </div>
      </div>

      {/* Generation mix bar */}
      <div>
        <div className="text-[10px] text-black/50 uppercase tracking-wide mb-2">
          Generation Mix
        </div>
        <div className="h-4 rounded-full overflow-hidden flex bg-[#e5e5e5]">
          {sortedFuels.map((fuel) => (
            <div
              key={fuel.key}
              className="h-full transition-all duration-500"
              style={{
                width: `${fuel.value}%`,
                backgroundColor: fuel.color,
                minWidth: fuel.value > 0 ? '2px' : '0',
              }}
              title={`${fuel.label}: ${fuel.value.toFixed(1)}%`}
            />
          ))}
        </div>
      </div>

      {/* Fuel breakdown */}
      <div className="space-y-1.5">
        {sortedFuels.map((fuel) => (
          <div key={fuel.key} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: fuel.color }}
            />
            <span className="text-sm flex-1">{fuel.label}</span>
            <span className="font-mono text-sm text-black/70">
              {fuel.value.toFixed(1)}%
            </span>
            {/* Mini bar */}
            <div className="w-16 h-1.5 bg-[#e5e5e5] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${fuel.value}%`,
                  backgroundColor: fuel.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-black/40 pt-2 border-t border-[#e5e5e5]">
        <span>National Grid ESO</span>
        <span>{getTimeAgo()}</span>
      </div>
    </div>
  )
}