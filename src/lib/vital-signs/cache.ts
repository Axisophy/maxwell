// =============================================================================
// VITAL SIGNS CACHE UTILITY
// =============================================================================
// Vercel KV-backed cache with TTL and stale fallback
// Shared across serverless instances

import { kv } from '@vercel/kv'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

// TTL configuration (in seconds)
export const DATA_TTL = {
  // Real-time (cache briefly to prevent hammering)
  iss: 30,
  solarWind: 60,

  // Frequent updates
  earthquakes: 300,      // 5 minutes
  kpIndex: 1800,         // 30 minutes

  // Daily updates
  co2: 21600,            // 6 hours (updates daily but we check more often)
  seaIce: 43200,         // 12 hours
  fires: 43200,          // 12 hours
  sunspots: 43200,       // 12 hours
  neo: 43200,            // 12 hours (near-earth objects)

  // Slow updates (weekly/monthly data)
  temperature: 86400,    // 24 hours
  seaLevel: 86400,       // 24 hours
  methane: 86400,        // 24 hours

  // Calculated (cache for performance, but effectively never stale)
  moon: 3600,            // 1 hour
  daylight: 3600,        // 1 hour
  population: 60,        // 1 minute (it's a calculation anyway)
}

// Stale TTL - how long to keep data for fallback (7 days)
const STALE_TTL = 7 * 24 * 60 * 60

/**
 * Get cached data or fetch fresh
 * Returns stale data if fetch fails and stale data exists
 */
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number
): Promise<{ data: T; stale: boolean } | null> {
  const cacheKey = `vital-signs:${key}`

  try {
    // Check cache first
    const cached = await kv.get<CacheEntry<T>>(cacheKey)
    const now = Date.now()

    if (cached) {
      const age = (now - cached.timestamp) / 1000
      const isFresh = age < ttlSeconds

      if (isFresh) {
        return { data: cached.data, stale: false }
      }

      // Cache exists but is stale - try to refresh
      try {
        const freshData = await fetcher()
        await kv.set(cacheKey, { data: freshData, timestamp: now }, { ex: STALE_TTL })
        return { data: freshData, stale: false }
      } catch (fetchError) {
        console.warn(`[VitalSigns] Refresh failed for ${key}, using stale data`)
        return { data: cached.data, stale: true }
      }
    }

    // No cache - fetch fresh
    const freshData = await fetcher()
    await kv.set(cacheKey, { data: freshData, timestamp: now }, { ex: STALE_TTL })
    return { data: freshData, stale: false }

  } catch (error) {
    console.error(`[VitalSigns] KV error for ${key}:`, error)

    // Try fetcher directly on KV error
    try {
      const freshData = await fetcher()
      // Try to cache it anyway
      try {
        await kv.set(cacheKey, { data: freshData, timestamp: Date.now() }, { ex: STALE_TTL })
      } catch {
        // Ignore cache write errors
      }
      return { data: freshData, stale: false }
    } catch (fetchError) {
      console.error(`[VitalSigns] Failed to fetch ${key}:`, fetchError)
      return null
    }
  }
}

/**
 * Get data from cache only (no fetch)
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const entry = await kv.get<CacheEntry<T>>(`vital-signs:${key}`)
    return entry?.data ?? null
  } catch {
    return null
  }
}

/**
 * Manually set cache (for calculated values)
 */
export async function setCache<T>(key: string, data: T): Promise<void> {
  try {
    await kv.set(`vital-signs:${key}`, { data, timestamp: Date.now() }, { ex: STALE_TTL })
  } catch (error) {
    console.error(`[VitalSigns] Failed to set cache for ${key}:`, error)
  }
}

/**
 * Clear specific cache entry
 */
export async function clearCache(key: string): Promise<void> {
  try {
    await kv.del(`vital-signs:${key}`)
  } catch (error) {
    console.error(`[VitalSigns] Failed to clear cache for ${key}:`, error)
  }
}

/**
 * Clear all vital-signs cache entries
 */
export async function clearAllCache(): Promise<void> {
  // Note: This requires scanning keys which may not be ideal at scale
  // For now, individual keys should be cleared as needed
  console.warn('[VitalSigns] clearAllCache not implemented for KV - clear keys individually')
}

/**
 * Get cache stats for debugging
 */
export async function getCacheStats(): Promise<{ key: string; age: number; stale: boolean }[]> {
  // Note: This would require scanning all keys, which isn't efficient
  // Return empty for now - debug via Vercel KV dashboard
  return []
}
