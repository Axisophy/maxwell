'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns'

// ===========================================
// EARTHQUAKES LIVE WIDGET
// ===========================================
// Shows recent significant earthquakes (M4.5+)
// Data: USGS Earthquake Hazards Program
// ===========================================

interface Earthquake {
  id: string
  magnitude: number
  place: string
  time: number
  latitude: number
  longitude: number
  depth: number
  url: string
  tsunami: boolean
}

interface EarthquakeData {
  earthquakes: Earthquake[]
  count: number
  maxMagnitude: number
  timestamp: string
}

// Magnitude colour scale
function getMagnitudeColor(mag: number): string {
  if (mag >= 7) return '#7f1d1d'  // Major - dark red
  if (mag >= 6) return '#dc2626'  // Strong - red
  if (mag >= 5) return '#ea580c'  // Moderate - orange
  if (mag >= 4) return '#f59e0b'  // Light - amber
  return '#84cc16'                 // Minor - lime
}

// Marker size based on magnitude
function getMagnitudeSize(mag: number): number {
  if (mag >= 7) return 12
  if (mag >= 6) return 9
  if (mag >= 5) return 7
  return 5
}

// Convert lat/lng to map coordinates
function latLonToXY(lat: number, lon: number, width: number, height: number) {
  const x = ((lon + 180) / 360) * width
  const y = ((90 - lat) / 180) * height
  return { x, y }
}

// ===========================================
// SIMPLE WORLD MAP
// ===========================================

function EarthquakeMap({ 
  earthquakes, 
  width = 360, 
  height = 180 
}: { 
  earthquakes: Earthquake[]
  width?: number
  height?: number
}) {
  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Ocean */}
      <rect x="0" y="0" width={width} height={height} fill="#1e3a5f" />
      
      {/* Simplified continents */}
      <g fill="#2d4a6f" opacity="0.8">
        {/* North America */}
        <path d="M 30,30 Q 60,25 90,35 L 95,55 Q 80,70 70,75 L 50,70 Q 35,60 30,45 Z" />
        {/* South America */}
        <path d="M 70,85 Q 85,80 90,90 L 85,130 Q 75,145 65,140 L 60,110 Q 60,95 70,85 Z" />
        {/* Europe */}
        <path d="M 160,30 Q 180,25 195,35 L 200,50 Q 185,55 170,50 L 160,40 Z" />
        {/* Africa */}
        <path d="M 165,55 Q 185,50 200,60 L 195,100 Q 180,115 165,105 L 160,75 Z" />
        {/* Asia */}
        <path d="M 200,25 Q 260,20 310,35 L 320,55 Q 300,70 260,65 L 220,55 Q 205,45 200,35 Z" />
        {/* Australia */}
        <path d="M 280,100 Q 310,95 325,105 L 320,125 Q 300,135 285,125 L 280,110 Z" />
      </g>
      
      {/* Plate boundaries (simplified) */}
      <path
        d="M 0,50 Q 50,60 100,55 T 200,50 T 300,55 L 360,50"
        fill="none"
        stroke="#3d5a7f"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.5"
      />
      <path
        d="M 280,20 Q 290,60 295,100 T 300,160"
        fill="none"
        stroke="#3d5a7f"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.5"
      />
      
      {/* Earthquake markers */}
      {earthquakes.map(eq => {
        const { x, y } = latLonToXY(eq.latitude, eq.longitude, width, height)
        const size = getMagnitudeSize(eq.magnitude)
        const color = getMagnitudeColor(eq.magnitude)
        
        return (
          <g key={eq.id}>
            {/* Pulse for M6+ */}
            {eq.magnitude >= 6 && (
              <circle
                cx={x} cy={y}
                r={size + 3}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                opacity="0.4"
                className="animate-ping"
                style={{ animationDuration: '2s' }}
              />
            )}
            <circle
              cx={x} cy={y}
              r={size}
              fill={color}
              opacity="0.9"
            />
          </g>
        )
      })}
    </svg>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

type Period = 'day' | 'week'

export default function EarthquakesLive() {
  const [data, setData] = useState<EarthquakeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<Period>('day')

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/earthquakes?period=${period}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      console.error('Earthquake fetch error:', err)
      setError('Unable to load data')
    } finally {
      setIsLoading(false)
    }
  }, [period])

  useEffect(() => {
    setIsLoading(true)
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Get top 5 earthquakes for the list
  const topQuakes = data?.earthquakes.slice(0, 5) || []

  if (isLoading && !data) {
    return (
      <div className="p-4 flex items-center justify-center h-48 text-text-muted">
        Loading seismic data...
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="p-4 flex items-center justify-center h-48 text-red-500">
        {error}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="p-4 space-y-4">
      {/* Period toggle + stats */}
      <div className="flex items-center justify-between">
        {/* Toggle */}
        <div className="inline-flex bg-[#e5e5e5] rounded-lg p-1">
          <button
            onClick={() => setPeriod('day')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              period === 'day'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              period === 'week'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            7 Days
          </button>
        </div>
        
        {/* Stats */}
        <div className="flex items-baseline gap-4">
          <div className="text-right">
            <span className="font-mono text-2xl font-bold">{data.count}</span>
            <span className="text-xs text-text-muted ml-1">quakes</span>
          </div>
          {data.maxMagnitude > 0 && (
            <div className="text-right">
              <span 
                className="font-mono text-2xl font-bold"
                style={{ color: getMagnitudeColor(data.maxMagnitude) }}
              >
                {data.maxMagnitude.toFixed(1)}
              </span>
              <span className="text-xs text-text-muted ml-1">max</span>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="rounded-lg overflow-hidden">
        <EarthquakeMap earthquakes={data.earthquakes} />
      </div>

      {/* Magnitude legend */}
      <div className="flex justify-center gap-4">
        {[
          { mag: 4, label: '4+' },
          { mag: 5, label: '5+' },
          { mag: 6, label: '6+' },
          { mag: 7, label: '7+' },
        ].map(({ mag, label }) => (
          <div key={mag} className="flex items-center gap-1.5">
            <div 
              className="rounded-full"
              style={{ 
                backgroundColor: getMagnitudeColor(mag),
                width: getMagnitudeSize(mag) * 1.5,
                height: getMagnitudeSize(mag) * 1.5,
              }}
            />
            <span className="text-xs text-text-muted">{label}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5]" />

      {/* Recent significant quakes */}
      {topQuakes.length > 0 ? (
        <div className="space-y-2">
          <span className="text-xs text-text-muted uppercase tracking-wide">
            Recent Significant
          </span>
          <div className="space-y-2">
            {topQuakes.map(eq => (
              <div 
                key={eq.id}
                className="flex items-center gap-3"
              >
                {/* Magnitude badge */}
                <div 
                  className="w-10 h-10 flex items-center justify-center rounded-lg font-mono text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: getMagnitudeColor(eq.magnitude) }}
                >
                  {eq.magnitude.toFixed(1)}
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">
                    {eq.place}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span>{formatDistanceToNow(new Date(eq.time), { addSuffix: true })}</span>
                    <span>·</span>
                    <span>{eq.depth.toFixed(0)} km deep</span>
                    {eq.tsunami && (
                      <>
                        <span>·</span>
                        <span className="text-amber-600">⚠ Tsunami</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-text-muted text-sm">
          No significant earthquakes in this period
        </div>
      )}
    </div>
  )
}