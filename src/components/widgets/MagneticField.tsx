'use client'

import { useState, useEffect, useRef } from 'react'

// ===========================================
// MAGNETIC FIELD
// ===========================================
// Earth's geomagnetic field at your location
// Shows field strength, declination, inclination
// ===========================================

interface MagneticData {
  timestamp: string
  location: { lat: number; lon: number }
  totalField: number // nT (nanotesla)
  horizontalIntensity: number
  verticalIntensity: number
  declination: number // degrees (magnetic vs true north difference)
  inclination: number // degrees (dip angle)
  isNorthernHemisphere: boolean
  distanceToMagneticPole: number // km
  magneticLatitude: number
  secularVariation: string
  fieldStrengthDescription: 'weak' | 'average' | 'strong'
}

// Generate realistic magnetic field data for a location
function generateMagneticData(lat: number, lon: number): MagneticData {
  const absLat = Math.abs(lat)

  // Total field increases with latitude (25,000 nT at equator to 65,000 nT at poles)
  const baseField = 25000 + (absLat / 90) * 40000
  const totalField = Math.round(baseField + (Math.random() - 0.5) * 2000)

  // Horizontal intensity decreases toward poles
  const horizFactor = Math.cos(absLat * Math.PI / 180)
  const horizontalIntensity = Math.round(totalField * horizFactor * 0.8)

  // Vertical intensity increases toward poles
  const verticalIntensity = Math.round(Math.sqrt(totalField * totalField - horizontalIntensity * horizontalIntensity))

  // Declination varies by location
  const declination = -2 + lon * 0.05 + (Math.random() - 0.5) * 3

  // Inclination (dip angle)
  const inclination = Math.atan2(2 * Math.tan(lat * Math.PI / 180), 1) * 180 / Math.PI

  // Magnetic pole distance
  const magPoleLat = 86.5
  const magPoleLon = -164
  const distToMagPole = Math.round(
    111 * Math.sqrt(
      Math.pow(lat - magPoleLat, 2) +
      Math.pow((lon - magPoleLon) * Math.cos(lat * Math.PI / 180), 2)
    )
  )

  const magneticLatitude = Math.round(lat + 10 * Math.sin((lon + 70) * Math.PI / 180))

  let fieldStrengthDescription: 'weak' | 'average' | 'strong'
  if (totalField < 35000) fieldStrengthDescription = 'weak'
  else if (totalField > 55000) fieldStrengthDescription = 'strong'
  else fieldStrengthDescription = 'average'

  return {
    timestamp: new Date().toISOString(),
    location: { lat, lon },
    totalField,
    horizontalIntensity,
    verticalIntensity,
    declination: Math.round(declination * 10) / 10,
    inclination: Math.round(inclination * 10) / 10,
    isNorthernHemisphere: lat > 0,
    distanceToMagneticPole: distToMagPole,
    magneticLatitude,
    secularVariation: '+0.12°/yr E',
    fieldStrengthDescription
  }
}

