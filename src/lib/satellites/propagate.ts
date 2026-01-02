import * as satellite from 'satellite.js'
import * as THREE from 'three'
import { TLEData, SatellitePosition, OrbitPoint } from './types'

// Re-export types for convenience
export type { SatellitePosition, OrbitPoint }

// Earth radius in km
const EARTH_RADIUS_KM = 6371

// Scale factor for 3D globe (Earth radius = 1 unit)
const SCALE_FACTOR = 1 / EARTH_RADIUS_KM

/**
 * Convert latitude, longitude, altitude to Three.js Vector3
 * Uses a unit sphere where Earth radius = 1
 */
export function latLonAltToVector3(
  latitude: number,
  longitude: number,
  altitude: number
): THREE.Vector3 {
  // Convert to radians
  const lat = (latitude * Math.PI) / 180
  const lon = (longitude * Math.PI) / 180

  // Calculate radius (1 = Earth surface, altitude adds to it)
  const radius = 1 + altitude * SCALE_FACTOR

  // Convert spherical to Cartesian
  const x = radius * Math.cos(lat) * Math.sin(lon)
  const y = radius * Math.sin(lat)
  const z = radius * Math.cos(lat) * Math.cos(lon)

  return new THREE.Vector3(x, y, z)
}

/**
 * Parse TLE and create a satellite record for SGP4 propagation
 */
export function createSatelliteRecord(tle: TLEData): satellite.SatRec | null {
  try {
    const satrec = satellite.twoline2satrec(tle.line1, tle.line2)
    return satrec
  } catch (error) {
    console.error(`Failed to parse TLE for ${tle.name}:`, error)
    return null
  }
}

/**
 * Propagate satellite position at a given time
 */
export function propagateSatellite(
  satrec: satellite.SatRec,
  date: Date
): { latitude: number; longitude: number; altitude: number; velocity: number } | null {
  try {
    // Propagate
    const positionAndVelocity = satellite.propagate(satrec, date)

    if (!positionAndVelocity || typeof positionAndVelocity.position === 'boolean' || !positionAndVelocity.position) {
      return null
    }

    const positionEci = positionAndVelocity.position as satellite.EciVec3<number>
    const velocityEci = positionAndVelocity.velocity as satellite.EciVec3<number>

    // Get GMST for coordinate conversion
    const gmst = satellite.gstime(date)

    // Convert ECI to geodetic
    const positionGd = satellite.eciToGeodetic(positionEci, gmst)

    // Convert radians to degrees
    const longitude = satellite.degreesLong(positionGd.longitude)
    const latitude = satellite.degreesLat(positionGd.latitude)
    const altitude = positionGd.height // Already in km

    // Calculate velocity magnitude
    const velocity = Math.sqrt(
      velocityEci.x ** 2 + velocityEci.y ** 2 + velocityEci.z ** 2
    )

    return { latitude, longitude, altitude, velocity }
  } catch (error) {
    return null
  }
}

/**
 * Calculate current position of a satellite from TLE data
 */
export function getCurrentPosition(tle: TLEData): SatellitePosition | null {
  const satrec = createSatelliteRecord(tle)
  if (!satrec) return null

  const now = new Date()
  const position = propagateSatellite(satrec, now)
  if (!position) return null

  return {
    id: tle.noradId,
    name: tle.name,
    noradId: tle.noradId,
    latitude: position.latitude,
    longitude: position.longitude,
    altitude: position.altitude,
    velocity: position.velocity,
    group: tle.group,
    line1: tle.line1,
    line2: tle.line2,
  }
}

/**
 * Get orbital period in minutes from TLE mean motion
 * Mean motion is in revolutions per day
 */
export function getOrbitalPeriod(tle: TLEData): number {
  const satrec = createSatelliteRecord(tle)
  if (!satrec) return 90 // Default to 90 minutes

  // Mean motion is in radians per minute in SGP4
  // Convert to period: period = 2*PI / meanMotion
  const meanMotion = satrec.no // radians per minute
  if (meanMotion <= 0) return 90

  const periodMinutes = (2 * Math.PI) / meanMotion
  return periodMinutes
}

/**
 * Calculate orbit path for a satellite
 * If durationMinutes is not provided, calculates one full orbit
 * Path starts from half an orbit ago to show where it's been
 */
export function calculateOrbitPath(
  tle: TLEData,
  durationMinutes?: number,
  numPoints: number = 360
): OrbitPoint[] {
  const satrec = createSatelliteRecord(tle)
  if (!satrec) return []

  // If no duration provided, use full orbital period
  const orbitalPeriod = getOrbitalPeriod(tle)
  const actualDuration = durationMinutes ?? orbitalPeriod

  const points: OrbitPoint[] = []
  const now = new Date()
  const intervalMs = (actualDuration * 60 * 1000) / numPoints

  // Start from half an orbit ago to show where it's been
  const startTime = now.getTime() - (actualDuration * 60 * 1000 / 2)

  for (let i = 0; i < numPoints; i++) {
    const time = new Date(startTime + i * intervalMs)
    const position = propagateSatellite(satrec, time)

    if (position) {
      points.push({
        latitude: position.latitude,
        longitude: position.longitude,
        altitude: position.altitude,
        time,
      })
    }
  }

  return points
}

/**
 * Batch propagate multiple satellites
 */
export function propagateAll(
  tleData: TLEData[],
  date: Date = new Date()
): SatellitePosition[] {
  const positions: SatellitePosition[] = []

  for (const tle of tleData) {
    const satrec = createSatelliteRecord(tle)
    if (!satrec) continue

    const position = propagateSatellite(satrec, date)
    if (!position) continue

    positions.push({
      id: tle.noradId,
      name: tle.name,
      noradId: tle.noradId,
      latitude: position.latitude,
      longitude: position.longitude,
      altitude: position.altitude,
      velocity: position.velocity,
      group: tle.group,
      line1: tle.line1,
      line2: tle.line2,
    })
  }

  return positions
}
