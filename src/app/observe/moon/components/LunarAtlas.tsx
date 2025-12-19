'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LayerGroup, LunarGeoJSON } from '@/lib/moon/types';
import { getLayerById } from '@/lib/moon/layers';

interface LunarAtlasProps {
  layerGroups: LayerGroup[];
  onFeatureClick: (feature: { id: string; properties: Record<string, unknown> }) => void;
}

export default function LunarAtlas({ layerGroups, onFeatureClick }: LunarAtlasProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<Map<string, L.GeoJSON>>(new Map());
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map with equirectangular projection
    // Moon coordinates: lat -90 to 90, lng -180 to 180
    const map = L.map(mapRef.current, {
      crs: L.CRS.EPSG4326, // Geographic projection
      center: [0, 0],
      zoom: 1,
      minZoom: 0,
      maxZoom: 6,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0,
      attributionControl: false,
    });

    // Use OpenPlanetary Moon basemap (reliable, CORS-enabled)
    // Alternative: CartoDB lunar tiles
    const tileLayer = L.tileLayer(
      'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-moon-basemap-v0-1/all/{z}/{x}/{y}.png',
      {
        noWrap: true,
        bounds: [[-90, -180], [90, 180]],
        maxNativeZoom: 6,
      }
    );

    tileLayer.on('load', () => {
      setIsLoading(false);
    });

    tileLayer.on('tileerror', (e) => {
      console.warn('Tile error:', e);
      // Don't show error for individual tile failures, only total failure
    });

    tileLayer.addTo(map);
    mapInstanceRef.current = map;

    // Mark map as ready after a short delay to ensure it's fully initialized
    const readyTimeout = setTimeout(() => {
      setMapReady(true);
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(readyTimeout);
      map.remove();
      mapInstanceRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Load GeoJSON layers only after map is ready
  const loadLayers = useCallback(async () => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    const visibleLayerIds = layerGroups
      .flatMap(g => g.layers)
      .filter(l => l.visible)
      .map(l => l.id);

    // Layer data sources
    const layerSources: Record<string, string> = {
      'maria': '/data/moon/maria.geojson',
      'craters': '/data/moon/craters.geojson',
      'apollo-sites': '/data/moon/apollo-sites.geojson',
    };

    // Load each visible layer
    for (const layerId of visibleLayerIds) {
      // Skip if already loaded and on map
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
          style: (feature) => {
            // Style for non-point features (polygons)
            return {
              fillColor: layerConfig?.color || '#3b82f6',
              color: '#ffffff',
              weight: 1,
              fillOpacity: 0.3,
            };
          },
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

    // Hide layers that are no longer visible
    layersRef.current.forEach((layer, layerId) => {
      if (!visibleLayerIds.includes(layerId) && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
  }, [layerGroups, onFeatureClick, mapReady]);

  // Load layers when map is ready or layer config changes
  useEffect(() => {
    if (mapReady) {
      loadLayers();
    }
  }, [mapReady, loadLayers]);

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full bg-neutral-900" />

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/90 z-[1000]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm">Loading lunar imagery...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {loadError && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-red-500/90 text-white px-4 py-3 rounded-lg text-sm">
          {loadError}
        </div>
      )}

      {/* Custom tooltip styles */}
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

// Helper to determine marker size based on feature type and diameter
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
