import { Metadata } from 'next'
import Link from 'next/link'
import { PawPrint, Waves, Bird } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Life | Observe | MXWLL',
  description: 'Wildlife tracking and biological monitoring. GPS-tracked animals, ocean sounds, and bird observations.',
}

const lifePages = [
  {
    href: '/observe/wildlife',
    title: 'Wildlife Tracking',
    description: 'Where are they now? Live GPS tracking of sharks, whales, turtles, and birds worldwide.',
    icon: PawPrint,
    status: 'LIVE',
    available: true,
  },
  {
    href: '/observe/life/ocean',
    title: 'Ocean',
    description: 'Deep sea cameras, hydrophone networks, and marine life monitoring.',
    icon: Waves,
    status: 'COMING SOON',
    available: false,
  },
  {
    href: '/observe/life/birds',
    title: 'Birds',
    description: 'eBird sightings, nest cameras, and migration tracking.',
    icon: Bird,
    status: 'COMING SOON',
    available: false,
  },
]

export default function LifePortalPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Observe', href: '/observe' },
              { label: 'Life' },
            ]}
            theme="light"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Life
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            Monitoring the living world. Wildlife tracking, ocean acoustics, and bird observations
            from researchers and citizen scientists around the globe.
          </p>
        </div>

        {/* Hero Stats */}
        <div className="bg-white rounded-xl p-6 md:p-8 mb-8 max-w-3xl">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <PawPrint size={40} className="text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-black mb-2">
                The Living Planet
              </h2>
              <p className="text-sm text-black/50">
                Real-time data from GPS trackers, acoustic sensors, and citizen science networks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[#f5f5f5] rounded-lg">
              <p className="text-2xl font-light text-black">8.7M</p>
              <p className="text-xs text-black/50">estimated species</p>
            </div>
            <div className="text-center p-4 bg-[#f5f5f5] rounded-lg">
              <p className="text-2xl font-light text-black">1,000+</p>
              <p className="text-xs text-black/50">tracked animals</p>
            </div>
            <div className="text-center p-4 bg-[#f5f5f5] rounded-lg">
              <p className="text-2xl font-light text-black">500M+</p>
              <p className="text-xs text-black/50">eBird observations</p>
            </div>
            <div className="text-center p-4 bg-[#f5f5f5] rounded-lg">
              <p className="text-2xl font-light text-black">70+</p>
              <p className="text-xs text-black/50">hydrophone stations</p>
            </div>
          </div>
        </div>

        {/* Section Cards */}
        <section className="mb-12 max-w-3xl">
          <h2 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
            Live Observations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lifePages.map((page) => {
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

        {/* About Life Monitoring */}
        <section className="mb-12 max-w-3xl">
          <h2 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
            About Life Monitoring
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-medium text-black mb-3">Satellite Tracking</h3>
              <p className="text-xs text-black/50 leading-relaxed">
                GPS and Argos satellite tags transmit locations from animals across the globe.
                Researchers use this data to understand migration patterns, habitat use, and
                species behaviour in ways never before possible.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-medium text-black mb-3">Citizen Science</h3>
              <p className="text-xs text-black/50 leading-relaxed">
                Projects like eBird and iNaturalist harness observations from millions of
                volunteers worldwide, creating unprecedented datasets for understanding
                biodiversity and environmental change.
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
              href="/observe/wildlife"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              Wildlife Tracking →
            </Link>
            <Link
              href="/data/earth/life"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              Life Data →
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
