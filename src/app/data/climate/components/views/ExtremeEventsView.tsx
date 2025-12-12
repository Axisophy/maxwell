'use client'

import { useState } from 'react'
import { Flame, Wind, Droplets, Thermometer, TrendingUp, AlertTriangle, Calendar } from 'lucide-react'

// ===========================================
// EXTREME EVENTS VIEW
// ===========================================
// Track hurricanes, wildfires, floods, and heatwaves
// Show how frequency and intensity are changing

type EventCategory = 'hurricanes' | 'wildfires' | 'floods' | 'heatwaves' | 'all'

interface ExtremeEvent {
  year: number
  name: string
  category: EventCategory
  location: string
  impact: string
  casualties?: number
  costBillions?: number
  notable?: string
}

// Sample data - real implementation would fetch from APIs
const EXTREME_EVENTS: ExtremeEvent[] = [
  // 2024
  { year: 2024, name: 'Hurricane Helene', category: 'hurricanes', location: 'SE United States', impact: 'Cat 4 at landfall, devastating flooding in NC', casualties: 230, costBillions: 50 },
  { year: 2024, name: 'Canadian Wildfires', category: 'wildfires', location: 'British Columbia, Alberta', impact: '5+ million hectares burned', notable: 'Smoke reached Europe' },
  { year: 2024, name: 'European Heatwave', category: 'heatwaves', location: 'Southern Europe', impact: 'Multiple temperature records broken', notable: '48°C in Sicily' },
  
  // 2023
  { year: 2023, name: 'Canadian Wildfires', category: 'wildfires', location: 'Canada-wide', impact: 'Worst fire season on record', notable: '18+ million hectares burned' },
  { year: 2023, name: 'Hurricane Otis', category: 'hurricanes', location: 'Acapulco, Mexico', impact: 'Cat 5, rapid intensification', casualties: 52, costBillions: 12, notable: 'Intensified 80 knots in 12 hours' },
  { year: 2023, name: 'Libya Floods', category: 'floods', location: 'Derna, Libya', impact: 'Two dams collapsed', casualties: 11000 },
  { year: 2023, name: 'Phoenix Heatwave', category: 'heatwaves', location: 'Phoenix, Arizona', impact: '31 consecutive days above 110°F', casualties: 645 },
  
  // 2022
  { year: 2022, name: 'Pakistan Floods', category: 'floods', location: 'Pakistan', impact: '1/3 of country underwater', casualties: 1739, costBillions: 30 },
  { year: 2022, name: 'European Heatwave', category: 'heatwaves', location: 'Western Europe', impact: '40°C+ in UK for first time', casualties: 61672 },
  { year: 2022, name: 'Hurricane Ian', category: 'hurricanes', location: 'Florida', impact: 'Cat 4, worst Florida storm since 1935', casualties: 161, costBillions: 110 },
  
  // Historical benchmarks
  { year: 2017, name: 'Hurricane Maria', category: 'hurricanes', location: 'Puerto Rico', impact: 'Destroyed power grid', casualties: 2975, costBillions: 90 },
  { year: 2020, name: 'Australian Bushfires', category: 'wildfires', location: 'Eastern Australia', impact: '24+ million hectares', casualties: 34, notable: 'Black Summer' },
  { year: 2021, name: 'Pacific Northwest Heat Dome', category: 'heatwaves', location: 'BC, WA, OR', impact: '49.6°C in Canada', casualties: 600, notable: 'Beat all-time Canada record by 4.6°C' },
  { year: 2005, name: 'Hurricane Katrina', category: 'hurricanes', location: 'New Orleans', impact: 'Levee failures, city flooded', casualties: 1836, costBillions: 125 },
]

// Trend data (simplified - real data would be more complex)
const TREND_DATA = {
  hurricanes: {
    title: 'Major Hurricanes (Cat 3+)',
    trend: '+30%',
    trendPeriod: 'since 1980',
    insight: 'Rapid intensification events have tripled in the Atlantic since 1990',
    metric: 'Storms/decade reaching Cat 4-5',
    data: [
      { decade: '1980s', count: 16 },
      { decade: '1990s', count: 21 },
      { decade: '2000s', count: 24 },
      { decade: '2010s', count: 28 },
    ],
  },
  wildfires: {
    title: 'Wildfire Burned Area',
    trend: '+2x',
    trendPeriod: 'since 1985',
    insight: 'Fire season is 78 days longer than in 1970s',
    metric: 'Million hectares/year (US average)',
    data: [
      { decade: '1980s', count: 1.2 },
      { decade: '1990s', count: 1.8 },
      { decade: '2000s', count: 2.9 },
      { decade: '2010s', count: 3.4 },
    ],
  },
  heatwaves: {
    title: 'Heatwave Frequency',
    trend: '+3x',
    trendPeriod: 'since 1960s',
    insight: 'Extreme heat events that were 1-in-50 years are now 1-in-10',
    metric: 'Heatwave events/year (US)',
    data: [
      { decade: '1980s', count: 2.0 },
      { decade: '1990s', count: 3.1 },
      { decade: '2000s', count: 4.2 },
      { decade: '2010s', count: 6.0 },
    ],
  },
  floods: {
    title: 'Extreme Precipitation Events',
    trend: '+37%',
    trendPeriod: 'since 1958',
    insight: 'The heaviest 1% of rain events now deliver 37% more precipitation',
    metric: 'Heavy precip events/decade (US)',
    data: [
      { decade: '1980s', count: 4.5 },
      { decade: '1990s', count: 5.2 },
      { decade: '2000s', count: 5.8 },
      { decade: '2010s', count: 6.3 },
    ],
  },
}

