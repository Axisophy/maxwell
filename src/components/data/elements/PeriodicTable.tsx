'use client';

import React, { useState, useMemo } from 'react';
import { 
  ELEMENTS, 
  Element, 
  ElementCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getElementPosition 
} from './elementsData';
import LensBar, { LensDropdown } from './LensBar';
import ElementDetailPanel, { ElementComparison } from './ElementDetailPanel';

// Lens definitions
const LENSES = [
  { id: 'basics', label: 'Basics', description: 'Name, category, state at STP' },
  { id: 'trends', label: 'Trends', description: 'Electronegativity, atomic radius, etc.' },
  { id: 'structure', label: 'Structure', description: 'Electron configuration' },
  { id: 'presence', label: 'Presence', description: 'Abundance in Earth and cosmos' },
  { id: 'discovery', label: 'Discovery', description: 'Year discovered' },
];

const TREND_OPTIONS = [
  { id: 'electronegativity', label: 'Electronegativity' },
  { id: 'atomicRadius', label: 'Atomic Radius' },
  { id: 'ionizationEnergy', label: 'Ionization Energy' },
  { id: 'electronAffinity', label: 'Electron Affinity' },
  { id: 'meltingPoint', label: 'Melting Point' },
  { id: 'density', label: 'Density' },
];

interface PeriodicTableProps {
  className?: string;
}

