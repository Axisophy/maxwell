import { NextResponse } from 'next/server'

// IRIS seismograph network data
export async function GET() {
  try {
    // Generate synthetic seismograph waveform data
    const generateWaveform = (noise: number = 0.1) => {
      const points: number[] = []
      for (let i = 0; i < 100; i++) {
        const base = Math.sin(i * 0.1) * 0.3
        const highFreq = Math.sin(i * 0.5) * 0.1
        const randomNoise = (Math.random() - 0.5) * noise
        points.push(base + highFreq + randomNoise)
      }
      return points
    }

    const mockData = {
      timestamp: new Date().toISOString(),
      stations: [
        {
          id: 'IU.ANMO',
          name: 'Albuquerque, NM',
          network: 'GSN',
          lat: 34.9459,
          lng: -106.4572,
          waveform: generateWaveform(0.15),
          status: 'online',
          lastData: new Date().toISOString()
        },
        {
          id: 'II.BFO',
          name: 'Black Forest, Germany',
          network: 'GSN',
          lat: 48.3319,
          lng: 8.3311,
          waveform: generateWaveform(0.08),
          status: 'online',
          lastData: new Date().toISOString()
        },
        {
          id: 'IU.KEV',
          name: 'Kevo, Finland',
          network: 'GSN',
          lat: 69.7565,
          lng: 27.0035,
          waveform: generateWaveform(0.12),
          status: 'online',
          lastData: new Date().toISOString()
        },
        {
          id: 'II.TAU',
          name: 'Tasmania, Australia',
          network: 'GSN',
          lat: -42.9099,
          lng: 147.3204,
          waveform: generateWaveform(0.1),
          status: 'online',
          lastData: new Date().toISOString()
        }
      ],
      recentQuakes: 12,
      source: 'IRIS DMC'
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
