'use client'

import { useState, useEffect, useRef } from 'react'

// ===========================================
// POLLEN FORECAST
// ===========================================
// Pollen levels and forecast
// Data: Generated based on seasonal patterns
//
// Design notes:
// - NO title/source (WidgetFrame handles those)
// - NO emojis (use styled elements)
// - Hero level with advice
// - Pollen types list
// - 5-day forecast
// ===========================================

interface PollenType {
  name: string
  level: 'none' | 'low' | 'moderate' | 'high' | 'very high'
  count: number
  peak: string
}

interface PollenData {
  timestamp: string
  location: string
  overallLevel: 'low' | 'moderate' | 'high' | 'very high'
  overallIndex: number
  pollenTypes: PollenType[]
  forecast: { day: string; level: 'low' | 'moderate' | 'high' | 'very high' }[]
  advice: string
  season: string
  dominantPollen: string
}

const levelColors: Record<string, { bg: string; text: string; bar: string }> = {
  'low': { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-400' },
  'moderate': { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-400' },
  'high': { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-400' },
  'very high': { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' }
}

function generatePollenData(): PollenData {
  const now = new Date()
  const month = now.getMonth()

  let season = 'Winter'
  let dominantPollen = 'None'
  const pollenTypes: PollenType[] = []

  // Tree pollen: Feb-May
  if (month >= 1 && month <= 4) {
    season = 'Tree Pollen Season'
    dominantPollen = 'Tree'
    pollenTypes.push({
      name: 'Birch',
      level: month === 3 ? 'very high' : month === 2 || month === 4 ? 'high' : 'moderate',
      count: month === 3 ? 450 : month === 2 || month === 4 ? 280 : 120,
      peak: 'April',
    })
    pollenTypes.push({
      name: 'Oak',
      level: month === 4 ? 'high' : 'moderate',
      count: month === 4 ? 320 : 150,
      peak: 'May',
    })
    pollenTypes.push({
      name: 'Ash',
      level: month === 3 || month === 4 ? 'moderate' : 'low',
      count: month === 3 || month === 4 ? 180 : 60,
      peak: 'April-May',
    })
  }

  // Grass pollen: May-Aug
  if (month >= 4 && month <= 7) {
    season = 'Grass Pollen Season'
    dominantPollen = 'Grass'
    pollenTypes.push({
      name: 'Grass',
      level: month === 5 || month === 6 ? 'very high' : 'high',
      count: month === 5 || month === 6 ? 520 : 340,
      peak: 'June-July',
    })
    pollenTypes.push({
      name: 'Nettle',
      level: 'moderate',
      count: 95,
      peak: 'June-September',
    })
  }

  // Weed pollen: Aug-Oct
  if (month >= 7 && month <= 9) {
    season = 'Weed Pollen Season'
    dominantPollen = 'Weed'
    pollenTypes.push({
      name: 'Ragweed',
      level: month === 8 ? 'high' : 'moderate',
      count: month === 8 ? 280 : 140,
      peak: 'August-September',
    })
    pollenTypes.push({
      name: 'Mugwort',
      level: 'moderate',
      count: 110,
      peak: 'August',
    })
  }

  // Mold spores year-round
  pollenTypes.push({
    name: 'Mold Spores',
    level: month >= 8 && month <= 10 ? 'moderate' : 'low',
    count: month >= 8 && month <= 10 ? 2500 : 800,
    peak: 'Autumn',
  })

  // Winter low pollen
  if (pollenTypes.length <= 1) {
    season = 'Low Pollen Season'
    pollenTypes.unshift({
      name: 'Hazel',
      level: month === 1 ? 'low' : 'none',
      count: month === 1 ? 35 : 5,
      peak: 'February',
    })
    pollenTypes.unshift({
      name: 'Alder',
      level: month === 1 || month === 11 ? 'low' : 'none',
      count: month === 1 || month === 11 ? 45 : 8,
      peak: 'February-March',
    })
  }

  const maxLevel = pollenTypes.reduce((max, p) => {
    const levels = ['none', 'low', 'moderate', 'high', 'very high']
    return levels.indexOf(p.level) > levels.indexOf(max) ? p.level : max
  }, 'none' as 'none' | 'low' | 'moderate' | 'high' | 'very high')

  const overallLevel = maxLevel === 'none' ? 'low' : maxLevel as 'low' | 'moderate' | 'high' | 'very high'
  const levelToIndex: Record<string, number> = { 'none': 0, 'low': 2, 'moderate': 5, 'high': 8, 'very high': 11 }

  const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri']
  const forecast = days.map((day) => ({
    day,
    level: (['low', 'moderate', 'high', 'very high'] as const)[
      Math.min(3, Math.max(0, Math.floor(levelToIndex[overallLevel] / 3 + Math.floor(Math.random() * 2) - 1)))
    ]
  }))

  const adviceMap: Record<string, string> = {
    'low': 'Good day for outdoor activities',
    'moderate': 'Consider antihistamines if sensitive',
    'high': 'Keep windows closed, limit outdoor time',
    'very high': 'Stay indoors, use air purifiers'
  }

  return {
    timestamp: now.toISOString(),
    location: 'Southeast England',
    overallLevel,
    overallIndex: levelToIndex[overallLevel],
    pollenTypes: pollenTypes.filter(p => p.level !== 'none'),
    forecast,
    advice: adviceMap[overallLevel],
    season,
    dominantPollen
  }
}

export default function PollenForecast() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [data, setData] = useState<PollenData | null>(null)

  useEffect(() => {
    setData(generatePollenData())
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  if (!data) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full bg-gradient-to-b from-green-50 to-lime-50 p-[1em]"
        style={{ fontSize: `${baseFontSize}px` }}
      >
        <span className="text-[0.875em] text-green-600/50">Loading pollen data...</span>
      </div>
    )
  }

  const currentColors = levelColors[data.overallLevel]

  return (
    <div
      ref={containerRef}
      className="h-full bg-gradient-to-b from-green-50 to-lime-50 overflow-hidden flex flex-col p-[1em]"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Hero level */}
      <div className={`px-[0.75em] py-[0.625em] rounded-[0.5em] mb-[0.75em] ${currentColors.bg}`}>
        <div className="flex items-center justify-between mb-[0.375em]">
          <div className="text-[0.75em] font-medium text-green-800">
            {data.season}
          </div>
          <div className={`px-[0.5em] py-[0.125em] rounded-full border-2 ${currentColors.text} ${currentColors.text.replace('text-', 'border-')}`}>
            <span className={`text-[0.75em] font-bold uppercase ${currentColors.text}`}>
              {data.overallLevel}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-[0.375em]">
          <div className={`w-[0.5em] h-[0.5em] rounded-full ${currentColors.bar}`} />
          <span className="text-[0.75em] text-green-800">{data.advice}</span>
        </div>
      </div>

      {/* Pollen types */}
      <div className="flex-1 overflow-y-auto min-h-0 mb-[0.75em]">
        <div className="text-[0.625em] text-green-600 uppercase tracking-wider mb-[0.375em]">
          Active Pollen Types
        </div>
        <div className="space-y-[0.5em] bg-white/60 rounded-[0.5em] p-[0.625em]">
          {data.pollenTypes.slice(0, 4).map((pollen) => (
            <div key={pollen.name} className="flex items-center gap-[0.5em]">
              <div
                className={`w-[0.5em] h-[0.5em] rounded-full flex-shrink-0 ${levelColors[pollen.level]?.bar || 'bg-gray-300'}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-[0.125em]">
                  <span className="text-[0.75em] font-medium text-green-900">{pollen.name}</span>
                  <span className={`text-[0.5625em] uppercase font-medium ${levelColors[pollen.level]?.text || 'text-gray-500'}`}>
                    {pollen.level}
                  </span>
                </div>
                <div className="h-[0.25em] bg-green-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${levelColors[pollen.level]?.bar || 'bg-gray-300'}`}
                    style={{
                      width: `${
                        pollen.level === 'very high' ? 100 :
                        pollen.level === 'high' ? 75 :
                        pollen.level === 'moderate' ? 50 :
                        pollen.level === 'low' ? 25 : 5
                      }%`
                    }}
                  />
                </div>
              </div>
              <span className="font-mono text-[0.5625em] text-green-600 w-[4em] text-right flex-shrink-0">
                {pollen.count} /m³
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5-day forecast */}
      <div className="bg-white/40 rounded-[0.5em] p-[0.625em] mb-[0.5em]">
        <div className="text-[0.625em] text-green-600 uppercase tracking-wider mb-[0.375em]">
          5-Day Forecast
        </div>
        <div className="flex justify-between">
          {data.forecast.map((day, i) => (
            <div key={day.day} className="flex flex-col items-center">
              <span className={`text-[0.6875em] ${i === 0 ? 'font-bold text-green-800' : 'text-green-600'}`}>
                {day.day}
              </span>
              <div
                className={`mt-[0.25em] w-[2em] h-[2em] rounded-full flex items-center justify-center ${levelColors[day.level]?.bg || 'bg-gray-100'}`}
              >
                <div className={`w-[0.75em] h-[0.75em] rounded-full ${levelColors[day.level]?.bar || 'bg-gray-300'}`} />
              </div>
              <span className={`text-[0.5em] mt-[0.125em] font-medium uppercase ${levelColors[day.level]?.text || 'text-gray-500'}`}>
                {day.level === 'very high' ? 'V.High' : day.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Index gauge */}
      <div className="bg-green-100/50 rounded-[0.5em] p-[0.5em]">
        <div className="flex items-center justify-between mb-[0.25em]">
          <span className="text-[0.625em] text-green-600 uppercase tracking-wider">Pollen Index</span>
          <span className="font-mono text-[0.875em] font-bold text-green-800">{data.overallIndex}/12</span>
        </div>
        <div className="h-[0.5em] bg-gradient-to-r from-green-300 via-yellow-300 via-orange-400 to-red-500 rounded-full relative">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[0.75em] h-[0.75em] bg-white rounded-full border-2 border-green-800 shadow-md"
            style={{ left: `${(data.overallIndex / 12) * 100}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
        <div className="flex justify-between mt-[0.25em]">
          <span className="text-[0.5em] text-green-600">Low</span>
          <span className="text-[0.5em] text-yellow-600">Moderate</span>
          <span className="text-[0.5em] text-orange-600">High</span>
          <span className="text-[0.5em] text-red-600">V.High</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] mt-[0.5em] border-t border-green-200">
        <span className="text-[0.625em] text-green-700/50">
          {data.location}
        </span>
        <span className="text-[0.625em] text-green-600/50">
          Dominant: {data.dominantPollen}
        </span>
      </div>
    </div>
  )
}
