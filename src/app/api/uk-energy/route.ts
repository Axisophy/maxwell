import { NextResponse } from 'next/server'

// ===========================================
// UK ENERGY API ROUTE
// ===========================================
// Fetches live data from Carbon Intensity API
// - Carbon intensity (actual + forecast)
// - Generation mix by fuel type
// - Renewable and low-carbon percentages
//
// Source: https://api.carbonintensity.org.uk/
// Update frequency: Every 30 minutes
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

// Cache configuration
let cache: {
  data: unknown
  timestamp: number
} | null = null

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET() {
  try {
    // Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data, {
        headers: { 'X-Cache': 'HIT' },
      })
    }

    // Fetch intensity and generation in parallel
    const [intensityRes, generationRes] = await Promise.all([
      fetch('https://api.carbonintensity.org.uk/intensity', {
        next: { revalidate: 300 }, // 5 min cache
      }),
      fetch('https://api.carbonintensity.org.uk/generation', {
        next: { revalidate: 300 },
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

    const result = {
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

    // Update cache
    cache = {
      data: result,
      timestamp: Date.now(),
    }

    return NextResponse.json(result, {
      headers: { 'X-Cache': 'MISS' },
    })
  } catch (error) {
    console.error('UK Energy API error:', error)

    // Return stale cache if available
    if (cache) {
      return NextResponse.json(cache.data, {
        headers: { 'X-Cache': 'STALE' },
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch UK energy data' },
      { status: 500 }
    )
  }
}