'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Activity, 
  Wind, 
  Sun, 
  Sparkles, 
  Moon, 
  Sunrise, 
  SunDim, 
  Satellite 
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

interface PulseData {
  earthquakes: {
    count: number
    significant: { mag: number; place: string; time: number }[]
    daily: number[]
  }
  co2: {
    current: number
    trend: number[]
  }
  solar: {
    status: string
    kp: number
    kpHistory: number[]
  }
  iss: {
    lat: number
    lng: number
    region: string
  }
  launches: { name: string; net: string; rocket: string }[]
  uv?: { index: number; level: string }
}

// ============================================================================
// MOON PHASE CALCULATION
// ============================================================================

function getMoonPhase(): { phase: string; illumination: number; icon: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent' } {
  const now = new Date()
  // Known new moon: January 6, 2000
  const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0)
  const lunarCycle = 29.53058867 // days
  
  const daysSinceKnown = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)
  const currentCycleDay = daysSinceKnown % lunarCycle
  const phasePercent = (currentCycleDay / lunarCycle) * 100
  
  // Calculate illumination (0-100%)
  // Illumination peaks at 50% of cycle (full moon)
  const illumination = Math.round(
    phasePercent <= 50 
      ? (phasePercent / 50) * 100 
      : ((100 - phasePercent) / 50) * 100
  )
  
  // Determine phase name
  let phase: string
  let icon: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent'
  
  if (phasePercent < 1.85) { phase = 'New Moon'; icon = 'new' }
  else if (phasePercent < 23.15) { phase = 'Waxing Crescent'; icon = 'waxing-crescent' }
  else if (phasePercent < 26.85) { phase = 'First Quarter'; icon = 'first-quarter' }
  else if (phasePercent < 48.15) { phase = 'Waxing Gibbous'; icon = 'waxing-gibbous' }
  else if (phasePercent < 51.85) { phase = 'Full Moon'; icon = 'full' }
  else if (phasePercent < 73.15) { phase = 'Waning Gibbous'; icon = 'waning-gibbous' }
  else if (phasePercent < 76.85) { phase = 'Last Quarter'; icon = 'last-quarter' }
  else if (phasePercent < 98.15) { phase = 'Waning Crescent'; icon = 'waning-crescent' }
  else { phase = 'New Moon'; icon = 'new' }
  
  return { phase, illumination, icon }
}

// ============================================================================
// DAYLIGHT CALCULATION
// ============================================================================

function getDaylightHours(lat: number = 51.5): { hours: number; minutes: number; formatted: string } {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  
  // Convert latitude to radians
  const latRad = lat * (Math.PI / 180)
  
  // Calculate solar declination
  const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * (Math.PI / 180))
  const decRad = declination * (Math.PI / 180)
  
  // Calculate hour angle
  const cosHourAngle = -Math.tan(latRad) * Math.tan(decRad)
  
  let daylightHours: number
  if (cosHourAngle > 1) {
    daylightHours = 0 // Polar night
  } else if (cosHourAngle < -1) {
    daylightHours = 24 // Midnight sun
  } else {
    const hourAngle = Math.acos(cosHourAngle) * (180 / Math.PI)
    daylightHours = (2 * hourAngle) / 15
  }
  
  const hours = Math.floor(daylightHours)
  const minutes = Math.round((daylightHours - hours) * 60)
  
  return {
    hours,
    minutes,
    formatted: `${hours}h ${minutes}m`
  }
}

// ============================================================================
// SPARKLINE COMPONENT
// ============================================================================

