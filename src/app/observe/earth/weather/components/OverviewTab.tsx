'use client'

import Image from 'next/image'

export default function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Current Conditions Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
            Global Temperature
          </h3>
          <p className="text-3xl font-light text-black">+1.2°C</p>
          <p className="text-sm text-black/50 mt-1">Above pre-industrial average</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
            Active Storms
          </h3>
          <p className="text-3xl font-light text-blue-600">3</p>
          <p className="text-sm text-black/50 mt-1">Tropical systems worldwide</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
            ENSO Status
          </h3>
          <p className="text-3xl font-light text-black">Neutral</p>
          <p className="text-sm text-black/50 mt-1">Pacific oscillation index</p>
        </div>
      </div>

      {/* Global Weather Map */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Global Cloud Cover
        </h3>
        <div className="relative aspect-[2/1] bg-neutral-100 rounded-lg overflow-hidden">
          <Image
            src="https://cdn.star.nesdis.noaa.gov/GOES16/GLM/FD/EXTENT3/1250x750.jpg"
            alt="Global weather satellite"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
            GOES-16 GLM
          </div>
        </div>
      </div>

      {/* Weather Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
            Jet Stream Position
          </h3>
          <p className="text-sm text-black/70 mb-3">
            The polar jet stream is currently positioned across the northern Atlantic,
            bringing mild conditions to Western Europe.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-black/50">Normal pattern</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
            Monsoon Activity
          </h3>
          <p className="text-sm text-black/70 mb-3">
            The Indian monsoon is in its active phase, bringing heavy rainfall
            to the subcontinent. Southeast Asia experiencing typical seasonal patterns.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-black/50">Active season</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-[#e5e5e5] rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
          Explore Weather Topics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['Satellites', 'Ocean', 'Jet Streams', 'Storms', 'UK'].map((topic) => (
            <div
              key={topic}
              className="bg-white rounded-lg px-4 py-3 text-sm text-center text-black/70 hover:text-black cursor-pointer transition-colors"
            >
              {topic}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
