'use client'

type FocusTarget = 'sun' | 'earth' | 'moon' | null

interface FocusSelectorProps {
  current: FocusTarget
  onChange: (target: FocusTarget) => void
}

const FOCUS_OPTIONS: { id: FocusTarget; label: string; color: string }[] = [
  { id: 'sun', label: 'Sun', color: 'bg-yellow-500' },
  { id: 'earth', label: 'Earth', color: 'bg-blue-500' },
  { id: 'moon', label: 'Moon', color: 'bg-gray-400' },
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
