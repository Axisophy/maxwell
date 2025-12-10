'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

// ===========================================
// TIDES WIDGET
// ===========================================
// Live tide predictions for coastal locations worldwide
// - Harmonic calculation from station constants
// - Geolocation to find nearest station
// - 24-hour tide curve visualization
// - Current state (rising/falling)
// - Collapsible events list
//
// Data: Built-in station database (~50 global locations)
// Future: WorldTides API for registered/paid users
// ===========================================

// --- TYPES ---

interface TideStation {
  name: string
  country: string
  lat: number
  lon: number
  meanRange: number    // Average tidal range in meters
  meanLevel: number    // Mean sea level offset
  offset: number       // Time offset from reference in minutes
}

interface TideEvent {
  type: 'high' | 'low'
  time: Date
  height: number
}

interface TidePoint {
  time: Date
  height: number
}

// --- GLOBAL STATION DATABASE ---
// ~50 stations covering major coastal areas worldwide
// Constants are approximations suitable for general interest

const TIDE_STATIONS: TideStation[] = [
  // UK & Ireland
  { name: 'London Bridge', country: 'UK', lat: 51.5074, lon: -0.0877, meanRange: 6.6, meanLevel: 3.5, offset: 0 },
  { name: 'Dover', country: 'UK', lat: 51.1279, lon: 1.3134, meanRange: 5.9, meanLevel: 3.8, offset: 15 },
  { name: 'Brighton', country: 'UK', lat: 50.8225, lon: -0.1372, meanRange: 5.2, meanLevel: 3.4, offset: -45 },
  { name: 'Southampton', country: 'UK', lat: 50.9097, lon: -1.4044, meanRange: 4.0, meanLevel: 2.5, offset: 30 },
  { name: 'Liverpool', country: 'UK', lat: 53.4084, lon: -2.9916, meanRange: 8.4, meanLevel: 5.0, offset: -120 },
  { name: 'Bristol', country: 'UK', lat: 51.4545, lon: -2.5879, meanRange: 12.2, meanLevel: 6.5, offset: -180 },
  { name: 'Edinburgh', country: 'UK', lat: 55.9533, lon: -3.1883, meanRange: 4.8, meanLevel: 2.9, offset: 60 },
  { name: 'St Leonards', country: 'UK', lat: 50.8571, lon: 0.5456, meanRange: 6.0, meanLevel: 3.6, offset: -30 },
  { name: 'Dublin', country: 'Ireland', lat: 53.3498, lon: -6.2603, meanRange: 3.4, meanLevel: 2.4, offset: -90 },
  { name: 'Cork', country: 'Ireland', lat: 51.8985, lon: -8.4756, meanRange: 3.6, meanLevel: 2.3, offset: -75 },
  
  // Western Europe
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041, meanRange: 1.6, meanLevel: 1.0, offset: 45 },
  { name: 'Rotterdam', country: 'Netherlands', lat: 51.9225, lon: 4.4792, meanRange: 1.8, meanLevel: 1.2, offset: 30 },
  { name: 'Antwerp', country: 'Belgium', lat: 51.2194, lon: 4.4025, meanRange: 4.8, meanLevel: 2.9, offset: 15 },
  { name: 'Le Havre', country: 'France', lat: 49.4944, lon: 0.1079, meanRange: 7.2, meanLevel: 4.2, offset: -60 },
  { name: 'Saint-Malo', country: 'France', lat: 48.6493, lon: -2.0076, meanRange: 11.4, meanLevel: 6.4, offset: -120 },
  { name: 'Mont Saint-Michel', country: 'France', lat: 48.6361, lon: -1.5115, meanRange: 14.0, meanLevel: 7.5, offset: -135 },
  { name: 'Brest', country: 'France', lat: 48.3904, lon: -4.4861, meanRange: 5.8, meanLevel: 3.6, offset: -150 },
  { name: 'Lisbon', country: 'Portugal', lat: 38.7223, lon: -9.1393, meanRange: 3.2, meanLevel: 2.0, offset: -180 },
  { name: 'Barcelona', country: 'Spain', lat: 41.3851, lon: 2.1734, meanRange: 0.4, meanLevel: 0.5, offset: 60 },
  { name: 'Gibraltar', country: 'UK', lat: 36.1408, lon: -5.3536, meanRange: 0.9, meanLevel: 0.6, offset: -30 },
  
  // Scandinavia & Baltic
  { name: 'Copenhagen', country: 'Denmark', lat: 55.6761, lon: 12.5683, meanRange: 0.4, meanLevel: 0.3, offset: 90 },
  { name: 'Oslo', country: 'Norway', lat: 59.9139, lon: 10.7522, meanRange: 0.3, meanLevel: 0.2, offset: 75 },
  { name: 'Bergen', country: 'Norway', lat: 60.3913, lon: 5.3221, meanRange: 1.2, meanLevel: 0.8, offset: 45 },
  { name: 'Stockholm', country: 'Sweden', lat: 59.3293, lon: 18.0686, meanRange: 0.1, meanLevel: 0.1, offset: 120 },
  
  // US East Coast
  { name: 'New York', country: 'USA', lat: 40.6892, lon: -74.0445, meanRange: 1.4, meanLevel: 0.9, offset: -300 },
  { name: 'Boston', country: 'USA', lat: 42.3601, lon: -71.0589, meanRange: 2.9, meanLevel: 1.8, offset: -285 },
  { name: 'Miami', country: 'USA', lat: 25.7617, lon: -80.1918, meanRange: 0.8, meanLevel: 0.5, offset: -315 },
  { name: 'Charleston', country: 'USA', lat: 32.7765, lon: -79.9311, meanRange: 1.6, meanLevel: 1.0, offset: -330 },
  
  // US West Coast
  { name: 'Los Angeles', country: 'USA', lat: 33.7405, lon: -118.2653, meanRange: 1.2, meanLevel: 0.9, offset: -480 },
  { name: 'San Francisco', country: 'USA', lat: 37.8199, lon: -122.4783, meanRange: 1.8, meanLevel: 1.1, offset: -465 },
  { name: 'Seattle', country: 'USA', lat: 47.6062, lon: -122.3321, meanRange: 3.4, meanLevel: 2.1, offset: -450 },
  { name: 'San Diego', country: 'USA', lat: 32.7157, lon: -117.1611, meanRange: 1.4, meanLevel: 0.9, offset: -495 },
  
  // Canada
  { name: 'Vancouver', country: 'Canada', lat: 49.2827, lon: -123.1207, meanRange: 3.6, meanLevel: 2.2, offset: -435 },
  { name: 'Halifax', country: 'Canada', lat: 44.6488, lon: -63.5752, meanRange: 1.4, meanLevel: 0.9, offset: -240 },
  { name: 'Bay of Fundy', country: 'Canada', lat: 45.3154, lon: -64.5382, meanRange: 16.0, meanLevel: 8.5, offset: -225 },
  
  // Australia & New Zealand
  { name: 'Sydney', country: 'Australia', lat: -33.8568, lon: 151.2153, meanRange: 1.3, meanLevel: 0.9, offset: 600 },
  { name: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631, meanRange: 0.6, meanLevel: 0.4, offset: 615 },
  { name: 'Brisbane', country: 'Australia', lat: -27.4698, lon: 153.0251, meanRange: 1.8, meanLevel: 1.2, offset: 585 },
  { name: 'Perth', country: 'Australia', lat: -31.9505, lon: 115.8605, meanRange: 0.6, meanLevel: 0.4, offset: 480 },
  { name: 'Auckland', country: 'New Zealand', lat: -36.8485, lon: 174.7633, meanRange: 2.7, meanLevel: 1.7, offset: 720 },
  { name: 'Wellington', country: 'New Zealand', lat: -41.2865, lon: 174.7762, meanRange: 1.1, meanLevel: 0.7, offset: 735 },
  
  // Asia
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, meanRange: 1.5, meanLevel: 1.0, offset: 540 },
  { name: 'Hong Kong', country: 'China', lat: 22.3193, lon: 114.1694, meanRange: 1.6, meanLevel: 1.1, offset: 495 },
  { name: 'Shanghai', country: 'China', lat: 31.2304, lon: 121.4737, meanRange: 2.8, meanLevel: 1.8, offset: 510 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, meanRange: 2.4, meanLevel: 1.5, offset: 465 },
  { name: 'Mumbai', country: 'India', lat: 18.9220, lon: 72.8347, meanRange: 3.6, meanLevel: 2.3, offset: 330 },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, meanRange: 1.4, meanLevel: 0.9, offset: 270 },
  
  // South America
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lon: -43.1729, meanRange: 1.2, meanLevel: 0.8, offset: -180 },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816, meanRange: 0.9, meanLevel: 0.6, offset: -195 },
  
  // Africa
  { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lon: 18.4241, meanRange: 1.5, meanLevel: 1.0, offset: 120 },
  { name: 'Casablanca', country: 'Morocco', lat: 33.5731, lon: -7.5898, meanRange: 3.2, meanLevel: 1.9, offset: -60 },
]

