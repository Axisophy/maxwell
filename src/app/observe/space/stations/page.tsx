'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { BreadcrumbFrame, breadcrumbItems } from '@/components/ui'
import { ObserveIcon } from '@/components/icons'
import {
  SPACE_STATIONS,
  TLEData,
  DEFAULT_TLES,
  propagateSimple,
  formatCoordinates,
  formatAltitude,
  formatVelocity,
  getRegion,
} from '@/lib/orbital/stations-data'

// Dynamic import for StationsScene
const StationsScene = dynamic(
  () => import('@/components/orbital/StationsScene'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4" />
          <div className="text-sm text-white/40">Loading orbital data...</div>
        </div>
      </div>
    ),
  }
)

export default function SpaceStationsPage() {
  const [time, setTime] = useState(new Date())
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [tleData, setTleData] = useState<Record<string, TLEData>>(DEFAULT_TLES)
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [isLive, setIsLive] = useState(true)

  // Update time every second when live
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [isLive])

  // Fetch fresh TLE data (in production, this would call CelesTrak API)
  useEffect(() => {
    // For now, use default TLEs
    // In production: fetch('/api/tle?stations=iss,tiangong')
    setTleData(DEFAULT_TLES)
  }, [])

  // Calculate current positions for all stations
  const stationData = useMemo(() => {
    return SPACE_STATIONS.map(station => {
      const tle = tleData[station.id]
      if (!tle) return { station, position: null }

      const position = propagateSimple(tle, time)
      return { station, position }
    })
  }, [tleData, time])

  // Get selected station data
  const selectedStationData = useMemo(() => {
    if (!selectedStation) return null
    return stationData.find(d => d.station.id === selectedStation)
  }, [selectedStation, stationData])

  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">
        {/* Breadcrumb */}
        <BreadcrumbFrame
          variant="dark"
          icon={<ObserveIcon className="w-4 h-4" />}
          items={breadcrumbItems(
            ['MXWLL', '/'],
            ['Observe', '/observe'],
            ['Space', '/observe/space'],
            ['Space Stations']
          )}
        />

        {/* Header */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-light text-white uppercase">
              Space Stations
            </h1>
            {isLive && (
              <span className="text-[10px] font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Live
              </span>
            )}
          </div>
          <p className="text-sm text-white/50 max-w-3xl">
            Real-time tracking of crewed space stations in low Earth orbit.
            Both stations orbit at approximately 400 km altitude, completing
            one orbit every 90 minutes.
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
              <StationsScene
                time={time}
                tleData={tleData}
                selectedStation={selectedStation}
                onSelectStation={setSelectedStation}
                showOrbits={showOrbits}
                showLabels={showLabels}
              />
            </Suspense>

            {/* Time display overlay */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur rounded-lg px-3 py-2">
              <div className="text-[10px] text-white/40 uppercase">UTC Time</div>
              <div className="font-mono text-white">
                {time.toISOString().split('T')[1].split('.')[0]}
              </div>
            </div>

            {/* Legend overlay */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur rounded-lg p-3 text-xs">
              <div className="flex items-center gap-4">
                {SPACE_STATIONS.map(station => (
                  <button
                    key={station.id}
                    onClick={() => setSelectedStation(
                      selectedStation === station.id ? null : station.id
                    )}
                    className={`flex items-center gap-2 transition-opacity ${
                      selectedStation && selectedStation !== station.id
                        ? 'opacity-50'
                        : 'opacity-100'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `#${station.color.toString(16).padStart(6, '0')}` }}
                    />
                    <span className="text-white/70 hover:text-white">
                      {station.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Station cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px mb-px">
          {stationData.map(({ station, position }) => (
            <button
              key={station.id}
              onClick={() => setSelectedStation(
                selectedStation === station.id ? null : station.id
              )}
              className={`bg-[#1d1d1d] rounded-lg p-4 text-left transition-all ${
                selectedStation === station.id
                  ? 'ring-1 ring-white/30'
                  : 'hover:bg-[#252525]'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: `#${station.color.toString(16).padStart(6, '0')}` }}
                />
                <h2 className="text-xl font-light text-white">{station.name}</h2>
                <span className="text-[10px] px-2 py-0.5 bg-white/10 text-white/50 rounded">
                  {station.country}
                </span>
              </div>

              {position ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black rounded-lg p-3">
                    <div className="text-[10px] text-white/40 uppercase mb-1">Position</div>
                    <div className="text-sm font-mono text-white">
                      {formatCoordinates(position.latitude, position.longitude)}
                    </div>
                  </div>
                  <div className="bg-black rounded-lg p-3">
                    <div className="text-[10px] text-white/40 uppercase mb-1">Altitude</div>
                    <div className="text-lg font-mono font-bold text-white">
                      {formatAltitude(position.altitude)}
                    </div>
                  </div>
                  <div className="bg-black rounded-lg p-3">
                    <div className="text-[10px] text-white/40 uppercase mb-1">Velocity</div>
                    <div className="text-sm font-mono text-white">
                      {formatVelocity(position.velocity)}
                    </div>
                  </div>
                  <div className="bg-black rounded-lg p-3">
                    <div className="text-[10px] text-white/40 uppercase mb-1">Over</div>
                    <div className="text-sm text-white">
                      {getRegion(position.latitude, position.longitude)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-white/40 text-sm">Loading orbital data...</div>
              )}

              {/* Station info */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">
                    Crew: {station.crew || 'Unknown'}
                  </span>
                  <span className="text-white/40">
                    Launched: {new Date(station.launchDate).getFullYear()}
                  </span>
                  <span className="text-white/40">
                    ~{station.orbitPeriodMinutes} min orbit
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected station details */}
        {selectedStationData?.position && (
          <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-4">
              {selectedStationData.station.name}
            </div>
            <p className="text-sm text-white/70 mb-4">
              {selectedStationData.station.description}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-black rounded-lg p-3 text-center">
                <div className="text-[10px] text-white/40 uppercase mb-1">Latitude</div>
                <div className="text-lg font-mono text-white">
                  {selectedStationData.position.latitude.toFixed(4)}°
                </div>
              </div>
              <div className="bg-black rounded-lg p-3 text-center">
                <div className="text-[10px] text-white/40 uppercase mb-1">Longitude</div>
                <div className="text-lg font-mono text-white">
                  {selectedStationData.position.longitude.toFixed(4)}°
                </div>
              </div>
              <div className="bg-black rounded-lg p-3 text-center">
                <div className="text-[10px] text-white/40 uppercase mb-1">Altitude</div>
                <div className="text-lg font-mono text-white">
                  {selectedStationData.position.altitude.toFixed(1)} km
                </div>
              </div>
              <div className="bg-black rounded-lg p-3 text-center">
                <div className="text-[10px] text-white/40 uppercase mb-1">Speed</div>
                <div className="text-lg font-mono text-white">
                  {(selectedStationData.position.velocity * 3600).toFixed(0)} km/h
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View options */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
            View Options
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOrbits}
                onChange={(e) => setShowOrbits(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#ffdf20] focus:ring-0"
              />
              <span className="text-sm text-white/70">Show orbits</span>
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isLive}
                onChange={(e) => setIsLive(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#ffdf20] focus:ring-0"
              />
              <span className="text-sm text-white/70">Live updates</span>
            </label>
          </div>
        </div>

        {/* Context */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-4">
            About low Earth orbit
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-white/70">
              Low Earth Orbit (LEO) extends from about 160 km to 2,000 km altitude.
              At these heights, spacecraft experience enough atmospheric drag that
              they require periodic reboosts to maintain their orbit. The ISS, for
              example, loses about 2 km of altitude per month and must be boosted
              several times per year.
            </p>
            <p className="text-white/70 mt-3">
              At ~400 km altitude, these stations travel at approximately 7.66 km/s
              (27,600 km/h) - fast enough to circle the Earth in about 90 minutes.
              Astronauts aboard experience about 16 sunrises and sunsets every day.
            </p>
          </div>
        </div>

        {/* Data sources */}
        <div className="mt-4 text-xs text-white/30 text-center">
          Orbital elements from CelesTrak/NORAD •
          Positions calculated using simplified SGP4 propagation •
          Updates every second when live
        </div>
      </div>
    </main>
  )
}
