'use client';

import React from 'react';

export interface SpecStripProperty {
  label: string;
  value: string | number | null;
  unit?: string;
}

interface SpecStripProps {
  properties: SpecStripProperty[];
  variant?: 'compact' | 'expanded';
  className?: string;
}

export default function SpecStrip({ 
  properties, 
  variant = 'compact',
  className = '' 
}: SpecStripProps) {
  const formatValue = (value: string | number | null): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'number') {
      if (value >= 10000) return value.toLocaleString();
      if (value < 0.01 && value > 0) return value.toExponential(1);
      return value.toString();
    }
    return value;
  };

  if (variant === 'expanded') {
    return (
      <div className={`grid grid-cols-3 md:grid-cols-6 gap-px ${className}`}>
        {properties.map((prop, i) => (
          <div key={i} className="bg-black/5 rounded p-2">
            <div className="text-[10px] text-black/40 uppercase tracking-wider mb-0.5">
              {prop.label}
            </div>
            <div className="font-mono text-sm font-bold text-black">
              {formatValue(prop.value)}
              {prop.unit && (
                <span className="text-[10px] text-black/40 ml-0.5">{prop.unit}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Compact variant - single row
  return (
    <div className={`flex gap-px overflow-x-auto ${className}`}>
      {properties.map((prop, i) => (
        <div 
          key={i} 
          className="flex-1 min-w-[48px] bg-black/5 rounded px-2 py-1.5 text-center"
        >
          <div className="text-[9px] text-black/40 uppercase tracking-wider leading-tight">
            {prop.label}
          </div>
          <div className="font-mono text-xs font-bold text-black leading-tight mt-0.5">
            {formatValue(prop.value)}
          </div>
          {prop.unit && (
            <div className="text-[8px] text-black/30 leading-tight">
              {prop.unit}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Dark variant for use on dark backgrounds
export function SpecStripDark({ 
  properties, 
  variant = 'compact',
  className = '' 
}: SpecStripProps) {
  const formatValue = (value: string | number | null): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'number') {
      if (value >= 10000) return value.toLocaleString();
      if (value < 0.01 && value > 0) return value.toExponential(1);
      return value.toString();
    }
    return value;
  };

  if (variant === 'expanded') {
    return (
      <div className={`grid grid-cols-3 md:grid-cols-6 gap-px ${className}`}>
        {properties.map((prop, i) => (
          <div key={i} className="bg-white/5 rounded p-2">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">
              {prop.label}
            </div>
            <div className="font-mono text-sm font-bold text-white">
              {formatValue(prop.value)}
              {prop.unit && (
                <span className="text-[10px] text-white/40 ml-0.5">{prop.unit}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Compact variant - single row
  return (
    <div className={`flex gap-px overflow-x-auto ${className}`}>
      {properties.map((prop, i) => (
        <div 
          key={i} 
          className="flex-1 min-w-[48px] bg-white/5 rounded px-2 py-1.5 text-center"
        >
          <div className="text-[9px] text-white/40 uppercase tracking-wider leading-tight">
            {prop.label}
          </div>
          <div className="font-mono text-xs font-bold text-white leading-tight mt-0.5">
            {formatValue(prop.value)}
          </div>
          {prop.unit && (
            <div className="text-[8px] text-white/30 leading-tight">
              {prop.unit}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
