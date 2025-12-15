'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// STAR MAP WIDGET
// ===========================================
// Interactive sky map showing stars, planets,
// and constellations visible from user's location
// Data: Astronomical calculations
// ===========================================

interface CelestialBody {
  name: string
  type: 'star' | 'planet' | 'moon'
  magnitude: number
  ra: number // hours
  dec: number // degrees
  azimuth: number // calculated for location
  altitude: number // calculated for location
  color: string
  size: number
}

interface Constellation {
  name: string
  stars: string[]
  lines: [number, number][]
}

interface StarMapData {
  timestamp: string
  location: { lat: number; lng: number }
  bodies: CelestialBody[]
  visiblePlanets: string[]
  moonPhase: number
  sunAltitude: number
  isDark: boolean
}

// Bright stars data (simplified)
const BRIGHT_STARS: Omit<CelestialBody, 'azimuth' | 'altitude'>[] = [
  { name: 'Sirius', type: 'star', magnitude: -1.46, ra: 6.75, dec: -16.72, color: '#aabfff', size: 4 },
  { name: 'Canopus', type: 'star', magnitude: -0.72, ra: 6.40, dec: -52.70, color: '#fff4e8', size: 3.5 },
  { name: 'Arcturus', type: 'star', magnitude: -0.05, ra: 14.26, dec: 19.18, color: '#ffcc6f', size: 3 },
  { name: 'Vega', type: 'star', magnitude: 0.03, ra: 18.62, dec: 38.78, color: '#aabfff', size: 3 },
  { name: 'Capella', type: 'star', magnitude: 0.08, ra: 5.28, dec: 46.00, color: '#ffe5ad', size: 3 },
  { name: 'Rigel', type: 'star', magnitude: 0.13, ra: 5.24, dec: -8.20, color: '#aabfff', size: 3 },
  { name: 'Procyon', type: 'star', magnitude: 0.34, ra: 7.65, dec: 5.22, color: '#fff4e8', size: 2.8 },
  { name: 'Betelgeuse', type: 'star', magnitude: 0.42, ra: 5.92, dec: 7.41, color: '#ffaa6f', size: 2.8 },
  { name: 'Aldebaran', type: 'star', magnitude: 0.85, ra: 4.60, dec: 16.51, color: '#ffcc6f', size: 2.5 },
  { name: 'Polaris', type: 'star', magnitude: 1.98, ra: 2.53, dec: 89.26, color: '#fff8e8', size: 2.2 },
  { name: 'Deneb', type: 'star', magnitude: 1.25, ra: 20.69, dec: 45.28, color: '#fff', size: 2.5 },
  { name: 'Altair', type: 'star', magnitude: 0.76, ra: 19.85, dec: 8.87, color: '#fff', size: 2.6 },
]

// Calculate local sidereal time
function getLocalSiderealTime(lng: number): number {
  const now = new Date()
  const jd = now.getTime() / 86400000 + 2440587.5
  const t = (jd - 2451545.0) / 36525
  let lst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + t * t * (0.000387933 - t / 38710000)
  lst = ((lst + lng) % 360 + 360) % 360
  return lst / 15 // Convert to hours
}

// Calculate altitude and azimuth for a celestial body
function calculateAltAz(ra: number, dec: number, lat: number, lst: number): { alt: number; az: number } {
  const ha = (lst - ra) * 15 * Math.PI / 180 // Hour angle in radians
  const decRad = dec * Math.PI / 180
  const latRad = lat * Math.PI / 180
  
  const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(ha)
  const alt = Math.asin(sinAlt) * 180 / Math.PI
  
  const cosAz = (Math.sin(decRad) - Math.sin(alt * Math.PI / 180) * Math.sin(latRad)) / 
                (Math.cos(alt * Math.PI / 180) * Math.cos(latRad))
  let az = Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180 / Math.PI
  
  if (Math.sin(ha) > 0) az = 360 - az
  
  return { alt, az }
}

// Convert alt/az to canvas coordinates (stereographic projection)
function altAzToCanvas(alt: number, az: number, cx: number, cy: number, radius: number): { x: number; y: number } | null {
  if (alt < 0) return null // Below horizon
  
  const r = radius * (90 - alt) / 90
  const azRad = (az - 180) * Math.PI / 180
  
  return {
    x: cx + r * Math.sin(azRad),
    y: cy - r * Math.cos(azRad)
  }
}

