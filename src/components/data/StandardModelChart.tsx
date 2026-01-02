'use client';

import React, { useState } from 'react';

// Particle data with full details
const PARTICLES: Record<string, {
  symbol: string;
  name: string;
  type: string;
  mass: string;
  charge: string;
  spin: string;
  discovered: string;
}> = {
  // Quarks
  'up':       { symbol: 'u', name: 'up', type: 'quark', mass: '2.2 MeV', charge: '+⅔', spin: '½', discovered: '1968' },
  'charm':    { symbol: 'c', name: 'charm', type: 'quark', mass: '1.27 GeV', charge: '+⅔', spin: '½', discovered: '1974' },
  'top':      { symbol: 't', name: 'top', type: 'quark', mass: '173 GeV', charge: '+⅔', spin: '½', discovered: '1995' },
  'down':     { symbol: 'd', name: 'down', type: 'quark', mass: '4.7 MeV', charge: '−⅓', spin: '½', discovered: '1968' },
  'strange':  { symbol: 's', name: 'strange', type: 'quark', mass: '95 MeV', charge: '−⅓', spin: '½', discovered: '1968' },
  'bottom':   { symbol: 'b', name: 'bottom', type: 'quark', mass: '4.2 GeV', charge: '−⅓', spin: '½', discovered: '1977' },
  // Leptons
  'electron':      { symbol: 'e', name: 'electron', type: 'lepton', mass: '0.511 MeV', charge: '−1', spin: '½', discovered: '1897' },
  'muon':          { symbol: 'μ', name: 'muon', type: 'lepton', mass: '106 MeV', charge: '−1', spin: '½', discovered: '1936' },
  'tau':           { symbol: 'τ', name: 'tau', type: 'lepton', mass: '1.78 GeV', charge: '−1', spin: '½', discovered: '1975' },
  'electron-nu':   { symbol: 'νe', name: 'e neutrino', type: 'lepton', mass: '<2.2 eV', charge: '0', spin: '½', discovered: '1956' },
  'muon-nu':       { symbol: 'νμ', name: 'μ neutrino', type: 'lepton', mass: '<0.17 MeV', charge: '0', spin: '½', discovered: '1962' },
  'tau-nu':        { symbol: 'ντ', name: 'τ neutrino', type: 'lepton', mass: '<15.5 MeV', charge: '0', spin: '½', discovered: '2000' },
  // Gauge bosons
  'gluon':   { symbol: 'g', name: 'gluon', type: 'gauge', mass: '0', charge: '0', spin: '1', discovered: '1979' },
  'photon':  { symbol: 'γ', name: 'photon', type: 'gauge', mass: '0', charge: '0', spin: '1', discovered: '1905' },
  'w-boson': { symbol: 'W', name: 'W boson', type: 'gauge', mass: '80.4 GeV', charge: '±1', spin: '1', discovered: '1983' },
  'z-boson': { symbol: 'Z', name: 'Z boson', type: 'gauge', mass: '91.2 GeV', charge: '0', spin: '1', discovered: '1983' },
  // Scalar boson
  'higgs':    { symbol: 'H', name: 'Higgs', type: 'higgs', mass: '125 GeV', charge: '0', spin: '0', discovered: '2012' },
  // Theoretical
  'graviton': { symbol: 'G', name: 'graviton', type: 'graviton', mass: '0', charge: '0', spin: '2', discovered: 'predicted' },
};

// Grid positions: [row, col] (0-indexed)
const GRID_POSITIONS: Record<string, [number, number]> = {
  // Row 0: up-type quarks + Higgs + Graviton
  'up':       [0, 0],
  'charm':    [0, 1],
  'top':      [0, 2],
  'higgs':    [0, 5],
  'graviton': [0, 6],
  // Row 1: down-type quarks + gluon
  'down':     [1, 0],
  'strange':  [1, 1],
  'bottom':   [1, 2],
  'gluon':    [1, 3],
  // Row 2: charged leptons + photon
  'electron': [2, 0],
  'muon':     [2, 1],
  'tau':      [2, 2],
  'photon':   [2, 3],
  // Row 3: neutrinos + W, Z
  'electron-nu': [3, 0],
  'muon-nu':     [3, 1],
  'tau-nu':      [3, 2],
  'w-boson':     [3, 3],
  'z-boson':     [3, 4],
};

// Type colours
const TYPE_COLORS: Record<string, { bg: string; bgDark: string; text: string }> = {
  'quark':    { bg: 'bg-fuchsia-400', bgDark: 'bg-fuchsia-600', text: 'text-fuchsia-950' },
  'lepton':   { bg: 'bg-emerald-400', bgDark: 'bg-emerald-600', text: 'text-emerald-950' },
  'gauge':    { bg: 'bg-orange-300', bgDark: 'bg-orange-500', text: 'text-orange-950' },
  'higgs':    { bg: 'bg-amber-300', bgDark: 'bg-amber-500', text: 'text-amber-950' },
  'graviton': { bg: 'bg-neutral-400', bgDark: 'bg-neutral-600', text: 'text-neutral-900' },
};

