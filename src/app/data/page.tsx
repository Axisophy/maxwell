import Link from 'next/link'
import { Thermometer, Atom, Waves, Scale, Calculator, Hash, Sparkles } from 'lucide-react'

const dataPages = [
  {
    href: '/data/climate',
    title: 'Earth Climate Data Centre',
    description: 'Comprehensive climate data from NASA, NOAA, and leading research institutions. Explore historical trends and compare datasets.',
    icon: Thermometer,
    ready: true,
  },
  {
    href: '/data/elements',
    title: 'Periodic Table',
    description: 'Every element with properties, discovery stories, cosmic origins, and applications.',
    icon: Atom,
    ready: false,
  },
  {
    href: '/data/particles',
    title: 'Standard Model',
    description: 'The fundamental particles of physics — quarks, leptons, and bosons. The building blocks of everything.',
    icon: Sparkles,
    ready: true,
  },
  {
    href: '/data/spectrum',
    title: 'Electromagnetic Spectrum',
    description: 'From radio waves to gamma rays — explore the full spectrum of light.',
    icon: Waves,
    ready: true,
  },
  {
    href: '/data/constants',
    title: 'Constants',
    description: 'The numbers the universe is built on — speed of light, Planck constant, pi, and more.',
    icon: Hash,
    ready: true,
  },
  {
    href: '/data/scale',
    title: 'Scale of the Universe',
    description: 'Powers of 10 from quarks to cosmos. Zoom through 45 orders of magnitude.',
    icon: Scale,
    ready: false,
  },
  {
    href: '/data/converter',
    title: 'Unit Converter',
    description: 'Convert anything to anything — length, mass, time, energy, and more.',
    icon: Calculator,
    ready: false,
  },
]

export default function DataPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />
      
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">Data</h1>
          <p className="text-base md:text-lg text-black max-w-2xl">
            Reference datasets beautifully presented — elements, climate, constants, and more. 
            The raw material of science, designed with care.
          </p>
        </div>

        {/* Page cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {dataPages.map((page) => {
            const Icon = page.icon
            
            if (!page.ready) {
              return (
                <div
                  key={page.href}
                  className="bg-white/50 rounded-xl border border-[#e5e5e5] p-6 opacity-60"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#f5f5f5] rounded-lg">
                      <Icon size={24} className="text-black/30" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-medium text-black/50">
                          {page.title}
                        </h2>
                        <span className="text-xs px-1.5 py-0.5 bg-neutral-200 text-neutral-500 rounded">
                          Soon
                        </span>
                      </div>
                      <p className="text-sm text-black/30">{page.description}</p>
                    </div>
                  </div>
                </div>
              )
            }
            
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