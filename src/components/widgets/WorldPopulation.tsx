'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

// ===========================================
// WORLD POPULATION WIDGET
// ===========================================
// Live population counter based on UN World Population Prospects
// - Estimated current population with smooth animation
// - Birth/death rate visualization (subtle pulses)
// - Today's vital statistics
// - Session growth counter
// - Milestone tracking
//
// Data: UN World Population Prospects 2024
// No API needed - pure calculation from constants
// ===========================================

// UN World Population Prospects 2024 data
const POPULATION_DATA = {
  basePopulation: 8_100_000_000,
  baseDate: new Date('2024-07-01T00:00:00Z'),
  
  // Per year rates (2024 estimates)
  birthsPerYear: 140_000_000,
  deathsPerYear: 60_000_000,
  netGrowthPerYear: 80_000_000,
  
  // Derived per-second rates
  get birthsPerSecond() { return this.birthsPerYear / (365.25 * 24 * 60 * 60) },
  get deathsPerSecond() { return this.deathsPerYear / (365.25 * 24 * 60 * 60) },
  get growthPerSecond() { return this.netGrowthPerYear / (365.25 * 24 * 60 * 60) },
}

// Historical and projected milestones
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

// Format large numbers with commas
function formatNumber(n: number): string {
  return Math.floor(n).toLocaleString()
}

// Format compact (8.12B)
function formatCompact(n: number): string {
  if (n >= 1_000_000_000) {
    return (n / 1_000_000_000).toFixed(3) + 'B'
  }
  return formatNumber(n)
}

// ===========================================
// RATE INDICATOR COMPONENT
// ===========================================

interface RateIndicatorProps {
  rate: number
  label: string
  type: 'birth' | 'death'
}

function RateIndicator({ rate, label, type }: RateIndicatorProps) {
  const [pulse, setPulse] = useState(false)
  
  // Subtle pulse at realistic intervals (slowed down for less visual noise)
  // Real rate: ~4.4 births/sec, ~1.9 deaths/sec
  // We pulse at 1/3 the rate for calmer visualization
  useEffect(() => {
    const interval = (1000 / rate) * 3 // 3x slower than reality
    
    const timer = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 300)
    }, interval)
    
    return () => clearInterval(timer)
  }, [rate])
  
  const dotColor = type === 'birth' ? 'bg-green-500' : 'bg-neutral-400'
  const textColor = type === 'birth' ? 'text-green-600' : 'text-neutral-500'
  
  return (
    <div className="flex items-center gap-[0.5em]">
      <span 
        className={`
          w-[0.5em] h-[0.5em] rounded-full transition-all duration-300
          ${dotColor}
          ${pulse ? 'scale-150 opacity-100' : 'scale-100 opacity-60'}
        `}
      />
      <span className={`font-mono text-[0.875em] font-medium ${textColor}`}>
        {rate.toFixed(1)}
      </span>
      <span className="text-[0.75em] text-black/50">
        {label}
      </span>
    </div>
  )
}

// ===========================================
// STAT ROW COMPONENT
// ===========================================

interface StatRowProps {
  label: string
  value: string
  color?: string
  highlight?: boolean
}

function StatRow({ label, value, color, highlight }: StatRowProps) {
  return (
    <div className={`
      flex justify-between items-center py-[0.375em]
      ${highlight ? 'border-t border-black/10 mt-[0.5em] pt-[0.625em]' : ''}
    `}>
      <span className="text-[0.75em] text-black/60">{label}</span>
      <span 
        className="font-mono text-[0.8125em] font-medium"
        style={{ color: color || 'inherit' }}
      >
        {value}
      </span>
    </div>
  )
}

// ===========================================
// MAIN WIDGET COMPONENT
// ===========================================

