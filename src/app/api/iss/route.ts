import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'

// ===========================================
// ISS TRACKER API ROUTE
// ===========================================
// Uses wheretheiss.at API (more reliable than Open Notify)
// Also fetches astronaut data from Open Notify
// Cache TTL: 30 seconds for position, 5 min for astronauts
// ===========================================

interface CacheEntry<T> {
  data: T
  timestamp: number
}

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

// Separate caches
let issCache: CacheEntry<ISSData> | null = null
let astronautCache: CacheEntry<AstronautData> | null = null

const ISS_CACHE_TTL = 30 * 1000 // 30 seconds
const ASTRONAUT_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

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
  // Check cache first
  if (issCache && Date.now() - issCache.timestamp < ISS_CACHE_TTL) {
    return issCache.data
  }

  try {
    // Primary: wheretheiss.at (more reliable)
    const response = await fetchWithTimeout(
      'https://api.wheretheiss.at/v1/satellites/25544',
      { cache: 'no-store' }
    )
    
    if (response.ok) {
      const data = await response.json()
      const result: ISSData = {
        latitude: data.latitude,
        longitude: data.longitude,
        altitude: Math.round(data.altitude),
        velocity: Math.round(data.velocity),
        region: getRegionFromCoords(data.latitude, data.longitude),
        timestamp: new Date().toISOString(),
      }
      
      issCache = { data: result, timestamp: Date.now() }
      return result
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
      
      const result: ISSData = {
        latitude: lat,
        longitude: lng,
        altitude: 420, // Approximate
        velocity: 27600, // Approximate
        region: getRegionFromCoords(lat, lng),
        timestamp: new Date().toISOString(),
      }
      
      issCache = { data: result, timestamp: Date.now() }
      return result
    }
  } catch (error) {
    console.error('Open Notify failed:', error)
  }

  // Return stale cache if available
  if (issCache) {
    return issCache.data
  }

  throw new Error('Unable to fetch ISS position')
}

async function fetchAstronauts(): Promise<AstronautData> {
  // Check cache first
  if (astronautCache && Date.now() - astronautCache.timestamp < ASTRONAUT_CACHE_TTL) {
    return astronautCache.data
  }

  try {
    const response = await fetchWithTimeout(
      'http://api.open-notify.org/astros.json',
      { cache: 'no-store' }
    )
    
    if (response.ok) {
      const data = await response.json()
      const result: AstronautData = {
        count: data.number,
        people: data.people.map((p: any) => ({
          name: p.name,
          craft: p.craft,
        })),
      }
      
      astronautCache = { data: result, timestamp: Date.now() }
      return result
    }
  } catch (error) {
    console.error('Astronauts fetch failed:', error)
  }

  // Return stale cache if available
  if (astronautCache) {
    return astronautCache.data
  }

  // Default fallback
  return { count: 0, people: [] }
}

// ===========================================
// MAIN HANDLER
// ===========================================

export async function GET() {
  try {
    const [iss, astronauts] = await Promise.all([
      fetchISSPosition(),
      fetchAstronauts(),
    ])

    const data: CombinedData = { iss, astronauts }

    return NextResponse.json(data, {
      headers: {
        'X-Cache': issCache && Date.now() - issCache.timestamp < 1000 ? 'MISS' : 'HIT',
      },
    })
  } catch (error) {
    console.error('ISS API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch ISS data' },
      { status: 500 }
    )
  }
}