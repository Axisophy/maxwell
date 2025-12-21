'use client'

import { useState, useEffect } from 'react'

interface StatusBarProps {
  className?: string
}

interface StatusData {
  xray: { class: string }
  solarWind: { speed: number }
  kp: { current: number; status: string }
}

function getXrayColor(xrayClass: string): string {
  if (xrayClass.startsWith('X')) return '#ef4444'
  if (xrayClass.startsWith('M')) return '#f97316'
  if (xrayClass.startsWith('C')) return '#f59e0b'
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

export default function StatusBar({ className = '' }: StatusBarProps) {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/space-weather')
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (err) {
        console.error('StatusBar fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60 * 1000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  if (loading || !data) {
    return (
      <div className={`flex items-center gap-6 ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
          <span className="text-sm font-mono text-white/40">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap items-center gap-4 md:gap-6 ${className}`}>
      {/* X-ray Flux */}
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: getXrayColor(data.xray.class) }}
        />
        <span className="text-sm font-mono text-white/60">X-ray</span>
        <span
          className="text-sm font-mono font-medium"
          style={{ color: getXrayColor(data.xray.class) }}
        >
          {data.xray.class}
        </span>
      </div>

      {/* Solar Wind */}
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: getSolarWindColor(data.solarWind.speed) }}
        />
        <span className="text-sm font-mono text-white/60">Solar Wind</span>
        <span
          className="text-sm font-mono font-medium"
          style={{ color: getSolarWindColor(data.solarWind.speed) }}
        >
          {data.solarWind.speed} km/s
        </span>
      </div>

      {/* Kp Index */}
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: getKpColor(data.kp.current) }}
        />
        <span className="text-sm font-mono text-white/60">Kp</span>
        <span
          className="text-sm font-mono font-medium"
          style={{ color: getKpColor(data.kp.current) }}
        >
          {data.kp.current}
        </span>
        <span className="text-sm text-white/40">
          {data.kp.status}
        </span>
      </div>
    </div>
  )
}
