// ===========================================
// DATASET DEFINITIONS & COLORS
// ===========================================
// Consistent color palette designed for overlaying multiple datasets
// Colors chosen for clarity, distinction, and aesthetic harmony

import type { DatasetMetadata, CategoryType, DirectionType } from './types'
export type { DatasetMetadata, CategoryType, DirectionType } from './types'

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
  
  // Biosphere - Greens and earthy tones
  'forest-cover': '#15803d',  // Green 700
  'coral-bleaching': '#f97316', // Orange 500
  'wildfire-area': '#b91c1c', // Red 700
  'permafrost': '#78716c',    // Stone 500
  
  // Biological Indicators - Warm natural tones
  'cherry-blossoms': '#ec4899', // Pink 500
  'wine-harvest': '#7c2d12',    // Orange 950
  'growing-season': '#65a30d',  // Lime 600
  'bird-migration': '#0ea5e9',  // Sky 500
  
  // Natural Forcings - Earthy spectrum
  'enso': '#eab308',          // Yellow 500
  'solar-irradiance': '#fbbf24', // Amber 400
  'volcanic-aerosols': '#6b7280', // Gray 500
  
  // Emissions - Industrial tones
  'emissions-global': '#374151', // Gray 700
  'emissions-capita': '#4b5563', // Gray 600
  
  // UK Data - British blues and greens
  'temp-cet': '#1e3a8a',        // Blue 900
  'uk-rainfall': '#0f766e',     // Teal 700
  'uk-coal-share': '#171717',   // Neutral 900 (coal!)
  'uk-renewable-share': '#22c55e', // Green 500
  
  // Energy Transition - Optimistic greens and yellows
  'renewable-capacity': '#059669', // Emerald 600
  'solar-capacity': '#facc15',     // Yellow 400
  'wind-capacity': '#38bdf8',      // Sky 400
  'ev-sales': '#a3e635',           // Lime 400
  
  // Extreme Events - Warning colors
  'heat-records': '#b91c1c',       // Red 700
  'fossil-subsidies': '#78716c',   // Stone 500
} as const

// ===========================================
// CATEGORY DEFINITIONS
// ===========================================

