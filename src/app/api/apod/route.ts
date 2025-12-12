import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'

// ===========================================
// APOD API ROUTE
// ===========================================
// Proxies NASA APOD API with server-side caching
// Cache TTL: Until midnight UTC (APOD updates daily)
// ===========================================

interface CacheEntry {
  data: APODResponse
  timestamp: number
  expiresAt: number
}

interface APODResponse {
  date: string
  title: string
  explanation: string
  url: string
  hdurl?: string
  mediaType: 'image' | 'video'
  copyright?: string
  nasaUrl: string
}

// Cache keyed by date string (YYYY-MM-DD)
const cache = new Map<string, CacheEntry>()

// Calculate milliseconds until next midnight UTC
function getMillisUntilMidnightUTC(): number {
  const now = new Date()
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  ))
  return tomorrow.getTime() - now.getTime()
}

// For past dates, cache for 7 days (they never change)
const PAST_DATE_TTL = 7 * 24 * 60 * 60 * 1000

// APOD started on June 16, 1995
const APOD_START_DATE = '1995-06-16'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Get date parameter - default to today
  const dateParam = searchParams.get('date')
  const today = new Date().toISOString().split('T')[0]
  const requestedDate = dateParam || today

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
    return NextResponse.json(
      { error: 'Invalid date format. Use YYYY-MM-DD' },
      { status: 400 }
    )
  }

  // Validate date is a real date and within valid range
  const parsedDate = new Date(requestedDate + 'T00:00:00Z')
  if (isNaN(parsedDate.getTime())) {
    return NextResponse.json(
      { error: 'Invalid date' },
      { status: 400 }
    )
  }

  if (requestedDate < APOD_START_DATE) {
    return NextResponse.json(
      { error: `Date must be ${APOD_START_DATE} or later (when APOD started)` },
      { status: 400 }
    )
  }

  if (requestedDate > today) {
    return NextResponse.json(
      { error: 'Date cannot be in the future' },
      { status: 400 }
    )
  }

  // Check cache
  const cached = cache.get(requestedDate)
  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json(cached.data, {
      headers: {
        'X-Cache': 'HIT',
        'X-Cache-Expires': new Date(cached.expiresAt).toISOString(),
      },
    })
  }
  
  try {
    // Use NASA API key from environment, fall back to DEMO_KEY
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY'
    
    const response = await fetchWithTimeout(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${requestedDate}`,
      { next: { revalidate: 3600 } } // Next.js cache hint
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'No APOD available for this date' },
          { status: 404 }
        )
      }
      throw new Error(`NASA API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Build clean response
    const result: APODResponse = {
      date: data.date,
      title: data.title,
      explanation: data.explanation,
      url: data.url,
      hdurl: data.hdurl,
      mediaType: data.media_type === 'video' ? 'video' : 'image',
      copyright: data.copyright?.trim(),
      nasaUrl: `https://apod.nasa.gov/apod/ap${data.date.replace(/-/g, '').slice(2)}.html`,
    }
    
    // Calculate cache expiry
    const isToday = requestedDate === today
    const expiresAt = isToday 
      ? Date.now() + getMillisUntilMidnightUTC()
      : Date.now() + PAST_DATE_TTL
    
    // Store in cache
    cache.set(requestedDate, {
      data: result,
      timestamp: Date.now(),
      expiresAt,
    })
    
    // Clean old cache entries (keep last 30 days)
    if (cache.size > 30) {
      const sortedKeys = Array.from(cache.keys()).sort()
      const toDelete = sortedKeys.slice(0, cache.size - 30)
      toDelete.forEach(key => cache.delete(key))
    }
    
    return NextResponse.json(result, {
      headers: {
        'X-Cache': 'MISS',
        'X-Cache-Expires': new Date(expiresAt).toISOString(),
      },
    })
    
  } catch (error) {
    console.error('APOD API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch APOD' },
      { status: 500 }
    )
  }
}