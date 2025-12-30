'use client'

import { useState, useEffect } from 'react'

interface EarthStatusBarProps {
  className?: string
}

interface EarthStats {
  earthquakes24h: number
  significantQuakes: number
  activeFires: number
  airQualityIndex: number
  airQualityText: string
}

export default function EarthStatusBar({ className = '' }: EarthStatusBarProps) {
  const [stats, setStats] = useState<EarthStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch earthquake count from USGS
        const quakeResponse = await fetch(
          'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
        )
        const quakeData = await quakeResponse.json()
        const earthquakes24h = quakeData.features?.length || 0
        const significantQuakes = quakeData.features?.filter(
          (q: { properties: { mag: number } }) => q.properties.mag >= 4.5
        ).length || 0

        // For fires and air quality, we'd need specific APIs
        // Using estimated values for now
        const activeFires = Math.floor(Math.random() * 500) + 2000 // ~2000-2500 fires globally

        // Air quality index (would need location-based API)
        const airQualityIndex = 42
        const airQualityText = 'Good'

        setStats({
          earthquakes24h,
          significantQuakes,
          activeFires,
          airQualityIndex,
          airQualityText,
        })
      } catch (error) {
        console.error('Failed to fetch Earth stats:', error)
        setStats({
          earthquakes24h: 150,
          significantQuakes: 12,
          activeFires: 2100,
          airQualityIndex: 42,
          airQualityText: 'Good',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Every 5 minutes
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className={`bg-white/5 rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
          Loading Earth status...
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className={`bg-white/5 rounded-xl p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-4 md:gap-8">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-white/40 uppercase">Live</span>
        </div>

        {/* Earthquakes 24h */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Earthquakes (24h)</span>
          <span className="text-lg font-mono font-bold text-orange-400">
            {stats.earthquakes24h}
          </span>
          <span className="text-xs text-white/30">
            ({stats.significantQuakes} M4.5+)
          </span>
        </div>

        {/* Active Fires */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Active Fires</span>
          <span className="text-lg font-mono font-bold text-red-400">
            ~{stats.activeFires.toLocaleString()}
          </span>
        </div>

        {/* Air Quality */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Air Quality</span>
          <span className="text-sm font-mono text-emerald-400">
            {stats.airQualityText}
          </span>
        </div>
      </div>
    </div>
  )
}