export const CATEGORIES = {
  temperature: {
    name: 'Temperature',
    description: 'Global and regional temperature anomalies',
    order: 1,
  },
  atmospheric: {
    name: 'Atmospheric',
    description: 'Greenhouse gas concentrations in the atmosphere',
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
  biosphere: {
    name: 'Biosphere',
    description: 'Forests, coral reefs, wildfires, and permafrost',
    order: 5,
  },
  biological: {
    name: 'Biological Indicators',
    description: 'Nature\'s calendar — how plants and animals respond to warming',
    order: 6,
  },
  forcings: {
    name: 'Natural Influences',
    description: 'Natural factors that influence climate year-to-year — but don\'t explain the long-term trend',
        order: 7,
  },
  emissions: {
    name: 'Emissions',
    description: 'Human carbon dioxide emissions',
    order: 8,
  },
  'uk-data': {
    name: 'UK Records',
    description: 'Long-running UK climate records — the birthplace of climate science',
    order: 9,
  },
  'energy-transition': {
    name: 'Energy Transition',
    description: 'The shift from fossil fuels to clean energy',
    order: 10,
  },
  'extreme-events': {
    name: 'Extreme Events',
    description: 'Heat records, extreme weather, and climate impacts',
    order: 11,
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
  
  // ─────────────────────────────────────────
  // BIOSPHERE
  // ─────────────────────────────────────────
  'forest-cover': {
    id: 'forest-cover',
    name: 'Global Tree Cover Loss',
    shortName: 'Tree Loss',
    category: 'biosphere',
    unit: 'million hectares per year',
    unitShort: 'Mha/yr',
    description: 'Annual global tree cover loss. Includes deforestation and natural disturbance.',
    source: 'Global Forest Watch',
    sourceUrl: 'https://www.globalforestwatch.org/',
    baseline: '2001',
    direction: 'up-bad',
    color: DATASET_COLORS['forest-cover'],
    currentValue: 28.3,
    changePerDecade: 5.2,
    startYear: 2001,
    endYear: 2023,
  },
  
  'coral-bleaching': {
    id: 'coral-bleaching',
    name: 'Coral Bleaching Events',
    shortName: 'Coral Stress',
    category: 'biosphere',
    unit: 'global stress events',
    unitShort: 'events',
    description: 'Global coral bleaching events. Occur when ocean temperatures exceed coral tolerance.',
    source: 'NOAA Coral Reef Watch',
    sourceUrl: 'https://coralreefwatch.noaa.gov/',
    baseline: '1985',
    direction: 'up-bad',
    color: DATASET_COLORS['coral-bleaching'],
    currentValue: 4,
    startYear: 1985,
    endYear: 2024,
  },
  
  'wildfire-area': {
    id: 'wildfire-area',
    name: 'Global Wildfire Area',
    shortName: 'Wildfires',
    category: 'biosphere',
    unit: 'million hectares',
    unitShort: 'Mha',
    description: 'Annual global area burned by wildfires. Trend varies by region.',
    source: 'GFED (Global Fire Emissions Database)',
    sourceUrl: 'https://globalfiredata.org/',
    baseline: '1997',
    direction: 'up-bad',
    color: DATASET_COLORS['wildfire-area'],
    currentValue: 500,
    startYear: 1997,
    endYear: 2023,
  },
  
  'permafrost': {
    id: 'permafrost',
    name: 'Permafrost Temperature',
    shortName: 'Permafrost',
    category: 'biosphere',
    unit: 'degrees Celsius',
    unitShort: '°C',
    description: 'Ground temperature at depth of zero annual amplitude. Warming threatens to release stored carbon.',
    source: 'GTN-P (Global Terrestrial Network for Permafrost)',
    sourceUrl: 'https://gtnp.arcticportal.org/',
    baseline: '1980s',
    direction: 'up-bad',
    color: DATASET_COLORS['permafrost'],
    currentValue: -2.5,
    changePerDecade: 0.4,
    startYear: 1980,
    endYear: 2023,
  },
  
  // ─────────────────────────────────────────
  // BIOLOGICAL INDICATORS
  // ─────────────────────────────────────────
  'cherry-blossoms': {
    id: 'cherry-blossoms',
    name: 'Kyoto Cherry Blossom Date',
    shortName: 'Cherry Blossoms',
    category: 'biological',
    unit: 'day of year',
    unitShort: 'day',
    description: 'First bloom date of cherry blossoms in Kyoto, Japan. 1,200+ years of records — the longest phenological record in the world.',
    source: 'Osaka Prefecture University / Historical Records',
    sourceUrl: 'http://atmenv.envi.osakafu-u.ac.jp/aono/kyophenotemp4/',
    baseline: 'April 17 (historical average)',
    direction: 'down-early',
    color: DATASET_COLORS['cherry-blossoms'],
    currentValue: 95,
    changePerDecade: -1.2,
    startYear: 812,
    endYear: 2024,
  },
  
  'wine-harvest': {
    id: 'wine-harvest',
    name: 'Burgundy Wine Harvest Date',
    shortName: 'Wine Harvest',
    category: 'biological',
    unit: 'days from September 1',
    unitShort: 'days',
    description: 'Wine harvest date in Burgundy, France. Earlier harvests indicate warmer growing seasons. 660+ years of records.',
    source: 'Historical Records / University Research',
    sourceUrl: 'https://www.clim-past.net/15/1485/2019/',
    baseline: 'September 28 (historical average)',
    direction: 'down-early',
    color: DATASET_COLORS['wine-harvest'],
    currentValue: 12,
    changePerDecade: -2.5,
    startYear: 1354,
    endYear: 2023,
  },
  
  'growing-season': {
    id: 'growing-season',
    name: 'Northern Hemisphere Growing Season',
    shortName: 'Growing Season',
    category: 'biological',
    unit: 'days',
    unitShort: 'days',
    description: 'Length of the growing season in the Northern Hemisphere. Extended by ~2 weeks since 1900.',
    source: 'NASA / NOAA',
    sourceUrl: 'https://www.ncei.noaa.gov/monitoring-content/sotc/synoptic/2024/03/ghcn-seasonal-phen.pdf',
    baseline: '1900 average',
    direction: 'up-mixed',
    color: DATASET_COLORS['growing-season'],
    currentValue: 15,
    changePerDecade: 2.5,
    startYear: 1900,
    endYear: 2023,
  },
  
  'bird-migration': {
    id: 'bird-migration',
    name: 'Bird Spring Arrival',
    shortName: 'Bird Arrival',
    category: 'biological',
    unit: 'days earlier',
    unitShort: 'days',
    description: 'Average shift in spring arrival of migratory birds. Birds are arriving earlier as temperatures rise.',
    source: 'eBird / Various Studies',
    sourceUrl: 'https://ebird.org/',
    baseline: '1960s average',
    direction: 'up-earlier',
    color: DATASET_COLORS['bird-migration'],
    currentValue: 8,
    changePerDecade: 1.5,
    startYear: 1960,
    endYear: 2023,
  },
  
  // ─────────────────────────────────────────
  // NATURAL FORCINGS
  // ─────────────────────────────────────────
  'enso': {
    id: 'enso',
    name: 'ENSO Index (ONI)',
    shortName: 'ENSO',
    category: 'forcings',
    unit: 'index',
    unitShort: 'ONI',
    description: 'Oceanic Niño Index — 3-month sea surface temperature anomaly in Niño 3.4 region. El Niño (>0.5) warms climate, La Niña (<-0.5) cools it.',
    source: 'NOAA Climate Prediction Center',
    sourceUrl: 'https://origin.cpc.ncep.noaa.gov/products/analysis_monitoring/ensostuff/ONI_v5.php',
    baseline: '1991-2020 average',
    direction: 'neutral',
    color: DATASET_COLORS['enso'],
    currentValue: 0.8,
    startYear: 1950,
    endYear: 2024,
  },
  
  'solar-irradiance': {
    id: 'solar-irradiance',
    name: 'Solar Irradiance (TSI)',
    shortName: 'Solar',
    category: 'forcings',
    unit: 'watts per square metre',
    unitShort: 'W/m²',
    description: 'Total Solar Irradiance — energy output of the Sun. Varies by ~0.1% over 11-year solar cycle. Cannot explain warming trend.',
    source: 'SORCE/TSIS / NASA',
    sourceUrl: 'https://lasp.colorado.edu/home/sorce/data/',
    baseline: '1361 W/m² average',
    direction: 'neutral',
    color: DATASET_COLORS['solar-irradiance'],
    currentValue: 1361.2,
    startYear: 1978,
    endYear: 2024,
  },
  
  'volcanic-aerosols': {
    id: 'volcanic-aerosols',
    name: 'Volcanic Aerosol Optical Depth',
    shortName: 'Volcanic',
    category: 'forcings',
    unit: 'optical depth',
    unitShort: 'AOD',
    description: 'Stratospheric aerosols from volcanic eruptions. Major eruptions (Pinatubo 1991, El Chichón 1982) cause temporary cooling.',
    source: 'NASA GISS',
    sourceUrl: 'https://data.giss.nasa.gov/modelforce/strataer/',
    baseline: '0 (no volcanic activity)',
    direction: 'neutral',
    color: DATASET_COLORS['volcanic-aerosols'],
    currentValue: 0.002,
    startYear: 1850,
    endYear: 2024,
  },
  
  // ─────────────────────────────────────────
  // EMISSIONS
  // ─────────────────────────────────────────
  'emissions-global': {
    id: 'emissions-global',
    name: 'Global CO₂ Emissions',
    shortName: 'Emissions',
    category: 'emissions',
    unit: 'billion tonnes CO₂',
    unitShort: 'Gt CO₂',
    description: 'Annual global CO₂ emissions from fossil fuels and industry. Does not include land use change.',
    source: 'Global Carbon Project',
    sourceUrl: 'https://globalcarbonproject.org/carbonbudget/',
    baseline: '1751',
    direction: 'up-bad',
    color: DATASET_COLORS['emissions-global'],
    currentValue: 37.4,
    changePerDecade: 4.2,
    startYear: 1751,
    endYear: 2023,
  },
  
  'emissions-capita': {
    id: 'emissions-capita',
    name: 'Global Per Capita Emissions',
    shortName: 'Per Capita',
    category: 'emissions',
    unit: 'tonnes CO₂ per person',
    unitShort: 't/person',
    description: 'Average CO₂ emissions per person globally. Varies enormously by country.',
    source: 'Global Carbon Project / Our World in Data',
    sourceUrl: 'https://ourworldindata.org/co2-emissions',
    baseline: '1751',
    direction: 'up-bad',
    color: DATASET_COLORS['emissions-capita'],
    currentValue: 4.7,
    changePerDecade: 0.2,
    startYear: 1751,
    endYear: 2023,
  },
  
  // ─────────────────────────────────────────
  // UK DATA
  // ─────────────────────────────────────────
  'temp-cet': {
    id: 'temp-cet',
    name: 'Central England Temperature',
    shortName: 'CET',
    category: 'uk-data',
    unit: 'degrees Celsius',
    unitShort: '°C',
    description: 'The longest continuous instrumental temperature record in the world, maintained since 1659. Covers a triangular region from Lancashire to London to Bristol.',
    source: 'UK Met Office Hadley Centre',
    sourceUrl: 'https://www.metoffice.gov.uk/hadobs/hadcet/',
    baseline: '9.0°C (1659-1900 average)',
    direction: 'up-bad',
    color: DATASET_COLORS['temp-cet'],
    currentValue: 10.9,
    changePerDecade: 0.18,
    startYear: 1659,
    endYear: 2024,
  },
  
  'uk-rainfall': {
    id: 'uk-rainfall',
    name: 'England & Wales Rainfall',
    shortName: 'UK Rain',
    category: 'uk-data',
    unit: 'millimetres',
    unitShort: 'mm',
    description: 'England and Wales precipitation record since 1766. One of the longest continuous rainfall records in the world.',
    source: 'UK Met Office Hadley Centre',
    sourceUrl: 'https://www.metoffice.gov.uk/hadobs/hadukp/',
    baseline: '~900 mm annual average',
    direction: 'neutral',
    color: DATASET_COLORS['uk-rainfall'],
    currentValue: 1089,
    startYear: 1766,
    endYear: 2024,
  },
  
  'uk-coal-share': {
    id: 'uk-coal-share',
    name: 'UK Coal Electricity Share',
    shortName: 'UK Coal',
    category: 'uk-data',
    unit: 'percent',
    unitShort: '%',
    description: 'Percentage of UK electricity from coal. One of the fastest coal phase-outs of any major economy. The last coal power station closed September 2024.',
    source: 'UK DESNZ',
    sourceUrl: 'https://www.gov.uk/government/statistics/electricity-section-5-energy-trends',
    baseline: '65% in 1990',
    direction: 'down-bad',
    color: DATASET_COLORS['uk-coal-share'],
    currentValue: 0,
    changePerDecade: -20,
    startYear: 1990,
    endYear: 2024,
  },
  
  'uk-renewable-share': {
    id: 'uk-renewable-share',
    name: 'UK Renewable Electricity Share',
    shortName: 'UK Renewables',
    category: 'uk-data',
    unit: 'percent',
    unitShort: '%',
    description: 'Percentage of UK electricity from renewables (wind, solar, hydro, biomass). The UK has transformed its electricity system in two decades.',
    source: 'UK DESNZ',
    sourceUrl: 'https://www.gov.uk/government/statistics/electricity-section-5-energy-trends',
    baseline: '2% in 1990',
    direction: 'up-good',
    color: DATASET_COLORS['uk-renewable-share'],
    currentValue: 50,
    changePerDecade: 15,
    startYear: 1990,
    endYear: 2024,
  },
  
  // ─────────────────────────────────────────
  // ENERGY TRANSITION
  // ─────────────────────────────────────────
  'renewable-capacity': {
    id: 'renewable-capacity',
    name: 'Global Renewable Capacity',
    shortName: 'Renewables',
    category: 'energy-transition',
    unit: 'gigawatts',
    unitShort: 'GW',
    description: 'Total installed renewable electricity capacity worldwide (solar, wind, hydro, other).',
    source: 'IRENA',
    sourceUrl: 'https://www.irena.org/Statistics',
    baseline: '754 GW in 2000',
    direction: 'up-good',
    color: DATASET_COLORS['renewable-capacity'],
    currentValue: 4200,
    changePerDecade: 1000,
    startYear: 2000,
    endYear: 2024,
  },
  
  'solar-capacity': {
    id: 'solar-capacity',
    name: 'Global Solar PV Capacity',
    shortName: 'Solar',
    category: 'energy-transition',
    unit: 'gigawatts',
    unitShort: 'GW',
    description: 'Total installed solar photovoltaic capacity. One of the most dramatic growth curves in energy history.',
    source: 'IRENA / IEA',
    sourceUrl: 'https://www.irena.org/Statistics',
    baseline: '1.3 GW in 2000',
    direction: 'up-good',
    color: DATASET_COLORS['solar-capacity'],
    currentValue: 2020,
    changePerDecade: 500,
    startYear: 2000,
    endYear: 2024,
  },
  
  'wind-capacity': {
    id: 'wind-capacity',
    name: 'Global Wind Capacity',
    shortName: 'Wind',
    category: 'energy-transition',
    unit: 'gigawatts',
    unitShort: 'GW',
    description: 'Total installed wind power capacity worldwide (onshore and offshore combined).',
    source: 'IRENA / GWEC',
    sourceUrl: 'https://www.irena.org/Statistics',
    baseline: '17 GW in 2000',
    direction: 'up-good',
    color: DATASET_COLORS['wind-capacity'],
    currentValue: 1130,
    changePerDecade: 300,
    startYear: 2000,
    endYear: 2024,
  },
  
  'ev-sales': {
    id: 'ev-sales',
    name: 'Global EV Sales',
    shortName: 'EV Sales',
    category: 'energy-transition',
    unit: 'million vehicles',
    unitShort: 'M',
    description: 'Annual global sales of battery electric and plug-in hybrid vehicles. One of the fastest technology adoption curves.',
    source: 'IEA',
    sourceUrl: 'https://www.iea.org/data-and-statistics/data-tools/global-ev-data-explorer',
    baseline: '0.02 million in 2010',
    direction: 'up-good',
    color: DATASET_COLORS['ev-sales'],
    currentValue: 17.5,
    changePerDecade: 10,
    startYear: 2010,
    endYear: 2024,
  },
  
  // ─────────────────────────────────────────
  // EXTREME EVENTS
  // ─────────────────────────────────────────
  'heat-records': {
    id: 'heat-records',
    name: 'National Heat Records Broken',
    shortName: 'Heat Records',
    category: 'extreme-events',
    unit: 'countries',
    unitShort: 'countries',
    description: 'Number of countries setting or tying their all-time national high temperature record each year.',
    source: 'WMO / World Weather Attribution',
    sourceUrl: 'https://wmo.int/',
    baseline: '~0-1 per year historically',
    direction: 'up-bad',
    color: DATASET_COLORS['heat-records'],
    currentValue: 11,
    startYear: 1980,
    endYear: 2024,
  },
  
  'fossil-subsidies': {
    id: 'fossil-subsidies',
    name: 'Global Fossil Fuel Subsidies',
    shortName: 'Fossil Subsidies',
    category: 'extreme-events',
    unit: 'trillion US dollars',
    unitShort: 'T$',
    description: 'Total global government subsidies for fossil fuels (oil, gas, coal). Includes direct subsidies and tax breaks.',
    source: 'IMF',
    sourceUrl: 'https://www.imf.org/en/Topics/climate-change/energy-subsidies',
    baseline: '2015',
    direction: 'up-bad',
    color: DATASET_COLORS['fossil-subsidies'],
    currentValue: 7.3,
    changePerDecade: 2.5,
    startYear: 2015,
    endYear: 2023,
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
  // New formats
  if (unitShort === 'Mha/yr' || unitShort === 'Mha') {
    return value.toFixed(1)
  }
  if (unitShort === 'events' || unitShort === 'day' || unitShort === 'days') {
    return Math.round(value).toString()
  }
  if (unitShort === 'ONI' || unitShort === 'AOD') {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}`
  }
  if (unitShort === 'W/m²') {
    return value.toFixed(1)
  }
  if (unitShort === 'Gt CO₂') {
    return value.toFixed(1)
  }
  if (unitShort === 't/person') {
    return value.toFixed(1)
  }
  // Energy transition units
  if (unitShort === '%') {
    return value.toFixed(0)
  }
  if (unitShort === 'GW') {
    return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(0)
  }
  if (unitShort === 'M') {
    return value.toFixed(1)
  }
  if (unitShort === 'T$') {
    return `$${value.toFixed(1)}T`
  }
  if (unitShort === 'countries') {
    return Math.round(value).toString()
  }
  return value.toString()
}

// Default datasets to show on initial load
export const DEFAULT_ACTIVE_DATASETS = ['temp-global', 'co2']
