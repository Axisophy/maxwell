'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// ISS TRACKER
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

// Constants
const ISS_LAUNCH_DATE = new Date('1998-11-20T06:40:00Z')
const ORBIT_PERIOD_MINUTES = 92.68
const MAP_WIDTH = 800
const MAP_HEIGHT = 400

const AGENCY_INFO: Record<string, { abbrev: string; color: string }> = {
  'NASA': { abbrev: 'NASA', color: '#0B3D91' },
  'Roscosmos': { abbrev: 'RSA', color: '#E4181C' },
  'JAXA': { abbrev: 'JAXA', color: '#1E4D8C' },
  'ESA': { abbrev: 'ESA', color: '#003399' },
  'CSA': { abbrev: 'CSA', color: '#FF0000' },
  'SpaceX': { abbrev: 'SpX', color: '#005288' },
}

const FALLBACK_CREW: CrewMember[] = [
  { name: 'Oleg Kononenko', craft: 'ISS', agency: 'Roscosmos', role: 'Commander' },
  { name: 'Nikolai Chub', craft: 'ISS', agency: 'Roscosmos', role: 'Flight Engineer' },
  { name: 'Tracy Dyson', craft: 'ISS', agency: 'NASA', role: 'Flight Engineer' },
  { name: 'Matthew Dominick', craft: 'ISS', agency: 'NASA', role: 'Flight Engineer' },
  { name: 'Michael Barratt', craft: 'ISS', agency: 'NASA', role: 'Flight Engineer' },
  { name: 'Jeanette Epps', craft: 'ISS', agency: 'NASA', role: 'Flight Engineer' },
  { name: 'Alexander Grebenkin', craft: 'ISS', agency: 'Roscosmos', role: 'Flight Engineer' },
]

// Helpers
function latLonToXY(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon + 180) / 360) * MAP_WIDTH
  const y = ((90 - lat) / 180) * MAP_HEIGHT
  return { x, y }
}

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

function getOrbitNumber(): number {
  const minutesSinceLaunch = (Date.now() - ISS_LAUNCH_DATE.getTime()) / 60000
  return Math.floor(minutesSinceLaunch / ORBIT_PERIOD_MINUTES)
}

function getOrbitProgress(): number {
  const minutesSinceLaunch = (Date.now() - ISS_LAUNCH_DATE.getTime()) / 60000
  return (minutesSinceLaunch % ORBIT_PERIOD_MINUTES) / ORBIT_PERIOD_MINUTES
}

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

function formatCoord(value: number, isLat: boolean): string {
  const abs = Math.abs(value)
  const dir = isLat ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W')
  return `${abs.toFixed(2)}°${dir}`
}

// ===========================================
// MAP COMPONENT
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
    <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="w-full h-full rounded-lg" style={{ backgroundColor: '#0a0a12' }}>
      {/* Simplified continent outlines */}
      <g fill="none" stroke="#1e3a5f" strokeWidth="1">
        <path d="M45,95 L55,80 L85,75 L120,80 L155,95 L175,115 L190,140 L195,170 L180,190 L145,195 L110,185 L85,175 L60,160 L45,130 Z" />
        <path d="M110,185 L115,195 L125,210 L130,225 L120,230 L115,220 L108,210 L105,195 Z" />
        <path d="M130,225 L145,230 L165,255 L175,290 L180,330 L170,375 L155,400 L130,410 L115,390 L105,350 L110,310 L115,280 L120,255 L125,235 Z" />
        <path d="M355,85 L375,75 L400,80 L420,85 L435,95 L445,110 L440,130 L420,140 L395,145 L375,140 L360,130 L355,115 Z" />
        <path d="M355,155 L380,150 L415,155 L445,170 L470,200 L480,240 L475,290 L455,335 L420,365 L380,375 L350,360 L335,320 L340,275 L345,235 L350,195 Z" />
        <path d="M445,75 L490,65 L540,60 L600,70 L660,85 L710,100 L740,130 L750,160 L740,190 L710,210 L665,205 L620,195 L570,190 L530,185 L495,175 L465,160 L450,135 L445,110 Z" />
        <path d="M530,185 L545,195 L560,220 L555,255 L540,280 L520,270 L510,245 L515,215 L525,195 Z" />
        <path d="M620,320 L670,310 L720,320 L750,345 L755,380 L735,410 L695,425 L650,420 L615,400 L605,365 L610,340 Z" />
        <path d="M710,130 L725,125 L735,135 L730,150 L720,155 L712,145 Z" />
        <path d="M350,90 L358,85 L365,90 L362,100 L355,105 L348,98 Z" />
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
// AGENCY BADGE
// ===========================================

