import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { cachedFetch, TTL } from '@/lib/cache'

// ===========================================
// SPACE WEATHER API ROUTE
// ===========================================
// Proxies NOAA SWPC APIs with Vercel KV caching
// Cache TTL: 5 minutes
// ===========================================

// NOAA SWPC API endpoints
const NOAA_KP_URL = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'
const NOAA_SOLAR_WIND_URL = 'https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json'
const NOAA_PLASMA_URL = 'https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json'
const NOAA_XRAY_URL = 'https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json'
const NOAA_ALERTS_URL = 'https://services.swpc.noaa.gov/products/alerts.json'

interface SpaceWeatherData {
  kp: {
    current: number
    status: string
    recent: number[]
  }
  solarWind: {
    speed: number
    density: number
  }
  xray: {
    flux: string
    class: string
  }
  alerts: string[]
  timestamp: string
}

function getKpStatus(kp: number): string {
  if (kp >= 8) return 'Extreme Storm'
  if (kp >= 7) return 'Severe Storm'
  if (kp >= 6) return 'Strong Storm'
  if (kp >= 5) return 'Moderate Storm'
  if (kp >= 4) return 'Active'
  if (kp >= 3) return 'Unsettled'
  if (kp >= 2) return 'Quiet'
  return 'Very Quiet'
}

async function fetchSpaceWeatherData(): Promise<SpaceWeatherData> {
  // Fetch all data in parallel
  const [kpResponse, solarWindResponse, plasmaResponse] = await Promise.all([
    fetchWithTimeout(NOAA_KP_URL, { cache: 'no-store' }),
    fetchWithTimeout(NOAA_SOLAR_WIND_URL, { cache: 'no-store' }),
    fetchWithTimeout(NOAA_PLASMA_URL, { cache: 'no-store' }),
  ])

  // Parse Kp data
  let kpCurrent = 0
  let kpRecent: number[] = []

  if (kpResponse.ok) {
    const kpData = await kpResponse.json()
    const kpValues = kpData.slice(1)
    if (kpValues.length > 0) {
      const latest = kpValues[kpValues.length - 1]
      kpCurrent = parseFloat(latest[1]) || 0
      kpRecent = kpValues.slice(-24).map((row: string[]) => parseFloat(row[1]) || 0)
    }
  }

  // Parse Solar Wind data
  let solarWindSpeed = 0
  let solarWindDensity = 0

  if (solarWindResponse.ok) {
    const windData = await solarWindResponse.json()
    solarWindSpeed = parseFloat(windData.WindSpeed) || 0
  }

  // Parse Plasma data for density
  if (plasmaResponse.ok) {
    const plasmaData = await plasmaResponse.json()
    for (let i = plasmaData.length - 1; i > 0; i--) {
      const density = parseFloat(plasmaData[i][1])
      if (!isNaN(density) && density > 0) {
        solarWindDensity = density
        break
      }
    }
  }

  // Try to get X-ray data
  let xrayFlux = 'N/A'
  let xrayClass = 'Quiet'

  try {
    const xrayResponse = await fetchWithTimeout(NOAA_XRAY_URL, { cache: 'no-store' })
    if (xrayResponse.ok) {
      const xrayData = await xrayResponse.json()
      if (xrayData && xrayData.length > 0) {
        const latest = xrayData[0]
        xrayClass = latest.max_class || 'A'
        xrayFlux = latest.max_xrlong ? latest.max_xrlong.toExponential(2) : 'N/A'
      }
    }
  } catch {
    // X-ray data optional
  }

  // Try to get alerts
  let alerts: string[] = []
  try {
    const alertsResponse = await fetchWithTimeout(NOAA_ALERTS_URL, { cache: 'no-store' })
    if (alertsResponse.ok) {
      const alertsData = await alertsResponse.json()
      alerts = alertsData
        .slice(0, 3)
        .map((a: { message: string }) => {
          const match = a.message?.match(/^(.*?)(issued|Product)/)
          return match ? match[1].trim() : null
        })
        .filter(Boolean)
    }
  } catch {
    // Alerts optional
  }

  return {
    kp: {
      current: kpCurrent,
      status: getKpStatus(kpCurrent),
      recent: kpRecent
    },
    solarWind: {
      speed: solarWindSpeed,
      density: solarWindDensity
    },
    xray: {
      flux: xrayFlux,
      class: xrayClass
    },
    alerts,
    timestamp: new Date().toISOString()
  }
}

export async function GET() {
  try {
    const { data, cacheStatus, cacheAge } = await cachedFetch({
      key: 'space-weather',
      ttl: TTL.MODERATE, // 5 minutes
      fetcher: fetchSpaceWeatherData,
    })

    const headers: Record<string, string> = { 'X-Cache': cacheStatus }
    if (cacheAge !== undefined) {
      headers['X-Cache-Age'] = String(cacheAge)
    }

    return NextResponse.json(data, { headers })

  } catch (error) {
    console.error('Error fetching space weather data:', error)

    return NextResponse.json(
      { error: 'Failed to fetch space weather data' },
      { status: 500 }
    )
  }
}
