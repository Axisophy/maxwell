# MXWLL API Standards

*Guidelines for building and maintaining API routes.*

**Last Updated:** January 2026

---

## Caching Strategy

### The Rule

**Always use Vercel KV via `cachedFetch`** - never in-memory caching.

Vercel serverless functions are ephemeral. In-memory caches (Map, objects, module-level variables) are lost on every cold start, making them effectively useless. Vercel KV persists across invocations.

### Implementation

```typescript
import { cachedFetch, TTL } from '@/lib/cache'

const data = await cachedFetch({
  key: 'api:route-name:data',  // Unique cache key
  ttl: TTL.MODERATE,           // Choose appropriate TTL
  fetcher: async () => {
    // Fetch logic - only runs on cache miss
    const response = await fetch('https://api.example.com/data')
    return response.json()
  },
})
```

### What NOT to Do

```typescript
// ❌ WRONG: In-memory cache
const cache = new Map()
if (cache.has('data')) return cache.get('data')

// ❌ WRONG: Module-level variable
let cachedData = null
if (cachedData) return cachedData

// ❌ WRONG: Mixing strategies
export const revalidate = 60  // Don't combine with cachedFetch
```

---

## TTL Guidelines

Choose TTL based on how frequently the upstream data changes and how time-sensitive it is for users.

| Preset | Duration | Use For |
|--------|----------|---------|
| `TTL.REALTIME` | 30 seconds | Ultra-real-time: ISS position, solar wind |
| `TTL.FAST` | 60 seconds | Real-time data: earthquakes, space weather |
| `TTL.MODERATE` | 5 minutes | Frequently updated: solar imagery, energy mix |
| `TTL.SLOW` | 15 minutes | Moderate updates: satellite positions, CO2 |
| `TTL.HOURLY` | 1 hour | Slow updates: TLE data, launches, volcano status |
| `TTL.DAILY` | 6 hours | Reference data: asteroid catalogues, static datasets |

### Decision Framework

1. How often does the source update? Don't cache longer than the source refresh rate.
2. How time-sensitive is the display? Real-time widgets need shorter TTL.
3. What's the API rate limit? Longer TTL reduces upstream calls.
4. Is stale data acceptable? For reference data, slightly stale is fine.

---

## Cache Key Naming

### Format

```
api:{route-path}:{data-identifier}
```

### Examples

```typescript
'api:satellites:tle-stations'      // TLE data for space stations
'api:satellites:tle-starlink'      // TLE data for Starlink
'api:space-weather:kp-index'       // Kp index data
'api:earthquakes:usgs-24h'         // USGS earthquakes, 24-hour window
'api:launches:upcoming'            // Upcoming launches
'api:unrest:combined'              // Combined unrest data
'api:volcanoes:active'             // Active volcanoes
```

### Rules

- Keep keys descriptive but concise
- Include parameters that differentiate cached data
- Use lowercase with hyphens
- Prefix with `api:` for API route caches

---

## Standard Route Pattern

```typescript
import { NextResponse } from 'next/server'
import { cachedFetch, TTL } from '@/lib/cache'

const CACHE_KEY = 'api:example:data'

export async function GET(request: Request) {
  try {
    const { data, cacheStatus } = await cachedFetch({
      key: CACHE_KEY,
      ttl: TTL.MODERATE,
      fetcher: async () => {
        const response = await fetch('https://external-api.com/data', {
          headers: {
            'User-Agent': 'MXWLL/1.0 (https://mxwll.io)',
          },
        })

        if (!response.ok) {
          throw new Error(`API responded with ${response.status}`)
        }

        return response.json()
      },
    })

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache-Status': cacheStatus,
      },
    })
  } catch (error) {
    console.error('[api/example] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
```

---

## Error Handling

### Requirements

1. **Wrap all external calls in try/catch**
2. **Log errors with route context** - prefix with `[api/route-name]`
3. **Return appropriate HTTP status codes**
4. **Include timestamp in error responses** for debugging

### Status Codes

| Code | When to Use |
|------|-------------|
| 200 | Success |
| 400 | Bad request (invalid parameters) |
| 404 | Resource not found |
| 429 | Rate limited (pass through from upstream) |
| 500 | Server error (our fault) |
| 502 | Bad gateway (upstream API failed) |
| 503 | Service unavailable (temporary) |

