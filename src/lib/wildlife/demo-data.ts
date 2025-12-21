import { TrackedAnimal, RightNowEvent } from './types'

// Generate a realistic track with some randomness
function generateDemoTrack(
  startLat: number,
  startLng: number,
  days: number,
  direction: 'north' | 'south' | 'east' | 'west' | 'random' = 'random'
): Array<{ lat: number; lng: number; timestamp: string }> {
  const track: Array<{ lat: number; lng: number; timestamp: string }> = []
  let lat = startLat
  let lng = startLng
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString()

    // Add some movement based on direction
    const moveLat = (Math.random() - 0.5) * 0.5
    const moveLng = (Math.random() - 0.5) * 0.5

    switch (direction) {
      case 'north':
        lat += Math.abs(moveLat) * 0.3
        lng += moveLng * 0.2
        break
      case 'south':
        lat -= Math.abs(moveLat) * 0.3
        lng += moveLng * 0.2
        break
      case 'east':
        lat += moveLat * 0.2
        lng += Math.abs(moveLng) * 0.5
        break
      case 'west':
        lat += moveLat * 0.2
        lng -= Math.abs(moveLng) * 0.5
        break
      default:
        lat += moveLat
        lng += moveLng
    }

    track.push({ lat, lng, timestamp })
  }

  return track
}

function getLastPingAge(timestamp: string): string {
  const now = new Date()
  const ping = new Date(timestamp)
  const diffMs = now.getTime() - ping.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
}

