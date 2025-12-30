'use client'

import { useState } from 'react'
import Image from 'next/image'

const SATELLITES = [
  {
    id: 'goes-16',
    name: 'GOES-16 (East)',
    operator: 'NOAA',
    region: 'Americas',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/FD/GEOCOLOR/678x678.jpg',
  },
  {
    id: 'goes-18',
    name: 'GOES-18 (West)',
    operator: 'NOAA',
    region: 'Pacific',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/FD/GEOCOLOR/678x678.jpg',
  },
  {
    id: 'himawari',
    name: 'Himawari-9',
    operator: 'JMA',
    region: 'Asia-Pacific',
    url: 'https://www.jma.go.jp/bosai/himawari/data/satimg/targetTimes_fd.json',
  },
  {
    id: 'meteosat',
    name: 'Meteosat-11',
    operator: 'EUMETSAT',
    region: 'Europe/Africa',
    url: 'https://eumetview.eumetsat.int/static-images/latestImages/EUMETSAT_MSG_RGBNatColour_LowResolution.jpg',
  },
]

export default function SatellitesTab() {
  const [selectedSatellite, setSelectedSatellite] = useState('goes-16')
  const satellite = SATELLITES.find(s => s.id === selectedSatellite) || SATELLITES[0]

  return (
    <div className="space-y-6">
      {/* Satellite Selector */}
      <div className="flex flex-wrap gap-2">
        {SATELLITES.map((sat) => (
          <button
            key={sat.id}
            onClick={() => setSelectedSatellite(sat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedSatellite === sat.id
                ? 'bg-black text-white'
                : 'bg-white text-black/70 hover:bg-black/5'
            }`}
          >
            {sat.name}
          </button>
        ))}
      </div>

      {/* Satellite Image */}
      <div className="bg-white rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-black">{satellite.name}</h3>
            <p className="text-sm text-black/50">{satellite.operator} • {satellite.region}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-black/40">LIVE</span>
          </div>
        </div>
        <div className="relative aspect-square max-w-2xl mx-auto bg-neutral-900 rounded-lg overflow-hidden">
          {satellite.id !== 'himawari' ? (
            <Image
              src={satellite.url}
              alt={`${satellite.name} satellite imagery`}
              fill
              className="object-contain"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50">
              <p className="text-sm">Himawari-9 imagery loading...</p>
            </div>
          )}
        </div>
      </div>

      {/* Satellite Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
            About Weather Satellites
          </h3>
          <p className="text-sm text-black/70 leading-relaxed">
            Geostationary weather satellites orbit at 35,786 km altitude, matching
            Earth&apos;s rotation to maintain a fixed view of their coverage area.
            They capture images every 10-15 minutes, enabling continuous weather monitoring.
          </p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
            GeoColor Imagery
          </h3>
          <p className="text-sm text-black/70 leading-relaxed">
            GeoColor combines multiple spectral bands to create natural-looking
            daytime images and infrared nighttime imagery. Clouds appear white,
            land and ocean show natural colors, and fires appear as bright spots.
          </p>
        </div>
      </div>
    </div>
  )
}
