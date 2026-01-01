'use client'

import { useState, useEffect, useMemo } from 'react'
import SunCalc from 'suncalc'
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'

// ===========================================
// MOON PHASE WIDGET
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

function MoonVisual({ phase, illumination, size = 120 }: MoonVisualProps) {
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
      {/* Dark moon base - 700/#404040 grey */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="#404040"
      />

      {/* Illuminated portion - yellow #ffdf20 */}
      {illumination > 0.01 && (
        <path
          d={illuminatedPath}
          fill="#ffdf20"
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
      <div className={`rounded-full ${isToday ? 'ring-2 ring-white/40 ring-offset-1 ring-offset-[#404040]' : ''}`}>
        <MoonVisual
          phase={data.phase}
          illumination={data.illumination}
          size={size}
        />
      </div>
      {showDate && (
        <span className={`text-[10px] font-mono mt-1 ${isToday ? 'text-white' : 'text-white/40'}`}>
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
    <div className="space-y-4">
      {/* Moon visual in black frame */}
      <div className="bg-black rounded-lg p-4 flex justify-center">
        <MoonVisual
          phase={moonData.phase}
          illumination={moonData.illumination}
          size={140}
        />
      </div>

      {/* Phase name and illumination */}
      <div className="text-center">
        <div className="text-base font-medium text-white">{moonData.phaseName}</div>
        <div className="flex items-baseline justify-center gap-1 mt-1">
          <span className="font-mono text-2xl font-bold text-white">
            {(moonData.illumination * 100).toFixed(0)}%
          </span>
          <span className="text-xs text-white/50">illuminated</span>
        </div>
      </div>

      {/* Rise/Set and Next Phases Grid - black frames */}
      <div className="grid grid-cols-2 gap-px">
        {/* Moonrise */}
        <div className="bg-black rounded-lg p-3 text-center">
          <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
            Moonrise
          </div>
          <div className="font-mono text-base font-medium text-white mt-1">
            {moonTimes?.rise ? format(moonTimes.rise, 'HH:mm') : '—'}
          </div>
        </div>

        {/* Moonset */}
        <div className="bg-black rounded-lg p-3 text-center">
          <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
            Moonset
          </div>
          <div className="font-mono text-base font-medium text-white mt-1">
            {moonTimes?.set ? format(moonTimes.set, 'HH:mm') : '—'}
          </div>
        </div>

        {/* Next Full Moon */}
        <div className="bg-black rounded-lg p-3 text-center">
          <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
            Next Full
          </div>
          <div className="font-mono text-base font-medium text-white mt-1">
            {format(nextFullMoon, 'MMM d')}
          </div>
        </div>

        {/* Next New Moon */}
        <div className="bg-black rounded-lg p-3 text-center">
          <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
            Next New
          </div>
          <div className="font-mono text-base font-medium text-white mt-1">
            {format(nextNewMoon, 'MMM d')}
          </div>
        </div>
      </div>

      {/* Moon age - white text like SolarDisk description */}
      <div className="text-center">
        <span className="text-sm text-white">
          Moon age: <span className="font-mono">{moonData.moonAge.toFixed(1)}</span> days
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
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekDays = useMemo(() => {
    return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) })
      .map(date => ({
        ...getMoonData(date),
        isToday: isSameDay(date, today)
      }))
  }, [weekStart, today])

  const todayData = weekDays.find(d => d.isToday)

  return (
    <div className="space-y-4">
      {/* Week row of moons in black frame */}
      <div className="bg-black rounded-lg p-4">
        <div className="flex justify-between items-end">
          {weekDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center">
              <MiniMoon
                data={day}
                isToday={day.isToday}
                size={32}
              />
              <span className={`text-[10px] font-mono mt-2 ${day.isToday ? 'text-white' : 'text-white/40'}`}>
                {format(day.date, 'EEE')}
              </span>
              <span className={`text-[10px] font-mono ${day.isToday ? 'text-white/70' : 'text-white/30'}`}>
                {format(day.date, 'd')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's details */}
      {todayData && (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-medium text-white">{todayData.phaseName}</div>
            <div className="text-xs text-white/50">Today</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xl font-bold text-white">
              {(todayData.illumination * 100).toFixed(0)}%
            </div>
            <div className="text-[10px] text-white/40">illuminated</div>
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

  const keyPhases = useMemo(() => {
    const phases: { type: string; date: Date }[] = []
    monthDays.forEach((day, i) => {
      if (i === 0) return
      const prev = monthDays[i - 1]

      if ((prev.phase > 0.97 && day.phase < 0.03) ||
          (prev.phase > 0.5 && day.phase < 0.03)) {
        phases.push({ type: 'New', date: day.date })
      }
      if (prev.phase < 0.5 && day.phase >= 0.5) {
        phases.push({ type: 'Full', date: day.date })
      }
      if (prev.phase < 0.25 && day.phase >= 0.25) {
        phases.push({ type: '1st Qtr', date: day.date })
      }
      if (prev.phase < 0.75 && day.phase >= 0.75) {
        phases.push({ type: '3rd Qtr', date: day.date })
      }
    })
    return phases
  }, [monthDays])

  return (
    <div className="space-y-4">
      {/* Month label */}
      <div className="text-sm font-medium text-white/60 text-center">
        {format(today, 'MMMM yyyy')}
      </div>

      {/* Scrollable row of moons in black frame */}
      <div className="bg-black rounded-lg p-4 overflow-x-auto">
        <div className="flex gap-1" style={{ width: 'max-content' }}>
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

      {/* Key phases */}
      {keyPhases.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {keyPhases.map((phase, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-white/40">{phase.type}</span>
              <span className="text-xs font-mono text-white/70">
                {format(phase.date, 'MMM d')}
              </span>
            </div>
          ))}
        </div>
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
    <div className="bg-[#404040] p-2 md:p-4">
      {/* View mode selector - yellow/black style */}
      <div className="flex gap-px mb-4">
        {(['today', 'week', 'month'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`
              flex-1 px-2 py-2 text-xs font-medium rounded-lg transition-colors uppercase
              ${viewMode === mode
                ? 'bg-[#ffdf20] text-[#404040]'
                : 'bg-black text-white/60 hover:text-white'
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
    </div>
  )
}
