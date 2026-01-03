'use client';

import React, { useState, useEffect } from 'react';

// Full particle data with Wikipedia-style details
export const PARTICLES: Record<string, {
  symbol: string;
  name: string;
  type: string;
  statistics: string;
  family: string;
  generation: number | null;
  interactions: string[];
  antiparticle: string;
  theorized: { who: string; year: number };
  discovered: { where: string; year: number };
  mass: string;
  charge: string;
  spin: string;
  colorCharge: string;
  weakIsospin: string;
  decays: string;
}> = {
  // Quarks
  'up': {
    symbol: 'u',
    name: 'up',
    type: 'quark',
    statistics: 'fermionic',
    family: 'quark',
    generation: 1,
    interactions: ['strong', 'weak', 'electromagnetic', 'gravity'],
    antiparticle: 'ū (anti-up)',
    theorized: { who: 'Gell-Mann, Zweig', year: 1964 },
    discovered: { where: 'SLAC', year: 1968 },
    mass: '2.2 MeV/c²',
    charge: '+⅔',
    spin: '½',
    colorCharge: 'yes',
    weakIsospin: 'LH: +½, RH: 0',
    decays: 'stable',
  },
  'down': {
    symbol: 'd',
    name: 'down',
    type: 'quark',
    statistics: 'fermionic',
    family: 'quark',
    generation: 1,
    interactions: ['strong', 'weak', 'electromagnetic', 'gravity'],
    antiparticle: 'd̄ (anti-down)',
    theorized: { who: 'Gell-Mann, Zweig', year: 1964 },
    discovered: { where: 'SLAC', year: 1968 },
    mass: '4.7 MeV/c²',
    charge: '−⅓',
    spin: '½',
    colorCharge: 'yes',
    weakIsospin: 'LH: −½, RH: 0',
    decays: 'stable in nuclei',
  },
  'charm': {
    symbol: 'c',
    name: 'charm',
    type: 'quark',
    statistics: 'fermionic',
    family: 'quark',
    generation: 2,
    interactions: ['strong', 'weak', 'electromagnetic', 'gravity'],
    antiparticle: 'c̄ (anti-charm)',
    theorized: { who: 'Glashow, Iliopoulos, Maiani', year: 1970 },
    discovered: { where: 'SLAC & Brookhaven', year: 1974 },
    mass: '1.27 GeV/c²',
    charge: '+⅔',
    spin: '½',
    colorCharge: 'yes',
    weakIsospin: 'LH: +½, RH: 0',
    decays: 'weak decay',
  },
  'strange': {
    symbol: 's',
    name: 'strange',
    type: 'quark',
    statistics: 'fermionic',
    family: 'quark',
    generation: 2,
    interactions: ['strong', 'weak', 'electromagnetic', 'gravity'],
    antiparticle: 's̄ (anti-strange)',
    theorized: { who: 'Gell-Mann, Zweig', year: 1964 },
    discovered: { where: 'SLAC', year: 1968 },
    mass: '95 MeV/c²',
    charge: '−⅓',
    spin: '½',
    colorCharge: 'yes',
    weakIsospin: 'LH: −½, RH: 0',
    decays: 'weak decay',
  },
  'top': {
    symbol: 't',
    name: 'top',
    type: 'quark',
    statistics: 'fermionic',
    family: 'quark',
    generation: 3,
    interactions: ['strong', 'weak', 'electromagnetic', 'gravity'],
    antiparticle: 't̄ (anti-top)',
    theorized: { who: 'Kobayashi, Maskawa', year: 1973 },
    discovered: { where: 'Fermilab', year: 1995 },
    mass: '173 GeV/c²',
    charge: '+⅔',
    spin: '½',
    colorCharge: 'yes',
    weakIsospin: 'LH: +½, RH: 0',
    decays: 'weak (before hadronisation)',
  },
  'bottom': {
    symbol: 'b',
    name: 'bottom',
    type: 'quark',
    statistics: 'fermionic',
    family: 'quark',
    generation: 3,
    interactions: ['strong', 'weak', 'electromagnetic', 'gravity'],
    antiparticle: 'b̄ (anti-bottom)',
    theorized: { who: 'Kobayashi, Maskawa', year: 1973 },
    discovered: { where: 'Fermilab', year: 1977 },
    mass: '4.18 GeV/c²',
    charge: '−⅓',
    spin: '½',
    colorCharge: 'yes',
    weakIsospin: 'LH: −½, RH: 0',
    decays: 'weak decay',
  },
  // Leptons
  'electron': {
    symbol: 'e',
    name: 'electron',
    type: 'lepton',
    statistics: 'fermionic',
    family: 'lepton',
    generation: 1,
    interactions: ['weak', 'electromagnetic', 'gravity'],
    antiparticle: 'e⁺ (positron)',
    theorized: { who: 'Stoney', year: 1874 },
    discovered: { where: 'Cambridge', year: 1897 },
    mass: '0.511 MeV/c²',
    charge: '−1',
    spin: '½',
    colorCharge: 'no',
    weakIsospin: 'LH: −½, RH: 0',
    decays: 'stable',
  },
  'muon': {
    symbol: 'μ',
    name: 'muon',
    type: 'lepton',
    statistics: 'fermionic',
    family: 'lepton',
    generation: 2,
    interactions: ['weak', 'electromagnetic', 'gravity'],
    antiparticle: 'μ⁺ (antimuon)',
    theorized: { who: '—', year: 0 },
    discovered: { where: 'Caltech', year: 1936 },
    mass: '105.7 MeV/c²',
    charge: '−1',
    spin: '½',
    colorCharge: 'no',
    weakIsospin: 'LH: −½, RH: 0',
    decays: 'e⁻ + ν̄ₑ + νμ',
  },
  'tau': {
    symbol: 'τ',
    name: 'tau',
    type: 'lepton',
    statistics: 'fermionic',
    family: 'lepton',
    generation: 3,
    interactions: ['weak', 'electromagnetic', 'gravity'],
    antiparticle: 'τ⁺ (antitau)',
    theorized: { who: '—', year: 0 },
    discovered: { where: 'SLAC', year: 1975 },
    mass: '1.777 GeV/c²',
    charge: '−1',
    spin: '½',
    colorCharge: 'no',
    weakIsospin: 'LH: −½, RH: 0',
    decays: 'various (hadrons, leptons)',
  },
  'electron-neutrino': {
    symbol: 'νₑ',
    name: 'electron neutrino',
    type: 'lepton',
    statistics: 'fermionic',
    family: 'lepton',
    generation: 1,
    interactions: ['weak', 'gravity'],
    antiparticle: 'ν̄ₑ (e antineutrino)',
    theorized: { who: 'Pauli', year: 1930 },
    discovered: { where: 'Savannah River', year: 1956 },
    mass: '< 1.0 eV/c²',
    charge: '0',
    spin: '½',
    colorCharge: 'no',
    weakIsospin: 'LH: +½',
    decays: 'stable (oscillates)',
  },
  'muon-neutrino': {
    symbol: 'νμ',
    name: 'muon neutrino',
    type: 'lepton',
    statistics: 'fermionic',
    family: 'lepton',
    generation: 2,
    interactions: ['weak', 'gravity'],
    antiparticle: 'ν̄μ (μ antineutrino)',
    theorized: { who: '—', year: 0 },
    discovered: { where: 'Brookhaven', year: 1962 },
    mass: '< 0.17 MeV/c²',
    charge: '0',
    spin: '½',
    colorCharge: 'no',
    weakIsospin: 'LH: +½',
    decays: 'stable (oscillates)',
  },
  'tau-neutrino': {
    symbol: 'ντ',
    name: 'tau neutrino',
    type: 'lepton',
    statistics: 'fermionic',
    family: 'lepton',
    generation: 3,
    interactions: ['weak', 'gravity'],
    antiparticle: 'ν̄τ (τ antineutrino)',
    theorized: { who: '—', year: 0 },
    discovered: { where: 'Fermilab', year: 2000 },
    mass: '< 18.2 MeV/c²',
    charge: '0',
    spin: '½',
    colorCharge: 'no',
    weakIsospin: 'LH: +½',
    decays: 'stable (oscillates)',
  },
  // Gauge bosons
  'gluon': {
    symbol: 'g',
    name: 'gluon',
    type: 'gauge',
    statistics: 'bosonic',
    family: 'gauge boson',
    generation: null,
    interactions: ['strong'],
    antiparticle: 'g (self)',
    theorized: { who: 'Gell-Mann, Fritzsch, Leutwyler', year: 1973 },
    discovered: { where: 'DESY', year: 1979 },
    mass: '0',
    charge: '0',
    spin: '1',
    colorCharge: 'yes (octet)',
    weakIsospin: '0',
    decays: 'confined',
  },
  'photon': {
    symbol: 'γ',
    name: 'photon',
    type: 'gauge',
    statistics: 'bosonic',
    family: 'gauge boson',
    generation: null,
    interactions: ['electromagnetic'],
    antiparticle: 'γ (self)',
    theorized: { who: 'Einstein', year: 1905 },
    discovered: { where: 'Bern (theory)', year: 1905 },
    mass: '0',
    charge: '0',
    spin: '1',
    colorCharge: 'no',
    weakIsospin: '0',
    decays: 'stable',
  },
  'w-boson': {
    symbol: 'W',
    name: 'W boson',
    type: 'gauge',
    statistics: 'bosonic',
    family: 'gauge boson',
    generation: null,
    interactions: ['weak'],
    antiparticle: 'W⁺ ↔ W⁻',
    theorized: { who: 'Glashow, Weinberg, Salam', year: 1968 },
    discovered: { where: 'CERN', year: 1983 },
    mass: '80.4 GeV/c²',
    charge: '±1',
    spin: '1',
    colorCharge: 'no',
    weakIsospin: '±1',
    decays: 'leptons or quarks',
  },
  'z-boson': {
    symbol: 'Z',
    name: 'Z boson',
    type: 'gauge',
    statistics: 'bosonic',
    family: 'gauge boson',
    generation: null,
    interactions: ['weak'],
    antiparticle: 'Z (self)',
    theorized: { who: 'Glashow, Weinberg, Salam', year: 1968 },
    discovered: { where: 'CERN', year: 1983 },
    mass: '91.2 GeV/c²',
    charge: '0',
    spin: '1',
    colorCharge: 'no',
    weakIsospin: '0',
    decays: 'fermion pairs',
  },
  // Scalar boson
  'higgs': {
    symbol: 'H',
    name: 'Higgs boson',
    type: 'scalar',
    statistics: 'bosonic',
    family: 'scalar boson',
    generation: null,
    interactions: ['weak', 'Higgs'],
    antiparticle: 'H (self)',
    theorized: { who: 'Higgs, Englert, Brout', year: 1964 },
    discovered: { where: 'CERN LHC', year: 2012 },
    mass: '125.1 GeV/c²',
    charge: '0',
    spin: '0',
    colorCharge: 'no',
    weakIsospin: '−½',
    decays: 'bb̄, WW, ττ, ZZ, γγ',
  },
  // Theoretical
  'graviton': {
    symbol: 'G',
    name: 'graviton',
    type: 'graviton',
    statistics: 'bosonic',
    family: 'tensor boson',
    generation: null,
    interactions: ['gravity'],
    antiparticle: 'G (self)',
    theorized: { who: 'Quantum gravity theories', year: 1930 },
    discovered: { where: 'not yet discovered', year: 0 },
    mass: '0',
    charge: '0',
    spin: '2',
    colorCharge: 'no',
    weakIsospin: '0',
    decays: 'stable (if exists)',
  },
};

