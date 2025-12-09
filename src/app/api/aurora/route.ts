import { NextResponse } from 'next/server'

// ===========================================
// AURORA FORECAST API ROUTE
// ===========================================
// Fetches Kp index data from NOAA SWPC
// Cache TTL: 15 minutes
// ===========================================

interface CacheEntry {
  data: AuroraResponse
  timestamp: number
}

interface AuroraResponse {
  current: {
    kp: number
    status: string
  }
  forecast: {
    tonight: number  // Max Kp expected tonight
    tomorrow: number // Max Kp expected tomorrow
  }
  timestamp: string
}

// Server-side cache
let cache: CacheEntry | null = null
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

const NOAA_KP_FORECAST_URL = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json'

function getKpStatus(kp: number): string {
  if (kp >= 7) return 'Storm'
  if (kp >= 5) return 'Active'
  if (kp >= 4) return 'Elevated'
  if (kp >= 3) return 'Unsettled'
  return 'Quiet'
}

export async function GET() {
  // Check cache first
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: {
        'X-Cache': 'HIT',
        'X-Cache-Age': String(Math.round((Date.now() - cache.timestamp) / 1000)),
      },
    })
  }

  try {
    const response = await fetch(NOAA_KP_FORECAST_URL, { cache: 'no-store' })
    
    if (!response.ok) {
      throw new Error(`NOAA API error: ${response.status}`)
    }

    const rawData = await response.json()
    
    // Parse Kp data - format: [["time_tag", "Kp", "observed/predicted"], ...]
    // Skip header row
    const rows = rawData.slice(1)
    
    // Find current (most recent observed)
    let currentKp = 0
    const observed = rows.filter((row: string[]) => row[2] === 'observed')
    if (observed.length > 0) {
      currentKp = parseFloat(observed[observed.length - 1][1]) || 0
    }
    
    // Get forecast (predicted values)
    const predicted = rows.filter((row: string[]) => row[2] === 'predicted')
    
    // Calculate "tonight" and "tomorrow" max Kp
    // Tonight = next 12 hours, Tomorrow = 12-36 hours
    const now = new Date()
    let tonightMax = currentKp
    let tomorrowMax = 0
    
    predicted.forEach((row: string[]) => {
      const forecastTime = new Date(row[0])
      const hoursAhead = (forecastTime.getTime() - now.getTime()) / (1000 * 60 * 60)
      const kp = parseFloat(row[1]) || 0
      
      if (hoursAhead >= 0 && hoursAhead < 12) {
        tonightMax = Math.max(tonightMax, kp)
      } else if (hoursAhead >= 12 && hoursAhead < 36) {
        tomorrowMax = Math.max(tomorrowMax, kp)
      }
    })

    const data: AuroraResponse = {
      current: {
        kp: currentKp,
        status: getKpStatus(currentKp),
      },
      forecast: {
        tonight: tonightMax,
        tomorrow: tomorrowMax,
      },
      timestamp: new Date().toISOString(),
    }

    // Update cache
    cache = {
      data,
      timestamp: Date.now(),
    }

    return NextResponse.json(data, {
      headers: { 'X-Cache': 'MISS' },
    })

  } catch (error) {
    console.error('Aurora API error:', error)
    
    // Return stale cache if available
    if (cache) {
      return NextResponse.json(cache.data, {
        headers: {
          'X-Cache': 'STALE',
          'X-Cache-Age': String(Math.round((Date.now() - cache.timestamp) / 1000)),
        },
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch aurora data' },
      { status: 500 }
    )
  }
}