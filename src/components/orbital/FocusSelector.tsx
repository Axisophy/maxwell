'use client'

type FocusTarget = string | null

interface FocusSelectorProps {
  current: FocusTarget
  onChange: (target: FocusTarget) => void
}

const FOCUS_OPTIONS: { id: string; label: string; color: string }[] = [
  { id: 'sun', label: 'Sun', color: 'bg-yellow-500' },
  { id: 'mercury', label: 'Mercury', color: 'bg-gray-500' },
  { id: 'venus', label: 'Venus', color: 'bg-yellow-300' },
  { id: 'earth', label: 'Earth', color: 'bg-blue-500' },
  { id: 'moon', label: 'Moon', color: 'bg-gray-400' },
  { id: 'mars', label: 'Mars', color: 'bg-orange-600' },
  { id: 'jupiter', label: 'Jupiter', color: 'bg-orange-400' },
  { id: 'saturn', label: 'Saturn', color: 'bg-yellow-200' },
  { id: 'uranus', label: 'Uranus', color: 'bg-cyan-300' },
  { id: 'neptune', label: 'Neptune', color: 'bg-blue-400' },
]

export default function FocusSelector({ current, onChange }: FocusSelectorProps) {
  return (
    <div className="bg-black rounded-lg p-4">
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
        Focus Target
      </div>
      <div className="flex flex-wrap gap-2">
        {FOCUS_OPTIONS.map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => onChange(current === id ? null : id)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
              ${current === id
                ? 'bg-[#ffdf20] text-black'
                : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
              }
            `}
          >
            <span className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 text-xs text-white/40">
        Click a target to fly to it. Click again to deselect.
      </div>
    </div>
  )
}
