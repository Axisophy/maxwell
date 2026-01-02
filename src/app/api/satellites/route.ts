import { NextResponse } from 'next/server'

// CelesTrak TLE endpoints (free, no auth required)
const TLE_SOURCES = {
  stations: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle',
  gps: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle',
  weather: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=tle',
  science: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=science&FORMAT=tle',
  starlink: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle',
  active: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle',
} as const

type ConstellationType = keyof typeof TLE_SOURCES

// In-memory cache with timestamps
const cache: Record<string, { data: string; timestamp: number }> = {}
const CACHE_TTL = 60 * 60 * 1000 // 1 hour - TLE data doesn't change that frequently

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

    for (const group of validGroups) {
      // Check cache
      const cached = cache[group]
      const now = Date.now()

      let tleData: string

      if (cached && now - cached.timestamp < CACHE_TTL) {
        tleData = cached.data
      } else {
        // Fetch fresh data
        const response = await fetch(TLE_SOURCES[group], {
          headers: {
            'User-Agent': 'MXWLL-Satellite-Tracker/1.0',
          },
        })

        if (!response.ok) {
          console.error(`Failed to fetch ${group}: ${response.status}`)
          continue
        }

        tleData = await response.text()
        cache[group] = { data: tleData, timestamp: now }
      }

      // Parse TLE data
      results[group] = parseTLE(tleData, group)
    }

    return NextResponse.json({
      satellites: results,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Satellite API error:', error)
    return NextResponse.json({ error: 'Failed to fetch satellite data' }, { status: 500 })
  }
}

interface ParsedSatellite {
  name: string
  noradId: string
  line1: string
  line2: string
  group: string
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
