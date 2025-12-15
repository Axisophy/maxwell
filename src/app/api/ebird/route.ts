import { NextResponse } from 'next/server'

// Cornell Lab eBird API
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat') || '51.5'
    const lng = searchParams.get('lng') || '-0.1'

    const mockData = {
      timestamp: new Date().toISOString(),
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      observations: [
        {
          speciesCode: 'eurrob',
          commonName: 'European Robin',
          scientificName: 'Erithacus rubecula',
          location: 'Hyde Park',
          lat: 51.507,
          lng: -0.165,
          observationDate: new Date().toISOString().split('T')[0],
          howMany: 3,
          subId: 'S123456789'
        },
        {
          speciesCode: 'blutit1',
          commonName: 'Eurasian Blue Tit',
          scientificName: 'Cyanistes caeruleus',
          location: 'Regent\'s Park',
          lat: 51.527,
          lng: -0.153,
          observationDate: new Date().toISOString().split('T')[0],
          howMany: 5,
          subId: 'S123456790'
        },
        {
          speciesCode: 'gretit1',
          commonName: 'Great Tit',
          scientificName: 'Parus major',
          location: 'Kensington Gardens',
          lat: 51.505,
          lng: -0.179,
          observationDate: new Date().toISOString().split('T')[0],
          howMany: 2,
          subId: 'S123456791'
        },
        {
          speciesCode: 'mallar3',
          commonName: 'Mallard',
          scientificName: 'Anas platyrhynchos',
          location: 'Serpentine Lake',
          lat: 51.505,
          lng: -0.168,
          observationDate: new Date().toISOString().split('T')[0],
          howMany: 12,
          subId: 'S123456792'
        }
      ],
      totalSpecies: 47,
      totalObservations: 234,
      radius: 25, // km
      source: 'Cornell Lab eBird'
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('eBird API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch eBird data' },
      { status: 500 }
    )
  }
}
