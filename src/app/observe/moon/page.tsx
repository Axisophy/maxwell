'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Globe, ZoomIn, Moon } from 'lucide-react';
import LayerControls from './components/LayerControls';
import InfoPanel from './components/InfoPanel';
import { LayerGroup } from '@/lib/moon/types';
import { defaultLayers, toggleLayer, toggleGroup } from '@/lib/moon/layers';

// Dynamic import for Leaflet (SSR issues)
const LunarAtlas = dynamic(
  () => import('./components/LunarAtlas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <Moon className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-sm">Initializing lunar atlas...</p>
        </div>
      </div>
    ),
  }
);

interface SelectedFeature {
  id: string;
  properties: Record<string, unknown>;
}

export default function MoonPage() {
  const [layerGroups, setLayerGroups] = useState<LayerGroup[]>(defaultLayers);
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);

  // Handle layer toggle
  const handleToggleLayer = useCallback((layerId: string) => {
    setLayerGroups(prev => toggleLayer(prev, layerId));
  }, []);

  // Handle group toggle
  const handleToggleGroup = useCallback((groupId: string) => {
    setLayerGroups(prev => toggleGroup(prev, groupId));
  }, []);

  // Handle feature click
  const handleFeatureClick = useCallback((feature: SelectedFeature) => {
    setSelectedFeature(feature);
  }, []);

  // Close info panel
  const handleCloseInfo = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  return (
    <div className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-80px)] flex flex-col bg-[#f5f5f5] -mt-14 md:mt-0 -mb-16 md:mb-0">
      {/* Header bar */}
      <header className="flex-shrink-0 bg-white border-b border-neutral-200 relative z-10">
        <div className="px-4 md:px-8 lg:px-12 py-3 md:py-4 flex items-center justify-between">
          {/* Left: Back and title */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/observe"
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Back to Observe"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg md:text-xl font-light text-black">Lunar Atlas</h1>
              <p className="text-xs md:text-sm text-black/50 hidden md:block">
                Explore the Moon&apos;s surface
              </p>
            </div>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-2">
            <Link
              href="/data/moon"
              className="flex items-center gap-2 px-3 py-2 text-sm bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
            >
              <span className="hidden md:inline">Moon Data</span>
              <span className="md:hidden">Data</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Map container */}
      <div className="flex-1 relative">
        <LunarAtlas
          layerGroups={layerGroups}
          onFeatureClick={handleFeatureClick}
        />

        {/* Layer controls */}
        <LayerControls
          groups={layerGroups}
          onToggleLayer={handleToggleLayer}
          onToggleGroup={handleToggleGroup}
        />

        {/* Info panel */}
        <InfoPanel
          feature={selectedFeature}
          onClose={handleCloseInfo}
        />

        {/* Attribution */}
        <div className="absolute bottom-2 right-2 z-[400] text-xs text-white/40 bg-black/40 px-2 py-1 rounded">
          Imagery: NASA/GSFC/Arizona State University
        </div>
      </div>
    </div>
  );
}
