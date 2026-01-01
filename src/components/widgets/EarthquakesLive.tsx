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
  if (mag >= 7) return '#dc2626'  // Major - red
  if (mag >= 6) return '#ea580c'  // Strong - orange
  if (mag >= 5) return '#f59e0b'  // Moderate - amber
  if (mag >= 4) return '#facc15'  // Light - yellow
  return '#facc15'                 // Minor - yellow
}

// Marker size based on magnitude (scaled for 784x458 viewBox)
function getMagnitudeSize(mag: number): number {
  if (mag >= 7) return 12
  if (mag >= 6) return 8
  if (mag >= 5) return 6
  return 4
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
                strokeWidth="1.5"
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
      <div className="p-4 flex items-center justify-center h-48 text-black/50">
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
        {/* Toggle - black/red style like SolarDisk */}
        <div className="flex gap-px">
          <button
            onClick={() => setPeriod('day')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              period === 'day'
                ? 'bg-[#ff0000] text-white'
                : 'bg-black text-white/60 hover:text-white'
            }`}
          >
            24 HOURS
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              period === 'week'
                ? 'bg-[#ff0000] text-white'
                : 'bg-black text-white/60 hover:text-white'
            }`}
          >
            7 DAYS
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-baseline gap-4">
          <div className="text-right">
            <span className="font-mono text-2xl font-bold text-black">{data.count}</span>
            <span className="text-xs text-black/50 ml-1">quakes</span>
          </div>
          {data.maxMagnitude > 0 && (
            <div className="text-right">
              <span
                className="font-mono text-2xl font-bold"
                style={{ color: getMagnitudeColor(data.maxMagnitude) }}
              >
                {data.maxMagnitude.toFixed(1)}
              </span>
              <span className="text-xs text-black/50 ml-1">max</span>
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
          { mag: 4, label: '4+', color: '#facc15' },
          { mag: 5, label: '5+', color: '#f59e0b' },
          { mag: 6, label: '6+', color: '#ea580c' },
          { mag: 7, label: '7+', color: '#dc2626' },
        ].map(({ mag, label, color }) => (
          <div key={mag} className="flex items-center gap-1.5">
            <div
              className="rounded-full"
              style={{
                backgroundColor: color,
                width: 12,
                height: 12,
              }}
            />
            <span className="text-xs text-black/50">{label}</span>
          </div>
        ))}
      </div>

      {/* Recent significant quakes */}
      {topQuakes.length > 0 ? (
        <div className="space-y-2">
          <span className="text-xs text-black uppercase tracking-wide">
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

                {/* Details - vertically centered with badge */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="text-sm text-black truncate">
                    {eq.place}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-black/50">
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
        <div className="text-center py-4 text-black/50 text-sm">
          No significant earthquakes in this period
        </div>
      )}
    </div>
  )
}
