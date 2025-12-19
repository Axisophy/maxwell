'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Moon } from 'lucide-react';
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
      <div className="w-full h-[500px] bg-neutral-900 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <Moon className="w-8 h-8 text-white/20 mx-auto mb-3" />
          <span className="text-white/50 text-sm">Loading lunar atlas...</span>
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
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Lunar Atlas
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            Explore the Moon&apos;s surface. Toggle layers to view maria, major craters,
            and Apollo landing sites with mission details.
          </p>
        </div>

        {/* Map Container */}
        <div className="relative mb-6">
          <div className="h-[50vh] min-h-[400px] max-h-[600px] rounded-xl overflow-hidden">
            <LunarAtlas
              layerGroups={layerGroups}
              onFeatureClick={handleFeatureClick}
            />
          </div>

          {/* Layer controls - positioned inside map area */}
          <LayerControls
            groups={layerGroups}
            onToggleLayer={handleToggleLayer}
            onToggleGroup={handleToggleGroup}
          />

          {/* Info panel - positioned inside map area */}
          <InfoPanel
            feature={selectedFeature}
            onClose={handleCloseInfo}
          />
        </div>

        {/* Info sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Apollo Missions */}
          <div className="bg-white rounded-xl p-5">
            <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
              Apollo Missions
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/50">Total missions</span>
                <span className="text-black">6 landings</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Astronauts on surface</span>
                <span className="text-black">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Samples returned</span>
                <span className="text-black">382 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Total EVA time</span>
                <span className="text-black">80+ hours</span>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="bg-white rounded-xl p-5">
            <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
              Data Sources
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/50">Basemap</span>
                <span className="text-black">OpenPlanetary</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Feature data</span>
                <span className="text-black">IAU / USGS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Mission data</span>
                <span className="text-black">NASA</span>
              </div>
            </div>
          </div>

          {/* Related */}
          <div className="bg-[#e5e5e5] rounded-xl p-5">
            <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
              Related
            </h3>
            <p className="text-sm text-black/50 mb-4">
              Learn more about the Moon including key facts, formation theory,
              and the history of human exploration.
            </p>
            <Link
              href="/data/moon"
              className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-[#e6007e] transition-colors"
            >
              View Moon data page →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
