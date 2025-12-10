'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Activity, 
  Wind, 
  Sun, 
  Sparkles, 
  Moon, 
  Sunrise,
  Satellite,
  ChevronDown,
  MapPin,
  Thermometer
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

function getMoonPhase(): { phase: string; illumination: number } {
  const now = new Date()
  const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0)
  const lunarCycle = 29.53058867
  
  const daysSinceKnown = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)
  const currentCycleDay = daysSinceKnown % lunarCycle
  const phasePercent = (currentCycleDay / lunarCycle) * 100
  
  const illumination = Math.round(
    phasePercent <= 50 
      ? (phasePercent / 50) * 100 
      : ((100 - phasePercent) / 50) * 100
  )
  
  let phase: string
  if (phasePercent < 1.85) phase = 'New Moon'
  else if (phasePercent < 23.15) phase = 'Waxing Crescent'
  else if (phasePercent < 26.85) phase = 'First Quarter'
  else if (phasePercent < 48.15) phase = 'Waxing Gibbous'
  else if (phasePercent < 51.85) phase = 'Full Moon'
  else if (phasePercent < 73.15) phase = 'Waning Gibbous'
  else if (phasePercent < 76.85) phase = 'Last Quarter'
  else if (phasePercent < 98.15) phase = 'Waning Crescent'
  else phase = 'New Moon'
  
  return { phase, illumination }
}

// ============================================================================
// DAYLIGHT CALCULATION
// ============================================================================

function getDaylightHours(lat: number = 51.5): { hours: number; minutes: number; formatted: string } {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  const latRad = lat * (Math.PI / 180)
  const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * (Math.PI / 180))
  const decRad = declination * (Math.PI / 180)
  const cosHourAngle = -Math.tan(latRad) * Math.tan(decRad)
  
  let daylightHours: number
  if (cosHourAngle > 1) daylightHours = 0
  else if (cosHourAngle < -1) daylightHours = 24
  else {
    const hourAngle = Math.acos(cosHourAngle) * (180 / Math.PI)
    daylightHours = (2 * hourAngle) / 15
  }
  
  const hours = Math.floor(daylightHours)
  const minutes = Math.round((daylightHours - hours) * 60)
  
  return { hours, minutes, formatted: `${hours}h ${minutes}m` }
}

// ============================================================================
// SPARKLINE COMPONENT
// ============================================================================

