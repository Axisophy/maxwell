import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import NeptuneStatsGrid from '@/components/data/neptune/NeptuneStatsGrid'
import TritonSection from '@/components/data/neptune/TritonSection'

export const metadata: Metadata = {
  title: 'Neptune | MXWLL',
  description: 'The windswept ice giant at the edge of the solar system. Visited only once, still full of mysteries.',
}

const moons = [
  { name: 'Triton', diameter: '2,706 km', notable: 'Largest, retrograde orbit' },
  { name: 'Proteus', diameter: '420 km', notable: 'Largest inner moon' },
  { name: 'Nereid', diameter: '340 km', notable: 'Highly eccentric orbit' },
  { name: 'Larissa', diameter: '194 km', notable: 'Ring shepherd' },
  { name: 'Galatea', diameter: '176 km', notable: 'Near Adams ring' },
  { name: 'Despina', diameter: '148 km', notable: 'Near Le Verrier ring' },
]

export default function NeptunePage() {
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
              { label: 'Neptune' },
            ]}
            theme="light"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Neptune
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            The windswept ice giant at the edge of the solar system. Visited only once,
            in 1989, for just 9 hours. Still full of mysteries.
          </p>
        </div>

        {/* Hero Image Placeholder */}
        <section className="mb-8 md:mb-12">
          <div className="bg-[#0f172a] rounded-xl aspect-[21/9] flex items-center justify-center">
            <p className="text-white/30 text-sm">Neptune — Voyager 2, August 1989</p>
          </div>
        </section>

        {/* Key Stats */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            At a Glance
          </h2>
          <NeptuneStatsGrid />
        </section>

        {/* Distance & Size */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            How Far? How Big?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-medium text-black mb-4">Distance</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/50">From Sun</span>
                  <span className="font-mono text-black">4.5 billion km (30 AU)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Light travel time</span>
                  <span className="font-mono text-black">4+ hours each way</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Voyager 2 travel time</span>
                  <span className="font-mono text-black">12 years</span>
                </div>
              </div>
              <p className="text-xs text-black/40 mt-4">
                30× farther from the Sun than Earth. The outermost planet.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-medium text-black mb-4">Size</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/50">Diameter</span>
                  <span className="font-mono text-black">4× Earth</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Mass</span>
                  <span className="font-mono text-black">17× Earth</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Volume</span>
                  <span className="font-mono text-black">57 Earths would fit inside</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ice Giant */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Ice Giant
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <p className="text-black/60 leading-relaxed mb-4">
                Neptune is an &quot;ice giant&quot; — different from the gas giants Jupiter and Saturn.
                While gas giants are mostly hydrogen and helium, ice giants have a thick mantle
                of water, ammonia, and methane in hot, dense fluid form.
              </p>
              <p className="text-black/60 leading-relaxed">
                The &quot;ice&quot; isn&apos;t frozen — it&apos;s superheated fluid under extreme pressure.
                Temperatures reach thousands of degrees, but the pressure is so intense the
                materials can&apos;t evaporate.
              </p>
            </div>
            <div className="bg-[#1a1a1e] rounded-xl p-6 text-white">
              <h3 className="font-medium mb-4">Internal Structure</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Atmosphere</span>
                  <span className="font-mono">H₂, He, CH₄</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Mantle</span>
                  <span className="font-mono">Water, ammonia, methane &quot;ices&quot;</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Core</span>
                  <span className="font-mono">Rock and ice, ~1.2 Earth masses</span>
                </div>
              </div>
              <p className="text-xs text-white/40 mt-4">
                Mystery: Neptune radiates 2.6× more heat than it receives from the Sun.
                Internal heat source unknown.
              </p>
            </div>
          </div>
        </section>

        {/* The Blue */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Why So Blue?
          </h2>
          <div className="bg-white rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-black/60 leading-relaxed mb-4">
                  Methane in Neptune&apos;s atmosphere absorbs red light, leaving the blue. But
                  Neptune is more vividly blue than Uranus, which also has methane.
                </p>
                <p className="text-black/60 leading-relaxed">
                  Something else must be contributing — possibly different haze particles or
                  methane rain. It&apos;s an active research question.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-black/50 uppercase mb-3">Atmosphere</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/50">Hydrogen</span>
                    <span className="font-mono text-black">80%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Helium</span>
                    <span className="font-mono text-black">19%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Methane</span>
                    <span className="font-mono text-black">1.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Extreme Weather */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Extreme Weather
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-medium text-black mb-3">Fastest Winds</h3>
              <p className="text-3xl font-mono font-bold text-black mb-2">2,100 km/h</p>
              <p className="text-sm text-black/60 leading-relaxed">
                The fastest sustained winds in the solar system. 5× stronger than the worst
                Earth hurricanes. And they blow backwards — opposite to Neptune&apos;s rotation.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-medium text-black mb-3">The Paradox</h3>
              <p className="text-sm text-black/60 leading-relaxed">
                Neptune receives 900× less solar energy than Earth, yet has the most violent
                weather in the solar system. Internal heat must drive the storms — but we
                don&apos;t know why Neptune has so much internal heat.
              </p>
            </div>
          </div>
          <div className="bg-[#1a1a1e] rounded-xl p-6 mt-6 text-white">
            <h3 className="font-medium mb-3">The Great Dark Spot</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              When Voyager 2 arrived in 1989, it observed an Earth-sized storm called the Great
              Dark Spot. But when Hubble looked in 1994, it was gone. Neptune&apos;s storms are
              temporary — they come and go over years, unlike Jupiter&apos;s permanent Red Spot.
            </p>
          </div>
        </section>

        {/* Rings */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            The Rings
          </h2>
          <div className="bg-white rounded-xl p-6">
            <p className="text-black/60 leading-relaxed mb-6">
              Neptune has five main rings — faint, dusty, and only visible in backlit images
              from Voyager 2. The Adams ring has unusual clumpy arcs named Liberté, Égalité,
              Fraternité, and Courage.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px]">
                <thead className="border-b border-black/10">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-black/50 uppercase">Ring</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-black/50 uppercase">Distance</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-black/50 uppercase">Named For</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-black/5">
                    <td className="px-3 py-2 font-medium text-black">Galle</td>
                    <td className="px-3 py-2 font-mono text-black/60">41,900 km</td>
                    <td className="px-3 py-2 text-black/60">Johann Galle</td>
                  </tr>
                  <tr className="border-b border-black/5">
                    <td className="px-3 py-2 font-medium text-black">Le Verrier</td>
                    <td className="px-3 py-2 font-mono text-black/60">53,200 km</td>
                    <td className="px-3 py-2 text-black/60">Urbain Le Verrier</td>
                  </tr>
                  <tr className="border-b border-black/5">
                    <td className="px-3 py-2 font-medium text-black">Lassell</td>
                    <td className="px-3 py-2 font-mono text-black/60">53,200-57,200 km</td>
                    <td className="px-3 py-2 text-black/60">William Lassell</td>
                  </tr>
                  <tr className="border-b border-black/5">
                    <td className="px-3 py-2 font-medium text-black">Arago</td>
                    <td className="px-3 py-2 font-mono text-black/60">57,200 km</td>
                    <td className="px-3 py-2 text-black/60">François Arago</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-black">Adams</td>
                    <td className="px-3 py-2 font-mono text-black/60">62,930 km</td>
                    <td className="px-3 py-2 text-black/60">John Couch Adams</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Moons */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            The Moons
          </h2>
          <p className="text-black/60 mb-6 max-w-2xl">
            16 known moons — but Triton contains 99.5% of all moon mass. The rest are
            small, irregular bodies.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {moons.map((moon) => (
              <div key={moon.name} className="bg-white rounded-xl p-4">
                <h4 className="font-medium text-black mb-1">{moon.name}</h4>
                <p className="text-sm font-mono text-black/60 mb-1">{moon.diameter}</p>
                <p className="text-xs text-black/50">{moon.notable}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Triton */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Triton: The Strange Moon
          </h2>
          <TritonSection />
        </section>

        {/* Discovery */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Discovery
          </h2>
          <div className="bg-white rounded-xl p-6">
            <p className="text-black/60 leading-relaxed mb-4">
              Neptune was the first planet found through mathematics, not observation. In the
              1840s, astronomers noticed Uranus wasn&apos;t following its predicted orbit. Something
              unseen was pulling on it.
            </p>
            <p className="text-black/60 leading-relaxed mb-4">
              John Couch Adams in England and Urbain Le Verrier in France independently calculated
              where the unknown planet must be. On September 23, 1846, Johann Galle pointed his
              telescope at Le Verrier&apos;s coordinates and found Neptune within 1° of the prediction.
            </p>
            <p className="text-sm text-black/50">
              It was a triumph of Newtonian physics — using gravity to predict the existence
              of an unseen world.
            </p>
          </div>
        </section>

        {/* Voyager 2 */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            The Voyager 2 Encounter
          </h2>
          <div className="bg-[#1a1a1e] rounded-xl p-6 text-white">
            <p className="text-2xl font-mono font-bold mb-2">August 25, 1989</p>
            <p className="text-white/60 mb-6">
              The only spacecraft visit. Closest approach: 4,951 km above the cloud tops.
              Just 9 hours of close observation — then onward to interstellar space.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-medium mb-2">What Voyager 2 Discovered</h4>
                <ul className="text-sm text-white/60 space-y-1">
                  <li>• Great Dark Spot storm</li>
                  <li>• Fastest winds in solar system</li>
                  <li>• Faint ring system</li>
                  <li>• 6 new moons</li>
                  <li>• Triton&apos;s geysers</li>
                  <li>• Tilted, offset magnetic field</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-medium mb-2">The Images</h4>
                <p className="text-sm text-white/60">
                  All close-up images of Neptune we have are from this single 9-hour encounter,
                  35+ years ago. Everything else is distant telescope observation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Don't Know */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            What We Don&apos;t Know
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5">
              <h4 className="font-medium text-black mb-2">Internal heat source</h4>
              <p className="text-sm text-black/60">
                Why does Neptune radiate 2.6× more heat than it receives from the Sun?
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <h4 className="font-medium text-black mb-2">The blue mystery</h4>
              <p className="text-sm text-black/60">
                What makes Neptune so much bluer than Uranus? Both have methane.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <h4 className="font-medium text-black mb-2">Storm formation</h4>
              <p className="text-sm text-black/60">
                How do such violent storms form with so little solar energy?
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <h4 className="font-medium text-black mb-2">Triton&apos;s interior</h4>
              <p className="text-sm text-black/60">
                Is there an ocean beneath the ice? What drives the geysers?
              </p>
            </div>
          </div>
          <div className="bg-[#e5e5e5] rounded-xl p-6 mt-6">
            <h4 className="font-medium text-black mb-2">When Might We Return?</h4>
            <p className="text-sm text-black/60">
              No approved missions currently. Favorable launch window in the 2030s using
              Jupiter gravity assist. Travel time: 12+ years. Earliest arrival: mid-2040s.
              We may not see Neptune up close again in our lifetimes.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-black/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/data/cosmos/solar-system"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              ← Solar System
            </Link>
            <Link
              href="/data/cosmos/solar-system/mars"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              Mars →
            </Link>
            <Link
              href="/data/cosmos/solar-system/sun"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              The Sun →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-black/10">
            <p className="text-xs text-black/30 mb-2">Data Sources</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-black/40">
              <span>Physical data: NASA Neptune Fact Sheet</span>
              <span>Images: NASA Voyager 2, Hubble, JWST</span>
              <span>Discovery: Historical records</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
