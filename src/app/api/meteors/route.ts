import { NextResponse } from 'next/server'

// ===========================================
// METEOR WATCH API
// ===========================================
// Data source: International Meteor Organization (IMO)
// https://www.imo.net/resources/calendar/
// ===========================================

interface MeteorShower {
  name: string
  code: string
  peakMonth: number
  peakDay: number
  peakZHR: number
  activeStartMonth: number
  activeStartDay: number
  activeEndMonth: number
  activeEndDay: number
  radiant: {
    constellation: string
    ra: number
    dec: number
  }
  velocity: number
  parentBody?: string
  description: string
}

// Major meteor showers - data from IMO
const METEOR_SHOWERS: MeteorShower[] = [
  {
    name: 'Quadrantids',
    code: 'QUA',
    peakMonth: 1,
    peakDay: 3,
    peakZHR: 120,
    activeStartMonth: 12,
    activeStartDay: 26,
    activeEndMonth: 1,
    activeEndDay: 16,
    radiant: { constellation: 'Boötes', ra: 230, dec: 49 },
    velocity: 41,
    parentBody: 'Asteroid 2003 EH1',
    description: 'One of the best annual showers with a sharp peak lasting only hours.',
  },
  {
    name: 'Lyrids',
    code: 'LYR',
    peakMonth: 4,
    peakDay: 22,
    peakZHR: 18,
    activeStartMonth: 4,
    activeStartDay: 14,
    activeEndMonth: 4,
    activeEndDay: 30,
    radiant: { constellation: 'Lyra', ra: 271, dec: 34 },
    velocity: 49,
    parentBody: 'Comet Thatcher',
    description: 'Ancient shower observed for 2,700 years. Occasional outbursts.',
  },
  {
    name: 'Eta Aquariids',
    code: 'ETA',
    peakMonth: 5,
    peakDay: 6,
    peakZHR: 50,
    activeStartMonth: 4,
    activeStartDay: 19,
    activeEndMonth: 5,
    activeEndDay: 28,
    radiant: { constellation: 'Aquarius', ra: 338, dec: -1 },
    velocity: 66,
    parentBody: 'Comet Halley',
    description: 'Best viewed from Southern Hemisphere. Fast meteors.',
  },
  {
    name: 'Southern Delta Aquariids',
    code: 'SDA',
    peakMonth: 7,
    peakDay: 30,
    peakZHR: 25,
    activeStartMonth: 7,
    activeStartDay: 12,
    activeEndMonth: 8,
    activeEndDay: 23,
    radiant: { constellation: 'Aquarius', ra: 340, dec: -16 },
    velocity: 41,
    description: 'Best from Southern Hemisphere. Overlaps with Perseids.',
  },
  {
    name: 'Perseids',
    code: 'PER',
    peakMonth: 8,
    peakDay: 12,
    peakZHR: 100,
    activeStartMonth: 7,
    activeStartDay: 17,
    activeEndMonth: 8,
    activeEndDay: 24,
    radiant: { constellation: 'Perseus', ra: 48, dec: 58 },
    velocity: 59,
    parentBody: 'Comet Swift-Tuttle',
    description: 'Most popular shower. Warm summer nights, reliable rates.',
  },
  {
    name: 'Orionids',
    code: 'ORI',
    peakMonth: 10,
    peakDay: 21,
    peakZHR: 20,
    activeStartMonth: 10,
    activeStartDay: 2,
    activeEndMonth: 11,
    activeEndDay: 7,
    radiant: { constellation: 'Orion', ra: 95, dec: 16 },
    velocity: 66,
    parentBody: 'Comet Halley',
    description: 'Fast meteors from famous comet. Best after midnight.',
  },
  {
    name: 'Taurids',
    code: 'TAU',
    peakMonth: 11,
    peakDay: 5,
    peakZHR: 10,
    activeStartMonth: 10,
    activeStartDay: 20,
    activeEndMonth: 11,
    activeEndDay: 30,
    radiant: { constellation: 'Taurus', ra: 52, dec: 13 },
    velocity: 27,
    parentBody: 'Comet Encke',
    description: 'Slow, bright fireballs. Two branches (N and S).',
  },
  {
    name: 'Leonids',
    code: 'LEO',
    peakMonth: 11,
    peakDay: 17,
    peakZHR: 15,
    activeStartMonth: 11,
    activeStartDay: 6,
    activeEndMonth: 11,
    activeEndDay: 30,
    radiant: { constellation: 'Leo', ra: 152, dec: 22 },
    velocity: 71,
    parentBody: 'Comet Tempel-Tuttle',
    description: 'Famous for historic storms. Fast meteors.',
  },
  {
    name: 'Geminids',
    code: 'GEM',
    peakMonth: 12,
    peakDay: 14,
    peakZHR: 150,
    activeStartMonth: 12,
    activeStartDay: 4,
    activeEndMonth: 12,
    activeEndDay: 20,
    radiant: { constellation: 'Gemini', ra: 112, dec: 33 },
    velocity: 35,
    parentBody: 'Asteroid 3200 Phaethon',
    description: 'Best annual shower. Slow, bright, multi-colored meteors.',
  },
  {
    name: 'Ursids',
    code: 'URS',
    peakMonth: 12,
    peakDay: 22,
    peakZHR: 10,
    activeStartMonth: 12,
    activeStartDay: 17,
    activeEndMonth: 12,
    activeEndDay: 26,
    radiant: { constellation: 'Ursa Minor', ra: 217, dec: 76 },
    velocity: 33,
    parentBody: 'Comet Tuttle',
    description: 'Solstice shower. Best from Northern Hemisphere.',
  },
]