### Rate Limit Handling

```typescript
if (response.status === 429) {
  console.warn('[api/example] Rate limited by upstream API')
  return NextResponse.json(
    { error: 'Rate limited, please try again later' },
    { status: 429 }
  )
}
```

---

## Response Headers

### Standard Headers

```typescript
headers: {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  'X-Cache-Status': cacheStatus,  // HIT, MISS, or STALE
}
```

Adjust `s-maxage` based on your TTL:
- `TTL.FAST` → `s-maxage=60`
- `TTL.MODERATE` → `s-maxage=300`
- `TTL.SLOW` → `s-maxage=900`
- `TTL.HOURLY` → `s-maxage=3600`

### Optional Headers

```typescript
headers: {
  'X-Data-Source': 'NOAA SWPC',           // Identify upstream source
  'X-Data-Timestamp': data.updatedAt,     // When data was fetched
}
```

---

## External API Best Practices

### Always Include User-Agent

```typescript
const response = await fetch(url, {
  headers: {
    'User-Agent': 'MXWLL/1.0 (https://mxwll.io)',
  },
})
```

### Respect Rate Limits

- Check API documentation for limits
- Set TTL to avoid exceeding limits
- Handle 429 responses gracefully
- Consider implementing exponential backoff for critical routes

### Timeout Handling

```typescript
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

try {
  const response = await fetch(url, { signal: controller.signal })
  clearTimeout(timeout)
  // ...
} catch (error) {
  if (error.name === 'AbortError') {
    return NextResponse.json({ error: 'Request timeout' }, { status: 504 })
  }
  throw error
}
```

---

## Route Organisation

### File Structure

```
/src/app/api/
├── solar/
│   └── route.ts           # /api/solar
├── stereo/
│   └── route.ts           # /api/stereo
├── earthquakes/
│   └── route.ts           # /api/earthquakes
├── satellites/
│   └── route.ts           # /api/satellites
├── unrest/
│   ├── route.ts           # /api/unrest
│   └── seismic/
│       └── route.ts       # /api/unrest/seismic
└── space-weather/
    └── route.ts           # /api/space-weather
```

### Naming Conventions

- Use kebab-case for route paths: `/api/space-weather` not `/api/spaceWeather`
- Group related routes in folders
- Single `route.ts` per endpoint (Next.js App Router pattern)

---

## Testing Checklist

Before deploying a new or modified API route:

- [ ] Cache key is unique and follows naming convention
- [ ] TTL is appropriate for data type
- [ ] Error handling covers all failure modes
- [ ] Appropriate HTTP status codes returned
- [ ] No in-memory caching (check for Map, module variables)
- [ ] No `export const revalidate` mixed with `cachedFetch`
- [ ] User-Agent header included for external APIs
- [ ] Tested cache hit/miss behaviour
- [ ] Tested error scenarios
- [ ] No sensitive data in logs or error responses

---

## Current API Routes & Cache Keys

| Route | Data Source | TTL | Cache Key |
|-------|-------------|-----|-----------|
| `/api/solar` | NOAA SWPC | FAST | `api:solar:*` |
| `/api/stereo` | NASA STEREO | MODERATE | `api:stereo:*` |
| `/api/earthquakes` | USGS | FAST | `api:earthquakes:*` |
| `/api/satellites` | CelesTrak | HOURLY | `api:satellites:tle-{group}` |
| `/api/volcanoes` | Smithsonian GVP | HOURLY | `api:volcanoes:active` |
| `/api/unrest` | USGS + Mock | FAST | `api:unrest:combined` |
| `/api/unrest/seismic` | Mock (IRIS/FDSN) | FAST | `api:unrest:seismic` |
| `/api/space-weather` | NOAA SWPC | FAST | `api:space-weather:*` |
| `/api/uk-energy` | Carbon Intensity | FAST | `api:uk-energy:*` |
| `/api/iss` | wheretheiss.at | REALTIME | `api:iss:*` |
| `/api/launches` | Space Devs | MODERATE | `api:launches:*` |
| `/api/asteroids` | NASA JPL | MODERATE | `api:asteroids:*` |
| `/api/aurora` | NOAA SWPC | FAST | `api:aurora:*` |

---

*API Standards v1.0 - January 2026*
