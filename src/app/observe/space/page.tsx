'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'

interface SpaceData {
  solarWind: { speed: number; density: number }
  kpIndex: { value: number; status: string }
  solarFlares: { today: number; class: string }
  moonPhase: { illumination: number; phase: string }
  issPosition: { lat: number; lon: number; altitude: number }
  nextLaunch: { name: string; date: string; provider: string }
  nearestAsteroid: { name: string; distance: number; date: string }
  updatedAt: string
}

const spacePages = [
  {
    title: 'Solar Observatory',
    description: 'Live imagery from SDO, SOHO, and STEREO spacecraft',
    href: '/observe/space/solar-observatory',
  },
  {
    title: 'Lunar Atlas',
    description: 'Interactive Moon map and phase tracker',
    href: '/observe/space/lunar-atlas',
  },
  {
    title: 'Aurora',
    description: 'Northern and southern lights forecast',
    href: '/observe/space/aurora',
  },
]

const spaceWidgets = [
  {
    title: 'ISS Tracker',
    description: 'Real-time position of the International Space Station',
    href: '/observe/dashboard?widget=iss',
  },
  {
    title: 'Near-Earth Asteroids',
    description: 'Tracking objects passing close to Earth',
    href: '/observe/dashboard?widget=asteroids',
  },
  {
    title: 'Launch Schedule',
    description: 'Upcoming rocket launches worldwide',
    href: '/observe/dashboard?widget=launches',
  },
  {
    title: 'Space Weather',
    description: 'Solar wind, geomagnetic activity, and radiation',
    href: '/observe/dashboard?widget=space-weather',
  },
]

function SpaceMetric({
  value,
  label,
  unit,
  loading = false,
}: {
  value: string | number
  label: string
  unit?: string
  loading?: boolean
}) {
  return (
    <div className="bg-black rounded-lg p-3">
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
        {label}
      </div>
      {loading ? (
        <div className="h-7 bg-white/10 rounded animate-pulse" />
      ) : (
        <div className="font-mono text-lg font-bold text-white">
          {value}
          {unit && <span className="text-white/60 text-sm ml-1">{unit}</span>}
        </div>
      )}
    </div>
  )
}

function PageCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block bg-black rounded-lg p-4 hover:bg-black/80 transition-colors group"
    >
      <h3 className="text-lg font-medium text-white mb-1 group-hover:text-white/90">
        {title}
      </h3>
      <p className="text-sm text-white/50">
        {description}
      </p>
    </Link>
  )
}

function WidgetCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block bg-black/5 rounded-lg p-4 hover:bg-black/10 transition-colors border border-transparent hover:border-black/20"
    >
      <h3 className="text-base font-medium text-black mb-1">
        {title}
      </h3>
      <p className="text-sm text-black/50">
        {description}
      </p>
    </Link>
  )
}

export default function SpacePage() {
  const [data, setData] = useState<SpaceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSpaceData() {
      try {
        // Fetch from vital-signs API (or create a dedicated space API)
        const res = await fetch('/api/vital-signs')
        const json = await res.json()
        setData({
          solarWind: json.solarWind || { speed: 0, density: 0 },
          kpIndex: json.kpIndex || { value: 0, status: 'quiet' },
          solarFlares: json.solarFlares || { today: 0, class: 'none' },
          moonPhase: { illumination: 0, phase: 'waxing' }, // TODO: Add to API
          issPosition: { lat: 0, lon: 0, altitude: 408 }, // TODO: Add to API
          nextLaunch: { name: 'TBD', date: '', provider: '' }, // TODO: Add to API
          nearestAsteroid: json.nearestAsteroid || { name: '', distance: 0, date: '' },
          updatedAt: json.updatedAt,
        })
      } catch (error) {
        console.error('Failed to fetch space data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpaceData()
    const interval = setInterval(fetchSpaceData, 60000)
    return () => clearInterval(interval)
  }, [])

  // Determine Kp status styling
  const kpValue = data?.kpIndex?.value || 0
  const kpStatusText = kpValue >= 5 ? 'Storm' : kpValue >= 4 ? 'Active' : 'Quiet'

  return (
    <main className="min-h-screen bg-white">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="block bg-black rounded-lg py-1 md:py-2 px-2 md:px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Observe', href: '/observe' },
                { label: 'Space' },
              ]}
              theme="dark"
            />
          </div>
        </div>

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-black rounded-lg p-2 md:p-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white uppercase mb-3">
              Space
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-2xl">
              Sun, Moon, aurora, and spacecraft. Live data from NASA, ESA, and space agencies worldwide.
            </p>
          </section>

          {/* Space Metrics Frame */}
          <section className="bg-[#404040] rounded-lg p-2 md:p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <SpaceMetric
                value={data?.solarWind?.speed || 0}
                label="Solar Wind"
                unit="km/s"
                loading={loading}
              />
              <SpaceMetric
                value={kpValue}
                label={`Kp Index · ${kpStatusText}`}
                loading={loading}
              />
              <SpaceMetric
                value={data?.solarFlares?.today || 0}
                label="Solar Flares (24h)"
                loading={loading}
              />
              <SpaceMetric
                value={data?.nearestAsteroid?.distance?.toFixed(1) || '—'}
                label="Nearest Asteroid"
                unit="LD"
                loading={loading}
              />
            </div>
          </section>

          {/* Observatory Pages Frame */}
          <section className="bg-black rounded-lg p-2 md:p-4">
            <div className="text-sm text-white/40 uppercase tracking-wider mb-4">
              Observatories
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
              {spacePages.map((page) => (
                <PageCard
                  key={page.href}
                  title={page.title}
                  description={page.description}
                  href={page.href}
                />
              ))}
            </div>
          </section>

          {/* Widgets Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4 border border-black/10">
            <div className="text-sm text-black/40 uppercase tracking-wider mb-4">
              Widgets
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {spaceWidgets.map((widget) => (
                <WidgetCard
                  key={widget.href}
                  title={widget.title}
                  description={widget.description}
                  href={widget.href}
                />
              ))}
            </div>
          </section>

          {/* Cross-references Frame */}
          <section className="bg-black rounded-lg p-2 md:p-4">
            <div className="text-sm text-white/40 uppercase tracking-wider mb-3">
              Related
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/data/solar-system"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Solar System Reference →
              </Link>
              <Link
                href="/observe/detectors"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Particle Detectors →
              </Link>
              <Link
                href="/observe/dashboard"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Dashboard →
              </Link>
            </div>
          </section>

        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
