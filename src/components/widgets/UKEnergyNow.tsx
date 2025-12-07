'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UKEnergyData {
  intensity: {
    actual: number
    forecast: number
    index: string
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

// Colors for each energy source
const FUEL_COLORS: Record<string, string> = {
  wind: '#22c55e',      // Green
  solar: '#fbbf24',     // Yellow
  nuclear: '#a855f7',   // Purple
  hydro: '#06b6d4',     // Cyan
  biomass: '#84cc16',   // Lime
  gas: '#f97316',       // Orange
  coal: '#6b7280',      // Gray
  imports: '#3b82f6',   // Blue
  other: '#9ca3af'      // Light gray
}

// Nice labels
const FUEL_LABELS: Record<string, string> = {
  wind: 'Wind',
  solar: 'Solar',
  nuclear: 'Nuclear',
  hydro: 'Hydro',
  biomass: 'Biomass',
  gas: 'Gas',
  coal: 'Coal',
  imports: 'Imports',
  other: 'Other'
}

// Carbon intensity gauge
function IntensityGauge({ value, index, isLarge = false }: { value: number; index: string; isLarge?: boolean }) {
  // Scale: 0-500 gCO2/kWh is the typical range
  const percentage = Math.min(100, (value / 400) * 100)
  
  const getColor = () => {
    if (index === 'very low') return '#22c55e'
    if (index === 'low') return '#84cc16'
    if (index === 'moderate') return '#eab308'
    if (index === 'high') return '#f97316'
    return '#ef4444'
  }
  
  const color = getColor()
  
  return (
    <div className="flex flex-col items-center">
      <div className={`text-white/80 uppercase tracking-wide font-medium mb-2 ${isLarge ? 'text-base' : 'text-sm'}`}>
        Carbon Intensity
      </div>
      <div className={`relative ${isLarge ? 'w-44 h-44' : 'w-28 h-28'}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="10"
          />
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.51} 251`}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
              transition: 'stroke-dasharray 0.5s ease'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className={`font-mono font-bold ${isLarge ? 'text-4xl' : 'text-2xl'}`}
            style={{ color }}
          >
            {value}
          </span>
          <span className={`text-white/70 font-medium ${isLarge ? 'text-sm' : 'text-xs'}`}>gCO₂/kWh</span>
        </div>
      </div>
      <div 
        className={`mt-2 font-medium capitalize ${isLarge ? 'text-xl' : 'text-base'}`}
        style={{ color }}
      >
        {index}
      </div>
    </div>
  )
}

// Generation mix bar
function GenerationBar({ generation, isLarge = false }: { generation: UKEnergyData['generation']; isLarge?: boolean }) {
  // Order sources by percentage (descending)
  const sources = Object.entries(generation)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
  
  return (
    <div className="w-full">
      <div className={`text-white/80 uppercase tracking-wide font-medium mb-2 ${isLarge ? 'text-base mb-3' : 'text-sm'}`}>
        Generation Mix
      </div>
      
      {/* Stacked bar */}
      <div className={`rounded-full overflow-hidden flex bg-white/10 ${isLarge ? 'h-10' : 'h-7'}`}>
        {sources.map(([fuel, perc]) => (
          <div
            key={fuel}
            className="h-full transition-all duration-500 relative group"
            style={{
              width: `${perc}%`,
              backgroundColor: FUEL_COLORS[fuel],
              minWidth: perc > 0 ? '4px' : '0'
            }}
          >
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className={`bg-black/90 text-white px-2 py-1 rounded whitespace-nowrap font-medium ${isLarge ? 'text-base' : 'text-sm'}`}>
                {FUEL_LABELS[fuel]}: {perc.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className={`mt-3 grid gap-x-3 ${isLarge ? 'grid-cols-3 gap-y-3' : 'grid-cols-3 gap-y-2'}`}>
        {sources.map(([fuel, perc]) => (
          <div key={fuel} className="flex items-center gap-1.5">
            <div 
              className={`rounded-full shrink-0 ${isLarge ? 'w-3 h-3' : 'w-2.5 h-2.5'}`}
              style={{ backgroundColor: FUEL_COLORS[fuel] }}
            />
            <span className={`text-white/80 truncate font-normal ${isLarge ? 'text-base' : 'text-sm'}`}>
              {FUEL_LABELS[fuel]}
            </span>
            <span className={`font-mono font-bold text-white ml-auto ${isLarge ? 'text-base' : 'text-sm'}`}>
              {perc.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Summary stats
function SummaryStats({ renewable, lowCarbon, isLarge = false }: { renewable: number; lowCarbon: number; isLarge?: boolean }) {
  return (
    <div className={`flex ${isLarge ? 'gap-4' : 'gap-3'}`}>
      <div className={`flex-1 bg-white/10 rounded-lg text-center ${isLarge ? 'p-5' : 'p-3'}`}>
        <div className={`text-white/70 uppercase tracking-wide font-medium mb-1 ${isLarge ? 'text-sm' : 'text-xs'}`}>
          Renewable
        </div>
        <div className={`font-mono font-bold text-green-400 ${isLarge ? 'text-3xl' : 'text-xl'}`}>
          {renewable.toFixed(0)}%
        </div>
      </div>
      <div className={`flex-1 bg-white/10 rounded-lg text-center ${isLarge ? 'p-5' : 'p-3'}`}>
        <div className={`text-white/70 uppercase tracking-wide font-medium mb-1 ${isLarge ? 'text-sm' : 'text-xs'}`}>
          Low Carbon
        </div>
        <div className={`font-mono font-bold text-cyan-400 ${isLarge ? 'text-3xl' : 'text-xl'}`}>
          {lowCarbon.toFixed(0)}%
        </div>
      </div>
    </div>
  )
}

export default function UKEnergyNow() {
  const [data, setData] = useState<UKEnergyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLarge, setIsLarge] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect container size for responsive scaling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Consider "large" when width > 500px OR height > 400px
        const isWide = entry.contentRect.width > 500
        const isTall = entry.contentRect.height > 400
        setIsLarge(isWide || isTall)
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

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
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [fetchData])

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[300px] bg-[#0d1117] flex items-center justify-center">
        <div className="text-emerald-400 text-sm font-medium animate-pulse">Connecting to National Grid...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="w-full h-full min-h-[300px] bg-[#0d1117] flex items-center justify-center">
        <div className="text-red-400 text-sm font-medium">{error || 'No data available'}</div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px] bg-[#0d1117] relative overflow-hidden">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}
      />
      
      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col ${isLarge ? 'p-8' : 'p-4'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className={`text-white/80 uppercase tracking-wide font-medium ${isLarge ? 'text-base' : 'text-sm'}`}>
              Great Britain Grid
            </span>
          </div>
          <div className={`text-emerald-400/80 font-mono font-medium ${isLarge ? 'text-base' : 'text-sm'}`}>
            Live
          </div>
        </div>
        
        {/* Main content area */}
        <div className={`flex-1 flex flex-col ${isLarge ? 'gap-8' : 'gap-4'}`}>
          {/* Top section: Gauge and summary */}
          <div className={`flex items-center ${isLarge ? 'gap-8' : 'gap-4'}`}>
            <IntensityGauge 
              value={data.intensity.actual || data.intensity.forecast} 
              index={data.intensity.index}
              isLarge={isLarge}
            />
            <div className="flex-1">
              <SummaryStats 
                renewable={data.renewablePercent} 
                lowCarbon={data.lowCarbonPercent}
                isLarge={isLarge}
              />
            </div>
          </div>
          
          {/* Generation mix */}
          <div className="flex-1">
            <GenerationBar generation={data.generation} isLarge={isLarge} />
          </div>
        </div>
        
        {/* Footer note */}
        <div className={`text-white/50 text-center font-normal ${isLarge ? 'mt-4 text-base' : 'mt-2 text-sm'}`}>
          Data from National Grid ESO
        </div>
      </div>
    </div>
  )
}
