'use client';

import React, { useState, useMemo } from 'react';
import {
  PARTICLES,
  INTERACTION_COLORS,
  massToLogScale,
  getParticle,
  type Particle,
} from './standardModelData';

type InteractionOverlay = 'electromagnetic' | 'weak' | 'strong' | 'higgs' | null;

interface StandardModelChartProps {
  className?: string;
  onSelectParticle?: (particle: Particle | null) => void;
}

// Particle chip component for the wall chart
function ParticleChip({
  particle,
  isHighlighted,
  isDimmed,
  isSelected,
  onClick,
}: {
  particle: Particle;
  isHighlighted: boolean;
  isDimmed: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  const massPosition = massToLogScale(particle.mass);

  // Type-based accent colors
  const typeColor = particle.type === 'quark' ? 'bg-red-500'
    : particle.type === 'lepton' ? 'bg-blue-500'
    : particle.type === 'gauge-boson' ? 'bg-green-500'
    : 'bg-amber-500';

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full aspect-square p-2 rounded-lg transition-all duration-200
        flex flex-col items-center justify-center text-center
        border border-white/10
        ${isSelected
          ? 'bg-[#e6007e] text-white'
          : isDimmed
            ? 'bg-white/5 text-white/20'
            : isHighlighted
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white hover:bg-white/10'
        }
      `}
    >
      {/* Symbol */}
      <span className="font-math text-2xl md:text-3xl lg:text-4xl leading-none">
        {particle.symbol}
      </span>

      {/* Name */}
      <span className={`text-[9px] md:text-[10px] mt-1 leading-tight ${isSelected ? 'text-white/80' : 'text-white/50'}`}>
        {particle.name}
      </span>

      {/* Mass display */}
      <span className={`text-[8px] md:text-[9px] font-mono mt-0.5 ${isSelected ? 'text-white/60' : 'text-white/30'}`}>
        {particle.massDisplay}
      </span>

      {/* Charge indicator */}
      <span className={`
        absolute top-1 right-1.5 text-[8px] md:text-[10px] font-mono leading-none
        ${isSelected ? 'text-white/60' : 'text-white/30'}
      `}>
        {particle.chargeDisplay}
      </span>

      {/* Type indicator dot */}
      <div className={`absolute bottom-1 right-1 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${typeColor} ${isDimmed ? 'opacity-30' : 'opacity-60'}`} />
    </button>
  );
}

// Main chart component
export default function StandardModelChart({
  className = '',
  onSelectParticle,
}: StandardModelChartProps) {
  const [selectedParticleId, setSelectedParticleId] = useState<string | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<InteractionOverlay>(null);

  const selectedParticle = selectedParticleId ? getParticle(selectedParticleId) : null;

  // Get particles affected by active overlay
  const affectedParticles = useMemo(() => {
    if (!activeOverlay) return new Set<string>();
    return new Set(
      PARTICLES.filter(p => p[activeOverlay]).map(p => p.id)
    );
  }, [activeOverlay]);

  const handleParticleClick = (particle: Particle) => {
    const newSelection = selectedParticleId === particle.id ? null : particle.id;
    setSelectedParticleId(newSelection);
    onSelectParticle?.(newSelection ? particle : null);
  };

  const handleOverlayToggle = (overlay: InteractionOverlay) => {
    setActiveOverlay(current => current === overlay ? null : overlay);
  };

  const renderParticle = (id: string) => {
    const particle = getParticle(id);
    if (!particle) return null;

    const isHighlighted = activeOverlay ? affectedParticles.has(id) : false;
    const isDimmed = activeOverlay ? !affectedParticles.has(id) : false;
    const isSelected = selectedParticleId === id;

    return (
      <ParticleChip
        key={id}
        particle={particle}
        isHighlighted={isHighlighted}
        isDimmed={isDimmed}
        isSelected={isSelected}
        onClick={() => handleParticleClick(particle)}
      />
    );
  };

  const interactions = [
    { id: 'electromagnetic' as const, name: 'Electromagnetic', color: INTERACTION_COLORS.electromagnetic },
    { id: 'weak' as const, name: 'Weak', color: INTERACTION_COLORS.weak },
    { id: 'strong' as const, name: 'Strong', color: INTERACTION_COLORS.strong },
    { id: 'higgs' as const, name: 'Higgs', color: INTERACTION_COLORS.higgs },
  ];

  return (
    <div className={`bg-[#1d1d1d] rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl md:text-2xl font-light text-white uppercase tracking-wide">
          The Standard Model of Particle Physics
        </h2>
        <p className="text-sm text-white/50 mt-1">
          17 fundamental particles — Click any particle to explore
        </p>
      </div>

      {/* Chart Grid */}
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Fermions (Quarks + Leptons) */}
          <div className="flex-1">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
              Fermions — Matter particles (spin ½)
            </div>

            <div className="flex gap-4 md:gap-6">
              {/* Quarks column */}
              <div className="flex-1">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500/50" />
                  Quarks
                </div>
                <div className="grid grid-cols-2 gap-px">
                  {/* Generation labels row */}
                  <div className="col-span-2 grid grid-cols-3 gap-px mb-1">
                    <div className="text-[8px] text-white/20 text-center">I</div>
                    <div className="text-[8px] text-white/20 text-center">II</div>
                    <div className="text-[8px] text-white/20 text-center">III</div>
                  </div>
                  {/* Up-type row */}
                  <div className="col-span-2 grid grid-cols-3 gap-px">
                    {renderParticle('up')}
                    {renderParticle('charm')}
                    {renderParticle('top')}
                  </div>
                  {/* Down-type row */}
                  <div className="col-span-2 grid grid-cols-3 gap-px mt-px">
                    {renderParticle('down')}
                    {renderParticle('strange')}
                    {renderParticle('bottom')}
                  </div>
                </div>
              </div>

              {/* Leptons column */}
              <div className="flex-1">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500/50" />
                  Leptons
                </div>
                <div className="grid grid-cols-2 gap-px">
                  {/* Generation labels row */}
                  <div className="col-span-2 grid grid-cols-3 gap-px mb-1">
                    <div className="text-[8px] text-white/20 text-center">I</div>
                    <div className="text-[8px] text-white/20 text-center">II</div>
                    <div className="text-[8px] text-white/20 text-center">III</div>
                  </div>
                  {/* Charged leptons row */}
                  <div className="col-span-2 grid grid-cols-3 gap-px">
                    {renderParticle('electron')}
                    {renderParticle('muon')}
                    {renderParticle('tau')}
                  </div>
                  {/* Neutrinos row */}
                  <div className="col-span-2 grid grid-cols-3 gap-px mt-px">
                    {renderParticle('electron-neutrino')}
                    {renderParticle('muon-neutrino')}
                    {renderParticle('tau-neutrino')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bosons */}
          <div className="lg:w-56">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
              Bosons — Force carriers (spin 0, 1)
            </div>

            {/* Gauge bosons */}
            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500/50" />
              Gauge bosons
            </div>
            <div className="grid grid-cols-2 gap-px mb-3">
              {renderParticle('photon')}
              {renderParticle('gluon')}
            </div>
            <div className="grid grid-cols-2 gap-px mb-4">
              {renderParticle('w-boson')}
              {renderParticle('z-boson')}
            </div>

            {/* Scalar boson (Higgs) */}
            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500/50" />
              Scalar boson
            </div>
            <div className="grid grid-cols-2 gap-px">
              {renderParticle('higgs')}
              <div /> {/* Empty cell for layout */}
            </div>
          </div>
        </div>
      </div>

      {/* Interaction filters - BELOW chart */}
      <div className="px-4 pb-4">
        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
          Show particles that interact via
        </div>
        <div className="flex flex-wrap gap-px">
          {interactions.map(interaction => (
            <button
              key={interaction.id}
              onClick={() => handleOverlayToggle(interaction.id)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                ${activeOverlay === interaction.id
                  ? 'bg-[#ffdf20] text-black'
                  : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                }
              `}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: interaction.color }}
              />
              {interaction.name}
            </button>
          ))}

          {activeOverlay && (
            <button
              onClick={() => setActiveOverlay(null)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-white/40 hover:text-white/60"
            >
              Clear
            </button>
          )}
        </div>

        {/* Active interaction description */}
        {activeOverlay && (
          <div className="mt-3 p-3 bg-black/40 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: interactions.find(i => i.id === activeOverlay)?.color }}
              />
              <span className="text-sm font-medium text-white">
                {interactions.find(i => i.id === activeOverlay)?.name} Interaction
              </span>
              <span className="text-xs text-white/40 ml-auto">
                {affectedParticles.size} particles
              </span>
            </div>
            <p className="text-xs text-white/50">
              {activeOverlay === 'electromagnetic' && 'Acts on particles with electric charge. Carried by the photon. Infinite range.'}
              {activeOverlay === 'weak' && 'Acts on all fermions. Carried by W± and Z bosons. Changes quark/lepton flavour.'}
              {activeOverlay === 'strong' && 'Acts on particles with colour charge (quarks, gluons). Binds quarks into hadrons.'}
              {activeOverlay === 'higgs' && 'Couples to particles with mass. The Higgs mechanism gives mass to W, Z, and fermions.'}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-4 pb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-white/40 border-t border-white/5 pt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500/50" />
          <span>Quarks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500/50" />
          <span>Leptons</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500/50" />
          <span>Gauge bosons</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500/50" />
          <span>Scalar boson</span>
        </div>
        <div className="ml-auto text-white/30">
          Generations: I → II → III (increasing mass)
        </div>
      </div>
    </div>
  );
}
