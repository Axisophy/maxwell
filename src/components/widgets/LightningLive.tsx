'use client';

import { useState, useEffect, useCallback } from 'react';
import { LightningData, LightningStrike } from '@/lib/unrest/types';
import WorldMap, { latLonToXY } from './WorldMap';

// ===========================================
// LIGHTNING LIVE
// ===========================================

interface LightningLiveProps {
  className?: string;
}

function LightningStrikeMark({
  strike,
  now,
}: {
  strike: LightningStrike;
  now: number;
}) {
  const age = now - strike.timestamp;
  const maxAge = 300000;

  if (age > maxAge) return null;

  const pos = latLonToXY(strike.lat, strike.lng);
  const fadeRatio = 1 - age / maxAge;
  const alpha = fadeRatio * strike.intensity;
  const isRecent = age < 500;

  const baseRadius = 3 + strike.intensity * 2;
  const glowRadius = baseRadius * 3 * fadeRatio;

  return (
    <g>
      <circle
        cx={pos.x}
        cy={pos.y}
        r={glowRadius}
        fill={`rgba(255, 180, 50, ${alpha * 0.3})`}
      />
      <circle
        cx={pos.x}
        cy={pos.y}
        r={glowRadius * 0.5}
        fill={`rgba(255, 220, 100, ${alpha * 0.5})`}
      />
      <circle
        cx={pos.x}
        cy={pos.y}
        r={baseRadius * fadeRatio + 1}
        fill={isRecent ? '#ffffff' : `rgba(255, 255, 220, ${alpha})`}
      />
      {isRecent && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={baseRadius + 4}
          fill="rgba(255, 255, 255, 0.8)"
        >
          <animate
            attributeName="r"
            from={`${baseRadius}`}
            to={`${baseRadius + 10}`}
            dur="0.3s"
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            from="0.8"
            to="0"
            dur="0.3s"
            fill="freeze"
          />
        </circle>
      )}
    </g>
  );
}

export default function LightningLive({ className = '' }: LightningLiveProps) {
  const [data, setData] = useState<LightningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/unrest/lightning');
      if (!res.ok) throw new Error('Failed to fetch');
      const newData: LightningData = await res.json();
      setData(newData);
      setError(null);
    } catch (err) {
      setError('Unable to load lightning data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className={`bg-[#262626] p-2 md:p-4 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <span className="text-white/50 text-sm font-mono">Loading lightning data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-[#262626] p-2 md:p-4 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#262626] p-2 md:p-4 space-y-px ${className}`}>
      {/* Map */}
      <div className="bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '2/1' }}>
        <WorldMap
          className="w-full h-full"
          oceanColor="#0a0a12"
          landColor="#1e3a5f"
        >
          {data?.strikes.map((strike) => (
            <LightningStrikeMark
              key={strike.id}
              strike={strike}
              now={now}
            />
          ))}
        </WorldMap>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-3 gap-px">
          <div className="bg-black rounded-lg p-3">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
              Strike Rate
            </div>
            <div className="font-mono text-lg font-bold text-amber-400">
              {data.stats.strikesPerMinute.toLocaleString()}
              <span className="text-xs text-white/40 ml-1">/min</span>
            </div>
          </div>
          <div className="bg-black rounded-lg p-3">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
              Active Cells
            </div>
            <div className="font-mono text-lg font-bold text-white">
              {data.stats.activeCells}
            </div>
          </div>
          <div className="bg-black rounded-lg p-3">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
              Most Active
            </div>
            <div className="text-sm text-white/70 truncate">
              {data.stats.mostActiveRegion}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
