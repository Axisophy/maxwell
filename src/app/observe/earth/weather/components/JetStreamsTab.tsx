'use client'

import Image from 'next/image'

export default function JetStreamsTab() {
  return (
    <div className="space-y-6">
      {/* Jet Stream Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Polar Jet Stream
          </h3>
          <p className="text-2xl font-light text-blue-600">Active</p>
          <p className="text-xs text-black/50">Northern Hemisphere</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Subtropical Jet
          </h3>
          <p className="text-2xl font-light text-cyan-600">Moderate</p>
          <p className="text-xs text-black/50">Mid-latitudes</p>
        </div>
      </div>

      {/* Jet Stream Map */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          250mb Wind Speed (Jet Stream Level)
        </h3>
        <div className="relative aspect-[2/1] bg-neutral-100 rounded-lg overflow-hidden">
          <Image
            src="https://www.spc.noaa.gov/obswx/maps/250_thumb.gif"
            alt="250mb jet stream winds"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <p className="text-xs text-black/40 mt-2">Source: NOAA SPC</p>
      </div>

      {/* Jet Stream Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
            What is the Jet Stream?
          </h3>
          <p className="text-sm text-black/70 leading-relaxed">
            The jet stream is a fast-flowing river of air at high altitudes (around 10km).
            It flows from west to east and marks the boundary between cold polar air and
            warmer air to the south. Its position determines weather patterns across
            the mid-latitudes.
          </p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
            Current Pattern
          </h3>
          <p className="text-sm text-black/70 leading-relaxed">
            The polar jet is currently in a relatively zonal (west-to-east) pattern
            over the North Atlantic, bringing mild, unsettled weather to Western Europe.
            A ridge is developing over the eastern Pacific, which may lead to blocking
            patterns in the coming weeks.
          </p>
        </div>
      </div>

      {/* Jet Stream Properties */}
      <div className="bg-[#e5e5e5] rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Jet Stream Properties
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-lg font-mono text-black">150-300</p>
            <p className="text-xs text-black/50">km/h typical speed</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-lg font-mono text-black">10-16</p>
            <p className="text-xs text-black/50">km altitude</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-lg font-mono text-black">100-400</p>
            <p className="text-xs text-black/50">km width</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-lg font-mono text-black">W→E</p>
            <p className="text-xs text-black/50">flow direction</p>
          </div>
        </div>
      </div>
    </div>
  )
}
