import { Metadata } from 'next'
import Link from 'next/link'
import SunHero from '@/components/sun/SunHero'
import SpaceWeatherDashboard from '@/components/sun/SpaceWeatherDashboard'
import SolarLive from '@/components/widgets/SolarLive'
import SOHOCoronagraph from '@/components/widgets/SOHOCoronagraph'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'The Sun | MXWLL',
  description: 'Live solar observation from NASA SDO and SOHO, real-time space weather data, and dramatic imagery of our star.',
}

// SDO Wavelengths explanation
const wavelengths = [
  { name: '193Å', color: '#00bcd4', temp: '1.2M K', shows: 'Corona, flares, and coronal holes' },
  { name: '171Å', color: '#ffcc00', temp: '600K K', shows: 'Coronal loops and active regions' },
  { name: '304Å', color: '#ff3b30', temp: '50K K', shows: 'Chromosphere and prominences' },
  { name: '131Å', color: '#00bcd4', temp: '10M K', shows: 'Hottest flare material' },
  { name: 'HMI', color: '#8e8e93', temp: 'Visible', shows: 'Photosphere and sunspots' },
]

export default function SunPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Hero Section - Full width, no padding */}
      <SunHero />

      {/* Page Content */}
      <div className="px-4 md:px-8 lg:px-12 pt-6 md:pt-8 lg:pt-12 pb-16 md:pb-20 lg:pb-24">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Observe', href: '/observe' },
            { label: 'The Sun' },
          ]}
        />

        {/* Page Header */}
        <header className="mt-4 mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-2">
            The Sun
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            Our star, observed in real-time. Live imagery from NASA spacecraft,
            current space weather conditions, and the activity that drives our solar system.
          </p>
        </header>

        {/* Space Weather Dashboard */}
        <section className="mb-8 md:mb-12">
          <SpaceWeatherDashboard />
        </section>

        {/* Live Observation Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Live Observation
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SolarLive />
            <SOHOCoronagraph />
          </div>
        </section>

        {/* Educational Content */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Understanding Solar Activity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Data Sources */}
        <section className="mb-8 md:mb-12">
          <div className="bg-[#e5e5e5] rounded-xl p-5 md:p-6">
            <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
              Data Sources
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-black/40">Solar imagery</p>
                <p className="text-black font-medium">NASA SDO</p>
              </div>
              <div>
                <p className="text-black/40">Coronagraph</p>
                <p className="text-black font-medium">SOHO LASCO</p>
              </div>
              <div>
                <p className="text-black/40">X-ray flux</p>
                <p className="text-black font-medium">NOAA GOES</p>
              </div>
              <div>
                <p className="text-black/40">Space weather</p>
                <p className="text-black font-medium">NOAA SWPC</p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section>
          <div className="bg-[#e5e5e5] rounded-xl p-5 md:p-6">
            <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
              Related
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/data/solar-system/sun"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Sun Data Page →
              </Link>
              <Link
                href="/observe/dashboard"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Dashboard →
              </Link>
              <Link
                href="/data/spectrum"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                EM Spectrum →
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
