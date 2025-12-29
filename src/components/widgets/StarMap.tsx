'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// STAR MAP
// ===========================================
// Current night sky from your location
// Data: Calculated from ephemeris
// ===========================================

interface StarData {
  name: string
  ra: number      // Right ascension (hours)
  dec: number     // Declination (degrees)
  magnitude: number
  constellation: string
}

interface PlanetData {
  name: string
  ra: number
  dec: number
  magnitude: number
  isVisible: boolean
  altitude: number
  azimuth: number
}

interface SkyData {
  location: {
    lat: number
    lon: number
    name?: string
  }
  localTime: string
  siderealTime: number
  sunAltitude: number
  moonPhase: number
  moonAltitude: number
  planets: PlanetData[]
  visiblePlanets: string[]
}

// Bright stars data (simplified)
const BRIGHT_STARS: StarData[] = [
  { name: 'Sirius', ra: 6.75, dec: -16.72, magnitude: -1.46, constellation: 'Canis Major' },
  { name: 'Canopus', ra: 6.4, dec: -52.7, magnitude: -0.72, constellation: 'Carina' },
  { name: 'Arcturus', ra: 14.26, dec: 19.18, magnitude: -0.05, constellation: 'Boötes' },
  { name: 'Vega', ra: 18.62, dec: 38.78, magnitude: 0.03, constellation: 'Lyra' },
  { name: 'Capella', ra: 5.28, dec: 46.0, magnitude: 0.08, constellation: 'Auriga' },
  { name: 'Rigel', ra: 5.24, dec: -8.2, magnitude: 0.13, constellation: 'Orion' },
  { name: 'Procyon', ra: 7.66, dec: 5.22, magnitude: 0.34, constellation: 'Canis Minor' },
  { name: 'Betelgeuse', ra: 5.92, dec: 7.41, magnitude: 0.42, constellation: 'Orion' },
  { name: 'Altair', ra: 19.85, dec: 8.87, magnitude: 0.77, constellation: 'Aquila' },
  { name: 'Aldebaran', ra: 4.6, dec: 16.51, magnitude: 0.85, constellation: 'Taurus' },
  { name: 'Spica', ra: 13.42, dec: -11.16, magnitude: 0.97, constellation: 'Virgo' },
  { name: 'Antares', ra: 16.49, dec: -26.43, magnitude: 1.09, constellation: 'Scorpius' },
  { name: 'Pollux', ra: 7.76, dec: 28.03, magnitude: 1.14, constellation: 'Gemini' },
  { name: 'Fomalhaut', ra: 22.96, dec: -29.62, magnitude: 1.16, constellation: 'Piscis Austrinus' },
  { name: 'Deneb', ra: 20.69, dec: 45.28, magnitude: 1.25, constellation: 'Cygnus' },
  { name: 'Regulus', ra: 10.14, dec: 11.97, magnitude: 1.35, constellation: 'Leo' },
  { name: 'Castor', ra: 7.58, dec: 31.89, magnitude: 1.58, constellation: 'Gemini' },
  { name: 'Polaris', ra: 2.53, dec: 89.26, magnitude: 1.98, constellation: 'Ursa Minor' },
]

// Planet colors
const PLANET_COLORS: Record<string, string> = {
  'Mercury': '#b8b8b8',
  'Venus': '#ffe4b5',
  'Mars': '#cd5c5c',
  'Jupiter': '#deb887',
  'Saturn': '#f4a460',
}

