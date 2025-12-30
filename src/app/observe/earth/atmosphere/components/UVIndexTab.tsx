'use client'

import Image from 'next/image'

const SAMPLE_LOCATIONS = [
  { city: 'Sydney, AU', uv: 11, level: 'Extreme' },
  { city: 'Miami, US', uv: 9, level: 'Very High' },
  { city: 'Los Angeles, US', uv: 8, level: 'Very High' },
  { city: 'London, UK', uv: 3, level: 'Moderate' },
  { city: 'Tokyo, JP', uv: 5, level: 'Moderate' },
  { city: 'Cape Town, ZA', uv: 10, level: 'Very High' },
]

const UV_SCALE = [
  { range: '0-2', level: 'Low', color: 'bg-green-500', protection: 'No protection required' },
  { range: '3-5', level: 'Moderate', color: 'bg-yellow-500', protection: 'Seek shade during midday' },
  { range: '6-7', level: 'High', color: 'bg-orange-500', protection: 'Protection essential' },
  { range: '8-10', level: 'Very High', color: 'bg-red-500', protection: 'Extra protection needed' },
  { range: '11+', level: 'Extreme', color: 'bg-purple-600', protection: 'Take all precautions' },
]

export default function UVIndexTab() {
  const getUVColor = (uv: number) => {
    if (uv >= 11) return 'text-purple-600'
    if (uv >= 8) return 'text-red-600'
    if (uv >= 6) return 'text-orange-500'
    if (uv >= 3) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getUVBg = (uv: number) => {
    if (uv >= 11) return 'bg-purple-500'
    if (uv >= 8) return 'bg-red-500'
    if (uv >= 6) return 'bg-orange-500'
    if (uv >= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-6">
      {/* Current UV Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Peak UV Today
          </h3>
          <p className="text-3xl font-light text-purple-600">11+</p>
          <p className="text-xs text-black/50">Parts of Australia</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Solar Noon Factor
          </h3>
          <p className="text-3xl font-light text-black">~1.5x</p>
          <p className="text-xs text-black/50">Higher than morning</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Ozone Layer Status
          </h3>
          <p className="text-3xl font-light text-green-600">Normal</p>
          <p className="text-xs text-black/50">No significant hole</p>
        </div>
      </div>

      {/* UV Map */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Global UV Index Forecast
        </h3>
        <div className="relative aspect-[2/1] bg-neutral-100 rounded-lg overflow-hidden">
          <Image
            src="https://www.cpc.ncep.noaa.gov/products/stratosphere/uv_index/gif_files/uvi_world_f1.png"
            alt="Global UV Index"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <p className="text-xs text-black/40 mt-2 text-center">Source: NOAA CPC</p>
      </div>

      {/* City UV Levels */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Current UV Index by City
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_LOCATIONS.map((loc) => (
            <div key={loc.city} className="flex items-center justify-between py-2 px-3 bg-black/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${getUVBg(loc.uv)} flex items-center justify-center`}>
                  <span className="text-white text-sm font-bold">{loc.uv}</span>
                </div>
                <div>
                  <p className="text-sm text-black">{loc.city}</p>
                  <p className="text-xs text-black/40">{loc.level}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UV Index Scale */}
      <div className="bg-[#e5e5e5] rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          UV Index Scale
        </h3>
        <div className="space-y-3">
          {UV_SCALE.map((level) => (
            <div key={level.level} className="flex items-center gap-4">
              <div className={`w-16 h-8 ${level.color} rounded-lg flex items-center justify-center`}>
                <span className="text-white text-sm font-bold">{level.range}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-black">{level.level}</p>
                <p className="text-xs text-black/50">{level.protection}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protection Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black mb-3">Sun Protection</h3>
          <ul className="space-y-2 text-sm text-black/60">
            <li className="flex items-start gap-2">
              <span className="text-black">•</span>
              <span>Apply SPF 30+ sunscreen 15 min before going out</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-black">•</span>
              <span>Reapply every 2 hours and after swimming</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-black">•</span>
              <span>Wear UV-blocking sunglasses and a wide-brimmed hat</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-black">•</span>
              <span>Seek shade during peak hours (10am-4pm)</span>
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black mb-3">Factors Affecting UV</h3>
          <ul className="space-y-2 text-sm text-black/60">
            <li className="flex items-start gap-2">
              <span className="text-black">•</span>
              <span><strong>Altitude:</strong> +10-12% per 1000m elevation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-black">•</span>
              <span><strong>Reflection:</strong> Snow 80%, Sand 15%, Water 10%</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-black">•</span>
              <span><strong>Clouds:</strong> Can still transmit 80% of UV</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-black">•</span>
              <span><strong>Time:</strong> Highest within 2h of solar noon</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
