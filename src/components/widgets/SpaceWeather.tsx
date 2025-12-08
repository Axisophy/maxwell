'use client'

import { useState, useEffect, useCallback } from 'react'

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

// Kp Index gauge component
function KpGauge({ value }: { value: number }) {
  const normalizedValue = Math.min(9, Math.max(0, value))
  const angle = (normalizedValue / 9) * 180 - 90
  
  const getColor = (kp: number) => {
    if (kp >= 7) return '#ef4444'
    if (kp >= 5) return '#f97316'
    if (kp >= 4) return '#eab308'
    if (kp >= 3) return '#84cc16'
    return '#22c55e'
  }
  
  const color = getColor(normalizedValue)
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-20">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="#e5e5e5"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Colored segments */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            const startAngle = (i / 9) * 180 - 180
            const endAngle = ((i + 1) / 9) * 180 - 180
            const startRad = (startAngle * Math.PI) / 180
            const endRad = (endAngle * Math.PI) / 180
            const x1 = 50 + 40 * Math.cos(startRad)
            const y1 = 55 + 40 * Math.sin(startRad)
            const x2 = 50 + 40 * Math.cos(endRad)
            const y2 = 55 + 40 * Math.sin(endRad)
            
            const segmentColor = i <= normalizedValue ? getColor(i) : '#e5e5e5'
            
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} A 40 40 0 0 1 ${x2} ${y2}`}
                fill="none"
                stroke={segmentColor}
                strokeWidth="6"
                strokeLinecap="butt"
                opacity={i <= normalizedValue ? 1 : 0.4}
              />
            )
          })}
          
          {/* Needle */}
          <g transform={`rotate(${angle}, 50, 55)`}>
            <line x1="50" y1="55" x2="50" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="55" r="4" fill={color} />
          </g>
          
          {/* Scale labels */}
          <text x="12" y="58" fill="#666666" fontSize="7" fontWeight="500" textAnchor="middle">0</text>
          <text x="50" y="12" fill="#666666" fontSize="7" fontWeight="500" textAnchor="middle">5</text>
          <text x="88" y="58" fill="#666666" fontSize="7" fontWeight="500" textAnchor="middle">9</text>
        </svg>
      </div>
      
      <div className="text-center mt-1">
        <span className="font-mono font-bold text-3xl" style={{ color }}>{value.toFixed(1)}</span>
      </div>
    </div>
  )
}

// Solar wind speed bar
function WindSpeedBar({ speed }: { speed: number }) {
  const percentage = Math.min(100, (speed / 800) * 100)
  
  const getColor = () => {
    if (speed >= 700) return '#ef4444'
    if (speed >= 500) return '#f97316'
    if (speed >= 400) return '#eab308'
    return '#22c55e'
  }
  
  const color = getColor()
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-text-muted uppercase tracking-wide">Solar Wind</span>
        <span className="font-mono text-sm font-medium">{speed.toFixed(0)} km/s</span>
      </div>
      <div className="h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// X-ray class indicator
function XrayIndicator({ xrayClass }: { xrayClass: string }) {
  const getColor = () => {
    if (xrayClass.startsWith('X')) return '#ef4444'
    if (xrayClass.startsWith('M')) return '#f97316'
    if (xrayClass.startsWith('C')) return '#eab308'
    if (xrayClass.startsWith('B')) return '#84cc16'
    return '#22c55e'
  }
  
  const color = getColor()
  
  return (
    <div className="text-center">
      <span className="text-xs text-text-muted uppercase tracking-wide block mb-1">X-Ray Flux</span>
      <div 
        className="w-12 h-12 rounded-full border-2 flex items-center justify-center mx-auto"
        style={{ borderColor: color }}
      >
        <span className="font-mono font-bold text-xl" style={{ color }}>
          {xrayClass.charAt(0) || 'A'}
        </span>
      </div>
    </div>
  )
}

// Kp history bar chart
function KpHistory({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null
  
  const getColor = (kp: number) => {
    if (kp >= 7) return '#ef4444'
    if (kp >= 5) return '#f97316'
    if (kp >= 4) return '#eab308'
    if (kp >= 3) return '#84cc16'
    return '#22c55e'
  }
  
  return (
    <div>
      <span className="text-xs text-text-muted uppercase tracking-wide block mb-2">Kp History (72h)</span>
      <div className="flex items-end gap-0.5 h-8">
        {data.map((kp, i) => (
          <div
            key={i}
            className="flex-1 rounded-t transition-all duration-300"
            style={{
              height: `${(kp / 9) * 100}%`,
              minHeight: '2px',
              backgroundColor: getColor(kp),
              opacity: i === data.length - 1 ? 1 : 0.7,
            }}
          />
        ))}
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
      <div className="w-full aspect-square flex items-center justify-center">
        <div className="text-text-muted text-sm animate-pulse">Loading...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="w-full aspect-square flex items-center justify-center">
        <div className="text-red-500 text-sm">{error || 'No data'}</div>
      </div>
    )
  }

  const getStatusColor = () => {
    if (data.kp.current >= 5) return '#ef4444'
    if (data.kp.current >= 4) return '#f97316'
    if (data.kp.current >= 3) return '#eab308'
    return '#22c55e'
  }

  return (
    <div className="w-full">
      {/* Header with status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: getStatusColor() }}
          />
          <span className="font-medium" style={{ color: getStatusColor() }}>
            {data.kp.status}
          </span>
        </div>
        <span className="text-xs text-text-muted font-mono">NOAA SWPC</span>
      </div>
      
      {/* Main Kp gauge */}
      <div className="flex flex-col items-center mb-6">
        <span className="text-xs text-text-muted uppercase tracking-wide mb-2">Geomagnetic Activity (Kp)</span>
        <KpGauge value={data.kp.current} />
      </div>
      
      {/* Secondary indicators */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <WindSpeedBar speed={data.solarWind.speed} />
        <XrayIndicator xrayClass={data.xray.class} />
      </div>
      
      {/* Kp history */}
      <KpHistory data={data.kp.recent} />
      
      {/* Aurora hint */}
      {data.kp.current >= 5 && (
        <div className="text-center mt-4">
          <span className="text-green-600 text-sm font-medium">
            ✨ Aurora may be visible at lower latitudes
          </span>
        </div>
      )}
    </div>
  )
}