'use client'

import { ConstellationGroup, CONSTELLATION_INFO } from '@/lib/satellites/types'

interface SatelliteControlsProps {
  activeGroups: ConstellationGroup[]
  onToggleGroup: (group: ConstellationGroup) => void
  counts: Record<string, number>
  isMobile?: boolean
}

export default function SatelliteControls({
  activeGroups,
  onToggleGroup,
  counts,
  isMobile = false,
}: SatelliteControlsProps) {
  return (
    <div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
        Constellations
      </div>

      <div className="flex flex-wrap gap-px">
        {CONSTELLATION_INFO.map((constellation) => {
          const isActive = activeGroups.includes(constellation.id)
          const count = counts[constellation.id] || 0
          const isDisabled = isMobile && constellation.id === 'starlink'

          return (
            <button
              key={constellation.id}
              onClick={() => !isDisabled && onToggleGroup(constellation.id)}
              disabled={isDisabled}
              className={`
                px-3 py-2 text-xs font-medium rounded-lg transition-colors
                flex items-center gap-2
                ${isActive
                  ? 'bg-[#ffdf20] text-black'
                  : isDisabled
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                }
              `}
              title={isDisabled ? 'Too many satellites for mobile' : constellation.description}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: isActive ? 'currentColor' : constellation.color,
                  opacity: isDisabled ? 0.3 : 1,
                }}
              />
              <span>{constellation.name}</span>
              {count > 0 && (
                <span className={`text-[10px] ${isActive ? 'text-black/60' : 'text-white/40'}`}>
                  {count > 1000 ? `${(count / 1000).toFixed(1)}k` : count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {isMobile && (
        <p className="mt-3 text-[10px] text-white/30">
          Starlink disabled on mobile for performance
        </p>
      )}
    </div>
  )
}
