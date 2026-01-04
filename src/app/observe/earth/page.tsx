'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PageShell, BreadcrumbFrame, breadcrumbItems } from '@/components/ui'
import { ObserveIcon } from '@/components/icons'

interface EarthData {
  earthquakes: { count: number; period: string }
  fires: { count: number }
  co2: { value: number }
  uvIndex: { value: number }
  seaIce: { extent: number }
  updatedAt: string
}

const earthPages = [
  {
    title: 'Unrest',
    description: 'Live seismic and volcanic activity worldwide',
    href: '/observe/earth/unrest',
  },
  {
    title: 'Active Fires',
    description: 'Real-time wildfire detection from satellite sensors',
    href: '/observe/earth/fires',
  },
  {
    title: 'Weather',
    description: 'Global weather patterns and satellite imagery',
    href: '/observe/earth/weather',
  },
  {
    title: 'Atmosphere',
    description: 'Air quality, CO₂ levels, and atmospheric monitoring',
    href: '/observe/earth/atmosphere',
  },
]

const earthWidgets = [
  {
    title: 'Earthquakes Live',
    description: 'Real-time seismic activity from USGS',
    href: '/observe/dashboard?widget=earthquakes',
  },
  {
    title: 'Lightning Live',
    description: 'Global lightning strikes in real-time',
    href: '/observe/dashboard?widget=lightning',
  },
  {
    title: 'UK Tides',
    description: 'Tide predictions for UK coastal locations',
    href: '/observe/dashboard?widget=tides',
  },
  {
    title: 'CO₂ Now',
    description: 'Atmospheric carbon dioxide from Mauna Loa',
    href: '/observe/dashboard?widget=co2',
  },
]

// VitalSign for dark theme
function EarthVitalSign({
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
      <div className="p-2 md:p-4 bg-black rounded-lg animate-pulse">
        <div className="h-3 md:h-4 bg-white/10 rounded w-16 md:w-24 mb-1 md:mb-2" />
        <div className="h-8 md:h-20 bg-white/10 rounded w-20 md:w-36" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="block p-2 md:p-4 text-left bg-black rounded-lg hover:bg-neutral-900 transition-colors"
    >
      <div className="text-[10px] md:text-xs text-white/50 uppercase mb-1 md:mb-2">
        {label}
      </div>
      <div className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] tabular-nums text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </Link>
  )
}

// Card for dark theme
function EarthCard({
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
      className="block p-2 md:p-4 bg-black rounded-lg border border-white/10 hover:border-white/30 transition-colors"
    >
      <h2 className="text-2xl md:text-3xl font-light text-white uppercase mb-2">
        {title}
      </h2>
      <p className="text-sm text-white/50">
        {description}
      </p>
    </Link>
  )
}

export default function EarthPage() {
  const [data, setData] = useState<EarthData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEarthData() {
      try {
        const res = await fetch('/api/vital-signs')
        const json = await res.json()
        setData({
          earthquakes: json.earthquakes || { count: 0, period: '24h' },
          fires: json.fires || { count: 0 },
          co2: json.co2 || { value: 0 },
          uvIndex: json.uvIndex || { value: 0 },
          seaIce: json.seaIce || { extent: 0 },
          updatedAt: json.updatedAt,
        })
      } catch (error) {
        console.error('Failed to fetch earth data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEarthData()
    const interval = setInterval(fetchEarthData, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <PageShell>
      <BreadcrumbFrame
        variant="dark"
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['Observe', '/observe'],
          ['Earth']
        )}
      />

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <ObserveIcon className="text-white mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white uppercase mb-3">
              Earth
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-2xl">
              Live monitoring of our planet. Earthquakes, volcanoes, fires, weather, and atmosphere in real-time.
            </p>
          </section>

          {/* Live Imagery Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Live Imagery
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {/* Himawari Pacific Disc */}
              <Link href="/observe/earth/weather" className="block">
                <div className="flex flex-col gap-px">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src="https://www.data.jma.go.jp/mscweb/data/himawari/img/fd_/fd__trm_0000.jpg"
                      alt="Himawari-9 Full Disc - Pacific"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="bg-black rounded-lg p-2 md:p-3 hover:bg-neutral-900 transition-colors">
                    <div className="text-sm font-medium text-white">Himawari-9 Full Disc</div>
                    <div className="text-xs text-white/50">Pacific region · Updated every 10 minutes</div>
                  </div>
                </div>
              </Link>

              {/* GOES East */}
              <Link href="/observe/earth/weather" className="block">
                <div className="flex flex-col gap-px">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src="https://cdn.star.nesdis.noaa.gov/GOES16/ABI/FD/GEOCOLOR/latest.jpg"
                      alt="GOES-East Full Disc - Americas"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="bg-black rounded-lg p-2 md:p-3 hover:bg-neutral-900 transition-colors">
                    <div className="text-sm font-medium text-white">GOES-East Full Disc</div>
                    <div className="text-xs text-white/50">Americas · Updated every 10 minutes</div>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* Earth Metrics Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Current Conditions
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <EarthVitalSign
                value={data?.earthquakes?.count || 0}
                label="Earthquakes (24h)"
                href="/observe/earth/unrest"
                loading={loading}
              />
              <EarthVitalSign
                value={data?.fires?.count || 0}
                label="Active Fires"
                href="/observe/earth/fires"
                loading={loading}
              />
              <EarthVitalSign
                value={data?.co2?.value || 0}
                label="CO₂ ppm"
                href="/observe/earth/atmosphere"
                loading={loading}
              />
              <EarthVitalSign
                value={data?.seaIce?.extent?.toFixed(1) || '-'}
                label="Arctic Sea Ice (M km²)"
                href="/data/earth/climate"
                loading={loading}
              />
            </div>
          </section>

          {/* Observatories Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Observatories
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {earthPages.map((page) => (
                <EarthCard
                  key={page.href}
                  title={page.title}
                  description={page.description}
                  href={page.href}
                />
              ))}
            </div>
          </section>

          {/* Widgets Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Widgets
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {earthWidgets.map((widget) => (
                <EarthCard
                  key={widget.href}
                  title={widget.title}
                  description={widget.description}
                  href={widget.href}
                />
              ))}
            </div>
          </section>

          {/* Cross-references Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-sm text-white/40 uppercase tracking-wider mb-3">
              Related
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/data/earth"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Earth Reference →
              </Link>
              <Link
                href="/data/cosmos/solar-system/earth"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Earth in Solar System →
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

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </PageShell>
  )
}
