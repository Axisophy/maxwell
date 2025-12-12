import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { cachedFetch, TTL } from '@/lib/cache'

// ===========================================
// AIR QUALITY API ROUTE
// ===========================================
// Proxies OpenAQ v3 API with Vercel KV caching
// Cache TTL: 5 minutes (air quality doesn't change rapidly)
// ===========================================

interface AirQualityResponse {
  location: {
    name: string
    city: string
    country: string
    coordinates: { latitude: number; longitude: number }
  }
  aqi: number
  pm25: number
  category: {
    level: string
    color: string
  }
  pollutants: {
    parameter: string
    displayName: string
    value: number
    unit: string
    whoGuideline: number
    exceedsWho: boolean
  }[]
  lastUpdated: string
}

// Pollutant info with WHO guidelines (2021)
const POLLUTANT_INFO: Record<string, { displayName: string; whoGuideline: number }> = {
  pm25: { displayName: 'PM2.5', whoGuideline: 15 },
  pm10: { displayName: 'PM10', whoGuideline: 45 },
  no2: { displayName: 'NO₂', whoGuideline: 25 },
  o3: { displayName: 'O₃', whoGuideline: 100 },
  so2: { displayName: 'SO₂', whoGuideline: 40 },
  co: { displayName: 'CO', whoGuideline: 4000 },
}

