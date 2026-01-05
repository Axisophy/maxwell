'use client'

import { useState, useMemo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import {
  COMETS,
  Comet,
  getCometPosition,
  formatCometDistance,
  formatVelocity,
  getPerihelionDistance,
} from '@/lib/orbital/comets-data'

// Dynamic import for CometsScene
const CometsScene = dynamic(
  () => import('@/components/orbital/CometsScene'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4" />
          <div className="text-sm text-white/40">Loading comet orbits...</div>
        </div>
      </div>
    ),
  }
)

// Comet type badge
function TypeBadge({ type }: { type: Comet['type'] }) {
  const colors = {
    'short-period': 'bg-green-400/20 text-green-400',
    'long-period': 'bg-blue-400/20 text-blue-400',
    'non-periodic': 'bg-purple-400/20 text-purple-400',
  }
  const labels = {
    'short-period': 'Short Period',
    'long-period': 'Long Period',
    'non-periodic': 'Non-Periodic',
  }

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded ${colors[type]}`}>
      {labels[type]}
    </span>
  )
}

export default function CometsPage() {
  const [time, setTime] = useState(() => new Date())
  const [selectedComet, setSelectedComet] = useState<string | null>(null)
  const [showOrbits, setShowOrbits] = useState(true)
  const [showPlanetOrbits, setShowPlanetOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [filterType, setFilterType] = useState<'all' | 'short-period' | 'long-period'>('all')

  // Filter comets by type
  const visibleComets = useMemo(() => {
    if (filterType === 'all') return COMETS.map(c => c.id)
    return COMETS.filter(c => c.type === filterType).map(c => c.id)
  }, [filterType])

  // Calculate current positions
  const cometData = useMemo(() => {
    return COMETS.map(comet => {
      try {
        const position = getCometPosition(comet, time)
        return { comet, position }
      } catch {
        return { comet, position: null }
      }
    }).filter(d => d.position !== null)
  }, [time])

  // Get selected comet data
  const selectedCometData = useMemo(() => {
    if (!selectedComet) return null
    return cometData.find(d => d.comet.id === selectedComet)
  }, [selectedComet, cometData])

  // Sort comets by distance
  const sortedComets = useMemo(() => {
    return [...cometData].sort((a, b) =>
      (a.position?.distance || Infinity) - (b.position?.distance || Infinity)
    )
  }, [cometData])

  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">
        {/* Breadcrumb */}
        <div className="mb-px">
          <div className="bg-[#1d1d1d] rounded-lg py-2 px-4">
            <nav className="flex items-center gap-2 text-sm text-white/50">
              <span className="hover:text-white cursor-pointer">MXWLL</span>
              <span>/</span>
              <span className="hover:text-white cursor-pointer">Observe</span>
              <span>/</span>
              <span className="hover:text-white cursor-pointer">Space</span>
              <span>/</span>
              <span className="text-white">Comets</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <h1 className="text-3xl md:text-4xl font-light text-white uppercase">
            Comets
          </h1>
          <p className="text-sm text-white/50 max-w-3xl mt-2">
            Track the orbits of notable comets through the solar system. Comets are icy
            bodies that develop distinctive tails when approaching the Sun, as solar
            radiation vaporises their surface material.
          </p>
        </div>

        {/* Main visualisation */}
        <div className="bg-[#1d1d1d] rounded-lg overflow-hidden mb-px">
          <div className="aspect-video md:aspect-[21/9] w-full relative">
            <Suspense fallback={
              <div className="w-full h-full bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            }>
              <CometsScene
                time={time}
                selectedComet={selectedComet}
                onSelectComet={setSelectedComet}
                showOrbits={showOrbits}
                showPlanetOrbits={showPlanetOrbits}
                showLabels={showLabels}
                visibleComets={visibleComets}
              />
            </Suspense>

            {/* Time display overlay */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur rounded-lg px-3 py-2">
              <div className="text-[10px] text-white/40 uppercase">Date</div>
              <div className="font-mono text-white">
                {time.toISOString().split('T')[0]}
              </div>
            </div>

            {/* Legend overlay */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur rounded-lg p-3">
              <div className="text-[10px] text-white/40 uppercase mb-2">
                {sortedComets.length} Comets Tracked
              </div>
              <div className="flex flex-wrap gap-2">
                {sortedComets.slice(0, 4).map(({ comet, position }) => (
                  <button
                    key={comet.id}
                    onClick={() => setSelectedComet(
                      selectedComet === comet.id ? null : comet.id
                    )}
                    className={`flex items-center gap-2 text-xs transition-opacity ${
                      selectedComet && selectedComet !== comet.id
                        ? 'opacity-50'
                        : 'opacity-100'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: `#${comet.color.toString(16).padStart(6, '0')}` }}
                    />
                    <span className="text-white/70 hover:text-white">
                      {comet.name.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comet selector */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="text-[10px] text-white/40 uppercase tracking-wider">
              Select Comet
            </div>
            <div className="flex gap-2">
              {(['all', 'short-period', 'long-period'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    filterType === type
                      ? 'bg-[#ffdf20] text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'short-period' ? 'Short Period' : 'Long Period'}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {COMETS.filter(c => filterType === 'all' || c.type === filterType).map(comet => {
              const data = cometData.find(d => d.comet.id === comet.id)
              return (
                <button
                  key={comet.id}
                  onClick={() => setSelectedComet(
                    selectedComet === comet.id ? null : comet.id
                  )}
                  className={`text-left p-3 rounded-lg transition-all ${
                    selectedComet === comet.id
                      ? 'bg-white/20 ring-1 ring-white/30'
                      : 'bg-black hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: `#${comet.color.toString(16).padStart(6, '0')}` }}
                    />
                    <span className="text-sm text-white font-medium truncate">
                      {comet.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/40">
                    {data?.position
                      ? formatCometDistance(data.position.distance)
                      : 'Calculating...'}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected comet details */}
        {selectedCometData && (
          <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: `#${selectedCometData.comet.color.toString(16).padStart(6, '0')}` }}
              />
              <h2 className="text-xl font-light text-white">
                {selectedCometData.comet.name}
              </h2>
              <span className="text-xs text-white/40">
                {selectedCometData.comet.designation}
              </span>
              <TypeBadge type={selectedCometData.comet.type} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-black rounded-lg p-3">
                <div className="text-[10px] text-white/40 uppercase mb-1">
                  Current Distance
                </div>
                <div className="text-lg font-mono text-white">
                  {selectedCometData.position
                    ? formatCometDistance(selectedCometData.position.distance)
                    : '—'}
                </div>
              </div>
              <div className="bg-black rounded-lg p-3">
                <div className="text-[10px] text-white/40 uppercase mb-1">
                  Velocity
                </div>
                <div className="text-lg font-mono text-white">
                  {selectedCometData.position
                    ? formatVelocity(selectedCometData.position.velocity)
                    : '—'}
                </div>
              </div>
              <div className="bg-black rounded-lg p-3">
                <div className="text-[10px] text-white/40 uppercase mb-1">
                  Perihelion
                </div>
                <div className="text-lg font-mono text-white">
                  {getPerihelionDistance(selectedCometData.comet).toFixed(2)} AU
                </div>
              </div>
              <div className="bg-black rounded-lg p-3">
                <div className="text-[10px] text-white/40 uppercase mb-1">
                  Orbital Period
                </div>
                <div className="text-lg font-mono text-white">
                  {selectedCometData.comet.period
                    ? selectedCometData.comet.period < 200
                      ? `${selectedCometData.comet.period.toFixed(1)} years`
                      : `~${Math.round(selectedCometData.comet.period).toLocaleString()} years`
                    : 'Non-periodic'}
                </div>
              </div>
            </div>

            <p className="text-sm text-white/70 mb-4">
              {selectedCometData.comet.description}
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-white/40">
              <span>Discovered: {selectedCometData.comet.discovered}</span>
              <span>Last perihelion: {selectedCometData.comet.lastPerihelion}</span>
              {selectedCometData.comet.nextPerihelion && (
                <span>Next perihelion: {selectedCometData.comet.nextPerihelion}</span>
              )}
            </div>
          </div>
        )}

        {/* View options */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOrbits}
                onChange={(e) => setShowOrbits(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#ffdf20] focus:ring-0"
              />
              <span className="text-sm text-white/70">Show comet orbits</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPlanetOrbits}
                onChange={(e) => setShowPlanetOrbits(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#ffdf20] focus:ring-0"
              />
              <span className="text-sm text-white/70">Show planet orbits</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#ffdf20] focus:ring-0"
              />
              <span className="text-sm text-white/70">Show labels</span>
            </label>
          </div>
        </div>

        {/* Time control */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
            Time Travel
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTime(new Date())}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm text-white transition-colors"
            >
              Now
            </button>
            <button
              onClick={() => setTime(new Date('1986-02-09'))}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm text-white transition-colors"
            >
              Halley 1986
            </button>
            <button
              onClick={() => setTime(new Date('1997-04-01'))}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm text-white transition-colors"
            >
              Hale-Bopp 1997
            </button>
            <button
              onClick={() => setTime(new Date('2020-07-03'))}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm text-white transition-colors"
            >
              NEOWISE 2020
            </button>
            <button
              onClick={() => setTime(new Date('2061-07-28'))}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm text-white transition-colors"
            >
              Halley 2061
            </button>
          </div>
        </div>

        {/* Context */}
        <div className="bg-[#1d1d1d] rounded-lg p-4">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-4">
            About Comets
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-white/70">
              Comets are icy bodies that originate from the outer solar system - the Kuiper
              Belt beyond Neptune and the distant Oort Cloud. When a comet approaches the
              Sun, solar radiation heats its surface, releasing gas and dust that form the
              distinctive coma (atmosphere) and tail.
            </p>
            <p className="text-white/70 mt-3">
              <strong className="text-white">Short-period comets</strong> (orbital periods
              under 200 years) typically come from the Kuiper Belt. <strong className="text-white">
              Long-period comets</strong> originate from the Oort Cloud and may take thousands
              or millions of years to complete one orbit.
            </p>
          </div>
        </div>

        {/* Data sources */}
        <div className="mt-4 text-xs text-white/30 text-center">
          Orbital elements from JPL Small-Body Database •
          Positions calculated using Keplerian propagation •
          Tail direction always points away from Sun
        </div>
      </div>
    </main>
  )
}
