'use client'

import { useState, useEffect, useRef } from 'react'

// ===========================================
// MAGNETIC FIELD STRENGTH
// ===========================================
// Shows Earth's magnetic field at your location
// Compass-style visualization
// ===========================================

interface MagneticData {
  totalIntensity: number // nT (nanotesla)
  horizontalIntensity: number
  verticalIntensity: number
  declination: number // degrees (magnetic vs true north)
  inclination: number // degrees (dip angle)
}

// Simplified IGRF model approximation
// Real implementation would use NOAA's World Magnetic Model API
function calculateMagneticField(lat: number, lon: number): MagneticData {
  // Earth's magnetic field varies roughly:
  // - Strongest at poles (~60,000 nT)
  // - Weakest at equator (~30,000 nT)
  // - Significant anomalies exist
  
  const latRad = (lat * Math.PI) / 180
  
  // Approximate total intensity (simplified dipole model)
  // Real values range from ~25,000 to ~65,000 nT
  const baseIntensity = 30000
  const poleIntensity = 60000
  const totalIntensity = baseIntensity + (poleIntensity - baseIntensity) * Math.abs(Math.sin(latRad))
  
  // Add some longitude variation (magnetic poles offset from geographic)
  const lonFactor = Math.cos((lon + 70) * Math.PI / 180) * 0.05 // Magnetic pole offset
  const adjustedIntensity = totalIntensity * (1 + lonFactor)
  
  // Inclination (dip angle)
  // Horizontal at equator, vertical at poles
  const inclination = Math.atan(2 * Math.tan(latRad)) * 180 / Math.PI
  
  // Horizontal and vertical components
  const inclinationRad = inclination * Math.PI / 180
  const horizontalIntensity = adjustedIntensity * Math.cos(inclinationRad)
  const verticalIntensity = adjustedIntensity * Math.sin(inclinationRad)
  
  // Declination (simplified - varies a lot by location)
  // Magnetic north offset from true north
  let declination = 0
  
  // UK approximation: currently about -1° to +2°
  if (lat > 49 && lat < 61 && lon > -11 && lon < 2) {
    declination = -1 + lon * 0.1
  }
  // US east coast: about -10° to -15°
  else if (lat > 25 && lat < 50 && lon > -85 && lon < -65) {
    declination = -12
  }
  // US west coast: about +10° to +15°
  else if (lat > 30 && lat < 50 && lon > -130 && lon < -110) {
    declination = 12
  }
  // General approximation
  else {
    declination = Math.sin(lon * Math.PI / 180) * 15
  }
  
  return {
    totalIntensity: Math.round(adjustedIntensity),
    horizontalIntensity: Math.round(horizontalIntensity),
    verticalIntensity: Math.round(verticalIntensity),
    declination: Math.round(declination * 10) / 10,
    inclination: Math.round(inclination * 10) / 10
  }
}

function getFieldDescription(totalIntensity: number, lat: number): string {
  if (Math.abs(lat) > 60) {
    return "Near the magnetic pole — strong vertical component. This is where aurora form."
  } else if (Math.abs(lat) < 20) {
    return "Near the magnetic equator — weak vertical component. The South Atlantic Anomaly may be affecting this region."
  } else {
    return "Mid-latitude field. The horizontal component guides your compass needle."
  }
}

