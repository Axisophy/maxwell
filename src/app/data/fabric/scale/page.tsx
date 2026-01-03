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

// Scale data - from Planck length to observable universe
const SCALES = [
  // Quantum realm
  {
    power: -35,
    name: 'Planck Length',
    size: '1.6 × 10⁻³⁵ m',
    objects: ['Planck length'],
    description: 'The smallest meaningful length in physics. Below this scale, our understanding of space and time breaks down.',
    category: 'quantum',
    color: 'violet'
  },
  {
    power: -18,
    name: 'Attometre',
    size: '10⁻¹⁸ m',
    objects: ['Quark diameter (upper limit)'],
    description: 'Quarks appear point-like even at this scale. If they have structure, it\'s smaller than this.',
    category: 'quantum',
    color: 'violet'
  },
  {
    power: -15,
    name: 'Femtometre',
    size: '10⁻¹⁵ m',
    objects: ['Proton (~0.87 fm)', 'Atomic nucleus'],
    description: 'The scale of nuclear physics. Protons and neutrons are bound here by the strong force.',
    category: 'quantum',
    color: 'violet'
  },
  {
    power: -12,
    name: 'Picometre',
    size: '10⁻¹² m',
    objects: ['Electron cloud inner edge', 'Gamma ray wavelength'],
    description: 'Between the nucleus and electron shells. Mostly empty space.',
    category: 'atomic',
    color: 'blue'
  },
  {
    power: -10,
    name: 'Ångström',
    size: '10⁻¹⁰ m',
    objects: ['Hydrogen atom (~1.2 Å)', 'Chemical bonds', 'X-ray wavelength'],
    description: 'The scale of atoms and chemistry. Most atoms are 1-3 Ångströms across.',
    category: 'atomic',
    color: 'blue'
  },
  {
    power: -9,
    name: 'Nanometre',
    size: '10⁻⁹ m',
    objects: ['DNA helix width (2 nm)', 'Proteins', 'Transistor gates'],
    description: 'Molecular machinery. DNA, proteins, and modern transistors operate here.',
    category: 'molecular',
    color: 'cyan'
  },
  {
    power: -7,
    name: '100 Nanometres',
    size: '10⁻⁷ m',
    objects: ['Viruses (20-300 nm)', 'Visible light wavelength'],
    description: 'The size of viruses and the wavelength of light. Below visible resolution.',
    category: 'molecular',
    color: 'cyan'
  },
  {
    power: -6,
    name: 'Micrometre',
    size: '10⁻⁶ m',
    objects: ['Bacteria (1-10 μm)', 'Red blood cell (7 μm)', 'Fog droplets'],
    description: 'Cellular life. Bacteria and blood cells live at this scale.',
    category: 'cellular',
    color: 'green'
  },
  {
    power: -4,
    name: '100 Micrometres',
    size: '10⁻⁴ m',
    objects: ['Human hair width (~100 μm)', 'Dust mites', 'Human egg cell'],
    description: 'The threshold of naked-eye visibility. A human hair is about this thick.',
    category: 'cellular',
    color: 'green'
  },
  {
    power: -3,
    name: 'Millimetre',
    size: '10⁻³ m',
    objects: ['Grain of sand', 'Flea', 'Smallest visible objects'],
    description: 'Easily visible. The smallest divisions on a ruler.',
    category: 'human',
    color: 'yellow'
  },
  {
    power: -2,
    name: 'Centimetre',
    size: '10⁻² m',
    objects: ['Fingernail width', 'Insects', 'Coins'],
    description: 'Everyday small objects. Insects and coins.',
    category: 'human',
    color: 'yellow'
  },
  {
    power: 0,
    name: 'Metre',
    size: '1 m',
    objects: ['Humans (~1.7 m)', 'Doors', 'Large dogs'],
    description: 'Human scale. The reference point for our intuition.',
    category: 'human',
    color: 'yellow'
  },
  {
    power: 2,
    name: '100 Metres',
    size: '10² m',
    objects: ['Football pitch', 'City block', 'Blue whale (30 m)'],
    description: 'Building scale. The largest animals and typical buildings.',
    category: 'human',
    color: 'yellow'
  },
  {
    power: 4,
    name: '10 Kilometres',
    size: '10⁴ m',
    objects: ['Mount Everest (8.8 km)', 'Manhattan length', 'Mariana Trench depth (11 km)'],
    description: 'Geographic features. Mountains, cities, ocean depths.',
    category: 'planetary',
    color: 'orange'
  },
  {
    power: 6,
    name: '1000 Kilometres',
    size: '10⁶ m',
    objects: ['Great Britain length (~1000 km)', 'Moon diameter (3,474 km)'],
    description: 'Continental and lunar scale.',
    category: 'planetary',
    color: 'orange'
  },
  {
    power: 7,
    name: '10,000 Kilometres',
    size: '10⁷ m',
    objects: ['Earth diameter (12,742 km)', 'Geosynchronous orbit'],
    description: 'Planetary scale. Earth fits here.',
    category: 'planetary',
    color: 'orange'
  },
  {
    power: 8,
    name: '100,000 Kilometres',
    size: '10⁸ m',
    objects: ['Earth-Moon distance (384,400 km)', 'Jupiter diameter (139,820 km)'],
    description: 'The Earth-Moon system. Light takes 1.3 seconds.',
    category: 'planetary',
    color: 'orange'
  },
  {
    power: 11,
    name: 'Astronomical Unit',
    size: '1.5 × 10¹¹ m',
    objects: ['Earth-Sun distance (1 AU)', 'Sun diameter (1.4 million km)'],
    description: 'The Earth-Sun distance. Light takes 8 minutes.',
    category: 'stellar',
    color: 'red'
  },
  {
    power: 13,
    name: '100 AU',
    size: '10¹³ m',
    objects: ['Heliosphere edge', 'Voyager 1 distance (~160 AU)'],
    description: 'The outer solar system. Voyager has been travelling for 47 years.',
    category: 'stellar',
    color: 'red'
  },
  {
    power: 16,
    name: 'Light Year',
    size: '9.5 × 10¹⁵ m',
    objects: ['Oort Cloud (~1 ly)', 'Proxima Centauri (4.2 ly)'],
    description: 'The distance light travels in a year. Nearest star is 4.2 light years.',
    category: 'stellar',
    color: 'red'
  },
  {
    power: 18,
    name: '100 Light Years',
    size: '10¹⁸ m',
    objects: ['Local stellar neighbourhood', '~500 star systems'],
    description: 'Our stellar neighbourhood. All stars visible to the naked eye.',
    category: 'galactic',
    color: 'purple'
  },
  {
    power: 21,
    name: '100,000 Light Years',
    size: '10²¹ m',
    objects: ['Milky Way diameter (~100,000 ly)', '200-400 billion stars'],
    description: 'Galactic scale. Our entire galaxy.',
    category: 'galactic',
    color: 'purple'
  },
  {
    power: 22,
    name: '1 Million Light Years',
    size: '10²² m',
    objects: ['Andromeda distance (2.5 Mly)', 'Local Group diameter'],
    description: 'The Local Group. ~80 galaxies gravitationally bound.',
    category: 'cosmic',
    color: 'pink'
  },
  {
    power: 24,
    name: '100 Million Light Years',
    size: '10²⁴ m',
    objects: ['Virgo Supercluster', 'Galaxy filaments begin'],
    description: 'Supercluster scale. Galaxies form filaments and walls.',
    category: 'cosmic',
    color: 'pink'
  },
  {
    power: 26,
    name: '10 Billion Light Years',
    size: '10²⁶ m',
    objects: ['Observable universe radius (~46 Gly)', '2 trillion galaxies'],
    description: 'The entire observable universe. Everything we can ever see.',
    category: 'cosmic',
    color: 'pink'
  },
];