export default function MagneticField() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [data, setData] = useState<MagneticData | null>(null)
  const [animationPhase, setAnimationPhase] = useState(0)

  // Get location and generate data
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setData(generateMagneticData(pos.coords.latitude, pos.coords.longitude)),
          () => setData(generateMagneticData(51.5, -0.1))
        )
      } else {
        setData(generateMagneticData(51.5, -0.1))
      }
    }
    getLocation()
  }, [])

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setBaseFontSize(width / 25)
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Animate field lines
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(p => (p + 0.015) % 1)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Draw magnetic field visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const cx = width / 2
    const cy = height / 2

    // Clear
    ctx.fillStyle = '#0f1729'
    ctx.fillRect(0, 0, width, height)

    // Draw Earth
    const earthRadius = width * 0.12
    const earthGrad = ctx.createRadialGradient(
      cx - earthRadius * 0.3, cy - earthRadius * 0.3, 0,
      cx, cy, earthRadius
    )
    earthGrad.addColorStop(0, '#60a5fa')
    earthGrad.addColorStop(0.5, '#2563eb')
    earthGrad.addColorStop(1, '#1e40af')

    ctx.beginPath()
    ctx.arc(cx, cy, earthRadius, 0, Math.PI * 2)
    ctx.fillStyle = earthGrad
    ctx.fill()

    // Draw magnetic field lines
    const numLines = 6
    const lineColor = 'rgba(147, 197, 253, 0.25)'

    for (let i = 0; i < numLines; i++) {
      const startAngle = (i / numLines) * Math.PI * 2 + animationPhase * Math.PI * 2

      ctx.beginPath()
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 1.5

      for (let t = 0; t <= 1; t += 0.02) {
        const r = earthRadius * (1 + 2.5 * Math.sin(t * Math.PI))
        const angle = startAngle + (t - 0.5) * 0.7
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r * 0.55

        if (t === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // Draw compass showing declination
    const compassRadius = width * 0.08
    const compassX = width * 0.15
    const compassY = height * 0.22

    // Compass background
    ctx.beginPath()
    ctx.arc(compassX, compassY, compassRadius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 1
    ctx.stroke()

    // True north line (dashed)
    ctx.beginPath()
    ctx.moveTo(compassX, compassY - compassRadius * 0.85)
    ctx.lineTo(compassX, compassY + compassRadius * 0.85)
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.setLineDash([2, 2])
    ctx.stroke()
    ctx.setLineDash([])

    // Magnetic north arrow
    const decRad = (data.declination) * Math.PI / 180
    ctx.save()
    ctx.translate(compassX, compassY)
    ctx.rotate(decRad)

    ctx.beginPath()
    ctx.moveTo(0, -compassRadius * 0.75)
    ctx.lineTo(-3, compassRadius * 0.25)
    ctx.lineTo(3, compassRadius * 0.25)
    ctx.closePath()
    ctx.fillStyle = '#ef4444'
    ctx.fill()

    ctx.restore()

    // N label
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = `${baseFontSize * 0.4}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('N', compassX, compassY - compassRadius - 4)

    // Field strength bar
    const barX = width * 0.88
    const barHeight = height * 0.5
    const barWidth = width * 0.035
    const barY = (height - barHeight) / 2

    ctx.fillStyle = 'rgba(255,255,255,0.1)'
    ctx.fillRect(barX - barWidth/2, barY, barWidth, barHeight)

    const fillFraction = (data.totalField - 25000) / 40000
    const fillHeight = barHeight * Math.max(0, Math.min(1, fillFraction))

    const barGrad = ctx.createLinearGradient(0, barY + barHeight, 0, barY)
    barGrad.addColorStop(0, '#22c55e')
    barGrad.addColorStop(0.5, '#eab308')
    barGrad.addColorStop(1, '#ef4444')

    ctx.fillStyle = barGrad
    ctx.fillRect(barX - barWidth/2, barY + barHeight - fillHeight, barWidth, fillHeight)

  }, [data, baseFontSize, animationPhase])

  if (!data) {
    return (
      <div ref={containerRef} className="w-full aspect-square bg-[#0f1729] flex items-center justify-center">
        <span className="text-white/50 text-[0.75em]">Measuring field...</span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full aspect-[4/5] bg-[#0f1729] overflow-hidden flex flex-col"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-[1em] py-[0.75em] border-b border-white/10">
        <div className="flex items-center gap-[0.5em]">
          <div className="w-[0.5em] h-[0.5em] rounded-full bg-[#60a5fa]" />
          <span className="text-[0.75em] font-medium text-white">Magnetic Field</span>
        </div>
        <div className="font-mono text-[1.25em] font-bold text-[#93c5fd]">
          {(data.totalField / 1000).toFixed(1)}<span className="text-[0.5em] text-white/50 ml-[0.25em]">μT</span>
        </div>
      </div>

      {/* Field visualization */}
      <div className="relative flex-1 min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Field components */}
      <div className="px-[0.75em] py-[0.5em] bg-white/5">
        <div className="grid grid-cols-3 gap-[0.5em]">
          <div className="bg-white/5 rounded-[0.375em] p-[0.5em]">
            <div className="text-[0.4375em] text-white/40 uppercase tracking-wider">Horizontal</div>
            <div className="font-mono text-[0.75em] text-white font-medium">
              {data.horizontalIntensity.toLocaleString()}<span className="text-white/40 text-[0.75em]"> nT</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-[0.375em] p-[0.5em]">
            <div className="text-[0.4375em] text-white/40 uppercase tracking-wider">Vertical</div>
            <div className="font-mono text-[0.75em] text-white font-medium">
              {data.verticalIntensity.toLocaleString()}<span className="text-white/40 text-[0.75em]"> nT</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-[0.375em] p-[0.5em]">
            <div className="text-[0.4375em] text-white/40 uppercase tracking-wider">Inclination</div>
            <div className="font-mono text-[0.75em] text-white font-medium">
              {data.inclination}°
            </div>
          </div>
        </div>
      </div>

      {/* Declination detail */}
      <div className="px-[0.75em] py-[0.5em] border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[0.4375em] text-white/40 uppercase tracking-wider">
              Magnetic Declination
            </div>
            <div className="flex items-baseline gap-[0.375em]">
              <span className="font-mono text-[1em] text-white font-bold">
                {Math.abs(data.declination)}°
              </span>
              <span className="text-[0.625em] text-white/50">
                {data.declination < 0 ? 'West' : data.declination > 0 ? 'East' : 'True'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[0.4375em] text-white/40">Secular variation</div>
            <div className="text-[0.5625em] font-mono text-[#93c5fd]">{data.secularVariation}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-[0.75em] py-[0.5em] border-t border-white/10 bg-white/5">
        <span className="text-[0.4375em] text-white/40">
          {data.distanceToMagneticPole.toLocaleString()} km to magnetic pole
        </span>
        <span className={`text-[0.4375em] px-[0.5em] py-[0.125em] rounded-full font-medium ${
          data.fieldStrengthDescription === 'strong'
            ? 'bg-green-900/50 text-green-400'
            : data.fieldStrengthDescription === 'weak'
            ? 'bg-amber-900/50 text-amber-400'
            : 'bg-blue-900/50 text-blue-400'
        }`}>
          {data.fieldStrengthDescription} field
        </span>
      </div>
    </div>
  )
}
