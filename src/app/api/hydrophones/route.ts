import { NextResponse } from 'next/server'

// Ocean hydrophone network data - matching OceanHydrophones widget expected format
export async function GET() {
  try {
    const now = new Date()

    // Generate recent sound events
    const recentEvents = [
      {
        id: 'evt-1',
        type: 'whale' as const,
        frequency: '15-25 Hz',
        timestamp: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
        duration: 8,
        intensity: 72,
        source: 'Blue whale (B. musculus)'
      },
      {
        id: 'evt-2',
        type: 'ship' as const,
        frequency: '50-150 Hz',
        timestamp: new Date(now.getTime() - 8 * 60 * 1000).toISOString(),
        duration: 120,
        intensity: 45,
        source: 'Container vessel'
      },
      {
        id: 'evt-3',
        type: 'whale' as const,
        frequency: '100-400 Hz',
        timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        duration: 4,
        intensity: 58,
        source: 'Humpback song'
      },
      {
        id: 'evt-4',
        type: 'rain' as const,
        frequency: '1-10 kHz',
        timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        duration: 300,
        intensity: 25,
        source: 'Surface precipitation'
      }
    ]

    const mockData = {
      timestamp: now.toISOString(),
      station: {
        id: 'MBARI-1',
        name: 'Monterey Canyon',
        location: 'California, USA',
        depth: 890,
        lat: 36.7,
        lon: -122.1,
        status: 'recording' as const
      },
      recentEvents,
      currentAmplitude: 0.42,
      dominantFrequency: 45,
      noiseFloor: 0.15
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Hydrophones API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hydrophone data' },
      { status: 500 }
    )
  }
}
