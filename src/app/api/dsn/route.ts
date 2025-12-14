// app/api/dsn/route.ts
import { NextResponse } from 'next/server'

// Cache for 30 seconds
export const revalidate = 30

// Spacecraft name mapping (DSN uses codes)
const SPACECRAFT_NAMES: Record<string, string> = {
  // Active missions
  'VGR1': 'Voyager 1',
  'VGR2': 'Voyager 2',
  'JWST': 'James Webb',
  'MRO': 'Mars Recon',
  'MVN': 'MAVEN',
  'ODY': 'Mars Odyssey',
  'MSL': 'Curiosity',
  'M20': 'Perseverance',
  'NHPC': 'New Horizons',
  'JNO': 'Juno',
  'SOHO': 'SOHO',
  'ACE': 'ACE',
  'SDO': 'SDO',
  'STEREO-A': 'STEREO-A',
  'STA': 'STEREO-A',
  'PSP': 'Parker Solar',
  'LUCY': 'Lucy',
  'EURO': 'Europa Clipper',
  'CAPS': 'Capstone',
  'DART': 'DART',
  'DSCO': 'DSCOVR',
  'CHDR': 'Chandrayaan',
  'KPLO': 'KPLO',
  'EMM': 'Hope Mars',
  'LRO': 'Lunar Recon',
  'TESS': 'TESS',
  'GAIA': 'Gaia',
  'OSIRIS-APEX': 'OSIRIS-APEX',
  'OSAP': 'OSIRIS-APEX',
  'TEST': 'Test Signal',
}

// Station locations
const STATIONS: Record<string, { name: string; location: string; timezone: string }> = {
  'gdscc': { name: 'Goldstone', location: 'California, USA', timezone: 'America/Los_Angeles' },
  'mdscc': { name: 'Madrid', location: 'Spain', timezone: 'Europe/Madrid' },
  'cdscc': { name: 'Canberra', location: 'Australia', timezone: 'Australia/Sydney' },
}

interface DishData {
  name: string
  azimuthAngle: number
  elevationAngle: number
  windSpeed: number
  isActive: boolean
  targets: {
    name: string
    spacecraft: string
    upSignal?: {
      power: number
      frequency: number
    }
    downSignal?: {
      power: number
      frequency: number
      dataRate: number
    }
  }[]
}

interface StationData {
  id: string
  name: string
  location: string
  dishes: DishData[]
}

interface DSNResponse {
  timestamp: string
  stations: StationData[]
  activeSpacecraft: string[]
  totalDishes: number
  activeDishes: number
}

export async function GET() {
  try {
    // Fetch from NASA DSN Now
    const response = await fetch('https://eyes.nasa.gov/dsn/data/dsn.xml', {
      next: { revalidate: 30 },
      headers: {
        'Accept': 'application/xml',
      }
    })

    if (!response.ok) {
      throw new Error(`DSN API returned ${response.status}`)
    }

    const xmlText = await response.text()
    
    // Parse XML (simple parsing since we know the structure)
    const data = parseXML(xmlText)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('DSN fetch error:', error)
    
    // Return fallback data structure
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      stations: [],
      activeSpacecraft: [],
      totalDishes: 0,
      activeDishes: 0,
      error: 'Unable to fetch DSN data'
    }, { status: 500 })
  }
}

function parseXML(xml: string): DSNResponse {
  const stations: StationData[] = []
  const activeSpacecraft = new Set<string>()
  let totalDishes = 0
  let activeDishes = 0

  // Extract timestamp
  const timestampMatch = xml.match(/timestamp="(\d+)"/)
  const timestamp = timestampMatch 
    ? new Date(parseInt(timestampMatch[1])).toISOString()
    : new Date().toISOString()

  // Parse each station
  for (const [stationId, stationInfo] of Object.entries(STATIONS)) {
    const dishes: DishData[] = []
    
    // Find all dish elements for this station
    // DSN uses dish names like DSS-14, DSS-24, etc.
    const dishRegex = /<dish[^>]*name="(DSS-\d+)"[^>]*>([\s\S]*?)<\/dish>/gi
    let dishMatch
    
    while ((dishMatch = dishRegex.exec(xml)) !== null) {
      const dishName = dishMatch[1]
      const dishContent = dishMatch[2]
      
      // Determine which station this dish belongs to based on dish number
      const dishNum = parseInt(dishName.replace('DSS-', ''))
      let belongsToStation = ''
      
      if (dishNum >= 10 && dishNum < 30) belongsToStation = 'gdscc' // Goldstone: 11-26
      else if (dishNum >= 50 && dishNum < 70) belongsToStation = 'mdscc' // Madrid: 53-65
      else if (dishNum >= 30 && dishNum < 50) belongsToStation = 'cdscc' // Canberra: 33-46
      
      if (belongsToStation !== stationId) continue
      
      totalDishes++
      
      // Parse dish attributes
      const azMatch = dishContent.match(/azimuthAngle="([\d.-]+)"/) || xml.match(new RegExp(`name="${dishName}"[^>]*azimuthAngle="([\\d.-]+)"`))
      const elMatch = dishContent.match(/elevationAngle="([\d.-]+)"/) || xml.match(new RegExp(`name="${dishName}"[^>]*elevationAngle="([\\d.-]+)"`))
      
      const azimuth = azMatch ? parseFloat(azMatch[1]) : 0
      const elevation = elMatch ? parseFloat(elMatch[1]) : 0
      
      // Find targets (spacecraft) for this dish
      const targets: DishData['targets'] = []
      const targetRegex = /<target[^>]*name="([^"]+)"[^>]*spacecraft="([^"]+)"[^>]*>/gi
      let targetMatch
      
      // Search in dish content for targets
      const fullDishBlock = xml.match(new RegExp(`<dish[^>]*name="${dishName}"[^>]*>[\\s\\S]*?<\\/dish>`, 'i'))
      const searchContent = fullDishBlock ? fullDishBlock[0] : dishContent
      
      while ((targetMatch = targetRegex.exec(searchContent)) !== null) {
        const targetName = targetMatch[1]
        const spacecraftCode = targetMatch[2]
        
        // Get friendly spacecraft name
        const friendlyName = SPACECRAFT_NAMES[spacecraftCode] || spacecraftCode
        
        targets.push({
          name: targetName,
          spacecraft: friendlyName,
        })
        
        activeSpacecraft.add(friendlyName)
      }
      
      // Check for up/down signals
      const upSignalMatch = searchContent.match(/<upSignal[^>]*power="([\d.-]+)"[^>]*frequency="([\d.-]+)"/)
      const downSignalMatch = searchContent.match(/<downSignal[^>]*power="([\d.-]+)"[^>]*frequency="([\d.-]+)"[^>]*dataRate="([\d.-]+)"/)
      
      const isActive = targets.length > 0 || elevation > 10
      if (isActive) activeDishes++
      
      dishes.push({
        name: dishName,
        azimuthAngle: azimuth,
        elevationAngle: elevation,
        windSpeed: 0,
        isActive,
        targets,
      })
    }
    
    if (dishes.length > 0) {
      stations.push({
        id: stationId,
        name: stationInfo.name,
        location: stationInfo.location,
        dishes: dishes.sort((a, b) => a.name.localeCompare(b.name)),
      })
    }
  }

  return {
    timestamp,
    stations,
    activeSpacecraft: Array.from(activeSpacecraft),
    totalDishes,
    activeDishes,
  }
}
