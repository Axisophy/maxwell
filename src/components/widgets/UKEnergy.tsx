'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'

// ===========================================
// UK ENERGY WIDGET
// ===========================================

type ViewMode = 'now' | '24h' | 'forecast'

interface IntensityData {
  from: string
  to: string
  forecast: number
  actual: number | null
  index: string
}

interface GenerationMix {
  fuel: string
  perc: number
}

interface UKEnergyData {
  intensity: {
    current: number
    index: string
  }
  generation: GenerationMix[]
  renewablePercent: number
  lowCarbonPercent: number
  history: IntensityData[]
  forecast: IntensityData[]
  demand?: number
}

// Fuel colours - refined palette
const FUEL_COLORS: Record<string, string> = {
  wind: '#22c55e',
  solar: '#facc15',
  nuclear: '#a855f7',
  hydro: '#06b6d4',
  biomass: '#84cc16',
  gas: '#f97316',
  coal: '#525252',
  imports: '#3b82f6',
  other: '#737373',
}

// Get intensity color
function getIntensityColor(index: string): string {
  switch (index?.toLowerCase()) {
    case 'very low': return '#22c55e'
    case 'low': return '#84cc16'
    case 'moderate': return '#facc15'
    case 'high': return '#f97316'
    case 'very high': return '#ef4444'
    default: return '#737373'
  }
}

// Get intensity label
function getIntensityLabel(index: string): string {
  switch (index?.toLowerCase()) {
    case 'very low': return 'Very Clean'
    case 'low': return 'Clean'
    case 'moderate': return 'Moderate'
    case 'high': return 'Dirty'
    case 'very high': return 'Very Dirty'
    default: return 'Unknown'
  }
}

// ===========================================
// INTENSITY CHART
// ===========================================

function IntensityChart({
  data,
  showForecast = false
}: {
  data: IntensityData[]
  showForecast?: boolean
}) {
  if (!data || data.length === 0) return null

  const values = data.map(d => d.forecast || d.actual || 0)
  const maxIntensity = Math.max(...values, 300)
  const chartHeight = 80

  // Safely parse the first date
  const firstDate = data[0]?.from ? new Date(data[0].from) : null
  const startTimeLabel = firstDate && !isNaN(firstDate.getTime())
    ? format(firstDate, 'HH:mm')
    : '--:--'

  return (
    <div className="bg-[#404040] rounded p-2">
      <div className="flex items-end gap-0.5 h-20">
        {data.map((point, i) => {
          const value = showForecast ? point.forecast : (point.actual ?? point.forecast)
          const height = (value / maxIntensity) * chartHeight
          const color = getIntensityColor(point.index)

          // Safely format the tooltip time
          const pointDate = point.from ? new Date(point.from) : null
          const timeLabel = pointDate && !isNaN(pointDate.getTime())
            ? format(pointDate, 'HH:mm')
            : '--:--'

          return (
            <div
              key={i}
              className="flex-1 rounded-t transition-all duration-300"
              style={{
                height: `${height}%`,
                backgroundColor: color,
                opacity: 0.85,
              }}
              title={`${timeLabel}: ${value} gCO₂/kWh`}
            />
          )
        })}
      </div>
      {/* Time labels */}
      <div className="flex justify-between mt-1 text-[10px] font-mono text-white/40">
        <span>{startTimeLabel}</span>
        <span>{showForecast ? '+24h' : 'Now'}</span>
      </div>
    </div>
  )
}

// ===========================================
// GENERATION MIX BAR
// ===========================================

