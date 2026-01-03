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

        {/* Composite Particles Section */}
        <div className="bg-[#1d1d1d] rounded-lg overflow-hidden mb-px">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-xl font-light text-white uppercase">Composite Particles</h2>
            <p className="text-sm text-white/50 mt-1">How quarks combine to form hadrons</p>
          </div>

          <div className="p-4 space-y-6">
            <p className="text-sm text-white/60 max-w-2xl">
              Quarks never exist in isolation — they're confined by the strong force into composite particles called hadrons. The two main families are baryons (three quarks) and mesons (quark-antiquark pairs).
            </p>

            {/* Baryons */}
            <div>
              <h3 className="text-lg font-light text-white mb-3">Baryons</h3>
              <p className="text-sm text-white/50 mb-3">Three quarks bound together. Includes all "ordinary" matter.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { name: 'Proton', quarks: 'uud', charge: '+1', mass: '938 MeV', note: 'Stable' },
                  { name: 'Neutron', quarks: 'udd', charge: '0', mass: '940 MeV', note: '~10 min half-life' },
                  { name: 'Lambda', quarks: 'uds', charge: '0', mass: '1116 MeV', note: 'Contains strange' },
                  { name: 'Omega−', quarks: 'sss', charge: '−1', mass: '1672 MeV', note: 'Three strange quarks' },
                ].map((p, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-3 border border-fuchsia-500/20">
                    <div className="text-sm text-white font-medium">{p.name}</div>
                    <div className="text-lg font-mono text-fuchsia-400 my-1">{p.quarks}</div>
                    <div className="text-[10px] text-white/40 space-y-0.5">
                      <div>Charge: {p.charge}</div>
                      <div>Mass: {p.mass}</div>
                      <div>{p.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mesons */}
            <div>
              <h3 className="text-lg font-light text-white mb-3">Mesons</h3>
              <p className="text-sm text-white/50 mb-3">Quark-antiquark pairs. Unstable, mediate nuclear forces.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { name: 'Pion (π+)', quarks: 'ud̄', charge: '+1', mass: '140 MeV', note: 'Nuclear force carrier' },
                  { name: 'Kaon (K+)', quarks: 'us̄', charge: '+1', mass: '494 MeV', note: 'Contains strange' },
                  { name: 'J/ψ', quarks: 'cc̄', charge: '0', mass: '3097 MeV', note: 'Charmonium' },
                  { name: 'Upsilon (Υ)', quarks: 'bb̄', charge: '0', mass: '9460 MeV', note: 'Bottomonium' },
                ].map((p, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-3 border border-fuchsia-500/20">
                    <div className="text-sm text-white font-medium">{p.name}</div>
                    <div className="text-lg font-mono text-fuchsia-400 my-1">{p.quarks}</div>
                    <div className="text-[10px] text-white/40 space-y-0.5">
                      <div>Charge: {p.charge}</div>
                      <div>Mass: {p.mass}</div>
                      <div>{p.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exotic Hadrons */}
            <div>
              <h3 className="text-lg font-light text-white mb-3">Exotic Hadrons</h3>
              <p className="text-sm text-white/50 mb-3">Recently discovered states with unusual quark configurations.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { name: 'Tetraquarks', desc: 'Four quarks (e.g., cc̄ud̄). First confirmed by LHCb in 2021.' },
                  { name: 'Pentaquarks', desc: 'Five quarks (e.g., uudcc̄). Discovered at LHCb in 2015.' },
                ].map((p, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-3 border border-white/10">
                    <div className="text-sm text-white font-medium">{p.name}</div>
                    <div className="text-xs text-white/50 mt-1">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Antiparticles Section */}
        <div className="bg-[#1d1d1d] rounded-lg overflow-hidden mb-px">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-xl font-light text-white uppercase">Antiparticles</h2>
            <p className="text-sm text-white/50 mt-1">Every particle has an antimatter counterpart</p>
          </div>

          <div className="p-4 space-y-4">
            <p className="text-sm text-white/60 max-w-2xl">
              For every particle, there exists an antiparticle with identical mass but opposite charge and quantum numbers. When a particle meets its antiparticle, they annihilate — converting their mass entirely into energy.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { particle: 'Electron (e⁻)', anti: 'Positron (e⁺)', note: 'First antiparticle discovered (1932)' },
                { particle: 'Proton (p)', anti: 'Antiproton (p̄)', note: 'Discovered at Berkeley (1955)' },
                { particle: 'Neutrino (ν)', anti: 'Antineutrino (ν̄)', note: 'May be its own antiparticle' },
                { particle: 'Up quark (u)', anti: 'Anti-up (ū)', note: 'Charge: +⅔ → −⅔' },
                { particle: 'Photon (γ)', anti: 'Photon (γ)', note: 'Its own antiparticle' },
                { particle: 'Higgs (H)', anti: 'Higgs (H)', note: 'Its own antiparticle' },
              ].map((p, i) => (
                <div key={i} className="bg-black/30 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-white">{p.particle}</span>
                    <span className="text-white/30">↔</span>
                    <span className="text-sm text-white">{p.anti}</span>
                  </div>
                  <div className="text-[10px] text-white/40">{p.note}</div>
                </div>
              ))}
            </div>

            <div className="bg-black/30 rounded-lg p-4 border border-amber-500/20">
              <h3 className="text-sm font-medium text-amber-400 mb-2">The Matter-Antimatter Mystery</h3>
              <p className="text-xs text-white/50">
                The Big Bang should have produced equal amounts of matter and antimatter, which would have annihilated completely. Yet our universe is made almost entirely of matter. This asymmetry — one of the biggest unsolved problems in physics — requires CP violation beyond what the Standard Model predicts.
              </p>
            </div>
          </div>
        </div>

        {/* Beyond the Standard Model Section */}
        <div className="bg-[#1d1d1d] rounded-lg overflow-hidden mb-px">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-xl font-light text-white uppercase">Beyond the Standard Model</h2>
            <p className="text-sm text-white/50 mt-1">Hypothetical particles that could complete the picture</p>
          </div>

          <div className="p-4 space-y-4">
            <p className="text-sm text-white/60 max-w-2xl">
              The Standard Model is incomplete. It doesn't include gravity, can't explain dark matter or dark energy, and has no mechanism for neutrino masses. Several theoretical particles have been proposed to address these gaps.
            </p>

            {/* Graviton */}
            <div className="bg-black/30 rounded-lg p-4 border border-neutral-500/30">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-neutral-500 flex items-center justify-center flex-shrink-0">
                  <span className="font-math text-2xl text-neutral-900">G</span>
                </div>
                <div>
                  <h3 className="text-lg text-white">Graviton</h3>
                  <p className="text-xs text-white/50 mb-2">Spin-2 · Mass: 0 · Charge: 0</p>
                  <p className="text-sm text-white/60">
                    The hypothetical carrier of the gravitational force. Required by quantum field theory to quantise gravity, but not yet detected. Extremely weak coupling makes direct observation essentially impossible with current technology.
                  </p>
                </div>
              </div>
            </div>

            {/* Dark Matter Candidates */}
            <div>
              <h3 className="text-lg font-light text-white mb-3">Dark Matter Candidates</h3>
              <p className="text-sm text-white/50 mb-3">Particles proposed to explain the 27% of the universe we can't see.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  {
                    name: 'WIMPs',
                    full: 'Weakly Interacting Massive Particles',
                    desc: 'Heavy particles (~10–1000 GeV) interacting via weak force. Predicted by supersymmetry. Decades of direct detection experiments have found nothing.',
                    status: 'Increasingly constrained'
                  },
                  {
                    name: 'Axions',
                    full: 'Pseudo-Goldstone Bosons',
                    desc: 'Ultra-light particles (~10⁻⁵ eV) originally proposed to solve the strong CP problem. Could form a cosmic "superfluid". Active experimental searches underway.',
                    status: 'Leading candidate'
                  },
                  {
                    name: 'Sterile Neutrinos',
                    full: 'Right-Handed Neutrinos',
                    desc: "Heavy neutrinos that don't interact via any SM force except gravity. Could explain neutrino masses and dark matter simultaneously.",
                    status: 'Viable'
                  },
                  {
                    name: 'Primordial Black Holes',
                    full: 'Formed in Early Universe',
                    desc: 'Not particles, but small black holes formed before nucleosynthesis. Could account for some or all dark matter. Constrained but not ruled out.',
                    status: 'Partially constrained'
                  },
                ].map((p, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-3 border border-white/10">
                    <div className="text-sm text-white font-medium">{p.name}</div>
                    <div className="text-[10px] text-white/30 mb-2">{p.full}</div>
                    <p className="text-xs text-white/50 mb-2">{p.desc}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/40">{p.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Supersymmetric Particles */}
            <div>
              <h3 className="text-lg font-light text-white mb-3">Supersymmetric Particles</h3>
              <p className="text-sm text-white/50 mb-3">Predicted by supersymmetry — every SM particle has a heavier "superpartner".</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {[
                  { name: 'Selectron', partner: 'Electron', symbol: 'ẽ' },
                  { name: 'Squark', partner: 'Quark', symbol: 'q̃' },
                  { name: 'Gluino', partner: 'Gluon', symbol: 'g̃' },
                  { name: 'Photino', partner: 'Photon', symbol: 'γ̃' },
                  { name: 'Wino', partner: 'W boson', symbol: 'W̃' },
                  { name: 'Higgsino', partner: 'Higgs', symbol: 'H̃' },
                ].map((p, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-2 text-center border border-white/5">
                    <div className="text-lg font-math text-white/60">{p.symbol}</div>
                    <div className="text-[10px] text-white/40">{p.name}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/40 mt-2">
                None have been detected at the LHC. If they exist, they're heavier than ~1 TeV.
              </p>
            </div>

            {/* Dark Energy */}
            <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-sm font-medium text-purple-400 mb-2">Dark Energy (~68% of the universe)</h3>
              <p className="text-xs text-white/50">
                Even more mysterious than dark matter. Could be a cosmological constant (vacuum energy), a dynamic field (quintessence), or a sign that general relativity breaks down at cosmic scales. No particle physics explanation currently exists.
              </p>
            </div>
          </div>
        </div>

        {/* How We Study Particles Section */}
        <div className="bg-[#1d1d1d] rounded-lg overflow-hidden mb-px">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-xl font-light text-white uppercase">How We Study Particles</h2>
            <p className="text-sm text-white/50 mt-1">Accelerators, detectors, and the hunt for new physics</p>
          </div>

          <div className="p-4 space-y-6">
            <p className="text-sm text-white/60 max-w-2xl">
              Particle physics requires extreme energies to probe matter at the smallest scales. E = mc² means creating heavy particles requires enormous energy — and that means particle accelerators.
            </p>

            {/* Accelerators */}
            <div>
              <h3 className="text-lg font-light text-white mb-3">Particle Accelerators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  {
                    name: 'Large Hadron Collider',
                    location: 'CERN, Geneva',
                    type: 'Proton-proton collider',
                    energy: '13.6 TeV (centre-of-mass)',
                    circumference: '27 km',
                    achievement: 'Discovered Higgs boson (2012)'
                  },
                  {
                    name: 'Tevatron',
                    location: 'Fermilab, Illinois',
                    type: 'Proton-antiproton collider',
                    energy: '1.96 TeV',
                    circumference: '6.3 km',
                    achievement: 'Discovered top quark (1995). Shut down 2011.'
                  },
                  {
                    name: 'SLAC',
                    location: 'Stanford, California',
                    type: 'Linear electron accelerator',
                    energy: '50 GeV',
                    circumference: '3.2 km (linear)',
                    achievement: 'Discovered quarks (1968), tau lepton (1975)'
                  },
                  {
                    name: 'Future Circular Collider',
                    location: 'CERN (proposed)',
                    type: 'Electron-positron / proton-proton',
                    energy: '100 TeV (planned)',
                    circumference: '91 km',
                    achievement: 'Could begin operation ~2040s'
                  },
                ].map((a, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-3 border border-white/10">
                    <div className="text-sm text-white font-medium">{a.name}</div>
                    <div className="text-[10px] text-white/40 mb-2">{a.location}</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                      <div><span className="text-white/30">Type:</span> <span className="text-white/60">{a.type}</span></div>
                      <div><span className="text-white/30">Energy:</span> <span className="text-white/60">{a.energy}</span></div>
                      <div><span className="text-white/30">Size:</span> <span className="text-white/60">{a.circumference}</span></div>
                    </div>
                    <div className="text-xs text-white/50 mt-2 pt-2 border-t border-white/5">{a.achievement}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detection Methods */}
            <div>
              <h3 className="text-lg font-light text-white mb-3">Detection Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {[
                  {
                    name: 'Tracking Detectors',
                    desc: 'Measure charged particle trajectories in magnetic fields. Silicon pixels near collision point, wire chambers further out.',
                  },
                  {
                    name: 'Calorimeters',
                    desc: 'Measure particle energy by stopping them completely. Electromagnetic calorimeters for electrons/photons, hadronic for jets.',
                  },
                  {
                    name: 'Muon Systems',
                    desc: 'Outermost layer. Only muons and neutrinos penetrate this far — muons leave tracks, neutrinos escape undetected.',
                  },
                ].map((d, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-3">
                    <div className="text-sm text-white font-medium mb-1">{d.name}</div>
                    <p className="text-xs text-white/50">{d.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Link to LHC */}
            <div className="bg-black/30 rounded-lg p-4 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-400">Live LHC Status</h3>
                  <p className="text-xs text-white/50 mt-1">See current beam status, luminosity, and recent discoveries.</p>
                </div>
                <Link
                  href="/observe/detectors/lhc"
                  className="px-3 py-1.5 text-sm bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  View LHC →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Theoretical Physics Section */}
        <div className="bg-[#1d1d1d] rounded-lg overflow-hidden mb-px">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-xl font-light text-white uppercase">Theories & Open Problems</h2>
            <p className="text-sm text-white/50 mt-1">The physics beyond our current understanding</p>
          </div>

          <div className="p-4 space-y-4">
            {/* The Higgs Mechanism */}
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">The Higgs Mechanism</h3>
              <p className="text-xs text-white/50">
                Explains how particles acquire mass. The Higgs field permeates all space — particles that interact with it gain mass, while photons and gluons pass through unimpeded. The Higgs boson is an excitation of this field, confirmed in 2012. But we still don't know why the Higgs has the mass it does.
              </p>
            </div>

            {/* Hierarchy Problem */}
            <div className="bg-black/30 rounded-lg p-4 border border-amber-500/20">
              <h3 className="text-sm font-medium text-amber-400 mb-2">The Hierarchy Problem</h3>
              <p className="text-xs text-white/50">
                Why is gravity 10³⁶ times weaker than the other forces? Equivalently: why is the Planck mass (10¹⁹ GeV) so much larger than the Higgs mass (125 GeV)? Quantum corrections should push the Higgs mass up to the Planck scale — unless something cancels them out. This "fine-tuning" problem motivates supersymmetry and other BSM theories.
              </p>
            </div>

            {/* Theories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                {
                  name: 'Supersymmetry (SUSY)',
                  desc: 'Every fermion has a boson partner and vice versa. Naturally solves hierarchy problem, provides dark matter candidate, enables gauge coupling unification. No evidence at LHC so far.',
                  status: 'Under pressure'
                },
                {
                  name: 'Randall-Sundrum Models',
                  desc: 'Extra spatial dimensions where gravity propagates. Our 3D world is a "brane" in a higher-dimensional bulk. Could explain why gravity is weak — it\'s diluted across dimensions.',
                  status: 'Viable'
                },
                {
                  name: 'Preon Theory',
                  desc: 'Quarks and leptons are themselves composite — made of smaller "preons". Would explain the three generations and mass hierarchy. Ruled out at scales below ~10 TeV by precision measurements.',
                  status: 'Constrained'
                },
                {
                  name: 'Technicolor',
                  desc: 'The Higgs is composite, bound by a new strong force. Elegantly explains electroweak symmetry breaking. Largely ruled out by LHC Higgs measurements showing SM-like couplings.',
                  status: 'Mostly ruled out'
                },
                {
                  name: 'Vanishing Dimensions',
                  desc: 'At high energies, spatial dimensions "disappear" — the universe becomes lower-dimensional. Could explain quantum gravity and provide observable signatures at accessible energies.',
                  status: 'Speculative'
                },
                {
                  name: 'Grand Unified Theories',
                  desc: 'Strong, weak, and electromagnetic forces unify at ~10¹⁶ GeV. Predicts proton decay (not yet observed). Supersymmetric GUTs fit data better than non-SUSY versions.',
                  status: 'Theoretically motivated'
                },
              ].map((t, i) => (
                <div key={i} className="bg-black/30 rounded-lg p-3 border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm text-white font-medium">{t.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/40 flex-shrink-0">{t.status}</span>
                  </div>
                  <p className="text-xs text-white/50">{t.desc}</p>
                </div>
              ))}
            </div>

            {/* String Theory note */}
            <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-sm font-medium text-purple-400 mb-2">String Theory & M-Theory</h3>
              <p className="text-xs text-white/50">
                The most ambitious attempt to unify all forces including gravity. Replaces point particles with vibrating strings in 10 or 11 dimensions. Mathematically elegant but makes no testable predictions at accessible energies. Remains the leading candidate for a "theory of everything" despite decades without experimental verification.
              </p>
            </div>
          </div>
        </div>

        {/* Context Frame */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <h2 className="text-xl font-light text-white uppercase mb-3">The Framework</h2>
          <p className="text-sm text-white/60 mb-4 max-w-2xl">
            The Standard Model is a quantum field theory developed between 1961–1979. It describes the electromagnetic, weak, and strong nuclear forces, and classifies all known elementary particles. It has survived every experimental test — yet we know it's incomplete.
          </p>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
            {[
              { value: '17', label: 'Particles' },
              { value: '4', label: 'Forces' },
              { value: '3', label: 'Generations' },
              { value: '19', label: 'Free parameters' },
              { value: '~5%', label: 'Of universe explained' },
              { value: '0', label: 'Gravitons found' },
            ].map((stat, i) => (
              <div key={i} className="bg-black/30 rounded-lg p-2">
                <div className="text-lg md:text-xl font-mono text-white">{stat.value}</div>
                <div className="text-[10px] text-white/40">{stat.label}</div>
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
            <Link href="/observe/detectors" className="text-sm text-white/60 hover:text-white transition-colors">
              Particle Detectors →
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">References</div>
            <div className="text-xs text-white/40">
              Particle Data Group (PDG) Review 2024 · CODATA 2022 · CERN Document Server · Nobel Prize Archive
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
