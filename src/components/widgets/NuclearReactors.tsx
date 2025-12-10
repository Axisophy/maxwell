'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

// ===========================================
// NUCLEAR REACTORS WIDGET
// ===========================================
// Live data from UK, France, US + global static data
// Design: MXWLL standard patterns
// ===========================================

// ===========================================
// TYPES
// ===========================================

interface LiveNuclearData {
  uk: {
    outputGW: number
    percentOfGrid: number
    demandGW: number
    trend: 'up' | 'down' | 'stable'
    updatedAt: string
  } | null
  france: {
    outputGW: number
    percentOfGrid: number
    demandGW: number
    trend: 'up' | 'down' | 'stable'
    updatedAt: string
  } | null
  us: {
    reactorsOnline: number
    totalReactors: number
    averageCapacity: number
    trend: 'up' | 'down' | 'stable'
    updatedAt: string
  } | null
  fetchedAt: string
}

interface CountryReactors {
  country: string
  code: string
  flag: string
  operating: number
  underConstruction: number
  capacity: number
  share: number
}

// ===========================================
// STATIC DATA (IAEA PRIS, December 2024)
// ===========================================

const REACTOR_DATA: CountryReactors[] = [
  { country: 'United States', code: 'US', flag: '🇺🇸', operating: 93, underConstruction: 2, capacity: 95523, share: 18.2 },
  { country: 'France', code: 'FR', flag: '🇫🇷', operating: 56, underConstruction: 1, capacity: 61370, share: 64.8 },
  { country: 'China', code: 'CN', flag: '🇨🇳', operating: 55, underConstruction: 23, capacity: 53226, share: 5.0 },
  { country: 'Russia', code: 'RU', flag: '🇷🇺', operating: 37, underConstruction: 4, capacity: 27727, share: 19.6 },
  { country: 'Japan', code: 'JP', flag: '🇯🇵', operating: 33, underConstruction: 2, capacity: 31679, share: 7.2 },
  { country: 'South Korea', code: 'KR', flag: '🇰🇷', operating: 26, underConstruction: 2, capacity: 25825, share: 32.2 },
  { country: 'India', code: 'IN', flag: '🇮🇳', operating: 23, underConstruction: 7, capacity: 7480, share: 3.1 },
  { country: 'Canada', code: 'CA', flag: '🇨🇦', operating: 19, underConstruction: 0, capacity: 13624, share: 13.6 },
  { country: 'Ukraine', code: 'UA', flag: '🇺🇦', operating: 15, underConstruction: 2, capacity: 13107, share: 55.0 },
  { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', operating: 9, underConstruction: 2, capacity: 5883, share: 14.2 },
]

const GLOBAL_STATS = {
  operatingReactors: 440,
  underConstruction: 62,
  totalCapacityGW: 394,
  countriesWithReactors: 32,
  globalElectricityShare: 9.2,
  co2AvoidedMT: 2000,
}

// ===========================================
// HELPER COMPONENTS
// ===========================================

function TrendArrow({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') {
    return <span className="text-green-500 text-sm">▲</span>
  }
  if (trend === 'down') {
    return <span className="text-red-500 text-sm">▼</span>
  }
  return <span className="text-black/30 text-sm">─</span>
}

function CountryBar({ data, maxOperating }: { data: CountryReactors; maxOperating: number }) {
  const operatingWidth = (data.operating / maxOperating) * 100
  const constructionWidth = (data.underConstruction / maxOperating) * 100

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-base">{data.flag}</span>
          <span className="text-sm">{data.country}</span>
        </div>
        <span className="font-mono text-xs text-black/50">
          {data.share}%
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-[#e5e5e5] rounded-full relative overflow-hidden">
          {/* Operating bar */}
          <div 
            className="absolute h-full bg-green-500 rounded-full"
            style={{ width: `${operatingWidth}%` }}
          />
          {/* Under construction bar (striped) */}
          {data.underConstruction > 0 && (
            <div 
              className="absolute h-full rounded-r-full"
              style={{ 
                left: `${operatingWidth}%`,
                width: `${constructionWidth}%`,
                background: 'repeating-linear-gradient(45deg, #fbbf24, #fbbf24 2px, #f59e0b 2px, #f59e0b 4px)'
              }}
            />
          )}
        </div>
        <span className="font-mono text-xs w-16 text-right">
          {data.operating}
          {data.underConstruction > 0 && (
            <span className="text-amber-500"> +{data.underConstruction}</span>
          )}
        </span>
      </div>
    </div>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function NuclearReactors() {
  const [liveData, setLiveData] = useState<LiveNuclearData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllCountries, setShowAllCountries] = useState(false)

  // Fetch live data
  const fetchLiveData = useCallback(async () => {
    try {
      const response = await fetch('/api/nuclear')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setLiveData(data)
      setError(null)
    } catch (err) {
      console.error('Nuclear data fetch error:', err)
      setError('Unable to load live data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLiveData()
    // Refresh every 10 minutes
    const interval = setInterval(fetchLiveData, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchLiveData])

  // Calculate max for bar scaling
  const maxOperating = useMemo(() => {
    return Math.max(...REACTOR_DATA.map(d => d.operating + d.underConstruction))
  }, [])

  // Countries to display
  const displayedCountries = showAllCountries 
    ? REACTOR_DATA 
    : REACTOR_DATA.slice(0, 5)

  // Format time ago
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  return (
    <div className="p-4 space-y-4">
      
      {/* ===== LIVE SECTION ===== */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-black/50 uppercase tracking-wide font-medium">
            Live
          </span>
        </div>

        {loading ? (
          <div className="text-sm text-black/50 py-4 text-center">
            Loading live data...
          </div>
        ) : error ? (
          <div className="text-sm text-red-500 py-2">{error}</div>
        ) : (
          <div className="space-y-3">
            
            {/* UK */}
            {liveData?.uk && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇬🇧</span>
                  <span className="text-sm font-medium">UK</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold">
                      {liveData.uk.outputGW.toFixed(1)}
                      <span className="text-xs font-normal text-black/50 ml-1">GW</span>
                    </div>
                  </div>
                  <TrendArrow trend={liveData.uk.trend} />
                  <div className="font-mono text-sm text-black/50 w-12 text-right">
                    {liveData.uk.percentOfGrid.toFixed(0)}%
                  </div>
                </div>
              </div>
            )}

            {/* France */}
            {liveData?.france && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇫🇷</span>
                  <span className="text-sm font-medium">France</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold">
                      {liveData.france.outputGW.toFixed(1)}
                      <span className="text-xs font-normal text-black/50 ml-1">GW</span>
                    </div>
                  </div>
                  <TrendArrow trend={liveData.france.trend} />
                  <div className="font-mono text-sm text-black/50 w-12 text-right">
                    {liveData.france.percentOfGrid.toFixed(0)}%
                  </div>
                </div>
              </div>
            )}

            {/* US */}
            {liveData?.us && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇺🇸</span>
                  <span className="text-sm font-medium">US</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold">
                      {liveData.us.reactorsOnline}
                      <span className="text-xs font-normal text-black/50 ml-1">
                        /{liveData.us.totalReactors}
                      </span>
                    </div>
                  </div>
                  <TrendArrow trend={liveData.us.trend} />
                  <div className="font-mono text-sm text-black/50 w-12 text-right">
                    {liveData.us.averageCapacity}%
                  </div>
                </div>
              </div>
            )}

            {/* Updated timestamp */}
            {liveData?.fetchedAt && (
              <div className="text-[10px] text-black/30 text-right">
                Updated {formatTimeAgo(liveData.fetchedAt)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5]" />

      {/* ===== GLOBAL SECTION ===== */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] text-black/50 uppercase tracking-wide font-medium">
            Global
          </span>
          <span className="text-[10px] text-black/30">
            IAEA PRIS, Dec 2024
          </span>
        </div>

        {/* Big stat */}
        <div className="bg-[#f5f5f5] rounded-lg p-4 mb-4">
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-mono text-4xl font-bold">{GLOBAL_STATS.operatingReactors}</span>
            <span className="text-sm text-black/50">operating reactors</span>
          </div>
          <div className="flex justify-center gap-6 mt-3 text-center">
            <div>
              <div className="font-mono text-lg font-medium">{GLOBAL_STATS.underConstruction}</div>
              <div className="text-[10px] text-black/50 uppercase">building</div>
            </div>
            <div>
              <div className="font-mono text-lg font-medium">{GLOBAL_STATS.countriesWithReactors}</div>
              <div className="text-[10px] text-black/50 uppercase">countries</div>
            </div>
            <div>
              <div className="font-mono text-lg font-medium">{GLOBAL_STATS.globalElectricityShare}%</div>
              <div className="text-[10px] text-black/50 uppercase">of power</div>
            </div>
          </div>
        </div>

        {/* Country bars */}
        <div>
          <div className="flex justify-between text-[10px] text-black/50 uppercase tracking-wide mb-1">
            <span>Country</span>
            <span>% Nuclear</span>
          </div>
          
          {displayedCountries.map(country => (
            <CountryBar 
              key={country.code} 
              data={country} 
              maxOperating={maxOperating} 
            />
          ))}

          {/* Show more / less */}
          {REACTOR_DATA.length > 5 && (
            <button
              onClick={() => setShowAllCountries(!showAllCountries)}
              className="w-full flex items-center justify-center gap-2 py-2 mt-2 text-xs text-black/50 hover:text-black transition-colors"
            >
              <span>{showAllCountries ? 'Show less' : `Show ${REACTOR_DATA.length - 5} more`}</span>
              <svg
                className={`w-4 h-4 transition-transform ${showAllCountries ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-[#e5e5e5]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-2 bg-green-500 rounded-sm" />
            <span className="text-[10px] text-black/50">Operating</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div 
              className="w-3 h-2 rounded-sm"
              style={{ 
                background: 'repeating-linear-gradient(45deg, #fbbf24, #fbbf24 1px, #f59e0b 1px, #f59e0b 2px)'
              }}
            />
            <span className="text-[10px] text-black/50">Under construction</span>
          </div>
        </div>

        {/* China callout */}
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border-l-2 border-amber-400">
          <div className="text-xs">
            <span className="font-medium">🇨🇳 China</span> is building{' '}
            <span className="font-mono font-bold">23</span> reactors — more than the rest of the world combined.
          </div>
        </div>
      </div>
    </div>
  )
}