// Famous fallback location for landlocked users
const FALLBACK_STATION = TIDE_STATIONS.find(s => s.name === 'Mont Saint-Michel')!

// --- UTILITY FUNCTIONS ---

// Calculate distance between two points (Haversine formula)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Find nearest station to given coordinates
function findNearestStation(lat: number, lon: number): { station: TideStation; distance: number } {
  let nearest = TIDE_STATIONS[0]
  let minDistance = Infinity
  
  for (const station of TIDE_STATIONS) {
    const distance = getDistance(lat, lon, station.lat, station.lon)
    if (distance < minDistance) {
      minDistance = distance
      nearest = station
    }
  }
  
  return { station: nearest, distance: minDistance }
}

// Calculate tide data using simplified harmonics
function calculateTides(station: TideStation, date: Date): {
  events: TideEvent[]
  curve: TidePoint[]
} {
  const lunarPeriod = 12.42 // hours between high tides
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  
  // Reference high water point
  const referenceHigh = new Date('2024-01-01T00:24:00Z')
  const hoursSinceReference = (date.getTime() - referenceHigh.getTime()) / (1000 * 60 * 60)
  
  const halfRange = station.meanRange / 2
  const events: TideEvent[] = []
  
  // Generate events for the day (check wider window to catch edge cases)
  for (let i = -2; i < 5; i++) {
    const cycleStart = Math.floor(hoursSinceReference / lunarPeriod + i) * lunarPeriod
    
    // High tide
    const highTime = new Date(referenceHigh.getTime() + (cycleStart + station.offset / 60) * 60 * 60 * 1000)
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
    
    if (highTime >= dayStart && highTime < dayEnd) {
      events.push({
        type: 'high',
        time: highTime,
        height: station.meanLevel + halfRange,
      })
    }
    
    // Low tide (6.21 hours after high)
    const lowTime = new Date(highTime.getTime() + (lunarPeriod / 2) * 60 * 60 * 1000)
    if (lowTime >= dayStart && lowTime < dayEnd) {
      events.push({
        type: 'low',
        time: lowTime,
        height: station.meanLevel - halfRange,
      })
    }
  }
  
  // Sort and deduplicate
  events.sort((a, b) => a.time.getTime() - b.time.getTime())
  
  // Generate smooth curve (every 10 minutes for smoother line)
  const curve: TidePoint[] = []
  for (let m = 0; m < 24 * 60; m += 10) {
    const time = new Date(dayStart.getTime() + m * 60 * 1000)
    const hoursSinceRef = (time.getTime() - referenceHigh.getTime()) / (1000 * 60 * 60) + (station.offset / 60)
    const tidePhase = (hoursSinceRef / lunarPeriod) % 1
    const height = station.meanLevel + halfRange * Math.cos(tidePhase * 2 * Math.PI)
    curve.push({ time, height })
  }
  
  return { events, curve }
}

