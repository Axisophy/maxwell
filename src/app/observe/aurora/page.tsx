import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import AuroraOval from '@/components/observe/solar-observatory/AuroraOval'
import GeomagActivity from '@/components/observe/solar-observatory/GeomagActivity'

export const metadata: Metadata = {
  title: 'Aurora Watch | MXWLL',
  description: 'Real-time aurora forecasts using the OVATION Prime model. Track northern and southern lights visibility based on current geomagnetic conditions.',
}

export default function AuroraPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Observe', href: '/observe' },
              { label: 'Space', href: '/observe/space' },
              { label: 'Aurora Watch' },
            ]}
            theme="dark"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-3">
            Aurora Watch
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl">
            Real-time aurora forecasts based on current solar wind and geomagnetic conditions.
            The OVATION Prime model predicts aurora probability for the next 30 minutes.
          </p>
        </div>

        {/* Geomagnetic Activity */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Current Conditions
          </h2>
          <GeomagActivity />
        </section>

        {/* Aurora Forecast Maps */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider">
              Aurora Forecast
            </h2>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-mono rounded">
              OVATION PRIME
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AuroraOval />
            <div className="bg-[#0f0f14] rounded-xl p-5 flex flex-col justify-center">
              <h3 className="text-sm font-medium text-white mb-3">Reading the Forecast</h3>
              <p className="text-xs text-white/50 leading-relaxed mb-3">
                The OVATION Prime model shows aurora probability based on current
                solar wind conditions measured at L1, about 1 million km from Earth.
                Brighter areas indicate higher chances of visible aurora.
              </p>
              <p className="text-xs text-white/50 leading-relaxed mb-3">
                Aurora is most visible during local night (face away from the Sun),
                away from light pollution, when the Kp index is elevated.
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                The auroral oval expands toward lower latitudes during geomagnetic storms.
                At Kp 5, aurora can be visible from northern England and Scotland.
                At Kp 7+, it may reach central Europe and the northern US.
              </p>
            </div>
          </div>
        </section>

        {/* Viewing Tips */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Viewing Tips
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Best Times</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Aurora is best viewed around local midnight (magnetic midnight),
                typically between 10pm and 2am. The hours around the equinoxes
                (March &amp; September) often have enhanced activity.
              </p>
            </div>

            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Location</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Find a dark location with an unobstructed view to the north
                (or south in the southern hemisphere). Light pollution significantly
                reduces visibility of fainter aurora.
              </p>
            </div>

            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Photography</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Camera sensors are more sensitive than eyes. Use long exposures
                (10-30 seconds), wide aperture (f/2.8 or wider), and high ISO
                (1600-6400) to capture aurora even when barely visible.
              </p>
            </div>
          </div>
        </section>

        {/* Kp Guide */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Kp Index Guide
          </h2>

          <div className="bg-[#0f0f14] rounded-xl overflow-hidden">
            <div className="grid grid-cols-5 text-center">
              {[
                { kp: '0-2', color: 'bg-green-500', label: 'Quiet', visibility: 'Arctic only' },
                { kp: '3-4', color: 'bg-yellow-500', label: 'Unsettled', visibility: 'N. Scandinavia, Alaska, Canada' },
                { kp: '5', color: 'bg-orange-500', label: 'Minor Storm', visibility: 'Scotland, N. England, N. US states' },
                { kp: '6-7', color: 'bg-red-500', label: 'Moderate Storm', visibility: 'Mid-latitudes' },
                { kp: '8-9', color: 'bg-red-700', label: 'Severe Storm', visibility: 'Low latitudes (rare)' },
              ].map((item) => (
                <div key={item.kp} className="p-4 border-r border-white/5 last:border-r-0">
                  <div className={`w-8 h-8 ${item.color} rounded-full mx-auto mb-2`} />
                  <p className="text-white font-mono text-lg mb-1">Kp {item.kp}</p>
                  <p className="text-white/60 text-xs mb-1">{item.label}</p>
                  <p className="text-white/40 text-[10px]">{item.visibility}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/observe/space"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Back to Space
            </Link>
            <Link
              href="/observe/solar-observatory"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Solar Observatory →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/30 mb-2">Data Sources</p>
            <p className="text-xs text-white/40">
              NOAA Space Weather Prediction Center • OVATION Prime Model • Planetary K-index
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
