'use client'

import { TrackedAnimal, categoryColors } from '@/lib/wildlife/types'

interface FeaturedJourneysProps {
  animals: TrackedAnimal[]
  onSelectAnimal: (animal: TrackedAnimal) => void
}

export default function FeaturedJourneys({ animals, onSelectAnimal }: FeaturedJourneysProps) {
  // Sort by total distance to feature the most impressive journeys
  const featured = [...animals]
    .sort((a, b) => b.journey.totalDistanceKm - a.journey.totalDistanceKm)
    .slice(0, 5)

  return (
    <div className="bg-white rounded-xl p-5">
      <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
        Featured Journeys
      </h3>
      <div className="space-y-3">
        {featured.map((animal) => (
          <button
            key={animal.id}
            onClick={() => onSelectAnimal(animal)}
            className="w-full flex items-center gap-3 cursor-pointer hover:bg-[#f5f5f5] -mx-2 px-2 py-2 rounded-lg transition-colors text-left"
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: categoryColors[animal.category] }}
            />
            <div className="flex-grow min-w-0">
              <p className="font-medium text-black truncate">{animal.name}</p>
              <p className="text-sm text-black/50 truncate">
                {animal.speciesCommon}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-medium text-black">
                {animal.journey.totalDistanceKm.toLocaleString()} km
              </p>
              <p className="text-xs text-black/40">traveled</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
