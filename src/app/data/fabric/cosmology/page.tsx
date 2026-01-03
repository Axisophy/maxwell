'use client';

import { useState } from 'react';
import Link from 'next/link';

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

// Timeline epochs - logarithmic scale
const EPOCHS = [
  {
    id: 'planck',
    name: 'Planck Epoch',
    time: '0 to 10⁻⁴³ seconds',
    timeValue: -43,
    description: 'All four forces unified. Quantum gravity dominates. Our physics breaks down completely.',
    temperature: '10³² K',
    size: '< 10⁻³⁵ m',
    keyEvents: ['Universe smaller than Planck length', 'No space or time as we know it'],
    evidence: 'None directly — requires theory of quantum gravity',
    color: 'violet',
  },
  {
    id: 'gut',
    name: 'Grand Unification Epoch',
    time: '10⁻⁴³ to 10⁻³⁶ seconds',
    timeValue: -36,
    description: 'Gravity separates. Strong, weak, and electromagnetic forces remain unified.',
    temperature: '10²⁹ K',
    size: '~10⁻²⁸ m',
    keyEvents: ['Gravity becomes distinct force', 'GUT symmetry still holds'],
    evidence: 'Predicted by Grand Unified Theories — proton decay not yet observed',
    color: 'violet',
  },
  {
    id: 'inflation',
    name: 'Inflationary Epoch',
    time: '10⁻³⁶ to 10⁻³² seconds',
    timeValue: -32,
    description: 'Universe expands exponentially — by a factor of 10²⁶ or more. Explains flatness and horizon problems.',
    temperature: '10²⁸ → 10²² K',
    size: 'Grapefruit → Observable universe',
    keyEvents: ['Strong force separates', 'Exponential expansion', 'Quantum fluctuations stretched to cosmic scales'],
    evidence: 'CMB temperature uniformity, flatness of space, primordial gravitational waves (B-modes)',
    color: 'blue',
  },
  {
    id: 'electroweak',
    name: 'Electroweak Epoch',
    time: '10⁻³² to 10⁻¹² seconds',
    timeValue: -12,
    description: 'Electromagnetic and weak forces still unified. Universe is quark-gluon plasma.',
    temperature: '10²² → 10¹⁵ K',
    size: 'Solar system scale',
    keyEvents: ['Quarks and gluons form plasma', 'Higgs field activates (end of epoch)'],
    evidence: 'Recreated briefly at LHC and RHIC',
    color: 'cyan',
  },
  {
    id: 'quark',
    name: 'Quark Epoch',
    time: '10⁻¹² to 10⁻⁶ seconds',
    timeValue: -6,
    description: 'All four forces now distinct. Too hot for quarks to bind into hadrons.',
    temperature: '10¹⁵ → 10¹² K',
    size: 'Light years across',
    keyEvents: ['Electroweak symmetry breaks', 'W and Z bosons gain mass', 'Matter-antimatter asymmetry established'],
    evidence: 'LHC recreates conditions, CP violation measured',
    color: 'cyan',
  },
  {
    id: 'hadron',
    name: 'Hadron Epoch',
    time: '10⁻⁶ to 1 second',
    timeValue: 0,
    description: 'Quarks bind into protons and neutrons. Most antimatter annihilates with matter.',
    temperature: '10¹² → 10¹⁰ K',
    size: '~100 light years',
    keyEvents: ['Protons and neutrons form', 'Antimatter annihilation (1 in 10⁹ particles survive)'],
    evidence: 'Baryon density from CMB, nucleosynthesis yields',
    color: 'green',
  },
  {
    id: 'lepton',
    name: 'Lepton Epoch',
    time: '1 to 10 seconds',
    timeValue: 1,
    description: 'Leptons (electrons, neutrinos) dominate. Neutrinos decouple and stream freely.',
    temperature: '10¹⁰ → 10⁹ K',
    size: '~1000 light years',
    keyEvents: ['Neutrinos decouple (cosmic neutrino background)', 'Electron-positron annihilation'],
    evidence: 'Cosmic neutrino background (not yet directly detected)',
    color: 'green',
  },
  {
    id: 'nucleosynthesis',
    name: 'Big Bang Nucleosynthesis',
    time: '10 seconds to 20 minutes',
    timeValue: 3,
    description: 'Protons and neutrons fuse into light nuclei: hydrogen, helium, lithium.',
    temperature: '10⁹ → 10⁷ K',
    size: '~300 light years',
    keyEvents: ['~75% hydrogen, ~25% helium formed', 'Trace lithium and beryllium', 'Heavier elements must wait for stars'],
    evidence: 'Primordial element abundances match predictions precisely',
    color: 'yellow',
  },
  {
    id: 'photon',
    name: 'Photon Epoch',
    time: '20 minutes to 380,000 years',
    timeValue: 13,
    description: 'Universe is opaque plasma. Photons scatter constantly off free electrons.',
    temperature: '10⁷ → 3,000 K',
    size: '~42 million light years',
    keyEvents: ['Matter-radiation equality (~47,000 years)', 'Universe becomes matter-dominated'],
    evidence: 'CMB spectrum is perfect blackbody',
    color: 'orange',
  },
  {
    id: 'recombination',
    name: 'Recombination',
    time: '~380,000 years',
    timeValue: 13.2,
    description: 'Electrons bind to nuclei, forming neutral atoms. Universe becomes transparent.',
    temperature: '~3,000 K',
    size: '~42 million light years',
    keyEvents: ['First atoms form', 'Photons decouple — this IS the CMB', 'Universe transparent for first time'],
    evidence: 'Cosmic Microwave Background (CMB) — most precise cosmological measurement',
    color: 'orange',
  },
  {
    id: 'dark-ages',
    name: 'Dark Ages',
    time: '380,000 to ~150 million years',
    timeValue: 15.7,
    description: 'No stars yet. Universe filled with neutral hydrogen, slowly cooling.',
    temperature: '3,000 → 60 K',
    size: '~300 million light years',
    keyEvents: ['Matter clumps under gravity', 'Dark matter halos form', 'First structures begin'],
    evidence: '21cm hydrogen signal (being searched for by radio telescopes)',
    color: 'gray',
  },
  {
    id: 'first-stars',
    name: 'Cosmic Dawn',
    time: '~150 to 1 billion years',
    timeValue: 17,
    description: 'First stars ignite (Population III). Massive, hot, short-lived. First heavy elements.',
    temperature: 'Varies (stars are hot)',
    size: 'Billions of light years',
    keyEvents: ['First stars (Pop III) form', 'First supernovae — heavy elements created', 'Reionisation begins'],
    evidence: 'JWST seeing earliest galaxies, quasar absorption spectra',
    color: 'amber',
  },
  {
    id: 'reionisation',
    name: 'Reionisation',
    time: '~150 million to 1 billion years',
    timeValue: 17.5,
    description: 'UV light from first stars and quasars ionises the neutral hydrogen.',
    temperature: '~10,000 K (ionised regions)',
    size: 'Tens of billions of light years',
    keyEvents: ['Universe becomes ionised again', 'Intergalactic medium transparent to UV', 'Epoch ends ~1 Gyr'],
    evidence: 'Gunn-Peterson trough in quasar spectra, CMB polarisation',
    color: 'amber',
  },
  {
    id: 'galaxies',
    name: 'Galaxy Formation',
    time: '1 to 6 billion years',
    timeValue: 17.8,
    description: 'Galaxies assemble through mergers. Quasars peak. Star formation rate peaks.',
    temperature: 'CMB: ~6 K',
    size: '~30 billion light years',
    keyEvents: ['Milky Way begins forming (~12 Gyr ago)', 'Peak of cosmic star formation (~10 Gyr ago)', 'Galaxy clusters form'],
    evidence: 'Deep field images (Hubble, JWST), galaxy surveys',
    color: 'red',
  },
  {
    id: 'solar-system',
    name: 'Solar System Forms',
    time: '~9.2 billion years',
    timeValue: 17.9,
    description: 'Our Sun and planets form from a molecular cloud enriched by supernova debris.',
    temperature: 'CMB: ~4 K',
    size: '~61 billion light years',
    keyEvents: ['Sun ignites (~4.6 Gyr ago)', 'Planets accrete from disk', 'Late Heavy Bombardment'],
    evidence: 'Radiometric dating of meteorites and Moon rocks',
    color: 'red',
  },
  {
    id: 'present',
    name: 'Present Day',
    time: '13.8 billion years',
    timeValue: 17.94,
    description: 'Dark energy dominates. Universe accelerating. You are here.',
    temperature: 'CMB: 2.725 K',
    size: '~93 billion light years (observable)',
    keyEvents: ['Dark energy domination began ~5 Gyr ago', 'Accelerating expansion', 'Life, intelligence, you reading this'],
    evidence: 'Type Ia supernovae, CMB, baryon acoustic oscillations',
    color: 'pink',
  },
];