export default function WorldPopulation() {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef(Date.now())
  
  // State
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [population, setPopulation] = useState(POPULATION_DATA.basePopulation)
  const [todayBirths, setTodayBirths] = useState(0)
  const [todayDeaths, setTodayDeaths] = useState(0)
  const [sessionGrowth, setSessionGrowth] = useState(0)
  
  // Responsive scaling
  useEffect(() => {
    if (!containerRef.current) return
    
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25) // 400px = 16px base
    })
    
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
  
  // Population calculation - updates smoothly
  useEffect(() => {
    const updatePopulation = () => {
      const now = Date.now()
      
      // Current population since base date
      const secondsSinceBase = (now - POPULATION_DATA.baseDate.getTime()) / 1000
      const currentPop = POPULATION_DATA.basePopulation + (secondsSinceBase * POPULATION_DATA.growthPerSecond)
      setPopulation(currentPop)
      
      // Today's counts (since midnight UTC)
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      const secondsToday = (now - today.getTime()) / 1000
      setTodayBirths(secondsToday * POPULATION_DATA.birthsPerSecond)
      setTodayDeaths(secondsToday * POPULATION_DATA.deathsPerSecond)
      
      // Session growth
      const sessionSeconds = (now - startTimeRef.current) / 1000
      setSessionGrowth(sessionSeconds * POPULATION_DATA.growthPerSecond)
    }
    
    updatePopulation()
    const interval = setInterval(updatePopulation, 100) // Smooth updates
    
    return () => clearInterval(interval)
  }, [])
  
  // Next milestone
  const nextMilestone = useMemo(() => {
    return MILESTONES.find(m => m.population > population)
  }, [population])
  
  // Growth rate percentage
  const growthRate = (POPULATION_DATA.netGrowthPerYear / POPULATION_DATA.basePopulation) * 100

  return (
    <div 
      ref={containerRef}
      className="w-full bg-white rounded-[0.75em] p-[1em]"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Main counter - the hero */}
      <div className="text-center mb-[1em]">
        <div className="font-mono text-[2.5em] font-bold tracking-tight text-black leading-none">
          {formatCompact(population)}
        </div>
        <div className="text-[0.75em] text-black/50 mt-[0.25em] font-medium uppercase tracking-wider">
          Humans on Earth
        </div>
      </div>
      
      {/* Full number (smaller) */}
      <div className="text-center mb-[1em]">
        <div className="font-mono text-[1em] text-black/70">
          {formatNumber(population)}
        </div>
      </div>
      
      {/* Rate indicators */}
      <div className="flex justify-center gap-[1.5em] mb-[1em] py-[0.75em] bg-neutral-50 rounded-[0.5em]">
        <RateIndicator 
          rate={POPULATION_DATA.birthsPerSecond} 
          label="births/sec"
          type="birth"
        />
        <RateIndicator 
          rate={POPULATION_DATA.deathsPerSecond} 
          label="deaths/sec"
          type="death"
        />
      </div>
      
      {/* Today's stats */}
      <div className="mb-[1em] px-[0.5em]">
        <div className="text-[0.6875em] text-black/40 uppercase tracking-wider font-medium mb-[0.5em]">
          Today (UTC)
        </div>
        <StatRow 
          label="Births" 
          value={`+${formatNumber(todayBirths)}`}
          color="#22c55e"
        />
        <StatRow 
          label="Deaths" 
          value={`−${formatNumber(todayDeaths)}`}
          color="#6b7280"
        />
        <StatRow 
          label="Net growth" 
          value={`+${formatNumber(todayBirths - todayDeaths)}`}
          color="#0ea5e9"
          highlight
        />
      </div>
      
      {/* Session counter */}
      <div className="text-center py-[0.75em] bg-sky-50 rounded-[0.5em] mb-[1em]">
        <div className="text-[0.6875em] text-black/40 uppercase tracking-wider font-medium">
          Since you opened this
        </div>
        <div className="font-mono text-[1.25em] font-bold text-sky-600 mt-[0.25em]">
          +{formatNumber(sessionGrowth)}
        </div>
      </div>
      
      {/* Next milestone */}
      {nextMilestone && (
        <div className="flex items-center justify-between px-[0.5em] py-[0.5em] bg-neutral-50 rounded-[0.5em] mb-[0.75em]">
          <span className="text-[0.6875em] text-black/40 uppercase tracking-wider font-medium">
            Next milestone
          </span>
          <div className="text-right">
            <span className="text-[0.875em] font-medium text-black">
              {nextMilestone.label}
            </span>
            <span className="text-[0.75em] text-black/50 ml-[0.5em] font-mono">
              ~{nextMilestone.year}
              {nextMilestone.projected && ' (proj.)'}
            </span>
          </div>
        </div>
      )}
      
      {/* Growth rate context */}
      <div className="text-center text-[0.6875em] text-black/40">
        Growth rate: {growthRate.toFixed(2)}% per year
      </div>
    </div>
  )
}