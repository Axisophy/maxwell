'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LayerGroup, LunarGeoJSON } from '@/lib/moon/types';
import { getLayerById } from '@/lib/moon/layers';

// Search result type
interface SearchResult {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
}

// Basemap configurations
const BASEMAPS = {
  openplanetary: {
    id: 'openplanetary',
    name: 'OpenPlanetary',
    description: 'Standard lunar basemap',
    url: 'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-moon-basemap-v0-1/all/{z}/{x}/{y}.png',
    attribution: 'OpenPlanetary',
    maxNativeZoom: 6,
    wms: false,
  },
  usgs_lro_wac: {
    id: 'usgs_lro_wac',
    name: 'USGS LRO WAC',
    description: 'High-detail LROC Wide Angle Camera',
    url: 'https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map&service=WMS&version=1.1.1&request=GetMap&layers=LROC_WAC&styles=&format=image/png&transparent=true&srs=EPSG:4326&width=256&height=256&bbox={bbox}',
    attribution: 'USGS / NASA LRO',
    maxNativeZoom: 8,
    wms: true,
  },
  usgs_clementine: {
    id: 'usgs_clementine',
    name: 'Clementine UV/VIS',
    description: 'Clementine 750nm imagery',
    url: 'https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map&service=WMS&version=1.1.1&request=GetMap&layers=uv750&styles=&format=image/png&transparent=true&srs=EPSG:4326&width=256&height=256&bbox={bbox}',
    attribution: 'USGS / Clementine',
    maxNativeZoom: 6,
    wms: true,
  },
} as const;

type BasemapId = keyof typeof BASEMAPS;

interface LunarAtlasProps {
  layerGroups: LayerGroup[];
  onFeatureClick: (feature: { id: string; properties: Record<string, unknown> }) => void;
}

