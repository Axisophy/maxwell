'use client'

import Image from 'next/image'

export default function OceanTab() {
  return (
    <div className="space-y-6">
      {/* Ocean Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            SST Anomaly
          </h3>
          <p className="text-2xl font-light text-red-600">+0.8°C</p>
          <p className="text-xs text-black/50">Global average</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            ENSO Index
          </h3>
          <p className="text-2xl font-light text-black">-0.3</p>
          <p className="text-xs text-black/50">Neutral conditions</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Gulf Stream
          </h3>
          <p className="text-2xl font-light text-blue-600">Active</p>
          <p className="text-xs text-black/50">Normal flow</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Arctic Ice
          </h3>
          <p className="text-2xl font-light text-cyan-600">-12%</p>
          <p className="text-xs text-black/50">vs. 1981-2010 avg</p>
        </div>
      </div>

      {/* Sea Surface Temperature Map */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Sea Surface Temperature
        </h3>
        <div className="relative aspect-[2/1] bg-neutral-100 rounded-lg overflow-hidden">
          <Image
            src="https://www.ospo.noaa.gov/data/sst/contour/global_small.cf.gif"
            alt="Global sea surface temperature"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <p className="text-xs text-black/40 mt-2">Source: NOAA OSPO</p>
      </div>

      {/* Ocean Currents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
            Major Ocean Currents
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Gulf Stream', status: 'Normal', color: 'bg-green-500' },
              { name: 'Kuroshio Current', status: 'Normal', color: 'bg-green-500' },
              { name: 'Antarctic Circumpolar', status: 'Strong', color: 'bg-blue-500' },
              { name: 'Humboldt Current', status: 'Weakening', color: 'bg-yellow-500' },
            ].map((current) => (
              <div key={current.name} className="flex items-center justify-between">
                <span className="text-sm text-black">{current.name}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${current.color}`} />
                  <span className="text-xs text-black/50">{current.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
            El Niño / La Niña Status
          </h3>
          <p className="text-sm text-black/70 leading-relaxed mb-3">
            The Pacific Ocean is currently in a neutral ENSO state. Sea surface
            temperatures in the Niño 3.4 region are close to average, with no
            strong El Niño or La Niña conditions expected in the near term.
          </p>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-lg font-mono text-black">-0.3°C</p>
              <p className="text-xs text-black/40">Niño 3.4 Anomaly</p>
            </div>
            <div className="h-8 w-px bg-black/10" />
            <div className="text-center">
              <p className="text-lg font-mono text-black">Neutral</p>
              <p className="text-xs text-black/40">Current Phase</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
