'use client';

import React, { useState } from 'react';

// Particle data - minimal for now
const PARTICLES: Record<string, { symbol: string; name: string; type: string }> = {
  // Quarks
  'up':       { symbol: 'u', name: 'up', type: 'quark' },
  'charm':    { symbol: 'c', name: 'charm', type: 'quark' },
  'top':      { symbol: 't', name: 'top', type: 'quark' },
  'down':     { symbol: 'd', name: 'down', type: 'quark' },
  'strange':  { symbol: 's', name: 'strange', type: 'quark' },
  'bottom':   { symbol: 'b', name: 'bottom', type: 'quark' },
  // Leptons
  'electron':      { symbol: 'e', name: 'electron', type: 'lepton' },
  'muon':          { symbol: 'μ', name: 'muon', type: 'lepton' },
  'tau':           { symbol: 'τ', name: 'tau', type: 'lepton' },
  'electron-nu':   { symbol: 'νe', name: 'e neutrino', type: 'lepton' },
  'muon-nu':       { symbol: 'νμ', name: 'μ neutrino', type: 'lepton' },
  'tau-nu':        { symbol: 'ντ', name: 'τ neutrino', type: 'lepton' },
  // Gauge bosons
  'gluon':   { symbol: 'g', name: 'gluon', type: 'gauge' },
  'photon':  { symbol: 'γ', name: 'photon', type: 'gauge' },
  'w-boson': { symbol: 'W', name: 'W boson', type: 'gauge' },
  'z-boson': { symbol: 'Z', name: 'Z boson', type: 'gauge' },
  // Scalar boson
  'higgs':    { symbol: 'H', name: 'higgs', type: 'higgs' },
  // Theoretical
  'graviton': { symbol: 'G', name: 'graviton', type: 'graviton' },
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
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  'quark':    { bg: 'bg-fuchsia-400', text: 'text-fuchsia-950' },
  'lepton':   { bg: 'bg-emerald-400', text: 'text-emerald-950' },
  'gauge':    { bg: 'bg-orange-300', text: 'text-orange-950' },
  'higgs':    { bg: 'bg-amber-300', text: 'text-amber-950' },
  'graviton': { bg: 'bg-neutral-400', text: 'text-neutral-900' },
};

// Which particles are affected by each interaction
const INTERACTIONS: Record<string, { particles: string[]; color: string; description: string }> = {
  'strong': {
    particles: ['up', 'charm', 'top', 'down', 'strange', 'bottom', 'gluon'],
    color: 'bg-red-500/30',
    description: 'Binds quarks into hadrons. Carried by gluons. Confined to nuclear scales.',
  },
  'electromagnetic': {
    particles: ['up', 'charm', 'top', 'down', 'strange', 'bottom', 'electron', 'muon', 'tau', 'w-boson', 'photon'],
    color: 'bg-blue-500/30',
    description: 'Acts on electric charge. Carried by the photon. Infinite range.',
  },
  'weak': {
    particles: ['up', 'charm', 'top', 'down', 'strange', 'bottom', 'electron', 'muon', 'tau', 'electron-nu', 'muon-nu', 'tau-nu', 'w-boson', 'z-boson'],
    color: 'bg-yellow-500/30',
    description: 'Changes particle flavour. Carried by W± and Z. Very short range.',
  },
  'higgs': {
    particles: ['up', 'charm', 'top', 'down', 'strange', 'bottom', 'electron', 'muon', 'tau', 'w-boson', 'z-boson', 'higgs'],
    color: 'bg-purple-500/30',
    description: 'Gives mass to particles. All massive particles couple to the Higgs field.',
  },
  'gravity': {
    particles: Object.keys(PARTICLES), // Everything
    color: 'bg-white/20',
    description: 'Acts on all mass-energy. Carried by the graviton (theoretical). Infinite range.',
  },
};

// Particle tile
function ParticleTile({
  id,
  isSelected,
  isHighlighted,
  isDimmed,
  onClick
}: {
  id: string;
  isSelected: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
  onClick: () => void;
}) {
  const particle = PARTICLES[id];
  if (!particle) return null;

  const colors = TYPE_COLORS[particle.type];

  return (
    <button
      onClick={onClick}
      className={`
        w-full h-full rounded-lg flex flex-col items-center justify-center
        transition-all duration-200
        ${colors.bg} ${colors.text}
        ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1d1d1d] scale-105' : ''}
        ${isDimmed ? 'opacity-30' : ''}
        hover:brightness-95
      `}
    >
      <span className="font-math text-3xl md:text-4xl lg:text-5xl leading-none">
        {particle.symbol}
      </span>
      <span className="text-xs md:text-sm mt-1 md:mt-2 opacity-70">
        {particle.name}
      </span>
    </button>
  );
}

// Main chart
export default function StandardModelChart({ className = '' }: { className?: string }) {
  const [selectedParticle, setSelectedParticle] = useState<string | null>(null);
  const [activeInteraction, setActiveInteraction] = useState<string | null>(null);

  const handleParticleClick = (id: string) => {
    setSelectedParticle(current => current === id ? null : id);
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
      // Find particle at this position
      const particleId = Object.entries(GRID_POSITIONS).find(
        ([_, pos]) => pos[0] === row && pos[1] === col
      )?.[0];

      const isHighlighted = particleId ? highlightedParticles.includes(particleId) : false;
      const isDimmed = activeInteraction !== null && !isHighlighted;

      gridCells.push(
        <div key={`${row}-${col}`} className="aspect-[2/3]">
          {particleId && (
            <ParticleTile
              id={particleId}
              isSelected={selectedParticle === particleId}
              isHighlighted={isHighlighted}
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

      {/* Grid */}
      <div className="p-4">
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
          {Object.entries(INTERACTIONS).map(([id, interaction]) => (
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
