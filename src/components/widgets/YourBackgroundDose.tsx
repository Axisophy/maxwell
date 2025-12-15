'use client'

import { useState, useEffect, useRef } from 'react'

// ===========================================
// YOUR BACKGROUND DOSE
// ===========================================
// Shows the radiation you're receiving right now
// Breakdown by source
// ===========================================

interface RadiationSource {
  name: string
  description: string
  dose: number // μSv/hour
  color: string
  icon: string
}

interface LocationData {
  lat: number
  lon: number
  altitude: number
  radonRisk: 'low' | 'medium' | 'high'
  rockType: string
}

function calculateRadiation(location: LocationData): RadiationSource[] {
  // Base values (typical background radiation breakdown)
  // Total average background: ~0.3 μSv/hour (2.4 mSv/year)
  
  // Radon varies significantly by geology
  const radonBase = {
    low: 0.08,
    medium: 0.15,
    high: 0.25
  }
  
  // Cosmic rays increase with altitude (~doubles every 1500m)
  const cosmicBase = 0.04
  const altitudeFactor = Math.pow(2, location.altitude / 1500)
  const cosmicDose = cosmicBase * altitudeFactor
  
  // Terrestrial radiation varies by rock type
  const terrestrialBase = {
    granite: 0.08,
    limestone: 0.04,
    sandstone: 0.03,
    basalt: 0.05,
    clay: 0.04,
    default: 0.05
  }
  
  const terrestrialDose = terrestrialBase[location.rockType as keyof typeof terrestrialBase] || terrestrialBase.default
  const radonDose = radonBase[location.radonRisk]
  
  // Internal dose from food/water (K-40, C-14, etc.)
  const internalDose = 0.04
  
  // Medical (average, highly variable)
  const medicalDose = 0.07 // averaged over population
  
  return [
    {
      name: 'Radon Gas',
      description: 'Radioactive gas from soil/rock decay',
      dose: radonDose,
      color: '#a855f7',
      icon: '🏠'
    },
    {
      name: 'Cosmic Rays',
      description: 'High-energy particles from space',
      dose: cosmicDose,
      color: '#3b82f6',
      icon: '✨'
    },
    {
      name: 'Terrestrial',
      description: 'Natural radioactivity in ground',
      dose: terrestrialDose,
      color: '#84cc16',
      icon: '🪨'
    },
    {
      name: 'Internal',
      description: 'K-40, C-14 in your body',
      dose: internalDose,
      color: '#f59e0b',
      icon: '🫀'
    },
    {
      name: 'Medical (avg)',
      description: 'X-rays, CT scans averaged',
      dose: medicalDose,
      color: '#ef4444',
      icon: '🏥'
    }
  ]
}

function getComparison(totalDose: number): string {
  const hourlyMicroSv = totalDose
  const yearlyMSv = hourlyMicroSv * 8760 / 1000
  
  // Common comparisons
  const bananaEquiv = Math.round(hourlyMicroSv / 0.0001) // ~0.1 μSv per banana
  const flightEquiv = (hourlyMicroSv * 24 / 5).toFixed(1) // ~5 μSv per hour of flight
  
  if (yearlyMSv < 2) {
    return `Below global average. That's about ${bananaEquiv} bananas worth per hour.`
  } else if (yearlyMSv < 4) {
    return `Normal range. Equivalent to ${flightEquiv} hours of flying per day.`
  } else {
    return `Elevated area (likely high radon). Consider radon testing.`
  }
}

