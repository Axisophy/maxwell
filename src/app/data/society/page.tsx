'use client'

import Link from 'next/link'
import { PageShell, BreadcrumbFrame, PageHeaderFrame, breadcrumbItems } from '@/components/ui'
import { DataIcon } from '@/components/icons'

// ============================================================================
// SECTION ITEMS
// ============================================================================

interface DataItem {
  title: string
  href: string
  description: string
}

const items: DataItem[] = [
  {
    title: 'Psychology',
    href: '/data/society/psychology',
    description: 'Mind, behaviour, cognition, and the science of mental processes',
  },
  {
    title: 'Anthropology',
    href: '/data/society/anthropology',
    description: 'Human cultures, evolution, and the diversity of societies',
  },
  {
    title: 'Linguistics',
    href: '/data/society/linguistics',
    description: 'Language structures, families, and the science of communication',
  },
  {
    title: 'Economics',
    href: '/data/society/economics',
    description: 'Systems of exchange, markets, and resource allocation',
  },
]

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function SocietyPage() {
  return (
    <PageShell>
      <BreadcrumbFrame
        variant="light"
        icon={<DataIcon className="w-4 h-4" />}
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['Data', '/data'],
          ['Society']
        )}
      />

      <PageHeaderFrame
        variant="light"
        title="Society"
        description="Human systems. The scientific study of mind, culture, language, and economic behaviour."
      />

      {/* Datasets Frame */}
      <section className="bg-white rounded-lg p-2 md:p-4 mb-px">
        <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-6">
          Datasets
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="block p-2 md:p-4 bg-black rounded-lg border border-white/10 hover:border-white/30 transition-colors"
            >
              <h3 className="text-2xl md:text-3xl font-light text-white uppercase mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-white/50">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Context Frame */}
      <section className="bg-white rounded-lg p-2 md:p-4 mb-px">
        <div className="text-sm text-black/50 max-w-2xl leading-relaxed">
          The social sciences apply scientific methods to human behaviour and
          organisation. This section covers the quantitative and empirical
          aspects of psychology, anthropology, linguistics, and economics.
        </div>
      </section>

      {/* Cross-references Frame */}
      <section className="bg-white rounded-lg p-2 md:p-4">
        <div className="text-sm text-black/40 uppercase tracking-wider mb-3">
          Related
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/data/life"
            className="text-sm text-black/60 hover:text-black transition-colors"
          >
            Life →
          </Link>
          <Link
            href="/data"
            className="text-sm text-black/60 hover:text-black transition-colors"
          >
            All Data →
          </Link>
        </div>
      </section>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </PageShell>
  )
}
