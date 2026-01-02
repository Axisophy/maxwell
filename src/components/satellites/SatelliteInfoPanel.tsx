'use client'

import { SatellitePosition } from '@/lib/satellites/types'

interface SatelliteInfoPanelProps {
  satellite: SatellitePosition
  onClose: () => void
}

// Vital sign component for satellites page
export function SatelliteVitalSign({
  label,
  value,
  unit,
}: {
  label: string
  value: string | number
  unit?: string
}) {
  return (
    <div className="p-2 md:p-4 bg-black rounded-lg">
      <div className="text-[10px] md:text-xs text-white/50 uppercase mb-1 md:mb-2">
        {label}
      </div>
      <div className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] tabular-nums text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && <span className="text-sm md:text-lg text-white/40 ml-1">{unit}</span>}
      </div>
    </div>
  )
}

export default function SatelliteInfoPanel({
  satellite,
  onClose,
}: SatelliteInfoPanelProps) {
  // Format coordinates
  const formatCoord = (value: number, positive: string, negative: string) => {
    const abs = Math.abs(value)
    const dir = value >= 0 ? positive : negative
    return `${abs.toFixed(4)}° ${dir}`
  }

  // Get orbit type based on altitude
  const getOrbitType = (altitude: number) => {
    if (altitude < 2000) return 'LEO'
    if (altitude < 35786) return 'MEO'
    if (altitude >= 35786 && altitude <= 35800) return 'GEO'
    return 'HEO'
  }

  const orbitType = getOrbitType(satellite.altitude)

  return (
    <div className="bg-black rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-medium text-white">{satellite.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-white/40">NORAD {satellite.noradId}</span>
            <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-white/60">
              {satellite.group.toUpperCase()}
            </span>
            <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-white/60">
              {orbitType}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white/40 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-[10px] text-white/40 uppercase mb-1">Altitude</div>
          <div className="text-lg font-mono text-white">
            {satellite.altitude.toFixed(1)} km
          </div>
        </div>
        <div>
          <div className="text-[10px] text-white/40 uppercase mb-1">Velocity</div>
          <div className="text-lg font-mono text-white">
            {satellite.velocity.toFixed(2)} km/s
          </div>
        </div>
        <div>
          <div className="text-[10px] text-white/40 uppercase mb-1">Latitude</div>
          <div className="text-lg font-mono text-white">
            {formatCoord(satellite.latitude, 'N', 'S')}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-white/40 uppercase mb-1">Longitude</div>
          <div className="text-lg font-mono text-white">
            {formatCoord(satellite.longitude, 'E', 'W')}
          </div>
        </div>
      </div>

      {/* Orbit info */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="text-[10px] text-white/40 uppercase mb-2">Orbit Information</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/40">Period: </span>
            <span className="text-white">
              {orbitType === 'LEO' ? '~90 min' : orbitType === 'MEO' ? '~12 hr' : '24 hr'}
            </span>
          </div>
          <div>
            <span className="text-white/40">Ground Speed: </span>
            <span className="text-white">
              {(satellite.velocity * 3600).toFixed(0)} km/h
            </span>
          </div>
        </div>
      </div>

      {/* Yellow orbit path indicator */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm text-white/50">
          <span className="w-3 h-3 rounded-full bg-[#ffdf20]" />
          <span>90-minute orbit path shown on globe</span>
        </div>
      </div>
    </div>
  )
}
