import { NextResponse } from 'next/server'
import { cachedFetch, TTL } from '@/lib/cache'
import {
  generateMockLightning,
  generateMockStorms,
  generateMockVolcanoes,
} from '@/lib/unrest/mock-data'
import { Earthquake } from '@/lib/unrest/types'

// ===========================================
// PLANETARY UNREST API
// ===========================================
// Aggregates earthquake, lightning, storm, and volcano data
// Uses Vercel KV caching - earthquake data is near-realtime
// ===========================================

interface UnrestData {
  lightning: ReturnType<typeof generateMockLightning>['strikes']
  lightningStats: ReturnType<typeof generateMockLightning>['stats']
  earthquakes: Earthquake[]
  earthquakeStats: {
    count: number
    largest: Earthquake | null
  }
  storms: ReturnType<typeof generateMockStorms>
  stormStats: {
    count: number
    strongest: ReturnType<typeof generateMockStorms>[0] | null
  }
  volcanoes: ReturnType<typeof generateMockVolcanoes>
  volcanoStats: {
    elevated: number
    red: number
  }
  lastUpdated: string
}

const CACHE_KEY = 'api:unrest:combined'

export async function GET() {
  try {
    const { data, cacheStatus } = await cachedFetch<UnrestData>({
      key: CACHE_KEY,
      ttl: TTL.FAST, // 60 seconds - earthquake data updates frequently
      fetcher: async () => {
        // Fetch real earthquake data from USGS
        let earthquakes: Earthquake[] = []
        try {
          const eqResponse = await fetch(
            'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson',
            {
              headers: {
                'User-Agent': 'MXWLL/1.0 (https://mxwll.io)',
              },
            }
          )

          if (eqResponse.ok) {
            const eqData = await eqResponse.json()
            earthquakes = eqData.features.map((feature: any) => ({
              id: feature.id,
              lat: feature.geometry.coordinates[1],
              lng: feature.geometry.coordinates[0],
              depth: feature.geometry.coordinates[2],
              magnitude: feature.properties.mag,
              place: feature.properties.place,
              time: feature.properties.time,
              url: feature.properties.url,
            }))
          }
        } catch (err) {
          console.error('[api/unrest] Error fetching USGS data:', err)
        }

        // Get mock data for other sources (until we connect real APIs)
        const lightning = generateMockLightning()
        const storms = generateMockStorms()
        const volcanoes = generateMockVolcanoes()

        return {
          lightning: lightning.strikes,
          lightningStats: lightning.stats,
          earthquakes,
          earthquakeStats: {
            count: earthquakes.length,
            largest:
              earthquakes.length > 0
                ? earthquakes.reduce((max, eq) => (eq.magnitude > max.magnitude ? eq : max), earthquakes[0])
                : null,
          },
          storms,
          stormStats: {
            count: storms.length,
            strongest:
              storms.length > 0
                ? storms.reduce(
                    (max, s) => ((s.category || 0) > (max.category || 0) ? s : max),
                    storms[0]
                  )
                : null,
          },
          volcanoes,
          volcanoStats: {
            elevated: volcanoes.filter((v) => v.alertLevel !== 'green').length,
            red: volcanoes.filter((v) => v.alertLevel === 'red').length,
          },
          lastUpdated: new Date().toISOString(),
        }
      },
    })

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Cache-Status': cacheStatus,
      },
    })
  } catch (error) {
    console.error('[api/unrest] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch map data', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
