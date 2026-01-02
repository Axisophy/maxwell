'use client';

import { useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Breadcrumb from '@/components/ui/Breadcrumb';
import type { ExtractionMapHandle } from '@/components/data/extraction/ExtractionMapContainer';

// Dynamically import the map component to avoid SSR issues with Mapbox
const ExtractionMapContainer = dynamic(
  () => import('@/components/data/extraction/ExtractionMapContainer'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[70vh] md:h-[80vh] bg-[#0a1628] rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50">Loading map...</p>
        </div>
      </div>
    ),
  }
);

// Lazy load content sections
const WhatsInYour = dynamic(() => import('@/components/data/extraction/WhatsInYour'));
const Superlatives = dynamic(() => import('@/components/data/extraction/Superlatives'));
const SupplyConcentration = dynamic(() => import('@/components/data/extraction/SupplyConcentration'));
const EnergyTransition = dynamic(() => import('@/components/data/extraction/EnergyTransition'));
const OceanMining = dynamic(() => import('@/components/data/extraction/OceanMining'));

export default function ExtractionPage() {
  const mapRef = useRef<ExtractionMapHandle>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

  const handleFlyTo = useCallback((lat: number, lng: number, zoom?: number) => {
    mapRef.current?.flyTo(lat, lng, zoom);
    // Scroll to map
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectMaterial = useCallback((materialId: string) => {
    mapRef.current?.selectMaterial(materialId);
    setSelectedMaterial(materialId);
    // Scroll to map
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleMaterialChange = useCallback((materialId: string | null) => {
    setSelectedMaterial(materialId);
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding for header */}
      <div className="h-14 md:hidden" />

      {/* Page Header */}
      <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8">
        <Breadcrumb
          items={[
            { label: 'Data', href: '/data' },
            { label: 'Extraction', href: '/data/extraction' },
          ]}
        />
        <div className="mt-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-light text-black">
            The Geography of Extraction
          </h1>
          <p className="text-black/50 mt-2 text-lg">
            Every device, building, and vehicle begins as rock pulled from the Earth.
            Explore where humanity extracts the raw materials of modern civilization.
          </p>
        </div>
      </div>

      {/* Map Section */}
      <section className="px-4 md:px-8 lg:px-12 pb-8">
        <ExtractionMapContainer
          ref={mapRef}
          accessToken={mapboxToken}
          onMaterialChange={handleMaterialChange}
        />
      </section>

      {/* Content Sections */}
      <WhatsInYour onSelectMaterial={handleSelectMaterial} />

      <SupplyConcentration
        onSelectMaterial={handleSelectMaterial}
        selectedMaterial={selectedMaterial}
      />

      <EnergyTransition onSelectMaterial={handleSelectMaterial} />

      <Superlatives onFlyTo={handleFlyTo} />

      <OceanMining
        onFlyTo={handleFlyTo}
        onSelectMaterial={handleSelectMaterial}
      />

      {/* Footer spacer for mobile nav */}
      <div className="h-20 md:hidden" />
    </main>
  );
}
