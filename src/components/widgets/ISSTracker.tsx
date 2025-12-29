'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// ISS TRACKER
// ===========================================
// Real-time International Space Station tracking
// with ground track, crew info, and orbital data
//
// Data: wheretheiss.at API + Open Notify
//
// Design notes:
// - NO title/live dot/source (WidgetFrame handles those)
// - NO emojis (use styled elements)
// - Self-contained inline SVG map
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
const MAP_WIDTH = 800
const MAP_HEIGHT = 400

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

// Fallback crew data
const FALLBACK_CREW: CrewMember[] = [
  { name: 'Oleg Kononenko', craft: 'ISS', agency: 'Roscosmos', role: 'Commander' },
  { name: 'Nikolai Chub', craft: 'ISS', agency: 'Roscosmos', role: 'Flight Engineer' },
  { name: 'Tracy Dyson', craft: 'ISS', agency: 'NASA', role: 'Flight Engineer' },
  { name: 'Matthew Dominick', craft: 'ISS', agency: 'NASA', role: 'Flight Engineer' },
  { name: 'Michael Barratt', craft: 'ISS', agency: 'NASA', role: 'Flight Engineer' },
  { name: 'Jeanette Epps', craft: 'ISS', agency: 'NASA', role: 'Flight Engineer' },
  { name: 'Alexander Grebenkin', craft: 'ISS', agency: 'Roscosmos', role: 'Flight Engineer' },
]

// Convert lat/lon to SVG coordinates
function latLonToXY(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon + 180) / 360) * MAP_WIDTH
  const y = ((90 - lat) / 180) * MAP_HEIGHT
  return { x, y }
}

// Get location name from coordinates
function getLocationName(lat: number, lon: number): string {
  if (lat > 66) return 'Arctic'
  if (lat < -66) return 'Antarctica'
  if (lon >= -20 && lon <= 55 && lat >= -35 && lat <= 37) return 'Africa'
  if (lon >= -10 && lon <= 40 && lat >= 35 && lat <= 71) return 'Europe'
  if (lon >= 40 && lon <= 180 && lat >= 10 && lat <= 75) return 'Asia'
  if (lon >= 110 && lon <= 155 && lat >= -45 && lat <= -10) return 'Australia'
  if (lon >= -170 && lon <= -50 && lat >= 25 && lat <= 75) return 'North America'
  if (lon >= -120 && lon <= -60 && lat >= 7 && lat < 25) return 'Central America'
  if (lon >= -82 && lon <= -34 && lat >= -56 && lat < 12) return 'South America'
  if (lon >= -80 && lon <= 0 && lat >= -60 && lat <= 60) return 'Atlantic Ocean'
  if ((lon >= 100 || lon <= -100) && lat >= -60 && lat <= 60) return 'Pacific Ocean'
  if (lon >= 20 && lon <= 120 && lat >= -60 && lat <= 30) return 'Indian Ocean'
  return 'International Waters'
}

// Calculate if ISS is in sunlight
function calculateSunlit(lat: number, lon: number): boolean {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
  const hourAngle = (now.getUTCHours() + now.getUTCMinutes() / 60) * 15 - 180
  const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * Math.PI / 180)
  const solarLon = -hourAngle
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

// Generate ground track
function generateGroundTrack(currentLat: number, currentLon: number): Array<{ lat: number; lon: number }> {
  const track: Array<{ lat: number; lon: number }> = []
  const orbitalInclination = 51.6
  const earthRotationPerOrbit = 360 * (ORBIT_PERIOD_MINUTES / (24 * 60))

  for (let i = -45; i <= 45; i += 2) {
    const minutesOffset = i
    const orbitFraction = minutesOffset / ORBIT_PERIOD_MINUTES
    const lat = orbitalInclination * Math.sin(orbitFraction * 2 * Math.PI)
    let lon = currentLon + (minutesOffset * (360 / ORBIT_PERIOD_MINUTES)) - (earthRotationPerOrbit * orbitFraction)
    while (lon > 180) lon -= 360
    while (lon < -180) lon += 360
    track.push({ lat, lon })
  }
  return track
}

