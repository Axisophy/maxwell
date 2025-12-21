'use client'

import { TrackedAnimal, categoryColors } from '@/lib/wildlife/types'

interface RecentlyActiveProps {
  animals: TrackedAnimal[]
  onSelectAnimal: (animal: TrackedAnimal) => void
}

export default function RecentlyActive({ animals, onSelectAnimal }: RecentlyActiveProps) {
  // Sort by most recent ping (using timestamp)
  const recent = [...animals]
    .filter(a => a.isRecentlyActive)
    .sort((a, b) => {
      const timeA = new Date(a.currentLocation.timestamp).getTime()
      const timeB = new Date(b.currentLocation.timestamp).getTime()
      return timeB - timeA
    })
    .slice(0, 5)

  return (
    <div className="bg-white rounded-xl p-5">
      <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
        Recently Active
      </h3>
      <div className="space-y-3">
        {recent.map((animal) => (
          <button
            key={animal.id}
            onClick={() => onSelectAnimal(animal)}
            className="w-full flex items-center gap-3 cursor-pointer hover:bg-[#f5f5f5] -mx-2 px-2 py-2 rounded-lg transition-colors text-left"
          >
            <div className="relative flex-shrink-0">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: categoryColors[animal.category] }}
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-medium text-black truncate">{animal.name}</p>
              <p className="text-sm text-black/50 truncate">
                {animal.speciesCommon}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm text-black/60">
                {animal.lastPingAge}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
