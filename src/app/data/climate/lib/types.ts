// ===========================================
// EARTH CLIMATE DATA CENTRE - TYPE DEFINITIONS
// ===========================================

export type CategoryType = 
  | 'atmospheric' 
  | 'temperature' 
  | 'cryosphere' 
  | 'oceans'
  | 'biosphere'
  | 'biological'
  | 'forcings'
  | 'emissions'
  | 'uk-data'
  | 'energy-transition'
  | 'extreme-events'

export type DirectionType = 
  | 'up-bad'      // Increasing is concerning (CO2, temperature)
  | 'down-bad'    // Decreasing is concerning (ice, pH, coal use when positive!)
  | 'neutral'     // No inherent good/bad (ENSO, solar, rainfall)
  | 'down-early'  // Lower = earlier, which is concerning (cherry blossoms, wine harvest)
  | 'up-earlier'  // Higher = earlier arrival (bird migration)
  | 'up-mixed'    // Increasing is mixed (growing season - good for some, bad for others)
  | 'up-good'     // Increasing is good (renewable capacity, EV sales)
  | 'down-good'   // Decreasing is good (emissions intensity, cost of renewables)

export interface DataPoint {
  year: number
  month?: number // 1-12, optional for annual data
  value: number
  uncertainty?: number
}

export interface ClimateDataset {
  id: string
  name: string
  shortName: string
  category: CategoryType
  unit: string
  unitShort: string
  description: string
  source: string
  sourceUrl: string
  baseline?: string // e.g., "1951-1980 average"
  startYear: number
  endYear: number
  resolution: 'daily' | 'weekly' | 'monthly' | 'annual' | 'event-based' | '5-year average'
  direction: DirectionType
  thresholds?: {
    safe?: number
    warning?: number
    danger?: number
  }
  data: DataPoint[]
}

export interface DatasetMetadata {
  id: string
  name: string
  shortName: string
  category: CategoryType
  unit: string
  unitShort: string
  description: string
  source: string
  sourceUrl: string
  baseline?: string
  direction: DirectionType
  color: string
  currentValue?: number
  changePerDecade?: number
  startYear: number
  endYear: number
}

export interface ChartConfig {
  width: number
  height: number
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
  xDomain: [number, number]
  showGrid: boolean
  animate: boolean
}

export interface ActiveDataset {
  id: string
  color: string
  yAxisSide: 'left' | 'right'
  visible: boolean
}

export interface TooltipData {
  year: number
  x: number
  y: number
  datasets: {
    id: string
    name: string
    value: number
    unit: string
    color: string
  }[]
}

export type ViewMode = 'overview' | 'deep-time' | 'extreme-events' | 'human-factors' | 'personal'

export interface ClimateDataCentreState {
  currentView: ViewMode
  activeDatasets: ActiveDataset[]
  chartRange: {
    startYear: number
    endYear: number
  }
  expandedCategories: string[]
  hoveredYear: number | null
  isLoading: boolean
}
