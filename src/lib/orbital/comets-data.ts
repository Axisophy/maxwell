/**
 * MXWLL Orbital Engine - Comet Data and Propagation
 *
 * Comets use Keplerian orbital elements for position calculation.
 * Data sourced from JPL Small-Body Database.
 *
 * Orbital elements are:
 * - a: Semi-major axis (AU)
 * - e: Eccentricity
 * - i: Inclination (degrees)
 * - om: Longitude of ascending node (degrees)
 * - w: Argument of perihelion (degrees)
 * - ma: Mean anomaly at epoch (degrees)
 * - epoch: Julian date of orbital elements
 */

import { AU } from './constants'

export interface CometOrbitalElements {
  a: number      // Semi-major axis (AU)
  e: number      // Eccentricity (0-1 for elliptical, >1 for hyperbolic)
  i: number      // Inclination (degrees)
  om: number     // Longitude of ascending node Ω (degrees)
  w: number      // Argument of perihelion ω (degrees)
  ma: number     // Mean anomaly at epoch M₀ (degrees)
  epoch: number  // Julian date of elements
}

export interface Comet {
  id: string
  name: string
  designation: string
  elements: CometOrbitalElements
  period: number | null     // Orbital period in years (null if non-periodic)
  lastPerihelion: string    // Date of last perihelion passage
  nextPerihelion?: string   // Date of next perihelion (if known)
  description: string
  discovered: string
  type: 'short-period' | 'long-period' | 'non-periodic'
  color: number
}

export interface CometPosition {
  x: number       // AU from Sun
  y: number       // AU from Sun
  z: number       // AU from Sun
  distance: number // AU from Sun
  velocity: number // km/s
  tailDirection: { x: number; y: number; z: number }  // Unit vector pointing away from Sun
}

// Notable comets with orbital elements
// Data from JPL Small-Body Database (https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html)
export const COMETS: Comet[] = [
  {
    id: 'halley',
    name: "Halley's Comet",
    designation: '1P/Halley',
    elements: {
      a: 17.834,        // AU
      e: 0.96714,
      i: 162.26,        // Retrograde orbit
      om: 58.42,
      w: 111.33,
      ma: 38.38,        // At epoch
      epoch: 2449400.5, // 1994-Feb-17
    },
    period: 75.32,
    lastPerihelion: '1986-02-09',
    nextPerihelion: '2061-07-28',
    description: 'The most famous periodic comet, visible from Earth every 75-76 years. Depicted in the Bayeux Tapestry (1066) and studied by Edmond Halley who predicted its return.',
    discovered: 'Prehistoric (recorded since 240 BC)',
    type: 'short-period',
    color: 0x88ccff,
  },
  {
    id: 'hale-bopp',
    name: 'Comet Hale-Bopp',
    designation: 'C/1995 O1',
    elements: {
      a: 186.0,
      e: 0.995,
      i: 89.43,
      om: 282.47,
      w: 130.59,
      ma: 0.0,
      epoch: 2450538.0, // 1997-Apr-01 (near perihelion)
    },
    period: 2533,
    lastPerihelion: '1997-04-01',
    nextPerihelion: '4530',
    description: 'One of the most widely observed comets of the 20th century. Visible to the naked eye for 18 months, setting a record. Its nucleus is estimated at 40-80 km diameter.',
    discovered: '1995 by Alan Hale and Thomas Bopp',
    type: 'long-period',
    color: 0xffffaa,
  },
  {
    id: 'neowise',
    name: 'Comet NEOWISE',
    designation: 'C/2020 F3',
    elements: {
      a: 364.0,
      e: 0.999,
      i: 128.94,
      om: 61.01,
      w: 37.28,
      ma: 0.0,
      epoch: 2459034.0, // 2020-Jul-03 (perihelion)
    },
    period: 6800,
    lastPerihelion: '2020-07-03',
    description: 'A bright comet discovered by the NEOWISE space telescope in March 2020. Became visible to naked eye in July 2020, the brightest comet in the northern hemisphere since Hale-Bopp.',
    discovered: '2020 by NEOWISE space telescope',
    type: 'long-period',
    color: 0xffdd88,
  },
  {
    id: 'encke',
    name: "Comet Encke",
    designation: '2P/Encke',
    elements: {
      a: 2.215,
      e: 0.848,
      i: 11.78,
      om: 334.57,
      w: 186.54,
      ma: 215.0,
      epoch: 2459000.5,
    },
    period: 3.30,
    lastPerihelion: '2023-10-22',
    nextPerihelion: '2027-01-25',
    description: 'Has the shortest orbital period of any known comet (3.3 years). Source of the Taurid meteor shower. First comet (other than Halley) to have its return predicted.',
    discovered: '1786 by Pierre Méchain',
    type: 'short-period',
    color: 0xaaddff,
  },
  {
    id: 'tempel-1',
    name: 'Comet Tempel 1',
    designation: '9P/Tempel',
    elements: {
      a: 3.138,
      e: 0.512,
      i: 10.53,
      om: 68.93,
      w: 178.93,
      ma: 180.0,
      epoch: 2453500.5,
    },
    period: 5.56,
    lastPerihelion: '2022-03-04',
    nextPerihelion: '2027-09-01',
    description: 'Target of NASA\'s Deep Impact mission (2005), which fired an impactor into the nucleus to study its composition. Later visited by Stardust spacecraft.',
    discovered: '1867 by Wilhelm Tempel',
    type: 'short-period',
    color: 0x99bbdd,
  },
  {
    id: 'churyumov-gerasimenko',
    name: 'Comet 67P',
    designation: '67P/Churyumov-Gerasimenko',
    elements: {
      a: 3.463,
      e: 0.641,
      i: 7.04,
      om: 50.19,
      w: 12.78,
      ma: 180.0,
      epoch: 2457260.5, // 2015-Aug-13 (perihelion)
    },
    period: 6.44,
    lastPerihelion: '2021-11-02',
    nextPerihelion: '2028-03-28',
    description: 'Target of ESA\'s Rosetta mission, which orbited the comet and landed the Philae probe on its surface in 2014 - the first soft landing on a comet.',
    discovered: '1969 by Klim Churyumov and Svetlana Gerasimenko',
    type: 'short-period',
    color: 0x778899,
  },
  {
    id: 'wirtanen',
    name: 'Comet Wirtanen',
    designation: '46P/Wirtanen',
    elements: {
      a: 3.092,
      e: 0.659,
      i: 11.75,
      om: 82.16,
      w: 356.34,
      ma: 0.0,
      epoch: 2458468.5, // 2018-Dec-12 (perihelion)
    },
    period: 5.44,
    lastPerihelion: '2024-01-28',
    nextPerihelion: '2029-06-20',
    description: 'A small comet that made a close approach to Earth in December 2018 (0.077 AU). Was the original target of the Rosetta mission.',
    discovered: '1948 by Carl Wirtanen',
    type: 'short-period',
    color: 0xaaccee,
  },
  {
    id: 'hyakutake',
    name: 'Comet Hyakutake',
    designation: 'C/1996 B2',
    elements: {
      a: 2364.0,
      e: 0.9999,
      i: 124.92,
      om: 188.04,
      w: 130.17,
      ma: 0.0,
      epoch: 2450183.0, // 1996-May-01 (near perihelion)
    },
    period: 114000,
    lastPerihelion: '1996-05-01',
    description: 'Made one of the closest approaches to Earth by a comet in 200 years (0.10 AU in March 1996). Its ion tail extended over 500 million km.',
    discovered: '1996 by Yuji Hyakutake',
    type: 'long-period',
    color: 0x66aaff,
  },
]

