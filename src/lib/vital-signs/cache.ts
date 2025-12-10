// =============================================================================
// VITAL SIGNS CACHE UTILITY
// =============================================================================
// Simple in-memory cache with TTL and stale fallback
// Can be upgraded to Vercel KV for persistence across serverless instances

interface CacheEntry<T> {
  data: T
  timestamp: number
  stale?: boolean
}

// In-memory cache store
const cache = new Map<string, CacheEntry<any>>()

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

/**
 * Get cached data or fetch fresh
 * Returns stale data if fetch fails and stale data exists
 */
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number
): Promise<{ data: T; stale: boolean } | null> {
  const now = Date.now()
  const cached = cache.get(key) as CacheEntry<T> | undefined
  
  // Return fresh cache if valid
  if (cached && (now - cached.timestamp) < ttlSeconds * 1000) {
    return { data: cached.data, stale: false }
  }
  
  // Try to fetch fresh data
  try {
    const freshData = await fetcher()
    cache.set(key, { data: freshData, timestamp: now })
    return { data: freshData, stale: false }
  } catch (error) {
    console.error(`[VitalSigns] Failed to fetch ${key}:`, error)
    
    // Return stale data if available
    if (cached) {
      console.log(`[VitalSigns] Returning stale data for ${key}`)
      return { data: cached.data, stale: true }
    }
    
    // No data available at all
    return null
  }
}

/**
 * Get data from cache only (no fetch)
 */
export function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined
  return entry?.data ?? null
}

/**
 * Manually set cache (for calculated values)
 */
export function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

/**
 * Clear specific cache entry
 */
export function clearCache(key: string): void {
  cache.delete(key)
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  cache.clear()
}

/**
 * Get cache stats for debugging
 */
export function getCacheStats(): { key: string; age: number; stale: boolean }[] {
  const now = Date.now()
  const stats: { key: string; age: number; stale: boolean }[] = []
  
  cache.forEach((entry, key) => {
    const ttl = DATA_TTL[key as keyof typeof DATA_TTL] || 300
    const age = Math.round((now - entry.timestamp) / 1000)
    stats.push({
      key,
      age,
      stale: age > ttl
    })
  })
  
  return stats
}
