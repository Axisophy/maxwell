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

// Particle tile
function ParticleTile({
  id,
  isSelected,
  onClick
}: {
  id: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const particle = PARTICLES[id];
  if (!particle) return null;

  const colors = TYPE_COLORS[particle.type];

  return (
    <button
      onClick={onClick}
      className={`
        aspect-square rounded-lg flex flex-col items-center justify-center
        transition-all duration-150
        ${colors.bg} ${colors.text}
        ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1d1d1d]' : ''}
        hover:brightness-95
      `}
    >
      <span className="font-math text-4xl leading-none">
        {particle.symbol}
      </span>
      <span className="text-xs mt-1 opacity-70">
        {particle.name}
      </span>
    </button>
  );
}

// Main chart
export default function StandardModelChart({ className = '' }: { className?: string }) {
  const [selectedParticle, setSelectedParticle] = useState<string | null>(null);

  const handleClick = (id: string) => {
    setSelectedParticle(current => current === id ? null : id);
  };

  // Build grid cells
  const gridCells = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      // Find particle at this position
      const particleId = Object.entries(GRID_POSITIONS).find(
        ([_, pos]) => pos[0] === row && pos[1] === col
      )?.[0];

      gridCells.push(
        <div key={`${row}-${col}`} className="aspect-square">
          {particleId && (
            <ParticleTile
              id={particleId}
              isSelected={selectedParticle === particleId}
              onClick={() => handleClick(particleId)}
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
      <div className="p-6">
        <div className="grid grid-cols-7 gap-3 max-w-3xl mx-auto">
          {gridCells}
        </div>
      </div>
    </div>
  );
}