/**
 * Convert Julian Date to JavaScript Date
 */
export function julianToDate(jd: number): Date {
  const unixTime = (jd - 2440587.5) * 86400000
  return new Date(unixTime)
}

/**
 * Convert JavaScript Date to Julian Date
 */
export function dateToJulian(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

/**
 * Solve Kepler's equation for eccentric anomaly
 * M = E - e * sin(E)
 * Uses Newton-Raphson iteration
 */
function solveKepler(M: number, e: number, tolerance: number = 1e-8): number {
  // Normalize mean anomaly to 0-2π
  M = M % (2 * Math.PI)
  if (M < 0) M += 2 * Math.PI

  // Initial guess
  let E = e < 0.8 ? M : Math.PI

  // Newton-Raphson iteration
  for (let i = 0; i < 50; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
    E -= dE
    if (Math.abs(dE) < tolerance) break
  }

  return E
}

/**
 * Calculate comet position from orbital elements at a given time
 */
export function getCometPosition(comet: Comet, date: Date): CometPosition {
  const elements = comet.elements

  // Convert date to Julian date
  const jd = dateToJulian(date)

  // Time since epoch in days
  const dt = jd - elements.epoch

  // Mean motion (radians per day)
  // n = sqrt(GM / a³) where GM_sun ≈ 0.01720209895² AU³/day²
  const GM = 0.01720209895 * 0.01720209895
  const n = Math.sqrt(GM / Math.pow(Math.abs(elements.a), 3))

  // Mean anomaly at date
  const M = (elements.ma * Math.PI / 180) + n * dt

  // Solve Kepler's equation for eccentric anomaly
  const E = solveKepler(M, elements.e)

  // True anomaly
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + elements.e) * Math.sin(E / 2),
    Math.sqrt(1 - elements.e) * Math.cos(E / 2)
  )

  // Distance from Sun (radius)
  const r = elements.a * (1 - elements.e * Math.cos(E))

  // Position in orbital plane
  const xOrb = r * Math.cos(nu)
  const yOrb = r * Math.sin(nu)

  // Convert angles to radians
  const iRad = elements.i * Math.PI / 180
  const omRad = elements.om * Math.PI / 180
  const wRad = elements.w * Math.PI / 180

  // Rotation matrices to get heliocentric ecliptic coordinates
  const cosOm = Math.cos(omRad)
  const sinOm = Math.sin(omRad)
  const cosI = Math.cos(iRad)
  const sinI = Math.sin(iRad)
  const cosW = Math.cos(wRad)
  const sinW = Math.sin(wRad)

  // Transform to heliocentric ecliptic coordinates
  const x = (cosOm * cosW - sinOm * sinW * cosI) * xOrb +
            (-cosOm * sinW - sinOm * cosW * cosI) * yOrb
  const y = (sinOm * cosW + cosOm * sinW * cosI) * xOrb +
            (-sinOm * sinW + cosOm * cosW * cosI) * yOrb
  const z = (sinW * sinI) * xOrb + (cosW * sinI) * yOrb

  // Distance from Sun
  const distance = Math.sqrt(x * x + y * y + z * z)

  // Velocity (vis-viva equation)
  const v = Math.sqrt(GM * (2 / distance - 1 / Math.abs(elements.a)))
  const velocityKmS = v * 149597870.7 / 86400  // Convert AU/day to km/s

  // Tail direction (always points away from Sun)
  const tailDirection = {
    x: x / distance,
    y: y / distance,
    z: z / distance,
  }

  return {
    x,
    y,
    z,
    distance,
    velocity: velocityKmS,
    tailDirection,
  }
}

