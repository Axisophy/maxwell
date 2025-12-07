'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

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

// Kp Index gauge component - value displayed below the dial
function KpGauge({ value, isLarge = false }: { value: number; isLarge?: boolean }) {
  const normalizedValue = Math.min(9, Math.max(0, value))
  const angle = (normalizedValue / 9) * 180 - 90 // -90 to 90 degrees
  
  const getColor = (kp: number) => {
    if (kp >= 7) return '#ef4444' // Red
    if (kp >= 5) return '#f97316' // Orange
    if (kp >= 4) return '#eab308' // Yellow
    if (kp >= 3) return '#84cc16' // Lime
    return '#22c55e' // Green
  }
  
  const color = getColor(normalizedValue)
  
  return (
    <div className="flex flex-col items-center">
      {/* Gauge SVG */}
      <div className={isLarge ? "w-64 h-40" : "w-40 h-24"}>
        <svg viewBox="0 0 100 60" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
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
            
            const segmentColor = i <= normalizedValue 
              ? getColor(i) 
              : 'rgba(255,255,255,0.08)'
            
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
            <line
              x1="50"
              y1="55"
              x2="50"
              y2="20"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="50" cy="55" r="4" fill={color} />
          </g>
          
          {/* Scale labels */}
          <text x="12" y="58" fill="rgba(255,255,255,0.7)" fontSize="7" fontWeight="500" textAnchor="middle">0</text>
          <text x="50" y="12" fill="rgba(255,255,255,0.7)" fontSize="7" fontWeight="500" textAnchor="middle">5</text>
          <text x="88" y="58" fill="rgba(255,255,255,0.7)" fontSize="7" fontWeight="500" textAnchor="middle">9</text>
        </svg>
      </div>
      
      {/* Digital readout - below the gauge */}
      <div className="text-center mt-2">
        <span 
          className={`font-mono font-bold ${isLarge ? 'text-5xl' : 'text-3xl'}`}
          style={{ color, textShadow: `0 0 10px ${color}` }}
        >
          {value.toFixed(1)}
        </span>
      </div>
    </div>
  )
}

// Solar wind speed dial
function WindSpeedDial({ speed, isLarge = false }: { speed: number; isLarge?: boolean }) {
  // Normal range: 300-800 km/s, can go to 2000+ during CMEs
  const normalizedSpeed = Math.min(2000, Math.max(0, speed))
  const percentage = (normalizedSpeed / 800) * 100 // 800 as "normal max"
  
  const getColor = () => {
    if (speed >= 700) return '#ef4444'
    if (speed >= 500) return '#f97316'
    if (speed >= 400) return '#eab308'
    return '#22c55e'
  }
  
  const color = getColor()
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`text-white/80 uppercase tracking-wide font-medium ${isLarge ? 'text-base' : 'text-sm'}`}>
        Solar Wind
      </div>
      <div className={`relative bg-black/50 rounded border border-white/20 overflow-hidden ${isLarge ? 'w-40 h-12' : 'w-28 h-9'}`}>
        <div 
          className="absolute inset-y-0 left-0 transition-all duration-500"
          style={{ 
            width: `${Math.min(100, percentage)}%`,
            background: `linear-gradient(90deg, ${color}40, ${color})`,
            boxShadow: `0 0 10px ${color}`
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className={`font-mono font-bold ${isLarge ? 'text-xl' : 'text-base'}`}
            style={{ color, textShadow: `0 0 5px ${color}` }}
          >
            {speed.toFixed(0)}
          </span>
          <span className={`text-white/70 ml-1 font-medium ${isLarge ? 'text-base' : 'text-sm'}`}>km/s</span>
        </div>
      </div>
    </div>
  )
}

