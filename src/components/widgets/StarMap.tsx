'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// STAR MAP
// ===========================================
// Current night sky from your location
// Data: Calculated from ephemeris
//
// Design notes:
// - NO title/live dot (WidgetFrame handles those)
// - Warm grey background (#A6A09B)
// - Black sky dome with cream grid lines
// - Clickable celestial objects list with selection
// ===========================================

interface CelestialObject {
  name: string
  ra: number
  dec: number
  magnitude: number
  altitude: number
  azimuth: number
  type: 'star' | 'planet'
}

interface SkyData {
  location: {
    lat: number
    lon: number
  }
  localTime: string
  siderealTime: number
  sunAltitude: number
  moonPhase: number
  moonAltitude: number
  visibleStars: CelestialObject[]
  visiblePlanets: CelestialObject[]
}

// Bright stars data
const BRIGHT_STARS = [
  { name: 'Sirius', ra: 6.75, dec: -16.72, magnitude: -1.46 },
  { name: 'Canopus', ra: 6.4, dec: -52.7, magnitude: -0.72 },
  { name: 'Arcturus', ra: 14.26, dec: 19.18, magnitude: -0.05 },
  { name: 'Vega', ra: 18.62, dec: 38.78, magnitude: 0.03 },
  { name: 'Capella', ra: 5.28, dec: 46.0, magnitude: 0.08 },
  { name: 'Rigel', ra: 5.24, dec: -8.2, magnitude: 0.13 },
  { name: 'Procyon', ra: 7.66, dec: 5.22, magnitude: 0.34 },
  { name: 'Betelgeuse', ra: 5.92, dec: 7.41, magnitude: 0.42 },
  { name: 'Altair', ra: 19.85, dec: 8.87, magnitude: 0.77 },
  { name: 'Aldebaran', ra: 4.6, dec: 16.51, magnitude: 0.85 },
  { name: 'Spica', ra: 13.42, dec: -11.16, magnitude: 0.97 },
  { name: 'Antares', ra: 16.49, dec: -26.43, magnitude: 1.09 },
  { name: 'Pollux', ra: 7.76, dec: 28.03, magnitude: 1.14 },
  { name: 'Fomalhaut', ra: 22.96, dec: -29.62, magnitude: 1.16 },
  { name: 'Deneb', ra: 20.69, dec: 45.28, magnitude: 1.25 },
  { name: 'Regulus', ra: 10.14, dec: 11.97, magnitude: 1.35 },
  { name: 'Castor', ra: 7.58, dec: 31.89, magnitude: 1.58 },
  { name: 'Polaris', ra: 2.53, dec: 89.26, magnitude: 1.98 },
]

// Planet colors
const PLANET_COLORS: Record<string, string> = {
  'Mercury': '#b8b8b8',
  'Venus': '#ffe4b5',
  'Mars': '#cd5c5c',
  'Jupiter': '#deb887',
  'Saturn': '#f4a460',
}

// Get compass direction from azimuth
function getCompassDirection(azimuth: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(azimuth / 22.5) % 16
  return directions[index]
}

