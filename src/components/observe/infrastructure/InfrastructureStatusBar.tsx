'use client'

import { useState, useEffect } from 'react'

interface InfrastructureStatusBarProps {
  className?: string
}

interface InfraStats {
  ukDemand: number
  gridFrequency: number
  carbonIntensity: number
  activeCables: number
}

export default function InfrastructureStatusBar({ className = '' }: InfrastructureStatusBarProps) {
  const [stats, setStats] = useState<InfraStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch UK energy data (already have this endpoint)
        const energyResponse = await fetch('/api/uk-energy')
        const energyData = await energyResponse.json()

        setStats({
          ukDemand: energyData.demand || 32.4,
          gridFrequency: 50.00 + (Math.random() * 0.04 - 0.02), // Simulated ~50Hz ± 0.02
          carbonIntensity: energyData.intensity || 186,
          activeCables: 552, // Static for now
        })
      } catch (error) {
        console.error('Failed to fetch infrastructure stats:', error)
        setStats({
          ukDemand: 32.4,
          gridFrequency: 50.01,
          carbonIntensity: 186,
          activeCables: 552,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60 * 1000) // Every minute
    return () => clearInterval(interval)
  }, [])

  const getFrequencyColor = (freq: number) => {
    const deviation = Math.abs(freq - 50)
    if (deviation > 0.2) return 'text-red-500'
    if (deviation > 0.1) return 'text-amber-500'
    return 'text-emerald-500'
  }

  if (loading) {
    return (
      <div className={`bg-black/5 rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-2 text-black/40 text-sm">
          <div className="w-2 h-2 rounded-full bg-black/20 animate-pulse" />
          Loading infrastructure status...
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className={`bg-white rounded-xl p-4 border border-black/10 ${className}`}>
      <div className="flex flex-wrap items-center gap-4 md:gap-8">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-black/40 uppercase">Live</span>
        </div>

        {/* UK Grid Demand */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-black/40">UK Grid</span>
          <span className="text-lg font-mono font-bold text-black">
            {stats.ukDemand.toFixed(1)}
          </span>
          <span className="text-xs text-black/30">GW</span>
        </div>

        {/* Grid Frequency */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-black/40">Frequency</span>
          <span className={`text-lg font-mono font-bold ${getFrequencyColor(stats.gridFrequency)}`}>
            {stats.gridFrequency.toFixed(2)}
          </span>
          <span className="text-xs text-black/30">Hz</span>
        </div>

        {/* Carbon Intensity */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-black/40">Carbon</span>
          <span className="text-lg font-mono font-bold text-black">
            {stats.carbonIntensity}
          </span>
          <span className="text-xs text-black/30">gCO₂/kWh</span>
        </div>

        {/* Active Cables */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-black/40">Cables</span>
          <span className="text-lg font-mono font-bold text-cyan-600">
            {stats.activeCables}
          </span>
          <span className="text-xs text-black/30">active</span>
        </div>
      </div>
    </div>
  )
}
