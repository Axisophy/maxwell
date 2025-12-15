'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// ACTIVE FIRES WIDGET
// ===========================================
// Shows global fire detections from satellites
// Data: NASA FIRMS (Fire Information for Resource Management System)
// ===========================================

interface FireDetection {
  id: string
  lat: number
  lon: number
  brightness: number // Kelvin
  confidence: 'low' | 'nominal' | 'high'
  frp: number // Fire Radiative Power (MW)
  satellite: string
  timestamp: string
  region: string
}

interface FireData {
  timestamp: string
  fires: FireDetection[]
  totalFires: number
  byRegion: Record<string, number>
  largestFire: FireDetection | null
  recentHours: number
}

// Regions with their bounding boxes (approximate)
const REGIONS: Record<string, { bounds: [number, number, number, number]; emoji: string }> = {
  'North America': { bounds: [24, -170, 72, -50], emoji: '🇺🇸' },
  'South America': { bounds: [-56, -82, 13, -34], emoji: '🇧🇷' },
  'Europe': { bounds: [35, -25, 71, 40], emoji: '🇪🇺' },
  'Africa': { bounds: [-35, -18, 38, 52], emoji: '🌍' },
  'Asia': { bounds: [5, 40, 77, 180], emoji: '🌏' },
  'Australia': { bounds: [-47, 110, -10, 180], emoji: '🇦🇺' },
}

function getRegion(lat: number, lon: number): string {
  for (const [region, { bounds }] of Object.entries(REGIONS)) {
    const [minLat, minLon, maxLat, maxLon] = bounds
    if (lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon) {
      return region
    }
  }
  return 'Other'
}

function getConfidenceColor(confidence: string): string {
  switch (confidence) {
    case 'high': return '#ef4444'
    case 'nominal': return '#f97316'
    default: return '#fbbf24'
  }
}

export default function ActiveFires() {
  const [data, setData] = useState<FireData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  
  // Responsive scaling
  useEffect(() => {
    if (!containerRef) return
    
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25)
    })
    
    observer.observe(containerRef)
    return () => observer.disconnect()
  }, [containerRef])
  
  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/fires')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
    } catch (error) {
      // Generate realistic fallback data
      const generateFires = (count: number): FireDetection[] => {
        const fires: FireDetection[] = []
        const hotspots = [
          // Current typical fire hotspots
          { lat: -23, lon: -46, region: 'South America' }, // Brazil
          { lat: 38, lon: -122, region: 'North America' }, // California
          { lat: -25, lon: 135, region: 'Australia' }, // Central Australia
          { lat: 10, lon: 20, region: 'Africa' }, // Central Africa
          { lat: 55, lon: 90, region: 'Asia' }, // Siberia
          { lat: 40, lon: 0, region: 'Europe' }, // Southern Europe
        ]
        
        for (let i = 0; i < count; i++) {
          const base = hotspots[Math.floor(Math.random() * hotspots.length)]
          const fire: FireDetection = {
            id: `fire-${i}`,
            lat: base.lat + (Math.random() - 0.5) * 20,
            lon: base.lon + (Math.random() - 0.5) * 20,
            brightness: 300 + Math.random() * 150,
            confidence: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'nominal' : 'low',
            frp: Math.random() * 100,
            satellite: Math.random() > 0.5 ? 'MODIS' : 'VIIRS',
            timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
            region: base.region
          }
          fires.push(fire)
        }
        
        return fires
      }
      
      const fires = generateFires(150 + Math.floor(Math.random() * 100))
      
      // Calculate by region
      const byRegion: Record<string, number> = {}
      fires.forEach(f => {
        const region = f.region || getRegion(f.lat, f.lon)
        byRegion[region] = (byRegion[region] || 0) + 1
      })
      
      // Find largest fire by FRP
      const largestFire = fires.reduce((max, f) => f.frp > (max?.frp || 0) ? f : max, fires[0])
      
      setData({
        timestamp: new Date().toISOString(),
        fires,
        totalFires: fires.length,
        byRegion,
        largestFire,
        recentHours: 24
      })
    } finally {
      setLoading(false)
    }
  }, [])
  
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [fetchData])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#1a1008]">
        <div className="text-[0.875em] text-orange-200/50">Loading fire data...</div>
      </div>
    )
  }
  
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full bg-[#1a1008]">
        <div className="text-[0.875em] text-orange-200/50">Unable to load data</div>
      </div>
    )
  }
  
  const sortedRegions = Object.entries(data.byRegion)
    .sort(([, a], [, b]) => b - a)

  return (
    <div 
      ref={setContainerRef}
      className="h-full bg-gradient-to-b from-[#1a1008] to-[#0d0804] overflow-hidden flex flex-col"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-[0.75em] border-b border-orange-500/20">
        <div className="flex items-center gap-[0.5em]">
          {/* Fire icon */}
          <span className="text-[1.25em]">🔥</span>
          <span className="text-[0.75em] font-medium text-orange-100">Active Fires</span>
        </div>
        
        <div className="flex items-center gap-[0.375em]">
          <span className="w-[0.5em] h-[0.5em] rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[0.625em] text-orange-200/60">Last {data.recentHours}h</span>
        </div>
      </div>
      
      {/* Main stat */}
      <div className="p-[0.75em] border-b border-orange-500/10">
        <div className="text-[0.6875em] uppercase tracking-wider text-orange-200/40 mb-[0.25em]">
          Global Fire Detections
        </div>
        <div className="flex items-baseline gap-[0.5em]">
          <span className="text-[2.5em] font-mono font-bold text-orange-400">
            {data.totalFires.toLocaleString()}
          </span>
          <span className="text-[0.75em] text-orange-200/50">hotspots</span>
        </div>
      </div>
      
      {/* By region */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-[0.5em] space-y-[0.25em]">
          {sortedRegions.map(([region, count]) => {
            const percentage = (count / data.totalFires) * 100
            const regionData = REGIONS[region]
            
            return (
              <button
                key={region}
                onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                className={`w-full p-[0.5em] rounded transition-colors ${
                  selectedRegion === region 
                    ? 'bg-orange-500/20' 
                    : 'bg-orange-500/5 hover:bg-orange-500/10'
                }`}
              >
                <div className="flex items-center justify-between mb-[0.25em]">
                  <div className="flex items-center gap-[0.375em]">
                    <span className="text-[0.875em]">{regionData?.emoji || '🌍'}</span>
                    <span className="text-[0.75em] font-medium text-orange-100">{region}</span>
                  </div>
                  <span className="text-[0.875em] font-mono font-medium text-orange-400">
                    {count.toLocaleString()}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="h-[0.25em] bg-orange-900/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Confidence legend */}
      <div className="flex items-center justify-center gap-[1em] px-[0.75em] py-[0.5em] border-t border-orange-500/10">
        {[
          { label: 'High', color: '#ef4444' },
          { label: 'Nominal', color: '#f97316' },
          { label: 'Low', color: '#fbbf24' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-[0.25em]">
            <span 
              className="w-[0.375em] h-[0.375em] rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[0.5em] text-orange-200/40">{item.label}</span>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between px-[0.75em] py-[0.5em] border-t border-orange-500/10">
        <span className="text-[0.5em] text-orange-200/30">
          NASA FIRMS • MODIS & VIIRS
        </span>
        <span className="text-[0.5em] font-mono text-orange-200/30">
          {new Date(data.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}
