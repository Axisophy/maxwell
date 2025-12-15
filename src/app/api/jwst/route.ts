import { NextResponse } from 'next/server'

// James Webb Space Telescope latest images
export async function GET() {
  try {
    // STScI MAST archive for JWST images
    const mockData = {
      timestamp: new Date().toISOString(),
      latestImage: {
        id: 'jw02731-o001',
        title: 'Cosmic Cliffs in Carina Nebula',
        description: 'Star-forming region NGC 3324 captured in infrared light',
        date: '2024-07-12',
        imageUrl: 'https://stsci-opo.org/STScI-01G7JJADTH90FR98AKKJFKSS0B.png',
        instrument: 'NIRCam',
        filters: ['F090W', 'F187N', 'F200W', 'F335M', 'F444W'],
        target: 'NGC 3324'
      },
      recentImages: [
        { id: 'jw01234', title: 'Pillars of Creation', date: '2024-10-19' },
        { id: 'jw01567', title: 'Southern Ring Nebula', date: '2024-07-12' },
        { id: 'jw01890', title: "Stephan's Quintet", date: '2024-07-12' }
      ],
      totalObservations: 4521,
      source: 'STScI MAST Archive'
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('JWST API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch JWST data' },
      { status: 500 }
    )
  }
}
