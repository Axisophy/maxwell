'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns'
import WorldMap, { latLonToXY } from './WorldMap'

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

// Marker size based on magnitude (scaled for new viewBox)
function getMagnitudeSize(mag: number): number {
  if (mag >= 7) return 20
  if (mag >= 6) return 14
  if (mag >= 5) return 10
  return 7
}

// ===========================================
// EARTHQUAKE MARKERS
// ===========================================

function EarthquakeMarkers({ earthquakes }: { earthquakes: Earthquake[] }) {
  return (
    <g>
      {earthquakes.map(eq => {
        const { x, y } = latLonToXY(eq.latitude, eq.longitude)
        const size = getMagnitudeSize(eq.magnitude)
        const color = getMagnitudeColor(eq.magnitude)
        
        return (
          <g key={eq.id}>
            {/* Pulse for M6+ */}
            {eq.magnitude >= 6 && (
              <circle
                cx={x} cy={y}
                r={size}
                fill="none"
                stroke={color}
                strokeWidth="2"
                opacity="0.6"
              >
                <animate
                  attributeName="r"
                  from={size}
                  to={size * 2.5}
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.6"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={x} cy={y}
              r={size}
              fill={color}
              opacity="0.85"
            />
          </g>
        )
      })}
    </g>
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
        <WorldMap>
          <EarthquakeMarkers earthquakes={data.earthquakes} />
        </WorldMap>
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
                width: 12,
                height: 12,
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