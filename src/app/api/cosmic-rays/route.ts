import { NextResponse } from 'next/server'

interface NeutronStation {
  name: string
  location: string
  country: string
  altitude: number
  count: number
  baseline: number
  deviation: number
  status: 'online' | 'offline'
}

const STATIONS: NeutronStation[] = [
  { name: 'Oulu', location: '65.05°N, 25.47°E', country: 'Finland', altitude: 15, count: 6847, baseline: 6850, deviation: -0.04, status: 'online' },
  { name: 'Moscow', location: '55.47°N, 37.32°E', country: 'Russia', altitude: 200, count: 5234, baseline: 5240, deviation: -0.11, status: 'online' },
  { name: 'Newark', location: '39.68°N, 75.75°W', country: 'USA', altitude: 50, count: 3456, baseline: 3450, deviation: 0.17, status: 'online' },
  { name: 'Thule', location: '76.50°N, 68.70°W', country: 'Greenland', altitude: 26, count: 8912, baseline: 8900, deviation: 0.13, status: 'online' },
  { name: 'McMurdo', location: '77.85°S, 166.67°E', country: 'Antarctica', altitude: 48, count: 7234, baseline: 7200, deviation: 0.47, status: 'online' },
  { name: 'Jungfraujoch', location: '46.55°N, 7.98°E', country: 'Switzerland', altitude: 3570, count: 4123, baseline: 4100, deviation: 0.56, status: 'online' },
]

export async function GET() {
  try {
    // In production, fetch from NMDB: https://www.nmdb.eu/nest/

    // Add some variation to counts
    const stationsWithVariation = STATIONS.map(station => ({
      ...station,
      count: station.count + Math.floor((Math.random() - 0.5) * 50),
      deviation: Number(((Math.random() - 0.5) * 2).toFixed(2)),
    }))

    // Calculate global average
    const avgCount = Math.round(stationsWithVariation.reduce((sum, s) => sum + s.count, 0) / stationsWithVariation.length)
    const avgDeviation = Number((stationsWithVariation.reduce((sum, s) => sum + s.deviation, 0) / stationsWithVariation.length).toFixed(2))

    // Determine if there's a Forbush decrease (solar storm effect)
    const forbushDecrease = avgDeviation < -3

    const data = {
      stations: stationsWithVariation,
      globalAverage: {
        count: avgCount,
        deviation: avgDeviation,
        status: forbushDecrease ? 'Forbush decrease' : 'Normal',
      },
      solarCyclePhase: 'Ascending (Solar Cycle 25)',
      groundLevelEvents: 0,
      lastForbush: '2023-11-28',
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('Failed to fetch cosmic ray data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
