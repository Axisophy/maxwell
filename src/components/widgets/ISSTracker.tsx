'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// ISS TRACKER WIDGET - CONSOLIDATED
// ===========================================
// Real-time International Space Station tracking
// with ground track, crew info, and orbital data
//
// Data: wheretheiss.at API + Open Notify
// Design: Mission control / space theme (dark)
// ===========================================

interface ISSPosition {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: number
}

interface CrewMember {
  name: string
  craft: string
  agency?: string
  role?: string
}

interface ISSData {
  position: ISSPosition
  crew: CrewMember[]
  groundTrack: Array<{ lat: number; lon: number }>
  sunlit: boolean
  region: string
}

// ===========================================
// CONSTANTS & HELPERS
// ===========================================

const ISS_LAUNCH_DATE = new Date('1998-11-20T06:40:00Z')
const ORBIT_PERIOD_MINUTES = 92.68

// Agency colors/abbreviations
const AGENCY_INFO: Record<string, { abbrev: string; color: string }> = {
  'NASA': { abbrev: 'NASA', color: '#0B3D91' },
  'Roscosmos': { abbrev: 'RSA', color: '#E4181C' },
  'JAXA': { abbrev: 'JAXA', color: '#1E4D8C' },
  'ESA': { abbrev: 'ESA', color: '#003399' },
  'CSA': { abbrev: 'CSA', color: '#FF0000' },
  'CNSA': { abbrev: 'CNSA', color: '#DE2910' },
  'SpaceX': { abbrev: 'SpX', color: '#005288' },
}

// Fallback crew data (Expedition 72, approximate)
const FALLBACK_CREW: CrewMember[] = [
  { name: 'Oleg Kononenko', craft: 'ISS', agency: 'Roscosmos', role: 'Commander' },
  { name: 'Nikolai Chub', craft: 'ISS', agency: 'Roscosmos', role: 'Flight Engineer' },
  { name: 'Tracy Dyson', craft: 'ISS', agency: 'NASA', role: 'Flight Engineer' },
  { name: 'Matthew Dominick', craft: 'ISS', agency: 'NASA', role: 'Flight Engineer' },
  { name: 'Michael Barratt', craft: 'ISS', agency: 'NASA', role: 'Flight Engineer' },
  { name: 'Jeanette Epps', craft: 'ISS', agency: 'NASA', role: 'Flight Engineer' },
  { name: 'Alexander Grebenkin', craft: 'ISS', agency: 'Roscosmos', role: 'Flight Engineer' },
]

// Get location name from coordinates
function getLocationName(lat: number, lon: number): string {
  // Polar regions
  if (lat > 66) return lon > -30 && lon < 60 ? 'Arctic (Europe)' : 'Arctic'
  if (lat < -66) return 'Antarctica'

  // Africa
  if (lon >= -20 && lon <= 55 && lat >= -35 && lat <= 37) return 'Africa'

  // Europe
  if (lon >= -10 && lon <= 40 && lat >= 35 && lat <= 71) return 'Europe'

  // Asia
  if (lon >= 40 && lon <= 180 && lat >= 10 && lat <= 75) return 'Asia'
  if (lon >= 60 && lon <= 150 && lat >= -10 && lat < 10) return 'Southeast Asia'

  // Australia
  if (lon >= 110 && lon <= 155 && lat >= -45 && lat <= -10) return 'Australia'

  // North America
  if (lon >= -170 && lon <= -50 && lat >= 25 && lat <= 75) return 'North America'

  // Central America
  if (lon >= -120 && lon <= -60 && lat >= 7 && lat < 25) return 'Central America'

  // South America
  if (lon >= -82 && lon <= -34 && lat >= -56 && lat < 12) return 'South America'

  // Oceans
  if (lon >= -80 && lon <= 0 && lat >= -60 && lat <= 60) return 'Atlantic Ocean'
  if ((lon >= 100 || lon <= -100) && lat >= -60 && lat <= 60) return 'Pacific Ocean'
  if (lon >= 20 && lon <= 120 && lat >= -60 && lat <= 30) return 'Indian Ocean'

  return 'International Waters'
}

// Calculate if ISS is in sunlight (simplified)
function calculateSunlit(lat: number, lon: number): boolean {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
  const hourAngle = (now.getUTCHours() + now.getUTCMinutes() / 60) * 15 - 180

  // Solar declination (approximate)
  const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * Math.PI / 180)

  // Sub-solar longitude
  const solarLon = -hourAngle

  // Distance from sub-solar point (simplified)
  const distance = Math.sqrt(
    Math.pow(lat - declination, 2) +
    Math.pow(((lon - solarLon + 180) % 360) - 180, 2)
  )

  return distance < 90
}

