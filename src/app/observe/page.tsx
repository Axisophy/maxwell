'use client'

import { useEffect, useState } from 'react'
import { Orbit, Globe, Leaf, Factory, Radio, LayoutDashboard } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { ObserveIcon } from '@/components/icons'
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
  seaIce: { extent: number; unit: string }
  uvIndex: { value: number; location: string }
  nearestAsteroid: { distance: number; name: string }
  seaLevel: { rise: number; baseline: string }
  solarFlares: { today: number; class: string }
  neutronMonitor: { flux: number; station: string }
  internetTraffic: { tbps: number; trend: string }
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
      <div className="px-4 pt-4 pb-8">

        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <span className="inline-block bg-white rounded-lg py-2 px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Observe' },
              ]}
              theme="light"
            />
          </span>
        </div>

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-white rounded-lg p-4">
            <ObserveIcon className="text-black mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase mb-3">
              Observe
            </h1>
            <p className="text-base md:text-lg text-black/60 max-w-2xl">
              Live science happening right now. Real-time data from NASA, NOAA, CERN, and observatories worldwide.
            </p>
          </section>

          {/* Vital Signs Frame */}
          <section className="bg-white rounded-lg p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-6">
              Vital Signs
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              {/* Row 1: Earth metrics */}
              <VitalSign
                value={data?.earthquakes?.count || 0}
                label="Earthquakes (24h)"
                href="/observe/earth/unrest"
                loading={loading}
              />

              <VitalSign
                value={data?.co2?.value || 0}
                label="CO₂ ppm (Mauna Loa)"
                href="/data/earth/climate"
                loading={loading}
              />

              <VitalSign
                value={data?.fires?.count || 0}
                label="Active Fires"
                href="/observe/earth/fires"
                loading={loading}
              />

              <VitalSign
                value={data?.solarWind?.speed || 0}
                label="Solar Wind (km/s)"
                href="/observe/space/solar-observatory"
                loading={loading}
              />

              {/* Row 2: Space + Infrastructure */}
              <VitalSign
                value={data?.kpIndex?.value || 0}
                label={`Kp Index · ${data?.kpIndex?.status || 'quiet'}`}
                href="/observe/space/aurora"
                status={kpStatus}
                loading={loading}
              />

              <VitalSign
                value={data?.cosmicRays?.flux || 0}
                label="Cosmic Rays"
                href="/observe/detectors/cosmic-rays"
                loading={loading}
              />

              <VitalSign
                value={data?.ukGrid?.demand || 0}
                label="UK Grid (GW)"
                href="/observe/infrastructure/power"
                loading={loading}
              />

              {/* Population - special animated component */}
              {loading ? (
                <VitalSign
                  value={0}
                  label="Humans"
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

              {/* Row 3: Detectors + Climate */}
              <StatusVitalSign
                status={data?.lhc?.status || 'LOADING'}
                label="LHC"
                context={data?.lhc?.beamEnergy ? `${data.lhc.beamEnergy} TeV` : undefined}
                href="/observe/detectors/lhc"
                statusColor={lhcStatusColor}
                loading={loading}
              />

              <VitalSign
                value={data?.seaIce?.extent || 0}
                label="Arctic Sea Ice (M km²)"
                href="/observe/earth/climate"
                loading={loading}
              />

              <VitalSign
                value={data?.uvIndex?.value || 0}
                label="UV Index (Local)"
                href="/observe/earth/atmosphere"
                loading={loading}
              />

              <VitalSign
                value={data?.nearestAsteroid?.distance || 0}
                label="Nearest Asteroid (LD)"
                href="/observe/space/asteroids"
                loading={loading}
              />

              {/* Row 4: Additional metrics */}
              <VitalSign
                value={data?.seaLevel?.rise || 0}
                label="Sea Level Rise (mm)"
                href="/observe/earth/climate"
                loading={loading}
              />

              <VitalSign
                value={data?.solarFlares?.today || 0}
                label="Solar Flares (24h)"
                href="/observe/space/solar-observatory"
                loading={loading}
              />

              <VitalSign
                value={data?.neutronMonitor?.flux || 0}
                label="Neutron Flux"
                href="/observe/detectors/cosmic-rays"
                loading={loading}
              />

              <VitalSign
                value={data?.internetTraffic?.tbps || 0}
                label="Internet Traffic (Tbps)"
                href="/observe/infrastructure/internet"
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
          <section className="bg-white rounded-lg p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-6">
              Explore
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-px">
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
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