// Grid positions: [row, col] (0-indexed)
const GRID_POSITIONS: Record<string, [number, number]> = {
  'up': [0, 0], 'charm': [0, 1], 'top': [0, 2],
  'down': [1, 0], 'strange': [1, 1], 'bottom': [1, 2],
  'electron': [2, 0], 'muon': [2, 1], 'tau': [2, 2],
  'electron-neutrino': [3, 0], 'muon-neutrino': [3, 1], 'tau-neutrino': [3, 2],
  'gluon': [1, 3], 'photon': [2, 3],
  'w-boson': [3, 3], 'z-boson': [3, 4],
  'higgs': [0, 5], 'graviton': [0, 6],
};

// Type colours - bright front, dark back for white text readability
const TYPE_COLORS: Record<string, { front: string; back: string; text: string }> = {
  'quark': { front: 'bg-blue-500', back: 'bg-blue-900', text: 'text-blue-950' },
  'lepton': { front: 'bg-emerald-500', back: 'bg-emerald-900', text: 'text-emerald-950' },
  'gauge': { front: 'bg-orange-400', back: 'bg-orange-900', text: 'text-orange-950' },
  'scalar': { front: 'bg-amber-400', back: 'bg-amber-900', text: 'text-amber-950' },
  'graviton': { front: 'bg-neutral-400', back: 'bg-neutral-800', text: 'text-neutral-900' },
};

