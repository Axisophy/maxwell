'use client'

import Link from 'next/link'
import { PageShell, BreadcrumbFrame, PageHeaderFrame, breadcrumbItems } from '@/components/ui'
import { DataIcon } from '@/components/icons'

// ============================================================================
// KEY NUMBERS
// ============================================================================

const keyNumbers = [
  { value: '8', label: 'Planets', href: '/data/cosmos/solar-system' },
  { value: '~200', label: 'Known Moons', href: '/data/cosmos/solar-system' },
  { value: '88', label: 'Constellations', href: '/data/cosmos/constellations' },
  { value: '110', label: 'Messier Objects', href: '/data/cosmos/messier' },
  { value: '~5,000', label: 'Confirmed Exoplanets', href: '/data/cosmos/exoplanets' },
  { value: '13.8B', label: 'Age of Universe (years)', href: '/data/fabric/cosmology' },
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
    title: 'Solar System',
    href: '/data/cosmos/solar-system',
    status: 'ready',
    description: 'The Sun, planets, moons, asteroids, and comets of our solar system',
    stat: '8',
    statLabel: 'planets',
  },
  {
    title: 'Stellar Classification',
    href: '/data/cosmos/stars',
    status: 'coming-soon',
    description: 'OBAFGKM spectral types, the HR diagram, and stellar evolution',
  },
  {
    title: 'Constellations',
    href: '/data/cosmos/constellations',
    status: 'coming-soon',
    description: 'All 88 official constellations with star patterns and mythology',
    stat: '88',
    statLabel: 'constellations',
  },
  {
    title: 'Messier Objects',
    href: '/data/cosmos/messier',
    status: 'coming-soon',
    description: '110 deep-sky objects -nebulae, galaxies, and star clusters',
    stat: '110',
    statLabel: 'objects',
  },
  {
    title: 'Galaxies',
    href: '/data/cosmos/galaxies',
    status: 'coming-soon',
    description: 'Galaxy types, the Local Group, and the cosmic web',
  },
  {
    title: 'Exoplanets',
    href: '/data/cosmos/exoplanets',
    status: 'coming-soon',
    description: 'Worlds around other stars -hot Jupiters, super-Earths, and habitable zones',
    stat: '~5,000',
    statLabel: 'confirmed',
  },
]

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function CosmosPage() {
  return (
    <PageShell>
      <BreadcrumbFrame
        variant="light"
        icon={<DataIcon className="w-4 h-4" />}
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['Data', '/data'],
          ['The Cosmos']
        )}
      />

      <PageHeaderFrame
        variant="light"
        title="The Cosmos"
        description="Everything beyond Earth. The Solar System, stars, galaxies, and the structure of the universe at the largest scales."
      />

      {/* Key Numbers Frame */}
      <section className="bg-white rounded-lg p-2 md:p-4 mb-px">
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
              The observable universe contains roughly 200 billion galaxies, each with
              hundreds of billions of stars. Our Solar System orbits in the Orion Arm
              of the Milky Way, one of trillions of planetary systems in our galaxy alone.
              This section catalogues what we&apos;ve discovered about the cosmos.
            </div>
          </section>

          {/* Cross-references Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-sm text-black/40 uppercase tracking-wider mb-3">
              Related
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/observe/space"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Live Space Monitoring →
              </Link>
              <Link
                href="/data/fabric"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                The Fabric →
              </Link>
              <Link
                href="/data/earth"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Earth →
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
