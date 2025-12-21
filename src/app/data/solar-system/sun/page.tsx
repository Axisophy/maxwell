import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SunHeroSlideshow from '@/components/data/sun/SunHeroSlideshow'
import KeyStatsGrid from '@/components/data/sun/KeyStatsGrid'
import StructureDiagram from '@/components/data/sun/StructureDiagram'
import NuclearFusion from '@/components/data/sun/NuclearFusion'
import SolarCycleChart from '@/components/data/sun/SolarCycleChart'
import LifeCycleTimeline from '@/components/data/sun/LifeCycleTimeline'
import SpaceWeatherHistory from '@/components/data/sun/SpaceWeatherHistory'

export const metadata: Metadata = {
  title: 'The Sun | MXWLL',
  description: 'Our star - a G-type main-sequence yellow dwarf. Age, mass, structure, fusion, and the solar cycle explained.',
}

export default function SunDataPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Data', href: '/data' },
              { label: 'Solar System' },
              { label: 'Sun' },
            ]}
            theme="light"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            The Sun
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            Our star - a G-type main-sequence yellow dwarf. The source of nearly all energy
            on Earth and the gravitational anchor of the solar system.
          </p>
          <Link
            href="/observe/solar-observatory"
            className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-[#e6007e] transition-colors mt-3"
          >
            See it live →
          </Link>
        </div>

        {/* Hero Image Slideshow */}
        <section className="mb-8 md:mb-12">
          <div className="rounded-xl overflow-hidden">
            <SunHeroSlideshow />
          </div>
        </section>

        {/* Key Stats */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Key Statistics
          </h2>
          <KeyStatsGrid />
        </section>

        {/* Structure */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Structure
          </h2>
          <p className="text-black/60 mb-6 max-w-2xl">
            The Sun has distinct layers, from the nuclear furnace of the core to the
            million-degree corona. Click any layer to explore.
          </p>
          <StructureDiagram />
        </section>

        {/* Nuclear Fusion */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Nuclear Fusion
          </h2>
          <NuclearFusion />
        </section>

        {/* Solar Cycle */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            The Solar Cycle
          </h2>
          <p className="text-black/60 mb-6 max-w-2xl">
            The Sun&apos;s activity follows an approximately 11-year cycle, driven by the
            periodic reversal of its magnetic field. Solar maximum brings increased sunspots,
            flares, and aurora on Earth.
          </p>
          <SolarCycleChart />
        </section>

        {/* Life Cycle */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Life Cycle
          </h2>
          <p className="text-black/60 mb-6 max-w-2xl">
            The Sun is 4.6 billion years old and roughly halfway through its main sequence
            life. Explore its past and future evolution.
          </p>
          <LifeCycleTimeline />
        </section>

        {/* Space Weather */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Space Weather
          </h2>
          <SpaceWeatherHistory />
        </section>

        {/* Footer Links */}
        <footer className="pt-8 border-t border-black/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/observe/solar-observatory"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              Solar Observatory →
            </Link>
            <Link
              href="/data/solar-system"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              Solar System →
            </Link>
            <Link
              href="/data"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              ← Back to Data
            </Link>
          </div>

          {/* Data Sources */}
          <div className="mt-6 pt-6 border-t border-black/10">
            <p className="text-xs text-black/30 mb-2">Data Sources</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-black/40">
              <span>Solar imagery: NASA SDO</span>
              <span>Coronagraphs: SOHO LASCO</span>
              <span>Space weather: NOAA SWPC</span>
              <span>Sunspot data: SILSO, Royal Observatory of Belgium</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
