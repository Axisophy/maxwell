'use client'

import { useState, useEffect, useRef } from 'react'

interface XRayFluxProps {
  className?: string
}

interface FluxDataPoint {
  time_tag: string
  flux: number
}

interface FlareEvent {
  begin_time: string
  max_time: string
  end_time: string
  current_class: string
  max_class: string
}

// Flare classification thresholds (watts/m²)
const FLARE_THRESHOLDS = {
  X: 1e-4,
  M: 1e-5,
  C: 1e-6,
  B: 1e-7,
  A: 1e-8,
}

function getFlareClass(flux: number): { class: string; level: number; color: string } {
  if (flux >= FLARE_THRESHOLDS.X) {
    const level = flux / FLARE_THRESHOLDS.X
    return { class: 'X', level, color: '#ef4444' } // red
  }
  if (flux >= FLARE_THRESHOLDS.M) {
    const level = flux / FLARE_THRESHOLDS.M
    return { class: 'M', level, color: '#f97316' } // orange
  }
  if (flux >= FLARE_THRESHOLDS.C) {
    const level = flux / FLARE_THRESHOLDS.C
    return { class: 'C', level, color: '#eab308' } // yellow
  }
  if (flux >= FLARE_THRESHOLDS.B) {
    const level = flux / FLARE_THRESHOLDS.B
    return { class: 'B', level, color: '#22c55e' } // green
  }
  const level = flux / FLARE_THRESHOLDS.A
  return { class: 'A', level, color: '#3b82f6' } // blue
}

export default function XRayFluxMonitor({ className = '' }: XRayFluxProps) {
  const [fluxData, setFluxData] = useState<FluxDataPoint[]>([])
  const [currentFlux, setCurrentFlux] = useState<number | null>(null)
  const [recentFlares, setRecentFlares] = useState<FlareEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Fetch X-ray flux data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch 6-hour X-ray flux data
        const fluxResponse = await fetch(
          'https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json'
        )
        if (!fluxResponse.ok) throw new Error('Failed to fetch flux data')
        const fluxJson = await fluxResponse.json()
        
        // Filter for the short wavelength (0.05-0.4 nm) which is used for flare classification
        const shortWave = fluxJson.filter((d: any) => d.energy === '0.05-0.4nm')
        setFluxData(shortWave.slice(-72)) // Last ~6 hours at 5-min intervals
        
        if (shortWave.length > 0) {
          setCurrentFlux(shortWave[shortWave.length - 1].flux)
        }

        // Fetch recent flares
        const flaresResponse = await fetch(
          'https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json'
        )
        if (flaresResponse.ok) {
          const flaresJson = await flaresResponse.json()
          setRecentFlares(flaresJson.slice(0, 5))
        }

        setIsLoading(false)
        setError(null)
      } catch (err) {
        setError('Unable to fetch X-ray data')
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60 * 1000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Draw the flux chart
  useEffect(() => {
    if (!canvasRef.current || fluxData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = { top: 10, right: 10, bottom: 20, left: 40 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Clear canvas
    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, width, height)

    // Log scale for flux (A to X class)
    const minFlux = 1e-9
    const maxFlux = 1e-3
    const logMin = Math.log10(minFlux)
    const logMax = Math.log10(maxFlux)

    const yScale = (flux: number) => {
      const logFlux = Math.log10(Math.max(flux, minFlux))
      return padding.top + chartHeight * (1 - (logFlux - logMin) / (logMax - logMin))
    }

    const xScale = (index: number) => {
      return padding.left + (index / (fluxData.length - 1)) * chartWidth
    }

    // Draw flare class threshold lines
    const thresholds = [
      { class: 'X', flux: 1e-4, color: 'rgba(239, 68, 68, 0.3)' },
      { class: 'M', flux: 1e-5, color: 'rgba(249, 115, 22, 0.3)' },
      { class: 'C', flux: 1e-6, color: 'rgba(234, 179, 8, 0.3)' },
      { class: 'B', flux: 1e-7, color: 'rgba(34, 197, 94, 0.3)' },
    ]

    thresholds.forEach(({ class: cls, flux, color }) => {
      const y = yScale(flux)
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()
      
      // Label
      ctx.fillStyle = color.replace('0.3', '0.6')
      ctx.font = '10px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(cls, padding.left - 4, y + 3)
    })

    ctx.setLineDash([])

    // Draw flux line
    ctx.beginPath()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5

    fluxData.forEach((point, i) => {
      const x = xScale(i)
      const y = yScale(point.flux)
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Fill gradient under line
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    
    ctx.lineTo(xScale(fluxData.length - 1), height - padding.bottom)
    ctx.lineTo(xScale(0), height - padding.bottom)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Time labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.font = '9px monospace'
    ctx.textAlign = 'center'
    
    const firstTime = new Date(fluxData[0].time_tag)
    const lastTime = new Date(fluxData[fluxData.length - 1].time_tag)
    
    ctx.fillText(
      firstTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      padding.left,
      height - 4
    )
    ctx.fillText(
      lastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      width - padding.right,
      height - 4
    )

  }, [fluxData])

  const flareInfo = currentFlux ? getFlareClass(currentFlux) : null

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
          <h3 className="text-sm font-medium text-white">X-Ray Flux</h3>
        </div>
        <span className="text-xs text-white/40 font-mono">GOES-18</span>
      </div>

      {/* Current Reading */}
      <div className="px-4 py-4 border-b border-white/10">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            <span className="text-sm text-white/40">Loading...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : flareInfo && currentFlux ? (
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span 
                className="text-4xl font-mono font-bold"
                style={{ color: flareInfo.color }}
              >
                {flareInfo.class}{flareInfo.level.toFixed(1)}
              </span>
              <span className="text-sm text-white/40">class</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono text-white/40">
                {currentFlux.toExponential(2)} W/m²
              </p>
              <p className="text-xs text-white/30">
                0.1–0.8 nm
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Chart */}
      <div className="h-32 bg-[#0a0a0f]">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      </div>

      {/* Recent Flares */}
      {recentFlares.length > 0 && (
        <div className="px-4 py-3 border-t border-white/10">
          <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">
            Recent Flares (24h)
          </p>
          <div className="space-y-1">
            {recentFlares.slice(0, 3).map((flare, i) => {
              const maxTime = new Date(flare.max_time)
              const classInfo = flare.max_class ? getFlareClass(
                parseFloat(flare.max_class.slice(1)) * 
                (flare.max_class[0] === 'X' ? 1e-4 : 
                 flare.max_class[0] === 'M' ? 1e-5 :
                 flare.max_class[0] === 'C' ? 1e-6 : 1e-7)
              ) : null
              
              return (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span 
                    className="font-mono font-medium"
                    style={{ color: classInfo?.color || '#888' }}
                  >
                    {flare.max_class || flare.current_class}
                  </span>
                  <span className="text-white/30">
                    {maxTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/10 bg-black/20">
        <p className="text-xs text-white/30">
          Solar X-ray flux • Flare detection
        </p>
      </div>
    </div>
  )
}
