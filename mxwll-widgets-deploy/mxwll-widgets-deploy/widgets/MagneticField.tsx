'use client'

import { useState, useEffect, useRef } from 'react'

interface MagneticData {
  timestamp: string
  location: { lat: number; lon: number }
  totalField: number // nT (nanotesla)
  horizontalIntensity: number
  verticalIntensity: number
  declination: number // degrees (magnetic vs true north difference)
  inclination: number // degrees (dip angle)
  isNorthernHemisphere: boolean
  distanceToMagneticPole: number // km
  magneticLatitude: number
  secularVariation: string // yearly change
  fieldStrengthDescription: 'weak' | 'average' | 'strong'
}

// Generate realistic magnetic field data for a location
function generateMagneticData(lat: number, lon: number): MagneticData {
  // Earth's field varies from ~25,000 nT at equator to ~65,000 nT at poles
  const absLat = Math.abs(lat)
  
  // Total field increases with latitude
  const baseField = 25000 + (absLat / 90) * 40000
  const totalField = Math.round(baseField + (Math.random() - 0.5) * 2000)
  
  // Horizontal intensity decreases toward poles
  const horizFactor = Math.cos(absLat * Math.PI / 180)
  const horizontalIntensity = Math.round(totalField * horizFactor * 0.8)
  
  // Vertical intensity increases toward poles
  const verticalIntensity = Math.round(Math.sqrt(totalField * totalField - horizontalIntensity * horizontalIntensity))
  
  // Declination varies by location (simplified)
  // In UK it's about 0-2° west, changing eastward
  const declination = -2 + lon * 0.05 + (Math.random() - 0.5) * 3
  
  // Inclination (dip angle) - steeper at higher latitudes
  const inclination = Math.atan2(2 * Math.tan(lat * Math.PI / 180), 1) * 180 / Math.PI
  
  // Magnetic pole position (approximate)
  const magPoleLat = 86.5
  const magPoleLon = -164
  const distToMagPole = Math.round(
    111 * Math.sqrt(
      Math.pow(lat - magPoleLat, 2) + 
      Math.pow((lon - magPoleLon) * Math.cos(lat * Math.PI / 180), 2)
    )
  )
  
  // Magnetic latitude (geomagnetic coordinates)
  const magneticLatitude = Math.round(lat + 10 * Math.sin((lon + 70) * Math.PI / 180))
  
  // Field strength description
  let fieldStrengthDescription: 'weak' | 'average' | 'strong'
  if (totalField < 35000) fieldStrengthDescription = 'weak'
  else if (totalField > 55000) fieldStrengthDescription = 'strong'
  else fieldStrengthDescription = 'average'
  
  return {
    timestamp: new Date().toISOString(),
    location: { lat, lon },
    totalField,
    horizontalIntensity,
    verticalIntensity,
    declination: Math.round(declination * 10) / 10,
    inclination: Math.round(inclination * 10) / 10,
    isNorthernHemisphere: lat > 0,
    distanceToMagneticPole: distToMagPole,
    magneticLatitude,
    secularVariation: '+0.12°/year eastward',
    fieldStrengthDescription
  }
}

