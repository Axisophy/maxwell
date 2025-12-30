import { Metadata } from 'next'
import Link from 'next/link'
import { Sun, Moon, Sparkles, Satellite, Radio, Telescope } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SpaceStatusBar from '@/components/observe/space/SpaceStatusBar'
import SpaceHero from '@/components/observe/space/SpaceHero'

export const metadata: Metadata = {
  title: 'Space | MXWLL',
  description: 'Live observation of our solar system. Real-time data from spacecraft, satellites, and observatories monitoring the Sun, Moon, and near-Earth environment.',
}

const spacePages = [
  {
    href: '/observe/solar-observatory',
    title: 'Solar Observatory',
    description: 'Live solar imagery from SDO, SOHO, and STEREO-A. X-ray flux, solar wind, CMEs, and space weather monitoring.',
    icon: Sun,
    status: 'LIVE',
    statusColor: 'emerald',
  },
  {
    href: '/observe/moon',
    title: 'Lunar Atlas',
    description: 'Explore the Moon\'s surface. Maria, craters, and Apollo landing sites with multiple map layers.',
    icon: Moon,
    status: null,
    statusColor: null,
  },
  {
    href: '/observe/aurora',
    title: 'Aurora Watch',
    description: 'Real-time aurora forecasts. OVATION Prime model predictions for northern and southern lights.',
    icon: Sparkles,
    status: 'LIVE',
    statusColor: 'emerald',
  },
]

const upcomingPages = [
  {
    title: 'Satellites Above',
    description: 'Track satellites and the ISS overhead in real-time.',
    icon: Satellite,
  },
  {
    title: 'Deep Space Network',
    description: 'Live communications with interplanetary spacecraft.',
    icon: Radio,
  },
  {
    title: 'Night Sky',
    description: 'What\'s visible tonight from your location.',
    icon: Telescope,
  },
]

export default function SpacePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Observe', href: '/observe' },
              { label: 'Space' },
            ]}
            theme="dark"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-3">
            Space
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl">
            Live observation of our solar system. Real-time data from spacecraft, satellites,
            and observatories monitoring the Sun, Moon, and near-Earth environment.
          </p>
        </div>

        {/* Status Bar */}
        <SpaceStatusBar className="mb-8" />

        {/* Hero Visualization */}
        <SpaceHero className="mb-10" />

        {/* Main Pages */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Live Observations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spacePages.map((page) => {
              const Icon = page.icon
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className="bg-[#0f0f14] rounded-xl border border-white/10 p-6 hover:border-white/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-white/5 rounded-lg">
                      <Icon size={22} className="text-white/70" strokeWidth={1.5} />
                    </div>
                    {page.status && (
                      <span className={`px-2 py-0.5 bg-${page.statusColor}-500/20 text-${page.statusColor}-400 text-xs font-mono rounded`}>
                        {page.status}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2 group-hover:underline">
                    {page.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {page.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Coming Soon */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingPages.map((page) => {
              const Icon = page.icon
              return (
                <div
                  key={page.title}
                  className="bg-[#0f0f14] rounded-xl border border-white/5 p-6 opacity-60"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-white/5 rounded-lg">
                      <Icon size={22} className="text-white/40" strokeWidth={1.5} />
                    </div>
                    <span className="px-2 py-0.5 bg-white/10 text-white/40 text-xs font-mono rounded">
                      SOON
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-white/60 mb-2">
                    {page.title}
                  </h3>
                  <p className="text-sm text-white/30 leading-relaxed">
                    {page.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* What's Happening Now */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            What&apos;s Happening Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="text-sm font-medium text-white">Solar Cycle 25</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                We&apos;re approaching solar maximum (expected 2024-2025). Sunspot numbers are
                rising, meaning more frequent solar flares, CMEs, and enhanced aurora activity.
              </p>
            </div>

            <div className="bg-[#0f0f14] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-medium text-white">Active Spacecraft</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Data from SDO (solar disk), SOHO &amp; STEREO-A (coronagraphs), and DSCOVR
                (solar wind at L1) stream to Earth continuously, enabling real-time monitoring.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/observe"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Back to Observe
            </Link>
            <Link
              href="/data/solar-system"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Solar System Data →
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
