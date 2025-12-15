import { NextResponse } from 'next/server'

// NASA FIRMS API for active fire data
export async function GET() {
  try {
    // For now, return representative mock data
    // Real implementation would use NASA FIRMS API
    const mockData = {
      timestamp: new Date().toISOString(),
      fires: [
        { lat: 34.05, lng: -118.24, brightness: 320, confidence: 85, region: 'California, USA' },
        { lat: -23.55, lng: -46.63, brightness: 305, confidence: 78, region: 'Brazil' },
        { lat: -33.87, lng: 151.21, brightness: 298, confidence: 82, region: 'Australia' },
        { lat: 51.5, lng: -0.12, brightness: 0, confidence: 0, region: 'UK' },
      ],
      totalActive: 1247,
      lastUpdate: new Date().toISOString(),
      source: 'NASA FIRMS'
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
