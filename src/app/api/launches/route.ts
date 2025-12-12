import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { cachedFetch, TTL } from '@/lib/cache'

// ===========================================
// LAUNCHES API ROUTE
// ===========================================
// Proxies requests to The Space Devs Launch Library
// with Vercel KV caching to respect rate limits
// Cache TTL: 15 minutes
// ===========================================

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
  launches: Launch[]
  cached: boolean
  cacheAge?: number
  stale?: boolean
  error?: string
}

async function fetchLaunches(): Promise<Launch[]> {
  const response = await fetchWithTimeout(
    'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10&mode=detailed',
    {
      headers: {
        'Accept': 'application/json',
      },
    }
  )

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('RATE_LIMITED')
    }
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  return data.results
}

export async function GET() {
  try {
    const { data, cacheStatus, cacheAge } = await cachedFetch({
      key: 'launches',
      ttl: TTL.SLOW, // 15 minutes
      fetcher: fetchLaunches,
    })

    const response: LaunchResponse = {
      launches: data,
      cached: cacheStatus === 'HIT',
      stale: cacheStatus === 'STALE',
    }
    if (cacheAge !== undefined) {
      response.cacheAge = cacheAge
    }

    return NextResponse.json(response, {
      headers: { 'X-Cache': cacheStatus },
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Launch API error:', errorMessage)

    return NextResponse.json(
      {
        launches: [],
        cached: false,
        error: errorMessage === 'RATE_LIMITED'
          ? 'Rate limit exceeded. Please try again later.'
          : 'Unable to fetch launch data',
      },
      { status: errorMessage === 'RATE_LIMITED' ? 429 : 500 }
    )
  }
}