// Format coordinate
function formatCoord(value: number, isLat: boolean): string {
  const abs = Math.abs(value)
  const dir = isLat ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W')
  return `${abs.toFixed(2)}°${dir}`
}

// ===========================================
// INLINE SVG MAP COMPONENT
// ===========================================

interface ISSMapProps {
  position: ISSPosition
  groundTrack: Array<{ lat: number; lon: number }>
  sunlit: boolean
}

function ISSMap({ position, groundTrack, sunlit }: ISSMapProps) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 100)
    return () => clearInterval(interval)
  }, [])

  const pulsePhase = (tick % 20) / 20
  const pulseOpacity = 0.6 - pulsePhase * 0.6
  const pulseSize = 6 + pulsePhase * 12

  if (!isFinite(position.latitude) || !isFinite(position.longitude)) {
    return (
      <div className="w-full h-full bg-[#0f1419] flex items-center justify-center rounded-[0.5em]">
        <span className="text-white/40 text-[0.875em]">Loading map...</span>
      </div>
    )
  }

  const issPos = latLonToXY(position.latitude, position.longitude)

  // Build ground track path segments
  const trackSegments: string[] = []
  let currentSegment: string[] = []
  let prevX = 0

  groundTrack.forEach((pt, i) => {
    if (!isFinite(pt.lat) || !isFinite(pt.lon)) return
    const { x, y } = latLonToXY(pt.lat, pt.lon)

    if (i === 0) {
      currentSegment.push(`M ${x} ${y}`)
      prevX = x
    } else if (Math.abs(x - prevX) > 400) {
      if (currentSegment.length > 0) trackSegments.push(currentSegment.join(' '))
      currentSegment = [`M ${x} ${y}`]
      prevX = x
    } else {
      currentSegment.push(`L ${x} ${y}`)
      prevX = x
    }
  })
  if (currentSegment.length > 0) trackSegments.push(currentSegment.join(' '))

  return (
    <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="w-full h-full rounded-[0.5em]" style={{ backgroundColor: '#0a0a12' }}>
      {/* Simplified continent outlines */}
      <g fill="none" stroke="#1e3a5f" strokeWidth="1">
        {/* North America */}
        <path d="M45,95 L55,80 L85,75 L120,80 L155,95 L175,115 L190,140 L195,170 L180,190 L145,195 L110,185 L85,175 L60,160 L45,130 Z" />
        {/* Central America */}
        <path d="M110,185 L115,195 L125,210 L130,225 L120,230 L115,220 L108,210 L105,195 Z" />
        {/* South America */}
        <path d="M130,225 L145,230 L165,255 L175,290 L180,330 L170,375 L155,400 L130,410 L115,390 L105,350 L110,310 L115,280 L120,255 L125,235 Z" />
        {/* Europe */}
        <path d="M355,85 L375,75 L400,80 L420,85 L435,95 L445,110 L440,130 L420,140 L395,145 L375,140 L360,130 L355,115 Z" />
        {/* Africa */}
        <path d="M355,155 L380,150 L415,155 L445,170 L470,200 L480,240 L475,290 L455,335 L420,365 L380,375 L350,360 L335,320 L340,275 L345,235 L350,195 Z" />
        {/* Asia */}
        <path d="M445,75 L490,65 L540,60 L600,70 L660,85 L710,100 L740,130 L750,160 L740,190 L710,210 L665,205 L620,195 L570,190 L530,185 L495,175 L465,160 L450,135 L445,110 Z" />
        {/* India */}
        <path d="M530,185 L545,195 L560,220 L555,255 L540,280 L520,270 L510,245 L515,215 L525,195 Z" />
        {/* Australia */}
        <path d="M620,320 L670,310 L720,320 L750,345 L755,380 L735,410 L695,425 L650,420 L615,400 L605,365 L610,340 Z" />
        {/* Japan */}
        <path d="M710,130 L725,125 L735,135 L730,150 L720,155 L712,145 Z" />
        {/* UK */}
        <path d="M350,90 L358,85 L365,90 L362,100 L355,105 L348,98 Z" />
        {/* Greenland */}
        <path d="M260,30 L290,25 L320,35 L335,55 L325,80 L295,90 L265,85 L250,65 L255,45 Z" />
      </g>

      {/* Grid lines */}
      <g stroke="#111122" strokeWidth="0.5" opacity="0.3">
        <line x1="0" y1={MAP_HEIGHT * 0.5} x2={MAP_WIDTH} y2={MAP_HEIGHT * 0.5} />
        <line x1={MAP_WIDTH * 0.5} y1="0" x2={MAP_WIDTH * 0.5} y2={MAP_HEIGHT} />
      </g>

      {/* Ground track */}
      {trackSegments.map((segment, i) => (
        <path
          key={i}
          d={segment}
          fill="none"
          stroke="rgba(59, 130, 246, 0.5)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}

      {/* Visibility footprint */}
      <circle
        cx={issPos.x}
        cy={issPos.y}
        r={35}
        fill="rgba(59, 130, 246, 0.08)"
        stroke="rgba(59, 130, 246, 0.2)"
        strokeWidth="1"
      />

      {/* Pulse ring */}
      <circle
        cx={issPos.x}
        cy={issPos.y}
        r={pulseSize}
        fill="none"
        stroke={sunlit ? `rgba(251, 191, 36, ${pulseOpacity})` : `rgba(59, 130, 246, ${pulseOpacity})`}
        strokeWidth="2"
      />

      {/* ISS glow */}
      <circle
        cx={issPos.x}
        cy={issPos.y}
        r={10}
        fill={sunlit ? 'rgba(251, 191, 36, 0.3)' : 'rgba(59, 130, 246, 0.3)'}
      />

      {/* ISS dot */}
      <circle
        cx={issPos.x}
        cy={issPos.y}
        r={4}
        fill={sunlit ? '#fbbf24' : '#3b82f6'}
      />
    </svg>
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
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Fetch ISS data
  const fetchData = useCallback(async () => {
    try {
      let posData: any
      try {
        const response = await fetch('/api/iss')
        if (response.ok) {
          posData = await response.json()
        } else {
          throw new Error('Proxy failed')
        }
      } catch {
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

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [fetchData])

  const orbitNumber = getOrbitNumber()
  const orbitProgress = getOrbitProgress()
  const issCrew = data?.crew.filter(c => c.craft === 'ISS') || []
  const otherCrew = data?.crew.filter(c => c.craft !== 'ISS') || []

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full bg-[#1a1a1e] p-[1em]"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-[0.875em] text-white/50">Loading ISS data...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full bg-[#1a1a1e] p-[1em]"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <div className="text-[0.875em] text-red-400">{error || 'No data'}</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="bg-[#1a1a1e] p-[1em] h-full overflow-hidden flex flex-col"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header - location and sunlit status */}
      <div className="flex items-start justify-between mb-[0.5em]">
        <div>
          <p className="text-[0.6875em] text-white/40 uppercase tracking-wider mb-[0.125em]">
            Currently over
          </p>
          <h3 className="text-[1.125em] text-white font-medium leading-tight">
            {data.region}
          </h3>
        </div>
        <div className="flex items-center gap-[0.375em]">
          <div className={`w-[0.5em] h-[0.5em] rounded-full ${data.sunlit ? 'bg-amber-400' : 'bg-blue-400'}`} />
          <span className={`text-[0.75em] font-medium ${data.sunlit ? 'text-amber-400' : 'text-blue-400'}`}>
            {data.sunlit ? 'Sunlit' : 'Shadow'}
          </span>
        </div>
      </div>

      {/* Map container */}
      <div className="relative rounded-[0.5em] overflow-hidden mb-[0.5em]" style={{ height: '9em' }}>
        {/* Orbit progress bar overlay */}
        <div className="absolute top-0 left-0 right-0 z-10 px-[0.5em] pt-[0.375em]">
          <div className="flex items-center justify-between text-[0.625em] text-white/60 mb-[0.125em]">
            <span>Orbit #{orbitNumber.toLocaleString()}</span>
            <span>{Math.round(orbitProgress * 100)}%</span>
          </div>
          <div className="h-[0.1875em] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${orbitProgress * 100}%` }}
            />
          </div>
        </div>

        <ISSMap
          position={data.position}
          groundTrack={data.groundTrack}
          sunlit={data.sunlit}
        />

        {/* Coordinates overlay */}
        <div className="absolute bottom-[0.375em] right-[0.375em] text-[0.625em] font-mono text-white/50 bg-black/50 px-[0.375em] py-[0.125em] rounded-[0.25em]">
          {formatCoord(data.position.latitude, true)} · {formatCoord(data.position.longitude, false)}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-[0.375em] mb-[0.5em]">
        <div className="bg-white/5 rounded-[0.375em] p-[0.5em] text-center">
          <p className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.125em]">Altitude</p>
          <p className="text-[1em] text-white font-medium font-mono">
            {Math.round(data.position.altitude)}
            <span className="text-[0.625em] text-white/50 ml-[0.125em]">km</span>
          </p>
        </div>
        <div className="bg-white/5 rounded-[0.375em] p-[0.5em] text-center">
          <p className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.125em]">Velocity</p>
          <p className="text-[1em] text-white font-medium font-mono">
            {(data.position.velocity / 1000).toFixed(1)}
            <span className="text-[0.625em] text-white/50 ml-[0.125em]">km/s</span>
          </p>
        </div>
        <div className="bg-white/5 rounded-[0.375em] p-[0.5em] text-center">
          <p className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.125em]">Speed</p>
          <p className="text-[1em] text-white font-medium font-mono">
            {Math.round(data.position.velocity / 343)}×
            <span className="text-[0.625em] text-white/50 ml-[0.125em]">Mach</span>
          </p>
        </div>
      </div>

      {/* Crew section - collapsible */}
      <div className="bg-white/5 rounded-[0.375em] overflow-hidden">
        <button
          onClick={() => setCrewExpanded(!crewExpanded)}
          className="w-full flex items-center justify-between p-[0.5em] hover:bg-white/5 transition-colors"
        >
          <span className="text-[0.875em] text-white">
            {issCrew.length} aboard ISS
            {otherCrew.length > 0 && (
              <span className="text-white/40 ml-[0.375em]">
                (+{otherCrew.length} other)
              </span>
            )}
          </span>
          <span className={`text-white/40 text-[0.75em] transition-transform ${crewExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {crewExpanded && (
          <div className="border-t border-white/10 p-[0.5em]">
            <div className="space-y-[0.25em]">
              {issCrew.map((member, i) => (
                <div key={i} className="flex items-center justify-between text-[0.75em]">
                  <div className="flex items-center gap-[0.375em]">
                    <AgencyBadge agency={member.agency} />
                    <span className="text-white">{member.name}</span>
                  </div>
                  {member.role && (
                    <span className="text-white/40 text-[0.875em]">{member.role}</span>
                  )}
                </div>
              ))}
            </div>

            {otherCrew.length > 0 && (
              <>
                <div className="border-t border-white/10 my-[0.375em]" />
                <p className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.25em]">
                  Other Spacecraft
                </p>
                <div className="space-y-[0.25em]">
                  {otherCrew.map((member, i) => (
                    <div key={i} className="flex items-center justify-between text-[0.75em]">
                      <div className="flex items-center gap-[0.375em]">
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] mt-auto border-t border-white/10">
        <span className="text-[0.625em] text-white/40">
          Updated every 10s
        </span>
        <span className="text-[0.625em] font-mono text-white/40">
          {ORBIT_PERIOD_MINUTES.toFixed(0)} min orbit
        </span>
      </div>
    </div>
  )
}
