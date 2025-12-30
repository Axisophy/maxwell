'use client'

import Image from 'next/image'

const MONITORING_STATIONS = [
  { location: 'London, UK', level: 0.08, status: 'normal' },
  { location: 'Paris, FR', level: 0.09, status: 'normal' },
  { location: 'Berlin, DE', level: 0.07, status: 'normal' },
  { location: 'Tokyo, JP', level: 0.05, status: 'normal' },
  { location: 'New York, US', level: 0.06, status: 'normal' },
  { location: 'Sydney, AU', level: 0.04, status: 'normal' },
]

export default function RadiationTab() {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            European Average
          </h3>
          <p className="text-3xl font-light text-green-600">0.08</p>
          <p className="text-xs text-black/50">µSv/h (normal)</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Active Monitors
          </h3>
          <p className="text-3xl font-light text-black">5,400+</p>
          <p className="text-xs text-black/50">EURDEP network</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Alert Status
          </h3>
          <p className="text-3xl font-light text-green-600">None</p>
          <p className="text-xs text-black/50">All levels normal</p>
        </div>
      </div>

      {/* European Radiation Map */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          European Radiation Map
        </h3>
        <div className="relative aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden max-w-2xl mx-auto">
          <Image
            src="https://remap.jrc.ec.europa.eu/share/images/eurdep_gammabackground_20231215.png"
            alt="European radiation monitoring"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <p className="text-xs text-black/40 mt-2 text-center">Source: EURDEP (European Radiological Data Exchange Platform)</p>
      </div>

      {/* Station List */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Sample Monitoring Stations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MONITORING_STATIONS.map((station) => (
            <div key={station.location} className="flex items-center justify-between py-2 px-3 bg-black/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-black">{station.location}</span>
              </div>
              <span className="text-sm font-mono text-black/60">{station.level} µSv/h</span>
            </div>
          ))}
        </div>
      </div>

      {/* Radiation Levels Guide */}
      <div className="bg-[#e5e5e5] rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Understanding Radiation Levels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <h4 className="text-sm font-medium text-black">Normal Background</h4>
            </div>
            <p className="text-xs text-black/50">0.03 - 0.20 µSv/h</p>
            <p className="text-xs text-black/50 mt-1">Natural cosmic and terrestrial radiation</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <h4 className="text-sm font-medium text-black">Elevated</h4>
            </div>
            <p className="text-xs text-black/50">0.20 - 1.00 µSv/h</p>
            <p className="text-xs text-black/50 mt-1">May warrant investigation</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <h4 className="text-sm font-medium text-black">High</h4>
            </div>
            <p className="text-xs text-black/50">1.00 - 10.0 µSv/h</p>
            <p className="text-xs text-black/50 mt-1">Authorities notified</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <h4 className="text-sm font-medium text-black">Emergency</h4>
            </div>
            <p className="text-xs text-black/50">&gt;10.0 µSv/h</p>
            <p className="text-xs text-black/50 mt-1">Immediate action required</p>
          </div>
        </div>
      </div>

      {/* Context */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black mb-3">Annual Exposure Context</h3>
        <p className="text-sm text-black/60 leading-relaxed">
          Average annual radiation dose from all sources is about 2-3 mSv (millisieverts).
          Background radiation accounts for ~2.4 mSv/year. A chest X-ray adds ~0.1 mSv,
          while a transatlantic flight adds ~0.05 mSv. The annual occupational limit is 20 mSv.
        </p>
      </div>
    </div>
  )
}
