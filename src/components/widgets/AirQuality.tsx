'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// AIR QUALITY
// ===========================================
// Air quality index with pollutant breakdown
// Data: OpenAQ
//
// Design notes:
// - NO title/live dot/source (WidgetFrame handles those)
// - Hero AQI number with category badge
// - Segmented AQI bar
// - Single-column pollutant list with WHO comparisons
// ===========================================

interface AirQualityData {
  location: {
    name: string
    city: string
    country: string
    coordinates: { latitude: number; longitude: number }
    distance?: number
  }
  aqi: number
  pm25: number
  category: {
    level: string
    color: string
  }
  pollutants: {
    parameter: string
    displayName: string
    value: number
    unit: string
    whoGuideline: number
    exceedsWho: boolean
  }[]
  lastUpdated: string
}

// Health guidance messages by AQI category
const healthGuidance: Record<string, { message: string; color: string }> = {
  'Good': { message: 'Good for outdoor activity', color: '#22c55e' },
  'Moderate': { message: 'Acceptable for most people', color: '#eab308' },
  'Unhealthy for Sensitive Groups': { message: 'Sensitive groups should limit outdoor exertion', color: '#f97316' },
  'Unhealthy': { message: 'Everyone should reduce prolonged outdoor exertion', color: '#ef4444' },
  'Very Unhealthy': { message: 'Avoid prolonged outdoor exertion', color: '#7c3aed' },
  'Hazardous': { message: 'Everyone should avoid all outdoor exertion', color: '#831843' },
}

// AQI segments for the horizontal bar
const AQI_SEGMENTS = [
  { max: 50, color: '#22c55e', label: 'Good' },
  { max: 100, color: '#eab308', label: 'Moderate' },
  { max: 150, color: '#f97316', label: 'USG' },
  { max: 200, color: '#ef4444', label: 'Unhealthy' },
  { max: 300, color: '#7c3aed', label: 'Very Unhealthy' },
]

// Pollutant row component
function PollutantRow({
  name,
  value,
  unit,
  whoGuideline,
}: {
  name: string
  value: number
  unit: string
  whoGuideline: number
}) {
  const percentage = Math.min(100, (value / (whoGuideline * 2)) * 100)
  const whoPosition = Math.min(100, (whoGuideline / (whoGuideline * 2)) * 100)
  const exceedsWho = value > whoGuideline

  return (
    <div className="py-[0.5em] border-b border-black/5 last:border-0">
      <div className="flex items-center justify-between mb-[0.25em]">
        <span className="text-[0.875em] text-black/70">{name}</span>
        <div className="flex items-baseline gap-[0.25em]">
          <span className={`text-[1.125em] font-mono font-medium ${exceedsWho ? 'text-[#ef4444]' : 'text-black'}`}>
            {value.toFixed(1)}
          </span>
          <span className="text-[0.75em] text-black/40">{unit}</span>
        </div>
      </div>
      <div className="relative h-[0.375em] bg-black/10 rounded-full overflow-visible">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor: exceedsWho ? '#ef4444' : '#22c55e'
          }}
        />
        {/* WHO guideline marker */}
        <div
          className="absolute top-[-0.125em] w-[0.125em] h-[0.625em] bg-black/60 rounded-full"
          style={{ left: `${whoPosition}%` }}
          title={`WHO guideline: ${whoGuideline} ${unit}`}
        />
      </div>
      <div className="text-[0.6875em] text-black/40 mt-[0.125em]">
        WHO limit: {whoGuideline} {unit}
      </div>
    </div>
  )
}

