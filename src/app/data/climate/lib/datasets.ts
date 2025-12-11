// ===========================================
// DATASET DEFINITIONS & COLORS
// ===========================================
// Consistent color palette designed for overlaying multiple datasets
// Colors chosen for clarity, distinction, and aesthetic harmony

import { DatasetMetadata } from './types'

// ===========================================
// COLOR PALETTE
// ===========================================
// Designed for clarity when overlaid
// Each color distinct at multiple opacities

export const DATASET_COLORS = {
  // Atmospheric - Blues and Purples
  'co2': '#2563eb',           // Blue 600
  'co2-ice': '#1d4ed8',       // Blue 700 (slightly darker for distinction)
  'methane': '#7c3aed',       // Violet 600
  'n2o': '#a855f7',           // Purple 500
  
  // Temperature - Warm spectrum
  'temp-global': '#dc2626',   // Red 600
  'temp-arctic': '#ea580c',   // Orange 600
  'temp-ocean': '#db2777',    // Pink 600
  'temp-land': '#f59e0b',     // Amber 500
  
  // Cryosphere - Cool blues and cyans
  'arctic-ice': '#0891b2',    // Cyan 600
  'antarctic-ice': '#0284c7', // Sky 600
  'greenland-ice': '#06b6d4', // Cyan 500
  'glaciers': '#64748b',      // Slate 500
  
  // Oceans - Teals and greens
  'sea-level': '#0d9488',     // Teal 600
  'ocean-heat': '#e11d48',    // Rose 600
  'ocean-ph': '#16a34a',      // Green 600
} as const

// ===========================================
// CATEGORY DEFINITIONS
// ===========================================

export const CATEGORIES = {
  atmospheric: {
    name: 'Atmospheric',
    description: 'Greenhouse gas concentrations in the atmosphere',
    order: 1,
  },
  temperature: {
    name: 'Temperature',
    description: 'Global and regional temperature anomalies',
    order: 2,
  },
  cryosphere: {
    name: 'Cryosphere',
    description: 'Ice sheets, glaciers, and sea ice',
    order: 3,
  },
  oceans: {
    name: 'Oceans',
    description: 'Sea level, heat content, and chemistry',
    order: 4,
  },
} as const

// ===========================================
// DATASET METADATA
// ===========================================

