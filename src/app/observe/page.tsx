import Link from 'next/link'
import { LayoutDashboard, Orbit, Globe, Leaf, Factory, Radio } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'

const observePages = [
  {
    href: '/observe/dashboard',
    title: 'Dashboard',
    description: 'Beautiful live widgets showing the Sun, Earth, space weather, and other real-time data.',
    icon: LayoutDashboard,
  },
  {
    href: '/observe/space',
    title: 'Space',
    description: 'Live observation of our solar system. Sun, Moon, aurora, and spacecraft monitoring.',
    icon: Orbit,
  },
  {
    href: '/observe/earth',
    title: 'Earth',
    description: 'Live monitoring of our planet. Earthquakes, volcanoes, fires, weather, and atmosphere.',
    icon: Globe,
  },
  {
    href: '/observe/life',
    title: 'Life',
    description: 'Wildlife tracking and biological monitoring. GPS-tracked animals, ocean sounds, and bird observations.',
    icon: Leaf,
  },
  {
    href: '/observe/infrastructure',
    title: 'Infrastructure',
    description: 'The invisible systems that keep civilisation running. Power grids, submarine cables, and connectivity.',
    icon: Factory,
  },
  {
    href: '/observe/detectors',
    title: 'Detectors',
    description: 'The world\'s most sensitive instruments. Particle colliders, gravitational waves, neutrinos, and cosmic rays.',
    icon: Radio,
  },
]

export default function ObservePage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Observe' },
            ]}
            theme="light"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Observe
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            Live windows into science happening right now. Real-time data feeds from NASA, NOAA,
            and observatories around the world.
          </p>
        </div>

        {/* Page cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
          {observePages.map((page) => {
            const Icon = page.icon
            return (
              <Link
                key={page.href}
                href={page.href}
                className="bg-white rounded-xl border border-[#e5e5e5] p-6 hover:border-black transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#f5f5f5] rounded-lg">
                    <Icon size={24} className="text-black/50" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-black mb-1 group-hover:underline">
                      {page.title}
                    </h2>
                    <p className="text-sm text-black/50">{page.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}