import { Metadata } from 'next'
import Link from 'next/link'
import { Atom, Waves, CircleDot, Sparkles } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import DetectorsStatusBar from '@/components/observe/detectors/DetectorsStatusBar'

export const metadata: Metadata = {
  title: 'Detectors | Observe | MXWLL',
  description: 'The world\'s most sensitive instruments. Particle colliders, gravitational waves, neutrinos, and cosmic rays.',
}

const detectorPages = [
  {
    href: '/observe/detectors/lhc',
    title: 'LHC',
    description: 'The Large Hadron Collider. 27km of superconducting magnets colliding protons at 99.9999991% the speed of light.',
    icon: Atom,
    status: 'LIVE',
    available: true,
  },
  {
    href: '/observe/detectors/neutrinos',
    title: 'Neutrinos',
    description: 'Ghost particles from the cosmos. IceCube, Super-Kamiokande, and the hunt for supernova neutrinos.',
    icon: Sparkles,
    status: 'LIVE',
    available: true,
  },
  {
    href: '/observe/detectors/gravitational',
    title: 'Gravitational Waves',
    description: 'Ripples in spacetime. LIGO and Virgo listening for colliding black holes and neutron stars.',
    icon: Waves,
    status: 'LIVE',
    available: true,
  },
  {
    href: '/observe/detectors/cosmic-rays',
    title: 'Cosmic Rays',
    description: 'High-energy particles from supernovae and black holes. Neutron monitor network worldwide.',
    icon: CircleDot,
    status: 'LIVE',
    available: true,
  },
]

export default function DetectorsPortalPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Observe', href: '/observe' },
              { label: 'Detectors' },
            ]}
            theme="dark"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-3">
            Detectors
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl">
            The world&apos;s most sensitive instruments, listening to the universe. Particles,
            waves, and signals invisible to human senses.
          </p>
        </div>

        {/* Status Bar */}
        <DetectorsStatusBar className="mb-8" />

        {/* Hero Visualization */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-xl aspect-[21/9] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/textures/noise.png')] opacity-10" />
            {/* Particle collision visualization placeholder */}
            <div className="text-center z-10">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping" />
                <div className="w-8 h-8 rounded-full bg-white/20" />
                <div className="w-4 h-4 rounded-full bg-purple-400 animate-ping" />
              </div>
              <p className="text-white/60 text-sm">Probing the fundamental nature of reality</p>
            </div>
          </div>
        </section>

        {/* Detector Cards */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Active Experiments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detectorPages.map((page) => {
              const Icon = page.icon

              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className="bg-[#0f0f14] rounded-xl border border-white/10 p-6 hover:border-white/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-white/5 rounded-lg">
                      <Icon size={22} className="text-white/50" strokeWidth={1.5} />
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-mono rounded">
                      {page.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2 group-hover:underline">
                    {page.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {page.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Scale of Detection */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Scales of Detection
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-purple-400">10⁻¹⁸</p>
              <p className="text-xs text-white/40">m (LIGO precision)</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-cyan-400">13.6</p>
              <p className="text-xs text-white/40">TeV (LHC collisions)</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-emerald-400">1 km³</p>
              <p className="text-xs text-white/40">IceCube volume</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-amber-400">10²⁰</p>
              <p className="text-xs text-white/40">eV (cosmic ray max)</p>
            </div>
          </div>
        </section>

        {/* What They Detect */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            What They Detect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <h3 className="text-sm font-medium text-white">Particle Colliders</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Recreating conditions from the first moments after the Big Bang. The LHC
                accelerates protons to 99.9999991% the speed of light, then smashes them
                together to reveal fundamental particles like the Higgs boson.
              </p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <h3 className="text-sm font-medium text-white">Neutrino Detectors</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Ghost particles that barely interact with matter. Trillions pass through you
                every second. IceCube uses a cubic kilometre of Antarctic ice to catch the
                rare neutrino that does interact, revealing cosmic sources.
              </p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-medium text-white">Gravitational Wave Detectors</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Ripples in the fabric of spacetime, predicted by Einstein in 1916, first detected
                in 2015. LIGO&apos;s 4km laser arms can detect length changes smaller than a proton,
                caused by merging black holes billions of light years away.
              </p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <h3 className="text-sm font-medium text-white">Cosmic Ray Monitors</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                High-energy particles accelerated by supernovae, black holes, and other cosmic
                phenomena. The global neutron monitor network tracks their flux, which varies
                with solar activity and provides early warning of space weather events.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/observe"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Back to Observe
            </Link>
            <Link
              href="/observe/detectors/lhc"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              LHC →
            </Link>
            <Link
              href="/data/particles"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Particle Data →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/30 mb-2">Data Sources</p>
            <p className="text-xs text-white/40">
              CERN LHC Page 1 • LIGO/Virgo GraceDB • IceCube GCN • NMDB Neutron Monitors
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
