'use client'

import { useState, useEffect, useRef } from 'react'

// ===========================================
// AIR JOURNEY
// ===========================================
// Shows where the air you're breathing came from
// Back-trajectory visualization
//
// Design notes:
// - NO title/live dot/description/source (WidgetFrame handles those)
// - Hero stat showing origin
// - Canvas trajectory map
// - Timeline footer
// ===========================================

interface TrajectoryPoint {
  hoursAgo: number
  lat: number
  lon: number
  altitude: number
  location: string
}

function getLocationName(lat: number, lon: number): string {
  if (lon < -100 && lon > -170 && lat > 20 && lat < 70) return 'Pacific Ocean'
  if (lon < -30 && lon > -100 && lat > 20 && lat < 50) return 'Atlantic Ocean'
  if (lon < 0 && lon > -30 && lat > 35 && lat < 60) return 'North Atlantic'
  if (lon < -100 && lat > 40 && lat < 60) return 'Canada'
  if (lon < -60 && lon > -125 && lat > 25 && lat < 50) return 'United States'
  if (lon > -10 && lon < 30 && lat > 35 && lat < 70) return 'Europe'
  if (lon > -10 && lon < 40 && lat > 10 && lat < 35) return 'Sahara Desert'
  if (lon > -25 && lon < 0 && lat > 15 && lat < 35) return 'Canary Current'
  if (lon > 30 && lon < 60 && lat > 40 && lat < 70) return 'Russia'
  if (lon > 60 && lon < 100 && lat > 30 && lat < 50) return 'Central Asia'
  if (lon > 100 && lon < 145 && lat > 20 && lat < 50) return 'East Asia'
  if (lon > 140 && lat > 30 && lat < 50) return 'Japan'
  if (lat > 60) return 'Arctic'
  if (lat < -60) return 'Antarctica'
  if (lat < 0 && lat > -30 && lon > 10 && lon < 50) return 'Indian Ocean'
  if (lon > -180 && lon < -100 && lat > -60 && lat < 0) return 'South Pacific'
  return 'Open Ocean'
}

function generateTrajectory(lat: number, lon: number): TrajectoryPoint[] {
  const points: TrajectoryPoint[] = []
  const isNorthern = lat > 0
  const baseDirection = isNorthern ? 0.15 : -0.1
  const latVariation = 0.02
  let altitude = 100

  for (let hours = 0; hours <= 120; hours += 6) {
    const noise = Math.sin(hours * 0.1) * 0.5
    const lonDelta = baseDirection * hours + noise
    const latDelta = Math.sin(hours * 0.08) * latVariation * hours

    const newLon = lon - lonDelta
    const newLat = lat + latDelta
    altitude = 100 + Math.sin(hours * 0.05) * 2000 + hours * 10

    points.push({
      hoursAgo: hours,
      lat: newLat,
      lon: newLon,
      altitude: Math.round(altitude),
      location: getLocationName(newLat, newLon)
    })
  }

  return points
}

