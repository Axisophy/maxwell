'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageShell, BreadcrumbFrame, PageHeaderFrame, breadcrumbItems } from '@/components/ui'
import { ObserveIcon } from '@/components/icons'

interface InfraData {
  ukGridDemand: number
  gridFrequency: number
  submarineCables: number
  carbonIntensity: number
  updatedAt: string
}

const infraPages = [
  {
    title: 'Power',
    description: 'Global power grids, generation mix, demand curves, and carbon intensity',
    href: '/observe/infrastructure/power',
    available: true,
  },
  {
    title: 'Internet',
    description: 'Submarine cables connecting the world -1.4 million km of fibre across ocean floors',
    href: '/observe/infrastructure/internet',
    available: true,
  },
  {
    title: 'Aircraft',
    description: 'Live flight tracking worldwide',
    href: '/observe/infrastructure/aircraft',
    available: false,
  },
  {
    title: 'Ships',
    description: 'Maritime traffic and shipping routes',
    href: '/observe/infrastructure/ships',
    available: false,
  },
]

const infraWidgets = [
  {
    title: 'UK Energy',
    description: 'Real-time generation mix and carbon intensity',
    href: '/observe/dashboard?widget=uk-energy',
  },
  {
    title: 'Grid Frequency',
    description: 'Live frequency monitoring (50Hz/60Hz)',
    href: '/observe/dashboard?widget=grid-frequency',
  },
  {
    title: 'Nuclear Reactors',
    description: 'Status of nuclear power stations',
    href: '/observe/dashboard?widget=nuclear',
  },
]

// VitalSign component
function InfraVitalSign({
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
function InfraCard({
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

export default function InfrastructurePortalPage() {
  const [data, setData] = useState<InfraData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInfraData() {
      try {
        const res = await fetch('/api/vital-signs')
        const json = await res.json()
        setData({
          ukGridDemand: json.ukGrid?.demand || 0,
          gridFrequency: 50.0, // Simulated for now
          submarineCables: 552,
          carbonIntensity: json.ukGrid?.carbonIntensity || 0,
          updatedAt: json.updatedAt,
        })
      } catch (error) {
        console.error('Failed to fetch infrastructure data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInfraData()
    const interval = setInterval(fetchInfraData, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <PageShell>
      <BreadcrumbFrame
        variant="light"
        icon={<ObserveIcon className="w-4 h-4" />}
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['Observe', '/observe'],
          ['Infrastructure']
        )}
      />

      <PageHeaderFrame
        variant="light"
        title="Infrastructure"
        description="The invisible systems that keep civilisation running. Power grids balancing supply and demand, submarine cables carrying 99% of intercontinental data."
      />

      {/* Vital Signs Frame */}
      <section className="bg-white rounded-lg p-2 md:p-4 mb-px">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              Global Scale
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <InfraVitalSign
                value={data?.ukGridDemand || 0}
                label="UK Grid Demand (GW)"
                href="/observe/infrastructure/power"
                loading={loading}
              />
              <InfraVitalSign
                value={data?.gridFrequency?.toFixed(2) || '-'}
                label="Grid Frequency (Hz)"
                href="/observe/infrastructure/power"
                loading={loading}
              />
              <InfraVitalSign
                value={data?.submarineCables || 0}
                label="Submarine Cables"
                href="/observe/infrastructure/internet"
                loading={loading}
              />
              <InfraVitalSign
                value="1.4M"
                label="km of Fibre"
                href="/observe/infrastructure/internet"
                loading={loading}
              />
            </div>
          </section>

          {/* Observatories Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              Observatories
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {infraPages.map((page) => (
                <InfraCard
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
              {infraWidgets.map((widget) => (
                <InfraCard
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
                href="/observe/earth"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Earth Monitoring →
              </Link>
              <Link
                href="/data/earth/civilisation"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Civilisation Data →
              </Link>
              <Link
                href="/observe/dashboard"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Dashboard →
              </Link>
        </div>
      </section>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </PageShell>
  )
}
