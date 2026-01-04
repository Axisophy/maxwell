'use client'

import Link from 'next/link'
import { PageShell, BreadcrumbFrame, breadcrumbItems } from '@/components/ui'
import { DataIcon } from '@/components/icons'

// ============================================================================
// KEY NUMBERS
// ============================================================================

const keyNumbers = [
  { value: '118', label: 'Elements', href: '/data/elements/periodic-table' },
  { value: '3,352', label: 'Known Nuclides', href: '/data/elements/nuclides' },
  { value: '94', label: 'Naturally Occurring', href: '/data/elements/periodic-table' },
  { value: '7', label: 'Crystal Systems', href: '/data/elements/crystals' },
  { value: '14', label: 'Bravais Lattices', href: '/data/elements/crystals' },
  { value: '~10M', label: 'Known Compounds', href: '/data/elements/molecules' },
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
    title: 'Periodic Table',
    href: '/data/elements/periodic-table',
    status: 'ready',
    description: 'Interactive periodic table with properties, electron configurations, and applications',
    stat: '118',
    statLabel: 'elements',
  },
  {
    title: 'Chart of Nuclides',
    href: '/data/elements/nuclides',
    status: 'ready',
    description: 'Every known isotope -stable, radioactive, and synthetic',
    stat: '3,352',
    statLabel: 'nuclides',
  },
  {
    title: 'Molecules',
    href: '/data/elements/molecules',
    status: 'coming-soon',
    description: 'Common molecular structures and their properties',
  },
  {
    title: 'Materials',
    href: '/data/elements/materials',
    status: 'coming-soon',
    description: 'Steel, concrete, polymers, ceramics, and composites',
  },
  {
    title: 'Crystal Systems',
    href: '/data/elements/crystals',
    status: 'coming-soon',
    description: 'The 7 crystal systems and 14 Bravais lattices',
    stat: '7',
    statLabel: 'systems',
  },
  {
    title: 'Chemical Bonds',
    href: '/data/elements/bonds',
    status: 'coming-soon',
    description: 'Ionic, covalent, metallic, and van der Waals bonds',
  },
  {
    title: 'Engineering',
    href: '/data/elements/engineering',
    status: 'coming-soon',
    description: 'Structures, systems, and technologies',
  },
]

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function ElementsPage() {
  return (
    <PageShell>
      <BreadcrumbFrame
        variant="light"
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['Data', '/data'],
          ['Elements']
        )}
      />

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <DataIcon className="text-black mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase mb-3">
              Elements
            </h1>
            <p className="text-base md:text-lg text-black/60 max-w-2xl">
              Chemistry and matter. The 118 elements, their isotopes, molecules they form,
              and the materials we make from them.
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
              Everything you can touch is made of elements -94 occur naturally,
              the rest synthesised in laboratories. Elements combine into molecules,
              molecules arrange into materials, and materials are engineered into
              the structures and technologies of civilisation.
            </div>
          </section>

          {/* Cross-references Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-sm text-black/40 uppercase tracking-wider mb-3">
              Related
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/data/fabric"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                The Fabric →
              </Link>
              <Link
                href="/data/earth/extraction"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Extraction Map →
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

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </PageShell>
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
