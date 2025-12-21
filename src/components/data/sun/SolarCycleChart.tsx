'use client'

import { useState } from 'react'

// Simplified sunspot data - key cycle peaks and troughs from 1750-2024
// Values are annual mean sunspot numbers
const solarCycleData = [
  { year: 1755, value: 8, cycle: 1, phase: 'min' },
  { year: 1761, value: 86, cycle: 1, phase: 'max' },
  { year: 1766, value: 11, cycle: 2, phase: 'min' },
  { year: 1769, value: 106, cycle: 2, phase: 'max' },
  { year: 1775, value: 8, cycle: 3, phase: 'min' },
  { year: 1778, value: 154, cycle: 3, phase: 'max' },
  { year: 1784, value: 10, cycle: 4, phase: 'min' },
  { year: 1788, value: 132, cycle: 4, phase: 'max' },
  { year: 1798, value: 4, cycle: 5, phase: 'min' },
  { year: 1805, value: 48, cycle: 5, phase: 'max' },
  { year: 1810, value: 0, cycle: 6, phase: 'min' },
  { year: 1816, value: 46, cycle: 6, phase: 'max' },
  { year: 1823, value: 1, cycle: 7, phase: 'min' },
  { year: 1829, value: 71, cycle: 7, phase: 'max' },
  { year: 1833, value: 8, cycle: 8, phase: 'min' },
  { year: 1837, value: 138, cycle: 8, phase: 'max' },
  { year: 1843, value: 10, cycle: 9, phase: 'min' },
  { year: 1848, value: 124, cycle: 9, phase: 'max' },
  { year: 1856, value: 4, cycle: 10, phase: 'min' },
  { year: 1860, value: 96, cycle: 10, phase: 'max' },
  { year: 1867, value: 7, cycle: 11, phase: 'min' },
  { year: 1870, value: 139, cycle: 11, phase: 'max' },
  { year: 1878, value: 3, cycle: 12, phase: 'min' },
  { year: 1883, value: 63, cycle: 12, phase: 'max' },
  { year: 1889, value: 6, cycle: 13, phase: 'min' },
  { year: 1894, value: 88, cycle: 13, phase: 'max' },
  { year: 1901, value: 3, cycle: 14, phase: 'min' },
  { year: 1906, value: 64, cycle: 14, phase: 'max' },
  { year: 1913, value: 1, cycle: 15, phase: 'min' },
  { year: 1917, value: 104, cycle: 15, phase: 'max' },
  { year: 1923, value: 6, cycle: 16, phase: 'min' },
  { year: 1928, value: 78, cycle: 16, phase: 'max' },
  { year: 1933, value: 4, cycle: 17, phase: 'min' },
  { year: 1937, value: 114, cycle: 17, phase: 'max' },
  { year: 1944, value: 8, cycle: 18, phase: 'min' },
  { year: 1947, value: 152, cycle: 18, phase: 'max' },
  { year: 1954, value: 4, cycle: 19, phase: 'min' },
  { year: 1958, value: 190, cycle: 19, phase: 'max' },
  { year: 1964, value: 10, cycle: 20, phase: 'min' },
  { year: 1968, value: 106, cycle: 20, phase: 'max' },
  { year: 1976, value: 13, cycle: 21, phase: 'min' },
  { year: 1979, value: 155, cycle: 21, phase: 'max' },
  { year: 1986, value: 13, cycle: 22, phase: 'min' },
  { year: 1989, value: 158, cycle: 22, phase: 'max' },
  { year: 1996, value: 9, cycle: 23, phase: 'min' },
  { year: 2000, value: 120, cycle: 23, phase: 'max' },
  { year: 2008, value: 3, cycle: 24, phase: 'min' },
  { year: 2014, value: 82, cycle: 24, phase: 'max' },
  { year: 2019, value: 4, cycle: 25, phase: 'min' },
  { year: 2024, value: 145, cycle: 25, phase: 'max' },
]

export default function SolarCycleChart() {
  const [hoveredPoint, setHoveredPoint] = useState<typeof solarCycleData[0] | null>(null)

  const maxValue = Math.max(...solarCycleData.map(d => d.value))
  const minYear = Math.min(...solarCycleData.map(d => d.year))
  const maxYear = Math.max(...solarCycleData.map(d => d.year))

  const chartWidth = 800
  const chartHeight = 200
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  const xScale = (year: number) =>
    padding.left + ((year - minYear) / (maxYear - minYear)) * innerWidth

  const yScale = (value: number) =>
    padding.top + innerHeight - (value / maxValue) * innerHeight

  // Create path
  const pathData = solarCycleData
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year)} ${yScale(d.value)}`)
    .join(' ')

  // Area fill path
  const areaPath = `${pathData} L ${xScale(maxYear)} ${yScale(0)} L ${xScale(minYear)} ${yScale(0)} Z`

  // Y-axis ticks
  const yTicks = [0, 50, 100, 150, 200]

  // X-axis ticks (every 50 years)
  const xTicks = [1750, 1800, 1850, 1900, 1950, 2000]

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-black">Solar Cycles 1-25</h3>
          <p className="text-sm text-black/50">Annual mean sunspot number, 1755-2024</p>
        </div>
        {hoveredPoint && (
          <div className="text-right">
            <p className="text-sm font-mono text-black">{hoveredPoint.year}</p>
            <p className="text-xs text-black/50">
              Cycle {hoveredPoint.cycle} {hoveredPoint.phase === 'max' ? 'maximum' : 'minimum'}
            </p>
            <p className="text-lg font-mono font-medium text-black">{hoveredPoint.value}</p>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full min-w-[600px]"
          style={{ height: 'auto', aspectRatio: `${chartWidth}/${chartHeight}` }}
        >
          {/* Grid lines */}
          {yTicks.map(tick => (
            <line
              key={tick}
              x1={padding.left}
              y1={yScale(tick)}
              x2={chartWidth - padding.right}
              y2={yScale(tick)}
              stroke="#e5e5e5"
              strokeWidth={1}
            />
          ))}

          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#sunspotGradient)"
            opacity={0.3}
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#f97316"
            strokeWidth={2}
          />

          {/* Data points */}
          {solarCycleData.map((d) => (
            <circle
              key={`${d.year}-${d.phase}`}
              cx={xScale(d.year)}
              cy={yScale(d.value)}
              r={hoveredPoint?.year === d.year ? 6 : 4}
              fill={d.phase === 'max' ? '#f97316' : '#fed7aa'}
              stroke="#fff"
              strokeWidth={2}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredPoint(d)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Y-axis labels */}
          {yTicks.map(tick => (
            <text
              key={tick}
              x={padding.left - 8}
              y={yScale(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-xs fill-black/40"
            >
              {tick}
            </text>
          ))}

          {/* X-axis labels */}
          {xTicks.map(year => (
            <text
              key={year}
              x={xScale(year)}
              y={chartHeight - 8}
              textAnchor="middle"
              className="text-xs fill-black/40"
            >
              {year}
            </text>
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="sunspotGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mt-4 flex items-center gap-6 text-xs text-black/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f97316]" />
          <span>Cycle maximum</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#fed7aa] border border-[#f97316]" />
          <span>Cycle minimum</span>
        </div>
        <div className="ml-auto">
          Source: SILSO, Royal Observatory of Belgium
        </div>
      </div>
    </div>
  )
}
