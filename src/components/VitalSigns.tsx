'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Activity, 
  Wind, 
  Sun, 
  Moon, 
  Satellite,
  Flame,
  Thermometer,
  Waves,
  Snowflake,
  Users,
  Rocket,
  CircleDot,
  AlertCircle,
  Sunrise,
} from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

interface VitalSignsData {
  earthquakes: {
    count: number
    significant: { mag: number; place: string; time: number }[]
    daily: number[]
    stale?: boolean
  } | null
  co2: {
    current: number
    trend: number[]
    yearAgo: number
    change: number
    stale?: boolean
  } | null
  solar: {
    status: string
    kp: number
    kpHistory: number[]
    solarWind: number | null
    sunspots: number | null
    stale?: boolean
  } | null
  iss: {
    lat: number
    lng: number
    region: string
    stale?: boolean
  } | null
  launches: {
    name: string
    net: string
    rocket: string
  }[] | null
  seaIce: {
    extent: number
    anomaly: number
    date: string
    stale?: boolean
  } | null
  temperature: {
    anomaly: number
    year: number
    month: number
    stale?: boolean
  } | null
  seaLevel: {
    rise: number
    rate: number
    date: string
    stale?: boolean
  } | null
  fires: {
    count: number
    date: string
    stale?: boolean
  } | null
  neo: {
    count: number
    closest: {
      name: string
      distance: number
      date: string
    } | null
    stale?: boolean
  } | null
  moon: {
    phase: string
    illumination: number
    icon: string
  }
  daylight: {
    hours: number
    minutes: number
    formatted: string
  }
  population: {
    current: number
    birthsPerSecond: number
    deathsPerSecond: number
  }
  staleCount: number
  errorCount: number
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function Sparkline({ 
  data, 
  width = 180, 
  height = 28, 
  color = '#000',
  fillOpacity = 0.1 
}: { 
  data: number[]
  width?: number
  height?: number
  color?: string
  fillOpacity?: number
}) {
  if (!data || data.length === 0) return null
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((val - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')
  
  const areaPoints = `0,${height} ${points} ${width},${height}`
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polygon points={areaPoints} fill={color} fillOpacity={fillOpacity} />
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

function KpBarChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null
  
  const getKpColor = (kp: number) => {
    if (kp >= 7) return '#dc2626' // Red - severe
    if (kp >= 5) return '#f59e0b' // Amber - storm
    if (kp >= 4) return '#eab308' // Yellow - active
    return '#22c55e' // Green - quiet
  }
  
  return (
    <div className="flex items-end gap-[2px] h-7">
      {data.slice(-24).map((kp, i) => (
        <div
          key={i}
          className="w-[6px] rounded-sm transition-all"
          style={{
            height: `${Math.max(4, (kp / 9) * 28)}px`,
            backgroundColor: getKpColor(kp),
            opacity: i < data.length - 8 ? 0.5 : 1
          }}
        />
      ))}
    </div>
  )
}

function MetricRow({ 
  label, 
  value, 
  unit,
  subtext,
  stale,
  error,
}: { 
  label: string
  value: string
  unit?: string
  subtext?: string
  stale?: boolean
  error?: boolean
}) {
  return (
    <div className={`flex items-center justify-between py-2 ${error ? 'opacity-40' : ''}`}>
      <div>
        <span className="text-sm text-black">{label}</span>
        {subtext && <span className="text-xs text-black/40 ml-2">{subtext}</span>}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm font-mono font-medium">{value}</span>
        {unit && <span className="text-sm text-black/50">{unit}</span>}
        {stale && <span className="text-xs text-amber-600 ml-1">(stale)</span>}
      </div>
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}

// =============================================================================
// CATEGORY ROW COMPONENT
// =============================================================================

interface CategoryRowProps {
  title: string
  icon: React.ElementType
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
  summary?: React.ReactNode
}

function CategoryRow({ title, icon: Icon, isExpanded, onToggle, children, summary }: CategoryRowProps) {
  return (
    <div className="border-t border-black/10">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} strokeWidth={1.5} className="text-black/40" />
          <span className="text-base font-medium text-black">{title}</span>
          {!isExpanded && summary && (
            <span className="text-sm text-black/50 ml-2 hidden sm:block">{summary}</span>
          )}
        </div>
        <span 
          className={`text-xl text-black/40 transition-transform ${
            isExpanded ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="pb-4 pl-9">
          {children}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function VitalSigns() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    earth: true,
    climate: true,
    space: true,
    sky: true,
  })
  const [data, setData] = useState<VitalSignsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [livePopulation, setLivePopulation] = useState<number | null>(null)

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/vital-signs')
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
      setLivePopulation(json.population?.current || null)
      setError(null)
    } catch (err) {
      setError('Unable to load data')
      console.error('Vital Signs fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Live population counter
  useEffect(() => {
    if (!data?.population) return
    
    const netPerSecond = data.population.birthsPerSecond - data.population.deathsPerSecond
    const interval = setInterval(() => {
      setLivePopulation(prev => prev ? prev + netPerSecond : null)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [data?.population])

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
      {/* Collapsed Bar */}
      <div 
        className="flex items-center justify-between px-4 md:px-5 h-14 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 md:gap-3 text-sm overflow-x-auto scrollbar-hide">
          <span className="font-medium text-black tracking-wide shrink-0">
            Vital Signs
          </span>
          
          {isLoading ? (
            <span className="text-black/50 animate-pulse">Loading...</span>
          ) : error ? (
            <span className="text-black/50">{error}</span>
          ) : data && (
            <>
              {/* Earthquakes */}
              {data.earthquakes && (
                <>
                  <span className="text-black/30">·</span>
                  <span className="text-black/70 shrink-0 flex items-center gap-1">
                    <Activity size={13} strokeWidth={1.5} />
                    <span className="font-medium">{data.earthquakes.count}</span>
                    <span className="hidden sm:inline">quakes</span>
                  </span>
                </>
              )}
              
              {/* CO2 */}
              {data.co2 && (
                <>
                  <span className="text-black/30 hidden sm:inline">·</span>
                  <span className="text-black/70 shrink-0 hidden sm:flex items-center gap-1">
                    <Wind size={13} strokeWidth={1.5} />
                    CO₂ <span className="font-medium">{Math.round(data.co2.current)}</span>
                  </span>
                </>
              )}
              
              {/* Temperature */}
              {data.temperature && (
                <>
                  <span className="text-black/30 hidden md:inline">·</span>
                  <span className="text-black/70 shrink-0 hidden md:flex items-center gap-1">
                    <Thermometer size={13} strokeWidth={1.5} />
                    <span className="font-medium text-red-600">+{data.temperature.anomaly.toFixed(2)}°C</span>
                  </span>
                </>
              )}
              
              {/* Sea Ice */}
              {data.seaIce && (
                <>
                  <span className="text-black/30 hidden lg:inline">·</span>
                  <span className="text-black/70 shrink-0 hidden lg:flex items-center gap-1">
                    <Snowflake size={13} strokeWidth={1.5} />
                    Ice <span className="font-medium">{data.seaIce.extent.toFixed(1)}M</span> km²
                  </span>
                </>
              )}
              
              {/* Solar */}
              {data.solar && (
                <>
                  <span className="text-black/30 hidden xl:inline">·</span>
                  <span className="text-black/70 shrink-0 hidden xl:flex items-center gap-1">
                    <Sun size={13} strokeWidth={1.5} />
                    Kp <span className="font-medium">{data.solar.kp}</span>
                  </span>
                </>
              )}
              
              {/* Moon */}
              {data.moon && (
                <>
                  <span className="text-black/30 hidden xl:inline">·</span>
                  <span className="text-black/70 shrink-0 hidden xl:flex items-center gap-1">
                    <Moon size={13} strokeWidth={1.5} />
                    <span className="font-medium">{data.moon.illumination}%</span>
                  </span>
                </>
              )}
              
              {/* Status indicators */}
              {(data.staleCount > 0 || data.errorCount > 0) && (
                <>
                  <span className="text-black/30 hidden 2xl:inline">·</span>
                  <span className="text-amber-600/70 shrink-0 hidden 2xl:flex items-center gap-1 text-xs">
                    <AlertCircle size={12} strokeWidth={1.5} />
                    {data.errorCount > 0 && `${data.errorCount} unavailable`}
                    {data.staleCount > 0 && data.errorCount > 0 && ', '}
                    {data.staleCount > 0 && `${data.staleCount} stale`}
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

      {/* Expanded Content - Collapsible Category Rows */}
      {isExpanded && data && (
        <div className="border-t border-black/10 px-4 md:px-5">
          
          {/* EARTH */}
          <CategoryRow
            title="Earth"
            icon={Activity}
            isExpanded={expandedCategories.earth}
            onToggle={() => toggleCategory('earth')}
            summary={data.earthquakes ? `${data.earthquakes.count} quakes today` : undefined}
          >
            <div className="space-y-3">
              {/* Earthquakes */}
              {data.earthquakes ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/50">Earthquakes (7 days)</span>
                    <span className="text-sm font-medium font-mono">{data.earthquakes.count} today</span>
                  </div>
                  <Sparkline 
                    data={data.earthquakes.daily} 
                    width={200} 
                    height={32}
                    color="#dc2626"
                    fillOpacity={0.15}
                  />
                  {data.earthquakes.significant.length > 0 && (
                    <div className="space-y-1 pt-2">
                      <span className="text-xs text-black/40 uppercase tracking-wider">Significant</span>
                      {data.earthquakes.significant.slice(0, 3).map((eq, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="font-mono font-bold text-red-600 w-12">
                            M{eq.mag.toFixed(1)}
                          </span>
                          <span className="text-black/60 truncate">{eq.place}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <span className="text-sm text-black/40">Earthquake data unavailable</span>
              )}
              
              {/* Active Fires */}
              <MetricRow
                label="Active Fires"
                value={data.fires ? formatNumber(data.fires.count) : '—'}
                subtext="Global estimate"
                stale={data.fires?.stale}
                error={!data.fires}
              />
            </div>
          </CategoryRow>

          {/* CLIMATE */}
          <CategoryRow
            title="Climate"
            icon={Thermometer}
            isExpanded={expandedCategories.climate}
            onToggle={() => toggleCategory('climate')}
            summary={data.temperature ? `+${data.temperature.anomaly.toFixed(2)}°C anomaly` : undefined}
          >
            <div className="space-y-3">
              {/* Temperature */}
              <MetricRow
                label="Global Temperature Anomaly"
                value={data.temperature ? `+${data.temperature.anomaly.toFixed(2)}` : '—'}
                unit="°C"
                subtext="vs 1951-1980"
                stale={data.temperature?.stale}
                error={!data.temperature}
              />
              
              {/* CO2 */}
              {data.co2 ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">Atmospheric CO₂</span>
                    <span className="text-sm font-medium font-mono">{data.co2.current.toFixed(1)} ppm</span>
                  </div>
                  <Sparkline 
                    data={data.co2.trend} 
                    width={200} 
                    height={32}
                    color="#0284c7"
                    fillOpacity={0.15}
                  />
                  <p className="text-xs text-black/40">
                    +{data.co2.change.toFixed(1)} ppm vs last year
                  </p>
                </>
              ) : (
                <MetricRow label="Atmospheric CO₂" value="—" error />
              )}
              
              {/* Sea Level */}
              <MetricRow
                label="Sea Level Rise"
                value={data.seaLevel ? `+${data.seaLevel.rise.toFixed(0)}` : '—'}
                unit="mm"
                subtext="since 1993"
                stale={data.seaLevel?.stale}
                error={!data.seaLevel}
              />
              
              {/* Sea Ice */}
              <MetricRow
                label="Arctic Sea Ice"
                value={data.seaIce ? data.seaIce.extent.toFixed(2) : '—'}
                unit="M km²"
                stale={data.seaIce?.stale}
                error={!data.seaIce}
              />
            </div>
          </CategoryRow>

          {/* SPACE */}
          <CategoryRow
            title="Space"
            icon={Sun}
            isExpanded={expandedCategories.space}
            onToggle={() => toggleCategory('space')}
            summary={data.solar ? `Kp ${data.solar.kp} • ${data.solar.status}` : undefined}
          >
            <div className="space-y-3">
              {/* Solar Activity */}
              {data.solar ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">Geomagnetic Activity (Kp)</span>
                    <span className="text-sm font-medium font-mono">Kp {data.solar.kp}</span>
                  </div>
                  <KpBarChart data={data.solar.kpHistory} />
                  <div className="flex gap-4 text-xs text-black/50">
                    {data.solar.solarWind && <span>Solar wind: {data.solar.solarWind.toFixed(0)} km/s</span>}
                    {data.solar.sunspots !== null && <span>Sunspots: {data.solar.sunspots}</span>}
                  </div>
                </>
              ) : (
                <MetricRow label="Solar Activity" value="—" error />
              )}
              
              {/* ISS */}
              <MetricRow
                label="ISS Location"
                value={data.iss ? data.iss.region : '—'}
                subtext={data.iss ? `${data.iss.lat.toFixed(1)}°, ${data.iss.lng.toFixed(1)}°` : undefined}
                stale={data.iss?.stale}
                error={!data.iss}
              />
              
              {/* NEO */}
              <MetricRow
                label="Near-Earth Objects (7 days)"
                value={data.neo ? data.neo.count.toString() : '—'}
                subtext={data.neo?.closest ? `Closest: ${data.neo.closest.name}` : undefined}
                stale={data.neo?.stale}
                error={!data.neo}
              />
              
              {/* Upcoming Launches */}
              {data.launches && data.launches.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs text-black/40 uppercase tracking-wider">Next Launch</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-black truncate mr-2">{data.launches[0].name}</span>
                    <span className="text-xs text-black/50 shrink-0">
                      {new Date(data.launches[0].net).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CategoryRow>

          {/* SKY & HUMAN */}
          <CategoryRow
            title="Sky & Human"
            icon={Moon}
            isExpanded={expandedCategories.sky}
            onToggle={() => toggleCategory('sky')}
            summary={data.moon ? `${data.moon.phase} (${data.moon.illumination}%)` : undefined}
          >
            <div className="space-y-3">
              {/* Moon */}
              <MetricRow
                label="Moon Phase"
                value={data.moon.phase}
                subtext={`${data.moon.illumination}% illuminated`}
              />
              
              {/* Daylight */}
              <MetricRow
                label="Daylight (London)"
                value={data.daylight.formatted}
              />
              
              {/* Population */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-black">World Population</span>
                <span className="text-sm font-mono font-medium tabular-nums">
                  {livePopulation ? livePopulation.toLocaleString() : '—'}
                </span>
              </div>
            </div>
          </CategoryRow>

          {/* Final border */}
          <div className="border-t border-black/10" />
        </div>
      )}
    </div>
  )
}