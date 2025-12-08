import Link from 'next/link'
import { Activity, LayoutDashboard } from 'lucide-react'

const observePages = [
  {
    href: '/observe/the-pulse',
    title: 'The Pulse',
    description: 'Live data from Earth and space at a glance. Earthquakes, CO₂, solar activity, and more.',
    icon: Activity,
  },
  {
    href: '/observe/your-dashboard',
    title: 'Your Dashboard',
    description: 'Beautiful live widgets showing the Sun, Earth, space weather, and other real-time data.',
    icon: LayoutDashboard,
  },
]

export default function ObservePage() {
  return (
    <main className="min-h-screen bg-shell-light">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />
      
      <div className="px-4 md:px-8 lg:px-12 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-text-primary mb-2">Observe</h1>
          <p className="text-text-muted max-w-2xl">
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
                className="bg-white rounded-xl border border-[#e5e5e5] p-6 hover:border-text-primary transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#f5f5f5] rounded-lg">
                    <Icon size={24} className="text-text-muted" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-lg font-normal text-text-primary mb-1 group-hover:underline">
                      {page.title}
                    </h2>
                    <p className="text-sm text-text-muted">{page.description}</p>
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