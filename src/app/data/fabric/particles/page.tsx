'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import StandardModelChart from '@/components/data/StandardModelChart';

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-white/30">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-white/50 hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Particle data for ledger
const PARTICLES_LIST = [
  { symbol: 'u', name: 'up', type: 'quark', mass: '2.2 MeV', charge: '+⅔', spin: '½', year: 1968 },
  { symbol: 'd', name: 'down', type: 'quark', mass: '4.7 MeV', charge: '−⅓', spin: '½', year: 1968 },
  { symbol: 'c', name: 'charm', type: 'quark', mass: '1.27 GeV', charge: '+⅔', spin: '½', year: 1974 },
  { symbol: 's', name: 'strange', type: 'quark', mass: '95 MeV', charge: '−⅓', spin: '½', year: 1968 },
  { symbol: 't', name: 'top', type: 'quark', mass: '173 GeV', charge: '+⅔', spin: '½', year: 1995 },
  { symbol: 'b', name: 'bottom', type: 'quark', mass: '4.2 GeV', charge: '−⅓', spin: '½', year: 1977 },
  { symbol: 'e', name: 'electron', type: 'lepton', mass: '0.511 MeV', charge: '−1', spin: '½', year: 1897 },
  { symbol: 'μ', name: 'muon', type: 'lepton', mass: '106 MeV', charge: '−1', spin: '½', year: 1936 },
  { symbol: 'τ', name: 'tau', type: 'lepton', mass: '1.78 GeV', charge: '−1', spin: '½', year: 1975 },
  { symbol: 'νe', name: 'e neutrino', type: 'lepton', mass: '<2.2 eV', charge: '0', spin: '½', year: 1956 },
  { symbol: 'νμ', name: 'μ neutrino', type: 'lepton', mass: '<0.17 MeV', charge: '0', spin: '½', year: 1962 },
  { symbol: 'ντ', name: 'τ neutrino', type: 'lepton', mass: '<15.5 MeV', charge: '0', spin: '½', year: 2000 },
  { symbol: 'g', name: 'gluon', type: 'gauge', mass: '0', charge: '0', spin: '1', year: 1979 },
  { symbol: 'γ', name: 'photon', type: 'gauge', mass: '0', charge: '0', spin: '1', year: 1905 },
  { symbol: 'W', name: 'W boson', type: 'gauge', mass: '80.4 GeV', charge: '±1', spin: '1', year: 1983 },
  { symbol: 'Z', name: 'Z boson', type: 'gauge', mass: '91.2 GeV', charge: '0', spin: '1', year: 1983 },
  { symbol: 'H', name: 'Higgs', type: 'higgs', mass: '125 GeV', charge: '0', spin: '0', year: 2012 },
];

const TYPE_COLORS: Record<string, string> = {
  'quark': 'bg-fuchsia-500',
  'lepton': 'bg-emerald-500',
  'gauge': 'bg-orange-400',
  'higgs': 'bg-amber-400',
};

// Discovery timeline data
const DISCOVERIES = [
  { year: 1897, particles: ['e'], event: 'Discovery of the electron', who: 'J.J. Thomson', where: 'Cambridge' },
  { year: 1905, particles: ['γ'], event: 'Photon concept introduced', who: 'Albert Einstein', where: 'Bern' },
  { year: 1936, particles: ['μ'], event: 'Muon discovered in cosmic rays', who: 'Anderson & Neddermeyer', where: 'Caltech' },
  { year: 1956, particles: ['νe'], event: 'Neutrino detected', who: 'Cowan & Reines', where: 'Savannah River' },
  { year: 1962, particles: ['νμ'], event: 'Muon neutrino discovered', who: 'Lederman, Schwartz, Steinberger', where: 'Brookhaven' },
  { year: 1968, particles: ['u', 'd', 's'], event: 'Quarks revealed via deep inelastic scattering', who: 'SLAC-MIT', where: 'Stanford' },
  { year: 1974, particles: ['c'], event: 'November Revolution — J/ψ discovered', who: 'Richter & Ting', where: 'SLAC & Brookhaven' },
  { year: 1975, particles: ['τ'], event: 'Tau lepton discovered', who: 'Martin Perl', where: 'SLAC' },
  { year: 1977, particles: ['b'], event: 'Bottom quark discovered', who: 'Leon Lederman et al.', where: 'Fermilab' },
  { year: 1979, particles: ['g'], event: 'Gluon observed in three-jet events', who: 'TASSO collaboration', where: 'DESY' },
  { year: 1983, particles: ['W', 'Z'], event: 'W and Z bosons discovered', who: 'Rubbia & van der Meer', where: 'CERN' },
  { year: 1995, particles: ['t'], event: 'Top quark discovered', who: 'CDF & DØ', where: 'Fermilab' },
  { year: 2000, particles: ['ντ'], event: 'Tau neutrino directly observed', who: 'DONUT collaboration', where: 'Fermilab' },
  { year: 2012, particles: ['H'], event: 'Higgs boson discovered', who: 'ATLAS & CMS', where: 'CERN LHC' },
];

