'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SeismicData, SeismicStation } from '@/lib/unrest/types';

interface SeismicPulseProps {
  className?: string;
}

// Seismograph trace component - renders a single waveform
function StationTrace({
  station,
  height,
  isHero = false,
}: {
  station: SeismicStation;
  height: number;
  isHero?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);

  // Track container width
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      const rect = container.getBoundingClientRect();
      setWidth(rect.width);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Draw the waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Paper-like background with subtle warmth
    ctx.fillStyle = '#0f1419';
    ctx.fillRect(0, 0, width, height);

    // Horizontal grid lines (paper roll effect)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSpacing = 15;
    for (let y = gridSpacing; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical time markers (every 20% of width)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 1; i < 5; i++) {
      const x = (width * i) / 5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw waveform
    const waveform = station.waveform;
    const pointSpacing = width / waveform.length;
    const centerY = height / 2;
    const amplitude = height * (isHero ? 0.4 : 0.35);

    // Glow/blur layer
    ctx.strokeStyle = 'rgba(196, 69, 54, 0.3)';
    ctx.lineWidth = isHero ? 5 : 3;
    ctx.beginPath();
    waveform.forEach((value, i) => {
      const x = i * pointSpacing;
      const y = centerY - value * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Main seismograph line - red-brown color
    ctx.strokeStyle = '#c44536';
    ctx.lineWidth = isHero ? 2 : 1.5;
    ctx.beginPath();
    waveform.forEach((value, i) => {
      const x = i * pointSpacing;
      const y = centerY - value * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [station, width, height, isHero]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Waveform canvas */}
      <div className="bg-[#0f1419] rounded overflow-hidden">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      {/* Labels below the graph */}
      <div className={`flex items-center justify-between ${isHero ? 'mt-1.5 px-1' : 'mt-1 px-0.5'}`}>
        <span className={`font-mono font-bold text-white/80 ${isHero ? 'text-sm' : 'text-[10px]'}`}>
          {station.code}
        </span>
        <span className={`text-white/40 ${isHero ? 'text-xs' : 'text-[9px]'}`}>
          {station.location}
        </span>
      </div>
    </div>
  );
}

export default function SeismicPulse({ className = '' }: SeismicPulseProps) {
  const [data, setData] = useState<SeismicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllStations, setShowAllStations] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/unrest/seismic');
      if (!res.ok) throw new Error('Failed to fetch');
      const newData: SeismicData = await res.json();
      setData(newData);
      setError(null);
    } catch (err) {
      setError('Unable to load seismic data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Split stations: 1 hero, 2 secondary, rest hidden
  const heroStation = data?.stations[0];
  const secondaryStations = data?.stations.slice(1, 3) || [];
  const remainingStations = data?.stations.slice(3) || [];

  return (
    <div className={`bg-[#1a1a1e] p-3 ${className}`}>
      {loading && !data ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <span className="text-white/40 text-sm">Loading stations...</span>
        </div>
      ) : error ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      ) : (
        <>
          {/* Hero trace - full width, taller */}
          {heroStation && (
            <div className="mb-2">
              <StationTrace station={heroStation} height={80} isHero />
            </div>
          )}

          {/* Secondary traces - full width, shorter */}
          <div className="space-y-1.5 mb-2">
            {secondaryStations.map((station) => (
              <StationTrace key={station.code} station={station} height={45} />
            ))}
          </div>

          {/* Collapsible section for remaining stations */}
          {remainingStations.length > 0 && (
            <div className="border-t border-white/10 pt-2">
              <button
                onClick={() => setShowAllStations(!showAllStations)}
                className="w-full flex items-center justify-center gap-2 py-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
              >
                <span>
                  {showAllStations
                    ? '▲ Hide stations'
                    : `▼ Show ${remainingStations.length} more stations`}
                </span>
              </button>

              {showAllStations && (
                <div className="space-y-1.5 mt-2">
                  {remainingStations.map((station) => (
                    <StationTrace key={station.code} station={station} height={45} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stats bar */}
          {data && (
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-white/50">
                <span className="font-mono font-medium text-white">{data.stats.eventsLast24h}</span>
                {' '}M4.5+ (24h)
              </div>
              <div className="text-xs text-white/50">
                Largest: <span className="font-mono font-medium text-white">M{data.stats.largestMagnitude}</span>
                {' '}{data.stats.largestLocation}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
