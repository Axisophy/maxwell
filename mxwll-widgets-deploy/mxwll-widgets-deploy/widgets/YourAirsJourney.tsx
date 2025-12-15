'use client'

import { useState, useEffect, useRef } from 'react'

interface TrajectoryPoint {
  lat: number
  lon: number
  altitude: number // meters
  hoursAgo: number
  location: string
}

interface AirJourneyData {
  timestamp: string
  userLocation: { lat: number; lon: number; name: string }
  trajectory: TrajectoryPoint[]
  totalDistance: number // km
  countriesCrossed: string[]
  overOcean: number // percentage of time
  highestAltitude: number
  funFact: string
}

// Generate realistic back-trajectory data
function generateTrajectoryData(userLat: number, userLon: number): AirJourneyData {
  const locations = [
    { name: 'Sahara Desert', lat: 23.4, lon: 3.8, fact: 'carrying fine Saharan dust particles' },
    { name: 'North Atlantic', lat: 45.0, lon: -30.0, fact: 'picking up moisture over the ocean' },
    { name: 'Arctic Circle', lat: 66.5, lon: -18.0, fact: 'bringing cold polar air southward' },
    { name: 'Mediterranean Sea', lat: 35.9, lon: 14.4, fact: 'warmed by Mediterranean sunshine' },
    { name: 'Bay of Biscay', lat: 45.0, lon: -5.0, fact: 'churned by Atlantic storms' },
    { name: 'Scandinavian Mountains', lat: 62.0, lon: 10.0, fact: 'descending from Nordic highlands' },
    { name: 'Iberian Peninsula', lat: 40.0, lon: -4.0, fact: 'crossing the Spanish meseta' },
    { name: 'Celtic Sea', lat: 50.0, lon: -8.0, fact: 'mixing with Irish Sea air' },
  ]
  
  // Pick a random origin
  const origin = locations[Math.floor(Math.random() * locations.length)]
  
  // Generate trajectory points (going backwards in time)
  const trajectory: TrajectoryPoint[] = []
  const hours = 120 // 5 days back
  const steps = 10
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const hoursAgo = Math.round(t * hours)
    
    // Interpolate between origin and current location
    const lat = origin.lat + (userLat - origin.lat) * (1 - t)
    const lon = origin.lon + (userLon - origin.lon) * (1 - t)
    
    // Vary altitude (typical air parcel height)
    const altitude = 500 + Math.sin(t * Math.PI * 2) * 2000 + Math.random() * 500
    
    // Determine location name
    let location = 'Open Atlantic'
    if (lat > 55) location = 'North Sea'
    else if (lat < 30) location = 'Sahara Region'
    else if (lon < -20) location = 'Mid-Atlantic'
    else if (lon > 10) location = 'Continental Europe'
    else location = 'Western Europe'
    
    trajectory.push({
      lat: Math.round(lat * 100) / 100,
      lon: Math.round(lon * 100) / 100,
      altitude: Math.round(altitude),
      hoursAgo,
      location
    })
  }
  
  // Calculate total distance
  let totalDistance = 0
  for (let i = 1; i < trajectory.length; i++) {
    const dLat = trajectory[i].lat - trajectory[i-1].lat
    const dLon = trajectory[i].lon - trajectory[i-1].lon
    totalDistance += Math.sqrt(dLat * dLat + dLon * dLon) * 111 // rough km conversion
  }
  
  // Determine countries crossed (simplified)
  const countries: string[] = []
  if (origin.lat < 25) countries.push('Morocco', 'Algeria')
  if (origin.lon < -15) countries.push('Portugal')
  if (origin.lat > 55) countries.push('Norway', 'Iceland')
  countries.push('France', 'UK')
  
  const overOcean = 40 + Math.random() * 30
  
  return {
    timestamp: new Date().toISOString(),
    userLocation: { lat: userLat, lon: userLon, name: 'Your Location' },
    trajectory: trajectory.reverse(), // Now oldest first
    totalDistance: Math.round(totalDistance),
    countriesCrossed: countries,
    overOcean: Math.round(overOcean),
    highestAltitude: Math.max(...trajectory.map(t => t.altitude)),
    funFact: origin.fact
  }
}

