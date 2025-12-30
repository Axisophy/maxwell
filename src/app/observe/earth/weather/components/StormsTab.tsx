'use client'

import Image from 'next/image'

interface Storm {
  name: string
  type: string
  basin: string
  category: string
  windSpeed: number
  pressure: number
  movement: string
  status: 'active' | 'weakening' | 'forming'
}

const ACTIVE_STORMS: Storm[] = [
  {
    name: 'Invest 97L',
    type: 'Tropical Disturbance',
    basin: 'Atlantic',
    category: 'N/A',
    windSpeed: 25,
    pressure: 1008,
    movement: 'WNW at 10 mph',
    status: 'forming',
  },
  {
    name: 'Typhoon Bolaven',
    type: 'Typhoon',
    basin: 'Western Pacific',
    category: 'Cat 2',
    windSpeed: 100,
    pressure: 960,
    movement: 'NW at 12 mph',
    status: 'active',
  },
]

export default function StormsTab() {
  const getStatusColor = (status: Storm['status']) => {
    switch (status) {
      case 'active': return 'bg-red-500'
      case 'forming': return 'bg-yellow-500'
      case 'weakening': return 'bg-blue-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Storm Count */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Active Systems
          </h3>
          <p className="text-2xl font-light text-red-600">{ACTIVE_STORMS.length}</p>
          <p className="text-xs text-black/50">Worldwide</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Atlantic Basin
          </h3>
          <p className="text-2xl font-light text-black">1</p>
          <p className="text-xs text-black/50">Named storms</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Pacific Basin
          </h3>
          <p className="text-2xl font-light text-black">1</p>
          <p className="text-xs text-black/50">Named storms</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Season Status
          </h3>
          <p className="text-2xl font-light text-green-600">Active</p>
          <p className="text-xs text-black/50">Peak season</p>
        </div>
      </div>

      {/* Storm Map */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Tropical Activity
        </h3>
        <div className="relative aspect-[2/1] bg-neutral-100 rounded-lg overflow-hidden">
          <Image
            src="https://www.ssd.noaa.gov/PS/TROP/floaters/91L/imagery/vis0-sm.gif"
            alt="Tropical storm satellite"
            fill
            className="object-contain bg-neutral-800"
            unoptimized
          />
        </div>
        <p className="text-xs text-black/40 mt-2">Source: NOAA SSD</p>
      </div>

      {/* Active Storm List */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Active Tropical Systems
        </h3>
        {ACTIVE_STORMS.length > 0 ? (
          <div className="space-y-4">
            {ACTIVE_STORMS.map((storm) => (
              <div key={storm.name} className="border border-black/10 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(storm.status)}`} />
                      <h4 className="font-medium text-black">{storm.name}</h4>
                    </div>
                    <p className="text-sm text-black/50">{storm.type} • {storm.basin}</p>
                  </div>
                  <span className="px-2 py-1 bg-black/5 rounded text-xs font-mono">
                    {storm.category}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-black/40 text-xs">Max Wind</p>
                    <p className="text-black font-mono">{storm.windSpeed} mph</p>
                  </div>
                  <div>
                    <p className="text-black/40 text-xs">Pressure</p>
                    <p className="text-black font-mono">{storm.pressure} mb</p>
                  </div>
                  <div>
                    <p className="text-black/40 text-xs">Movement</p>
                    <p className="text-black font-mono">{storm.movement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-black/50 text-center py-8">
            No active tropical systems at this time.
          </p>
        )}
      </div>

      {/* Hurricane Scale */}
      <div className="bg-[#e5e5e5] rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Saffir-Simpson Hurricane Scale
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {[
            { cat: '1', wind: '74-95', color: 'bg-yellow-400' },
            { cat: '2', wind: '96-110', color: 'bg-orange-400' },
            { cat: '3', wind: '111-129', color: 'bg-orange-600' },
            { cat: '4', wind: '130-156', color: 'bg-red-500' },
            { cat: '5', wind: '157+', color: 'bg-red-700' },
          ].map((c) => (
            <div key={c.cat} className="bg-white rounded-lg p-3 text-center">
              <div className={`w-6 h-6 ${c.color} rounded-full mx-auto mb-2`} />
              <p className="text-sm font-medium text-black">Cat {c.cat}</p>
              <p className="text-xs text-black/50">{c.wind} mph</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
