import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Earth | Solar System | MXWLL',
  description: 'The third planet from the Sun — our pale blue dot. The only known world with liquid water, atmosphere, and life.',
}

const orbitalFacts = [
  { label: 'Distance from Sun', value: '149.6M km', note: '1 AU' },
  { label: 'Orbital Period', value: '365.25 days', note: '1 year' },
  { label: 'Orbital Velocity', value: '29.78 km/s', note: '107,000 km/h' },
  { label: 'Orbital Eccentricity', value: '0.0167', note: 'nearly circular' },
  { label: 'Axial Tilt', value: '23.44°', note: 'causes seasons' },
  { label: 'Rotation Period', value: '23h 56m 4s', note: 'sidereal day' },
]

const physicalFacts = [
  { label: 'Diameter', value: '12,742 km', note: 'equatorial' },
  { label: 'Mass', value: '5.97×10²⁴ kg', note: '' },
  { label: 'Density', value: '5.51 g/cm³', note: 'highest of any planet' },
  { label: 'Surface Gravity', value: '9.81 m/s²', note: '1 g' },
  { label: 'Escape Velocity', value: '11.19 km/s', note: '' },
  { label: 'Surface Area', value: '510.1M km²', note: '71% water' },
]

const atmosphereLayers = [
  { name: 'Troposphere', altitude: '0-12 km', description: 'Weather occurs here, contains 80% of atmospheric mass' },
  { name: 'Stratosphere', altitude: '12-50 km', description: 'Ozone layer absorbs UV radiation' },
  { name: 'Mesosphere', altitude: '50-80 km', description: 'Meteors burn up here' },
  { name: 'Thermosphere', altitude: '80-700 km', description: 'Aurora occurs, ISS orbits here' },
  { name: 'Exosphere', altitude: '700-10,000 km', description: 'Gradually merges with space' },
]