// Demo animals
export const demoAnimals: TrackedAnimal[] = [
  // SHARKS
  {
    id: 'shark-luna',
    name: 'Luna',
    species: 'Carcharodon carcharias',
    speciesCommon: 'Great White Shark',
    category: 'shark',
    studyId: 'atlantic-sharks-01',
    studyName: 'Atlantic Great Whites',
    currentLocation: { lat: 41.5, lng: -70.2, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 12450,
      trackingStartDate: '2023-03-15',
      daysSinceFirstPing: 645,
      totalPings: 892,
    },
    recentTrack: generateDemoTrack(41.5, -70.2, 30, 'south'),
    sex: 'female',
    ageClass: 'adult',
    length: 4.2,
    weight: 1100,
    lastPingAge: '2 hours ago',
    isRecentlyActive: true,
  },
  {
    id: 'shark-thor',
    name: 'Thor',
    species: 'Galeocerdo cuvier',
    speciesCommon: 'Tiger Shark',
    category: 'shark',
    studyId: 'pacific-sharks-01',
    studyName: 'Pacific Apex Predators',
    currentLocation: { lat: 21.3, lng: -157.8, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 8920,
      trackingStartDate: '2023-08-22',
      daysSinceFirstPing: 486,
      totalPings: 654,
    },
    recentTrack: generateDemoTrack(21.3, -157.8, 30, 'west'),
    sex: 'male',
    ageClass: 'adult',
    length: 3.8,
    lastPingAge: '8 hours ago',
    isRecentlyActive: true,
  },
  {
    id: 'shark-mary-lee',
    name: 'Mary Lee',
    species: 'Carcharodon carcharias',
    speciesCommon: 'Great White Shark',
    category: 'shark',
    studyId: 'atlantic-sharks-01',
    studyName: 'Atlantic Great Whites',
    currentLocation: { lat: -33.9, lng: 18.4, timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 45230,
      trackingStartDate: '2020-09-17',
      daysSinceFirstPing: 1191,
      totalPings: 2456,
    },
    recentTrack: generateDemoTrack(-33.9, 18.4, 30, 'east'),
    sex: 'female',
    ageClass: 'adult',
    length: 4.8,
    weight: 1500,
    lastPingAge: '18 hours ago',
    isRecentlyActive: true,
  },

  // WHALES
  {
    id: 'whale-echo',
    name: 'Echo',
    species: 'Megaptera novaeangliae',
    speciesCommon: 'Humpback Whale',
    category: 'whale',
    studyId: 'humpback-migration-01',
    studyName: 'North Pacific Humpback Migration',
    currentLocation: { lat: 20.8, lng: -156.3, timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 18500,
      trackingStartDate: '2022-11-01',
      daysSinceFirstPing: 781,
      totalPings: 1245,
    },
    recentTrack: generateDemoTrack(20.8, -156.3, 30, 'north'),
    sex: 'female',
    ageClass: 'adult',
    length: 14.2,
    lastPingAge: '4 hours ago',
    isRecentlyActive: true,
  },
  {
    id: 'whale-titan',
    name: 'Titan',
    species: 'Balaenoptera musculus',
    speciesCommon: 'Blue Whale',
    category: 'whale',
    studyId: 'blue-whale-pacific',
    studyName: 'Eastern Pacific Blue Whales',
    currentLocation: { lat: 34.0, lng: -120.5, timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 22100,
      trackingStartDate: '2023-01-15',
      daysSinceFirstPing: 706,
      totalPings: 890,
    },
    recentTrack: generateDemoTrack(34.0, -120.5, 30, 'south'),
    sex: 'male',
    ageClass: 'adult',
    length: 26.5,
    lastPingAge: '12 hours ago',
    isRecentlyActive: true,
  },

  // TURTLES
  {
    id: 'turtle-coral',
    name: 'Coral',
    species: 'Chelonia mydas',
    speciesCommon: 'Green Sea Turtle',
    category: 'turtle',
    studyId: 'pacific-turtles-01',
    studyName: 'Pacific Green Turtle Migration',
    currentLocation: { lat: -14.3, lng: 145.8, timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 4560,
      trackingStartDate: '2024-02-10',
      daysSinceFirstPing: 315,
      totalPings: 421,
    },
    recentTrack: generateDemoTrack(-14.3, 145.8, 30, 'east'),
    sex: 'female',
    ageClass: 'adult',
    length: 1.1,
    weight: 180,
    lastPingAge: '6 hours ago',
    isRecentlyActive: true,
  },
  {
    id: 'turtle-navigator',
    name: 'Navigator',
    species: 'Caretta caretta',
    speciesCommon: 'Loggerhead Sea Turtle',
    category: 'turtle',
    studyId: 'atlantic-loggerheads',
    studyName: 'Atlantic Loggerhead Tracking',
    currentLocation: { lat: 27.5, lng: -80.0, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 3210,
      trackingStartDate: '2024-04-15',
      daysSinceFirstPing: 250,
      totalPings: 312,
    },
    recentTrack: generateDemoTrack(27.5, -80.0, 30, 'north'),
    sex: 'male',
    ageClass: 'subadult',
    lastPingAge: '3 hours ago',
    isRecentlyActive: true,
  },
  {
    id: 'turtle-pacific-voyager',
    name: 'Pacific Voyager',
    species: 'Dermochelys coriacea',
    speciesCommon: 'Leatherback Sea Turtle',
    category: 'turtle',
    studyId: 'leatherback-pacific',
    studyName: 'Pacific Leatherback Migration',
    currentLocation: { lat: 5.2, lng: -150.5, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 15800,
      trackingStartDate: '2023-06-01',
      daysSinceFirstPing: 569,
      totalPings: 678,
    },
    recentTrack: generateDemoTrack(5.2, -150.5, 30, 'west'),
    sex: 'female',
    ageClass: 'adult',
    length: 1.8,
    weight: 450,
    lastPingAge: '1 day ago',
    isRecentlyActive: true,
  },

  // BIRDS
  {
    id: 'bird-atlas',
    name: 'Atlas',
    species: 'Diomedea exulans',
    speciesCommon: 'Wandering Albatross',
    category: 'bird',
    studyId: 'southern-ocean-seabirds',
    studyName: 'Southern Ocean Albatross Tracking',
    currentLocation: { lat: -54.5, lng: -36.0, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 89000,
      trackingStartDate: '2022-01-15',
      daysSinceFirstPing: 1070,
      totalPings: 3456,
    },
    recentTrack: generateDemoTrack(-54.5, -36.0, 30, 'east'),
    sex: 'male',
    ageClass: 'adult',
    lastPingAge: '5 hours ago',
    isRecentlyActive: true,
  },
  {
    id: 'bird-liberty',
    name: 'Liberty',
    species: 'Haliaeetus leucocephalus',
    speciesCommon: 'Bald Eagle',
    category: 'bird',
    studyId: 'north-american-raptors',
    studyName: 'North American Eagle Migration',
    currentLocation: { lat: 47.6, lng: -122.3, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 2340,
      trackingStartDate: '2024-03-01',
      daysSinceFirstPing: 295,
      totalPings: 1567,
    },
    recentTrack: generateDemoTrack(47.6, -122.3, 30, 'south'),
    sex: 'female',
    ageClass: 'adult',
    lastPingAge: '1 hour ago',
    isRecentlyActive: true,
  },
  {
    id: 'bird-storm',
    name: 'Storm',
    species: 'Aquila chrysaetos',
    speciesCommon: 'Golden Eagle',
    category: 'bird',
    studyId: 'north-american-raptors',
    studyName: 'North American Eagle Migration',
    currentLocation: { lat: 44.4, lng: -110.5, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 5670,
      trackingStartDate: '2023-09-15',
      daysSinceFirstPing: 462,
      totalPings: 2134,
    },
    recentTrack: generateDemoTrack(44.4, -110.5, 30, 'random'),
    sex: 'male',
    ageClass: 'adult',
    lastPingAge: '2 hours ago',
    isRecentlyActive: true,
  },
  {
    id: 'bird-ciconia',
    name: 'Hans',
    species: 'Ciconia ciconia',
    speciesCommon: 'White Stork',
    category: 'bird',
    studyId: 'european-stork-migration',
    studyName: 'European White Stork Migration',
    currentLocation: { lat: 5.5, lng: 32.5, timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 12400,
      trackingStartDate: '2023-04-01',
      daysSinceFirstPing: 630,
      totalPings: 1890,
    },
    recentTrack: generateDemoTrack(5.5, 32.5, 30, 'south'),
    sex: 'male',
    ageClass: 'adult',
    lastPingAge: '10 hours ago',
    isRecentlyActive: true,
  },

  // OTHER
  {
    id: 'seal-arctic',
    name: 'Frost',
    species: 'Phoca vitulina',
    speciesCommon: 'Harbor Seal',
    category: 'other',
    studyId: 'arctic-pinnipeds',
    studyName: 'Arctic Seal Tracking',
    currentLocation: { lat: 64.1, lng: -21.9, timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 890,
      trackingStartDate: '2024-06-01',
      daysSinceFirstPing: 203,
      totalPings: 456,
    },
    recentTrack: generateDemoTrack(64.1, -21.9, 30, 'random'),
    sex: 'female',
    ageClass: 'adult',
    lastPingAge: '7 hours ago',
    isRecentlyActive: true,
  },
  {
    id: 'bear-arctic-king',
    name: 'Nanook',
    species: 'Ursus maritimus',
    speciesCommon: 'Polar Bear',
    category: 'other',
    studyId: 'arctic-apex-predators',
    studyName: 'Arctic Polar Bear Study',
    currentLocation: { lat: 78.2, lng: 15.6, timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
    journey: {
      totalDistanceKm: 3450,
      trackingStartDate: '2023-11-01',
      daysSinceFirstPing: 416,
      totalPings: 234,
    },
    recentTrack: generateDemoTrack(78.2, 15.6, 30, 'random'),
    sex: 'male',
    ageClass: 'adult',
    weight: 450,
    lastPingAge: '2 days ago',
    isRecentlyActive: true,
  },
]

// Demo Right Now events
export const demoEvents: RightNowEvent[] = [
  {
    id: 'event-1',
    type: 'migration',
    title: 'Luna hunting off Cape Cod',
    description: 'Great white shark Luna is patrolling the seal colonies near Chatham, Massachusetts. Peak hunting season.',
    animalIds: ['shark-luna'],
    location: { lat: 41.5, lng: -70.2, name: 'Cape Cod, MA' },
    timestamp: new Date().toISOString(),
    exploreWhy: 'Great whites follow gray seal populations to Cape Cod from August through November, coinciding with the seals\' breeding season.',
  },
  {
    id: 'event-2',
    type: 'migration',
    title: 'Humpback migration begins',
    description: 'Echo has arrived in Hawaiian waters after a 3,000-mile journey from Alaska. Breeding season starts now.',
    animalIds: ['whale-echo'],
    location: { lat: 20.8, lng: -156.3, name: 'Maui, Hawaii' },
    timestamp: new Date().toISOString(),
    exploreWhy: 'Humpback whales make one of the longest migrations of any mammal, traveling from cold Alaskan feeding grounds to warm Hawaiian breeding waters each winter.',
  },
  {
    id: 'event-3',
    type: 'milestone',
    title: 'Atlas circles Antarctica',
    description: 'Wandering albatross Atlas has now traveled 89,000 km since tagging - equivalent to flying around Earth twice.',
    animalIds: ['bird-atlas'],
    location: { lat: -54.5, lng: -36.0, name: 'South Georgia Island' },
    timestamp: new Date().toISOString(),
    exploreWhy: 'Wandering albatrosses have the largest wingspan of any bird (up to 3.5m) and can fly for hours without flapping, using dynamic soaring to harness wind energy.',
  },
  {
    id: 'event-4',
    type: 'gathering',
    title: 'Turtle nesting season',
    description: 'Green sea turtle Coral is approaching the Great Barrier Reef, likely preparing for nesting season.',
    animalIds: ['turtle-coral'],
    location: { lat: -14.3, lng: 145.8, name: 'Great Barrier Reef' },
    timestamp: new Date().toISOString(),
    exploreWhy: 'Female green turtles return to the same beach where they hatched to lay their own eggs, navigating thousands of miles using Earth\'s magnetic field.',
  },
]

// Helper to get category counts
export function getCategoryCounts(animals: TrackedAnimal[]): Record<string, number> {
  const counts: Record<string, number> = { all: animals.length }
  animals.forEach((animal) => {
    counts[animal.category] = (counts[animal.category] || 0) + 1
  })
  return counts
}

// Helper to get unique species count
export function getUniqueSpeciesCount(animals: TrackedAnimal[]): number {
  const species = new Set(animals.map((a) => a.species))
  return species.size
}

// Helper to get unique study count
export function getUniqueStudyCount(animals: TrackedAnimal[]): number {
  const studies = new Set(animals.map((a) => a.studyId))
  return studies.size
}