function Sparkline({ 
  data, 
  width = 200, 
  height = 40, 
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
      <polyline points={areaPoints} fill={color} fillOpacity={fillOpacity} stroke="none" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ============================================================================
// KP BAR CHART
// ============================================================================

function KpBarChart({ data, width = 200, height = 40 }: { data: number[]; width?: number; height?: number }) {
  if (!data || data.length === 0) return null
  
  const barWidth = Math.max(3, width / data.length - 2)
  
  const getKpColor = (kp: number) => {
    if (kp >= 5) return '#dc2626'
    if (kp >= 4) return '#ea580c'
    if (kp >= 3) return '#ca8a04'
    return '#16a34a'
  }
  
  return (
    <svg width={width} height={height}>
      {data.map((kp, i) => {
        const barHeight = Math.max(2, (kp / 9) * (height - 2))
        return (
          <rect
            key={i}
            x={i * (barWidth + 2)}
            y={height - barHeight - 1}
            width={barWidth}
            height={barHeight}
            fill={getKpColor(kp)}
            rx={2}
          />
        )
      })}
    </svg>
  )
}

// ============================================================================
// COLLAPSIBLE SECTION
// ============================================================================

function Section({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = false 
}: { 
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} strokeWidth={1.5} className="text-black/50" />
          <span className="text-lg font-medium text-black">{title}</span>
        </div>
        <ChevronDown 
          size={20} 
          className={`text-black/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 border-t border-[#e5e5e5]">
          {children}
        </div>
      )}
    </div>
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
// MAIN PAGE COMPONENT
// ============================================================================

export default function ThePulsePage() {
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
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  const moonData = getMoonPhase()
  const daylightData = getDaylightHours()

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding for fixed header */}
      <div className="h-14 md:hidden" />
      
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">The Pulse</h1>
          <p className="text-base md:text-lg text-black">Live data from Earth and space, updated every 5 minutes.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-black/50">Loading live data...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : data && (
          <div className="space-y-4">
            
            {/* EARTH SECTION */}
            <Section title="Earth" icon={Activity} defaultOpen={true}>
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Earthquakes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-black/50 uppercase tracking-wide">Earthquakes (7 days)</span>
                    <span className="text-2xl font-mono font-bold">{data.earthquakes.count}</span>
                  </div>
                  <Sparkline data={data.earthquakes.daily} color="#dc2626" fillOpacity={0.15} />
                  
                  {data.earthquakes.significant.length > 0 && (
                    <div className="mt-4">
                      <span className="text-xs text-black/50 uppercase tracking-wide block mb-2">Significant (≥M5.0)</span>
                      <div className="space-y-2">
                        {data.earthquakes.significant.slice(0, 5).map((eq, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="font-mono font-bold text-red-600 w-12">M{eq.mag.toFixed(1)}</span>
                            <span className="text-sm text-black truncate">{eq.place}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* CO2 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-black/50 uppercase tracking-wide">Atmospheric CO₂</span>
                    <div className="text-right">
                      <span className="text-2xl font-mono font-bold">{data.co2.current.toFixed(1)}</span>
                      <span className="text-sm text-black/50 ml-1">ppm</span>
                    </div>
                  </div>
                  <Sparkline data={data.co2.trend} color="#0284c7" fillOpacity={0.15} />
                  <p className="text-xs text-black/50 mt-2">30-day trend from Mauna Loa Observatory</p>
                </div>
              </div>
            </Section>

            {/* SUN & SPACE SECTION */}
            <Section title="Sun & Space" icon={Sun} defaultOpen={true}>
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Kp Index */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-black/50 uppercase tracking-wide">Geomagnetic (Kp)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-mono font-bold">{data.solar.kp}</span>
                      <span className={`text-sm font-medium ${
                        data.solar.kp >= 5 ? 'text-red-600' : 
                        data.solar.kp >= 3 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {data.solar.status}
                      </span>
                    </div>
                  </div>
                  <KpBarChart data={data.solar.kpHistory} />
                  <p className="text-xs text-black/50 mt-2">72-hour history</p>
                </div>

                {/* ISS */}
                <div>
                  <span className="text-sm text-black/50 uppercase tracking-wide block mb-3">ISS Position</span>
                  <div className="flex items-center gap-2 mb-2">
                    <Satellite size={20} className="text-black/50" />
                    <span className="text-lg font-medium">{data.iss.region || 'Tracking...'}</span>
                  </div>
                  <span className="font-mono text-sm text-black/50">
                    {data.iss.lat.toFixed(2)}°, {data.iss.lng.toFixed(2)}°
                  </span>
                </div>

                {/* Upcoming Launches */}
                {data.launches.length > 0 && (
                  <div>
                    <span className="text-sm text-black/50 uppercase tracking-wide block mb-3">Upcoming Launches</span>
                    <div className="space-y-3">
                      {data.launches.slice(0, 3).map((launch, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm truncate max-w-[180px]" title={launch.name}>{launch.rocket}</span>
                          <span className="font-mono text-sm text-black/50">T-{formatTimeUntil(launch.net)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Section>

            {/* WHERE YOU ARE SECTION */}
            <Section title="Where You Are" icon={MapPin}>
              <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Moon */}
                <div className="text-center">
                  <Moon size={32} className="mx-auto mb-2 text-black/50" />
                  <span className="text-2xl font-mono font-bold block">{moonData.illumination}%</span>
                  <span className="text-sm text-black/50">{moonData.phase}</span>
                </div>
                
                {/* Daylight */}
                <div className="text-center">
                  <Sunrise size={32} className="mx-auto mb-2 text-black/50" />
                  <span className="text-2xl font-mono font-bold block">{daylightData.formatted}</span>
                  <span className="text-sm text-black/50">Daylight today</span>
                </div>
                
                {/* UV */}
                {data.uv && (
                  <div className="text-center">
                    <Thermometer size={32} className="mx-auto mb-2 text-black/50" />
                    <span className="text-2xl font-mono font-bold block">{data.uv.index}</span>
                    <span className="text-sm text-black/50">UV Index ({data.uv.level})</span>
                  </div>
                )}
                
                {/* Aurora */}
                <div className="text-center">
                  <Sparkles size={32} className="mx-auto mb-2 text-black/50" />
                  <span className="text-2xl font-mono font-bold block">Kp {data.solar.kp}</span>
                  <span className="text-sm text-black/50">
                    {data.solar.kp >= 5 ? 'Aurora possible!' : 'Aurora unlikely'}
                  </span>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* Update indicator */}
        <div className="text-center text-xs text-black/50 mt-8">
          Data updates every 5 minutes
        </div>
      </div>
      
      {/* Mobile bottom padding for fixed nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}