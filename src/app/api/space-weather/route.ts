import { NextResponse } from 'next/server'

// ===========================================
// SPACE WEATHER API ROUTE
// ===========================================
// Proxies NOAA SWPC APIs with server-side caching
// Cache TTL: 5 minutes (space weather updates every 3 hours, but we want freshness)
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

interface CacheEntry {
  data: SpaceWeatherData
  timestamp: number
}

// Server-side cache
let cache: CacheEntry | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

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
    // Fetch all data in parallel
    const [kpResponse, solarWindResponse, plasmaResponse] = await Promise.all([
      fetch(NOAA_KP_URL, { cache: 'no-store' }),
      fetch(NOAA_SOLAR_WIND_URL, { cache: 'no-store' }),
      fetch(NOAA_PLASMA_URL, { cache: 'no-store' }),
    ])

    // Parse Kp data
    let kpCurrent = 0
    let kpRecent: number[] = []
    
    if (kpResponse.ok) {
      const kpData = await kpResponse.json()
      // Format: [["time_tag", "Kp", "Kp_fraction", "a_running", "station_count"], ...]
      // Skip header row
      const kpValues = kpData.slice(1)
      if (kpValues.length > 0) {
        // Get latest Kp value
        const latest = kpValues[kpValues.length - 1]
        kpCurrent = parseFloat(latest[1]) || 0
        
        // Get last 24 values (3 days at 8 readings per day)
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

    // Parse Plasma data for density (get latest non-null value)
    if (plasmaResponse.ok) {
      const plasmaData = await plasmaResponse.json()
      // Format: [["time_tag","density","speed","temperature"], ["2025-12-05 10:32:00.000","1.48","627.1","373869"], ...]
      // Skip header row and find latest entry with valid density
      for (let i = plasmaData.length - 1; i > 0; i--) {
        const density = parseFloat(plasmaData[i][1])
        if (!isNaN(density) && density > 0) {
          solarWindDensity = density
          break
        }
      }
    }

    // Try to get X-ray data (may fail, that's ok)
    let xrayFlux = 'N/A'
    let xrayClass = 'Quiet'

    try {
      const xrayResponse = await fetch(NOAA_XRAY_URL, { cache: 'no-store' })
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
      const alertsResponse = await fetch(NOAA_ALERTS_URL, { cache: 'no-store' })
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        // Get last 3 alerts
        alerts = alertsData
          .slice(0, 3)
          .map((a: { message: string }) => {
            // Extract just the product type from the message
            const match = a.message?.match(/^(.*?)(issued|Product)/)
            return match ? match[1].trim() : null
          })
          .filter(Boolean)
      }
    } catch {
      // Alerts optional
    }

    const data: SpaceWeatherData = {
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

    // Update cache
    cache = {
      data,
      timestamp: Date.now(),
    }

    return NextResponse.json(data, {
      headers: { 'X-Cache': 'MISS' },
    })
  } catch (error) {
    console.error('Error fetching space weather data:', error)
    
    // If we have stale cache, return it rather than error
    if (cache) {
      return NextResponse.json(cache.data, {
        headers: {
          'X-Cache': 'STALE',
          'X-Cache-Age': String(Math.round((Date.now() - cache.timestamp) / 1000)),
        },
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch space weather data' },
      { status: 500 }
    )
  }
}