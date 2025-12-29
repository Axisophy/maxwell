'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// STAR MAP (NIGHT SKY)
// ===========================================
// Interactive sky map showing stars and planets
// visible from user's location
// Data: Astronomical calculations
// ===========================================

interface CelestialBody {
  name: string
  type: 'star' | 'planet'
  magnitude: number
  ra: number // hours
  dec: number // degrees
  azimuth: number
  altitude: number
  color: string
  size: number
}

// Bright stars data
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
  { name: 'Spica', type: 'star', magnitude: 0.97, ra: 13.42, dec: -11.16, color: '#aabfff', size: 2.5 },
  { name: 'Antares', type: 'star', magnitude: 1.06, ra: 16.49, dec: -26.43, color: '#ff6b4a', size: 2.5 },
  { name: 'Fomalhaut', type: 'star', magnitude: 1.16, ra: 22.96, dec: -29.62, color: '#fff', size: 2.4 },
  { name: 'Regulus', type: 'star', magnitude: 1.36, ra: 10.14, dec: 11.97, color: '#aabfff', size: 2.3 },
]

// Approximate planet positions (simplified - would need ephemeris for accuracy)
const PLANETS: Omit<CelestialBody, 'azimuth' | 'altitude'>[] = [
  { name: 'Venus', type: 'planet', magnitude: -4.0, ra: 19.5, dec: -20, color: '#fffae0', size: 3 },
  { name: 'Jupiter', type: 'planet', magnitude: -2.5, ra: 3.8, dec: 18, color: '#ffecd0', size: 3.5 },
  { name: 'Mars', type: 'planet', magnitude: 0.8, ra: 7.2, dec: 24, color: '#ff8866', size: 2.5 },
  { name: 'Saturn', type: 'planet', magnitude: 0.9, ra: 23.1, dec: -8, color: '#ffe4a0', size: 2.8 },
]

// Calculate local sidereal time
function getLocalSiderealTime(lng: number): number {
  const now = new Date()
  const jd = now.getTime() / 86400000 + 2440587.5
  const t = (jd - 2451545.0) / 36525
  let lst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + t * t * (0.000387933 - t / 38710000)
  lst = ((lst + lng) % 360 + 360) % 360
  return lst / 15
}

// Calculate altitude and azimuth
function calculateAltAz(ra: number, dec: number, lat: number, lst: number): { alt: number; az: number } {
  const ha = (lst - ra) * 15 * Math.PI / 180
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

// Calculate sun altitude for twilight
function getSunAltitude(lat: number, lng: number): number {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
  const declination = -23.45 * Math.cos((360 / 365) * (dayOfYear + 10) * Math.PI / 180)

  const hour = now.getHours() + now.getMinutes() / 60
  const solarNoon = 12 - lng / 15
  const hourAngle = (hour - solarNoon) * 15

  const latRad = lat * Math.PI / 180
  const decRad = declination * Math.PI / 180
  const haRad = hourAngle * Math.PI / 180

  const sinAlt = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad)
  return Math.asin(sinAlt) * 180 / Math.PI
}

// Get twilight status
function getTwilightStatus(sunAlt: number): { status: string; color: string } {
  if (sunAlt > 0) return { status: 'Daylight', color: '#fbbf24' }
  if (sunAlt > -6) return { status: 'Civil twilight', color: '#f97316' }
  if (sunAlt > -12) return { status: 'Nautical twilight', color: '#7c3aed' }
  if (sunAlt > -18) return { status: 'Astronomical twilight', color: '#4338ca' }
  return { status: 'Night', color: '#22c55e' }
}

// Convert alt/az to canvas coordinates
function altAzToCanvas(alt: number, az: number, cx: number, cy: number, radius: number): { x: number; y: number } | null {
  if (alt < 0) return null
  const r = radius * (90 - alt) / 90
  const azRad = (az - 180) * Math.PI / 180
  return {
    x: cx + r * Math.sin(azRad),
    y: cy - r * Math.cos(azRad)
  }
}

