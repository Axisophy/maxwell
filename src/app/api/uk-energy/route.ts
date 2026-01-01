import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { cachedFetch, TTL } from '@/lib/cache'

// ===========================================
// UK ENERGY API ROUTE
// ===========================================
// Fetches live data from Carbon Intensity API
// Includes: current intensity, generation mix, 24h history, 24h forecast
// Cache TTL: 5 minutes
// ===========================================

interface IntensityPeriod {
  from: string
  to: string
  intensity: {
    forecast: number
    actual: number | null
    index: string
  }
}

interface CarbonIntensityResponse {
  data: IntensityPeriod[]
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

interface IntensityData {
  from: string
  to: string
  forecast: number
  actual: number | null
  index: string
}

interface GenerationMix {
  fuel: string
  perc: number
}

interface UKEnergyData {
  intensity: {
    current: number
    index: string
  }
  generation: GenerationMix[]
  renewablePercent: number
  lowCarbonPercent: number
  history: IntensityData[]
  forecast: IntensityData[]
  timestamp: string
}

// Helper to get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

// Helper to get current ISO timestamp
function getCurrentISOTime(): string {
  return new Date().toISOString()
}

async function fetchUKEnergyData(): Promise<UKEnergyData> {
  const today = getTodayDate()
  const now = getCurrentISOTime()

  // Fetch all data in parallel for reliability
  const [intensityRes, generationRes, historyRes, forecastRes] = await Promise.allSettled([
    fetchWithTimeout('https://api.carbonintensity.org.uk/intensity', {
      cache: 'no-store',
    }),
    fetchWithTimeout('https://api.carbonintensity.org.uk/generation', {
      cache: 'no-store',
    }),
    fetchWithTimeout(`https://api.carbonintensity.org.uk/intensity/date/${today}`, {
      cache: 'no-store',
    }),
    fetchWithTimeout(`https://api.carbonintensity.org.uk/intensity/${now}/fw24h`, {
      cache: 'no-store',
    }),
  ])

  // Handle current intensity
  let currentIntensity = { current: 0, index: 'unknown' }
  if (intensityRes.status === 'fulfilled' && intensityRes.value.ok) {
    const data: CarbonIntensityResponse = await intensityRes.value.json()
    const intensity = data.data[0]?.intensity
    if (intensity) {
      currentIntensity = {
        current: intensity.actual ?? intensity.forecast,
        index: intensity.index,
      }
    }
  }

  // Handle generation mix
  let generation: GenerationMix[] = []
  let renewablePercent = 0
  let lowCarbonPercent = 0

  if (generationRes.status === 'fulfilled' && generationRes.value.ok) {
    const data: GenerationResponse = await generationRes.value.json()
    generation = data.data.generationmix.map(item => ({
      fuel: item.fuel.toLowerCase(),
      perc: item.perc,
    }))

    // Calculate renewable and low-carbon percentages
    for (const item of generation) {
      if (['wind', 'solar', 'hydro'].includes(item.fuel)) {
        renewablePercent += item.perc
      }
      if (['wind', 'solar', 'hydro', 'nuclear', 'biomass'].includes(item.fuel)) {
        lowCarbonPercent += item.perc
      }
    }
  }

  // Handle history (past 24h)
  let history: IntensityData[] = []
  if (historyRes.status === 'fulfilled' && historyRes.value.ok) {
    const data: CarbonIntensityResponse = await historyRes.value.json()
    history = data.data.map(period => ({
      from: period.from,
      to: period.to,
      forecast: period.intensity.forecast,
      actual: period.intensity.actual,
      index: period.intensity.index,
    }))
  }

  // Handle forecast (next 24h)
  let forecast: IntensityData[] = []
  if (forecastRes.status === 'fulfilled' && forecastRes.value.ok) {
    const data: CarbonIntensityResponse = await forecastRes.value.json()
    forecast = data.data.map(period => ({
      from: period.from,
      to: period.to,
      forecast: period.intensity.forecast,
      actual: period.intensity.actual,
      index: period.intensity.index,
    }))
  }

  return {
    intensity: currentIntensity,
    generation,
    renewablePercent,
    lowCarbonPercent,
    history,
    forecast,
    timestamp: new Date().toISOString(),
  }
}

export async function GET() {
  try {
    const { data, cacheStatus, cacheAge } = await cachedFetch({
      key: 'uk-energy-v2',
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
