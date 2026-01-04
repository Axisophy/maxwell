import { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbFrame, breadcrumbItems, PageHeaderFrame } from '@/components/ui'
import { DataIcon } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Civilisation | Earth | Data | MXWLL',
  description: 'Human world: population, languages, countries, cities.',
}

export default function CivilisationPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        <BreadcrumbFrame
          variant="light"
          icon={<DataIcon className="w-4 h-4" />}
          items={breadcrumbItems(
            ['MXWLL', '/'],
            ['Data', '/data'],
            ['Earth', '/data/earth'],
            ['Civilisation']
          )}
        />

        <PageHeaderFrame
          variant="light"
          title="Civilisation"
          description="Human world: population, languages, countries, cities."
        />

        <div className="p-12 bg-white rounded-xl text-center mb-8">
          <p className="text-black/50">Coming soon</p>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-black/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/data/earth"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              ← Back to Earth
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