export default function AirJourney() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([])
  const [userLocation, setUserLocation] = useState({ lat: 51.5, lon: -0.12 })
  const [loading, setLoading] = useState(true)

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
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          })
        },
        () => {
          // Default to London
        }
      )
    }
  }, [])

  // Generate trajectory when location changes
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setTrajectory(generateTrajectory(userLocation.lat, userLocation.lon))
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [userLocation])

  // Draw trajectory on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || trajectory.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear
    ctx.fillStyle = '#0a1628'
    ctx.fillRect(0, 0, width, height)

    // Calculate bounds
    const lats = trajectory.map(p => p.lat)
    const lons = trajectory.map(p => p.lon)
    const minLat = Math.min(...lats) - 5
    const maxLat = Math.max(...lats) + 5
    const minLon = Math.min(...lons) - 10
    const maxLon = Math.max(...lons) + 10

    const toX = (lon: number) => ((lon - minLon) / (maxLon - minLon)) * width
    const toY = (lat: number) => height - ((lat - minLat) / (maxLat - minLat)) * height

    // Draw graticule
    ctx.strokeStyle = '#1a2a3a'
    ctx.lineWidth = 1
    for (let lon = -180; lon <= 180; lon += 30) {
      if (lon >= minLon && lon <= maxLon) {
        ctx.beginPath()
        ctx.moveTo(toX(lon), 0)
        ctx.lineTo(toX(lon), height)
        ctx.stroke()
      }
    }
    for (let lat = -90; lat <= 90; lat += 15) {
      if (lat >= minLat && lat <= maxLat) {
        ctx.beginPath()
        ctx.moveTo(0, toY(lat))
        ctx.lineTo(width, toY(lat))
        ctx.stroke()
      }
    }

    // Draw trajectory path
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 3])
    ctx.beginPath()

    trajectory.forEach((point, i) => {
      const x = toX(point.lon)
      const y = toY(point.lat)
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    ctx.setLineDash([])

    // Draw points
    trajectory.forEach((point, i) => {
      const x = toX(point.lon)
      const y = toY(point.lat)

      const size = i === 0 ? 8 : Math.max(3, 6 - i * 0.3)
      const alpha = i === 0 ? 1 : Math.max(0.3, 1 - i * 0.04)

      ctx.fillStyle = i === 0 ? '#22c55e' : `rgba(96, 165, 250, ${alpha})`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()

      // Labels for key points
      if (i === 0 || i === trajectory.length - 1 || i === Math.floor(trajectory.length / 2)) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'center'
        const label = i === 0 ? 'Now' : `${point.hoursAgo}h ago`
        ctx.fillText(label, x, y - size - 4)
      }
    })

    // Direction arrow
    if (trajectory.length >= 2) {
      const end = trajectory[1]
      const start = trajectory[0]
      const dx = toX(start.lon) - toX(end.lon)
      const dy = toY(start.lat) - toY(end.lat)
      const angle = Math.atan2(dy, dx)

      const x = toX(start.lon)
      const y = toY(start.lat)

      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.moveTo(x + Math.cos(angle) * 12, y + Math.sin(angle) * 12)
      ctx.lineTo(x + Math.cos(angle + 2.5) * 8, y + Math.sin(angle + 2.5) * 8)
      ctx.lineTo(x + Math.cos(angle - 2.5) * 8, y + Math.sin(angle - 2.5) * 8)
      ctx.closePath()
      ctx.fill()
    }
  }, [trajectory])

  const origin = trajectory.length > 0 ? trajectory[trajectory.length - 1] : null
  const midpoint = trajectory.length > 0 ? trajectory[Math.floor(trajectory.length / 2)] : null

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full bg-[#0a1628] p-[1em]"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-[0.875em] text-sky-400/50">Tracing air parcels...</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="h-full bg-[#0a1628] overflow-hidden flex flex-col p-[1em]"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Hero stat */}
      {origin && (
        <div className="text-center mb-[0.5em]">
          <div className="text-[0.625em] text-white/40 uppercase tracking-wider">
            5 days ago, over
          </div>
          <div className="text-[1.5em] font-bold text-white">
            {origin.location}
          </div>
          <div className="text-[0.75em] text-sky-400">
            at {origin.altitude.toLocaleString()}m altitude
          </div>
        </div>
      )}

      {/* Map canvas */}
      <div className="flex-1 relative min-h-0 rounded-[0.5em] overflow-hidden border border-sky-900/50">
        <canvas
          ref={canvasRef}
          width={400}
          height={220}
          className="w-full h-full"
        />
      </div>

      {/* Journey summary */}
      {origin && midpoint && (
        <div className="mt-[0.5em] p-[0.5em] bg-sky-900/20 rounded-[0.375em]">
          <p className="text-[0.625em] text-white/70 leading-relaxed">
            This air passed through {midpoint.location} about {Math.floor(midpoint.hoursAgo / 24)} days ago before arriving here.
          </p>
        </div>
      )}

      {/* Timeline */}
      <div className="mt-[0.5em] pt-[0.5em] border-t border-sky-900/30">
        <div className="flex justify-between">
          {[0, 24, 48, 72, 96, 120].map((hours) => {
            const point = trajectory.find(p => p.hoursAgo === hours)
            return (
              <div key={hours} className="text-center">
                <div className="text-[0.5625em] text-white/30">
                  {hours === 0 ? 'Now' : `-${hours / 24}d`}
                </div>
                {point && (
                  <div className="text-[0.5em] text-sky-400/50 truncate max-w-[3em]">
                    {point.location.split(' ')[0]}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] mt-[0.5em] border-t border-sky-900/30">
        <span className="text-[0.625em] text-white/30">
          Based on typical patterns
        </span>
        <span className="text-[0.625em] text-white/30 font-mono">
          {userLocation.lat.toFixed(1)}°, {userLocation.lon.toFixed(1)}°
        </span>
      </div>
    </div>
  )
}
