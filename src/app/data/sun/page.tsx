import { Metadata } from 'next'
import Link from 'next/link'
import SunHeroSlideshow from '@/components/data/sun/SunHeroSlideshow'
import KeyFactsGrid from '@/components/data/sun/KeyFactsGrid'

export const metadata: Metadata = {
  title: 'The Sun | MXWLL',
  description: 'Our star - a G-type main-sequence yellow dwarf. Age, mass, structure, fusion, and the solar cycle explained.',
}

// SDO Wavelengths explanation
const wavelengths = [
  { name: '193Å', color: '#00bcd4', temp: '1.2M K', shows: 'Corona, flares, and coronal holes' },
  { name: '171Å', color: '#ffcc00', temp: '600K K', shows: 'Coronal loops and active regions' },
  { name: '304Å', color: '#ff3b30', temp: '50K K', shows: 'Chromosphere and prominences' },
  { name: '131Å', color: '#00bcd4', temp: '10M K', shows: 'Hottest flare material' },
  { name: 'HMI', color: '#8e8e93', temp: 'Visible', shows: 'Photosphere and sunspots' },
]

export default function SunDataPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Breadcrumb */}
        <p className="text-xs font-mono text-black/40 uppercase tracking-widest mb-2">
          MXWLL / Data / Sun
        </p>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            The Sun
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl mb-4">
            Our star - a G-type main-sequence yellow dwarf
          </p>
          <Link
            href="/observe/solar-observatory"
            className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-[#e6007e] transition-colors"
          >
            See it live →
          </Link>
        </div>

        {/* Hero Image Slideshow - WITHIN MARGINS */}
        <section className="mb-8">
          <div className="rounded-xl overflow-hidden">
            <SunHeroSlideshow />
          </div>
        </section>

        {/* Key Facts */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Key Facts
          </h2>
          <KeyFactsGrid />
        </section>

        {/* Educational Content */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Understanding the Sun
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Solar Structure */}
            <div className="bg-white rounded-xl p-5 md:p-6">
              <h3 className="text-base font-medium text-black mb-3">Solar Structure</h3>
              <p className="text-sm text-black/60 leading-relaxed mb-4">
                The Sun has distinct layers: the core where nuclear fusion occurs,
                the radiative zone where energy slowly diffuses outward, the convective
                zone where plasma churns like boiling water, and the visible photosphere.
              </p>
              <p className="text-sm text-black/60 leading-relaxed">
                Above the surface lies the chromosphere and the corona - the Sun's outer
                atmosphere that extends millions of kilometers into space and is only
                visible during eclipses or through specialized instruments.
              </p>
            </div>

            {/* Nuclear Fusion */}
            <div className="bg-white rounded-xl p-5 md:p-6">
              <h3 className="text-base font-medium text-black mb-3">Nuclear Fusion</h3>
              <p className="text-sm text-black/60 leading-relaxed mb-4">
                In the core, at 15.7 million Kelvin, hydrogen atoms fuse into helium
                through the proton-proton chain reaction. Each second, 600 million
                tons of hydrogen convert to helium, releasing energy equivalent to
                4 million tons of matter via E=mc².
              </p>
              <p className="text-sm text-black/60 leading-relaxed">
                This energy takes about 100,000 years to reach the surface, then
                only 8 minutes to travel 150 million km to Earth as light.
              </p>
            </div>

            {/* Solar Cycle */}
            <div className="bg-white rounded-xl p-5 md:p-6">
              <h3 className="text-base font-medium text-black mb-3">The 11-Year Solar Cycle</h3>
              <p className="text-sm text-black/60 leading-relaxed mb-4">
                The Sun's activity follows an approximately 11-year cycle. During solar maximum,
                sunspots, flares, and coronal mass ejections are frequent. During solar minimum,
                the Sun is relatively quiet. We're currently in Solar Cycle 25, heading toward
                maximum activity expected around 2025.
              </p>
              <p className="text-sm text-black/60 leading-relaxed">
                At maximum, the Sun's magnetic field becomes increasingly complex and
                eventually flips polarity - the north and south magnetic poles reverse.
              </p>
            </div>

            {/* Space Weather Impact */}
            <div className="bg-white rounded-xl p-5 md:p-6">
              <h3 className="text-base font-medium text-black mb-3">Space Weather & Earth</h3>
              <p className="text-sm text-black/60 leading-relaxed mb-4">
                Solar activity directly affects Earth. Coronal mass ejections can trigger
                geomagnetic storms, creating aurora visible at lower latitudes. Strong
                storms can disrupt satellites, GPS, radio communications, and in extreme
                cases, power grids.
              </p>
              <p className="text-sm text-black/60 leading-relaxed">
                The Kp index measures geomagnetic activity on a 0-9 scale. Values of 5+
                indicate storm conditions. The solar wind - a constant stream of charged
                particles at 400-800 km/s - shapes the space environment around Earth.
              </p>
            </div>
          </div>
        </section>

        {/* SDO Wavelengths */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            What the Wavelengths Show
          </h2>
          <div className="bg-white rounded-xl p-5 md:p-6">
            <p className="text-sm text-black/60 mb-4">
              The Solar Dynamics Observatory captures the Sun in multiple wavelengths of
              extreme ultraviolet light, each revealing different temperatures and features:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {wavelengths.map((w) => (
                <div key={w.name} className="p-3 bg-[#f5f5f5] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: w.color }}
                    />
                    <span className="font-mono text-sm font-medium text-black">{w.name}</span>
                  </div>
                  <p className="text-xs text-black/50 mb-1">{w.temp}</p>
                  <p className="text-xs text-black/60">{w.shows}</p>
                </div>
              ))}
            </div>
          </div>
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
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
