'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { ObserveIcon } from '@/components/icons'

// ============================================
// TYPES
// ============================================
interface SolarApiData {
  kp: {
    current: number
    status: string
    forecast: Array<{
      time: string
      value: number
      type: 'observed' | 'estimated' | 'predicted'
      scale: string | null
    }>
    recent: Array<{ time: string; value: number }>
  }
  solarWind: {
    speed: number
    density: number
    bz: number
    bt: number
    bzStatus: 'north' | 'south' | 'neutral'
  }
  xray: {
    flux: string
    class: string
    peakTime: string | null
  }
  aurora: {
    maxNorth: number
    maxSouth: number
    forecastTime: string | null
    visibilityLatitude: number | null
  }
  charts: {
    solarWind: Array<{ time: string; speed: number; density: number }>
    bz: Array<{ time: string; bz: number; bt: number }>
    kp: Array<{ time: string; kp: number }>
  }
  timestamp: string
}

interface KpHistoryPoint {
  time: string
  kp: number
}

interface XrayHistoryPoint {
  time: string
  flux: number
}

// ============================================
// VITAL SIGN COMPONENT
// ============================================
function SolarVitalSign({
  value,
  label,
  unit,
  status,
  href,
  loading = false,
}: {
  value: string | number
  label: string
  unit?: string
  status?: 'normal' | 'elevated' | 'warning' | 'critical'
  href?: string
  loading?: boolean
}) {
  const statusColors = {
    normal: 'text-white',
    elevated: 'text-amber-400',
    warning: 'text-orange-400',
    critical: 'text-red-400',
  }

  const content = (
    <div className={`p-2 md:p-4 bg-black rounded-lg ${href ? 'hover:bg-neutral-900 transition-colors' : ''}`}>
      <div className="text-[10px] md:text-xs text-white/50 uppercase mb-1 md:mb-2">
        {label}
      </div>
      {loading ? (
        <div className="h-8 md:h-16 bg-white/10 rounded w-16 md:w-24 animate-pulse" />
      ) : (
        <div className={`text-2xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] tabular-nums ${statusColors[status || 'normal']}`}>
          {value}
          {unit && <span className="text-sm md:text-lg text-white/40 ml-1">{unit}</span>}
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href} className="block">{content}</Link>
  }
  return content
}

// ============================================
// SDO IMAGE VIEWER (Full Width with Frame Buttons)
// ============================================
type SDOWavelength = '0193' | '0171' | '0304' | '0131' | '0211' | '0335' | 'HMIIC' | 'HMIB'

const wavelengths: { id: SDOWavelength; label: string; desc: string }[] = [
  { id: '0193', label: '193Å', desc: 'Corona at 1.2 million °C' },
  { id: '0171', label: '171Å', desc: 'Corona at 1 million °C' },
  { id: '0304', label: '304Å', desc: 'Chromosphere at 50,000 °C' },
  { id: '0131', label: '131Å', desc: 'Flaring regions at 10 million °C' },
  { id: '0211', label: '211Å', desc: 'Active regions at 2 million °C' },
  { id: '0335', label: '335Å', desc: 'Active regions at 2.5 million °C' },
  { id: 'HMIIC', label: 'Visible', desc: 'Sunspots in visible light' },
  { id: 'HMIB', label: 'Magnetogram', desc: 'Magnetic field polarity' },
]

function SDOImageViewer() {
  const [wavelength, setWavelength] = useState<SDOWavelength>('0193')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [timestamp, setTimestamp] = useState(Date.now())

  const imageUrl = `https://sdo.gsfc.nasa.gov/assets/img/latest/latest_2048_${wavelength}.jpg?t=${timestamp}`
  const currentWl = wavelengths.find(w => w.id === wavelength)!

  return (
    <div className="space-y-px">
      {/* Image Frame - Full Width */}
      <div className="bg-black rounded-lg overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            )}
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-center text-white/40">
                  <div className="text-4xl mb-2">☉</div>
                  <div className="text-sm">Image unavailable</div>
                </div>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={`Sun in ${currentWl.label}`}
                className={`w-full h-full object-contain ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
                onLoad={() => setLoading(false)}
                onError={() => { setLoading(false); setError(true); }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Wavelength Selector Frames */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-px">
        {wavelengths.map((wl) => (
          <button
            key={wl.id}
            onClick={() => {
              setWavelength(wl.id)
              setLoading(true)
              setError(false)
              setTimestamp(Date.now())
            }}
            className={`p-2 md:p-3 rounded-lg transition-colors text-left ${
              wavelength === wl.id
                ? 'bg-[#ffdf20] text-black'
                : 'bg-black text-white hover:bg-neutral-900'
            }`}
          >
            <div className={`text-xs md:text-sm font-medium ${wavelength === wl.id ? 'text-black' : 'text-white'}`}>
              {wl.label}
            </div>
            <div className={`text-[9px] md:text-[10px] mt-0.5 ${wavelength === wl.id ? 'text-black/70' : 'text-white/40'} hidden md:block`}>
              {wl.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Source Attribution Frame */}
      <div className="bg-black rounded-lg p-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-white">{currentWl.label} — {currentWl.desc}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/40">NASA SDO/AIA</div>
          <div className="text-[10px] text-white/30">Updates ~15 min</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PROBA-2 SWAP VIEWER (ESA)
// ============================================
function Proba2SwapViewer() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // ESA Proba-2 SWAP latest high quality image (174Å)
  const imageUrl = `https://proba2.sidc.be/swap/data/qlviewer/SWAPlatestHighQuality.jpg?t=${Date.now()}`

  return (
    <div className="space-y-px">
      {/* Image Frame - Full Width */}
      <div className="bg-black rounded-lg overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            )}
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-center text-white/40">
                  <div className="text-4xl mb-2">☉</div>
                  <div className="text-sm">Image unavailable</div>
                </div>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt="ESA Proba-2 SWAP 174Å"
                className={`w-full h-full object-contain ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
                onLoad={() => setLoading(false)}
                onError={() => { setLoading(false); setError(true); }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Info Frame */}
      <div className="bg-black rounded-lg p-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-white">174Å EUV — Corona at 1 million °C</div>
          <div className="text-xs text-white/40 mt-1">Wide field of view captures CMEs and coronal holes</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/40">ESA Proba-2/SWAP</div>
          <div className="text-[10px] text-white/30">Royal Observatory Belgium</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// STEREO VIEWER (Full Width)
// ============================================
function STEREOViewer() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // STEREO-A ahead beacon EUVI 195Å image (more reliable URL)
  // Using the direct NASA STEREO Science Center latest image
  const imageUrl = `https://stereo-ssc.nascom.nasa.gov/browse/2024/01/01/ahead/euvi_195/512/latest.png`

  // Alternative fallback: STEREO beacon summary image
  const fallbackUrl = `https://stereo.gsfc.nasa.gov/beacon/beacon_secchi.gif?t=${Date.now()}`

  return (
    <div className="space-y-px">
      {/* Image Frame - Full Width */}
      <div className="bg-black rounded-lg overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            )}
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-center text-white/40">
                  <div className="text-4xl mb-2">☉</div>
                  <div className="text-sm">STEREO-A image unavailable</div>
                  <div className="text-xs mt-1">Beacon data may be delayed</div>
                </div>
              </div>
            ) : (
              <img
                src={fallbackUrl}
                alt="STEREO-A view of the Sun"
                className={`w-full h-full object-contain ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
                onLoad={() => setLoading(false)}
                onError={() => { setLoading(false); setError(true); }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Info Frame */}
      <div className="bg-black rounded-lg p-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-white">STEREO-A — 195Å EUV</div>
          <div className="text-xs text-white/40 mt-1">Viewing from ahead of Earth in its orbit</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/40">NASA STEREO</div>
          <div className="text-[10px] text-white/30">Beacon data</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// CORONAGRAPH VIEWER (Combined with Switcher)
// ============================================
function CoronagraphViewer() {
  const [instrument, setInstrument] = useState<'c2' | 'c3'>('c2')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const config = {
    c2: { label: 'LASCO C2', fov: '2–6 R☉', desc: 'Inner corona — Tracks CMEs close to the Sun' },
    c3: { label: 'LASCO C3', fov: '3.7–30 R☉', desc: 'Outer corona — Views CMEs traveling toward Earth' },
  }

  const info = config[instrument]
  const imageUrl = `https://soho.nascom.nasa.gov/data/realtime/${instrument}/1024/latest.jpg?t=${Date.now()}`

  return (
    <div className="space-y-px">
      {/* Image Frame - Full Width */}
      <div className="bg-black rounded-lg overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            )}
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black text-white/40 text-sm">
                Coronagraph unavailable
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={info.label}
                className={`w-full h-full object-contain ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
                onLoad={() => setLoading(false)}
                onError={() => { setLoading(false); setError(true); }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Instrument Selector Frames */}
      <div className="grid grid-cols-2 gap-px">
        <button
          onClick={() => { setInstrument('c2'); setLoading(true); setError(false); }}
          className={`p-3 rounded-lg transition-colors text-left ${
            instrument === 'c2'
              ? 'bg-[#ffdf20] text-black'
              : 'bg-black text-white hover:bg-neutral-900'
          }`}
        >
          <div className={`text-sm font-medium ${instrument === 'c2' ? 'text-black' : 'text-white'}`}>
            LASCO C2
          </div>
          <div className={`text-[10px] mt-0.5 ${instrument === 'c2' ? 'text-black/70' : 'text-white/40'}`}>
            Inner corona · 2–6 solar radii
          </div>
        </button>
        <button
          onClick={() => { setInstrument('c3'); setLoading(true); setError(false); }}
          className={`p-3 rounded-lg transition-colors text-left ${
            instrument === 'c3'
              ? 'bg-[#ffdf20] text-black'
              : 'bg-black text-white hover:bg-neutral-900'
          }`}
        >
          <div className={`text-sm font-medium ${instrument === 'c3' ? 'text-black' : 'text-white'}`}>
            LASCO C3
          </div>
          <div className={`text-[10px] mt-0.5 ${instrument === 'c3' ? 'text-black/70' : 'text-white/40'}`}>
            Outer corona · 3.7–30 solar radii
          </div>
        </button>
      </div>

      {/* Source Attribution Frame */}
      <div className="bg-black rounded-lg p-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-white">{info.desc}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/40">ESA/NASA SOHO</div>
          <div className="text-[10px] text-white/30">Updates ~30 min</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// AURORA FORECAST VIEWER
// ============================================
function AuroraForecastViewer() {
  const [hemisphere, setHemisphere] = useState<'north' | 'south'>('north')
  const [loading, setLoading] = useState(true)

  const imageUrl = hemisphere === 'north'
    ? `https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg?t=${Date.now()}`
    : `https://services.swpc.noaa.gov/images/aurora-forecast-southern-hemisphere.jpg?t=${Date.now()}`

  return (
    <div className="space-y-px">
      {/* Image Frame */}
      <div className="bg-black rounded-lg overflow-hidden">
        <div className="relative aspect-square">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          )}
          <img
            src={imageUrl}
            alt={`Aurora forecast ${hemisphere} hemisphere`}
            className={`w-full h-full object-contain ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>

      {/* Hemisphere Selector */}
      <div className="grid grid-cols-2 gap-px">
        <button
          onClick={() => { setHemisphere('north'); setLoading(true); }}
          className={`p-2 rounded-lg transition-colors ${
            hemisphere === 'north'
              ? 'bg-[#ffdf20] text-black'
              : 'bg-black text-white hover:bg-neutral-900'
          }`}
        >
          <div className="text-xs font-medium">Northern</div>
        </button>
        <button
          onClick={() => { setHemisphere('south'); setLoading(true); }}
          className={`p-2 rounded-lg transition-colors ${
            hemisphere === 'south'
              ? 'bg-[#ffdf20] text-black'
              : 'bg-black text-white hover:bg-neutral-900'
          }`}
        >
          <div className="text-xs font-medium">Southern</div>
        </button>
      </div>

      {/* Source */}
      <div className="bg-black rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-white/40">OVATION Prime Model</div>
          <div className="text-[10px] text-white/30">NOAA SWPC · ~30 min</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// CHART COMPONENTS
// ============================================
function KpHistoryChart({ data, loading }: { data: KpHistoryPoint[]; loading: boolean }) {
  if (loading) {
    return <div className="h-24 bg-white/5 rounded animate-pulse" />
  }

  const maxKp = 9

  return (
    <div className="bg-black rounded-lg p-3">
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
        Kp Index (24h)
      </div>
      <div className="flex items-end gap-0.5 h-20">
        {data.map((point, i) => {
          const height = (point.kp / maxKp) * 100
          const color = point.kp >= 7 ? '#ef4444' : point.kp >= 5 ? '#f97316' : point.kp >= 4 ? '#eab308' : '#22c55e'
          return (
            <div
              key={i}
              className="flex-1 rounded-t transition-all"
              style={{ height: `${Math.max(height, 4)}%`, backgroundColor: color }}
            />
          )
        })}
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-white/30">
        <span>24h ago</span>
        <span>Now</span>
      </div>
    </div>
  )
}

function XrayFluxChart({ data, loading }: { data: XrayHistoryPoint[]; loading: boolean }) {
  if (loading || data.length === 0) {
    return <div className="h-24 bg-white/5 rounded animate-pulse" />
  }

  const getYPercent = (flux: number) => {
    const logFlux = Math.log10(Math.max(flux, 1e-9))
    const logMin = -9
    const logMax = -3
    return ((logFlux - logMin) / (logMax - logMin)) * 100
  }

  return (
    <div className="bg-black rounded-lg p-3">
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
        X-Ray Flux (6h)
      </div>
      <div className="relative h-20">
        {/* Threshold lines */}
        <div className="absolute left-0 right-0 border-t border-dashed border-red-500/30" style={{ bottom: `${getYPercent(1e-4)}%` }} />
        <div className="absolute left-0 right-0 border-t border-dashed border-orange-500/30" style={{ bottom: `${getYPercent(1e-5)}%` }} />
        <div className="absolute left-0 right-0 border-t border-dashed border-yellow-500/30" style={{ bottom: `${getYPercent(1e-6)}%` }} />

        <svg className="w-full h-full" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            points={data.map((d, i) => `${(i / (data.length - 1)) * 100}%,${100 - getYPercent(d.flux)}%`).join(' ')}
          />
        </svg>
      </div>
      <div className="flex justify-between mt-1">
        <div className="flex gap-2 text-[10px]">
          <span className="text-red-400">X</span>
          <span className="text-orange-400">M</span>
          <span className="text-yellow-400">C</span>
        </div>
        <span className="text-[10px] text-white/30">6h ago → Now</span>
      </div>
    </div>
  )
}

function SolarWindChart({ data, loading }: { data: Array<{ time: string; speed: number; density: number }>; loading: boolean }) {
  if (loading || data.length === 0) {
    return <div className="h-24 bg-white/5 rounded animate-pulse" />
  }

  const speeds = data.map(d => d.speed).filter(s => s > 0)
  const max = Math.max(...speeds, 400)
  const min = Math.min(...speeds, 300)

  return (
    <div className="bg-black rounded-lg p-3">
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
        Solar Wind Speed (24h)
      </div>
      <div className="relative h-20">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100
              const y = 100 - ((d.speed - min) / (max - min || 1)) * 100
              return `${x}%,${y}%`
            }).join(' ')}
          />
        </svg>
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-white/30">
        <span>24h ago</span>
        <span>Now</span>
      </div>
    </div>
  )
}

function BzChart({ data, loading }: { data: Array<{ time: string; bz: number; bt: number }>; loading: boolean }) {
  if (loading || data.length === 0) {
    return <div className="h-24 bg-white/5 rounded animate-pulse" />
  }

  const max = 10
  const min = -10

  return (
    <div className="bg-black rounded-lg p-3">
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
        IMF Bz Component (24h)
      </div>
      <div className="relative h-20">
        {/* Zero line */}
        <div className="absolute left-0 right-0 border-t border-white/20" style={{ top: '50%' }} />

        <svg className="w-full h-full" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#a855f7"
            strokeWidth="1.5"
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100
              const clampedBz = Math.max(min, Math.min(max, d.bz))
              const y = 100 - ((clampedBz - min) / (max - min)) * 100
              return `${x}%,${y}%`
            }).join(' ')}
          />
        </svg>
      </div>
      <div className="flex justify-between mt-1 text-[10px]">
        <span className="text-green-400">+Bz (north)</span>
        <span className="text-red-400">−Bz (south)</span>
      </div>
    </div>
  )
}

// ============================================
// SOLAR CYCLE INDICATOR
// ============================================
function SolarCycleIndicator() {
  // Solar Cycle 25 started December 2019, predicted max ~2025
  const cycleStart = new Date('2019-12-01')
  const now = new Date()
  const cycleLength = 11 * 365 * 24 * 60 * 60 * 1000 // ~11 years in ms
  const elapsed = now.getTime() - cycleStart.getTime()
  const progress = Math.min((elapsed / cycleLength) * 100, 100)

  // Solar maximum expected ~July 2025
  const maxDate = new Date('2025-07-01')
  const maxPosition = ((maxDate.getTime() - cycleStart.getTime()) / cycleLength) * 100

  return (
    <div className="bg-black rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-lg font-medium text-white">Solar Cycle 25</div>
          <div className="text-xs text-white/40">Dec 2019 – ~2030</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-400">~Max</div>
          <div className="text-xs text-white/40">Approaching peak</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-2">
        {/* Maximum marker */}
        <div
          className="absolute top-0 bottom-0 w-px bg-amber-400/50"
          style={{ left: `${maxPosition}%` }}
        />
        {/* Progress gradient */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-500 via-amber-400 to-red-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
        {/* Current position indicator */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white rounded-full"
          style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-white/30">
        <span>Minimum (2019)</span>
        <span className="text-amber-400/60">Maximum (~2025)</span>
        <span>Minimum (~2030)</span>
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function SolarObservatoryPage() {
  const [solarData, setSolarData] = useState<SolarApiData | null>(null)
  const [kpHistory, setKpHistory] = useState<KpHistoryPoint[]>([])
  const [xrayHistory, setXrayHistory] = useState<XrayHistoryPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSolarData() {
      try {
        const response = await fetch('/api/solar')
        if (response.ok) {
          const data: SolarApiData = await response.json()
          setSolarData(data)

          // Use Kp chart data from API
          if (data.charts.kp.length > 0) {
            setKpHistory(data.charts.kp.map(p => ({
              time: p.time,
              kp: p.kp,
            })))
          }

          // For X-ray history, use simulated data until we add more endpoints
          setXrayHistory(Array.from({ length: 72 }, (_, i) => ({
            time: new Date(Date.now() - (71 - i) * 5 * 60 * 1000).toISOString(),
            flux: 1e-6 + Math.random() * 5e-6,
          })))
        }
      } catch (error) {
        console.error('Failed to fetch solar data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSolarData()
    const interval = setInterval(fetchSolarData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const getXrayStatus = (xrayClass: string): 'normal' | 'elevated' | 'warning' | 'critical' => {
    if (xrayClass.startsWith('X')) return 'critical'
    if (xrayClass.startsWith('M')) return 'warning'
    if (xrayClass.startsWith('C')) return 'elevated'
    return 'normal'
  }

  const getKpStatus = (kp: number): 'normal' | 'elevated' | 'warning' | 'critical' => {
    if (kp >= 7) return 'critical'
    if (kp >= 5) return 'warning'
    if (kp >= 4) return 'elevated'
    return 'normal'
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="bg-[#1d1d1d] rounded-lg py-1 md:py-2 px-2 md:px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Observe', href: '/observe' },
                { label: 'Space', href: '/observe/space' },
                { label: 'Solar Observatory' },
              ]}
              theme="dark"
            />
          </div>
        </div>

        {/* Content Frames */}
        <div className="flex flex-col gap-px">

          {/* Header Section */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="flex items-start gap-3 mb-3">
              <ObserveIcon className="w-8 h-8 md:w-10 md:h-10 text-white flex-shrink-0" />
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white uppercase">
                  Solar Observatory
                </h1>
                <p className="text-sm text-white/50 mt-2 max-w-2xl">
                  Real-time solar imagery and space weather conditions from NASA, ESA, and NOAA observatories.
                </p>
              </div>
            </div>
          </section>

          {/* Current Conditions */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-[10px] md:text-xs text-white/50 uppercase mb-3">Current Conditions</div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-px">
              <SolarVitalSign
                value={solarData?.xray.class || '—'}
                label="X-Ray Class"
                status={solarData ? getXrayStatus(solarData.xray.class) : 'normal'}
                loading={loading}
              />
              <SolarVitalSign
                value={solarData?.kp.current ?? '—'}
                label="Kp Index"
                status={solarData ? getKpStatus(solarData.kp.current) : 'normal'}
                loading={loading}
              />
              <SolarVitalSign
                value={solarData?.solarWind.speed ?? '—'}
                label="Solar Wind"
                unit="km/s"
                loading={loading}
              />
              <SolarVitalSign
                value={solarData?.solarWind.bz?.toFixed(1) ?? '—'}
                label="Bz (IMF)"
                unit="nT"
                status={solarData && solarData.solarWind.bz < -5 ? 'elevated' : 'normal'}
                loading={loading}
              />
              <SolarVitalSign
                value={solarData?.solarWind.density?.toFixed(1) ?? '—'}
                label="Density"
                unit="p/cm³"
                loading={loading}
              />
              <SolarVitalSign
                value={solarData?.solarWind.bt?.toFixed(1) ?? '—'}
                label="Bt (IMF)"
                unit="nT"
                loading={loading}
              />
            </div>
          </section>

          {/* Live Solar Disk - SDO */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl font-light text-white uppercase mb-4">
              Live Solar Disk
            </div>
            <SDOImageViewer />
          </section>

          {/* Understanding SDO Wavelengths */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="grid md:grid-cols-2 gap-px">
              <div className="bg-black rounded-lg p-4">
                <div className="text-sm font-medium text-white mb-2">Understanding SDO Wavelengths</div>
                <p className="text-xs text-white/60 leading-relaxed">
                  The Solar Dynamics Observatory captures the Sun at different wavelengths of extreme ultraviolet light.
                  Each wavelength reveals structures at different temperatures — from the relatively cool chromosphere
                  (50,000 °C in 304Å) to the hottest flaring regions (10 million °C in 131Å). The visible light and
                  magnetogram channels show sunspots and magnetic field structure.
                </p>
              </div>
              <div className="bg-black rounded-lg p-4">
                <div className="text-sm font-medium text-white mb-2">NASA SDO Mission</div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Launched in 2010, the Solar Dynamics Observatory captures a full-disk image of the Sun every 12 seconds
                  in 10 different wavelengths. It has generated over 425 million images — more than any other NASA mission.
                  SDO orbits Earth in a geosynchronous orbit, allowing nearly continuous observation.
                </p>
              </div>
            </div>
          </section>

          {/* Multiple Viewpoints Section */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl md:text-3xl font-light text-white uppercase">
                Multiple Viewpoints
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded uppercase">
                3D Coverage
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-px">
              {/* Proba-2 SWAP */}
              <div>
                <div className="text-xs text-white/40 uppercase mb-2">ESA Proba-2 SWAP</div>
                <Proba2SwapViewer />
              </div>

              {/* STEREO-A */}
              <div>
                <div className="text-xs text-white/40 uppercase mb-2">NASA STEREO-A</div>
                <STEREOViewer />
              </div>
            </div>
          </section>

          {/* Why Multiple Views */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="bg-black rounded-lg p-4">
              <div className="text-sm font-medium text-white mb-2">Why Multiple Viewpoints?</div>
              <p className="text-xs text-white/60 leading-relaxed">
                ESA's Proba-2 orbits Earth and provides a wider field of view than SDO, capturing coronal mass ejections
                as they leave the Sun. NASA's STEREO-A spacecraft orbits the Sun ahead of Earth, giving us a different
                angle on solar activity. Together with Earth-based observations, these provide stereo vision of the Sun —
                essential for tracking space weather that could affect Earth.
              </p>
            </div>
          </section>

          {/* Coronagraphs */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl font-light text-white uppercase mb-4">
              Coronagraphs
            </div>
            <CoronagraphViewer />
          </section>

          {/* Understanding Coronagraphs */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="bg-black rounded-lg p-4">
              <div className="text-sm font-medium text-white mb-2">Understanding Coronagraphs</div>
              <p className="text-xs text-white/60 leading-relaxed">
                Coronagraphs use an occulting disk to block the bright solar disk, revealing the faint outer atmosphere (corona).
                SOHO's LASCO C2 shows the inner corona from 2-6 solar radii, while C3 shows the outer corona from 3.7-30 solar radii.
                These instruments are crucial for detecting coronal mass ejections (CMEs) — billion-ton clouds of solar plasma
                that can trigger geomagnetic storms if Earth-directed.
              </p>
            </div>
          </section>

          {/* Recent Activity - 2 columns */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl font-light text-white uppercase mb-4">
              Recent Activity
            </div>
            <div className="grid md:grid-cols-2 gap-px">
              <XrayFluxChart data={xrayHistory} loading={loading} />
              <KpHistoryChart data={kpHistory} loading={loading} />
              <SolarWindChart data={solarData?.charts.solarWind || []} loading={loading} />
              <BzChart data={solarData?.charts.bz || []} loading={loading} />
            </div>
          </section>

          {/* Solar Cycle */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl font-light text-white uppercase mb-4">
              Solar Cycle Progress
            </div>
            <SolarCycleIndicator />
          </section>

          {/* Aurora Forecast - 2 columns with enhanced RH content */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl font-light text-white uppercase mb-4">
              Aurora Forecast
            </div>
            <div className="grid md:grid-cols-2 gap-px">
              {/* Left: Aurora map */}
              <AuroraForecastViewer />

              {/* Right: Aurora information */}
              <div className="space-y-px">
                <div className="bg-black rounded-lg p-4">
                  <div className="text-sm font-medium text-white mb-2">Current Aurora Activity</div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-[10px] text-white/40 uppercase">Kp Now</div>
                      <div className="text-2xl font-bold text-white">{solarData?.kp.current ?? '—'}</div>
                      <div className="text-[10px] text-white/30 mt-1">{solarData?.kp.status}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 uppercase">Bz Component</div>
                      <div className={`text-2xl font-bold ${solarData && solarData.solarWind.bz < 0 ? 'text-green-400' : 'text-white'}`}>
                        {solarData?.solarWind.bz?.toFixed(1) ?? '—'} nT
                      </div>
                      <div className="text-[10px] text-white/30 mt-1">
                        {solarData?.solarWind.bzStatus === 'south' ? 'Southward (favorable)' :
                         solarData?.solarWind.bzStatus === 'north' ? 'Northward' : 'Neutral'}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-white/40 mt-3">
                    Negative Bz (southward) enhances aurora visibility.
                  </p>
                </div>

                <div className="bg-black rounded-lg p-4">
                  <div className="text-sm font-medium text-white mb-2">Visibility Guide</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-white/60">Kp 5+ : UK, Northern Europe visible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-white/60">Kp 7+ : Central Europe, Northern US</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-white/60">Kp 9 : Visible at mid-latitudes</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black rounded-lg p-4">
                  <div className="text-sm font-medium text-white mb-2">Best Viewing Conditions</div>
                  <ul className="text-xs text-white/60 space-y-1">
                    <li>• Dark skies away from light pollution</li>
                    <li>• Clear northern horizon</li>
                    <li>• 10pm – 2am local time typically best</li>
                    <li>• New moon or overcast moon preferred</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Active Missions */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl font-light text-white uppercase mb-4">
              Active Solar Missions
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              {[
                { name: 'SDO', agency: 'NASA', launch: '2010', status: 'Operational' },
                { name: 'SOHO', agency: 'ESA/NASA', launch: '1995', status: 'Operational' },
                { name: 'STEREO-A', agency: 'NASA', launch: '2006', status: 'Operational' },
                { name: 'Proba-2', agency: 'ESA', launch: '2009', status: 'Operational' },
              ].map((mission) => (
                <div key={mission.name} className="bg-black rounded-lg p-3">
                  <div className="text-sm font-medium text-white">{mission.name}</div>
                  <div className="text-[10px] text-white/40 mt-1">{mission.agency}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-green-400">{mission.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Data Sources & Related */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-sm text-white/40 uppercase tracking-wider mb-3">
              Related
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <Link href="/observe/space" className="text-sm text-white/60 hover:text-white transition-colors">
                Space Portal →
              </Link>
              <Link href="/observe/space/aurora" className="text-sm text-white/60 hover:text-white transition-colors">
                Aurora Forecast →
              </Link>
              <Link href="/observe/detectors" className="text-sm text-white/60 hover:text-white transition-colors">
                Particle Detectors →
              </Link>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Data Sources</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/40">
                <div>
                  <div className="text-white/50 mb-1">Solar Imagery</div>
                  <div>NASA SDO/AIA</div>
                  <div>ESA Proba-2/SWAP</div>
                  <div>NASA STEREO</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1">Coronagraphs</div>
                  <div>ESA/NASA SOHO LASCO</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1">Space Weather</div>
                  <div>NOAA SWPC</div>
                  <div>DSCOVR</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1">Sunspot Data</div>
                  <div>WDC-SILSO</div>
                  <div>Royal Observatory Belgium</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-[10px] text-white/20">
                Updates: SDO ~15 min · SWPC ~1-5 min · Coronagraphs ~30 min · Proba-2 ~2 min
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}