// Format time as HH:MM
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

// Get time until event
function getTimeUntil(from: Date, to: Date): string {
  const diffMs = to.getTime() - from.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

// --- SVG TIDE CURVE COMPONENT ---

interface TideCurveProps {
  curve: TidePoint[]
  events: TideEvent[]
  now: Date
  containerWidth: number
}

function TideCurve({ curve, events, now, containerWidth }: TideCurveProps) {
  // Responsive dimensions
  const aspectRatio = 3.2 // width:height
  const width = containerWidth
  const height = width / aspectRatio
  const padding = { 
    top: height * 0.12, 
    right: width * 0.02, 
    bottom: height * 0.2, 
    left: width * 0.08 
  }
  
  const innerWidth = width - padding.left - padding.right
  const innerHeight = height - padding.top - padding.bottom
  
  if (curve.length === 0) return null
  
  // Get day boundaries
  const dayStart = new Date(now)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
  
  // Scale functions
  const xScale = (time: Date) => {
    const progress = (time.getTime() - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime())
    return padding.left + progress * innerWidth
  }
  
  const minHeight = Math.min(...curve.map(p => p.height))
  const maxHeight = Math.max(...curve.map(p => p.height))
  const heightRange = maxHeight - minHeight || 1
  
  const yScale = (h: number) => {
    return padding.top + innerHeight - ((h - minHeight) / heightRange) * innerHeight
  }
  
  // Generate smooth path using curve interpolation
  const pathPoints = curve.map(p => ({ x: xScale(p.time), y: yScale(p.height) }))
  
  // Create smooth bezier curve
  let pathD = `M ${pathPoints[0].x} ${pathPoints[0].y}`
  for (let i = 1; i < pathPoints.length; i++) {
    const prev = pathPoints[i - 1]
    const curr = pathPoints[i]
    const cpX = (prev.x + curr.x) / 2
    pathD += ` Q ${prev.x + (cpX - prev.x) * 0.5} ${prev.y}, ${cpX} ${(prev.y + curr.y) / 2}`
    pathD += ` Q ${cpX + (curr.x - cpX) * 0.5} ${curr.y}, ${curr.x} ${curr.y}`
  }
  
  // Simpler path for better performance
  const simplePathD = curve.map((p, i) => {
    const x = xScale(p.time)
    const y = yScale(p.height)
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
  
  // Current position
  const nowX = xScale(now)
  const currentPoint = curve.reduce((closest, p) => 
    Math.abs(p.time.getTime() - now.getTime()) < Math.abs(closest.time.getTime() - now.getTime()) ? p : closest
  )
  const nowY = yScale(currentPoint.height)
  
  // Font sizes relative to container
  const labelSize = Math.max(9, width * 0.028)
  const axisSize = Math.max(8, width * 0.024)
  
  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      className="w-full h-auto block"
      style={{ maxHeight: '200px' }}
    >
      {/* Background gradient for water effect */}
      <defs>
        <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      
      {/* Filled area under curve */}
      <path
        d={`${simplePathD} L ${xScale(curve[curve.length - 1].time).toFixed(1)} ${(height - padding.bottom).toFixed(1)} L ${padding.left.toFixed(1)} ${(height - padding.bottom).toFixed(1)} Z`}
        fill="url(#waterGradient)"
      />
      
      {/* Vertical grid lines (every 6 hours) */}
      {[0, 6, 12, 18].map(h => {
        const time = new Date(dayStart.getTime() + h * 60 * 60 * 1000)
        const x = xScale(time)
        return (
          <line
            key={h}
            x1={x}
            y1={padding.top}
            x2={x}
            y2={height - padding.bottom}
            stroke="#e5e5e5"
            strokeWidth="1"
          />
        )
      })}
      
      {/* Mean level line */}
      <line
        x1={padding.left}
        y1={yScale((minHeight + maxHeight) / 2)}
        x2={width - padding.right}
        y2={yScale((minHeight + maxHeight) / 2)}
        stroke="#d4d4d4"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      
      {/* Tide curve */}
      <path
        d={simplePathD}
        fill="none"
        stroke="#0ea5e9"
        strokeWidth={Math.max(2, width * 0.006)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* High/low markers */}
      {events.map((e, i) => {
        const x = xScale(e.time)
        const y = yScale(e.height)
        const isPast = e.time < now
        const radius = Math.max(4, width * 0.012)
        
        return (
          <g key={i} opacity={isPast ? 0.4 : 1}>
            <circle
              cx={x}
              cy={y}
              r={radius}
              fill={e.type === 'high' ? '#0ea5e9' : '#64748b'}
            />
            <text
              x={x}
              y={y - radius - 4}
              textAnchor="middle"
              fontSize={labelSize}
              fontFamily="var(--font-mono, monospace)"
              fill={isPast ? '#a1a1aa' : '#000'}
              fontWeight="500"
            >
              {formatTime(e.time)}
            </text>
          </g>
        )
      })}
      
      {/* Current time line */}
      <line
        x1={nowX}
        y1={padding.top}
        x2={nowX}
        y2={height - padding.bottom}
        stroke="#ef4444"
        strokeWidth={Math.max(1.5, width * 0.004)}
      />
      
      {/* Current position dot */}
      <circle
        cx={nowX}
        cy={nowY}
        r={Math.max(5, width * 0.015)}
        fill="#ef4444"
      />
      
      {/* X axis labels */}
      {[0, 6, 12, 18, 24].map(h => {
        const time = new Date(dayStart.getTime() + h * 60 * 60 * 1000)
        return (
          <text
            key={h}
            x={xScale(time)}
            y={height - padding.bottom + axisSize + 6}
            textAnchor="middle"
            fontSize={axisSize}
            fontFamily="var(--font-mono, monospace)"
            fill="#a1a1aa"
          >
            {h === 24 ? '00' : String(h).padStart(2, '0')}
          </text>
        )
      })}
      
      {/* Y axis labels */}
      <text 
        x={padding.left - 6} 
        y={padding.top + axisSize / 2} 
        textAnchor="end"
        fontSize={axisSize} 
        fontFamily="var(--font-mono, monospace)"
        fill="#a1a1aa"
      >
        {maxHeight.toFixed(1)}m
      </text>
      <text 
        x={padding.left - 6} 
        y={height - padding.bottom} 
        textAnchor="end"
        fontSize={axisSize} 
        fontFamily="var(--font-mono, monospace)"
        fill="#a1a1aa"
      >
        {minHeight.toFixed(1)}m
      </text>
    </svg>
  )
}

// --- MAIN WIDGET COMPONENT ---

export default function UKTides() {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  
  // State
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [containerWidth, setContainerWidth] = useState(400)
  const [now, setNow] = useState(new Date())
  const [station, setStation] = useState<TideStation>(TIDE_STATIONS[7]) // St Leonards default
  const [distance, setDistance] = useState<number | null>(null)
  const [locationStatus, setLocationStatus] = useState<'loading' | 'found' | 'fallback' | 'manual'>('loading')
  const [eventsExpanded, setEventsExpanded] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  
  // Responsive scaling
  useEffect(() => {
    if (!containerRef.current) return
    
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25)
      setContainerWidth(width)
    })
    
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
  
  // Geolocation on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('fallback')
      setStation(FALLBACK_STATION)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const { station: nearest, distance: dist } = findNearestStation(latitude, longitude)
        
        if (dist > 500) {
          // Too far from coast, use famous fallback
          setStation(FALLBACK_STATION)
          setDistance(null)
          setLocationStatus('fallback')
        } else {
          setStation(nearest)
          setDistance(dist)
          setLocationStatus('found')
        }
      },
      () => {
        // Geolocation denied/failed - keep default (St Leonards)
        setLocationStatus('manual')
      },
      { timeout: 5000, maximumAge: 300000 }
    )
  }, [])
  
  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])
  
  // Calculate tide data
  const tideData = useMemo(() => calculateTides(station, now), [station, now])
  
  // Find next event
  const nextEvent = useMemo(() => {
    return tideData.events.find(e => e.time > now) || tideData.events[0]
  }, [tideData.events, now])
  
  // Current tide state
  const currentState = useMemo(() => {
    const currentPoint = tideData.curve.reduce((closest, p) => 
      Math.abs(p.time.getTime() - now.getTime()) < Math.abs(closest.time.getTime() - now.getTime()) ? p : closest
    )
    
    // Check trend by comparing to 30 min ago
    const targetTime = new Date(now.getTime() - 30 * 60 * 1000)
    const prevPoint = tideData.curve.reduce((closest, p) => 
      Math.abs(p.time.getTime() - targetTime.getTime()) < Math.abs(closest.time.getTime() - targetTime.getTime()) ? p : closest
    )
    
    return {
      height: currentPoint.height,
      isRising: currentPoint.height > prevPoint.height,
    }
  }, [tideData.curve, now])
  
  // Group stations by region for picker
  const stationsByRegion = useMemo(() => {
    const regions: Record<string, TideStation[]> = {}
    for (const s of TIDE_STATIONS) {
      if (!regions[s.country]) regions[s.country] = []
      regions[s.country].push(s)
    }
    return regions
  }, [])

  return (
    <div 
      ref={containerRef}
      className="w-full bg-white rounded-[0.75em] p-[1em]"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Location header */}
      <div className="flex items-center justify-between mb-[0.75em]">
        <div className="flex-1 min-w-0">
          <button
            onClick={() => setShowLocationPicker(!showLocationPicker)}
            className="flex items-center gap-[0.375em] text-left hover:opacity-70 transition-opacity"
          >
            <span className="text-[1.125em] font-medium text-black truncate">
              {station.name}
            </span>
            <svg 
              className={`w-[0.875em] h-[0.875em] text-black/40 transition-transform ${showLocationPicker ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="text-[0.6875em] text-black/40">
            {station.country}
            {locationStatus === 'found' && distance !== null && ` · ${Math.round(distance)}km away`}
            {locationStatus === 'fallback' && ' · Famous tides'}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-[0.75em] text-black/40 uppercase tracking-wider">
            {now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>
      
      {/* Location picker dropdown */}
      {showLocationPicker && (
        <div className="mb-[0.75em] p-[0.5em] bg-neutral-50 rounded-[0.5em] max-h-[12em] overflow-y-auto">
          {Object.entries(stationsByRegion).map(([country, stations]) => (
            <div key={country} className="mb-[0.5em]">
              <div className="text-[0.625em] text-black/40 uppercase tracking-wider font-medium mb-[0.25em] px-[0.5em]">
                {country}
              </div>
              <div className="flex flex-wrap gap-[0.25em]">
                {stations.map(s => (
                  <button
                    key={s.name}
                    onClick={() => {
                      setStation(s)
                      setLocationStatus('manual')
                      setShowLocationPicker(false)
                    }}
                    className={`
                      px-[0.5em] py-[0.25em] text-[0.75em] rounded-[0.25em] transition-colors
                      ${s.name === station.name 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black hover:bg-black/5'
                      }
                    `}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Current state row */}
      <div className="flex items-center justify-between mb-[0.75em] py-[0.625em] px-[0.75em] bg-neutral-50 rounded-[0.5em]">
        {/* Rising/Falling indicator */}
        <div className="flex items-center gap-[0.375em]">
          <span className={`text-[1.5em] font-bold leading-none ${currentState.isRising ? 'text-sky-500' : 'text-neutral-400'}`}>
            {currentState.isRising ? '↑' : '↓'}
          </span>
          <span className="text-[0.8125em] text-black/60">
            {currentState.isRising ? 'Rising' : 'Falling'}
          </span>
        </div>
        
        {/* Current height - the key number */}
        <div className="text-center">
          <span className="font-mono text-[1.75em] font-bold text-black leading-none">
            {currentState.height.toFixed(1)}
          </span>
          <span className="text-[0.75em] text-black/40 ml-[0.125em]">m</span>
        </div>
        
        {/* Next event */}
        <div className="text-right">
          <div className="text-[0.6875em] text-black/40">
            {nextEvent?.type === 'high' ? 'High' : 'Low'} in
          </div>
          <div className="font-mono text-[0.9375em] font-medium text-black">
            {nextEvent ? getTimeUntil(now, nextEvent.time) : '--'}
          </div>
        </div>
      </div>
      
      {/* Tide curve - THE HERO */}
      <div className="mb-[0.75em]">
        <TideCurve
          curve={tideData.curve}
          events={tideData.events}
          now={now}
          containerWidth={containerWidth - baseFontSize * 2} // Account for padding
        />
      </div>
      
      {/* Collapsible events list */}
      <div className="border-t border-black/10 pt-[0.625em]">
        <button
          onClick={() => setEventsExpanded(!eventsExpanded)}
          className="w-full flex items-center justify-between py-[0.375em] hover:opacity-70 transition-opacity"
        >
          <span className="text-[0.75em] text-black/50 uppercase tracking-wider font-medium">
            Today's Tides
          </span>
          <svg 
            className={`w-[0.875em] h-[0.875em] text-black/30 transition-transform ${eventsExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {eventsExpanded && (
          <div className="flex flex-wrap justify-center gap-[0.75em] pt-[0.5em]">
            {tideData.events.map((event, i) => {
              const isPast = event.time < now
              const isNext = event === nextEvent
              
              return (
                <div 
                  key={i} 
                  className={`
                    flex flex-col items-center p-[0.5em] rounded-[0.375em]
                    ${isNext ? 'bg-sky-50' : ''}
                    ${isPast ? 'opacity-40' : ''}
                  `}
                >
                  <span className={`text-[0.875em] ${event.type === 'high' ? 'text-sky-500' : 'text-neutral-400'}`}>
                    {event.type === 'high' ? '▲' : '▼'}
                  </span>
                  <span className="font-mono text-[0.9375em] font-medium text-black">
                    {formatTime(event.time)}
                  </span>
                  <span className="font-mono text-[0.6875em] text-black/50">
                    {event.height.toFixed(1)}m
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
      
      {/* Tidal range context */}
      <div className="text-center text-[0.6875em] text-black/40 mt-[0.5em]">
        Mean range: {station.meanRange.toFixed(1)}m · Approximate
      </div>
    </div>
  )
}