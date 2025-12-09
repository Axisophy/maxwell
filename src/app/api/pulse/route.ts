import { NextResponse } from 'next/server'

// ===========================================
// THE PULSE API ROUTE
// ===========================================
// Aggregates live data from multiple sources
// Cache TTL: 5 minutes
// ===========================================

interface CacheEntry {
  data: PulseData
  timestamp: number
}

interface PulseData {
  earthquakes: {
    count: number
    significant: { mag: number; place: string; time: number }[]
    daily: number[]
  }
  co2: {
    current: number
    trend: number[]
  }
  solar: {
    status: string
    kp: number
    kpHistory: number[]
  }
  iss: {
    lat: number
    lng: number
    region: string
  }
  launches: { name: string; net: string; rocket: string }[]
  uv: { index: number; level: string }
}

// Server-side cache
let cache: CacheEntry | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function getRegionFromCoords(lat: number, lng: number): string {
  // Polar regions
  if (lat > 66) return 'Arctic'
  if (lat < -66) return 'Antarctic'
  
  // Continents (rough bounds)
  if (lat > 25 && lat < 72 && lng > -170 && lng < -50) return 'North America'
  if (lat > -56 && lat < 12 && lng > -82 && lng < -34) return 'South America'
  if (lat > 36 && lat < 71 && lng > -11 && lng < 40) return 'Europe'
  if (lat > -35 && lat < 37 && lng > -18 && lng < 52) return 'Africa'
  if (lat > 5 && lat < 78 && lng > 26 && lng < 180) return 'Asia'
  if (lat > 5 && lat < 55 && lng > 60 && lng < 150) return 'Asia'
  if (lat > -47 && lat < -10 && lng > 113 && lng < 154) return 'Australia'
  if (lat > -47 && lat < -34 && lng > 166 && lng < 179) return 'New Zealand'
  
  // Oceans
  if (lng > 100 || lng < -100) {
    return lat > 0 ? 'North Pacific' : 'South Pacific'
  }
  if (lng > -80 && lng < 0) {
    return lat > 0 ? 'North Atlantic' : 'South Atlantic'
  }
  if (lng > 20 && lng < 100 && lat < 30 && lat > -40) {
    return 'Indian Ocean'
  }
  
  return 'Pacific'
}

function getSolarStatusText(kp: number): string {
  if (kp >= 7) return 'Storm'
  if (kp >= 5) return 'Active'
  if (kp >= 4) return 'Unsettled'
  if (kp >= 2) return 'Low'
  return 'Quiet'
}

function getUVLevel(index: number): string {
  if (index <= 2) return 'Low'
  if (index <= 5) return 'Moderate'
  if (index <= 7) return 'High'
  if (index <= 10) return 'Very High'
  return 'Extreme'
}

// ===========================================
// DATA FETCHERS
// ===========================================

async function fetchEarthquakes(): Promise<PulseData['earthquakes']> {
  const defaultData = { count: 0, significant: [], daily: [] }
  
  try {
    const response = await fetch(
      'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=4&limit=500',
      { cache: 'no-store' }
    )
    
    if (!response.ok) return defaultData
    
    const data = await response.json()
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000
    
    const recentQuakes = data.features.filter(
      (f: any) => f.properties.time > oneDayAgo
    )
    
    const significant = recentQuakes
      .filter((f: any) => f.properties.mag >= 5)
      .slice(0, 5)
      .map((f: any) => ({
        mag: f.properties.mag,
        place: f.properties.place,
        time: f.properties.time,
      }))
    
    // Daily counts for last 7 days
    const daily: number[] = []
    for (let i = 6; i >= 0; i--) {
      const dayStart = now - (i + 1) * 24 * 60 * 60 * 1000
      const dayEnd = now - i * 24 * 60 * 60 * 1000
      const count = data.features.filter(
        (f: any) => f.properties.time >= dayStart && f.properties.time < dayEnd
      ).length
      daily.push(count)
    }
    
    return { count: recentQuakes.length, significant, daily }
  } catch {
    return defaultData
  }
}

async function fetchSolarData(): Promise<PulseData['solar']> {
  const defaultData = { status: 'Low', kp: 2, kpHistory: [] }
  
  try {
    const response = await fetch(
      'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
      { cache: 'no-store' }
    )
    
    if (!response.ok) return defaultData
    
    const data = await response.json()
    const kpValues = data.slice(1).map((row: any) => parseFloat(row[1]) || 0)
    const latestKp = kpValues[kpValues.length - 1] || 2
    
    return {
      kp: Math.round(latestKp),
      status: getSolarStatusText(latestKp),
      kpHistory: kpValues.slice(-24),
    }
  } catch {
    return defaultData
  }
}

async function fetchISSPosition(): Promise<PulseData['iss']> {
  const defaultData = { lat: 0, lng: 0, region: 'Tracking...' }
  
  try {
    // Use Where The ISS At API - more reliable than Open Notify
    const response = await fetch(
      'https://api.wheretheiss.at/v1/satellites/25544',
      { cache: 'no-store' }
    )
    
    if (!response.ok) {
      // Fallback to Open Notify
      const fallbackResponse = await fetch(
        'http://api.open-notify.org/iss-now.json',
        { cache: 'no-store' }
      )
      
      if (!fallbackResponse.ok) return defaultData
      
      const fallbackData = await fallbackResponse.json()
      const lat = parseFloat(fallbackData.iss_position.latitude)
      const lng = parseFloat(fallbackData.iss_position.longitude)
      
      return { lat, lng, region: getRegionFromCoords(lat, lng) }
    }
    
    const data = await response.json()
    const lat = data.latitude
    const lng = data.longitude
    
    return { lat, lng, region: getRegionFromCoords(lat, lng) }
  } catch {
    return defaultData
  }
}

async function fetchLaunches(): Promise<PulseData['launches']> {
  try {
    const response = await fetch(
      'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=3',
      { cache: 'no-store' }
    )
    
    if (!response.ok) return []
    
    const data = await response.json()
    return (data.results || []).slice(0, 3).map((l: any) => ({
      name: l.name,
      net: l.net,
      rocket: l.rocket?.configuration?.name || 'Rocket',
    }))
  } catch {
    return []
  }
}

async function fetchUV(): Promise<PulseData['uv']> {
  const defaultData = { index: 0, level: 'Low' }
  
  try {
    // Default to London coords - could be made location-aware
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current=uv_index',
      { cache: 'no-store' }
    )
    
    if (!response.ok) return defaultData
    
    const data = await response.json()
    const uvIndex = Math.round(data.current?.uv_index || 0)
    
    return { index: uvIndex, level: getUVLevel(uvIndex) }
  } catch {
    return defaultData
  }
}

// ===========================================
// MAIN HANDLER
// ===========================================

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
    const [earthquakes, solar, iss, launches, uv] = await Promise.all([
      fetchEarthquakes(),
      fetchSolarData(),
      fetchISSPosition(),
      fetchLaunches(),
      fetchUV(),
    ])

    // Generate CO2 trend (placeholder - real data is in /api/co2)
    const base = 420
    const co2Trend: number[] = []
    for (let i = 0; i < 30; i++) {
      const seasonal = Math.sin((i / 30) * Math.PI * 2) * 3
      const upward = (i / 30) * 2
      co2Trend.push(base + seasonal + upward + Math.random() * 0.5)
    }

    const data: PulseData = {
      earthquakes,
      co2: {
        current: co2Trend[co2Trend.length - 1],
        trend: co2Trend,
      },
      solar,
      iss,
      launches,
      uv,
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
    console.error('Pulse API error:', error)

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
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}