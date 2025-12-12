// ===========================================
// VERCEL KV CACHE UTILITY
// ===========================================
// Shared caching layer using Vercel KV for API routes
// Provides stale-while-revalidate pattern with TTL

import { kv } from '@vercel/kv'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

interface CachedFetchOptions<T> {
  /** Unique cache key */
  key: string
  /** TTL in seconds */
  ttl: number
  /** Function to fetch fresh data */
  fetcher: () => Promise<T>
  /** Optional stale TTL - how long to keep stale data for fallback (default: 7 days) */
  staleTtl?: number
}

interface CachedFetchResult<T> {
  data: T
  cacheStatus: 'HIT' | 'MISS' | 'STALE'
  cacheAge?: number
}

/**
 * Fetch data with Vercel KV caching
 *
 * Behavior:
 * 1. Check cache first - return if fresh
 * 2. On cache miss/stale, call fetcher
 * 3. Store fresh result with TTL
 * 4. If fetcher fails, return stale data if available
 *
 * @throws Error if fetcher fails and no cached data exists
 */
export async function cachedFetch<T>({
  key,
  ttl,
  fetcher,
  staleTtl = 7 * 24 * 60 * 60 // 7 days default
}: CachedFetchOptions<T>): Promise<CachedFetchResult<T>> {
  const cacheKey = `cache:${key}`

  try {
    // Check cache first
    const cached = await kv.get<CacheEntry<T>>(cacheKey)

    if (cached) {
      const age = Math.round((Date.now() - cached.timestamp) / 1000)
      const isFresh = age < ttl

      if (isFresh) {
        return {
          data: cached.data,
          cacheStatus: 'HIT',
          cacheAge: age
        }
      }

      // Cache exists but is stale - try to refresh
      try {
        const freshData = await fetcher()
        await setCache(cacheKey, freshData, staleTtl)

        return {
          data: freshData,
          cacheStatus: 'MISS'
        }
      } catch (fetchError) {
        // Fetcher failed, return stale data
        console.warn(`Cache refresh failed for ${key}, using stale data:`, fetchError)
        return {
          data: cached.data,
          cacheStatus: 'STALE',
          cacheAge: age
        }
      }
    }

    // No cache - fetch fresh
    const freshData = await fetcher()
    await setCache(cacheKey, freshData, staleTtl)

    return {
      data: freshData,
      cacheStatus: 'MISS'
    }

  } catch (error) {
    // KV error - try fetcher directly
    console.error(`KV error for ${key}:`, error)
    const freshData = await fetcher()

    // Try to cache it anyway
    try {
      await setCache(cacheKey, freshData, staleTtl)
    } catch {
      // Ignore cache write errors
    }

    return {
      data: freshData,
      cacheStatus: 'MISS'
    }
  }
}

/**
 * Set cache entry with TTL
 */
async function setCache<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now()
  }
  await kv.set(key, entry, { ex: ttlSeconds })
}

/**
 * Manually invalidate a cache key
 */
export async function invalidateCache(key: string): Promise<void> {
  await kv.del(`cache:${key}`)
}

/**
 * Get cache entry without fetching (for debugging)
 */
export async function getCacheEntry<T>(key: string): Promise<CacheEntry<T> | null> {
  return kv.get<CacheEntry<T>>(`cache:${key}`)
}

// ===========================================
// TTL PRESETS (in seconds)
// ===========================================

export const TTL = {
  // Real-time data - refresh frequently
  REALTIME: 30,           // 30 seconds - ISS position, solar wind
  FAST: 60,               // 1 minute - earthquakes, aurora

  // Slow-changing data - moderate refresh
  MODERATE: 5 * 60,       // 5 minutes - energy mix, air quality
  SLOW: 15 * 60,          // 15 minutes - CO2, nuclear output

  // Rare updates - long cache
  HOURLY: 60 * 60,        // 1 hour - launches, APOD
  DAILY: 6 * 60 * 60,     // 6 hours - static reference data
} as const
