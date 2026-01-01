'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { ObserveIcon } from '@/components/icons'

interface SpaceData {
  solarWind: { speed: number; density: number }
  kpIndex: { value: number; status: string }
  solarFlares: { today: number; class: string }
  nearestAsteroid: { name: string; distance: number }
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

// Inverted VitalSign for white background frames
function SpaceVitalSign({
  value,
  label,
  href,
  loading = false,
}: {
  value: string | number
  label: string
  href: string
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="p-2 md:p-4 bg-white rounded-lg animate-pulse">
        <div className="h-3 md:h-4 bg-black/10 rounded w-16 md:w-24 mb-1 md:mb-2" />
        <div className="h-8 md:h-20 bg-black/10 rounded w-20 md:w-36" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="block p-2 md:p-4 text-left bg-white rounded-lg hover:bg-neutral-100 transition-colors"
    >
      <div className="text-[10px] md:text-xs text-black/50 uppercase mb-1 md:mb-2">
        {label}
      </div>
      <div className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] tabular-nums text-black">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </Link>
  )
}

// Inverted PortalCard for white background
function SpaceCard({
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
      className="block p-2 md:p-4 bg-white rounded-lg border border-black/10 hover:border-black/30 transition-colors"
    >
      <h2 className="text-2xl md:text-3xl font-light text-black uppercase mb-2">
        {title}
      </h2>
      <p className="text-sm text-black/50">
        {description}
      </p>
    </Link>
  )
}

// Live image component with separate image and caption frames
function LiveImageCard({
  src,
  alt,
  title,
  caption,
  href,
}: {
  src: string
  alt: string
  title: string
  caption: string
  href: string
}) {
  return (
    <Link href={href} className="block">
      <div className="flex flex-col gap-px">
        {/* Image frame */}
        <div className="bg-white rounded-lg p-2 md:p-3">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-black">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
        {/* Caption frame */}
        <div className="bg-white rounded-lg p-2 md:p-3 hover:bg-neutral-100 transition-colors">
          <div className="text-sm font-medium text-black">{title}</div>
          <div className="text-xs text-black/50">{caption}</div>
        </div>
      </div>
    </Link>
  )
}

export default function SpacePage() {
  const [data, setData] = useState<SpaceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSpaceData() {
      try {
        const res = await fetch('/api/vital-signs')
        const json = await res.json()
        setData({
          solarWind: json.solarWind || { speed: 0, density: 0 },
          kpIndex: json.kpIndex || { value: 0, status: 'quiet' },
          solarFlares: json.solarFlares || { today: 0, class: 'none' },
          nearestAsteroid: json.nearestAsteroid || { name: '', distance: 0 },
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
            <ObserveIcon className="text-white mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white uppercase mb-3">
              Space
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-2xl">
              Sun, Moon, aurora, and spacecraft. Live data from NASA, ESA, and space agencies worldwide.
            </p>
          </section>

          {/* Live Imagery Frame */}
          <section className="bg-black rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Live Imagery
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              <LiveImageCard
                src="https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0193.jpg"
                alt="SDO AIA 193Å - Solar corona"
                title="SDO AIA 193Å"
                caption="Solar corona · Updated every 15 minutes"
                href="/observe/space/solar-observatory"
              />
              <LiveImageCard
                src="https://soho.nascom.nasa.gov/data/realtime/c3/512/latest.jpg"
                alt="SOHO LASCO C3 - Solar coronagraph"
                title="SOHO LASCO C3"
                caption="Coronagraph · Updated every 30 minutes"
                href="/observe/space/solar-observatory"
              />
            </div>
          </section>

          {/* Space Metrics Frame */}
          <section className="bg-black rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Current Conditions
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <SpaceVitalSign
                value={data?.solarWind?.speed || 0}
                label="Solar Wind (km/s)"
                href="/observe/space/solar-observatory"
                loading={loading}
              />
              <SpaceVitalSign
                value={kpValue}
                label={`Kp Index · ${kpStatusText}`}
                href="/observe/space/aurora"
                loading={loading}
              />
              <SpaceVitalSign
                value={data?.solarFlares?.today || 0}
                label="Solar Flares (24h)"
                href="/observe/space/solar-observatory"
                loading={loading}
              />
              <SpaceVitalSign
                value={data?.nearestAsteroid?.distance?.toFixed(1) || '—'}
                label="Nearest Asteroid (LD)"
                href="/observe/dashboard?widget=asteroids"
                loading={loading}
              />
            </div>
          </section>

          {/* Observatories Frame */}
          <section className="bg-black rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Observatories
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
              {spacePages.map((page) => (
                <SpaceCard
                  key={page.href}
                  title={page.title}
                  description={page.description}
                  href={page.href}
                />
              ))}
            </div>
          </section>

          {/* Widgets Frame */}
          <section className="bg-black rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Widgets
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {spaceWidgets.map((widget) => (
                <SpaceCard
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
