import { NextResponse } from 'next/server'
import { cachedFetch, TTL } from '@/lib/cache'

// ===========================================
// SATELLITE TLE API
// ===========================================
// Data source: CelesTrak (free, no auth required)
// Uses Vercel KV caching - TLEs update ~daily
// ===========================================

const TLE_SOURCES = {
  stations: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle',
  gps: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle',
  weather: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=tle',
  science: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=science&FORMAT=tle',
  starlink: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle',
  active: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle',
} as const

type ConstellationType = keyof typeof TLE_SOURCES

interface ParsedSatellite {
  name: string
  noradId: string
  line1: string
  line2: string
  group: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const groups = searchParams.get('groups')?.split(',') as ConstellationType[] | undefined

  if (!groups || groups.length === 0) {
    return NextResponse.json({ error: 'No groups specified' }, { status: 400 })
  }

  // Validate groups
  const validGroups = groups.filter((g) => g in TLE_SOURCES)
  if (validGroups.length === 0) {
    return NextResponse.json(
      { error: 'No valid groups specified', valid: Object.keys(TLE_SOURCES) },
      { status: 400 }
    )
  }

  try {
    const results: Record<string, ParsedSatellite[]> = {}

    // Fetch each group with caching
    for (const group of validGroups) {
      try {
        const { data: tleData } = await cachedFetch({
          key: `api:satellites:tle-${group}`,
          ttl: TTL.HOURLY,
          fetcher: async () => {
            const response = await fetch(TLE_SOURCES[group], {
              headers: {
                'User-Agent': 'MXWLL/1.0 (https://mxwll.io)',
              },
            })

            if (!response.ok) {
              throw new Error(`CelesTrak responded with ${response.status}`)
            }

            return response.text()
          },
        })

        // Parse TLE data
        results[group] = parseTLE(tleData, group)
      } catch (err) {
        console.error(`[api/satellites] Failed to fetch ${group}:`, err)
        // Continue with other groups
      }
    }

    return NextResponse.json(
      {
        satellites: results,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    )
  } catch (error) {
    console.error('[api/satellites] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch satellite data', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}

function parseTLE(tleData: string, group: string): ParsedSatellite[] {
  const lines = tleData.trim().split('\n')
  const satellites: ParsedSatellite[] = []

  // TLE format: 3 lines per satellite (name, line1, line2)
  for (let i = 0; i < lines.length - 2; i += 3) {
    const name = lines[i].trim()
    const line1 = lines[i + 1]?.trim()
    const line2 = lines[i + 2]?.trim()

    // Validate TLE lines
    if (!line1?.startsWith('1 ') || !line2?.startsWith('2 ')) {
      continue
    }

    // Extract NORAD ID from line 1 (columns 3-7)
    const noradId = line1.substring(2, 7).trim()

    satellites.push({
      name,
      noradId,
      line1,
      line2,
      group,
    })
  }

  return satellites
}
