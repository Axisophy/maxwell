import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'

// ===========================================
// DSCOVR EPIC API ROUTE
// ===========================================
// Fetches latest Earth image metadata from NASA DSCOVR EPIC
// Cache TTL: 1 hour (images update ~12-22 times per day)
// ===========================================

interface CacheEntry {
  data: EPICResponse
  timestamp: number
}

interface EPICImage {
  identifier: string
  date: string
  image: string
  caption: string
}

interface EPICResponse {
  image: {
    url: string
    date: string
    caption: string
  }
  timestamp: string
}

// Server-side cache
let cache: CacheEntry | null = null
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

// Parse EPIC date format and build image URL
function buildImageUrl(image: EPICImage): string {
  const dateStr = image.date.replace(' ', 'T')
  const date = new Date(dateStr)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  
  return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${image.image}.png`
}

// Format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr.replace(' ', 'T'))
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }) + ' UTC'
}

export async function GET() {
  // Check cache first
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: {
        'X-Cache': 'HIT',
        'X-Cache-Age': String(Math.round((Date.now() - cache.timestamp) / 1000)),
      },
    })
  }

  try {
    // First, get the list of available dates
    const datesResponse = await fetchWithTimeout(
      'https://epic.gsfc.nasa.gov/api/natural/all',
      { cache: 'no-store' }
    )

    if (!datesResponse.ok) {
      throw new Error(`EPIC dates API error: ${datesResponse.status}`)
    }

    const dates = await datesResponse.json()
    
    if (!dates || dates.length === 0) {
      throw new Error('No EPIC dates available')
    }

    // Get the most recent date
    const latestDateObj = dates[0]
    const latestDate = latestDateObj.date.split(' ')[0] // Just the YYYY-MM-DD part

    // Fetch images for that date
    const imagesResponse = await fetchWithTimeout(
      `https://epic.gsfc.nasa.gov/api/natural/date/${latestDate}`,
      { cache: 'no-store' }
    )

    if (!imagesResponse.ok) {
      throw new Error(`EPIC images API error: ${imagesResponse.status}`)
    }

    const images: EPICImage[] = await imagesResponse.json()

    if (!images || images.length === 0) {
      throw new Error('No EPIC images available')
    }

    // Get the most recent image
    const latestImage = images[images.length - 1]

    const data: EPICResponse = {
      image: {
        url: buildImageUrl(latestImage),
        date: formatDate(latestImage.date),
        caption: latestImage.caption || 'Earth from DSCOVR EPIC',
      },
      timestamp: new Date().toISOString(),
    }

    // Update cache
    cache = {
      data,
      timestamp: Date.now(),
    }

    return NextResponse.json(data, {
      headers: { 'X-Cache': 'MISS' },
    })

  } catch (error) {
    console.error('DSCOVR EPIC API error:', error)

    // Return stale cache if available
    if (cache) {
      return NextResponse.json(cache.data, {
        headers: {
          'X-Cache': 'STALE',
          'X-Cache-Age': String(Math.round((Date.now() - cache.timestamp) / 1000)),
        },
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch DSCOVR image' },
      { status: 500 }
    )
  }
}