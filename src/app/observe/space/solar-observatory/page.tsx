'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { ObserveIcon } from '@/components/icons'

// Types
interface SolarConditions {
  xrayClass: string
  xrayFlux: number
  kp: number
  solarWind: number
  bzComponent: number
  sunspotNumber: number
  f107Flux: number
  protonFlux: number
  updatedAt: string
}

interface KpHistoryPoint {
  time: string
  kp: number
}

interface XrayHistoryPoint {
  time: string
  flux: number
}

interface SolarWindHistoryPoint {
  time: string
  speed: number
  bz: number
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
// SDO IMAGE VIEWER (Full Width)
// ============================================
type SDOWavelength = '0193' | '0171' | '0304' | '0131' | '0211' | '0335' | 'HMIIC' | 'HMIB'

const wavelengths: { id: SDOWavelength; label: string; temp: string }[] = [
  { id: '0193', label: '193Å', temp: '1.2M °C' },
  { id: '0171', label: '171Å', temp: '1M °C' },
  { id: '0304', label: '304Å', temp: '50K °C' },
  { id: '0131', label: '131Å', temp: '10M °C' },
  { id: '0211', label: '211Å', temp: '2M °C' },
  { id: '0335', label: '335Å', temp: '2.5M °C' },
  { id: 'HMIIC', label: 'Visible', temp: 'Sunspots' },
  { id: 'HMIB', label: 'Magnetogram', temp: 'Magnetic' },
]

function SDOImageViewer() {
  const [wavelength, setWavelength] = useState<SDOWavelength>('0193')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [timestamp, setTimestamp] = useState(Date.now())

  const imageUrl = `https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_${wavelength}.jpg?t=${timestamp}`
  const currentWl = wavelengths.find(w => w.id === wavelength)!

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {/* Wavelength selector */}
      <div className="p-2 flex flex-wrap gap-px">
        {wavelengths.map((wl) => (
          <button
            key={wl.id}
            onClick={() => { setWavelength(wl.id); setLoading(true); setError(false); setTimestamp(Date.now()); }}
            className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-colors uppercase ${
              wavelength === wl.id
                ? 'bg-[#ffdf20] text-[#404040]'
                : 'bg-white/10 text-white/60 hover:text-white'
            }`}
          >
            {wl.label}
          </button>
        ))}
      </div>

      {/* Image - full width, large */}
      <div className="relative aspect-square bg-black max-w-3xl mx-auto">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/40">
              <div className="text-4xl mb-2">☉</div>
              <div className="text-sm">Image unavailable</div>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`Sun in ${currentWl.label}`}
            className={`w-full h-full object-contain ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        )}
      </div>

      {/* Caption */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div>
            <div className="text-sm font-medium text-white">{currentWl.label}</div>
            <div className="text-xs text-white/40">{currentWl.temp}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/40">NASA SDO/AIA</div>
            <div className="text-[10px] text-white/30">~15 min delay</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// STEREO VIEWER
// ============================================
function STEREOViewer() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // STEREO-A 195Å image
  const imageUrl = `https://stereo-ssc.nascom.nasa.gov/beacon/beacon_secchi.jpg?t=${Date.now()}`

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="relative aspect-square bg-black">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
            Image unavailable
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="STEREO-A view of the Sun"
            className={`w-full h-full object-contain ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        )}
      </div>
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-white">STEREO-A</div>
            <div className="text-xs text-white/40">195Å EUV</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/40">NASA STEREO</div>
            <div className="text-[10px] text-white/30">Daily update</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// CORONAGRAPH VIEWER
// ============================================
function CoronagraphViewer({ instrument }: { instrument: 'c2' | 'c3' }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const config = {
    c2: { label: 'LASCO C2', fov: '2–6 R☉', desc: 'Inner corona' },
    c3: { label: 'LASCO C3', fov: '3.7–30 R☉', desc: 'Outer corona' },
  }

  const info = config[instrument]
  const imageUrl = `https://soho.nascom.nasa.gov/data/realtime/${instrument}/1024/latest.jpg?t=${Date.now()}`

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="relative aspect-square bg-black">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
            Unavailable
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={info.label}
            className={`w-full h-full object-contain ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        )}
      </div>
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-white">{info.label}</div>
            <div className="text-xs text-white/40">{info.desc}</div>
          </div>
          <div className="text-xs text-white/30">{info.fov}</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// KP HISTORY CHART
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
      <div className="flex items-end gap-0.5 h-16">
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

// ============================================
// X-RAY FLUX CHART
// ============================================
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
      <div className="relative h-16">
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

// ============================================
// SOLAR WIND CHART
// ============================================
function SolarWindChart({ data, loading }: { data: SolarWindHistoryPoint[]; loading: boolean }) {
  if (loading || data.length === 0) {
    return <div className="h-24 bg-white/5 rounded animate-pulse" />
  }

  const maxSpeed = 900
  const minSpeed = 200

  return (
    <div className="bg-black rounded-lg p-3">
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
        Solar Wind Speed (6h)
      </div>
      <div className="relative h-16">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100
              const y = 100 - ((d.speed - minSpeed) / (maxSpeed - minSpeed)) * 100
              return `${x}%,${Math.max(0, Math.min(100, y))}%`
            }).join(' ')}
          />
        </svg>
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-white/30">
        <span>6h ago</span>
        <span>Now</span>
      </div>
    </div>
  )
}

// ============================================
// Bz COMPONENT CHART
// ============================================
function BzChart({ data, loading }: { data: SolarWindHistoryPoint[]; loading: boolean }) {
  if (loading || data.length === 0) {
    return <div className="h-24 bg-white/5 rounded animate-pulse" />
  }

  return (
    <div className="bg-black rounded-lg p-3">
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
        IMF Bz Component (6h)
      </div>
      <div className="relative h-16">
        <div className="absolute left-0 right-0 top-1/2 border-t border-white/20" />

        <svg className="w-full h-full" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100
              const y = 50 - (d.bz / 30) * 50
              return `${x}%,${Math.max(0, Math.min(100, y))}%`
            }).join(' ')}
          />
        </svg>
      </div>
      <div className="flex justify-between mt-1 text-[10px]">
        <span className="text-green-400">South (-) = Aurora</span>
        <span className="text-white/30">North (+)</span>
      </div>
    </div>
  )
}

// ============================================
// AURORA FORECAST IMAGE
// ============================================
function AuroraForecast() {
  const [hemisphere, setHemisphere] = useState<'north' | 'south'>('north')
  const [loading, setLoading] = useState(true)

  const imageUrl = `https://services.swpc.noaa.gov/images/aurora-forecast-${hemisphere === 'north' ? 'northern' : 'southern'}-hemisphere.jpg?t=${Date.now()}`

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="p-2 flex gap-px">
        <button
          onClick={() => { setHemisphere('north'); setLoading(true); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors uppercase ${
            hemisphere === 'north'
              ? 'bg-[#ffdf20] text-[#404040]'
              : 'bg-white/10 text-white/60 hover:text-white'
          }`}
        >
          North
        </button>
        <button
          onClick={() => { setHemisphere('south'); setLoading(true); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors uppercase ${
            hemisphere === 'south'
              ? 'bg-[#ffdf20] text-[#404040]'
              : 'bg-white/10 text-white/60 hover:text-white'
          }`}
        >
          South
        </button>
      </div>

      <div className="relative aspect-square bg-black">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
        <img
          src={imageUrl}
          alt={`Aurora forecast ${hemisphere}`}
          className={`w-full h-full object-contain ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
        />
      </div>

      <div className="p-3 border-t border-white/10">
        <div className="text-xs text-white/40">OVATION Prime Model · NOAA SWPC</div>
      </div>
    </div>
  )
}

// ============================================
// SOLAR CYCLE INDICATOR
// ============================================
function SolarCycleIndicator() {
  // Solar Cycle 25 started December 2019
  // Expected maximum around July 2025
  // Cycle typically lasts ~11 years
  const cycleStart = new Date('2019-12-01')
  const expectedMax = new Date('2025-07-01')
  const cycleEnd = new Date('2030-12-01') // Estimated

  const now = new Date()
  const totalDays = (cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)
  const elapsedDays = (now.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)
  const progress = Math.min(elapsedDays / totalDays, 1)

  const maxProgress = (expectedMax.getTime() - cycleStart.getTime()) / (cycleEnd.getTime() - cycleStart.getTime())

  const yearsIn = Math.floor(elapsedDays / 365)
  const phase = progress < maxProgress ? 'Rising' : 'Declining'

  return (
    <div className="bg-black rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-lg font-medium text-white">Solar Cycle 25</div>
          <div className="text-xs text-white/40">~11 year cycle</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-400">{yearsIn}</div>
          <div className="text-xs text-white/40">years in</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-2">
        {/* Solar maximum marker */}
        <div
          className="absolute top-0 bottom-0 w-px bg-amber-400/50"
          style={{ left: `${maxProgress * 100}%` }}
        />
        {/* Progress */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-500 via-amber-400 to-red-500 rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
        {/* Current position marker */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white rounded-full"
          style={{ left: `${progress * 100}%`, transform: 'translateX(-50%)' }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-white/30">
        <span>Dec 2019</span>
        <span className="text-amber-400/60">Max ~Jul 2025</span>
        <span>~2030</span>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
        <span className="text-xs text-white/50">Current phase:</span>
        <span className={`text-xs font-medium ${phase === 'Rising' ? 'text-amber-400' : 'text-blue-400'}`}>
          {phase}
        </span>
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function SolarObservatoryPage() {
  const [conditions, setConditions] = useState<SolarConditions | null>(null)
  const [kpHistory, setKpHistory] = useState<KpHistoryPoint[]>([])
  const [xrayHistory, setXrayHistory] = useState<XrayHistoryPoint[]>([])
  const [windHistory, setWindHistory] = useState<SolarWindHistoryPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAllData() {
      try {
        // Fetch X-ray flux
        const xrayRes = await fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json')
        const xrayData = await xrayRes.json()
        const shortWave = xrayData.filter((d: any) => d.energy === '0.05-0.4nm')

        const latestXray = shortWave[shortWave.length - 1]
        const flux = parseFloat(latestXray?.flux || '0')
        let xrayClass = 'A'
        if (flux >= 1e-4) xrayClass = 'X' + (flux / 1e-4).toFixed(1)
        else if (flux >= 1e-5) xrayClass = 'M' + (flux / 1e-5).toFixed(1)
        else if (flux >= 1e-6) xrayClass = 'C' + (flux / 1e-6).toFixed(1)
        else if (flux >= 1e-7) xrayClass = 'B' + (flux / 1e-7).toFixed(1)

        setXrayHistory(shortWave.slice(-72).map((d: any) => ({
          time: d.time_tag,
          flux: parseFloat(d.flux)
        })))

        // Fetch Kp index
        const kpRes = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json')
        const kpData = await kpRes.json()
        const latestKp = kpData[kpData.length - 1]

        setKpHistory(kpData.slice(-8).map((d: any) => ({
          time: d[0],
          kp: parseFloat(d[1])
        })))

        // Fetch solar wind
        const windRes = await fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json')
        const windData = await windRes.json()
        const validWind = windData.slice(1).filter((d: any[]) => d[2] !== null)
        const latestWind = validWind[validWind.length - 1]

        // Fetch magnetic field for Bz
        const magRes = await fetch('https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json')
        const magData = await magRes.json()
        const validMag = magData.slice(1).filter((d: any[]) => d[3] !== null)
        const latestMag = validMag[validMag.length - 1]

        const windPoints: SolarWindHistoryPoint[] = []
        for (let i = Math.max(0, validWind.length - 72); i < validWind.length; i += 3) {
          const w = validWind[i]
          const m = validMag[Math.min(i, validMag.length - 1)]
          if (w && m) {
            windPoints.push({
              time: w[0],
              speed: parseFloat(w[2]) || 0,
              bz: parseFloat(m[3]) || 0
            })
          }
        }
        setWindHistory(windPoints)

        setConditions({
          xrayClass,
          xrayFlux: flux,
          kp: parseFloat(latestKp?.[1] || '0'),
          solarWind: parseFloat(latestWind?.[2] || '0'),
          bzComponent: parseFloat(latestMag?.[3] || '0'),
          sunspotNumber: 145,
          f107Flux: 178,
          protonFlux: 0.1,
          updatedAt: new Date().toISOString(),
        })
      } catch (err) {
        console.error('Failed to fetch solar data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
    const interval = setInterval(fetchAllData, 60000)
    return () => clearInterval(interval)
  }, [])

  const getXrayStatus = (cls: string): 'normal' | 'elevated' | 'warning' | 'critical' => {
    if (cls.startsWith('X')) return 'critical'
    if (cls.startsWith('M')) return 'warning'
    if (cls.startsWith('C')) return 'elevated'
    return 'normal'
  }

  const getKpStatus = (kp: number): 'normal' | 'elevated' | 'warning' | 'critical' => {
    if (kp >= 7) return 'critical'
    if (kp >= 5) return 'warning'
    if (kp >= 4) return 'elevated'
    return 'normal'
  }

  const getWindStatus = (speed: number): 'normal' | 'elevated' | 'warning' | 'critical' => {
    if (speed >= 700) return 'critical'
    if (speed >= 500) return 'warning'
    if (speed >= 400) return 'elevated'
    return 'normal'
  }

  const getBzStatus = (bz: number): 'normal' | 'elevated' | 'warning' | 'critical' => {
    if (bz <= -15) return 'critical'
    if (bz <= -10) return 'warning'
    if (bz <= -5) return 'elevated'
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

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <ObserveIcon className="text-white mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white uppercase mb-3">
              Solar Observatory
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-2xl">
              Live observation of our star from multiple spacecraft. Real-time imagery and space weather monitoring.
            </p>
          </section>

          {/* Current Conditions Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Current Conditions
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px">
              <SolarVitalSign
                value={conditions?.xrayClass || '—'}
                label="X-Ray Class"
                status={conditions ? getXrayStatus(conditions.xrayClass) : 'normal'}
                loading={loading}
              />
              <SolarVitalSign
                value={conditions?.kp?.toFixed(1) || '—'}
                label="Kp Index"
                status={conditions ? getKpStatus(conditions.kp) : 'normal'}
                loading={loading}
              />
              <SolarVitalSign
                value={Math.round(conditions?.solarWind || 0)}
                label="Solar Wind"
                unit="km/s"
                status={conditions ? getWindStatus(conditions.solarWind) : 'normal'}
                loading={loading}
              />
              <SolarVitalSign
                value={conditions?.bzComponent?.toFixed(1) || '—'}
                label="Bz (IMF)"
                unit="nT"
                status={conditions ? getBzStatus(conditions.bzComponent) : 'normal'}
                loading={loading}
              />
              <SolarVitalSign
                value={conditions?.sunspotNumber || '—'}
                label="Sunspot #"
                loading={loading}
              />
              <SolarVitalSign
                value="25"
                label="Solar Cycle"
                loading={loading}
              />
            </div>
          </section>

          {/* Live Solar Disk Frame - FULL WIDTH */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Live Solar Disk
            </div>
            <SDOImageViewer />
          </section>

          {/* Understanding SDO Wavelengths Frame - SEPARATE */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Understanding SDO Wavelengths
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              <div className="bg-black rounded-lg p-4">
                <p className="text-sm text-white/60 leading-relaxed mb-3">
                  Each wavelength reveals a different temperature layer of the Sun's atmosphere.
                  <strong className="text-white/80"> 193Å</strong> shows the corona at 1.2 million °C — ideal for seeing coronal holes and loops.
                  <strong className="text-white/80"> 304Å</strong> shows the cooler chromosphere where prominences are visible.
                </p>
                <p className="text-sm text-white/60 leading-relaxed">
                  <strong className="text-white/80">131Å</strong> highlights the hottest plasma (10 million °C) — it lights up during flares.
                  <strong className="text-white/80"> HMI</strong> instruments show visible light (sunspots) and magnetic field polarity.
                </p>
              </div>
              <div className="bg-black rounded-lg p-4">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Mission</div>
                <div className="text-sm text-white/60 mb-3">
                  <strong className="text-white/80">Solar Dynamics Observatory</strong> · NASA · Launched 2010 ·
                  Geosynchronous orbit · Images every 12 seconds
                </div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Instruments</div>
                <div className="text-sm text-white/60">
                  <strong className="text-white/80">AIA</strong> (Atmospheric Imaging Assembly) — 10 wavelengths<br/>
                  <strong className="text-white/80">HMI</strong> (Helioseismic and Magnetic Imager) — visible & magnetic
                </div>
              </div>
            </div>
          </section>

          {/* Multiple Viewpoints Frame - STEREO RESTORED */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Multiple Viewpoints
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              <STEREOViewer />
              <div className="bg-black rounded-lg p-4 flex flex-col justify-center">
                <div className="text-sm font-medium text-white mb-3">Why Two Views?</div>
                <p className="text-xs text-white/50 leading-relaxed mb-3">
                  SDO orbits Earth, showing us the Sun-facing side. STEREO-A orbits the Sun
                  slightly faster, gradually moving ahead of Earth. This unique vantage point
                  lets us see coronal mass ejections (CMEs) heading toward us before they're
                  visible from Earth.
                </p>
                <p className="text-xs text-white/50 leading-relaxed">
                  When STEREO-A shows activity on the left limb, that region will rotate
                  to face Earth in the coming days — giving advance warning of potentially
                  geoeffective active regions.
                </p>
              </div>
            </div>
          </section>

          {/* Coronagraphs Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-2">
              Coronagraphs
            </div>
            <p className="text-sm text-white/50 mb-4 max-w-2xl">
              These instruments block the bright solar disk to reveal the faint corona. Essential for detecting CMEs heading into space.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              <CoronagraphViewer instrument="c2" />
              <CoronagraphViewer instrument="c3" />
            </div>
            <div className="mt-px bg-black rounded-lg p-3">
              <div className="text-xs text-white/40">
                <strong className="text-white/60">SOHO LASCO</strong> · ESA/NASA · L1 Lagrange Point (1.5M km sunward) ·
                C2 shows inner corona, C3 extends to 30 solar radii
              </div>
            </div>
          </section>

          {/* Recent Activity Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Recent Activity
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
              <XrayFluxChart data={xrayHistory} loading={loading} />
              <KpHistoryChart data={kpHistory} loading={loading} />
              <SolarWindChart data={windHistory} loading={loading} />
              <BzChart data={windHistory} loading={loading} />
            </div>
          </section>

          {/* Solar Cycle Frame - RESTORED */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase">
                Solar Cycle 25
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded uppercase">
                ~11 Year Cycle
              </span>
            </div>
            <SolarCycleIndicator />
          </section>

          {/* Aurora Forecast Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase">
                Aurora Forecast
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded uppercase">
                Ovation Prime
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              <AuroraForecast />
              <div className="bg-black rounded-lg p-4 flex flex-col justify-center">
                <div className="text-sm font-medium text-white mb-3">Aurora Visibility</div>
                <p className="text-xs text-white/50 leading-relaxed mb-3">
                  The <strong className="text-white/70">OVATION Prime</strong> model predicts aurora probability based on
                  real-time solar wind measured at L1 (DSCOVR satellite). Green areas show where aurora is likely visible.
                </p>
                <p className="text-xs text-white/50 leading-relaxed mb-3">
                  <strong className="text-white/70">Key factors:</strong> Southward Bz (negative values) opens Earth's
                  magnetic field to solar wind. High Kp expands the auroral oval toward lower latitudes.
                </p>
                <p className="text-xs text-white/50 leading-relaxed">
                  At Kp 5+ (minor storm), aurora may be visible from Scotland, northern England, and similar latitudes.
                  At Kp 7+ (strong storm), aurora can reach central Europe and the northern US.
                </p>
                <Link
                  href="/observe/space/aurora"
                  className="mt-4 text-sm text-white/60 hover:text-white transition-colors"
                >
                  Detailed Aurora Forecast →
                </Link>
              </div>
            </div>
          </section>

          {/* Understanding Section */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Understanding Solar Activity
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
              <div className="bg-black rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <div className="text-sm font-medium text-white">Solar Flares</div>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Sudden releases of magnetic energy, classified A through X. X-class flares are the strongest.
                  They cause immediate radio blackouts and can trigger radiation storms within minutes.
                </p>
              </div>
              <div className="bg-black rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <div className="text-sm font-medium text-white">Coronal Mass Ejections</div>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Billion-ton clouds of magnetized plasma ejected from the Sun. They travel at 250–3000 km/s
                  and take 1–4 days to reach Earth. The coronagraphs above show CMEs leaving the Sun.
                </p>
              </div>
              <div className="bg-black rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="text-sm font-medium text-white">Geomagnetic Storms</div>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  When CMEs or fast solar wind impact Earth's magnetosphere. The Kp index measures this disturbance.
                  Higher Kp means aurora visible at lower latitudes and possible technology disruptions.
                </p>
              </div>
            </div>
          </section>

          {/* Active Missions Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Active Missions
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <div className="bg-black rounded-lg p-3">
                <div className="text-sm font-medium text-white mb-1">SDO</div>
                <div className="text-xs text-white/40 mb-2">Solar Dynamics Observatory</div>
                <div className="text-[10px] text-white/30">NASA · 2010 · Geosync</div>
              </div>
              <div className="bg-black rounded-lg p-3">
                <div className="text-sm font-medium text-white mb-1">SOHO</div>
                <div className="text-xs text-white/40 mb-2">Solar & Heliospheric Observatory</div>
                <div className="text-[10px] text-white/30">ESA/NASA · 1995 · L1</div>
              </div>
              <div className="bg-black rounded-lg p-3">
                <div className="text-sm font-medium text-white mb-1">STEREO-A</div>
                <div className="text-xs text-white/40 mb-2">Solar Terrestrial Relations</div>
                <div className="text-[10px] text-white/30">NASA · 2006 · Heliocentric</div>
              </div>
              <div className="bg-black rounded-lg p-3">
                <div className="text-sm font-medium text-white mb-1">DSCOVR</div>
                <div className="text-xs text-white/40 mb-2">Deep Space Climate Observatory</div>
                <div className="text-[10px] text-white/30">NOAA · 2015 · L1</div>
              </div>
            </div>
          </section>

          {/* Cross-references Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-sm text-white/40 uppercase tracking-wider mb-3">
              Related
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <Link
                href="/data/solar-system/sun"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                The Sun (Reference) →
              </Link>
              <Link
                href="/observe/space/aurora"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Aurora Forecast →
              </Link>
              <Link
                href="/observe/space"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                ← Back to Space
              </Link>
            </div>

            {/* Data Sources */}
            <div className="pt-4 border-t border-white/10">
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Data Sources</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/40">
                <div>
                  <div className="text-white/50 mb-1">Solar Imagery</div>
                  <div>NASA SDO (AIA, HMI)</div>
                  <div>SOHO LASCO C2/C3</div>
                  <div>STEREO SECCHI</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1">X-Ray Flux</div>
                  <div>GOES-18 XRS</div>
                  <div>NOAA SWPC</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1">Solar Wind</div>
                  <div>DSCOVR Plasma/Mag</div>
                  <div>ACE (backup)</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1">Geomagnetic</div>
                  <div>NOAA Kp Index</div>
                  <div>OVATION Prime</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-[10px] text-white/20">
                Updates: SDO ~15 min · SOHO ~30 min · STEREO daily · Space weather ~1 min · Aurora model ~30 min
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
