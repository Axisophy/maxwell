/**
 * MXWLL Orbital Engine - Celestial Bodies
 *
 * Uses astronomy-engine for accurate planetary positions
 * All positions returned in scene units (1 unit = 1000 km)
 */

import * as Astronomy from 'astronomy-engine'
import { SCALE } from './constants'

export interface Vector3D {
  x: number
  y: number
  z: number
}

export interface BodyPosition {
  position: Vector3D
  velocity?: Vector3D
}

export interface OrbitalElements {
  semiMajorAxis: number  // in scene units
  eccentricity: number
  inclination: number    // in degrees
  period: number         // in days
}

// Convert astronomy-engine vector (AU) to scene units (1000 km)
const AU_TO_KM = 149597870.7
function vectorToScene(v: Astronomy.Vector): Vector3D {
  // astronomy-engine uses AU, we need to convert to km then to scene units
  const kmPerAU = AU_TO_KM
  return {
    x: (v.x * kmPerAU) / SCALE,
    y: (v.y * kmPerAU) / SCALE,
    z: (v.z * kmPerAU) / SCALE,
  }
}

/**
 * Get the position of a body relative to the Sun (heliocentric)
 */
export function getHeliocentricPosition(
  body: Astronomy.Body,
  time: Date
): BodyPosition {
  const astroTime = Astronomy.MakeTime(time)
  const vector = Astronomy.HelioVector(body, astroTime)
  return {
    position: vectorToScene(vector),
  }
}

/**
 * Get Earth's position relative to Sun
 */
export function getEarthPosition(time: Date): BodyPosition {
  return getHeliocentricPosition(Astronomy.Body.Earth, time)
}

/**
 * Get Moon's position relative to Earth (geocentric)
 */
export function getMoonPosition(time: Date): BodyPosition {
  const astroTime = Astronomy.MakeTime(time)
  // GeoVector gives Moon position relative to Earth
  const vector = Astronomy.GeoVector(Astronomy.Body.Moon, astroTime, true)
  return {
    position: vectorToScene(vector),
  }
}

/**
 * Get Moon's position relative to Sun (heliocentric)
 * This is Earth position + Moon's geocentric position
 */
export function getMoonHeliocentricPosition(time: Date): BodyPosition {
  const earth = getEarthPosition(time)
  const moonGeo = getMoonPosition(time)
  return {
    position: {
      x: earth.position.x + moonGeo.position.x,
      y: earth.position.y + moonGeo.position.y,
      z: earth.position.z + moonGeo.position.z,
    },
  }
}

/**
 * Get all planetary positions at a given time
 */
export function getAllPlanetPositions(time: Date): Record<string, BodyPosition> {
  return {
    mercury: getHeliocentricPosition(Astronomy.Body.Mercury, time),
    venus: getHeliocentricPosition(Astronomy.Body.Venus, time),
    earth: getHeliocentricPosition(Astronomy.Body.Earth, time),
    mars: getHeliocentricPosition(Astronomy.Body.Mars, time),
    jupiter: getHeliocentricPosition(Astronomy.Body.Jupiter, time),
    saturn: getHeliocentricPosition(Astronomy.Body.Saturn, time),
    uranus: getHeliocentricPosition(Astronomy.Body.Uranus, time),
    neptune: getHeliocentricPosition(Astronomy.Body.Neptune, time),
  }
}

/**
 * Get orbital elements for a body
 */
export function getOrbitalElements(body: string): OrbitalElements {
  // Approximate orbital elements (semi-major axis in AU, converted to scene units)
  const elements: Record<string, OrbitalElements> = {
    mercury: {
      semiMajorAxis: (0.387 * AU_TO_KM) / SCALE,
      eccentricity: 0.206,
      inclination: 7.0,
      period: 87.97,
    },
    venus: {
      semiMajorAxis: (0.723 * AU_TO_KM) / SCALE,
      eccentricity: 0.007,
      inclination: 3.4,
      period: 224.7,
    },
    earth: {
      semiMajorAxis: (1.0 * AU_TO_KM) / SCALE,
      eccentricity: 0.017,
      inclination: 0.0,
      period: 365.25,
    },
    moon: {
      semiMajorAxis: 384400 / SCALE,
      eccentricity: 0.055,
      inclination: 5.1,
      period: 27.3,
    },
    mars: {
      semiMajorAxis: (1.524 * AU_TO_KM) / SCALE,
      eccentricity: 0.093,
      inclination: 1.85,
      period: 687,
    },
    jupiter: {
      semiMajorAxis: (5.203 * AU_TO_KM) / SCALE,
      eccentricity: 0.048,
      inclination: 1.3,
      period: 4333,
    },
    saturn: {
      semiMajorAxis: (9.537 * AU_TO_KM) / SCALE,
      eccentricity: 0.054,
      inclination: 2.5,
      period: 10759,
    },
    uranus: {
      semiMajorAxis: (19.19 * AU_TO_KM) / SCALE,
      eccentricity: 0.047,
      inclination: 0.8,
      period: 30687,
    },
    neptune: {
      semiMajorAxis: (30.07 * AU_TO_KM) / SCALE,
      eccentricity: 0.009,
      inclination: 1.8,
      period: 60190,
    },
  }
  return elements[body] || elements.earth
}

/**
 * Generate points for an orbit path
 */
export function generateOrbitPath(
  centerPosition: Vector3D,
  elements: OrbitalElements,
  segments: number = 128
): Vector3D[] {
  const points: Vector3D[] = []
  const a = elements.semiMajorAxis
  const e = elements.eccentricity
  const incRad = (elements.inclination * Math.PI) / 180

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI
    // Ellipse in orbital plane
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta))
    const x = r * Math.cos(theta)
    const y = r * Math.sin(theta)

    // Apply inclination (rotate around x-axis)
    const yRotated = y * Math.cos(incRad)
    const zRotated = y * Math.sin(incRad)

    points.push({
      x: centerPosition.x + x,
      y: centerPosition.y + yRotated,
      z: centerPosition.z + zRotated,
    })
  }

  return points
}

/**
 * Calculate distance between two positions
 */
export function distance(a: Vector3D, b: Vector3D): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dz = b.z - a.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Subtract two vectors
 */
export function subtract(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  }
}

/**
 * Add two vectors
 */
export function add(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  }
}