export default function MagneticField() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [data, setData] = useState<MagneticData | null>(null)
  const [animationPhase, setAnimationPhase] = useState(0)

  // Get location and generate data
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setData(generateMagneticData(pos.coords.latitude, pos.coords.longitude)),
          () => setData(generateMagneticData(51.5, -0.1)) // Default London
        )
      } else {
        setData(generateMagneticData(51.5, -0.1))
      }
    }
    getLocation()
  }, [])

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setBaseFontSize(width / 25)
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Animate field lines
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(p => (p + 0.02) % 1)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Draw magnetic field visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    const width = rect.width
    const height = rect.height
    const cx = width / 2
    const cy = height / 2
    
    // Clear with gradient background
    const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.6)
    bgGrad.addColorStop(0, '#1e3a5f')
    bgGrad.addColorStop(1, '#0a1929')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)
    
    // Draw Earth (small, centered)
    const earthRadius = width * 0.1
    const earthGrad = ctx.createRadialGradient(
      cx - earthRadius * 0.3, cy - earthRadius * 0.3, 0,
      cx, cy, earthRadius
    )
    earthGrad.addColorStop(0, '#64b5f6')
    earthGrad.addColorStop(0.5, '#1976d2')
    earthGrad.addColorStop(1, '#0d47a1')
    
    ctx.beginPath()
    ctx.arc(cx, cy, earthRadius, 0, Math.PI * 2)
    ctx.fillStyle = earthGrad
    ctx.fill()
    
    // Draw magnetic field lines
    const numLines = 8
    const lineColor = 'rgba(147, 197, 253, 0.4)'
    
    for (let i = 0; i < numLines; i++) {
      const startAngle = (i / numLines) * Math.PI * 2 + animationPhase * Math.PI * 2
      
      ctx.beginPath()
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 1.5
      
      // Draw dipole-like field lines
      for (let t = 0; t <= 1; t += 0.02) {
        const r = earthRadius * (1 + 3 * Math.sin(t * Math.PI))
        const angle = startAngle + (t - 0.5) * 0.8
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r * 0.6 // Flatten slightly
        
        if (t === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
    
    // Draw compass indicator showing declination
    const compassRadius = width * 0.08
    const compassX = width * 0.15
    const compassY = height * 0.2
    
    ctx.beginPath()
    ctx.arc(compassX, compassY, compassRadius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.1)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // True north line
    ctx.beginPath()
    ctx.moveTo(compassX, compassY - compassRadius * 0.9)
    ctx.lineTo(compassX, compassY + compassRadius * 0.9)
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.setLineDash([3, 3])
    ctx.stroke()
    ctx.setLineDash([])
    
    // Magnetic north arrow (rotated by declination)
    const decRad = (data.declination) * Math.PI / 180
    ctx.save()
    ctx.translate(compassX, compassY)
    ctx.rotate(decRad)
    
    ctx.beginPath()
    ctx.moveTo(0, -compassRadius * 0.8)
    ctx.lineTo(-4, compassRadius * 0.3)
    ctx.lineTo(4, compassRadius * 0.3)
    ctx.closePath()
    ctx.fillStyle = '#ef4444'
    ctx.fill()
    
    ctx.restore()
    
    // N label
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.font = `${baseFontSize * 0.5}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('N', compassX, compassY - compassRadius - 5)
    
    // Field strength indicator (bar)
    const barX = width * 0.85
    const barHeight = height * 0.5
    const barWidth = width * 0.04
    const barY = (height - barHeight) / 2
    
    // Bar background
    ctx.fillStyle = 'rgba(255,255,255,0.1)'
    ctx.fillRect(barX - barWidth/2, barY, barWidth, barHeight)
    
    // Filled portion (normalized to 25k-65k range)
    const fillFraction = (data.totalField - 25000) / 40000
    const fillHeight = barHeight * Math.max(0, Math.min(1, fillFraction))
    
    const barGrad = ctx.createLinearGradient(0, barY + barHeight, 0, barY)
    barGrad.addColorStop(0, '#22c55e')
    barGrad.addColorStop(0.5, '#eab308')
    barGrad.addColorStop(1, '#ef4444')
    
    ctx.fillStyle = barGrad
    ctx.fillRect(barX - barWidth/2, barY + barHeight - fillHeight, barWidth, fillHeight)
    
    // Bar labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = `${baseFontSize * 0.4}px sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText('65k', barX + barWidth/2 + 4, barY + 10)
    ctx.fillText('25k', barX + barWidth/2 + 4, barY + barHeight)
    
  }, [data, baseFontSize, animationPhase])

  if (!data) {
    return (
      <div ref={containerRef} className="w-full aspect-square bg-[#0a1929] rounded-xl flex items-center justify-center">
        <span className="text-white/50">Measuring field...</span>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="w-full aspect-[4/5] bg-[#0a1929] rounded-xl overflow-hidden"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="px-[1em] py-[0.75em] bg-gradient-to-b from-[#1e3a5f] to-[#0a1929]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[0.6875em] font-medium uppercase tracking-wider text-blue-300">
              Geomagnetic Field
            </div>
            <div className="text-[1.125em] font-bold text-white">
              Earth's Magnetic Field Here
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[1.5em] font-bold text-blue-300">
              {data.totalField.toLocaleString()}
            </div>
            <div className="text-[0.625em] text-white/50">nanotesla</div>
          </div>
        </div>
      </div>

      {/* Field visualization */}
      <div className="relative" style={{ height: '40%' }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Field components */}
      <div className="px-[1em] py-[0.75em] bg-[#0d2137]">
        <div className="grid grid-cols-3 gap-[0.5em]">
          <div className="bg-white/5 rounded-lg p-[0.5em]">
            <div className="text-[0.5em] text-white/40 uppercase tracking-wider">Horizontal</div>
            <div className="font-mono text-[0.875em] text-white font-bold">
              {data.horizontalIntensity.toLocaleString()} nT
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-[0.5em]">
            <div className="text-[0.5em] text-white/40 uppercase tracking-wider">Vertical</div>
            <div className="font-mono text-[0.875em] text-white font-bold">
              {data.verticalIntensity.toLocaleString()} nT
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-[0.5em]">
            <div className="text-[0.5em] text-white/40 uppercase tracking-wider">Inclination</div>
            <div className="font-mono text-[0.875em] text-white font-bold">
              {data.inclination}°
            </div>
          </div>
        </div>
      </div>

      {/* Declination detail */}
      <div className="px-[1em] py-[0.75em] bg-[#0a1929]">
        <div className="flex items-center gap-[1em]">
          <div className="flex-1">
            <div className="text-[0.5625em] text-white/40 uppercase tracking-wider mb-[0.25em]">
              Magnetic Declination
            </div>
            <div className="flex items-baseline gap-[0.5em]">
              <span className="font-mono text-[1.25em] text-white font-bold">
                {Math.abs(data.declination)}°
              </span>
              <span className="text-[0.75em] text-white/60">
                {data.declination < 0 ? 'West' : 'East'}
              </span>
            </div>
            <div className="text-[0.5em] text-white/40 mt-[0.25em]">
              Magnetic north is {Math.abs(data.declination)}° {data.declination < 0 ? 'west' : 'east'} of true north
            </div>
          </div>
          <div className="text-right">
            <div className="text-[0.5em] text-white/40">Secular variation</div>
            <div className="text-[0.6875em] text-blue-300">{data.secularVariation}</div>
          </div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="px-[1em] py-[0.5em] bg-black/30 flex items-center justify-between">
        <span className="text-[0.5625em] text-white/40">
          {data.distanceToMagneticPole.toLocaleString()} km to magnetic pole
        </span>
        <span className={`text-[0.5625em] px-[0.5em] py-[0.125em] rounded-full ${
          data.fieldStrengthDescription === 'strong' 
            ? 'bg-green-900/50 text-green-400'
            : data.fieldStrengthDescription === 'weak'
            ? 'bg-amber-900/50 text-amber-400'
            : 'bg-blue-900/50 text-blue-400'
        }`}>
          {data.fieldStrengthDescription} field
        </span>
      </div>
    </div>
  )
}
