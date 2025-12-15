import { NextResponse } from 'next/server'

// Glacier and sea ice monitoring - matching GlacierWatch widget expected format
export async function GET() {
  try {
    const now = new Date()
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))

    // Arctic sea ice follows seasonal cycle - minimum in September (~3.5M km²), max in March (~15M km²)
    const arcticExtent = 9.5 + 5.5 * Math.cos((dayOfYear - 70) * Math.PI / 180)

    // Antarctic is opposite - min in February (~2.5M km²), max in September (~18M km²)
    const antarcticExtent = 10.5 + 7.5 * Math.cos((dayOfYear - 250) * Math.PI / 180)

    const mockData = {
      timestamp: new Date().toISOString(),
      date: now.toISOString().split('T')[0],
      arctic: {
        region: 'arctic' as const,
        extent: arcticExtent,
        anomaly: -1.35,
        trend: 'decreasing' as const,
        percentile: 18,
        minYear: 2012,
        maxYear: 1980
      },
      antarctic: {
        region: 'antarctic' as const,
        extent: antarcticExtent,
        anomaly: -0.42,
        trend: 'stable' as const,
        percentile: 35,
        minYear: 2023,
        maxYear: 2014
      },
      globalSeaIce: arcticExtent + antarcticExtent,
      globalAnomaly: -1.77,
      glaciers: [
        { name: 'Thwaites Glacier', location: 'West Antarctica', massBalance: -75, speedChange: 4.2, status: 'critical' as const },
        { name: 'Pine Island Glacier', location: 'West Antarctica', massBalance: -45, speedChange: 2.8, status: 'retreating' as const },
        { name: 'Jakobshavn Isbræ', location: 'Greenland', massBalance: -35, speedChange: 1.5, status: 'retreating' as const },
        { name: 'Helheim Glacier', location: 'Greenland', massBalance: -25, speedChange: 0.8, status: 'retreating' as const },
        { name: 'Petermann Glacier', location: 'Greenland', massBalance: -12, speedChange: 0.3, status: 'stable' as const },
      ],
      seaLevelContribution: 3.4
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Glacier API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch glacier data' },
      { status: 500 }
    )
  }
}