// Cosmic Calendar data - mapping 13.8 billion years to one calendar year
const COSMIC_CALENDAR = [
  { month: 'Jan 1', event: 'Big Bang', realTime: '13.8 billion years ago' },
  { month: 'Jan 22', event: 'First galaxies form', realTime: '12.85 billion years ago' },
  { month: 'Mar 16', event: 'Milky Way forms', realTime: '11 billion years ago' },
  { month: 'Sep 2', event: 'Solar System forms', realTime: '4.57 billion years ago' },
  { month: 'Sep 21', event: 'Life on Earth', realTime: '3.8 billion years ago' },
  { month: 'Nov 9', event: 'Complex cells (eukaryotes)', realTime: '2 billion years ago' },
  { month: 'Dec 5', event: 'Multicellular life', realTime: '800 million years ago' },
  { month: 'Dec 17', event: 'Cambrian explosion', realTime: '540 million years ago' },
  { month: 'Dec 26', event: 'First mammals', realTime: '200 million years ago' },
  { month: 'Dec 30', event: 'Dinosaur extinction', realTime: '66 million years ago' },
  { month: 'Dec 31, 6am', event: 'First apes', realTime: '15 million years ago' },
  { month: 'Dec 31, 10:30pm', event: 'First humans', realTime: '2.5 million years ago' },
  { month: 'Dec 31, 11:59:46', event: 'Agriculture begins', realTime: '10,000 years ago' },
  { month: 'Dec 31, 11:59:59', event: 'Modern science', realTime: '500 years ago' },
];

