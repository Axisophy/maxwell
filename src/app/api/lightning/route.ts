import { NextResponse } from 'next/server'

// ===========================================
// LIGHTNING LIVE API
// ===========================================
// Fetches recent lightning strike data from Blitzortung
// Returns strikes from the last ~10 minutes with statistics
// 
// Reliability features:
// - In-memory cache with TTL for fallback
// - Fetch timeouts to prevent hanging
// - Stale data served if source is unavailable
// - Graceful degradation on errors
// ===========================================

interface BlitzortungStrike {
  time: number      // Unix timestamp in nanoseconds
  lat: number       // Latitude
  lon: number       // Longitude
  alt?: number      // Altitude (usually 0)
  pol?: number      // Polarity (0 = negative, 1 = positive)
  mds?: number      // Number of detecting stations
  mcg?: number      // Number of stations used for calculation
}

interface ProcessedStrike {
  id: string
  time: number      // Unix timestamp in milliseconds
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
  cached?: boolean
  stale?: boolean
}

// ===========================================
// IN-MEMORY CACHE
// ===========================================
// Stores last successful response as fallback
// Note: In serverless, this cache is per-instance and 
// will reset on cold starts. For production, consider
// Redis or similar for shared cache.

interface CacheEntry {
  data: LightningResponse
  timestamp: number
}

const CACHE_TTL = 15 * 1000        // 15 seconds - serve fresh from cache
const STALE_TTL = 5 * 60 * 1000   // 5 minutes - serve stale if source down
const FETCH_TIMEOUT = 8000         // 8 second timeout per request

let cache: CacheEntry | null = null

function getCachedData(): { data: LightningResponse; isStale: boolean } | null {
  if (!cache) return null
  
  const age = Date.now() - cache.timestamp
  
  if (age < STALE_TTL) {
    return {
      data: cache.data,
      isStale: age > CACHE_TTL
    }
  }
  
  // Cache too old, don't use
  return null
}

function setCachedData(data: LightningResponse): void {
  cache = {
    data,
    timestamp: Date.now()
  }
}

// ===========================================
// FETCH WITH TIMEOUT
// ===========================================

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

// Region detection based on coordinates
function detectRegion(lat: number, lon: number): string {
  // Africa
  if (lat >= -35 && lat <= 37 && lon >= -20 && lon <= 55) {
    if (lat >= -5 && lat <= 15 && lon >= 10 && lon <= 35) return 'Central Africa'
    if (lat >= -35 && lat <= -20) return 'Southern Africa'
    return 'Africa'
  }
  
  // South America
  if (lat >= -55 && lat <= 15 && lon >= -80 && lon <= -35) {
    if (lat >= -20 && lat <= 5 && lon >= -75 && lon <= -45) return 'Amazon Basin'
    return 'South America'
  }
  
  // North America
  if (lat >= 15 && lat <= 70 && lon >= -170 && lon <= -50) {
    if (lat >= 25 && lat <= 50 && lon >= -105 && lon <= -80) return 'US Midwest'
    if (lat >= 25 && lat <= 35 && lon >= -100 && lon <= -80) return 'Gulf Coast'
    return 'North America'
  }
  
  // Europe
  if (lat >= 35 && lat <= 70 && lon >= -10 && lon <= 40) {
    return 'Europe'
  }
  
  // Asia
  if (lat >= 0 && lat <= 55 && lon >= 60 && lon <= 150) {
    if (lat >= 5 && lat <= 25 && lon >= 95 && lon <= 110) return 'Southeast Asia'
    if (lat >= 20 && lat <= 45 && lon >= 100 && lon <= 125) return 'East Asia'
    if (lat >= 5 && lat <= 30 && lon >= 65 && lon <= 90) return 'Indian Subcontinent'
    return 'Asia'
  }
  
  // Australia/Oceania
  if (lat >= -50 && lat <= 0 && lon >= 110 && lon <= 180) {
    return 'Australia/Oceania'
  }
  
  // Maritime/Ocean
  if (lat >= -60 && lat <= 60) {
    if (lon >= -180 && lon <= -100) return 'Pacific Ocean'
    if (lon >= -60 && lon <= 0) return 'Atlantic Ocean'
    if (lon >= 40 && lon <= 100) return 'Indian Ocean'
  }
  
  return 'Unknown'
}

