import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { cachedFetch, TTL } from '@/lib/cache'

// ===========================================
// AURORA FORECAST API ROUTE
// ===========================================
// Fetches Kp index data from NOAA SWPC
// Cache TTL: 5 minutes
// ===========================================

interface AuroraResponse {
  current: {
    kp: number
    status: string
  }
  forecast: {
    tonight: number
    tomorrow: number
  }
  timestamp: string
}

const NOAA_KP_FORECAST_URL = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json'

function getKpStatus(kp: number): string {
  if (kp >= 7) return 'Storm'
  if (kp >= 5) return 'Active'
  if (kp >= 4) return 'Elevated'
  if (kp >= 3) return 'Unsettled'
  return 'Quiet'
}

async function fetchAuroraData(): Promise<AuroraResponse> {
  const response = await fetchWithTimeout(NOAA_KP_FORECAST_URL, { cache: 'no-store' })

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

  return {
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
}

export async function GET() {
  try {
    const { data, cacheStatus, cacheAge } = await cachedFetch({
      key: 'aurora',
      ttl: TTL.MODERATE, // 5 minutes
      fetcher: fetchAuroraData,
    })

    const headers: Record<string, string> = { 'X-Cache': cacheStatus }
    if (cacheAge !== undefined) {
      headers['X-Cache-Age'] = String(cacheAge)
    }

    return NextResponse.json(data, { headers })

  } catch (error) {
    console.error('Aurora API error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch aurora data' },
      { status: 500 }
    )
  }
}