// Calculate moon phase (0 = new, 0.5 = full)
function calculateMoonPhase(date: Date): number {
  const knownNewMoon = new Date('2024-01-11T11:57:00Z').getTime()
  const lunarCycle = 29.53059 * 24 * 60 * 60 * 1000
  const phase = ((date.getTime() - knownNewMoon) % lunarCycle) / lunarCycle
  return phase < 0 ? phase + 1 : phase
}

// Calculate moon illumination percentage
function getMoonIllumination(phase: number): number {
  return Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100)
}

// Get viewing conditions based on moon
function getViewingCondition(illumination: number): string {
  if (illumination < 25) return 'Excellent'
  if (illumination < 50) return 'Good'
  if (illumination < 75) return 'Fair'
  return 'Poor'
}

// Check if a date is within a shower's active period
function isActiveShower(shower: MeteorShower, date: Date): boolean {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  // Handle year-spanning showers (like Quadrantids)
  if (shower.activeStartMonth > shower.activeEndMonth) {
    // Active period spans year boundary
    if (month === shower.activeStartMonth && day >= shower.activeStartDay) return true
    if (month > shower.activeStartMonth) return true
    if (month < shower.activeEndMonth) return true
    if (month === shower.activeEndMonth && day <= shower.activeEndDay) return true
    return false
  }

  // Normal case
  if (month < shower.activeStartMonth) return false
  if (month > shower.activeEndMonth) return false
  if (month === shower.activeStartMonth && day < shower.activeStartDay) return false
  if (month === shower.activeEndMonth && day > shower.activeEndDay) return false
  return true
}

// Get shower dates for current/next year
function getShowerDates(shower: MeteorShower, referenceDate: Date) {
  const year = referenceDate.getFullYear()

  // Handle year-spanning showers
  let startYear = year
  let endYear = year
  let peakYear = year

  if (shower.activeStartMonth > shower.activeEndMonth) {
    // Shower spans year boundary
    if (referenceDate.getMonth() + 1 >= shower.activeStartMonth) {
      endYear = year + 1
    } else {
      startYear = year - 1
    }
  }

  return {
    start: new Date(startYear, shower.activeStartMonth - 1, shower.activeStartDay),
    end: new Date(endYear, shower.activeEndMonth - 1, shower.activeEndDay),
    peak: new Date(peakYear, shower.peakMonth - 1, shower.peakDay),
  }
}

export async function GET() {
  const now = new Date()
  const moonPhase = calculateMoonPhase(now)
  const moonIllumination = getMoonIllumination(moonPhase)

  // Find currently active shower(s)
  const activeShowers = METEOR_SHOWERS.filter(shower => isActiveShower(shower, now))

  // Get the primary active shower (highest ZHR)
  const currentShower = activeShowers.length > 0
    ? activeShowers.reduce((a, b) => a.peakZHR > b.peakZHR ? a : b)
    : null

  // Get upcoming showers (next 6 months)
  const upcomingShowers = METEOR_SHOWERS
    .map(shower => {
      const dates = getShowerDates(shower, now)
      // If peak is in the past, get next year's dates
      if (dates.peak < now) {
        dates.peak.setFullYear(dates.peak.getFullYear() + 1)
        dates.start.setFullYear(dates.start.getFullYear() + 1)
        dates.end.setFullYear(dates.end.getFullYear() + 1)
      }
      return {
        ...shower,
        peakDate: dates.peak.toISOString(),
        active: {
          start: dates.start.toISOString(),
          end: dates.end.toISOString(),
        },
      }
    })
    .filter(shower => new Date(shower.peakDate) > now)
    .sort((a, b) => new Date(a.peakDate).getTime() - new Date(b.peakDate).getTime())
    .slice(0, 5)

  // Format current shower if exists
  let formattedCurrentShower = null
  if (currentShower) {
    const dates = getShowerDates(currentShower, now)
    formattedCurrentShower = {
      ...currentShower,
      peakDate: dates.peak.toISOString(),
      active: {
        start: dates.start.toISOString(),
        end: dates.end.toISOString(),
      },
    }
  }

  // Estimate current rate (simplified)
  let currentRate = 6 // Sporadic background rate
  if (currentShower) {
    const dates = getShowerDates(currentShower, now)
    const daysFromPeak = Math.abs((now.getTime() - dates.peak.getTime()) / (1000 * 60 * 60 * 24))
    // Rate drops off from peak
    currentRate = Math.max(6, Math.round(currentShower.peakZHR * Math.exp(-daysFromPeak * 0.3)))
  }

  // Best viewing time
  const bestViewing = moonIllumination > 50
    ? 'After moonset, away from lights'
    : 'After midnight, away from lights'

  return NextResponse.json({
    timestamp: now.toISOString(),
    currentShower: formattedCurrentShower,
    upcomingShowers,
    currentRate,
    moonPhase,
    moonIllumination,
    viewingCondition: getViewingCondition(moonIllumination),
    bestViewing,
  })
}

export const revalidate = 21600 // Revalidate every 6 hours
