import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { cachedFetch, TTL } from '@/lib/cache'

// ===========================================
// APOD API ROUTE
// ===========================================
// Proxies NASA APOD API with Vercel KV caching
// Cache TTL: 1 hour for today, 6 hours for past dates
// ===========================================

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

// APOD started on June 16, 1995
const APOD_START_DATE = '1995-06-16'

async function fetchAPOD(requestedDate: string): Promise<APODResponse> {
  // Use NASA API key from environment, fall back to DEMO_KEY
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY'

  const response = await fetchWithTimeout(
    `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${requestedDate}`,
    { cache: 'no-store' }
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('NOT_FOUND')
    }
    throw new Error(`NASA API error: ${response.status}`)
  }

  const data = await response.json()

  return {
    date: data.date,
    title: data.title,
    explanation: data.explanation,
    url: data.url,
    hdurl: data.hdurl,
    mediaType: data.media_type === 'video' ? 'video' : 'image',
    copyright: data.copyright?.trim(),
    nasaUrl: `https://apod.nasa.gov/apod/ap${data.date.replace(/-/g, '').slice(2)}.html`,
  }
}

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

  // Use shorter TTL for today's APOD, longer for historical
  const isToday = requestedDate === today
  const ttl = isToday ? TTL.HOURLY : TTL.DAILY

  try {
    const { data, cacheStatus, cacheAge } = await cachedFetch({
      key: `apod:${requestedDate}`,
      ttl,
      fetcher: () => fetchAPOD(requestedDate),
    })

    const headers: Record<string, string> = { 'X-Cache': cacheStatus }
    if (cacheAge !== undefined) {
      headers['X-Cache-Age'] = String(cacheAge)
    }

    return NextResponse.json(data, { headers })

  } catch (error) {
    console.error('APOD API error:', error)

    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return NextResponse.json(
        { error: 'No APOD available for this date' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch APOD' },
      { status: 500 }
    )
  }
}