// Type groups for filtering
const TYPE_GROUPS: Record<string, { types: string[]; label: string }> = {
  'quarks': { types: ['quark'], label: 'Quarks' },
  'leptons': { types: ['lepton'], label: 'Leptons' },
  'bosons': { types: ['gauge', 'scalar', 'graviton'], label: 'Bosons' },
};

// Interactions
const INTERACTIONS: Record<string, { particles: string[]; description: string }> = {
  'strong': {
    particles: ['up', 'charm', 'top', 'down', 'strange', 'bottom', 'gluon'],
    description: 'Binds quarks into hadrons. Carried by gluons. Confined to nuclear scales.',
  },
  'electromagnetic': {
    particles: ['up', 'charm', 'top', 'down', 'strange', 'bottom', 'electron', 'muon', 'tau', 'w-boson', 'photon'],
    description: 'Acts on electric charge. Carried by the photon. Infinite range.',
  },
  'weak': {
    particles: ['up', 'charm', 'top', 'down', 'strange', 'bottom', 'electron', 'muon', 'tau', 'electron-neutrino', 'muon-neutrino', 'tau-neutrino', 'w-boson', 'z-boson', 'higgs'],
    description: 'Changes particle flavour. Carried by W± and Z. Very short range.',
  },
  'higgs': {
    particles: ['up', 'charm', 'top', 'down', 'strange', 'bottom', 'electron', 'muon', 'tau', 'w-boson', 'z-boson', 'higgs'],
    description: 'Gives mass to particles through the Higgs field.',
  },
  'gravity': {
    particles: Object.keys(PARTICLES),
    description: 'Acts on all mass-energy. Carried by the graviton (theoretical). Infinite range.',
  },
};

