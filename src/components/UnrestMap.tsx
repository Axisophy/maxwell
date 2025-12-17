'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Zap, Activity, Wind, Flame } from 'lucide-react';
import { UnrestLayer, Earthquake } from '@/lib/unrest/types';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface UnrestMapProps {
  className?: string;
  onEarthquakeSelect?: (eq: Earthquake) => void;
}

interface MapData {
  lightning: Array<{ id: string; lat: number; lng: number; intensity: number }>;
  earthquakes: Earthquake[];
  storms: Array<{ id: string; name: string; lat: number; lng: number; category: number | null; windSpeed: number; type: string; movement: string }>;
  volcanoes: Array<{ id: string; name: string; lat: number; lng: number; alertLevel: string; country: string }>;
  lightningStats: { strikesPerMinute: number; activeCells: number };
  earthquakeStats: { count: number; largest: Earthquake | null };
  stormStats: { count: number };
  volcanoStats: { elevated: number; red: number };
  lastUpdated: string;
}

function LayerToggle({ 
  active, 
  onClick, 
  icon: Icon, 
  label,
  count,
  color
}: { 
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
  const popup = useRef<mapboxgl.Popup | null>(null);
  
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
      console.log('Fetched data:', {
        lightningCount: newData.lightning?.length,
        earthquakeCount: newData.earthquakes?.length,
        stormCount: newData.storms?.length,
        volcanoCount: newData.volcanoes?.length,
        sampleLightning: newData.lightning?.[0],
        sampleStorm: newData.storms?.[0],
      });
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
      minZoom: 1,
      maxZoom: 12,
      projection: 'mercator',
      attributionControl: false,
      renderWorldCopies: false,
      maxBounds: [[-180, -85], [180, 85]],
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'bottom-right'
    );

    // Disable scroll zoom on touch devices to prevent hijacking page scroll
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      map.current.scrollZoom.disable();
    }

    // Create popup
    popup.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.current.on('load', () => {
      const m = map.current!;
      
      // Add empty sources
      m.addSource('lightning', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      
      m.addSource('earthquakes', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      
      m.addSource('storms', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      
      m.addSource('volcanoes', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // Lightning layer - yellow/orange circles
      m.addLayer({
        id: 'lightning-glow',
        type: 'circle',
        source: 'lightning',
        paint: {
          'circle-radius': 8,
          'circle-color': '#fbbf24',
          'circle-opacity': 0.3,
          'circle-blur': 1,
        }
      });
      
      m.addLayer({
        id: 'lightning-points',
        type: 'circle',
        source: 'lightning',
        paint: {
          'circle-radius': 4,
          'circle-color': '#fbbf24',
          'circle-opacity': ['get', 'intensity'],
        }
      });

      // Earthquake layer - red circles sized by magnitude
      m.addLayer({
        id: 'earthquakes-glow',
        type: 'circle',
        source: 'earthquakes',
        paint: {
          'circle-radius': ['*', ['get', 'magnitude'], 4],
          'circle-color': '#ef4444',
          'circle-opacity': 0.3,
          'circle-blur': 1,
        }
      });
      
      m.addLayer({
        id: 'earthquakes-points',
        type: 'circle',
        source: 'earthquakes',
        paint: {
          'circle-radius': ['*', ['get', 'magnitude'], 2],
          'circle-color': '#ef4444',
          'circle-opacity': 0.8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.5,
        }
      });

      // Storm layer - blue rings
      m.addLayer({
        id: 'storms-outer',
        type: 'circle',
        source: 'storms',
        paint: {
          'circle-radius': ['coalesce', ['*', ['get', 'category'], 8], 20],
          'circle-color': 'transparent',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#3b82f6',
          'circle-stroke-opacity': 0.8,
        }
      });
      
      m.addLayer({
        id: 'storms-inner',
        type: 'circle',
        source: 'storms',
        paint: {
          'circle-radius': ['coalesce', ['*', ['get', 'category'], 4], 10],
          'circle-color': '#3b82f6',
          'circle-opacity': 0.4,
        }
      });

      // Volcano layer - orange/red triangles (using circles with color by alert level)
      m.addLayer({
        id: 'volcanoes-glow',
        type: 'circle',
        source: 'volcanoes',
        paint: {
          'circle-radius': 12,
          'circle-color': [
            'match', ['get', 'alertLevel'],
            'red', '#ef4444',
            'orange', '#f97316',
            'yellow', '#eab308',
            '#22c55e'
          ],
          'circle-opacity': 0.3,
          'circle-blur': 1,
        }
      });
      
      m.addLayer({
        id: 'volcanoes-points',
        type: 'circle',
        source: 'volcanoes',
        paint: {
          'circle-radius': 6,
          'circle-color': [
            'match', ['get', 'alertLevel'],
            'red', '#ef4444',
            'orange', '#f97316',
            'yellow', '#eab308',
            '#22c55e'
          ],
          'circle-opacity': 0.9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.7,
        }
      });

      // Hover interactions
      m.on('mouseenter', 'earthquakes-points', (e) => {
        m.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          const coords = (e.features[0].geometry as any).coordinates;
          popup.current?.setLngLat(coords)
            .setHTML(`
              <div style="font-family: system-ui; padding: 4px;">
                <div style="font-weight: 600;">M${props?.magnitude}</div>
                <div style="font-size: 12px; color: #666;">${props?.place}</div>
                <div style="font-size: 11px; color: #999;">Depth: ${props?.depth}km</div>
              </div>
            `)
            .addTo(m);
        }
      });

      m.on('mouseleave', 'earthquakes-points', () => {
        m.getCanvas().style.cursor = '';
        popup.current?.remove();
      });

      m.on('mouseenter', 'storms-outer', (e) => {
        m.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          const coords = (e.features[0].geometry as any).coordinates;
          popup.current?.setLngLat(coords)
            .setHTML(`
              <div style="font-family: system-ui; padding: 4px;">
                <div style="font-weight: 600;">${props?.name}</div>
                <div style="font-size: 12px; color: #666;">${props?.type}${props?.category ? ` Cat ${props.category}` : ''}</div>
                <div style="font-size: 11px; color: #999;">${Math.round(props?.windSpeed || 0)} mph</div>
              </div>
            `)
            .addTo(m);
        }
      });

      m.on('mouseleave', 'storms-outer', () => {
        m.getCanvas().style.cursor = '';
        popup.current?.remove();
      });

      m.on('mouseenter', 'volcanoes-points', (e) => {
        m.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          const coords = (e.features[0].geometry as any).coordinates;
          const colors: Record<string, string> = { red: '#ef4444', orange: '#f97316', yellow: '#eab308' };
          popup.current?.setLngLat(coords)
            .setHTML(`
              <div style="font-family: system-ui; padding: 4px;">
                <div style="font-weight: 600;">${props?.name}</div>
                <div style="font-size: 12px; color: #666;">${props?.country}</div>
                <div style="font-size: 11px; color: ${colors[props?.alertLevel] || '#666'}; font-weight: 600;">${(props?.alertLevel || '').toUpperCase()} ALERT</div>
              </div>
            `)
            .addTo(m);
        }
      });

      m.on('mouseleave', 'volcanoes-points', () => {
        m.getCanvas().style.cursor = '';
        popup.current?.remove();
      });

      // Click handler for earthquakes
      m.on('click', 'earthquakes-points', (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          if (props && onEarthquakeSelect) {
            onEarthquakeSelect({
              id: props.id,
              lat: props.lat,
              lng: props.lng,
              depth: props.depth,
              magnitude: props.magnitude,
              place: props.place,
              time: props.time,
              url: props.url,
            });
          }
        }
      });

      setMapLoaded(true);
    });

    return () => {
      popup.current?.remove();
      map.current?.remove();
      map.current = null;
    };
  }, [onEarthquakeSelect]);

  // Update data sources when data changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !data) return;

    const m = map.current;

    // Update lightning
    if (data.lightning && Array.isArray(data.lightning)) {
      const lightningFeatures = data.lightning
        .filter(s => typeof s.lng === 'number' && typeof s.lat === 'number' && !isNaN(s.lng) && !isNaN(s.lat))
        .slice(0, 500)
        .map(strike => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [strike.lng, strike.lat]
          },
          properties: {
            id: strike.id,
            intensity: strike.intensity || 0.7,
          }
        }));
      
      console.log('Lightning features:', lightningFeatures.length, lightningFeatures[0]);
      
      const source = m.getSource('lightning') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({ type: 'FeatureCollection', features: lightningFeatures });
      }
    }

    // Update earthquakes
    if (data.earthquakes && Array.isArray(data.earthquakes)) {
      const earthquakeFeatures = data.earthquakes
        .filter(eq => typeof eq.lng === 'number' && typeof eq.lat === 'number' && !isNaN(eq.lng) && !isNaN(eq.lat))
        .map(eq => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [eq.lng, eq.lat]
          },
          properties: {
            id: eq.id,
            magnitude: eq.magnitude,
            depth: eq.depth,
            place: eq.place,
            time: eq.time,
            url: eq.url,
            lat: eq.lat,
            lng: eq.lng,
          }
        }));
      
      const source = m.getSource('earthquakes') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({ type: 'FeatureCollection', features: earthquakeFeatures });
      }
    }

    // Update storms
    if (data.storms && Array.isArray(data.storms)) {
      const stormFeatures = data.storms
        .filter(s => typeof s.lng === 'number' && typeof s.lat === 'number' && !isNaN(s.lng) && !isNaN(s.lat))
        .map(storm => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [storm.lng, storm.lat]
          },
          properties: {
            id: storm.id,
            name: storm.name,
            type: storm.type,
            category: storm.category,
            windSpeed: storm.windSpeed,
            movement: storm.movement,
          }
        }));
      
      console.log('Storm features:', stormFeatures.length, stormFeatures[0]);
      
      const source = m.getSource('storms') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({ type: 'FeatureCollection', features: stormFeatures });
      }
    }

    // Update volcanoes
    if (data.volcanoes && Array.isArray(data.volcanoes)) {
      const volcanoFeatures = data.volcanoes
        .filter(v => v.alertLevel !== 'green')
        .filter(v => typeof v.lng === 'number' && typeof v.lat === 'number' && !isNaN(v.lng) && !isNaN(v.lat))
        .map(volcano => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [volcano.lng, volcano.lat]
          },
          properties: {
            id: volcano.id,
            name: volcano.name,
            country: volcano.country,
            alertLevel: volcano.alertLevel,
          }
        }));
      
      const source = m.getSource('volcanoes') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({ type: 'FeatureCollection', features: volcanoFeatures });
      }
    }
  }, [data, mapLoaded]);

  // Update layer visibility
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const m = map.current;

    const lightningVisible = activeLayers.has('lightning');
    const seismicVisible = activeLayers.has('seismic');
    const stormsVisible = activeLayers.has('storms');
    const volcanicVisible = activeLayers.has('volcanic');

    m.setLayoutProperty('lightning-glow', 'visibility', lightningVisible ? 'visible' : 'none');
    m.setLayoutProperty('lightning-points', 'visibility', lightningVisible ? 'visible' : 'none');
    m.setLayoutProperty('earthquakes-glow', 'visibility', seismicVisible ? 'visible' : 'none');
    m.setLayoutProperty('earthquakes-points', 'visibility', seismicVisible ? 'visible' : 'none');
    m.setLayoutProperty('storms-outer', 'visibility', stormsVisible ? 'visible' : 'none');
    m.setLayoutProperty('storms-inner', 'visibility', stormsVisible ? 'visible' : 'none');
    m.setLayoutProperty('volcanoes-glow', 'visibility', volcanicVisible ? 'visible' : 'none');
    m.setLayoutProperty('volcanoes-points', 'visibility', volcanicVisible ? 'visible' : 'none');
  }, [activeLayers, mapLoaded]);

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
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ minHeight: '500px' }}
      />

      {(loading || !mapLoaded) && MAPBOX_TOKEN && (
        <div className="absolute inset-0 bg-[#0f172a] rounded-xl flex items-center justify-center">
          <span className="text-white/50">Loading map...</span>
        </div>
      )}

      {!MAPBOX_TOKEN && (
        <div className="absolute inset-0 bg-[#0f172a] rounded-xl flex items-center justify-center">
          <div className="text-center text-white/70 p-8">
            <p className="mb-2">Mapbox token required</p>
            <p className="text-sm text-white/40">Set NEXT_PUBLIC_MAPBOX_TOKEN in your environment</p>
          </div>
        </div>
      )}

      {/* Layer controls */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        <LayerToggle
          active={activeLayers.has('lightning')}
          onClick={() => toggleLayer('lightning')}
          icon={Zap}
          label="Lightning"
          count={data?.lightningStats?.strikesPerMinute ? `${data.lightningStats.strikesPerMinute}/min` : undefined}
          color="text-yellow-500"
        />
        <LayerToggle
          active={activeLayers.has('seismic')}
          onClick={() => toggleLayer('seismic')}
          icon={Activity}
          label="Earthquakes"
          count={data?.earthquakeStats?.count}
          color="text-red-500"
        />
        <LayerToggle
          active={activeLayers.has('storms')}
          onClick={() => toggleLayer('storms')}
          icon={Wind}
          label="Storms"
          count={data?.stormStats?.count || 0}
          color="text-blue-500"
        />
        <LayerToggle
          active={activeLayers.has('volcanic')}
          onClick={() => toggleLayer('volcanic')}
          icon={Flame}
          label="Volcanic"
          count={data?.volcanoStats?.elevated || 0}
          color="text-orange-500"
        />
      </div>

      {/* Stats bar */}
      {data && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs">
            <span className="text-white/50">Last updated: </span>
            <span className="font-mono">{new Date(data.lastUpdated).toLocaleTimeString()}</span>
          </div>
          
          {data.earthquakeStats?.largest && (
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs">
              <span className="text-white/50">Largest (24h): </span>
              <span className="font-mono font-medium">M{data.earthquakeStats.largest.magnitude}</span>
              <span className="text-white/50 ml-1">{data.earthquakeStats.largest.place?.split(' of ')[1] || ''}</span>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}