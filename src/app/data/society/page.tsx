'use client'

import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { DataIcon } from '@/components/icons'

// ============================================================================
// SECTION ITEMS (All coming soon)
// ============================================================================

interface DataItem {
  title: string
  description: string
}

const items: DataItem[] = [
  {
    title: 'Psychology',
    description: 'Mind, behaviour, cognition, and the science of mental processes',
  },
  {
    title: 'Anthropology',
    description: 'Human cultures, evolution, and the diversity of societies',
  },
  {
    title: 'Linguistics',
    description: 'Language structures, families, and the science of communication',
  },
  {
    title: 'Economics',
    description: 'Systems of exchange, markets, and resource allocation',
  },
]

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function SocietyPage() {
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
                { label: 'Society' },
              ]}
              theme="light"
            />
          </div>
        </div>

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <DataIcon className="text-black/30 mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black/30 uppercase">
                Society
              </h1>
              <span className="px-3 py-1 bg-black/10 text-black/40 text-sm uppercase rounded-lg">
                Coming Soon
              </span>
            </div>
            <p className="text-base md:text-lg text-black/40 max-w-2xl">
              Human systems. The scientific study of mind, culture, language, and
              economic behaviour.
            </p>
          </section>

          {/* Planned Datasets Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4 opacity-60">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black/50 uppercase mb-6">
              Planned Datasets
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {items.map((item) => (
                <div key={item.title} className="p-2 md:p-4 bg-black/30 rounded-lg">
                  <h3 className="text-2xl md:text-3xl font-light text-white/30 uppercase mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/20">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Context Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-sm text-black/40 max-w-2xl leading-relaxed">
              The social sciences apply scientific methods to human behaviour and
              organisation. This section will cover the quantitative and empirical
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

        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
