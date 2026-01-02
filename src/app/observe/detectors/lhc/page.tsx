'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'

interface LHCData {
  machineMode: string
  beamEnergy: number
  beam1Intensity: number
  beam2Intensity: number
  luminosity: number
  fillNumber: number
  fillDuration: string
}

const EXPERIMENTS = [
  {
    name: 'ATLAS',
    fullName: 'A Toroidal LHC ApparatuS',
    description: 'General-purpose detector studying the Higgs boson, searching for new particles, and probing the nature of dark matter.',
    status: 'Taking data',
  },
  {
    name: 'CMS',
    fullName: 'Compact Muon Solenoid',
    description: 'General-purpose detector with complementary design to ATLAS. Co-discovered the Higgs boson in 2012.',
    status: 'Taking data',
  },
  {
    name: 'ALICE',
    fullName: 'A Large Ion Collider Experiment',
    description: 'Specialised for heavy-ion collisions, studying quark-gluon plasma - matter as it existed microseconds after the Big Bang.',
    status: 'Taking data',
  },
  {
    name: 'LHCb',
    fullName: 'LHC beauty',
    description: 'Studying asymmetry between matter and antimatter using B-mesons. Investigating why the universe is made of matter.',
    status: 'Taking data',
  },
]

const MACHINE_MODE_INFO: Record<string, { color: string; description: string }> = {
  'NO BEAM': { color: 'text-white/40', description: 'Machine empty, maintenance or setup' },
  'INJECTION PROBE BEAM': { color: 'text-cyan-400', description: 'Testing injection systems' },
  'INJECTION PHYSICS BEAM': { color: 'text-cyan-400', description: 'Filling the machine with protons' },
  'PREPARE RAMP': { color: 'text-amber-400', description: 'Preparing to increase energy' },
  'RAMP': { color: 'text-amber-400', description: 'Accelerating beams to collision energy' },
  'FLAT TOP': { color: 'text-amber-400', description: 'At full energy, preparing for collisions' },
  'SQUEEZE': { color: 'text-amber-400', description: 'Focusing beams for collision' },
  'ADJUST': { color: 'text-amber-400', description: 'Final adjustments before collisions' },
  'STABLE BEAMS': { color: 'text-emerald-400', description: 'Collisions happening! Physics data being recorded.' },
  'UNSTABLE BEAMS': { color: 'text-red-400', description: 'Beam instabilities detected' },
  'BEAM DUMP': { color: 'text-white/40', description: 'Beams extracted, end of physics fill' },
}

