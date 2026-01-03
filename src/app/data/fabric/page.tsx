'use client'

import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { DataIcon } from '@/components/icons'

// ============================================================================
// KEY NUMBERS - Fundamental constants as hero display
// ============================================================================

const keyNumbers = [
  { value: 'c', numericValue: '299,792,458', label: 'Speed of Light (m/s)', href: '/data/fabric/constants' },
  { value: 'G', numericValue: '6.674×10⁻¹¹', label: 'Gravitational Constant', href: '/data/fabric/constants' },
  { value: 'h', numericValue: '6.626×10⁻³⁴', label: 'Planck Constant (J·s)', href: '/data/fabric/constants' },
  { value: 'α', numericValue: '1/137', label: 'Fine Structure Constant', href: '/data/fabric/constants' },
  { value: '4', numericValue: '4', label: 'Fundamental Forces', href: '/data/fabric/forces' },
  { value: '17', numericValue: '17', label: 'Standard Model Particles', href: '/data/fabric/particles' },
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
    title: 'Standard Model',
    href: '/data/fabric/particles',
    status: 'ready',
    description: 'The 17 fundamental particles of matter and their interactions',
    stat: '17',
    statLabel: 'particles',
  },
  {
    title: 'Fundamental Forces',
    href: '/data/fabric/forces',
    status: 'ready',
    description: 'Gravity, electromagnetism, and the strong and weak nuclear forces',
    stat: '4',
    statLabel: 'forces',
  },
  {
    title: 'Fundamental Constants',
    href: '/data/fabric/constants',
    status: 'ready',
    description: 'The numbers the universe is built on -c, G, h, and more',
    stat: '22',
    statLabel: 'constants',
  },
  {
    title: 'EM Spectrum',
    href: '/data/fabric/spectrum',
    status: 'ready',
    description: 'From radio waves to gamma rays -the full electromagnetic spectrum',
    stat: '10²⁵',
    statLabel: 'Hz range',
  },
  {
    title: 'Scale of the Universe',
    href: '/data/fabric/scale',
    status: 'ready',
    description: 'Powers of 10 from the Planck length to the observable universe',
    stat: '10⁶²',
    statLabel: 'orders of magnitude',
  },
  {
    title: 'Permissible Universe',
    href: '/data/fabric/permissible-universe',
    status: 'ready',
    description: 'Mass-radius diagram showing what can exist at every scale',
  },
  {
    title: 'Big Bang & Cosmology',
    href: '/data/fabric/cosmology',
    status: 'ready',
    description: 'The origin, structure, and fate of the universe',
    stat: '13.8',
    statLabel: 'billion years',
  },
]

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function FabricPage() {
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
                { label: 'The Fabric' },
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
              The Fabric
            </h1>
            <p className="text-base md:text-lg text-black/60 max-w-2xl">
              What reality is woven from. The fundamental particles, forces, and constants
              that determine how the universe works at every scale.
            </p>
          </section>

          {/* Key Numbers Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-6">
              Fundamental Constants
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
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl md:text-5xl lg:text-6xl font-math italic text-white/40">
                      {num.value}
                    </span>
                    <span className="text-lg md:text-2xl font-mono font-bold text-white">
                      {num.numericValue}
                    </span>
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
              The fabric of reality is described by quantum field theory and general relativity.
              At its most fundamental level, the universe consists of fields -the electron field,
              the electromagnetic field, the Higgs field -and particles are excitations of these fields.
              The constants on this page determine the strength of interactions, the size of atoms,
              and the speed limit of the cosmos.
            </div>
          </section>

          {/* Cross-references Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-sm text-black/40 uppercase tracking-wider mb-3">
              Related
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/data/elements"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Elements →
              </Link>
              <Link
                href="/data/cosmos"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                The Cosmos →
              </Link>
              <Link
                href="/data/mathematics"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Mathematics →
              </Link>
              <Link
                href="/observe/detectors"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Particle Detectors →
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

  // Coming soon
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
