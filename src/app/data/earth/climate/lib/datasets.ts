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
    description: 'Nature\'s calendar - how plants and animals respond to warming',
    order: 6,
  },
  forcings: {
    name: 'Natural Influences',
    description: 'Natural factors that influence climate year-to-year - but don\'t explain the long-term trend',
    order: 7,
  },
  emissions: {
    name: 'Emissions',
    description: 'Human carbon dioxide emissions',
    order: 8,
  },
  'uk-data': {
    name: 'UK Records',
    description: 'Long-running UK climate records - the birthplace of climate science',
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
    description: 'In 1958, a young geochemist named Charles David Keeling began measuring CO₂ from a station high on the volcanic slopes of Mauna Loa, Hawaii - chosen because the air there is far from cities and factories, a window into Earth\'s atmosphere itself. What he captured became the most important environmental dataset in history: the "Keeling Curve." It shows not just the relentless rise of carbon dioxide, but also the planet breathing - the seasonal saw-tooth as northern hemisphere forests inhale each spring and exhale each autumn. When Keeling started, CO₂ was 315 ppm. His son continues the measurements today. It has never stopped rising.',
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
    description: 'When snow falls in Antarctica, it traps tiny bubbles of air. As layers accumulate and compress into ice, these bubbles become time capsules - samples of ancient atmosphere preserved for hundreds of thousands of years. By drilling three kilometres down into the East Antarctic ice sheet, scientists extracted the EPICA core: 800,000 years of Earth\'s atmospheric history. Through ice ages and warm periods, CO₂ oscillated between 180 and 280 ppm, driven by subtle wobbles in Earth\'s orbit. It never exceeded 300 ppm - until now. Today\'s level of 420 ppm is not just outside the natural range; it\'s 50% higher than anything in 800 millennia. And it\'s rising 100 times faster than any natural change the ice has ever recorded.',
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
    description: 'Methane is CO₂\'s fiercer but shorter-lived cousin. Molecule for molecule, it traps 80 times more heat over 20 years - but breaks down within a decade, making it a powerful lever for near-term climate action. It seeps from wetlands and thawing permafrost, belches from cattle and rice paddies, leaks from gas pipelines and coal mines. Pre-industrial levels were around 700 ppb; today we\'re approaching 1,930 ppb - nearly triple. The mysterious part: after plateauing in the early 2000s, methane started rising sharply again around 2007, and accelerated further after 2020. Scientists are still debating why. Some suspect warming wetlands are starting to release their ancient stores.',
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
    description: 'The forgotten greenhouse gas. Nitrous oxide - "laughing gas" - isn\'t funny in the atmosphere. It\'s 300 times more potent than CO₂ and lingers for over a century. Most of it comes from agriculture: when we spread nitrogen fertiliser on fields, soil microbes convert some of it to N₂O that escapes into the air. It\'s the hidden climate cost of feeding 8 billion people. Pre-industrial levels were 270 ppb; today we\'re at 336 ppb and climbing steadily. Unlike CO₂, there\'s no obvious technological fix - addressing it means rethinking how we grow food.',
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
    description: 'This single number - the global mean surface temperature anomaly - is the vital sign of planetary health. It averages thousands of weather stations, ships, buoys, and satellites into one figure: how much warmer (or cooler) is Earth than a baseline period? The answer: about 1.3°C warmer than the mid-20th century, and 1.5°C warmer than pre-industrial times. That might sound small. It isn\'t. The last ice age - when ice sheets covered Chicago and woolly mammoths roamed - was only 4-5°C colder than today. We\'re reshaping the planet\'s climate at a pace unprecedented in human existence. 2023 was the hottest year in at least 125,000 years. 2024 looks set to beat it.',
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
    description: 'The Arctic is the canary in the climate coal mine - and it\'s warming 3-4 times faster than the global average. This phenomenon, called "Arctic amplification," creates a vicious feedback loop: as ice melts, it exposes dark ocean water that absorbs more sunlight, causing more warming, causing more melting. What happens in the Arctic doesn\'t stay in the Arctic. The weakening temperature difference between the Arctic and mid-latitudes is destabilising the jet stream, bringing more extreme weather to Europe and North America. When you see headlines about polar vortex outbreaks or stuck weather patterns, this warming is part of the story.',
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
    description: 'The ocean is Earth\'s great heat sink - it has absorbed over 90% of the excess heat trapped by greenhouse gases. This is both a blessing and a curse. Without the ocean, the atmosphere would have warmed far more. But ocean warming has consequences: it fuels more intense hurricanes, bleaches coral reefs, drives marine species toward the poles, and raises sea levels through thermal expansion. The sea surface warms more slowly than land because water has enormous heat capacity. But in 2023 and 2024, ocean temperatures shattered records by margins that startled scientists - parts of the Atlantic were 5°C above normal. The ocean\'s buffer is being overwhelmed.',
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
    description: 'Land surfaces warm about twice as fast as the global average - which means most humans are experiencing more warming than the headline numbers suggest. This is simple physics: land has less heat capacity than water, and there\'s no evaporative cooling like over the ocean. It\'s also where most of the impacts happen: heat waves kill people, droughts destroy crops, wildfires burn communities. When scientists talk about limiting warming to 1.5°C globally, land areas will typically be 2-3°C warmer - and summer extremes warmer still. The inhabited world is changing faster than the planetary average implies.',
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
    description: 'Every September, the Arctic sea ice shrinks to its annual minimum - and that minimum keeps getting smaller. We\'ve lost about 40% of the summer ice extent since satellite records began in 1979. That\'s an area larger than India, simply gone. The ice that remains is younger and thinner: the thick, multi-year ice that used to dominate the Arctic has largely disappeared. Scientists now expect the Arctic will see its first ice-free summer sometime in the 2030s or 2040s - a state that hasn\'t occurred in over 100,000 years. Polar bears, walruses, and Indigenous communities that depend on the ice are already adapting to a fundamentally different Arctic.',
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
    description: 'The Greenland ice sheet contains enough frozen water to raise global sea levels by 7.4 metres. It\'s been there for at least 400,000 years. Now it\'s melting - losing about 280 billion tonnes per year. That\'s 280 cubic kilometres of ice, every year, flowing into the ocean. The loss shows up in NASA\'s GRACE satellites, which measure subtle changes in Earth\'s gravity field caused by shifting mass. Greenland\'s contribution to sea level rise has increased sixfold since the 1990s. The ice sheet has now passed several tipping points - certain levels of loss are now committed regardless of future emissions. The question is how much more we\'ll commit.',
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
    description: 'Antarctica holds 26.5 million cubic kilometres of ice - enough to raise sea levels by 58 metres if it all melted. For decades, scientists thought it was too cold to lose much ice. They were wrong. The continent is now losing about 150 billion tonnes per year, and the rate is accelerating. The most vulnerable parts are in West Antarctica, where glaciers rest on bedrock below sea level. Warm ocean water is eating away at their bases from below, potentially triggering irreversible collapse. The Thwaites Glacier - nicknamed the "Doomsday Glacier" - is holding back enough ice to raise seas by half a metre on its own. How quickly Antarctica destabilises is the biggest wild card in sea level projections.',
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
    description: 'Mountain glaciers are the world\'s water towers. They store winter snow and release it as summer meltwater, sustaining rivers that billions of people depend on for drinking water, irrigation, and hydropower. They\'re disappearing. The World Glacier Monitoring Service tracks reference glaciers across all continents - and almost all are losing mass. The cumulative loss since 1970 is over 28 metres of water equivalent thickness. Some glaciers have vanished entirely; others will follow within decades. The Swiss Alps have lost more than half their ice volume. The Himalayas are melting faster than any time in the past 2,000 years. This is water debt that future generations will pay.',
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
    description: 'Since 1993, when satellite altimeters began precise global measurements, sea level has risen about 100 millimetres - nearly 4 inches. That\'s the global average; some coastlines have risen more, some less, depending on local land movement, ocean currents, and gravitational effects from ice sheet loss. The rate is accelerating: it was about 2.5 mm/year in the 1990s; now it\'s 4.5 mm/year. About a third comes from thermal expansion (warmer water takes up more space), a third from melting glaciers, and a third from ice sheets. By 2100, seas could rise 0.3 to 1 metre - or more if ice sheet collapse accelerates. Hundreds of millions of people live in coastal areas threatened by this rise.',
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
    description: 'The ocean has absorbed 90% of the excess heat trapped by greenhouse gases - an almost incomprehensible amount of energy. Since 1955, the upper 2,000 metres of ocean have gained about 345 zettajoules. For scale: one zettajoule equals a billion trillion joules, or roughly 150 times total global annual energy consumption. This is the true measure of planetary warming. If this heat were in the atmosphere instead, surface temperatures would be many degrees higher. But this buffer comes at a cost: marine heatwaves are intensifying, coral reefs are dying, and the warm water fuels more destructive hurricanes. Every year sets new records for ocean heat content. The thermal commitment is already locked in.',
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
    description: 'The ocean doesn\'t just absorb heat - it absorbs about a quarter of our CO₂ emissions too. When CO₂ dissolves in seawater, it forms carbonic acid, making the ocean more acidic. Since pre-industrial times, ocean pH has dropped from 8.2 to 8.1. That 0.1 unit drop sounds tiny but represents a 30% increase in acidity - the pH scale is logarithmic. This is happening faster than at any time in at least 300 million years. The consequences are already visible: shell-forming organisms - corals, oysters, pteropods - struggle to build their calcium carbonate structures in more acidic water. Entire marine food webs are at risk. Scientists call this "the other CO₂ problem" - climate change\'s evil twin.',
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
    description: 'Forests are the planet\'s lungs and its largest land-based carbon store. Satellite imagery reveals we\'re losing them at a staggering rate: about 28 million hectares per year - an area the size of the UK, every year. Some is natural (wildfires, storms), but most is human-driven: agriculture expanding in the tropics, logging, and increasingly, fires made worse by climate change itself. The Amazon, long a carbon sink, has become a carbon source in some years. Indonesia\'s peatland forests release millennia of stored carbon when cleared and burned. The loss represents not just climate damage but biodiversity collapse - forests harbour over half of Earth\'s land species.',
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
    description: 'Coral reefs are the rainforests of the sea - covering less than 1% of the ocean floor but supporting a quarter of all marine species. They\'re also among the most climate-sensitive ecosystems on Earth. When water temperatures rise just 1-2°C above normal for several weeks, corals expel the symbiotic algae that give them colour and energy. They turn ghostly white - "bleached." If conditions don\'t improve quickly, they die. The world has now experienced four global mass bleaching events: 1998, 2010, 2014-17, and 2023-24. Each was worse than the last. The Great Barrier Reef has bleached six times in the past nine years. Scientists estimate we\'ll lose 70-90% of coral reefs at 1.5°C warming, and virtually all at 2°C.',
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
    description: 'Fire has always shaped forests and grasslands. But climate change is rewriting the rules. Longer, hotter, drier summers mean more fire weather. What\'s striking isn\'t just the total area burned - which varies enormously by year - but the emergence of entirely new fire regimes. California now has a "fire season" that can span the entire year. Australia\'s 2019-20 fires burned an unprecedented 18.6 million hectares and killed an estimated billion animals. Canadian fires in 2023 burned more than twice the previous record. The Arctic is seeing fires in tundra that had been too wet to burn. Smoke from these megafires now affects air quality across entire continents, thousands of kilometres from the flames.',
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
    description: 'Beneath the Arctic lies frozen ground - permafrost - that has remained frozen for thousands to millions of years. It contains an estimated 1,500 billion tonnes of carbon: dead plants and animals preserved by cold, waiting to decompose. As the Arctic warms, this deep freezer is thawing. Buildings buckle, roads crack, and ancient organic matter starts to rot, releasing CO₂ and methane. This is one of the most feared climate feedbacks: warming thaws permafrost, which releases greenhouse gases, which causes more warming, which thaws more permafrost. It\'s already happening. The question is how fast it accelerates. Some scientists call it a "carbon bomb" with a very slow fuse.',
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
    description: 'For over 1,200 years, Japanese court diarists, monks, and meteorologists have recorded when cherry blossoms first bloom in Kyoto - the longest continuous phenological record in the world. Cherry blossom festivals (hanami) are timed to this moment; it\'s woven into Japanese culture. The flowers are exquisitely temperature-sensitive, blooming earlier in warm springs. The records show remarkable stability for centuries, with blossoms appearing around April 17 on average. Then, starting in the 20th century, the pattern shifted. Recent years have seen blossoms appearing in late March - sometimes the earliest in 1,200 years. In 2021, peak bloom came on March 26. The trees are keeping a precise record of warming that no thermometer could match.',
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
    description: 'Wine grapes are precise thermometers. In Burgundy, France, harvest dates have been recorded since the 14th century - 660 years of climate data preserved in château ledgers and church records. Grapes ripen faster in warmer years, triggering earlier harvests. For six centuries, harvest fell around September 28, with occasional variations. But since the 1980s, the pattern has lurched earlier. Recent harvests have occurred in early September - sometimes late August - dates once associated with legendary "vintages of the century." Champagne, Bordeaux, and German wine regions show similar shifts. The wine industry is adapting: planting different varieties, moving vineyards uphill, even establishing new regions in England and Scandinavia. Climate change is literally moving the map of wine.',
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
    description: 'Spring is arriving earlier; autumn is coming later. Satellite imagery of "green-up" dates and frost-free periods reveals that the Northern Hemisphere growing season has lengthened by about two weeks since 1900. This might sound like good news for farmers - and in some places, it is. Longer growing seasons allow new crops at higher latitudes. But the picture is complicated. Earlier springs trigger mismatches: flowers bloom before their pollinators emerge; birds arrive to find caterpillar peaks already passed. More frost-free days mean more pest generations. And longer warm seasons in forests create longer fire seasons. Nature\'s calendar evolved over millennia. We\'re rewriting it in decades.',
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
    description: 'Every spring, billions of birds fly north to breed - a journey tuned over thousands of years to coincide with peak food availability. They\'re arriving earlier. Across North America and Europe, spring migrants are showing up 1-2 days earlier per decade. Swallows, warblers, and cuckoos are adjusting their schedules. But there\'s a problem: many birds can\'t shift their migration timing as fast as plants and insects are shifting their seasonal peaks. Birds that winter in Africa can\'t "see" that European springs are coming earlier - they rely on day length cues that don\'t change. The result is ecological mismatch: birds arrive to find the caterpillar peaks they depend on already passed. Not all species can adapt. Some will be left behind.',
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
    description: 'El Niño and La Niña are the planet\'s largest natural climate oscillation - a cycle of warm and cool phases in the tropical Pacific that affects weather worldwide. During El Niño, warm water sloshes eastward, disrupting normal patterns: drought in Australia, floods in Peru, milder winters in parts of North America, and a temporary spike in global temperatures. La Niña brings the opposite. This cycle explains much of the year-to-year variation in global temperatures. But here\'s the key point: ENSO can\'t explain the long-term warming trend. It\'s a natural oscillation around a rising baseline. Both El Niño and La Niña years are warmer now than they were decades ago. The background warming continues regardless of which phase we\'re in.',
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
    description: 'Could the Sun be causing global warming? This question comes up a lot, so let\'s look at the data. Total Solar Irradiance (TSI) - the energy output of the Sun - varies by about 0.1% over the 11-year solar cycle. That variation is real but tiny, causing about 0.1°C of warming at solar maximum versus solar minimum. Since satellite measurements began in 1978, TSI has shown no upward trend - if anything, recent solar cycles have been slightly weaker than earlier ones. Meanwhile, temperatures have risen dramatically. If solar variability were the cause, we\'d expect the stratosphere to warm along with the surface; instead, it\'s cooling (as predicted from greenhouse warming). The Sun simply cannot explain what we\'re seeing.',
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
    description: 'Major volcanic eruptions can actually cool the climate - for a few years. When volcanoes blast sulfur dioxide into the stratosphere, it forms tiny sulfate particles that reflect sunlight back to space. The 1991 eruption of Mount Pinatubo cooled global temperatures by about 0.5°C for two years. The 1815 Tambora eruption caused the "Year Without a Summer" - crop failures across the Northern Hemisphere. This is why volcanic aerosol optical depth appears in climate models. But here\'s the thing: there haven\'t been any major stratospheric eruptions since Pinatubo. If volcanoes were driving climate, we\'d expect the 2000s and 2010s - with low volcanic activity - to be relatively cool. Instead, they set temperature records. Volcanoes cause short-term cooling; the long-term warming trend continues through them.',
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
    description: 'This is the curve we need to bend. Global CO₂ emissions from fossil fuels and industry have risen from near zero in 1750 to 37 billion tonnes per year today. The first billion tonnes took over a century; now we add another billion every few years. The shape is relentless: through world wars and depressions, pandemics and oil crises, emissions keep rising. COVID-19 caused a temporary 5% dip in 2020 - then emissions bounced back. The math is unforgiving: every year we emit ~37 Gt, and the atmosphere retains about half of it. We\'ve already emitted over 2,500 Gt since 1750. To stay below 1.5°C warming, we have maybe 250-300 Gt left. At current rates, that\'s gone by 2030. The physics doesn\'t negotiate.',
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
    description: 'The global average hides enormous inequality. The average person emits about 4.7 tonnes of CO₂ per year - but an American emits 14 tonnes, a European about 6, a Chinese citizen about 8, and an Indian about 2. The richest 10% of the world\'s population cause about half of emissions. A single business class flight across the Atlantic emits more CO₂ than the average person in Ghana produces in a year. This matters for justice: the people who have contributed least to the problem are often the most vulnerable to its impacts. It also matters for solutions: lifestyle changes by wealthy people can have outsized impact, and developing nations rightly ask why they should sacrifice growth when others built their prosperity on fossil fuels.',
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
    description: 'The Central England Temperature series is the longest continuous instrumental temperature record in the world, beginning in 1659 - just a decade after the English Civil War. Gordon Manley, a geographer, painstakingly assembled it in the 1950s from weather diaries, estate records, and early scientific observations, creating a time series that spans the Little Ice Age to the present day. It covers a triangular region from Lancashire to London to Bristol. For three centuries, temperatures averaged about 9°C, with natural variations. Then in the late 20th century, the series lurched upward. The 2010s and early 2020s have produced almost all the warmest years on record. England is witnessing climate change through the same dataset that first revealed stable climate was an illusion.',
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
    description: 'Britain and rain: the stereotypes are earned. The England and Wales Precipitation series dates to 1766 - also one of the longest rainfall records anywhere. Rain is harder to measure consistently than temperature: gauges vary, sites move, cities grow around them. But the record reveals some truths. Average annual rainfall hasn\'t changed dramatically overall, but its distribution has. Winters are getting wetter; the wettest days are getting wetter still. When it rains, it pours. Climate models predict this pattern will intensify: winter flooding will worsen while summer droughts become more common. Britain\'s relationship with rain is getting more extreme.',
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
    description: 'Britain invented the Industrial Revolution on coal. In 1990, coal generated 65% of UK electricity. Today: zero. On September 30, 2024, Ratcliffe-on-Soar power station fired up its turbines for the last time, ending 142 years of coal power in the country that started it all. This is one of the most dramatic energy transitions in history. The UK went from majority coal to coal-free in just 12 years - faster than almost any other major economy. It happened through a combination of carbon pricing, air quality regulations, cheap gas (temporarily), and the rise of renewables. Other countries are watching. If coal\'s birthplace can quit coal, the argument goes, so can anyone.',
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
    description: 'The flip side of coal\'s decline: the rise of wind and solar. In 1990, renewables provided just 2% of UK electricity. By 2024, it\'s over 50% - and some days hit 70% or more. The UK has more offshore wind capacity than any other country. Scottish wind farms regularly produce more electricity than Scotland consumes. This transformation happened faster than anyone predicted in 2010. It happened because costs plummeted - offshore wind is now cheaper than building new gas plants - and because policy pushed it along. The UK grid is becoming one of the cleanest in Europe. The remaining challenge: what happens when the wind doesn\'t blow? Storage, interconnectors, and demand flexibility are the next frontier.',
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
    description: 'Here is a rare piece of good news. Global renewable electricity capacity has grown from 754 gigawatts in 2000 to over 4,200 GW today - a more than fivefold increase. In 2023, the world added 507 GW of new renewables - more than the total electricity capacity of France or Germany. Solar and wind are now the cheapest sources of new electricity in most of the world. This is a genuine transformation, driven by technology learning curves, manufacturing scale-up (especially in China), and policy support. But context matters: renewables still supply only about 30% of global electricity, and electricity is only about 20% of total energy use. We\'re winning the battle for new capacity; we haven\'t yet won the war against the installed fossil fuel infrastructure.',
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
    description: 'Solar power\'s growth curve is one of the most remarkable in technological history. In 2000, global solar PV capacity was 1.3 GW - a rounding error. Today it exceeds 2,000 GW. Costs have fallen 99% since 1976 - a learning curve that has consistently beaten even optimistic forecasts. IEA projections from the 2000s now look almost comically pessimistic. In 2023 alone, the world added over 400 GW of solar - more than the entire installed capacity just five years earlier. China manufactures about 80% of global solar panels. This is both a triumph and a vulnerability: the technology is transforming energy, but supply chains are concentrated. Solar is no longer a niche technology. It\'s eating the energy system.',
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
    description: 'Wind power has grown from 17 GW in 2000 to over 1,100 GW today - a 65-fold increase. Turbines have gotten dramatically larger: the first commercial wind farms used machines of 50-100 kilowatts; today\'s offshore giants exceed 15 megawatts, with rotors spanning 230 metres - longer than two football pitches. Larger turbines capture more consistent winds at greater heights, improving economics. Offshore wind, once considered too expensive, is now competitive in windy regions like the North Sea. The UK, Denmark, and Germany lead in offshore capacity, but China is building fastest. Wind is now the largest source of renewable electricity in Europe. The challenge: permitting and grid connections are becoming bigger bottlenecks than technology or cost.',
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
    description: 'Electric vehicles are following solar\'s playbook: exponential growth driven by falling battery costs. In 2010, global EV sales were 20,000 - negligible. In 2024: over 17 million. EVs now account for about 20% of global car sales. China dominates: over 60% of EV sales and most battery manufacturing. Europe is second; the US is catching up. The technology tipping point has passed in most segments: EVs are now cheaper to own over their lifetime than petrol cars, even before subsidies. The transition is fastest for new cars; but the global fleet turns over slowly - most cars on the road in 2030 have already been built. Transport decarbonisation will take decades, but the direction is now clear. The internal combustion engine\'s century of dominance is ending.',
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
    description: 'In a stable climate, you\'d expect national heat records to be broken roughly as often as cold records - and both to become rarer over time as extremes get recorded. That\'s not what\'s happening. Since 2000, over 40 countries have set or tied their all-time national high temperature records. Heat records now outnumber cold records by about 10 to 1 in some regions. The UK hit 40°C for the first time in 2022. Canada reached 49.6°C in 2021 - shattering its previous record by 4.6°C, a virtually impossible margin without climate change. Antarctica has recorded temperatures 38°C above normal. These aren\'t just broken records - they\'re records being obliterated. Attribution science can now say with high confidence: most recent heat extremes would have been virtually impossible without human-caused warming.',
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
    description: 'Every year, governments pour trillions of dollars into supporting fossil fuels - through direct subsidies, tax breaks, and by not charging for the damage they cause. The IMF estimates explicit subsidies at about $1.3 trillion and implicit subsidies (unpriced externalities like air pollution and climate damage) at over $7 trillion per year - roughly $13 million per minute. This is more than governments spend on education. It\'s the opposite of rational climate policy: we\'re paying to make the problem worse. Reforming fossil fuel subsidies could reduce global emissions by several percent and free up money for clean energy investment. But subsidies are politically entrenched - cheap fuel is popular, and oil and gas interests are powerful. This is one of the clearest examples of how politics, not technology or economics, is the binding constraint on climate action.',
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