'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageShell, BreadcrumbFrame, breadcrumbItems } from '@/components/ui'
import { ObserveIcon } from '@/components/icons'

interface DetectorsData {
  lhcStatus: string
  lhcBeamEnergy: number
  ligoStatus: string
  icecubeAlerts: number
  cosmicRayFlux: number
  updatedAt: string
}

const detectorPages = [
  {
    title: 'LHC',
    description: 'The Large Hadron Collider - 27km of superconducting magnets colliding protons at 99.9999991% light speed',
    href: '/observe/detectors/lhc',
  },
  {
    title: 'Gravitational Waves',
    description: 'LIGO and Virgo listening for ripples in spacetime from colliding black holes',
    href: '/observe/detectors/gravitational',
  },
  {
    title: 'Neutrinos',
    description: 'Ghost particles from the cosmos - IceCube, Super-Kamiokande, and supernova detection',
    href: '/observe/detectors/neutrinos',
  },
  {
    title: 'Cosmic Rays',
    description: 'High-energy particles from supernovae and black holes - global neutron monitor network',
    href: '/observe/detectors/cosmic-rays',
  },
]

const detectorWidgets = [
  {
    title: 'LHC Status',
    description: 'Real-time beam status and collision energy',
    href: '/observe/dashboard?widget=lhc',
  },
  {
    title: 'Gravitational Waves',
    description: 'Recent detections and detector status',
    href: '/observe/dashboard?widget=gravitational-waves',
  },
  {
    title: 'Cosmic Ray Monitor',
    description: 'Neutron flux from global monitoring network',
    href: '/observe/dashboard?widget=cosmic-rays',
  },
]

// VitalSign for dark theme
function DetectorVitalSign({
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

// Status VitalSign with coloured text
function StatusVitalSign({
  status,
  label,
  context,
  href,
  loading = false,
}: {
  status: string
  label: string
  context?: string
  href?: string
  loading?: boolean
}) {
  const getStatusColor = (status: string) => {
    if (status === 'STABLE BEAMS' || status === 'OBSERVING') return 'text-green-400'
    if (status === 'NO BEAM' || status === 'OFFLINE') return 'text-white/40'
    return 'text-amber-400'
  }

  const content = (
    <div className={`p-2 md:p-4 text-left bg-black rounded-lg ${href ? 'hover:bg-neutral-900 transition-colors' : ''}`}>
      <div className="text-[10px] md:text-xs text-white/50 uppercase mb-1 md:mb-2">
        {label}
      </div>
      {loading ? (
        <div className="h-8 md:h-20 bg-white/10 rounded w-20 md:w-36 animate-pulse" />
      ) : (
        <>
          <div className={`text-xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em] ${getStatusColor(status)}`}>
            {status}
          </div>
          {context && (
            <div className="text-sm text-white/40 mt-1">{context}</div>
          )}
        </>
      )}
    </div>
  )

  if (href) {
    return <Link href={href} className="block">{content}</Link>
  }
  return content
}

// Card for dark theme
function DetectorCard({
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

export default function DetectorsPortalPage() {
  const [data, setData] = useState<DetectorsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDetectorsData() {
      try {
        const res = await fetch('/api/vital-signs')
        const json = await res.json()
        setData({
          lhcStatus: json.lhc?.status || 'UNKNOWN',
          lhcBeamEnergy: json.lhc?.beamEnergy || 0,
          ligoStatus: 'OBSERVING', // Simulated
          icecubeAlerts: 3, // Simulated
          cosmicRayFlux: json.cosmicRays?.flux || 0,
          updatedAt: json.updatedAt,
        })
      } catch (error) {
        console.error('Failed to fetch detectors data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetectorsData()
    const interval = setInterval(fetchDetectorsData, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <PageShell>
      <BreadcrumbFrame
        variant="dark"
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['Observe', '/observe'],
          ['Detectors']
        )}
      />

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <ObserveIcon className="text-white mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white uppercase mb-3">
              Detectors
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-2xl">
              The world's most sensitive instruments, listening to the universe. Particles, waves, and signals invisible to human senses.
            </p>
          </section>

          {/* Detector Status Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Detector Status
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <StatusVitalSign
                status={data?.lhcStatus || 'UNKNOWN'}
                label="LHC"
                context={data?.lhcBeamEnergy ? `${data.lhcBeamEnergy} TeV` : undefined}
                href="/observe/detectors/lhc"
                loading={loading}
              />
              <StatusVitalSign
                status={data?.ligoStatus || 'UNKNOWN'}
                label="LIGO/Virgo"
                href="/observe/detectors/gravitational"
                loading={loading}
              />
              <DetectorVitalSign
                value={data?.icecubeAlerts || 0}
                label="IceCube Alerts (30d)"
                href="/observe/detectors/neutrinos"
                loading={loading}
              />
              <DetectorVitalSign
                value={data?.cosmicRayFlux || 0}
                label="Cosmic Ray Flux"
                href="/observe/detectors/cosmic-rays"
                loading={loading}
              />
            </div>
          </section>

          {/* Scales Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase mb-4">
              Scales of Detection
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <DetectorVitalSign
                value="10⁻¹⁸"
                label="LIGO Precision (m)"
                loading={loading}
              />
              <DetectorVitalSign
                value="13.6"
                label="LHC Energy (TeV)"
                loading={loading}
              />
              <DetectorVitalSign
                value="1 km³"
                label="IceCube Volume"
                loading={loading}
              />
              <DetectorVitalSign
                value="10²⁰"
                label="Cosmic Ray Max (eV)"
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
              {detectorPages.map((page) => (
                <DetectorCard
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
              {detectorWidgets.map((widget) => (
                <DetectorCard
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
                href="/data/fabric/particles"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Particle Data →
              </Link>
              <Link
                href="/observe/space"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Space Monitoring →
              </Link>
              <Link
                href="/observe/dashboard"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Dashboard →
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Data Sources</div>
              <div className="text-xs text-white/40">
                CERN LHC Page 1 · LIGO/Virgo GraceDB · IceCube GCN · NMDB Neutron Monitors
              </div>
            </div>
          </section>

        </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </PageShell>
  )
}
