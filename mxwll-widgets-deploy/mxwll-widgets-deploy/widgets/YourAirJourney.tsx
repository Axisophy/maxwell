'use client'

import { useState, useEffect, useRef } from 'react'

// ===========================================
// YOUR AIR'S JOURNEY
// ===========================================
// Shows where the air you're breathing came from
// Back-trajectory visualization
// ===========================================

interface TrajectoryPoint {
  hoursAgo: number
  lat: number
  lon: number
  altitude: number
  location: string
}

// Generate a simulated trajectory based on location and typical weather patterns
function generateTrajectory(lat: number, lon: number): TrajectoryPoint[] {
  const points: TrajectoryPoint[] = []
  
  // Start at current location
  let currentLat = lat
  let currentLon = lon
  let altitude = 100 // meters above ground
  
  // Simulate 5 days of back-trajectory (120 hours)
  // Northern hemisphere typically has westerly winds
  const isNorthern = lat > 0
  const baseDirection = isNorthern ? 0.15 : -0.1 // degrees per hour longitude movement
  const latVariation = 0.02 // latitude variation
  
  for (let hours = 0; hours <= 120; hours += 6) {
    const noise = Math.sin(hours * 0.1) * 0.5
    const lonDelta = baseDirection * hours + noise
    const latDelta = Math.sin(hours * 0.08) * latVariation * hours
    
    const newLon = lon - lonDelta
    const newLat = lat + latDelta
    
    // Altitude variation (air masses rise and fall)
    altitude = 100 + Math.sin(hours * 0.05) * 2000 + hours * 10
    
    // Determine location name based on coordinates
    const location = getLocationName(newLat, newLon)
    
    points.push({
      hoursAgo: hours,
      lat: newLat,
      lon: newLon,
      altitude: Math.round(altitude),
      location
    })
    
    currentLat = newLat
    currentLon = newLon
  }
  
  return points
}

function getLocationName(lat: number, lon: number): string {
  // Simplified location naming
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

function getJourneyNarrative(trajectory: TrajectoryPoint[]): string {
  if (trajectory.length < 2) return ''
  
  const endPoint = trajectory[trajectory.length - 1]
  const midPoint = trajectory[Math.floor(trajectory.length / 2)]
  
  const days = Math.floor(endPoint.hoursAgo / 24)
  
  return `${days} days ago, this air was over ${endPoint.location}. ` +
    `It passed through ${midPoint.location} about ${Math.floor(midPoint.hoursAgo / 24)} days ago ` +
    `before arriving here.`
}

export default function YourAirJourney() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([])
  const [userLocation, setUserLocation] = useState({ lat: 51.5, lon: -0.12, name: 'London, UK' })
  const [selectedPoint, setSelectedPoint] = useState<TrajectoryPoint | null>(null)
  const [loading, setLoading] = useState(true)
  
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
          setUserLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            name: 'Your Location'
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
      const traj = generateTrajectory(userLocation.lat, userLocation.lon)
      setTrajectory(traj)
      setLoading(false)
    }, 500)
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
    
    // Draw simple land masses (very simplified)
    ctx.fillStyle = '#1a2a3a'
    
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
    
    // Draw points along trajectory
    trajectory.forEach((point, i) => {
      const x = toX(point.lon)
      const y = toY(point.lat)
      
      // Size decreases with age
      const size = i === 0 ? 8 : Math.max(3, 6 - i * 0.3)
      const alpha = i === 0 ? 1 : Math.max(0.3, 1 - i * 0.04)
      
      ctx.fillStyle = i === 0 ? '#22c55e' : `rgba(96, 165, 250, ${alpha})`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
      
      // Label for significant points
      if (i === 0 || i === trajectory.length - 1 || i === Math.floor(trajectory.length / 2)) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'center'
        const label = i === 0 ? 'Now' : `${point.hoursAgo}h ago`
        ctx.fillText(label, x, y - size - 4)
      }
    })
    
    // Arrow showing direction
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
  
  const narrative = trajectory.length > 0 ? getJourneyNarrative(trajectory) : ''
  const origin = trajectory.length > 0 ? trajectory[trajectory.length - 1] : null
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-[#0a1628] rounded-xl p-[1em] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.5em]">
        <div>
          <div className="text-[0.625em] font-medium text-sky-400/60 uppercase tracking-wider">
            YOUR AIR'S JOURNEY
          </div>
          <div className="text-[0.4375em] text-sky-400/30">
            Where the air you're breathing came from
          </div>
        </div>
        <div className="flex items-center gap-[0.25em]">
          <div className="w-[0.5em] h-[0.5em] rounded-full bg-sky-400 animate-pulse" />
          <span className="text-[0.5em] text-sky-400/60">LIVE</span>
        </div>
      </div>
      
      {/* Hero stat */}
      <div className="text-center mb-[0.5em]">
        {origin && (
          <>
            <div className="text-[0.5em] text-white/40 uppercase">5 days ago, over</div>
            <div className="text-[1.25em] font-bold text-white">{origin.location}</div>
            <div className="text-[0.5em] text-sky-400">
              at {origin.altitude.toLocaleString()}m altitude
            </div>
          </>
        )}
      </div>
      
      {/* Map canvas */}
      <div className="flex-1 relative min-h-0 rounded-lg overflow-hidden border border-sky-900/50">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[0.75em] text-sky-400/50">Tracing air parcels...</div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={400}
            height={250}
            className="w-full h-full"
          />
        )}
      </div>
      
      {/* Journey narrative */}
      <div className="mt-[0.5em] p-[0.5em] bg-sky-900/20 rounded-lg">
        <p className="text-[0.5em] text-white/70 leading-relaxed">
          {narrative}
        </p>
      </div>
      
      {/* Timeline */}
      <div className="mt-[0.5em] pt-[0.5em] border-t border-sky-900/30">
        <div className="flex justify-between">
          {[0, 24, 48, 72, 96, 120].map((hours) => {
            const point = trajectory.find(p => p.hoursAgo === hours)
            return (
              <div key={hours} className="text-center">
                <div className="text-[0.4375em] text-white/30">
                  {hours === 0 ? 'Now' : `-${hours / 24}d`}
                </div>
                {point && (
                  <div className="text-[0.375em] text-sky-400/50 truncate max-w-[3em]">
                    {point.location.split(' ')[0]}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-[0.375em] flex items-center justify-between text-[0.4375em] text-white/30">
        <span>Based on typical atmospheric patterns</span>
        <span>📍 {userLocation.lat.toFixed(1)}°, {userLocation.lon.toFixed(1)}°</span>
      </div>
    </div>
  )
}