// Calculate orbit number since launch
function getOrbitNumber(): number {
  const minutesSinceLaunch = (Date.now() - ISS_LAUNCH_DATE.getTime()) / 60000
  return Math.floor(minutesSinceLaunch / ORBIT_PERIOD_MINUTES)
}

// Calculate progress through current orbit (0-1)
function getOrbitProgress(): number {
  const minutesSinceLaunch = (Date.now() - ISS_LAUNCH_DATE.getTime()) / 60000
  return (minutesSinceLaunch % ORBIT_PERIOD_MINUTES) / ORBIT_PERIOD_MINUTES
}

// Generate ground track (past and future positions)
function generateGroundTrack(currentLat: number, currentLon: number): Array<{ lat: number; lon: number }> {
  const track: Array<{ lat: number; lon: number }> = []
  const orbitalInclination = 51.6 // degrees
  const earthRotationPerOrbit = 360 * (ORBIT_PERIOD_MINUTES / (24 * 60)) // Earth rotates while ISS orbits

  // Generate ~90 minutes of track (one orbit)
  for (let i = -45; i <= 45; i += 2) {
    const minutesOffset = i
    const orbitFraction = minutesOffset / ORBIT_PERIOD_MINUTES

    // Simplified sinusoidal ground track
    const lat = orbitalInclination * Math.sin(orbitFraction * 2 * Math.PI)
    const lon = currentLon + (minutesOffset * (360 / ORBIT_PERIOD_MINUTES)) - (earthRotationPerOrbit * orbitFraction)

    // Normalize longitude
    let normalizedLon = lon
    while (normalizedLon > 180) normalizedLon -= 360
    while (normalizedLon < -180) normalizedLon += 360

    track.push({ lat, lon: normalizedLon })
  }

  return track
}

// Format coordinate
function formatCoord(value: number, isLat: boolean): string {
  const abs = Math.abs(value)
  const dir = isLat ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W')
  return `${abs.toFixed(2)}° ${dir}`
}

// ===========================================
// MAP CANVAS COMPONENT
// ===========================================

interface MapCanvasProps {
  position: ISSPosition
  groundTrack: Array<{ lat: number; lon: number }>
  sunlit: boolean
  orbitProgress: number
}

