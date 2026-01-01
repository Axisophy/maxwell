'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { ObserveIcon } from '@/components/icons'

interface LifeData {
  trackedAnimals: number
  ebirdObservations: string
  hydrophoneStations: number
  updatedAt: string
}

const lifePages = [
  {
    title: 'Wildlife Tracking',
    description: 'Live GPS tracking of sharks, whales, turtles, and birds worldwide',
    href: '/observe/wildlife',
    available: true,
  },
  {
    title: 'Ocean',
    description: 'Deep sea cameras, hydrophone networks, and marine life monitoring',
    href: '/observe/life/ocean',
    available: false,
  },
  {
    title: 'Birds',
    description: 'eBird sightings, nest cameras, and migration tracking',
    href: '/observe/life/birds',
    available: false,
  },
]

const lifeWidgets = [
  {
    title: 'eBird Live',
    description: 'Recent bird sightings from citizen scientists',
    href: '/observe/dashboard?widget=ebird',
  },
  {
    title: 'iNaturalist Live',
    description: 'Species observations from around the world',
    href: '/observe/dashboard?widget=inaturalist',
  },
  {
    title: 'Ocean Hydrophones',
    description: 'Live underwater audio from research stations',
    href: '/observe/dashboard?widget=hydrophones',
  },
]

// VitalSign component for this page
function LifeVitalSign({
  value,
  label,
  href,
  loading = false,
}: {
  value: string | number
  label: string
  href?: string
  loading?: boolean
}) {
  const content = (
    <div className={`p-2 md:p-4 text-left bg-black rounded-lg ${href ? 'hover:bg-neutral-900 transition-colors' : ''}`}>
      <div className="text-[10px] md:text-xs text-white/50 uppercase mb-1 md:mb-2">
        {label}
      </div>
      {loading ? (
        <div className="h-8 md:h-20 bg-white/10 rounded w-20 md:w-36 animate-pulse" />
      ) : (
        <div className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] tabular-nums text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href} className="block">{content}</Link>
  }
  return content
}

// Card component
function LifeCard({
  title,
  description,
  href,
  available = true,
}: {
  title: string
  description: string
  href: string
  available?: boolean
}) {
  if (!available) {
    return (
      <div className="block p-2 md:p-4 bg-black rounded-lg border border-white/10 opacity-50">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl md:text-3xl font-light text-white uppercase">
            {title}
          </h2>
          <span className="text-[10px] text-white/40 uppercase tracking-wider">
            Coming Soon
          </span>
        </div>
        <p className="text-sm text-white/50">
          {description}
        </p>
      </div>
    )
  }

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

export default function LifePortalPage() {
  const [data, setData] = useState<LifeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulated data for now - replace with actual API when available
    const timer = setTimeout(() => {
      setData({
        trackedAnimals: 1247,
        ebirdObservations: '500M+',
        hydrophoneStations: 73,
        updatedAt: new Date().toISOString(),
      })
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="block bg-white rounded-lg py-1 md:py-2 px-2 md:px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Observe', href: '/observe' },
                { label: 'Life' },
              ]}
              theme="light"
            />
          </div>
        </div>

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <ObserveIcon className="text-black mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase mb-3">
              Life
            </h1>
            <p className="text-base md:text-lg text-black/60 max-w-2xl">
              Monitoring the living world. Wildlife tracking, ocean acoustics, and bird observations from researchers and citizen scientists.
            </p>
          </section>

          {/* Vital Signs Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              The Living Planet
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <LifeVitalSign
                value="8.7M"
                label="Estimated Species"
                loading={loading}
              />
              <LifeVitalSign
                value={data?.trackedAnimals || 0}
                label="Tracked Animals"
                href="/observe/wildlife"
                loading={loading}
              />
              <LifeVitalSign
                value={data?.ebirdObservations || '—'}
                label="eBird Observations"
                loading={loading}
              />
              <LifeVitalSign
                value={data?.hydrophoneStations || 0}
                label="Hydrophone Stations"
                loading={loading}
              />
            </div>
          </section>

          {/* Observatories Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              Observatories
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
              {lifePages.map((page) => (
                <LifeCard
                  key={page.href}
                  title={page.title}
                  description={page.description}
                  href={page.href}
                  available={page.available}
                />
              ))}
            </div>
          </section>

          {/* Widgets Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              Widgets
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
              {lifeWidgets.map((widget) => (
                <LifeCard
                  key={widget.href}
                  title={widget.title}
                  description={widget.description}
                  href={widget.href}
                />
              ))}
            </div>
          </section>

          {/* Cross-references Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-sm text-black/40 uppercase tracking-wider mb-3">
              Related
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/data/earth/life"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Life Data →
              </Link>
              <Link
                href="/observe/earth"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Earth Monitoring →
              </Link>
              <Link
                href="/observe/dashboard"
                className="text-sm text-black/60 hover:text-black transition-colors"
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
