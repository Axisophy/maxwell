import { NextResponse } from 'next/server'

// NOAA SWPC API endpoints
const NOAA_KP_URL = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'
const NOAA_SOLAR_WIND_URL = 'https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json'
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

export async function GET() {
  try {
    // Fetch all data in parallel
    const [kpResponse, solarWindResponse] = await Promise.all([
      fetch(NOAA_KP_URL, { next: { revalidate: 300 } }),
      fetch(NOAA_SOLAR_WIND_URL, { next: { revalidate: 300 } }),
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

    // Try to get X-ray data (may fail, that's ok)
    let xrayFlux = 'N/A'
    let xrayClass = 'Quiet'
    
    try {
      const xrayResponse = await fetch(NOAA_XRAY_URL, { next: { revalidate: 300 } })
      if (xrayResponse.ok) {
        const xrayData = await xrayResponse.json()
        if (xrayData && xrayData.length > 0) {
          const latest = xrayData[0]
          xrayClass = latest.max_class || 'A'
          xrayFlux = latest.max_class || 'A-class'
        }
      }
    } catch {
      // X-ray data optional
    }

    // Try to get alerts
    let alerts: string[] = []
    try {
      const alertsResponse = await fetch(NOAA_ALERTS_URL, { next: { revalidate: 300 } })
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

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching space weather data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch space weather data' },
      { status: 500 }
    )
  }
}
