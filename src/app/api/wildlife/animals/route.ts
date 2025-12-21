import { NextResponse } from 'next/server'
import { demoAnimals, getCategoryCounts, getUniqueSpeciesCount, getUniqueStudyCount } from '@/lib/wildlife/demo-data'

export async function GET() {
  // For now, return demo data
  // TODO: Replace with Movebank API integration

  const animals = demoAnimals
  const counts = getCategoryCounts(animals)
  const uniqueSpecies = getUniqueSpeciesCount(animals)
  const uniqueStudies = getUniqueStudyCount(animals)
  const totalPings = animals.reduce((sum, a) => sum + a.journey.totalPings, 0)

  return NextResponse.json({
    animals,
    stats: {
      totalAnimals: animals.length,
      uniqueSpecies,
      uniqueStudies,
      totalPings,
      counts,
    },
    timestamp: new Date().toISOString(),
    source: 'demo', // Will be 'movebank' when real data is integrated
  })
}
