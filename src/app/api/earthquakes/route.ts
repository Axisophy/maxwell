import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'

// ===========================================
// EARTHQUAKES API ROUTE
// ===========================================
// Proxies USGS earthquake data with caching
// Cache TTL: 5 minutes
// ===========================================

interface CacheEntry {
  data: EarthquakeResponse
  timestamp: number
}

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

// Separate caches for each time period
const cache: Record<string, CacheEntry> = {}
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'day' // 'day' or 'week'
  
  const cacheKey = period
  
  // Check cache
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
    return NextResponse.json(cache[cacheKey].data, {
      headers: {
        'X-Cache': 'HIT',
        'X-Cache-Age': String(Math.round((Date.now() - cache[cacheKey].timestamp) / 1000)),
      },
    })
  }

  try {
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

    const result: EarthquakeResponse = {
      earthquakes,
      count: earthquakes.length,
      maxMagnitude,
      timestamp: new Date().toISOString(),
    }

    // Update cache
    cache[cacheKey] = {
      data: result,
      timestamp: Date.now(),
    }

    return NextResponse.json(result, {
      headers: { 'X-Cache': 'MISS' },
    })
  } catch (error) {
    console.error('Earthquakes API error:', error)
    
    // Return stale cache if available
    if (cache[cacheKey]) {
      return NextResponse.json(cache[cacheKey].data, {
        headers: {
          'X-Cache': 'STALE',
          'X-Cache-Age': String(Math.round((Date.now() - cache[cacheKey].timestamp) / 1000)),
        },
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch earthquake data' },
      { status: 500 }
    )
  }
}