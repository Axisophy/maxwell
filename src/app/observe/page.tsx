'use client'

import { useEffect, useState } from 'react'
import { Orbit, Globe, Leaf, Factory, Radio, LayoutDashboard } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import VitalSign from './components/VitalSign'
import PopulationCounter from './components/PopulationCounter'
import StatusVitalSign from './components/StatusVitalSign'
import PortalCard from './components/PortalCard'

interface VitalSignsData {
  earthquakes: { count: number; period: string }
  co2: { value: number; unit: string }
  solarWind: { speed: number; unit: string }
  population: { count: number; growthPerSecond: number }
  kpIndex: { value: number; status: string }
  cosmicRays: { flux: number; unit: string; deviation: number }
  ukGrid: { demand: number; unit: string; carbonIntensity: number }
  fires: { count: number; period: string }
  lhc: { status: string; beamEnergy: number }
  updatedAt: string
}

const portals = [
  {
    title: 'Space',
    description: 'Sun, Moon, aurora, and spacecraft monitoring',
    href: '/observe/space',
    icon: Orbit,
  },
  {
    title: 'Earth',
    description: 'Weather, earthquakes, fires, and atmosphere',
    href: '/observe/earth',
    icon: Globe,
  },
  {
    title: 'Life',
    description: 'Wildlife tracking and ocean monitoring',
    href: '/observe/life',
    icon: Leaf,
  },
  {
    title: 'Infrastructure',
    description: 'Power grids and submarine cables',
    href: '/observe/infrastructure',
    icon: Factory,
  },
  {
    title: 'Detectors',
    description: 'LHC, LIGO, IceCube, and cosmic rays',
    href: '/observe/detectors',
    icon: Radio,
  },
  {
    title: 'Dashboard',
    description: 'Your customised widget display',
    href: '/observe/dashboard',
    icon: LayoutDashboard,
  },
]

export default function ObservePage() {
  const [data, setData] = useState<VitalSignsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVitalSigns() {
      try {
        const res = await fetch('/api/vital-signs')
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error('Failed to fetch vital signs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVitalSigns()

    // Refresh every 60 seconds
    const interval = setInterval(fetchVitalSigns, 60000)
    return () => clearInterval(interval)
  }, [])

  // Determine LHC status color
  const lhcStatusColor = data?.lhc?.status === 'STABLE BEAMS' ? 'green'
    : data?.lhc?.status === 'NO BEAM' ? 'neutral'
    : 'amber'

  // Determine Kp status severity
  const kpStatus = data?.kpIndex?.value && data.kpIndex.value >= 5 ? 'warning' : 'normal'

  return (
    <main className="min-h-screen bg-black">
      <div className="px-4 pt-4 pb-8 flex flex-col gap-2">

        {/* Header Frame */}
        <section className="bg-white rounded-2xl p-6 md:p-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Observe' },
            ]}
            theme="light"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Observe
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            Live science happening right now. Real-time data from NASA, NOAA, CERN, and observatories worldwide.
          </p>
        </section>

        {/* Vital Signs Frame */}
        <section className="bg-white rounded-2xl p-6 md:p-8">
          <div className="text-xs font-mono text-black/40 uppercase tracking-wider mb-6">
            Vital Signs
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {/* Row 1: Earth metrics */}
            <VitalSign
              value={data?.earthquakes?.count || 0}
              unit="earthquakes"
              context="in the last 24h"
              href="/observe/earth/unrest"
              loading={loading}
            />

            <VitalSign
              value={data?.co2?.value || 0}
              unit="ppm CO₂"
              context="Mauna Loa"
              href="/data/earth/climate"
              loading={loading}
            />

            <VitalSign
              value={data?.fires?.count || 0}
              unit="active fires"
              context="worldwide"
              href="/observe/earth/fires"
              loading={loading}
            />

            {/* Row 2: Space metrics */}
            <VitalSign
              value={data?.solarWind?.speed || 0}
              unit="km/s"
              context="solar wind"
              href="/observe/space/solar-observatory"
              loading={loading}
            />

            <VitalSign
              value={data?.kpIndex?.value || 0}
              unit={`Kp · ${data?.kpIndex?.status || 'quiet'}`}
              context="geomagnetic"
              href="/observe/space/aurora"
              status={kpStatus}
              loading={loading}
            />

            <VitalSign
              value={data?.cosmicRays?.flux || 0}
              unit="counts/min"
              context="cosmic rays"
              href="/observe/detectors/cosmic-rays"
              loading={loading}
            />

            {/* Row 3: Infrastructure + Detectors */}
            <VitalSign
              value={data?.ukGrid?.demand || 0}
              unit="GW"
              context="UK grid demand"
              href="/observe/infrastructure/power"
              loading={loading}
            />

            {/* Population - special animated component */}
            {loading ? (
              <VitalSign
                value={0}
                unit="humans"
                href="/data/earth/civilisation"
                loading={true}
              />
            ) : (
              <PopulationCounter
                baseCount={data?.population?.count || 8147000000}
                growthPerSecond={data?.population?.growthPerSecond || 2.5}
                href="/data/earth/civilisation"
              />
            )}

            {/* LHC Status - text based */}
            <StatusVitalSign
              status={data?.lhc?.status || 'LOADING'}
              label="LHC"
              context={data?.lhc?.beamEnergy ? `${data.lhc.beamEnergy} TeV` : undefined}
              href="/observe/detectors/lhc"
              statusColor={lhcStatusColor}
              loading={loading}
            />
          </div>

          {/* Last updated */}
          {data?.updatedAt && (
            <div className="mt-6 text-xs text-black/30">
              Last updated: {new Date(data.updatedAt).toLocaleTimeString()}
            </div>
          )}
        </section>

        {/* Explore Frame */}
        <section className="bg-white rounded-2xl p-6 md:p-8">
          <div className="text-xs font-mono text-black/40 uppercase tracking-wider mb-6">
            Explore
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {portals.map((portal) => (
              <PortalCard
                key={portal.href}
                title={portal.title}
                description={portal.description}
                href={portal.href}
                icon={portal.icon}
              />
            ))}
          </div>
        </section>

      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
