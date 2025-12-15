import { NextResponse } from 'next/server'

// NASA Mars Rover photos - matching widget's expected format
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roverName = searchParams.get('rover') || 'perseverance'

    const images = [
      {
        id: 1234567,
        sol: 1247,
        earthDate: '2024-12-10',
        camera: { name: 'NAVCAM_LEFT', fullName: 'Navigation Camera - Left' },
        imgSrc: 'https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/01247/ids/edr/browse/ncam/NLF_1247_0000000000_000ECM_N0000000000000000_00_0LLJ01.png'
      },
      {
        id: 1234568,
        sol: 1247,
        earthDate: '2024-12-10',
        camera: { name: 'FHAZ', fullName: 'Front Hazard Avoidance Camera' },
        imgSrc: 'https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/01247/ids/edr/browse/fcam/FLF_1247_0000000000_000ECM_N0000000000000000_00_0LLJ01.png'
      },
      {
        id: 1234569,
        sol: 1247,
        earthDate: '2024-12-10',
        camera: { name: 'MAST', fullName: 'Mast Camera' },
        imgSrc: 'https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/01247/ids/edr/browse/zcam/ZL0_1247_0000000000_000ECM_N0000000000000000_00_0LLJ01.png'
      }
    ]

    const mockData = {
      timestamp: new Date().toISOString(),
      rover: {
        name: roverName === 'perseverance' ? 'Perseverance' : 'Curiosity',
        landingDate: roverName === 'perseverance' ? '2021-02-18' : '2012-08-06',
        launchDate: roverName === 'perseverance' ? '2020-07-30' : '2011-11-26',
        status: 'active',
        maxSol: 1247,
        totalPhotos: 892456
      },
      images,
      currentSol: 1247
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
