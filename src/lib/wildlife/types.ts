export type AnimalCategory = 'shark' | 'whale' | 'turtle' | 'bird' | 'other'

export interface TrackedAnimal {
  id: string
  name: string
  species: string
  speciesCommon: string
  category: AnimalCategory
  studyId: string
  studyName: string

  // Current position
  currentLocation: {
    lat: number
    lng: number
    timestamp: string
  }

  // Journey stats
  journey: {
    totalDistanceKm: number
    trackingStartDate: string
    daysSinceFirstPing: number
    totalPings: number
  }

  // Recent track (last 30 days)
  recentTrack: Array<{
    lat: number
    lng: number
    timestamp: string
  }>

  // Optional metadata
  sex?: 'male' | 'female' | 'unknown'
  ageClass?: 'juvenile' | 'subadult' | 'adult'
  tagDate?: string
  weight?: number
  length?: number

  // Derived
  lastPingAge: string
  isRecentlyActive: boolean
}

export interface RightNowEvent {
  id: string
  type: 'migration' | 'gathering' | 'unusual' | 'milestone'
  title: string
  description: string
  animalIds: string[]
  location: {
    lat: number
    lng: number
    name: string
  }
  timestamp: string
  exploreWhy?: string
}

export const categoryColors: Record<AnimalCategory, string> = {
  shark: '#ef4444',
  whale: '#3b82f6',
  turtle: '#22c55e',
  bird: '#f59e0b',
  other: '#8b5cf6',
}

export const categoryLabels: Record<AnimalCategory, string> = {
  shark: 'Sharks',
  whale: 'Whales',
  turtle: 'Turtles',
  bird: 'Birds',
  other: 'Other',
}
