'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  PARTICLES,
  CHART_LAYOUT,
  INTERACTION_COLORS,
  DISCOVERY_TIMELINE,
  massToLogScale,
  getParticle,
  type Particle,
} from './standardModelData';

type ViewMode = 'chart' | 'ledger' | 'timeline';
type InteractionOverlay = 'electromagnetic' | 'weak' | 'strong' | 'higgs' | null;

interface StandardModelChartProps {
  className?: string;
}

// Particle chip component for the wall chart
function ParticleChip({
  particle,
  isHighlighted,
  isDimmed,
  isSelected,
  onClick,
  showMassBar,
}: {
  particle: Particle;
  isHighlighted: boolean;
  isDimmed: boolean;
  isSelected: boolean;
  onClick: () => void;
  showMassBar: boolean;
}) {
  const massPosition = massToLogScale(particle.mass);

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full aspect-square p-2 rounded-lg transition-all duration-200
        flex flex-col items-center justify-center text-center
        ${isSelected
          ? 'bg-white text-black ring-2 ring-[#e6007e]'
          : isDimmed
            ? 'bg-neutral-800 text-white/30'
            : isHighlighted
              ? 'bg-white text-black'
              : 'bg-neutral-900 text-white hover:bg-neutral-800'
        }
      `}
    >
      {/* Symbol */}
      <span className="font-math text-2xl md:text-3xl leading-none">
        {particle.symbol}
      </span>

      {/* Name */}
      <span className="text-[9px] md:text-[10px] text-current opacity-60 mt-1 leading-tight">
        {particle.name}
      </span>

      {/* Mass (log scale bar) */}
      {showMassBar && particle.mass > 0 && (
        <div className="absolute bottom-1 left-1 right-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/40 rounded-full transition-all duration-300"
            style={{ width: `${massPosition * 100}%` }}
          />
        </div>
      )}

      {/* Charge indicator */}
      <span className={`
        absolute top-1 right-1.5 text-[9px] font-mono leading-none
        ${isSelected || isHighlighted ? 'text-black/50' : 'text-white/40'}
      `}>
        {particle.chargeDisplay}
      </span>
    </button>
  );
}

// Get positions for interaction lines
function getParticlePosition(particleId: string): { x: number; y: number } | null {
  const allPositions = [
    ...CHART_LAYOUT.quarks,
    ...CHART_LAYOUT.leptons,
    ...CHART_LAYOUT.gaugeBosons,
    ...CHART_LAYOUT.scalarBoson,
  ];

  const pos = allPositions.find(p => p.id === particleId);
  if (!pos) return null;

  // Convert grid position to center coordinates (assuming 6 columns, 3 rows)
  // Each cell is ~16.66% wide, ~33% tall
  const cellWidth = 100 / 6;
  const cellHeight = 100 / 3;

  return {
    x: (pos.col + 0.5) * cellWidth,
    y: (pos.row + 0.5) * cellHeight,
  };
}

// Interaction lines SVG overlay
function InteractionLines({
  overlay,
  particles
}: {
  overlay: InteractionOverlay;
  particles: Particle[];
}) {
  if (!overlay) return null;

  const interactingParticles = particles.filter(p => p[overlay]);
  const color = INTERACTION_COLORS[overlay];

  // Generate lines between particles that share this interaction
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];

  for (let i = 0; i < interactingParticles.length; i++) {
    for (let j = i + 1; j < interactingParticles.length; j++) {
      const pos1 = getParticlePosition(interactingParticles[i].id);
      const pos2 = getParticlePosition(interactingParticles[j].id);

      if (pos1 && pos2) {
        lines.push({ x1: pos1.x, y1: pos1.y, x2: pos2.x, y2: pos2.y });
      }
    }
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-0"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {lines.map((line, i) => (
        <line
          key={i}
          x1={`${line.x1}%`}
          y1={`${line.y1}%`}
          x2={`${line.x2}%`}
          y2={`${line.y2}%`}
          stroke={color}
          strokeWidth="0.3"
          strokeOpacity="0.3"
        />
      ))}
    </svg>
  );
}

// Detail panel for selected particle
function ParticleDetail({
  particle,
  onClose
}: {
  particle: Particle;
  onClose: () => void;
}) {
  return (
    <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-black/10 overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-math text-5xl">{particle.symbol}</span>
              <span className="text-2xl font-light text-black/60">{particle.chargeDisplay}</span>
            </div>
            <p className="text-xl font-light text-black mt-1">{particle.name}</p>
            <p className="text-sm text-black/50 capitalize">{particle.type.replace('-', ' ')}</p>
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
              <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Mass</p>
              <p className="text-lg font-mono font-bold">{particle.massDisplay}</p>
            </div>
            <div className="bg-neutral-100 rounded-lg p-3">
              <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Spin</p>
              <p className="text-lg font-mono font-bold">{particle.spinDisplay}</p>
            </div>
            <div className="bg-neutral-100 rounded-lg p-3">
              <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Charge</p>
              <p className="text-lg font-mono font-bold">{particle.chargeDisplay}</p>
            </div>
            {particle.generation && (
              <div className="bg-neutral-100 rounded-lg p-3">
                <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Generation</p>
                <p className="text-lg font-mono font-bold">{particle.generation}</p>
              </div>
            )}
          </div>

          {/* Interactions */}
          <div className="bg-neutral-100 rounded-lg p-3">
            <p className="text-[10px] text-black/50 uppercase tracking-wider mb-2">Interactions</p>
            <div className="flex flex-wrap gap-2">
              {particle.electromagnetic && (
                <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: `${INTERACTION_COLORS.electromagnetic}20`, color: INTERACTION_COLORS.electromagnetic }}>
                  Electromagnetic
                </span>
              )}
              {particle.weak && (
                <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: `${INTERACTION_COLORS.weak}20`, color: INTERACTION_COLORS.weak }}>
                  Weak
                </span>
              )}
              {particle.strong && (
                <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: `${INTERACTION_COLORS.strong}20`, color: INTERACTION_COLORS.strong }}>
                  Strong
                </span>
              )}
              {particle.higgs && (
                <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: `${INTERACTION_COLORS.higgs}20`, color: INTERACTION_COLORS.higgs }}>
                  Higgs
                </span>
              )}
            </div>
          </div>

          {/* Discovery */}
          <div className="bg-neutral-100 rounded-lg p-3">
            <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Discovery</p>
            <p className="text-lg font-bold">{particle.discoveredYear}</p>
            <p className="text-sm text-black/60">{particle.discoveredAt}</p>
            {particle.discoveredBy && (
              <p className="text-xs text-black/40 mt-1">{particle.discoveredBy}</p>
            )}
          </div>

          {/* Lifetime (if unstable) */}
          {particle.lifetime && (
            <div className="bg-neutral-100 rounded-lg p-3">
              <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Lifetime</p>
              <p className="text-lg font-mono font-bold">{particle.lifetime}</p>
            </div>
          )}

          {/* Antiparticle */}
          <div className="bg-neutral-100 rounded-lg p-3">
            <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Antiparticle</p>
            <p className="text-sm">{particle.antiparticle}</p>
          </div>

          {/* Notes */}
          {particle.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-[10px] text-blue-700 uppercase tracking-wider mb-1">Notes</p>
              <p className="text-sm text-blue-900">{particle.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Ledger view (sortable table)
function LedgerView({
  particles,
  selectedParticle,
  onSelectParticle,
  overlay,
}: {
  particles: Particle[];
  selectedParticle: Particle | null;
  onSelectParticle: (p: Particle) => void;
  overlay: InteractionOverlay;
}) {
  const [sortBy, setSortBy] = useState<'name' | 'mass' | 'charge' | 'discovered'>('mass');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sortedParticles = useMemo(() => {
    const sorted = [...particles].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'mass':
          return a.mass - b.mass;
        case 'charge':
          return a.charge - b.charge;
        case 'discovered':
          return a.discoveredYear - b.discoveredYear;
        default:
          return 0;
      }
    });
    return sortDir === 'desc' ? sorted.reverse() : sorted;
  }, [particles, sortBy, sortDir]);

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('desc');
    }
  };

  const SortHeader = ({ col, children }: { col: typeof sortBy; children: React.ReactNode }) => (
    <th
      onClick={() => handleSort(col)}
      className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-black/50 cursor-pointer hover:text-black"
    >
      {children}
      {sortBy === col && (
        <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
      )}
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-black/10">
          <tr>
            <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-black/50">Particle</th>
            <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-black/50">Type</th>
            <SortHeader col="mass">Mass</SortHeader>
            <SortHeader col="charge">Charge</SortHeader>
            <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-black/50">Spin</th>
            <th className="px-3 py-2 text-center text-[10px] uppercase tracking-wider text-black/50">EM</th>
            <th className="px-3 py-2 text-center text-[10px] uppercase tracking-wider text-black/50">Weak</th>
            <th className="px-3 py-2 text-center text-[10px] uppercase tracking-wider text-black/50">Strong</th>
            <SortHeader col="discovered">Discovered</SortHeader>
          </tr>
        </thead>
        <tbody>
          {sortedParticles.map(p => {
            const isDimmed = overlay && !p[overlay];
            const isHighlighted = overlay && p[overlay];

            return (
              <tr
                key={p.id}
                onClick={() => onSelectParticle(p)}
                className={`
                  border-b border-black/5 cursor-pointer transition-colors
                  ${selectedParticle?.id === p.id
                    ? 'bg-neutral-200'
                    : isDimmed
                      ? 'opacity-30'
                      : 'hover:bg-neutral-100'
                  }
                `}
              >
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-math text-lg">{p.symbol}</span>
                    <span className="text-black/60">{p.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-black/60 capitalize text-xs">{p.type.replace('-', ' ')}</td>
                <td className="px-3 py-2 font-mono text-xs">{p.massDisplay}</td>
                <td className="px-3 py-2 font-mono">{p.chargeDisplay}</td>
                <td className="px-3 py-2 font-mono">{p.spinDisplay}</td>
                <td className="px-3 py-2 text-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${p.electromagnetic ? '' : 'opacity-20'}`}
                    style={{ backgroundColor: p.electromagnetic ? INTERACTION_COLORS.electromagnetic : '#ccc' }}
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${p.weak ? '' : 'opacity-20'}`}
                    style={{ backgroundColor: p.weak ? INTERACTION_COLORS.weak : '#ccc' }}
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${p.strong ? '' : 'opacity-20'}`}
                    style={{ backgroundColor: p.strong ? INTERACTION_COLORS.strong : '#ccc' }}
                  />
                </td>
                <td className="px-3 py-2 font-mono text-xs">{p.discoveredYear}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Timeline view
