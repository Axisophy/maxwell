'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { TrackedAnimal, AnimalCategory, RightNowEvent } from '@/lib/wildlife/types'
import {
  demoAnimals,
  demoEvents,
  getCategoryCounts,
  getUniqueSpeciesCount,
  getUniqueStudyCount,
} from '@/lib/wildlife/demo-data'
import FilterBar from '@/components/wildlife/FilterBar'
import AnimalDetailPanel from '@/components/wildlife/AnimalDetailPanel'
import RightNowCard from '@/components/wildlife/RightNowCard'
import FeaturedJourneys from '@/components/wildlife/FeaturedJourneys'
import RecentlyActive from '@/components/wildlife/RecentlyActive'
import ByTheNumbers from '@/components/wildlife/ByTheNumbers'
import DataSources from '@/components/wildlife/DataSources'

// Dynamic import for map to avoid SSR issues with Leaflet
const WildlifeMap = dynamic(
  () => import('@/components/wildlife/WildlifeMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#1a1a1e] rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading map...</p>
        </div>
      </div>
    ),
  }
)

export default function WildlifePage() {
  const [filter, setFilter] = useState<AnimalCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAnimal, setSelectedAnimal] = useState<TrackedAnimal | null>(null)

  // Filter and search animals
  const filteredAnimals = useMemo(() => {
    let animals = demoAnimals

    // Apply category filter
    if (filter !== 'all') {
      animals = animals.filter((a) => a.category === filter)
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      animals = animals.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.speciesCommon.toLowerCase().includes(query)
      )
    }

    return animals
  }, [filter, searchQuery])

  // Calculate stats
  const counts = getCategoryCounts(demoAnimals)
  const uniqueSpecies = getUniqueSpeciesCount(demoAnimals)
  const uniqueStudies = getUniqueStudyCount(demoAnimals)
  const totalPings = demoAnimals.reduce((sum, a) => sum + a.journey.totalPings, 0)

  // Handle Right Now card view on map
  const handleViewOnMap = (event: RightNowEvent) => {
    const animal = demoAnimals.find((a) => a.id === event.animalIds[0])
    if (animal) {
      setSelectedAnimal(animal)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Breadcrumb */}
        <p className="text-xs font-mono text-black/40 uppercase tracking-widest mb-2">
          MXWLL / Observe / Wildlife
        </p>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-2">
            Where Are They Now?
          </h1>
          <p className="text-base md:text-lg text-black/60">
            {demoAnimals.length} animals tracked right now
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            counts={counts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Map Section */}
        <section className="mb-8">
          <div className="relative h-[50vh] min-h-[400px] max-h-[600px] rounded-xl overflow-hidden">
            <WildlifeMap
              animals={filteredAnimals}
              selectedAnimal={selectedAnimal}
              onAnimalSelect={setSelectedAnimal}
              filter={filter}
            />

            {/* Right Now Card - hidden on mobile when detail panel is open */}
            <div className={selectedAnimal ? 'hidden md:block' : ''}>
              <RightNowCard events={demoEvents} onViewOnMap={handleViewOnMap} />
            </div>

            {/* Animal Detail Panel */}
            {selectedAnimal && (
              <AnimalDetailPanel
                animal={selectedAnimal}
                onClose={() => setSelectedAnimal(null)}
              />
            )}
          </div>
        </section>

        {/* Content Panels */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FeaturedJourneys
            animals={demoAnimals}
            onSelectAnimal={setSelectedAnimal}
          />
          <RecentlyActive
            animals={demoAnimals}
            onSelectAnimal={setSelectedAnimal}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ByTheNumbers
            totalAnimals={demoAnimals.length}
            uniqueSpecies={uniqueSpecies}
            totalStudies={uniqueStudies}
            totalPings={totalPings}
          />
          <DataSources />
        </section>
      </div>
    </main>
  )
}
