'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { ObserveIcon } from '@/components/icons'
import { useSatelliteData, ConstellationGroup } from '@/components/satellites/useSatelliteData'
import SatelliteControls from '@/components/satellites/SatelliteControls'
import SatelliteInfoPanel, { SatelliteVitalSign } from '@/components/satellites/SatelliteInfoPanel'

// Dynamic import for Three.js (avoid SSR issues)
const SatelliteGlobe = dynamic(() => import('@/components/satellites/SatelliteGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[4/3] bg-black rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-3" />
        <div className="text-sm text-white/40">Loading globe...</div>
      </div>
    </div>
  ),
})

export default function SatelliteTrackerPage() {
  // Default to Weather satellites (moderate count, interesting)
  const [activeGroups, setActiveGroups] = useState<ConstellationGroup[]>(['weather', 'stations'])
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fetch satellite data
  const {
    satellites,
    totalCount,
    selectedSatellite,
    orbitPath,
    isLoading,
    error,
    selectSatellite,
    refresh,
  } = useSatelliteData({
    groups: activeGroups,
    updateInterval: 1000,
    enabled: true,
  })

  // Toggle constellation group
  const handleToggleGroup = useCallback((group: ConstellationGroup) => {
    setActiveGroups((prev) => {
      if (prev.includes(group)) {
        // Don't allow removing all groups
        if (prev.length === 1) return prev
        return prev.filter((g) => g !== group)
      } else {
        // Limit on mobile
        if (isMobile && group === 'starlink') {
          return prev // Don't add Starlink on mobile
        }
        return [...prev, group]
      }
    })
  }, [isMobile])

  // Calculate totals
  const totalActive = Object.values(totalCount).reduce((a, b) => a + b, 0)
  const displayedCount = satellites.length

  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">
        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="bg-[#1d1d1d] rounded-lg py-1 md:py-2 px-2 md:px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Observe', href: '/observe' },
                { label: 'Space', href: '/observe/space' },
                { label: 'Satellite Tracker' },
              ]}
              theme="dark"
            />
          </div>
        </div>

        {/* Content Frames */}
        <div className="flex flex-col gap-px">
          {/* Header Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="flex items-start gap-3 mb-3">
              <ObserveIcon />
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white uppercase">
                  Satellite Tracker
                </h1>
                <p className="text-sm text-white/50 mt-2 max-w-2xl">
                  Real-time positions of active satellites orbiting Earth. Data updated every second
                  using SGP4 orbital propagation from TLE data.
                </p>
              </div>
            </div>
          </section>

          {/* Vital Signs Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <SatelliteVitalSign
                label="Displayed"
                value={displayedCount}
              />
              <SatelliteVitalSign
                label="Space Stations"
                value={totalCount.stations || 0}
              />
              <SatelliteVitalSign
                label="GPS"
                value={totalCount.gps || 0}
              />
              <SatelliteVitalSign
                label="Weather"
                value={totalCount.weather || 0}
              />
            </div>
          </section>

          {/* Globe Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl font-light text-white uppercase mb-4">
              Live Globe
            </div>

            {error ? (
              <div className="w-full aspect-[4/3] bg-black rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-red-400 mb-2">Failed to load satellite data</div>
                  <button
                    onClick={refresh}
                    className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-[4/3] md:aspect-[16/9]">
                <SatelliteGlobe
                  satellites={satellites}
                  selectedSatellite={selectedSatellite}
                  orbitPath={orbitPath}
                  onSelectSatellite={selectSatellite}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Instructions */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/40">
              <span>🖱️ Drag to rotate</span>
              <span>🔍 Scroll to zoom</span>
              <span>👆 Click satellite for details</span>
            </div>
          </section>

          {/* Controls Frame */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <SatelliteControls
              activeGroups={activeGroups}
              onToggleGroup={handleToggleGroup}
              counts={totalCount}
              isMobile={isMobile}
            />
          </section>

          {/* Selected Satellite Frame */}
          {selectedSatellite && (
            <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
              <div className="text-2xl md:text-3xl font-light text-white uppercase mb-4">
                Selected Satellite
              </div>
              <SatelliteInfoPanel
                satellite={selectedSatellite}
                onClose={() => selectSatellite(null)}
              />
            </section>
          )}

          {/* Understanding Section */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl font-light text-white uppercase mb-4">
              Understanding Satellite Orbits
            </div>

            <div className="grid md:grid-cols-2 gap-px">
              <div className="bg-black rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-2">Low Earth Orbit (LEO)</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  160–2,000 km altitude. Most satellites including the ISS orbit here.
                  Complete one orbit every 90–120 minutes. Includes weather satellites,
                  imaging satellites, and the Starlink constellation.
                </p>
              </div>

              <div className="bg-black rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-2">Medium Earth Orbit (MEO)</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  2,000–35,786 km altitude. GPS satellites orbit at about 20,200 km,
                  completing two orbits per day. This altitude provides global coverage
                  with a smaller constellation.
                </p>
              </div>

              <div className="bg-black rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-2">Geostationary Orbit (GEO)</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Exactly 35,786 km altitude. Satellites here match Earth's rotation,
                  appearing stationary. Used for communications and weather monitoring.
                  Each satellite covers about one-third of Earth.
                </p>
              </div>

              <div className="bg-black rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-2">TLE Data</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Two-Line Element sets are the standard format for satellite orbital data.
                  Published by NORAD and updated regularly. We use SGP4 propagation to
                  calculate real-time positions from TLE parameters.
                </p>
              </div>
            </div>
          </section>

          {/* Color Legend */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
              Legend
            </div>
            <div className="flex flex-wrap gap-4">
              <LegendItem color="#ff6b6b" label="Space Stations" />
              <LegendItem color="#4ecdc4" label="GPS" />
              <LegendItem color="#45b7d1" label="Weather" />
              <LegendItem color="#f7dc6f" label="Science" />
              <LegendItem color="#95a5a6" label="Starlink" />
              <LegendItem color="#ffdf20" label="Selected" />
            </div>
          </section>

          {/* Data Sources & Related */}
          <section className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="text-sm text-white/40 uppercase tracking-wider mb-3">
              Related
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <Link
                href="/observe/space/solar-observatory"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Solar Observatory →
              </Link>
              <Link
                href="/observe/space/aurora"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Aurora Forecast →
              </Link>
              <Link
                href="/observe/space"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Space Portal →
              </Link>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">
                Data Sources
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/40">
                <div>
                  <div className="text-white/50 mb-1">TLE Data</div>
                  <div>CelesTrak</div>
                  <div>NORAD</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1">Propagation</div>
                  <div>SGP4/SDP4</div>
                  <div>satellite.js</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-[10px] text-white/20">
                Positions update every second • TLE data cached 1 hour • Globe textures: NASA Blue Marble
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs text-white/60">{label}</span>
    </div>
  )
}
