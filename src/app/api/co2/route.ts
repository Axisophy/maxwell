import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'

// ===========================================
// CO2 NOW API ROUTE
// ===========================================
// Fetches atmospheric CO2 data from NOAA Mauna Loa
// Cache TTL: 24 hours (data updates monthly)
// ===========================================

interface CacheEntry {
  data: CO2Response
  timestamp: number
}

interface CO2Response {
  current: number
  currentDate: string
  yearAgo: number
  yearChange: number
  preIndustrial: number
  abovePreIndustrial: number
  percentAbovePreIndustrial: number
  timestamp: string
}

// Server-side cache
let cache: CacheEntry | null = null
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

// Pre-industrial baseline
const PRE_INDUSTRIAL_CO2 = 280

// NOAA monthly data URL
const NOAA_MONTHLY_URL = 'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_monthly_mlo.txt'

// Parse NOAA text format
// Format: year, month, decimal_date, monthly_average, deseasonalized, days, std_dev, uncertainty
function parseNOAAData(text: string): { year: number; month: number; value: number }[] {
  const lines = text.split('\n')
  const data: { year: number; month: number; value: number }[] = []
  
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.startsWith('#') || line.trim() === '') continue
    
    const parts = line.trim().split(/\s+/)
    if (parts.length >= 4) {
      const year = parseInt(parts[0])
      const month = parseInt(parts[1])
      const value = parseFloat(parts[3])
      
      // Validate
      if (!isNaN(year) && !isNaN(month) && !isNaN(value) && value > 0) {
        data.push({ year, month, value })
      }
    }
  }
  
  return data
}

// Format month name
function formatMonth(month: number, year: number): string {
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

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
    const response = await fetchWithTimeout(NOAA_MONTHLY_URL, { cache: 'no-store' })
    
    if (!response.ok) {
      throw new Error(`NOAA API error: ${response.status}`)
    }

    const text = await response.text()
    const readings = parseNOAAData(text)
    
    if (readings.length < 13) {
      throw new Error('Insufficient data from NOAA')
    }

    // Get most recent reading
    const current = readings[readings.length - 1]
    
    // Find same month last year
    const yearAgoReading = readings.find(
      r => r.year === current.year - 1 && r.month === current.month
    )
    const yearAgo = yearAgoReading?.value || current.value - 2.5 // Fallback to typical annual increase

    const yearChange = current.value - yearAgo
    const abovePreIndustrial = current.value - PRE_INDUSTRIAL_CO2
    const percentAbovePreIndustrial = (abovePreIndustrial / PRE_INDUSTRIAL_CO2) * 100

    const data: CO2Response = {
      current: current.value,
      currentDate: formatMonth(current.month, current.year),
      yearAgo,
      yearChange,
      preIndustrial: PRE_INDUSTRIAL_CO2,
      abovePreIndustrial,
      percentAbovePreIndustrial,
      timestamp: new Date().toISOString(),
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
    console.error('CO2 API error:', error)
    
    // Return stale cache if available
    if (cache) {
      return NextResponse.json(cache.data, {
        headers: {
          'X-Cache': 'STALE',
          'X-Cache-Age': String(Math.round((Date.now() - cache.timestamp) / 1000)),
        },
      })
    }

    // Fallback data if no cache
    const fallback: CO2Response = {
      current: 422.5,
      currentDate: 'December 2024',
      yearAgo: 420.2,
      yearChange: 2.3,
      preIndustrial: PRE_INDUSTRIAL_CO2,
      abovePreIndustrial: 142.5,
      percentAbovePreIndustrial: 50.9,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(fallback, {
      headers: { 'X-Cache': 'FALLBACK' },
    })
  }
}