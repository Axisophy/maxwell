'use client'

import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { PulseIcon } from '@/components/icons'

export default function PulsePage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="block bg-white rounded-lg py-1 md:py-2 px-2 md:px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Pulse' },
              ]}
              theme="light"
            />
          </div>
        </div>

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <PulseIcon className="text-black mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase mb-3">
              Pulse
            </h1>
            <p className="text-base md:text-lg text-black/60 max-w-2xl">
              Science news, partner highlights, and updates from MXWLL.
              The heartbeat of the scientific world, curated with care.
            </p>
          </section>

          {/* Coming Soon Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-6">
              Coming Soon
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">

              {/* Status Card - Black frame (PortalCard style) */}
              <div className="p-2 md:p-4 bg-black rounded-lg">
                <h2 className="text-2xl md:text-3xl font-light text-white uppercase mb-2">
                  The Pulse is warming up
                </h2>
                <p className="text-sm text-white/50 mb-4">
                  We're building a curated stream of science news,
                  partner discoveries, and MXWLL updates. Your morning briefing
                  for the scientifically curious.
                </p>
                <p className="text-sm text-white/50">
                  Want to be notified?{' '}
                  <Link href="/about/contact" className="text-white underline underline-offset-4 hover:no-underline">
                    Get in touch
                  </Link>
                </p>
              </div>

              {/* What to Expect Card - Black frame (PortalCard style) */}
              <div className="p-2 md:p-4 bg-black rounded-lg">
                <h2 className="text-2xl md:text-3xl font-light text-white uppercase mb-4">
                  What to expect
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-white uppercase mb-1">Latest Discoveries</p>
                    <p className="text-sm text-white/50">Curated science news from trusted sources.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white uppercase mb-1">Partner Highlights</p>
                    <p className="text-sm text-white/50">Featured research from institutional partners.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white uppercase mb-1">MXWLL Updates</p>
                    <p className="text-sm text-white/50">New widgets, features, and content.</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* In the meantime Frame - Black frame */}
          <section className="bg-black rounded-lg p-2 md:p-4 border border-white/10">
            <div className="text-[10px] md:text-xs text-white/50 uppercase mb-2">
              In the meantime
            </div>
            <div className="text-2xl md:text-3xl font-light text-white uppercase mb-4">
              Explore what's live
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/observe"
                className="px-4 py-2 bg-white/10 rounded text-sm text-white hover:bg-white/20 transition-colors"
              >
                Observe →
              </Link>
              <Link
                href="/observe/dashboard"
                className="px-4 py-2 bg-white/10 rounded text-sm text-white hover:bg-white/20 transition-colors"
              >
                Dashboard →
              </Link>
              <Link
                href="/vault"
                className="px-4 py-2 bg-white/10 rounded text-sm text-white hover:bg-white/20 transition-colors"
              >
                Vault →
              </Link>
              <Link
                href="/data"
                className="px-4 py-2 bg-white/10 rounded text-sm text-white hover:bg-white/20 transition-colors"
              >
                Data →
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