export default function EarthPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Data', href: '/data' },
              { label: 'Solar System', href: '/data/solar-system' },
              { label: 'Earth' },
            ]}
            theme="light"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Earth
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            The third planet from the Sun — our pale blue dot. The only known world
            with liquid water on its surface, a protective atmosphere, and life.
          </p>
        </div>

        {/* Hero Image */}
        <section className="mb-8 md:mb-12">
          <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 rounded-xl aspect-[21/9] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/textures/noise.png')] opacity-5" />
            <div className="text-center z-10">
              <div className="text-6xl mb-2">🌍</div>
              <p className="text-white/80 text-sm">The Blue Marble</p>
            </div>
          </div>
        </section>

        {/* Position in Solar System */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Our Place in the Solar System
          </h2>
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
              {['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'].map((planet, i) => (
                <div
                  key={planet}
                  className={`text-center flex-shrink-0 ${planet === 'Earth' ? 'scale-110' : 'opacity-50'}`}
                >
                  <div
                    className={`rounded-full mx-auto mb-2 ${
                      planet === 'Earth'
                        ? 'w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 ring-2 ring-blue-300'
                        : planet === 'Mercury' ? 'w-6 h-6 bg-gray-400'
                        : planet === 'Venus' ? 'w-12 h-12 bg-amber-200'
                        : planet === 'Mars' ? 'w-8 h-8 bg-orange-600'
                        : 'w-24 h-24 bg-amber-700'
                    }`}
                  />
                  <p className={`text-sm ${planet === 'Earth' ? 'font-medium text-black' : 'text-black/40'}`}>
                    {planet}
                  </p>
                  <p className="text-xs text-black/30">{i === 2 ? '1 AU' : ''}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-black/60 mt-4">
              Earth orbits in the &quot;Goldilocks zone&quot; — not too hot, not too cold — where
              liquid water can exist on the surface. This habitable zone is key to life as we know it.
            </p>
          </div>
        </section>

        {/* Orbital & Physical Stats */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            At a Glance
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
                Orbital Characteristics
              </h3>
              <div className="space-y-3">
                {orbitalFacts.map((fact) => (
                  <div key={fact.label} className="flex items-center justify-between">
                    <span className="text-black/50 text-sm">{fact.label}</span>
                    <div className="text-right">
                      <span className="font-mono text-black">{fact.value}</span>
                      {fact.note && (
                        <span className="text-xs text-black/40 ml-2">({fact.note})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
                Physical Characteristics
              </h3>
              <div className="space-y-3">
                {physicalFacts.map((fact) => (
                  <div key={fact.label} className="flex items-center justify-between">
                    <span className="text-black/50 text-sm">{fact.label}</span>
                    <div className="text-right">
                      <span className="font-mono text-black">{fact.value}</span>
                      {fact.note && (
                        <span className="text-xs text-black/40 ml-2">({fact.note})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Earth Special */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            What Makes Earth Special
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5">
              <div className="text-2xl mb-2">💧</div>
              <h3 className="font-medium text-black mb-2">Liquid Water</h3>
              <p className="text-sm text-black/60">
                The only planet with stable liquid water on its surface. 71% ocean coverage
                regulates climate and enabled life to emerge.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="font-medium text-black mb-2">Magnetic Field</h3>
              <p className="text-sm text-black/60">
                Generated by Earth&apos;s liquid iron core, the magnetosphere deflects solar
                wind and cosmic radiation that would strip away our atmosphere.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <div className="text-2xl mb-2">🌫️</div>
              <h3 className="font-medium text-black mb-2">Atmosphere</h3>
              <p className="text-sm text-black/60">
                78% nitrogen, 21% oxygen — breathable and dense enough to trap heat
                but thin enough for sunlight to reach the surface.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <div className="text-2xl mb-2">🌋</div>
              <h3 className="font-medium text-black mb-2">Plate Tectonics</h3>
              <p className="text-sm text-black/60">
                The only planet with active plate tectonics, recycling the crust, driving
                volcanism, and regulating CO₂ through the carbon cycle.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <div className="text-2xl mb-2">🌙</div>
              <h3 className="font-medium text-black mb-2">Large Moon</h3>
              <p className="text-sm text-black/60">
                The Moon stabilises Earth&apos;s axial tilt, giving us stable seasons.
                Without it, Earth would wobble chaotically over millions of years.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <div className="text-2xl mb-2">🧬</div>
              <h3 className="font-medium text-black mb-2">Life</h3>
              <p className="text-sm text-black/60">
                The only known world where life exists — from deep-sea vents to mountain
                peaks, from bacteria to blue whales.
              </p>
            </div>
          </div>
        </section>

        {/* Atmosphere */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            The Atmosphere
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-medium text-black mb-4">Composition</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-full bg-blue-100 rounded-full h-6 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '78%' }} />
                  </div>
                  <span className="text-sm text-black/60 w-24">N₂ 78%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-full bg-green-100 rounded-full h-6 overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: '21%' }} />
                  </div>
                  <span className="text-sm text-black/60 w-24">O₂ 21%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div className="bg-gray-400 h-full rounded-full" style={{ width: '1%' }} />
                  </div>
                  <span className="text-sm text-black/60 w-24">Ar 0.9%</span>
                </div>
              </div>
              <p className="text-xs text-black/40 mt-4">
                CO₂: ~0.042% • H₂O vapor: 0-4% • Trace gases: Ne, He, CH₄, Kr
              </p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-medium text-black mb-4">Layers</h3>
              <div className="space-y-2">
                {atmosphereLayers.map((layer) => (
                  <div key={layer.name} className="flex gap-4 py-2 border-b border-black/5 last:border-0">
                    <div className="w-24 flex-shrink-0">
                      <p className="text-sm font-medium text-black">{layer.name}</p>
                      <p className="text-xs text-black/40">{layer.altitude}</p>
                    </div>
                    <p className="text-sm text-black/60">{layer.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The Moon */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            The Moon
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6">
              <div className="flex items-center gap-8 mb-6">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-black">The Moon</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-8">
                    <span className="text-black/50">Diameter</span>
                    <span className="font-mono text-black">3,474 km</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-black/50">Distance</span>
                    <span className="font-mono text-black">384,400 km</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-black/50">Orbital Period</span>
                    <span className="font-mono text-black">27.3 days</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-black/50">Relative Size</span>
                    <span className="font-mono text-black">27% of Earth</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-black/60 leading-relaxed">
                Earth&apos;s Moon is unusually large compared to its host planet — larger relative
                to Earth than any other moon relative to its planet. This makes the Earth-Moon
                system almost a double planet. The Moon likely formed from debris after a
                Mars-sized body collided with early Earth around 4.5 billion years ago.
              </p>
            </div>
            <div className="bg-[#1a1a1e] rounded-xl p-6 text-white">
              <h3 className="font-medium mb-4">Lunar Effects</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-white/50 mb-1">Tides</p>
                  <p className="text-white/80">
                    The Moon&apos;s gravity creates ocean tides, rising and falling twice daily.
                  </p>
                </div>
                <div>
                  <p className="text-white/50 mb-1">Axial Stability</p>
                  <p className="text-white/80">
                    Prevents Earth&apos;s axis from wobbling chaotically over millions of years.
                  </p>
                </div>
                <div>
                  <p className="text-white/50 mb-1">Day Length</p>
                  <p className="text-white/80">
                    Tidal friction is slowing Earth&apos;s rotation by ~1.4 ms per century.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Earth in Numbers */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Earth in Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-blue-600">71%</p>
              <p className="text-xs text-black/50">Ocean coverage</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-green-600">8.7M</p>
              <p className="text-xs text-black/50">Estimated species</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-black">4.54B</p>
              <p className="text-xs text-black/50">Years old</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-black">8.1B</p>
              <p className="text-xs text-black/50">Humans</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-black">-89°C</p>
              <p className="text-xs text-black/50">Coldest recorded</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-black">+57°C</p>
              <p className="text-xs text-black/50">Hottest recorded</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-black">8,849m</p>
              <p className="text-xs text-black/50">Highest point</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-black">-10,935m</p>
              <p className="text-xs text-black/50">Deepest point</p>
            </div>
          </div>
        </section>

        {/* Deep Dive Links */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Explore Further
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/data/earth"
              className="bg-white rounded-xl p-6 hover:border-black border border-transparent transition-colors group"
            >
              <h3 className="text-lg font-medium text-black mb-2 group-hover:underline">
                Earth Data Hub
              </h3>
              <p className="text-sm text-black/50">
                Deep dive into civilisation, geography, geology, life, and climate.
              </p>
            </Link>
            <Link
              href="/observe/earth"
              className="bg-white rounded-xl p-6 hover:border-black border border-transparent transition-colors group"
            >
              <h3 className="text-lg font-medium text-black mb-2 group-hover:underline">
                Live Earth Observation
              </h3>
              <p className="text-sm text-black/50">
                Real-time earthquakes, volcanoes, fires, weather, and atmosphere.
              </p>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-black/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/data/solar-system"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              ← Solar System
            </Link>
            <Link
              href="/data/solar-system/mars"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              Mars →
            </Link>
            <Link
              href="/observe/space/lunar-atlas"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              Lunar Atlas →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-black/10">
            <p className="text-xs text-black/30 mb-2">Data Sources</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-black/40">
              <span>Physical data: NASA Earth Fact Sheet</span>
              <span>Atmospheric data: NOAA</span>
              <span>Population: UN World Population Prospects</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
