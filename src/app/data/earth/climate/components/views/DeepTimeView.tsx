'use client'

import { useState, useMemo } from 'react'
import { Info, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react'

// ===========================================
// DEEP TIME VIEW
// ===========================================
// 800,000 years of climate history from ice cores
// Shows natural glacial cycles and the industrial spike

// Simplified representation of EPICA/Vostok ice core data
// Real implementation would use actual datasets
const ICE_CORE_ERAS = [
  { name: 'Today', yearsAgo: 0, co2: 420, temp: 1.2, description: 'Industrial peak' },
  { name: 'Pre-Industrial', yearsAgo: 200, co2: 280, temp: 0, description: 'Baseline' },
  { name: 'Medieval Warm', yearsAgo: 1000, co2: 280, temp: 0.3, description: 'Viking expansion' },
  { name: 'Roman Warm', yearsAgo: 2000, co2: 278, temp: 0.1, description: 'Roman Empire peak' },
  { name: 'Holocene Start', yearsAgo: 11700, co2: 260, temp: -0.5, description: 'Ice age ends' },
  { name: 'Last Glacial Max', yearsAgo: 21000, co2: 180, temp: -6, description: 'Peak ice age' },
  { name: 'Interglacial (MIS 5e)', yearsAgo: 125000, co2: 285, temp: 1, description: 'Warmer than today' },
  { name: 'Glacial (MIS 6)', yearsAgo: 180000, co2: 190, temp: -8, description: 'Severe ice age' },
  { name: 'Interglacial (MIS 7)', yearsAgo: 245000, co2: 280, temp: -1, description: 'Warm period' },
  { name: 'Glacial (MIS 8)', yearsAgo: 300000, co2: 200, temp: -6, description: 'Ice age' },
  { name: 'Interglacial (MIS 11)', yearsAgo: 410000, co2: 285, temp: 0.5, description: 'Long warm period' },
  { name: 'Oldest ice', yearsAgo: 800000, co2: 190, temp: -8, description: 'EPICA Dome C' },
]

// Natural range from ice cores
const NATURAL_CO2_MIN = 180
const NATURAL_CO2_MAX = 300
const CURRENT_CO2 = 420

// Time scale options
const TIME_SCALES = [
  { id: 'all', label: '800,000 years', yearsBack: 800000 },
  { id: 'glacial', label: '150,000 years', yearsBack: 150000 },
  { id: 'holocene', label: '12,000 years', yearsBack: 12000 },
  { id: 'historical', label: '2,000 years', yearsBack: 2000 },
  { id: 'modern', label: '200 years', yearsBack: 200 },
]

export default function DeepTimeView() {
  const [selectedScale, setSelectedScale] = useState('all')
  const [showInfo, setShowInfo] = useState(false)
  
  const currentScale = TIME_SCALES.find(s => s.id === selectedScale) || TIME_SCALES[0]
  
  // Filter data based on selected scale
  const visibleEras = useMemo(() => {
    return ICE_CORE_ERAS.filter(era => era.yearsAgo <= currentScale.yearsBack)
  }, [currentScale])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-medium text-neutral-900 mb-1">
              Deep Time: 800,000 Years of Climate
            </h2>
            <p className="text-sm text-neutral-500">
              Ice core records from Antarctica reveal Earth's natural climate rhythms - 
              and how dramatically we've departed from them.
            </p>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            <Info className="w-4 h-4" />
            <span>About ice cores</span>
          </button>
        </div>

        {/* Info panel */}
        {showInfo && (
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2">How We Read the Past</h4>
            <p className="text-sm text-blue-800 mb-3">
              Ice cores are frozen time capsules. As snow falls and compacts into ice, 
              it traps tiny bubbles of ancient atmosphere. Scientists drill into Antarctic 
              ice sheets to extract cores up to 3km deep, containing air from 800,000 years ago.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white/60 rounded-lg p-3">
                <div className="font-medium text-blue-900">EPICA Dome C</div>
                <div className="text-blue-700">Antarctica, 3,270m depth</div>
                <div className="text-blue-600 text-xs mt-1">800,000 year record</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <div className="font-medium text-blue-900">Vostok</div>
                <div className="text-blue-700">Antarctica, 3,623m depth</div>
                <div className="text-blue-600 text-xs mt-1">420,000 year record</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <div className="font-medium text-blue-900">What's Measured</div>
                <div className="text-blue-700">CO₂, CH₄, δ¹⁸O, dust, isotopes</div>
                <div className="text-blue-600 text-xs mt-1">Reconstructs temperature & atmosphere</div>
              </div>
            </div>
          </div>
        )}

        {/* Time scale selector */}
        <div className="flex flex-wrap gap-2">
          {TIME_SCALES.map(scale => (
            <button
              key={scale.id}
              onClick={() => setSelectedScale(scale.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${selectedScale === scale.id
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }
              `}
            >
              {scale.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main visualization */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        {/* Key insight banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              !
            </div>
            <div>
              <div className="font-medium text-amber-900 mb-1">
                The industrial spike is unprecedented
              </div>
              <div className="text-sm text-amber-800">
                For 800,000 years, CO₂ stayed between {NATURAL_CO2_MIN}–{NATURAL_CO2_MAX} ppm. 
                It's now {CURRENT_CO2} ppm - {Math.round(((CURRENT_CO2 - NATURAL_CO2_MAX) / NATURAL_CO2_MAX) * 100)}% 
                above the natural maximum. The rate of increase is ~100x faster than any natural change in the record.
              </div>
            </div>
          </div>
        </div>

        {/* CO₂ visualization */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Atmospheric CO₂ (ppm)
          </h3>
          
          {/* Y-axis scale */}
          <div className="flex gap-4">
            <div className="w-12 flex flex-col justify-between text-xs text-neutral-400 text-right py-1">
              <span>450</span>
              <span>350</span>
              <span>250</span>
              <span>150</span>
            </div>
            
            {/* Chart area */}
            <div className="flex-1 relative h-48 bg-neutral-50 rounded-lg overflow-hidden">
              {/* Natural range band */}
              <div 
                className="absolute inset-x-0 bg-green-100 border-y border-green-200"
                style={{
                  bottom: `${((NATURAL_CO2_MIN - 150) / 300) * 100}%`,
                  top: `${100 - ((NATURAL_CO2_MAX - 150) / 300) * 100}%`,
                }}
              />
              
              {/* Natural range labels */}
              <div 
                className="absolute left-2 text-xs text-green-600"
                style={{ bottom: `${((NATURAL_CO2_MAX - 150) / 300) * 100}%` }}
              >
                Natural max: {NATURAL_CO2_MAX} ppm
              </div>
              <div 
                className="absolute left-2 text-xs text-green-600"
                style={{ bottom: `${((NATURAL_CO2_MIN - 150) / 300) * 100 - 4}%` }}
              >
                Natural min: {NATURAL_CO2_MIN} ppm
              </div>
              
              {/* Current level marker */}
              <div 
                className="absolute inset-x-0 border-t-2 border-red-500 border-dashed"
                style={{ bottom: `${((CURRENT_CO2 - 150) / 300) * 100}%` }}
              >
                <div className="absolute right-2 -top-5 text-xs font-semibold text-red-600 bg-white px-1 rounded">
                  Today: {CURRENT_CO2} ppm
                </div>
              </div>

              {/* Era markers */}
              <div className="absolute inset-x-0 bottom-0 h-full flex items-end">
                {visibleEras.map((era, i) => {
                  const x = currentScale.yearsBack > 0 
                    ? ((currentScale.yearsBack - era.yearsAgo) / currentScale.yearsBack) * 100
                    : 100
                  const height = ((era.co2 - 150) / 300) * 100
                  
                  return (
                    <div
                      key={i}
                      className="absolute group"
                      style={{ left: `${x}%`, bottom: 0, height: `${height}%` }}
                    >
                      <div className="w-2 h-full bg-blue-500 rounded-t opacity-70 hover:opacity-100 transition-opacity" />
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                          <div className="font-medium">{era.name}</div>
                          <div className="text-neutral-300">
                            {era.yearsAgo.toLocaleString()} years ago
                          </div>
                          <div className="text-neutral-300">
                            CO₂: {era.co2} ppm | Temp: {era.temp > 0 ? '+' : ''}{era.temp}°C
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* X-axis label */}
          <div className="flex justify-between mt-2 text-xs text-neutral-400">
            <span>{currentScale.yearsBack.toLocaleString()} years ago</span>
            <span>Present</span>
          </div>
        </div>

        {/* Temperature visualization */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Temperature Anomaly (°C vs pre-industrial)
          </h3>
          
          <div className="flex gap-4">
            <div className="w-12 flex flex-col justify-between text-xs text-neutral-400 text-right py-1">
              <span>+2</span>
              <span>0</span>
              <span>-4</span>
              <span>-8</span>
            </div>
            
            <div className="flex-1 relative h-32 bg-neutral-50 rounded-lg overflow-hidden">
              {/* Zero line */}
              <div className="absolute inset-x-0 top-1/4 border-t border-neutral-300" />
              
              {/* Era temperature markers */}
              {visibleEras.map((era, i) => {
                const x = currentScale.yearsBack > 0 
                  ? ((currentScale.yearsBack - era.yearsAgo) / currentScale.yearsBack) * 100
                  : 100
                // Map -8 to +2 range onto 0-100%
                const y = ((2 - era.temp) / 10) * 100
                
                return (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full transform -translate-x-1 -translate-y-1"
                    style={{ 
                      left: `${x}%`, 
                      top: `${y}%`,
                      backgroundColor: era.temp > 0 ? '#ef4444' : '#3b82f6',
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Key eras table */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Key Climate Periods
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Period</th>
                  <th className="text-right py-2 px-3 font-medium text-neutral-500">Years Ago</th>
                  <th className="text-right py-2 px-3 font-medium text-neutral-500">CO₂</th>
                  <th className="text-right py-2 px-3 font-medium text-neutral-500">Temp</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Description</th>
                </tr>
              </thead>
              <tbody>
                {visibleEras.slice(0, 8).map((era, i) => (
                  <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-2 px-3 font-medium">{era.name}</td>
                    <td className="py-2 px-3 text-right font-mono text-neutral-600">
                      {era.yearsAgo.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono">
                      <span className={era.co2 > 300 ? 'text-red-600 font-semibold' : 'text-neutral-600'}>
                        {era.co2}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono">
                      <span className={era.temp > 0 ? 'text-red-600' : 'text-blue-600'}>
                        {era.temp > 0 ? '+' : ''}{era.temp}°C
                      </span>
                    </td>
                    <td className="py-2 px-3 text-neutral-500">{era.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* The Milankovitch Cycles */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          Why Natural Climate Cycles Happen
        </h3>
        <p className="text-sm text-neutral-600 mb-4">
          The ~100,000-year glacial cycles visible in ice cores are driven by Milankovitch cycles - 
          predictable variations in Earth's orbit and axial tilt that change how much sunlight reaches different latitudes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-50 rounded-xl">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-medium text-neutral-900">Eccentricity</div>
            <div className="text-xs text-neutral-500 mb-2">~100,000 year cycle</div>
            <p className="text-sm text-neutral-600">
              Earth's orbit stretches from nearly circular to slightly elliptical, changing the 
              intensity of seasons.
            </p>
          </div>
          
          <div className="p-4 bg-neutral-50 rounded-xl">
            <div className="text-2xl mb-2">↗️</div>
            <div className="font-medium text-neutral-900">Obliquity</div>
            <div className="text-xs text-neutral-500 mb-2">~41,000 year cycle</div>
            <p className="text-sm text-neutral-600">
              Earth's axial tilt varies between 22.1° and 24.5°, affecting how extreme 
              summers and winters are at high latitudes.
            </p>
          </div>
          
          <div className="p-4 bg-neutral-50 rounded-xl">
            <div className="text-2xl mb-2">🌀</div>
            <div className="font-medium text-neutral-900">Precession</div>
            <div className="text-xs text-neutral-500 mb-2">~26,000 year cycle</div>
            <p className="text-sm text-neutral-600">
              Earth's axis wobbles like a spinning top, changing which hemisphere gets 
              more intense summer sun.
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
          <strong>Key insight:</strong> These orbital cycles cause gradual changes over thousands of years. 
          Current CO₂ rise is happening in decades - roughly 100x faster than any natural climate shift 
          in the ice core record.
        </div>
      </div>
    </div>
  )
}