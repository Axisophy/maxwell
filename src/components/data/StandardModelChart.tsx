'use client';

import React, { useState, useMemo } from 'react';
import {
  PARTICLES,
  INTERACTION_COLORS,
  getParticle,
  type Particle,
} from './standardModelData';

type InteractionOverlay = 'electromagnetic' | 'weak' | 'strong' | 'higgs' | null;

interface StandardModelChartProps {
  className?: string;
  onSelectParticle?: (particle: Particle | null) => void;
  selectedParticle?: Particle | null;
}

// Type-based background colors (matching reference images)
const TYPE_BG_COLORS: Record<string, string> = {
  'quark': 'bg-fuchsia-500',
  'lepton': 'bg-emerald-500',
  'gauge-boson': 'bg-rose-400',
  'scalar-boson': 'bg-amber-400',
};

const TYPE_BG_SELECTED: Record<string, string> = {
  'quark': 'bg-fuchsia-700',
  'lepton': 'bg-emerald-700',
  'gauge-boson': 'bg-rose-600',
  'scalar-boson': 'bg-amber-500',
};

const TYPE_TEXT_COLORS: Record<string, string> = {
  'quark': 'text-fuchsia-950',
  'lepton': 'text-emerald-950',
  'gauge-boson': 'text-rose-950',
  'scalar-boson': 'text-amber-950',
};

