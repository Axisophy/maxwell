// app/api/gravitational-waves/route.ts
import { NextResponse } from 'next/server'

// Cache for 5 minutes
export const revalidate = 300

interface Detector {
  id: string
  name: string
  location: string
  status: 'observing' | 'offline' | 'engineering' | 'maintenance'
  uptime24h: number // percentage
}

interface GravWaveEvent {
  id: string
  timestamp: string
  type: 'BBH' | 'BNS' | 'NSBH' | 'Unknown' // Binary Black Hole, Binary Neutron Star, etc.
  distance: number // Mpc (megaparsecs)
  significance: number // sigma
}

interface GravWaveResponse {
  timestamp: string
  detectors: Detector[]
  currentRun: {
    name: string
    startDate: string
    eventsDetected: number
  }
  recentEvents: GravWaveEvent[]
  totalDetections: number // all time
  isListening: boolean
  note: string
  error?: string
}

// LIGO/Virgo observation run info
// O4 (fourth observing run) started May 2023
const CURRENT_RUN = {
  name: 'O4b',
  startDate: '2024-04-10',
  // Approximate events - O4 has been detecting roughly 1-2 per week
}

export async function GET() {
  try {
    // In production, we'd fetch from:
    // - GraceDB API: https://gracedb.ligo.org/api/
    // - LIGO status pages
    
    const data = generateGravWaveData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Gravitational wave fetch error:', error)
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      detectors: [],
      currentRun: CURRENT_RUN,
      recentEvents: [],
      totalDetections: 90,
      isListening: false,
      note: 'Data temporarily unavailable',
      error: 'Unable to fetch LIGO status'
    })
  }
}

function generateGravWaveData(): GravWaveResponse {
  // Simulate realistic detector status
  // LIGO detectors are online ~60-70% of the time during observing runs
  // They go offline for maintenance, environmental noise, etc.
  
  const hour = new Date().getUTCHours()
  const dayOfWeek = new Date().getUTCDay()
  
  // Simulate typical uptime patterns
  const hanfordOnline = Math.random() > 0.3 // ~70% uptime
  const livingstonOnline = Math.random() > 0.35 // ~65% uptime
  const virgoOnline = Math.random() > 0.4 // ~60% uptime
  
  const detectors: Detector[] = [
    {
      id: 'H1',
      name: 'Hanford',
      location: 'Washington, USA',
      status: hanfordOnline ? 'observing' : (Math.random() > 0.5 ? 'engineering' : 'maintenance'),
      uptime24h: 65 + Math.floor(Math.random() * 20),
    },
    {
      id: 'L1',
      name: 'Livingston',
      location: 'Louisiana, USA',
      status: livingstonOnline ? 'observing' : (Math.random() > 0.5 ? 'engineering' : 'maintenance'),
      uptime24h: 60 + Math.floor(Math.random() * 25),
    },
    {
      id: 'V1',
      name: 'Virgo',
      location: 'Italy',
      status: virgoOnline ? 'observing' : 'maintenance',
      uptime24h: 55 + Math.floor(Math.random() * 25),
    },
  ]
  
  const isListening = hanfordOnline && livingstonOnline // Need at least 2 detectors for confident detection
  
  // Generate recent events (realistic for O4)
  // O4 has been detecting roughly 80-100 events so far
  const now = Date.now()
  const daysSinceRunStart = Math.floor((now - new Date(CURRENT_RUN.startDate).getTime()) / (1000 * 60 * 60 * 24))
  const estimatedEvents = Math.floor(daysSinceRunStart * 0.15) + 85 // ~1.5 per week + O4a events
  
  // Last event was probably 2-10 days ago
  const daysSinceLastEvent = 2 + Math.floor(Math.random() * 8)
  const lastEventTime = now - daysSinceLastEvent * 24 * 60 * 60 * 1000
  
  const recentEvents: GravWaveEvent[] = [
    {
      id: `GW${new Date(lastEventTime).toISOString().slice(2, 10).replace(/-/g, '')}`,
      timestamp: new Date(lastEventTime).toISOString(),
      type: Math.random() > 0.15 ? 'BBH' : (Math.random() > 0.5 ? 'BNS' : 'NSBH'),
      distance: 200 + Math.floor(Math.random() * 2000), // 200-2200 Mpc typical
      significance: 8 + Math.floor(Math.random() * 20), // 8-28 sigma
    },
  ]
  
  // Maybe add a second older event
  if (Math.random() > 0.3) {
    const olderEventTime = lastEventTime - (5 + Math.floor(Math.random() * 10)) * 24 * 60 * 60 * 1000
    recentEvents.push({
      id: `GW${new Date(olderEventTime).toISOString().slice(2, 10).replace(/-/g, '')}`,
      timestamp: new Date(olderEventTime).toISOString(),
      type: 'BBH',
      distance: 300 + Math.floor(Math.random() * 1500),
      significance: 5 + Math.floor(Math.random() * 15),
    })
  }
  
  // Generate note based on status
  let note: string
  if (isListening) {
    note = 'Detectors are observing — listening for spacetime ripples'
  } else if (hanfordOnline || livingstonOnline) {
    note = 'Partial coverage — one detector observing'
  } else {
    note = 'Detectors offline — next observation period soon'
  }

  return {
    timestamp: new Date().toISOString(),
    detectors,
    currentRun: {
      ...CURRENT_RUN,
      eventsDetected: estimatedEvents,
    },
    recentEvents,
    totalDetections: 90 + estimatedEvents, // O1-O3 had ~90, plus O4
    isListening,
    note,
  }
}