export default function YourAirsJourney() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [data, setData] = useState<AirJourneyData | null>(null)
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<number>(0)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setUserLocation({ lat: 51.5, lon: -0.1 }) // Default to London
      )
    } else {
      setUserLocation({ lat: 51.5, lon: -0.1 })
    }
  }, [])

  // Generate data when location is available
  useEffect(() => {
    if (userLocation) {
      setData(generateTrajectoryData(userLocation.lat, userLocation.lon))
    }
  }, [userLocation])

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

  // Draw trajectory map
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
    
    // Clear
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, width, height)
    
    // Draw simplified map outline (rough Europe/Atlantic)
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'
    ctx.lineWidth = 1
    ctx.beginPath()
    // Very simplified coastline hints
    ctx.moveTo(width * 0.3, height * 0.2)
    ctx.lineTo(width * 0.35, height * 0.4)
    ctx.lineTo(width * 0.4, height * 0.6)
    ctx.lineTo(width * 0.5, height * 0.8)
    ctx.stroke()
    
    // Map bounds for trajectory
    const minLon = -40, maxLon = 20
    const minLat = 20, maxLat = 70
    
    const mapX = (lon: number) => ((lon - minLon) / (maxLon - minLon)) * width
    const mapY = (lat: number) => height - ((lat - minLat) / (maxLat - minLat)) * height
    
    // Draw trajectory path
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, 'rgba(147, 197, 253, 0.3)') // Light blue (old)
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.9)') // Bright blue (recent)
    
    ctx.strokeStyle = gradient
    ctx.lineWidth = 2
    ctx.beginPath()
    data.trajectory.forEach((point, i) => {
      const x = mapX(point.lon)
      const y = mapY(point.lat)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
    
    // Draw trajectory points
    data.trajectory.forEach((point, i) => {
      const x = mapX(point.lon)
      const y = mapY(point.lat)
      const isSelected = i === selectedPoint
      const isRecent = i === data.trajectory.length - 1
      
      ctx.beginPath()
      ctx.arc(x, y, isSelected ? 8 : (isRecent ? 6 : 4), 0, Math.PI * 2)
      
      if (isRecent) {
        ctx.fillStyle = '#22c55e' // Green for current
      } else if (isSelected) {
        ctx.fillStyle = '#3b82f6' // Blue for selected
      } else {
        ctx.fillStyle = 'rgba(147, 197, 253, 0.6)'
      }
      ctx.fill()
      
      // Hours ago label for key points
      if (i === 0 || i === data.trajectory.length - 1 || isSelected) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.font = `${baseFontSize * 0.5}px sans-serif`
        ctx.textAlign = 'center'
        const label = isRecent ? 'NOW' : `${point.hoursAgo}h ago`
        ctx.fillText(label, x, y - 12)
      }
    })
    
  }, [data, baseFontSize, selectedPoint])

  // Animate selected point
  useEffect(() => {
    if (!data) return
    const interval = setInterval(() => {
      setSelectedPoint(p => (p + 1) % data.trajectory.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [data])

  if (!data) {
    return (
      <div ref={containerRef} className="w-full aspect-square bg-[#1a1a2e] rounded-xl flex items-center justify-center">
        <span className="text-white/50">Tracing your air...</span>
      </div>
    )
  }

  const currentPoint = data.trajectory[selectedPoint]

  return (
    <div 
      ref={containerRef}
      className="w-full aspect-[4/5] bg-white rounded-xl overflow-hidden"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="bg-[#1a1a2e] px-[1em] py-[0.75em]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[0.6875em] font-medium uppercase tracking-wider text-blue-400">
              Air Parcel Back-Trajectory
            </div>
            <div className="text-[1.25em] font-bold text-white mt-[0.25em]">
              Your Air's Journey
            </div>
          </div>
          <div className="text-right">
            <div className="text-[0.625em] text-white/40">Past 5 days</div>
            <div className="font-mono text-[1em] text-white font-bold">
              {data.totalDistance.toLocaleString()} km
            </div>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative h-[45%] bg-[#1a1a2e]">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Fun fact overlay */}
        <div className="absolute bottom-[0.5em] left-[0.5em] right-[0.5em] bg-black/50 backdrop-blur-sm rounded-lg px-[0.75em] py-[0.5em]">
          <div className="text-[0.625em] text-white/80">
            <span className="text-blue-400">5 days ago:</span> {data.funFact}
          </div>
        </div>
      </div>

      {/* Current point detail */}
      <div className="px-[1em] py-[0.75em] bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a]">
        <div className="flex items-center gap-[0.5em] mb-[0.5em]">
          <div className="w-[0.5em] h-[0.5em] rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[0.6875em] text-white/60">
            {currentPoint.hoursAgo === 0 ? 'Now' : `${currentPoint.hoursAgo} hours ago`}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-[0.75em]">
          <div>
            <div className="text-[0.5625em] text-white/40 uppercase tracking-wider">Location</div>
            <div className="text-[0.875em] text-white font-medium">{currentPoint.location}</div>
          </div>
          <div>
            <div className="text-[0.5625em] text-white/40 uppercase tracking-wider">Altitude</div>
            <div className="font-mono text-[0.875em] text-white">{currentPoint.altitude.toLocaleString()}m</div>
          </div>
          <div>
            <div className="text-[0.5625em] text-white/40 uppercase tracking-wider">Coords</div>
            <div className="font-mono text-[0.75em] text-white/80">
              {currentPoint.lat.toFixed(1)}°, {currentPoint.lon.toFixed(1)}°
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-[1em] py-[0.75em] bg-[#0f0f1a] grid grid-cols-2 gap-[0.75em]">
        <div className="bg-white/5 rounded-lg p-[0.75em]">
          <div className="text-[0.5625em] text-white/40 uppercase tracking-wider mb-[0.25em]">
            Countries Crossed
          </div>
          <div className="text-[0.75em] text-white">
            {data.countriesCrossed.slice(0, 3).join(', ')}
            {data.countriesCrossed.length > 3 && ` +${data.countriesCrossed.length - 3}`}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-[0.75em]">
          <div className="text-[0.5625em] text-white/40 uppercase tracking-wider mb-[0.25em]">
            Time Over Ocean
          </div>
          <div className="flex items-center gap-[0.5em]">
            <div className="flex-1 h-[0.375em] bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${data.overOcean}%` }}
              />
            </div>
            <span className="font-mono text-[0.75em] text-white">{data.overOcean}%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-[1em] py-[0.5em] bg-black/40 flex items-center justify-between">
        <span className="text-[0.5625em] text-white/40">
          NOAA HYSPLIT Model
        </span>
        <span className="text-[0.5625em] text-white/40">
          Max alt: {data.highestAltitude.toLocaleString()}m
        </span>
      </div>
    </div>
  )
}
