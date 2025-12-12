import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { cachedFetch, TTL } from '@/lib/cache'

// ===========================================
// NUCLEAR REACTORS API ROUTE
// ===========================================
// Aggregates live nuclear data from three sources:
// - UK: Carbon Intensity API (% of grid, every 30 min)
// - France: RTE éCO2mix (MW, every hour)
// - US: NRC daily reactor status (% power per reactor)
// Cache TTL: 15 minutes
// ===========================================

const UK_GENERATION_URL = 'https://api.carbonintensity.org.uk/generation'
const UK_DEMAND_URL = 'https://data.elexon.co.uk/bmrs/api/v1/demand/outturn?format=json'
const FALLBACK_UK_DEMAND_GW = 32

interface LiveNuclearData {
  uk: {
    outputGW: number
    percentOfGrid: number
    demandGW: number
    trend: 'up' | 'down' | 'stable'
    updatedAt: string
  } | null
  france: {
    outputGW: number
    percentOfGrid: number
    demandGW: number
    trend: 'up' | 'down' | 'stable'
    updatedAt: string
  } | null
  us: {
    reactorsOnline: number
    totalReactors: number
    averageCapacity: number
    trend: 'up' | 'down' | 'stable'
    updatedAt: string
  } | null
  fetchedAt: string
}

// Store previous data for trend calculation
let previousData: LiveNuclearData | null = null

async function fetchUKData(): Promise<LiveNuclearData['uk']> {
  try {
    const [genResponse, demandResponse] = await Promise.all([
      fetchWithTimeout(UK_GENERATION_URL, { cache: 'no-store' }),
      fetchWithTimeout(UK_DEMAND_URL, { cache: 'no-store' })
    ])

    if (!genResponse.ok) throw new Error('UK generation API failed')

    const genData = await genResponse.json()
    const nuclearPercent = genData.data?.generationmix?.find(
      (f: { fuel: string; perc: number }) => f.fuel === 'nuclear'
    )?.perc || 0

    let demandGW = FALLBACK_UK_DEMAND_GW
    if (demandResponse.ok) {
      const demandData = await demandResponse.json()
      const latestDemand = demandData.data?.[demandData.data.length - 1]
      if (latestDemand?.initialTransmissionSystemDemandOutturn) {
        demandGW = latestDemand.initialTransmissionSystemDemandOutturn / 1000
      }
    }

    const outputGW = (nuclearPercent / 100) * demandGW

    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (previousData?.uk) {
      const diff = outputGW - previousData.uk.outputGW
      if (diff > 0.2) trend = 'up'
      else if (diff < -0.2) trend = 'down'
    }

    return {
      outputGW: Math.round(outputGW * 10) / 10,
      percentOfGrid: Math.round(nuclearPercent * 10) / 10,
      demandGW: Math.round(demandGW * 10) / 10,
      trend,
      updatedAt: genData.data?.to || new Date().toISOString()
    }
  } catch (error) {
    console.error('UK fetch error:', error)
    return null
  }
}

async function fetchFranceData(): Promise<LiveNuclearData['france']> {
  try {
    const response = await fetchWithTimeout(
      'https://odre.opendatasoft.com/api/records/1.0/search/?dataset=eco2mix-national-tr&rows=1&sort=-date_heure',
      { cache: 'no-store' }
    )

    if (!response.ok) throw new Error('France API failed')

    const data = await response.json()
    const record = data.records?.[0]?.fields

    if (!record) throw new Error('No France data')

    const nuclearMW = record.nucleaire || 0
    const consumptionMW = record.consommation || 1
    const outputGW = nuclearMW / 1000
    const percentOfGrid = (nuclearMW / consumptionMW) * 100

    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (previousData?.france) {
      const diff = outputGW - previousData.france.outputGW
      if (diff > 0.5) trend = 'up'
      else if (diff < -0.5) trend = 'down'
    }

    return {
      outputGW: Math.round(outputGW * 10) / 10,
      percentOfGrid: Math.round(percentOfGrid * 10) / 10,
      demandGW: Math.round(consumptionMW / 100) / 10,
      trend,
      updatedAt: record.date_heure || new Date().toISOString()
    }
  } catch (error) {
    console.error('France fetch error:', error)
    return null
  }
}

async function fetchUSData(): Promise<LiveNuclearData['us']> {
  try {
    const response = await fetchWithTimeout(
      'https://www.nrc.gov/reading-rm/doc-collections/event-status/reactor-status/powerreactorstatusforlast365days.txt',
      { cache: 'no-store' }
    )

    if (!response.ok) throw new Error('US NRC API failed')

    const text = await response.text()
    const lines = text.split('\n').filter(line => line.trim())
    const dataLines = lines.slice(1)

    const dateReactorMap = new Map<string, { power: number; unit: string }[]>()

    for (const line of dataLines) {
      const parts = line.split('|')
      if (parts.length >= 3) {
        const dateStr = parts[0].split(' ')[0]
        const unit = parts[1]?.trim()
        const power = parseInt(parts[2]?.trim() || '0', 10)

        if (!dateReactorMap.has(dateStr)) {
          dateReactorMap.set(dateStr, [])
        }
        dateReactorMap.get(dateStr)!.push({ power, unit })
      }
    }

    const dates = Array.from(dateReactorMap.keys()).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime()
    })

    const mostRecentDate = dates[0]
    const reactors = dateReactorMap.get(mostRecentDate) || []

    const reactorsOnline = reactors.filter(r => r.power > 0).length
    const totalReactors = reactors.length
    const averageCapacity = reactors.length > 0
      ? Math.round(reactors.reduce((sum, r) => sum + r.power, 0) / reactors.length)
      : 0

    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (previousData?.us) {
      const diff = reactorsOnline - previousData.us.reactorsOnline
      if (diff > 0) trend = 'up'
      else if (diff < 0) trend = 'down'
    }

    return {
      reactorsOnline,
      totalReactors,
      averageCapacity,
      trend,
      updatedAt: mostRecentDate || new Date().toISOString()
    }
  } catch (error) {
    console.error('US fetch error:', error)
    return null
  }
}

async function fetchNuclearData(): Promise<LiveNuclearData> {
  const [uk, france, us] = await Promise.all([
    fetchUKData(),
    fetchFranceData(),
    fetchUSData()
  ])

  const data: LiveNuclearData = {
    uk,
    france,
    us,
    fetchedAt: new Date().toISOString()
  }

  // Store for next trend calculation
  previousData = data

  return data
}

export async function GET() {
  try {
    const { data, cacheStatus, cacheAge } = await cachedFetch({
      key: 'nuclear',
      ttl: TTL.SLOW, // 15 minutes
      fetcher: fetchNuclearData,
    })

    const headers: Record<string, string> = { 'X-Cache': cacheStatus }
    if (cacheAge !== undefined) {
      headers['X-Cache-Age'] = String(cacheAge)
    }

    return NextResponse.json(data, { headers })

  } catch (error) {
    console.error('Nuclear API error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch nuclear data' },
      { status: 500 }
    )
  }
}