// Particle tile component
function ParticleTile({
  particle,
  isSelected,
  isDimmed,
  onClick,
}: {
  particle: Particle;
  isSelected: boolean;
  isDimmed: boolean;
  onClick: () => void;
}) {
  const bgColor = isSelected ? TYPE_BG_SELECTED[particle.type] : TYPE_BG_COLORS[particle.type];
  const textColor = TYPE_TEXT_COLORS[particle.type];

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full aspect-square p-2 rounded-lg transition-all duration-150
        flex flex-col items-center justify-center text-center
        ${bgColor}
        ${isDimmed ? 'opacity-30' : 'opacity-100'}
        ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1d1d1d]' : ''}
        hover:brightness-90
      `}
    >
      {/* Mass - top left */}
      <span className={`absolute top-1.5 left-2 text-[10px] md:text-xs font-mono ${textColor} opacity-70`}>
        {particle.massDisplay}
      </span>

      {/* Charge - top right */}
      <span className={`absolute top-1.5 right-2 text-[10px] md:text-xs font-mono ${textColor} opacity-70`}>
        {particle.chargeDisplay}
      </span>

      {/* Symbol - center */}
      <span className={`font-math text-4xl md:text-5xl lg:text-6xl leading-none ${textColor}`}>
        {particle.symbol}
      </span>

      {/* Spin - bottom right */}
      <span className={`absolute bottom-1.5 right-2 text-[10px] md:text-xs font-mono ${textColor} opacity-70`}>
        {particle.spinDisplay}
      </span>

      {/* Name - bottom center */}
      <span className={`absolute bottom-1.5 left-2 text-[10px] md:text-xs ${textColor} opacity-80`}>
        {particle.name}
      </span>
    </button>
  );
}

// Main chart component - just the grid, no controls
export default function StandardModelChart({
  className = '',
  onSelectParticle,
  selectedParticle,
}: StandardModelChartProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(null);

  // Use external selection if provided
  const selectedId = selectedParticle?.id ?? internalSelected;

  const handleParticleClick = (particle: Particle) => {
    const newSelection = selectedId === particle.id ? null : particle.id;
    setInternalSelected(newSelection);
    onSelectParticle?.(newSelection ? particle : null);
  };

  const renderParticle = (id: string, isDimmed = false) => {
    const particle = getParticle(id);
    if (!particle) return <div className="aspect-square" />;

    return (
      <ParticleTile
        key={id}
        particle={particle}
        isSelected={selectedId === id}
        isDimmed={isDimmed}
        onClick={() => handleParticleClick(particle)}
      />
    );
  };

  return (
    <div className={`bg-[#1d1d1d] rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl md:text-2xl font-light text-white uppercase tracking-wide">
          The Standard Model of Particle Physics
        </h2>
        <p className="text-sm text-white/50 mt-1">
          17 fundamental particles - Click any particle to explore
        </p>
      </div>

      {/* Chart Grid */}
      <div className="p-4 md:p-6">
        <div className="flex gap-4 md:gap-6">

          {/* FERMIONS Section */}
          <div className="flex-1">
            {/* Generation labels */}
            <div className="grid grid-cols-3 gap-px mb-2 text-center">
              <div className="text-base md:text-lg text-white/60 font-light">1st</div>
              <div className="text-base md:text-lg text-white/60 font-light">2nd</div>
              <div className="text-base md:text-lg text-white/60 font-light">3rd</div>
            </div>

            {/* Quarks */}
            <div className="flex items-center gap-2 md:gap-4 mb-1">
              <div className="w-20 md:w-24 text-right">
                <span className="text-sm md:text-base text-fuchsia-400 font-medium uppercase tracking-wider">Quarks</span>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-px">
                {/* Up-type quarks */}
                {renderParticle('up')}
                {renderParticle('charm')}
                {renderParticle('top')}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 mb-4">
              <div className="w-20 md:w-24" /> {/* Spacer */}
              <div className="flex-1 grid grid-cols-3 gap-px">
                {/* Down-type quarks */}
                {renderParticle('down')}
                {renderParticle('strange')}
                {renderParticle('bottom')}
              </div>
            </div>

            {/* Leptons */}
            <div className="flex items-center gap-2 md:gap-4 mb-1">
              <div className="w-20 md:w-24 text-right">
                <span className="text-sm md:text-base text-emerald-400 font-medium uppercase tracking-wider">Leptons</span>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-px">
                {/* Charged leptons */}
                {renderParticle('electron')}
                {renderParticle('muon')}
                {renderParticle('tau')}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-20 md:w-24" /> {/* Spacer */}
              <div className="flex-1 grid grid-cols-3 gap-px">
                {/* Neutrinos */}
                {renderParticle('electron-neutrino')}
                {renderParticle('muon-neutrino')}
                {renderParticle('tau-neutrino')}
              </div>
            </div>

            {/* Fermions label */}
            <div className="flex items-center gap-2 md:gap-4 mt-3">
              <div className="w-20 md:w-24" />
              <div className="flex-1 text-center">
                <span className="text-xs md:text-sm text-white/40 uppercase tracking-widest">Fermions</span>
              </div>
            </div>
          </div>

          {/* BOSONS Section */}
          <div className="w-32 md:w-40 lg:w-48">
            {/* Spacer to align with generation labels */}
            <div className="h-8 md:h-9" />

            {/* Gauge Bosons label */}
            <div className="mb-1">
              <span className="text-sm md:text-base text-rose-400 font-medium uppercase tracking-wider">Gauge</span>
            </div>

            {/* Photon and Gluon */}
            <div className="grid grid-cols-2 gap-px mb-1">
              {renderParticle('photon')}
              {renderParticle('gluon')}
            </div>

            {/* W and Z */}
            <div className="grid grid-cols-2 gap-px mb-4">
              {renderParticle('w-boson')}
              {renderParticle('z-boson')}
            </div>

            {/* Scalar Boson (Higgs) */}
            <div className="mb-1">
              <span className="text-sm md:text-base text-amber-400 font-medium uppercase tracking-wider">Scalar</span>
            </div>
            <div className="grid grid-cols-2 gap-px">
              {renderParticle('higgs')}
              <div /> {/* Empty */}
            </div>

            {/* Bosons label */}
            <div className="mt-3 text-center">
              <span className="text-xs md:text-sm text-white/40 uppercase tracking-widest">Bosons</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 md:px-6 pb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50 border-t border-white/5 pt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-fuchsia-500" />
          <span>Quarks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500" />
          <span>Leptons</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-rose-400" />
          <span>Gauge bosons</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-400" />
          <span>Scalar boson</span>
        </div>
        <div className="ml-auto text-white/30">
          Mass · Charge · Spin shown on each tile
        </div>
      </div>
    </div>
  );
}
