import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import OrbitalDiagram from '@/components/data/solar-system/OrbitalDiagram'
import PlanetNavigationGrid from '@/components/data/solar-system/PlanetNavigationGrid'
import SizeComparisonChart from '@/components/data/solar-system/SizeComparisonChart'
import PlanetComparisonTable from '@/components/data/solar-system/PlanetComparisonTable'

export const metadata: Metadata = {
  title: 'The Solar System | MXWLL',
  description: 'Eight planets, hundreds of moons, and one star -explore our cosmic neighborhood.',
}

export default function SolarSystemPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Data', href: '/data' },
              { label: 'Solar System' },
            ]}
            theme="light"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            The Solar System
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            Eight planets, hundreds of moons, and one star we call home -
            4.6 billion years in the making.
          </p>
        </div>

        {/* Hero: Orbital Diagram */}
        <section className="mb-8 md:mb-12">
          <div className="bg-[#0f172a] rounded-xl overflow-hidden p-6 md:p-8">
            <OrbitalDiagram />
          </div>
          <p className="text-xs text-black/40 mt-2 text-center">
            Orbits not to scale. Click any body to explore.
          </p>
        </section>

        {/* Quick Stats */}
        <section className="mb-8 md:mb-12">
          <div className="flex flex-wrap gap-4 md:gap-6">
            <StatCard label="Age" value="4.6 billion years" />
            <StatCard label="Planets" value="8" />
            <StatCard label="Known Moons" value="290+" />
            <StatCard label="Dwarf Planets" value="5 recognized" />
            <StatCard label="Nearest Star" value="4.24 light-years" />
          </div>
        </section>

        {/* Planet Navigation Grid */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Explore
          </h2>
          <PlanetNavigationGrid />
        </section>

        {/* Size Comparison */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Size Comparison
          </h2>
          <div className="bg-white rounded-xl p-5 md:p-6">
            <SizeComparisonChart />
            <p className="text-xs text-black/40 mt-4">
              Planets shown to scale. The Sun (1,392,700 km) would be 109× Earth&apos;s diameter.
            </p>
          </div>
        </section>

        {/* Distance Visualization */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            The Emptiness of Space
          </h2>
          <div className="bg-white rounded-xl p-5 md:p-6">
            <p className="text-base text-black/70 mb-4">
              If the Sun were a basketball (24 cm)...
            </p>
            <div className="space-y-3 text-sm">
              <DistanceRow planet="Mercury" object="a pinhead" distance="10 metres away" />
              <DistanceRow planet="Earth" object="a peppercorn" distance="26 metres away" />
              <DistanceRow planet="Jupiter" object="a marble" distance="134 metres away" />
              <DistanceRow planet="Saturn" object="a smaller marble" distance="247 metres away" />
              <DistanceRow planet="Neptune" object="a small bead" distance="773 metres away" />
              <DistanceRow planet="Nearest star" object="another basketball" distance="6,900 km away" />
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Planet Data
          </h2>
          <div className="bg-white rounded-xl overflow-hidden">
            <PlanetComparisonTable />
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Types of Worlds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CategoryCard
              title="Rocky Planets"
              members="Mercury, Venus, Earth, Mars"
              description="Solid surfaces, iron cores, relatively small"
            />
            <CategoryCard
              title="Gas Giants"
              members="Jupiter, Saturn"
              description="Mostly hydrogen and helium, huge, many moons"
            />
            <CategoryCard
              title="Ice Giants"
              members="Uranus, Neptune"
              description="Water, ammonia, methane 'ices' in dense fluid state"
            />
            <CategoryCard
              title="Dwarf Planets"
              members="Pluto, Eris, Ceres, +"
              description="Haven't cleared their orbits, many in Kuiper Belt"
            />
          </div>
        </section>

        {/* Data Sources */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
                Data Sources
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/50">Orbital Data</span>
                  <span className="text-black">NASA JPL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Physical Data</span>
                  <span className="text-black">NASA Planetary Fact Sheets</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Images</span>
                  <span className="text-black">NASA/JPL Photojournal</span>
                </div>
              </div>
            </div>
            <div className="bg-[#e5e5e5] rounded-xl p-5">
              <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
                Related
              </h3>
              <p className="text-sm text-black/50 mb-4">
                See the Sun in real-time with live NASA imagery.
              </p>
              <Link
                href="/observe/solar-observatory"
                className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-[#e6007e] transition-colors"
              >
                Solar Observatory →
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl px-4 py-3">
      <p className="text-xs text-black/40">{label}</p>
      <p className="text-lg font-mono font-medium text-black">{value}</p>
    </div>
  )
}

function DistanceRow({ planet, object, distance }: { planet: string; object: string; distance: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-medium text-black w-24">{planet}</span>
      <span className="text-black/50">would be {object},</span>
      <span className="text-black font-mono">{distance}</span>
    </div>
  )
}

function CategoryCard({ title, members, description }: { title: string; members: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-5">
      <h3 className="font-medium text-black mb-1">{title}</h3>
      <p className="text-sm text-black/50 mb-2">{members}</p>
      <p className="text-sm text-black/60">{description}</p>
    </div>
  )
}
