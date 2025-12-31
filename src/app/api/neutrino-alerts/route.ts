import { NextResponse } from 'next/server'

interface NeutrinoAlert {
  id: string
  time: string
  energy: string
  type: 'track' | 'cascade'
  ra: number
  dec: number
  error: string
  followUp: string
}

// Simulated IceCube alerts based on typical high-energy events
const RECENT_ALERTS: NeutrinoAlert[] = [
  {
    id: 'IC231220A',
    time: '2023-12-20T14:32:00Z',
    energy: '~200 TeV',
    type: 'track',
    ra: 125.4,
    dec: 12.3,
    error: '0.5°',
    followUp: 'Follow-up observations ongoing',
  },
  {
    id: 'IC231218A',
    time: '2023-12-18T03:15:00Z',
    energy: '~85 TeV',
    type: 'cascade',
    ra: 234.1,
    dec: -45.2,
    error: '8°',
    followUp: 'No optical counterpart identified',
  },
  {
    id: 'IC231215B',
    time: '2023-12-15T22:45:00Z',
    energy: '~500 TeV',
    type: 'track',
    ra: 56.8,
    dec: 67.1,
    error: '0.3°',
    followUp: 'Possible AGN association',
  },
]

const DETECTORS = [
  {
    name: 'IceCube',
    location: 'South Pole, Antarctica',
    volume: '1 km³',
    sensors: 5160,
    depth: '1,450 - 2,450 m',
    status: 'operating',
  },
  {
    name: 'Super-Kamiokande',
    location: 'Gifu, Japan',
    volume: '50,000 tons H₂O',
    sensors: 11146,
    depth: '1,000 m underground',
    status: 'operating',
  },
  {
    name: 'KM3NeT',
    location: 'Mediterranean Sea',
    volume: '~1 km³ (planned)',
    sensors: 6000,
    depth: '2,500 - 3,500 m',
    status: 'under construction',
  },
]

export async function GET() {
  try {
    // In production, fetch from GCN: https://gcn.nasa.gov/missions/icecube

    const data = {
      alerts: RECENT_ALERTS,
      detectors: DETECTORS,
      alertsToday: Math.floor(Math.random() * 3),
      alertsThisWeek: RECENT_ALERTS.length + Math.floor(Math.random() * 5),
      supernovaWatch: 'No alerts',
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('Failed to fetch neutrino data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