export default function StarMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [containerWidth, setContainerWidth] = useState(400)
  const [data, setData] = useState<SkyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [showAllStars, setShowAllStars] = useState(false)

  // Responsive scaling
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setContainerWidth(width)
      setBaseFontSize(width / 25)
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
    const jd = now.getTime() / 86400000 + 2440587.5

    // Local sidereal time
    let lst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + userCoords.lon
    lst = ((lst % 360) + 360) % 360

    // Sun altitude
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
    const sunDec = -23.45 * Math.cos((360/365) * (dayOfYear + 10) * Math.PI / 180)
    const hourAngle = (now.getHours() + now.getMinutes()/60 - 12) * 15
    const sunAlt = Math.asin(
      Math.sin(userCoords.lat * Math.PI/180) * Math.sin(sunDec * Math.PI/180) +
      Math.cos(userCoords.lat * Math.PI/180) * Math.cos(sunDec * Math.PI/180) * Math.cos(hourAngle * Math.PI/180)
    ) * 180/Math.PI

    // Moon phase
    const lunarCycle = 29.53059
    const knownNewMoon = new Date('2024-01-11').getTime()
    const daysSinceNewMoon = (now.getTime() - knownNewMoon) / 86400000
    const moonPhase = ((daysSinceNewMoon % lunarCycle) / lunarCycle)

    // Calculate visible stars
    const visibleStars: CelestialObject[] = []
    BRIGHT_STARS.forEach((star) => {
      const ha = lst - star.ra * 15
      const haRad = ha * Math.PI / 180
      const decRad = star.dec * Math.PI / 180
      const latRad = userCoords.lat * Math.PI / 180

      const sinAlt = Math.sin(latRad) * Math.sin(decRad) +
                     Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad)
      const alt = Math.asin(sinAlt) * 180 / Math.PI

      if (alt > 0) {
        const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) /
                      (Math.cos(latRad) * Math.cos(Math.asin(sinAlt)))
        let az = Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180 / Math.PI
        if (Math.sin(haRad) > 0) az = 360 - az

        visibleStars.push({
          name: star.name,
          ra: star.ra,
          dec: star.dec,
          magnitude: star.magnitude,
          altitude: Math.round(alt),
          azimuth: Math.round(az),
          type: 'star' as const,
        })
      }
    })

    // Sort by brightness
    visibleStars.sort((a, b) => a.magnitude - b.magnitude)

    // Simulated planet positions
    const visiblePlanets: CelestialObject[] = [
      { name: 'Venus', ra: (lst/15 + 2) % 24, dec: 15, magnitude: -4.0, altitude: 30, azimuth: 270, type: 'planet' as const },
      { name: 'Mars', ra: (lst/15 + 6) % 24, dec: 5, magnitude: 0.5, altitude: 45, azimuth: 180, type: 'planet' as const },
      { name: 'Jupiter', ra: (lst/15 + 4) % 24, dec: 20, magnitude: -2.5, altitude: 55, azimuth: 200, type: 'planet' as const },
      { name: 'Saturn', ra: (lst/15 + 8) % 24, dec: -10, magnitude: 0.8, altitude: 25, azimuth: 220, type: 'planet' as const },
    ].filter(p => p.altitude > 0 && (sunAlt < -6 || p.magnitude < -1))

    setData({
      location: userCoords,
      localTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      siderealTime: lst,
      sunAltitude: sunAlt,
      moonPhase,
      moonAltitude: 30,
      visibleStars,
      visiblePlanets,
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

    const size = containerWidth - (baseFontSize * 2)
    canvas.width = size
    canvas.height = size

    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 8

    // Background - black
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, size, size)

    // Dome circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fillStyle = '#000000'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Altitude circles
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 0.5
    ctx.setLineDash([4, 4])
    for (const alt of [30, 60]) {
      const r = radius * (1 - alt / 90)
      ctx.beginPath()
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.setLineDash([])

    // Cardinal lines
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - radius)
    ctx.lineTo(centerX, centerY + radius)
    ctx.moveTo(centerX - radius, centerY)
    ctx.lineTo(centerX + radius, centerY)
    ctx.stroke()

    // Cardinal labels - cream on black
    ctx.fillStyle = '#d4d0c8'
    ctx.font = '11px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('N', centerX, centerY - radius + 14)
    ctx.fillText('S', centerX, centerY + radius - 6)
    ctx.fillText('E', centerX + radius - 10, centerY + 4)
    ctx.fillText('W', centerX - radius + 10, centerY + 4)

    // Draw stars
    data.visibleStars.forEach((star) => {
      const r = radius * (1 - star.altitude / 90)
      const angle = (star.azimuth - 90) * Math.PI / 180
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)

      const starSize = Math.max(1, 3.5 - star.magnitude)

      // Selection highlight
      if (selectedObject === star.name) {
        ctx.beginPath()
        ctx.arc(x, y, starSize + 4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(x, y, starSize, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
    })

    // Draw planets (no labels on dome)
    data.visiblePlanets.forEach((planet) => {
      const r = radius * (1 - planet.altitude / 90)
      const angle = (planet.azimuth - 90) * Math.PI / 180
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)

      const planetSize = Math.max(3, 5 - planet.magnitude)

      // Selection highlight
      if (selectedObject === planet.name) {
        ctx.beginPath()
        ctx.arc(x, y, planetSize + 4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(x, y, planetSize, 0, Math.PI * 2)
      ctx.fillStyle = PLANET_COLORS[planet.name] || '#ffffff'
      ctx.fill()
    })

    // Zenith marker
    ctx.beginPath()
    ctx.arc(centerX, centerY, 2, 0, Math.PI * 2)
    ctx.fillStyle = '#d4d0c8'
    ctx.fill()

  }, [data, containerWidth, baseFontSize, selectedObject])

  // Loading state
  if (loading || !userCoords) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full p-[1em]"
        style={{ fontSize: `${baseFontSize}px`, backgroundColor: '#A6A09B' }}
      >
        <div className="text-[0.875em] text-black/50">Getting location...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full p-[1em]"
        style={{ fontSize: `${baseFontSize}px`, backgroundColor: '#A6A09B' }}
      >
        <div className="text-[0.875em] text-black/50">Calculating sky...</div>
      </div>
    )
  }

  const isNight = data.sunAltitude < -6
  const isTwilight = data.sunAltitude >= -6 && data.sunAltitude < 0
  const canvasSize = containerWidth - (baseFontSize * 2)
  const displayStars = showAllStars ? data.visibleStars : data.visibleStars.slice(0, 4)

  return (
    <div
      ref={containerRef}
      className="h-full overflow-hidden flex flex-col p-[1em]"
      style={{ fontSize: `${baseFontSize}px`, backgroundColor: '#A6A09B' }}
    >
      {/* Status bar - top right */}
      <div className="flex items-center justify-end gap-[0.5em] mb-[0.5em]">
        <div className={`w-[0.375em] h-[0.375em] rounded-full ${isNight ? 'bg-indigo-500' : isTwilight ? 'bg-orange-400' : 'bg-yellow-400'}`} />
        <span className="text-[0.75em] text-black/50">
          {isNight ? 'Night' : isTwilight ? 'Twilight' : 'Daylight'} · {data.localTime}
        </span>
      </div>

      {/* Star map canvas - full width */}
      <div className="flex justify-center mb-[0.75em]">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="block rounded-[0.25em]"
        />
      </div>

      {/* Celestial objects list */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {/* Planets section */}
        {data.visiblePlanets.length > 0 && (
          <div className="mb-[0.5em]">
            <div className="text-[0.625em] text-black/40 uppercase tracking-wider mb-[0.25em]">
              Planets
            </div>
            {data.visiblePlanets.map((planet) => (
              <button
                key={planet.name}
                onClick={() => setSelectedObject(selectedObject === planet.name ? null : planet.name)}
                className={`w-full flex items-center justify-between py-[0.25em] px-[0.375em] rounded-[0.25em] transition-colors ${
                  selectedObject === planet.name ? 'bg-black/15' : 'hover:bg-black/5'
                }`}
              >
                <div className="flex items-center gap-[0.375em]">
                  <div
                    className="w-[0.5em] h-[0.5em] rounded-full"
                    style={{ backgroundColor: PLANET_COLORS[planet.name] }}
                  />
                  <span className="text-[0.75em] text-black/80">{planet.name}</span>
                </div>
                <span className="text-[0.625em] font-mono text-black/50">
                  {planet.altitude}° {getCompassDirection(planet.azimuth)}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Stars section */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="text-[0.625em] text-black/40 uppercase tracking-wider mb-[0.25em]">
            Stars
          </div>
          {displayStars.map((star) => (
            <button
              key={star.name}
              onClick={() => setSelectedObject(selectedObject === star.name ? null : star.name)}
              className={`w-full flex items-center justify-between py-[0.25em] px-[0.375em] rounded-[0.25em] transition-colors ${
                selectedObject === star.name ? 'bg-black/15' : 'hover:bg-black/5'
              }`}
            >
              <div className="flex items-center gap-[0.375em]">
                <div className="w-[0.5em] h-[0.5em] rounded-full bg-white border border-black/20" />
                <span className="text-[0.75em] text-black/80">{star.name}</span>
              </div>
              <span className="text-[0.625em] font-mono text-black/50">
                {star.altitude}° {getCompassDirection(star.azimuth)}
              </span>
            </button>
          ))}
          {data.visibleStars.length > 4 && (
            <button
              onClick={() => setShowAllStars(!showAllStars)}
              className="w-full text-[0.6875em] text-black/40 hover:text-black/60 py-[0.25em]"
            >
              {showAllStars ? 'Show less' : `+${data.visibleStars.length - 4} more visible`}
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] mt-auto border-t border-black/10">
        <span className="text-[0.625em] text-black/50">
          {data.location.lat.toFixed(1)}°{data.location.lat >= 0 ? 'N' : 'S'}, {Math.abs(data.location.lon).toFixed(1)}°{data.location.lon >= 0 ? 'E' : 'W'}
        </span>
        <span className="text-[0.625em] font-mono text-black/50">
          {data.visibleStars.length} stars visible
        </span>
      </div>
    </div>
  )
}
