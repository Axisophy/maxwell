'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

// ===========================================
// WORLD POPULATION WIDGET
// ===========================================

// UN World Population Prospects 2024 data
const POPULATION_DATA = {
  basePopulation: 8_100_000_000,
  baseDate: new Date('2024-07-01T00:00:00Z'),

  birthsPerYear: 140_000_000,
  deathsPerYear: 60_000_000,
  netGrowthPerYear: 80_000_000,

  get birthsPerSecond() { return this.birthsPerYear / (365.25 * 24 * 60 * 60) },
  get deathsPerSecond() { return this.deathsPerYear / (365.25 * 24 * 60 * 60) },
  get growthPerSecond() { return this.netGrowthPerYear / (365.25 * 24 * 60 * 60) },
}

const MILESTONES = [
  { year: 1804, population: 1_000_000_000, label: '1 billion' },
  { year: 1927, population: 2_000_000_000, label: '2 billion' },
  { year: 1960, population: 3_000_000_000, label: '3 billion' },
  { year: 1974, population: 4_000_000_000, label: '4 billion' },
  { year: 1987, population: 5_000_000_000, label: '5 billion' },
  { year: 1999, population: 6_000_000_000, label: '6 billion' },
  { year: 2011, population: 7_000_000_000, label: '7 billion' },
  { year: 2022, population: 8_000_000_000, label: '8 billion' },
  { year: 2037, population: 9_000_000_000, label: '9 billion', projected: true },
]

function formatNumber(n: number): string {
  return Math.floor(n).toLocaleString()
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function WorldPopulation() {
  const startTimeRef = useRef(Date.now())

  const [population, setPopulation] = useState(POPULATION_DATA.basePopulation)
  const [todayBirths, setTodayBirths] = useState(0)
  const [todayDeaths, setTodayDeaths] = useState(0)
  const [sessionGrowth, setSessionGrowth] = useState(0)

  useEffect(() => {
    const updatePopulation = () => {
      const now = Date.now()

      const secondsSinceBase = (now - POPULATION_DATA.baseDate.getTime()) / 1000
      const currentPop = POPULATION_DATA.basePopulation + (secondsSinceBase * POPULATION_DATA.growthPerSecond)
      setPopulation(currentPop)

      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      const secondsToday = (now - today.getTime()) / 1000
      setTodayBirths(secondsToday * POPULATION_DATA.birthsPerSecond)
      setTodayDeaths(secondsToday * POPULATION_DATA.deathsPerSecond)

      const sessionSeconds = (now - startTimeRef.current) / 1000
      setSessionGrowth(sessionSeconds * POPULATION_DATA.growthPerSecond)
    }

    updatePopulation()
    const interval = setInterval(updatePopulation, 100)
    return () => clearInterval(interval)
  }, [])

  const nextMilestone = useMemo(() => {
    return MILESTONES.find(m => m.population > population)
  }, [population])

  const growthRate = (POPULATION_DATA.netGrowthPerYear / POPULATION_DATA.basePopulation) * 100

  return (
    <div className="bg-[#404040] p-2 md:p-4 space-y-px">
      {/* Main counter */}
      <div className="bg-black rounded-lg p-3">
        <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">
          Humans on Earth
        </div>
        <div className="font-mono text-3xl md:text-4xl font-bold text-white tabular-nums">
          {formatNumber(population)}
        </div>
      </div>

      {/* Birth/Death rates - side by side */}
      <div className="grid grid-cols-2 gap-px">
        <div className="bg-black rounded-lg p-3">
          <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1">
            Births
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-bold text-green-500">
              {POPULATION_DATA.birthsPerSecond.toFixed(1)}
            </span>
            <span className="text-xs text-white/40">/sec</span>
          </div>
        </div>

        <div className="bg-black rounded-lg p-3">
          <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1">
            Deaths
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-bold text-white/60">
              {POPULATION_DATA.deathsPerSecond.toFixed(1)}
            </span>
            <span className="text-xs text-white/40">/sec</span>
          </div>
        </div>
      </div>

      {/* Today's stats */}
      <div className="bg-black rounded-lg p-3">
        <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">
          Today (UTC)
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/50">Births</span>
            <span className="font-mono text-sm text-green-500">+{formatNumber(todayBirths)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/50">Deaths</span>
            <span className="font-mono text-sm text-white/60">−{formatNumber(todayDeaths)}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-white/10">
            <span className="text-xs text-white/50">Net growth</span>
            <span className="font-mono text-sm text-cyan-400">+{formatNumber(todayBirths - todayDeaths)}</span>
          </div>
        </div>
      </div>

      {/* Session counter */}
      <div className="bg-black rounded-lg p-3">
        <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1">
          Since you opened this
        </div>
        <div className="font-mono text-xl font-bold text-cyan-400">
          +{formatNumber(sessionGrowth)}
        </div>
      </div>

      {/* Next milestone */}
      {nextMilestone && (
        <div className="bg-black rounded-lg p-3">
          <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1">
            Next milestone
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-white">
              {nextMilestone.label}
            </span>
            <span className="text-xs font-mono text-white/40">
              ~{nextMilestone.year}
              {nextMilestone.projected && ' (proj.)'}
            </span>
          </div>
        </div>
      )}

      {/* Growth rate */}
      <div className="bg-black rounded-lg p-3">
        <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1">
          Annual Growth Rate
        </div>
        <div className="font-mono text-lg font-bold text-white">
          {growthRate.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
