'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { BreadcrumbFrame, breadcrumbItems, PageHeaderFrame } from '@/components/ui'
import { ObserveIcon } from '@/components/icons'

// Dynamic import for map (client-side only)
const FiresMap = dynamic(() => import('./components/FiresMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-neutral-900 rounded-xl flex items-center justify-center">
      <span className="text-white/50">Loading fire map...</span>
    </div>
  ),
})

interface Fire {
  id: string
  lat: number
  lon: number
  brightness: number
  confidence: 'high' | 'nominal' | 'low'
  frp: number
  satellite: string
  timestamp: string
  region: string
}

interface FireData {
  timestamp: string
  fires: Fire[]
  totalFires: number
  byRegion: Record<string, number>
  largestFire: Fire | null
  recentHours: number
}

const TIME_RANGES = [
  { value: '24h', label: '24 Hours', days: 1 },
  { value: '48h', label: '48 Hours', days: 2 },
  { value: '7d', label: '7 Days', days: 7 },
]

const REGIONS = [
  { value: 'all', label: 'Global' },
  { value: 'north-america', label: 'North America' },
  { value: 'south-america', label: 'South America' },
  { value: 'europe', label: 'Europe' },
  { value: 'africa', label: 'Africa' },
  { value: 'asia', label: 'Asia' },
  { value: 'australia', label: 'Australia' },
]

export default function ActiveFiresPage() {
  const [data, setData] = useState<FireData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('24h')
  const [region, setRegion] = useState('all')

  const fetchData = useCallback(async () => {
    try {
      const days = TIME_RANGES.find(t => t.value === timeRange)?.days || 1
      const response = await fetch(`/api/fires?days=${days}&region=${region}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError('Unable to load fire data')
    } finally {
      setLoading(false)
    }
  }, [timeRange, region])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000) // 5 minutes
    return () => clearInterval(interval)
  }, [fetchData])

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-red-600'
      case 'nominal': return 'text-orange-500'
      default: return 'text-yellow-500'
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        <BreadcrumbFrame
          variant="light"
          icon={<ObserveIcon className="w-4 h-4" />}
          items={breadcrumbItems(
            ['MXWLL', '/'],
            ['Observe', '/observe'],
            ['Earth', '/observe/earth'],
            ['Active Fires']
          )}
        />

        <PageHeaderFrame
          variant="light"
          title="Active fires"
          description="Global fire detection from NASA FIRMS satellite data. MODIS and VIIRS sensors detect thermal anomalies indicating active burning."
        />

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Time Range */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-black/50">Time:</span>
            <div className="flex rounded-lg overflow-hidden border border-black/10">
              {TIME_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    timeRange === range.value
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-black/5'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-black/50">Region:</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-3 py-1.5 text-sm bg-white border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
            >
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Live indicator */}
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono text-black/40 uppercase">Live Data</span>
          </div>
        </div>

        {/* Map */}
        <div className="mb-6">
          <FiresMap
            fires={data?.fires || []}
            loading={loading}
            className="h-[50vh] min-h-[400px] max-h-[600px]"
          />
        </div>

        {/* Statistics */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                <div className="h-8 bg-black/10 rounded mb-2" />
                <div className="h-4 bg-black/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl p-5 mb-6 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : data && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5">
                <p className="text-3xl font-light text-red-600">
                  {data.totalFires.toLocaleString()}
                </p>
                <p className="text-sm text-black/50">Total Detections</p>
              </div>
              <div className="bg-white rounded-xl p-5">
                <p className="text-3xl font-light text-black">
                  {data.recentHours}h
                </p>
                <p className="text-sm text-black/50">Time Window</p>
              </div>
              <div className="bg-white rounded-xl p-5">
                <p className="text-3xl font-light text-orange-500">
                  {data.largestFire?.frp.toFixed(1) || '-'} MW
                </p>
                <p className="text-sm text-black/50">Highest FRP</p>
              </div>
              <div className="bg-white rounded-xl p-5">
                <p className="text-3xl font-light text-black">
                  {Object.keys(data.byRegion).length}
                </p>
                <p className="text-sm text-black/50">Active Regions</p>
              </div>
            </div>

            {/* Regional Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5">
                <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
                  By Region
                </h3>
                <div className="space-y-3">
                  {Object.entries(data.byRegion)
                    .sort(([, a], [, b]) => b - a)
                    .map(([regionName, count]) => (
                      <div key={regionName} className="flex items-center justify-between">
                        <span className="text-sm text-black">{regionName}</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 bg-red-500 rounded-full"
                            style={{
                              width: `${Math.max(20, (count / Math.max(...Object.values(data.byRegion))) * 100)}px`
                            }}
                          />
                          <span className="text-sm font-mono text-black/60 w-12 text-right">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-5">
                <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
                  Recent Detections
                </h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {data.fires.slice(0, 10).map((fire) => (
                    <div key={fire.id} className="flex items-center justify-between py-1 border-b border-black/5 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          fire.confidence === 'high' ? 'bg-red-500' :
                          fire.confidence === 'nominal' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`} />
                        <span className="text-sm text-black">{fire.region}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-black/40">{fire.satellite}</span>
                        <span className={`text-xs font-mono ${getConfidenceColor(fire.confidence)}`}>
                          {fire.frp.toFixed(1)} MW
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5">
            <h3 className="text-sm font-medium text-black mb-3">MODIS Sensor</h3>
            <p className="text-xs text-black/50 leading-relaxed">
              Moderate Resolution Imaging Spectroradiometer aboard Terra and Aqua satellites.
              1km resolution, detects fires 4+ times daily at any location.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5">
            <h3 className="text-sm font-medium text-black mb-3">VIIRS Sensor</h3>
            <p className="text-xs text-black/50 leading-relaxed">
              Visible Infrared Imaging Radiometer Suite on Suomi NPP and NOAA-20.
              375m resolution, better small fire detection than MODIS.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5">
            <h3 className="text-sm font-medium text-black mb-3">Fire Radiative Power</h3>
            <p className="text-xs text-black/50 leading-relaxed">
              FRP measures heat output in megawatts, indicating fire intensity.
              Higher FRP suggests more intense burning and greater smoke emissions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-black/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/observe/earth"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              ← Back to Earth
            </Link>
            <Link
              href="/observe/earth/unrest"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              Unrest →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-black/10">
            <p className="text-xs text-black/30 mb-2">Data Source</p>
            <p className="text-xs text-black/50">
              NASA FIRMS (Fire Information for Resource Management System) •
              MODIS & VIIRS Active Fire Products
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
