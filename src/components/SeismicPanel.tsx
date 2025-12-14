'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ChevronDown, ChevronUp, ExternalLink, MapPin } from 'lucide-react';
import { SeismicData, SeismicStation, Earthquake } from '@/lib/unrest/types';

interface SeismicPanelProps {
  className?: string;
  selectedEarthquake?: Earthquake | null;
}

// Station waveform trace
function StationTrace({ 
  station, 
  expanded = false 
}: { 
  station: SeismicStation; 
  expanded?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const height = expanded ? 60 : 40;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 200;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw waveform
    const waveform = station.waveform;
    const pointSpacing = width / waveform.length;
    const centerY = height / 2;
    const amplitude = height * 0.4;

    // Glow
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)';
    ctx.lineWidth = 3;
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

  }, [station, height]);

  return (
    <div className="bg-[#0f172a] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium text-white">{station.code}</span>
          <span className="text-xs text-white/40">{station.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-white/30" />
          <span className="text-xs text-white/40">{station.location}</span>
        </div>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </div>
  );
}

// Recent earthquake row
function EarthquakeRow({ 
  earthquake, 
  selected,
  onClick 
}: { 
  earthquake: Earthquake;
  selected?: boolean;
  onClick?: () => void;
}) {
  const time = new Date(earthquake.time);
  const timeAgo = getTimeAgo(earthquake.time);
  
  // Magnitude color
  const getMagColor = (mag: number) => {
    if (mag >= 6) return 'text-red-500 bg-red-500/10';
    if (mag >= 5) return 'text-orange-500 bg-orange-500/10';
    return 'text-amber-500 bg-amber-500/10';
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
        selected 
          ? 'bg-black/10 ring-1 ring-black/20' 
          : 'hover:bg-black/5'
      }`}
    >
      <div className={`font-mono text-lg font-bold px-2 py-1 rounded ${getMagColor(earthquake.magnitude)}`}>
        {earthquake.magnitude.toFixed(1)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-black truncate">
          {earthquake.place}
        </div>
        <div className="text-xs text-black/50 mt-0.5">
          Depth: {earthquake.depth}km • {timeAgo}
        </div>
      </div>
      <a 
        href={earthquake.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="p-1 text-black/30 hover:text-black/60"
      >
        <ExternalLink size={14} />
      </a>
    </button>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function SeismicPanel({ className = '', selectedEarthquake }: SeismicPanelProps) {
  const [data, setData] = useState<SeismicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [localSelectedEq, setLocalSelectedEq] = useState<Earthquake | null>(null);

  // Use prop or local state for selected earthquake
  const activeEarthquake = selectedEarthquake || localSelectedEq;

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/unrest/seismic');
      if (!res.ok) throw new Error('Failed to fetch');
      const newData: SeismicData = await res.json();
      setData(newData);
    } catch (err) {
      console.error('Error fetching seismic data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-2 text-black/40">
          <Activity size={20} className="animate-pulse" />
          <span>Loading seismic data...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={`bg-white rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Activity size={20} className="text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-black">Seismic Pulse</h3>
            <p className="text-sm text-black/50">
              {data.stations.length} stations • {data.stats.eventsLast24h} events (24h)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-black/40 uppercase tracking-wider">Largest</div>
            <div className="font-mono font-medium text-black">
              M{data.stats.largestMagnitude} {data.stats.largestLocation}
            </div>
          </div>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-black/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:divide-x divide-black/10">
            {/* Left: Station waveforms */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-black/70 uppercase tracking-wider">
                  Live Stations
                </h4>
                <span className="text-xs text-black/40">
                  Updated every 60s
                </span>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {data.stations.map(station => (
                  <div 
                    key={station.code}
                    onClick={() => setSelectedStation(
                      selectedStation === station.code ? null : station.code
                    )}
                    className="cursor-pointer"
                  >
                    <StationTrace 
                      station={station} 
                      expanded={selectedStation === station.code}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Recent earthquakes */}
            <div className="p-4 border-t lg:border-t-0 border-black/10">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-black/70 uppercase tracking-wider">
                  Recent Earthquakes (M4.5+)
                </h4>
                <a 
                  href="https://earthquake.usgs.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-black/40 hover:text-black flex items-center gap-1"
                >
                  USGS <ExternalLink size={10} />
                </a>
              </div>
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {data.recentEvents.slice(0, 15).map(eq => (
                  <EarthquakeRow
                    key={eq.id}
                    earthquake={eq}
                    selected={activeEarthquake?.id === eq.id}
                    onClick={() => setLocalSelectedEq(
                      localSelectedEq?.id === eq.id ? null : eq
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Data sources footer */}
          <div className="px-4 py-3 bg-black/5 border-t border-black/10">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-black/50">
              <div>
                <span className="font-medium text-black/70">Waveforms:</span> IRIS/FDSN Global Seismic Network
              </div>
              <div>
                <span className="font-medium text-black/70">Events:</span> USGS Earthquake Hazards Program
              </div>
              <div>
                <span className="font-medium text-black/70">Refresh:</span> Waveforms 60s, Events 60s
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