export default function YourBackgroundDose() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [sources, setSources] = useState<RadiationSource[]>([])
  const [location, setLocation] = useState<LocationData>({
    lat: 51.5,
    lon: -0.12,
    altitude: 20,
    radonRisk: 'medium',
    rockType: 'clay'
  })
  const [expandedSource, setExpandedSource] = useState<string | null>(null)
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth
        setBaseFontSize(w / 25)
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
  
  // Get user location and estimate geological factors
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Estimate radon risk and rock type based on rough location
          // This is simplified - real data would use geological surveys
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          const altitude = pos.coords.altitude || 50
          
          // Rough estimates for UK/Europe
          let radonRisk: 'low' | 'medium' | 'high' = 'medium'
          let rockType = 'clay'
          
          // Cornwall/Devon - granite, high radon
          if (lat > 50 && lat < 51 && lon > -6 && lon < -4) {
            radonRisk = 'high'
            rockType = 'granite'
          }
          // Peak District/Pennines - limestone
          else if (lat > 53 && lat < 54 && lon > -2 && lon < -1) {
            radonRisk = 'medium'
            rockType = 'limestone'
          }
          // Scotland highlands
          else if (lat > 56) {
            radonRisk = 'medium'
            rockType = 'granite'
          }
          // London basin
          else if (lat > 51.3 && lat < 51.7 && lon > -0.5 && lon < 0.3) {
            radonRisk = 'low'
            rockType = 'clay'
          }
          
          setLocation({
            lat,
            lon,
            altitude,
            radonRisk,
            rockType
          })
        },
        () => {
          // Default to London
        }
      )
    }
  }, [])
  
  // Calculate radiation when location changes
  useEffect(() => {
    const calculatedSources = calculateRadiation(location)
    setSources(calculatedSources)
  }, [location])
  
  const totalDose = sources.reduce((sum, s) => sum + s.dose, 0)
  const yearlyDose = totalDose * 8760 / 1000 // Convert to mSv/year
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-[#1a1520] rounded-xl p-[1em] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.5em]">
        <div>
          <div className="text-[0.625em] font-medium text-purple-400/60 uppercase tracking-wider">
            YOUR BACKGROUND DOSE
          </div>
          <div className="text-[0.4375em] text-purple-400/30">
            Radiation you're receiving right now
          </div>
        </div>
        <div className="text-right">
          <div className="text-[0.4375em] text-white/30">Yearly estimate</div>
          <div className="text-[0.75em] font-mono text-purple-400">
            {yearlyDose.toFixed(1)} mSv/yr
          </div>
        </div>
      </div>
      
      {/* Hero dose display */}
      <div className="text-center py-[0.75em] mb-[0.5em] bg-gradient-to-b from-purple-900/20 to-transparent rounded-lg">
        <div className="text-[0.4375em] text-white/40 uppercase tracking-wider mb-[0.25em]">
          Current Dose Rate
        </div>
        <div className="flex items-baseline justify-center gap-[0.25em]">
          <span className="text-[2em] font-mono font-bold text-white">
            {totalDose.toFixed(2)}
          </span>
          <span className="text-[0.75em] text-white/50">μSv/hour</span>
        </div>
        <div className="text-[0.4375em] text-purple-300/50 mt-[0.25em]">
          ☢️ All natural — you're fine
        </div>
      </div>
      
      {/* Source breakdown - pie chart style bar */}
      <div className="h-[1.5em] rounded-full overflow-hidden flex mb-[0.5em]">
        {sources.map((source) => (
          <div
            key={source.name}
            style={{
              width: `${(source.dose / totalDose) * 100}%`,
              backgroundColor: source.color
            }}
            className="cursor-pointer hover:brightness-110 transition-all"
            onClick={() => setExpandedSource(expandedSource === source.name ? null : source.name)}
            title={`${source.name}: ${((source.dose / totalDose) * 100).toFixed(0)}%`}
          />
        ))}
      </div>
      
      {/* Source list */}
      <div className="flex-1 overflow-y-auto space-y-[0.375em]">
        {sources.map((source) => (
          <div
            key={source.name}
            className={`p-[0.5em] rounded-lg transition-all cursor-pointer ${
              expandedSource === source.name ? 'bg-white/10' : 'bg-white/5 hover:bg-white/8'
            }`}
            onClick={() => setExpandedSource(expandedSource === source.name ? null : source.name)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[0.5em]">
                <div
                  className="w-[0.5em] h-[0.5em] rounded-full"
                  style={{ backgroundColor: source.color }}
                />
                <span className="text-[0.625em] text-white">{source.icon} {source.name}</span>
              </div>
              <div className="text-right">
                <div className="text-[0.625em] font-mono text-white/80">
                  {source.dose.toFixed(3)} μSv/h
                </div>
                <div className="text-[0.4375em] text-white/40">
                  {((source.dose / totalDose) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            
            {expandedSource === source.name && (
              <div className="mt-[0.375em] pt-[0.375em] border-t border-white/10">
                <p className="text-[0.5em] text-white/50">{source.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Comparison */}
      <div className="mt-[0.5em] p-[0.5em] bg-purple-900/20 rounded-lg">
        <p className="text-[0.5em] text-white/60 leading-relaxed">
          {getComparison(totalDose)}
        </p>
      </div>
      
      {/* Location info */}
      <div className="mt-[0.375em] pt-[0.375em] border-t border-white/10 flex items-center justify-between text-[0.4375em] text-white/30">
        <span>
          📍 {location.altitude}m altitude • {location.rockType} geology
        </span>
        <span className={`px-[0.5em] py-[0.125em] rounded ${
          location.radonRisk === 'high' ? 'bg-red-900/50 text-red-400' :
          location.radonRisk === 'medium' ? 'bg-amber-900/50 text-amber-400' :
          'bg-green-900/50 text-green-400'
        }`}>
          {location.radonRisk.toUpperCase()} radon area
        </span>
      </div>
    </div>
  )
}