export const DATASETS: Record<string, DatasetMetadata> = {
  // ─────────────────────────────────────────
  // ATMOSPHERIC
  // ─────────────────────────────────────────
  'co2': {
    id: 'co2',
    name: 'Carbon Dioxide (Mauna Loa)',
    shortName: 'CO₂',
    category: 'atmospheric',
    unit: 'parts per million',
    unitShort: 'ppm',
    description: 'Atmospheric CO₂ concentration measured at Mauna Loa Observatory, Hawaii. The longest continuous record of atmospheric CO₂.',
    source: 'NOAA Global Monitoring Laboratory',
    sourceUrl: 'https://gml.noaa.gov/ccgg/trends/',
    baseline: '280 ppm pre-industrial',
    direction: 'up-bad',
    color: DATASET_COLORS['co2'],
    currentValue: 423.0,
    changePerDecade: 24.5,
    startYear: 1958,
    endYear: 2024,
  },
  
  'co2-ice': {
    id: 'co2-ice',
    name: 'Carbon Dioxide (Ice Cores)',
    shortName: 'CO₂ (800k)',
    category: 'atmospheric',
    unit: 'parts per million',
    unitShort: 'ppm',
    description: 'Atmospheric CO₂ reconstructed from Antarctic ice cores. Shows natural variation over 800,000 years.',
    source: 'NOAA Paleoclimatology / EPICA',
    sourceUrl: 'https://www.ncei.noaa.gov/products/paleoclimatology/ice-core',
    baseline: '180-280 ppm natural range',
    direction: 'up-bad',
    color: DATASET_COLORS['co2-ice'],
    currentValue: 423.0,
    startYear: -800000,
    endYear: 2024,
  },
  
  'methane': {
    id: 'methane',
    name: 'Methane',
    shortName: 'CH₄',
    category: 'atmospheric',
    unit: 'parts per billion',
    unitShort: 'ppb',
    description: 'Atmospheric methane concentration. Methane is 80× more potent than CO₂ over 20 years.',
    source: 'NOAA Global Monitoring Laboratory',
    sourceUrl: 'https://gml.noaa.gov/ccgg/trends_ch4/',
    baseline: '700 ppb pre-industrial',
    direction: 'up-bad',
    color: DATASET_COLORS['methane'],
    currentValue: 1923,
    changePerDecade: 85,
    startYear: 1983,
    endYear: 2024,
  },
  
  'n2o': {
    id: 'n2o',
    name: 'Nitrous Oxide',
    shortName: 'N₂O',
    category: 'atmospheric',
    unit: 'parts per billion',
    unitShort: 'ppb',
    description: 'Atmospheric nitrous oxide. A potent greenhouse gas mainly from agriculture.',
    source: 'NOAA Global Monitoring Laboratory',
    sourceUrl: 'https://gml.noaa.gov/ccgg/trends_n2o/',
    baseline: '270 ppb pre-industrial',
    direction: 'up-bad',
    color: DATASET_COLORS['n2o'],
    currentValue: 336,
    changePerDecade: 10,
    startYear: 1978,
    endYear: 2024,
  },
  
  // ─────────────────────────────────────────
  // TEMPERATURE
  // ─────────────────────────────────────────
  'temp-global': {
    id: 'temp-global',
    name: 'Global Temperature Anomaly',
    shortName: 'Global',
    category: 'temperature',
    unit: 'degrees Celsius',
    unitShort: '°C',
    description: 'Global mean surface temperature anomaly relative to 1951-1980 baseline.',
    source: 'NASA GISS',
    sourceUrl: 'https://data.giss.nasa.gov/gistemp/',
    baseline: '1951-1980 average',
    direction: 'up-bad',
    color: DATASET_COLORS['temp-global'],
    currentValue: 1.29,
    changePerDecade: 0.2,
    startYear: 1880,
    endYear: 2024,
  },
  
  'temp-arctic': {
    id: 'temp-arctic',
    name: 'Arctic Temperature Anomaly',
    shortName: 'Arctic',
    category: 'temperature',
    unit: 'degrees Celsius',
    unitShort: '°C',
    description: 'Arctic (64-90°N) temperature anomaly. Warming 3-4× faster than global average.',
    source: 'NASA GISS',
    sourceUrl: 'https://data.giss.nasa.gov/gistemp/',
    baseline: '1951-1980 average',
    direction: 'up-bad',
    color: DATASET_COLORS['temp-arctic'],
    currentValue: 3.1,
    changePerDecade: 0.75,
    startYear: 1880,
    endYear: 2024,
  },
  
  'temp-ocean': {
    id: 'temp-ocean',
    name: 'Ocean Surface Temperature',
    shortName: 'Ocean',
    category: 'temperature',
    unit: 'degrees Celsius',
    unitShort: '°C',
    description: 'Global sea surface temperature anomaly.',
    source: 'NOAA ERSST',
    sourceUrl: 'https://www.ncei.noaa.gov/products/extended-reconstructed-sst',
    baseline: '1951-1980 average',
    direction: 'up-bad',
    color: DATASET_COLORS['temp-ocean'],
    currentValue: 0.9,
    changePerDecade: 0.12,
    startYear: 1880,
    endYear: 2024,
  },
  
  'temp-land': {
    id: 'temp-land',
    name: 'Land Temperature Anomaly',
    shortName: 'Land',
    category: 'temperature',
    unit: 'degrees Celsius',
    unitShort: '°C',
    description: 'Global land surface temperature anomaly. Land warms faster than ocean.',
    source: 'NASA GISS',
    sourceUrl: 'https://data.giss.nasa.gov/gistemp/',
    baseline: '1951-1980 average',
    direction: 'up-bad',
    color: DATASET_COLORS['temp-land'],
    currentValue: 1.6,
    changePerDecade: 0.28,
    startYear: 1880,
    endYear: 2024,
  },
  
  // ─────────────────────────────────────────
  // CRYOSPHERE
  // ─────────────────────────────────────────
  'arctic-ice': {
    id: 'arctic-ice',
    name: 'Arctic Sea Ice Extent',
    shortName: 'Arctic Ice',
    category: 'cryosphere',
    unit: 'million km²',
    unitShort: 'M km²',
    description: 'September minimum Arctic sea ice extent. Has declined ~13% per decade.',
    source: 'NSIDC',
    sourceUrl: 'https://nsidc.org/data/seaice_index',
    baseline: '1981-2010 average',
    direction: 'down-bad',
    color: DATASET_COLORS['arctic-ice'],
    currentValue: 4.23,
    changePerDecade: -0.82,
    startYear: 1979,
    endYear: 2024,
  },
  
  'greenland-ice': {
    id: 'greenland-ice',
    name: 'Greenland Ice Mass',
    shortName: 'Greenland',
    category: 'cryosphere',
    unit: 'gigatonnes',
    unitShort: 'Gt',
    description: 'Cumulative ice mass change from Greenland ice sheet. Losing ~280 Gt/year.',
    source: 'NASA GRACE/GRACE-FO',
    sourceUrl: 'https://grace.jpl.nasa.gov/',
    baseline: '2002',
    direction: 'down-bad',
    color: DATASET_COLORS['greenland-ice'],
    currentValue: -5000,
    changePerDecade: -2800,
    startYear: 2002,
    endYear: 2024,
  },
  
  'antarctic-ice': {
    id: 'antarctic-ice',
    name: 'Antarctic Ice Mass',
    shortName: 'Antarctic',
    category: 'cryosphere',
    unit: 'gigatonnes',
    unitShort: 'Gt',
    description: 'Cumulative ice mass change from Antarctic ice sheet. Losing ~150 Gt/year.',
    source: 'NASA GRACE/GRACE-FO',
    sourceUrl: 'https://grace.jpl.nasa.gov/',
    baseline: '2002',
    direction: 'down-bad',
    color: DATASET_COLORS['antarctic-ice'],
    currentValue: -3000,
    changePerDecade: -1500,
    startYear: 2002,
    endYear: 2024,
  },
  
  'glaciers': {
    id: 'glaciers',
    name: 'Glacier Mass Balance',
    shortName: 'Glaciers',
    category: 'cryosphere',
    unit: 'metres water equivalent',
    unitShort: 'm w.e.',
    description: 'Cumulative global glacier mass balance. Shows accelerating loss.',
    source: 'World Glacier Monitoring Service',
    sourceUrl: 'https://wgms.ch/',
    baseline: '1970',
    direction: 'down-bad',
    color: DATASET_COLORS['glaciers'],
    currentValue: -28,
    changePerDecade: -5.5,
    startYear: 1945,
    endYear: 2024,
  },
  
  // ─────────────────────────────────────────
  // OCEANS
  // ─────────────────────────────────────────
  'sea-level': {
    id: 'sea-level',
    name: 'Sea Level Rise',
    shortName: 'Sea Level',
    category: 'oceans',
    unit: 'millimetres',
    unitShort: 'mm',
    description: 'Global mean sea level change from satellite altimetry. Rising ~3.4 mm/year.',
    source: 'NASA Sea Level',
    sourceUrl: 'https://sealevel.nasa.gov/',
    baseline: '1993',
    direction: 'up-bad',
    color: DATASET_COLORS['sea-level'],
    currentValue: 101,
    changePerDecade: 34,
    startYear: 1993,
    endYear: 2024,
  },
  
  'ocean-heat': {
    id: 'ocean-heat',
    name: 'Ocean Heat Content',
    shortName: 'Ocean Heat',
    category: 'oceans',
    unit: 'zettajoules',
    unitShort: 'ZJ',
    description: 'Ocean heat content anomaly (0-2000m). Oceans absorb ~90% of excess heat.',
    source: 'NOAA NCEI',
    sourceUrl: 'https://www.ncei.noaa.gov/access/global-ocean-heat-content/',
    baseline: '1955-2006 average',
    direction: 'up-bad',
    color: DATASET_COLORS['ocean-heat'],
    currentValue: 345,
    changePerDecade: 95,
    startYear: 1955,
    endYear: 2024,
  },
  
  'ocean-ph': {
    id: 'ocean-ph',
    name: 'Ocean pH (Acidification)',
    shortName: 'Ocean pH',
    category: 'oceans',
    unit: 'pH units',
    unitShort: 'pH',
    description: 'Ocean surface pH. Decreased ~0.1 units since pre-industrial (30% more acidic).',
    source: 'NOAA PMEL',
    sourceUrl: 'https://www.pmel.noaa.gov/co2/story/Ocean+Acidification',
    baseline: '8.2 pre-industrial',
    direction: 'down-bad',
    color: DATASET_COLORS['ocean-ph'],
    currentValue: 8.1,
    changePerDecade: -0.02,
    startYear: 1988,
    endYear: 2024,
  },
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

export function getDatasetsByCategory(category: string): DatasetMetadata[] {
  return Object.values(DATASETS).filter(d => d.category === category)
}

export function getDatasetColor(id: string): string {
  return DATASETS[id]?.color || '#64748b'
}

export function formatValue(value: number, unitShort: string): string {
  if (unitShort === 'ppm' || unitShort === 'ppb') {
    return value.toFixed(1)
  }
  if (unitShort === '°C') {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}`
  }
  if (unitShort === 'M km²') {
    return value.toFixed(2)
  }
  if (unitShort === 'mm') {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(0)}`
  }
  if (unitShort === 'Gt') {
    return value.toLocaleString()
  }
  if (unitShort === 'ZJ') {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(0)}`
  }
  if (unitShort === 'pH') {
    return value.toFixed(2)
  }
  if (unitShort === 'm w.e.') {
    return value.toFixed(1)
  }
  return value.toString()
}

// Default datasets to show on initial load
export const DEFAULT_ACTIVE_DATASETS = ['temp-global', 'co2']
