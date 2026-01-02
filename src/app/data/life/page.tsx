'use client'

import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { DataIcon } from '@/components/icons'

// ============================================================================
// KEY NUMBERS
// ============================================================================

const keyNumbers = [
  { value: '~8.7M', label: 'Estimated Species', href: '/data/life/bestiary' },
  { value: '~2.1M', label: 'Named Species', href: '/data/life/bestiary' },
  { value: '64', label: 'Genetic Codons', href: '/data/life/genetic-code' },
  { value: '20', label: 'Amino Acids', href: '/data/life/genetic-code' },
  { value: '~20,000', label: 'Human Genes', href: '/data/life/genome' },
  { value: '3.2B', label: 'Base Pairs (Human)', href: '/data/life/genome' },
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
    title: 'Genetic Code',
    href: '/data/life/genetic-code',
    status: 'coming-soon',
    description: 'The 64 codons and the 20 amino acids they encode',
    stat: '64',
    statLabel: 'codons',
  },
  {
    title: 'Genome Explorer',
    href: '/data/life/genome',
    status: 'coming-soon',
    description: 'Chromosomes, genes, and genetic variants',
    stat: '~20k',
    statLabel: 'human genes',
  },
  {
    title: 'Metabolic Pathways',
    href: '/data/life/metabolism',
    status: 'coming-soon',
    description: 'Glycolysis, Krebs cycle, oxidative phosphorylation, and more',
  },
  {
    title: 'Tree of Life',
    href: '/data/life/tree-of-life',
    status: 'coming-soon',
    description: 'Phylogenetic relationships across all domains of life',
  },
  {
    title: 'Bestiary',
    href: '/data/life/bestiary',
    status: 'coming-soon',
    description: 'Species database with taxonomy, distribution, and conservation status',
    stat: '~8.7M',
    statLabel: 'species',
  },
  {
    title: 'Anatomical Systems',
    href: '/data/life/anatomy',
    status: 'coming-soon',
    description: 'Human body systems — nervous, cardiovascular, skeletal, and more',
    stat: '11',
    statLabel: 'systems',
  },
  {
    title: 'Proteins',
    href: '/data/life/proteins',
    status: 'coming-soon',
    description: '3D protein structures and their functions',
  },
]

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function LifePage() {
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
                { label: 'Life' },
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
              Life
            </h1>
            <p className="text-base md:text-lg text-black/60 max-w-2xl">
              Living systems from molecules to ecosystems. Genetics, metabolism,
              species diversity, and the structures that make biology work.
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
              Life is chemistry that replicates. From the genetic code that stores
              information to the metabolic pathways that power cells, from single-celled
              organisms to complex ecosystems — life has colonised nearly every environment
              on Earth over 3.8 billion years.
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
                href="/data/earth"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Earth →
              </Link>
              <Link
                href="/observe/life"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Live Wildlife Tracking →
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
