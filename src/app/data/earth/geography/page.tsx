import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Geography | Earth | Data | MXWLL',
  description: 'Physical features: continents, oceans, mountains, rivers.',
}

export default function GeographyPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        <div className="mb-8 md:mb-12">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Data', href: '/data' },
              { label: 'Earth', href: '/data/earth' },
              { label: 'Geography' },
            ]}
            theme="light"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Geography
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            Physical features: continents, oceans, mountains, rivers.
          </p>
        </div>

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
