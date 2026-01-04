'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BreadcrumbFrame, breadcrumbItems, PageHeaderFrame } from '@/components/ui'
import { ObserveIcon } from '@/components/icons'
import AirQualityTab from './components/AirQualityTab'
import RadiationTab from './components/RadiationTab'
import PollenTab from './components/PollenTab'
import LightningTab from './components/LightningTab'
import UVIndexTab from './components/UVIndexTab'

const TABS = [
  { id: 'air-quality', label: 'Air Quality' },
  { id: 'radiation', label: 'Radiation' },
  { id: 'pollen', label: 'Pollen' },
  { id: 'lightning', label: 'Lightning' },
  { id: 'uv-index', label: 'UV Index' },
]

export default function AtmospherePage() {
  const [activeTab, setActiveTab] = useState('air-quality')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'air-quality':
        return <AirQualityTab />
      case 'radiation':
        return <RadiationTab />
      case 'pollen':
        return <PollenTab />
      case 'lightning':
        return <LightningTab />
      case 'uv-index':
        return <UVIndexTab />
      default:
        return <AirQualityTab />
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
            ['Atmosphere']
          )}
        />

        <PageHeaderFrame
          variant="light"
          title="Atmosphere"
          description="Air quality, radiation levels, pollen counts, lightning activity, and UV index. Real-time monitoring of Earth's atmospheric conditions."
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
              href="/observe/earth/weather"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              Weather →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-black/10">
            <p className="text-xs text-black/30 mb-2">Data Sources</p>
            <p className="text-xs text-black/50">
              OpenAQ • EURDEP • Blitzortung • NOAA UV Index • Various Pollen Networks
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
