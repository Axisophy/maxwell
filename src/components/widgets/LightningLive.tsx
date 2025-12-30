'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { LightningData, LightningStrike } from '@/lib/unrest/types';
import WorldMap, { latLonToXY } from './WorldMap';

// ===========================================
// LIGHTNING LIVE
// ===========================================
// Real-time lightning strike visualization
// Data: /api/unrest/lightning (currently mock data)
// TODO: Integrate real data source (Blitzortung, GOES-R GLM)
// ===========================================

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [data, setData] = useState<LightningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  // Responsive scaling
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setBaseFontSize(width / 25);
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

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
    <div
      ref={containerRef}
      style={{ fontSize: `${baseFontSize}px` }}
      className={`bg-[#1a1a1e] p-[1em] h-full flex flex-col ${className}`}
    >
      {loading && !data ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-white/50 text-[0.875em]">Loading lightning data...</span>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-red-400 text-[0.875em]">{error}</span>
        </div>
      ) : (
        <>
          {/* Map container - no overlay */}
          <div className="flex-1 min-h-0 rounded-[0.5em] overflow-hidden">
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

          {/* Stats below map - clear labels */}
          {data && (
            <div className="pt-[0.75em] mt-[0.75em] border-t border-white/10">
              <div className="grid grid-cols-3 gap-[0.5em]">
                <div>
                  <div className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.125em]">
                    Strike Rate
                  </div>
                  <div className="font-mono text-[1.25em] font-bold text-amber-400">
                    {data.stats.strikesPerMinute.toLocaleString()}
                    <span className="text-[0.5em] text-white/40 ml-[0.25em]">/min</span>
                  </div>
                </div>
                <div>
                  <div className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.125em]">
                    Active Cells
                  </div>
                  <div className="font-mono text-[1.25em] font-bold text-white">
                    {data.stats.activeCells}
                  </div>
                </div>
                <div>
                  <div className="text-[0.625em] text-white/40 uppercase tracking-wider mb-[0.125em]">
                    Most Active
                  </div>
                  <div className="text-[0.875em] text-white/70 truncate">
                    {data.stats.mostActiveRegion}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
