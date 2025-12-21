'use client'

import { useState, useEffect } from 'react'

interface GeomagActivityProps {
  className?: string
}

interface KpData {
  time_tag: string
  kp: number
  observed?: boolean
}

// Geomagnetic Storm Scale (G1-G5)
function getGScale(kp: number): {
  scale: string
  level: number
  label: string
  color: string
  aurora: string
} {
  if (kp >= 9) return {
    scale: 'G5',
    level: 5,
    label: 'Extreme',
    color: '#ef4444',
    aurora: 'Aurora visible at very low latitudes'
  }
  if (kp >= 8) return {
    scale: 'G4',
    level: 4,
    label: 'Severe',
    color: '#f97316',
    aurora: 'Aurora visible at mid-latitudes'
  }
  if (kp >= 7) return {
    scale: 'G3',
    level: 3,
    label: 'Strong',
    color: '#eab308',
    aurora: 'Aurora visible at 50° latitude'
  }
  if (kp >= 6) return {
    scale: 'G2',
    level: 2,
    label: 'Moderate',
    color: '#22c55e',
    aurora: 'Aurora visible at 55° latitude'
  }
  if (kp >= 5) return {
    scale: 'G1',
    level: 1,
    label: 'Minor',
    color: '#3b82f6',
    aurora: 'Aurora visible at 60° latitude'
  }
  return {
    scale: 'G0',
    level: 0,
    label: 'Quiet',
    color: '#6b7280',
    aurora: 'Aurora at high latitudes only'
  }
}

function getKpColor(kp: number): string {
  if (kp >= 8) return '#ef4444'
  if (kp >= 7) return '#f97316'
  if (kp >= 6) return '#eab308'
  if (kp >= 5) return '#22c55e'
  if (kp >= 4) return '#3b82f6'
  return '#6b7280'
}

export default function GeomagActivity({ className = '' }: GeomagActivityProps) {
  const [currentKp, setCurrentKp] = useState<number | null>(null)
  const [history, setHistory] = useState<KpData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'
        )
        if (!response.ok) throw new Error('Failed to fetch Kp data')
        const json = await response.json()

        // Skip header row
        const data = json.slice(1).map((row: any[]) => ({
          time_tag: row[0],
          kp: parseFloat(row[1]),
          observed: row[2] === 'observed'
        }))

        // Get last 8 readings (24 hours, 3-hour intervals)
        const recent = data.slice(-8)
        setHistory(recent)

        // Current Kp is the most recent observed or estimated
        if (recent.length > 0) {
          setCurrentKp(recent[recent.length - 1].kp)
        }

        setIsLoading(false)
        setError(null)
      } catch (err) {
        setError('Unable to fetch Kp data')
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const gScale = currentKp !== null ? getGScale(currentKp) : null

  return (
    <div className={`bg-[#0f0f14] rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-white">Geomagnetic Activity</h3>
        </div>
        <span className="text-xs text-white/40 font-mono">Kp Index</span>
      </div>

      {isLoading ? (
        <div className="px-4 py-6 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="px-4 py-6">
          <p className="text-xs text-red-400 text-center">{error}</p>
        </div>
      ) : currentKp !== null && gScale ? (
        <div className="p-4">
          {/* Current Kp */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span 
                className="text-4xl font-mono font-bold"
                style={{ color: getKpColor(currentKp) }}
              >
                {currentKp.toFixed(1)}
              </span>
              <span className="text-sm text-white/40">Kp</span>
            </div>
            <div className="text-right">
              <span 
                className="text-lg font-mono font-medium"
                style={{ color: gScale.color }}
              >
                {gScale.scale}
              </span>
              <span className="text-xs text-white/40 block">{gScale.label}</span>
            </div>
          </div>

          {/* 24-hour bar chart */}
          <div className="mb-3">
            <div className="flex items-end gap-1 h-16">
              {history.map((reading, i) => {
                const height = (reading.kp / 9) * 100
                const color = getKpColor(reading.kp)
                const time = new Date(reading.time_tag)
                
                return (
                  <div 
                    key={i} 
                    className="flex-1 flex flex-col items-center"
                  >
                    <div 
                      className="w-full rounded-t"
                      style={{ 
                        height: `${height}%`, 
                        backgroundColor: color,
                        minHeight: '4px'
                      }}
                    />
                  </div>
                )
              })}
            </div>
            {/* Time labels */}
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-white/30 font-mono">
                {history.length > 0 && new Date(history[0].time_tag).toLocaleTimeString([], { hour: '2-digit' })}
              </span>
              <span className="text-[10px] text-white/30 font-mono">24h</span>
              <span className="text-[10px] text-white/30 font-mono">
                {history.length > 0 && new Date(history[history.length - 1].time_tag).toLocaleTimeString([], { hour: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Aurora info */}
          <p className="text-xs text-white/40">{gScale.aurora}</p>
        </div>
      ) : null}

      {/* Scale reference */}
      <div className="px-4 py-2 border-t border-white/10 bg-black/20">
        <div className="flex items-center justify-between text-[10px] text-white/30">
          <span>Quiet</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
              <div 
                key={level}
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: getKpColor(level) }}
              />
            ))}
          </div>
          <span>Extreme</span>
        </div>
      </div>
    </div>
  )
}
