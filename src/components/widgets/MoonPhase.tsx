'use client'

import { useState, useEffect, useMemo } from 'react'
import SunCalc from 'suncalc'
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'

// ===========================================
// MOON PHASE WIDGET
// ===========================================
// Real-time moon phase using SunCalc library
// No API needed - pure calculation
// Design: Dark background, Today/Week/Month views
// ===========================================

type ViewMode = 'today' | 'week' | 'month'

interface MoonData {
  date: Date
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

// Get short phase name for compact displays
function getShortPhaseName(phase: number): string {
  if (phase < 0.025 || phase >= 0.975) return 'New'
  if (phase < 0.225) return 'Wax Cr'
  if (phase < 0.275) return '1st Qtr'
  if (phase < 0.475) return 'Wax Gib'
  if (phase < 0.525) return 'Full'
  if (phase < 0.725) return 'Wan Gib'
  if (phase < 0.775) return '3rd Qtr'
  return 'Wan Cr'
}

// Find next occurrence of a specific phase
function findNextPhase(startDate: Date, targetPhase: number): Date {
  let date = addDays(startDate, 1)
  const maxDays = 35

  for (let i = 0; i < maxDays; i++) {
    const illumination = SunCalc.getMoonIllumination(date)
    const phase = illumination.phase

    let isMatch = false
    if (targetPhase === 0) {
      isMatch = phase < 0.03 || phase > 0.97
    } else {
      isMatch = Math.abs(phase - targetPhase) < 0.03
    }

    if (isMatch) return date
    date = addDays(date, 1)
  }
  return date
}

// Calculate moon data for a given date
function getMoonData(date: Date): MoonData {
  const illumination = SunCalc.getMoonIllumination(date)
  const moonAge = illumination.phase * 29.53

  return {
    date,
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

// Get moon position (for distance calculation)
function getMoonPosition(date: Date, lat: number, lon: number) {
  return SunCalc.getMoonPosition(date, lat, lon)
}

// ===========================================
// MOON VISUAL (SVG) - Reusable at different sizes
// ===========================================

interface MoonVisualProps {
  phase: number
  illumination: number
  size?: number
  showGlow?: boolean
}

function MoonVisual({ phase, illumination, size = 120, showGlow = true }: MoonVisualProps) {
  const radius = size / 2 - 2
  const cx = size / 2
  const cy = size / 2

  const illuminatedPath = useMemo(() => {
    if (illumination < 0.01) return ''

    if (illumination > 0.99) {
      return `M ${cx - radius} ${cy}
              A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy}
              A ${radius} ${radius} 0 1 1 ${cx - radius} ${cy}`
    }

    const sweepWidth = Math.abs(Math.cos(phase * 2 * Math.PI)) * radius

    if (phase <= 0.5) {
      return `M ${cx} ${cy - radius}
              A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius}
              A ${sweepWidth} ${radius} 0 0 ${phase < 0.25 ? 1 : 0} ${cx} ${cy - radius}`
    } else {
      return `M ${cx} ${cy - radius}
              A ${radius} ${radius} 0 0 0 ${cx} ${cy + radius}
              A ${sweepWidth} ${radius} 0 0 ${phase > 0.75 ? 0 : 1} ${cx} ${cy - radius}`
    }
  }, [phase, illumination, cx, cy, radius])

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Glow effect for larger moons */}
      {showGlow && illumination > 0.3 && (
        <circle
          cx={cx}
          cy={cy}
          r={radius + 4}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
        />
      )}

      {/* Dark moon base */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="#2a2a2e"
      />

      {/* Illuminated portion */}
      {illumination > 0.01 && (
        <path
          d={illuminatedPath}
          fill="#e8e8e0"
        />
      )}
    </svg>
  )
}

// ===========================================
// MINI MOON (for week/month views)
// ===========================================

interface MiniMoonProps {
  data: MoonData
  isToday?: boolean
  showDate?: boolean
  size?: number
}

function MiniMoon({ data, isToday = false, showDate = false, size = 24 }: MiniMoonProps) {
  return (
    <div className={`flex flex-col items-center ${isToday ? 'opacity-100' : 'opacity-70'}`}>
      <div className={`rounded-full ${isToday ? 'ring-2 ring-white/40 ring-offset-1 ring-offset-[#1a1a1e]' : ''}`}>
        <MoonVisual
          phase={data.phase}
          illumination={data.illumination}
          size={size}
          showGlow={false}
        />
      </div>
      {showDate && (
        <span className={`text-[0.5em] font-mono mt-[0.25em] ${isToday ? 'text-white' : 'text-white/40'}`}>
          {format(data.date, 'd')}
        </span>
      )}
    </div>
  )
}

// ===========================================
// TODAY VIEW
// ===========================================

interface TodayViewProps {
  moonData: MoonData
  moonTimes: MoonTimes | null
  nextFullMoon: Date
  nextNewMoon: Date
}

function TodayView({ moonData, moonTimes, nextFullMoon, nextNewMoon }: TodayViewProps) {
  return (
    <div className="space-y-[1em]">
      {/* Large moon visual */}
      <div className="flex justify-center py-[0.5em]">
        <MoonVisual
          phase={moonData.phase}
          illumination={moonData.illumination}
          size={140}
          showGlow={true}
        />
      </div>

      {/* Phase name and illumination */}
      <div className="text-center">
        <div className="text-[1.125em] font-medium text-white">{moonData.phaseName}</div>
        <div className="flex items-baseline justify-center gap-[0.25em] mt-[0.25em]">
          <span className="font-mono text-[1.75em] font-bold text-white">
            {(moonData.illumination * 100).toFixed(0)}%
          </span>
          <span className="text-[0.75em] text-white/50">illuminated</span>
        </div>
      </div>

      {/* Rise/Set and Next Phases Grid */}
      <div className="grid grid-cols-2 gap-[0.5em]">
        {/* Moonrise */}
        <div className="bg-white/5 rounded-[0.375em] p-[0.625em] text-center">
          <div className="text-[0.5625em] font-medium text-white/40 uppercase tracking-wider">
            Moonrise
          </div>
          <div className="font-mono text-[1em] font-medium text-white mt-[0.125em]">
            {moonTimes?.rise ? format(moonTimes.rise, 'HH:mm') : '—'}
          </div>
        </div>

        {/* Moonset */}
        <div className="bg-white/5 rounded-[0.375em] p-[0.625em] text-center">
          <div className="text-[0.5625em] font-medium text-white/40 uppercase tracking-wider">
            Moonset
          </div>
          <div className="font-mono text-[1em] font-medium text-white mt-[0.125em]">
            {moonTimes?.set ? format(moonTimes.set, 'HH:mm') : '—'}
          </div>
        </div>

        {/* Next Full Moon */}
        <div className="bg-white/5 rounded-[0.375em] p-[0.625em] text-center">
          <div className="text-[0.5625em] font-medium text-white/40 uppercase tracking-wider">
            Next Full
          </div>
          <div className="font-mono text-[1em] font-medium text-white mt-[0.125em]">
            {format(nextFullMoon, 'MMM d')}
          </div>
        </div>

        {/* Next New Moon */}
        <div className="bg-white/5 rounded-[0.375em] p-[0.625em] text-center">
          <div className="text-[0.5625em] font-medium text-white/40 uppercase tracking-wider">
            Next New
          </div>
          <div className="font-mono text-[1em] font-medium text-white mt-[0.125em]">
            {format(nextNewMoon, 'MMM d')}
          </div>
        </div>
      </div>

      {/* Moon age */}
      <div className="text-center">
        <span className="text-[0.6875em] text-white/40">
          Moon age: <span className="font-mono text-white/60">{moonData.moonAge.toFixed(1)}</span> days
        </span>
      </div>
    </div>
  )
}

// ===========================================
// WEEK VIEW
// ===========================================

interface WeekViewProps {
  today: Date
}

function WeekView({ today }: WeekViewProps) {
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday
  const weekDays = useMemo(() => {
    return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) })
      .map(date => ({
        ...getMoonData(date),
        isToday: isSameDay(date, today)
      }))
  }, [weekStart, today])

  const todayData = weekDays.find(d => d.isToday)

  return (
    <div className="space-y-[1em]">
      {/* Week row of moons */}
      <div className="flex justify-between items-end px-[0.25em]">
        {weekDays.map((day, i) => (
          <div key={i} className="flex flex-col items-center">
            <MiniMoon
              data={day}
              isToday={day.isToday}
              size={32}
            />
            <span className={`text-[0.5625em] font-mono mt-[0.375em] ${day.isToday ? 'text-white' : 'text-white/40'}`}>
              {format(day.date, 'EEE')}
            </span>
            <span className={`text-[0.5em] font-mono ${day.isToday ? 'text-white/70' : 'text-white/30'}`}>
              {format(day.date, 'd')}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Today's details */}
      {todayData && (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[0.875em] font-medium text-white">{todayData.phaseName}</div>
            <div className="text-[0.6875em] text-white/50">Today</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[1.25em] font-bold text-white">
              {(todayData.illumination * 100).toFixed(0)}%
            </div>
            <div className="text-[0.5625em] text-white/40">illuminated</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===========================================
// MONTH VIEW
// ===========================================

interface MonthViewProps {
  today: Date
}

function MonthView({ today }: MonthViewProps) {
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)

  const monthDays = useMemo(() => {
    return eachDayOfInterval({ start: monthStart, end: monthEnd })
      .map(date => ({
        ...getMoonData(date),
        isToday: isSameDay(date, today)
      }))
  }, [monthStart, monthEnd, today])

  // Find key phases this month
  const keyPhases = useMemo(() => {
    const phases: { type: string; date: Date }[] = []
    monthDays.forEach((day, i) => {
      if (i === 0) return
      const prev = monthDays[i - 1]

      // New moon (crosses 0)
      if ((prev.phase > 0.97 && day.phase < 0.03) ||
          (prev.phase > 0.5 && day.phase < 0.03)) {
        phases.push({ type: 'New', date: day.date })
      }
      // Full moon (crosses 0.5)
      if (prev.phase < 0.5 && day.phase >= 0.5) {
        phases.push({ type: 'Full', date: day.date })
      }
      // First quarter (crosses 0.25)
      if (prev.phase < 0.25 && day.phase >= 0.25) {
        phases.push({ type: '1st Qtr', date: day.date })
      }
      // Last quarter (crosses 0.75)
      if (prev.phase < 0.75 && day.phase >= 0.75) {
        phases.push({ type: '3rd Qtr', date: day.date })
      }
    })
    return phases
  }, [monthDays])

  return (
    <div className="space-y-[0.75em]">
      {/* Month label */}
      <div className="text-[0.75em] font-medium text-white/60 text-center">
        {format(today, 'MMMM yyyy')}
      </div>

      {/* Scrollable row of moons */}
      <div className="overflow-x-auto -mx-[1em] px-[1em]">
        <div className="flex gap-[0.125em]" style={{ width: 'max-content' }}>
          {monthDays.map((day, i) => (
            <MiniMoon
              key={i}
              data={day}
              isToday={day.isToday}
              showDate={true}
              size={20}
            />
          ))}
        </div>
      </div>

      {/* Key phases legend */}
      {keyPhases.length > 0 && (
        <>
          <div className="border-t border-white/10" />
          <div className="flex flex-wrap justify-center gap-x-[1em] gap-y-[0.25em]">
            {keyPhases.map((phase, i) => (
              <div key={i} className="flex items-center gap-[0.375em]">
                <span className="text-[0.625em] text-white/40">{phase.type}</span>
                <span className="text-[0.625em] font-mono text-white/70">
                  {format(phase.date, 'MMM d')}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function MoonPhase() {
  const [viewMode, setViewMode] = useState<ViewMode>('today')
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)

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
          // Default to London if no location
          setUserLocation({ lat: 51.5, lon: -0.1 })
        }
      )
    } else {
      setUserLocation({ lat: 51.5, lon: -0.1 })
    }
  }, [])

  const today = new Date()
  const moonData = useMemo(() => getMoonData(today), [])

  const moonTimes = useMemo(() => {
    if (!userLocation) return null
    return getMoonTimes(today, userLocation.lat, userLocation.lon)
  }, [userLocation, today])

  const nextFullMoon = useMemo(() => findNextPhase(today, 0.5), [today])
  const nextNewMoon = useMemo(() => findNextPhase(today, 0), [today])

  return (
    <div className="bg-[#1a1a1e] p-[1em]">
      {/* View mode selector */}
      <div className="flex bg-white/5 rounded-[0.5em] p-[0.25em] mb-[1em]">
        {(['today', 'week', 'month'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`
              flex-1 px-[0.5em] py-[0.375em] text-[0.75em] font-medium rounded-[0.375em] transition-colors capitalize
              ${viewMode === mode
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/60'
              }
            `}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* View content */}
      {viewMode === 'today' && (
        <TodayView
          moonData={moonData}
          moonTimes={moonTimes}
          nextFullMoon={nextFullMoon}
          nextNewMoon={nextNewMoon}
        />
      )}

      {viewMode === 'week' && <WeekView today={today} />}

      {viewMode === 'month' && <MonthView today={today} />}

      {/* Source attribution */}
      <div className="mt-[1em] text-center">
        <span className="text-[0.5625em] font-mono text-white/30">
          Calculated using SunCalc
        </span>
      </div>
    </div>
  )
}
