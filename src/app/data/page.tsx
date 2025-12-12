import Link from 'next/link'
import { 
  Thermometer, 
  Atom, 
  Waves, 
  Scale, 
  Calculator, 
  Hash, 
  Sparkles,
  CircleDot,
  Mountain,
  Pickaxe,
  Layers
} from 'lucide-react'

// Category definitions with pages
const dataCategories = [
  {
    id: 'climate',
    title: 'Climate & Earth',
    description: 'Our planet\'s systems — climate data, geological time, and where we extract resources.',
    pages: [
      {
        href: '/data/climate',
        title: 'Climate Data Centre',
        description: 'Comprehensive climate data from NASA, NOAA, and leading research institutions.',
        icon: Thermometer,
        ready: true,
      },
      {
        href: '/data/time',
        title: 'Geological Timescale',
        description: '4.5 billion years of Earth history — eons, eras, periods, and mass extinctions.',
        icon: Mountain,
        ready: false,
      },
      {
        href: '/data/extraction',
        title: 'Extraction Map',
        description: 'Where we mine each element — from lithium to rare earths.',
        icon: Pickaxe,
        ready: false,
      },
    ]
  },
  {
    id: 'matter',
    title: 'Matter & Materials',
    description: 'From fundamental particles to the materials we build with — what everything is made of.',
    pages: [
      {
        href: '/data/elements',
        title: 'Periodic Table',
        description: '118 elements with properties, discovery stories, and cosmic origins.',
        icon: Atom,
        ready: false,
      },
      {
        href: '/data/nuclides',
        title: 'Chart of Nuclides',
        description: 'Every known isotope mapped by protons and neutrons — the valley of stability.',
        icon: CircleDot,
        ready: true,
      },
      {
        href: '/data/particles',
        title: 'Standard Model',
        description: 'Quarks, leptons, and bosons — the fundamental particles of physics.',
        icon: Sparkles,
        ready: true,
      },
      {
        href: '/data/materials',
        title: 'Materials Explorer',
        description: 'Metals, polymers, ceramics, composites — what things are made of and why.',
        icon: Layers,
        ready: false,
      },
    ]
  },
  {
    id: 'physics',
    title: 'Physics',
    description: 'The constants, spectra, and scales that define our universe.',
    pages: [
      {
        href: '/data/constants',
        title: 'Constants',
        description: 'The numbers the universe is built on — c, G, h, π, and more.',
        icon: Hash,
        ready: true,
      },
      {
        href: '/data/spectrum',
        title: 'EM Spectrum',
        description: 'Radio waves to gamma rays — the full electromagnetic spectrum.',
        icon: Waves,
        ready: true,
      },
      {
        href: '/data/scale',
        title: 'Scale of the Universe',
        description: 'Powers of 10 from quarks to cosmos — 45 orders of magnitude.',
        icon: Scale,
        ready: false,
      },
    ]
  },
  {
    id: 'tools',
    title: 'Tools',
    description: 'Calculators and converters for scientific work.',
    pages: [
      {
        href: '/data/converter',
        title: 'Unit Converter',
        description: 'Convert anything to anything — length, mass, time, energy, and more.',
        icon: Calculator,
        ready: false,
      },
    ]
  },
]

export default function DataPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />
      
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Page header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">Data</h1>
          <p className="text-base md:text-lg text-black/70 max-w-2xl">
            Reference datasets beautifully presented — elements, climate, constants, and more. 
            The raw material of science, designed with care.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {dataCategories.map((category) => (
            <section key={category.id}>
              {/* Category header */}
              <div className="mb-4">
                <h2 className="text-xl md:text-2xl font-light text-black mb-1">
                  {category.title}
                </h2>
                <p className="text-sm text-black/50">
                  {category.description}
                </p>
              </div>

              {/* Category pages */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.pages.map((page) => {
                  const Icon = page.icon
                  
                  if (!page.ready) {
                    return (
                      <div
                        key={page.href}
                        className="bg-white/50 rounded-xl border border-[#e5e5e5] p-5 opacity-60"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 bg-[#f5f5f5] rounded-lg shrink-0">
                            <Icon size={20} className="text-black/30" strokeWidth={1.5} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-base font-medium text-black/50 truncate">
                                {page.title}
                              </h3>
                              <span className="text-[10px] px-1.5 py-0.5 bg-neutral-200 text-neutral-500 rounded shrink-0">
                                Soon
                              </span>
                            </div>
                            <p className="text-sm text-black/30 line-clamp-2">{page.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  
                  return (
                    <Link
                      key={page.href}
                      href={page.href}
                      className="bg-white rounded-xl border border-[#e5e5e5] p-5 hover:border-black transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-[#f5f5f5] rounded-lg shrink-0 group-hover:bg-black/5 transition-colors">
                          <Icon size={20} className="text-black/60" strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-medium text-black mb-1 group-hover:underline truncate">
                            {page.title}
                          </h3>
                          <p className="text-sm text-black/50 line-clamp-2">{page.description}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
      
      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}