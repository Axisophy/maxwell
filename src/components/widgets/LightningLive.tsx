'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import WidgetFrame from '@/components/WidgetFrame';
import { LightningData, LightningStrike } from '@/lib/unrest/types';

interface LightningLiveProps {
  className?: string;
}

export default function LightningLive({ className = '' }: LightningLiveProps) {
  const [data, setData] = useState<LightningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Draw map and strikes
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // World map bounds (show Americas primarily)
    const mapBounds = { west: -140, east: -30, south: -60, north: 60 };

    const projectLng = (lng: number) => ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * width;
    const projectLat = (lat: number) => height - ((lat - mapBounds.south) / (mapBounds.north - mapBounds.south)) * height;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Dark background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        ctx.moveTo(0, projectLat(lat));
        ctx.lineTo(width, projectLat(lat));
        ctx.stroke();
      }
      for (let lng = -140; lng <= -30; lng += 20) {
        ctx.beginPath();
        ctx.moveTo(projectLng(lng), 0);
        ctx.lineTo(projectLng(lng), height);
        ctx.stroke();
      }

      // Continent outlines (simplified)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;

      // North America
      ctx.beginPath();
      ctx.moveTo(projectLng(-125), projectLat(48));
      ctx.lineTo(projectLng(-125), projectLat(32));
      ctx.lineTo(projectLng(-117), projectLat(32));
      ctx.lineTo(projectLng(-97), projectLat(26));
      ctx.lineTo(projectLng(-82), projectLat(25));
      ctx.lineTo(projectLng(-80), projectLat(32));
      ctx.lineTo(projectLng(-75), projectLat(35));
      ctx.lineTo(projectLng(-70), projectLat(42));
      ctx.lineTo(projectLng(-67), projectLat(45));
      ctx.stroke();

      // Central America
      ctx.beginPath();
      ctx.moveTo(projectLng(-117), projectLat(32));
      ctx.lineTo(projectLng(-105), projectLat(20));
      ctx.lineTo(projectLng(-87), projectLat(15));
      ctx.lineTo(projectLng(-83), projectLat(8));
      ctx.stroke();

      // South America
      ctx.beginPath();
      ctx.moveTo(projectLng(-80), projectLat(10));
      ctx.lineTo(projectLng(-77), projectLat(-5));
      ctx.lineTo(projectLng(-70), projectLat(-18));
      ctx.lineTo(projectLng(-70), projectLat(-55));
      ctx.lineTo(projectLng(-55), projectLat(-55));
      ctx.lineTo(projectLng(-45), projectLat(-25));
      ctx.lineTo(projectLng(-35), projectLat(-5));
      ctx.lineTo(projectLng(-50), projectLat(5));
      ctx.stroke();

      // Draw strikes
      const now = Date.now();
      const strikes = strikesRef.current;

      strikes.forEach(strike => {
        const age = now - strike.timestamp;
        const maxAge = 300000;
        
        if (age > maxAge) return;

        const x = projectLng(strike.lng);
        const y = projectLat(strike.lat);

        if (x < 0 || x > width || y < 0 || y > height) return;

        const fadeRatio = 1 - (age / maxAge);
        const alpha = fadeRatio * strike.intensity;
        const isRecent = age < 500;

        if (isRecent) {
          ctx.fillStyle = `rgba(255, 255, 255, 1)`;
          ctx.beginPath();
          ctx.arc(x, y, 4 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 10 * fadeRatio + 2);
        gradient.addColorStop(0, `rgba(255, 220, 100, ${alpha * 0.9})`);
        gradient.addColorStop(0.4, `rgba(255, 180, 50, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(255, 150, 0, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 10 * fadeRatio + 2, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(255, 255, 220, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 2 * fadeRatio + 1, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [data]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setData(d => d ? { ...d } : null);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const status = error ? 'error' : loading ? 'loading' : 'live';

  return (
    <WidgetFrame
      title="Lightning Live"
      status={status}
      description="Real-time lightning strikes detected across the Americas via satellite observation. Strikes fade over 5 minutes."
      source="GOES-R GLM (Geostationary Lightning Mapper)"
      sourceUrl="https://www.goes-r.gov/spacesegment/glm.html"
      className={className}
    >
      <div style={{ aspectRatio: '4/3' }}>
        {loading && !data ? (
          <div className="w-full h-full flex items-center justify-center bg-[#0f172a]">
            <span className="text-white/50 text-sm">Loading...</span>
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center bg-[#0f172a]">
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
                      <span className="font-mono text-xl font-bold">{data.stats.strikesPerMinute.toLocaleString()}</span>
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
    </WidgetFrame>
  );
}
