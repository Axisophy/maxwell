'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Zap, Activity, Wind, Flame } from 'lucide-react';
import { UnrestLayer, LightningStrike, Earthquake, Storm, Volcano } from '@/lib/unrest/types';

// Set your Mapbox token here or via env
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface UnrestMapProps {
  className?: string;
  onEarthquakeSelect?: (eq: Earthquake) => void;
}

interface MapData {
  lightning: LightningStrike[];
  earthquakes: Earthquake[];
  storms: Storm[];
  volcanoes: Volcano[];
  lightningStats: { strikesPerMinute: number; activeCells: number };
  earthquakeStats: { count: number; largest: Earthquake | null };
  stormStats: { count: number };
  volcanoStats: { elevated: number; red: number };
  lastUpdated: string;
}

// Layer toggle button
function LayerToggle({ 
  layer, 
  active, 
  onClick, 
  icon: Icon, 
  label,
  count,
  color
}: { 
  layer: UnrestLayer;
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  count?: number | string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
        ${active 
          ? 'bg-white/95 text-black shadow-lg' 
          : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'
        }
      `}
    >
      <Icon size={16} className={active ? color : ''} />
      <span className="hidden sm:inline">{label}</span>
      {count !== undefined && (
        <span className={`font-mono text-xs ${active ? 'text-black/60' : 'text-white/50'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

export default function UnrestMap({ className = '', onEarthquakeSelect }: UnrestMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [data, setData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLayers, setActiveLayers] = useState<Set<UnrestLayer>>(
    new Set<UnrestLayer>(['lightning', 'seismic'])
  );

  // Fetch map data
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/unrest/summary');
      if (!res.ok) throw new Error('Failed to fetch');
      const newData = await res.json();
      setData(newData);
    } catch (err) {
      console.error('Error fetching map data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    if (!MAPBOX_TOKEN) {
      console.warn('Mapbox token not set');
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 1.5,
      projection: 'mercator',
      attributionControl: false,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'bottom-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when data or layers change
  useEffect(() => {
    if (!map.current || !mapLoaded || !data) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add lightning strikes
    if (activeLayers.has('lightning')) {
      data.lightning.slice(0, 200).forEach(strike => {
        const el = document.createElement('div');
        el.className = 'lightning-marker';
        el.style.cssText = `
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #fbbf24 0%, #f59e0b 40%, transparent 70%);
          border-radius: 50%;
          opacity: ${strike.intensity};
          animation: pulse 2s ease-out infinite;
        `;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([strike.lng, strike.lat])
          .addTo(map.current!);
        
        markersRef.current.push(marker);
      });
    }

    // Add earthquakes
    if (activeLayers.has('seismic')) {
      data.earthquakes.forEach(eq => {
        const size = Math.max(8, eq.magnitude * 4);
        const el = document.createElement('div');
        el.className = 'earthquake-marker';
        el.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle, #ef4444 0%, #dc2626 50%, transparent 70%);
          border-radius: 50%;
          cursor: pointer;
          opacity: 0.8;
        `;

        const popup = new mapboxgl.Popup({ offset: 15, closeButton: false })
          .setHTML(`
            <div style="font-family: system-ui; padding: 4px;">
              <div style="font-weight: 600; font-size: 14px;">M${eq.magnitude}</div>
              <div style="font-size: 12px; color: #666; margin-top: 2px;">${eq.place}</div>
              <div style="font-size: 11px; color: #999; margin-top: 4px;">
                Depth: ${eq.depth}km
              </div>
            </div>
          `);

        el.addEventListener('click', () => {
          onEarthquakeSelect?.(eq);
        });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([eq.lng, eq.lat])
          .setPopup(popup)
          .addTo(map.current!);
        
        markersRef.current.push(marker);
      });
    }

    // Add storms
    if (activeLayers.has('storms')) {
      data.storms.forEach(storm => {
        const el = document.createElement('div');
        const size = storm.category ? 20 + storm.category * 5 : 20;
        el.className = 'storm-marker';
        el.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.3);
          animation: spin 3s linear infinite;
        `;

        const popup = new mapboxgl.Popup({ offset: 15, closeButton: false })
          .setHTML(`
            <div style="font-family: system-ui; padding: 4px;">
              <div style="font-weight: 600; font-size: 14px;">${storm.name}</div>
              <div style="font-size: 12px; color: #666; margin-top: 2px;">
                ${storm.type}${storm.category ? ` Cat ${storm.category}` : ''}
              </div>
              <div style="font-size: 11px; color: #999; margin-top: 4px;">
                ${storm.windSpeed} mph • ${storm.movement}
              </div>
            </div>
          `);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([storm.lng, storm.lat])
          .setPopup(popup)
          .addTo(map.current!);
        
        markersRef.current.push(marker);
      });
    }

    // Add volcanoes
    if (activeLayers.has('volcanic')) {
      data.volcanoes.filter(v => v.alertLevel !== 'green').forEach(volcano => {
        const colors = {
          yellow: '#eab308',
          orange: '#f97316',
          red: '#ef4444',
          green: '#22c55e',
        };
        
        const el = document.createElement('div');
        el.className = 'volcano-marker';
        el.style.cssText = `
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 14px solid ${colors[volcano.alertLevel]};
          filter: drop-shadow(0 0 4px ${colors[volcano.alertLevel]});
        `;

        const popup = new mapboxgl.Popup({ offset: 15, closeButton: false })
          .setHTML(`
            <div style="font-family: system-ui; padding: 4px;">
              <div style="font-weight: 600; font-size: 14px;">${volcano.name}</div>
              <div style="font-size: 12px; color: #666; margin-top: 2px;">${volcano.country}</div>
              <div style="font-size: 11px; margin-top: 4px;">
                <span style="color: ${colors[volcano.alertLevel]}; font-weight: 600;">
                  ${volcano.alertLevel.toUpperCase()}
                </span>
              </div>
            </div>
          `);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([volcano.lng, volcano.lat])
          .setPopup(popup)
          .addTo(map.current!);
        
        markersRef.current.push(marker);
      });
    }
  }, [data, mapLoaded, activeLayers, onEarthquakeSelect]);

  const toggleLayer = (layer: UnrestLayer) => {
    setActiveLayers(prev => {
      const next = new Set(prev);
      if (next.has(layer)) {
        next.delete(layer);
      } else {
        next.add(layer);
      }
      return next;
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Map container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ minHeight: '500px' }}
      />

      {/* Loading overlay */}
      {(loading || !mapLoaded) && (
        <div className="absolute inset-0 bg-[#0f172a] rounded-xl flex items-center justify-center">
          <span className="text-white/50">Loading map...</span>
        </div>
      )}

      {/* Fallback if no token */}
      {!MAPBOX_TOKEN && (
        <div className="absolute inset-0 bg-[#0f172a] rounded-xl flex items-center justify-center">
          <div className="text-center text-white/70 p-8">
            <p className="mb-2">Mapbox token required</p>
            <p className="text-sm text-white/40">Set NEXT_PUBLIC_MAPBOX_TOKEN in your environment</p>
          </div>
        </div>
      )}

      {/* Layer controls - top left */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        <LayerToggle
          layer="lightning"
          active={activeLayers.has('lightning')}
          onClick={() => toggleLayer('lightning')}
          icon={Zap}
          label="Lightning"
          count={data?.lightningStats.strikesPerMinute ? `${data.lightningStats.strikesPerMinute}/min` : undefined}
          color="text-yellow-500"
        />
        <LayerToggle
          layer="seismic"
          active={activeLayers.has('seismic')}
          onClick={() => toggleLayer('seismic')}
          icon={Activity}
          label="Earthquakes"
          count={data?.earthquakeStats.count}
          color="text-red-500"
        />
        <LayerToggle
          layer="storms"
          active={activeLayers.has('storms')}
          onClick={() => toggleLayer('storms')}
          icon={Wind}
          label="Storms"
          count={data?.stormStats.count || 0}
          color="text-blue-500"
        />
        <LayerToggle
          layer="volcanic"
          active={activeLayers.has('volcanic')}
          onClick={() => toggleLayer('volcanic')}
          icon={Flame}
          label="Volcanic"
          count={data?.volcanoStats.elevated || 0}
          color="text-orange-500"
        />
      </div>

      {/* Stats bar - bottom */}
      {data && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs">
            <span className="text-white/50">Last updated: </span>
            <span className="font-mono">{new Date(data.lastUpdated).toLocaleTimeString()}</span>
          </div>
          
          {data.earthquakeStats.largest && (
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs">
              <span className="text-white/50">Largest (24h): </span>
              <span className="font-mono font-medium">M{data.earthquakeStats.largest.magnitude}</span>
              <span className="text-white/50 ml-1">{data.earthquakeStats.largest.place?.split(' of ')[1] || ''}</span>
            </div>
          )}
        </div>
      )}

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .mapboxgl-popup-content {
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
