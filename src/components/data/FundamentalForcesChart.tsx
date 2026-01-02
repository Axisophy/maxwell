'use client';

import React, { useState } from 'react';
import {
  FORCES,
  PARTICLES,
  SCALES,
  UNIFICATIONS,
  getForce,
  getParticlesByForce,
  type Force,
  type Particle,
  type Scale,
} from './fundamentalForcesData';

type ViewMode = 'forces' | 'matrix' | 'scales';

interface FundamentalForcesChartProps {
  className?: string;
}

// Force rail component
function ForceRail({
  force,
  isSelected,
  onSelect,
  expanded,
}: {
  force: Force;
  isSelected: boolean;
  onSelect: () => void;
  expanded: boolean;
}) {
  // Calculate position on log scale for strength bar
  const maxLog = 0; // Strong = 1 = 10^0
  const minLog = -40;
  const strengthLog = Math.log10(force.relativeStrength);
  const strengthPercent = ((strengthLog - minLog) / (maxLog - minLog)) * 100;

  return (
    <div
      className={`rounded-lg transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-[#e6007e]' : ''
      }`}
      style={{ backgroundColor: force.color + '20' }}
      onClick={onSelect}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: force.color }}
            />
            <div>
              <h3 className="text-lg font-medium text-black">{force.name}</h3>
              {!force.inStandardModel && (
                <span className="text-[10px] text-black/40 uppercase tracking-wider">
                  Not in Standard Model
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-black/50 uppercase">Strength</div>
            <div className="text-xl font-mono font-bold">{force.strengthDisplay}</div>
          </div>
        </div>

        {/* Strength bar */}
        <div className="mb-4">
          <div className="h-2 bg-black/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.max(2, strengthPercent)}%`,
                backgroundColor: force.color,
              }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[9px] text-black/30">
            <span>10⁻⁴⁰</span>
            <span>1</span>
          </div>
        </div>

        {/* Key properties row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <div className="text-[10px] text-black/50 uppercase">Range</div>
            <div className="font-mono">{force.rangeDisplay}</div>
          </div>
          <div>
            <div className="text-[10px] text-black/50 uppercase">Carrier</div>
            <div className="font-mono">{force.carrier.symbol}</div>
          </div>
          <div>
            <div className="text-[10px] text-black/50 uppercase">Acts On</div>
            <div>{force.actsOn}</div>
          </div>
          <div>
            <div className="text-[10px] text-black/50 uppercase">Charge</div>
            <div>{force.charge}</div>
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-black/10">
            <p className="text-sm text-black/70 mb-3">{force.description}</p>

            <div className="bg-white/50 rounded-lg p-3 mb-3">
              <div className="text-[10px] text-black/50 uppercase mb-1">Key Property</div>
              <p className="text-sm text-black/80">{force.keyProperty}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-black/50 uppercase mb-2">Effects</div>
                <ul className="text-xs text-black/60 space-y-1">
                  {force.effects.slice(0, 4).map((effect, i) => (
                    <li key={i}>• {effect}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[10px] text-black/50 uppercase mb-2">Carrier Details</div>
                <div className="text-xs text-black/60 space-y-1">
                  <div>Name: {force.carrier.name}</div>
                  <div>Mass: {force.carrier.massDisplay} GeV</div>
                  {force.carrier.count && <div>Types: {force.carrier.count}</div>}
                  <div>Self-interacting: {force.carrier.selfInteracting ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>

            {force.inStandardModel && force.gaugeGroup && (
              <div className="mt-3 p-2 bg-black/5 rounded text-xs">
                <span className="text-black/50">Gauge group:</span>{' '}
                <span className="font-mono font-medium">{force.gaugeGroup}</span>
                <span className="text-black/50 ml-2">Coupling:</span>{' '}
                <span className="font-mono">{force.couplingConstant} ≈ {force.couplingValue.toPrecision(3)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Forces view
function ForcesView({
  selectedForce,
  onSelectForce,
}: {
  selectedForce: Force | null;
  onSelectForce: (f: Force | null) => void;
}) {
  return (
    <div className="space-y-2">
      {FORCES.map(force => (
        <ForceRail
          key={force.id}
          force={force}
          isSelected={selectedForce?.id === force.id}
          onSelect={() => onSelectForce(selectedForce?.id === force.id ? null : force)}
          expanded={selectedForce?.id === force.id}
        />
      ))}
    </div>
  );
}

// Matrix view
function MatrixView({
  selectedForce,
  selectedParticle,
  onSelectForce,
  onSelectParticle,
}: {
  selectedForce: Force | null;
  selectedParticle: Particle | null;
  onSelectForce: (f: Force | null) => void;
  onSelectParticle: (p: Particle | null) => void;
}) {
  const quarks = PARTICLES.filter(p => p.type === 'quark');
  const leptons = PARTICLES.filter(p => p.type === 'lepton');
  const bosons = PARTICLES.filter(p => p.type === 'boson');

  const getInteraction = (particle: Particle, forceId: string): boolean => {
    switch (forceId) {
      case 'strong': return particle.strong;
      case 'electromagnetic': return particle.electromagnetic;
      case 'weak': return particle.weak;
      case 'gravity': return particle.gravity;
      default: return false;
    }
  };

  const renderParticleRow = (particle: Particle) => {
    const isRowSelected = selectedParticle?.id === particle.id;
    const isRowHighlighted = selectedForce ? getInteraction(particle, selectedForce.id) : false;

    return (
      <tr
        key={particle.id}
        onClick={() => onSelectParticle(isRowSelected ? null : particle)}
        className={`cursor-pointer transition-colors ${
          isRowSelected ? 'bg-neutral-200' : isRowHighlighted ? 'bg-neutral-100' : 'hover:bg-neutral-50'
        }`}
      >
        <td className="px-3 py-2 text-sm">
          <span className="font-math text-lg mr-2">{particle.symbol}</span>
          <span className="text-black/60">{particle.name}</span>
        </td>
        {FORCES.map(force => {
          const interacts = getInteraction(particle, force.id);
          const isColSelected = selectedForce?.id === force.id;

          return (
            <td
              key={force.id}
              className={`px-3 py-2 text-center ${isColSelected ? 'bg-black/5' : ''}`}
            >
              {interacts ? (
                <div
                  className="w-4 h-4 rounded-full mx-auto"
                  style={{ backgroundColor: force.color }}
                />
              ) : (
                <div className="w-4 h-4 rounded-full mx-auto border border-black/10" />
              )}
            </td>
          );
        })}
      </tr>
    );
  };

  const renderSection = (title: string, particles: Particle[]) => (
    <>
      <tr className="bg-black/5">
        <td colSpan={5} className="px-3 py-1 text-[10px] uppercase tracking-wider text-black/50">
          {title}
        </td>
      </tr>
      {particles.map(renderParticleRow)}
    </>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-black/10">
            <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-black/50">
              Particle
            </th>
            {FORCES.map(force => (
              <th
                key={force.id}
                onClick={() => onSelectForce(selectedForce?.id === force.id ? null : force)}
                className={`px-3 py-2 text-center cursor-pointer transition-colors ${
                  selectedForce?.id === force.id ? 'bg-black/10' : 'hover:bg-black/5'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: force.color }}
                />
                <div className="text-[10px] uppercase tracking-wider text-black/50">
                  {force.shortName}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderSection('Quarks', quarks)}
          {renderSection('Leptons', leptons)}
          {renderSection('Bosons', bosons)}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-4 p-3 bg-neutral-100 rounded-lg text-xs text-black/60">
        <span className="inline-flex items-center gap-1 mr-4">
          <div className="w-3 h-3 rounded-full bg-neutral-400" /> Interacts
        </span>
        <span className="inline-flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border border-black/20" /> Does not interact
        </span>
        <span className="ml-4 text-black/40">Click row or column to highlight</span>
      </div>
    </div>
  );
}

// Scales view
function ScalesView({
  selectedScale,
  onSelectScale,
}: {
  selectedScale: Scale | null;
  onSelectScale: (s: Scale | null) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Scale visualization */}
      <div className="relative h-16 bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-between px-4">
          {SCALES.map((scale, i) => {
            const isSelected = selectedScale?.id === scale.id;
            const left = (i / (SCALES.length - 1)) * 100;

            return (
              <button
                key={scale.id}
                onClick={() => onSelectScale(isSelected ? null : scale)}
                className={`absolute transform -translate-x-1/2 flex flex-col items-center ${
                  isSelected ? 'z-10' : ''
                }`}
                style={{ left: `${left}%` }}
              >
                <div className={`w-3 h-3 rounded-full border-2 border-white ${
                  isSelected ? 'bg-white' : 'bg-white/50'
                }`} />
                <span className={`text-[8px] text-white font-medium mt-1 whitespace-nowrap ${
                  isSelected ? 'opacity-100' : 'opacity-70'
                }`}>
                  {scale.distanceDisplay}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-[10px] text-black/40 px-2">
        <span>Planck (quantum gravity)</span>
        <span>Human</span>
        <span>Cosmic (galaxies)</span>
      </div>

      {/* Scale cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {SCALES.map(scale => {
          const isSelected = selectedScale?.id === scale.id;
          const dominantForce = getForce(scale.dominantForces[0]);

          return (
            <button
              key={scale.id}
              onClick={() => onSelectScale(isSelected ? null : scale)}
              className={`text-left p-3 rounded-lg border transition-all ${
                isSelected
                  ? 'border-[#e6007e] bg-[#e6007e]/5'
                  : 'border-black/10 hover:border-black/30'
              }`}
            >
              <div className="text-sm font-medium text-black mb-1">{scale.name}</div>
              <div className="text-xs font-mono text-black/50 mb-2">{scale.distanceDisplay}</div>
              {dominantForce && (
                <div className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: dominantForce.color }}
                  />
                  <span className="text-[10px] text-black/60">{dominantForce.shortName}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected scale detail */}
      {selectedScale && (
        <div className="bg-neutral-100 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-medium text-black">{selectedScale.name}</h3>
              <p className="text-sm font-mono text-black/50">{selectedScale.distanceDisplay}</p>
            </div>
            <button
              onClick={() => onSelectScale(null)}
              className="text-xl text-black/30 hover:text-black"
            >
              ×
            </button>
          </div>

          <p className="text-sm text-black/70 mb-4">{selectedScale.description}</p>

          {/* Force dominance at this scale */}
          <div className="mb-4">
            <div className="text-[10px] text-black/50 uppercase mb-2">Force Dominance</div>
            <div className="flex gap-2">
              {selectedScale.dominantForces.map((forceId, i) => {
                const force = getForce(forceId);
                if (!force) return null;

                return (
                  <div
                    key={forceId}
                    className="flex items-center gap-1 px-2 py-1 rounded"
                    style={{
                      backgroundColor: force.color + '20',
                      opacity: 1 - (i * 0.2),
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: force.color }}
                    />
                    <span className="text-xs">{force.shortName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phenomena */}
          <div>
            <div className="text-[10px] text-black/50 uppercase mb-2">Phenomena at This Scale</div>
            <div className="flex flex-wrap gap-2">
              {selectedScale.phenomena.map((p, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-white rounded text-xs text-black/60"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Detail panel
function ForceDetail({
  force,
  onClose,
}: {
  force: Force;
  onClose: () => void;
}) {
  const particles = getParticlesByForce(force.id);

  return (
    <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-black/10 overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: force.color }}
            />
            <div>
              <h3 className="text-xl font-light text-black">{force.name}</h3>
              {!force.inStandardModel && (
                <span className="text-xs text-black/40">Not in Standard Model</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-black/30 hover:text-black leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Key properties */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-neutral-100 rounded-lg p-3">
              <p className="text-[10px] text-black/50 uppercase mb-1">Relative Strength</p>
              <p className="text-xl font-mono font-bold">{force.strengthDisplay}</p>
            </div>
            <div className="bg-neutral-100 rounded-lg p-3">
              <p className="text-[10px] text-black/50 uppercase mb-1">Range</p>
              <p className="text-xl font-mono font-bold">{force.rangeDisplay}</p>
            </div>
          </div>

          {/* Carrier */}
          <div className="bg-neutral-100 rounded-lg p-3">
            <p className="text-[10px] text-black/50 uppercase mb-1">Carrier Particle</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-math">{force.carrier.symbol}</span>
              <div>
                <p className="font-medium">{force.carrier.name}</p>
                <p className="text-xs text-black/50">Mass: {force.carrier.massDisplay} GeV</p>
              </div>
            </div>
          </div>

          {/* Acts on */}
          <div className="bg-neutral-100 rounded-lg p-3">
            <p className="text-[10px] text-black/50 uppercase mb-1">Acts On</p>
            <p className="font-medium">{force.actsOn}</p>
            <p className="text-xs text-black/50">via {force.charge}</p>
          </div>

          {/* Key property */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-[10px] text-blue-700 uppercase mb-1">Key Property</p>
            <p className="text-sm text-blue-900">{force.keyProperty}</p>
          </div>

          {/* Gauge group */}
          {force.inStandardModel && force.gaugeGroup && (
            <div className="bg-neutral-100 rounded-lg p-3">
              <p className="text-[10px] text-black/50 uppercase mb-1">Gauge Group</p>
              <p className="text-xl font-mono font-bold">{force.gaugeGroup}</p>
              <p className="text-xs text-black/50 mt-1">
                Coupling: {force.couplingConstant} ≈ {force.couplingValue.toPrecision(3)}
              </p>
            </div>
          )}

          {/* Effects */}
          <div>
            <p className="text-[10px] text-black/50 uppercase mb-2">Effects</p>
            <ul className="space-y-1">
              {force.effects.map((effect, i) => (
                <li key={i} className="text-sm text-black/70 flex items-start gap-2">
                  <span className="text-black/30">•</span>
                  {effect}
                </li>
              ))}
            </ul>
          </div>

          {/* Particles count */}
          <div className="bg-neutral-100 rounded-lg p-3">
            <p className="text-[10px] text-black/50 uppercase mb-1">Particles Affected</p>
            <p className="text-xl font-mono font-bold">{particles.length}</p>
            <p className="text-xs text-black/50">of 17 in Standard Model</p>
          </div>

          {/* Discovery */}
          <div className="pt-3 border-t border-black/10">
            <p className="text-[10px] text-black/50 uppercase mb-1">Discovery</p>
            <p className="text-sm font-medium">{force.discovery.year}</p>
            <p className="text-xs text-black/60">{force.discovery.event}</p>
            {force.discovery.researchers && (
              <p className="text-xs text-black/40 mt-1">
                {force.discovery.researchers.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function FundamentalForcesChart({ className = '' }: FundamentalForcesChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('forces');
  const [selectedForce, setSelectedForce] = useState<Force | null>(null);
  const [selectedParticle, setSelectedParticle] = useState<Particle | null>(null);
  const [selectedScale, setSelectedScale] = useState<Scale | null>(null);

  // Show detail panel for selected force
  const showDetail = selectedForce && viewMode !== 'forces';

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-black/10 px-4 py-3">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div>
            <h1 className="text-xl font-light text-black">Fundamental Forces</h1>
            <p className="text-sm text-black/50">
              4 forces • 3 in Standard Model • 38 orders of magnitude in strength
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            {(['forces', 'matrix', 'scales'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors uppercase ${
                  viewMode === mode
                    ? 'bg-black text-white'
                    : 'bg-neutral-200 hover:bg-neutral-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          {viewMode === 'forces' && (
            <ForcesView
              selectedForce={selectedForce}
              onSelectForce={setSelectedForce}
            />
          )}

          {viewMode === 'matrix' && (
            <MatrixView
              selectedForce={selectedForce}
              selectedParticle={selectedParticle}
              onSelectForce={setSelectedForce}
              onSelectParticle={setSelectedParticle}
            />
          )}

          {viewMode === 'scales' && (
            <ScalesView
              selectedScale={selectedScale}
              onSelectScale={setSelectedScale}
            />
          )}
        </div>

        {/* Detail panel */}
        {showDetail && selectedForce && (
          <ForceDetail
            force={selectedForce}
            onClose={() => setSelectedForce(null)}
          />
        )}
      </div>

      {/* Unification note */}
      <div className="border-t border-black/10 px-4 py-2 bg-neutral-50">
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-black/50">
          <span className="font-medium">Unification:</span>
          {UNIFICATIONS.map(u => (
            <span
              key={u.name}
              className={`px-2 py-0.5 rounded ${
                u.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-black/5'
              }`}
            >
              {u.name} @ {u.energyDisplay}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
