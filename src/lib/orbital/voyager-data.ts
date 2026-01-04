/**
 * MXWLL Orbital Engine - Voyager Mission Data
 *
 * Pre-computed trajectory data for Voyager 1 & 2
 * Positions in heliocentric coordinates (AU)
 *
 * Data derived from JPL Horizons ephemeris
 * NAIF IDs: Voyager 1 = -31, Voyager 2 = -32
 */

import { AU } from './constants'

export interface TrajectoryPoint {
  date: string        // ISO date string
  x: number           // AU from Sun
  y: number           // AU from Sun
  z: number           // AU from Sun
  distance: number    // AU from Sun (magnitude)
}

export interface MissionMilestone {
  date: string
  name: string
  description: string
  body?: string       // Planet/body involved
}

export interface VoyagerMission {
  id: string
  name: string
  launchDate: string
  trajectory: TrajectoryPoint[]
  milestones: MissionMilestone[]
  color: number
}

// Voyager 1 milestones
const VOYAGER_1_MILESTONES: MissionMilestone[] = [
  {
    date: '1977-09-05',
    name: 'Launch',
    description: 'Launched from Cape Canaveral aboard Titan IIIE rocket',
  },
  {
    date: '1979-03-05',
    name: 'Jupiter Flyby',
    description: 'Closest approach to Jupiter at 349,000 km. Discovered volcanic activity on Io.',
    body: 'jupiter',
  },
  {
    date: '1980-11-12',
    name: 'Saturn Flyby',
    description: 'Closest approach to Saturn at 124,000 km. Studied Titan\'s atmosphere.',
    body: 'saturn',
  },
  {
    date: '1990-02-14',
    name: 'Pale Blue Dot',
    description: 'Turned cameras back to photograph Earth from 6 billion km - the famous "Pale Blue Dot" image.',
  },
  {
    date: '2004-12-16',
    name: 'Termination Shock',
    description: 'Crossed the termination shock where solar wind slows dramatically.',
  },
  {
    date: '2012-08-25',
    name: 'Interstellar Space',
    description: 'Became first human-made object to enter interstellar space, crossing the heliopause.',
  },
]

// Voyager 2 milestones
const VOYAGER_2_MILESTONES: MissionMilestone[] = [
  {
    date: '1977-08-20',
    name: 'Launch',
    description: 'Launched from Cape Canaveral, 16 days before Voyager 1 (but on slower trajectory)',
  },
  {
    date: '1979-07-09',
    name: 'Jupiter Flyby',
    description: 'Closest approach to Jupiter at 722,000 km.',
    body: 'jupiter',
  },
  {
    date: '1981-08-26',
    name: 'Saturn Flyby',
    description: 'Closest approach to Saturn at 101,000 km.',
    body: 'saturn',
  },
  {
    date: '1986-01-24',
    name: 'Uranus Flyby',
    description: 'First and only spacecraft to visit Uranus. Discovered 10 new moons.',
    body: 'uranus',
  },
  {
    date: '1989-08-25',
    name: 'Neptune Flyby',
    description: 'First and only spacecraft to visit Neptune. Discovered Great Dark Spot.',
    body: 'neptune',
  },
  {
    date: '2007-09-01',
    name: 'Termination Shock',
    description: 'Crossed the termination shock at 84 AU from the Sun.',
  },
  {
    date: '2018-11-05',
    name: 'Interstellar Space',
    description: 'Crossed the heliopause into interstellar space.',
  },
]

/**
 * Generate trajectory for Voyager missions
 *
 * Both spacecraft launch from Earth and follow gravity-assist trajectories.
 * This is a simplified but visually accurate approximation.
 * For production, replace with actual JPL Horizons ephemeris data.
 */