export default function LHCPage() {
  const [data, setData] = useState<LHCData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/lhc')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch LHC data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60 * 1000) // Every minute
    return () => clearInterval(interval)
  }, [fetchData])

  const modeInfo = data ? MACHINE_MODE_INFO[data.machineMode] || MACHINE_MODE_INFO['NO BEAM'] : null

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
              { label: 'LHC' },
            ]}
            theme="dark"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-3">
            Large Hadron Collider
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl">
            The world&apos;s largest and most powerful particle accelerator. 27 kilometres of
            superconducting magnets guiding protons to 99.9999991% the speed of light.
          </p>
        </div>

        {/* Beam Status Hero */}
        <section className="mb-8">
          <div className="bg-[#0f0f14] rounded-xl p-8">
            {/* Beam visualization */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                {/* Circular ring */}
                <div className="aspect-square max-w-md mx-auto border-4 border-white/10 rounded-full relative">
                  {/* Beam indicators */}
                  {data?.machineMode !== 'NO BEAM' && (
                    <>
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
                    </>
                  )}

                  {/* Center info */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Machine Mode</p>
                      <p className={`text-2xl font-mono font-bold ${modeInfo?.color || 'text-white/40'}`}>
                        {loading ? '...' : data?.machineMode || 'NO BEAM'}
                      </p>
                      <p className="text-xs text-white/40 mt-2 max-w-48">
                        {modeInfo?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Beam direction arrows */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-white/20">Beam 1 →</div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/20">← Beam 2</div>
                </div>
              </div>
            </div>

            {/* Key parameters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-xs text-white/40 mb-1">Beam Energy</p>
                <p className="text-2xl font-mono font-bold text-purple-400">
                  {data ? (data.beamEnergy / 1000).toFixed(1) : '-'}
                </p>
                <p className="text-xs text-white/30">TeV per beam</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-xs text-white/40 mb-1">Collision Energy</p>
                <p className="text-2xl font-mono font-bold text-white">
                  {data ? (data.beamEnergy * 2 / 1000).toFixed(1) : '-'}
                </p>
                <p className="text-xs text-white/30">TeV</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-xs text-white/40 mb-1">Fill Number</p>
                <p className="text-2xl font-mono font-bold text-white">
                  {data?.fillNumber || '-'}
                </p>
                <p className="text-xs text-white/30">{data?.fillDuration || ''}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-xs text-white/40 mb-1">Luminosity</p>
                <p className="text-2xl font-mono font-bold text-cyan-400">
                  {data?.luminosity || '-'}
                </p>
                <p className="text-xs text-white/30">×10³⁴ cm⁻²s⁻¹</p>
              </div>
            </div>
          </div>
        </section>

        {/* Beam Intensities */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Beam Intensities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-cyan-400 font-medium">Beam 1</span>
                <span className="text-white/40 text-sm">clockwise</span>
              </div>
              <p className="text-3xl font-mono font-bold text-white">
                {data?.beam1Intensity ? `${(data.beam1Intensity / 100).toFixed(1)}×10¹³` : '-'}
              </p>
              <p className="text-xs text-white/40">protons</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-purple-400 font-medium">Beam 2</span>
                <span className="text-white/40 text-sm">counter-clockwise</span>
              </div>
              <p className="text-3xl font-mono font-bold text-white">
                {data?.beam2Intensity ? `${(data.beam2Intensity / 100).toFixed(1)}×10¹³` : '-'}
              </p>
              <p className="text-xs text-white/40">protons</p>
            </div>
          </div>
        </section>

        {/* Experiments */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Experiments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXPERIMENTS.map((exp) => (
              <div key={exp.name} className="bg-[#0f0f14] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-white">{exp.name}</h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-mono rounded">
                    {exp.status}
                  </span>
                </div>
                <p className="text-xs text-white/40 mb-2">{exp.fullName}</p>
                <p className="text-sm text-white/60">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Machine Modes Guide */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Machine Modes Explained
          </h2>
          <div className="bg-[#0f0f14] rounded-xl p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(MACHINE_MODE_INFO).slice(0, 9).map(([mode, info]) => (
                <div key={mode} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    info.color.includes('emerald') ? 'bg-emerald-400' :
                    info.color.includes('amber') ? 'bg-amber-400' :
                    info.color.includes('cyan') ? 'bg-cyan-400' :
                    info.color.includes('red') ? 'bg-red-400' :
                    'bg-white/40'
                  }`} />
                  <div>
                    <p className="text-sm text-white font-medium">{mode}</p>
                    <p className="text-xs text-white/50">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LHC By Numbers */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            LHC By Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-white">27</p>
              <p className="text-xs text-white/40">km circumference</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-white">-271°C</p>
              <p className="text-xs text-white/40">magnet temperature</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-white">1,232</p>
              <p className="text-xs text-white/40">dipole magnets</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-white">600M</p>
              <p className="text-xs text-white/40">collisions/second</p>
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
              href="/observe/detectors/gravitational"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Gravitational Waves →
            </Link>
            <Link
              href="/data/fabric/particles"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Particle Data →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/30 mb-2">Data Sources</p>
            <p className="text-xs text-white/40">
              CERN LHC Page 1 • CERN Accelerator Complex
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
