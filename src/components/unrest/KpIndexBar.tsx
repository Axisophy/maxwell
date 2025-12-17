'use client';

interface KpIndexBarProps {
  kp: number;
  solarWind?: number;
  className?: string;
}

const G_SCALE: Record<number, { label: string; color: string }> = {
  0: { label: 'Quiet', color: '#22c55e' },
  1: { label: 'Quiet', color: '#22c55e' },
  2: { label: 'Quiet', color: '#22c55e' },
  3: { label: 'Unsettled', color: '#84cc16' },
  4: { label: 'Unsettled', color: '#eab308' },
  5: { label: 'G1 Minor Storm', color: '#f97316' },
  6: { label: 'G2 Moderate Storm', color: '#ef4444' },
  7: { label: 'G3 Strong Storm', color: '#dc2626' },
  8: { label: 'G4 Severe Storm', color: '#b91c1c' },
  9: { label: 'G5 Extreme Storm', color: '#7f1d1d' },
};

export default function KpIndexBar({ kp, solarWind, className = '' }: KpIndexBarProps) {
  const level = G_SCALE[Math.min(Math.floor(kp), 9)] || G_SCALE[0];
  const fillPercent = (kp / 9) * 100;

  return (
    <div className={`bg-white rounded-xl p-5 ${className}`}>
      <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
        Geomagnetic Conditions
      </h3>

      <div className="flex items-center gap-4 mb-3">
        <span className="text-black/50 text-sm">Kp Index</span>
        <div className="flex-1 h-3 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${fillPercent}%`,
              backgroundColor: level.color
            }}
          />
        </div>
        <span className="font-mono text-2xl font-bold text-black">{kp}</span>
      </div>

      <div
        className="text-sm font-medium mb-4"
        style={{ color: level.color }}
      >
        {level.label}
      </div>

      {solarWind && (
        <div className="flex justify-between text-sm border-t border-neutral-100 pt-3">
          <span className="text-black/50">Solar Wind</span>
          <span className="font-mono text-black">{solarWind} km/s</span>
        </div>
      )}

      <p className="text-black/30 text-xs mt-4">
        Source: NOAA Space Weather Prediction Center
      </p>
    </div>
  );
}
