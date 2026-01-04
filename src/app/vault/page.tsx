'use client'

import Link from 'next/link'
import { BreadcrumbFrame, breadcrumbItems } from '@/components/ui'
import { VaultIcon } from '@/components/icons'
import { getBooksByEra } from '@/lib/books'
import { readingPaths } from '@/lib/reading-paths'

const eras = [
  {
    id: 'ancient',
    href: '/vault/ancient',
    name: 'Ancient',
    period: 'Before 1500',
    description: 'The foundations of scientific thought from Euclid, Aristotle, and the classical world.',
  },
  {
    id: 'renaissance',
    href: '/vault/renaissance',
    name: 'Renaissance',
    period: '1500–1800',
    description: 'The Scientific Revolution: Copernicus, Galileo, Newton, and the birth of modern science.',
  },
  {
    id: 'modern',
    href: '/vault/modern',
    name: 'Modern',
    period: '1800–1950',
    description: 'Darwin, Maxwell, Einstein, and the explosive growth of scientific knowledge.',
  },
  {
    id: 'scientific-fiction',
    href: '/vault/scientific-fiction',
    name: 'Scientific Fiction',
    period: '1818–1920',
    description: 'Shelley, Verne, Wells, Čapek - the birth of science fiction as a literary form.',
  },
]

// VitalSign component
function VaultVitalSign({
  value,
  label,
  href,
}: {
  value: string | number
  label: string
  href?: string
}) {
  const content = (
    <div className={`p-2 md:p-4 text-left bg-black rounded-lg ${href ? 'hover:bg-neutral-900 transition-colors' : ''}`}>
      <div className="text-[10px] md:text-xs text-white/50 uppercase mb-1 md:mb-2">
        {label}
      </div>
      <div className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] tabular-nums text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  )

  if (href) {
    return <Link href={href} className="block">{content}</Link>
  }
  return content
}

// Card component
function VaultCard({
  title,
  description,
  href,
  period,
  count,
}: {
  title: string
  description: string
  href: string
  period?: string
  count?: number
}) {
  return (
    <Link
      href={href}
      className="block p-2 md:p-4 bg-black rounded-lg border border-white/10 hover:border-white/30 transition-colors"
    >
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="text-2xl md:text-3xl font-light text-white uppercase">
          {title}
        </h2>
        {period && (
          <span className="text-xs text-white/40">{period}</span>
        )}
      </div>
      <p className="text-sm text-white/50 mb-2">
        {description}
      </p>
      {count !== undefined && (
        <span className="text-xs text-white/40">{count} works →</span>
      )}
    </Link>
  )
}

// Coming Soon Card
function ComingSoonCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="block p-2 md:p-4 bg-black rounded-lg border border-white/10 opacity-50">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-xl md:text-2xl font-light text-white uppercase">
          {title}
        </h2>
        <span className="text-[10px] text-white/40 uppercase tracking-wider">
          Coming Soon
        </span>
      </div>
      <p className="text-sm text-white/50">
        {description}
      </p>
    </div>
  )
}

export default function VaultPage() {
  const featuredPaths = readingPaths.slice(0, 3)

  // Calculate totals
  const totalWorks = eras.reduce((sum, era) => {
    const books = getBooksByEra(era.id as 'ancient' | 'renaissance' | 'modern' | 'scientific-fiction')
    return sum + books.length
  }, 0)

  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb Frame */}
        <BreadcrumbFrame
          variant="light"
          items={breadcrumbItems(
            ['MXWLL', '/'],
            ['Vault']
          )}
        />

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <VaultIcon className="text-black mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase mb-3">
              Vault
            </h1>
            <p className="text-base md:text-lg text-black/60 max-w-2xl">
              A curated collection of scientific texts spanning 2,500 years of human inquiry.
              Public domain works presented as beautiful, readable digital editions.
            </p>
          </section>

          {/* Collection Stats Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              The Collection
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <VaultVitalSign
                value={totalWorks}
                label="Works"
              />
              <VaultVitalSign
                value={eras.length}
                label="Eras"
              />
              <VaultVitalSign
                value={readingPaths.length}
                label="Reading Paths"
                href="/vault/paths"
              />
              <VaultVitalSign
                value="2,500"
                label="Years of Inquiry"
              />
            </div>
          </section>

          {/* Browse by Era Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              Browse by Era
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {eras.map((era) => {
                const books = getBooksByEra(era.id as 'ancient' | 'renaissance' | 'modern' | 'scientific-fiction')
                return (
                  <VaultCard
                    key={era.id}
                    title={era.name}
                    description={era.description}
                    href={era.href}
                    period={era.period}
                    count={books.length}
                  />
                )
              })}
            </div>
          </section>

          {/* Reading Paths Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="flex items-baseline justify-between mb-4">
              <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase">
                Reading Paths
              </div>
              <Link
                href="/vault/paths"
                className="text-sm text-black/50 hover:text-black transition-colors"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
              {featuredPaths.map((path) => (
                <Link
                  key={path.slug}
                  href={`/vault/paths/${path.slug}`}
                  className="block p-2 md:p-4 bg-black rounded-lg border border-white/10 hover:border-white/30 transition-colors"
                >
                  <p className="text-base md:text-lg font-light text-white mb-2">
                    "{path.question}"
                  </p>
                  <p className="text-sm text-white/50 line-clamp-2">{path.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Coming Soon Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              Coming Soon
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              <ComingSoonCard
                title="Canon"
                description="Commentary on significant modern books still under copyright. Our take on Kuhn, Dawkins, Sagan, and more."
              />
              <ComingSoonCard
                title="Papers"
                description="Landmark journal articles where breakthroughs first appeared. Watson & Crick's DNA paper is one page."
              />
              <ComingSoonCard
                title="Maps & Timelines"
                description="Visual discovery - trace who influenced whom, see where ideas emerged geographically."
              />
              <ComingSoonCard
                title="Your Library"
                description="Track what you've read, save favourites, pick up where you left off."
              />
            </div>
          </section>

          {/* Cross-references Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-sm text-black/40 uppercase tracking-wider mb-3">
              Related
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/data"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Data Reference →
              </Link>
              <Link
                href="/play"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Play & Explore →
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
