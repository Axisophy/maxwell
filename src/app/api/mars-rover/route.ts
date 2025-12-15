import { NextResponse } from 'next/server'

// NASA Mars Rover photos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rover = searchParams.get('rover') || 'perseverance'

    const mockData = {
      timestamp: new Date().toISOString(),
      rover: rover,
      sol: 1247, // Mars day
      earthDate: '2024-12-10',
      photos: [
        {
          id: 1234567,
          sol: 1247,
          camera: 'NAVCAM_LEFT',
          imgSrc: 'https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/01247/ids/edr/browse/ncam/NLF_1247_0000000000_000ECM_N0000000000000000_00_0LLJ01.png',
          earthDate: '2024-12-10'
        },
        {
          id: 1234568,
          sol: 1247,
          camera: 'FRONT_HAZCAM_LEFT',
          imgSrc: 'https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/01247/ids/edr/browse/fcam/FLF_1247_0000000000_000ECM_N0000000000000000_00_0LLJ01.png',
          earthDate: '2024-12-10'
        }
      ],
      totalPhotos: 892456,
      manifest: {
        name: rover === 'perseverance' ? 'Perseverance' : 'Curiosity',
        landingDate: rover === 'perseverance' ? '2021-02-18' : '2012-08-06',
        status: 'active',
        maxSol: 1247,
        totalPhotos: 892456
      },
      source: 'NASA Mars Rover API'
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Mars Rover API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Mars rover data' },
      { status: 500 }
    )
  }
}
