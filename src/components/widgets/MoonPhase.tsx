'use client'

import { useState, useEffect, useMemo } from 'react'
import SunCalc from 'suncalc'
import { format, addDays } from 'date-fns'

// ===========================================
// MOON PHASE WIDGET
// ===========================================
// Real-time moon phase using SunCalc library
// No API needed - pure calculation
// ===========================================

interface MoonData {
  phase: number
  illumination: number
  phaseName: string
  moonAge: number
}

interface MoonTimes {
  rise: Date | null
  set: Date | null
}

// Get phase name from phase value (0-1)
function getPhaseName(phase: number): string {
  if (phase < 0.025 || phase >= 0.975) return 'New Moon'
  if (phase < 0.225) return 'Waxing Crescent'
  if (phase < 0.275) return 'First Quarter'
  if (phase < 0.475) return 'Waxing Gibbous'
  if (phase < 0.525) return 'Full Moon'
  if (phase < 0.725) return 'Waning Gibbous'
  if (phase < 0.775) return 'Last Quarter'
  return 'Waning Crescent'
}

// Find next occurrence of a specific phase (starting from tomorrow)
function findNextPhase(startDate: Date, targetPhase: number): Date {
  let date = addDays(startDate, 1)
  const maxDays = 35 // More than one lunar cycle

  for (let i = 0; i < maxDays; i++) {
    const illumination = SunCalc.getMoonIllumination(date)
    const phase = illumination.phase

    let isMatch = false

    if (targetPhase === 0) {
      // New moon: phase near 0 or near 1 (wraparound)
      isMatch = phase < 0.03 || phase > 0.97
    } else {
      // Full moon (0.5) or other phases: simple proximity check
      isMatch = Math.abs(phase - targetPhase) < 0.03
    }

    if (isMatch) {
      return date
    }
    date = addDays(date, 1)
  }
  return date
}

// Calculate moon data for a given date
function getMoonData(date: Date): MoonData {
  const illumination = SunCalc.getMoonIllumination(date)
  const moonAge = illumination.phase * 29.53

  return {
    phase: illumination.phase,
    illumination: illumination.fraction,
    phaseName: getPhaseName(illumination.phase),
    moonAge,
  }
}

// Get moonrise/moonset times for location
function getMoonTimes(date: Date, lat: number, lon: number): MoonTimes {
  const times = SunCalc.getMoonTimes(date, lat, lon)
  return {
    rise: times.rise || null,
    set: times.set || null,
  }
}

// ===========================================
// MOON VISUAL (SVG)
// ===========================================

interface MoonVisualProps {
  phase: number
  illumination: number
  size?: number
}

function MoonVisual({ phase, illumination, size = 180 }: MoonVisualProps) {
  const radius = size / 2 - 4
  const cx = size / 2
  const cy = size / 2

  // Create the illuminated portion path
  const illuminatedPath = useMemo(() => {
    if (illumination < 0.01) return ''
    
    if (illumination > 0.99) {
      return `M ${cx - radius} ${cy} 
              A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy}
              A ${radius} ${radius} 0 1 1 ${cx - radius} ${cy}`
    }

    const sweepWidth = Math.abs(Math.cos(phase * 2 * Math.PI)) * radius

    if (phase <= 0.5) {
      // Waxing: illuminated on the right
      return `M ${cx} ${cy - radius}
              A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius}
              A ${sweepWidth} ${radius} 0 0 ${phase < 0.25 ? 1 : 0} ${cx} ${cy - radius}`
    } else {
      // Waning: illuminated on the left
      return `M ${cx} ${cy - radius}
              A ${radius} ${radius} 0 0 0 ${cx} ${cy + radius}
              A ${sweepWidth} ${radius} 0 0 ${phase > 0.75 ? 0 : 1} ${cx} ${cy - radius}`
    }
  }, [phase, illumination, cx, cy, radius])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto"
    >
      {/* Dark moon base */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="#1a1a1a"
        stroke="#333"
        strokeWidth="1"
      />

      {/* Illuminated portion */}
      {illumination > 0.01 && (
        <path
          d={illuminatedPath}
          fill="#f5f5f0"
        />
      )}

      {/* Subtle outer glow */}
      <circle
        cx={cx}
        cy={cy}
        r={radius + 2}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
    </svg>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function MoonPhase() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Request location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        () => {
          // Silently fail - location is optional
        }
      )
    }
  }, [])

  // Calculate moon data for today
  const today = new Date()
  const moonData = useMemo(() => getMoonData(today), [])

  const moonTimes = useMemo(() => {
    if (!userLocation) return null
    return getMoonTimes(today, userLocation.lat, userLocation.lon)
  }, [userLocation])

  const nextFullMoon = useMemo(() => findNextPhase(today, 0.5), [])
  const nextNewMoon = useMemo(() => findNextPhase(today, 0), [])

  return (
    <div className="p-4 space-y-4">
      {/* Moon visual */}
      <div className="py-4 bg-black rounded-lg">
        <MoonVisual
          phase={moonData.phase}
          illumination={moonData.illumination}
          size={160}
        />
      </div>

      {/* Phase name and illumination */}
      <div className="text-center">
        <div className="text-xl font-medium">{moonData.phaseName}</div>
        <div className="font-mono text-2xl font-bold mt-1">
          {(moonData.illumination * 100).toFixed(1)}%
        </div>
        <div className="text-xs text-text-muted">illuminated</div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5]" />

      {/* Details (collapsible) */}
      <div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between"
        >
          <span className="text-sm text-text-muted">More details</span>
          <svg
            className={`w-5 h-5 text-text-muted transition-transform ${showDetails ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDetails && (
          <div className="mt-4 space-y-4">
            {/* Moon age */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Moon age</span>
              <span className="font-mono text-sm">{moonData.moonAge.toFixed(1)} days</span>
            </div>

            {/* Rise/Set times */}
            {moonTimes ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-[#f5f5f5] rounded-lg">
                  <div className="text-[10px] text-text-muted uppercase tracking-wide">Moonrise</div>
                  <div className="font-mono text-sm font-medium mt-1">
                    {moonTimes.rise ? format(moonTimes.rise, 'HH:mm') : '—'}
                  </div>
                </div>
                <div className="text-center p-3 bg-[#f5f5f5] rounded-lg">
                  <div className="text-[10px] text-text-muted uppercase tracking-wide">Moonset</div>
                  <div className="font-mono text-sm font-medium mt-1">
                    {moonTimes.set ? format(moonTimes.set, 'HH:mm') : '—'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-text-muted py-2">
                Location needed for rise/set times
              </div>
            )}

            {/* Next phases */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-[#f5f5f5] rounded-lg">
                <div className="text-[10px] text-text-muted uppercase tracking-wide">Next Full Moon</div>
                <div className="font-mono text-sm font-medium mt-1">
                  {format(nextFullMoon, 'MMM d')}
                </div>
              </div>
              <div className="text-center p-3 bg-[#f5f5f5] rounded-lg">
                <div className="text-[10px] text-text-muted uppercase tracking-wide">Next New Moon</div>
                <div className="font-mono text-sm font-medium mt-1">
                  {format(nextNewMoon, 'MMM d')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}