import { NextResponse } from 'next/server'

interface Detector {
  name: string
  location: string
  status: 'observing' | 'commissioning' | 'offline' | 'maintenance'
  armLength: string
}

interface Event {
  id: string
  date: string
  type: 'BBH' | 'BNS' | 'NSBH' | 'MassGap' | 'Burst'
  distance: string
  significance: string
  masses?: string
}

const DETECTORS: Detector[] = [
  { name: 'LIGO Hanford', location: 'Washington, USA', status: 'observing', armLength: '4 km' },
  { name: 'LIGO Livingston', location: 'Louisiana, USA', status: 'observing', armLength: '4 km' },
  { name: 'Virgo', location: 'Italy', status: 'observing', armLength: '3 km' },
  { name: 'KAGRA', location: 'Japan', status: 'commissioning', armLength: '3 km' },
]

// Simulated recent events based on O4 run patterns
const RECENT_EVENTS: Event[] = [
  { id: 'GW231215', date: '2023-12-15', type: 'BBH', distance: '1.2 Gly', significance: '>5σ', masses: '35 + 28 M☉' },
  { id: 'GW231201', date: '2023-12-01', type: 'BNS', distance: '140 Mpc', significance: '>5σ', masses: '1.4 + 1.3 M☉' },
  { id: 'GW231118', date: '2023-11-18', type: 'BBH', distance: '850 Mpc', significance: '>5σ', masses: '22 + 19 M☉' },
  { id: 'GW231105', date: '2023-11-05', type: 'NSBH', distance: '200 Mpc', significance: '>5σ', masses: '8 + 1.5 M☉' },
]

export async function GET() {
  try {
    // In production, fetch from GraceDB: https://gracedb.ligo.org/api/

    const data = {
      detectors: DETECTORS,
      recentEvents: RECENT_EVENTS,
      observingRun: 'O4',
      totalDetections: 90 + Math.floor(Math.random() * 10),
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Failed to fetch gravitational wave data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
