// =============================================================================
// VITAL SIGNS TYPES
// =============================================================================
// Shared type definitions

export interface EarthquakeData {
  count: number
  significant: { mag: number; place: string; time: number }[]
  daily: number[]
}

export interface CO2Data {
  current: number
  trend: number[]
  yearAgo: number
  change: number
}

export interface SolarData {
  status: string
  kp: number
  kpHistory: number[]
  solarWind: number | null
  sunspots: number | null
}

export interface ISSData {
  lat: number
  lng: number
  region: string
}

export interface LaunchData {
  name: string
  net: string
  rocket: string
}

export interface SeaIceData {
  extent: number
  anomaly: number
  date: string
}

export interface TemperatureData {
  anomaly: number
  year: number
  month: number
}

export interface SeaLevelData {
  rise: number
  rate: number
  date: string
}

export interface FiresData {
  count: number
  date: string
}

export interface NEOData {
  count: number
  closest: {
    name: string
    distance: number
    date: string
  } | null
}

export interface PopulationData {
  current: number
  birthsPerSecond: number
  deathsPerSecond: number
}

export interface MoonData {
  phase: string
  illumination: number
  icon: string
}

export interface DaylightData {
  hours: number
  minutes: number
  formatted: string
}

// Full API response type
export interface VitalSignsResponse {
  earthquakes: (EarthquakeData & { stale?: boolean }) | null
  co2: (CO2Data & { stale?: boolean }) | null
  solar: (SolarData & { stale?: boolean }) | null
  iss: (ISSData & { stale?: boolean }) | null
  launches: (LaunchData[] & { stale?: boolean }) | null
  seaIce: (SeaIceData & { stale?: boolean }) | null
  temperature: (TemperatureData & { stale?: boolean }) | null
  seaLevel: (SeaLevelData & { stale?: boolean }) | null
  fires: (FiresData & { stale?: boolean }) | null
  neo: (NEOData & { stale?: boolean }) | null
  moon: MoonData
  daylight: DaylightData
  population: PopulationData
  timestamp: string
  staleCount: number
  errorCount: number
}
