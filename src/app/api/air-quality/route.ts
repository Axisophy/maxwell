import { NextResponse } from 'next/server'

// ===========================================
// AIR QUALITY API ROUTE
// ===========================================
// Proxies OpenAQ v3 API with server-side caching
// Cache TTL: 15 minutes (air quality doesn't change rapidly)
// ===========================================

interface CacheEntry {
  data: AirQualityResponse
  timestamp: number
}

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

// Simple in-memory cache
// Key format: "lat,lon" rounded to 2 decimal places (roughly 1km precision)
const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

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

// Generate cache key from coordinates
function getCacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(2)},${lon.toFixed(2)}`
}

// Clean expired cache entries periodically
function cleanCache() {
  const now = Date.now()
  cache.forEach((entry, key) => {
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(key)
    }
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  // Get coordinates - default to London if not provided
  const lat = parseFloat(searchParams.get('lat') || '51.5074')
  const lon = parseFloat(searchParams.get('lon') || '-0.1278')
  
  // Check cache first
  const cacheKey = getCacheKey(lat, lon)
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
    // OpenAQ v3 API - find nearest location with recent data
    const url = new URL('https://api.openaq.org/v3/locations')
    url.searchParams.set('coordinates', `${lat},${lon}`)
    url.searchParams.set('radius', '25000') // 25km radius
    url.searchParams.set('limit', '1')
    url.searchParams.set('order_by', 'distance')
    
    const response = await fetch(url.toString(), {
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
      // No nearby stations - return a meaningful error
      return NextResponse.json(
        { error: 'No air quality stations found nearby' },
        { status: 404 }
      )
    }
    
    const location = data.results[0]
    
    // Fetch latest measurements for this location
    const latestUrl = `https://api.openaq.org/v3/locations/${location.id}/latest`
    const latestResponse = await fetch(latestUrl, {
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
    
    // Build response
    const result: AirQualityResponse = {
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
    
    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() })
    
    // Periodically clean old cache entries
    if (Math.random() < 0.1) cleanCache()
    
    return NextResponse.json(result, {
      headers: { 'X-Cache': 'MISS' },
    })
    
  } catch (error) {
    console.error('Air quality API error:', error)
    
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