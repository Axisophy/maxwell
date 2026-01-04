import { NextResponse } from 'next/server'
import { cachedFetch, TTL } from '@/lib/cache'
import { generateMockSeismic } from '@/lib/unrest/mock-data'

// ===========================================
// SEISMIC DATA API
// ===========================================
// Provides seismic network data for visualization
// Uses Vercel KV caching - seismic data is real-time
// TODO: Replace with real IRIS/FDSN data
// ===========================================

type SeismicData = ReturnType<typeof generateMockSeismic>

const CACHE_KEY = 'api:unrest:seismic'

export async function GET() {
  try {
    const { data, cacheStatus } = await cachedFetch<SeismicData>({
      key: CACHE_KEY,
      ttl: TTL.FAST, // 60 seconds - seismic data updates frequently
      fetcher: async () => {
        // TODO: Replace with real IRIS/FDSN data
        return generateMockSeismic()
      },
    })

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Cache-Status': cacheStatus,
      },
    })
  } catch (error) {
    console.error('[api/unrest/seismic] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch seismic data', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