export default function MagneticFieldStrength() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [location, setLocation] = useState({ lat: 51.5, lon: -0.12 })
  const [magneticData, setMagneticData] = useState<MagneticData | null>(null)
  const [showComponents, setShowComponents] = useState(false)
  
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
  
  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          })
        },
        () => {} // Keep default
      )
    }
  }, [])
  
  // Calculate magnetic field
  useEffect(() => {
    const data = calculateMagneticField(location.lat, location.lon)
    setMagneticData(data)
  }, [location])
  
  if (!magneticData) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900 rounded-xl">
        <div className="text-white/50">Calculating field...</div>
      </div>
    )
  }
  
  // Normalize for visualization (25000-65000 nT range to 0-100%)
  const intensityPercent = ((magneticData.totalIntensity - 25000) / 40000) * 100
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-slate-900 rounded-xl p-[1em] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.5em]">
        <div>
          <div className="text-[0.625em] font-medium text-cyan-400/60 uppercase tracking-wider">
            MAGNETIC FIELD
          </div>
          <div className="text-[0.4375em] text-cyan-400/30">
            Earth's field at your location
          </div>
        </div>
        <button
          onClick={() => setShowComponents(!showComponents)}
          className={`px-[0.5em] py-[0.25em] rounded text-[0.4375em] transition-colors ${
            showComponents ? 'bg-cyan-600 text-white' : 'bg-white/10 text-white/50'
          }`}
        >
          {showComponents ? 'SIMPLE' : 'DETAILS'}
        </button>
      </div>
      
      {/* Main visualization */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Compass rose with field direction */}
        <div className="relative w-[8em] h-[8em]">
          {/* Outer ring */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(34,211,238,0.2)" strokeWidth="2" />
            
            {/* Field strength indicator */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45 * intensityPercent / 100} ${2 * Math.PI * 45}`}
              transform="rotate(-90 50 50)"
            />
            
            {/* Cardinal directions */}
            <text x="50" y="12" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">N</text>
            <text x="88" y="53" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">E</text>
            <text x="50" y="94" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">S</text>
            <text x="12" y="53" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">W</text>
            
            {/* Declination indicator (where magnetic north points) */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="15"
              stroke="#ef4444"
              strokeWidth="2"
              transform={`rotate(${magneticData.declination} 50 50)`}
            />
            <polygon
              points="50,12 47,20 53,20"
              fill="#ef4444"
              transform={`rotate(${magneticData.declination} 50 50)`}
            />
            
            {/* True north indicator */}
            <line x1="50" y1="50" x2="50" y2="20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,3" />
          </svg>
          
          {/* Center display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-[1.5em] font-mono font-bold text-white">
                {(magneticData.totalIntensity / 1000).toFixed(1)}
              </div>
              <div className="text-[0.4375em] text-cyan-400/60">μT</div>
            </div>
          </div>
        </div>
        
        {/* Declination label */}
        <div className="mt-[0.5em] text-center">
          <div className="text-[0.5em] text-white/40">Magnetic declination</div>
          <div className="text-[0.875em] font-mono text-cyan-400">
            {magneticData.declination > 0 ? '+' : ''}{magneticData.declination}°
          </div>
          <div className="text-[0.4375em] text-white/30">
            {magneticData.declination > 0 ? 'East' : magneticData.declination < 0 ? 'West' : 'True'}
          </div>
        </div>
      </div>
      
      {/* Components detail view */}
      {showComponents && (
        <div className="mt-[0.5em] p-[0.5em] bg-white/5 rounded-lg">
          <div className="grid grid-cols-2 gap-[0.5em] text-[0.5em]">
            <div>
              <div className="text-white/30">Horizontal</div>
              <div className="font-mono text-white">{magneticData.horizontalIntensity.toLocaleString()} nT</div>
            </div>
            <div>
              <div className="text-white/30">Vertical</div>
              <div className="font-mono text-white">{magneticData.verticalIntensity.toLocaleString()} nT</div>
            </div>
            <div>
              <div className="text-white/30">Inclination (dip)</div>
              <div className="font-mono text-white">{magneticData.inclination}°</div>
            </div>
            <div>
              <div className="text-white/30">Total intensity</div>
              <div className="font-mono text-white">{magneticData.totalIntensity.toLocaleString()} nT</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Description */}
      <div className="mt-[0.5em] p-[0.5em] bg-cyan-900/20 rounded-lg">
        <p className="text-[0.4375em] text-white/60 leading-relaxed">
          {getFieldDescription(magneticData.totalIntensity, location.lat)}
        </p>
      </div>
      
      {/* Footer */}
      <div className="mt-[0.375em] flex items-center justify-between text-[0.4375em] text-white/30">
        <span>📍 {location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°</span>
        <span>🧭 This field protects you from solar wind</span>
      </div>
    </div>
  )
}
