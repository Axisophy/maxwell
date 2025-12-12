import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { cachedFetch, TTL } from '@/lib/cache'

// ===========================================
// ISS TRACKER API ROUTE
// ===========================================
// Uses wheretheiss.at API (more reliable than Open Notify)
// Also fetches astronaut data from Open Notify
// Cache TTL: 30 seconds for position, 5 min for astronauts
// ===========================================

interface ISSData {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  region: string
  timestamp: string
}

interface Astronaut {
  name: string
  craft: string
}

interface AstronautData {
  count: number
  people: Astronaut[]
}

interface CombinedData {
  iss: ISSData
  astronauts: AstronautData
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function getRegionFromCoords(lat: number, lng: number): string {
  // Polar regions
  if (lat > 66) return 'Arctic'
  if (lat < -66) return 'Antarctic'

  // Continents (rough bounds)
  if (lat > 25 && lat < 72 && lng > -170 && lng < -50) return 'North America'
  if (lat > -56 && lat < 12 && lng > -82 && lng < -34) return 'South America'
  if (lat > 36 && lat < 71 && lng > -11 && lng < 40) return 'Europe'
  if (lat > -35 && lat < 37 && lng > -18 && lng < 52) return 'Africa'
  if (lat > 5 && lat < 78 && lng > 26 && lng < 180) return 'Asia'
  if (lat > 5 && lat < 55 && lng > 60 && lng < 150) return 'Asia'
  if (lat > -47 && lat < -10 && lng > 113 && lng < 154) return 'Australia'
  if (lat > -47 && lat < -34 && lng > 166 && lng < 179) return 'New Zealand'

  // Oceans
  if (lng > 100 || lng < -100) {
    return lat > 0 ? 'North Pacific' : 'South Pacific'
  }
  if (lng > -80 && lng < 0) {
    return lat > 0 ? 'North Atlantic' : 'South Atlantic'
  }
  if (lng > 20 && lng < 100 && lat < 30 && lat > -40) {
    return 'Indian Ocean'
  }

  return 'Pacific Ocean'
}

// ===========================================
// DATA FETCHERS
// ===========================================

async function fetchISSPosition(): Promise<ISSData> {
  // Try wheretheiss.at first (more reliable)
  try {
    const response = await fetchWithTimeout(
      'https://api.wheretheiss.at/v1/satellites/25544',
      { cache: 'no-store' }
    )

    if (response.ok) {
      const data = await response.json()
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        altitude: Math.round(data.altitude),
        velocity: Math.round(data.velocity),
        region: getRegionFromCoords(data.latitude, data.longitude),
        timestamp: new Date().toISOString(),
      }
    }
  } catch (error) {
    console.error('wheretheiss.at failed:', error)
  }

  // Fallback: Open Notify
  try {
    const response = await fetchWithTimeout(
      'http://api.open-notify.org/iss-now.json',
      { cache: 'no-store' }
    )

    if (response.ok) {
      const data = await response.json()
      const lat = parseFloat(data.iss_position.latitude)
      const lng = parseFloat(data.iss_position.longitude)

      return {
        latitude: lat,
        longitude: lng,
        altitude: 420, // Approximate
        velocity: 27600, // Approximate
        region: getRegionFromCoords(lat, lng),
        timestamp: new Date().toISOString(),
      }
    }
  } catch (error) {
    console.error('Open Notify failed:', error)
  }

  throw new Error('Unable to fetch ISS position')
}

async function fetchAstronauts(): Promise<AstronautData> {
  try {
    const response = await fetchWithTimeout(
      'http://api.open-notify.org/astros.json',
      { cache: 'no-store' }
    )

    if (response.ok) {
      const data = await response.json()
      return {
        count: data.number,
        people: data.people.map((p: any) => ({
          name: p.name,
          craft: p.craft,
        })),
      }
    }
  } catch (error) {
    console.error('Astronauts fetch failed:', error)
  }

  // Default fallback
  return { count: 0, people: [] }
}

// ===========================================
// MAIN HANDLER
// ===========================================

export async function GET() {
  try {
    // Fetch ISS position and astronauts with separate cache TTLs
    const [issResult, astronautsResult] = await Promise.all([
      cachedFetch({
        key: 'iss-position',
        ttl: TTL.REALTIME, // 30 seconds
        fetcher: fetchISSPosition,
      }),
      cachedFetch({
        key: 'iss-astronauts',
        ttl: TTL.MODERATE, // 5 minutes
        fetcher: fetchAstronauts,
      }),
    ])

    const data: CombinedData = {
      iss: issResult.data,
      astronauts: astronautsResult.data,
    }

    // Use ISS position cache status since it's the primary data
    const cacheStatus = issResult.cacheStatus

    return NextResponse.json(data, {
      headers: { 'X-Cache': cacheStatus },
    })

  } catch (error) {
    console.error('ISS API error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch ISS data' },
      { status: 500 }
    )
  }
}
