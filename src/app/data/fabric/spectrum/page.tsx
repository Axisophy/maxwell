'use client';

import Link from 'next/link';
import EMSpectrumChart from '@/components/data/EMSpectrumChart';
import { BreadcrumbFrame, breadcrumbItems, PageHeaderFrame } from '@/components/ui';
import { DataIcon } from '@/components/icons';

export default function EMSpectrumPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        <BreadcrumbFrame
          variant="light"
          icon={<DataIcon className="w-4 h-4" />}
          items={breadcrumbItems(
            ['MXWLL', '/'],
            ['Data', '/data'],
            ['The Fabric', '/data/fabric'],
            ['EM Spectrum']
          )}
        />

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          <PageHeaderFrame
            variant="light"
            title="Electromagnetic Spectrum"
            description="From gamma rays to radio waves — 19 orders of magnitude of electromagnetic radiation. The visible spectrum we evolved to see represents less than 0.0035% of what's out there."
          />

          {/* Key Numbers Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <div className="p-2 md:p-4 bg-black rounded-lg">
                <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1">Orders of Magnitude</div>
                <div className="text-lg md:text-3xl lg:text-4xl font-bold text-white tabular-nums">19</div>
              </div>
              <div className="p-2 md:p-4 bg-black rounded-lg">
                <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1">Visible Fraction</div>
                <div className="text-lg md:text-3xl lg:text-4xl font-bold text-white tabular-nums">0.0035<span className="text-base md:text-lg text-white/40">%</span></div>
              </div>
              <div className="p-2 md:p-4 bg-black rounded-lg">
                <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1">Speed of Light</div>
                <div className="text-lg md:text-3xl lg:text-4xl font-bold text-white tabular-nums">c</div>
              </div>
              <div className="p-2 md:p-4 bg-black rounded-lg">
                <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1">Bands</div>
                <div className="text-lg md:text-3xl lg:text-4xl font-bold text-white tabular-nums">7</div>
              </div>
            </div>
          </section>

          {/* Chart Frame */}
          <section className="bg-white rounded-lg overflow-hidden">
            <div className="h-[500px] md:h-[600px]">
              <EMSpectrumChart />
            </div>
          </section>

          {/* The Physics Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <h2 className="text-xl font-light text-black uppercase mb-4">The Physics</h2>
            <div className="grid md:grid-cols-3 gap-px">
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="text-sm font-medium text-white mb-2">Wave-Particle Duality</div>
                <p className="text-xs text-white/50">
                  Light behaves as both a wave and a particle. The wave determines wavelength
                  and frequency; the particle (photon) carries energy. <span className="font-mono text-white/40">E = hf</span>
                </p>
              </div>
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="text-sm font-medium text-white mb-2">Universal Speed</div>
                <p className="text-xs text-white/50">
                  All electromagnetic radiation travels at exactly the same speed in vacuum:
                  <span className="font-mono text-white/40"> c = 299,792,458 m/s</span>. Only wavelength and frequency vary.
                </p>
              </div>
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="text-sm font-medium text-white mb-2">The Relationship</div>
                <p className="text-xs text-white/50 font-mono">
                  c = λf<br/>
                  <span className="text-white/30">As wavelength (λ) decreases, frequency (f) and energy increase proportionally.</span>
                </p>
              </div>
            </div>
          </section>

          {/* Bands Overview Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <h2 className="text-xl font-light text-black uppercase mb-4">The Seven Bands</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-white">Radio Waves</span>
                  <span className="text-[10px] text-white/30 uppercase ml-auto">1 mm – 100 km</span>
                </div>
                <p className="text-xs text-white/50">
                  Longest wavelengths. AM/FM broadcasting, WiFi, radio astronomy.
                  The cosmic microwave background redshifted to this range.
                </p>
              </div>
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm font-medium text-white">Microwaves</span>
                  <span className="text-[10px] text-white/30 uppercase ml-auto">0.1 mm – 1 mm</span>
                </div>
                <p className="text-xs text-white/50">
                  Heats water molecules. Microwave ovens, radar, satellite links, 5G.
                  CMB peak at 160 GHz.
                </p>
              </div>
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-red-700" />
                  <span className="text-sm font-medium text-white">Infrared</span>
                  <span className="text-[10px] text-white/30 uppercase ml-auto">700 nm – 0.1 mm</span>
                </div>
                <p className="text-xs text-white/50">
                  Heat radiation. Everything above absolute zero emits IR.
                  Thermal imaging, remote controls, fiber optics.
                </p>
              </div>
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(90deg, #8b5cf6, #22c55e, #ef4444)' }} />
                  <span className="text-sm font-medium text-white">Visible</span>
                  <span className="text-[10px] text-white/30 uppercase ml-auto">380 – 700 nm</span>
                </div>
                <p className="text-xs text-white/50">
                  The tiny window we evolved to see. Less than 0.0035% of the spectrum.
                  Photosynthesis, vision, photography.
                </p>
              </div>
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-violet-500" />
                  <span className="text-sm font-medium text-white">Ultraviolet</span>
                  <span className="text-[10px] text-white/30 uppercase ml-auto">10 – 380 nm</span>
                </div>
                <p className="text-xs text-white/50">
                  Higher energy than visible. Causes sunburn, vitamin D synthesis.
                  Sterilization, chip lithography, forensics.
                </p>
              </div>
              <div className="p-3 md:p-4 bg-black rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-500" />
                  <span className="text-sm font-medium text-white">X-Rays</span>
                  <span className="text-[10px] text-white/30 uppercase ml-auto">0.01 – 10 nm</span>
                </div>
                <p className="text-xs text-white/50">
                  Penetrating radiation. Medical imaging, CT scans, crystallography.
                  Absorbed by bone, passes through soft tissue.
                </p>
              </div>
              <div className="p-3 md:p-4 bg-black rounded-lg md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-white">Gamma Rays</span>
                  <span className="text-[10px] text-white/30 uppercase ml-auto">&lt; 0.01 nm</span>
                </div>
                <p className="text-xs text-white/50">
                  Highest energy EM radiation. Nuclear reactions, cosmic events.
                  Cancer therapy, gamma-ray bursts can outshine entire galaxies for seconds.
                </p>
              </div>
            </div>
          </section>

          {/* Context Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="max-w-3xl">
              <h2 className="text-xl font-light text-black uppercase mb-3">You're Nearly Blind</h2>
              <p className="text-sm text-black/60 mb-4">
                The visible spectrum -everything you can see -represents less than <strong className="text-black">0.0035%</strong> of
                the electromagnetic spectrum. The rest is invisible: radio waves carrying your WiFi and phone calls,
                infrared from everything warm, ultraviolet from the Sun, X-rays passing through walls,
                gamma rays from distant supernovas. Your eyes show you almost nothing of what's really there.
              </p>

              <h2 className="text-xl font-light text-black uppercase mb-3 mt-6">One Speed, Many Frequencies</h2>
              <p className="text-sm text-black/60">
                All electromagnetic radiation -from radio waves to gamma rays -travels at exactly the same speed in vacuum:
                <strong className="text-black font-mono"> c = 299,792,458 m/s</strong>. What distinguishes a radio wave from a gamma ray
                is only the wavelength and frequency. Shorter wavelengths mean higher frequencies and more energy per photon.
                A gamma ray photon carries about 10 trillion times more energy than a radio wave photon.
              </p>
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
              <Link href="/observe/space/solar-observatory" className="text-sm text-black/60 hover:text-black transition-colors">
                Solar Observatory →
              </Link>
              <Link href="/data/fabric/scale" className="text-sm text-black/60 hover:text-black transition-colors">
                Scale of the Universe →
              </Link>
            </div>

            <div className="pt-4 border-t border-black/10">
              <div className="text-[10px] text-black/30 uppercase tracking-wider mb-2">Data Sources</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-black/40">
                <div>
                  <div className="text-black/50 mb-1">Spectrum Data</div>
                  <div>NIST</div>
                  <div>CIE (Commission Internationale de l'Éclairage)</div>
                </div>
                <div>
                  <div className="text-black/50 mb-1">Physical Constants</div>
                  <div>CODATA 2022</div>
                  <div>BIPM</div>
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