function MapCanvas({ position, groundTrack, sunlit, orbitProgress }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tick, setTick] = useState(0)

  // Animation tick for pulse effect
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 100)
    return () => clearInterval(interval)
  }, [])

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

    const w = rect.width
    const h = rect.height

    // Dark background
    ctx.fillStyle = '#0f1419'
    ctx.fillRect(0, 0, w, h)

    // Day/night terminator (simplified gradient)
    const now = new Date()
    const hourAngle = (now.getUTCHours() + now.getUTCMinutes() / 60) * 15 - 180
    const solarLonX = w * ((-hourAngle + 180) % 360) / 360

    // Night side gradient
    const nightGradient = ctx.createLinearGradient(solarLonX - w/4, 0, solarLonX + w/4, 0)
    nightGradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
    nightGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)')
    nightGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = nightGradient
    ctx.fillRect(0, 0, w, h)

    // Grid lines
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)'
    ctx.lineWidth = 0.5

    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = h * (1 - (lat + 90) / 180)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    // Longitude lines
    for (let lon = -120; lon <= 120; lon += 60) {
      const x = w * (lon + 180) / 360
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }

    // Equator (slightly brighter)
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)'
    const equatorY = h / 2
    ctx.beginPath()
    ctx.moveTo(0, equatorY)
    ctx.lineTo(w, equatorY)
    ctx.stroke()

    // Draw ground track
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'
    ctx.lineWidth = 2
    ctx.beginPath()

    let prevX = 0
    groundTrack.forEach((pos, i) => {
      const x = w * (pos.lon + 180) / 360
      const y = h * (1 - (pos.lat + 90) / 180)

      // Handle wrap-around
      if (i === 0) {
        ctx.moveTo(x, y)
      } else if (Math.abs(x - prevX) > w / 2) {
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      prevX = x
    })
    ctx.stroke()

    // Draw visibility footprint (approximate 2200km radius)
    const issX = w * (position.longitude + 180) / 360
    const issY = h * (1 - (position.latitude + 90) / 180)
    const footprintRadius = w * (20 / 360) // ~20 degrees

    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
    ctx.beginPath()
    ctx.arc(issX, issY, footprintRadius, 0, 2 * Math.PI)
    ctx.fill()

    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw ISS position with pulse effect
    const pulsePhase = (tick % 20) / 20
    const pulseSize = 8 + pulsePhase * 15
    const pulseOpacity = 0.6 - pulsePhase * 0.6

    // Pulse ring
    ctx.strokeStyle = sunlit
      ? `rgba(251, 191, 36, ${pulseOpacity})`
      : `rgba(59, 130, 246, ${pulseOpacity})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(issX, issY, pulseSize, 0, 2 * Math.PI)
    ctx.stroke()

    // ISS dot glow
    const gradient = ctx.createRadialGradient(issX, issY, 0, issX, issY, 12)
    gradient.addColorStop(0, sunlit ? 'rgba(251, 191, 36, 0.9)' : 'rgba(59, 130, 246, 0.9)')
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.fillRect(issX - 12, issY - 12, 24, 24)

    // ISS core dot
    ctx.fillStyle = sunlit ? '#fbbf24' : '#3b82f6'
    ctx.beginPath()
    ctx.arc(issX, issY, 5, 0, 2 * Math.PI)
    ctx.fill()

  }, [position, groundTrack, sunlit, tick])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  )
}

// ===========================================
// AGENCY BADGE COMPONENT
// ===========================================

function AgencyBadge({ agency }: { agency?: string }) {
  if (!agency) return null
  const info = AGENCY_INFO[agency] || { abbrev: agency.slice(0, 3).toUpperCase(), color: '#666' }

  return (
    <span
      className="text-[0.625em] font-medium px-[0.5em] py-[0.125em] rounded-[0.25em]"
      style={{ backgroundColor: info.color, color: 'white' }}
    >
      {info.abbrev}
    </span>
  )
}

// ===========================================
// MAIN WIDGET COMPONENT
// ===========================================

export default function ISSTracker() {
  const [data, setData] = useState<ISSData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [crewExpanded, setCrewExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)

  // Scale widget based on container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setBaseFontSize(Math.max(12, Math.min(20, width / 25)))
      }
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Fetch ISS data
  const fetchData = useCallback(async () => {
    try {
      // Try the proxy route first (avoids CORS)
      let posData: any
      try {
        const response = await fetch('/api/iss')
        if (response.ok) {
          posData = await response.json()
        } else {
          throw new Error('Proxy failed')
        }
      } catch {
        // Fall back to direct API call
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544')
        if (!response.ok) throw new Error('Position API failed')
        posData = await response.json()
      }

      const position: ISSPosition = {
        latitude: posData.latitude,
        longitude: posData.longitude,
        altitude: posData.altitude,
        velocity: posData.velocity,
        timestamp: posData.timestamp * 1000
      }

      // Fetch crew info
      let crew: CrewMember[] = FALLBACK_CREW
      try {
        const crewResponse = await fetch('/api/iss?crew=true')
        if (crewResponse.ok) {
          const crewData = await crewResponse.json()
          if (crewData.people && crewData.people.length > 0) {
            crew = crewData.people
          }
        }
      } catch {
        // Use fallback
      }

      const sunlit = calculateSunlit(position.latitude, position.longitude)
      const region = getLocationName(position.latitude, position.longitude)
      const groundTrack = generateGroundTrack(position.latitude, position.longitude)

      setData({ position, crew, groundTrack, sunlit, region })
      setLoading(false)
      setError(null)
    } catch (err) {
      console.error('ISS data fetch error:', err)
      setError('Unable to fetch ISS data')
      setLoading(false)
    }
  }, [])

  // Initial fetch and polling
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000) // 10 second updates
    return () => clearInterval(interval)
  }, [fetchData])

  const orbitNumber = getOrbitNumber()
  const orbitProgress = getOrbitProgress()

  // Filter crew by craft
  const issCrew = data?.crew.filter(c => c.craft === 'ISS') || []
  const otherCrew = data?.crew.filter(c => c.craft !== 'ISS') || []

  return (
    <div
      ref={containerRef}
      className="bg-[#1a1a1e] p-[1em] h-full"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-[0.75em]">
        <div>
          <p className="text-[0.6875em] text-white/40 uppercase tracking-wider font-medium mb-[0.25em]">
            Currently over
          </p>
          <h3 className="text-[1.25em] text-white font-medium leading-tight">
            {data?.region || 'Loading...'}
          </h3>
        </div>
        <div className="flex items-center gap-[0.5em]">
          {data && (
            <span className={`text-[0.75em] font-medium ${data.sunlit ? 'text-amber-400' : 'text-blue-400'}`}>
              {data.sunlit ? '☀ Sunlit' : '🌙 Shadow'}
            </span>
          )}
          <span className="relative flex h-[0.5em] w-[0.5em]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-[0.5em] w-[0.5em] bg-green-500"></span>
          </span>
        </div>
      </div>

      {/* Map container */}
      <div className="relative rounded-[0.5em] overflow-hidden mb-[0.75em]" style={{ height: '10em' }}>
        {/* Orbit progress bar */}
        <div className="absolute top-0 left-0 right-0 z-10 px-[0.5em] pt-[0.5em]">
          <div className="flex items-center justify-between text-[0.625em] text-white/60 mb-[0.25em]">
            <span>Orbit #{orbitNumber.toLocaleString()}</span>
            <span>{Math.round(orbitProgress * 100)}%</span>
          </div>
          <div className="h-[0.25em] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${orbitProgress * 100}%` }}
            />
          </div>
        </div>

        {data ? (
          <MapCanvas
            position={data.position}
            groundTrack={data.groundTrack}
            sunlit={data.sunlit}
            orbitProgress={orbitProgress}
          />
        ) : (
          <div className="w-full h-full bg-[#0f1419] flex items-center justify-center">
            <span className="text-white/40 text-[0.875em]">
              {error || 'Loading map...'}
            </span>
          </div>
        )}

        {/* Coordinates overlay */}
        {data && (
          <div className="absolute bottom-[0.5em] right-[0.5em] text-[0.625em] font-mono text-white/50 bg-black/50 px-[0.5em] py-[0.25em] rounded-[0.25em]">
            {formatCoord(data.position.latitude, true)} · {formatCoord(data.position.longitude, false)}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-[0.5em] mb-[0.75em]">
        <div className="bg-white/5 rounded-[0.375em] p-[0.625em] text-center">
          <p className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.25em]">Altitude</p>
          <p className="text-[1.125em] text-white font-medium font-mono">
            {data ? `${Math.round(data.position.altitude)}` : '—'}
            <span className="text-[0.6em] text-white/50 ml-[0.25em]">km</span>
          </p>
        </div>
        <div className="bg-white/5 rounded-[0.375em] p-[0.625em] text-center">
          <p className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.25em]">Velocity</p>
          <p className="text-[1.125em] text-white font-medium font-mono">
            {data ? `${(data.position.velocity / 1000).toFixed(1)}` : '—'}
            <span className="text-[0.6em] text-white/50 ml-[0.25em]">km/s</span>
          </p>
        </div>
        <div className="bg-white/5 rounded-[0.375em] p-[0.625em] text-center">
          <p className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.25em]">Speed</p>
          <p className="text-[1.125em] text-white font-medium font-mono">
            {data ? `${Math.round(data.position.velocity / 343)}×` : '—'}
            <span className="text-[0.6em] text-white/50 ml-[0.25em]">sound</span>
          </p>
        </div>
      </div>

      {/* Crew section */}
      <div className="bg-white/5 rounded-[0.375em] overflow-hidden">
        <button
          onClick={() => setCrewExpanded(!crewExpanded)}
          className="w-full flex items-center justify-between p-[0.625em] hover:bg-white/5 transition-colors"
        >
          <span className="text-[0.875em] text-white">
            👨‍🚀 {issCrew.length} aboard ISS
            {otherCrew.length > 0 && (
              <span className="text-white/40 ml-[0.5em]">
                (+{otherCrew.length} other spacecraft)
              </span>
            )}
          </span>
          <span className={`text-white/40 transition-transform ${crewExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {crewExpanded && (
          <div className="border-t border-white/10 p-[0.625em]">
            {/* ISS Crew */}
            <div className="space-y-[0.375em]">
              {issCrew.map((member, i) => (
                <div key={i} className="flex items-center justify-between text-[0.75em]">
                  <div className="flex items-center gap-[0.5em]">
                    <AgencyBadge agency={member.agency} />
                    <span className="text-white">{member.name}</span>
                  </div>
                  {member.role && (
                    <span className="text-white/40">{member.role}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Other spacecraft */}
            {otherCrew.length > 0 && (
              <>
                <div className="border-t border-white/10 my-[0.5em]" />
                <p className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.375em]">
                  Other Spacecraft
                </p>
                <div className="space-y-[0.375em]">
                  {otherCrew.map((member, i) => (
                    <div key={i} className="flex items-center justify-between text-[0.75em]">
                      <div className="flex items-center gap-[0.5em]">
                        <AgencyBadge agency={member.agency} />
                        <span className="text-white">{member.name}</span>
                      </div>
                      <span className="text-white/40">{member.craft}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Attribution */}
      <p className="text-[0.5625em] text-white/30 text-center mt-[0.75em]">
        Data: wheretheiss.at · Open Notify
      </p>
    </div>
  )
}
