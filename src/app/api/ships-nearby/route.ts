import { NextRequest, NextResponse } from 'next/server'

// ===========================================
// SHIPS NEARBY API
// ===========================================
// Data source options:
// - AISHub (free with data contribution)
// - MarineTraffic API (paid)
// - VesselFinder API (paid)
// Currently uses mock data - upgrade for production
// ===========================================

type ShipType = 'cargo' | 'tanker' | 'passenger' | 'fishing' | 'tug' | 'sailing' | 'military' | 'other'

interface Ship {
  mmsi: string
  name: string
  type: ShipType
  flag: string
  latitude: number
  longitude: number
  course: number
  speed: number
  destination?: string
  eta?: string
  length?: number
  distanceNm: number
}

interface ShipData {
  timestamp: string
  location: { lat: number; lon: number }
  radius: number
  count: number
  ships: Ship[]
  nearest: Ship | null
  stats: {
    cargoCount: number
    tankerCount: number
    passengerCount: number
    otherCount: number
  }
}

// Calculate distance between two points in nautical miles
function calculateDistanceNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3440.065 // Earth radius in nautical miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Ship name generators
const CARGO_NAMES = [
  'Ever Given', 'Maersk Alabama', 'MSC Oscar', 'CSCL Globe', 'Emma Maersk',
  'CMA CGM Marco Polo', 'Cosco Shipping Universe', 'ONE Apus', 'HMM Algeciras',
  'MSC Gülsün', 'Evergreen Ever Ace', 'Yang Ming Warranty'
]

const TANKER_NAMES = [
  'Seawise Giant', 'TI Europe', 'Batillus', 'Esso Atlantic', 'Nordic Spirit',
  'Eagle Vancouver', 'Crude Confidence', 'Nordic Zenith', 'Front Alta'
]

const PASSENGER_NAMES = [
  'Queen Mary 2', 'Symphony of the Seas', 'Spirit of Britain', 'Pride of Kent',
  'Norwegian Bliss', 'Carnival Vista', 'MSC Seaside', 'Costa Smeralda'
]

const FLAGS = [
  { code: 'PA', name: 'Panama' },
  { code: 'LR', name: 'Liberia' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'SG', name: 'Singapore' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'MT', name: 'Malta' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'NO', name: 'Norway' },
]

const DESTINATIONS = [
  'Rotterdam', 'Singapore', 'Shanghai', 'Antwerp', 'Hamburg',
  'Los Angeles', 'Dubai', 'Felixstowe', 'Valencia', 'Busan'
]

function generateMockShips(lat: number, lon: number, radius: number): Ship[] {
  const ships: Ship[] = []
  const numShips = Math.floor(Math.random() * 20) + 10

  for (let i = 0; i < numShips; i++) {
    // Random position within radius
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.random() * radius
    const shipLat = lat + (distance / 60) * Math.cos(angle)
    const shipLon = lon + (distance / 60) * Math.sin(angle) / Math.cos(lat * Math.PI / 180)

    // Determine ship type
    const typeRoll = Math.random()
    let type: ShipType
    let name: string

    if (typeRoll < 0.5) {
      type = 'cargo'
      name = CARGO_NAMES[Math.floor(Math.random() * CARGO_NAMES.length)]
    } else if (typeRoll < 0.7) {
      type = 'tanker'
      name = TANKER_NAMES[Math.floor(Math.random() * TANKER_NAMES.length)]
    } else if (typeRoll < 0.8) {
      type = 'passenger'
      name = PASSENGER_NAMES[Math.floor(Math.random() * PASSENGER_NAMES.length)]
    } else if (typeRoll < 0.85) {
      type = 'fishing'
      name = `FV ${['Atlantic', 'Pacific', 'Northern', 'Seafarer'][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 100)}`
    } else if (typeRoll < 0.9) {
      type = 'tug'
      name = `${['Svitzer', 'Smit', 'Kotug'][Math.floor(Math.random() * 3)]} ${['Doris', 'Sarah', 'Bentley', 'Lion'][Math.floor(Math.random() * 4)]}`
    } else if (typeRoll < 0.95) {
      type = 'sailing'
      name = `SV ${['Artemis', 'Endeavour', 'Spirit', 'Wanderer'][Math.floor(Math.random() * 4)]}`
    } else {
      type = 'other'
      name = `Vessel ${Math.floor(Math.random() * 1000)}`
    }

    // Avoid duplicate names
    if (ships.some(s => s.name === name)) {
      name = `${name} II`
    }

    const flag = FLAGS[Math.floor(Math.random() * FLAGS.length)]
    const distanceNm = calculateDistanceNm(lat, lon, shipLat, shipLon)

    ships.push({
      mmsi: `${Math.floor(Math.random() * 900000000) + 100000000}`,
      name,
      type,
      flag: flag.name,
      latitude: shipLat,
      longitude: shipLon,
      course: Math.floor(Math.random() * 360),
      speed: type === 'cargo' || type === 'tanker' ? Math.random() * 15 + 5 :
             type === 'passenger' ? Math.random() * 20 + 10 :
             Math.random() * 10 + 2,
      destination: type === 'cargo' || type === 'tanker' || type === 'passenger'
        ? DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)]
        : undefined,
      length: type === 'cargo' ? Math.floor(Math.random() * 200) + 200 :
              type === 'tanker' ? Math.floor(Math.random() * 250) + 150 :
              type === 'passenger' ? Math.floor(Math.random() * 200) + 150 :
              undefined,
      distanceNm,
    })
  }

  return ships.sort((a, b) => a.distanceNm - b.distanceNm)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '50.8')
  const lon = parseFloat(searchParams.get('lon') || '-1.1')
  const radius = parseInt(searchParams.get('radius') || '100', 10)

  try {
    // TODO: Integrate with real AIS data source
    // Options: AISHub, MarineTraffic API, VesselFinder API
    // For now, generate realistic mock data

    const ships = generateMockShips(lat, lon, radius)

    const cargoCount = ships.filter(s => s.type === 'cargo').length
    const tankerCount = ships.filter(s => s.type === 'tanker').length
    const passengerCount = ships.filter(s => s.type === 'passenger').length
    const otherCount = ships.length - cargoCount - tankerCount - passengerCount

    const result: ShipData = {
      timestamp: new Date().toISOString(),
      location: { lat, lon },
      radius,
      count: ships.length,
      ships,
      nearest: ships[0] || null,
      stats: {
        cargoCount,
        tankerCount,
        passengerCount,
        otherCount,
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in ships API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ship data' },
      { status: 500 }
    )
  }
}

export const revalidate = 60 // Revalidate every minute
