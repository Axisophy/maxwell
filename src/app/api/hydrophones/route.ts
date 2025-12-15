import { NextResponse } from 'next/server'

// Ocean hydrophone network data (ONC/MBARI)
export async function GET() {
  try {
    // Generate synthetic audio waveform
    const generateWaveform = () => {
      const points: number[] = []
      for (let i = 0; i < 200; i++) {
        const ambient = Math.sin(i * 0.05) * 0.2
        const whale = i > 80 && i < 120 ? Math.sin((i - 80) * 0.3) * Math.exp(-Math.pow(i - 100, 2) / 200) : 0
        const noise = (Math.random() - 0.5) * 0.1
        points.push(ambient + whale * 0.8 + noise)
      }
      return points
    }

    const mockData = {
      timestamp: new Date().toISOString(),
      stations: [
        {
          id: 'MBARI-1',
          name: 'Monterey Canyon',
          location: 'California, USA',
          depth: 890,
          lat: 36.7,
          lng: -122.1,
          status: 'online',
          waveform: generateWaveform(),
          recentDetections: ['Blue whale call', 'Ship noise'],
          temperature: 4.2
        },
        {
          id: 'ONC-NEP',
          name: 'Neptune Observatory',
          location: 'Vancouver Island',
          depth: 2660,
          lat: 48.3,
          lng: -126.1,
          status: 'online',
          waveform: generateWaveform(),
          recentDetections: ['Orca vocalizations'],
          temperature: 1.8
        },
        {
          id: 'ALOHA',
          name: 'Station ALOHA',
          location: 'Hawaii',
          depth: 4750,
          lat: 22.75,
          lng: -158.0,
          status: 'online',
          waveform: generateWaveform(),
          recentDetections: ['Humpback songs'],
          temperature: 1.5
        }
      ],
      totalDetectionsToday: 47,
      source: 'ONC/MBARI'
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
