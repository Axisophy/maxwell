'use client'

import { useState, useEffect } from 'react'

interface SolarWindMonitorProps {
  className?: string
}

interface SolarWindData {
  speed: number      // km/s
  density: number    // protons/cm³
  temperature: number // Kelvin
  bz: number         // nT (north-south component of IMF)
  bt: number         // nT (total field)
  timestamp: string
}

function getSpeedStatus(speed: number): { label: string; color: string } {
  if (speed >= 800) return { label: 'Extreme', color: '#ef4444' }
  if (speed >= 600) return { label: 'High', color: '#f97316' }
  if (speed >= 500) return { label: 'Elevated', color: '#eab308' }
  if (speed >= 350) return { label: 'Normal', color: '#22c55e' }
  return { label: 'Low', color: '#3b82f6' }
}

function getBzStatus(bz: number): { label: string; color: string; aurora: string } {
  if (bz <= -20) return { label: 'Strong South', color: '#ef4444', aurora: 'Major storm likely' }
  if (bz <= -10) return { label: 'Moderate South', color: '#f97316', aurora: 'Storm possible' }
  if (bz <= -5) return { label: 'Weak South', color: '#eab308', aurora: 'Aurora likely at high latitudes' }
  if (bz >= 5) return { label: 'North', color: '#22c55e', aurora: 'Quiet conditions' }
  return { label: 'Neutral', color: '#3b82f6', aurora: 'Quiet conditions' }
}

export default function SolarWindMonitor({ className = '' }: SolarWindMonitorProps) {
  const [data, setData] = useState<SolarWindData | null>(null)
  const [history, setHistory] = useState<SolarWindData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plasma data (speed, density, temperature)
        const plasmaResponse = await fetch(
          'https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json'
        )
        if (!plasmaResponse.ok) throw new Error('Failed to fetch plasma data')
        const plasmaJson = await plasmaResponse.json()
        
        // Fetch magnetic field data (Bz, Bt)
        const magResponse = await fetch(
          'https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json'
        )
        if (!magResponse.ok) throw new Error('Failed to fetch magnetic data')
        const magJson = await magResponse.json()

        // Skip header row and get recent data
        const plasmaData = plasmaJson.slice(1).filter((row: any[]) => 
          row[1] !== null && row[2] !== null
        )
        const magData = magJson.slice(1).filter((row: any[]) => 
          row[1] !== null && row[3] !== null
        )

        if (plasmaData.length > 0 && magData.length > 0) {
          // Get most recent readings
          const latestPlasma = plasmaData[plasmaData.length - 1]
          const latestMag = magData[magData.length - 1]

          const currentData: SolarWindData = {
            timestamp: latestPlasma[0],
            density: parseFloat(latestPlasma[1]),
            speed: parseFloat(latestPlasma[2]),
            temperature: parseFloat(latestPlasma[3] || '0'),
            bz: parseFloat(latestMag[3]),
            bt: parseFloat(latestMag[6] || latestMag[1]),
          }

          setData(currentData)

          // Build history for sparklines (last 6 hours)
          const historyPoints: SolarWindData[] = []
          const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000
          
          for (let i = Math.max(0, plasmaData.length - 72); i < plasmaData.length; i += 3) {
            const plasma = plasmaData[i]
            const mag = magData[Math.min(i, magData.length - 1)]
            if (plasma && mag) {
              historyPoints.push({
                timestamp: plasma[0],
                density: parseFloat(plasma[1]) || 0,
                speed: parseFloat(plasma[2]) || 0,
                temperature: parseFloat(plasma[3]) || 0,
                bz: parseFloat(mag[3]) || 0,
                bt: parseFloat(mag[6] || mag[1]) || 0,
              })
            }
          }
          setHistory(historyPoints)
        }

        setIsLoading(false)
        setError(null)
      } catch (err) {
        console.error('Solar wind fetch error:', err)
        setError('Unable to fetch solar wind data')
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60 * 1000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const speedStatus = data ? getSpeedStatus(data.speed) : null
  const bzStatus = data ? getBzStatus(data.bz) : null

  // Simple sparkline SVG
  const renderSparkline = (values: number[], color: string, minVal?: number, maxVal?: number) => {
    if (values.length < 2) return null
    
    const min = minVal ?? Math.min(...values)
    const max = maxVal ?? Math.max(...values)
    const range = max - min || 1
    
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * 100
      const y = 100 - ((v - min) / range) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-8">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  return (
    <div className={`bg-[#0f0f14] rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-white/40">LIVE</span>
          </div>
          <h3 className="text-sm font-medium text-white">Solar Wind</h3>
        </div>
        <span className="text-xs text-white/40 font-mono">DSCOVR @ L1</span>
      </div>

      {isLoading ? (
        <div className="px-4 py-8 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            <span className="text-sm text-white/40">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="px-4 py-8">
          <p className="text-sm text-red-400 text-center">{error}</p>
        </div>
      ) : data ? (
        <>
          {/* Speed */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40 uppercase tracking-wider">Speed</span>
              <span 
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: `${speedStatus?.color}20`, color: speedStatus?.color }}
              >
                {speedStatus?.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-white">
                {Math.round(data.speed)}
              </span>
              <span className="text-sm text-white/40">km/s</span>
            </div>
            {history.length > 1 && (
              <div className="mt-2 opacity-60">
                {renderSparkline(history.map(h => h.speed), speedStatus?.color || '#fff', 200, 900)}
              </div>
            )}
          </div>

          {/* Bz (IMF) - Critical for aurora */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40 uppercase tracking-wider">IMF Bz</span>
              <span 
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: `${bzStatus?.color}20`, color: bzStatus?.color }}
              >
                {bzStatus?.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-white">
                {data.bz > 0 ? '+' : ''}{data.bz.toFixed(1)}
              </span>
              <span className="text-sm text-white/40">nT</span>
            </div>
            {history.length > 1 && (
              <div className="mt-2 opacity-60">
                {renderSparkline(history.map(h => h.bz), bzStatus?.color || '#fff', -30, 30)}
              </div>
            )}
            <p className="text-xs text-white/30 mt-2">{bzStatus?.aurora}</p>
          </div>

          {/* Secondary metrics */}
          <div className="grid grid-cols-2 divide-x divide-white/10">
            {/* Density */}
            <div className="px-4 py-3">
              <span className="text-xs text-white/40 uppercase tracking-wider block mb-1">
                Density
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-mono font-medium text-white">
                  {data.density.toFixed(1)}
                </span>
                <span className="text-xs text-white/40">p/cm³</span>
              </div>
            </div>

            {/* Total Field */}
            <div className="px-4 py-3">
              <span className="text-xs text-white/40 uppercase tracking-wider block mb-1">
                Bt Total
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-mono font-medium text-white">
                  {data.bt.toFixed(1)}
                </span>
                <span className="text-xs text-white/40">nT</span>
              </div>
            </div>
          </div>

          {/* Travel time indicator */}
          <div className="px-4 py-2 bg-black/30 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-amber-500">⚡</span>
              <span className="text-xs text-white/40">
                ~{Math.round(1500000 / data.speed / 60)} min to Earth at current speed
              </span>
            </div>
          </div>
        </>
      ) : null}

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/10 bg-black/20">
        <p className="text-xs text-white/30">
          Measured 1 million miles upstream • ~15-60 min warning
        </p>
      </div>
    </div>
  )
}
