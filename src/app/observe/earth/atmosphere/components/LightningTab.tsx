'use client'

import Image from 'next/image'

const ACTIVE_REGIONS = [
  { region: 'Central Africa', strikes: '45,230', trend: 'stable' },
  { region: 'Southeast Asia', strikes: '32,150', trend: 'increasing' },
  { region: 'South America', strikes: '28,400', trend: 'stable' },
  { region: 'North America', strikes: '15,800', trend: 'decreasing' },
  { region: 'Europe', strikes: '8,200', trend: 'stable' },
  { region: 'Australia', strikes: '3,100', trend: 'stable' },
]

export default function LightningTab() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↑'
      case 'decreasing': return '↓'
      default: return '→'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-orange-500'
      case 'decreasing': return 'text-blue-500'
      default: return 'text-black/40'
    }
  }

  return (
    <div className="space-y-6">
      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Strikes (Last Hour)
          </h3>
          <p className="text-3xl font-light text-yellow-600">~45,000</p>
          <p className="text-xs text-black/50">Globally detected</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Active Storms
          </h3>
          <p className="text-3xl font-light text-black">~1,800</p>
          <p className="text-xs text-black/50">Worldwide</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Detection Network
          </h3>
          <p className="text-3xl font-light text-black">2,000+</p>
          <p className="text-xs text-black/50">Blitzortung stations</p>
        </div>
      </div>

      {/* Lightning Map */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Real-time Lightning Map
        </h3>
        <div className="relative aspect-[2/1] bg-neutral-900 rounded-lg overflow-hidden">
          <Image
            src="https://images.blitzortung.org/Images/image_b_eu.png"
            alt="Real-time lightning strikes"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <p className="text-xs text-black/40 mt-2 text-center">
          Source: Blitzortung.org • Yellow = recent, Red = older strikes
        </p>
      </div>

      {/* Regional Activity */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Regional Activity (Last 24h)
        </h3>
        <div className="space-y-3">
          {ACTIVE_REGIONS.map((region) => (
            <div key={region.region} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-sm text-black">{region.region}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-black/60">{region.strikes}</span>
                <span className={`text-sm ${getTrendColor(region.trend)}`}>
                  {getTrendIcon(region.trend)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightning Facts */}
      <div className="bg-[#e5e5e5] rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Lightning Facts
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-lg font-mono text-black">8M</p>
            <p className="text-xs text-black/50">strikes per day</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-lg font-mono text-black">30,000°C</p>
            <p className="text-xs text-black/50">temperature</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-lg font-mono text-black">1B</p>
            <p className="text-xs text-black/50">volts (typical)</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-lg font-mono text-black">~1km</p>
            <p className="text-xs text-black/50">per 3 sec count</p>
          </div>
        </div>
      </div>

      {/* How Detection Works */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black mb-3">How Lightning Detection Works</h3>
        <p className="text-sm text-black/60 leading-relaxed">
          Lightning detection networks like Blitzortung use a technique called Time of Arrival (TOA).
          When lightning strikes, it produces a radio signal that travels at the speed of light.
          Multiple receiving stations record when they detect the signal, and triangulation
          determines the exact location. Global networks can detect strikes within milliseconds
          of occurrence with accuracy of a few hundred metres.
        </p>
      </div>
    </div>
  )
}
