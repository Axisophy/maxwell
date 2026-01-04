'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BreadcrumbFrame, breadcrumbItems, PageHeaderFrame } from '@/components/ui'
import { ObserveIcon } from '@/components/icons'
import OverviewTab from './components/OverviewTab'
import SatellitesTab from './components/SatellitesTab'
import OceanTab from './components/OceanTab'
import JetStreamsTab from './components/JetStreamsTab'
import StormsTab from './components/StormsTab'
import UKTab from './components/UKTab'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'satellites', label: 'Satellites' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'jet-streams', label: 'Jet Streams' },
  { id: 'storms', label: 'Storms' },
  { id: 'uk', label: 'UK' },
]

export default function WeatherPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />
      case 'satellites':
        return <SatellitesTab />
      case 'ocean':
        return <OceanTab />
      case 'jet-streams':
        return <JetStreamsTab />
      case 'storms':
        return <StormsTab />
      case 'uk':
        return <UKTab />
      default:
        return <OverviewTab />
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        <BreadcrumbFrame
          variant="light"
          icon={<ObserveIcon className="w-4 h-4" />}
          items={breadcrumbItems(
            ['MXWLL', '/'],
            ['Observe', '/observe'],
            ['Earth', '/observe/earth'],
            ['Weather']
          )}
        />

        <PageHeaderFrame
          variant="light"
          title="Weather"
          description="Global weather patterns and atmospheric conditions. Satellite imagery, ocean currents, jet streams, and storm tracking."
        />

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 mb-6 border-b border-black/10 pb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg -mb-px ${
                activeTab === tab.id
                  ? 'bg-white text-black border border-black/10 border-b-white'
                  : 'text-black/50 hover:text-black hover:bg-black/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <footer className="pt-8 mt-8 border-t border-black/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/observe/earth"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              ← Back to Earth
            </Link>
            <Link
              href="/observe/earth/fires"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              Active Fires →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-black/10">
            <p className="text-xs text-black/30 mb-2">Data Sources</p>
            <p className="text-xs text-black/50">
              NOAA • EUMETSAT • JMA • Met Office • NASA GOES & Himawari
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
