'use client';

import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FundamentalForcesChart from '@/components/data/FundamentalForcesChart';

export default function FundamentalForcesPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="bg-white rounded-lg py-1 md:py-2 px-2 md:px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Data', href: '/data' },
                { label: 'The Fabric', href: '/data/fabric' },
                { label: 'Forces' },
              ]}
              theme="light"
            />
          </div>
        </div>

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase mb-3">
              Fundamental Forces
            </h1>
            <p className="text-sm md:text-base text-black/60 max-w-2xl">
              The four fundamental interactions that govern all phenomena in the universe —
              from quarks to galaxies. Three are described by the Standard Model; gravity remains separate.
            </p>
          </section>

          {/* Key Numbers Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <div className="p-2 md:p-4 bg-black rounded-lg">
                <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1">Fundamental Forces</div>
                <div className="text-lg md:text-3xl lg:text-4xl font-bold text-white tabular-nums">4</div>
                <div className="text-[10px] text-white/30 mt-1">strong, EM, weak, gravity</div>
              </div>
              <div className="p-2 md:p-4 bg-black rounded-lg">
                <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1">In Standard Model</div>
                <div className="text-lg md:text-3xl lg:text-4xl font-bold text-white tabular-nums">3</div>
                <div className="text-[10px] text-white/30 mt-1">gravity excluded</div>
              </div>
              <div className="p-2 md:p-4 bg-black rounded-lg">
                <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1">Strength Range</div>
                <div className="text-lg md:text-3xl lg:text-4xl font-bold text-white tabular-nums">10³⁸</div>
                <div className="text-[10px] text-white/30 mt-1">orders of magnitude</div>
              </div>
              <Link href="/data/fabric/particles" className="block p-2 md:p-4 bg-black rounded-lg hover:bg-neutral-900 transition-colors">
                <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1">Carrier Particles</div>
                <div className="text-lg md:text-3xl lg:text-4xl font-bold text-white tabular-nums">5</div>
                <div className="text-[10px] text-white/30 mt-1">γ, g, W±, Z, (G)</div>
              </Link>
            </div>
          </section>

          {/* Chart Frame */}
          <section className="bg-white rounded-lg overflow-hidden">
            <div className="h-[550px] md:h-[650px]">
              <FundamentalForcesChart />
            </div>
          </section>

          {/* Four Forces Summary Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <h2 className="text-xl font-light text-black uppercase mb-4">The Four Forces</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {/* Strong */}
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-4 h-4 rounded-full bg-rose-500" />
                  <span className="text-lg font-medium text-white">Strong Nuclear</span>
                  <span className="text-xs text-white/30 font-mono ml-auto">SU(3)</span>
                </div>
                <p className="text-sm text-white/60 mb-3">
                  Binds quarks into protons and neutrons. The strongest force, but confined to nuclear scales (~10⁻¹⁵ m).
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-white/40">Strength</div>
                    <div className="text-white font-mono">1</div>
                  </div>
                  <div>
                    <div className="text-white/40">Range</div>
                    <div className="text-white font-mono">10⁻¹⁵ m</div>
                  </div>
                  <div>
                    <div className="text-white/40">Carrier</div>
                    <div className="text-white font-mono">gluon (g)</div>
                  </div>
                </div>
              </div>

              {/* Electromagnetic */}
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-4 h-4 rounded-full bg-yellow-500" />
                  <span className="text-lg font-medium text-white">Electromagnetic</span>
                  <span className="text-xs text-white/30 font-mono ml-auto">U(1)</span>
                </div>
                <p className="text-sm text-white/60 mb-3">
                  Acts between charged particles. Responsible for light, chemistry, electricity, and almost all everyday phenomena.
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-white/40">Strength</div>
                    <div className="text-white font-mono">1/137</div>
                  </div>
                  <div>
                    <div className="text-white/40">Range</div>
                    <div className="text-white font-mono">∞</div>
                  </div>
                  <div>
                    <div className="text-white/40">Carrier</div>
                    <div className="text-white font-mono">photon (γ)</div>
                  </div>
                </div>
              </div>

              {/* Weak */}
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="text-lg font-medium text-white">Weak Nuclear</span>
                  <span className="text-xs text-white/30 font-mono ml-auto">SU(2)</span>
                </div>
                <p className="text-sm text-white/60 mb-3">
                  Changes quark and lepton flavors. Responsible for beta decay and neutrino interactions. Very short range.
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-white/40">Strength</div>
                    <div className="text-white font-mono">10⁻⁶</div>
                  </div>
                  <div>
                    <div className="text-white/40">Range</div>
                    <div className="text-white font-mono">10⁻¹⁸ m</div>
                  </div>
                  <div>
                    <div className="text-white/40">Carrier</div>
                    <div className="text-white font-mono">W±, Z⁰</div>
                  </div>
                </div>
              </div>

              {/* Gravity */}
              <div className="p-3 md:p-4 bg-black rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-4 h-4 rounded-full bg-gray-500" />
                  <span className="text-lg font-medium text-white">Gravity</span>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider ml-auto">Not in SM</span>
                </div>
                <p className="text-sm text-white/60 mb-3">
                  Acts on all mass and energy. By far the weakest force, but dominates at cosmic scales because it&apos;s always attractive.
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-white/40">Strength</div>
                    <div className="text-white font-mono">10⁻³⁸</div>
                  </div>
                  <div>
                    <div className="text-white/40">Range</div>
                    <div className="text-white font-mono">∞</div>
                  </div>
                  <div>
                    <div className="text-white/40">Carrier</div>
                    <div className="text-white font-mono">graviton?</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Context Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="max-w-3xl">
              <h2 className="text-xl font-light text-black uppercase mb-3">Why Four Forces?</h2>
              <p className="text-sm text-black/60 mb-4">
                Everything we observe — from nuclear reactions to planetary orbits — is governed by just
                four fundamental interactions. Each force has a characteristic <strong className="text-black">strength</strong>,
                <strong className="text-black"> range</strong>, and <strong className="text-black">carrier particle</strong>.
              </p>

              <h2 className="text-xl font-light text-black uppercase mb-3 mt-6">The Standard Model Problem</h2>
              <p className="text-sm text-black/60 mb-4">
                The Standard Model successfully unifies the electromagnetic and weak forces
                (into the <strong className="text-black">electroweak</strong> force above ~100 GeV) and describes
                the strong force via Quantum Chromodynamics (QCD). But gravity remains stubbornly outside —
                described by General Relativity rather than quantum field theory.
              </p>

              <h2 className="text-xl font-light text-black uppercase mb-3 mt-6">Unification</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-xs text-green-700 uppercase tracking-wider mb-1">Confirmed</div>
                  <div className="font-medium text-green-900 mb-1">Electroweak</div>
                  <div className="text-sm text-green-800">EM + Weak unify at ~100 GeV</div>
                  <div className="text-xs text-green-600 mt-2">Glashow, Salam, Weinberg (1979)</div>
                </div>
                <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-4">
                  <div className="text-xs text-black/50 uppercase tracking-wider mb-1">Theoretical</div>
                  <div className="font-medium text-black mb-1">Grand Unified</div>
                  <div className="text-sm text-black/60">EM + Weak + Strong at ~10¹⁶ GeV</div>
                  <div className="text-xs text-black/40 mt-2">Various GUT models</div>
                </div>
                <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-4">
                  <div className="text-xs text-black/50 uppercase tracking-wider mb-1">Hypothetical</div>
                  <div className="font-medium text-black mb-1">Theory of Everything</div>
                  <div className="text-sm text-black/60">All 4 forces at Planck scale</div>
                  <div className="text-xs text-black/40 mt-2">String theory, LQG candidates</div>
                </div>
              </div>
            </div>
          </section>

          {/* Cross-References Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-sm text-black/40 uppercase tracking-wider mb-3">Related</div>
            <div className="flex flex-wrap gap-4 mb-6">
              <Link href="/data/fabric/particles" className="text-sm text-black/60 hover:text-black transition-colors">
                Standard Model →
              </Link>
              <Link href="/data/fabric/constants" className="text-sm text-black/60 hover:text-black transition-colors">
                Physical Constants →
              </Link>
              <Link href="/data/fabric/spectrum" className="text-sm text-black/60 hover:text-black transition-colors">
                EM Spectrum →
              </Link>
              <Link href="/observe/detectors/lhc" className="text-sm text-black/60 hover:text-black transition-colors">
                LHC Status →
              </Link>
              <Link href="/observe/detectors/gravitational" className="text-sm text-black/60 hover:text-black transition-colors">
                Gravitational Wave Detectors →
              </Link>
            </div>

            <div className="pt-4 border-t border-black/10">
              <div className="text-[10px] text-black/30 uppercase tracking-wider mb-2">References</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-black/40">
                <div>
                  <div className="text-black/50 mb-1">Standard Model</div>
                  <div>PDG Review</div>
                  <div>CERN</div>
                </div>
                <div>
                  <div className="text-black/50 mb-1">Coupling Constants</div>
                  <div>CODATA 2022</div>
                  <div>NIST</div>
                </div>
                <div>
                  <div className="text-black/50 mb-1">Force Discovery</div>
                  <div>Nobel Archive</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  );
}
