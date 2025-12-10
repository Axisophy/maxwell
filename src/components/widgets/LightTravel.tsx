'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

// ===========================================
// LIGHT TRAVEL WIDGET
// ===========================================
// Real-time distance light has traveled since
// opening the widget, with milestone tracking
// Pure client-side calculation, no API needed
// ===========================================

// Physical constants
const SPEED_OF_LIGHT = 299_792_458 // meters per second (exact)

// Distance references in meters
const DISTANCES = {
  earthCircumference: 40_075_000,
  toMoon: 384_400_000,
  toSun: 149_597_870_700, // 1 AU
  toMars: 225_000_000_000,
  toJupiter: 778_500_000_000,
  toPluto: 5_906_380_000_000,
}

// Time for light to reach various distances (seconds)
const LIGHT_TIMES = {
  toMoon: DISTANCES.toMoon / SPEED_OF_LIGHT,
  toSun: DISTANCES.toSun / SPEED_OF_LIGHT,
  toMars: DISTANCES.toMars / SPEED_OF_LIGHT,
  toJupiter: DISTANCES.toJupiter / SPEED_OF_LIGHT,
  toPluto: DISTANCES.toPluto / SPEED_OF_LIGHT,
}

// Format large numbers with appropriate units
function formatDistance(meters: number): { value: string; unit: string } {
  if (meters < 1000) {
    return { value: meters.toFixed(0), unit: 'm' }
  }
  if (meters < 1_000_000) {
    return { value: (meters / 1000).toFixed(2), unit: 'km' }
  }
  if (meters < 1_000_000_000) {
    return { value: (meters / 1_000_000).toFixed(2), unit: 'thousand km' }
  }
  if (meters < 1_000_000_000_000) {
    return { value: (meters / 1_000_000_000).toFixed(3), unit: 'million km' }
  }
  return { value: (meters / 1_000_000_000_000).toFixed(4), unit: 'billion km' }
}

// Format time duration
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(1)}s`
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}m ${secs}s`
  }
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${mins}m`
}

// ===========================================
// MILESTONE TRACKER
// ===========================================

interface MilestoneTrackerProps {
  distanceTraveled: number
  elapsedSeconds: number
}

function MilestoneTracker({ distanceTraveled, elapsedSeconds }: MilestoneTrackerProps) {
  const milestones = [
    { name: 'Moon', distance: DISTANCES.toMoon, time: LIGHT_TIMES.toMoon },
    { name: 'Sun', distance: DISTANCES.toSun, time: LIGHT_TIMES.toSun },
    { name: 'Mars', distance: DISTANCES.toMars, time: LIGHT_TIMES.toMars },
    { name: 'Jupiter', distance: DISTANCES.toJupiter, time: LIGHT_TIMES.toJupiter },
    { name: 'Pluto', distance: DISTANCES.toPluto, time: LIGHT_TIMES.toPluto },
  ]

  return (
    <div className="space-y-2">
      {milestones.map((m) => {
        const reached = distanceTraveled >= m.distance
        const progress = Math.min(100, (distanceTraveled / m.distance) * 100)
        const timeRemaining = Math.max(0, m.time - elapsedSeconds)

        return (
          <div
            key={m.name}
            className={`flex items-center gap-3 ${reached ? 'opacity-100' : 'opacity-50'}`}
          >
            <div className="w-14 text-sm">{m.name}</div>
            <div className="flex-1">
              <div className="h-1 bg-[#e5e5e5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="w-16 text-right">
              {reached ? (
                <span className="text-xs text-green-600 font-medium">Reached</span>
              ) : (
                <span className="font-mono text-xs text-text-muted">
                  {formatDuration(timeRemaining)}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function LightTravel() {
  const startTimeRef = useRef(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [showMilestones, setShowMilestones] = useState(false)

  // Update timer at 20fps for smooth counter
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((Date.now() - startTimeRef.current) / 1000)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Calculated values
  const distanceTraveled = elapsed * SPEED_OF_LIGHT
  const formatted = formatDistance(distanceTraveled)

  const comparisons = useMemo(() => {
    return [
      {
        label: 'Earth orbits',
        value: (distanceTraveled / DISTANCES.earthCircumference).toFixed(1),
      },
      {
        label: 'Moon trips',
        value: (distanceTraveled / DISTANCES.toMoon).toFixed(2),
      },
      {
        label: 'AU',
        value: (distanceTraveled / DISTANCES.toSun).toFixed(5),
      },
    ]
  }, [distanceTraveled])

  return (
    <div className="p-4 space-y-4">
      {/* Subtitle */}
      <div className="text-center text-xs text-text-muted">
        Since you opened this widget
      </div>

      {/* Main distance display */}
      <div className="text-center py-6 bg-[#f5f5f5] rounded-lg">
        <div className="flex items-baseline justify-center gap-2">
          <span className="font-mono text-4xl font-bold tabular-nums">
            {formatted.value}
          </span>
          <span className="text-sm text-text-muted">{formatted.unit}</span>
        </div>
        <div className="text-xs text-text-muted mt-2">
          at {SPEED_OF_LIGHT.toLocaleString()} m/s
        </div>
      </div>

      {/* Time elapsed */}
      <div className="flex justify-between items-center px-3 py-2 bg-[#f5f5f5] rounded-lg">
        <span className="text-xs text-text-muted">Time elapsed</span>
        <span className="font-mono text-sm font-medium">{formatDuration(elapsed)}</span>
      </div>

      {/* Comparisons */}
      <div className="grid grid-cols-3 gap-2">
        {comparisons.map((c) => (
          <div key={c.label} className="text-center p-2 bg-[#f5f5f5] rounded-lg">
            <div className="font-mono text-sm font-semibold">{c.value}</div>
            <div className="text-[9px] text-text-muted leading-tight">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5]" />

      {/* Milestones (expandable) */}
      <div>
        <button
          onClick={() => setShowMilestones(!showMilestones)}
          className="w-full flex items-center justify-between"
        >
          <span className="text-sm text-text-muted">Journey to the planets</span>
          <svg
            className={`w-5 h-5 text-text-muted transition-transform ${showMilestones ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMilestones && (
          <div className="mt-3">
            <MilestoneTracker
              distanceTraveled={distanceTraveled}
              elapsedSeconds={elapsed}
            />
          </div>
        )}
      </div>
    </div>
  )
}