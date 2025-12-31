import { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Globe2 } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import InfrastructureStatusBar from '@/components/observe/infrastructure/InfrastructureStatusBar'

export const metadata: Metadata = {
  title: 'Infrastructure | Observe | MXWLL',
  description: 'The invisible systems that keep civilisation running. Power grids, submarine cables, and connectivity.',
}

const infraPages = [
  {
    href: '/observe/infrastructure/power',
    title: 'Power',
    description: 'Global power grids. Generation mix, demand curves, grid frequency, and carbon intensity.',
    icon: Zap,
    status: 'LIVE',
    available: true,
  },
  {
    href: '/observe/infrastructure/internet',
    title: 'Internet',
    description: 'Submarine cables connecting the world. 1.4 million km of fibre across ocean floors.',
    icon: Globe2,
    status: 'LIVE',
    available: true,
  },
]

export default function InfrastructurePortalPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Observe', href: '/observe' },
              { label: 'Infrastructure' },
            ]}
            theme="light"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Infrastructure
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            The invisible systems that keep civilisation running. Power grids balancing
            supply and demand, submarine cables carrying 99% of intercontinental data.
          </p>
        </div>

        {/* Status Bar */}
        <InfrastructureStatusBar className="mb-8 max-w-3xl" />

        {/* Hero Visualization Placeholder */}
        <section className="mb-8 max-w-3xl">
          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-xl aspect-[21/9] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="text-center z-10 text-white">
              <Zap size={48} className="mx-auto mb-2" strokeWidth={1} />
              <p className="text-white/80 text-sm">Power flows continuously</p>
            </div>
          </div>
        </section>

        {/* Section Cards */}
        <section className="mb-12 max-w-3xl">
          <h2 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
            Live Observations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {infraPages.map((page) => {
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
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-mono rounded">
                      {page.status}
                    </span>
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

        {/* Stats Section */}
        <section className="mb-12 max-w-3xl">
          <h2 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
            Global Scale
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-black">29,000</p>
              <p className="text-xs text-black/50">TWh/year consumed</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-black">552</p>
              <p className="text-xs text-black/50">submarine cables</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-black">1.4M</p>
              <p className="text-xs text-black/50">km of fibre</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-black">99%</p>
              <p className="text-xs text-black/50">of data via cables</p>
            </div>
          </div>
        </section>

        {/* Context Section */}
        <section className="mb-12 max-w-3xl">
          <h2 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
            The Invisible Backbone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <h3 className="text-sm font-medium text-black">Power Grids</h3>
              </div>
              <p className="text-xs text-black/50 leading-relaxed">
                Electricity grids must balance supply and demand in real-time. Grid frequency
                (50Hz in UK/Europe, 60Hz in US) is a direct measure of this balance —
                when demand exceeds supply, frequency drops. Operators constantly adjust
                generation to maintain stability.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <h3 className="text-sm font-medium text-black">Submarine Cables</h3>
              </div>
              <p className="text-xs text-black/50 leading-relaxed">
                Despite satellites, 99% of intercontinental internet traffic travels through
                fibre-optic cables on the ocean floor. These cables are surprisingly thin
                (about the diameter of a garden hose) yet carry terabits of data per second
                across thousands of kilometres.
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="mb-12 max-w-3xl">
          <h2 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
            Coming Soon
          </h2>
          <div className="bg-white/50 rounded-xl p-5 border border-dashed border-black/20">
            <p className="text-sm text-black/40">
              Future additions: Aircraft tracking, shipping routes, satellite constellations
            </p>
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
              href="/observe/infrastructure/power"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              Power Grids →
            </Link>
            <Link
              href="/observe/infrastructure/internet"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              Submarine Cables →
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