export default function AirQuality() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [data, setData] = useState<AirQualityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [locationStatus, setLocationStatus] = useState<'pending' | 'granted' | 'denied'>('pending')

  // Responsive scaling
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25)
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Request user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
          setLocationStatus('granted')
        },
        () => setLocationStatus('denied'),
        { timeout: 5000 }
      )
    } else {
      setLocationStatus('denied')
    }
  }, [])

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (userCoords) {
        params.set('lat', String(userCoords.lat))
        params.set('lon', String(userCoords.lon))
      }

      const response = await fetch(`/api/air-quality?${params}`)
      if (!response.ok) throw new Error('Failed to fetch')

      const result = await response.json()
      if (result.error) throw new Error(result.error)

      setData(result)
      setError(null)
    } catch (err) {
      console.error('Error fetching air quality:', err)
      setError('Unable to fetch data')
    } finally {
      setLoading(false)
    }
  }, [userCoords])

  useEffect(() => {
    if (locationStatus !== 'pending') {
      fetchData()
      const interval = setInterval(fetchData, 15 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [fetchData, locationStatus])

  if (loading || locationStatus === 'pending') {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full bg-white p-[1em]"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-[0.875em] text-black/50">
          {locationStatus === 'pending' ? 'Getting location...' : 'Loading...'}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full bg-white p-[1em]"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-[0.875em] text-[#ef4444]">{error || 'No data'}</div>
      </div>
    )
  }

  // Get health guidance
  const guidance = healthGuidance[data.category.level] || healthGuidance['Good']

  // Calculate AQI bar position
  const aqiPosition = Math.min(100, (data.aqi / 300) * 100)

  // Get key pollutants for display
  const keyPollutants = [
    data.pollutants.find(p => p.parameter === 'pm25') || { displayName: 'PM2.5', value: data.pm25, unit: 'μg/m³', whoGuideline: 15, exceedsWho: data.pm25 > 15 },
    data.pollutants.find(p => p.parameter === 'pm10'),
    data.pollutants.find(p => p.parameter === 'no2'),
    data.pollutants.find(p => p.parameter === 'o3'),
  ].filter(Boolean)

  // Format last updated time
  const lastUpdated = new Date(data.lastUpdated)
  const timeString = lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      ref={containerRef}
      className="h-full bg-white overflow-hidden flex flex-col p-[1em]"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Hero AQI section */}
      <div className="p-[0.75em] bg-[#f8fafc] rounded-[0.5em] mb-[0.75em]">
        <div className="text-[0.75em] uppercase tracking-wider text-black/50 mb-[0.25em]">
          Air Quality Index
        </div>

        <div className="flex items-baseline justify-between mb-[0.5em]">
          <span className="text-[2.5em] font-mono font-bold text-black">
            {data.aqi}
          </span>
          <span
            className="text-[0.875em] font-medium px-[0.5em] py-[0.25em] rounded-[0.25em]"
            style={{
              backgroundColor: `${data.category.color}20`,
              color: data.category.color
            }}
          >
            {data.category.level}
          </span>
        </div>

        {/* Segmented AQI bar */}
        <div className="relative h-[0.5em] rounded-full overflow-hidden flex">
          {AQI_SEGMENTS.map((segment, i) => {
            const prevMax = i === 0 ? 0 : AQI_SEGMENTS[i - 1].max
            const width = ((segment.max - prevMax) / 300) * 100
            const isActive = data.aqi >= prevMax
            const isCurrent = data.aqi >= prevMax && data.aqi < segment.max

            return (
              <div
                key={segment.label}
                className="h-full transition-opacity"
                style={{
                  width: `${width}%`,
                  backgroundColor: segment.color,
                  opacity: isActive ? (isCurrent ? 1 : 0.7) : 0.2
                }}
              />
            )
          })}

          {/* Position indicator */}
          <div
            className="absolute top-[-0.125em] w-[0.375em] h-[0.75em] bg-black rounded-full shadow-sm"
            style={{ left: `calc(${aqiPosition}% - 0.1875em)` }}
          />
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-[0.625em] text-black/40 mt-[0.25em]">
          <span>0</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>200</span>
          <span>300</span>
        </div>
      </div>

      {/* Key Pollutants - single column */}
      <div className="mb-[0.75em] flex-1 overflow-auto">
        <div className="text-[0.75em] uppercase tracking-wider text-black/50 mb-[0.375em]">
          Key Pollutants
        </div>
        <div className="bg-[#f8fafc] rounded-[0.5em] px-[0.75em]">
          {keyPollutants.map((pollutant, i) => (
            <PollutantRow
              key={pollutant?.displayName || i}
              name={pollutant?.displayName || 'N/A'}
              value={pollutant?.value ?? 0}
              unit={pollutant?.unit || 'μg/m³'}
              whoGuideline={pollutant?.whoGuideline || 10}
            />
          ))}
        </div>
      </div>

      {/* Health guidance */}
      <div
        className="p-[0.625em] rounded-[0.5em] mb-[0.5em]"
        style={{ backgroundColor: `${guidance.color}15` }}
      >
        <div className="flex items-center gap-[0.375em]">
          <div
            className="w-[0.375em] h-[0.375em] rounded-full flex-shrink-0"
            style={{ backgroundColor: guidance.color }}
          />
          <span className="text-[0.875em] text-black/70">
            {guidance.message}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[0.6875em] text-black/40 pt-[0.5em] border-t border-black/5">
        <span>{data.location.city} · Updated {timeString}</span>
        {data.location.distance && (
          <span>Station {data.location.distance.toFixed(1)}km away</span>
        )}
      </div>
    </div>
  )
}