export default function PeriodicTable({ className = '' }: PeriodicTableProps) {
  const [activeLens, setActiveLens] = useState('basics');
  const [activeTrend, setActiveTrend] = useState('electronegativity');
  const [trendDropdownOpen, setTrendDropdownOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [compareElement, setCompareElement] = useState<Element | null>(null);
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);

  // Calculate min/max for trend colouring
  const trendRange = useMemo(() => {
    const values = ELEMENTS
      .map(e => (e as any)[activeTrend])
      .filter(v => v !== null && v !== undefined) as number[];
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [activeTrend]);

  // Get colour for trend value
  const getTrendColor = (value: number | null): string => {
    if (value === null || value === undefined) return 'bg-black/5';
    const normalized = (value - trendRange.min) / (trendRange.max - trendRange.min);
    // Blue to yellow gradient
    if (normalized < 0.25) return 'bg-blue-200';
    if (normalized < 0.5) return 'bg-blue-100';
    if (normalized < 0.75) return 'bg-amber-100';
    return 'bg-amber-200';
  };

  // Get discovery colour
  const getDiscoveryColor = (year: number | null): string => {
    if (year === null) return 'bg-black/20'; // Ancient/unknown
    if (year < 1800) return 'bg-amber-100';
    if (year < 1900) return 'bg-emerald-100';
    if (year < 1950) return 'bg-blue-100';
    return 'bg-violet-100';
  };

  // Handle lens change
  const handleLensChange = (id: string) => {
    if (id === 'trends') {
      setTrendDropdownOpen(true);
    } else {
      setActiveLens(id);
      setTrendDropdownOpen(false);
    }
  };

  // Handle trend selection
  const handleTrendChange = (id: string) => {
    setActiveTrend(id);
    setActiveLens('trends');
  };

  // Handle element click
  const handleElementClick = (element: Element) => {
    setSelectedElement(element);
  };

  // Handle compare
  const handleCompare = (element: Element) => {
    if (compareElement?.atomicNumber === element.atomicNumber) {
      setCompareElement(null);
    } else {
      setCompareElement(element);
    }
  };

  // Render element tile
  const renderElement = (element: Element) => {
    const position = getElementPosition(element);
    const categoryColor = CATEGORY_COLORS[element.category];
    const isSelected = selectedElement?.atomicNumber === element.atomicNumber;
    const isCompare = compareElement?.atomicNumber === element.atomicNumber;
    const isHovered = hoveredElement?.atomicNumber === element.atomicNumber;

    // Determine background based on lens
    let bgClass = 'bg-white';
    if (activeLens === 'trends') {
      bgClass = getTrendColor((element as any)[activeTrend]);
    } else if (activeLens === 'discovery') {
      bgClass = getDiscoveryColor(element.discoveryYear);
    } else if (activeLens === 'basics') {
      // Subtle category tint
      bgClass = categoryColor.bg.replace('/20', '/10');
    }

    // State indicator for basics lens
    const stateIndicator = activeLens === 'basics' && (
      <span className={`
        absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full
        ${element.stateAtSTP === 'solid' ? 'bg-gray-600' : ''}
        ${element.stateAtSTP === 'liquid' ? 'bg-blue-500' : ''}
        ${element.stateAtSTP === 'gas' ? 'bg-gray-300 border border-gray-400' : ''}
      `} />
    );

    return (
      <button
        key={element.atomicNumber}
        onClick={() => handleElementClick(element)}
        onMouseEnter={() => setHoveredElement(element)}
        onMouseLeave={() => setHoveredElement(null)}
        className={`
          relative aspect-square p-1 rounded transition-all
          ${bgClass}
          ${isSelected ? 'ring-2 ring-[#e6007e] ring-offset-1' : ''}
          ${isCompare ? 'ring-2 ring-amber-400 ring-offset-1' : ''}
          ${isHovered && !isSelected ? 'ring-1 ring-black/20' : ''}
          hover:shadow-md
        `}
        style={{
          gridRow: position.row,
          gridColumn: position.col,
        }}
      >
        {/* Atomic number */}
        <span className="absolute top-0.5 left-1 text-[8px] text-black/40 font-mono">
          {element.atomicNumber}
        </span>
        
        {/* Symbol */}
        <span className="block text-sm md:text-base font-bold text-black mt-2">
          {element.symbol}
        </span>
        
        {/* Name on basics lens */}
        {activeLens === 'basics' && (
          <span className="block text-[7px] text-black/50 truncate leading-tight">
            {element.name}
          </span>
        )}
        
        {/* Trend value */}
        {activeLens === 'trends' && (element as any)[activeTrend] !== null && (
          <span className="block text-[8px] text-black/60 font-mono">
            {typeof (element as any)[activeTrend] === 'number' 
              ? (element as any)[activeTrend].toFixed(activeTrend === 'density' ? 1 : 2)
              : (element as any)[activeTrend]
            }
          </span>
        )}
        
        {/* Electron config on structure lens */}
        {activeLens === 'structure' && (
          <span className="block text-[6px] text-black/50 truncate">
            {element.electronConfigurationSemantic.split(' ').pop()}
          </span>
        )}
        
        {/* Discovery year */}
        {activeLens === 'discovery' && (
          <span className="block text-[8px] text-black/60 font-mono">
            {element.discoveryYear || '?'}
          </span>
        )}
        
        {stateIndicator}
      </button>
    );
  };

  return (
    <div className={`${className}`}>
      {/* Lens Bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-black/40 uppercase tracking-wider mr-2">Lens</span>
        
        {LENSES.map((lens) => {
          if (lens.id === 'trends') {
            return (
              <LensDropdown
                key={lens.id}
                label="Trends"
                options={TREND_OPTIONS}
                active={activeLens === 'trends' ? activeTrend : ''}
                onChange={handleTrendChange}
                isOpen={trendDropdownOpen}
                onToggle={() => setTrendDropdownOpen(!trendDropdownOpen)}
                variant="light"
              />
            );
          }
          return (
            <button
              key={lens.id}
              onClick={() => handleLensChange(lens.id)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg transition-colors uppercase tracking-wide
                ${activeLens === lens.id
                  ? 'bg-black text-white'
                  : 'bg-black/5 text-black/60 hover:text-black hover:bg-black/10'
                }
              `}
              title={lens.description}
            >
              {lens.label}
            </button>
          );
        })}
      </div>

      {/* Legend for trends */}
      {activeLens === 'trends' && (
        <div className="mb-4 flex items-center gap-4 text-xs text-black/60">
          <span>{TREND_OPTIONS.find(t => t.id === activeTrend)?.label}:</span>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-blue-200 rounded" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-amber-200 rounded" />
            <span>High</span>
          </div>
          <span className="text-black/40">
            Range: {trendRange.min.toFixed(2)} – {trendRange.max.toFixed(2)}
          </span>
        </div>
      )}

      {/* Legend for discovery */}
      {activeLens === 'discovery' && (
        <div className="mb-4 flex items-center gap-4 text-xs text-black/60">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-black/20 rounded" />
            <span>Ancient</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-amber-100 rounded" />
            <span>Pre-1800</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-emerald-100 rounded" />
            <span>1800s</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-blue-100 rounded" />
            <span>Early 1900s</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-violet-100 rounded" />
            <span>Post-1950</span>
          </div>
        </div>
      )}

      {/* Category legend for basics */}
      {activeLens === 'basics' && (
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
          {Object.entries(CATEGORY_LABELS).slice(0, 6).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded ${CATEGORY_COLORS[key as ElementCategory].bg}`} />
              <span className="text-black/50">{label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        {/* Main Table */}
        <div className="flex-1 overflow-x-auto">
          {/* Periodic Table Grid */}
          <div 
            className="grid gap-0.5 min-w-[800px]"
            style={{
              gridTemplateColumns: 'repeat(18, minmax(36px, 1fr))',
              gridTemplateRows: 'repeat(9, minmax(36px, auto))',
            }}
          >
            {/* Group labels */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(group => (
              <div 
                key={`group-${group}`}
                className="text-[9px] text-black/30 text-center"
                style={{ gridRow: 0, gridColumn: group }}
              >
                {group}
              </div>
            ))}

            {/* Main table elements (periods 1-7) */}
            {ELEMENTS.filter(e => e.period <= 7 && (e.atomicNumber < 57 || e.atomicNumber > 71) && (e.atomicNumber < 89 || e.atomicNumber > 103))
              .map(renderElement)}

            {/* Lanthanide placeholder */}
            <div 
              className="text-[8px] text-black/30 flex items-center justify-center"
              style={{ gridRow: 6, gridColumn: 3 }}
            >
              57-71
            </div>

            {/* Actinide placeholder */}
            <div 
              className="text-[8px] text-black/30 flex items-center justify-center"
              style={{ gridRow: 7, gridColumn: 3 }}
            >
              89-103
            </div>

            {/* Lanthanides (row 8) */}
            {ELEMENTS.filter(e => e.atomicNumber >= 57 && e.atomicNumber <= 71)
              .map(renderElement)}

            {/* Actinides (row 9) */}
            {ELEMENTS.filter(e => e.atomicNumber >= 89 && e.atomicNumber <= 103)
              .map(renderElement)}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedElement && !compareElement && (
          <div className="w-80 flex-shrink-0">
            <ElementDetailPanel
              element={selectedElement}
              onClose={() => setSelectedElement(null)}
              onCompare={handleCompare}
              compareElement={compareElement}
            />
          </div>
        )}

        {/* Comparison Panel */}
        {selectedElement && compareElement && selectedElement.atomicNumber !== compareElement.atomicNumber && (
          <div className="w-80 flex-shrink-0 space-y-4">
            <ElementComparison
              element1={compareElement}
              element2={selectedElement}
              onClear={() => setCompareElement(null)}
            />
          </div>
        )}
      </div>

      {/* Hover tooltip */}
      {hoveredElement && !selectedElement && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-xl text-sm z-50">
          <span className="font-bold">{hoveredElement.symbol}</span>
          <span className="mx-2">·</span>
          <span>{hoveredElement.name}</span>
          <span className="mx-2">·</span>
          <span className="text-white/60">{CATEGORY_LABELS[hoveredElement.category]}</span>
        </div>
      )}
    </div>
  );
}
