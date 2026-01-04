'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BreadcrumbFrame, breadcrumbItems, PageHeaderFrame } from '@/components/ui'
import { ObserveIcon } from '@/components/icons'

interface Detector {
  name: string
  location: string
  status: 'observing' | 'commissioning' | 'offline' | 'maintenance'
  armLength: string
}

interface Event {
  id: string
  date: string
  type: 'BBH' | 'BNS' | 'NSBH' | 'MassGap' | 'Burst'
  distance: string
  significance: string
  masses?: string
}

interface GWData {
  detectors: Detector[]
  recentEvents: Event[]
  observingRun: string
  totalDetections: number
}

const EVENT_TYPE_INFO: Record<string, { label: string; color: string }> = {
  'BBH': { label: 'Binary Black Hole', color: 'text-purple-400' },
  'BNS': { label: 'Binary Neutron Star', color: 'text-cyan-400' },
  'NSBH': { label: 'Neutron Star - Black Hole', color: 'text-amber-400' },
  'MassGap': { label: 'Mass Gap', color: 'text-orange-400' },
  'Burst': { label: 'Unmodeled Burst', color: 'text-red-400' },
}

export default function GravitationalWavesPage() {
  const [data, setData] = useState<GWData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/gravitational-waves')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch GW data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'observing': return 'bg-emerald-500'
      case 'commissioning': return 'bg-amber-500'
      case 'maintenance': return 'bg-blue-500'
      default: return 'bg-red-500'
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        <BreadcrumbFrame
          variant="dark"
          icon={<ObserveIcon className="w-4 h-4" />}
          items={breadcrumbItems(
            ['MXWLL', '/'],
            ['Observe', '/observe'],
            ['Detectors', '/observe/detectors'],
            ['Gravitational Waves']
          )}
        />

        <PageHeaderFrame
          variant="dark"
          title="Gravitational waves"
          description="Ripples in spacetime from the most violent events in the universe. LIGO and Virgo listening for colliding black holes and neutron stars."
        />

        {/* Waveform visualization */}
        <section className="mb-8">
          <div className="bg-[#0f0f14] rounded-xl p-8">
            <div className="max-w-2xl mx-auto">
              {/* Simulated waveform */}
              <svg viewBox="0 0 400 100" className="w-full h-24">
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {/* Chirp waveform */}
                <path
                  d="M 0 50 Q 50 50 100 50 Q 120 45 140 55 Q 160 40 180 60 Q 200 30 220 70 Q 240 20 260 80 Q 280 10 300 90 Q 310 50 320 50 Q 400 50 400 50"
                  fill="none"
                  stroke="url(#waveGradient)"
                  strokeWidth="2"
                />
                {/* Center line */}
                <line x1="0" y1="50" x2="400" y2="50" stroke="white" strokeOpacity="0.1" />
              </svg>
              <p className="text-center text-sm text-white/40 mt-4">
                Characteristic &quot;chirp&quot; waveform from a binary black hole merger
              </p>
            </div>
          </div>
        </section>

        {/* Detector Network Status */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Detector Network
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data?.detectors.map((detector) => (
              <div key={detector.name} className="bg-[#0f0f14] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(detector.status)} ${detector.status === 'observing' ? 'animate-pulse' : ''}`} />
                  <span className="text-white font-medium">{detector.name}</span>
                </div>
                <p className="text-xs text-white/40 mb-1">{detector.location}</p>
                <p className="text-sm text-white/60">Arm length: {detector.armLength}</p>
                <p className={`text-xs mt-2 uppercase tracking-wider ${
                  detector.status === 'observing' ? 'text-emerald-400' :
                  detector.status === 'commissioning' ? 'text-amber-400' : 'text-white/40'
                }`}>
                  {detector.status}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Detections */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider">
              Recent Detections
            </h2>
            <span className="text-sm text-white/40">
              {data?.observingRun} • {data?.totalDetections}+ total detections
            </span>
          </div>
          <div className="bg-[#0f0f14] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 font-normal px-4 py-3">Event</th>
                  <th className="text-left text-xs text-white/40 font-normal px-4 py-3">Date</th>
                  <th className="text-left text-xs text-white/40 font-normal px-4 py-3">Type</th>
                  <th className="text-left text-xs text-white/40 font-normal px-4 py-3">Distance</th>
                  <th className="text-left text-xs text-white/40 font-normal px-4 py-3">Masses</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentEvents.map((event) => (
                  <tr key={event.id} className="border-b border-white/5">
                    <td className="px-4 py-3 text-cyan-400 font-mono">{event.id}</td>
                    <td className="px-4 py-3 text-sm text-white/60">{event.date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm ${EVENT_TYPE_INFO[event.type]?.color || 'text-white/60'}`}>
                        {EVENT_TYPE_INFO[event.type]?.label || event.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/80 font-mono">{event.distance}</td>
                    <td className="px-4 py-3 text-sm text-white/60">{event.masses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Laser Interferometry</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Each detector has two 4km arms at right angles. A laser beam is split and
                sent down both arms, bouncing off mirrors at the ends. When the beams
                recombine, any difference in arm length creates an interference pattern.
              </p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Incredible Precision</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                LIGO can detect length changes of 10⁻¹⁸ metres - one ten-thousandth the
                diameter of a proton. This is equivalent to measuring the distance to the
                nearest star to the width of a human hair.
              </p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Triangulation</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                By comparing arrival times at multiple detectors, scientists can
                triangulate the source location in the sky. More detectors mean better
                localization for follow-up observations.
              </p>
            </div>
          </div>
        </section>

        {/* Detection Types */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            What We Detect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <h3 className="text-sm font-medium text-white">Binary Black Holes</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Two black holes spiraling together and merging. Most common detection type.
                Creates the characteristic &quot;chirp&quot; waveform as they accelerate.
              </p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-cyan-400" />
                <h3 className="text-sm font-medium text-white">Binary Neutron Stars</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Two neutron stars merging. Produces electromagnetic counterpart (kilonova).
                GW170817 was the first multi-messenger astronomy event.
              </p>
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
              href="/observe/detectors/neutrinos"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Neutrinos →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/30 mb-2">Data Sources</p>
            <p className="text-xs text-white/40">
              LIGO/Virgo GraceDB • Gravitational Wave Open Science Center
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