function TimelineView({
  onSelectParticle
}: {
  onSelectParticle: (p: Particle) => void;
}) {
  return (
    <div className="p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-black/20" />

          {/* Timeline events */}
          <div className="space-y-6">
            {DISCOVERY_TIMELINE.map((event, i) => (
              <div key={i} className="relative pl-12 md:pl-20">
                {/* Year marker */}
                <div className="absolute left-0 w-8 md:w-16 text-right">
                  <span className="font-mono text-sm md:text-base font-bold">{event.year}</span>
                </div>

                {/* Dot */}
                <div className="absolute left-[14px] md:left-[30px] w-2 h-2 bg-black rounded-full mt-2" />

                {/* Content */}
                <div className="bg-neutral-100 rounded-lg p-3 md:p-4">
                  <p className="text-sm md:text-base text-black/80 mb-2">{event.event}</p>
                  <div className="flex flex-wrap gap-2">
                    {event.particles.map(pid => {
                      const p = getParticle(pid);
                      if (!p) return null;
                      return (
                        <button
                          key={pid}
                          onClick={() => onSelectParticle(p)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-black/10 hover:border-black/30 transition-colors"
                        >
                          <span className="font-math text-lg">{p.symbol}</span>
                          <span className="text-xs text-black/60">{p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function StandardModelChart({ className = '' }: StandardModelChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [selectedParticle, setSelectedParticle] = useState<Particle | null>(null);
  const [overlay, setOverlay] = useState<InteractionOverlay>(null);
  const [showMassBar, setShowMassBar] = useState(true);

  const handleSelectParticle = useCallback((p: Particle) => {
    setSelectedParticle(p);
  }, []);

  const isParticleHighlighted = useCallback((p: Particle) => {
    return overlay ? p[overlay] : false;
  }, [overlay]);

  const isParticleDimmed = useCallback((p: Particle) => {
    return overlay ? !p[overlay] : false;
  }, [overlay]);

  const renderParticleGrid = (positions: typeof CHART_LAYOUT.quarks, label: string) => (
    <div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2 px-1">{label}</div>
      <div className="grid grid-cols-2 gap-1">
        {positions.map(pos => {
          const particle = getParticle(pos.id);
          if (!particle) return null;
          return (
            <ParticleChip
              key={pos.id}
              particle={particle}
              isHighlighted={isParticleHighlighted(particle)}
              isDimmed={isParticleDimmed(particle)}
              isSelected={selectedParticle?.id === particle.id}
              onClick={() => handleSelectParticle(particle)}
              showMassBar={showMassBar}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-black/10 px-4 py-3">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div>
            <h1 className="text-xl font-light text-black">The Standard Model</h1>
            <p className="text-sm text-black/50">
              17 fundamental particles • 4 forces
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            {(['chart', 'ledger', 'timeline'] as ViewMode[]).map(mode => (
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

      {/* Controls (for chart view) */}
      {viewMode === 'chart' && (
        <div className="border-b border-black/10 px-4 py-2">
          <div className="flex flex-wrap items-center gap-4">
            {/* Interaction overlays */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-black/50">Show:</span>
              {(['electromagnetic', 'weak', 'strong', 'higgs'] as const).map(int => (
                <button
                  key={int}
                  onClick={() => setOverlay(overlay === int ? null : int)}
                  className={`px-2 py-1 text-xs rounded transition-colors capitalize ${
                    overlay === int
                      ? 'text-white'
                      : 'bg-neutral-200 hover:bg-neutral-300'
                  }`}
                  style={overlay === int ? { backgroundColor: INTERACTION_COLORS[int] } : {}}
                >
                  {int}
                </button>
              ))}
            </div>

            {/* Mass bar toggle */}
            <button
              onClick={() => setShowMassBar(!showMassBar)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                showMassBar ? 'bg-black text-white' : 'bg-neutral-200'
              }`}
            >
              Mass scale
            </button>
          </div>
        </div>
      )}

      {/* Ledger controls */}
      {viewMode === 'ledger' && (
        <div className="border-b border-black/10 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-black/50">Highlight:</span>
            {(['electromagnetic', 'weak', 'strong', 'higgs'] as const).map(int => (
              <button
                key={int}
                onClick={() => setOverlay(overlay === int ? null : int)}
                className={`px-2 py-1 text-xs rounded transition-colors capitalize ${
                  overlay === int
                    ? 'text-white'
                    : 'bg-neutral-200 hover:bg-neutral-300'
                }`}
                style={overlay === int ? { backgroundColor: INTERACTION_COLORS[int] } : {}}
              >
                {int}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Chart area */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'chart' && (
            <div className="p-4 md:p-6">
              <div className="max-w-3xl mx-auto">
                {/* Wall chart */}
                <div className="relative bg-black rounded-xl p-4 md:p-6">
                  {/* Interaction lines overlay */}
                  <InteractionLines overlay={overlay} particles={PARTICLES} />

                  {/* Grid layout */}
                  <div className="relative z-10 grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
                    {/* Fermions section */}
                    <div className="col-span-2 md:col-span-4">
                      <div className="text-xs text-white/30 uppercase tracking-wider mb-3">Fermions</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Quarks */}
                        {renderParticleGrid(CHART_LAYOUT.quarks, 'Quarks')}

                        {/* Leptons */}
                        {renderParticleGrid(CHART_LAYOUT.leptons, 'Leptons')}
                      </div>

                      {/* Generation labels */}
                      <div className="hidden md:flex justify-around mt-3 text-[10px] text-white/30">
                        <span>I</span>
                        <span>II</span>
                        <span>III</span>
                      </div>
                    </div>

                    {/* Bosons section */}
                    <div className="col-span-2">
                      <div className="text-xs text-white/30 uppercase tracking-wider mb-3">Bosons</div>
                      <div className="space-y-4">
                        {/* Gauge bosons */}
                        {renderParticleGrid(CHART_LAYOUT.gaugeBosons, 'Gauge')}

                        {/* Scalar boson (Higgs) */}
                        <div>
                          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2 px-1">Scalar</div>
                          <div className="grid grid-cols-2 gap-1">
                            {CHART_LAYOUT.scalarBoson.map(pos => {
                              const particle = getParticle(pos.id);
                              if (!particle) return null;
                              return (
                                <ParticleChip
                                  key={pos.id}
                                  particle={particle}
                                  isHighlighted={isParticleHighlighted(particle)}
                                  isDimmed={isParticleDimmed(particle)}
                                  isSelected={selectedParticle?.id === particle.id}
                                  onClick={() => handleSelectParticle(particle)}
                                  showMassBar={showMassBar}
                                />
                              );
                            })}
                            {/* Empty cell to maintain grid */}
                            <div />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mass scale legend */}
                  {showMassBar && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4 text-[10px] text-white/40">
                        <span>Mass scale (log):</span>
                        <div className="flex-1 flex items-center gap-2 max-w-xs">
                          <span>~eV</span>
                          <div className="flex-1 h-1 bg-white/20 rounded-full">
                            <div className="h-full w-1/2 bg-white/40 rounded-full" />
                          </div>
                          <span>~100 GeV</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interaction legend */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-black/50">
                  <span>Interactions:</span>
                  {Object.entries(INTERACTION_COLORS).map(([key, color]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                      <span className="capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'ledger' && (
            <LedgerView
              particles={PARTICLES}
              selectedParticle={selectedParticle}
              onSelectParticle={handleSelectParticle}
              overlay={overlay}
            />
          )}

          {viewMode === 'timeline' && (
            <TimelineView onSelectParticle={handleSelectParticle} />
          )}
        </div>

        {/* Detail panel */}
        {selectedParticle && (
          <ParticleDetail
            particle={selectedParticle}
            onClose={() => setSelectedParticle(null)}
          />
        )}
      </div>
    </div>
  );
}
