import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import StatusBar from '@/components/observe/solar-observatory/StatusBar'
import SDOViewer from '@/components/observe/solar-observatory/SDOViewer'
import SOHOViewer from '@/components/observe/solar-observatory/SOHOViewer'
import SpaceWeatherGrid from '@/components/observe/solar-observatory/SpaceWeatherGrid'

export const metadata: Metadata = {
  title: 'Solar Observatory | MXWLL',
  description: 'Live solar observation from NASA SDO and SOHO. Real-time space weather data, X-ray flux, solar wind, and dramatic imagery of our star.',
}

export default function SolarObservatoryPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Observe', href: '/observe' },
              { label: 'Solar Observatory' },
            ]}
            theme="dark"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-3">
            Solar Observatory
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl">
            Live observation of our star
          </p>
        </div>

        {/* Status Bar */}
        <StatusBar className="mb-8" />

        {/* Primary Viewer - SDO */}
        <section className="mb-8">
          <SDOViewer size="large" />
        </section>

        {/* Secondary Viewers - SOHO Coronagraphs */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Coronagraphs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SOHOViewer instrument="c2" />
            <SOHOViewer instrument="c3" />
          </div>
        </section>

        {/* Space Weather Data */}
        <section className="mb-8">
          <SpaceWeatherGrid />
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/data/solar-system/sun"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Learn more about the Sun →
            </Link>
            <Link
              href="/observe"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Back to Observe
            </Link>
          </div>

          {/* Data Sources */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/30 mb-2">Data Sources</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/40">
              <span>Solar imagery: NASA SDO</span>
              <span>Coronagraphs: SOHO LASCO</span>
              <span>Space weather: NOAA SWPC</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
