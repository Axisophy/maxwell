'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Info } from 'lucide-react';
import { LightningData, LightningStrike } from '@/lib/unrest/types';

interface LightningLiveProps {
  className?: string;
  showInfo?: boolean;
}

export default function LightningLive({ className = '', showInfo = true }: LightningLiveProps) {
  const [data, setData] = useState<LightningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const strikesRef = useRef<LightningStrike[]>([]);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/unrest/lightning');
      if (!res.ok) throw new Error('Failed to fetch');
      const newData: LightningData = await res.json();
      setData(newData);
      strikesRef.current = newData.strikes;
      setError(null);
    } catch (err) {
      setError('Unable to load lightning data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  // Draw map and strikes
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Map projection (simple Mercator for Americas)
    // Bounds: roughly -170 to -30 lng, -60 to 70 lat
    const mapBounds = {
      west: -140,
      east: -30,
      south: -60,
      north: 60,
    };

    const projectLng = (lng: number) => {
      return ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * width;
    };

    const projectLat = (lat: number) => {
      // Invert Y for canvas
      return height - ((lat - mapBounds.south) / (mapBounds.north - mapBounds.south)) * height;
    };

    // Animation loop
    let frameCount = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Dark background for map area
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, width, height);

      // Draw simplified continent outlines (very basic)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      
      // North America rough outline
      ctx.beginPath();
      ctx.moveTo(projectLng(-125), projectLat(48));
      ctx.lineTo(projectLng(-125), projectLat(32));
      ctx.lineTo(projectLng(-117), projectLat(32));
      ctx.lineTo(projectLng(-97), projectLat(26));
      ctx.lineTo(projectLng(-97), projectLat(48));
      ctx.lineTo(projectLng(-125), projectLat(48));
      ctx.stroke();

      // Central America / Caribbean line
      ctx.beginPath();
      ctx.moveTo(projectLng(-117), projectLat(32));
      ctx.lineTo(projectLng(-105), projectLat(20));
      ctx.lineTo(projectLng(-87), projectLat(15));
      ctx.lineTo(projectLng(-80), projectLat(10));
      ctx.stroke();

      // South America rough outline
      ctx.beginPath();
      ctx.moveTo(projectLng(-80), projectLat(10));
      ctx.lineTo(projectLng(-80), projectLat(-5));
      ctx.lineTo(projectLng(-70), projectLat(-20));
      ctx.lineTo(projectLng(-70), projectLat(-55));
      ctx.lineTo(projectLng(-55), projectLat(-55));
      ctx.lineTo(projectLng(-35), projectLat(-5));
      ctx.lineTo(projectLng(-50), projectLat(5));
      ctx.lineTo(projectLng(-80), projectLat(10));
      ctx.stroke();

      // Draw strikes
      const now = Date.now();
      const strikes = strikesRef.current;

      strikes.forEach(strike => {
        const age = now - strike.timestamp;
        const maxAge = 300000; // 5 minutes
        
        if (age > maxAge) return;

        const x = projectLng(strike.lng);
        const y = projectLat(strike.lat);

        // Skip if outside canvas
        if (x < 0 || x > width || y < 0 || y > height) return;

        // Fade based on age
        const fadeRatio = 1 - (age / maxAge);
        const alpha = fadeRatio * strike.intensity;

        // Flash effect for recent strikes
        const isRecent = age < 500;
        const flashAlpha = isRecent ? 1 : alpha;

        // Draw strike
        if (isRecent) {
          // Bright flash
          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 4 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8 * fadeRatio + 2);
        gradient.addColorStop(0, `rgba(255, 220, 100, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(255, 180, 50, ${alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(255, 150, 0, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 8 * fadeRatio + 2, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 2 * fadeRatio + 1, 0, Math.PI * 2);
        ctx.fill();
      });

      frameCount++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      // Trigger re-render
      setData(d => d ? { ...d } : null);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Widget Frame */}
      <div className="bg-[#e5e5e5] rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-normal text-black">Lightning Live — The Americas</span>
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

      {/* Info Panel (if open) */}
      {infoOpen && (
        <div className="bg-[#e5e5e5] px-4 py-3 border-t border-[#d0d0d0] rounded-b-xl -mt-3 pt-6">
          <p className="text-sm text-black/70 mb-3">
            Real-time lightning strikes detected across North and South America via satellite observation.
          </p>
          <div className="border-t border-[#d0d0d0] pt-3">
            <span className="text-xs font-medium text-black/40 uppercase tracking-wider">Source</span>
            <p className="text-sm text-black mt-1">GOES-R GLM (Geostationary Lightning Mapper)</p>
          </div>
        </div>
      )}

      {/* Widget Content */}
      <div className="bg-white rounded-xl mt-2 overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {loading && !data ? (
          <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e]">
            <span className="text-white/50 text-sm">Loading...</span>
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e]">
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        ) : (
          <div ref={containerRef} className="w-full h-full relative">
            <canvas ref={canvasRef} className="absolute inset-0" />
            
            {/* Stats overlay */}
            {data && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="font-mono text-lg font-bold">{data.stats.strikesPerMinute.toLocaleString()}</span>
                      <span className="text-xs text-white/60 ml-1">strikes/min</span>
                    </div>
                    <div className="text-xs text-white/60">
                      {data.stats.activeCells} active cells
                    </div>
                  </div>
                  <div className="text-xs text-white/60">
                    Most active: {data.stats.mostActiveRegion}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