const COLOR_MAP: Record<string, string> = {
  violet: 'border-violet-500/30 bg-violet-500/10',
  blue: 'border-blue-500/30 bg-blue-500/10',
  cyan: 'border-cyan-500/30 bg-cyan-500/10',
  green: 'border-green-500/30 bg-green-500/10',
  yellow: 'border-yellow-500/30 bg-yellow-500/10',
  orange: 'border-orange-500/30 bg-orange-500/10',
  gray: 'border-white/20 bg-white/5',
  amber: 'border-amber-500/30 bg-amber-500/10',
  red: 'border-red-500/30 bg-red-500/10',
  pink: 'border-pink-500/30 bg-pink-500/10',
};

const DOT_COLORS: Record<string, string> = {
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  cyan: 'bg-cyan-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  gray: 'bg-white/40',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  pink: 'bg-pink-500',
};

// Cosmic Calendar Component
function CosmicCalendar() {
  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl font-light text-white uppercase">The Cosmic Calendar</h2>
        <p className="text-sm text-white/50 mt-1">13.8 billion years compressed into one year — inspired by Carl Sagan</p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {COSMIC_CALENDAR.map((event, i) => (
            <div
              key={i}
              className={`
                bg-black/30 rounded-lg p-3 border border-white/5
                ${i >= COSMIC_CALENDAR.length - 4 ? 'border-amber-500/20' : ''}
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-white font-medium">{event.event}</div>
                  <div className="text-xs text-white/40 mt-0.5">{event.realTime}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-white/60">{event.month}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-black/30 rounded-lg border border-amber-500/20">
          <p className="text-xs text-amber-400/80">
            On this scale, all of recorded human history occurs in the final 14 seconds of December 31st.
            Your entire life is a fraction of a second.
          </p>
        </div>
      </div>
    </div>
  );
}

// Timeline Component
function Timeline({ selectedEpoch, onSelect }: { selectedEpoch: string; onSelect: (id: string) => void }) {
  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl font-light text-white uppercase">Cosmic Timeline</h2>
        <p className="text-sm text-white/50 mt-1">From t = 0 to present — logarithmic scale</p>
      </div>

      <div className="p-4 space-y-1">
        {EPOCHS.map((epoch) => (
          <button
            key={epoch.id}
            onClick={() => onSelect(epoch.id)}
            className={`
              w-full text-left p-3 rounded-lg transition-all border
              ${selectedEpoch === epoch.id
                ? `${COLOR_MAP[epoch.color]} ring-1 ring-white/20`
                : 'bg-black/20 border-white/5 hover:bg-black/30'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${DOT_COLORS[epoch.color]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm text-white font-medium">{epoch.name}</div>
                  <div className="text-[10px] text-white/40 font-mono flex-shrink-0">{epoch.time}</div>
                </div>
                <p className="text-xs text-white/50 mt-1 line-clamp-2">{epoch.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Epoch Detail Component
function EpochDetail({ epoch }: { epoch: typeof EPOCHS[0] }) {
  return (
    <div className={`rounded-lg p-4 border ${COLOR_MAP[epoch.color]}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-light text-white">{epoch.name}</h3>
          <div className="text-sm font-mono text-white/60 mt-1">{epoch.time}</div>
        </div>
        <div className={`w-4 h-4 rounded-full ${DOT_COLORS[epoch.color]}`} />
      </div>

      <p className="text-sm text-white/70 mb-4">{epoch.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/30 rounded-lg p-3">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Temperature</div>
          <div className="text-sm font-mono text-white">{epoch.temperature}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-3">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Size of Universe</div>
          <div className="text-sm font-mono text-white">{epoch.size}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Key Events</div>
        <ul className="space-y-1">
          {epoch.keyEvents.map((event, i) => (
            <li key={i} className="text-sm text-white/60 flex items-start gap-2">
              <span className="text-white/30">•</span>
              {event}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-black/30 rounded-lg p-3">
        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Evidence</div>
        <p className="text-xs text-white/60">{epoch.evidence}</p>
      </div>
    </div>
  );
}

// Key Concepts Section
function KeyConceptsSection() {
  const concepts = [
    {
      name: 'Inflation',
      desc: 'Exponential expansion in the first 10⁻³² seconds. Explains why the universe is flat, homogeneous, and why regions that couldn\'t have been in contact have the same temperature.',
    },
    {
      name: 'Recombination',
      desc: 'When electrons bound to nuclei, releasing the photons we see as the CMB. Despite the name, this was the FIRST time atoms formed.',
    },
    {
      name: 'Dark Matter',
      desc: '~27% of the universe. Doesn\'t interact with light but clumps gravitationally. Essential for galaxy formation. We don\'t know what it is.',
    },
    {
      name: 'Dark Energy',
      desc: '~68% of the universe. Causes accelerating expansion. Could be vacuum energy, a new field, or a sign our theory of gravity is wrong.',
    },
    {
      name: 'Baryon Asymmetry',
      desc: 'Why is there matter instead of nothing? The Big Bang should have made equal matter and antimatter. Something caused a 1-in-10⁹ imbalance.',
    },
    {
      name: 'Cosmic Microwave Background',
      desc: 'The oldest light in the universe — photons from 380,000 years after the Big Bang. Now stretched to microwave wavelengths by expansion.',
    },
  ];

  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl font-light text-white uppercase">Key Concepts</h2>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        {concepts.map((concept, i) => (
          <div key={i} className="bg-black/30 rounded-lg p-4">
            <div className="text-sm text-white font-medium mb-2">{concept.name}</div>
            <p className="text-xs text-white/50">{concept.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Evidence Section
function EvidenceSection() {
  const evidence = [
    {
      name: 'Cosmic Microwave Background',
      year: '1965',
      discoverers: 'Penzias & Wilson',
      what: 'Uniform 2.725 K radiation from all directions — the afterglow of the Big Bang.',
      precision: 'Temperature variations of 1 part in 100,000 match inflation predictions.',
    },
    {
      name: 'Hubble Expansion',
      year: '1929',
      discoverers: 'Edwin Hubble',
      what: 'Galaxies are receding — the further away, the faster. Space itself is expanding.',
      precision: 'Modern value: H₀ ≈ 70 km/s/Mpc (with ~5% tension between methods).',
    },
    {
      name: 'Primordial Nucleosynthesis',
      year: '1948–1960s',
      discoverers: 'Alpher, Bethe, Gamow',
      what: 'Predicted abundances of H, He, Li from first 20 minutes match observations.',
      precision: '~75% hydrogen, ~25% helium — exactly as predicted.',
    },
    {
      name: 'Accelerating Expansion',
      year: '1998',
      discoverers: 'Perlmutter, Schmidt, Riess',
      what: 'Type Ia supernovae show universe expansion is accelerating, implying dark energy.',
      precision: 'Dark energy ~68% of universe. Nobel Prize 2011.',
    },
    {
      name: 'Baryon Acoustic Oscillations',
      year: '2005',
      discoverers: 'SDSS, 2dF surveys',
      what: 'Sound waves frozen into matter distribution at recombination. A "standard ruler".',
      precision: 'Confirms expansion history, dark energy fraction.',
    },
    {
      name: 'Large Scale Structure',
      year: '1980s–present',
      discoverers: 'Galaxy surveys',
      what: 'Galaxies arranged in filaments and walls around voids — matches simulations with dark matter.',
      precision: 'Requires ~5× more dark matter than ordinary matter.',
    },
  ];

  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl font-light text-white uppercase">The Evidence</h2>
        <p className="text-sm text-white/50 mt-1">How we know what we know</p>
      </div>

      <div className="p-4 space-y-2">
        {evidence.map((e, i) => (
          <div key={i} className="bg-black/30 rounded-lg p-4 border border-white/5">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm text-white font-medium">{e.name}</div>
              <div className="text-xs text-white/40 font-mono">{e.year}</div>
            </div>
            <div className="text-xs text-white/30 mb-2">{e.discoverers}</div>
            <p className="text-xs text-white/60 mb-2">{e.what}</p>
            <p className="text-[10px] text-white/40">{e.precision}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composition Section
function CompositionSection() {
  const composition = [
    { label: 'Dark Energy', percent: 68.3, color: 'bg-purple-500' },
    { label: 'Dark Matter', percent: 26.8, color: 'bg-blue-500' },
    { label: 'Ordinary Matter', percent: 4.9, color: 'bg-amber-500' },
  ];

  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl font-light text-white uppercase">What the Universe Is Made Of</h2>
      </div>

      <div className="p-4">
        {/* Bar chart */}
        <div className="flex h-8 rounded-lg overflow-hidden mb-4">
          {composition.map((c, i) => (
            <div
              key={i}
              className={`${c.color} flex items-center justify-center`}
              style={{ width: `${c.percent}%` }}
            >
              {c.percent > 10 && (
                <span className="text-xs font-medium text-white/80">{c.percent}%</span>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2">
          {composition.map((c, i) => (
            <div key={i} className="bg-black/30 rounded-lg p-3 text-center">
              <div className={`w-3 h-3 rounded ${c.color} mx-auto mb-2`} />
              <div className="text-lg font-mono text-white">{c.percent}%</div>
              <div className="text-[10px] text-white/40">{c.label}</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/40 mt-4 text-center">
          Everything you&apos;ve ever seen, touched, or measured is less than 5% of the universe.
        </p>
      </div>
    </div>
  );
}

// Future Section
function FutureSection() {
  const futures = [
    { time: '5 billion years', event: 'Sun becomes red giant, engulfs Earth' },
    { time: '100 billion years', event: 'All galaxies beyond Local Group recede past cosmic horizon' },
    { time: '1 trillion years', event: 'Star formation ends — gas exhausted' },
    { time: '100 trillion years', event: 'Last stars die' },
    { time: '10⁴⁰ years', event: 'Protons may decay (if they do)' },
    { time: '10¹⁰⁰ years', event: 'Black holes evaporate via Hawking radiation' },
    { time: '10¹⁰⁰⁰ years+', event: 'Heat death — maximum entropy, no usable energy' },
  ];

  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl font-light text-white uppercase">The Future</h2>
        <p className="text-sm text-white/50 mt-1">What comes next — according to current physics</p>
      </div>

      <div className="p-4 space-y-1">
        {futures.map((f, i) => (
          <div key={i} className="flex items-center gap-4 p-2 bg-black/20 rounded-lg">
            <div className="text-xs font-mono text-white/40 w-32 flex-shrink-0">{f.time}</div>
            <div className="text-sm text-white/60">{f.event}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BigBangPage() {
  const [selectedEpoch, setSelectedEpoch] = useState('inflation');
  const epoch = EPOCHS.find(e => e.id === selectedEpoch) || EPOCHS[0];

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
                { label: 'Big Bang & Cosmology' },
              ]}
            />
          </div>
        </div>

        {/* Header Frame */}
        <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4 mb-px">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white uppercase">
            Big Bang & Cosmology
          </h1>
          <p className="text-sm md:text-base text-white/60 mt-2 max-w-2xl">
            The history of the universe from t = 0 to present day — 13.8 billion years of cosmic evolution.
          </p>
        </div>

        {/* Vital Signs */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl md:text-3xl font-mono text-white">13.8</div>
              <div className="text-[10px] text-white/40">Billion years old</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl md:text-3xl font-mono text-white">93</div>
              <div className="text-[10px] text-white/40">Billion ly diameter</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl md:text-3xl font-mono text-white">2.725</div>
              <div className="text-[10px] text-white/40">K (CMB temp)</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl md:text-3xl font-mono text-white">2×10¹²</div>
              <div className="text-[10px] text-white/40">Galaxies</div>
            </div>
          </div>
        </div>

        {/* Timeline and Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px mb-px">
          <Timeline selectedEpoch={selectedEpoch} onSelect={setSelectedEpoch} />
          <div className="bg-[#1d1d1d] rounded-lg p-4">
            <EpochDetail epoch={epoch} />
          </div>
        </div>

        {/* Cosmic Calendar */}
        <div className="mb-px">
          <CosmicCalendar />
        </div>

        {/* Composition */}
        <div className="mb-px">
          <CompositionSection />
        </div>

        {/* Key Concepts */}
        <div className="mb-px">
          <KeyConceptsSection />
        </div>

        {/* Evidence */}
        <div className="mb-px">
          <EvidenceSection />
        </div>

        {/* Future */}
        <div className="mb-px">
          <FutureSection />
        </div>

        {/* Cross-References Frame */}
        <div className="bg-[#1d1d1d] rounded-lg p-4">
          <div className="text-sm text-white/40 uppercase tracking-wider mb-3">Related</div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Link href="/data/fabric/scale" className="text-sm text-white/60 hover:text-white transition-colors">
              Scale of the Universe →
            </Link>
            <Link href="/data/fabric/particles" className="text-sm text-white/60 hover:text-white transition-colors">
              Standard Model →
            </Link>
            <Link href="/data/fabric/forces" className="text-sm text-white/60 hover:text-white transition-colors">
              Fundamental Forces →
            </Link>
            <Link href="/observe/space" className="text-sm text-white/60 hover:text-white transition-colors">
              Space Observatory →
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">References</div>
            <div className="text-xs text-white/40">
              Planck 2018 Results · WMAP · SDSS · Particle Data Group · Weinberg, &quot;The First Three Minutes&quot;
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