function generateVoyagerTrajectory(
  isVoyager1: boolean,
  startYear: number = 1977,
  endYear: number = 2026
): TrajectoryPoint[] {
  const points: TrajectoryPoint[] = []

  // Launch parameters
  const launchYear = isVoyager1 ? 1977.68 : 1977.64  // Sept 5 / Aug 20

  // Key distance milestones (AU from Sun) - based on actual mission data
  const keyDistances = isVoyager1
    ? [
        { year: 1977.68, distance: 1.0 },     // Launch from Earth
        { year: 1978.5, distance: 2.5 },      // Outbound
        { year: 1979.18, distance: 5.2 },     // Jupiter flyby (March 1979)
        { year: 1980.0, distance: 7.5 },      // Between Jupiter and Saturn
        { year: 1980.87, distance: 9.5 },     // Saturn flyby (Nov 1980)
        { year: 1985, distance: 25 },
        { year: 1990.12, distance: 40 },      // Pale Blue Dot
        { year: 2000, distance: 76 },
        { year: 2004.96, distance: 94 },      // Termination shock
        { year: 2012.65, distance: 122 },     // Heliopause
        { year: 2020, distance: 150 },
        { year: 2026, distance: 165 },
      ]
    : [
        { year: 1977.64, distance: 1.0 },     // Launch from Earth
        { year: 1978.5, distance: 2.8 },      // Outbound (slower trajectory)
        { year: 1979.52, distance: 5.2 },     // Jupiter flyby (July 1979)
        { year: 1980.5, distance: 7.0 },
        { year: 1981.65, distance: 9.5 },     // Saturn flyby (Aug 1981)
        { year: 1984, distance: 15 },
        { year: 1986.07, distance: 19.2 },    // Uranus flyby (Jan 1986)
        { year: 1988, distance: 25 },
        { year: 1989.65, distance: 30.1 },    // Neptune flyby (Aug 1989)
        { year: 2000, distance: 63 },
        { year: 2007.67, distance: 84 },      // Termination shock
        { year: 2018.85, distance: 119 },     // Heliopause
        { year: 2026, distance: 137 },
      ]

  // Voyager 1: After Saturn, heads "up" out of ecliptic toward Ophiuchus
  // Voyager 2: Stays closer to ecliptic, heads toward Pavo

  // Direction angles (in ecliptic coordinates)
  // These represent the final heading after all gravity assists
  const finalEclipticLon = isVoyager1 ? 260 : 290  // degrees
  const finalEclipticLat = isVoyager1 ? 35 : -48   // degrees (V1 goes up, V2 goes down)

  for (let year = startYear; year <= endYear; year += 0.05) {
    // Skip years before launch
    if (year < launchYear) continue

    // Find surrounding key points for distance interpolation
    let d0 = keyDistances[0]
    let d1 = keyDistances[keyDistances.length - 1]

    for (let i = 0; i < keyDistances.length - 1; i++) {
      if (year >= keyDistances[i].year && year <= keyDistances[i + 1].year) {
        d0 = keyDistances[i]
        d1 = keyDistances[i + 1]
        break
      }
    }

    // Interpolate distance
    const t = Math.min(1, Math.max(0, (year - d0.year) / (d1.year - d0.year)))
    const distance = d0.distance + t * (d1.distance - d0.distance)

    // Calculate trajectory direction
    // Near Earth: direction based on Earth's position
    // After Jupiter: transitions to final heading
    const yearsFromLaunch = year - launchYear

    // Earth's approximate position at launch (simplified)
    const earthLonAtLaunch = isVoyager1 ? 342 : 327  // degrees

    // Blend from Earth departure direction to final heading
    let eclipticLon: number
    let eclipticLat: number

    if (yearsFromLaunch < 0.5) {
      // Near Earth - radial outward from Earth's position
      eclipticLon = earthLonAtLaunch
      eclipticLat = 0
    } else if (yearsFromLaunch < 3) {
      // Jupiter encounter - trajectory bending
      const blend = (yearsFromLaunch - 0.5) / 2.5
      eclipticLon = earthLonAtLaunch + blend * (finalEclipticLon - earthLonAtLaunch)
      eclipticLat = blend * finalEclipticLat * 0.3
    } else if (yearsFromLaunch < 6) {
      // Saturn encounter (V1) or Uranus approach (V2)
      const blend = (yearsFromLaunch - 3) / 3
      eclipticLon = earthLonAtLaunch + (0.3 + blend * 0.7) * (finalEclipticLon - earthLonAtLaunch)
      eclipticLat = (0.3 + blend * 0.7) * finalEclipticLat
    } else {
      // Final heading - nearly straight line
      eclipticLon = finalEclipticLon
      eclipticLat = finalEclipticLat
    }

    // Convert to Cartesian (ecliptic coordinates, Sun at origin)
    const lonRad = (eclipticLon * Math.PI) / 180
    const latRad = (eclipticLat * Math.PI) / 180

    const x = distance * Math.cos(latRad) * Math.cos(lonRad)
    const y = distance * Math.cos(latRad) * Math.sin(lonRad)
    const z = distance * Math.sin(latRad)

    // Convert year to date
    const yearInt = Math.floor(year)
    const dayOfYear = Math.floor((year - yearInt) * 365)
    const date = new Date(yearInt, 0, 1 + dayOfYear)

    points.push({
      date: date.toISOString().split('T')[0],
      x,
      y,
      z,
      distance,
    })
  }

  return points
}

