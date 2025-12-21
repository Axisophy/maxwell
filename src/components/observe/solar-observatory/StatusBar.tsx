'use client'

import { useState, useEffect } from 'react'

interface StatusBarProps {
  className?: string
}

interface SolarStatus {
  xrayClass: string
  xrayFlux: number
  kp: number
  solarWind: number
  protonFlux: number
  timestamp: Date
}

function getXrayColor(cls: string): string {
  if (cls.startsWith('X')) return '#ef4444'
  if (cls.startsWith('M')) return '#f97316'
  if (cls.startsWith('C')) return '#eab308'
  if (cls.startsWith('B')) return '#22c55e'
  return '#3b82f6'
}

function getKpColor(kp: number): string {
  if (kp >= 7) return '#ef4444'
  if (kp >= 5) return '#eab308'
  if (kp >= 4) return '#22c55e'
  return '#3b82f6'
}

function getWindColor(speed: number): string {
  if (speed >= 700) return '#ef4444'
  if (speed >= 500) return '#eab308'
  return '#22c55e'
}

export default function StatusBar({ className = '' }: StatusBarProps) {
  const [status, setStatus] = useState<SolarStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Fetch X-ray flux
        const xrayRes = await fetch(
          'https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json'
        )
        const xrayData = await xrayRes.json()
        const shortWave = xrayData.filter((d: any) => d.energy === '0.05-0.4nm')
        const latestXray = shortWave[shortWave.length - 1]
        
        // Fetch Kp index
        const kpRes = await fetch(
          'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'
        )
        const kpData = await kpRes.json()
        const latestKp = kpData[kpData.length - 1]
        
        // Fetch solar wind
        const windRes = await fetch(
          'https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json'
        )
        const windData = await windRes.json()
        const validWind = windData.slice(1).filter((d: any[]) => d[2] !== null)
        const latestWind = validWind[validWind.length - 1]

        // Calculate X-ray class
        const flux = parseFloat(latestXray?.flux || '0')
        let xrayClass = 'A'
        if (flux >= 1e-4) xrayClass = 'X' + (flux / 1e-4).toFixed(1)
        else if (flux >= 1e-5) xrayClass = 'M' + (flux / 1e-5).toFixed(1)
        else if (flux >= 1e-6) xrayClass = 'C' + (flux / 1e-6).toFixed(1)
        else if (flux >= 1e-7) xrayClass = 'B' + (flux / 1e-7).toFixed(1)
        else xrayClass = 'A' + (flux / 1e-8).toFixed(1)

        setStatus({
          xrayClass,
          xrayFlux: flux,
          kp: parseFloat(latestKp?.[1] || '0'),
          solarWind: parseFloat(latestWind?.[2] || '0'),
          protonFlux: 0, // Could add this too
          timestamp: new Date(),
        })
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to fetch solar status:', err)
        setIsLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`bg-[#0f0f14] rounded-xl border border-white/10 ${className}`}>
      <div className="px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
            Current Conditions
          </span>
        </div>

        {isLoading ? (
          <span className="text-xs text-white/40">Loading...</span>
        ) : status ? (
          <>
            {/* X-Ray */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">X-Ray:</span>
              <span 
                className="text-sm font-mono font-medium"
                style={{ color: getXrayColor(status.xrayClass) }}
              >
                {status.xrayClass}
              </span>
            </div>

            {/* Kp Index */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Kp:</span>
              <span 
                className="text-sm font-mono font-medium"
                style={{ color: getKpColor(status.kp) }}
              >
                {status.kp.toFixed(1)}
              </span>
            </div>

            {/* Solar Wind */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Solar Wind:</span>
              <span 
                className="text-sm font-mono font-medium"
                style={{ color: getWindColor(status.solarWind) }}
              >
                {Math.round(status.solarWind)} km/s
              </span>
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-white/30 font-mono">
                Updated {status.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
              </span>
            </div>
          </>
        ) : (
          <span className="text-xs text-white/40">Unable to fetch status</span>
        )}
      </div>
    </div>
  )
}
