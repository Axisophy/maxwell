'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LayerGroup } from '@/lib/moon/types';
import { getLayerById } from '@/lib/moon/layers';

interface LunarAtlasProps {
  layerGroups: LayerGroup[];
  onFeatureClick: (feature: { id: string; properties: Record<string, unknown> }) => void;
}

// ============================================================================
// COORDINATE CONVERSION
// ============================================================================
// The tiles are in standard XYZ format. At zoom 0, the entire moon fits in
// one 256x256 tile. We use CRS.Simple which treats coordinates as pixels.
//
// GeoJSON data uses lunar geographic coordinates:
//   lat: -90 to 90 (south pole to north pole)
//   lng: -180 to 180 (far side to near side, 0° = center of near side)
//
// We need to convert these to CRS.Simple pixel coordinates where:
//   At zoom 0: x = 0-256, y = 0-256
//   Origin (0,0) is top-left of the tile
// ============================================================================

function lunarLatLngToSimple(lat: number, lng: number): L.LatLngExpression {
  // Convert lunar coordinates to pixel positions at zoom 0
  // lng: -180 to 180 → x: 0 to 256
  // lat: 90 to -90 → y: 0 to 256 (note: latitude is inverted for y-down)
  const x = ((lng + 180) / 360) * 256;
  const y = ((90 - lat) / 180) * 256;

  // Leaflet's LatLng expects [lat, lng] but in CRS.Simple this is [y, x]
  // However, L.geoJSON swaps them internally, so we return [y, x]
  return [y, x];
}

// Convert entire GeoJSON to CRS.Simple coordinates
function convertGeoJSONToSimple(geojson: GeoJSON.FeatureCollection): GeoJSON.FeatureCollection {
  return {
    ...geojson,
    features: geojson.features.map(feature => {
      const geometry = feature.geometry;

      if (geometry.type === 'Point') {
        const [lng, lat] = geometry.coordinates as [number, number];
        const [y, x] = lunarLatLngToSimple(lat, lng) as [number, number];
        return {
          ...feature,
          geometry: {
            type: 'Point' as const,
            coordinates: [x, y], // GeoJSON uses [x, y] = [lng, lat]
          },
        };
      }

      if (geometry.type === 'Polygon') {
        const newCoords = (geometry.coordinates as number[][][]).map(ring =>
          ring.map(([lng, lat]) => {
            const [y, x] = lunarLatLngToSimple(lat, lng) as [number, number];
            return [x, y];
          })
        );
        return {
          ...feature,
          geometry: {
            type: 'Polygon' as const,
            coordinates: newCoords,
          },
        };
      }

      if (geometry.type === 'LineString') {
        const newCoords = (geometry.coordinates as number[][]).map(([lng, lat]) => {
          const [y, x] = lunarLatLngToSimple(lat, lng) as [number, number];
          return [x, y];
        });
        return {
          ...feature,
          geometry: {
            type: 'LineString' as const,
            coordinates: newCoords,
          },
        };
      }

      // Return unchanged for other geometry types
      return feature;
    }),
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function LunarAtlas({ layerGroups, onFeatureClick }: LunarAtlasProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<Map<string, L.GeoJSON>>(new Map());
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // ========================================================================
    // CRS.Simple Setup
    // ========================================================================
    // At zoom 0: one 256x256 tile covers the entire map
    // Bounds in CRS.Simple are in pixel coordinates
    // We want the center of the map at (128, 128) which corresponds to
    // lunar coordinates (0°, 0°) - the center of the near side
    // ========================================================================

    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: 6,
      attributionControl: false,
      zoomControl: true,
    });

    // Calculate proper bounds for CRS.Simple using unproject
    // At zoom 0, the tile is 256x256 pixels
    // unproject converts pixel coordinates to LatLng in CRS.Simple space
    const southWest = map.unproject([0, 256], 0);
    const northEast = map.unproject([256, 0], 0);
    const bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds.pad(0.1));
    map.fitBounds(bounds);
    map.setView(bounds.getCenter(), 1);

    // ========================================================================
    // Tile Layer
    // ========================================================================
    const tileLayer = L.tileLayer(
      'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-moon-basemap-v0-1/all/{z}/{x}/{y}.png',
      {
        minZoom: 0,
        maxZoom: 6,
        noWrap: true,
        errorTileUrl: '', // Suppress error tile display
      }
    );

    tileLayer.on('load', () => {
      setIsLoading(false);
    });

    tileLayer.on('tileerror', (e: L.TileErrorEvent) => {
      console.warn('Tile load error:', e.coords);
    });

    tileLayer.addTo(map);
    mapInstanceRef.current = map;

    // Mark map as ready after tiles start loading
    const readyTimeout = setTimeout(() => {
      setMapReady(true);
      setIsLoading(false);
    }, 300);

    return () => {
      clearTimeout(readyTimeout);
      map.remove();
      mapInstanceRef.current = null;
      layersRef.current.clear();
      setMapReady(false);
    };
  }, []);

  // ========================================================================
  // Layer Loading
  // ========================================================================
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
      // Skip if already loaded
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

        const rawGeojson = await response.json();

        // Convert coordinates from lunar lat/lng to CRS.Simple pixels
        const geojson = convertGeoJSONToSimple(rawGeojson as GeoJSON.FeatureCollection);

        const layerConfig = getLayerById(layerGroups, layerId);

        const layer = L.geoJSON(geojson, {
          pointToLayer: (feature: GeoJSON.Feature, latlng: L.LatLng) => {
            return L.circleMarker(latlng, {
              radius: getMarkerRadius(feature.properties?.type, feature.properties?.diameter),
              fillColor: layerConfig?.color || '#ef4444',
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8,
            });
          },
          style: () => ({
            fillColor: layerConfig?.color || '#3b82f6',
            color: '#ffffff',
            weight: 1,
            fillOpacity: 0.3,
          }),
          onEachFeature: (feature: GeoJSON.Feature, featureLayer: L.Layer) => {
            featureLayer.on('click', () => {
              onFeatureClick({
                id: (feature.id as string) || feature.properties?.name || 'unknown',
                properties: feature.properties as Record<string, unknown>,
              });
            });

            if (feature.properties?.name) {
              (featureLayer as L.CircleMarker).bindTooltip(feature.properties.name, {
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

  // Load layers when ready or config changes
  useEffect(() => {
    if (mapReady) {
      loadLayers();
    }
  }, [mapReady, loadLayers]);

  // ========================================================================
  // Render
  // ========================================================================
  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full bg-neutral-900 rounded-xl" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/90 z-[1000] rounded-xl">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm">Loading lunar imagery...</p>
          </div>
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
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(0,0,0,0.9) !important;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================

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
