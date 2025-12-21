'use client'

import { useState, useEffect } from 'react'

interface ProtonFluxProps {
  className?: string
}

interface ProtonData {
  flux_10MeV: number    // >10 MeV protons (pfu)
  flux_100MeV: number   // >100 MeV protons (pfu)
  timestamp: string
}

// Solar Radiation Storm Scale (S1-S5)
function getStormScale(flux: number): { 
  scale: string
  level: number
  label: string
  color: string
  description: string
} {
  if (flux >= 100000) return { 
    scale: 'S5', 
    level: 5, 
    label: 'Extreme', 
    color: '#ef4444',
    description: 'Severe radiation hazard'
  }
  if (flux >= 10000) return { 
    scale: 'S4', 
    level: 4, 
    label: 'Severe', 
    color: '#f97316',
    description: 'High radiation risk'
  }
  if (flux >= 1000) return { 
    scale: 'S3', 
    level: 3, 
    label: 'Strong', 
    color: '#eab308',
    description: 'Elevated radiation'
  }
  if (flux >= 100) return { 
    scale: 'S2', 
    level: 2, 
    label: 'Moderate', 
    color: '#22c55e',
    description: 'Minor radiation increase'
  }
  if (flux >= 10) return { 
    scale: 'S1', 
    level: 1, 
    label: 'Minor', 
    color: '#3b82f6',
    description: 'Background levels elevated'
  }
  return { 
    scale: 'S0', 
    level: 0, 
    label: 'None', 
    color: '#6b7280',
    description: 'Normal background'
  }
}

export default function ProtonFluxIndicator({ className = '' }: ProtonFluxProps) {
  const [data, setData] = useState<ProtonData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json'
        )
        if (!response.ok) throw new Error('Failed to fetch proton data')
        const json = await response.json()

        // Get latest readings for both energy channels
        const recent = json.slice(-10)
        const latest10MeV = recent.find((d: any) => d.energy === '>=10 MeV')
        const latest100MeV = recent.find((d: any) => d.energy === '>=100 MeV')

        if (latest10MeV) {
          setData({
            flux_10MeV: parseFloat(latest10MeV.flux),
            flux_100MeV: latest100MeV ? parseFloat(latest100MeV.flux) : 0,
            timestamp: latest10MeV.time_tag,
          })
        }

        setIsLoading(false)
        setError(null)
      } catch (err) {
        setError('Unable to fetch proton data')
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const stormInfo = data ? getStormScale(data.flux_10MeV) : null

  return (
    <div className={`bg-[#0f0f14] rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-white">Proton Flux</h3>
        </div>
        <span className="text-xs text-white/40 font-mono">GOES-18</span>
      </div>

      {isLoading ? (
        <div className="px-4 py-6 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="px-4 py-6">
          <p className="text-xs text-red-400 text-center">{error}</p>
        </div>
      ) : data && stormInfo ? (
        <div className="p-4">
          {/* Storm Scale Indicator */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span 
                className="text-2xl font-mono font-bold"
                style={{ color: stormInfo.color }}
              >
                {stormInfo.scale}
              </span>
              <span className="text-sm text-white/60">{stormInfo.label}</span>
            </div>
            
            {/* Scale bar */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className="w-3 h-6 rounded-sm"
                  style={{
                    backgroundColor: level <= stormInfo.level 
                      ? stormInfo.color 
                      : 'rgba(255,255,255,0.1)'
                  }}
                />
              ))}
            </div>
          </div>

          <p className="text-xs text-white/40 mb-3">{stormInfo.description}</p>

          {/* Flux values */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-white/40 block mb-1">≥10 MeV</span>
              <span className="font-mono text-white">
                {data.flux_10MeV.toExponential(2)} pfu
              </span>
            </div>
            <div>
              <span className="text-white/40 block mb-1">≥100 MeV</span>
              <span className="font-mono text-white">
                {data.flux_100MeV.toExponential(2)} pfu
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/10 bg-black/20">
        <p className="text-xs text-white/30">
          Solar radiation storm indicator
        </p>
      </div>
    </div>
  )
}
