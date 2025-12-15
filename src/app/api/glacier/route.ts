import { NextResponse } from 'next/server'

// World Glacier Monitoring Service data
export async function GET() {
  try {
    const mockData = {
      timestamp: new Date().toISOString(),
      globalStats: {
        totalGlaciers: 198000,
        monitoredGlaciers: 450,
        avgMassBalance: -0.89, // meters water equivalent
        trend: 'declining',
        totalIceLoss: 267, // Gt per year
        seaLevelContribution: 0.74 // mm per year
      },
      featuredGlaciers: [
        {
          name: 'Mer de Glace',
          location: 'French Alps',
          massBalance: -1.2,
          status: 'retreating',
          retreatRate: 30 // meters per year
        },
        {
          name: 'Vatnajökull',
          location: 'Iceland',
          massBalance: -0.8,
          status: 'retreating',
          retreatRate: 45
        },
        {
          name: 'Perito Moreno',
          location: 'Argentina',
          massBalance: -0.3,
          status: 'stable',
          retreatRate: 5
        }
      ],
      lastUpdate: new Date().toISOString(),
      source: 'WGMS'
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
