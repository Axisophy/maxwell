'use client'

import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { DataIcon } from '@/components/icons'

// ============================================================================
// KEY NUMBERS
// ============================================================================

const keyNumbers = [
  { value: '4.54', label: 'Age (Billion Years)', href: '/data/earth/timescale' },
  { value: '12,742', label: 'Diameter (km)', href: '/data/cosmos/solar-system' },
  { value: '15', label: 'Tectonic Plates', href: '/data/earth/tectonics' },
  { value: '5', label: 'Mass Extinctions', href: '/data/earth/timescale' },
  { value: '71%', label: 'Ocean Coverage', href: '/data/earth/oceans' },
  { value: '421', label: 'CO₂ ppm (2024)', href: '/data/earth/climate' },
]

// ============================================================================
// SECTION ITEMS
// ============================================================================

interface DataItem {
  title: string
  href: string
  status: 'ready' | 'coming-soon'
  description: string
  stat?: string
  statLabel?: string
}

const items: DataItem[] = [
  {
    title: 'Climate Data Centre',
    href: '/data/earth/climate',
    status: 'ready',
    description: 'Temperature records, ice cores, sea level, and atmospheric composition',
    stat: '38',
    statLabel: 'datasets',
  },
  {
    title: 'Geological Timescale',
    href: '/data/earth/timescale',
    status: 'coming-soon',
    description: '4.5 billion years of Earth history -eons, eras, periods, and epochs',
    stat: '4.54B',
    statLabel: 'years',
  },
  {
    title: 'Extraction Map',
    href: '/data/earth/extraction',
    status: 'ready',
    description: 'Where we mine the elements -global resource extraction',
  },
  {
    title: 'Tectonic Plates',
    href: '/data/earth/tectonics',
    status: 'coming-soon',
    description: 'Plate boundaries, motion vectors, and geological consequences',
    stat: '15',
    statLabel: 'major plates',
  },
  {
    title: 'Atmosphere',
    href: '/data/earth/atmosphere',
    status: 'coming-soon',
    description: 'Troposphere to exosphere -layers, composition, and dynamics',
  },
  {
    title: 'Oceans',
    href: '/data/earth/oceans',
    status: 'coming-soon',
    description: 'Ocean zones, currents, chemistry, and deep-sea features',
    stat: '71%',
    statLabel: 'of surface',
  },
]

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function EarthDataPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="bg-white rounded-lg py-1 md:py-2 px-2 md:px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Data', href: '/data' },
                { label: 'Earth' },
              ]}
              theme="light"
            />
          </div>
        </div>

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <DataIcon className="text-black mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase mb-3">
              Earth
            </h1>
            <p className="text-base md:text-lg text-black/60 max-w-2xl">
              Our planet. Geology, climate, tectonics, and the systems that have shaped
              Earth over 4.5 billion years.
            </p>
          </section>

          {/* Key Numbers Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-6">
              By The Numbers
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px">
              {keyNumbers.map((num) => (
                <Link
                  key={num.label}
                  href={num.href}
                  className="block p-2 md:p-4 text-left bg-black rounded-lg hover:bg-neutral-900 transition-colors"
                >
                  <div className="text-[10px] md:text-xs text-white/50 uppercase mb-1 md:mb-2">
                    {num.label}
                  </div>
                  <div className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] tabular-nums text-white">
                    {num.value}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Datasets Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-6">
              Datasets
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {items.map((item) => (
                <DataCard key={item.href} item={item} />
              ))}
            </div>
          </section>

          {/* Context Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-sm text-black/50 max-w-2xl leading-relaxed">
              Earth is geologically active -plates move, mountains rise, volcanoes erupt.
              The climate system circulates heat from tropics to poles. Ice ages come and go.
              Five mass extinctions have reset the trajectory of life. This section documents
              what we know about the planet we live on.
            </div>
          </section>

          {/* Cross-references Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-sm text-black/40 uppercase tracking-wider mb-3">
              Related
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/observe/earth"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Live Earth Monitoring →
              </Link>
              <Link
                href="/data/cosmos/solar-system"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Earth in the Solar System →
              </Link>
              <Link
                href="/data/life"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Life →
              </Link>
            </div>
          </section>

        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}

// ============================================================================
// Data Card Component
// ============================================================================

function DataCard({ item }: { item: DataItem }) {
  const isReady = item.status === 'ready'

  if (isReady) {
    return (
      <Link
        href={item.href}
        className="block p-2 md:p-4 bg-black rounded-lg border border-white/10 hover:border-white/30 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-light text-white uppercase mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-white/50">{item.description}</p>
          </div>
          {item.stat && (
            <div className="text-right flex-shrink-0">
              <div className="text-2xl md:text-3xl font-mono font-bold text-white">
                {item.stat}
              </div>
              {item.statLabel && (
                <div className="text-[10px] text-white/40 uppercase">
                  {item.statLabel}
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    )
  }

  return (
    <div className="p-2 md:p-4 bg-black/50 rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl md:text-3xl font-light text-white/40 uppercase">
              {item.title}
            </h3>
            <span className="text-xs text-white/30 uppercase">Soon</span>
          </div>
          <p className="text-sm text-white/30">{item.description}</p>
        </div>
        {item.stat && (
          <div className="text-right flex-shrink-0">
            <div className="text-2xl md:text-3xl font-mono font-bold text-white/30">
              {item.stat}
            </div>
            {item.statLabel && (
              <div className="text-[10px] text-white/20 uppercase">
                {item.statLabel}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
