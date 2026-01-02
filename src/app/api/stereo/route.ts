import { NextRequest, NextResponse } from 'next/server'

// ===========================================
// STEREO IMAGE PROXY
// ===========================================
// Proxies STEREO satellite images to handle CORS
// Supports both beacon (near real-time) and browse imagery
// ===========================================

const STEREO_BASE_URLS = {
  beacon: 'https://stereo-ssc.nascom.nasa.gov/beacon/beacon_secchi/latest_256',
  browse: 'https://stereo-ssc.nascom.nasa.gov/browse',
}

// Allowed image types and sizes
const ALLOWED_IMAGES = [
  'ahead_euvi_195_latest.jpg',
  'ahead_euvi_171_latest.jpg',
  'ahead_euvi_284_latest.jpg',
  'ahead_euvi_304_latest.jpg',
  'behind_euvi_195_latest.jpg',
  'behind_euvi_171_latest.jpg',
  'behind_euvi_284_latest.jpg',
  'behind_euvi_304_latest.jpg',
  'ahead_cor1_latest.jpg',
  'behind_cor1_latest.jpg',
  'ahead_cor2_latest.jpg',
  'behind_cor2_latest.jpg',
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const image = searchParams.get('image')

  // Validate image parameter
  if (!image || !ALLOWED_IMAGES.includes(image)) {
    return NextResponse.json(
      { error: 'Invalid or missing image parameter' },
      { status: 400 }
    )
  }

  // Construct the full URL
  const imageUrl = `${STEREO_BASE_URLS.beacon}/${image}`

  try {
    const response = await fetch(imageUrl, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      // Try alternate beacon URL format if primary fails
      const altUrl = imageUrl.replace('latest_256', 'latest_512')
      const altResponse = await fetch(altUrl, {
        next: { revalidate: 300 },
      })

      if (!altResponse.ok) {
        return NextResponse.json(
          { error: 'Image not available' },
          { status: 404 }
        )
      }

      const altBuffer = await altResponse.arrayBuffer()
      return new NextResponse(altBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=300',
          'X-Image-Source': 'stereo-beacon-alt',
        },
      })
    }

    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=300',
        'X-Image-Source': 'stereo-beacon',
      },
    })
  } catch (error) {
    console.error('Error fetching STEREO image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch STEREO image' },
      { status: 500 }
    )
  }
}
