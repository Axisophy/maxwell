'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import {
  VOYAGER_1,
  VOYAGER_2,
  getVoyagerPosition,
  getMilestonesToDate,
  formatDistance,
  formatLightTime,
  getLightTravelTime,
} from '@/lib/orbital/voyager-data'

// Dynamic import for VoyagerScene
const VoyagerScene = dynamic(
  () => import('@/components/orbital/VoyagerScene'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4" />
          <div className="text-sm text-white/40">Loading Voyager trajectories...</div>
        </div>
      </div>
    ),
  }
)

type FocusTarget = 'sun' | 'voyager1' | 'voyager2' | 'overview' | null

// Time presets for quick navigation
const TIME_PRESETS = [
  { label: 'Launch', date: new Date('1977-09-05'), description: 'Voyager 1 launch' },
  { label: 'Jupiter', date: new Date('1979-03-05'), description: 'Jupiter flyby' },
  { label: 'Saturn', date: new Date('1980-11-12'), description: 'Saturn flyby' },
  { label: 'Uranus', date: new Date('1986-01-24'), description: 'Voyager 2 at Uranus' },
  { label: 'Neptune', date: new Date('1989-08-25'), description: 'Voyager 2 at Neptune' },
  { label: 'Pale Blue Dot', date: new Date('1990-02-14'), description: 'Famous Earth photo' },
  { label: 'Interstellar', date: new Date('2012-08-25'), description: 'Voyager 1 leaves heliosphere' },
  { label: 'Now', date: new Date(), description: 'Current positions' },
]

// Speed multipliers
const SPEEDS = [
  { label: 'Pause', value: 0 },
  { label: '1 day/s', value: 1 },
  { label: '1 week/s', value: 7 },
  { label: '1 month/s', value: 30 },
  { label: '1 year/s', value: 365 },
  { label: '5 years/s', value: 365 * 5 },
]

