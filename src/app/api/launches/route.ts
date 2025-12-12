import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'

// ===========================================
// LAUNCHES API ROUTE
// ===========================================
// Proxies requests to The Space Devs Launch Library
// with server-side caching to respect rate limits
//
// Rate limit: 15 requests/hour (free tier)
// Cache duration: 10 minutes (launches don't change often)
// ===========================================

interface CachedData {
  data: LaunchResponse | null
  timestamp: number
  error: string | null
}

interface Launch {
  id: string
  name: string
  net: string
  status: {
    id: number
    name: string
    abbrev: string
  }
  rocket: {
    configuration: {
      name: string
      family: string
    }
  }
  mission: {
    name: string
    description: string
    type: string
  } | null
  pad: {
    name: string
    location: {
      name: string
      country_code: string
    }
  }
  launch_service_provider: {
    name: string
    abbrev: string
    type: string
  }
  webcast_live: boolean
  image: string | null
}

interface LaunchResponse {
  count: number
  results: Launch[]
}

// In-memory cache
const cache: CachedData = {
  data: null,
  timestamp: 0,
  error: null,
}

// Cache duration: 10 minutes (600,000 ms)
// Launch schedules don't change moment-to-moment
const CACHE_DURATION = 10 * 60 * 1000

// Stale cache duration: 1 hour
// If API fails, serve stale data for up to an hour
const STALE_DURATION = 60 * 60 * 1000

async function fetchLaunches(): Promise<LaunchResponse> {
  const response = await fetchWithTimeout(
    'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10&mode=detailed',
    {
      headers: {
        'Accept': 'application/json',
      },
      // Next.js fetch cache - revalidate every 10 minutes
      next: { revalidate: 600 },
    }
  )

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('RATE_LIMITED')
    }
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

export async function GET() {
  const now = Date.now()
  const cacheAge = now - cache.timestamp

  // Return fresh cached data if available
  if (cache.data && cacheAge < CACHE_DURATION) {
    return NextResponse.json({
      launches: cache.data.results,
      cached: true,
      cacheAge: Math.round(cacheAge / 1000),
    })
  }

  // Try to fetch fresh data
  try {
    const data = await fetchLaunches()

    // Update cache
    cache.data = data
    cache.timestamp = now
    cache.error = null

    return NextResponse.json({
      launches: data.results,
      cached: false,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // If we have stale data and it's not too old, return it
    if (cache.data && cacheAge < STALE_DURATION) {
      console.warn(`Launch API error (${errorMessage}), serving stale cache`)
      return NextResponse.json({
        launches: cache.data.results,
        cached: true,
        stale: true,
        cacheAge: Math.round(cacheAge / 1000),
        error: errorMessage,
      })
    }

    // No usable cache, return error
    console.error('Launch API error with no cache:', errorMessage)
    return NextResponse.json(
      {
        launches: [],
        error: errorMessage === 'RATE_LIMITED'
          ? 'Rate limit exceeded. Please try again later.'
          : 'Unable to fetch launch data',
      },
      { status: errorMessage === 'RATE_LIMITED' ? 429 : 500 }
    )
  }
}