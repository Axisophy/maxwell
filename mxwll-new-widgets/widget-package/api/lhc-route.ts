// app/api/lhc/route.ts
import { NextResponse } from 'next/server'

// Cache for 60 seconds
export const revalidate = 60

// LHC beam modes and their meanings
const BEAM_MODES: Record<string, { label: string; color: 'green' | 'amber' | 'grey' | 'blue' }> = {
  'STABLE BEAMS': { label: 'Colliding Now', color: 'green' },
  'ADJUST': { label: 'Preparing Beams', color: 'amber' },
  'SQUEEZE': { label: 'Focusing Beams', color: 'amber' },
  'FLAT TOP': { label: 'At Full Energy', color: 'amber' },
  'RAMP': { label: 'Accelerating', color: 'amber' },
  'INJECTION': { label: 'Injecting Protons', color: 'amber' },
  'SETUP': { label: 'Setting Up', color: 'blue' },
  'NO BEAM': { label: 'Offline', color: 'grey' },
  'BEAM DUMP': { label: 'Dumping Beam', color: 'amber' },
  'RECOVERY': { label: 'Recovering', color: 'amber' },
  'MACHINE CHECKOUT': { label: 'Testing', color: 'blue' },
  'MACHINE DEVELOPMENT': { label: 'Development', color: 'blue' },
  'TECHNICAL STOP': { label: 'Maintenance', color: 'grey' },
}

interface LHCResponse {
  timestamp: string
  beamMode: string
  beamModeLabel: string
  beamModeColor: 'green' | 'amber' | 'grey' | 'blue'
  energy: number // TeV per beam
  fillNumber: number | null
  isColliding: boolean
  experiments: string[]
  comment?: string
  error?: string
}

export async function GET() {
  try {
    // Try to fetch from CERN's Vistars page (Page 1)
    // This is a public page showing LHC status
    const response = await fetch('https://op-webtools.web.cern.ch/vistar/vistars.php?usr=LHC1', {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'MXWLL/1.0 (Science Observatory; mxwll.io)',
      }
    })

    if (!response.ok) {
      // Try alternative: LHC dashboard JSON
      return await fetchFromDashboard()
    }

    const html = await response.text()
    const data = parseLHCPage(html)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('LHC fetch error:', error)
    
    // Return a sensible fallback
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      beamMode: 'UNKNOWN',
      beamModeLabel: 'Status Unavailable',
      beamModeColor: 'grey',
      energy: 0,
      fillNumber: null,
      isColliding: false,
      experiments: [],
      error: 'Unable to fetch LHC status'
    } as LHCResponse)
  }
}

async function fetchFromDashboard(): Promise<NextResponse> {
  try {
    // Alternative source: LHC dashboard
    const response = await fetch('https://lhc-dashboard.web.cern.ch/api/status', {
      next: { revalidate: 60 },
    })
    
    if (!response.ok) {
      throw new Error('Dashboard unavailable')
    }
    
    const json = await response.json()
    
    const beamMode = json.beamMode || 'UNKNOWN'
    const modeInfo = BEAM_MODES[beamMode] || { label: beamMode, color: 'grey' as const }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      beamMode,
      beamModeLabel: modeInfo.label,
      beamModeColor: modeInfo.color,
      energy: json.energy || 0,
      fillNumber: json.fillNumber || null,
      isColliding: beamMode === 'STABLE BEAMS',
      experiments: ['ATLAS', 'CMS', 'ALICE', 'LHCb'],
    } as LHCResponse)
  } catch {
    throw new Error('All LHC sources unavailable')
  }
}

function parseLHCPage(html: string): LHCResponse {
  // Extract beam mode (usually in a cell or span)
  const beamModeMatch = html.match(/Beam\s*Mode[:\s]*<[^>]*>([^<]+)/i) 
    || html.match(/STABLE BEAMS|NO BEAM|ADJUST|SQUEEZE|RAMP|INJECTION/i)
  
  let beamMode = beamModeMatch ? beamModeMatch[1]?.trim() || beamModeMatch[0] : 'UNKNOWN'
  beamMode = beamMode.toUpperCase()
  
  // Extract energy
  const energyMatch = html.match(/(\d+\.?\d*)\s*TeV/i)
  const energy = energyMatch ? parseFloat(energyMatch[1]) : 6.8 // Default to Run 3 energy
  
  // Extract fill number
  const fillMatch = html.match(/Fill[:\s#]*(\d+)/i)
  const fillNumber = fillMatch ? parseInt(fillMatch[1]) : null
  
  // Determine mode info
  const modeInfo = BEAM_MODES[beamMode] || { label: beamMode, color: 'grey' as const }
  
  // Check if currently colliding
  const isColliding = beamMode === 'STABLE BEAMS'
  
  return {
    timestamp: new Date().toISOString(),
    beamMode,
    beamModeLabel: modeInfo.label,
    beamModeColor: modeInfo.color,
    energy,
    fillNumber,
    isColliding,
    experiments: ['ATLAS', 'CMS', 'ALICE', 'LHCb'],
  }
}
