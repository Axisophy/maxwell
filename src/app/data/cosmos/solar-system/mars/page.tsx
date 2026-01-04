import { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbFrame, breadcrumbItems, PageHeaderFrame } from '@/components/ui'
import { DataIcon } from '@/components/icons'
import MarsStatsGrid from '@/components/data/mars/MarsStatsGrid'
import ExplorationTimeline from '@/components/data/mars/ExplorationTimeline'
import ActiveMissionsGrid from '@/components/data/mars/ActiveMissionsGrid'

export const metadata: Metadata = {
  title: 'Mars | MXWLL',
  description: 'The Red Planet -target of humanity\'s next giant leap. Rovers, geology, water, and the search for life.',
}

const surfaceFeatures = [
  { name: 'Olympus Mons', type: 'Shield Volcano', fact: '21.9 km high -2.5× Everest' },
  { name: 'Valles Marineris', type: 'Canyon System', fact: '4,000 km long -would span USA' },
  { name: 'Hellas Planitia', type: 'Impact Basin', fact: '2,300 km wide, 7 km deep' },
  { name: 'Jezero Crater', type: 'Ancient Lake', fact: 'Perseverance landing site' },
  { name: 'Gale Crater', type: 'Impact Crater', fact: 'Curiosity location' },
]

export default function MarsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        <BreadcrumbFrame
          variant="light"
          icon={<DataIcon className="w-4 h-4" />}
          items={breadcrumbItems(
            ['MXWLL', '/'],
            ['Data', '/data'],
            ['Solar System', '/data/cosmos/solar-system'],
            ['Mars']
          )}
        />

        <PageHeaderFrame
          variant="light"
          title="Mars"
          description="The Red Planet - target of humanity's next giant leap. More explored than any world beyond Earth, yet still full of mysteries."
        />

        {/* Hero Image Placeholder */}
        <section className="mb-8 md:mb-12">
          <div className="bg-[#0f172a] rounded-xl aspect-[21/9] flex items-center justify-center">
            <p className="text-white/30 text-sm">Mars surface imagery</p>
          </div>
        </section>

        {/* Key Stats */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            At a Glance
          </h2>
          <MarsStatsGrid />
        </section>

        {/* Size Comparison */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Mars vs Earth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 flex items-center justify-center">
              <div className="flex items-end gap-8">
                <div className="text-center">
                  <div
                    className="w-24 h-24 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: '#C1440E' }}
                  />
                  <p className="text-sm font-medium text-black">Mars</p>
                  <p className="text-xs text-black/50">6,779 km</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-44 h-44 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: '#6B93D6' }}
                  />
                  <p className="text-sm font-medium text-black">Earth</p>
                  <p className="text-xs text-black/50">12,742 km</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5">
                <div className="flex justify-between mb-2">
                  <span className="text-black/50">Diameter</span>
                  <span className="font-mono text-black">53% of Earth</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-black/50">Mass</span>
                  <span className="font-mono text-black">11% of Earth</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-black/50">Gravity</span>
                  <span className="font-mono text-black">38% of Earth</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Surface area</span>
                  <span className="font-mono text-black">≈ Earth&apos;s land area</span>
                </div>
              </div>
              <p className="text-sm text-black/60">
                Mars is about the size of Earth&apos;s land area (minus oceans). You could walk the
                same distance on Mars as you could on all of Earth&apos;s continents combined.
              </p>
            </div>
          </div>
        </section>

        {/* Surface Features */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            The Surface
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {surfaceFeatures.map((feature) => (
              <div key={feature.name} className="bg-white rounded-xl p-5">
                <h3 className="font-medium text-black mb-1">{feature.name}</h3>
                <p className="text-sm text-black/50 mb-2">{feature.type}</p>
                <p className="text-sm text-black/70">{feature.fact}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Geology */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Geology: The Extremes
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-medium text-black mb-3">Olympus Mons</h3>
              <p className="text-black/60 leading-relaxed mb-4">
                The largest volcano in the solar system. At 21.9 km high, it&apos;s nearly three
                times the height of Mount Everest. Its base would cover most of France.
              </p>
              <div className="bg-[#f5f5f5] rounded-lg p-4">
                <div className="flex items-end gap-4">
                  <div className="text-center">
                    <div className="w-8 bg-black/20 rounded-t" style={{ height: '40px' }} />
                    <p className="text-xs text-black/50 mt-1">Everest</p>
                    <p className="text-xs font-mono text-black/40">8.8 km</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 bg-[#C1440E] rounded-t" style={{ height: '100px' }} />
                    <p className="text-xs text-black/50 mt-1">Olympus Mons</p>
                    <p className="text-xs font-mono text-black/40">21.9 km</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-medium text-black mb-3">Valles Marineris</h3>
              <p className="text-black/60 leading-relaxed mb-4">
                A canyon system that would stretch from New York to Los Angeles. Up to 7 km deep
                and 200 km wide -the Grand Canyon would be a side tributary.
              </p>
              <div className="bg-[#f5f5f5] rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-3 bg-black/20 rounded" />
                    <span className="text-xs text-black/50">Grand Canyon -446 km</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-full h-3 bg-[#C1440E] rounded" />
                    <span className="text-xs text-black/50 whitespace-nowrap">Valles Marineris -4,000 km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Water */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            The Water Question
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-medium text-black mb-3">Ancient Mars</h3>
              <p className="text-sm text-black/60 leading-relaxed">
                4 billion years ago, Mars may have had oceans covering a third of its surface.
                River valleys and delta deposits tell of a wetter past.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-medium text-black mb-3">Where It Went</h3>
              <p className="text-sm text-black/60 leading-relaxed">
                As Mars lost its magnetic field, solar wind stripped the atmosphere. Without
                air pressure, liquid water couldn&apos;t exist on the surface.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-medium text-black mb-3">Water Today</h3>
              <p className="text-sm text-black/60 leading-relaxed">
                Ice at the poles, frost in craters, and possibly liquid brines underground.
                Radar has detected what may be subsurface lakes.
              </p>
            </div>
          </div>
        </section>

        {/* Atmosphere */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Atmosphere & Weather
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-medium text-black mb-4">Composition</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black/50">Carbon dioxide</span>
                  <span className="font-mono text-black">95.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Nitrogen</span>
                  <span className="font-mono text-black">2.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Argon</span>
                  <span className="font-mono text-black">1.6%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Oxygen</span>
                  <span className="font-mono text-black">0.13%</span>
                </div>
              </div>
              <p className="text-xs text-black/40 mt-4">
                Surface pressure: 0.6% of Earth -too thin to breathe, too thin for liquid water
              </p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-medium text-black mb-4">Weather</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-black/50 mb-1">Temperature range</p>
                  <p className="font-mono text-black">-143°C to +35°C</p>
                </div>
                <div>
                  <p className="text-sm text-black/50 mb-1">Dust storms</p>
                  <p className="text-sm text-black/70">
                    Global storms can last months. The 2018 storm ended Opportunity&apos;s mission
                    by blocking sunlight to its solar panels.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-black/50 mb-1">Dust devils</p>
                  <p className="text-sm text-black/70">
                    Common across Mars. Some reach 8 km high -much taller than Earth&apos;s.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Moons */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            The Moons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-medium text-black mb-2">Phobos</h3>
              <p className="text-sm text-black/50 mb-4">The larger moon</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/50">Diameter</span>
                  <span className="font-mono text-black">22 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Orbit</span>
                  <span className="font-mono text-black">9,377 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Orbital period</span>
                  <span className="font-mono text-black">7.7 hours</span>
                </div>
              </div>
              <p className="text-sm text-black/60 mt-4">
                Phobos orbits so close it rises in the west, sets in the east, and crosses
                the sky in 4 hours. It&apos;s slowly spiraling inward and will crash into Mars
                in ~50 million years.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-medium text-black mb-2">Deimos</h3>
              <p className="text-sm text-black/50 mb-4">The smaller moon</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/50">Diameter</span>
                  <span className="font-mono text-black">12 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Orbit</span>
                  <span className="font-mono text-black">23,460 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Orbital period</span>
                  <span className="font-mono text-black">30.3 hours</span>
                </div>
              </div>
              <p className="text-sm text-black/60 mt-4">
                Deimos is slowly escaping Mars&apos;s gravity. Both moons are likely captured
                asteroids, though their origin is still debated.
              </p>
            </div>
          </div>
        </section>

        {/* Exploration Timeline */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Exploration History
          </h2>
          <p className="text-black/60 mb-6 max-w-2xl">
            60 years of Mars missions -with a success rate of about 50%. Mars is hard.
          </p>
          <ExplorationTimeline />
        </section>

        {/* Active Missions */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            What&apos;s There Now
          </h2>
          <ActiveMissionsGrid />
        </section>

        {/* Search for Life */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            The Search for Life
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-medium text-black mb-3">Past Habitability</h3>
              <p className="text-black/60 leading-relaxed">
                Ancient Mars had liquid water, energy sources, and organic molecules -all the
                ingredients for life as we know it. The question isn&apos;t whether Mars
                could have supported life; it&apos;s whether life actually emerged.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-medium text-black mb-3">Sample Return</h3>
              <p className="text-black/60 leading-relaxed">
                Perseverance is collecting and caching samples for a future mission to bring
                back to Earth. This will be the first time we&apos;ve returned samples from
                another planet -potentially containing evidence of ancient life.
              </p>
            </div>
          </div>
        </section>

        {/* Human Mars */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Human Mars
          </h2>
          <div className="bg-[#1a1a1e] rounded-xl p-6 text-white">
            <h3 className="text-lg font-medium mb-4">The Challenges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/50 text-sm mb-1">Distance</p>
                <p className="font-mono">6-9 months each way</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/50 text-sm mb-1">Radiation</p>
                <p className="font-mono">No magnetic field protection</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/50 text-sm mb-1">Gravity</p>
                <p className="font-mono">38% -long-term effects unknown</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/50 text-sm mb-1">Resources</p>
                <p className="font-mono">Must produce water, O₂, fuel locally</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/50 text-sm mb-1">Communication</p>
                <p className="font-mono">4-24 minute delay each way</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/50 text-sm mb-1">Return</p>
                <p className="font-mono">Need to make fuel on Mars</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-black/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/data/cosmos/solar-system"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              ← Solar System
            </Link>
            <Link
              href="/data/cosmos/solar-system/sun"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              The Sun →
            </Link>
            <Link
              href="/data/cosmos/solar-system/neptune"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              Neptune →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-black/10">
            <p className="text-xs text-black/30 mb-2">Data Sources</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-black/40">
              <span>Physical data: NASA Mars Fact Sheet</span>
              <span>Mission data: NASA/JPL Mars Exploration</span>
              <span>Images: NASA/JPL, ESA</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