function Sparkline({ 
  data, 
  width = 100, 
  height = 30, 
  color = '#000000',
  fillOpacity = 0.1 
}: { 
  data: number[]
  width?: number
  height?: number
  color?: string
  fillOpacity?: number
}) {
  if (!data || data.length === 0) return null
  
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((val - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')
  
  const areaPoints = `0,${height} ${points} ${width},${height}`
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={areaPoints}
        fill={color}
        fillOpacity={fillOpacity}
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ============================================================================
// BAR CHART COMPONENT (for Kp index)
// ============================================================================

function KpBarChart({ 
  data, 
  width = 120, 
  height = 30 
}: { 
  data: number[]
  width?: number
  height?: number
}) {
  if (!data || data.length === 0) return null
  
  const barWidth = Math.max(2, width / data.length - 1)
  
  const getKpColor = (kp: number) => {
    if (kp >= 5) return '#dc2626' // Red - storm
    if (kp >= 4) return '#ea580c' // Orange - active
    if (kp >= 3) return '#ca8a04' // Yellow - unsettled
    return '#16a34a' // Green - quiet
  }
  
  return (
    <svg width={width} height={height}>
      {data.map((kp, i) => {
        const barHeight = Math.max(2, (kp / 9) * (height - 2))
        return (
          <rect
            key={i}
            x={i * (barWidth + 1)}
            y={height - barHeight - 1}
            width={barWidth}
            height={barHeight}
            fill={getKpColor(kp)}
            rx={1}
          />
        )
      })}
    </svg>
  )
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatTimeUntil(dateStr: string): string {
  const now = new Date()
  const launch = new Date(dateStr)
  const diff = launch.getTime() - now.getTime()
  
  if (diff < 0) return 'TBD'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h`
  return '<1h'
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ThePulse() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [data, setData] = useState<PulseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/pulse')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      console.error('Error fetching pulse data:', err)
      setError('Unable to fetch live data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="w-full px-8 lg:px-12 py-3">
      <div 
        className="bg-white rounded-xl border border-[var(--widget-border)] overflow-hidden transition-all duration-300 ease-out"
        style={{ 
          maxHeight: isExpanded ? '600px' : '56px',
        }}
      >
        {/* Collapsed Bar */}
        <div 
          className="flex items-center justify-between px-5 h-14 cursor-pointer hover:bg-gray-50/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3 md:gap-4 text-base overflow-x-auto scrollbar-hide">
            <span className="font-normal text-black tracking-wide text-sm shrink-0">
              The Pulse
            </span>
            
            {isLoading ? (
              <span className="text-black font-extralight animate-pulse">Loading live data...</span>
            ) : error ? (
              <span className="text-black font-extralight">{error}</span>
            ) : data && (
              <>
                {/* Earthquakes */}
                <span className="text-black font-extralight">·</span>
                <span className="text-black font-extralight shrink-0 flex items-center gap-1.5">
                  <Activity size={14} strokeWidth={1.5} />
                  <span className="font-medium">{data.earthquakes.count}</span> quakes {'>'}M4 today
                </span>
                
                {/* CO2 */}
                <span className="text-black font-extralight hidden sm:inline">·</span>
                <span className="text-black font-extralight shrink-0 hidden sm:flex items-center gap-1.5">
                  <Wind size={14} strokeWidth={1.5} />
                  Atmospheric CO₂: <span className="font-medium">{Math.round(data.co2.current)}</span> ppm
                </span>
                
                {/* Solar */}
                <span className="text-black font-extralight hidden md:inline">·</span>
                <span className="text-black font-extralight shrink-0 hidden md:flex items-center gap-1.5">
                  <Sun size={14} strokeWidth={1.5} />
                  Solar activity: <span className="font-medium">{data.solar.status}</span>
                </span>
                
                {/* Aurora/Kp */}
                <span className="text-black font-extralight hidden lg:inline">·</span>
                <span className="text-black font-extralight shrink-0 hidden lg:flex items-center gap-1.5">
                  <Sparkles size={14} strokeWidth={1.5} />
                  Aurora: Kp <span className="font-medium">{data.solar.kp}</span>
                </span>
                
                {/* Moon */}
                <span className="text-black font-extralight hidden xl:inline">·</span>
                <span className="text-black font-extralight shrink-0 hidden xl:flex items-center gap-1.5">
                  <Moon size={14} strokeWidth={1.5} />
                  Moon: <span className="font-medium">{getMoonPhase().illumination}%</span>
                </span>
                
                {/* Daylight */}
                <span className="text-black font-extralight hidden 2xl:inline">·</span>
                <span className="text-black font-extralight shrink-0 hidden 2xl:flex items-center gap-1.5">
                  <Sunrise size={14} strokeWidth={1.5} />
                  Daylight: <span className="font-medium">{getDaylightHours().formatted}</span>
                </span>
                
                {/* UV */}
                {data.uv && (
                  <>
                    <span className="text-black font-extralight hidden 2xl:inline">·</span>
                    <span className="text-black font-extralight shrink-0 hidden 2xl:flex items-center gap-1.5">
                      <SunDim size={14} strokeWidth={1.5} />
                      UV: <span className="font-medium">{data.uv.index}</span> {data.uv.level}
                    </span>
                  </>
                )}
                
                {/* ISS */}
                {data.iss.region && data.iss.region !== 'Unknown' && (
                  <>
                    <span className="text-black font-extralight hidden 2xl:inline">·</span>
                    <span className="text-black font-extralight shrink-0 hidden 2xl:flex items-center gap-1.5">
                      <Satellite size={14} strokeWidth={1.5} />
                      ISS over <span className="font-medium">{data.iss.region}</span>
                    </span>
                  </>
                )}
              </>
            )}
          </div>
          
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0 ml-2"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
        </div>

        {/* Expanded Content */}
        <div 
          className={`border-t border-[var(--widget-border)] transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 md:p-6">
              
              {/* COLUMN 1: EARTH */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-black font-medium">
                  Earth
                </h3>
                
                {/* Earthquakes Sparkline */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black font-extralight">Earthquakes (7 days)</span>
                    <span className="text-sm font-medium font-mono text-black">{data.earthquakes.count} today</span>
                  </div>
                  <Sparkline 
                    data={data.earthquakes.daily} 
                    width={200} 
                    height={32}
                    color="#dc2626"
                    fillOpacity={0.15}
                  />
                </div>

                {/* Significant Quakes List */}
                {data.earthquakes.significant.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm text-black font-extralight">Significant (≥M5.0)</span>
                    <div className="space-y-1.5">
                      {data.earthquakes.significant.slice(0, 3).map((eq, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="font-mono font-bold text-red-600 w-10">
                            M{eq.mag.toFixed(1)}
                          </span>
                          <span className="text-black font-light truncate">
                            {eq.place}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* COLUMN 2: SPACE & SUN */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-black font-medium">
                  Space & Sun
                </h3>
                
                {/* Kp Index Bar Chart */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black font-extralight">Kp index (3 days)</span>
                    <span className="text-sm font-normal text-black">
                      Current: <span className="font-mono font-medium">{data.solar.kp}</span>
                      {' '}
                      <span className={`font-medium
                        ${data.solar.kp >= 5 ? 'text-red-600' : ''}
                        ${data.solar.kp >= 3 && data.solar.kp < 5 ? 'text-amber-600' : ''}
                        ${data.solar.kp < 3 ? 'text-green-600' : ''}
                      `}>
                        ({data.solar.status})
                      </span>
                    </span>
                  </div>
                  <KpBarChart data={data.solar.kpHistory} width={200} height={32} />
                </div>

                {/* ISS Position */}
                <div className="space-y-1">
                  <span className="text-sm text-black font-extralight">ISS Position</span>
                  <div className="text-sm text-black">
                    <span className="font-medium">{data.iss.region || 'Tracking...'}</span>
                    <span className="font-extralight ml-2 font-mono text-xs">
                      {data.iss.lat.toFixed(1)}°, {data.iss.lng.toFixed(1)}°
                    </span>
                  </div>
                </div>

                {/* Upcoming Launches */}
                {data.launches.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm text-black font-extralight">Upcoming Launches</span>
                    <div className="space-y-1.5">
                      {data.launches.slice(0, 2).map((launch, i) => (
                        <div key={i} className="flex items-center justify-between text-sm text-black">
                          <span className="font-light truncate max-w-[160px]" title={launch.name}>
                            {launch.rocket}
                          </span>
                          <span className="font-extralight font-mono shrink-0 ml-2">
                            T-{formatTimeUntil(launch.net)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* COLUMN 3: CLIMATE & COUNTS */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-black font-medium">
                  Climate & Counts
                </h3>
                
                {/* CO2 Sparkline */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black font-extralight">CO₂ trend (30 days)</span>
                    <span className="text-sm font-medium font-mono text-black">{data.co2.current.toFixed(1)} ppm</span>
                  </div>
                  <Sparkline 
                    data={data.co2.trend} 
                    width={200} 
                    height={32}
                    color="#0284c7"
                    fillOpacity={0.15}
                  />
                </div>

                {/* This Week in Numbers */}
                <div className="space-y-2">
                  <span className="text-sm text-black font-extralight">This Week</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-mono font-bold text-xl text-black">~9,700</span>
                      <p className="text-sm text-black font-extralight">Satellites in orbit</p>
                    </div>
                    <div>
                      <span className="font-mono font-bold text-xl text-black">~400</span>
                      <p className="text-sm text-black font-extralight">Papers on arXiv today</p>
                    </div>
                  </div>
                </div>

                {/* Refresh indicator */}
                <div className="text-xs text-black font-extralight">
                  Updates every 5 minutes
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}