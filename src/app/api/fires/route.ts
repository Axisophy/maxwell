import { NextRequest, NextResponse } from 'next/server'

// NASA FIRMS API for active fire data
// Note: Real implementation would use NASA FIRMS API:
// https://firms.modaps.eosdis.nasa.gov/api/area/csv/{MAP_KEY}/{source}/{area}/{days}

type Confidence = 'high' | 'nominal' | 'low'

interface Fire {
  id: string
  lat: number
  lon: number
  brightness: number
  confidence: Confidence
  frp: number
  satellite: string
  timestamp: string
  region: string
}

// Generate realistic fire distribution
function generateFires(days: number, regionFilter: string): Fire[] {
  const regions: { name: string; bounds: { lat: [number, number]; lon: [number, number] }; baseCount: number }[] = [
    { name: 'North America', bounds: { lat: [25, 55], lon: [-125, -70] }, baseCount: 180 },
    { name: 'South America', bounds: { lat: [-35, 10], lon: [-80, -35] }, baseCount: 380 },
    { name: 'Europe', bounds: { lat: [35, 60], lon: [-10, 40] }, baseCount: 35 },
    { name: 'Africa', bounds: { lat: [-30, 35], lon: [-20, 55] }, baseCount: 520 },
    { name: 'Asia', bounds: { lat: [10, 55], lon: [60, 145] }, baseCount: 290 },
    { name: 'Australia', bounds: { lat: [-40, -10], lon: [115, 155] }, baseCount: 95 },
  ]

  const fires: Fire[] = []
  const now = new Date()
  const satellites = ['VIIRS', 'MODIS']
  const confidenceLevels: Confidence[] = ['high', 'nominal', 'low']

  const filteredRegions = regionFilter === 'all'
    ? regions
    : regions.filter(r => r.name.toLowerCase().replace(' ', '-') === regionFilter)

  filteredRegions.forEach(region => {
    // Scale count by days
    const count = Math.floor(region.baseCount * days * (0.8 + Math.random() * 0.4))

    for (let i = 0; i < count; i++) {
      const lat = region.bounds.lat[0] + Math.random() * (region.bounds.lat[1] - region.bounds.lat[0])
      const lon = region.bounds.lon[0] + Math.random() * (region.bounds.lon[1] - region.bounds.lon[0])
      const hoursAgo = Math.random() * days * 24
      const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)

      fires.push({
        id: `f${fires.length + 1}`,
        lat: parseFloat(lat.toFixed(4)),
        lon: parseFloat(lon.toFixed(4)),
        brightness: 300 + Math.floor(Math.random() * 150),
        confidence: confidenceLevels[Math.floor(Math.random() * 3)],
        frp: parseFloat((5 + Math.random() * 80).toFixed(1)),
        satellite: satellites[Math.floor(Math.random() * 2)],
        timestamp: timestamp.toISOString(),
        region: region.name,
      })
    }
  })

  // Sort by timestamp (most recent first)
  return fires.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '1', 10)
  const region = searchParams.get('region') || 'all'

  try {
    const fires = generateFires(Math.min(days, 10), region)

    // Calculate statistics
    const byRegion: Record<string, number> = {}
    fires.forEach(fire => {
      byRegion[fire.region] = (byRegion[fire.region] || 0) + 1
    })

    const largestFire = fires.reduce((max, fire) =>
      fire.frp > (max?.frp || 0) ? fire : max, fires[0] || null
    )

    const result = {
      timestamp: new Date().toISOString(),
      fires: fires.slice(0, 500), // Limit response size
      totalFires: fires.length,
      byRegion,
      largestFire,
      recentHours: days * 24,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Fires API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fire data' },
      { status: 500 }
    )
  }
}

export const revalidate = 300 // Revalidate every 5 minutes
