/**
 * MXWLL Orbital Engine - Space Stations Data
 *
 * Real-time tracking of crewed space stations using TLE data
 * Data source: CelesTrak
 */

import { AU } from './constants'

// Earth radius in our scene units (1 unit = 1000 km)
export const EARTH_RADIUS_SCENE = 6.371

// Station altitude is typically 400-450 km, so in scene units ~0.4
export const TYPICAL_STATION_ALTITUDE = 0.42

export interface SpaceStation {
  id: string
  name: string
  noradId: number
  description: string
  launchDate: string
  crew?: number
  country: string
  color: number
  orbitPeriodMinutes: number  // Approximate
}

export interface TLEData {
  name: string
  line1: string
  line2: string
}

export interface StationPosition {
  latitude: number   // degrees
  longitude: number  // degrees
  altitude: number   // km
  velocity: number   // km/s
  x: number          // scene units
  y: number          // scene units
  z: number          // scene units
}

// Known space stations
export const SPACE_STATIONS: SpaceStation[] = [
  {
    id: 'iss',
    name: 'International Space Station',
    noradId: 25544,
    description: 'Joint project between NASA, Roscosmos, JAXA, ESA, and CSA. The largest modular space station in low Earth orbit.',
    launchDate: '1998-11-20',
    crew: 7,
    country: 'International',
    color: 0x00ff88,  // Green
    orbitPeriodMinutes: 93,
  },
  {
    id: 'tiangong',
    name: 'Tiangong Space Station',
    noradId: 48274,  // CSS (Tianhe core module)
    description: 'China\'s modular space station, operational since 2021. Third generation following Tiangong-1 and Tiangong-2.',
    launchDate: '2021-04-29',
    crew: 3,
    country: 'China',
    color: 0xff4444,  // Red
    orbitPeriodMinutes: 92,
  },
]

/**
 * Parse TLE data to extract orbital elements
 * Returns mean motion (revolutions per day) and other elements
 */
export function parseTLE(tle: TLEData): {
  inclination: number      // degrees
  raan: number            // Right ascension of ascending node (degrees)
  eccentricity: number
  argPerigee: number      // Argument of perigee (degrees)
  meanAnomaly: number     // degrees
  meanMotion: number      // revolutions per day
  epoch: Date
} {
  const line1 = tle.line1
  const line2 = tle.line2

  // Parse epoch from line 1 (columns 19-32)
  const epochYear = parseInt(line1.substring(18, 20))
  const epochDay = parseFloat(line1.substring(20, 32))
  const fullYear = epochYear < 57 ? 2000 + epochYear : 1900 + epochYear
  const epoch = new Date(fullYear, 0, 1)
  epoch.setTime(epoch.getTime() + (epochDay - 1) * 24 * 60 * 60 * 1000)

  // Parse line 2
  const inclination = parseFloat(line2.substring(8, 16))
  const raan = parseFloat(line2.substring(17, 25))
  const eccentricity = parseFloat('0.' + line2.substring(26, 33))
  const argPerigee = parseFloat(line2.substring(34, 42))
  const meanAnomaly = parseFloat(line2.substring(43, 51))
  const meanMotion = parseFloat(line2.substring(52, 63))

  return {
    inclination,
    raan,
    eccentricity,
    argPerigee,
    meanAnomaly,
    meanMotion,
    epoch,
  }
}

/**
 * Simple SGP4-like propagation for visualization purposes
 * For production accuracy, use satellite.js library
 */
