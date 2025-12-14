'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Info } from 'lucide-react';
import { SeismicData, SeismicStation } from '@/lib/unrest/types';

interface SeismicPulseProps {
  className?: string;
  showInfo?: boolean;
  compact?: boolean; // For embedding in Unrest page
}

// Single station waveform display
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

    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    const waveform = station.waveform;
    const pointSpacing = width / waveform.length;
    const centerY = height / 2;
    const amplitude = height * 0.4;

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    waveform.forEach((value, i) => {
      const x = i * pointSpacing;
      const y = centerY - value * amplitude;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Glow effect
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
    ctx.lineWidth = 4;
    ctx.stroke();

  }, [station, width, height]);

  return (
    <div className="relative bg-[#1a1a2e] rounded-lg overflow-hidden">
      <canvas ref={canvasRef} />
      <div className="absolute bottom-1 left-2 text-[10px] font-mono text-white/60">
        {station.code}
      </div>
      <div className="absolute bottom-1 right-2 text-[10px] text-white/40">
        {station.location}
      </div>
    </div>
  );
}

export default function SeismicPulse({ className = '', showInfo = true, compact = false }: SeismicPulseProps) {
  const [data, setData] = useState<SeismicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 100, height: 40 });

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
    const interval = setInterval(fetchData, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, [fetchData]);

  // Calculate dimensions for station traces
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      const cols = compact ? 3 : 3;
      const rows = compact ? 2 : 3;
      const gap = 8;
      const traceWidth = (rect.width - gap * (cols - 1)) / cols;
      const traceHeight = compact ? 35 : 50;
      setDimensions({ width: traceWidth, height: traceHeight });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [compact]);

  // Get stations to display
  const displayStations = data?.stations.slice(0, compact ? 6 : 9) || [];

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Widget Frame */}
      <div className="bg-[#e5e5e5] rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-normal text-black">Seismic Pulse</span>
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="relative">
            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : loading ? 'bg-amber-500' : 'bg-green-500'}`} />
            {!error && !loading && (
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
            )}
          </div>
          {/* Info button */}
          {showInfo && (
            <button
              onClick={() => setInfoOpen(!infoOpen)}
              className={`p-1 rounded transition-opacity ${infoOpen ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
            >
              <Info size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Info Panel */}
      {infoOpen && (
        <div className="bg-[#e5e5e5] px-4 py-3 border-t border-[#d0d0d0] rounded-b-xl -mt-3 pt-6">
          <p className="text-sm text-black/70 mb-3">
            Live seismograph traces from stations around the world. The Earth breathing — 
            continuous ground motion from microseisms, distant earthquakes, and local vibrations.
          </p>
          <div className="border-t border-[#d0d0d0] pt-3">
            <span className="text-xs font-medium text-black/40 uppercase tracking-wider">Source</span>
            <p className="text-sm text-black mt-1">IRIS/FDSN Global Seismic Network</p>
          </div>
        </div>
      )}

      {/* Widget Content */}
      <div className="bg-white rounded-xl mt-2 p-3" ref={containerRef}>
        {loading && !data ? (
          <div className="h-48 flex items-center justify-center">
            <span className="text-black/40 text-sm">Loading stations...</span>
          </div>
        ) : error ? (
          <div className="h-48 flex items-center justify-center">
            <span className="text-red-500 text-sm">{error}</span>
          </div>
        ) : (
          <>
            {/* Station grid */}
            <div className={`grid gap-2 ${compact ? 'grid-cols-3' : 'grid-cols-3'}`}>
              {displayStations.map(station => (
                <StationTrace
                  key={station.code}
                  station={station}
                  width={dimensions.width}
                  height={dimensions.height}
                />
              ))}
            </div>

            {/* Stats bar */}
            {data && (
              <div className="mt-3 pt-3 border-t border-black/10 flex items-center justify-between">
                <div className="text-xs text-black/50">
                  <span className="font-mono font-medium text-black">{data.stats.eventsLast24h}</span>
                  {' '}events M4.5+ (24h)
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
    </div>
  );
}
