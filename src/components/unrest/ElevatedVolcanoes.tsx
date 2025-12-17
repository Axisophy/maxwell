'use client';

import { Volcano } from '@/lib/unrest/types';

interface ElevatedVolcanoesProps {
  volcanoes: Volcano[];
  className?: string;
}

const ALERT_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  red: { bg: 'bg-red-100', text: 'text-red-600', label: 'WARNING' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', label: 'WATCH' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'ADVISORY' },
};

export default function ElevatedVolcanoes({ volcanoes, className = '' }: ElevatedVolcanoesProps) {
  const elevated = volcanoes
    .filter(v => v.alertLevel !== 'green')
    .sort((a, b) => {
      const order: Record<string, number> = { red: 0, orange: 1, yellow: 2 };
      return (order[a.alertLevel] ?? 3) - (order[b.alertLevel] ?? 3);
    });

  return (
    <div className={`bg-white rounded-xl p-5 ${className}`}>
      <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
        Elevated Volcanic Activity
      </h3>

      {elevated.length === 0 ? (
        <p className="text-black/40 text-sm">No volcanoes at elevated alert level</p>
      ) : (
        <div className="space-y-3">
          {elevated.map(v => {
            const alert = ALERT_STYLES[v.alertLevel] || ALERT_STYLES.yellow;
            return (
              <div key={v.id} className="flex items-center justify-between">
                <div>
                  <p className="text-black text-sm font-medium">{v.name}</p>
                  <p className="text-black/40 text-xs">{v.country}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${alert.bg} ${alert.text}`}>
                  {alert.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-black/30 text-xs mt-4">
        Source: USGS Volcano Hazards Program
      </p>
    </div>
  );
}
