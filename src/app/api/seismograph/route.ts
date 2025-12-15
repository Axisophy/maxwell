import { NextResponse } from 'next/server'

// IRIS seismograph network data - matching SeismographGrid widget expected format
export async function GET() {
  try {
    // Generate realistic seismic waveform
    const generateWaveform = (amplitude: number, length: number = 200): number[] => {
      const waveform: number[] = []
      let value = 0
      let velocity = 0

      for (let i = 0; i < length; i++) {
        const noise = (Math.random() - 0.5) * amplitude * 0.3
        const event = Math.random() > 0.995 ? (Math.random() - 0.5) * amplitude * 2 : 0

        velocity += noise + event - velocity * 0.05
        value += velocity
        value *= 0.98

        waveform.push(value)
      }

      return waveform
    }

    const stations = [
      {
        code: 'IU.ANMO',
        name: 'Albuquerque',
        network: 'GSN',
        location: 'New Mexico, USA',
        lat: 34.9459,
        lon: -106.4572,
        waveform: generateWaveform(0.15),
        amplitude: 0.15,
        lastUpdate: new Date().toISOString(),
        status: 'quiet' as const
      },
      {
        code: 'II.BFO',
        name: 'Black Forest',
        network: 'GSN',
        location: 'Germany',
        lat: 48.3319,
        lon: 8.3311,
        waveform: generateWaveform(0.08),
        amplitude: 0.08,
        lastUpdate: new Date().toISOString(),
        status: 'quiet' as const
      },
      {
        code: 'IU.KEV',
        name: 'Kevo',
        network: 'GSN',
        location: 'Finland',
        lat: 69.7565,
        lon: 27.0035,
        waveform: generateWaveform(0.25),
        amplitude: 0.25,
        lastUpdate: new Date().toISOString(),
        status: 'active' as const
      },
      {
        code: 'II.TAU',
        name: 'Hobart',
        network: 'GSN',
        location: 'Tasmania, Australia',
        lat: -42.9099,
        lon: 147.3204,
        waveform: generateWaveform(0.1),
        amplitude: 0.1,
        lastUpdate: new Date().toISOString(),
        status: 'quiet' as const
      }
    ]

    const activeCount = stations.filter(s => s.status === 'active').length

    const mockData = {
      timestamp: new Date().toISOString(),
      stations,
      globalActivity: activeCount > 2 ? 'high' as const : activeCount > 0 ? 'moderate' as const : 'low' as const,
      recentQuakes: 12
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Seismograph API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch seismograph data' },
      { status: 500 }
    )
  }
}