export default function LunarAtlas({ layerGroups, onFeatureClick }: LunarAtlasProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | L.TileLayer.WMS | null>(null);
  const layersRef = useRef<Map<string, L.GeoJSON>>(new Map());
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeBasemap, setActiveBasemap] = useState<BasemapId>('openplanetary');
  const [showBasemapSelector, setShowBasemapSelector] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTouchHint, setShowTouchHint] = useState(true);

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map with equirectangular projection
    const map = L.map(mapRef.current, {
      crs: L.CRS.EPSG4326,
      center: [0, 0],
      zoom: 2,           // Start slightly zoomed in
      minZoom: 1,        // Prevent zooming out to show multiple tiles
      maxZoom: 8,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0,
      attributionControl: false,
      worldCopyJump: false,  // Ensure no world copy behavior
    });

    mapInstanceRef.current = map;

    // Coordinate tracking on mouse move
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCoordinates({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    });

    map.on('mouseout', () => {
      setCoordinates(null);
    });

    // Add scale bar
    L.control.scale({
      metric: true,
      imperial: false,
      position: 'bottomleft',
      maxWidth: 150,
    }).addTo(map);

    // Mark map as ready after initialization
    const readyTimeout = setTimeout(() => {
      setMapReady(true);
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(readyTimeout);
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Handle basemap changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Remove existing tile layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = BASEMAPS[activeBasemap];
    setIsLoading(true);
    setLoadError(null);

    let tileLayer: L.TileLayer | L.TileLayer.WMS;

    if (config.wms) {
      // WMS layer for USGS services
      tileLayer = L.tileLayer.wms(
        'https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map',
        {
          layers: config.id === 'usgs_lro_wac' ? 'LROC_WAC' : 'uv750',
          format: 'image/png',
          transparent: true,
          crs: L.CRS.EPSG4326,
          bounds: [[-90, -180], [90, 180]],
          noWrap: true,  // Prevent tile repetition
        }
      );
    } else {
      // Standard tile layer
      tileLayer = L.tileLayer(config.url, {
        noWrap: true,
        bounds: [[-90, -180], [90, 180]],
        maxNativeZoom: config.maxNativeZoom,
        errorTileUrl: '', // Suppress error tiles
      });
    }

    tileLayer.on('load', () => {
      setIsLoading(false);
    });

    tileLayer.on('tileerror', (e) => {
      console.warn(`Tile error on ${activeBasemap}:`, e);
    });

    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;

    // Timeout to handle slow/failed tile loads
    const loadTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(loadTimeout);
    };
  }, [activeBasemap, mapReady]);

  // Load GeoJSON layers only after map is ready
  const loadLayers = useCallback(async () => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    const visibleLayerIds = layerGroups
      .flatMap(g => g.layers)
      .filter(l => l.visible)
      .map(l => l.id);

    const layerSources: Record<string, string> = {
      'maria': '/data/moon/maria.geojson',
      'craters': '/data/moon/craters.geojson',
      'apollo-sites': '/data/moon/apollo-sites.geojson',
    };

    for (const layerId of visibleLayerIds) {
      if (layersRef.current.has(layerId)) {
        const existingLayer = layersRef.current.get(layerId);
        if (existingLayer && !map.hasLayer(existingLayer)) {
          existingLayer.addTo(map);
        }
        continue;
      }

      const source = layerSources[layerId];
      if (!source) continue;

      try {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`Failed to load ${layerId}`);

        const geojson: LunarGeoJSON = await response.json();
        const layerConfig = getLayerById(layerGroups, layerId);

        const layer = L.geoJSON(geojson as GeoJSON.FeatureCollection, {
          pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: getMarkerRadius(feature.properties?.type, feature.properties?.diameter),
              fillColor: layerConfig?.color || '#ef4444',
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8,
            });
          },
          style: (feature) => ({
            fillColor: layerConfig?.color || '#3b82f6',
            color: '#ffffff',
            weight: 1,
            fillOpacity: 0.3,
          }),
          onEachFeature: (feature, featureLayer) => {
            featureLayer.on('click', (e) => {
              // Get the clicked location for zooming
              const latlng = e.latlng || (featureLayer as L.CircleMarker).getLatLng?.();

              // Fly to the feature
              if (latlng && mapInstanceRef.current) {
                mapInstanceRef.current.flyTo(latlng, 5, {
                  duration: 0.8,
                });
              }

              // Trigger the info panel
              onFeatureClick({
                id: (feature.id as string) || feature.properties?.name || 'unknown',
                properties: feature.properties as Record<string, unknown>,
              });
            });

            if (feature.properties?.name) {
              featureLayer.bindTooltip(feature.properties.name, {
                permanent: false,
                direction: 'top',
                className: 'lunar-tooltip',
              });
            }
          },
        });

        layer.addTo(map);
        layersRef.current.set(layerId, layer);
      } catch (error) {
        console.error(`Error loading layer ${layerId}:`, error);
      }
    }

    layersRef.current.forEach((layer, layerId) => {
      if (!visibleLayerIds.includes(layerId) && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
  }, [layerGroups, onFeatureClick, mapReady]);

  useEffect(() => {
    if (mapReady) {
      loadLayers();
    }
  }, [mapReady, loadLayers]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    const container = mapRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes (e.g., Escape key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide touch hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTouchHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Search features
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    layersRef.current.forEach((layer) => {
      layer.eachLayer((featureLayer) => {
        const feature = (featureLayer as L.GeoJSON).feature as GeoJSON.Feature | undefined;
        if (feature?.properties?.name) {
          const name = feature.properties.name as string;
          if (name.toLowerCase().includes(query)) {
            // Get coordinates
            let coords: [number, number] = [0, 0];
            if (feature.geometry.type === 'Point') {
              const geom = feature.geometry as GeoJSON.Point;
              coords = [geom.coordinates[1], geom.coordinates[0]];
            } else if ('getBounds' in featureLayer) {
              const center = (featureLayer as L.Polygon).getBounds().getCenter();
              coords = [center.lat, center.lng];
            }

            results.push({
              id: (feature.id as string) || name,
              name,
              type: (feature.properties.type as string) || 'feature',
              coordinates: coords,
            });
          }
        }
      });
    });

    setSearchResults(results.slice(0, 20));
  }, [searchQuery]);

  // Handle search result click
  const handleSearchResultClick = useCallback((result: SearchResult) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(result.coordinates, 5, { duration: 0.8 });
    }
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full bg-neutral-900" />

      {/* Search input - top left */}
      <div className="absolute top-4 left-4 right-28 md:right-auto z-[1000]">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search features..."
            className="bg-black/80 backdrop-blur-sm text-white text-sm pl-10 pr-4 py-2 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/40"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Search results dropdown */}
        {searchQuery.length > 1 && searchResults.length > 0 && (
          <div className="absolute top-full left-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl w-full max-h-64 overflow-y-auto">
            {searchResults.slice(0, 8).map((result) => (
              <button
                key={result.id}
                onClick={() => handleSearchResultClick(result)}
                className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors"
              >
                <div className="text-white text-sm">{result.name}</div>
                <div className="text-white/40 text-xs capitalize">{result.type}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Controls container - top right */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="bg-black/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/90 transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>

        {/* Basemap selector toggle */}
        <div className="relative">
          <button
            onClick={() => setShowBasemapSelector(!showBasemapSelector)}
            className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-black/90 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Basemap
          </button>

          {/* Basemap dropdown */}
          {showBasemapSelector && (
            <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl min-w-[200px]">
              {Object.values(BASEMAPS).map((basemap) => (
                <button
                  key={basemap.id}
                  onClick={() => {
                    setActiveBasemap(basemap.id as BasemapId);
                    setShowBasemapSelector(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                    activeBasemap === basemap.id ? 'bg-white/20' : ''
                  }`}
                >
                  <div className="text-white text-sm font-medium">{basemap.name}</div>
                  <div className="text-white/50 text-xs mt-0.5">{basemap.description}</div>
                </button>
              ))}
              <div className="px-4 py-2 border-t border-white/10">
                <div className="text-white/40 text-[10px] uppercase tracking-wider">
                  Surface Detail Preview
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Coordinate display - bottom left */}
      {coordinates && (
        <div className="absolute bottom-16 left-4 z-[1000] bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg font-mono text-xs text-white/80">
          <span className="text-white/50 mr-2">LAT</span>
          <span>{coordinates.lat.toFixed(3)}°</span>
          <span className="text-white/30 mx-2">|</span>
          <span className="text-white/50 mr-2">LON</span>
          <span>{coordinates.lng.toFixed(3)}°</span>
        </div>
      )}

      {/* Current basemap indicator */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded text-xs text-white/60">
        {BASEMAPS[activeBasemap].attribution}
      </div>

      {/* Mobile touch hint */}
      {showTouchHint && (
        <div className="absolute inset-x-4 bottom-20 z-[999] md:hidden">
          <div className="bg-black/80 backdrop-blur-sm text-white/80 text-xs text-center py-2 px-4 rounded-lg">
            Pinch to zoom • Drag to pan • Tap features for details
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/90 z-[1000] pointer-events-none">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm">Loading {BASEMAPS[activeBasemap].name}...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {loadError && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-red-500/90 text-white px-4 py-3 rounded-lg text-sm">
          {loadError}
        </div>
      )}

      {/* Custom styles */}
      <style jsx global>{`
        .lunar-tooltip {
          background: rgba(0, 0, 0, 0.85);
          border: none;
          border-radius: 4px;
          color: white;
          font-size: 12px;
          padding: 4px 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .lunar-tooltip::before {
          border-top-color: rgba(0, 0, 0, 0.85) !important;
        }
        .leaflet-container {
          background: #171717;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
        }
        .leaflet-control-zoom a {
          background: rgba(0,0,0,0.7) !important;
          color: white !important;
          border: none !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(0,0,0,0.9) !important;
        }
        .leaflet-control-scale {
          background: transparent !important;
          border: none !important;
          margin-left: 16px !important;
          margin-bottom: 48px !important;
        }
        .leaflet-control-scale-line {
          background: rgba(0, 0, 0, 0.7) !important;
          border: none !important;
          border-bottom: 2px solid rgba(255, 255, 255, 0.6) !important;
          color: rgba(255, 255, 255, 0.6) !important;
          font-size: 10px !important;
          font-family: ui-monospace, monospace !important;
          padding: 2px 6px !important;
          text-shadow: none !important;
        }
      `}</style>
    </div>
  );
}

function getMarkerRadius(type?: string, diameter?: number): number {
  if (type === 'landing-site') return 10;
  if (type === 'mare') return 12;
  if (type === 'crater' && diameter) {
    if (diameter > 150) return 10;
    if (diameter > 80) return 8;
    return 6;
  }
  return 6;
}