const CATEGORY_CONFIG = {
  hurricanes: { icon: Wind, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Hurricanes' },
  wildfires: { icon: Flame, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Wildfires' },
  floods: { icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Floods' },
  heatwaves: { icon: Thermometer, color: 'text-red-600', bg: 'bg-red-100', label: 'Heatwaves' },
  all: { icon: AlertTriangle, color: 'text-neutral-600', bg: 'bg-neutral-100', label: 'All Events' },
}

export default function ExtremeEventsView() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all')
  const [selectedDecade, setSelectedDecade] = useState<string>('2020s')
  
  const filteredEvents = selectedCategory === 'all'
    ? EXTREME_EVENTS
    : EXTREME_EVENTS.filter(e => e.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-xl font-medium text-neutral-900 mb-2">
          Extreme Weather Events
        </h2>
        <p className="text-sm text-neutral-600 mb-6">
          Climate change is loading the dice for extreme weather. Events that were once rare are 
          becoming more frequent and more intense. Here's what the data shows.
        </p>

        {/* Category selector */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const Icon = config.icon
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as EventCategory)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${selectedCategory === key
                    ? `${config.bg} ${config.color} ring-2 ring-offset-1 ring-current`
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Trend cards */}
      {selectedCategory !== 'all' && TREND_DATA[selectedCategory] && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-neutral-900">
                {TREND_DATA[selectedCategory].title}
              </h3>
              <p className="text-sm text-neutral-500">
                {TREND_DATA[selectedCategory].metric}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-red-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-2xl font-bold">{TREND_DATA[selectedCategory].trend}</span>
              </div>
              <div className="text-xs text-neutral-500">{TREND_DATA[selectedCategory].trendPeriod}</div>
            </div>
          </div>

          {/* Simple bar chart */}
          <div className="mb-4">
            <div className="flex items-end gap-2 h-32">
              {TREND_DATA[selectedCategory].data.map((d, i) => {
                const maxCount = Math.max(...TREND_DATA[selectedCategory].data.map(x => x.count))
                const height = (d.count / maxCount) * 100
                const config = CATEGORY_CONFIG[selectedCategory]
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full ${config.bg} rounded-t transition-all`}
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-xs text-neutral-500 mt-1">{d.decade}</div>
                    <div className="text-xs font-medium">{d.count}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg text-sm text-neutral-700">
            <strong>Key insight:</strong> {TREND_DATA[selectedCategory].insight}
          </div>
        </div>
      )}

      {/* Attribution explainer */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
        <h3 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Understanding Attribution Science
        </h3>
        <p className="text-sm text-amber-800 mb-4">
          Scientists can now calculate how much more likely or intense individual weather events 
          are because of climate change. This is called "attribution science."
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-white/60 rounded-lg p-3">
            <div className="font-medium text-amber-900">2021 Pacific Northwest Heat Dome</div>
            <div className="text-amber-700">
              Made <strong>150x more likely</strong> and <strong>2°C hotter</strong> by climate change
            </div>
          </div>
          <div className="bg-white/60 rounded-lg p-3">
            <div className="font-medium text-amber-900">2022 Pakistan Floods</div>
            <div className="text-amber-700">
              Rainfall made <strong>75% more intense</strong> by climate change
            </div>
          </div>
        </div>
      </div>

      {/* Recent events timeline */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-neutral-400" />
          Major Events Timeline
        </h3>
        
        <div className="space-y-3">
          {filteredEvents.slice(0, 10).map((event, i) => {
            const config = CATEGORY_CONFIG[event.category]
            const Icon = config.icon
            
            return (
              <div 
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-medium text-neutral-900">{event.name}</span>
                    <span className="text-sm text-neutral-500">{event.year}</span>
                    <span className="text-sm text-neutral-400">• {event.location}</span>
                  </div>
                  <p className="text-sm text-neutral-600 mt-0.5">{event.impact}</p>
                  <div className="flex flex-wrap gap-3 mt-1.5">
                    {event.casualties && (
                      <span className="text-xs text-neutral-500">
                        💔 {event.casualties.toLocaleString()} deaths
                      </span>
                    )}
                    {event.costBillions && (
                      <span className="text-xs text-neutral-500">
                        💰 ${event.costBillions}B damage
                      </span>
                    )}
                    {event.notable && (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                        {event.notable}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cost summary */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">
          The Cost of Extreme Weather
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-neutral-50 rounded-xl text-center">
            <div className="text-3xl font-bold text-neutral-900">$313B</div>
            <div className="text-sm text-neutral-500">2022 global weather losses</div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-xl text-center">
            <div className="text-3xl font-bold text-neutral-900">28</div>
            <div className="text-sm text-neutral-500">Billion-dollar events in US (2023)</div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-xl text-center">
            <div className="text-3xl font-bold text-neutral-900">+7%/year</div>
            <div className="text-sm text-neutral-500">Average increase in damages</div>
          </div>
        </div>

        <p className="text-sm text-neutral-600">
          Economic losses from weather disasters have been rising faster than GDP growth. 
          This reflects both increased exposure (more development in vulnerable areas) and 
          increased hazard intensity from climate change.
        </p>
      </div>
    </div>
  )
}