// X-ray class indicator
function XrayIndicator({ xrayClass, isLarge = false }: { xrayClass: string; isLarge?: boolean }) {
  const getColor = () => {
    if (xrayClass.startsWith('X')) return '#ef4444'
    if (xrayClass.startsWith('M')) return '#f97316'
    if (xrayClass.startsWith('C')) return '#eab308'
    if (xrayClass.startsWith('B')) return '#84cc16'
    return '#22c55e'
  }
  
  const color = getColor()
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`text-white/80 uppercase tracking-wide font-medium ${isLarge ? 'text-base' : 'text-sm'}`}>
        X-Ray Flux
      </div>
      <div 
        className={`rounded-full border-2 flex items-center justify-center ${isLarge ? 'w-20 h-20' : 'w-14 h-14'}`}
        style={{ 
          borderColor: color,
          boxShadow: `0 0 15px ${color}40, inset 0 0 10px ${color}20`
        }}
      >
        <span 
          className={`font-mono font-bold ${isLarge ? 'text-3xl' : 'text-xl'}`}
          style={{ color, textShadow: `0 0 5px ${color}` }}
        >
          {xrayClass.charAt(0) || 'A'}
        </span>
      </div>
    </div>
  )
}

// Kp history bar chart
function KpHistory({ data, isLarge = false }: { data: number[]; isLarge?: boolean }) {
  if (!data || data.length === 0) return null
  
  const getColor = (kp: number) => {
    if (kp >= 7) return '#ef4444'
    if (kp >= 5) return '#f97316'
    if (kp >= 4) return '#eab308'
    if (kp >= 3) return '#84cc16'
    return '#22c55e'
  }
  
  return (
    <div className="w-full">
      <div className={`text-white/80 uppercase tracking-wide font-medium mb-2 ${isLarge ? 'text-base' : 'text-sm'}`}>
        Kp History (72h)
      </div>
      <div className={`flex items-end gap-0.5 ${isLarge ? 'h-16' : 'h-10'}`}>
        {data.map((kp, i) => (
          <div
            key={i}
            className="flex-1 rounded-t transition-all duration-300"
            style={{
              height: `${(kp / 9) * 100}%`,
              minHeight: '2px',
              backgroundColor: getColor(kp),
              opacity: i === data.length - 1 ? 1 : 0.7,
              boxShadow: i === data.length - 1 ? `0 0 5px ${getColor(kp)}` : 'none'
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
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [fetchData])

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[300px] bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-cyan-400 text-sm font-medium animate-pulse">Connecting to NOAA...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="w-full h-full min-h-[300px] bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-red-400 text-sm font-medium">{error || 'No data available'}</div>
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
    <div ref={containerRef} className="w-full h-full min-h-[300px] bg-[#0a0f1a] relative overflow-hidden">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Scan line effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)'
        }}
      />
      
      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col ${isLarge ? 'p-8' : 'p-4'}`}>
        {/* Header with status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: getStatusColor(), boxShadow: `0 0 10px ${getStatusColor()}` }}
            />
            <span 
              className={`font-medium ${isLarge ? 'text-xl' : 'text-base'}`}
              style={{ color: getStatusColor() }}
            >
              {data.kp.status}
            </span>
          </div>
          <div className={`text-white/60 font-mono font-medium ${isLarge ? 'text-base' : 'text-sm'}`}>
            NOAA SWPC
          </div>
        </div>
        
        {/* Main Kp gauge */}
        <div className={`flex-1 flex flex-col items-center justify-center ${isLarge ? 'gap-6' : 'gap-3'}`}>
          <div className={`text-white/80 uppercase tracking-wide font-medium ${isLarge ? 'text-lg' : 'text-sm'}`}>
            Geomagnetic Activity (Kp)
          </div>
          <KpGauge value={data.kp.current} isLarge={isLarge} />
        </div>
        
        {/* Secondary indicators */}
        <div className={`flex items-center justify-around ${isLarge ? 'mb-8' : 'mb-4'}`}>
          <WindSpeedDial speed={data.solarWind.speed} isLarge={isLarge} />
          <XrayIndicator xrayClass={data.xray.class} isLarge={isLarge} />
        </div>
        
        {/* Kp history */}
        <KpHistory data={data.kp.recent} isLarge={isLarge} />
        
        {/* Aurora visibility hint */}
        {data.kp.current >= 5 && (
          <div className={`text-center ${isLarge ? 'mt-6' : 'mt-3'}`}>
            <span className={`text-green-400 font-medium animate-pulse ${isLarge ? 'text-lg' : 'text-sm'}`}>
              ✨ Aurora may be visible at lower latitudes
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
