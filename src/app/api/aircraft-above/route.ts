import { NextRequest, NextResponse } from 'next/server'

// ===========================================
// AIRCRAFT ABOVE API
// ===========================================
// Data source: OpenSky Network
// https://opensky-network.org/apidoc/
// Free API, no auth required for basic queries
// ===========================================

interface OpenSkyState {
  icao24: string
  callsign: string | null
  origin_country: string
  time_position: number | null
  last_contact: number
  longitude: number | null
  latitude: number | null
  baro_altitude: number | null
  on_ground: boolean
  velocity: number | null
  true_track: number | null
  vertical_rate: number | null
  sensors: number[] | null
  geo_altitude: number | null
  squawk: string | null
  spi: boolean
  position_source: number
}

interface Aircraft {
  icao24: string
  callsign: string
  origin_country: string
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  heading: number
  vertical_rate: number
  on_ground: boolean
  squawk?: string
}

// Simple in-memory cache
let cache: { data: any; timestamp: number; key: string } | null = null
const CACHE_DURATION = 30 * 1000 // 30 seconds

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '51.5074')
  const lon = parseFloat(searchParams.get('lon') || '-0.1278')
  const radius = parseInt(searchParams.get('radius') || '50', 10) // nautical miles

  // Convert radius to degrees (rough approximation)
  // 1 degree latitude ≈ 60 nautical miles
  const radiusDeg = radius / 60

  const cacheKey = `${lat.toFixed(2)}-${lon.toFixed(2)}-${radius}`

  // Check cache
  if (cache && cache.key === cacheKey && Date.now() - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data)
  }

  try {
    // OpenSky Network API
    const lamin = lat - radiusDeg
    const lamax = lat + radiusDeg
    const lomin = lon - radiusDeg
    const lomax = lon + radiusDeg

    const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 30 },
    })

    if (!response.ok) {
      // OpenSky may rate limit - return mock data
      console.warn('OpenSky API error, returning simulated data')
      return NextResponse.json(generateMockData(lat, lon, radius))
    }

    const data = await response.json()

    if (!data.states || data.states.length === 0) {
      const result = {
        timestamp: new Date().toISOString(),
        location: { lat, lon },
        radius,
        count: 0,
        estimatedPassengers: 0,
        aircraft: [],
        stats: {
          highestAltitude: 0,
          lowestAltitude: 0,
          fastestSpeed: 0,
        },
      }
      cache = { data: result, timestamp: Date.now(), key: cacheKey }
      return NextResponse.json(result)
    }

    // Parse OpenSky response
    // State vector format: [icao24, callsign, origin_country, time_position, last_contact,
    //                       longitude, latitude, baro_altitude, on_ground, velocity,
    //                       true_track, vertical_rate, sensors, geo_altitude, squawk, spi, position_source]
    const aircraft: Aircraft[] = data.states
      .filter((state: any[]) => state[6] !== null && state[5] !== null) // Has position
      .map((state: any[]) => ({
        icao24: state[0],
        callsign: state[1]?.trim() || state[0],
        origin_country: state[2],
        latitude: state[6],
        longitude: state[5],
        altitude: state[7] || state[13] || 0, // baro or geo altitude
        velocity: state[9] || 0,
        heading: state[10] || 0,
        vertical_rate: state[11] || 0,
        on_ground: state[8],
        squawk: state[14] || undefined,
      }))

    const airborne = aircraft.filter(a => !a.on_ground && a.altitude > 0)
    const estimatedPassengers = Math.round(airborne.length * 0.7 * 130)

    const result = {
      timestamp: new Date().toISOString(),
      location: { lat, lon },
      radius,
      count: aircraft.length,
      estimatedPassengers,
      aircraft: airborne.sort((a, b) => b.altitude - a.altitude),
      stats: {
        highestAltitude: airborne.length > 0 ? Math.max(...airborne.map(a => a.altitude)) : 0,
        lowestAltitude: airborne.length > 0 ? Math.min(...airborne.map(a => a.altitude)) : 0,
        fastestSpeed: airborne.length > 0 ? Math.max(...airborne.map(a => a.velocity)) : 0,
      },
    }

    cache = { data: result, timestamp: Date.now(), key: cacheKey }
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching aircraft data:', error)
    // Return mock data on error
    return NextResponse.json(generateMockData(lat, lon, radius))
  }
}

// Generate realistic mock data when API is unavailable
function generateMockData(lat: number, lon: number, radius: number) {
  const count = Math.floor(Math.random() * 30) + 20
  const aircraft: Aircraft[] = []

  const airlines = [
    { prefix: 'BA', country: 'United Kingdom' },
    { prefix: 'AF', country: 'France' },
    { prefix: 'LH', country: 'Germany' },
    { prefix: 'AA', country: 'United States' },
    { prefix: 'EK', country: 'United Arab Emirates' },
    { prefix: 'QF', country: 'Australia' },
    { prefix: 'RY', country: 'Ireland' },
    { prefix: 'EZY', country: 'United Kingdom' },
  ]

  for (let i = 0; i < count; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const flightNum = Math.floor(Math.random() * 9000) + 100

    aircraft.push({
      icao24: Math.random().toString(16).substr(2, 6),
      callsign: `${airline.prefix}${flightNum}`,
      origin_country: airline.country,
      latitude: lat + (Math.random() - 0.5) * (radius / 30),
      longitude: lon + (Math.random() - 0.5) * (radius / 30),
      altitude: Math.floor(Math.random() * 10000) + 2000, // 2000-12000m
      velocity: Math.floor(Math.random() * 150) + 150, // 150-300 m/s
      heading: Math.floor(Math.random() * 360),
      vertical_rate: (Math.random() - 0.5) * 10,
      on_ground: false,
      squawk: Math.random() > 0.8 ? '7000' : undefined,
    })
  }

  const estimatedPassengers = Math.round(count * 0.7 * 130)

  return {
    timestamp: new Date().toISOString(),
    location: { lat, lon },
    radius,
    count,
    estimatedPassengers,
    aircraft: aircraft.sort((a, b) => b.altitude - a.altitude),
    stats: {
      highestAltitude: Math.max(...aircraft.map(a => a.altitude)),
      lowestAltitude: Math.min(...aircraft.map(a => a.altitude)),
      fastestSpeed: Math.max(...aircraft.map(a => a.velocity)),
    },
    mock: true,
  }
}

export const revalidate = 30
