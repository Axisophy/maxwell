'use client'

import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

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

function getXrayColor(xrayClass: string): string {
  if (xrayClass.startsWith('X')) return '#ef4444'
  if (xrayClass.startsWith('M')) return '#f97316'
  if (xrayClass.startsWith('C')) return '#f59e0b'
  if (xrayClass.startsWith('B')) return '#22c55e'
  return '#22c55e'
}

function getSolarWindColor(speed: number): string {
  if (speed >= 700) return '#ef4444'
  if (speed >= 500) return '#f59e0b'
  return '#22c55e'
}

function getKpColor(kp: number): string {
  if (kp >= 7) return '#ef4444'
  if (kp >= 5) return '#f59e0b'
  if (kp >= 4) return '#eab308'
  return '#22c55e'
}

function getKpScale(kp: number): string {
  if (kp >= 9) return 'G5'
  if (kp >= 8) return 'G4'
  if (kp >= 7) return 'G3'
  if (kp >= 6) return 'G2'
  if (kp >= 5) return 'G1'
  return 'G0'
}

function getXrayLevel(xrayClass: string): string {
  if (xrayClass.startsWith('X')) return 'Major flare'
  if (xrayClass.startsWith('M')) return 'Medium flare'
  if (xrayClass.startsWith('C')) return 'Small flare'
  if (xrayClass.startsWith('B')) return 'Minor'
  return 'Background'
}

export default function SpaceWeatherGrid() {
  const [data, setData] = useState<SpaceWeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/space-weather')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError('Unable to load space weather data')
      console.error('Space weather fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !data) {
    return (
      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono text-white/40 uppercase tracking-wider">
            Space Weather Data
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-white/10 rounded w-20 mb-2" />
              <div className="h-8 bg-white/10 rounded w-16 mb-1" />
              <div className="h-3 bg-white/10 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono text-white/40 uppercase tracking-wider">
            Space Weather Data
          </h3>
          <button
            onClick={fetchData}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-white/40" />
          </button>
        </div>
        <p className="text-white/50 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white/5 rounded-xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-mono text-white/40 uppercase tracking-wider">
            Space Weather Data
          </h3>
          <p className="text-xs text-white/20 mt-0.5">
            NOAA SWPC
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 text-white/40 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {/* X-ray Flux */}
        <div>
          <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">
            X-ray Flux
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl md:text-3xl font-mono font-medium"
              style={{ color: getXrayColor(data?.xray.class || 'A') }}
            >
              {data?.xray.class || 'A'}
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            {getXrayLevel(data?.xray.class || 'A')}
          </p>
        </div>

        {/* Solar Wind Speed */}
        <div>
          <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">
            Solar Wind
          </p>
          <div className="flex items-baseline gap-1">
            <span
              className="text-2xl md:text-3xl font-mono font-medium"
              style={{ color: getSolarWindColor(data?.solarWind.speed || 0) }}
            >
              {data?.solarWind.speed || 0}
            </span>
            <span className="text-xs text-white/30">km/s</span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            {(data?.solarWind.speed || 0) >= 700
              ? 'High'
              : (data?.solarWind.speed || 0) >= 500
              ? 'Elevated'
              : 'Normal'}
          </p>
        </div>

        {/* Kp Index */}
        <div>
          <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">
            Kp Index
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl md:text-3xl font-mono font-medium"
              style={{ color: getKpColor(data?.kp.current || 0) }}
            >
              {data?.kp.current || 0}
            </span>
            <span className="text-sm font-mono text-white/30">
              {getKpScale(data?.kp.current || 0)}
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            {data?.kp.status || 'Quiet'}
          </p>
        </div>

        {/* Plasma Density */}
        <div>
          <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">
            Plasma Density
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-mono font-medium text-white">
              {data?.solarWind.density?.toFixed(1) || '0'}
            </span>
            <span className="text-xs text-white/30">p/cm³</span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Particles per cm³
          </p>
        </div>
      </div>

      {/* Kp Sparkline */}
      {data?.kp.recent && data.kp.recent.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-white/30 mb-2">24-hour Kp trend</p>
          <div className="flex items-end gap-0.5 h-8">
            {data.kp.recent.map((kp, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all"
                style={{
                  height: `${Math.max((kp / 9) * 100, 5)}%`,
                  backgroundColor: getKpColor(kp),
                  opacity: 0.3 + (i / data.kp.recent.length) * 0.7,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Alerts */}
      {data?.alerts && data.alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-white/30 mb-2">Active Alerts</p>
          <div className="space-y-1">
            {data.alerts.map((alert, i) => (
              <p key={i} className="text-xs text-white/60">
                {alert}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