function GenerationMixBar({ generation }: { generation: GenerationMix[] }) {
  const sorted = [...generation].sort((a, b) => b.perc - a.perc)

  return (
    <div>
      {/* Stacked bar */}
      <div className="h-6 rounded overflow-hidden flex">
        {sorted.map((fuel) => (
          <div
            key={fuel.fuel}
            className="h-full transition-all duration-500"
            style={{
              width: `${fuel.perc}%`,
              backgroundColor: FUEL_COLORS[fuel.fuel] || '#737373',
              minWidth: fuel.perc > 0 ? '2px' : '0',
            }}
            title={`${fuel.fuel}: ${fuel.perc.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {sorted.filter(f => f.perc >= 1).map((fuel) => (
          <div key={fuel.fuel} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: FUEL_COLORS[fuel.fuel] || '#737373' }}
            />
            <span className="text-[10px] text-white/60 uppercase">{fuel.fuel}</span>
            <span className="text-[10px] font-mono text-white/40">{fuel.perc.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===========================================
// NOW VIEW
// ===========================================

function NowView({ data }: { data: UKEnergyData }) {
  const intensityColor = getIntensityColor(data.intensity?.index || '')
  const intensityLabel = getIntensityLabel(data.intensity?.index || '')

  return (
    <div className="space-y-px">
      {/* Grid Status */}
      <div className="bg-black rounded-lg p-3">
        <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">
          Grid Status
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="font-mono text-4xl font-bold"
            style={{ color: intensityColor }}
          >
            {data.intensity?.current ?? '—'}
          </span>
          <span className="text-xs text-white/40">gCO₂/kWh</span>
        </div>
        <div
          className="text-sm font-medium mt-1"
          style={{ color: intensityColor }}
        >
          {intensityLabel}
        </div>
      </div>

      {/* Current Generation */}
      <div className="bg-black rounded-lg p-3">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
            Generation Mix
          </span>
          <span className="text-xs text-white/60">
            <span className="text-green-500 font-mono">{(data.renewablePercent ?? 0).toFixed(0)}%</span>
            <span className="text-white/40 mx-1">renewable</span>
          </span>
        </div>
        {data.generation && data.generation.length > 0 ? (
          <GenerationMixBar generation={data.generation} />
        ) : (
          <div className="text-white/40 text-sm text-center py-2">No generation data</div>
        )}
      </div>

      {/* Demand (if available) */}
      {data.demand && (
        <div className="bg-black rounded-lg p-3">
          <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">
            Current Demand
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-bold text-white">
              {(data.demand / 1000).toFixed(1)}
            </span>
            <span className="text-xs text-white/40">GW</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ===========================================
// 24H VIEW
// ===========================================

function HistoryView({ data }: { data: UKEnergyData }) {
  const values = data.history
    .map(h => h.actual ?? h.forecast)
    .filter((v): v is number => v !== null && v !== undefined)

  const min = values.length > 0 ? Math.min(...values) : 0
  const max = values.length > 0 ? Math.max(...values) : 0
  const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0

  return (
    <div className="space-y-px">
      {/* Carbon Intensity History */}
      <div className="bg-black rounded-lg p-3">
        <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-3">
          Carbon Intensity (Past 24h)
        </div>
        {data.history.length > 0 ? (
          <IntensityChart data={data.history} />
        ) : (
          <div className="text-white/40 text-sm text-center py-4">No history data</div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px">
        <div className="bg-black rounded-lg p-3 text-center">
          <div className="text-[10px] text-white/40 uppercase">Min</div>
          <div className="font-mono text-lg font-bold text-green-500">{min.toFixed(0)}</div>
        </div>
        <div className="bg-black rounded-lg p-3 text-center">
          <div className="text-[10px] text-white/40 uppercase">Avg</div>
          <div className="font-mono text-lg font-bold text-white">{avg.toFixed(0)}</div>
        </div>
        <div className="bg-black rounded-lg p-3 text-center">
          <div className="text-[10px] text-white/40 uppercase">Max</div>
          <div className="font-mono text-lg font-bold text-orange-500">{max.toFixed(0)}</div>
        </div>
      </div>
    </div>
  )
}

// ===========================================
// FORECAST VIEW
// ===========================================

function ForecastView({ data }: { data: UKEnergyData }) {
  // Find the cleanest period in forecast
  const cleanestPeriod = data.forecast.length > 0
    ? data.forecast.reduce((best, current) =>
        current.forecast < best.forecast ? current : best
      , data.forecast[0])
    : null

  return (
    <div className="space-y-px">
      {/* Forecast Chart */}
      <div className="bg-black rounded-lg p-3">
        <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-3">
          Carbon Intensity (Next 24h)
        </div>
        {data.forecast.length > 0 ? (
          <IntensityChart data={data.forecast} showForecast />
        ) : (
          <div className="text-white/40 text-sm text-center py-4">No forecast data</div>
        )}
      </div>

      {/* Best Time */}
      {cleanestPeriod && (
        <div className="bg-black rounded-lg p-3">
          <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">
            Best Time to Use Power
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-green-500">
              {format(new Date(cleanestPeriod.from), 'HH:mm')}
            </span>
            <span className="text-xs text-white/40">
              ({cleanestPeriod.forecast} gCO₂/kWh)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function UKEnergy() {
  const [viewMode, setViewMode] = useState<ViewMode>('now')
  const [data, setData] = useState<UKEnergyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/uk-energy')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
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
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (isLoading) {
    return (
      <div className="bg-white p-2 md:p-4">
        <div className="flex items-center justify-center h-48">
          <div className="text-black/40 text-sm font-mono">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-white p-2 md:p-4">
        <div className="flex items-center justify-center h-48">
          <div className="text-red-500 text-sm">{error || 'No data available'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-2 md:p-4">
      {/* View mode selector */}
      <div className="flex gap-px mb-4">
        {(['now', '24h', 'forecast'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`
              flex-1 px-2 py-2 text-xs font-medium rounded-lg transition-colors uppercase
              ${viewMode === mode
                ? 'bg-[#31c950] text-white'
                : 'bg-black text-white/60 hover:text-white'
              }
            `}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* View content */}
      {viewMode === 'now' && <NowView data={data} />}
      {viewMode === '24h' && <HistoryView data={data} />}
      {viewMode === 'forecast' && <ForecastView data={data} />}
    </div>
  )
}