// Which particles are affected by each interaction
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
    particles: ['up', 'charm', 'top', 'down', 'strange', 'bottom', 'electron', 'muon', 'tau', 'electron-nu', 'muon-nu', 'tau-nu', 'w-boson', 'z-boson'],
    description: 'Changes particle flavour. Carried by W± and Z. Very short range.',
  },
  'higgs': {
    particles: ['up', 'charm', 'top', 'down', 'strange', 'bottom', 'electron', 'muon', 'tau', 'w-boson', 'z-boson', 'higgs'],
    description: 'Gives mass to particles. All massive particles couple to the Higgs field.',
  },
  'gravity': {
    particles: Object.keys(PARTICLES),
    description: 'Acts on all mass-energy. Carried by the graviton (theoretical). Infinite range.',
  },
};

// Particle tile with flip animation
function ParticleTile({
  id,
  isFlipped,
  isDimmed,
  onClick
}: {
  id: string;
  isFlipped: boolean;
  isDimmed: boolean;
  onClick: () => void;
}) {
  const particle = PARTICLES[id];
  if (!particle) return null;

  const colors = TYPE_COLORS[particle.type];

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
            ${colors.bg} ${colors.text}
          `}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="font-math text-3xl md:text-4xl lg:text-5xl leading-none">
            {particle.symbol}
          </span>
          <span className="text-xs md:text-sm mt-1 md:mt-2 opacity-70">
            {particle.name}
          </span>
        </div>

        {/* Back face */}
        <div
          className={`
            absolute inset-0 rounded-lg p-2 md:p-3 flex flex-col justify-between
            ${colors.bgDark} ${colors.text}
          `}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center">
            <span className="font-math text-xl md:text-2xl leading-none">
              {particle.symbol}
            </span>
            <span className="text-[10px] md:text-xs block opacity-70 mt-0.5">
              {particle.name}
            </span>
          </div>

          <div className="space-y-0.5 text-[9px] md:text-[10px]">
            <div className="flex justify-between">
              <span className="opacity-60">Mass</span>
              <span className="font-mono">{particle.mass}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Charge</span>
              <span className="font-mono">{particle.charge}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Spin</span>
              <span className="font-mono">{particle.spin}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Found</span>
              <span className="font-mono">{particle.discovered}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main chart
export default function StandardModelChart({ className = '' }: { className?: string }) {
  const [flippedParticle, setFlippedParticle] = useState<string | null>(null);
  const [activeInteraction, setActiveInteraction] = useState<string | null>(null);

  const handleParticleClick = (id: string) => {
    setFlippedParticle(current => current === id ? null : id);
  };

  const handleInteractionClick = (id: string) => {
    setActiveInteraction(current => current === id ? null : id);
  };

  // Get highlighted particles for current interaction
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

      const isDimmed = !!(activeInteraction !== null && particleId && !highlightedParticles.includes(particleId));

      gridCells.push(
        <div key={`${row}-${col}`} className="aspect-square">
          {particleId && (
            <ParticleTile
              id={particleId}
              isFlipped={flippedParticle === particleId}
              isDimmed={isDimmed}
              onClick={() => handleParticleClick(particleId)}
            />
          )}
        </div>
      );
    }
  }

  return (
    <div className={`bg-[#1d1d1d] rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-light text-white">
          17 fundamental particles (plus one predicted)
        </h2>
      </div>

      {/* Generation labels */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-7 gap-3">
          <div className="text-center text-sm text-white/50">1st</div>
          <div className="text-center text-sm text-white/50">2nd</div>
          <div className="text-center text-sm text-white/50">3rd</div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 pt-2">
        <div className="grid grid-cols-7 gap-3">
          {gridCells}
        </div>

        {/* Column labels */}
        <div className="grid grid-cols-7 gap-3 mt-3">
          <div className="col-span-3 text-center">
            <span className="text-xs text-white/40 uppercase tracking-wider">
              Three Generations
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span className="text-xs text-white/40 uppercase tracking-wider">
              Gauge Bosons
            </span>
          </div>
          <div className="col-span-1 text-center">
            <span className="text-xs text-white/40 uppercase tracking-wider">
              Scalar
            </span>
          </div>
          <div className="col-span-1 text-center">
            <span className="text-xs text-white/40 uppercase tracking-wider">
              Predicted
            </span>
          </div>
        </div>
      </div>

      {/* Interaction controls */}
      <div className="px-4 pb-4">
        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">
          Highlight by interaction
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(INTERACTIONS).map(([id]) => (
            <button
              key={id}
              onClick={() => handleInteractionClick(id)}
              className={`
                px-3 py-1.5 text-sm rounded-lg transition-colors capitalize
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

        {/* Interaction description */}
        {activeInteraction && (
          <p className="mt-3 text-sm text-white/50">
            {INTERACTIONS[activeInteraction].description}
          </p>
        )}
      </div>
    </div>
  );
}
