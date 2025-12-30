'use client'

import { useState, useEffect } from 'react'

interface AQIData {
  location: string
  aqi: number
  category: string
  pm25: number
  pm10: number
  o3: number
  no2: number
}

const AQI_CATEGORIES = [
  { max: 50, label: 'Good', color: 'bg-green-500', textColor: 'text-green-600' },
  { max: 100, label: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  { max: 150, label: 'Unhealthy (Sensitive)', color: 'bg-orange-500', textColor: 'text-orange-600' },
  { max: 200, label: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-600' },
  { max: 300, label: 'Very Unhealthy', color: 'bg-purple-500', textColor: 'text-purple-600' },
  { max: 500, label: 'Hazardous', color: 'bg-red-900', textColor: 'text-red-900' },
]

const SAMPLE_CITIES: AQIData[] = [
  { location: 'London, UK', aqi: 42, category: 'Good', pm25: 8.2, pm10: 15.1, o3: 45, no2: 22 },
  { location: 'New York, US', aqi: 58, category: 'Moderate', pm25: 14.5, pm10: 22.3, o3: 52, no2: 31 },
  { location: 'Beijing, CN', aqi: 156, category: 'Unhealthy', pm25: 78.2, pm10: 112.5, o3: 38, no2: 45 },
  { location: 'Delhi, IN', aqi: 201, category: 'Very Unhealthy', pm25: 125.3, pm10: 188.7, o3: 42, no2: 58 },
  { location: 'Sydney, AU', aqi: 35, category: 'Good', pm25: 5.8, pm10: 12.2, o3: 38, no2: 15 },
  { location: 'Tokyo, JP', aqi: 68, category: 'Moderate', pm25: 18.5, pm10: 28.4, o3: 48, no2: 28 },
]

export default function AirQualityTab() {
  const [cities, setCities] = useState<AQIData[]>(SAMPLE_CITIES)

  const getAQIStyle = (aqi: number) => {
    const category = AQI_CATEGORIES.find(c => aqi <= c.max) || AQI_CATEGORIES[AQI_CATEGORIES.length - 1]
    return category
  }

  return (
    <div className="space-y-6">
      {/* Global Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Cities with Good AQI
          </h3>
          <p className="text-3xl font-light text-green-600">
            {cities.filter(c => c.aqi <= 50).length}
          </p>
          <p className="text-xs text-black/50">of {cities.length} monitored</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Global Avg PM2.5
          </h3>
          <p className="text-3xl font-light text-black">
            {(cities.reduce((sum, c) => sum + c.pm25, 0) / cities.length).toFixed(1)}
          </p>
          <p className="text-xs text-black/50">µg/m³</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Unhealthy Locations
          </h3>
          <p className="text-3xl font-light text-red-600">
            {cities.filter(c => c.aqi > 100).length}
          </p>
          <p className="text-xs text-black/50">AQI &gt; 100</p>
        </div>
      </div>

      {/* City List */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Major Cities
        </h3>
        <div className="space-y-3">
          {cities.map((city) => {
            const style = getAQIStyle(city.aqi)
            return (
              <div key={city.location} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${style.color}`} />
                  <div>
                    <p className="text-sm font-medium text-black">{city.location}</p>
                    <p className="text-xs text-black/40">{style.label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-mono ${style.textColor}`}>{city.aqi}</p>
                  <p className="text-xs text-black/40">AQI</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AQI Scale */}
      <div className="bg-[#e5e5e5] rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Air Quality Index Scale
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {AQI_CATEGORIES.map((cat) => (
            <div key={cat.label} className="text-center">
              <div className={`h-8 ${cat.color} rounded-lg mb-2`} />
              <p className="text-xs font-medium text-black">{cat.max === 500 ? '301+' : `0-${cat.max}`}</p>
              <p className="text-[10px] text-black/50">{cat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pollutant Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4">
          <h4 className="text-sm font-medium text-black mb-1">PM2.5</h4>
          <p className="text-xs text-black/50">Fine particulate matter &lt;2.5µm. Penetrates deep into lungs.</p>
        </div>
        <div className="bg-white rounded-xl p-4">
          <h4 className="text-sm font-medium text-black mb-1">PM10</h4>
          <p className="text-xs text-black/50">Coarse particles &lt;10µm. Dust, pollen, mold spores.</p>
        </div>
        <div className="bg-white rounded-xl p-4">
          <h4 className="text-sm font-medium text-black mb-1">O₃ (Ozone)</h4>
          <p className="text-xs text-black/50">Ground-level ozone. Forms from sunlight + pollutants.</p>
        </div>
        <div className="bg-white rounded-xl p-4">
          <h4 className="text-sm font-medium text-black mb-1">NO₂</h4>
          <p className="text-xs text-black/50">Nitrogen dioxide. Traffic and combustion emissions.</p>
        </div>
      </div>
    </div>
  )
}