export default function VoyagerPage() {
  const [time, setTime] = useState(new Date())
  const [speed, setSpeed] = useState(0)
  const [focusTarget, setFocusTarget] = useState<FocusTarget>('overview')
  const [showOrbits, setShowOrbits] = useState(true)

  // Animate time
  useEffect(() => {
    const interval = setInterval(() => {
      if (speed > 0) {
        setTime(prev => new Date(prev.getTime() + speed * 24 * 60 * 60 * 1000 / 10))
      }
    }, 100)
    return () => clearInterval(interval)
  }, [speed])

  // Get current positions
  const v1Position = useMemo(() => getVoyagerPosition(VOYAGER_1, time), [time])
  const v2Position = useMemo(() => getVoyagerPosition(VOYAGER_2, time), [time])

  // Get milestones reached
  const v1Milestones = useMemo(() => getMilestonesToDate(VOYAGER_1, time), [time])
  const v2Milestones = useMemo(() => getMilestonesToDate(VOYAGER_2, time), [time])

  // Calculate year progress for slider
  const minYear = 1977
  const maxYear = 2026
  const currentYear = time.getFullYear() + time.getMonth() / 12

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseFloat(e.target.value)
    const yearInt = Math.floor(year)
    const dayOfYear = Math.floor((year - yearInt) * 365)
    setTime(new Date(yearInt, 0, 1 + dayOfYear))
    setSpeed(0)
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">
        {/* Breadcrumb */}
        <div className="mb-px">
          <div className="bg-[#1d1d1d] rounded-lg py-2 px-4">
            <nav className="flex items-center gap-2 text-sm text-white/50">
              <span className="hover:text-white cursor-pointer">MXWLL</span>
              <span>/</span>
              <span className="hover:text-white cursor-pointer">Observe</span>
              <span>/</span>
              <span className="hover:text-white cursor-pointer">Space</span>
              <span>/</span>
              <span className="text-white">Voyager</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-light text-white uppercase">
              The Voyager Journey
            </h1>
            <span className="text-[10px] font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded uppercase">
              Live
            </span>
          </div>
          <p className="text-sm text-white/50 max-w-3xl">
            Two spacecraft launched in 1977, now the most distant human-made objects in existence.
            Voyager 1 entered interstellar space in 2012. Both continue transmitting data from
            beyond our solar system.
          </p>
        </div>

        {/* Main visualisation */}
        <div className="bg-[#1d1d1d] rounded-lg overflow-hidden mb-px">
          <div className="aspect-video md:aspect-[21/9] w-full relative">
            <Suspense fallback={
              <div className="w-full h-full bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            }>
              <VoyagerScene
                time={time}
                showOrbits={showOrbits}
                showPlanets={true}
                focusTarget={focusTarget}
              />
            </Suspense>

            {/* Legend overlay */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur rounded-lg p-3 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00ff88' }} />
                  <span className="text-white/70">Voyager 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00aaff' }} />
                  <span className="text-white/70">Voyager 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline slider */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] text-white/40 uppercase tracking-wider">
              Mission Timeline
            </div>
            <div className="font-mono text-lg text-white">
              {time.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </div>
          <input
            type="range"
            min={minYear}
            max={maxYear}
            step={0.01}
            value={currentYear}
            onChange={handleSliderChange}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-[#ffdf20]
                       [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>1977</span>
            <span>1990</span>
            <span>2000</span>
            <span>2010</span>
            <span>2026</span>
          </div>
        </div>

        {/* Controls row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-px">
          {/* Time presets */}
          <div className="bg-[#1d1d1d] rounded-lg p-4">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
              Key Moments
            </div>
            <div className="flex flex-wrap gap-1">
              {TIME_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setTime(preset.date)
                    setSpeed(0)
                  }}
                  className="px-2 py-1 text-xs rounded bg-white/10 text-white/60
                             hover:bg-white/20 hover:text-white transition-colors"
                  title={preset.description}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Playback controls */}
          <div className="bg-[#1d1d1d] rounded-lg p-4">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
              Playback Speed
            </div>
            <div className="flex flex-wrap gap-1">
              {SPEEDS.map(s => (
                <button
                  key={s.value}
                  onClick={() => setSpeed(s.value)}
                  className={`px-3 py-1.5 text-xs rounded transition-colors
                    ${speed === s.value
                      ? 'bg-[#ffdf20] text-black'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                    }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Focus selector */}
          <div className="bg-[#1d1d1d] rounded-lg p-4">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
              Focus On
            </div>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'voyager1', label: 'Voyager 1' },
                { id: 'voyager2', label: 'Voyager 2' },
                { id: 'sun', label: 'Inner System' },
              ].map(target => (
                <button
                  key={target.id}
                  onClick={() => setFocusTarget(target.id as FocusTarget)}
                  className={`px-3 py-1.5 text-xs rounded transition-colors
                    ${focusTarget === target.id
                      ? 'bg-[#ffdf20] text-black'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                    }`}
                >
                  {target.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Spacecraft status cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px mb-px">
          {/* Voyager 1 */}
          <div className="bg-[#1d1d1d] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: '#00ff88' }}
              />
              <h2 className="text-xl font-light text-white">Voyager 1</h2>
              {time >= new Date('2012-08-25') && (
                <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                  Interstellar
                </span>
              )}
            </div>

            {v1Position && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black rounded-lg p-3">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Distance from Sun</div>
                  <div className="text-2xl font-mono text-white">
                    {formatDistance(v1Position.distance)}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    {(v1Position.distance * 149.6).toFixed(0)} million km
                  </div>
                </div>
                <div className="bg-black rounded-lg p-3">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Signal Travel Time</div>
                  <div className="text-2xl font-mono text-white">
                    {formatLightTime(getLightTravelTime(v1Position.distance))}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    One-way light time
                  </div>
                </div>
              </div>
            )}

            {/* Latest milestone */}
            {v1Milestones.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-[10px] text-white/40 uppercase mb-2">Latest Milestone</div>
                <div className="text-sm text-white">
                  {v1Milestones[v1Milestones.length - 1].name}
                </div>
                <div className="text-xs text-white/50 mt-1">
                  {v1Milestones[v1Milestones.length - 1].description}
                </div>
              </div>
            )}
          </div>

          {/* Voyager 2 */}
          <div className="bg-[#1d1d1d] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: '#00aaff' }}
              />
              <h2 className="text-xl font-light text-white">Voyager 2</h2>
              {time >= new Date('2018-11-05') && (
                <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                  Interstellar
                </span>
              )}
            </div>

            {v2Position && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black rounded-lg p-3">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Distance from Sun</div>
                  <div className="text-2xl font-mono text-white">
                    {formatDistance(v2Position.distance)}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    {(v2Position.distance * 149.6).toFixed(0)} million km
                  </div>
                </div>
                <div className="bg-black rounded-lg p-3">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Signal Travel Time</div>
                  <div className="text-2xl font-mono text-white">
                    {formatLightTime(getLightTravelTime(v2Position.distance))}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    One-way light time
                  </div>
                </div>
              </div>
            )}

            {/* Latest milestone */}
            {v2Milestones.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-[10px] text-white/40 uppercase mb-2">Latest Milestone</div>
                <div className="text-sm text-white">
                  {v2Milestones[v2Milestones.length - 1].name}
                </div>
                <div className="text-xs text-white/50 mt-1">
                  {v2Milestones[v2Milestones.length - 1].description}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Context section */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-4">
            What You're Seeing
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-white/70">
              The Voyager spacecraft took advantage of a rare planetary alignment that occurs
              once every 175 years. This "Grand Tour" trajectory allowed them to visit multiple
              outer planets using gravity assists - each planetary encounter accelerated the
              spacecraft and bent its trajectory toward the next target.
            </p>
            <p className="text-white/70 mt-3">
              Voyager 1 is now the most distant human-made object, travelling at about 17 km/s
              relative to the Sun. At this speed, it would take about 73,000 years to reach the
              nearest star, Proxima Centauri - if it were heading in that direction, which it isn't.
            </p>
          </div>
        </div>

        {/* View options */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOrbits}
                onChange={(e) => setShowOrbits(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#ffdf20] focus:ring-0"
              />
              <span className="text-sm text-white/70">Show planet orbits</span>
            </label>
          </div>
        </div>

        {/* Data sources */}
        <div className="mt-4 text-xs text-white/30 text-center">
          Trajectory data derived from JPL Horizons ephemeris •
          Positions calculated using VSOP87 planetary theory •
          Spacecraft IDs: Voyager 1 (NAIF -31), Voyager 2 (NAIF -32)
        </div>
      </div>
    </main>
  )
}
