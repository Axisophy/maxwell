import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { cachedFetch, TTL } from '@/lib/cache'

// ===========================================
// SOLAR API ROUTE
// ===========================================
// Comprehensive solar data from NOAA SWPC with caching
// Cache TTL: 1 minute (realtime data)
// ===========================================

// NOAA SWPC API endpoints
const ENDPOINTS = {
  // Current summary data
  kp: 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
  kpForecast: 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json',
  solarWind: 'https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json',
  magField: 'https://services.swpc.noaa.gov/products/summary/solar-wind-mag-field.json',
  xrayFlares: 'https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json',

  // 7-day historical data for charts
  plasma7Day: 'https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json',
  mag7Day: 'https://services.swpc.noaa.gov/products/solar-wind/mag-7-day.json',

  // Aurora ovation
  aurora: 'https://services.swpc.noaa.gov/json/ovation_aurora_latest.json',
}

interface SolarData {
  kp: {
    current: number
    status: string
    forecast: Array<{
      time: string
      value: number
      type: 'observed' | 'estimated' | 'predicted'
      scale: string | null
    }>
    recent: Array<{ time: string; value: number }>
  }
  solarWind: {
    speed: number
    density: number
    bz: number
    bt: number
    bzStatus: 'north' | 'south' | 'neutral'
  }
  xray: {
    flux: string
    class: string
    peakTime: string | null
  }
  aurora: {
    maxNorth: number
    maxSouth: number
    forecastTime: string | null
    visibilityLatitude: number | null
  }
  charts: {
    solarWind: Array<{ time: string; speed: number; density: number }>
    bz: Array<{ time: string; bz: number; bt: number }>
    kp: Array<{ time: string; kp: number }>
  }
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

function getBzStatus(bz: number): 'north' | 'south' | 'neutral' {
  if (bz > 2) return 'north'
  if (bz < -2) return 'south'
  return 'neutral'
}

// Calculate aurora visibility latitude from Kp
function getAuroraVisibilityLatitude(kp: number): number {
  // Approximate relationship between Kp and equatorward auroral boundary
  // Based on NOAA's auroral oval model
  if (kp >= 9) return 40
  if (kp >= 8) return 45
  if (kp >= 7) return 50
  if (kp >= 6) return 52
  if (kp >= 5) return 55
  if (kp >= 4) return 58
  if (kp >= 3) return 62
  if (kp >= 2) return 65
  return 68
}

async function fetchSolarData(): Promise<SolarData> {
  // Fetch all data in parallel
  const [
    kpResponse,
    kpForecastResponse,
    solarWindResponse,
    magFieldResponse,
    xrayResponse,
    plasma7DayResponse,
    mag7DayResponse,
    auroraResponse,
  ] = await Promise.all([
    fetchWithTimeout(ENDPOINTS.kp, { cache: 'no-store' }).catch(() => null),
    fetchWithTimeout(ENDPOINTS.kpForecast, { cache: 'no-store' }).catch(() => null),
    fetchWithTimeout(ENDPOINTS.solarWind, { cache: 'no-store' }).catch(() => null),
    fetchWithTimeout(ENDPOINTS.magField, { cache: 'no-store' }).catch(() => null),
    fetchWithTimeout(ENDPOINTS.xrayFlares, { cache: 'no-store' }).catch(() => null),
    fetchWithTimeout(ENDPOINTS.plasma7Day, { cache: 'no-store' }).catch(() => null),
    fetchWithTimeout(ENDPOINTS.mag7Day, { cache: 'no-store' }).catch(() => null),
    fetchWithTimeout(ENDPOINTS.aurora, { cache: 'no-store' }).catch(() => null),
  ])

  // Parse Kp data
  let kpCurrent = 0
  let kpRecent: Array<{ time: string; value: number }> = []

  if (kpResponse?.ok) {
    try {
      const kpData = await kpResponse.json()
      const kpValues = kpData.slice(1) // Skip header
      if (kpValues.length > 0) {
        const latest = kpValues[kpValues.length - 1]
        kpCurrent = parseFloat(latest[1]) || 0
        kpRecent = kpValues.slice(-24).map((row: string[]) => ({
          time: row[0],
          value: parseFloat(row[1]) || 0,
        }))
      }
    } catch {
      // Kp parsing failed
    }
  }

  // Parse Kp forecast
  let kpForecast: SolarData['kp']['forecast'] = []
  if (kpForecastResponse?.ok) {
    try {
      const forecastData = await kpForecastResponse.json()
      kpForecast = forecastData.slice(1).map((row: string[]) => ({
        time: row[0],
        value: parseFloat(row[1]) || 0,
        type: row[2] as 'observed' | 'estimated' | 'predicted',
        scale: row[3] || null,
      }))
    } catch {
      // Forecast parsing failed
    }
  }

  // Parse solar wind speed
  let solarWindSpeed = 0
  if (solarWindResponse?.ok) {
    try {
      const windData = await solarWindResponse.json()
      solarWindSpeed = parseFloat(windData.WindSpeed) || 0
    } catch {
      // Wind parsing failed
    }
  }

  // Parse magnetic field (Bz/Bt)
  let bz = 0
  let bt = 0
  if (magFieldResponse?.ok) {
    try {
      const magData = await magFieldResponse.json()
      bz = parseFloat(magData.Bz) || 0
      bt = parseFloat(magData.Bt) || 0
    } catch {
      // Mag field parsing failed
    }
  }

  // Parse 7-day plasma data for density and chart
  let solarWindDensity = 0
  let solarWindChart: SolarData['charts']['solarWind'] = []
  if (plasma7DayResponse?.ok) {
    try {
      const plasmaData = await plasma7DayResponse.json()
      const rows = plasmaData.slice(1) // Skip header

      // Get latest density
      for (let i = rows.length - 1; i > 0; i--) {
        const density = parseFloat(rows[i][1])
        if (!isNaN(density) && density > 0) {
          solarWindDensity = density
          break
        }
      }

      // Sample last 24 hours for chart (every 30 min = ~48 points)
      const last24h = rows.slice(-288) // ~24h of 5-min data
      solarWindChart = last24h
        .filter((_: string[], i: number) => i % 6 === 0) // Sample every 30 min
        .map((row: string[]) => ({
          time: row[0],
          speed: parseFloat(row[2]) || 0,
          density: parseFloat(row[1]) || 0,
        }))
    } catch {
      // Plasma parsing failed
    }
  }

  // Parse 7-day mag data for Bz chart
  let bzChart: SolarData['charts']['bz'] = []
  if (mag7DayResponse?.ok) {
    try {
      const magData = await mag7DayResponse.json()
      const rows = magData.slice(1) // Skip header

      // Sample last 24 hours for chart
      const last24h = rows.slice(-288)
      bzChart = last24h
        .filter((_: string[], i: number) => i % 6 === 0) // Sample every 30 min
        .map((row: string[]) => ({
          time: row[0],
          bz: parseFloat(row[3]) || 0, // bz_gsm is column 3
          bt: parseFloat(row[6]) || 0, // bt is column 6
        }))
    } catch {
      // Mag parsing failed
    }
  }

  // Parse X-ray flares
  let xrayFlux = 'N/A'
  let xrayClass = 'Quiet'
  let xrayPeakTime: string | null = null
  if (xrayResponse?.ok) {
    try {
      const xrayData = await xrayResponse.json()
      if (xrayData && xrayData.length > 0) {
        const latest = xrayData[0]
        xrayClass = latest.max_class || 'A'
        xrayFlux = latest.max_xrlong ? latest.max_xrlong.toExponential(2) : 'N/A'
        xrayPeakTime = latest.max_time || null
      }
    } catch {
      // X-ray parsing failed
    }
  }

  // Parse aurora data
  let maxNorthAurora = 0
  let maxSouthAurora = 0
  let auroraForecastTime: string | null = null
  if (auroraResponse?.ok) {
    try {
      const auroraData = await auroraResponse.json()
      auroraForecastTime = auroraData['Forecast Time'] || null

      // Calculate max aurora intensity for northern and southern hemispheres
      const coords = auroraData.coordinates || []
      for (const [_lon, lat, intensity] of coords) {
        if (lat > 0 && intensity > maxNorthAurora) {
          maxNorthAurora = intensity
        }
        if (lat < 0 && intensity > maxSouthAurora) {
          maxSouthAurora = intensity
        }
      }
    } catch {
      // Aurora parsing failed
    }
  }

  // Create Kp chart from forecast data (has both observed and predicted)
  const kpChart = kpForecast.slice(-48).map((item) => ({
    time: item.time,
    kp: item.value,
  }))

  return {
    kp: {
      current: kpCurrent,
      status: getKpStatus(kpCurrent),
      forecast: kpForecast.slice(-24), // Last 24 forecast entries
      recent: kpRecent,
    },
    solarWind: {
      speed: solarWindSpeed,
      density: solarWindDensity,
      bz,
      bt,
      bzStatus: getBzStatus(bz),
    },
    xray: {
      flux: xrayFlux,
      class: xrayClass,
      peakTime: xrayPeakTime,
    },
    aurora: {
      maxNorth: maxNorthAurora,
      maxSouth: maxSouthAurora,
      forecastTime: auroraForecastTime,
      visibilityLatitude: getAuroraVisibilityLatitude(kpCurrent),
    },
    charts: {
      solarWind: solarWindChart,
      bz: bzChart,
      kp: kpChart,
    },
    timestamp: new Date().toISOString(),
  }
}

export async function GET() {
  try {
    const { data, cacheStatus, cacheAge } = await cachedFetch({
      key: 'solar',
      ttl: TTL.FAST, // 1 minute cache
      fetcher: fetchSolarData,
    })

    const headers: Record<string, string> = { 'X-Cache': cacheStatus }
    if (cacheAge !== undefined) {
      headers['X-Cache-Age'] = String(cacheAge)
    }

    return NextResponse.json(data, { headers })

  } catch (error) {
    console.error('Error fetching solar data:', error)

    return NextResponse.json(
      { error: 'Failed to fetch solar data' },
      { status: 500 }
    )
  }
}
