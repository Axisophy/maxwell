/**
 * MXWLL Orbital Engine - Constants
 *
 * Scale: 1 unit = 1000 km
 * This keeps values in a reasonable range for 32-bit floats
 */

// Scale factor: divide real km values by this to get scene units
export const SCALE = 1000 // 1 unit = 1000 km

// Celestial body radii in km (divide by SCALE for scene units)
export const RADII = {
  sun: 695700,      // ~696 units
  earth: 6371,      // ~6.4 units
  moon: 1737,       // ~1.7 units
} as const

// Orbital distances in km
export const DISTANCES = {
  earthFromSun: 149597870.7,  // 1 AU = ~149,598 units
  moonFromEarth: 384400,       // ~384 units
} as const

// Get radius in scene units
export function getRadius(body: keyof typeof RADII): number {
  return RADII[body] / SCALE
}

// Get distance in scene units
export function getDistance(key: keyof typeof DISTANCES): number {
  return DISTANCES[key] / SCALE
}

// Astronomical Unit in scene units
export const AU = DISTANCES.earthFromSun / SCALE

// Time speed multipliers
export const TIME_SPEEDS = [
  { label: '1x', value: 1 },
  { label: '10x', value: 10 },
  { label: '100x', value: 100 },
  { label: '1000x', value: 1000 },
  { label: '1 day/s', value: 86400 },
  { label: '1 week/s', value: 604800 },
  { label: '1 month/s', value: 2592000 },
] as const

// Colours for celestial bodies
export const BODY_COLORS = {
  sun: 0xffff00,
  earth: 0x4a90d9,
  moon: 0x888888,
  orbit: 0x444444,
} as const

// Display scale multipliers for visibility at solar system scale
export const DISPLAY_SCALES = {
  sun: 20,        // Sun display radius (real would be ~696 units)
  planet: 10,     // Multiplier for planet/moon radii
} as const

// Camera configuration
export const CAMERA = {
  fov: 45,
  near: 0.1,
  far: 1000000,
  initialPosition: [300000, 100000, 300000] as const,
  focusDistances: {
    sun: 500,
    earth: 200,
    moon: 50,
  },
  transitionDuration: 1000,  // ms for focus transitions
} as const

// OrbitControls configuration
export const CONTROLS = {
  dampingFactor: 0.05,
  zoomSpeed: 1.5,
  minDistance: 1,
  maxDistance: 1000000,
} as const

// Animation speeds
export const ANIMATION = {
  earthRotation: 0.001,  // radians per frame
} as const

// Starfield configuration
export const STARS = {
  radius: 300000,
  depth: 100000,
  count: 5000,
  factor: 100,
} as const

// Orbit path rendering
export const ORBIT_PATH = {
  segments: 128,
  lineWidth: 1,
  opacity: 0.5,
} as const

// Lighting
export const LIGHTING = {
  ambientIntensity: 0.1,
  sunIntensity: 2,
} as const