/**
 * Generate comet orbit path
 */
export function generateCometOrbit(
  comet: Comet,
  segments: number = 256
): Array<{ x: number; y: number; z: number }> {
  const points: Array<{ x: number; y: number; z: number }> = []
  const elements = comet.elements

  // For highly eccentric orbits, sample more points near perihelion
  for (let i = 0; i <= segments; i++) {
    // True anomaly from 0 to 2π
    const nu = (i / segments) * 2 * Math.PI

    // Distance from Sun at this true anomaly
    const r = elements.a * (1 - elements.e * elements.e) / (1 + elements.e * Math.cos(nu))

    // Skip if r is negative (can happen for hyperbolic orbits)
    if (r < 0 || r > 1000) continue

    // Position in orbital plane
    const xOrb = r * Math.cos(nu)
    const yOrb = r * Math.sin(nu)

    // Convert angles to radians
    const iRad = elements.i * Math.PI / 180
    const omRad = elements.om * Math.PI / 180
    const wRad = elements.w * Math.PI / 180

    // Rotation matrices
    const cosOm = Math.cos(omRad)
    const sinOm = Math.sin(omRad)
    const cosI = Math.cos(iRad)
    const sinI = Math.sin(iRad)
    const cosW = Math.cos(wRad)
    const sinW = Math.sin(wRad)

    // Transform to heliocentric ecliptic
    const x = (cosOm * cosW - sinOm * sinW * cosI) * xOrb +
              (-cosOm * sinW - sinOm * cosW * cosI) * yOrb
    const y = (sinOm * cosW + cosOm * sinW * cosI) * xOrb +
              (-sinOm * sinW + cosOm * cosW * cosI) * yOrb
    const z = (sinW * sinI) * xOrb + (cosW * sinI) * yOrb

    points.push({ x, y, z })
  }

  return points
}

/**
 * Get perihelion distance
 */
export function getPerihelionDistance(comet: Comet): number {
  return comet.elements.a * (1 - comet.elements.e)
}

/**
 * Get aphelion distance
 */
export function getAphelionDistance(comet: Comet): number {
  return comet.elements.a * (1 + comet.elements.e)
}

/**
 * Format distance for display
 */
export function formatCometDistance(au: number): string {
  if (au < 0.1) {
    const km = au * 149597870.7
    return `${(km / 1e6).toFixed(1)} million km`
  }
  if (au < 10) {
    return `${au.toFixed(2)} AU`
  }
  return `${au.toFixed(0)} AU`
}

/**
 * Format velocity for display
 */
export function formatVelocity(kmS: number): string {
  return `${kmS.toFixed(1)} km/s`
}

/**
 * Check if comet is currently visible (close to Sun)
 */
export function isVisible(comet: Comet, date: Date): boolean {
  const pos = getCometPosition(comet, date)
  return pos.distance < 5  // Within 5 AU is potentially visible
}

/**
 * Get all comets sorted by current distance from Sun
 */
export function getCometsByDistance(date: Date): Array<{ comet: Comet; position: CometPosition }> {
  return COMETS
    .map(comet => ({
      comet,
      position: getCometPosition(comet, date),
    }))
    .sort((a, b) => a.position.distance - b.position.distance)
}
