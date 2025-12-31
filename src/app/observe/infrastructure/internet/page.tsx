'use client'

import { useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'

interface Cable {
  name: string
  route: string
  length: string
  capacity: string
  rfs: string
  owners: string[]
  landing: string[]
}

const MAJOR_CABLES: Cable[] = [
  {
    name: 'MAREA',
    route: 'Virginia Beach, US - Bilbao, Spain',
    length: '6,600 km',
    capacity: '200 Tbps',
    rfs: '2017',
    owners: ['Microsoft', 'Meta', 'Telxius'],
    landing: ['Virginia Beach', 'Bilbao'],
  },
  {
    name: 'Dunant',
    route: 'Virginia Beach, US - Saint-Hilaire-de-Riez, France',
    length: '6,400 km',
    capacity: '250 Tbps',
    rfs: '2020',
    owners: ['Google'],
    landing: ['Virginia Beach', 'Saint-Hilaire-de-Riez'],
  },
  {
    name: 'PEACE Cable',
    route: 'Pakistan - East Africa - Europe',
    length: '15,000 km',
    capacity: '96 Tbps',
    rfs: '2022',
    owners: ['PEACE Cable International'],
    landing: ['Karachi', 'Djibouti', 'Mombasa', 'Marseille'],
  },
  {
    name: '2Africa',
    route: 'Africa circumnavigation + extensions',
    length: '45,000 km',
    capacity: '180 Tbps',
    rfs: '2024',
    owners: ['Meta', 'MTN', 'Vodafone', 'China Mobile'],
    landing: ['33 landing points across Africa, Europe, Middle East'],
  },
  {
    name: 'SEA-ME-WE 6',
    route: 'Singapore - France',
    length: '19,200 km',
    capacity: '126 Tbps',
    rfs: '2025',
    owners: ['Consortium of 15+ operators'],
    landing: ['Singapore', 'Mumbai', 'Djibouti', 'Marseille'],
  },
  {
    name: 'Grace Hopper',
    route: 'New York - Bude, UK - Bilbao, Spain',
    length: '6,234 km',
    capacity: '350 Tbps',
    rfs: '2022',
    owners: ['Google'],
    landing: ['New York', 'Bude', 'Bilbao'],
  },
  {
    name: 'TAT-14',
    route: 'US - UK - France - Germany - Netherlands - Denmark',
    length: '15,428 km',
    capacity: '3.2 Tbps',
    rfs: '2001',
    owners: ['Consortium'],
    landing: ['Tuckerton', 'Bude', 'St Valery', 'Norden', 'Katwijk', 'Blaabjerg'],
  },
  {
    name: 'AAE-1',
    route: 'Asia Africa Europe',
    length: '25,000 km',
    capacity: '40 Tbps',
    rfs: '2017',
    owners: ['19 consortium members'],
    landing: ['Hong Kong', 'Singapore', 'Mumbai', 'Aden', 'Djibouti', 'Marseille'],
  },
]

const LANDING_STATIONS = [
  { name: 'Bude, Cornwall', country: 'UK', cables: 8 },
  { name: 'Marseille', country: 'France', cables: 13 },
  { name: 'New York area', country: 'USA', cables: 12 },
  { name: 'Singapore', country: 'Singapore', cables: 26 },
  { name: 'Hong Kong', country: 'China', cables: 14 },
  { name: 'Mumbai', country: 'India', cables: 10 },
  { name: 'Virginia Beach', country: 'USA', cables: 9 },
  { name: 'Fujairah', country: 'UAE', cables: 8 },
]

export default function InternetPage() {
  const [selectedCable, setSelectedCable] = useState<Cable | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCables = MAJOR_CABLES.filter(cable =>
    cable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cable.route.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Observe', href: '/observe' },
              { label: 'Infrastructure', href: '/observe/infrastructure' },
              { label: 'Internet' },
            ]}
            theme="dark"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-3">
            Submarine Cables
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl">
            The physical backbone of the internet. Over 550 cables stretching 1.4 million
            kilometres across ocean floors, carrying 99% of intercontinental data.
          </p>
        </div>

        {/* Global Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-3xl font-light text-cyan-400">552</p>
              <p className="text-xs text-white/40">Active Cables</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-3xl font-light text-white">1.4M</p>
              <p className="text-xs text-white/40">km Total Length</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-3xl font-light text-white">&gt;1,000</p>
              <p className="text-xs text-white/40">Tbps Capacity</p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5 text-center">
              <p className="text-3xl font-light text-white">8,000</p>
              <p className="text-xs text-white/40">m Deepest Point</p>
            </div>
          </div>
        </section>

        {/* Ocean Map Visualization */}
        <section className="mb-8">
          <div className="bg-gradient-to-b from-blue-950 to-slate-900 rounded-xl aspect-[21/9] relative overflow-hidden">
            {/* Simplified cable visualization */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 1000 400" className="w-full h-full">
                {/* Transatlantic cables */}
                <path d="M 100 200 Q 300 150 500 200 T 900 200" stroke="cyan" strokeWidth="2" fill="none" opacity="0.6" />
                <path d="M 120 180 Q 320 220 520 180 T 880 180" stroke="cyan" strokeWidth="1.5" fill="none" opacity="0.5" />
                <path d="M 80 220 Q 280 180 480 220 T 920 220" stroke="cyan" strokeWidth="1" fill="none" opacity="0.4" />
                {/* Asia-Europe */}
                <path d="M 500 300 Q 600 280 700 300 Q 800 280 900 300" stroke="cyan" strokeWidth="1.5" fill="none" opacity="0.5" />
                {/* Pacific */}
                <path d="M 50 180 Q 150 300 250 180" stroke="cyan" strokeWidth="1" fill="none" opacity="0.4" />
                {/* Landing points */}
                <circle cx="100" cy="200" r="4" fill="white" />
                <circle cx="900" cy="200" r="4" fill="white" />
                <circle cx="500" cy="300" r="4" fill="white" />
                <circle cx="700" cy="150" r="4" fill="white" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/80 text-lg mb-2">Global Submarine Cable Network</p>
                <p className="text-white/40 text-sm">Connecting continents at the speed of light</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cable Browser */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider">
              Major Cables
            </h2>
            <input
              type="text"
              placeholder="Search cables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="bg-[#0f0f14] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs text-white/40 font-normal px-4 py-3">Name</th>
                    <th className="text-left text-xs text-white/40 font-normal px-4 py-3">Route</th>
                    <th className="text-left text-xs text-white/40 font-normal px-4 py-3">Length</th>
                    <th className="text-left text-xs text-white/40 font-normal px-4 py-3">Capacity</th>
                    <th className="text-left text-xs text-white/40 font-normal px-4 py-3">RFS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCables.map((cable) => (
                    <tr
                      key={cable.name}
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                      onClick={() => setSelectedCable(selectedCable?.name === cable.name ? null : cable)}
                    >
                      <td className="px-4 py-3">
                        <span className="text-cyan-400 font-medium">{cable.name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/60">{cable.route}</td>
                      <td className="px-4 py-3 text-sm text-white/80 font-mono">{cable.length}</td>
                      <td className="px-4 py-3 text-sm text-white/80 font-mono">{cable.capacity}</td>
                      <td className="px-4 py-3 text-sm text-white/60">{cable.rfs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected cable details */}
            {selectedCable && (
              <div className="border-t border-white/10 p-4 bg-white/5">
                <h3 className="text-cyan-400 font-medium mb-2">{selectedCable.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/40 mb-1">Owners</p>
                    <p className="text-white/80">{selectedCable.owners.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-white/40 mb-1">Landing Points</p>
                    <p className="text-white/80">
                      {Array.isArray(selectedCable.landing) && selectedCable.landing.length <= 6
                        ? selectedCable.landing.join(' → ')
                        : selectedCable.landing[0]}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Landing Stations */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Major Landing Stations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {LANDING_STATIONS.map((station) => (
              <div key={station.name} className="bg-[#0f0f14] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-sm text-white">{station.name}</span>
                </div>
                <p className="text-xs text-white/40">{station.country}</p>
                <p className="text-lg font-mono text-cyan-400 mt-1">{station.cables} cables</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            How Submarine Cables Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Construction</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Despite carrying the world&apos;s internet traffic, submarine cables are
                surprisingly thin — about the diameter of a garden hose. They contain
                pairs of optical fibres wrapped in protective layers of steel, copper,
                and polyethylene.
              </p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Installation</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Specialised cable ships lay cables from spools, guided by ocean floor
                surveys. In shallow waters, cables are buried for protection. In deep
                ocean, they simply rest on the seabed, sometimes at depths exceeding
                8,000 metres.
              </p>
            </div>
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Repair</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                When cables break (from anchors, earthquakes, or shark bites), repair
                ships use grapnels to bring up both ends from the ocean floor. The
                damaged section is cut out, new cable spliced in, and lowered back
                down. Repairs can take weeks.
              </p>
            </div>
          </div>
        </section>

        {/* Why Not Satellites? */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Why Not Satellites?
          </h2>
          <div className="bg-[#0f0f14] rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-medium mb-3">Submarine Cables</h3>
                <ul className="space-y-2 text-sm text-white/60">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Latency: ~100ms transatlantic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Bandwidth: 200+ Tbps per cable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Cost per bit: Very low</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Reliability: 99.999%</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-medium mb-3">Geostationary Satellites</h3>
                <ul className="space-y-2 text-sm text-white/60">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Latency: ~600ms round trip</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Bandwidth: 100s of Gbps total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Cost per bit: Much higher</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">~</span>
                    <span>Useful for remote areas</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-white/40 mt-4">
              Starlink and other LEO constellations improve latency but still can&apos;t match cable capacity.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/observe/infrastructure"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Back to Infrastructure
            </Link>
            <Link
              href="/observe/infrastructure/power"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Power Grids →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/30 mb-2">Data Sources</p>
            <p className="text-xs text-white/40">
              TeleGeography Submarine Cable Map • Wikipedia
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
