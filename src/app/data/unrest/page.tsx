'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Earthquake } from '@/lib/unrest/types';
import SeismicPanel from '@/components/SeismicPanel';

// Dynamic import for map (client-side only)
const UnrestMap = dynamic(() => import('@/components/UnrestMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-[#0f172a] rounded-xl flex items-center justify-center">
      <span className="text-white/50">Loading map...</span>
    </div>
  ),
});

export default function UnrestPage() {
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Unrest
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            Earth's restless activity, live. Lightning strikes, earthquakes, active storms, 
            and volcanic alerts from around the world.
          </p>
        </div>

        {/* World Map */}
        <div className="mb-6">
          <UnrestMap 
            className="h-[50vh] min-h-[400px] max-h-[600px]"
            onEarthquakeSelect={setSelectedEarthquake}
          />
        </div>

        {/* Seismic Panel */}
        <SeismicPanel 
          selectedEarthquake={selectedEarthquake}
        />

        {/* Additional info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Data sources card */}
          <div className="bg-white rounded-xl p-5">
            <h3 className="text-sm font-medium text-black/70 uppercase tracking-wider mb-3">
              Data Sources
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/50">Lightning</span>
                <span className="text-black">GOES-R GLM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Earthquakes</span>
                <span className="text-black">USGS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Waveforms</span>
                <span className="text-black">IRIS/FDSN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Storms</span>
                <span className="text-black">NHC/JTWC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Volcanic</span>
                <span className="text-black">Smithsonian GVP</span>
              </div>
            </div>
          </div>

          {/* About card */}
          <div className="bg-white rounded-xl p-5">
            <h3 className="text-sm font-medium text-black/70 uppercase tracking-wider mb-3">
              About This Data
            </h3>
            <p className="text-sm text-black/60 leading-relaxed">
              This page aggregates real-time data from scientific monitoring networks worldwide. 
              Earthquake data is from USGS and shows M4.5+ events from the past 24 hours. 
              Lightning and storm data is currently simulated pending API integration.
            </p>
          </div>

          {/* Link to widgets */}
          <div className="bg-[#e5e5e5] rounded-xl p-5">
            <h3 className="text-sm font-medium text-black/70 uppercase tracking-wider mb-3">
              Add to Dashboard
            </h3>
            <p className="text-sm text-black/50 mb-4">
              Lightning Live and Seismic Pulse are available as dashboard widgets.
            </p>
            <a 
              href="/observe/your-dashboard" 
              className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-[#e6007e] transition-colors"
            >
              Customize your dashboard →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
