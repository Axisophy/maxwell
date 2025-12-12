'use client';

import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues with Mapbox
const ExtractionMap = dynamic(
  () => import('@/components/data/ExtractionMap'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black/50">Loading map...</p>
        </div>
      </div>
    )
  }
);

export default function ExtractionPage() {
  // Read token client-side
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN';

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding for header */}
      <div className="h-14 md:hidden" />

      <div className="h-[calc(100vh-56px)] md:h-screen">
        <ExtractionMap accessToken={mapboxToken} />
      </div>

      {/* Mobile bottom padding for nav - but map is full height so we handle differently */}
    </main>
  );
}