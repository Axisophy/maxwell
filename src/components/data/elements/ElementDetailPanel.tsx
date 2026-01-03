'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Element, 
  CATEGORY_LABELS, 
  CATEGORY_COLORS,
  formatTemperature,
  formatAtomicMass 
} from './elementsData';
import SpecStrip from './SpecStrip';

interface ElementDetailPanelProps {
  element: Element;
  onClose: () => void;
  onCompare?: (element: Element) => void;
  compareElement?: Element | null;
}

export default function ElementDetailPanel({ 
  element, 
  onClose,
  onCompare,
  compareElement 
}: ElementDetailPanelProps) {
  const [showIsotopes, setShowIsotopes] = useState(false);
  const [tempUnit, setTempUnit] = useState<'K' | 'C'>('C');

  const categoryColor = CATEGORY_COLORS[element.category];

  // Build spec strip properties
  const specProperties = [
    { 
      label: 'MP', 
      value: element.meltingPoint 
        ? (tempUnit === 'C' ? Math.round(element.meltingPoint - 273.15) : element.meltingPoint)
        : null,
      unit: tempUnit === 'C' ? '°C' : 'K'
    },
    { 
      label: 'BP', 
      value: element.boilingPoint 
        ? (tempUnit === 'C' ? Math.round(element.boilingPoint - 273.15) : element.boilingPoint)
        : null,
      unit: tempUnit === 'C' ? '°C' : 'K'
    },
    { label: 'EN', value: element.electronegativity, unit: '' },
    { label: 'AR', value: element.atomicRadius, unit: 'pm' },
    { label: 'IE₁', value: element.ionizationEnergy, unit: 'kJ/mol' },
    { label: 'ρ', value: element.density ? element.density.toFixed(2) : null, unit: 'g/cm³' },
  ];

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-xl border border-black/10">
      {/* Header */}
      <div className="p-4 border-b border-black/10">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Element symbol */}
            <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${categoryColor.bg}`}>
              <span className="text-2xl font-bold text-black">{element.symbol}</span>
              <span className="text-[10px] text-black/60">{element.atomicNumber}</span>
            </div>
            
            {/* Name and category */}
            <div>
              <h2 className="text-2xl font-light text-black uppercase">{element.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs ${categoryColor.text} ${categoryColor.bg} px-2 py-0.5 rounded`}>
                  {CATEGORY_LABELS[element.category]}
                </span>
                {element.group && (
                  <span className="text-xs text-black/40">
                    Group {element.group} · Period {element.period}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded transition-colors"
          >
            <svg className="w-5 h-5 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Atomic mass */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-sm text-black/40">Atomic Mass</span>
          <span className="font-mono text-lg font-bold text-black">
            {formatAtomicMass(element.atomicMass)}
          </span>
          <span className="text-xs text-black/40">u</span>
        </div>
      </div>

      {/* Spec Strip */}
      <div className="p-4 border-b border-black/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-black/40 uppercase tracking-wider">Key Properties</span>
          <button
            onClick={() => setTempUnit(tempUnit === 'C' ? 'K' : 'C')}
            className="text-[10px] text-black/40 hover:text-black transition-colors"
          >
            Show in {tempUnit === 'C' ? 'K' : '°C'}
          </button>
        </div>
        <SpecStrip properties={specProperties} variant="compact" />
      </div>

      {/* Electron Configuration */}
      <div className="p-4 border-b border-black/10">
        <div className="text-[10px] text-black/40 uppercase tracking-wider mb-2">
          Electron Configuration
        </div>
        <div className="font-mono text-sm text-black">
          {element.electronConfiguration}
        </div>
        <div className="text-xs text-black/40 mt-1">
          Block: {element.block.toUpperCase()}
        </div>
      </div>

      {/* Oxidation States */}
      {element.oxidationStates.length > 0 && (
        <div className="p-4 border-b border-black/10">
          <div className="text-[10px] text-black/40 uppercase tracking-wider mb-2">
            Common Oxidation States
          </div>
          <div className="flex flex-wrap gap-1">
            {element.oxidationStates.map((state, i) => (
              <span 
                key={i}
                className={`
                  font-mono text-xs px-2 py-0.5 rounded
                  ${state > 0 ? 'bg-blue-100 text-blue-700' : state < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}
                `}
              >
                {state > 0 ? `+${state}` : state}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* State at STP */}
      <div className="p-4 border-b border-black/10">
        <div className="text-[10px] text-black/40 uppercase tracking-wider mb-2">
          State at STP
        </div>
        <div className="flex items-center gap-2">
          <span className={`
            w-3 h-3 rounded-full
            ${element.stateAtSTP === 'solid' ? 'bg-gray-600' : ''}
            ${element.stateAtSTP === 'liquid' ? 'bg-blue-500' : ''}
            ${element.stateAtSTP === 'gas' ? 'bg-gray-300 border border-gray-400' : ''}
          `} />
          <span className="text-sm text-black capitalize">{element.stateAtSTP}</span>
        </div>
      </div>

      {/* Discovery */}
      {element.discoveryYear && (
        <div className="p-4 border-b border-black/10">
          <div className="text-[10px] text-black/40 uppercase tracking-wider mb-2">
            Discovery
          </div>
          <div className="text-sm text-black">
            {element.discoveryYear}
            {element.discoveredBy && (
              <span className="text-black/60"> · {element.discoveredBy}</span>
            )}
          </div>
        </div>
      )}

      {/* Abundance */}
      {(element.abundance.earth || element.abundance.universe) && (
        <div className="p-4 border-b border-black/10">
          <div className="text-[10px] text-black/40 uppercase tracking-wider mb-2">
            Abundance
          </div>
          <div className="grid grid-cols-2 gap-4">
            {element.abundance.earth && (
              <div>
                <div className="text-xs text-black/40">Earth's Crust</div>
                <div className="font-mono text-sm text-black">
                  {element.abundance.earth >= 1 
                    ? `${element.abundance.earth.toLocaleString()} ppm`
                    : `${element.abundance.earth} ppm`
                  }
                </div>
              </div>
            )}
            {element.abundance.universe && (
              <div>
                <div className="text-xs text-black/40">Universe</div>
                <div className="font-mono text-sm text-black">
                  {element.abundance.universe >= 1 
                    ? `${element.abundance.universe.toLocaleString()}`
                    : element.abundance.universe
                  }
                  <span className="text-black/40 text-xs ml-1">(rel. to Si)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex flex-wrap gap-2">
        {onCompare && (
          <button
            onClick={() => onCompare(element)}
            className={`
              px-3 py-1.5 text-xs font-medium rounded transition-colors
              ${compareElement?.atomicNumber === element.atomicNumber
                ? 'bg-[#e6007e] text-white'
                : 'bg-black/5 text-black/60 hover:bg-black/10 hover:text-black'
              }
            `}
          >
            {compareElement?.atomicNumber === element.atomicNumber ? 'Pinned' : 'Pin to Compare'}
          </button>
        )}
        <Link
          href={`/data/elements/nuclides?element=${element.symbol}`}
          className="px-3 py-1.5 text-xs font-medium rounded bg-black/5 text-black/60 hover:bg-black/10 hover:text-black transition-colors"
        >
          View Isotopes →
        </Link>
      </div>
    </div>
  );
}

// Comparison panel when two elements are pinned
interface ElementComparisonProps {
  element1: Element;
  element2: Element;
  onClear: () => void;
}

export function ElementComparison({ element1, element2, onClear }: ElementComparisonProps) {
  const [tempUnit, setTempUnit] = useState<'K' | 'C'>('C');

  const properties = [
    { key: 'atomicNumber', label: 'Atomic Number', unit: '' },
    { key: 'atomicMass', label: 'Atomic Mass', unit: 'u' },
    { key: 'electronegativity', label: 'Electronegativity', unit: '' },
    { key: 'atomicRadius', label: 'Atomic Radius', unit: 'pm' },
    { key: 'ionizationEnergy', label: '1st Ionization', unit: 'kJ/mol' },
    { key: 'meltingPoint', label: 'Melting Point', unit: tempUnit === 'C' ? '°C' : 'K' },
    { key: 'boilingPoint', label: 'Boiling Point', unit: tempUnit === 'C' ? '°C' : 'K' },
    { key: 'density', label: 'Density', unit: 'g/cm³' },
  ];

  const getValue = (element: Element, key: string): string => {
    const value = (element as any)[key];
    if (value === null || value === undefined) return '—';
    
    if (key === 'meltingPoint' || key === 'boilingPoint') {
      if (tempUnit === 'C') return Math.round(value - 273.15).toString();
      return value.toString();
    }
    
    if (key === 'atomicMass') return formatAtomicMass(value);
    if (key === 'density') return value.toFixed(2);
    
    return value.toString();
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-xl border border-black/10">
      <div className="p-4 border-b border-black/10 flex items-center justify-between">
        <h3 className="text-sm font-medium text-black uppercase">Element Comparison</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTempUnit(tempUnit === 'C' ? 'K' : 'C')}
            className="text-[10px] text-black/40 hover:text-black transition-colors"
          >
            Temp: {tempUnit}
          </button>
          <button
            onClick={onClear}
            className="text-xs text-black/40 hover:text-black transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-black/5">
        {/* Header row */}
        <div className="grid grid-cols-3 text-xs">
          <div className="p-2 text-black/40"></div>
          <div className="p-2 text-center">
            <span className="font-bold text-lg">{element1.symbol}</span>
            <span className="block text-[10px] text-black/40">{element1.name}</span>
          </div>
          <div className="p-2 text-center">
            <span className="font-bold text-lg">{element2.symbol}</span>
            <span className="block text-[10px] text-black/40">{element2.name}</span>
          </div>
        </div>
        
        {/* Property rows */}
        {properties.map(({ key, label, unit }) => (
          <div key={key} className="grid grid-cols-3 text-xs">
            <div className="p-2 text-black/40">{label}</div>
            <div className="p-2 text-center font-mono">
              {getValue(element1, key)}
              {unit && <span className="text-black/30 ml-0.5 text-[10px]">{unit}</span>}
            </div>
            <div className="p-2 text-center font-mono">
              {getValue(element2, key)}
              {unit && <span className="text-black/30 ml-0.5 text-[10px]">{unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
