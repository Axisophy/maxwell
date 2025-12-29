'use client';

import { useState, useEffect, useCallback } from 'react';
import { LightningData, LightningStrike } from '@/lib/unrest/types';
import WorldMap, { latLonToXY } from './WorldMap';

interface LightningLiveProps {
  className?: string;
}

// Lightning strike SVG component
function LightningStrikeMark({
  strike,
  now,
}: {
  strike: LightningStrike;
  now: number;
}) {
  const age = now - strike.timestamp;
  const maxAge = 300000; // 5 minutes

  if (age > maxAge) return null;

  const pos = latLonToXY(strike.lat, strike.lng);
  const fadeRatio = 1 - age / maxAge;
  const alpha = fadeRatio * strike.intensity;
  const isRecent = age < 500;

  // Size based on age and intensity
  const baseRadius = 3 + strike.intensity * 2;
  const glowRadius = baseRadius * 3 * fadeRatio;

  return (
    <g>
      {/* Outer glow */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={glowRadius}
        fill={`rgba(255, 180, 50, ${alpha * 0.3})`}
      />
      {/* Middle glow */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={glowRadius * 0.5}
        fill={`rgba(255, 220, 100, ${alpha * 0.5})`}
      />
      {/* Core */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={baseRadius * fadeRatio + 1}
        fill={isRecent ? '#ffffff' : `rgba(255, 255, 220, ${alpha})`}
      />
      {/* Flash effect for very recent strikes */}
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

  // Fetch data
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

  // Update time for fade animation (every 100ms for smooth fading)
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ aspectRatio: '16/9' }} className={`bg-[#0f172a] ${className}`}>
      {loading && !data ? (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white/50 text-sm">Loading...</span>
        </div>
      ) : error ? (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      ) : (
        <div className="w-full h-full relative">
          {/* World map with lightning strikes */}
          <WorldMap
            className="w-full h-full"
            oceanColor="#0f172a"
            landColor="#1e3a5f"
          >
            {/* Render all lightning strikes as SVG elements */}
            {data?.strikes.map((strike) => (
              <LightningStrikeMark
                key={strike.id}
                strike={strike}
                now={now}
              />
            ))}
          </WorldMap>

          {/* Stats overlay */}
          {data && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="font-mono text-xl font-bold">
                      {data.stats.strikesPerMinute.toLocaleString()}
                    </span>
                    <span className="text-xs text-white/60 ml-1">/min</span>
                  </div>
                  <div className="text-xs text-white/60">
                    {data.stats.activeCells} cells
                  </div>
                </div>
                <div className="text-xs text-white/60">
                  {data.stats.mostActiveRegion}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
