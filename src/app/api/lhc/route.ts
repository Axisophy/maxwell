import { NextResponse } from 'next/server'

// LHC Machine Modes
const MACHINE_MODES = [
  'NO BEAM',
  'INJECTION PROBE BEAM',
  'INJECTION PHYSICS BEAM',
  'PREPARE RAMP',
  'RAMP',
  'FLAT TOP',
  'SQUEEZE',
  'ADJUST',
  'STABLE BEAMS',
  'UNSTABLE BEAMS',
  'BEAM DUMP',
] as const

type MachineMode = typeof MACHINE_MODES[number]

interface LHCData {
  machineMode: MachineMode
  beamEnergy: number
  beam1Intensity: number
  beam2Intensity: number
  luminosity: number
  fillNumber: number
  fillDuration: string
  timestamp: string
}

export async function GET() {
  try {
    // Simulate realistic LHC data
    const modes: MachineMode[] = ['STABLE BEAMS', 'STABLE BEAMS', 'STABLE BEAMS', 'RAMP', 'NO BEAM']
    const machineMode = modes[Math.floor(Math.random() * modes.length)]

    const isBeamActive = !['NO BEAM', 'BEAM DUMP'].includes(machineMode)
    const beamEnergy = isBeamActive ? 6800 : 0

    const beam1Intensity = isBeamActive ? 2300 + Math.random() * 100 : 0
    const beam2Intensity = isBeamActive ? 2300 + Math.random() * 100 : 0
    const luminosity = machineMode === 'STABLE BEAMS' ? 2.0 + Math.random() * 0.3 : 0

    const fillNumber = 9284 + Math.floor(Math.random() * 10)
    const hours = Math.floor(Math.random() * 20)
    const minutes = Math.floor(Math.random() * 60)
    const fillDuration = `${hours}h ${minutes}m`

    const data: LHCData = {
      machineMode,
      beamEnergy,
      beam1Intensity: Math.round(beam1Intensity),
      beam2Intensity: Math.round(beam2Intensity),
      luminosity: Number(luminosity.toFixed(2)),
      fillNumber,
      fillDuration,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('Failed to fetch LHC data:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch LHC data',
        machineMode: 'NO BEAM',
        beamEnergy: 0,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
