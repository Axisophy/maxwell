import { NextResponse } from 'next/server'

const CARBON_INTENSITY_URL = 'https://api.carbonintensity.org.uk/intensity'
const GENERATION_MIX_URL = 'https://api.carbonintensity.org.uk/generation'

interface GenerationSource {
  fuel: string
  perc: number
}

interface UKEnergyData {
  intensity: {
    actual: number
    forecast: number
    index: string // 'very low' | 'low' | 'moderate' | 'high' | 'very high'
  }
  generation: {
    gas: number
    coal: number
    nuclear: number
    wind: number
    solar: number
    hydro: number
    imports: number
    biomass: number
    other: number
  }
  renewablePercent: number
  lowCarbonPercent: number
  timestamp: string
}

export async function GET() {
  try {
    // Fetch both endpoints in parallel
    const [intensityResponse, generationResponse] = await Promise.all([
      fetch(CARBON_INTENSITY_URL, { next: { revalidate: 300 } }),
      fetch(GENERATION_MIX_URL, { next: { revalidate: 300 } }),
    ])

    if (!intensityResponse.ok || !generationResponse.ok) {
      throw new Error('Failed to fetch from Carbon Intensity API')
    }

    const intensityData = await intensityResponse.json()
    const generationData = await generationResponse.json()

    // Parse intensity
    const currentIntensity = intensityData.data?.[0]?.intensity || {}
    
    // Parse generation mix
    const generationMix: GenerationSource[] = generationData.data?.generationmix || []
    
    // Build generation object
    const generation = {
      gas: 0,
      coal: 0,
      nuclear: 0,
      wind: 0,
      solar: 0,
      hydro: 0,
      imports: 0,
      biomass: 0,
      other: 0
    }

    generationMix.forEach((source) => {
      const fuel = source.fuel.toLowerCase()
      const perc = source.perc || 0
      
      if (fuel === 'gas') generation.gas = perc
      else if (fuel === 'coal') generation.coal = perc
      else if (fuel === 'nuclear') generation.nuclear = perc
      else if (fuel === 'wind') generation.wind = perc
      else if (fuel === 'solar') generation.solar = perc
      else if (fuel === 'hydro') generation.hydro = perc
      else if (fuel === 'imports') generation.imports = perc
      else if (fuel === 'biomass') generation.biomass = perc
      else generation.other += perc
    })

    // Calculate renewable and low-carbon percentages
    const renewablePercent = generation.wind + generation.solar + generation.hydro
    const lowCarbonPercent = renewablePercent + generation.nuclear + generation.biomass

    const data: UKEnergyData = {
      intensity: {
        actual: currentIntensity.actual || 0,
        forecast: currentIntensity.forecast || 0,
        index: currentIntensity.index || 'moderate'
      },
      generation,
      renewablePercent,
      lowCarbonPercent,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching UK energy data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch UK energy data' },
      { status: 500 }
    )
  }
}