// Find most active region from strikes
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

export async function GET() {
  const requestStart = Date.now()
  
  try {
    // Check if we have fresh cached data
    const cached = getCachedData()
    if (cached && !cached.isStale) {
      return NextResponse.json(
        { ...cached.data, cached: true },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
            'X-Cache': 'HIT'
          }
        }
      )
    }
    
    // Blitzortung provides regional JSON files
    // We'll fetch from multiple regions and combine
    const regions = [0, 1, 2, 3, 4, 5]
    const allStrikes: ProcessedStrike[] = []
    let successfulFetches = 0
    
    // Fetch from all regions in parallel with timeout
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
        
        const data: BlitzortungStrike[] = await response.json()
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
    
    // If all fetches failed, try to serve stale cache
    if (successfulFetches === 0) {
      console.warn('All Blitzortung fetches failed')
      
      if (cached) {
        console.log('Serving stale cache')
        return NextResponse.json(
          { ...cached.data, cached: true, stale: true },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=60',
              'X-Cache': 'STALE'
            }
          }
        )
      }
      
      // No cache available, return empty
      return NextResponse.json({
        strikes: [],
        stats: {
          total: 0,
          strikesPerMinute: 0,
          positivePercent: 0,
          mostActiveRegion: null
        },
        timestamp: Date.now(),
        error: 'Data source temporarily unavailable'
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=30'
        }
      })
    }
    
    // Current time for filtering
    const now = Date.now()
    const tenMinutesAgo = now - (10 * 60 * 1000)
    
    // Process and combine all strikes
    for (const strikes of regionData) {
      for (const strike of strikes) {
        // Blitzortung time is in nanoseconds, convert to milliseconds
        const timeMs = Math.floor(strike.time / 1000000)
        
        // Only include strikes from last 10 minutes
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
    
    // Sort by time (newest first)
    allStrikes.sort((a, b) => b.time - a.time)
    
    // Limit to most recent 1000 strikes for performance
    const limitedStrikes = allStrikes.slice(0, 1000)
    
    // Calculate statistics
    const oneMinuteAgo = now - (60 * 1000)
    const recentStrikes = allStrikes.filter(s => s.time >= oneMinuteAgo)
    const strikesPerMinute = recentStrikes.length
    
    const positiveStrikes = limitedStrikes.filter(s => s.polarity === 'positive')
    const positivePercent = limitedStrikes.length > 0 
      ? Math.round((positiveStrikes.length / limitedStrikes.length) * 100)
      : 0
    
    const mostActiveRegion = findMostActiveRegion(limitedStrikes)
    
    const response: LightningResponse = {
      strikes: limitedStrikes,
      stats: {
        total: allStrikes.length,
        strikesPerMinute,
        positivePercent,
        mostActiveRegion
      },
      timestamp: now
    }
    
    // Update cache with fresh data
    setCachedData(response)
    
    const processingTime = Date.now() - requestStart
    console.log(`Lightning API: ${allStrikes.length} strikes from ${successfulFetches}/6 regions in ${processingTime}ms`)
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        'X-Cache': 'MISS',
        'X-Processing-Time': `${processingTime}ms`
      }
    })
    
  } catch (error) {
    console.error('Lightning API error:', error)
    
    // Try to serve stale cache on error
    const cached = getCachedData()
    if (cached) {
      return NextResponse.json(
        { ...cached.data, cached: true, stale: true },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=60',
            'X-Cache': 'ERROR-STALE'
          }
        }
      )
    }
    
    // Return empty data rather than error to keep widget functional
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