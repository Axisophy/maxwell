'use client'

import Link from 'next/link'
import { PageShell, BreadcrumbFrame, PageHeaderFrame, breadcrumbItems } from '@/components/ui'
import { DataIcon } from '@/components/icons'

// ============================================================================
// KEY NUMBERS
// ============================================================================

const keyNumbers = [
  { value: 'π', numericValue: '3.14159...', label: 'Pi', href: '/data/mathematics/sequences' },
  { value: 'e', numericValue: '2.71828...', label: "Euler's Number", href: '/data/mathematics/sequences' },
  { value: 'φ', numericValue: '1.61803...', label: 'Golden Ratio', href: '/data/mathematics/sequences' },
  { value: '∞', numericValue: 'ℵ₀, ℵ₁...', label: 'Infinities', href: '/data/mathematics/sequences' },
  { value: '5', label: 'Platonic Solids', href: '/data/mathematics/geometry' },
  { value: '17', label: 'Wallpaper Groups', href: '/data/mathematics/geometry' },
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
    title: 'Number Sequences',
    href: '/data/mathematics/sequences',
    status: 'coming-soon',
    description: 'Primes, Fibonacci, triangular numbers, and the patterns that emerge',
  },
  {
    title: 'Geometry',
    href: '/data/mathematics/geometry',
    status: 'coming-soon',
    description: 'Platonic solids, tessellations, wallpaper groups, and spatial structures',
    stat: '5',
    statLabel: 'platonic solids',
  },
  {
    title: 'Famous Equations',
    href: '/data/mathematics/equations',
    status: 'coming-soon',
    description: "The equations that changed everything -from Euler's identity to Einstein's field equations",
  },
  {
    title: 'Topology',
    href: '/data/mathematics/topology',
    status: 'coming-soon',
    description: 'Surfaces, manifolds, knots, and the properties that survive continuous deformation',
  },
]

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function MathematicsPage() {
  return (
    <PageShell>
      <BreadcrumbFrame
        variant="light"
        icon={<DataIcon className="w-4 h-4" />}
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['Data', '/data'],
          ['Mathematics']
        )}
      />

      <PageHeaderFrame
        variant="light"
        title="Mathematics"
        description="Pure mathematics. Numbers, sequences, geometry, topology, and the abstract structures that underpin all of science."
      />

      {/* Key Numbers Frame */}
      <section className="bg-white rounded-lg p-2 md:p-4 mb-px">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-6">
              Mathematical Constants
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
                    {num.numericValue && (
                      <span className="text-lg md:text-2xl font-mono font-bold text-white">
                        {num.numericValue}
                      </span>
                    )}
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
              Mathematics is the language of science. The same equations describe planetary
              orbits and electron shells. The same topology appears in DNA and cosmic strings.
              Prime numbers secure your bank transactions. Group theory classifies crystals.
              This section explores the pure structures themselves.
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
                href="/play"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Play (Fractals, Attractors) →
              </Link>
              <Link
                href="/vault"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Vault (Euclid, Newton) →
              </Link>
        </div>
      </section>

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
