'use client';

import { Activity, Flame, Wind, Sun } from 'lucide-react';

interface UnrestSummaryBarProps {
  earthquakeCount: number;
  volcanoesElevated: number;
  stormCount: number;
  kpIndex?: number;
  className?: string;
}

export default function UnrestSummaryBar({
  earthquakeCount,
  volcanoesElevated,
  stormCount,
  kpIndex,
  className = ''
}: UnrestSummaryBarProps) {
  return (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-red-500" />
          <span className="text-black/50">Earthquakes (24h):</span>
          <span className="font-mono font-medium text-black">{earthquakeCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <Flame size={16} className="text-orange-500" />
          <span className="text-black/50">Volcanoes elevated:</span>
          <span className="font-mono font-medium text-black">{volcanoesElevated}</span>
        </div>

        <div className="flex items-center gap-2">
          <Wind size={16} className="text-blue-500" />
          <span className="text-black/50">Active storms:</span>
          <span className="font-mono font-medium text-black">{stormCount}</span>
        </div>

        {kpIndex !== undefined && (
          <div className="flex items-center gap-2">
            <Sun size={16} className="text-yellow-500" />
            <span className="text-black/50">Kp:</span>
            <span className="font-mono font-medium text-black">{kpIndex}</span>
            <span className="text-black/40">
              {kpIndex >= 5 ? '(storm)' : '(quiet)'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
