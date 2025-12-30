import { Metadata } from 'next'
import Link from 'next/link'
import { Users, MapPin, Mountain, Leaf, Cloud } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Earth | Data | MXWLL',
  description: 'Comprehensive reference for our planet. Civilisation, geography, geology, life, and climate.',
}

const earthSections = [
  {
    href: '/data/earth/civilisation',
    title: 'Civilisation',
    description: 'Human world: population, languages, countries, cities.',
    icon: Users,
    stats: [
      { label: 'Countries', value: '195' },
      { label: 'Languages', value: '7,000+' },
    ],
  },
  {
    href: '/data/earth/geography',
    title: 'Geography',
    description: 'Physical features: continents, oceans, mountains, rivers.',
    icon: MapPin,
    stats: [
      { label: 'Continents', value: '7' },
      { label: 'Oceans', value: '5' },
    ],
  },
  {
    href: '/data/earth/geology',
    title: 'Geology',
    description: 'Deep Earth: plate tectonics, minerals, rock cycle, deep time.',
    icon: Mountain,
    stats: [
      { label: 'Tectonic Plates', value: '15 major' },
      { label: 'Mineral Species', value: '5,800+' },
    ],
  },
  {
    href: '/data/earth/life',
    title: 'Life',
    description: 'Biodiversity: species, ecosystems, evolution, extinction.',
    icon: Leaf,
    stats: [
      { label: 'Known Species', value: '~2.1M' },
      { label: 'Estimated Total', value: '~8.7M' },
    ],
  },
  {
    href: '/data/earth/climate',
    title: 'Climate',
    description: 'Climate system: zones, patterns, change, paleoclimate.',
    icon: Cloud,
    stats: [
      { label: 'Avg Temperature', value: '15°C' },
      { label: 'CO₂ Level', value: '~420 ppm' },
    ],
  },
]

export default function EarthDataPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Data', href: '/data' },
              { label: 'Earth' },
            ]}
            theme="light"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Earth
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            Comprehensive reference for our planet. Civilisation, geography, geology,
            life, and climate.
          </p>
        </div>

        {/* Hero Stats */}
        <div className="bg-white rounded-xl p-6 md:p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
              <span className="text-4xl md:text-5xl">🌍</span>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-black mb-2">
                The Third Planet
              </h2>
              <p className="text-sm text-black/50">
                The only known world with liquid water and life.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[#f5f5f5] rounded-lg">
              <p className="text-2xl font-light text-black">12,742</p>
              <p className="text-xs text-black/50">km diameter</p>
            </div>
            <div className="text-center p-4 bg-[#f5f5f5] rounded-lg">
              <p className="text-2xl font-light text-black">5.97×10²⁴</p>
              <p className="text-xs text-black/50">kg mass</p>
            </div>
            <div className="text-center p-4 bg-[#f5f5f5] rounded-lg">
              <p className="text-2xl font-light text-black">4.54</p>
              <p className="text-xs text-black/50">billion years old</p>
            </div>
            <div className="text-center p-4 bg-[#f5f5f5] rounded-lg">
              <p className="text-2xl font-light text-black">8.1B</p>
              <p className="text-xs text-black/50">human population</p>
            </div>
          </div>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {earthSections.map((section) => {
            const Icon = section.icon
            return (
              <Link
                key={section.href}
                href={section.href}
                className="bg-white rounded-xl p-6 hover:border-black border border-transparent transition-colors group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-[#f5f5f5] rounded-lg">
                    <Icon size={22} className="text-black/50" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-black mb-2 group-hover:underline">
                  {section.title}
                </h3>
                <p className="text-sm text-black/50 mb-4">
                  {section.description}
                </p>
                <div className="flex gap-4">
                  {section.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-lg font-mono text-black">{stat.value}</p>
                      <p className="text-xs text-black/40">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Facts */}
        <div className="bg-white rounded-xl p-6 mb-8">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
            Quick Facts
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-black/40 mb-1">Surface Area</p>
              <p className="text-black">510.1 million km²</p>
            </div>
            <div>
              <p className="text-black/40 mb-1">Water Coverage</p>
              <p className="text-black">71%</p>
            </div>
            <div>
              <p className="text-black/40 mb-1">Highest Point</p>
              <p className="text-black">Mt. Everest (8,849 m)</p>
            </div>
            <div>
              <p className="text-black/40 mb-1">Deepest Point</p>
              <p className="text-black">Challenger Deep (10,935 m)</p>
            </div>
            <div>
              <p className="text-black/40 mb-1">Axial Tilt</p>
              <p className="text-black">23.44°</p>
            </div>
            <div>
              <p className="text-black/40 mb-1">Day Length</p>
              <p className="text-black">23h 56m 4s</p>
            </div>
            <div>
              <p className="text-black/40 mb-1">Year Length</p>
              <p className="text-black">365.25 days</p>
            </div>
            <div>
              <p className="text-black/40 mb-1">Moons</p>
              <p className="text-black">1 (The Moon)</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-black/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/data"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              ← Back to Data
            </Link>
            <Link
              href="/data/solar-system/earth"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              Earth in Solar System →
            </Link>
            <Link
              href="/observe/earth"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              Live Earth Observation →
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
