'use client'

import { useState } from 'react'
import { Factory, FileText, Lightbulb, Leaf, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react'

// ===========================================
// HUMAN FACTORS VIEW
// ===========================================
// Industrial development, policy responses, and technological shifts
// overlaid on climate data timeline

type TimelineCategory = 'industry' | 'science' | 'policy' | 'technology' | 'all'

interface TimelineEvent {
  year: number
  category: TimelineCategory
  title: string
  description: string
  co2AtTime?: number
  impact: 'positive' | 'negative' | 'neutral'
  significance: 'major' | 'minor'
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  // Pre-1900
  { year: 1712, category: 'industry', title: 'Newcomen Steam Engine', description: 'First practical steam engine, marks start of fossil fuel era', impact: 'negative', significance: 'major', co2AtTime: 280 },
  { year: 1769, category: 'industry', title: 'Watt Steam Engine', description: 'Efficient steam power enables Industrial Revolution', impact: 'negative', significance: 'major', co2AtTime: 280 },
  { year: 1859, category: 'industry', title: 'First Oil Well', description: 'Drake Well in Pennsylvania begins petroleum age', impact: 'negative', significance: 'major', co2AtTime: 286 },
  { year: 1896, category: 'science', title: 'Arrhenius Paper', description: 'First calculation of CO₂ greenhouse effect', impact: 'neutral', significance: 'major', co2AtTime: 295 },
  
  // Early 1900s
  { year: 1908, category: 'industry', title: 'Model T Production', description: 'Mass automobile production begins', impact: 'negative', significance: 'major', co2AtTime: 300 },
  { year: 1938, category: 'science', title: 'Callendar Paper', description: 'Links observed warming to fossil fuel burning', impact: 'neutral', significance: 'minor' },
  { year: 1958, category: 'science', title: 'Keeling Curve Begins', description: 'Continuous CO₂ measurements start at Mauna Loa', impact: 'neutral', significance: 'major', co2AtTime: 315 },
  
  // 1970s-80s
  { year: 1970, category: 'policy', title: 'First Earth Day', description: '20 million Americans participate', impact: 'positive', significance: 'minor' },
  { year: 1970, category: 'policy', title: 'US Clean Air Act', description: 'First major air quality legislation', impact: 'positive', significance: 'minor' },
  { year: 1979, category: 'science', title: 'Charney Report', description: 'NAS confirms CO₂ warming; predicts 2-3.5°C per doubling', impact: 'neutral', significance: 'major' },
  { year: 1988, category: 'science', title: 'IPCC Created', description: 'UN establishes climate science panel', impact: 'positive', significance: 'major', co2AtTime: 351 },
  { year: 1988, category: 'science', title: 'Hansen Testimony', description: 'NASA scientist tells Congress climate change has begun', impact: 'neutral', significance: 'major' },
  
  // 1990s
  { year: 1990, category: 'science', title: 'IPCC First Assessment', description: 'Confirms human-caused warming is real', impact: 'neutral', significance: 'major' },
  { year: 1992, category: 'policy', title: 'Rio Earth Summit', description: 'UNFCCC treaty signed by 154 nations', impact: 'positive', significance: 'major', co2AtTime: 356 },
  { year: 1997, category: 'policy', title: 'Kyoto Protocol', description: 'First binding emissions targets for developed nations', impact: 'positive', significance: 'major', co2AtTime: 363 },
  
  // 2000s
  { year: 2001, category: 'policy', title: 'US Rejects Kyoto', description: 'Bush administration withdraws from protocol', impact: 'negative', significance: 'major' },
  { year: 2006, category: 'science', title: 'An Inconvenient Truth', description: 'Al Gore documentary reaches mass audience', impact: 'positive', significance: 'minor' },
  { year: 2007, category: 'science', title: 'IPCC Fourth Assessment', description: '"Unequivocal" warming, 90%+ confidence in human cause', impact: 'neutral', significance: 'major', co2AtTime: 383 },
  
  // 2010s
  { year: 2014, category: 'technology', title: 'Solar Price Crossover', description: 'Solar becomes cheaper than new coal in sunny regions', impact: 'positive', significance: 'major' },
  { year: 2015, category: 'policy', title: 'Paris Agreement', description: '196 nations agree to limit warming to 1.5-2°C', impact: 'positive', significance: 'major', co2AtTime: 401 },
  { year: 2017, category: 'policy', title: 'US Paris Withdrawal', description: 'Trump administration announces exit', impact: 'negative', significance: 'major' },
  { year: 2019, category: 'technology', title: 'Battery Price Collapse', description: 'Li-ion batteries 87% cheaper than 2010', impact: 'positive', significance: 'major' },
  
  // 2020s
  { year: 2021, category: 'policy', title: 'US Rejoins Paris', description: 'Biden administration re-enters agreement', impact: 'positive', significance: 'minor' },
  { year: 2022, category: 'policy', title: 'US Inflation Reduction Act', description: '$370B for clean energy - largest US climate investment', impact: 'positive', significance: 'major', co2AtTime: 418 },
  { year: 2022, category: 'policy', title: 'EU Carbon Border Tax', description: 'First major climate tariff on imports', impact: 'positive', significance: 'major' },
  { year: 2023, category: 'policy', title: 'COP28 Dubai', description: 'First mention of fossil fuel "transition away"', impact: 'positive', significance: 'minor', co2AtTime: 421 },
  { year: 2023, category: 'technology', title: 'Renewable Majority', description: 'EU generates more power from renewables than fossil fuels', impact: 'positive', significance: 'major' },
  { year: 2024, category: 'industry', title: 'Global EV Sales 20%', description: '1 in 5 cars sold globally is electric', impact: 'positive', significance: 'major' },
]

const CATEGORY_CONFIG = {
  industry: { icon: Factory, color: 'text-slate-600', bg: 'bg-slate-100', label: 'Industry' },
  science: { icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Science' },
  policy: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Policy' },
  technology: { icon: Leaf, color: 'text-green-600', bg: 'bg-green-100', label: 'Technology' },
  all: { icon: Clock, color: 'text-neutral-600', bg: 'bg-neutral-100', label: 'All' },
}

// Emissions by decade
const EMISSIONS_DATA = [
  { decade: '1900s', annual: 2, cumulative: 20 },
  { decade: '1950s', annual: 5, cumulative: 150 },
  { decade: '1970s', annual: 15, cumulative: 350 },
  { decade: '1990s', annual: 22, cumulative: 650 },
  { decade: '2010s', annual: 35, cumulative: 1500 },
  { decade: '2020s', annual: 37, cumulative: 1650 },
]

export default function HumanFactorsView() {
  const [selectedCategory, setSelectedCategory] = useState<TimelineCategory>('all')
  const [selectedDecade, setSelectedDecade] = useState<number | null>(null)
  
  const filteredEvents = selectedCategory === 'all'
    ? TIMELINE_EVENTS
    : TIMELINE_EVENTS.filter(e => e.category === selectedCategory)
  
  const sortedEvents = [...filteredEvents].sort((a, b) => a.year - b.year)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-xl font-medium text-neutral-900 mb-2">
          Human Factors: The Path We've Taken
        </h2>
        <p className="text-sm text-neutral-600 mb-6">
          Climate change is a story of industrial development, scientific discovery, policy responses, 
          and technological change. This timeline shows how human choices have shaped - and continue 
          to shape - our climate trajectory.
        </p>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const Icon = config.icon
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as TimelineCategory)}
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

      {/* Cumulative emissions context */}
      <div className="bg-gradient-to-br from-slate-50 to-neutral-100 rounded-2xl border border-slate-200 p-6">
        <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Cumulative CO₂ Emissions Over Time
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          What matters for climate is the <em>total</em> CO₂ ever emitted, not just annual rates. 
          Each tonne stays in the atmosphere for centuries.
        </p>

        {/* Simple cumulative chart */}
        <div className="flex items-end gap-2 h-32 mb-2">
          {EMISSIONS_DATA.map((d, i) => {
            const maxCumulative = Math.max(...EMISSIONS_DATA.map(x => x.cumulative))
            const height = (d.cumulative / maxCumulative) * 100
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-slate-400 rounded-t transition-all hover:bg-slate-500"
                  style={{ height: `${height}%` }}
                />
              </div>
            )
          })}
        </div>
        <div className="flex gap-2">
          {EMISSIONS_DATA.map((d, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="text-xs text-slate-500">{d.decade}</div>
              <div className="text-xs font-medium">{d.cumulative} Gt</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-white/60 rounded-lg text-sm text-slate-700">
          <strong>Key insight:</strong> More than half of all human CO₂ emissions have occurred since 1990 - 
          <em>after</em> the science was clear and international agreements began.
        </div>
      </div>

      {/* The Gap */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
        <h3 className="font-medium text-amber-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          The Knowing-Doing Gap
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-900">1896</div>
            <div className="text-sm text-amber-700">First CO₂ warming calculation</div>
          </div>
          <div className="bg-white/60 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-900">1988</div>
            <div className="text-sm text-amber-700">Scientists told Congress it was happening</div>
          </div>
          <div className="bg-white/60 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-900">2024</div>
            <div className="text-sm text-amber-700">Still setting emissions records</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-6">
          Timeline of Events
        </h3>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200" />

          <div className="space-y-4">
            {sortedEvents.map((event, i) => {
              const config = CATEGORY_CONFIG[event.category]
              const Icon = config.icon
              
              return (
                <div key={i} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className={`
                    absolute left-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${config.bg} border-2 border-white shadow
                  `}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>

                  {/* Event card */}
                  <div className={`
                    p-4 rounded-lg transition-colors
                    ${event.significance === 'major' 
                      ? 'bg-neutral-50 border border-neutral-200' 
                      : 'bg-transparent'
                    }
                  `}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm text-neutral-500">
                            {event.year}
                          </span>
                          <span className="font-medium text-neutral-900">
                            {event.title}
                          </span>
                          {event.impact === 'positive' && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3" />
                              Progress
                            </span>
                          )}
                          {event.impact === 'negative' && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-0.5">
                              <AlertCircle className="w-3 h-3" />
                              Setback
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">
                          {event.description}
                        </p>
                      </div>
                      {event.co2AtTime && (
                        <div className="text-right flex-shrink-0">
                          <div className="font-mono text-lg font-bold text-neutral-700">
                            {event.co2AtTime}
                          </div>
                          <div className="text-xs text-neutral-400">ppm CO₂</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">
          The Path Forward: What Matters Now
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="font-medium text-green-900 mb-2">What's Working</div>
            <ul className="space-y-1.5 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Solar & wind now cheapest power in most places
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                EV adoption accelerating faster than projected
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Major economies have binding climate laws
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Carbon capture technology advancing
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="font-medium text-red-900 mb-2">What's Not</div>
            <ul className="space-y-1.5 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Global emissions still rising
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                1.5°C limit likely to be breached by 2030
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Fossil fuel production still expanding
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Climate finance far below needed levels
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}