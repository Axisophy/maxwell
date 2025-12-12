import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { cachedFetch, TTL } from '@/lib/cache'

// ===========================================
// EARTHQUAKES API ROUTE
// ===========================================
// Proxies USGS earthquake data with Vercel KV caching
// Cache TTL: 1 minute (earthquakes are real-time)
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

interface EarthquakeResponse {
  earthquakes: Earthquake[]
  count: number
  maxMagnitude: number
  timestamp: string
}

const ALLOWED_PERIODS = ['day', 'week'] as const

async function fetchEarthquakeData(period: 'day' | 'week'): Promise<EarthquakeResponse> {
  // Use USGS pre-built feeds - M4.5+ for the specified period
  const feed = period === 'week' ? '4.5_week' : '4.5_day'
  const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${feed}.geojson`

  const response = await fetchWithTimeout(url, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`USGS API returned ${response.status}`)
  }

  const data = await response.json()

  const earthquakes: Earthquake[] = data.features
    .map((f: any) => ({
      id: f.id,
      magnitude: f.properties.mag,
      place: f.properties.place || 'Unknown location',
      time: f.properties.time,
      latitude: f.geometry.coordinates[1],
      longitude: f.geometry.coordinates[0],
      depth: f.geometry.coordinates[2],
      url: f.properties.url,
      tsunami: f.properties.tsunami === 1,
    }))
    .sort((a: Earthquake, b: Earthquake) => b.time - a.time)

  const maxMagnitude = earthquakes.length > 0
    ? Math.max(...earthquakes.map(eq => eq.magnitude))
    : 0

  return {
    earthquakes,
    count: earthquakes.length,
    maxMagnitude,
    timestamp: new Date().toISOString(),
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const periodParam = searchParams.get('period') || 'day'

  // Validate period parameter
  if (!ALLOWED_PERIODS.includes(periodParam as typeof ALLOWED_PERIODS[number])) {
    return NextResponse.json(
      { error: `Invalid period. Must be one of: ${ALLOWED_PERIODS.join(', ')}` },
      { status: 400 }
    )
  }
  const period = periodParam as 'day' | 'week'

  try {
    const { data, cacheStatus, cacheAge } = await cachedFetch({
      key: `earthquakes:${period}`,
      ttl: TTL.FAST, // 1 minute
      fetcher: () => fetchEarthquakeData(period),
    })

    const headers: Record<string, string> = { 'X-Cache': cacheStatus }
    if (cacheAge !== undefined) {
      headers['X-Cache-Age'] = String(cacheAge)
    }

    return NextResponse.json(data, { headers })

  } catch (error) {
    console.error('Earthquakes API error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch earthquake data' },
      { status: 500 }
    )
  }
}
