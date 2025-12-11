'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import WorldMap, { latLonToXY } from './WorldMap'

// ===========================================
// LIGHTNING LIVE WIDGET
// ===========================================
// Real-time lightning strikes from Blitzortung network
// Shows global lightning activity with flash/fade animation
// Data: Blitzortung.org citizen science network
// ===========================================

interface Strike {
  id: string
  time: number      // Unix timestamp in milliseconds
  lat: number
  lon: number
  polarity: 'positive' | 'negative'
  stations: number
  age: number       // Age in milliseconds (computed client-side)
}

interface LightningData {
  strikes: Omit<Strike, 'age'>[]
  stats: {
    total: number
    strikesPerMinute: number
    positivePercent: number
    mostActiveRegion: string | null
  }
  timestamp: number
  cached?: boolean
  stale?: boolean
  error?: string
}

// ===========================================
// STRIKE MARKERS
// ===========================================

interface StrikeMarkersProps {
  strikes: Strike[]
}

function StrikeMarkers({ strikes }: StrikeMarkersProps) {
  return (
    <g>
      {strikes.map(strike => {
        const { x, y } = latLonToXY(strike.lat, strike.lon)
        
        // Calculate opacity and size based on age
        // Fresh strikes (< 1s): bright flash
        // Aging strikes: fade over 60 seconds
        const ageSeconds = strike.age / 1000
        
        // Opacity: starts at 1, fades to 0 over 60 seconds
        const opacity = Math.max(0, 1 - (ageSeconds / 60))
        
        // Size: fresh strikes are larger, shrink as they age
        const baseSize = ageSeconds < 0.5 ? 4 : 2.5
        
        // Color: fresh = white/yellow, aging = orange to red
        let color: string
        if (ageSeconds < 0.3) {
          color = '#ffffff' // White flash
        } else if (ageSeconds < 1) {
          color = '#fef08a' // Bright yellow
        } else if (ageSeconds < 10) {
          color = '#fbbf24' // Amber
        } else if (ageSeconds < 30) {
          color = '#f97316' // Orange
        } else {
          color = '#ef4444' // Red (fading)
        }
        
        // Positive strikes are rarer and more powerful - make them blue-ish
        if (strike.polarity === 'positive' && ageSeconds < 10) {
          color = ageSeconds < 0.3 ? '#ffffff' : '#60a5fa' // Blue tint
        }
        
        return (
          <g key={strike.id}>
            {/* Expanding ring for very fresh strikes */}
            {ageSeconds < 1 && (
              <circle
                cx={x}
                cy={y}
                r={baseSize}
                fill="none"
                stroke={color}
                strokeWidth="1"
                opacity={Math.max(0, 1 - ageSeconds)}
              >
                <animate
                  attributeName="r"
                  from={baseSize}
                  to={baseSize * 4}
                  dur="1s"
                  begin="0s"
                  fill="freeze"
                />
                <animate
                  attributeName="opacity"
                  from="0.8"
                  to="0"
                  dur="1s"
                  begin="0s"
                  fill="freeze"
                />
              </circle>
            )}
            
            {/* Main strike dot */}
            <circle
              cx={x}
              cy={y}
              r={baseSize}
              fill={color}
              opacity={opacity}
            />
            
            {/* Glow effect for fresh strikes */}
            {ageSeconds < 2 && (
              <circle
                cx={x}
                cy={y}
                r={baseSize * 2}
                fill={color}
                opacity={opacity * 0.3}
                style={{ filter: 'blur(2px)' }}
              />
            )}
          </g>
        )
      })}
    </g>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function LightningLive() {
  const [data, setData] = useState<LightningData | null>(null)
  const [strikes, setStrikes] = useState<Strike[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [consecutiveErrors, setConsecutiveErrors] = useState(0)
  const animationRef = useRef<number | null>(null)
  const lastFetchRef = useRef<number>(0)

  // Fetch data from API with retry logic
  const fetchData = useCallback(async (retryCount = 0) => {
    try {
      const response = await fetch('/api/lightning')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const result: LightningData = await response.json()
      
      // Check if API returned an error message
      if (result.error && result.strikes.length === 0) {
        throw new Error(result.error)
      }
      
      setData(result)
      setError(null)
      setConsecutiveErrors(0)
      lastFetchRef.current = Date.now()
      
      // Merge new strikes with existing, updating ages
      setStrikes(prev => {
        const now = Date.now()
        const newStrikeIds = new Set(result.strikes.map(s => s.id))
        
        // Keep old strikes that aren't in the new data (they're still fading)
        const oldStrikes = prev
          .filter(s => !newStrikeIds.has(s.id) && s.age < 60000)
          .map(s => ({ ...s, age: now - s.time }))
        
        // Add new strikes with computed age
        const newStrikes = result.strikes.map(s => ({
          ...s,
          age: now - s.time
        }))
        
        // Combine and sort by time (newest first)
        return [...newStrikes, ...oldStrikes]
          .sort((a, b) => b.time - a.time)
          .slice(0, 1500) // Limit total strikes for performance
      })
    } catch (err) {
      console.error('Lightning fetch error:', err)
      setConsecutiveErrors(prev => prev + 1)
      
      // Retry up to 2 times with exponential backoff
      if (retryCount < 2) {
        const delay = Math.pow(2, retryCount) * 1000 // 1s, 2s
        setTimeout(() => fetchData(retryCount + 1), delay)
        return
      }
      
      setError('Unable to load data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch and polling with adaptive interval
  useEffect(() => {
    fetchData()
    
    // Poll more frequently if we're getting errors (to recover faster)
    // Normal: 10s, After errors: 5s
    const getInterval = () => consecutiveErrors > 0 ? 5000 : 10000
    
    const interval = setInterval(() => fetchData(), getInterval())
    return () => clearInterval(interval)
  }, [fetchData, consecutiveErrors])

  // Animation loop to update strike ages
  useEffect(() => {
    let lastTime = performance.now()
    
    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime
      
      // Update ages every ~100ms for smooth animation
      if (delta >= 100) {
        lastTime = currentTime
        
        setStrikes(prev => {
          const now = Date.now()
          return prev
            .map(s => ({ ...s, age: now - s.time }))
            .filter(s => s.age < 60000) // Remove strikes older than 60s
        })
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Calculate visible strike counts
  const visibleStrikes = useMemo(() => {
    const fresh = strikes.filter(s => s.age < 5000).length
    const recent = strikes.filter(s => s.age < 60000).length
    return { fresh, recent }
  }, [strikes])

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-64 text-[#666]">
        <div className="text-center">
          <div className="animate-pulse mb-2">⚡</div>
          <div className="text-sm">Connecting to lightning network...</div>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        <div className="text-center">
          <div className="mb-2">⚠</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Strikes per minute */}
          <div>
            <span className="font-mono text-2xl font-bold text-black">
              {data?.stats.strikesPerMinute || 0}
            </span>
            <span className="text-xs text-black/40 ml-1">/min</span>
          </div>
          
          {/* Total in view */}
          <div>
            <span className="font-mono text-lg font-medium text-black/70">
              {visibleStrikes.recent}
            </span>
            <span className="text-xs text-black/40 ml-1">visible</span>
          </div>
        </div>
        
        {/* Most active region */}
        {data?.stats.mostActiveRegion && (
          <div className="text-right">
            <span className="text-xs text-black/40 uppercase tracking-wide">Most Active</span>
            <div className="text-sm font-medium text-black">
              {data.stats.mostActiveRegion}
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="rounded-lg overflow-hidden">
        <WorldMap 
          oceanColor="#0a0a12" 
          landColor="#1a1a2e"
        >
          <StrikeMarkers strikes={strikes} />
        </WorldMap>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-black/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#fef08a]" />
          <span>Fresh (&lt;10s)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#f97316]" />
          <span>Recent (&lt;30s)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] opacity-50" />
          <span>Fading</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5]" />

      {/* Activity indicator */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className={`w-2 h-2 rounded-full ${
              data?.error ? 'bg-amber-500' :
              data?.stale ? 'bg-amber-500' :
              'bg-green-500'
            }`} />
            {visibleStrikes.fresh > 0 && !data?.stale && (
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping" />
            )}
          </div>
          <span className="text-black/60">
            {data?.error 
              ? 'Data source temporarily unavailable'
              : data?.stale 
              ? 'Showing cached data — source updating'
              : visibleStrikes.fresh > 0 
              ? `${visibleStrikes.fresh} strikes in last 5 seconds`
              : 'Monitoring global lightning activity'
            }
          </span>
        </div>
        
        {/* Data age indicator */}
        <span className="text-xs text-black/40">
          {data?.stale && 'Cached · '}
          Updated {Math.round((Date.now() - (data?.timestamp || Date.now())) / 1000)}s ago
        </span>
      </div>
    </div>
  )
}