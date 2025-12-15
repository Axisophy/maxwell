import { NextResponse } from 'next/server'

// James Webb Space Telescope latest images
export async function GET() {
  try {
    // STScI MAST archive for JWST images - matching widget's expected format
    const images = [
      {
        id: 'weic2216a',
        title: 'Cosmic Cliffs in Carina Nebula',
        description: 'Star-forming region NGC 3324 captured in infrared light, revealing previously hidden stellar nurseries.',
        date: '2024-07-12',
        imageUrl: 'https://stsci-opo.org/STScI-01G7JJADTH90FR98AKKJFKSS0B.png',
        thumbnailUrl: 'https://stsci-opo.org/STScI-01G7JJADTH90FR98AKKJFKSS0B.png',
        instrument: 'NIRCam',
        ra: '10h 37m 19s',
        dec: '-58° 37\' 20"',
        distance: '7,600 light-years'
      },
      {
        id: 'weic2215a',
        title: 'Pillars of Creation',
        description: 'Towering columns of interstellar gas and dust in the Eagle Nebula, a site of new star formation.',
        date: '2024-10-19',
        imageUrl: 'https://stsci-opo.org/STScI-01GFNQB7T9X6SNXQRK5D8FA8M9.png',
        thumbnailUrl: 'https://stsci-opo.org/STScI-01GFNQB7T9X6SNXQRK5D8FA8M9.png',
        instrument: 'NIRCam',
        ra: '18h 18m 48s',
        dec: '-13° 49\' 52"',
        distance: '6,500 light-years'
      },
      {
        id: 'weic2214a',
        title: 'Southern Ring Nebula',
        description: 'A planetary nebula surrounding a dying star, revealing intricate shells of gas.',
        date: '2024-07-12',
        imageUrl: 'https://stsci-opo.org/STScI-01G7KFCQ6CN6B6S5T3H5V7T55V.png',
        thumbnailUrl: 'https://stsci-opo.org/STScI-01G7KFCQ6CN6B6S5T3H5V7T55V.png',
        instrument: 'MIRI',
        ra: '10h 07m 01s',
        dec: '-40° 26\' 11"',
        distance: '2,500 light-years'
      }
    ]

    const mockData = {
      timestamp: new Date().toISOString(),
      images,
      totalReleases: 142,
      missionDay: 1087
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