export default function StarMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 51.5, lng: -0.1 })
  const [stars, setStars] = useState<CelestialBody[]>([])
  const [planets, setPlanets] = useState<CelestialBody[]>([])
  const [sunAltitude, setSunAltitude] = useState(0)

  // Responsive scaling
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

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
        () => {}
      )
    }
  }, [])

  // Calculate positions
  const calculatePositions = useCallback(() => {
    const lst = getLocalSiderealTime(location.lng)

    const calculatedStars: CelestialBody[] = BRIGHT_STARS.map(star => {
      const { alt, az } = calculateAltAz(star.ra, star.dec, location.lat, lst)
      return { ...star, altitude: alt, azimuth: az }
    }).filter(s => s.altitude > 0)
    .sort((a, b) => a.magnitude - b.magnitude)

    const calculatedPlanets: CelestialBody[] = PLANETS.map(planet => {
      const { alt, az } = calculateAltAz(planet.ra, planet.dec, location.lat, lst)
      return { ...planet, altitude: alt, azimuth: az }
    }).filter(p => p.altitude > 0)

    setStars(calculatedStars)
    setPlanets(calculatedPlanets)
    setSunAltitude(getSunAltitude(location.lat, location.lng))
  }, [location])

  useEffect(() => {
    calculatePositions()
    const interval = setInterval(calculatePositions, 60000)
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
    const radius = Math.min(cx, cy) * 0.92

    // Background
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Horizon circle
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Altitude circles
    for (let alt = 30; alt < 90; alt += 30) {
      const r = radius * (90 - alt) / 90
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
      ctx.setLineDash([2, 4])
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Cardinal directions
    const directions = [
      { label: 'N', az: 0 },
      { label: 'E', az: 90 },
      { label: 'S', az: 180 },
      { label: 'W', az: 270 }
    ]

    directions.forEach(dir => {
      const pos = altAzToCanvas(0, dir.az, cx, cy, radius)
      if (pos) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.font = `bold ${baseFontSize * 0.5}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const offset = baseFontSize * 0.7
        const angle = (dir.az - 180) * Math.PI / 180
        ctx.fillText(dir.label, pos.x + offset * Math.sin(angle), pos.y - offset * Math.cos(angle))
      }
    })

    // Draw stars
    stars.forEach(star => {
      const pos = altAzToCanvas(star.altitude, star.azimuth, cx, cy, radius)
      if (!pos) return

      // Glow
      const expandHex = (hex: string) => hex.length === 4 ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : hex
      const fullColor = expandHex(star.color)
      const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, star.size * 3)
      glow.addColorStop(0, fullColor)
      glow.addColorStop(0.5, fullColor + '40')
      glow.addColorStop(1, 'transparent')

      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, star.size * 3, 0, Math.PI * 2)
      ctx.fill()

      // Core
      ctx.fillStyle = star.color
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, star.size, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw planets with labels
    planets.forEach(planet => {
      const pos = altAzToCanvas(planet.altitude, planet.azimuth, cx, cy, radius)
      if (!pos) return

      // Larger glow for planets
      const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, planet.size * 4)
      glow.addColorStop(0, planet.color)
      glow.addColorStop(0.4, planet.color + '60')
      glow.addColorStop(1, 'transparent')

      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, planet.size * 4, 0, Math.PI * 2)
      ctx.fill()

      // Core
      ctx.fillStyle = planet.color
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, planet.size, 0, Math.PI * 2)
      ctx.fill()

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.font = `${baseFontSize * 0.4}px sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText(planet.name, pos.x + planet.size + 4, pos.y + 2)
    })

    // Zenith marker
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.beginPath()
    ctx.arc(cx, cy, 2, 0, Math.PI * 2)
    ctx.fill()
  }, [stars, planets, baseFontSize])

  const twilight = getTwilightStatus(sunAltitude)
  const brightest = stars[0]

  return (
    <div
      ref={containerRef}
      className="h-full bg-[#1a1a1e] overflow-hidden flex flex-col"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-[0.75em] py-[0.625em] border-b border-white/10">
        <div className="flex items-center gap-[0.5em]">
          <div className="relative">
            <div className="w-[0.5em] h-[0.5em] rounded-full bg-[#60a5fa]" />
            <div className="absolute inset-0 w-[0.5em] h-[0.5em] rounded-full bg-[#60a5fa] animate-ping opacity-50" />
          </div>
          <span className="text-[0.75em] font-medium text-white">Night Sky</span>
        </div>
        <div className="text-[0.5em] font-mono text-white/40">
          {location.lat.toFixed(1)}°{location.lat >= 0 ? 'N' : 'S'} {Math.abs(location.lng).toFixed(1)}°{location.lng >= 0 ? 'E' : 'W'}
        </div>
      </div>

      {/* Star map canvas */}
      <div className="flex-1 relative min-h-0 mx-[0.5em] my-[0.5em] bg-white/5 rounded-[0.5em] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Stats row */}
      <div className="flex gap-[0.375em] mx-[0.5em] mb-[0.5em]">
        <div className="flex-1 bg-white/5 rounded-[0.375em] p-[0.5em]">
          <div className="text-[0.375em] uppercase tracking-wider text-white/40">Visible Stars</div>
          <div className="text-[1em] font-mono font-bold text-white">{stars.length}</div>
        </div>
        <div className="flex-1 bg-white/5 rounded-[0.375em] p-[0.5em]">
          <div className="text-[0.375em] uppercase tracking-wider text-white/40">Brightest</div>
          <div className="text-[0.625em] font-medium text-white truncate">
            {brightest?.name || '—'}
          </div>
          {brightest && (
            <div className="text-[0.4375em] font-mono text-white/50">
              mag {brightest.magnitude.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Planets section */}
      {planets.length > 0 && (
        <div className="mx-[0.5em] mb-[0.5em] bg-white/5 rounded-[0.375em] p-[0.5em]">
          <div className="text-[0.375em] uppercase tracking-wider text-white/40 mb-[0.375em]">
            Planets Visible
          </div>
          <div className="flex flex-wrap gap-[0.5em]">
            {planets.map(planet => (
              <div key={planet.name} className="flex items-center gap-[0.25em]">
                <div
                  className="w-[0.375em] h-[0.375em] rounded-full"
                  style={{ backgroundColor: planet.color }}
                />
                <span className="text-[0.5625em] text-white">{planet.name}</span>
                <span className="text-[0.4375em] font-mono text-white/40">
                  {planet.azimuth < 90 ? 'NE' : planet.azimuth < 180 ? 'SE' : planet.azimuth < 270 ? 'SW' : 'NW'} {Math.round(planet.altitude)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-[0.75em] py-[0.5em] border-t border-white/10">
        <div className="flex items-center gap-[0.375em]">
          <div
            className="w-[0.375em] h-[0.375em] rounded-full"
            style={{ backgroundColor: twilight.color }}
          />
          <span className="text-[0.5em] text-white/50">{twilight.status}</span>
        </div>
        <span className="text-[0.5em] font-mono text-white/40" suppressHydrationWarning>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}
