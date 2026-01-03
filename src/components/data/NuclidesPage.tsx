'use client';

import React from 'react';
import Link from 'next/link';
import NuclideChart from './NuclideChart';

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-black/30">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-black/50 hover:text-black transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-black">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Key statistics about the nuclide chart
const STATS = [
  { label: 'Known Nuclides', value: '~3,300', note: 'Observed to date' },
  { label: 'Stable Nuclides', value: '252', note: 'No observed decay' },
  { label: 'Elements', value: '118', note: 'Confirmed' },
  { label: 'Magic Numbers', value: '7', note: '2, 8, 20, 28, 50, 82, 126' },
];

export default function NuclidesPage() {
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
                { label: 'Elements', href: '/data/elements' },
                { label: 'Chart of Nuclides' },
              ]}
            />
          </div>
        </div>

        {/* Header Frame */}
        <div className="bg-white rounded-lg p-2 md:p-4 mb-px">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase">
            Chart of Nuclides
          </h1>
          <p className="text-sm md:text-base text-black/60 mt-2 max-w-3xl">
            Every known isotope of every element, mapped by protons and neutrons.
            The periodic table shows 118 elements — this chart shows over 3,000 distinct nuclei.
            Stable isotopes form the "valley of stability" running diagonally through the chart.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-px">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-white rounded-lg p-3 md:p-4">
              <div className="text-[10px] md:text-xs text-black/50 uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-black tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs text-black/40 mt-1">
                {stat.note}
              </div>
            </div>
          ))}
        </div>

        {/* Chart Frame */}
        <div className="bg-white rounded-lg overflow-hidden mb-px">
          <div className="h-[500px] md:h-[600px] lg:h-[700px]">
            <NuclideChart className="h-full" />
          </div>
        </div>

        {/* Understanding Section */}
        <div className="bg-white rounded-lg p-4 mb-px">
          <h2 className="text-xl md:text-2xl font-light text-black uppercase mb-4">
            Understanding the Chart
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-black rounded-lg p-4 border border-white/10">
              <h3 className="text-sm font-medium text-white mb-2">What is a nuclide?</h3>
              <p className="text-sm text-white/60">
                A nuclide is a specific combination of protons (Z) and neutrons (N) in an atomic nucleus.
                While the periodic table groups atoms by proton count alone (elements), nuclides distinguish
                between isotopes — atoms with the same proton count but different neutron counts.
              </p>
            </div>

            <div className="bg-black rounded-lg p-4 border border-white/10">
              <h3 className="text-sm font-medium text-white mb-2">The Valley of Stability</h3>
              <p className="text-sm text-white/60">
                Stable nuclides cluster along a diagonal "valley" where the balance of protons and neutrons
                creates a stable nuclear configuration. Light elements prefer equal numbers (N ≈ Z),
                while heavy elements need more neutrons to remain stable.
              </p>
            </div>

            <div className="bg-black rounded-lg p-4 border border-white/10">
              <h3 className="text-sm font-medium text-white mb-2">Magic Numbers</h3>
              <p className="text-sm text-white/60">
                Nuclei with "magic" numbers of protons or neutrons (2, 8, 20, 28, 50, 82, 126) are
                exceptionally stable. These correspond to filled nuclear shells, similar to electron
                shells in atoms. Lead-208 is "doubly magic" with 82 protons and 126 neutrons.
              </p>
            </div>

            <div className="bg-black rounded-lg p-4 border border-white/10">
              <h3 className="text-sm font-medium text-white mb-2">Decay Modes</h3>
              <p className="text-sm text-white/60">
                Unstable nuclides decay toward stability. Neutron-rich nuclei undergo β⁻ decay
                (neutron → proton), while proton-rich nuclei undergo β⁺ decay or electron capture.
                Very heavy nuclei often undergo α decay, emitting helium-4 nuclei.
              </p>
            </div>
          </div>
        </div>

        {/* Notable Nuclides */}
        <div className="bg-white rounded-lg p-4 mb-px">
          <h2 className="text-xl md:text-2xl font-light text-black uppercase mb-4">
            Notable Nuclides
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
            {[
              { symbol: 'Fe', mass: 56, name: 'Iron-56', note: 'Most stable nucleus (highest binding energy per nucleon)' },
              { symbol: 'Pb', mass: 208, name: 'Lead-208', note: 'Doubly magic — 82 protons, 126 neutrons' },
              { symbol: 'C', mass: 14, name: 'Carbon-14', note: 'Radiocarbon dating (t½ = 5,730 years)' },
              { symbol: 'U', mass: 235, name: 'Uranium-235', note: 'Fissile — nuclear reactors and weapons' },
              { symbol: 'Tc', mass: 99, name: 'Technetium-99m', note: 'Most used medical radioisotope' },
              { symbol: 'Pu', mass: 238, name: 'Plutonium-238', note: 'RTG power for spacecraft' },
              { symbol: 'Bi', mass: 209, name: 'Bismuth-209', note: 'Longest measured half-life (2×10¹⁹ years)' },
              { symbol: 'H', mass: 1, name: 'Hydrogen-1', note: 'Most abundant nuclide in the universe' },
            ].map((nuc, i) => (
              <div key={i} className="bg-black rounded-lg p-3 border border-white/10">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-lg font-mono font-bold text-white">{nuc.symbol}</span>
                  <span className="text-sm font-mono text-white/60">{nuc.mass}</span>
                </div>
                <div className="text-xs text-white/40 mb-2">{nuc.name}</div>
                <div className="text-xs text-white/50">{nuc.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-References Frame */}
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-black/40 uppercase tracking-wider mb-3">Related</div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Link href="/data/elements" className="text-sm text-black/60 hover:text-black transition-colors">
              Periodic Table →
            </Link>
            <Link href="/data/fabric/particles" className="text-sm text-black/60 hover:text-black transition-colors">
              Standard Model →
            </Link>
            <Link href="/data/fabric/forces" className="text-sm text-black/60 hover:text-black transition-colors">
              Fundamental Forces →
            </Link>
            <Link href="/observe/detectors" className="text-sm text-black/60 hover:text-black transition-colors">
              Particle Detectors →
            </Link>
          </div>

          <div className="pt-4 border-t border-black/10">
            <div className="text-[10px] text-black/30 uppercase tracking-wider mb-2">Data Sources</div>
            <div className="text-xs text-black/40">
              IAEA Nuclear Data Services · National Nuclear Data Center (NNDC) · Atomic Mass Evaluation (AME2020)
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
