'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SeismicData, SeismicStation } from '@/lib/unrest/types';

interface SeismicPulseProps {
  className?: string;
}

// Single station waveform
function StationTrace({ station, width, height }: { station: SeismicStation; width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    const waveform = station.waveform;
    const pointSpacing = width / waveform.length;
    const centerY = height / 2;
    const amplitude = height * 0.35;

    // Glow layer
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    waveform.forEach((value, i) => {
      const x = i * pointSpacing;
      const y = centerY - value * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Main line
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    waveform.forEach((value, i) => {
      const x = i * pointSpacing;
      const y = centerY - value * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

  }, [station, width, height]);

  return (
    <div className="relative bg-[#0f172a] rounded overflow-hidden">
      <canvas ref={canvasRef} />
      <div className="absolute bottom-0.5 left-1.5 text-[9px] font-mono text-white/70 font-medium">
        {station.code}
      </div>
      <div className="absolute bottom-0.5 right-1.5 text-[8px] text-white/40">
        {station.location}
      </div>
    </div>
  );
}

export default function SeismicPulse({ className = '' }: SeismicPulseProps) {
  const [data, setData] = useState<SeismicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [traceSize, setTraceSize] = useState({ width: 100, height: 45 });

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

  // Calculate trace dimensions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      const gap = 6;
      const cols = 3;
      const traceWidth = (rect.width - gap * (cols - 1) - 24) / cols; // 24 for padding
      setTraceSize({ width: Math.floor(traceWidth), height: 45 });
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const displayStations = data?.stations.slice(0, 9) || [];

  return (
    <div ref={containerRef} className={`p-3 ${className}`}>
      {loading && !data ? (
        <div className="h-[180px] flex items-center justify-center">
          <span className="text-black/40 text-sm">Loading stations...</span>
        </div>
      ) : error ? (
        <div className="h-[180px] flex items-center justify-center">
          <span className="text-red-500 text-sm">{error}</span>
        </div>
      ) : (
        <>
          {/* Station grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {displayStations.map(station => (
              <StationTrace
                key={station.code}
                station={station}
                width={traceSize.width}
                height={traceSize.height}
              />
            ))}
          </div>

          {/* Stats bar */}
          {data && (
            <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between">
              <div className="text-xs text-black/50">
                <span className="font-mono font-medium text-black">{data.stats.eventsLast24h}</span>
                {' '}M4.5+ (24h)
              </div>
              <div className="text-xs text-black/50">
                Largest: <span className="font-mono font-medium text-black">M{data.stats.largestMagnitude}</span>
                {' '}{data.stats.largestLocation}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
