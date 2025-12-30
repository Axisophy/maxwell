import Link from 'next/link'
import { Activity, LayoutDashboard, Moon, Sun, PawPrint, Orbit } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'

const observePages = [
  {
    href: '/observe/vital-signs',
    title: 'Vital Signs',
    description: 'Live data from Earth and space at a glance. Earthquakes, CO₂, solar activity, and more.',
    icon: Activity,
  },
  {
    href: '/observe/space',
    title: 'Space',
    description: 'Live observation of our solar system. Sun, Moon, aurora, and spacecraft monitoring.',
    icon: Orbit,
  },
  {
    href: '/observe/solar-observatory',
    title: 'Solar Observatory',
    description: 'Live solar observation from NASA SDO and SOHO. X-ray flux, solar wind, and space weather.',
    icon: Sun,
  },
  {
    href: '/observe/wildlife',
    title: 'Wildlife Tracking',
    description: 'Where are they now? Live GPS tracking of sharks, whales, turtles, and birds worldwide.',
    icon: PawPrint,
  },
  {
    href: '/observe/dashboard',
    title: 'Dashboard',
    description: 'Beautiful live widgets showing the Sun, Earth, space weather, and other real-time data.',
    icon: LayoutDashboard,
  },
  {
    href: '/observe/moon',
    title: 'Lunar Atlas',
    description: 'Explore the Moon\'s surface. Maria, craters, and Apollo landing sites.',
    icon: Moon,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
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