// Convert PM2.5 to AQI (US EPA scale, simplified)
function pm25ToAQI(pm25: number): number {
  if (pm25 <= 12) return Math.round((50 / 12) * pm25)
  if (pm25 <= 35.4) return Math.round(50 + ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1))
  if (pm25 <= 55.4) return Math.round(100 + ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5))
  if (pm25 <= 150.4) return Math.round(150 + ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5))
  if (pm25 <= 250.4) return Math.round(200 + ((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5))
  return Math.round(300 + ((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5))
}

// Get AQI category from PM2.5 value
function getAQICategory(pm25: number): { level: string; color: string } {
  if (pm25 <= 12) return { level: 'Good', color: '#22c55e' }
  if (pm25 <= 35.4) return { level: 'Moderate', color: '#eab308' }
  if (pm25 <= 55.4) return { level: 'Unhealthy (Sensitive)', color: '#f97316' }
  if (pm25 <= 150.4) return { level: 'Unhealthy', color: '#ef4444' }
  if (pm25 <= 250.4) return { level: 'Very Unhealthy', color: '#7c3aed' }
  return { level: 'Hazardous', color: '#7f1d1d' }
}

// Generate cache key from coordinates (rounded to 2 decimal places ~1km precision)
function getCacheKey(lat: number, lon: number): string {
  return `air-quality:${lat.toFixed(2)},${lon.toFixed(2)}`
}

async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityResponse> {
  // OpenAQ v3 API - find nearest location with recent data
  const url = new URL('https://api.openaq.org/v3/locations')
  url.searchParams.set('coordinates', `${lat},${lon}`)
  url.searchParams.set('radius', '25000') // 25km radius
  url.searchParams.set('limit', '1')
  url.searchParams.set('order_by', 'distance')

  const response = await fetchWithTimeout(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'X-API-Key': process.env.OPENAQ_API_KEY || '',
    },
  })

  if (!response.ok) {
    throw new Error(`OpenAQ API error: ${response.status}`)
  }

  const data = await response.json()

  if (!data.results || data.results.length === 0) {
    throw new Error('No air quality stations found nearby')
  }

  const location = data.results[0]

  // Fetch latest measurements for this location
  const latestUrl = `https://api.openaq.org/v3/locations/${location.id}/latest`
  const latestResponse = await fetchWithTimeout(latestUrl, {
    headers: {
      'Accept': 'application/json',
      'X-API-Key': process.env.OPENAQ_API_KEY || '',
    },
  })

  if (!latestResponse.ok) {
    throw new Error(`OpenAQ latest API error: ${latestResponse.status}`)
  }

  const latestData = await latestResponse.json()
  const measurements = latestData.results || []

  // Find PM2.5 for AQI calculation
  const pm25Reading = measurements.find(
    (m: any) => m.parameter?.name?.toLowerCase() === 'pm25' || m.parameter?.id === 2
  )
  const pm25Value = pm25Reading?.value || 0

  // Build pollutants array
  const pollutants = measurements
    .filter((m: any) => {
      const param = m.parameter?.name?.toLowerCase() || ''
      return ['pm25', 'pm10', 'no2', 'o3', 'so2', 'co'].includes(param)
    })
    .map((m: any) => {
      const param = m.parameter?.name?.toLowerCase() || ''
      const info = POLLUTANT_INFO[param] || { displayName: param, whoGuideline: 100 }
      return {
        parameter: param,
        displayName: info.displayName,
        value: m.value,
        unit: m.unit?.name || 'μg/m³',
        whoGuideline: info.whoGuideline,
        exceedsWho: m.value > info.whoGuideline,
      }
    })

  return {
    location: {
      name: location.name,
      city: location.locality || location.name,
      country: location.country?.code || 'GB',
      coordinates: {
        latitude: location.coordinates?.latitude || lat,
        longitude: location.coordinates?.longitude || lon,
      },
    },
    aqi: pm25ToAQI(pm25Value),
    pm25: pm25Value,
    category: getAQICategory(pm25Value),
    pollutants,
    lastUpdated: pm25Reading?.datetime?.utc || new Date().toISOString(),
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Get coordinates - default to London if not provided
  const lat = parseFloat(searchParams.get('lat') || '51.5074')
  const lon = parseFloat(searchParams.get('lon') || '-0.1278')

  // Validate coordinate bounds
  if (isNaN(lat) || lat < -90 || lat > 90) {
    return NextResponse.json(
      { error: 'Invalid latitude. Must be between -90 and 90.' },
      { status: 400 }
    )
  }
  if (isNaN(lon) || lon < -180 || lon > 180) {
    return NextResponse.json(
      { error: 'Invalid longitude. Must be between -180 and 180.' },
      { status: 400 }
    )
  }

  try {
    const { data, cacheStatus, cacheAge } = await cachedFetch({
      key: getCacheKey(lat, lon),
      ttl: TTL.MODERATE, // 5 minutes
      fetcher: () => fetchAirQuality(lat, lon),
    })

    const headers: Record<string, string> = { 'X-Cache': cacheStatus }
    if (cacheAge !== undefined) {
      headers['X-Cache-Age'] = String(cacheAge)
    }

    return NextResponse.json(data, { headers })

  } catch (error) {
    console.error('Air quality API error:', error)

    // Check if it's a "no stations" error
    if (error instanceof Error && error.message.includes('No air quality stations')) {
      return NextResponse.json(
        { error: 'No air quality stations found nearby' },
        { status: 404 }
      )
    }

    // Return fallback data for demo purposes
    const fallback: AirQualityResponse = {
      location: {
        name: 'London',
        city: 'London',
        country: 'GB',
        coordinates: { latitude: lat, longitude: lon },
      },
      aqi: 42,
      pm25: 10.2,
      category: { level: 'Good', color: '#22c55e' },
      pollutants: [
        { parameter: 'pm25', displayName: 'PM2.5', value: 10.2, unit: 'μg/m³', whoGuideline: 15, exceedsWho: false },
        { parameter: 'pm10', displayName: 'PM10', value: 18.5, unit: 'μg/m³', whoGuideline: 45, exceedsWho: false },
        { parameter: 'no2', displayName: 'NO₂', value: 22.1, unit: 'μg/m³', whoGuideline: 25, exceedsWho: false },
        { parameter: 'o3', displayName: 'O₃', value: 45.0, unit: 'μg/m³', whoGuideline: 100, exceedsWho: false },
      ],
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(fallback, {
      headers: { 'X-Cache': 'FALLBACK' },
    })
  }
}
