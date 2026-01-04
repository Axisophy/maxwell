/**
 * MXWLL Orbital Engine - Voyager Mission Data
 * 
 * Trajectory data from JPL Horizons ephemeris service
 * Source: https://ssd.jpl.nasa.gov/horizons/
 * NAIF IDs: Voyager 1 = -31, Voyager 2 = -32
 * 
 * Coordinates: Heliocentric, Ecliptic J2000
 * Units: AU (Astronomical Units)
 * Sampling: Monthly from launch to 2026
 */

import { AU } from './constants'

// Import the pre-computed ephemeris data
import { VOYAGER_1_EPHEMERIS, VOYAGER_2_EPHEMERIS } from './voyager-ephemeris'
export type { EphemerisPoint } from './voyager-ephemeris'

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

// Export mission data using real JPL Horizons ephemeris
export const VOYAGER_1: VoyagerMission = {
  id: 'voyager1',
  name: 'Voyager 1',
  launchDate: '1977-09-05',
  trajectory: VOYAGER_1_EPHEMERIS,
  milestones: VOYAGER_1_MILESTONES,
  color: 0x00ff88,  // Green
}

export const VOYAGER_2: VoyagerMission = {
  id: 'voyager2', 
  name: 'Voyager 2',
  launchDate: '1977-08-20',
  trajectory: VOYAGER_2_EPHEMERIS,
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
  
  // Handle date before launch
  if (dateStr < trajectory[0].date) {
    return null
  }
  
  // Handle date after last data point
  if (dateStr > trajectory[trajectory.length - 1].date) {
    return trajectory[trajectory.length - 1]
  }
  
  // Find surrounding points for interpolation
  for (let i = 0; i < trajectory.length - 1; i++) {
    if (trajectory[i].date <= dateStr && trajectory[i + 1].date >= dateStr) {
      const p0 = trajectory[i]
      const p1 = trajectory[i + 1]
      
      // Linear interpolation
      const d0 = new Date(p0.date).getTime()
      const d1 = new Date(p1.date).getTime()
      const d = date.getTime()
      const t = (d - d0) / (d1 - d0)
      
      const x = p0.x + t * (p1.x - p0.x)
      const y = p0.y + t * (p1.y - p0.y)
      const z = p0.z + t * (p1.z - p0.z)
      
      return {
        date: dateStr,
        x,
        y,
        z,
        distance: Math.sqrt(x * x + y * y + z * z),
      }
    }
  }
  
  return null
}

/**
 * Convert AU position to scene units
 */
export function auToScene(point: TrajectoryPoint): { x: number; y: number; z: number } {
  return {
    x: point.x * AU,
    y: point.z * AU,  // Swap y/z for Three.js coordinate system (y = up)
    z: point.y * AU,
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
  // Light travels 1 AU in about 8.317 minutes
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

/**
 * Get milestone position for rendering markers
 */
export function getMilestonePosition(
  mission: VoyagerMission,
  milestone: MissionMilestone
): { x: number; y: number; z: number } | null {
  const position = getVoyagerPosition(mission, new Date(milestone.date))
  if (!position) return null
  return auToScene(position)
}
