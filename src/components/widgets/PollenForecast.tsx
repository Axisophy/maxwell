'use client'

import { useState, useEffect, useRef } from 'react'

interface PollenType {
  name: string
  level: 'none' | 'low' | 'moderate' | 'high' | 'very high'
  count: number // grains per cubic meter
  peak: string // Peak season
  color: string
  icon: string
}

interface PollenData {
  timestamp: string
  location: string
  overallLevel: 'low' | 'moderate' | 'high' | 'very high'
  overallIndex: number // 0-12
  pollenTypes: PollenType[]
  forecast: { day: string; level: 'low' | 'moderate' | 'high' | 'very high' }[]
  advice: string
  season: string
  dominantPollen: string
}

// Generate realistic pollen data based on month
function generatePollenData(): PollenData {
  const now = new Date()
  const month = now.getMonth() // 0-11
  
  // Determine season and dominant pollen
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
      color: '#a5d6a7',
      icon: '🌳'
    })
    pollenTypes.push({
      name: 'Oak',
      level: month === 4 ? 'high' : 'moderate',
      count: month === 4 ? 320 : 150,
      peak: 'May',
      color: '#81c784',
      icon: '🌳'
    })
    pollenTypes.push({
      name: 'Ash',
      level: month === 3 || month === 4 ? 'moderate' : 'low',
      count: month === 3 || month === 4 ? 180 : 60,
      peak: 'April-May',
      color: '#66bb6a',
      icon: '🌳'
    })
  }
  
  // Grass pollen: May-Aug (peak June-July)
  if (month >= 4 && month <= 7) {
    season = 'Grass Pollen Season'
    dominantPollen = 'Grass'
    pollenTypes.push({
      name: 'Grass',
      level: month === 5 || month === 6 ? 'very high' : 'high',
      count: month === 5 || month === 6 ? 520 : 340,
      peak: 'June-July',
      color: '#aed581',
      icon: '🌾'
    })
    pollenTypes.push({
      name: 'Nettle',
      level: 'moderate',
      count: 95,
      peak: 'June-September',
      color: '#9ccc65',
      icon: '🌿'
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
      color: '#ffcc80',
      icon: '🌻'
    })
    pollenTypes.push({
      name: 'Mugwort',
      level: 'moderate',
      count: 110,
      peak: 'August',
      color: '#ffb74d',
      icon: '🌿'
    })
  }
  
  // Mold spores year-round but higher in autumn
  pollenTypes.push({
    name: 'Mold Spores',
    level: month >= 8 && month <= 10 ? 'moderate' : 'low',
    count: month >= 8 && month <= 10 ? 2500 : 800,
    peak: 'Autumn',
    color: '#bcaaa4',
    icon: '🍂'
  })
  
  // If winter with low pollen
  if (pollenTypes.length <= 1) {
    season = 'Low Pollen Season'
    pollenTypes.unshift({
      name: 'Hazel',
      level: month === 1 ? 'low' : 'none',
      count: month === 1 ? 35 : 5,
      peak: 'February',
      color: '#c8e6c9',
      icon: '🌰'
    })
    pollenTypes.unshift({
      name: 'Alder',
      level: month === 1 || month === 11 ? 'low' : 'none',
      count: month === 1 || month === 11 ? 45 : 8,
      peak: 'February-March',
      color: '#b2dfdb',
      icon: '🌲'
    })
  }
  
  // Calculate overall level
  const maxLevel = pollenTypes.reduce((max, p) => {
    const levels = ['none', 'low', 'moderate', 'high', 'very high']
    return levels.indexOf(p.level) > levels.indexOf(max) ? p.level : max
  }, 'none' as 'none' | 'low' | 'moderate' | 'high' | 'very high')
  
  const overallLevel = maxLevel === 'none' ? 'low' : maxLevel as 'low' | 'moderate' | 'high' | 'very high'
  const levelToIndex: Record<string, number> = { 'none': 0, 'low': 2, 'moderate': 5, 'high': 8, 'very high': 11 }
  
  // Generate 5-day forecast
  const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri']
  const forecast = days.map((day, i) => ({
    day,
    level: (['low', 'moderate', 'high', 'very high'] as const)[
      Math.min(3, Math.max(0, levelToIndex[overallLevel] / 3 + Math.floor(Math.random() * 2) - 1))
    ]
  }))
  
  // Advice based on level
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

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setBaseFontSize(width / 25)
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  if (!data) {
    return (
      <div ref={containerRef} className="w-full aspect-square bg-green-50 rounded-xl flex items-center justify-center">
        <span className="text-green-600/50">Loading pollen data...</span>
      </div>
    )
  }

  const levelColors: Record<string, { bg: string; text: string; bar: string }> = {
    'low': { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-400' },
    'moderate': { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-400' },
    'high': { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-400' },
    'very high': { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' }
  }

  const currentColors = levelColors[data.overallLevel]

  return (
    <div 
      ref={containerRef}
      className="w-full aspect-[4/5] bg-gradient-to-b from-green-50 to-lime-50 rounded-xl overflow-hidden"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className={`px-[1em] py-[0.75em] ${currentColors.bg}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[0.6875em] font-medium uppercase tracking-wider text-green-600">
              {data.season}
            </div>
            <div className="text-[1.125em] font-bold text-green-900">
              Pollen Forecast
            </div>
          </div>
          <div className={`px-[0.75em] py-[0.375em] rounded-full ${currentColors.bg} border-2 ${currentColors.text.replace('text-', 'border-')}`}>
            <span className={`text-[0.875em] font-bold uppercase ${currentColors.text}`}>
              {data.overallLevel}
            </span>
          </div>
        </div>
        
        {/* Advice banner */}
        <div className="mt-[0.5em] flex items-center gap-[0.5em]">
          <span className="text-[1em]">💊</span>
          <span className="text-[0.6875em] text-green-800">{data.advice}</span>
        </div>
      </div>

      {/* Pollen types */}
      <div className="px-[1em] py-[0.75em] bg-white/60">
        <div className="text-[0.5625em] text-green-600 uppercase tracking-wider mb-[0.5em]">
          Active Pollen Types
        </div>
        <div className="space-y-[0.5em]">
          {data.pollenTypes.slice(0, 4).map((pollen) => (
            <div key={pollen.name} className="flex items-center gap-[0.5em]">
              <span className="text-[0.875em] w-[1.5em]">{pollen.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-[0.125em]">
                  <span className="text-[0.75em] font-medium text-green-900">{pollen.name}</span>
                  <span className={`text-[0.5em] uppercase font-medium ${levelColors[pollen.level]?.text || 'text-gray-500'}`}>
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
              <span className="font-mono text-[0.5em] text-green-600 w-[4em] text-right">
                {pollen.count} /m³
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5-day forecast */}
      <div className="px-[1em] py-[0.75em] bg-white/40">
        <div className="text-[0.5625em] text-green-600 uppercase tracking-wider mb-[0.5em]">
          5-Day Forecast
        </div>
        <div className="flex justify-between">
          {data.forecast.map((day, i) => (
            <div key={day.day} className="flex flex-col items-center">
              <span className={`text-[0.625em] ${i === 0 ? 'font-bold text-green-800' : 'text-green-600'}`}>
                {day.day}
              </span>
              <div
                className={`mt-[0.25em] w-[2.5em] h-[2.5em] rounded-full flex items-center justify-center ${levelColors[day.level]?.bg || 'bg-gray-100'}`}
              >
                <span className="text-[1em]">
                  {day.level === 'very high' ? '😷' :
                   day.level === 'high' ? '🤧' :
                   day.level === 'moderate' ? '😐' : '😊'}
                </span>
              </div>
              <span className={`text-[0.5em] mt-[0.25em] font-medium uppercase ${levelColors[day.level]?.text || 'text-gray-500'}`}>
                {day.level === 'very high' ? 'V.High' : day.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Index gauge */}
      <div className="px-[1em] py-[0.75em] bg-green-100/50">
        <div className="flex items-center justify-between mb-[0.25em]">
          <span className="text-[0.5625em] text-green-600 uppercase tracking-wider">Pollen Index</span>
          <span className="font-mono text-[0.875em] font-bold text-green-800">{data.overallIndex}/12</span>
        </div>
        <div className="h-[0.5em] bg-gradient-to-r from-green-300 via-yellow-300 via-orange-400 to-red-500 rounded-full relative">
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-[0.75em] h-[0.75em] bg-white rounded-full border-2 border-green-800 shadow-md"
            style={{ left: `${(data.overallIndex / 12) * 100}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
        <div className="flex justify-between mt-[0.25em]">
          <span className="text-[0.4375em] text-green-600">Low</span>
          <span className="text-[0.4375em] text-yellow-600">Moderate</span>
          <span className="text-[0.4375em] text-orange-600">High</span>
          <span className="text-[0.4375em] text-red-600">Very High</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-[1em] py-[0.5em] bg-green-200/50 flex items-center justify-between">
        <span className="text-[0.5625em] text-green-700">
          {data.location}
        </span>
        <span className="text-[0.5em] text-green-600">
          Dominant: {data.dominantPollen}
        </span>
      </div>
    </div>
  )
}
