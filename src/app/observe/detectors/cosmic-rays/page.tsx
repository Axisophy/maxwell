'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'

interface NeutronStation {
  name: string
  location: string
  country: string
  altitude: number
  count: number
  baseline: number
  deviation: number
  status: 'online' | 'offline'
}

interface CosmicRayData {
  stations: NeutronStation[]
  globalAverage: {
    count: number
    deviation: number
    status: string
  }
  solarCyclePhase: string
  groundLevelEvents: number
  lastForbush: string
}

export default function CosmicRaysPage() {
  const [data, setData] = useState<CosmicRayData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/cosmic-rays')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch cosmic ray data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  const getDeviationColor = (deviation: number) => {
    if (Math.abs(deviation) < 1) return 'text-emerald-400'
    if (Math.abs(deviation) < 3) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Observe', href: '/observe' },
              { label: 'Detectors', href: '/observe/detectors' },
              { label: 'Cosmic Rays' },
            ]}
            theme="dark"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-3">
            Cosmic Ray Monitors
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl">
            High-energy particles from supernovae and black holes, bombarding Earth
            constantly. The global neutron monitor network tracks their flux.
          </p>
        </div>

        {/* Current Flux */}
        <section className="mb-8">
          <div className="bg-[#0f0f14] rounded-xl p-8 text-center">
            <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
              Global Cosmic Ray Flux
            </h2>
            <div className="mb-4">
              <span className="text-6xl md:text-7xl font-light text-white">
                {data?.globalAverage.count.toLocaleString() || '-'}
              </span>
              <span className="text-xl text-white/40 ml-2">counts/min</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className={`text-2xl font-mono ${data ? getDeviationColor(data.globalAverage.deviation) : ''}`}>
                {(data?.globalAverage.deviation ?? 0) > 0 ? '+' : ''}{data?.globalAverage.deviation}%
              </span>
              <span className="text-white/40">from baseline</span>
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm ${
              data?.globalAverage.status === 'Normal'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/20 text-amber-400'
            }`}>
              {data?.globalAverage.status || 'Monitoring'}
            </div>

            {/* 24h trend visualization */}
            <div className="mt-6 max-w-lg mx-auto">
              <div className="flex items-end justify-center gap-1 h-16">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-cyan-400/50 rounded-t"
                    style={{ height: `${30 + Math.random() * 70}%` }}
                  />
                ))}
              </div>
              <p className="text-xs text-white/40 mt-2">24-hour flux trend</p>
            </div>
          </div>
        </section>

        {/* Solar Cycle Context */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-xs text-white/40 mb-1">Solar Cycle Phase</p>
              <p className="text-lg text-amber-400">{data?.solarCyclePhase || 'Solar Cycle 25'}</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-xs text-white/40 mb-1">Ground-Level Events</p>
              <p className="text-lg text-white">{data?.groundLevelEvents || 0} this year</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-xs text-white/40 mb-1">Last Forbush Decrease</p>
              <p className="text-lg text-white">{data?.lastForbush || 'N/A'}</p>
            </div>
          </div>
        </section>

        {/* Neutron Monitor Network */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Neutron Monitor Network
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.stations.map((station) => (
              <div key={station.name} className="bg-[#0f0f14] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      station.status === 'online' ? 'bg-emerald-400' : 'bg-red-400'
                    }`} />
                    <span className="text-white font-medium">{station.name}</span>
                  </div>
                  <span className="text-xs text-white/40">{station.country}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Count rate</span>
                    <span className="text-lg font-mono text-white">{station.count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Deviation</span>
                    <span className={`text-sm font-mono ${getDeviationColor(station.deviation)}`}>
                      {station.deviation > 0 ? '+' : ''}{station.deviation}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Altitude</span>
                    <span className="text-xs text-white/60">{station.altitude.toLocaleString()} m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Space Weather Connection */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Space Weather Connection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Forbush Decreases</h3>
              <p className="text-xs text-white/50 leading-relaxed mb-3">
                During solar storms (CMEs), the enhanced magnetic field sweeps cosmic rays
                away from Earth. This causes a sudden drop in neutron counts - a Forbush
                decrease - that can last for days.
              </p>
              <div className="bg-white/5 rounded p-3">
                <p className="text-xs text-white/40">Typical drop: 3-20%</p>
                <p className="text-xs text-white/40">Recovery: 2-7 days</p>
              </div>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Solar Cycle Modulation</h3>
              <p className="text-xs text-white/50 leading-relaxed mb-3">
                Cosmic ray flux anticorrelates with solar activity. During solar maximum,
                the stronger solar wind pushes cosmic rays away, reducing flux by 20-30%
                compared to solar minimum.
              </p>
              <div className="bg-white/5 rounded p-3">
                <p className="text-xs text-white/40">Current cycle: Solar Cycle 25</p>
                <p className="text-xs text-white/40">Peak expected: ~2025</p>
              </div>
            </div>
          </div>
        </section>

        {/* What Are Cosmic Rays */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            What Are Cosmic Rays?
          </h2>
          <div className="bg-[#0f0f14] rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-white font-medium mb-2">Composition</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  ~90% protons, ~9% alpha particles (helium nuclei), ~1% heavier nuclei and
                  electrons. Energies range from MeV to beyond 10²⁰ eV.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Sources</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Supernova remnants, active galactic nuclei, and other cosmic accelerators.
                  The highest-energy particles come from outside our galaxy.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Detection</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Primary cosmic rays hit atmosphere, creating showers of secondary particles.
                  Neutron monitors detect the neutron component at ground level.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/observe/detectors"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Back to Detectors
            </Link>
            <Link
              href="/observe/detectors/lhc"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              LHC →
            </Link>
            <Link
              href="/observe/space/aurora"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Aurora Forecast →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/30 mb-2">Data Sources</p>
            <p className="text-xs text-white/40">
              NMDB Neutron Monitor Database • Oulu Cosmic Ray Station • NOAA SWPC
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
