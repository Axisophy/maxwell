// ===========================================
// NUCLEAR REACTORS API ROUTE
// ===========================================
// Aggregates live nuclear data from three sources:
// - UK: Carbon Intensity API (% of grid, every 30 min)
// - France: RTE éCO2mix (MW, every hour)
// - US: NRC daily reactor status (% power per reactor)
// ===========================================

import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'

// ===========================================
// API ENDPOINTS
// ===========================================

const UK_GENERATION_URL = 'https://api.carbonintensity.org.uk/generation'
const UK_DEMAND_URL = 'https://data.elexon.co.uk/bmrs/api/v1/demand/outturn?format=json'
const FALLBACK_UK_DEMAND_GW = 32 // Conservative estimate if Elexon API fails

// ===========================================
// TYPES
// ===========================================

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

// ===========================================
// CACHE
// ===========================================

interface CacheEntry {
  data: LiveNuclearData
  timestamp: number
  previousData?: LiveNuclearData
}

let cache: CacheEntry | null = null
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes
const STALE_DURATION = 60 * 60 * 1000 // 1 hour fallback

// ===========================================
// DATA FETCHERS
// ===========================================

async function fetchUKData(previousUK?: LiveNuclearData['uk']): Promise<LiveNuclearData['uk']> {
  try {
    // Fetch generation mix and demand in parallel
    const [genResponse, demandResponse] = await Promise.all([
      fetchWithTimeout(UK_GENERATION_URL, { next: { revalidate: 300 } }),
      fetchWithTimeout(UK_DEMAND_URL, { next: { revalidate: 300 } })
    ])

    if (!genResponse.ok) throw new Error('UK generation API failed')

    const genData = await genResponse.json()
    const nuclearPercent = genData.data?.generationmix?.find(
      (f: { fuel: string; perc: number }) => f.fuel === 'nuclear'
    )?.perc || 0

    // Get real demand from Elexon API, fall back to estimate if unavailable
    let demandGW = FALLBACK_UK_DEMAND_GW
    if (demandResponse.ok) {
      const demandData = await demandResponse.json()
      // Get the most recent settlement period's demand (last item in array)
      const latestDemand = demandData.data?.[demandData.data.length - 1]
      if (latestDemand?.initialTransmissionSystemDemandOutturn) {
        // Convert MW to GW
        demandGW = latestDemand.initialTransmissionSystemDemandOutturn / 1000
      }
    }

    const outputGW = (nuclearPercent / 100) * demandGW

    // Determine trend
    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (previousUK) {
      const diff = outputGW - previousUK.outputGW
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

async function fetchFranceData(previousFrance?: LiveNuclearData['france']): Promise<LiveNuclearData['france']> {
  try {
    const response = await fetchWithTimeout(
      'https://odre.opendatasoft.com/api/records/1.0/search/?dataset=eco2mix-national-tr&rows=1&sort=-date_heure',
      { next: { revalidate: 600 } }
    )
    
    if (!response.ok) throw new Error('France API failed')
    
    const data = await response.json()
    const record = data.records?.[0]?.fields
    
    if (!record) throw new Error('No France data')

    const nuclearMW = record.nucleaire || 0
    const consumptionMW = record.consommation || 1
    const outputGW = nuclearMW / 1000
    const percentOfGrid = (nuclearMW / consumptionMW) * 100

    // Determine trend
    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (previousFrance) {
      const diff = outputGW - previousFrance.outputGW
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

async function fetchUSData(previousUS?: LiveNuclearData['us']): Promise<LiveNuclearData['us']> {
  try {
    const response = await fetchWithTimeout(
      'https://www.nrc.gov/reading-rm/doc-collections/event-status/reactor-status/powerreactorstatusforlast365days.txt',
      { next: { revalidate: 3600 } } // Cache for 1 hour (updates daily)
    )
    
    if (!response.ok) throw new Error('US NRC API failed')
    
    const text = await response.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    // Skip header line
    const dataLines = lines.slice(1)
    
    // Get today's date in the format used by NRC
    const today = new Date()
    const todayStr = today.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
    
    // Find most recent date in the data
    const dateReactorMap = new Map<string, { power: number; unit: string }[]>()
    
    for (const line of dataLines) {
      const parts = line.split('|')
      if (parts.length >= 3) {
        const dateStr = parts[0].split(' ')[0] // Extract date part
        const unit = parts[1]?.trim()
        const power = parseInt(parts[2]?.trim() || '0', 10)
        
        if (!dateReactorMap.has(dateStr)) {
          dateReactorMap.set(dateStr, [])
        }
        dateReactorMap.get(dateStr)!.push({ power, unit })
      }
    }
    
    // Get most recent date's data
    const dates = Array.from(dateReactorMap.keys()).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime()
    })
    
    const mostRecentDate = dates[0]
    const reactors = dateReactorMap.get(mostRecentDate) || []
    
    // Count reactors online (power > 0)
    const reactorsOnline = reactors.filter(r => r.power > 0).length
    const totalReactors = reactors.length
    const averageCapacity = reactors.length > 0
      ? Math.round(reactors.reduce((sum, r) => sum + r.power, 0) / reactors.length)
      : 0

    // Determine trend
    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (previousUS) {
      const diff = reactorsOnline - previousUS.reactorsOnline
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

// ===========================================
// MAIN HANDLER
// ===========================================

export async function GET() {
  const now = Date.now()
  
  // Return cached data if fresh
  if (cache && (now - cache.timestamp) < CACHE_DURATION) {
    return NextResponse.json(cache.data, {
      headers: { 'X-Cache': 'HIT' }
    })
  }
  
  // Try to fetch fresh data
  try {
    const previousData = cache?.data
    
    const [uk, france, us] = await Promise.all([
      fetchUKData(previousData?.uk),
      fetchFranceData(previousData?.france),
      fetchUSData(previousData?.us)
    ])
    
    const data: LiveNuclearData = {
      uk,
      france,
      us,
      fetchedAt: new Date().toISOString()
    }
    
    // Update cache
    cache = {
      data,
      timestamp: now,
      previousData
    }
    
    return NextResponse.json(data, {
      headers: { 'X-Cache': 'MISS' }
    })
    
  } catch (error) {
    console.error('Nuclear API error:', error)
    
    // Return stale cache if available
    if (cache && (now - cache.timestamp) < STALE_DURATION) {
      return NextResponse.json(cache.data, {
        headers: { 'X-Cache': 'STALE' }
      })
    }
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to fetch nuclear data' },
      { status: 500 }
    )
  }
}