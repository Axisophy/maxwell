// ===========================================
// EARTH CLIMATE DATA CENTRE - TYPE DEFINITIONS
// ===========================================

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
  category: 'atmospheric' | 'temperature' | 'cryosphere' | 'oceans'
  unit: string
  unitShort: string
  description: string
  source: string
  sourceUrl: string
  baseline?: string // e.g., "1951-1980 average"
  startYear: number
  endYear: number
  resolution: 'daily' | 'weekly' | 'monthly' | 'annual'
  direction: 'up-bad' | 'down-bad' | 'neutral' // For color coding trends
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
  category: 'atmospheric' | 'temperature' | 'cryosphere' | 'oceans'
  unit: string
  unitShort: string
  description: string
  source: string
  sourceUrl: string
  baseline?: string
  direction: 'up-bad' | 'down-bad' | 'neutral'
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

export type ViewMode = 'overview' | 'deep-time' | 'human-factors' | 'personal'

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