function AgencyBadge({ agency }: { agency?: string }) {
  if (!agency) return null
  const info = AGENCY_INFO[agency] || { abbrev: agency.slice(0, 3).toUpperCase(), color: '#666' }

  return (
    <span
      className="text-[10px] font-medium px-1.5 py-0.5 rounded"
      style={{ backgroundColor: info.color, color: 'white' }}
    >
      {info.abbrev}
    </span>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function ISSTracker() {
  const [data, setData] = useState<ISSData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [crewExpanded, setCrewExpanded] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      // Try proxy first, then direct API
      let issData: any
      let crewData: any

      try {
        const response = await fetch('/api/iss')
        if (response.ok) {
          const data = await response.json()
          // API returns { iss: {...}, astronauts: {...} }
          issData = data.iss
          crewData = data.astronauts
        } else {
          throw new Error('Proxy failed')
        }
      } catch {
        // Fallback to direct API call
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544')
        if (!response.ok) throw new Error('Position API failed')
        issData = await response.json()
      }

      // Validate position data
      if (!issData || typeof issData.latitude !== 'number' || typeof issData.longitude !== 'number') {
        throw new Error('Invalid position data')
      }

      const position: ISSPosition = {
        latitude: issData.latitude,
        longitude: issData.longitude,
        altitude: issData.altitude || 420,
        velocity: issData.velocity || 27600,
        timestamp: Date.now()
      }

      // Use crew data from API or fallback
      let crew: CrewMember[] = FALLBACK_CREW
      if (crewData?.people && crewData.people.length > 0) {
        crew = crewData.people.map((p: any) => ({
          name: p.name,
          craft: p.craft,
          agency: p.agency,
          role: p.role
        }))
      }

      const sunlit = calculateSunlit(position.latitude, position.longitude)
      const region = getLocationName(position.latitude, position.longitude)
      const groundTrack = generateGroundTrack(position.latitude, position.longitude)

      setData({ position, crew, groundTrack, sunlit, region })
      setError(null)
    } catch (err) {
      console.error('ISS data fetch error:', err)
      setError('Unable to fetch ISS data')
    } finally {
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
      <div className="bg-[#404040] p-2 md:p-4">
        <div className="flex items-center justify-center h-48">
          <div className="text-sm text-white/50 font-mono">Loading ISS data...</div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-[#404040] p-2 md:p-4">
        <div className="flex items-center justify-center h-48">
          <div className="text-sm text-red-400">{error || 'No data'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#404040] p-2 md:p-4 space-y-px">
      {/* Location & Status */}
      <div className="bg-black rounded-lg p-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1">
              Currently over
            </div>
            <div className="text-base font-medium text-white">
              {data.region}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${data.sunlit ? 'bg-amber-400' : 'bg-blue-400'}`} />
            <span className={`text-xs font-medium ${data.sunlit ? 'text-amber-400' : 'text-blue-400'}`}>
              {data.sunlit ? 'Sunlit' : 'Shadow'}
            </span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-black rounded-lg p-3">
        {/* Orbit progress */}
        <div className="flex items-center justify-between text-[10px] text-white/40 mb-2">
          <span>Orbit #{orbitNumber.toLocaleString()}</span>
          <span>{Math.round(orbitProgress * 100)}%</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
            style={{ width: `${orbitProgress * 100}%` }}
          />
        </div>

        {/* Map */}
        <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '2/1' }}>
          <ISSMap
            position={data.position}
            groundTrack={data.groundTrack}
            sunlit={data.sunlit}
          />
          {/* Coordinates */}
          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/50 bg-black/50 px-2 py-1 rounded">
            {formatCoord(data.position.latitude, true)} · {formatCoord(data.position.longitude, false)}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px">
        <div className="bg-black rounded-lg p-3 text-center">
          <div className="text-[10px] text-white/40 uppercase mb-1">Altitude</div>
          <div className="font-mono text-lg font-bold text-white">
            {Math.round(data.position.altitude)}
            <span className="text-xs text-white/40 ml-1">km</span>
          </div>
        </div>
        <div className="bg-black rounded-lg p-3 text-center">
          <div className="text-[10px] text-white/40 uppercase mb-1">Velocity</div>
          <div className="font-mono text-lg font-bold text-white">
            {(data.position.velocity / 1000).toFixed(1)}
            <span className="text-xs text-white/40 ml-1">km/s</span>
          </div>
        </div>
        <div className="bg-black rounded-lg p-3 text-center">
          <div className="text-[10px] text-white/40 uppercase mb-1">Speed</div>
          <div className="font-mono text-lg font-bold text-white">
            {Math.round(data.position.velocity / 343)}×
            <span className="text-xs text-white/40 ml-1">Mach</span>
          </div>
        </div>
      </div>

      {/* Crew */}
      <div className="bg-black rounded-lg overflow-hidden">
        <button
          onClick={() => setCrewExpanded(!crewExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
        >
          <span className="text-sm text-white">
            {issCrew.length} aboard ISS
            {otherCrew.length > 0 && (
              <span className="text-white/40 ml-2">
                (+{otherCrew.length} other)
              </span>
            )}
          </span>
          <span className={`text-white/40 text-xs transition-transform ${crewExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {crewExpanded && (
          <div className="border-t border-white/10 p-3">
            <div className="space-y-2">
              {issCrew.map((member, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AgencyBadge agency={member.agency} />
                    <span className="text-white">{member.name}</span>
                  </div>
                  {member.role && (
                    <span className="text-white/40">{member.role}</span>
                  )}
                </div>
              ))}
            </div>

            {otherCrew.length > 0 && (
              <>
                <div className="border-t border-white/10 my-2" />
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
                  Other Spacecraft
                </div>
                <div className="space-y-2">
                  {otherCrew.map((member, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
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
    </div>
  )
}
