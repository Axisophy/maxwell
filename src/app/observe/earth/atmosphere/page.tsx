'use client'

import { useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
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
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Observe', href: '/observe' },
              { label: 'Earth', href: '/observe/earth' },
              { label: 'Atmosphere' },
            ]}
            theme="light"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Atmosphere
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            Air quality, radiation levels, pollen counts, lightning activity, and UV index.
            Real-time monitoring of Earth&apos;s atmospheric conditions.
          </p>
        </div>

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