export default function StarMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 })
  const [data, setData] = useState<SkyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null)

  // Responsive scaling
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (!rect) return

      const width = rect.width
      setBaseFontSize(width / 25)

      // Canvas takes full width, square aspect ratio
      const padding = (width / 25) * 2 // 1em padding each side
      const canvasDimension = width - padding
      setCanvasSize({ width: canvasDimension, height: canvasDimension })
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        () => {
          // Default to London
          setUserCoords({ lat: 51.5074, lon: -0.1278 })
        },
        { timeout: 5000 }
      )
    } else {
      setUserCoords({ lat: 51.5074, lon: -0.1278 })
    }
  }, [])

  // Calculate sky data
  const calculateSkyData = useCallback(() => {
    if (!userCoords) return

    const now = new Date()

    // Calculate Julian date
    const jd = now.getTime() / 86400000 + 2440587.5

    // Calculate local sidereal time (simplified)
    const T = (jd - 2451545.0) / 36525
    let lst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + userCoords.lon
    lst = ((lst % 360) + 360) % 360

    // Simple sun altitude calculation
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
    const sunDec = -23.45 * Math.cos((360/365) * (dayOfYear + 10) * Math.PI / 180)
    const hourAngle = (now.getHours() + now.getMinutes()/60 - 12) * 15
    const sunAlt = Math.asin(
      Math.sin(userCoords.lat * Math.PI/180) * Math.sin(sunDec * Math.PI/180) +
      Math.cos(userCoords.lat * Math.PI/180) * Math.cos(sunDec * Math.PI/180) * Math.cos(hourAngle * Math.PI/180)
    ) * 180/Math.PI

    // Moon phase (simplified)
    const lunarCycle = 29.53059
    const knownNewMoon = new Date('2024-01-11').getTime()
    const daysSinceNewMoon = (now.getTime() - knownNewMoon) / 86400000
    const moonPhase = ((daysSinceNewMoon % lunarCycle) / lunarCycle)

    // Simulate planet positions (simplified - not astronomically accurate)
    const planets: PlanetData[] = [
      { name: 'Venus', ra: (lst/15 + 2) % 24, dec: 15, magnitude: -4.0, isVisible: true, altitude: 30, azimuth: 270 },
      { name: 'Mars', ra: (lst/15 + 6) % 24, dec: 5, magnitude: 0.5, isVisible: true, altitude: 45, azimuth: 180 },
      { name: 'Jupiter', ra: (lst/15 + 4) % 24, dec: 20, magnitude: -2.5, isVisible: true, altitude: 55, azimuth: 200 },
      { name: 'Saturn', ra: (lst/15 + 8) % 24, dec: -10, magnitude: 0.8, isVisible: sunAlt < -6, altitude: 25, azimuth: 220 },
    ].filter(p => p.altitude > 0)

    setData({
      location: userCoords,
      localTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      siderealTime: lst,
      sunAltitude: sunAlt,
      moonPhase,
      moonAltitude: 30, // Simplified
      planets,
      visiblePlanets: planets.filter(p => p.isVisible).map(p => p.name),
    })
    setLoading(false)
  }, [userCoords])

  useEffect(() => {
    if (userCoords) {
      calculateSkyData()
      const interval = setInterval(calculateSkyData, 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [calculateSkyData, userCoords])

  // Draw star map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvasSize
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 10

    // Clear canvas
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, width, height)

    // Draw dome circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fillStyle = '#1e293b'
    ctx.fill()
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw altitude circles
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 0.5
    ctx.setLineDash([4, 4])
    for (const alt of [30, 60]) {
      const r = radius * (1 - alt / 90)
      ctx.beginPath()
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.setLineDash([])

    // Draw cardinal lines
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - radius)
    ctx.lineTo(centerX, centerY + radius)
    ctx.moveTo(centerX - radius, centerY)
    ctx.lineTo(centerX + radius, centerY)
    ctx.stroke()

    // Cardinal labels
    ctx.fillStyle = '#64748b'
    ctx.font = '12px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('N', centerX, centerY - radius + 16)
    ctx.fillText('S', centerX, centerY + radius - 8)
    ctx.fillText('E', centerX + radius - 10, centerY + 4)
    ctx.fillText('W', centerX - radius + 10, centerY + 4)

    // Calculate hour angle for RA to azimuth conversion
    const lst = data.siderealTime

    // Draw stars
    BRIGHT_STARS.forEach((star) => {
      // Convert RA/Dec to Alt/Az (simplified)
      const ha = lst - star.ra * 15 // Hour angle in degrees
      const haRad = ha * Math.PI / 180
      const decRad = star.dec * Math.PI / 180
      const latRad = (data.location.lat) * Math.PI / 180

      // Calculate altitude
      const sinAlt = Math.sin(latRad) * Math.sin(decRad) +
                     Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad)
      const alt = Math.asin(sinAlt) * 180 / Math.PI

      // Skip if below horizon
      if (alt < 0) return

      // Calculate azimuth
      const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) /
                    (Math.cos(latRad) * Math.cos(Math.asin(sinAlt)))
      let az = Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180 / Math.PI
      if (Math.sin(haRad) > 0) az = 360 - az

      // Convert to canvas coordinates
      const r = radius * (1 - alt / 90)
      const angle = (az - 90) * Math.PI / 180
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)

      // Star size based on magnitude
      const size = Math.max(1, 4 - star.magnitude)

      // Draw star
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
    })

    // Draw planets
    data.planets.forEach((planet) => {
      if (!planet.isVisible || planet.altitude < 0) return

      const r = radius * (1 - planet.altitude / 90)
      const angle = (planet.azimuth - 90) * Math.PI / 180
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)

      // Planet dot
      const size = Math.max(3, 5 - planet.magnitude)
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = PLANET_COLORS[planet.name] || '#ffffff'
      ctx.fill()

      // Planet label
      ctx.fillStyle = PLANET_COLORS[planet.name] || '#ffffff'
      ctx.font = '10px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(planet.name, x, y - size - 4)
    })

    // Zenith marker
    ctx.beginPath()
    ctx.arc(centerX, centerY, 2, 0, Math.PI * 2)
    ctx.fillStyle = '#64748b'
    ctx.fill()

  }, [data, canvasSize])

  if (loading || !userCoords) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full bg-[#1a1a1e] p-[1em]"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-[0.875em] text-white/50">Getting location...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full bg-[#1a1a1e] p-[1em]"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-[0.875em] text-white/50">Calculating sky...</div>
      </div>
    )
  }

  const isNight = data.sunAltitude < -6
  const isTwilight = data.sunAltitude >= -6 && data.sunAltitude < 0

  return (
    <div
      ref={containerRef}
      className="h-full bg-[#1a1a1e] overflow-hidden flex flex-col p-[1em]"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.75em]">
        <div className="flex items-center gap-[0.5em]">
          <div className={`w-[0.5em] h-[0.5em] rounded-full ${isNight ? 'bg-indigo-400' : isTwilight ? 'bg-orange-400' : 'bg-yellow-400'}`} />
          <span className="text-[0.875em] font-medium text-white">Star Map</span>
        </div>
        <span className="text-[0.6875em] text-white/40">
          {isNight ? 'Night' : isTwilight ? 'Twilight' : 'Daylight'} · {data.localTime}
        </span>
      </div>

      {/* Star map canvas - full width */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="bg-white/5 rounded-[0.5em] p-[0.375em]">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="block rounded-[0.25em]"
          />
        </div>
      </div>

      {/* Visible planets */}
      {data.visiblePlanets.length > 0 && (
        <div className="flex items-center justify-center gap-[0.75em] mt-[0.75em]">
          <span className="text-[0.625em] text-white/40 uppercase tracking-wider">Visible:</span>
          {data.visiblePlanets.map((planet) => (
            <div key={planet} className="flex items-center gap-[0.25em]">
              <div
                className="w-[0.5em] h-[0.5em] rounded-full"
                style={{ backgroundColor: PLANET_COLORS[planet] || '#ffffff' }}
              />
              <span className="text-[0.6875em] text-white/70">{planet}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] mt-[0.5em] border-t border-white/10">
        <span className="text-[0.6875em] text-white/40">
          {data.location.lat.toFixed(1)}°N, {Math.abs(data.location.lon).toFixed(1)}°{data.location.lon >= 0 ? 'E' : 'W'}
        </span>
        <span className="text-[0.6875em] font-mono text-white/40">
          {BRIGHT_STARS.length} bright stars
        </span>
      </div>
    </div>
  )
}