const CATEGORIES = {
  quantum: { label: 'Quantum', color: 'bg-violet-500' },
  atomic: { label: 'Atomic', color: 'bg-blue-500' },
  molecular: { label: 'Molecular', color: 'bg-cyan-500' },
  cellular: { label: 'Cellular', color: 'bg-green-500' },
  human: { label: 'Human', color: 'bg-yellow-500' },
  planetary: { label: 'Planetary', color: 'bg-orange-500' },
  stellar: { label: 'Stellar', color: 'bg-red-500' },
  galactic: { label: 'Galactic', color: 'bg-purple-500' },
  cosmic: { label: 'Cosmic', color: 'bg-pink-500' },
};

const COLOR_MAP: Record<string, string> = {
  violet: 'border-violet-500/30 bg-violet-500/5',
  blue: 'border-blue-500/30 bg-blue-500/5',
  cyan: 'border-cyan-500/30 bg-cyan-500/5',
  green: 'border-green-500/30 bg-green-500/5',
  yellow: 'border-yellow-500/30 bg-yellow-500/5',
  orange: 'border-orange-500/30 bg-orange-500/5',
  red: 'border-red-500/30 bg-red-500/5',
  purple: 'border-purple-500/30 bg-purple-500/5',
  pink: 'border-pink-500/30 bg-pink-500/5',
};

