'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BreadcrumbFrame, breadcrumbItems, PageHeaderFrame } from '@/components/ui';
import { ObserveIcon } from '@/components/icons';
import { Earthquake, Volcano } from '@/lib/unrest/types';
import SeismicPanel from '@/components/SeismicPanel';
import UnrestSummaryBar from '@/components/unrest/UnrestSummaryBar';
import RecentEarthquakes from '@/components/unrest/RecentEarthquakes';
import ElevatedVolcanoes from '@/components/unrest/ElevatedVolcanoes';
import KpIndexBar from '@/components/unrest/KpIndexBar';

// Dynamic import for map (client-side only)
const UnrestMap = dynamic(() => import('@/components/UnrestMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-[#0f172a] rounded-xl flex items-center justify-center">
      <span className="text-white/50">Loading map...</span>
    </div>
  ),
});

interface UnrestData {
  earthquakes: Earthquake[];
  volcanoes: Volcano[];
  earthquakeStats: { count: number; largest: Earthquake | null };
  volcanoStats: { elevated: number; red: number };
  stormStats: { count: number };
}

interface GeomagData {
  kp: { kp: number; timestamp: string; gScale: number } | null;
  solarWind: { speed: number } | null;
}

export default function UnrestPage() {
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [data, setData] = useState<UnrestData | null>(null);
  const [geomagData, setGeomagData] = useState<GeomagData | null>(null);

  // Fetch main unrest data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/unrest/summary');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching unrest data:', err);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch geomagnetic data
  useEffect(() => {
    async function fetchGeomag() {
      try {
        const res = await fetch('/api/unrest/geomagnetic');
        if (res.ok) {
          const json = await res.json();
          setGeomagData(json);
        }
      } catch (err) {
        console.error('Error fetching geomagnetic data:', err);
      }
    }
    fetchGeomag();
    const interval = setInterval(fetchGeomag, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        <BreadcrumbFrame
          variant="light"
          icon={<ObserveIcon className="w-4 h-4" />}
          items={breadcrumbItems(
            ['MXWLL', '/'],
            ['Observe', '/observe'],
            ['Earth', '/observe/earth'],
            ['Unrest']
          )}
        />

        <PageHeaderFrame
          variant="light"
          title="Unrest"
          description="Live monitoring of planetary disturbance: seismic activity, volcanic alerts, tropical systems, and space weather from around the world."
        />

        {/* Summary Stats Bar */}
        {data && (
          <UnrestSummaryBar
            earthquakeCount={data.earthquakeStats?.count || 0}
            volcanoesElevated={data.volcanoStats?.elevated || 0}
            stormCount={data.stormStats?.count || 0}
            kpIndex={geomagData?.kp?.kp}
            className="mb-6"
          />
        )}

        {/* World Map */}
        <div className="mb-6">
          <UnrestMap
            className="h-[50vh] min-h-[400px] max-h-[600px]"
            onEarthquakeSelect={setSelectedEarthquake}
          />
        </div>

        {/* Seismic Panel (existing component for waveforms) */}
        <SeismicPanel selectedEarthquake={selectedEarthquake} />

        {/* Data Sections Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Recent Earthquakes */}
          {data?.earthquakes && (
            <RecentEarthquakes
              earthquakes={data.earthquakes}
              className="md:col-span-1"
            />
          )}

          {/* Elevated Volcanoes */}
          {data?.volcanoes && (
            <ElevatedVolcanoes
              volcanoes={data.volcanoes}
              className="md:col-span-1"
            />
          )}

          {/* Geomagnetic Conditions */}
          {geomagData?.kp && (
            <KpIndexBar
              kp={geomagData.kp.kp}
              solarWind={geomagData.solarWind?.speed}
              className="md:col-span-1"
            />
          )}
        </div>

        {/* Additional info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data sources card */}
          <div className="bg-white rounded-xl p-5">
            <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
              Data Sources
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/50">Earthquakes</span>
                <span className="text-black">USGS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Volcanic Activity</span>
                <span className="text-black">USGS / Smithsonian GVP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Tropical Systems</span>
                <span className="text-black">NHC / JTWC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Geomagnetic</span>
                <span className="text-black">NOAA SWPC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Lightning</span>
                <span className="text-black">GOES-R GLM</span>
              </div>
            </div>
          </div>

          {/* Link to widgets */}
          <div className="bg-[#e5e5e5] rounded-xl p-5">
            <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
              Add to Dashboard
            </h3>
            <p className="text-sm text-black/50 mb-4">
              Individual widgets for earthquakes, space weather, and more are
              available to add to your personal dashboard.
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