// Ledger section
function LedgerSection() {
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'year'>('type');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedParticles = useMemo(() => {
    const sorted = [...PARTICLES_LIST].sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'type': return a.type.localeCompare(b.type);
        case 'year': return a.year - b.year;
        default: return 0;
      }
    });
    return sortDir === 'desc' ? sorted.reverse() : sorted;
  }, [sortBy, sortDir]);

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl font-light text-white uppercase">Particle Ledger</h2>
        <p className="text-sm text-white/50 mt-1">All 17 particles — click headers to sort</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 bg-black/20">
            <tr>
              <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider text-white/50">
                Particle
              </th>
              <th
                onClick={() => handleSort('type')}
                className="px-4 py-2 text-left text-[10px] uppercase tracking-wider text-white/50 cursor-pointer hover:text-white"
              >
                Type {sortBy === 'type' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider text-white/50">
                Mass
              </th>
              <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider text-white/50">
                Charge
              </th>
              <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider text-white/50">
                Spin
              </th>
              <th
                onClick={() => handleSort('year')}
                className="px-4 py-2 text-left text-[10px] uppercase tracking-wider text-white/50 cursor-pointer hover:text-white"
              >
                Discovered {sortBy === 'year' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedParticles.map((p, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-math text-white">{p.symbol}</span>
                    <span className="text-white/60">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded ${TYPE_COLORS[p.type]}`} />
                    <span className="text-white/60 capitalize">{p.type}</span>
                  </div>
                </td>
                <td className="px-4 py-2 font-mono text-white/80">{p.mass}</td>
                <td className="px-4 py-2 font-mono text-white/80">{p.charge}</td>
                <td className="px-4 py-2 font-mono text-white/80">{p.spin}</td>
                <td className="px-4 py-2 font-mono text-white/60">{p.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Timeline section
function TimelineSection() {
  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl font-light text-white uppercase">Discovery Timeline</h2>
        <p className="text-sm text-white/50 mt-1">1897–2012 — 115 years of discovery</p>
      </div>

      <div className="p-4 space-y-2">
        {DISCOVERIES.map((d, i) => (
          <div
            key={i}
            className="bg-black/30 rounded-lg p-3 hover:bg-black/40 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="text-xl font-mono text-white/40 w-14 flex-shrink-0">
                {d.year}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-math text-white">
                    {d.particles.join(' ')}
                  </span>
                  <span className="text-sm text-white/70">{d.event}</span>
                </div>
                <div className="text-xs text-white/40">
                  {d.who} · {d.where}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StandardModelPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="bg-[#1d1d1d] rounded-lg py-1 md:py-2 px-2 md:px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Data', href: '/data' },
                { label: 'The Fabric', href: '/data/fabric' },
                { label: 'Standard Model' },
              ]}
            />
          </div>
        </div>

        {/* Header Frame */}
        <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4 mb-px">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white uppercase">
            The Standard Model
          </h1>
          <p className="text-sm md:text-base text-white/60 mt-2 max-w-2xl">
            The theoretical framework describing all known fundamental particles and three of the four fundamental forces.
          </p>
        </div>

        {/* Chart Frame */}
        <div className="mb-px">
          <StandardModelChart />
        </div>

        {/* Ledger Section */}
        <div className="mb-px">
          <LedgerSection />
        </div>

        {/* Timeline Section */}
        <div className="mb-px">
          <TimelineSection />
        </div>

        {/* Context Frame */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <h2 className="text-xl font-light text-white uppercase mb-3">The Framework</h2>
          <p className="text-sm text-white/60 mb-6 max-w-2xl">
            The Standard Model is a quantum field theory that describes the electromagnetic, weak, and strong nuclear forces, and classifies all known elementary particles. Developed between 1961–1979, it has survived every experimental test since.
          </p>

          <h2 className="text-xl font-light text-white uppercase mb-3">What&apos;s Missing</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { title: 'Gravity', desc: 'No graviton in the SM' },
              { title: 'Dark Matter', desc: '~27% of universe' },
              { title: 'Dark Energy', desc: '~68% of universe' },
              { title: 'Neutrino Masses', desc: 'Requires extensions' },
              { title: 'Matter Asymmetry', desc: 'Why more matter?' },
              { title: 'Hierarchy Problem', desc: 'Why is gravity weak?' },
            ].map((item, i) => (
              <div key={i} className="bg-black/30 rounded-lg p-3 border border-white/5">
                <div className="text-sm text-white/80">{item.title}</div>
                <div className="text-xs text-white/40">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-References Frame */}
        <div className="bg-[#1d1d1d] rounded-lg p-4">
          <div className="text-sm text-white/40 uppercase tracking-wider mb-3">Related</div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Link href="/data/fabric/forces" className="text-sm text-white/60 hover:text-white transition-colors">
              Fundamental Forces →
            </Link>
            <Link href="/data/fabric/constants" className="text-sm text-white/60 hover:text-white transition-colors">
              Physical Constants →
            </Link>
            <Link href="/data/fabric/spectrum" className="text-sm text-white/60 hover:text-white transition-colors">
              EM Spectrum →
            </Link>
            <Link href="/observe/detectors/lhc" className="text-sm text-white/60 hover:text-white transition-colors">
              LHC Status →
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">References</div>
            <div className="text-xs text-white/40">
              Particle Data Group (PDG) Review 2024 · CODATA 2022 · Nobel Prize Archive
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