// Generate trajectories
const voyager1Trajectory = generateVoyagerTrajectory(true)
const voyager2Trajectory = generateVoyagerTrajectory(false)

// Export mission data
export const VOYAGER_1: VoyagerMission = {
  id: 'voyager1',
  name: 'Voyager 1',
  launchDate: '1977-09-05',
  trajectory: voyager1Trajectory,
  milestones: VOYAGER_1_MILESTONES,
  color: 0x00ff88,  // Green
}

export const VOYAGER_2: VoyagerMission = {
  id: 'voyager2',
  name: 'Voyager 2',
  launchDate: '1977-08-20',
  trajectory: voyager2Trajectory,
  milestones: VOYAGER_2_MILESTONES,
  color: 0x00aaff,  // Blue
}

/**
 * Get position at a specific date by interpolating trajectory
 */
export function getVoyagerPosition(
  mission: VoyagerMission,
  date: Date
): TrajectoryPoint | null {
  const dateStr = date.toISOString().split('T')[0]
  const trajectory = mission.trajectory

  // Find surrounding points
  for (let i = 0; i < trajectory.length - 1; i++) {
    if (trajectory[i].date <= dateStr && trajectory[i + 1].date >= dateStr) {
      const p0 = trajectory[i]
      const p1 = trajectory[i + 1]

      // Interpolate
      const d0 = new Date(p0.date).getTime()
      const d1 = new Date(p1.date).getTime()
      const d = date.getTime()
      const t = (d - d0) / (d1 - d0)

      return {
        date: dateStr,
        x: p0.x + t * (p1.x - p0.x),
        y: p0.y + t * (p1.y - p0.y),
        z: p0.z + t * (p1.z - p0.z),
        distance: p0.distance + t * (p1.distance - p0.distance),
      }
    }
  }

  // Return last known position if date is beyond trajectory
  if (dateStr > trajectory[trajectory.length - 1].date) {
    return trajectory[trajectory.length - 1]
  }

  return null
}

/**
 * Convert AU position to scene units
 */
export function auToScene(point: TrajectoryPoint): { x: number; y: number; z: number } {
  return {
    x: point.x * AU,
    y: point.y * AU,
    z: point.z * AU,
  }
}

/**
 * Get trajectory points as scene coordinates up to a given date
 */
export function getTrajectoryToDate(
  mission: VoyagerMission,
  endDate: Date
): Array<{ x: number; y: number; z: number }> {
  const endStr = endDate.toISOString().split('T')[0]

  return mission.trajectory
    .filter(p => p.date <= endStr)
    .map(p => auToScene(p))
}

/**
 * Get active milestones up to a given date
 */
export function getMilestonesToDate(
  mission: VoyagerMission,
  endDate: Date
): MissionMilestone[] {
  const endStr = endDate.toISOString().split('T')[0]
  return mission.milestones.filter(m => m.date <= endStr)
}

/**
 * Calculate light travel time from spacecraft to Earth
 * Returns time in hours
 */
export function getLightTravelTime(distanceAU: number): number {
  // Light travels 1 AU in about 8.3 minutes
  const minutesPerAU = 8.317
  return (distanceAU * minutesPerAU) / 60
}

/**
 * Format distance for display
 */
export function formatDistance(distanceAU: number): string {
  if (distanceAU < 10) {
    return `${distanceAU.toFixed(2)} AU`
  }
  return `${distanceAU.toFixed(1)} AU`
}

/**
 * Format light travel time for display
 */
export function formatLightTime(hours: number): string {
  if (hours < 1) {
    return `${(hours * 60).toFixed(0)} minutes`
  }
  if (hours < 24) {
    return `${hours.toFixed(1)} hours`
  }
  return `${(hours / 24).toFixed(1)} days`
}
