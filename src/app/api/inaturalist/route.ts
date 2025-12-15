import { NextResponse } from 'next/server'

// iNaturalist recent observations
export async function GET() {
  try {
    const mockData = {
      timestamp: new Date().toISOString(),
      observations: [
        {
          id: 123456789,
          species: 'European Robin',
          scientificName: 'Erithacus rubecula',
          observedOn: new Date().toISOString(),
          location: 'London, UK',
          imageUrl: '/images/placeholder-bird.jpg',
          user: 'naturalist42',
          quality: 'research'
        },
        {
          id: 123456790,
          species: 'Common Daisy',
          scientificName: 'Bellis perennis',
          observedOn: new Date().toISOString(),
          location: 'Paris, France',
          imageUrl: '/images/placeholder-flower.jpg',
          user: 'botanist_marie',
          quality: 'research'
        },
        {
          id: 123456791,
          species: 'Red Admiral',
          scientificName: 'Vanessa atalanta',
          observedOn: new Date().toISOString(),
          location: 'Berlin, Germany',
          imageUrl: '/images/placeholder-butterfly.jpg',
          user: 'insect_observer',
          quality: 'needs_id'
        }
      ],
      totalToday: 15234,
      totalSpecies: 8456,
      source: 'iNaturalist'
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('iNaturalist API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch iNaturalist data' },
      { status: 500 }
    )
  }
}
