'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// AIR QUALITY WIDGET
// ===========================================
// Shows current air quality index with collapsible pollutant breakdown
// Defaults to user's location, falls back to London
// Data: OpenAQ via /api/air-quality (cached server-side)
// ===========================================

interface AirQualityData {
  location: {
    name: string
    city: string
    country: string
    coordinates: { latitude: number; longitude: number }
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

// AQI Gauge - semicircular design similar to SpaceWeather Kp gauge
function AQIGauge({ aqi, color }: { aqi: number; color: string }) {
  // AQI scale: 0-500, but most readings are 0-200
  const normalizedValue = Math.min(300, Math.max(0, aqi))
  const angle = (normalizedValue / 300) * 180 - 90
  
  // Segment colors for the gauge background
  const segments = [
    { max: 50, color: '#22c55e' },   // Good
    { max: 100, color: '#eab308' },  // Moderate
    { max: 150, color: '#f97316' },  // Unhealthy (Sensitive)
    { max: 200, color: '#ef4444' },  // Unhealthy
    { max: 300, color: '#7c3aed' },  // Very Unhealthy
  ]
  
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
          {segments.map((segment, i) => {
            const prevMax = i === 0 ? 0 : segments[i - 1].max
            const startAngle = (prevMax / 300) * 180 - 180
            const endAngle = (segment.max / 300) * 180 - 180
            const startRad = (startAngle * Math.PI) / 180
            const endRad = (endAngle * Math.PI) / 180
            const x1 = 50 + 40 * Math.cos(startRad)
            const y1 = 55 + 40 * Math.sin(startRad)
            const x2 = 50 + 40 * Math.cos(endRad)
            const y2 = 55 + 40 * Math.sin(endRad)
            
            const isActive = aqi >= prevMax
            
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} A 40 40 0 0 1 ${x2} ${y2}`}
                fill="none"
                stroke={segment.color}
                strokeWidth="6"
                strokeLinecap="butt"
                opacity={isActive ? (aqi > segment.max ? 1 : 0.8) : 0.2}
              />
            )
          })}
          
          {/* Needle */}
          <g transform={`rotate(${angle}, 50, 55)`}>
            <line 
              x1="50" y1="55" x2="50" y2="20" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
            <circle cx="50" cy="55" r="4" fill={color} />
          </g>
          
          {/* Scale labels */}
          <text x="12" y="58" fill="#666666" fontSize="7" fontWeight="500" textAnchor="middle">0</text>
          <text x="50" y="10" fill="#666666" fontSize="7" fontWeight="500" textAnchor="middle">150</text>
          <text x="88" y="58" fill="#666666" fontSize="7" fontWeight="500" textAnchor="middle">300</text>
        </svg>
      </div>
      
      <div className="text-center mt-1">
        <span className="font-mono font-bold text-3xl" style={{ color }}>{aqi}</span>
      </div>
    </div>
  )
}

// Pollutant bar with WHO guideline marker
function PollutantBar({ 
  displayName, 
  value, 
  unit, 
  whoGuideline, 
  exceedsWho 
}: {
  displayName: string
  value: number
  unit: string
  whoGuideline: number
  exceedsWho: boolean
}) {
  // Scale: show up to 2x WHO guideline
  const maxValue = whoGuideline * 2
  const percentage = Math.min(100, (value / maxValue) * 100)
  const whoPosition = Math.min(100, (whoGuideline / maxValue) * 100)
  
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-text-primary">{displayName}</span>
        <span className={`font-mono text-xs ${exceedsWho ? 'text-red-500 font-medium' : 'text-text-muted'}`}>
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <div className="relative h-1.5 bg-[#e5e5e5] rounded-full">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: exceedsWho ? '#ef4444' : '#22c55e' 
          }}
        />
        {/* WHO guideline marker */}
        <div 
          className="absolute top-[-2px] w-0.5 h-2.5 bg-text-primary"
          style={{ left: `${whoPosition}%` }}
          title={`WHO: ${whoGuideline} ${unit}`}
        />
      </div>
    </div>
  )
}

export default function AirQuality() {
  const [data, setData] = useState<AirQualityData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPollutants, setShowPollutants] = useState(false)
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [locationStatus, setLocationStatus] = useState<'pending' | 'granted' | 'denied'>('pending')

  // Request user location on mount
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
        () => {
          // Location denied - will use default (London)
          setLocationStatus('denied')
        },
        { timeout: 5000 }
      )
    } else {
      setLocationStatus('denied')
    }
  }, [])

  // Fetch air quality data
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
      setIsLoading(false)
    }
  }, [userCoords])

  // Fetch when location is determined
  useEffect(() => {
    if (locationStatus !== 'pending') {
      fetchData()
      // Refresh every 15 minutes (matches server cache)
      const interval = setInterval(fetchData, 15 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [fetchData, locationStatus])

  // Loading state
  if (isLoading || locationStatus === 'pending') {
    return (
      <div className="w-full aspect-[4/3] flex items-center justify-center">
        <div className="text-text-muted text-sm animate-pulse">
          {locationStatus === 'pending' ? 'Getting location...' : 'Loading...'}
        </div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div className="w-full aspect-[4/3] flex items-center justify-center">
        <div className="text-red-500 text-sm">{error || 'No data'}</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Location and status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: data.category.color }}
          />
          <span className="text-sm text-text-primary">
            {data.location.city}
          </span>
        </div>
        <span className="text-xs text-text-muted font-mono">OpenAQ</span>
      </div>
      
      {/* Main AQI display */}
      <div className="flex flex-col items-center mb-4">
        <span className="text-xs text-text-muted uppercase tracking-wide mb-2">
          Air Quality Index
        </span>
        <AQIGauge aqi={data.aqi} color={data.category.color} />
      </div>
      
      {/* Category label */}
      <div className="text-center mb-4">
        <span 
          className="text-sm font-medium"
          style={{ color: data.category.color }}
        >
          {data.category.level}
        </span>
      </div>
      
      {/* PM2.5 highlight */}
      <div className="flex items-center justify-between py-2 border-t border-[#e5e5e5]">
        <span className="text-xs text-text-muted">PM2.5</span>
        <span className="font-mono text-sm font-medium">
          {data.pm25.toFixed(1)} <span className="text-text-muted font-normal">μg/m³</span>
        </span>
      </div>
      
      {/* Collapsible pollutants breakdown */}
      {data.pollutants.length > 0 && (
        <div className="border-t border-[#e5e5e5] pt-3 mt-2">
          <button
            onClick={() => setShowPollutants(!showPollutants)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-xs text-text-muted uppercase tracking-wide">
              Pollutants
            </span>
            <svg 
              className={`w-4 h-4 text-text-muted transition-transform ${showPollutants ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showPollutants && (
            <div className="mt-3">
              {data.pollutants.map((p) => (
                <PollutantBar
                  key={p.parameter}
                  displayName={p.displayName}
                  value={p.value}
                  unit={p.unit}
                  whoGuideline={p.whoGuideline}
                  exceedsWho={p.exceedsWho}
                />
              ))}
              
              {/* WHO legend */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#e5e5e5]">
                <div className="w-2 h-2 bg-text-primary" />
                <span className="text-[10px] text-text-muted">WHO guideline</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}