export function propagateSimple(
  tle: TLEData,
  time: Date
): StationPosition {
  const elements = parseTLE(tle)

  // Time since epoch in minutes
  const epochMs = elements.epoch.getTime()
  const nowMs = time.getTime()
  const minutesSinceEpoch = (nowMs - epochMs) / (1000 * 60)

  // Mean motion in radians per minute
  const meanMotionRadPerMin = (elements.meanMotion * 2 * Math.PI) / (24 * 60)

  // Current mean anomaly
  const currentMeanAnomaly = (elements.meanAnomaly * Math.PI / 180) +
                             (meanMotionRadPerMin * minutesSinceEpoch)

  // Simplified: assume circular orbit (eccentricity ≈ 0 for LEO stations)
  const trueAnomaly = currentMeanAnomaly

  // Calculate semi-major axis from mean motion
  // n = sqrt(GM/a³) → a = (GM/n²)^(1/3)
  const GM = 398600.4418  // km³/s²
  const meanMotionRadPerSec = meanMotionRadPerMin / 60
  const semiMajorAxis = Math.pow(GM / (meanMotionRadPerSec * meanMotionRadPerSec), 1/3)

  // Calculate altitude
  const altitude = semiMajorAxis - 6371  // km above Earth surface

  // Calculate position in orbital plane
  const r = semiMajorAxis * (1 - elements.eccentricity * elements.eccentricity) /
            (1 + elements.eccentricity * Math.cos(trueAnomaly))

  // Position in perifocal coordinates
  const xPeri = r * Math.cos(trueAnomaly)
  const yPeri = r * Math.sin(trueAnomaly)

  // Convert to ECI (Earth-Centered Inertial)
  const incRad = elements.inclination * Math.PI / 180
  const raanRad = elements.raan * Math.PI / 180
  const argPeriRad = elements.argPerigee * Math.PI / 180

  // Rotation matrices combined
  const cosRaan = Math.cos(raanRad)
  const sinRaan = Math.sin(raanRad)
  const cosInc = Math.cos(incRad)
  const sinInc = Math.sin(incRad)
  const cosArg = Math.cos(argPeriRad)
  const sinArg = Math.sin(argPeriRad)

  // ECI position
  const xEci = (cosRaan * cosArg - sinRaan * sinArg * cosInc) * xPeri +
               (-cosRaan * sinArg - sinRaan * cosArg * cosInc) * yPeri
  const yEci = (sinRaan * cosArg + cosRaan * sinArg * cosInc) * xPeri +
               (-sinRaan * sinArg + cosRaan * cosArg * cosInc) * yPeri
  const zEci = (sinArg * sinInc) * xPeri + (cosArg * sinInc) * yPeri

  // Convert to geographic coordinates
  // Earth rotation: ~360° per day
  const earthRotation = (nowMs / (24 * 60 * 60 * 1000)) * 2 * Math.PI
  const greenwichAngle = earthRotation % (2 * Math.PI)

  // ECEF position
  const xEcef = xEci * Math.cos(greenwichAngle) + yEci * Math.sin(greenwichAngle)
  const yEcef = -xEci * Math.sin(greenwichAngle) + yEci * Math.cos(greenwichAngle)
  const zEcef = zEci

  // Geographic coordinates
  const longitude = Math.atan2(yEcef, xEcef) * 180 / Math.PI
  const latitude = Math.atan2(zEcef, Math.sqrt(xEcef * xEcef + yEcef * yEcef)) * 180 / Math.PI

  // Orbital velocity (vis-viva equation for circular orbit)
  const velocity = Math.sqrt(GM / semiMajorAxis)

  // Convert to scene coordinates (scale: 1 unit = 1000 km)
  // We use a different scale for Earth orbit view than solar system view
  const sceneScale = 0.001  // 1 km = 0.001 scene units
  const x = xEci * sceneScale
  const y = zEci * sceneScale  // Swap y/z for Three.js coordinate system
  const z = yEci * sceneScale

  return {
    latitude,
    longitude,
    altitude,
    velocity,
    x,
    y,
    z,
  }
}

/**
 * Generate orbit path points for visualization
 */
export function generateOrbitPath(
  tle: TLEData,
  startTime: Date,
  periodMinutes: number = 93,
  segments: number = 128
): Array<{ x: number; y: number; z: number }> {
  const points: Array<{ x: number; y: number; z: number }> = []

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const time = new Date(startTime.getTime() + t * periodMinutes * 60 * 1000)
    const pos = propagateSimple(tle, time)
    points.push({ x: pos.x, y: pos.y, z: pos.z })
  }

  return points
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lonDir = lon >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lon).toFixed(2)}°${lonDir}`
}

/**
 * Format altitude for display
 */
export function formatAltitude(altitudeKm: number): string {
  return `${altitudeKm.toFixed(0)} km`
}

/**
 * Format velocity for display
 */
export function formatVelocity(velocityKmS: number): string {
  return `${velocityKmS.toFixed(2)} km/s`
}

/**
 * Calculate if station is in daylight or eclipse
 */
export function isInSunlight(position: StationPosition, time: Date): boolean {
  // Simplified: check if position is on the sunlit side of Earth
  // In reality, this requires knowing the Sun's position
  // For now, approximate based on longitude and time of day
  const hourAngle = (time.getUTCHours() + time.getUTCMinutes() / 60) * 15 - 180
  const sunLongitude = -hourAngle  // Approximate sub-solar longitude
  const angleDiff = Math.abs(position.longitude - sunLongitude)
  return angleDiff < 90 || angleDiff > 270
}

/**
 * Get approximate ground track region
 */
export function getRegion(lat: number, lon: number): string {
  // Very simplified region detection
  if (lat > 60) return 'Arctic'
  if (lat < -60) return 'Antarctic'

  if (lon > -30 && lon < 60) {
    if (lat > 35) return 'Europe'
    if (lat > 0) return 'North Africa / Middle East'
    return 'Africa'
  }

  if (lon >= 60 && lon < 150) {
    if (lat > 35) return 'Russia / Central Asia'
    if (lat > 0) return 'South Asia'
    return 'Southeast Asia / Australia'
  }

  if (lon >= -170 && lon < -30) {
    if (lat > 35) return 'North America'
    if (lat > 0) return 'Central America / Caribbean'
    return 'South America'
  }

  return 'Pacific Ocean'
}

// Default TLE data (will be updated from API)
// These are example TLEs - should be fetched fresh from CelesTrak
export const DEFAULT_TLES: Record<string, TLEData> = {
  iss: {
    name: 'ISS (ZARYA)',
    line1: '1 25544U 98067A   24001.50000000  .00016717  00000-0  10270-3 0  9992',
    line2: '2 25544  51.6400 100.0000 0001234  90.0000 270.0000 15.50000000000000',
  },
  tiangong: {
    name: 'CSS (TIANHE)',
    line1: '1 48274U 21035A   24001.50000000  .00020000  00000-0  15000-3 0  9990',
    line2: '2 48274  41.4700 200.0000 0001000 180.0000  90.0000 15.60000000000000',
  },
}
