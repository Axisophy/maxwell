'use client'

import { useState } from 'react'
import SourcesPanel from './components/SourcesPanel'
import OverviewView from './components/views/OverviewView'
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
    ready: false,
  },
  { 
    id: 'extreme-events', 
    label: 'Extreme Events', 
    description: 'Hurricanes, wildfires, floods, heatwaves',
    ready: false,
  },
  { 
    id: 'human-factors', 
    label: 'Human Factors', 
    description: 'Industrial, policy, and technology timeline',
    ready: false,
  },
  { 
    id: 'personal', 
    label: 'Personal Scale', 
    description: 'Your carbon footprint',
    ready: false,
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
          
          {currentView === 'deep-time' && (
            <ComingSoonView 
              title="Deep Time View"
              description="Explore 800,000 years of climate history from Antarctic ice cores. See natural cycles and the unprecedented industrial spike."
            />
          )}
          
          {currentView === 'human-factors' && (
            <ComingSoonView 
              title="Human Factors"
              description="Timeline of industrial development, policy responses, and technological shifts — overlaid on climate data."
            />
          )}
          
          {currentView === 'extreme-events' && (
            <ComingSoonView 
              title="Extreme Events"
              description="Track hurricanes, wildfires, floods, and heatwaves. See how frequency and intensity are changing over time."
            />
          )}
          
          {currentView === 'personal' && (
            <ComingSoonView 
              title="Personal Scale"
              description="Understand your carbon footprint. Compare activities. See how individual choices connect to global trends."
            />
          )}
        </div>
      </div>
    </main>
  )
}

// ===========================================
// COMING SOON PLACEHOLDER
// ===========================================

function ComingSoonView({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-medium text-neutral-900 mb-3">
          {title}
        </h2>
        <p className="text-neutral-500 mb-6">
          {description}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg text-sm">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          Coming soon
        </div>
      </div>
    </div>
  )
}
