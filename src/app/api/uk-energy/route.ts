import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { cachedFetch, TTL } from '@/lib/cache'

// ===========================================
// UK ENERGY API ROUTE
// ===========================================
// Fetches live data from Carbon Intensity API
// Cache TTL: 5 minutes
// ===========================================

interface CarbonIntensityResponse {
  data: Array<{
    from: string
    to: string
    intensity: {
      forecast: number
      actual: number | null
      index: string
    }
  }>
}

interface GenerationResponse {
  data: {
    from: string
    to: string
    generationmix: Array<{
      fuel: string
      perc: number
    }>
  }
}

interface UKEnergyData {
  intensity: {
    actual: number | null
    forecast: number
    index: string
  }
  generation: Record<string, number>
  renewablePercent: number
  lowCarbonPercent: number
  timestamp: string
}

async function fetchUKEnergyData(): Promise<UKEnergyData> {
  // Fetch intensity and generation in parallel
  const [intensityRes, generationRes] = await Promise.all([
    fetchWithTimeout('https://api.carbonintensity.org.uk/intensity', {
      cache: 'no-store',
    }),
    fetchWithTimeout('https://api.carbonintensity.org.uk/generation', {
      cache: 'no-store',
    }),
  ])

  if (!intensityRes.ok || !generationRes.ok) {
    throw new Error('API request failed')
  }

  const intensityData: CarbonIntensityResponse = await intensityRes.json()
  const generationData: GenerationResponse = await generationRes.json()

  // Extract intensity
  const intensity = intensityData.data[0]?.intensity || {
    forecast: 0,
    actual: null,
    index: 'unknown',
  }

  // Build generation mix object
  const generation: Record<string, number> = {
    gas: 0,
    coal: 0,
    nuclear: 0,
    wind: 0,
    solar: 0,
    hydro: 0,
    imports: 0,
    biomass: 0,
    other: 0,
  }

  let renewablePercent = 0
  let lowCarbonPercent = 0

  for (const item of generationData.data.generationmix) {
    const fuel = item.fuel.toLowerCase()
    const perc = item.perc

    // Map API fuel names to our keys
    if (fuel === 'gas') generation.gas = perc
    else if (fuel === 'coal') generation.coal = perc
    else if (fuel === 'nuclear') generation.nuclear = perc
    else if (fuel === 'wind') generation.wind = perc
    else if (fuel === 'solar') generation.solar = perc
    else if (fuel === 'hydro') generation.hydro = perc
    else if (fuel === 'imports') generation.imports = perc
    else if (fuel === 'biomass') generation.biomass = perc
    else if (fuel === 'other') generation.other = perc

    // Calculate renewable (wind, solar, hydro)
    if (['wind', 'solar', 'hydro'].includes(fuel)) {
      renewablePercent += perc
    }

    // Calculate low carbon (renewable + nuclear + biomass)
    if (['wind', 'solar', 'hydro', 'nuclear', 'biomass'].includes(fuel)) {
      lowCarbonPercent += perc
    }
  }

  return {
    intensity: {
      actual: intensity.actual,
      forecast: intensity.forecast,
      index: intensity.index,
    },
    generation,
    renewablePercent,
    lowCarbonPercent,
    timestamp: intensityData.data[0]?.from || new Date().toISOString(),
  }
}

export async function GET() {
  try {
    const { data, cacheStatus, cacheAge } = await cachedFetch({
      key: 'uk-energy',
      ttl: TTL.MODERATE, // 5 minutes
      fetcher: fetchUKEnergyData,
    })

    const headers: Record<string, string> = { 'X-Cache': cacheStatus }
    if (cacheAge !== undefined) {
      headers['X-Cache-Age'] = String(cacheAge)
    }

    return NextResponse.json(data, { headers })

  } catch (error) {
    console.error('UK Energy API error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch UK energy data' },
      { status: 500 }
    )
  }
}
