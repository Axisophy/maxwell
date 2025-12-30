import { Metadata } from 'next'
import Link from 'next/link'
import { Mountain, Flame, Cloud, Wind } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import EarthStatusBar from '@/components/observe/earth/EarthStatusBar'
import EarthHero from '@/components/observe/earth/EarthHero'

export const metadata: Metadata = {
  title: 'Earth | MXWLL',
  description: 'Live monitoring of our planet. Earthquakes, volcanoes, fires, weather, and atmosphere in real-time.',
}

const earthPages = [
  {
    href: '/observe/earth/unrest',
    title: 'Unrest',
    description: 'Live seismic and volcanic activity. Earthquakes, eruptions, and tectonic monitoring worldwide.',
    icon: Mountain,
    status: 'LIVE',
    available: true,
  },
  {
    href: '/observe/earth/fires',
    title: 'Active Fires',
    description: 'Real-time wildfire detection from MODIS and VIIRS satellite sensors.',
    icon: Flame,
    status: 'SOON',
    available: false,
  },
  {
    href: '/observe/earth/weather',
    title: 'Weather',
    description: 'Global weather patterns. Satellite imagery, storms, and atmospheric conditions.',
    icon: Cloud,
    status: 'SOON',
    available: false,
  },
  {
    href: '/observe/earth/atmosphere',
    title: 'Atmosphere',
    description: 'Air quality, CO₂ levels, and atmospheric composition monitoring.',
    icon: Wind,
    status: 'SOON',
    available: false,
  },
]

export default function EarthPage() {
  return (
    <main className="min-h-screen">
      {/* Dark hero section */}
      <div className="bg-[#0a0a0f] text-white">
        <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-12">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Observe', href: '/observe' },
                { label: 'Earth' },
              ]}
              theme="dark"
              className="mb-2"
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-3">
              Earth
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-2xl">
              Live monitoring of our planet. Earthquakes, volcanoes, fires, weather,
              and atmosphere in real-time.
            </p>
          </div>

          {/* Status Bar */}
          <EarthStatusBar className="mb-8" />

          {/* Hero Visualization */}
          <EarthHero className="mb-8" />
        </div>
      </div>

      {/* Light content section */}
      <div className="bg-[#f5f5f5]">
        <div className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
          {/* Main Pages */}
          <section className="mb-12">
            <h2 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
              Live Observations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              {earthPages.map((page) => {
                const Icon = page.icon

                if (!page.available) {
                  return (
                    <div
                      key={page.title}
                      className="bg-white rounded-xl border border-[#e5e5e5] p-6 opacity-60"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-[#f5f5f5] rounded-lg">
                          <Icon size={22} className="text-black/30" strokeWidth={1.5} />
                        </div>
                        <span className="px-2 py-0.5 bg-black/5 text-black/40 text-xs font-mono rounded">
                          {page.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-black/50 mb-2">
                        {page.title}
                      </h3>
                      <p className="text-sm text-black/30 leading-relaxed">
                        {page.description}
                      </p>
                    </div>
                  )
                }

                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="bg-white rounded-xl border border-[#e5e5e5] p-6 hover:border-black transition-colors group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 bg-[#f5f5f5] rounded-lg">
                        <Icon size={22} className="text-black/50" strokeWidth={1.5} />
                      </div>
                      {page.status === 'LIVE' && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-mono rounded">
                          {page.status}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-black mb-2 group-hover:underline">
                      {page.title}
                    </h3>
                    <p className="text-sm text-black/50 leading-relaxed">
                      {page.description}
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* What's Happening */}
          <section className="mb-12 max-w-3xl">
            <h2 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
              Earth in Motion
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <h3 className="text-sm font-medium text-black">Tectonic Activity</h3>
                </div>
                <p className="text-xs text-black/50 leading-relaxed">
                  Earth experiences thousands of earthquakes daily, most too small to feel.
                  Major plate boundaries like the Pacific Ring of Fire see the most activity,
                  with magnitude 5+ events occurring several times per week.
                </p>
              </div>

              <div className="bg-white rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <h3 className="text-sm font-medium text-black">Volcanic Systems</h3>
                </div>
                <p className="text-xs text-black/50 leading-relaxed">
                  Around 40-50 volcanoes are actively erupting at any given time.
                  The Smithsonian Global Volcanism Program tracks activity worldwide,
                  from effusive lava flows to explosive eruptions.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-black/10 max-w-3xl">
            <div className="flex flex-wrap gap-6">
              <Link
                href="/observe"
                className="text-black/60 hover:text-black transition-colors text-sm"
              >
                ← Back to Observe
              </Link>
              <Link
                href="/data/earth"
                className="text-black/60 hover:text-black transition-colors text-sm"
              >
                Earth Data →
              </Link>
              <Link
                href="/data/solar-system/earth"
                className="text-black/60 hover:text-black transition-colors text-sm"
              >
                Earth in Solar System →
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}
