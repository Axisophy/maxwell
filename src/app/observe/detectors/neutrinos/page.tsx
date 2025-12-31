'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'

interface NeutrinoAlert {
  id: string
  time: string
  energy: string
  type: 'track' | 'cascade'
  ra: number
  dec: number
  error: string
  followUp: string
}

interface Detector {
  name: string
  location: string
  volume: string
  sensors: number
  depth: string
  status: string
}

interface NeutrinoData {
  alerts: NeutrinoAlert[]
  detectors: Detector[]
  alertsToday: number
  alertsThisWeek: number
  supernovaWatch: string
}

export default function NeutrinosPage() {
  const [data, setData] = useState<NeutrinoData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/neutrino-alerts')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch neutrino data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

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
              { label: 'Neutrinos' },
            ]}
            theme="dark"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-3">
            Neutrino Observatories
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl">
            Ghost particles from the cosmos. Nearly massless, barely interacting with matter,
            yet trillions pass through you every second.
          </p>
        </div>

        {/* Alert Summary */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-3xl font-light text-cyan-400">{data?.alertsToday || 0}</p>
              <p className="text-xs text-white/40">Alerts today</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-3xl font-light text-white">{data?.alertsThisWeek || 0}</p>
              <p className="text-xs text-white/40">Alerts this week</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-3xl font-light text-emerald-400">10¹⁵</p>
              <p className="text-xs text-white/40">Solar ν / second</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className={`text-lg font-light ${data?.supernovaWatch === 'No alerts' ? 'text-emerald-400' : 'text-red-400'}`}>
                {data?.supernovaWatch || 'Monitoring'}
              </p>
              <p className="text-xs text-white/40">Supernova watch</p>
            </div>
          </div>
        </section>

        {/* IceCube Section */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            IceCube Neutrino Observatory
          </h2>
          <div className="bg-[#0f0f14] rounded-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visualization */}
              <div className="relative">
                <div className="aspect-square max-w-xs mx-auto">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Ice layers */}
                    <rect x="40" y="0" width="120" height="200" fill="#0a1628" />
                    {/* Surface */}
                    <rect x="30" y="0" width="140" height="20" fill="#e8f4fc" />
                    {/* Detector strings */}
                    {[...Array(7)].map((_, i) => (
                      <g key={i}>
                        <line
                          x1={60 + i * 15}
                          y1="40"
                          x2={60 + i * 15}
                          y2="180"
                          stroke="#06b6d4"
                          strokeWidth="1"
                          opacity="0.5"
                        />
                        {[...Array(6)].map((_, j) => (
                          <circle
                            key={j}
                            cx={60 + i * 15}
                            cy={50 + j * 25}
                            r="2"
                            fill="#06b6d4"
                          />
                        ))}
                      </g>
                    ))}
                    {/* Labels */}
                    <text x="100" y="12" fill="#333" fontSize="6" textAnchor="middle">Surface</text>
                    <text x="10" y="60" fill="white" fontSize="5" opacity="0.5">1,450m</text>
                    <text x="10" y="180" fill="white" fontSize="5" opacity="0.5">2,450m</text>
                  </svg>
                </div>
                <p className="text-center text-xs text-white/40 mt-4">
                  5,160 optical sensors in 1 km³ of Antarctic ice
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-white/40 mb-1">Location</p>
                  <p className="text-white">South Pole, Antarctica</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Detector Volume</p>
                  <p className="text-white">1 cubic kilometre of ice</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">How It Works</p>
                  <p className="text-sm text-white/60">
                    When a high-energy neutrino interacts with ice, it produces a charged
                    particle that travels faster than light in the medium. This creates
                    Cherenkov radiation — a blue glow detected by optical sensors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Alerts */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Recent High-Energy Alerts
          </h2>
          <div className="bg-[#0f0f14] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 font-normal px-4 py-3">ID</th>
                  <th className="text-left text-xs text-white/40 font-normal px-4 py-3">Time (UTC)</th>
                  <th className="text-left text-xs text-white/40 font-normal px-4 py-3">Energy</th>
                  <th className="text-left text-xs text-white/40 font-normal px-4 py-3">Type</th>
                  <th className="text-left text-xs text-white/40 font-normal px-4 py-3">Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {data?.alerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-white/5">
                    <td className="px-4 py-3 text-cyan-400 font-mono">{alert.id}</td>
                    <td className="px-4 py-3 text-sm text-white/60">
                      {new Date(alert.time).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-white/80 font-mono">{alert.energy}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        alert.type === 'track' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {alert.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/50">{alert.followUp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Other Detectors */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Global Neutrino Network
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data?.detectors.map((detector) => (
              <div key={detector.name} className="bg-[#0f0f14] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${
                    detector.status === 'operating' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`} />
                  <h3 className="text-white font-medium">{detector.name}</h3>
                </div>
                <p className="text-xs text-white/40 mb-2">{detector.location}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/40">Volume</span>
                    <span className="text-white/60">{detector.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Sensors</span>
                    <span className="text-white/60">{detector.sensors.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Depth</span>
                    <span className="text-white/60">{detector.depth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supernova Watch */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Supernova Early Warning
          </h2>
          <div className="bg-[#0f0f14] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💥</span>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">SNEWS Network</h3>
                <p className="text-sm text-white/60 mb-3">
                  If a star explodes in our galaxy, neutrino detectors would see it hours
                  before light arrives. The Supernova Early Warning System (SNEWS) coordinates
                  alerts between detectors worldwide to give astronomers advance notice.
                </p>
                <p className="text-xs text-white/40">
                  Last galactic supernova: SN 1987A (Large Magellanic Cloud) • Next expected: Unknown (once every ~50 years in Milky Way)
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
              href="/observe/detectors/cosmic-rays"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Cosmic Rays →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/30 mb-2">Data Sources</p>
            <p className="text-xs text-white/40">
              IceCube Neutrino Observatory • GCN Circulars • SNEWS
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
