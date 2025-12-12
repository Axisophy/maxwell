'use client'

import { useState } from 'react'
import SourcesPanel from './components/SourcesPanel'
import OverviewView from './components/views/OverviewView'
import DeepTimeView from './components/views/DeepTimeView'
import ExtremeEventsView from './components/views/ExtremeEventsView'
import HumanFactorsView from './components/views/HumanFactorsView'
import PersonalScaleView from './components/views/PersonalScaleView'
import { ViewMode } from './lib/types'

// ===========================================
// EARTH CLIMATE DATA CENTRE
// ===========================================
// Main page component with view navigation

const VIEW_TABS: { id: ViewMode; label: string; description: string; ready: boolean }[] = [
  { 
    id: 'overview', 
    label: 'Overview', 
    description: 'Interactive multi-dataset chart',
    ready: true,
  },
  { 
    id: 'deep-time', 
    label: 'Deep Time', 
    description: '800,000 years of climate history',
    ready: true,
  },
  { 
    id: 'extreme-events', 
    label: 'Extreme Events', 
    description: 'Hurricanes, wildfires, floods, heatwaves',
    ready: true,
  },
  { 
    id: 'human-factors', 
    label: 'Human Factors', 
    description: 'Industrial, policy, and technology timeline',
    ready: true,
  },
  { 
    id: 'personal', 
    label: 'Personal Scale', 
    description: 'Your carbon footprint',
    ready: true,
  },
]

export default function ClimateDataCentre() {
  const [currentView, setCurrentView] = useState<ViewMode>('overview')

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Earth Climate Data Centre
          </h1>
          <p className="text-base md:text-lg text-neutral-600 max-w-3xl">
            Comprehensive climate data from NASA, NOAA, and leading research institutions. 
            Explore historical trends, compare datasets, and understand the evidence.
          </p>
        </div>

        {/* Sources Panel (collapsible) */}
        <div className="mb-8">
          <SourcesPanel />
        </div>

        {/* View Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {VIEW_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => tab.ready && setCurrentView(tab.id)}
                disabled={!tab.ready}
                className={`
                  relative px-5 py-3 rounded-xl border-2 transition-all duration-200
                  ${currentView === tab.id 
                    ? 'border-black bg-black text-white' 
                    : tab.ready
                      ? 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
                      : 'border-neutral-100 bg-neutral-50 text-neutral-400 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{tab.label}</span>
                  {!tab.ready && (
                    <span className="text-xs px-1.5 py-0.5 bg-neutral-200 text-neutral-500 rounded">
                      Soon
                    </span>
                  )}
                </div>
                <p className={`
                  text-xs mt-0.5
                  ${currentView === tab.id ? 'text-white/70' : 'text-neutral-400'}
                `}>
                  {tab.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* View Content */}
        <div>
          {currentView === 'overview' && <OverviewView />}
          {currentView === 'deep-time' && <DeepTimeView />}
          {currentView === 'extreme-events' && <ExtremeEventsView />}
          {currentView === 'human-factors' && <HumanFactorsView />}
          {currentView === 'personal' && <PersonalScaleView />}
        </div>
      </div>
    </main>
  )
}