export default function StarMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 51.5, lng: -0.1 })
  const [bodies, setBodies] = useState<CelestialBody[]>([])
  const [hoveredStar, setHoveredStar] = useState<CelestialBody | null>(null)
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
  
  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {} // Keep default London
      )
    }
  }, [])
  
  // Calculate star positions
  const calculatePositions = useCallback(() => {
    const lst = getLocalSiderealTime(location.lng)
    
    const calculated: CelestialBody[] = BRIGHT_STARS.map(star => {
      const { alt, az } = calculateAltAz(star.ra, star.dec, location.lat, lst)
      return {
        ...star,
        altitude: alt,
        azimuth: az
      }
    }).filter(s => s.altitude > 0) // Only visible stars
    
    setBodies(calculated)
  }, [location])
  
  useEffect(() => {
    calculatePositions()
    const interval = setInterval(calculatePositions, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [calculatePositions])
  
  // Draw star map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    const cx = rect.width / 2
    const cy = rect.height / 2
    const radius = Math.min(cx, cy) * 0.9
    
    // Background gradient
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.2)
    gradient.addColorStop(0, '#0a0a1a')
    gradient.addColorStop(0.7, '#050510')
    gradient.addColorStop(1, '#020208')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, rect.width, rect.height)
    
    // Draw horizon circle
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(100, 120, 180, 0.3)'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // Draw altitude circles
    for (let alt = 30; alt < 90; alt += 30) {
      const r = radius * (90 - alt) / 90
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(100, 120, 180, 0.15)'
      ctx.setLineDash([2, 4])
      ctx.stroke()
      ctx.setLineDash([])
    }
    
    // Draw cardinal directions
    const directions = [
      { label: 'N', az: 0 },
      { label: 'E', az: 90 },
      { label: 'S', az: 180 },
      { label: 'W', az: 270 }
    ]
    
    directions.forEach(dir => {
      const pos = altAzToCanvas(0, dir.az, cx, cy, radius)
      if (pos) {
        ctx.fillStyle = 'rgba(100, 120, 180, 0.5)'
        ctx.font = `${baseFontSize * 0.6}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        const offset = baseFontSize * 0.8
        const angle = (dir.az - 180) * Math.PI / 180
        ctx.fillText(dir.label, pos.x + offset * Math.sin(angle), pos.y - offset * Math.cos(angle))
      }
    })
    
    // Draw stars
    bodies.forEach(star => {
      const pos = altAzToCanvas(star.altitude, star.azimuth, cx, cy, radius)
      if (!pos) return
      
      // Star glow
      const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, star.size * 3)
      glow.addColorStop(0, star.color)
      glow.addColorStop(0.5, star.color + '40')
      glow.addColorStop(1, 'transparent')
      
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, star.size * 3, 0, Math.PI * 2)
      ctx.fill()
      
      // Star core
      ctx.fillStyle = star.color
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, star.size, 0, Math.PI * 2)
      ctx.fill()
      
      // Label for bright stars
      if (star.magnitude < 0.5 || star === hoveredStar) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.font = `${baseFontSize * 0.5}px sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText(star.name, pos.x + star.size + 4, pos.y + 2)
      }
    })
    
    // Zenith marker
    ctx.fillStyle = 'rgba(100, 120, 180, 0.3)'
    ctx.beginPath()
    ctx.arc(cx, cy, 3, 0, Math.PI * 2)
    ctx.fill()
  }, [bodies, baseFontSize, hoveredStar])
  
  const visibleCount = bodies.length
  
  return (
    <div 
      ref={setContainerRef}
      className="h-full bg-[#020208] overflow-hidden flex flex-col"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-[0.75em] border-b border-white/10">
        <div>
          <div className="text-[0.6875em] font-medium uppercase tracking-wider text-white/40">
            Night Sky
          </div>
          <div className="text-[0.75em] text-white/60">
            {location.lat.toFixed(1)}°N, {Math.abs(location.lng).toFixed(1)}°{location.lng > 0 ? 'E' : 'W'}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-[0.5625em] text-white/40">Visible Stars</div>
          <div className="text-[1.125em] font-mono font-bold text-white">
            {visibleCount}
          </div>
        </div>
      </div>
      
      {/* Star map canvas */}
      <div className="flex-1 relative min-h-0 p-[0.5em]">
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>
      
      {/* Footer with brightest visible star */}
      <div className="flex items-center justify-between px-[0.75em] py-[0.5em] border-t border-white/10">
        <span className="text-[0.5625em] text-white/40">
          {bodies[0] ? `Brightest: ${bodies[0].name} (mag ${bodies[0].magnitude.toFixed(1)})` : 'Calculating...'}
        </span>
        <span className="text-[0.5625em] font-mono text-white/40">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}