// Particle tile component
function ParticleTile({
  id,
  isFlipped,
  isDimmed,
  onClick,
  isMobile,
}: {
  id: string;
  isFlipped: boolean;
  isDimmed: boolean;
  onClick: () => void;
  isMobile: boolean;
}) {
  const particle = PARTICLES[id];
  if (!particle) return null;

  const colors = TYPE_COLORS[particle.type];

  // Mobile: no flip, just show front with smaller text
  if (isMobile) {
    return (
      <div
        className={`
          w-full h-full rounded-lg flex flex-col items-center justify-center p-1
          ${colors.front} ${colors.text}
          ${isDimmed ? 'opacity-30' : ''}
          transition-opacity
        `}
      >
        <span className="font-stix text-xl leading-none">{particle.symbol}</span>
        <span className="text-[7px] mt-0.5 opacity-70 text-center leading-tight truncate w-full px-0.5">
          {particle.name}
        </span>
      </div>
    );
  }

  // Desktop: flip animation
  return (
    <div
      className="w-full h-full cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={onClick}
    >
      <div
        className={`
          relative w-full h-full transition-transform duration-500
          ${isDimmed ? 'opacity-30' : ''}
        `}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front face */}
        <div
          className={`
            absolute inset-0 rounded-lg flex flex-col items-center justify-center
            ${colors.front} ${colors.text}
          `}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="font-stix text-3xl md:text-4xl leading-none">{particle.symbol}</span>
          <span className="text-xs mt-2 opacity-70">{particle.name}</span>
        </div>

        {/* Back face - dark with white text */}
        <div
          className={`
            absolute inset-0 rounded-lg p-2 overflow-hidden
            ${colors.back} text-white
          `}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-stix text-lg leading-none">{particle.symbol}</span>
            <span className="text-[8px] opacity-50 uppercase">{particle.type}</span>
          </div>

          {/* Properties grid */}
          <div className="space-y-0.5 text-[8px]">
            <div className="flex justify-between">
              <span className="opacity-40">Mass</span>
              <span className="font-mono text-right">{particle.mass}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-40">Charge</span>
              <span className="font-stix">{particle.charge}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-40">Spin</span>
              <span className="font-stix">{particle.spin}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-40">Color</span>
              <span>{particle.colorCharge}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-40">Anti</span>
              <span className="font-stix truncate ml-1">{particle.antiparticle.split(' ')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-40">Found</span>
              <span>{particle.discovered.year || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main chart component
export default function StandardModelChart({ className = '' }: { className?: string }) {
  const [flippedParticle, setFlippedParticle] = useState<string | null>(null);
  const [activeInteraction, setActiveInteraction] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleParticleClick = (id: string) => {
    if (!isMobile) {
      setFlippedParticle(current => current === id ? null : id);
    }
  };

  const handleInteractionClick = (id: string) => {
    setActiveInteraction(current => current === id ? null : id);
    setActiveType(null);
  };

  const handleTypeClick = (type: string) => {
    setActiveType(current => current === type ? null : type);
    setActiveInteraction(null);
  };

  // Get highlighted particles
  const highlightedParticles = activeInteraction
    ? INTERACTIONS[activeInteraction].particles
    : [];

  // Build grid cells
  const gridCells = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      const particleId = Object.entries(GRID_POSITIONS).find(
        ([_, pos]) => pos[0] === row && pos[1] === col
      )?.[0];

      let isDimmed = false;
      if (activeInteraction && particleId && !highlightedParticles.includes(particleId)) {
        isDimmed = true;
      }
      if (activeType && particleId) {
        const particle = PARTICLES[particleId];
        const allowedTypes = TYPE_GROUPS[activeType]?.types || [];
        if (!allowedTypes.includes(particle.type)) {
          isDimmed = true;
        }
      }

      gridCells.push(
        <div key={`${row}-${col}`} className="aspect-square">
          {particleId && (
            <ParticleTile
              id={particleId}
              isFlipped={flippedParticle === particleId}
              isDimmed={isDimmed}
              onClick={() => handleParticleClick(particleId)}
              isMobile={isMobile}
            />
          )}
        </div>
      );
    }
  }

  return (
    <div className={`space-y-px ${className}`}>
      {/* Chart intro text */}
      <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
        <p className="text-xs md:text-sm text-white/60 max-w-3xl">
          Everything in the universe is built from these particles. Matter is made of fermions (quarks and leptons),
          while forces are carried by bosons. The arrangement reveals deep symmetries: three generations of matter
          with increasing mass, and force carriers that emerge from gauge symmetries.
          {!isMobile && <span className="text-white/40"> Click any particle to see its properties.</span>}
        </p>
      </div>

      {/* Generation labels + grid */}
      <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
        {/* Generation labels */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="text-center text-[8px] md:text-xs text-white/50">1st</div>
          <div className="text-center text-[8px] md:text-xs text-white/50">2nd</div>
          <div className="text-center text-[8px] md:text-xs text-white/50">3rd</div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {gridCells}
        </div>

        {/* Column labels */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mt-2 md:mt-3">
          <div className="col-span-3 text-center">
            <span className="text-[7px] md:text-[10px] text-white/40 uppercase tracking-wider">
              Three Generations
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span className="text-[7px] md:text-[10px] text-white/40 uppercase tracking-wider">
              Gauge
            </span>
          </div>
          <div className="col-span-1 text-center">
            <span className="text-[7px] md:text-[10px] text-white/40 uppercase tracking-wider">
              Scalar
            </span>
          </div>
          <div className="col-span-1 text-center">
            <span className="text-[7px] md:text-[10px] text-white/40 uppercase tracking-wider">
              Theory
            </span>
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4 space-y-3 md:space-y-4">
        {/* Type filter */}
        <div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
            Highlight by type
          </div>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {Object.entries(TYPE_GROUPS).map(([id, group]) => (
              <button
                key={id}
                onClick={() => handleTypeClick(id)}
                className={`
                  px-2 md:px-3 py-1 md:py-1.5 text-xs rounded-lg transition-colors
                  ${activeType === id
                    ? 'bg-[#ffdf20] text-black font-medium'
                    : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                  }
                `}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interaction filter */}
        <div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
            Highlight by interaction
          </div>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {Object.entries(INTERACTIONS).map(([id]) => (
              <button
                key={id}
                onClick={() => handleInteractionClick(id)}
                className={`
                  px-2 md:px-3 py-1 md:py-1.5 text-xs rounded-lg transition-colors capitalize
                  ${activeInteraction === id
                    ? 'bg-[#ffdf20] text-black font-medium'
                    : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                  }
                `}
              >
                {id}
              </button>
            ))}
          </div>

          {activeInteraction && (
            <p className="mt-2 md:mt-3 text-xs text-white/50">
              {INTERACTIONS[activeInteraction].description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
