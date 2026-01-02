'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface SolarCycleData {
  time_tag: string
  ssn: number // Smoothed sunspot number
  predicted_ssn?: number
  f10_7?: number // Solar radio flux
}

interface CycleInfo {
  number: number
  start: string
  minimum: string
  maximum: string
  minimumSsn: number
  maximumSsn: number
}

// Solar cycle 25 info
const CYCLE_25: CycleInfo = {
  number: 25,
  start: '2019-12',
  minimum: '2019-12',
  maximum: '2024-07', // Revised estimate - actually peaked higher than expected
  minimumSsn: 1.8,
  maximumSsn: 180 // Actual peak was higher than predicted
}

// Notable historical events
const HISTORICAL_EVENTS = [
  { date: '1859-09-01', name: 'Carrington Event', desc: 'Most intense geomagnetic storm on record' },
  { date: '1989-03-13', name: 'Quebec Blackout', desc: 'Geomagnetic storm caused 9-hour blackout' },
  { date: '2003-10-28', name: 'Halloween Storms', desc: 'X17+ flare, one of the strongest recorded' },
  { date: '2012-07-23', name: 'Near Miss', desc: 'Carrington-class CME missed Earth by 9 days' },
]

export function SolarCyclePosition() {
  const [observedData, setObservedData] = useState<SolarCycleData[]>([])
  const [predictedData, setPredictedData] = useState<SolarCycleData[]>([])
  const [currentSsn, setCurrentSsn] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch solar cycle data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch observed indices
      const observedRes = await fetch(
        'https://services.swpc.noaa.gov/json/solar-cycle/observed-solar-cycle-indices.json'
      )
      const observed: SolarCycleData[] = await observedRes.json()
      
      // Fetch predicted cycle
      const predictedRes = await fetch(
        'https://services.swpc.noaa.gov/json/solar-cycle/predicted-solar-cycle.json'
      )
      const predicted: SolarCycleData[] = await predictedRes.json()
      
      // Filter to last 5 years of observed + next 5 years predicted
      const fiveYearsAgo = new Date()
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5)
      
      const filteredObserved = observed.filter(d => new Date(d.time_tag) >= fiveYearsAgo)
      
      setObservedData(filteredObserved)
      setPredictedData(predicted)
      
      // Get current SSN (last observed value)
      if (filteredObserved.length > 0) {
        setCurrentSsn(filteredObserved[filteredObserved.length - 1].ssn)
      }
      
      setError(false)
    } catch (e) {
      console.error('Error fetching solar cycle data:', e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  // Draw the solar cycle chart
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || observedData.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get container dimensions
    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = { top: 30, right: 20, bottom: 40, left: 50 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Clear
    ctx.fillStyle = '#0f0f14'
    ctx.fillRect(0, 0, width, height)

    // Combine data for x-axis range
    const allData = [...observedData, ...predictedData]
    const dates = allData.map(d => new Date(d.time_tag).getTime())
    const minDate = Math.min(...dates)
    const maxDate = Math.max(...dates)
    
    // Y-axis: SSN from 0 to max + margin
    const allSsn = [
      ...observedData.map(d => d.ssn),
      ...predictedData.map(d => d.predicted_ssn || d.ssn)
    ]
    const maxSsn = Math.max(...allSsn, 200)
    const yMax = Math.ceil(maxSsn / 50) * 50 + 25

    // Scale functions
    const xScale = (date: number) => padding.left + ((date - minDate) / (maxDate - minDate)) * chartWidth
    const yScale = (ssn: number) => padding.top + chartHeight - (ssn / yMax) * chartHeight

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    
    // Horizontal grid lines
    for (let ssn = 0; ssn <= yMax; ssn += 50) {
      const y = yScale(ssn)
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()
      
      // Y-axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.font = '10px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(ssn.toString(), padding.left - 8, y + 3)
    }

    // Draw "now" line
    const now = Date.now()
    if (now >= minDate && now <= maxDate) {
      const nowX = xScale(now)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(nowX, padding.top)
      ctx.lineTo(nowX, height - padding.bottom)
      ctx.stroke()
      ctx.setLineDash([])
      
      // "Now" label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('NOW', nowX, padding.top - 8)
    }

    // Draw predicted range (if available)
    if (predictedData.length > 0) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
      ctx.beginPath()
      
      const futureData = predictedData.filter(d => new Date(d.time_tag).getTime() > now)
      
      if (futureData.length > 0) {
        // Upper bound (assume +25%)
        ctx.moveTo(xScale(new Date(futureData[0].time_tag).getTime()), yScale((futureData[0].predicted_ssn || futureData[0].ssn) * 1.25))
        futureData.forEach(d => {
          const x = xScale(new Date(d.time_tag).getTime())
          const y = yScale((d.predicted_ssn || d.ssn) * 1.25)
          ctx.lineTo(x, y)
        })
        
        // Lower bound (assume -25%)
        for (let i = futureData.length - 1; i >= 0; i--) {
          const d = futureData[i]
          const x = xScale(new Date(d.time_tag).getTime())
          const y = yScale((d.predicted_ssn || d.ssn) * 0.75)
          ctx.lineTo(x, y)
        }
        
        ctx.closePath()
        ctx.fill()
      }
    }

    // Draw predicted line
    if (predictedData.length > 1) {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4])
      ctx.beginPath()
      
      predictedData.forEach((d, i) => {
        const x = xScale(new Date(d.time_tag).getTime())
        const y = yScale(d.predicted_ssn || d.ssn)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw observed line
    if (observedData.length > 1) {
      // Gradient from past to present
      const gradient = ctx.createLinearGradient(padding.left, 0, width - padding.right, 0)
      gradient.addColorStop(0, 'rgba(251, 191, 36, 0.6)')
      gradient.addColorStop(1, 'rgba(251, 191, 36, 1)')
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      
      observedData.forEach((d, i) => {
        const x = xScale(new Date(d.time_tag).getTime())
        const y = yScale(d.ssn)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      // Draw current point
      const lastObs = observedData[observedData.length - 1]
      const lastX = xScale(new Date(lastObs.time_tag).getTime())
      const lastY = yScale(lastObs.ssn)
      
      ctx.fillStyle = '#FBBF24'
      ctx.beginPath()
      ctx.arc(lastX, lastY, 5, 0, Math.PI * 2)
      ctx.fill()
      
      // Glow effect
      ctx.fillStyle = 'rgba(251, 191, 36, 0.3)'
      ctx.beginPath()
      ctx.arc(lastX, lastY, 10, 0, Math.PI * 2)
      ctx.fill()
    }

    // X-axis labels (years)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    
    const startYear = new Date(minDate).getFullYear()
    const endYear = new Date(maxDate).getFullYear()
    
    for (let year = startYear; year <= endYear; year++) {
      const yearDate = new Date(year, 6, 1).getTime() // July 1st of each year
      if (yearDate >= minDate && yearDate <= maxDate) {
        const x = xScale(yearDate)
        ctx.fillText(year.toString(), x, height - padding.bottom + 20)
      }
    }

    // Y-axis label
    ctx.save()
    ctx.translate(12, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Sunspot Number', 0, 0)
    ctx.restore()

  }, [observedData, predictedData])

  useEffect(() => {
    fetchData()
    
    // Refresh daily
    const interval = setInterval(fetchData, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    if (!loading && observedData.length > 0) {
      drawChart()
      
      const handleResize = () => drawChart()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [loading, observedData, predictedData, drawChart])

  // Calculate cycle phase
  const getCyclePhase = () => {
    if (currentSsn === null) return null
    
    // Peak was around 180, we're past maximum now
    const peakSsn = 180
    const minSsn = 10
    const progress = ((currentSsn - minSsn) / (peakSsn - minSsn)) * 100
    
    // Determine phase based on time and SSN trend
    const now = new Date()
    const maxDate = new Date(CYCLE_25.maximum)
    
    if (now < maxDate) {
      return { phase: 'Rising', progress: Math.min(progress, 100), approaching: 'Maximum' }
    } else {
      return { phase: 'Declining', progress: Math.max(100 - progress, 0), approaching: 'Minimum' }
    }
  }

  const cyclePhase = getCyclePhase()

  // Activity level description
  const getActivityLevel = () => {
    if (currentSsn === null) return { level: 'Unknown', color: 'text-white/40' }
    
    if (currentSsn >= 150) return { level: 'Very High', color: 'text-red-400' }
    if (currentSsn >= 100) return { level: 'High', color: 'text-orange-400' }
    if (currentSsn >= 50) return { level: 'Moderate', color: 'text-yellow-400' }
    if (currentSsn >= 20) return { level: 'Low', color: 'text-green-400' }
    return { level: 'Very Low', color: 'text-blue-400' }
  }

  const activity = getActivityLevel()

  return (
    <div className="bg-[#0f0f14] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-medium">Solar Cycle 25</h3>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
            ~11 YEAR CYCLE
          </span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 border-b border-white/10">
        <div className="p-4 border-r border-white/10">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">
            Sunspot Number
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-amber-400">
              {currentSsn !== null ? Math.round(currentSsn) : '-'}
            </span>
            <span className={`text-xs ${activity.color}`}>
              {activity.level}
            </span>
          </div>
        </div>
        
        <div className="p-4 border-r border-white/10">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">
            Cycle Phase
          </div>
          <div className="text-lg font-medium text-white">
            {cyclePhase?.phase || '-'}
          </div>
          <div className="text-xs text-white/40">
            Toward {cyclePhase?.approaching}
          </div>
        </div>
        
        <div className="p-4">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">
            Cycle Peak
          </div>
          <div className="text-lg font-medium text-white">
            Mid-2024
          </div>
          <div className="text-xs text-white/40">
            SSN ~180
          </div>
        </div>
      </div>

      {/* Chart */}
      <div 
        ref={containerRef} 
        className="relative h-64 md:h-72"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0f0f14]">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0f0f14]">
            <div className="text-center">
              <p className="text-white/40 text-sm">Unable to load solar cycle data</p>
              <button 
                onClick={fetchData}
                className="mt-2 text-xs text-white/60 hover:text-white underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        <canvas 
          ref={canvasRef}
          className={`${loading || error ? 'opacity-0' : 'opacity-100'}`}
        />

        {/* Legend */}
        {!loading && !error && (
          <div className="absolute bottom-3 left-14 flex items-center gap-4 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-amber-400 rounded" />
              <span className="text-white/40">Observed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-blue-400/50 rounded" style={{ borderStyle: 'dashed', borderWidth: '1px 0 0 0', borderColor: 'rgba(59, 130, 246, 0.5)' }} />
              <span className="text-white/40">Predicted</span>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="p-4 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-amber-400 text-xs">☀</span>
          </div>
          <div className="text-xs text-white/50 leading-relaxed">
            <p className="mb-2">
              <strong className="text-white/70">Solar Cycle 25</strong> began in December 2019 
              and peaked in mid-2024 with activity significantly exceeding predictions. 
              We're now in the declining phase, but activity remains elevated.
            </p>
            <p>
              Higher sunspot numbers mean more flares, CMEs, and aurora opportunities. 
              The next solar minimum is expected around 2030.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Context */}
      <div className="p-4 border-t border-white/10">
        <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-3">
          Notable Solar Events
        </div>
        <div className="space-y-2">
          {HISTORICAL_EVENTS.map(event => (
            <div key={event.date} className="flex items-start gap-3 text-xs">
              <span className="text-white/30 font-mono shrink-0 w-20">
                {event.date.split('-').slice(0, 2).join('-')}
              </span>
              <div>
                <span className="text-white/70">{event.name}</span>
                <span className="text-white/40 ml-1">- {event.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SolarCyclePosition
