// =============================================================================
// /api/vital-signs/route.ts
// =============================================================================
// Main API endpoint for Vital Signs data
// Fetches from multiple sources with caching and graceful degradation

import { NextResponse } from 'next/server'
import { getCachedData, DATA_TTL } from '@/lib/vital-signs/cache'
import {
  fetchEarthquakes,
  fetchCO2,
  fetchSolar,
  fetchISS,
  fetchLaunches,
  fetchSeaIce,
  fetchTemperature,
  fetchSeaLevel,
  fetchFires,
  fetchNEO,
  calculateMoon,
  calculateDaylight,
  calculatePopulation,
  type EarthquakeData,
  type CO2Data,
  type SolarData,
  type ISSData,
  type LaunchData,
  type SeaIceData,
  type TemperatureData,
  type SeaLevelData,
  type FiresData,
  type NEOData,
  type PopulationData,
  type MoonData,
  type DaylightData,
} from '@/lib/vital-signs/fetchers'

// =============================================================================
// TYPES
// =============================================================================

interface VitalSignsResponse {
  // Fetched data (nullable if fetch failed)
  earthquakes: (EarthquakeData & { stale?: boolean }) | null
  co2: (CO2Data & { stale?: boolean }) | null
  solar: (SolarData & { stale?: boolean }) | null
  iss: (ISSData & { stale?: boolean }) | null
  launches: (LaunchData[] & { stale?: boolean }) | null
  seaIce: (SeaIceData & { stale?: boolean }) | null
  temperature: (TemperatureData & { stale?: boolean }) | null
  seaLevel: (SeaLevelData & { stale?: boolean }) | null
  fires: (FiresData & { stale?: boolean }) | null
  neo: (NEOData & { stale?: boolean }) | null
  
  // Calculated data (always available)
  moon: MoonData
  daylight: DaylightData
  population: PopulationData
  
  // Meta
  timestamp: string
  staleCount: number
  errorCount: number
}

// =============================================================================
// HELPER
// =============================================================================

function extractResult<T>(
  result: PromiseSettledResult<{ data: T; stale: boolean } | null>
): (T & { stale?: boolean }) | null {
  if (result.status === 'fulfilled' && result.value) {
    return { ...result.value.data, stale: result.value.stale }
  }
  return null
}

// =============================================================================
// ROUTE HANDLER
// =============================================================================

export async function GET(request: Request) {
  const startTime = Date.now()
  
  // Parse query params for optional features
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '51.5') // Default to London
  
  // Fetch all data in parallel with individual error handling
  const results = await Promise.allSettled([
    getCachedData('earthquakes', fetchEarthquakes, DATA_TTL.earthquakes),
    getCachedData('co2', fetchCO2, DATA_TTL.co2),
    getCachedData('solar', fetchSolar, DATA_TTL.kpIndex),
    getCachedData('iss', fetchISS, DATA_TTL.iss),
    getCachedData('launches', fetchLaunches, DATA_TTL.neo), // Using same TTL as NEO (hourly)
    getCachedData('seaIce', fetchSeaIce, DATA_TTL.seaIce),
    getCachedData('temperature', fetchTemperature, DATA_TTL.temperature),
    getCachedData('seaLevel', fetchSeaLevel, DATA_TTL.seaLevel),
    getCachedData('fires', fetchFires, DATA_TTL.fires),
    getCachedData('neo', fetchNEO, DATA_TTL.neo),
  ])
  
  // Extract results
  const earthquakes = extractResult<EarthquakeData>(results[0])
  const co2 = extractResult<CO2Data>(results[1])
  const solar = extractResult<SolarData>(results[2])
  const iss = extractResult<ISSData>(results[3])
  const launches = extractResult<LaunchData[]>(results[4])
  const seaIce = extractResult<SeaIceData>(results[5])
  const temperature = extractResult<TemperatureData>(results[6])
  const seaLevel = extractResult<SeaLevelData>(results[7])
  const fires = extractResult<FiresData>(results[8])
  const neo = extractResult<NEOData>(results[9])
  
  // Calculate values (these never fail)
  const moon = calculateMoon()
  const daylight = calculateDaylight(lat)
  const population = calculatePopulation()
  
  // Count stale and errors
  const allResults = [earthquakes, co2, solar, iss, launches, seaIce, temperature, seaLevel, fires, neo]
  const staleCount = allResults.filter(r => r?.stale).length
  const errorCount = allResults.filter(r => r === null).length
  
  const response: VitalSignsResponse = {
    earthquakes,
    co2,
    solar,
    iss,
    launches,
    seaIce,
    temperature,
    seaLevel,
    fires,
    neo,
    moon,
    daylight,
    population,
    timestamp: new Date().toISOString(),
    staleCount,
    errorCount,
  }
  
  // Log performance
  const duration = Date.now() - startTime
  console.log(`[VitalSigns] Fetched in ${duration}ms (${staleCount} stale, ${errorCount} errors)`)
  
  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  })
}

// =============================================================================
// REVALIDATION
// =============================================================================

// Allow on-demand revalidation
// Usage: POST /api/vital-signs with header "Authorization: Bearer <REVALIDATE_SECRET>"
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.REVALIDATE_SECRET

  // Ensure secret is configured
  if (!expectedSecret) {
    console.error('REVALIDATE_SECRET environment variable is not set')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  // Validate Authorization header format: "Bearer <secret>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
  }

  const providedSecret = authHeader.slice(7) // Remove "Bearer " prefix
  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  // Force fresh fetch by calling GET
  return GET(request)
}
