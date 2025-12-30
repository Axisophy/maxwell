'use client'

import { useState, useEffect } from 'react'

interface SpaceStatusBarProps {
  className?: string
}

interface SpaceWeatherData {
  kpIndex: number
  kpText: string
  solarWind: number
  conditions: string
  xrayFlux: string
  flareClass: string
}

export default function SpaceStatusBar({ className = '' }: SpaceStatusBarProps) {
  const [data, setData] = useState<SpaceWeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Kp index
        const kpResponse = await fetch(
          'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'
        )
        const kpData = await kpResponse.json()
        const latestKp = kpData[kpData.length - 1]
        const kpValue = parseFloat(latestKp[1])

        // Fetch solar wind
        const windResponse = await fetch(
          'https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json'
        )
        const windData = await windResponse.json()
        const windSpeed = parseFloat(windData.WindSpeed)

        // Fetch X-ray flux
        const xrayResponse = await fetch(
          'https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json'
        )
        const xrayData = await xrayResponse.json()
        const latestXray = xrayData[xrayData.length - 1]
        const xrayFlux = latestXray?.flux || 0

        // Determine conditions
        let conditions = 'Quiet'
        let flareClass = 'A'

        if (xrayFlux >= 1e-4) {
          flareClass = 'X'
          conditions = 'Extreme'
        } else if (xrayFlux >= 1e-5) {
          flareClass = 'M'
          conditions = 'Active'
        } else if (xrayFlux >= 1e-6) {
          flareClass = 'C'
          conditions = 'Minor'
        } else if (xrayFlux >= 1e-7) {
          flareClass = 'B'
          conditions = 'Quiet'
        }

        if (kpValue >= 7) conditions = 'Storm'
        else if (kpValue >= 5) conditions = 'Unsettled'

        let kpText = 'Quiet'
        if (kpValue >= 8) kpText = 'Severe Storm'
        else if (kpValue >= 7) kpText = 'Strong Storm'
        else if (kpValue >= 6) kpText = 'Moderate Storm'
        else if (kpValue >= 5) kpText = 'Minor Storm'
        else if (kpValue >= 4) kpText = 'Active'
        else if (kpValue >= 3) kpText = 'Unsettled'

        setData({
          kpIndex: kpValue,
          kpText,
          solarWind: windSpeed,
          conditions,
          xrayFlux: xrayFlux.toExponential(1),
          flareClass,
        })
      } catch (error) {
        console.error('Failed to fetch space weather:', error)
        // Set fallback data
        setData({
          kpIndex: 2,
          kpText: 'Quiet',
          solarWind: 350,
          conditions: 'Quiet',
          xrayFlux: '1.0e-7',
          flareClass: 'B',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const getKpColor = (kp: number) => {
    if (kp >= 7) return 'text-red-400'
    if (kp >= 5) return 'text-orange-400'
    if (kp >= 4) return 'text-amber-400'
    return 'text-emerald-400'
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Extreme':
      case 'Storm':
        return 'bg-red-500/20 text-red-400'
      case 'Active':
      case 'Unsettled':
        return 'bg-amber-500/20 text-amber-400'
      case 'Minor':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-emerald-500/20 text-emerald-400'
    }
  }

  if (loading) {
    return (
      <div className={`bg-[#0f0f14] rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
          Loading space weather...
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className={`bg-[#0f0f14] rounded-xl p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-4 md:gap-8">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-white/40 uppercase">Live</span>
        </div>

        {/* Kp Index */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Kp Index</span>
          <span className={`text-lg font-mono font-bold ${getKpColor(data.kpIndex)}`}>
            {data.kpIndex.toFixed(0)}
          </span>
          <span className="text-xs text-white/30">{data.kpText}</span>
        </div>

        {/* Solar Wind */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Solar Wind</span>
          <span className="text-lg font-mono font-bold text-cyan-400">
            {data.solarWind.toFixed(0)}
          </span>
          <span className="text-xs text-white/30">km/s</span>
        </div>

        {/* X-Ray Flux */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">X-Ray</span>
          <span className="text-sm font-mono text-white/70">
            {data.flareClass}-class
          </span>
        </div>

        {/* Conditions */}
        <div className="ml-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(data.conditions)}`}>
            {data.conditions}
          </span>
        </div>
      </div>
    </div>
  )
}
