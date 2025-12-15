import { NextResponse } from 'next/server'

// NASA FIRMS API for active fire data
export async function GET() {
  try {
    // Generate mock fire detections matching widget's expected format
    const fires = [
      { id: 'f1', lat: 34.05, lon: -118.24, brightness: 380, confidence: 'high' as const, frp: 45.2, satellite: 'VIIRS', timestamp: new Date().toISOString(), region: 'North America' },
      { id: 'f2', lat: -23.55, lon: -46.63, brightness: 365, confidence: 'nominal' as const, frp: 38.5, satellite: 'MODIS', timestamp: new Date().toISOString(), region: 'South America' },
      { id: 'f3', lat: -25.87, lon: 135.21, brightness: 398, confidence: 'high' as const, frp: 52.1, satellite: 'VIIRS', timestamp: new Date().toISOString(), region: 'Australia' },
      { id: 'f4', lat: 10.5, lon: 20.3, brightness: 342, confidence: 'nominal' as const, frp: 28.4, satellite: 'MODIS', timestamp: new Date().toISOString(), region: 'Africa' },
      { id: 'f5', lat: 55.2, lon: 92.1, brightness: 355, confidence: 'high' as const, frp: 35.8, satellite: 'VIIRS', timestamp: new Date().toISOString(), region: 'Asia' },
    ]

    const byRegion: Record<string, number> = {
      'North America': 234,
      'South America': 456,
      'Europe': 45,
      'Africa': 312,
      'Asia': 178,
      'Australia': 89,
    }

    const mockData = {
      timestamp: new Date().toISOString(),
      fires,
      totalFires: 1314,
      byRegion,
      largestFire: fires[2], // Australia fire
      recentHours: 24,
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Fires API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fire data' },
      { status: 500 }
    )
  }
}
