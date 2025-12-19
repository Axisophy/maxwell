'use client';

import { useEffect, useRef, useState } from 'react';
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
  const layersRef = useRef<Map<string, L.LayerGroup>>(new Map());

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map with lunar tile layer
    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      center: [0, 0],
      zoom: 2,
      minZoom: 1,
      maxZoom: 8,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0,
    });

    // Add LROC WAC tile layer from NASA Trek
    const tileLayer = L.tileLayer(
      'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.png',
      {
        attribution: 'NASA/GSFC/Arizona State University',
        tms: true,
        noWrap: true,
        bounds: [[-90, -180], [90, 180]],
      }
    );

    tileLayer.on('load', () => setIsLoading(false));
    tileLayer.on('tileerror', () => {
      setLoadError('Failed to load lunar tiles');
      setIsLoading(false);
    });

    tileLayer.addTo(map);
    mapInstanceRef.current = map;

    // Fallback: if tiles don't load within 5s, show a basic view
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Load and manage GeoJSON layers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const visibleLayerIds = layerGroups
      .flatMap(g => g.layers)
      .filter(l => l.visible)
      .map(l => l.id);

    // Define layer data sources
    const layerSources: Record<string, string> = {
      'maria': '/data/moon/maria.geojson',
      'craters': '/data/moon/craters.geojson',
      'apollo-sites': '/data/moon/apollo-sites.geojson',
    };

    // Load each visible layer
    visibleLayerIds.forEach(async (layerId) => {
      // Skip if already loaded
      if (layersRef.current.has(layerId)) {
        const existingLayer = layersRef.current.get(layerId);
        if (existingLayer && !map.hasLayer(existingLayer)) {
          existingLayer.addTo(map);
        }
        return;
      }

      const source = layerSources[layerId];
      if (!source) return;

      try {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`Failed to load ${layerId}`);

        const geojson: LunarGeoJSON = await response.json();
        const layerConfig = getLayerById(layerGroups, layerId);

        const layer = L.geoJSON(geojson as GeoJSON.FeatureCollection, {
          pointToLayer: (feature, latlng) => {
            // Swap coordinates for Leaflet (it expects [lat, lng])
            const coords = feature.geometry.type === 'Point'
              ? [feature.geometry.coordinates[1], feature.geometry.coordinates[0]] as [number, number]
              : latlng;

            return L.circleMarker(coords, {
              radius: getMarkerRadius(feature.properties.type, feature.properties.diameter),
              fillColor: layerConfig?.color || '#ef4444',
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8,
            });
          },
          onEachFeature: (feature, layer) => {
            // Add click handler
            layer.on('click', () => {
              onFeatureClick({
                id: feature.id as string,
                properties: feature.properties as Record<string, unknown>,
              });
            });

            // Add tooltip
            layer.bindTooltip(feature.properties.name, {
              permanent: false,
              direction: 'top',
              className: 'lunar-tooltip',
            });
          },
        });

        layer.addTo(map);
        layersRef.current.set(layerId, layer);
      } catch (error) {
        console.error(`Error loading layer ${layerId}:`, error);
      }
    });

    // Hide layers that are no longer visible
    layersRef.current.forEach((layer, layerId) => {
      if (!visibleLayerIds.includes(layerId) && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
  }, [layerGroups, onFeatureClick]);

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full bg-black" />

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-[500]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm">Loading lunar imagery...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {loadError && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 z-[500] bg-red-500/90 text-white px-4 py-3 rounded-lg text-sm">
          {loadError}
        </div>
      )}

      {/* Custom tooltip styles */}
      <style jsx global>{`
        .lunar-tooltip {
          background: rgba(0, 0, 0, 0.8);
          border: none;
          border-radius: 4px;
          color: white;
          font-size: 12px;
          padding: 4px 8px;
        }
        .lunar-tooltip::before {
          border-top-color: rgba(0, 0, 0, 0.8);
        }
        .leaflet-container {
          background: #0a0a0f;
        }
      `}</style>
    </div>
  );
}

// Helper to determine marker size based on feature type and diameter
function getMarkerRadius(type: string, diameter?: number): number {
  if (type === 'landing-site') return 10;
  if (type === 'mare') return 12;
  if (type === 'crater' && diameter) {
    if (diameter > 150) return 10;
    if (diameter > 80) return 8;
    return 6;
  }
  return 6;
}
