import { NextResponse } from 'next/server'

// National Grid ESO provides frequency data
// For now, simulate realistic frequency values (50Hz ± small deviations)

export async function GET() {
  try {
    // In production, this would fetch from National Grid ESO API
    // https://api.nationalgrideso.com/api/3/action/datastore_search?resource_id=...

    // Simulate realistic UK grid frequency
    // Normal operation: 49.95 - 50.05 Hz
    // Stressed: 49.8 - 49.95 or 50.05 - 50.2 Hz
    const baseFrequency = 50.0
    const variation = (Math.random() - 0.5) * 0.08 // ±0.04 Hz typical
    const frequency = baseFrequency + variation

    // Determine status based on frequency deviation
    let status: 'normal' | 'low' | 'high' | 'critical' = 'normal'
    const deviation = Math.abs(frequency - 50)

    if (deviation > 0.2) {
      status = 'critical'
    } else if (deviation > 0.1) {
      status = frequency < 50 ? 'low' : 'high'
    }

    const data = {
      frequency: Number(frequency.toFixed(3)),
      status,
      timestamp: new Date().toISOString(),
      region: 'UK',
      nominal: 50.0,
      unit: 'Hz',
      // Historical context
      range: {
        min: 49.5,  // Absolute minimum before load shedding
        max: 50.5,  // Absolute maximum
        normalMin: 49.95,
        normalMax: 50.05,
      }
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('Failed to fetch grid frequency:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch grid frequency',
        frequency: 50.0,
        status: 'normal',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
