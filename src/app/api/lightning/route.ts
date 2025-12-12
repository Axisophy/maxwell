import { NextResponse } from 'next/server'
import { cachedFetch, TTL } from '@/lib/cache'

// ===========================================
// LIGHTNING LIVE API
// ===========================================
// Fetches recent lightning strike data from Blitzortung
// Returns strikes from the last ~10 minutes with statistics
// Cache TTL: 30 seconds (real-time data)
// ===========================================

interface ProcessedStrike {
  id: string
  time: number
  lat: number
  lon: number
  polarity: 'positive' | 'negative'
  stations: number
}

interface LightningResponse {
  strikes: ProcessedStrike[]
  stats: {
    total: number
    strikesPerMinute: number
    positivePercent: number
    mostActiveRegion: string | null
  }
  timestamp: number
}

const FETCH_TIMEOUT = 8000

// Region detection based on coordinates
function detectRegion(lat: number, lon: number): string {
  if (lat >= -35 && lat <= 37 && lon >= -20 && lon <= 55) {
    if (lat >= -5 && lat <= 15 && lon >= 10 && lon <= 35) return 'Central Africa'
    if (lat >= -35 && lat <= -20) return 'Southern Africa'
    return 'Africa'
  }

  if (lat >= -55 && lat <= 15 && lon >= -80 && lon <= -35) {
    if (lat >= -20 && lat <= 5 && lon >= -75 && lon <= -45) return 'Amazon Basin'
    return 'South America'
  }

  if (lat >= 15 && lat <= 70 && lon >= -170 && lon <= -50) {
    if (lat >= 25 && lat <= 50 && lon >= -105 && lon <= -80) return 'US Midwest'
    if (lat >= 25 && lat <= 35 && lon >= -100 && lon <= -80) return 'Gulf Coast'
    return 'North America'
  }

  if (lat >= 35 && lat <= 70 && lon >= -10 && lon <= 40) {
    return 'Europe'
  }

  if (lat >= 0 && lat <= 55 && lon >= 60 && lon <= 150) {
    if (lat >= 5 && lat <= 25 && lon >= 95 && lon <= 110) return 'Southeast Asia'
    if (lat >= 20 && lat <= 45 && lon >= 100 && lon <= 125) return 'East Asia'
    if (lat >= 5 && lat <= 30 && lon >= 65 && lon <= 90) return 'Indian Subcontinent'
    return 'Asia'
  }

  if (lat >= -50 && lat <= 0 && lon >= 110 && lon <= 180) {
    return 'Australia/Oceania'
  }

  if (lat >= -60 && lat <= 60) {
    if (lon >= -180 && lon <= -100) return 'Pacific Ocean'
    if (lon >= -60 && lon <= 0) return 'Atlantic Ocean'
    if (lon >= 40 && lon <= 100) return 'Indian Ocean'
  }

  return 'Unknown'
}

function findMostActiveRegion(strikes: ProcessedStrike[]): string | null {
  if (strikes.length === 0) return null

  const regionCounts: Record<string, number> = {}

  for (const strike of strikes) {
    const region = detectRegion(strike.lat, strike.lon)
    regionCounts[region] = (regionCounts[region] || 0) + 1
  }

  let maxRegion = null
  let maxCount = 0

  for (const [region, count] of Object.entries(regionCounts)) {
    if (count > maxCount && region !== 'Unknown') {
      maxCount = count
      maxRegion = region
    }
  }

  return maxRegion
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

async function fetchLightningData(): Promise<LightningResponse> {
  const regions = [0, 1, 2, 3, 4, 5]
  const allStrikes: ProcessedStrike[] = []
  let successfulFetches = 0

  const fetchPromises = regions.map(async (region) => {
    try {
      const url = `https://data.blitzortung.org/Protected/strikes_${region}.json`

      const response = await fetchWithTimeout(
        url,
        {
          headers: {
            'User-Agent': 'MXWLL-Observatory/1.0 (https://mxwll.io)',
          },
        },
        FETCH_TIMEOUT
      )

      if (!response.ok) {
        console.warn(`Blitzortung region ${region} returned ${response.status}`)
        return []
      }

      const data = await response.json()
      successfulFetches++
      return data
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.warn(`Blitzortung region ${region} timed out`)
      } else {
        console.warn(`Failed to fetch Blitzortung region ${region}:`, err)
      }
      return []
    }
  })

  const regionData = await Promise.all(fetchPromises)

  if (successfulFetches === 0) {
    throw new Error('All Blitzortung fetches failed')
  }

  const now = Date.now()
  const tenMinutesAgo = now - (10 * 60 * 1000)

  for (const strikes of regionData) {
    for (const strike of strikes) {
      const timeMs = Math.floor(strike.time / 1000000)
      if (timeMs < tenMinutesAgo) continue

      allStrikes.push({
        id: `${strike.lat.toFixed(4)}-${strike.lon.toFixed(4)}-${timeMs}`,
        time: timeMs,
        lat: strike.lat,
        lon: strike.lon,
        polarity: strike.pol === 1 ? 'positive' : 'negative',
        stations: strike.mds || 0
      })
    }
  }

  allStrikes.sort((a, b) => b.time - a.time)
  const limitedStrikes = allStrikes.slice(0, 1000)

  const oneMinuteAgo = now - (60 * 1000)
  const recentStrikes = allStrikes.filter(s => s.time >= oneMinuteAgo)
  const strikesPerMinute = recentStrikes.length

  const positiveStrikes = limitedStrikes.filter(s => s.polarity === 'positive')
  const positivePercent = limitedStrikes.length > 0
    ? Math.round((positiveStrikes.length / limitedStrikes.length) * 100)
    : 0

  const mostActiveRegion = findMostActiveRegion(limitedStrikes)

  return {
    strikes: limitedStrikes,
    stats: {
      total: allStrikes.length,
      strikesPerMinute,
      positivePercent,
      mostActiveRegion
    },
    timestamp: now
  }
}

export async function GET() {
  try {
    const { data, cacheStatus } = await cachedFetch({
      key: 'lightning',
      ttl: TTL.REALTIME, // 30 seconds
      fetcher: fetchLightningData,
    })

    return NextResponse.json(
      { ...data, cached: cacheStatus === 'HIT', stale: cacheStatus === 'STALE' },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
          'X-Cache': cacheStatus
        }
      }
    )

  } catch (error) {
    console.error('Lightning API error:', error)

    return NextResponse.json({
      strikes: [],
      stats: {
        total: 0,
        strikesPerMinute: 0,
        positivePercent: 0,
        mostActiveRegion: null
      },
      timestamp: Date.now(),
      error: 'Service temporarily unavailable'
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30'
      }
    })
  }
}
