'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LayerGroup, LunarGeoJSON } from '@/lib/moon/types';
import { getLayerById } from '@/lib/moon/layers';

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

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map with equirectangular projection
    const map = L.map(mapRef.current, {
      crs: L.CRS.EPSG4326,
      center: [0, 0],
      zoom: 1,
      minZoom: 0,
      maxZoom: 8,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

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
            featureLayer.on('click', () => {
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

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full bg-neutral-900" />

      {/* Basemap selector toggle */}
      <div className="absolute top-4 right-4 z-[1000]">
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

      {/* Current basemap indicator */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded text-xs text-white/60">
        {BASEMAPS[activeBasemap].attribution}
      </div>

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
