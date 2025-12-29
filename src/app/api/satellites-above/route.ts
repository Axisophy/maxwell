// app/api/satellites-above/route.ts
import { NextResponse } from 'next/server'
import { cachedFetch, TTL } from '@/lib/cache'

// Spacecraft name mapping for N2YO
const SPACECRAFT_NAMES: Record<string, string> = {
  ISS: 'ISS (ZARYA)',
  STARLINK: 'Starlink',
  GPS: 'GPS',
  WEATHER: 'Weather',
}

interface Satellite {
  satid: number
  satname: string
  intDesignator: string
  launchDate: string
  satlat: number
  satlng: number
  satalt: number // km
}

interface SatelliteResponse {
  timestamp: string
  location: {
    lat: number
    lng: number
  }
  satellites: {
    id: number
    name: string
    altitude: number // km
    latitude: number
    longitude: number
    category: string
  }[]
  counts: {
    total: number
    starlink: number
    gps: number
    weather: number
    other: number
  }
  nearest: {
    name: string
    altitude: number
  } | null
  error?: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '51.5')
  const lng = parseFloat(searchParams.get('lng') || '-0.1')
  const radius = parseInt(searchParams.get('radius') || '70') // degrees above horizon

  // Round location to 1 decimal place for caching efficiency
  // This groups nearby users to the same cache key
  const roundedLat = Math.round(lat * 10) / 10
  const roundedLng = Math.round(lng * 10) / 10
  const cacheKey = `satellites-above:${roundedLat}:${roundedLng}:${radius}`

  // Get API key from environment
  const apiKey = process.env.N2YO_API_KEY

  if (!apiKey) {
    // Return simulated data if no API key
    return NextResponse.json(generateSimulatedData(lat, lng))
  }

  try {
    const { data, cacheStatus } = await cachedFetch<SatelliteResponse>({
      key: cacheKey,
      ttl: TTL.FAST, // 60 seconds
      fetcher: async () => {
        // Fetch satellites above location
        // N2YO API: /satellite/above/{lat}/{lng}/{alt}/{radius}/{categoryId}
        const url = `https://api.n2yo.com/rest/v1/satellite/above/${roundedLat}/${roundedLng}/0/${radius}/0/&apiKey=${apiKey}`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`N2YO API returned ${response.status}`)
        }

        const data = await response.json()

        // Process satellites
        const satellites = (data.above || []).map((sat: Satellite) => ({
          id: sat.satid,
          name: cleanSatelliteName(sat.satname),
          altitude: Math.round(sat.satalt),
          latitude: sat.satlat,
          longitude: sat.satlng,
          category: categorizeSatellite(sat.satname),
        }))

        // Count by category
        const counts = {
          total: satellites.length,
          starlink: satellites.filter((s: { category: string }) => s.category === 'Starlink').length,
          gps: satellites.filter((s: { category: string }) => s.category === 'GPS').length,
          weather: satellites.filter((s: { category: string }) => s.category === 'Weather').length,
          other: satellites.filter((s: { category: string }) => s.category === 'Other').length,
        }

        // Find nearest
        const sortedByAlt = [...satellites].sort((a, b) => a.altitude - b.altitude)
        const nearest = sortedByAlt[0] || null

        return {
          timestamp: new Date().toISOString(),
          location: { lat: roundedLat, lng: roundedLng },
          satellites: satellites.slice(0, 100), // Limit to 100 for performance
          counts,
          nearest: nearest ? { name: nearest.name, altitude: nearest.altitude } : null,
        }
      }
    })

    // Add cache headers for debugging
    const headers = new Headers()
    headers.set('X-Cache-Status', cacheStatus)

    return NextResponse.json(data, { headers })
  } catch (error) {
    console.error('Satellites fetch error:', error)
    return NextResponse.json(generateSimulatedData(lat, lng))
  }
}

function cleanSatelliteName(name: string): string {
  // Clean up satellite names for display
  return name
    .replace(/\[.\]/, '')
    .replace(/STARLINK-(\d+)/, 'Starlink $1')
    .replace(/GPS BIIR?-\d+ \(PRN (\d+)\)/, 'GPS PRN $1')
    .trim()
}

function categorizeSatellite(name: string): string {
  const upperName = name.toUpperCase()
  if (upperName.includes('STARLINK')) return 'Starlink'
  if (upperName.includes('GPS') || upperName.includes('NAVSTAR')) return 'GPS'
  if (upperName.includes('GOES') || upperName.includes('NOAA') || upperName.includes('METEOSAT')) return 'Weather'
  if (upperName.includes('ISS') || upperName.includes('ZARYA')) return 'ISS'
  return 'Other'
}

function generateSimulatedData(lat: number, lng: number): SatelliteResponse {
  // Generate realistic simulated data for demo/fallback
  const satellites = []

  // Add some Starlinks (most common)
  for (let i = 0; i < 45; i++) {
    satellites.push({
      id: 50000 + i,
      name: `Starlink ${1000 + Math.floor(Math.random() * 5000)}`,
      altitude: 540 + Math.floor(Math.random() * 20),
      latitude: lat + (Math.random() - 0.5) * 20,
      longitude: lng + (Math.random() - 0.5) * 20,
      category: 'Starlink',
    })
  }

  // Add GPS satellites
  for (let i = 0; i < 8; i++) {
    satellites.push({
      id: 40000 + i,
      name: `GPS PRN ${10 + i}`,
      altitude: 20200,
      latitude: lat + (Math.random() - 0.5) * 40,
      longitude: lng + (Math.random() - 0.5) * 40,
      category: 'GPS',
    })
  }

  // Add weather satellites
  for (let i = 0; i < 3; i++) {
    satellites.push({
      id: 30000 + i,
      name: ['GOES-16', 'NOAA-20', 'METEOSAT-11'][i],
      altitude: [35786, 833, 35786][i],
      latitude: lat + (Math.random() - 0.5) * 30,
      longitude: lng + (Math.random() - 0.5) * 30,
      category: 'Weather',
    })
  }

  // Add ISS if it might be overhead
  if (Math.random() > 0.7) {
    satellites.push({
      id: 25544,
      name: 'ISS (ZARYA)',
      altitude: 420,
      latitude: lat + (Math.random() - 0.5) * 10,
      longitude: lng + (Math.random() - 0.5) * 10,
      category: 'ISS',
    })
  }

  // Add some other satellites
  const otherSats = ['COSMOS 2545', 'SENTINEL-2B', 'LANDSAT 9', 'HUBBLE', 'TERRA']
  for (let i = 0; i < 12; i++) {
    satellites.push({
      id: 20000 + i,
      name: otherSats[i % otherSats.length] + (i > 4 ? ` ${i}` : ''),
      altitude: 400 + Math.floor(Math.random() * 800),
      latitude: lat + (Math.random() - 0.5) * 20,
      longitude: lng + (Math.random() - 0.5) * 20,
      category: 'Other',
    })
  }

  const nearest = satellites.reduce((min, s) => s.altitude < min.altitude ? s : min)

  return {
    timestamp: new Date().toISOString(),
    location: { lat, lng },
    satellites,
    counts: {
      total: satellites.length,
      starlink: 45,
      gps: 8,
      weather: 3,
      other: 12 + (Math.random() > 0.7 ? 1 : 0), // +1 if ISS
    },
    nearest: { name: nearest.name, altitude: nearest.altitude },
  }
}
