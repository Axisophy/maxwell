'use client';

import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import StandardModelChart from '@/components/data/StandardModelChart';

export default function StandardModelPage() {
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
                { label: 'Standard Model' },
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
              Standard Model
            </h1>
            <p className="text-sm md:text-base text-black/60 max-w-2xl">
              The theoretical framework describing all known fundamental particles and three of the four fundamental forces.
              17 particles, 12 fermions, 5 bosons — the building blocks of everything we can see.
            </p>
          </section>

          {/* Key Numbers Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <div className="p-2 md:p-4 bg-black rounded-lg">
                <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1">Particles</div>
                <div className="text-lg md:text-3xl lg:text-4xl font-bold text-white tabular-nums">17</div>
              </div>
              <div className="p-2 md:p-4 bg-black rounded-lg">
                <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1">Fermions</div>
                <div className="text-lg md:text-3xl lg:text-4xl font-bold text-white tabular-nums">12</div>
              </div>
              <div className="p-2 md:p-4 bg-black rounded-lg">
                <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1">Bosons</div>
                <div className="text-lg md:text-3xl lg:text-4xl font-bold text-white tabular-nums">5</div>
              </div>
              <div className="p-2 md:p-4 bg-black rounded-lg">
                <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1">Forces</div>
                <div className="text-lg md:text-3xl lg:text-4xl font-bold text-white tabular-nums">3<span className="text-base md:text-lg text-white/40">+1</span></div>
              </div>
            </div>
          </section>

          {/* Chart Frame */}
          <section className="bg-white rounded-lg overflow-hidden">
            <div className="h-[600px] md:h-[700px]">
              <StandardModelChart />
            </div>
          </section>

          {/* Context Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="max-w-3xl">
              <h2 className="text-xl font-light text-black uppercase mb-3">What&apos;s Included</h2>
              <p className="text-sm text-black/60 mb-4">
                The Standard Model successfully explains three of the four fundamental forces:
                <strong className="text-black"> electromagnetic</strong> (photon),
                <strong className="text-black"> weak nuclear</strong> (W and Z bosons), and
                <strong className="text-black"> strong nuclear</strong> (gluons).
                The Higgs boson gives mass to W, Z, and all fermions.
              </p>

              <h2 className="text-xl font-light text-black uppercase mb-3 mt-6">What&apos;s Missing</h2>
              <p className="text-sm text-black/60">
                Gravity is not included — there&apos;s no graviton in the Standard Model.
                Also absent: dark matter, dark energy, neutrino masses (require extensions),
                and an explanation for matter-antimatter asymmetry. The model is precise
                but known to be incomplete.
              </p>
            </div>
          </section>

          {/* Forces Summary Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <h2 className="text-xl font-light text-black uppercase mb-4">The Four Forces</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-white">Electromagnetic</span>
                </div>
                <p className="text-xs text-white/50">
                  Carried by the photon. Infinite range. Acts on electric charge.
                  Binds electrons to nuclei.
                </p>
              </div>
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium text-white">Weak Nuclear</span>
                </div>
                <p className="text-xs text-white/50">
                  Carried by W± and Z bosons. Very short range (~10⁻¹⁸ m).
                  Changes quark/lepton flavour. Drives beta decay.
                </p>
              </div>
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-white">Strong Nuclear</span>
                </div>
                <p className="text-xs text-white/50">
                  Carried by gluons. Acts on colour charge. Binds quarks into hadrons,
                  nucleons into nuclei. Confines quarks.
                </p>
              </div>
              <div className="p-3 md:p-4 bg-black rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-white/30" />
                  <span className="text-sm font-medium text-white/50">Gravity</span>
                  <span className="text-[10px] text-white/30 uppercase">Not in SM</span>
                </div>
                <p className="text-xs text-white/30">
                  Not part of the Standard Model. Hypothetical carrier: graviton.
                  Described separately by General Relativity.
                </p>
              </div>
            </div>
          </section>

          {/* Cross-References Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-sm text-black/40 uppercase tracking-wider mb-3">Related</div>
            <div className="flex flex-wrap gap-4 mb-6">
              <Link href="/data/elements" className="text-sm text-black/60 hover:text-black transition-colors">
                Elements →
              </Link>
              <Link href="/data/fabric/constants" className="text-sm text-black/60 hover:text-black transition-colors">
                Physical Constants →
              </Link>
              <Link href="/data/fabric/scale" className="text-sm text-black/60 hover:text-black transition-colors">
                Scale of the Universe →
              </Link>
              <Link href="/observe/detectors/lhc" className="text-sm text-black/60 hover:text-black transition-colors">
                LHC Status →
              </Link>
            </div>

            <div className="pt-4 border-t border-black/10">
              <div className="text-[10px] text-black/30 uppercase tracking-wider mb-2">Data Sources</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-black/40">
                <div>
                  <div className="text-black/50 mb-1">Particle Properties</div>
                  <div>Particle Data Group (PDG)</div>
                  <div>CODATA 2022</div>
                </div>
                <div>
                  <div className="text-black/50 mb-1">Discovery History</div>
                  <div>CERN</div>
                  <div>Fermilab</div>
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