// Interactive Scale Ruler Component
function ScaleRuler({
  selectedIndex,
  onSelect
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const minPower = SCALES[0].power;
  const maxPower = SCALES[SCALES.length - 1].power;
  const range = maxPower - minPower;

  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-light text-white">Scale Ruler</h2>
        <p className="text-xs text-white/50 mt-1">Click to explore — each step is 10× larger or smaller</p>
      </div>

      <div className="p-4">
        {/* The ruler */}
        <div className="relative h-16 bg-black rounded-lg overflow-hidden">
          {/* Track */}
          <div className="absolute inset-x-4 top-1/2 h-1 bg-white/20 rounded-full -translate-y-1/2" />

          {/* Scale markers */}
          {SCALES.map((scale, i) => {
            const position = ((scale.power - minPower) / range) * 100;
            const isSelected = i === selectedIndex;

            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className={`
                  absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all
                  ${isSelected ? 'z-10' : 'z-0'}
                `}
                style={{ left: `calc(${position}% * 0.92 + 4%)` }}
              >
                <div
                  className={`
                    w-3 h-3 rounded-full transition-all
                    ${isSelected
                      ? 'bg-[#ffdf20] scale-150 ring-4 ring-[#ffdf20]/30'
                      : 'bg-white/40 hover:bg-white/60'
                    }
                  `}
                />
              </button>
            );
          })}
        </div>

        {/* Power labels */}
        <div className="flex justify-between mt-2 text-[10px] text-white/30 font-mono">
          <span>10⁻³⁵ m</span>
          <span>10⁻¹⁵ m</span>
          <span>1 m</span>
          <span>10¹⁵ m</span>
          <span>10²⁶ m</span>
        </div>

        {/* Category legend */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <div key={key} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded ${cat.color}`} />
              <span className="text-[10px] text-white/40">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Scale Detail Card
function ScaleDetail({ scale }: { scale: typeof SCALES[0] }) {
  return (
    <div className={`bg-black/30 rounded-lg p-4 border ${COLOR_MAP[scale.color]}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-light text-white">{scale.name}</h3>
          <div className="text-2xl font-mono text-white/80 mt-1">{scale.size}</div>
        </div>
        <div className="text-right">
          <span className="text-xs text-white/40">10</span>
          <sup className="text-xs text-white/60">{scale.power}</sup>
          <span className="text-xs text-white/40"> metres</span>
        </div>
      </div>

      <p className="text-sm text-white/60 mb-4">{scale.description}</p>

      <div className="space-y-1">
        <div className="text-[10px] text-white/40 uppercase tracking-wider">Objects at this scale</div>
        <div className="flex flex-wrap gap-2">
          {scale.objects.map((obj, i) => (
            <span key={i} className="text-sm text-white/80 bg-white/10 px-2 py-1 rounded">
              {obj}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Ladder View - all scales as cards
function LadderView({ selectedIndex, onSelect }: { selectedIndex: number; onSelect: (i: number) => void }) {
  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl font-light text-white uppercase">The Ladder</h2>
        <p className="text-sm text-white/50 mt-1">From Planck length to the observable universe — 61 orders of magnitude</p>
      </div>

      <div className="p-4 space-y-2">
        {SCALES.map((scale, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`
              w-full text-left p-3 rounded-lg transition-all border
              ${i === selectedIndex
                ? `${COLOR_MAP[scale.color]} ring-1 ring-white/20`
                : 'bg-black/20 border-white/5 hover:bg-black/30'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 text-right">
                  <span className="text-xs text-white/40">10</span>
                  <sup className="text-xs text-white/60">{scale.power}</sup>
                </div>
                <div>
                  <div className="text-sm text-white font-medium">{scale.name}</div>
                  <div className="text-xs text-white/40">{scale.objects[0]}</div>
                </div>
              </div>
              <div className="text-xs text-white/30 font-mono">{scale.size}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Comparisons section
function ComparisonsSection() {
  const comparisons = [
    {
      title: 'If an atom were a stadium...',
      desc: 'The nucleus would be a pea on the centre spot. The electrons would be gnats in the upper stands.',
    },
    {
      title: 'If the Sun were a basketball...',
      desc: 'Earth would be a pinhead 26 metres away. Pluto would be 1km away. Proxima Centauri would be 6,700km away.',
    },
    {
      title: 'If the Milky Way were a frisbee...',
      desc: 'The solar system would be smaller than a grain of sand. The nearest galaxy would be another frisbee 20 metres away.',
    },
    {
      title: 'A virus compared to you...',
      desc: 'Is like you compared to the distance from London to New York.',
    },
  ];

  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl font-light text-white uppercase">Scale Comparisons</h2>
        <p className="text-sm text-white/50 mt-1">Making the incomprehensible comprehensible</p>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        {comparisons.map((c, i) => (
          <div key={i} className="bg-black/30 rounded-lg p-4">
            <div className="text-sm text-white font-medium mb-2">{c.title}</div>
            <p className="text-xs text-white/50">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Powers of Ten reference
function PowersOfTenSection() {
  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl font-light text-white uppercase">Powers of Ten</h2>
        <p className="text-sm text-white/50 mt-1">The classic 1977 film by Charles and Ray Eames</p>
      </div>

      <div className="p-4">
        <p className="text-sm text-white/60 mb-4">
          This page is inspired by the Eames&apos; iconic film, which takes viewers on a journey from a picnic blanket in Chicago to the edge of the observable universe, then down into the nucleus of a carbon atom. Each step is a factor of ten — 10× larger or 10× smaller.
        </p>

        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-mono text-white">61</div>
              <div className="text-[10px] text-white/40">Orders of magnitude</div>
            </div>
            <div>
              <div className="text-2xl font-mono text-white">10²⁶</div>
              <div className="text-[10px] text-white/40">Largest scale (m)</div>
            </div>
            <div>
              <div className="text-2xl font-mono text-white">10⁻³⁵</div>
              <div className="text-[10px] text-white/40">Smallest scale (m)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScaleOfUniversePage() {
  const [selectedIndex, setSelectedIndex] = useState(11); // Start at human scale (1m)
  const selectedScale = SCALES[selectedIndex];

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
                { label: 'Scale of the Universe' },
              ]}
            />
          </div>
        </div>

        {/* Header Frame */}
        <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4 mb-px">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white uppercase">
            Scale of the Universe
          </h1>
          <p className="text-sm md:text-base text-white/60 mt-2 max-w-2xl">
            From the Planck length to the observable universe — a journey through 61 orders of magnitude.
          </p>
        </div>

        {/* Scale Ruler */}
        <div className="mb-px">
          <ScaleRuler selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
        </div>

        {/* Selected Scale Detail */}
        <div className="mb-px">
          <div className="bg-[#1d1d1d] rounded-lg p-4">
            <ScaleDetail scale={selectedScale} />

            {/* Navigation */}
            <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
                disabled={selectedIndex === 0}
                className={`
                  px-4 py-2 text-sm rounded-lg transition-colors
                  ${selectedIndex === 0
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                  }
                `}
              >
                ← Smaller (÷10)
              </button>
              <div className="text-center">
                <div className="text-xs text-white/40">Current position</div>
                <div className="text-lg font-mono text-white">{selectedIndex + 1} / {SCALES.length}</div>
              </div>
              <button
                onClick={() => setSelectedIndex(Math.min(SCALES.length - 1, selectedIndex + 1))}
                disabled={selectedIndex === SCALES.length - 1}
                className={`
                  px-4 py-2 text-sm rounded-lg transition-colors
                  ${selectedIndex === SCALES.length - 1
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                  }
                `}
              >
                Larger (×10) →
              </button>
            </div>
          </div>
        </div>

        {/* Ladder View */}
        <div className="mb-px">
          <LadderView selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
        </div>

        {/* Comparisons */}
        <div className="mb-px">
          <ComparisonsSection />
        </div>

        {/* Powers of Ten */}
        <div className="mb-px">
          <PowersOfTenSection />
        </div>

        {/* Cross-References Frame */}
        <div className="bg-[#1d1d1d] rounded-lg p-4">
          <div className="text-sm text-white/40 uppercase tracking-wider mb-3">Related</div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Link href="/data/fabric/cosmology" className="text-sm text-white/60 hover:text-white transition-colors">
              Big Bang & Cosmology →
            </Link>
            <Link href="/data/fabric/particles" className="text-sm text-white/60 hover:text-white transition-colors">
              Standard Model →
            </Link>
            <Link href="/data/fabric/constants" className="text-sm text-white/60 hover:text-white transition-colors">
              Physical Constants →
            </Link>
            <Link href="/data/cosmos/solar-system" className="text-sm text-white/60 hover:text-white transition-colors">
              Solar System →
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">References</div>
            <div className="text-xs text-white/40">
              Powers of Ten (Eames, 1977) · NIST Reference · Particle Data Group
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
