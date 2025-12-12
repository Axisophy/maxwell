import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'

// ===========================================
// ASTEROIDS API ROUTE
// ===========================================
// Proxies NASA JPL CAD (Close Approach Data) API
// Cache TTL: 1 hour (data updates infrequently)
// ===========================================

interface CacheEntry {
  data: AsteroidsResponse
  timestamp: number
}

interface Asteroid {
  id: string
  name: string
  closeApproachDate: string
  distanceAU: number
  distanceKm: number
  distanceLunar: number
  velocityKmS: number
  absoluteMagnitude: number
}

interface AsteroidsResponse {
  asteroids: Asteroid[]
  count: number
  dateRange: { start: string; end: string }
  timestamp: string
}

// Cache keyed by date range
const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

// Parse JPL date format: "2024-Dec-07 14:23" -> ISO string
function parseJPLDate(dateStr: string): string {
  const months: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04',
    May: '05', Jun: '06', Jul: '07', Aug: '08',
    Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  }
  const parts = dateStr.match(/(\d{4})-(\w{3})-(\d{2})\s+(\d{2}):(\d{2})/)
  if (parts) {
    const [, year, mon, day, hour, min] = parts
    const month = months[mon] || '01'
    return `${year}-${month}-${day}T${hour}:${min}:00Z`
  }
  return new Date().toISOString()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Get date range - default to next 30 days
  const today = new Date()
  const defaultEnd = new Date(today)
  defaultEnd.setDate(defaultEnd.getDate() + 30)

  const dateMin = searchParams.get('date-min') || today.toISOString().split('T')[0]
  const dateMax = searchParams.get('date-max') || defaultEnd.toISOString().split('T')[0]
  const distMax = searchParams.get('dist-max') || '0.05' // ~20 lunar distances

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateMin) || !dateRegex.test(dateMax)) {
    return NextResponse.json(
      { error: 'Invalid date format. Use YYYY-MM-DD' },
      { status: 400 }
    )
  }

  // Validate dist-max
  const distMaxNum = parseFloat(distMax)
  if (isNaN(distMaxNum) || distMaxNum <= 0 || distMaxNum > 1) {
    return NextResponse.json(
      { error: 'Invalid dist-max. Must be between 0 and 1 AU' },
      { status: 400 }
    )
  }

  // Check cache
  const cacheKey = `${dateMin}-${dateMax}-${distMax}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: {
        'X-Cache': 'HIT',
        'X-Cache-Age': String(Math.round((Date.now() - cached.timestamp) / 1000)),
      },
    })
  }

  try {
    // NASA JPL Close Approach Data API
    const url = new URL('https://ssd-api.jpl.nasa.gov/cad.api')
    url.searchParams.set('date-min', dateMin)
    url.searchParams.set('date-max', dateMax)
    url.searchParams.set('dist-max', distMax)
    url.searchParams.set('sort', 'date')

    const response = await fetchWithTimeout(url.toString())

    if (!response.ok) {
      throw new Error(`JPL API returned ${response.status}`)
    }

    const data = await response.json()

    // Parse the response - JPL returns arrays, not objects
    // Fields: des, orbit_id, jd, cd, dist, dist_min, dist_max, v_rel, v_inf, t_sigma_f, h
    const asteroids: Asteroid[] = (data.data || []).map((row: string[]) => {
      const distanceAU = parseFloat(row[4])
      const distanceKm = distanceAU * 149597870.7 // AU to km
      const distanceLunar = distanceKm / 384400 // km to lunar distances

      return {
        id: row[0],
        name: row[0],
        closeApproachDate: parseJPLDate(row[3]),
        distanceAU,
        distanceKm,
        distanceLunar,
        velocityKmS: parseFloat(row[7]),
        absoluteMagnitude: parseFloat(row[10]) || 25,
      }
    })

    const result: AsteroidsResponse = {
      asteroids,
      count: asteroids.length,
      dateRange: { start: dateMin, end: dateMax },
      timestamp: new Date().toISOString(),
    }

    // Update cache
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    })

    // Clean old cache entries
    if (cache.size > 10) {
      const oldestKey = cache.keys().next().value
      if (oldestKey) cache.delete(oldestKey)
    }

    return NextResponse.json(result, {
      headers: { 'X-Cache': 'MISS' },
    })
  } catch (error) {
    console.error('Asteroids API error:', error)

    // Return stale cache if available
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: {
          'X-Cache': 'STALE',
          'X-Cache-Age': String(Math.round((Date.now() - cached.timestamp) / 1000)),
        },
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch asteroid data' },
      { status: 500 }
    )
  }
}
