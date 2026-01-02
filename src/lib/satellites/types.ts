// Satellite types and interfaces

export interface TLEData {
  name: string
  noradId: string
  line1: string
  line2: string
  group: string
}

export interface SatellitePosition {
  id: string
  name: string
  noradId: string
  latitude: number
  longitude: number
  altitude: number // km
  velocity: number // km/s
  group: string
  line1: string
  line2: string
}

export interface OrbitPoint {
  latitude: number
  longitude: number
  altitude: number
  time: Date
}

export type ConstellationGroup = 'stations' | 'gps' | 'weather' | 'science' | 'starlink' | 'active'

export interface ConstellationInfo {
  id: ConstellationGroup
  name: string
  description: string
  color: string
}

export const CONSTELLATION_INFO: ConstellationInfo[] = [
  {
    id: 'stations',
    name: 'Space Stations',
    description: 'ISS, Tiangong, and other crewed spacecraft',
    color: '#ff6b6b',
  },
  {
    id: 'gps',
    name: 'GPS',
    description: 'Global Positioning System satellites',
    color: '#4ecdc4',
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Meteorological and Earth observation',
    color: '#45b7d1',
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Scientific and research missions',
    color: '#f7dc6f',
  },
  {
    id: 'starlink',
    name: 'Starlink',
    description: 'SpaceX internet constellation',
    color: '#95a5a6',
  },
]
