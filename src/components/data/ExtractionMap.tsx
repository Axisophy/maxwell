'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// ============================================================================
// CUSTOM MAP STYLE DEFINITIONS
// These create genuinely beautiful, distinctive map aesthetics
// ============================================================================

const CUSTOM_STYLES = {
  // TERRAIN: Warm, tactile, like a beautiful physical globe
  terrain: {
    id: 'terrain',
    name: 'Terrain',
    description: 'Physical landscape',
    baseStyle: 'mapbox://styles/mapbox/outdoors-v12',
    customLayers: {
      background: '#e8e4d9',
      water: '#b8c5c9',
      waterway: '#a8b5b9',
      land: '#e8e4d9',
      landuse_park: '#c8d4c0',
      hillshade_highlight: 'rgba(255, 255, 255, 0.5)',
      hillshade_shadow: 'rgba(0, 0, 0, 0.15)',
    },
    markerStyle: {
      border: 'rgba(255,255,255,0.9)',
      shadow: 'rgba(0,0,0,0.3)',
      glow: true,
    },
    ui: {
      bg: 'rgba(255,255,255,0.92)',
      text: '#000000',
      textMuted: 'rgba(0,0,0,0.5)',
      border: 'rgba(0,0,0,0.08)',
      panel: '#ffffff',
    },
    preview: 'linear-gradient(135deg, #d4cfc2 0%, #e8e4d9 50%, #c2cbb8 100%)',
  },

  // POLITICAL: Clean, informative, newspaper-quality cartography  
  political: {
    id: 'political',
    name: 'Political',
    description: 'Country boundaries',
    baseStyle: 'mapbox://styles/mapbox/light-v11',
    customLayers: {
      background: '#f5f5f5',
      water: '#d4e4ec',
      land: '#f8f8f8',
      admin_boundaries: 'rgba(0,0,0,0.15)',
    },
    markerStyle: {
      border: 'rgba(255,255,255,0.95)',
      shadow: 'rgba(0,0,0,0.25)',
      glow: true,
    },
    ui: {
      bg: 'rgba(255,255,255,0.95)',
      text: '#1a1a1a',
      textMuted: 'rgba(0,0,0,0.45)',
      border: 'rgba(0,0,0,0.06)',
      panel: '#ffffff',
    },
    preview: 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 50%, #f5f5f5 100%)',
  },

  // DARK: Dramatic, cinematic, data glows against darkness
  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Night view',
    baseStyle: 'mapbox://styles/mapbox/dark-v11',
    customLayers: {
      background: '#08080c',
      water: '#0a0a10',
      land: '#151518',
      admin_boundaries: 'rgba(255,255,255,0.08)',
    },
    markerStyle: {
      border: 'rgba(40,40,45,0.9)',
      shadow: 'rgba(0,0,0,0.5)',
      glow: true,
      glowIntensity: 1.5,
    },
    ui: {
      bg: 'rgba(20,20,24,0.95)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.5)',
      border: 'rgba(255,255,255,0.08)',
      panel: '#1a1a1e',
    },
    preview: 'linear-gradient(135deg, #1a1a1e 0%, #08080c 100%)',
  },

  // SATELLITE: Real Earth imagery, awe-inspiring
  satellite: {
    id: 'satellite',
    name: 'Satellite',
    description: 'Earth imagery',
    baseStyle: 'mapbox://styles/mapbox/satellite-v9',
    customLayers: {},
    markerStyle: {
      border: 'rgba(255,255,255,0.9)',
      shadow: 'rgba(0,0,0,0.5)',
      glow: true,
    },
    ui: {
      bg: 'rgba(10,10,15,0.9)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.6)',
      border: 'rgba(255,255,255,0.1)',
      panel: 'rgba(20,20,25,0.95)',
    },
    preview: 'linear-gradient(135deg, #1a3d2e 0%, #0d2818 50%, #1a2d3d 100%)',
  },

  // MINIMAL: Pure, abstract, museum-quality
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Abstract view',
    baseStyle: 'mapbox://styles/mapbox/light-v11',
    customLayers: {
      background: '#fafafa',
      water: '#fafafa',
      land: '#eeeeee',
      admin_boundaries: 'rgba(0,0,0,0.12)',
      coastline: '#dddddd',
    },
    markerStyle: {
      border: 'rgba(200,200,200,0.8)',
      shadow: 'rgba(0,0,0,0.15)',
      glow: false,
    },
    ui: {
      bg: 'rgba(250,250,250,0.95)',
      text: '#000000',
      textMuted: 'rgba(0,0,0,0.4)',
      border: 'rgba(0,0,0,0.06)',
      panel: '#ffffff',
    },
    preview: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
  },

  // BLUEPRINT: Technical, engineering aesthetic (bonus style)
  blueprint: {
    id: 'blueprint',
    name: 'Blueprint',
    description: 'Technical drawing',
    baseStyle: 'mapbox://styles/mapbox/dark-v11',
    customLayers: {
      background: '#0a1628',
      water: '#0d1a2d',
      land: '#0f1e35',
      admin_boundaries: 'rgba(100,150,200,0.3)',
    },
    markerStyle: {
      border: 'rgba(100,180,255,0.6)',
      shadow: 'rgba(0,100,200,0.3)',
      glow: true,
      glowColor: 'rgba(100,180,255,0.4)',
    },
    ui: {
      bg: 'rgba(10,22,40,0.95)',
      text: '#e0f0ff',
      textMuted: 'rgba(150,180,210,0.7)',
      border: 'rgba(100,150,200,0.2)',
      panel: 'rgba(15,30,53,0.98)',
    },
    preview: 'linear-gradient(135deg, #0a1628 0%, #0f1e35 100%)',
  },
};

type MapStyleKey = keyof typeof CUSTOM_STYLES;

// ============================================================================
// ELEMENT DATA WITH RICHER VISUAL PROPERTIES
// ============================================================================

interface ElementData {
  symbol: string;
  name: string;
  category: string;
  color: string;
  glowColor: string;
  description: string;
  topProducers: { country: string; code: string; percentage: number }[];
  totalSites: number;
  annualProduction: string;
  uses: string[];
  funFact?: string;
}

const ELEMENTS: ElementData[] = [
  {
    symbol: 'Li',
    name: 'Lithium',
    category: 'Battery Metal',
    color: '#00d4aa',
    glowColor: 'rgba(0,212,170,0.5)',
    description: 'The lightest metal. Powers the batteries in your phone, laptop, and increasingly, your car.',
    topProducers: [
      { country: 'Australia', code: 'AU', percentage: 52 },
      { country: 'Chile', code: 'CL', percentage: 25 },
      { country: 'China', code: 'CN', percentage: 13 },
    ],
    totalSites: 89,
    annualProduction: '100,000 tonnes',
    uses: ['EV Batteries', 'Phone Batteries', 'Grid Storage', 'Ceramics'],
    funFact: 'Named from Greek "lithos" (stone). So reactive it must be stored in oil.',
  },
  {
    symbol: 'Co',
    name: 'Cobalt',
    category: 'Battery Metal',
    color: '#0047ab',
    glowColor: 'rgba(0,71,171,0.5)',
    description: 'Critical for battery cathodes. 70% comes from DR Congo, raising profound ethical questions.',
    topProducers: [
      { country: 'DR Congo', code: 'CD', percentage: 70 },
      { country: 'Russia', code: 'RU', percentage: 4 },
      { country: 'Australia', code: 'AU', percentage: 4 },
    ],
    totalSites: 45,
    annualProduction: '140,000 tonnes',
    uses: ['EV Batteries', 'Superalloys', 'Magnets', 'Blue Pigments'],
    funFact: 'The word "cobalt" comes from German folklore — kobolds were mine spirits that made miners sick.',
  },
  {
    symbol: 'Cu',
    name: 'Copper',
    category: 'Base Metal',
    color: '#b87333',
    glowColor: 'rgba(184,115,51,0.5)',
    description: 'The metal that conducts. Every wire, every motor, every circuit depends on copper.',
    topProducers: [
      { country: 'Chile', code: 'CL', percentage: 28 },
      { country: 'Peru', code: 'PE', percentage: 10 },
      { country: 'China', code: 'CN', percentage: 8 },
    ],
    totalSites: 312,
    annualProduction: '21 million tonnes',
    uses: ['Wiring', 'Plumbing', 'Electronics', 'Motors', 'Roofing'],
    funFact: 'Humans have used copper for 10,000 years. It was the first metal ever worked.',
  },
  {
    symbol: 'Au',
    name: 'Gold',
    category: 'Precious Metal',
    color: '#ffd700',
    glowColor: 'rgba(255,215,0,0.5)',
    description: 'The eternal metal. All the gold ever mined would fit in a 21-meter cube.',
    topProducers: [
      { country: 'China', code: 'CN', percentage: 11 },
      { country: 'Australia', code: 'AU', percentage: 10 },
      { country: 'Russia', code: 'RU', percentage: 9 },
    ],
    totalSites: 478,
    annualProduction: '3,000 tonnes',
    uses: ['Jewelry', 'Electronics', 'Central Banks', 'Dentistry', 'Aerospace'],
    funFact: 'Every iPhone contains about 0.034 grams of gold — but recovering it requires chemistry.',
  },
  {
    symbol: 'Fe',
    name: 'Iron',
    category: 'Industrial',
    color: '#5a5a5a',
    glowColor: 'rgba(90,90,90,0.5)',
    description: 'The backbone of civilization. Iron ore becomes steel — the world\'s most-used metal.',
    topProducers: [
      { country: 'Australia', code: 'AU', percentage: 37 },
      { country: 'Brazil', code: 'BR', percentage: 17 },
      { country: 'China', code: 'CN', percentage: 14 },
    ],
    totalSites: 523,
    annualProduction: '2.5 billion tonnes',
    uses: ['Steel', 'Construction', 'Vehicles', 'Machinery', 'Bridges'],
    funFact: 'The core of Earth is mostly iron. It\'s why we have a magnetic field.',
  },
  {
    symbol: 'REE',
    name: 'Rare Earths',
    category: 'Strategic',
    color: '#9333ea',
    glowColor: 'rgba(147,51,234,0.5)',
    description: '17 elements that power modern technology. Not actually rare — but concentrated in few places.',
    topProducers: [
      { country: 'China', code: 'CN', percentage: 60 },
      { country: 'USA', code: 'US', percentage: 15 },
      { country: 'Myanmar', code: 'MM', percentage: 9 },
    ],
    totalSites: 34,
    annualProduction: '300,000 tonnes',
    uses: ['Magnets', 'Catalysts', 'Electronics', 'Wind Turbines', 'EVs'],
    funFact: 'A single wind turbine contains 335kg of neodymium. Almost all of it from China.',
  },
  {
    symbol: 'U',
    name: 'Uranium',
    category: 'Energy',
    color: '#7fff00',
    glowColor: 'rgba(127,255,0,0.5)',
    description: 'The nuclear fuel. One kilogram of uranium contains as much energy as 20,000 kg of coal.',
    topProducers: [
      { country: 'Kazakhstan', code: 'KZ', percentage: 43 },
      { country: 'Namibia', code: 'NA', percentage: 11 },
      { country: 'Canada', code: 'CA', percentage: 10 },
    ],
    totalSites: 67,
    annualProduction: '48,000 tonnes',
    uses: ['Nuclear Power', 'Medical Isotopes', 'Naval Propulsion'],
    funFact: 'The uranium in Earth\'s crust generates more heat than the Sun delivers to Earth\'s surface.',
  },
  {
    symbol: 'Pt',
    name: 'Platinum',
    category: 'Precious Metal',
    color: '#e5e4e2',
    glowColor: 'rgba(229,228,226,0.5)',
    description: 'Rarer than gold. Essential for catalytic converters — and the coming hydrogen economy.',
    topProducers: [
      { country: 'South Africa', code: 'ZA', percentage: 72 },
      { country: 'Russia', code: 'RU', percentage: 12 },
      { country: 'Zimbabwe', code: 'ZW', percentage: 8 },
    ],
    totalSites: 23,
    annualProduction: '180 tonnes',
    uses: ['Catalytic Converters', 'Jewelry', 'Fuel Cells', 'Medical', 'Electronics'],
    funFact: 'All the platinum ever mined would fit in a living room. It\'s that rare.',
  },
];

// ============================================================================
// EXTRACTION SITES WITH RICH STORIES
// ============================================================================

interface ExtractionSite {
  id: string;
  name: string;
  coordinates: [number, number];
  country: string;
  countryCode: string;
  region?: string;
  primary: {
    element: string;
    symbol: string;
    production?: number;
    unit?: string;
  };
  secondary?: { element: string; symbol: string }[];
  status: 'active' | 'historic' | 'planned' | 'suspended';
  type: 'open-pit' | 'underground' | 'brine' | 'placer';
  operator?: string;
  startYear?: number;
  description: string;
  significance?: string;
  scale?: 'mega' | 'large' | 'medium';
}

const SITES: ExtractionSite[] = [
  // LITHIUM
  {
    id: 'atacama',
    name: 'Salar de Atacama',
    coordinates: [-68.36, -23.50],
    country: 'Chile',
    countryCode: 'CL',
    region: 'Antofagasta',
    primary: { element: 'Lithium', symbol: 'Li', production: 39000, unit: 't/yr' },
    status: 'active',
    type: 'brine',
    operator: 'SQM / Albemarle',
    startYear: 1984,
    description: 'The world\'s largest lithium brine operation. Solar evaporation ponds stretch across the driest desert on Earth, extracting lithium from ancient underground brines.',
    significance: 'Produces roughly 30% of global lithium. The salt flat is so white it\'s used to calibrate satellites.',
    scale: 'mega',
  },
  {
    id: 'greenbushes',
    name: 'Greenbushes',
    coordinates: [116.06, -33.85],
    country: 'Australia',
    countryCode: 'AU',
    region: 'Western Australia',
    primary: { element: 'Lithium', symbol: 'Li', production: 1200000, unit: 't/yr spodumene' },
    status: 'active',
    type: 'open-pit',
    operator: 'Tianqi/IGO',
    startYear: 1983,
    description: 'The world\'s largest hard-rock lithium mine. Originally mined for tin in 1888, it now supplies the batteries in millions of devices.',
    significance: 'Single largest lithium mine on Earth. The pit will eventually be 450m deep.',
    scale: 'mega',
  },
  // COPPER
  {
    id: 'escondida',
    name: 'Escondida',
    coordinates: [-69.07, -24.27],
    country: 'Chile',
    countryCode: 'CL',
    region: 'Atacama Desert',
    primary: { element: 'Copper', symbol: 'Cu', production: 1200000, unit: 't/yr' },
    secondary: [{ element: 'Gold', symbol: 'Au' }],
    status: 'active',
    type: 'open-pit',
    operator: 'BHP',
    startYear: 1990,
    description: 'The world\'s largest copper mine. Visible from space. Trucks here carry 400 tonnes — the weight of a jumbo jet.',
    significance: 'Produces 5% of global copper alone. The pit is now over 3km wide.',
    scale: 'mega',
  },
  {
    id: 'grasberg',
    name: 'Grasberg',
    coordinates: [137.10, -4.05],
    country: 'Indonesia',
    countryCode: 'ID',
    region: 'Papua',
    primary: { element: 'Copper', symbol: 'Cu', production: 500000, unit: 't/yr' },
    secondary: [{ element: 'Gold', symbol: 'Au' }],
    status: 'active',
    type: 'underground',
    operator: 'Freeport Indonesia',
    startYear: 1972,
    description: 'The world\'s largest gold mine and second-largest copper mine. Located in remote Papua at 4,270m elevation — accessible only by air.',
    significance: 'One of the most valuable ore bodies ever discovered. The open pit is transitioning underground.',
    scale: 'mega',
  },
  // GOLD
  {
    id: 'muruntau',
    name: 'Muruntau',
    coordinates: [64.57, 41.55],
    country: 'Uzbekistan',
    countryCode: 'UZ',
    region: 'Kyzylkum Desert',
    primary: { element: 'Gold', symbol: 'Au', production: 66, unit: 't/yr' },
    status: 'active',
    type: 'open-pit',
    operator: 'Navoi Mining',
    startYear: 1967,
    description: 'The world\'s largest open-pit gold mine. Located in the heart of the Kyzylkum Desert in Uzbekistan.',
    significance: 'Produces more gold than any other single mine. The pit is 3.5km long and 560m deep.',
    scale: 'mega',
  },
  {
    id: 'witwatersrand',
    name: 'Witwatersrand Basin',
    coordinates: [27.85, -26.20],
    country: 'South Africa',
    countryCode: 'ZA',
    region: 'Gauteng',
    primary: { element: 'Gold', symbol: 'Au' },
    status: 'active',
    type: 'underground',
    description: 'A 56km-long arc that has produced 40% of all gold ever mined. The deepest mines reach 4km — where rock temperatures exceed 60°C.',
    significance: 'The richest gold field ever discovered. Johannesburg exists because of this basin.',
    scale: 'mega',
  },
  // COBALT
  {
    id: 'mutanda',
    name: 'Mutanda',
    coordinates: [25.95, -10.78],
    country: 'DR Congo',
    countryCode: 'CD',
    region: 'Lualaba',
    primary: { element: 'Cobalt', symbol: 'Co', production: 25000, unit: 't/yr' },
    secondary: [{ element: 'Copper', symbol: 'Cu' }],
    status: 'active',
    type: 'open-pit',
    operator: 'Glencore',
    startYear: 2010,
    description: 'One of the world\'s largest cobalt mines. The DRC\'s cobalt dominance creates complex ethical questions about labor practices.',
    significance: 'The cobalt in your phone likely came from here or nearby.',
    scale: 'large',
  },
  // RARE EARTHS
  {
    id: 'bayan-obo',
    name: 'Bayan Obo',
    coordinates: [109.97, 41.80],
    country: 'China',
    countryCode: 'CN',
    region: 'Inner Mongolia',
    primary: { element: 'Rare Earths', symbol: 'REE', production: 45000, unit: 't/yr' },
    secondary: [{ element: 'Iron', symbol: 'Fe' }],
    status: 'active',
    type: 'open-pit',
    operator: 'Baotou Steel',
    startYear: 1957,
    description: 'The world\'s largest rare earth mine. Originally mined for iron — the rare earths were considered worthless waste until the 1980s.',
    significance: 'Single-handedly gives China dominance in rare earth supply. The magnets in your headphones probably came from here.',
    scale: 'mega',
  },
  // IRON
  {
    id: 'pilbara',
    name: 'Pilbara',
    coordinates: [118.50, -22.50],
    country: 'Australia',
    countryCode: 'AU',
    region: 'Western Australia',
    primary: { element: 'Iron', symbol: 'Fe', production: 900000000, unit: 't/yr' },
    status: 'active',
    type: 'open-pit',
    operator: 'BHP / Rio Tinto / Fortescue',
    description: 'The world\'s largest iron ore region. Trains here are 2.5km long — the longest in the world — feeding ore to ships that carry it to China.',
    significance: 'Supplies most of China\'s iron ore. The red landscape is visible from space.',
    scale: 'mega',
  },
  // URANIUM
  {
    id: 'cigar-lake',
    name: 'Cigar Lake',
    coordinates: [-107.74, 58.05],
    country: 'Canada',
    countryCode: 'CA',
    region: 'Saskatchewan',
    primary: { element: 'Uranium', symbol: 'U', production: 6900, unit: 't/yr' },
    status: 'active',
    type: 'underground',
    operator: 'Cameco',
    startYear: 2014,
    description: 'The world\'s highest-grade uranium mine. Ore grades average 14% uranium — versus 0.1% typical elsewhere.',
    significance: 'One kilogram of Cigar Lake ore contains more uranium than 140kg from elsewhere.',
    scale: 'large',
  },
  // PLATINUM
  {
    id: 'bushveld',
    name: 'Bushveld Complex',
    coordinates: [27.50, -25.30],
    country: 'South Africa',
    countryCode: 'ZA',
    region: 'North West / Limpopo',
    primary: { element: 'Platinum', symbol: 'Pt', production: 130, unit: 't/yr' },
    status: 'active',
    type: 'underground',
    operator: 'Anglo American / Impala / Sibanye',
    description: 'A 2-billion-year-old layered intrusion containing over 70% of the world\'s platinum. The geology here is extraordinary.',
    significance: 'Every catalytic converter in the world depends on this single geological formation.',
    scale: 'mega',
  },
];

// ============================================================================
// "WHAT'S IN YOUR" PRODUCT DATA
// ============================================================================

interface ProductData {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  elements: {
    symbol: string;
    name: string;
    part: string;
    amount?: string;
    countries: { name: string; code: string; percentage?: number }[];
  }[];
}

const PRODUCTS: ProductData[] = [
  {
    id: 'smartphone',
    name: 'Smartphone',
    icon: '📱',
    tagline: 'Over 30 elements from 6 continents',
    elements: [
      { symbol: 'Li', name: 'Lithium', part: 'Battery', amount: '3-4g', countries: [{ name: 'Chile', code: 'CL', percentage: 40 }, { name: 'Australia', code: 'AU', percentage: 50 }] },
      { symbol: 'Co', name: 'Cobalt', part: 'Battery', amount: '5-8g', countries: [{ name: 'DR Congo', code: 'CD', percentage: 70 }] },
      { symbol: 'Au', name: 'Gold', part: 'Circuits', amount: '0.034g', countries: [{ name: 'China', code: 'CN' }, { name: 'Australia', code: 'AU' }] },
      { symbol: 'Cu', name: 'Copper', part: 'Wiring', amount: '15g', countries: [{ name: 'Chile', code: 'CL' }, { name: 'Peru', code: 'PE' }] },
      { symbol: 'REE', name: 'Rare Earths', part: 'Speakers', countries: [{ name: 'China', code: 'CN', percentage: 90 }] },
    ],
  },
  {
    id: 'ev',
    name: 'Electric Vehicle',
    icon: '🚗',
    tagline: '200kg of minerals per vehicle',
    elements: [
      { symbol: 'Li', name: 'Lithium', part: 'Battery', amount: '8-12kg', countries: [{ name: 'Chile', code: 'CL' }, { name: 'Australia', code: 'AU' }] },
      { symbol: 'Co', name: 'Cobalt', part: 'Battery', amount: '14kg', countries: [{ name: 'DR Congo', code: 'CD', percentage: 70 }] },
      { symbol: 'Cu', name: 'Copper', part: 'Motor', amount: '80kg', countries: [{ name: 'Chile', code: 'CL' }, { name: 'Peru', code: 'PE' }] },
      { symbol: 'REE', name: 'Rare Earths', part: 'Motor', amount: '2kg', countries: [{ name: 'China', code: 'CN', percentage: 90 }] },
      { symbol: 'Fe', name: 'Iron', part: 'Body', countries: [{ name: 'Australia', code: 'AU' }, { name: 'Brazil', code: 'BR' }] },
    ],
  },
  {
    id: 'wind-turbine',
    name: 'Wind Turbine',
    icon: '💨',
    tagline: 'A 3MW turbine: 335kg of rare earths',
    elements: [
      { symbol: 'REE', name: 'Rare Earths', part: 'Generator', amount: '335kg', countries: [{ name: 'China', code: 'CN', percentage: 90 }] },
      { symbol: 'Cu', name: 'Copper', part: 'Wiring', amount: '2,000kg', countries: [{ name: 'Chile', code: 'CL' }] },
      { symbol: 'Fe', name: 'Iron', part: 'Tower', countries: [{ name: 'Australia', code: 'AU' }] },
    ],
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface ExtractionMapProps {
  accessToken: string;
}

export default function ExtractionMapStunning({ accessToken }: ExtractionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyleKey>('dark');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<ExtractionSite | null>(null);
  const [showWhatsIn, setShowWhatsIn] = useState(false);
  const [isGlobe, setIsGlobe] = useState(true);

  const currentStyle = CUSTOM_STYLES[mapStyle];
  const isDark = mapStyle === 'dark' || mapStyle === 'satellite' || mapStyle === 'blueprint';

  // Filter sites
  const filteredSites = useMemo(() => {
    if (!selectedElement) return SITES;
    return SITES.filter(s => 
      s.primary.symbol === selectedElement || 
      s.secondary?.some(sec => sec.symbol === selectedElement)
    );
  }, [selectedElement]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = accessToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: currentStyle.baseStyle,
        center: [20, 20],
        zoom: 1.5,
        projection: isGlobe ? 'globe' : 'mercator',
      });

      // Set fog after map creation (can't be in constructor options)
      if (isGlobe) {
        map.current.setFog({
          color: isDark ? '#08080c' : '#f8f8f8',
          'high-color': isDark ? '#1a1a2e' : '#ffffff',
          'horizon-blend': 0.02,
          'space-color': isDark ? '#000000' : '#f0f0f0',
          'star-intensity': isDark ? 0.6 : 0,
        });
      }

      map.current.on('load', () => setIsLoaded(true));
      map.current.on('click', () => setSelectedSite(null));
      map.current.on('error', (e) => console.error('Mapbox error:', e));
    } catch (error) {
      console.error('Failed to initialize Mapbox:', error);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // Update style
  useEffect(() => {
    if (!map.current || !isLoaded) return;
    map.current.setStyle(currentStyle.baseStyle);
    
    // Update fog for globe
    map.current.once('style.load', () => {
      if (isGlobe && map.current) {
        map.current.setFog({
          color: isDark ? '#08080c' : '#f8f8f8',
          'high-color': isDark ? '#1a1a2e' : '#ffffff',
          'horizon-blend': 0.02,
          'space-color': isDark ? '#000000' : '#f0f0f0',
          'star-intensity': isDark ? 0.6 : 0,
        });
      }
    });
  }, [mapStyle, isLoaded]);

  // Get element color
  const getColor = useCallback((symbol: string) => {
    const el = ELEMENTS.find(e => e.symbol === symbol);
    return el?.color || '#888888';
  }, []);

  const getGlow = useCallback((symbol: string) => {
    const el = ELEMENTS.find(e => e.symbol === symbol);
    return el?.glowColor || 'rgba(136,136,136,0.5)';
  }, []);

  // Create markers
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filteredSites.forEach((site, i) => {
      const color = getColor(site.primary.symbol);
      const glow = getGlow(site.primary.symbol);
      const size = site.scale === 'mega' ? 20 : site.scale === 'large' ? 16 : 12;

      const el = document.createElement('div');
      el.innerHTML = `
        <div class="marker-container" style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
          cursor: pointer;
        ">
          <!-- Glow layer -->
          <div class="marker-glow" style="
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            background: radial-gradient(circle, ${glow} 0%, transparent 70%);
            opacity: ${currentStyle.markerStyle.glow ? '0.8' : '0'};
            animation: pulse 3s ease-in-out infinite;
            animation-delay: ${i * 100}ms;
          "></div>
          
          <!-- Main marker -->
          <div class="marker-main" style="
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: ${color};
            border: 2px solid ${currentStyle.markerStyle.border};
            box-shadow: 
              0 2px 8px ${currentStyle.markerStyle.shadow},
              0 0 0 0 ${color};
            transform: scale(0);
            animation: appear 0.5s ease-out forwards;
            animation-delay: ${Math.min(i * 30, 800)}ms;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          "></div>
          
          <!-- Inner shine -->
          <div style="
            position: absolute;
            top: 2px;
            left: 2px;
            right: 50%;
            bottom: 50%;
            border-radius: 50% 50% 0 0;
            background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%);
            opacity: 0;
            animation: appear 0.5s ease-out forwards;
            animation-delay: ${Math.min(i * 30, 800) + 200}ms;
          "></div>
        </div>
        
        <style>
          @keyframes appear {
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.3); opacity: 0.4; }
          }
        </style>
      `;

      const mainMarker = el.querySelector('.marker-main') as HTMLElement;
      const container = el.querySelector('.marker-container') as HTMLElement;

      container.addEventListener('mouseenter', () => {
        mainMarker.style.transform = 'scale(1.5)';
        mainMarker.style.boxShadow = `0 4px 20px ${currentStyle.markerStyle.shadow}, 0 0 30px ${glow}`;
      });

      container.addEventListener('mouseleave', () => {
        mainMarker.style.transform = 'scale(1)';
        mainMarker.style.boxShadow = `0 2px 8px ${currentStyle.markerStyle.shadow}`;
      });

      container.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedSite(site);
        map.current?.flyTo({
          center: site.coordinates,
          zoom: 6,
          duration: 2000,
          essential: true,
        });
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(site.coordinates)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [filteredSites, isLoaded, currentStyle, getColor, getGlow]);

  const selectedElementData = selectedElement 
    ? ELEMENTS.find(e => e.symbol === selectedElement) 
    : null;

  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ background: currentStyle.ui.bg }}>
      {/* Floating Header */}
      <div 
        className="absolute top-4 left-4 right-4 z-30 rounded-2xl backdrop-blur-xl border"
        style={{ 
          background: currentStyle.ui.bg,
          borderColor: currentStyle.ui.border,
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Title */}
            <div>
              <h1 
                className="text-2xl md:text-3xl font-extralight tracking-tight"
                style={{ color: currentStyle.ui.text }}
              >
                Where We Extract
              </h1>
              <p 
                className="text-sm mt-0.5"
                style={{ color: currentStyle.ui.textMuted }}
              >
                The origins of the elements that power civilization
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Element Pills */}
              <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                <button
                  onClick={() => setSelectedElement(null)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    !selectedElement 
                      ? 'bg-black text-white shadow-lg' 
                      : ''
                  }`}
                  style={!selectedElement ? {} : { color: currentStyle.ui.textMuted }}
                >
                  All
                </button>
                {ELEMENTS.slice(0, 6).map(el => (
                  <button
                    key={el.symbol}
                    onClick={() => setSelectedElement(selectedElement === el.symbol ? null : el.symbol)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedElement === el.symbol ? 'shadow-lg' : ''
                    }`}
                    style={{
                      background: selectedElement === el.symbol ? el.color : 'transparent',
                      color: selectedElement === el.symbol ? '#fff' : currentStyle.ui.textMuted,
                    }}
                  >
                    <span className="font-mono text-xs">{el.symbol}</span>
                  </button>
                ))}
              </div>

              {/* What's In Your Button */}
              <button
                onClick={() => setShowWhatsIn(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #e6007e 0%, #ff4d94 100%)',
                  color: '#fff',
                  boxShadow: '0 4px 15px rgba(230,0,126,0.3)',
                }}
              >
                What's In Your...
              </button>
            </div>
          </div>

          {/* Style Switcher */}
          <div className="flex items-center gap-3 mt-4">
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: currentStyle.ui.textMuted }}
            >
              Style
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(CUSTOM_STYLES).map(([key, style]) => (
                <button
                  key={key}
                  onClick={() => setMapStyle(key as MapStyleKey)}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                    mapStyle === key
                      ? 'bg-white text-black shadow-sm'
                      : isDark ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-black/10 text-black/70 hover:bg-black/20'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>

            {/* Globe toggle */}
            <div className="ml-4 flex items-center gap-2">
              <span className="text-xs" style={{ color: currentStyle.ui.textMuted }}>Globe</span>
              <button
                onClick={() => {
                  setIsGlobe(!isGlobe);
                  if (map.current) {
                    map.current.setProjection(isGlobe ? 'mercator' : 'globe');
                  }
                }}
                className={`w-10 h-6 rounded-full transition-all ${isGlobe ? 'bg-green-500' : ''}`}
                style={{ background: isGlobe ? '#22c55e' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}
              >
                <div 
                  className="w-4 h-4 rounded-full bg-white shadow-md transition-transform mx-1"
                  style={{ transform: isGlobe ? 'translateX(16px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" style={{ minHeight: '100vh' }} />

      {/* Stats Bar */}
      <div 
        className="absolute bottom-4 left-4 right-4 z-30 rounded-2xl backdrop-blur-xl border"
        style={{ 
          background: currentStyle.ui.bg,
          borderColor: currentStyle.ui.border,
        }}
      >
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: currentStyle.ui.textMuted }}>Sites</span>
              <div className="font-mono text-2xl font-bold" style={{ color: currentStyle.ui.text }}>
                {filteredSites.length}
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: currentStyle.ui.textMuted }}>Countries</span>
              <div className="font-mono text-2xl font-bold" style={{ color: currentStyle.ui.text }}>
                {new Set(filteredSites.map(s => s.countryCode)).size}
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: currentStyle.ui.textMuted }}>Elements</span>
              <div className="font-mono text-2xl font-bold" style={{ color: currentStyle.ui.text }}>
                {selectedElement ? 1 : ELEMENTS.length}
              </div>
            </div>
          </div>

          {selectedElement && (
            <button
              onClick={() => setSelectedElement(null)}
              className="text-sm px-4 py-2 rounded-lg transition-colors"
              style={{ 
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: currentStyle.ui.textMuted,
              }}
            >
              Clear filter ×
            </button>
          )}
        </div>
      </div>

      {/* Element Panel */}
      {selectedElementData && (
        <ElementPanel 
          element={selectedElementData}
          style={currentStyle}
          onClose={() => setSelectedElement(null)}
        />
      )}

      {/* Site Panel */}
      {selectedSite && (
        <SitePanel 
          site={selectedSite}
          style={currentStyle}
          getColor={getColor}
          onClose={() => setSelectedSite(null)}
        />
      )}

      {/* What's In Modal */}
      {showWhatsIn && (
        <WhatsInModal 
          onClose={() => setShowWhatsIn(false)}
          onSelectElement={(sym) => {
            setSelectedElement(sym);
            setShowWhatsIn(false);
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// ELEMENT PANEL
// ============================================================================

function ElementPanel({ 
  element, 
  style, 
  onClose 
}: { 
  element: ElementData;
  style: typeof CUSTOM_STYLES[MapStyleKey];
  onClose: () => void;
}) {
  return (
    <div 
      className="absolute top-28 left-4 z-40 w-80 rounded-2xl overflow-hidden backdrop-blur-xl border shadow-2xl animate-slideIn"
      style={{ 
        background: style.ui.panel,
        borderColor: style.ui.border,
      }}
    >
      {/* Header */}
      <div 
        className="p-5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${element.color}20 0%, transparent 100%)` }}
      >
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-mono text-2xl font-bold text-white shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${element.color} 0%, ${element.color}cc 100%)`,
                boxShadow: `0 8px 32px ${element.glowColor}`,
              }}
            >
              {element.symbol}
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: style.ui.text }}>
                {element.name}
              </h2>
              <p className="text-sm" style={{ color: style.ui.textMuted }}>
                {element.category}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-black/10"
            style={{ color: style.ui.textMuted }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        <p className="text-sm leading-relaxed" style={{ color: style.ui.text }}>
          {element.description}
        </p>

        {/* Top Producers */}
        <div>
          <h3 className="text-xs uppercase tracking-widest mb-3" style={{ color: style.ui.textMuted }}>
            Top Producers
          </h3>
          <div className="space-y-3">
            {element.topProducers.map((p, i) => (
              <div key={p.country} className="flex items-center gap-3">
                <span 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ 
                    background: element.color,
                    color: '#fff',
                  }}
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: style.ui.border }}>
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${p.percentage}%`,
                        background: `linear-gradient(90deg, ${element.color} 0%, ${element.color}88 100%)`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm w-20" style={{ color: style.ui.text }}>{p.country}</span>
                <span className="font-mono text-sm w-12 text-right" style={{ color: style.ui.textMuted }}>
                  {p.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Fact */}
        {element.funFact && (
          <div 
            className="p-4 rounded-xl"
            style={{ background: `${element.color}15` }}
          >
            <p className="text-sm italic" style={{ color: style.ui.text }}>
              💡 {element.funFact}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: `1px solid ${style.ui.border}` }}>
          <div>
            <div className="text-xs" style={{ color: style.ui.textMuted }}>Sites</div>
            <div className="font-mono text-xl font-bold" style={{ color: style.ui.text }}>
              {element.totalSites}
            </div>
          </div>
          <div>
            <div className="text-xs" style={{ color: style.ui.textMuted }}>Annual</div>
            <div className="font-mono text-sm" style={{ color: style.ui.text }}>
              {element.annualProduction}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}

// ============================================================================
// SITE PANEL
// ============================================================================

function SitePanel({ 
  site, 
  style,
  getColor,
  onClose 
}: { 
  site: ExtractionSite;
  style: typeof CUSTOM_STYLES[MapStyleKey];
  getColor: (sym: string) => string;
  onClose: () => void;
}) {
  const color = getColor(site.primary.symbol);

  return (
    <div 
      className="absolute top-28 right-4 z-40 w-96 rounded-2xl overflow-hidden backdrop-blur-xl border shadow-2xl animate-slideIn"
      style={{ 
        background: style.ui.panel,
        borderColor: style.ui.border,
      }}
    >
      {/* Header with site image placeholder */}
      <div 
        className="h-32 relative"
        style={{ 
          background: `linear-gradient(135deg, ${color}40 0%, ${color}10 100%)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-30">⛏️</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                background: site.status === 'active' ? '#22c55e' : '#f59e0b',
                boxShadow: site.status === 'active' ? '0 0 10px #22c55e' : undefined,
              }}
            />
            <span className="text-xs uppercase tracking-wider text-white/80">{site.status}</span>
            {site.scale === 'mega' && (
              <span className="px-2 py-0.5 rounded text-xs bg-white/20 text-white ml-auto">
                MEGA SITE
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-black/30 hover:bg-black/50 transition-colors text-white"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: style.ui.text }}>
            {site.name}
          </h2>
          <p className="text-sm" style={{ color: style.ui.textMuted }}>
            {site.country} {site.region && `· ${site.region}`}
          </p>
        </div>

        {/* Primary Element */}
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: `${color}15` }}>
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center font-mono text-lg font-bold text-white"
            style={{ background: color }}
          >
            {site.primary.symbol}
          </div>
          <div className="flex-1">
            <div className="font-medium" style={{ color: style.ui.text }}>{site.primary.element}</div>
            {site.primary.production && (
              <div className="font-mono text-sm" style={{ color: style.ui.textMuted }}>
                {site.primary.production.toLocaleString()} {site.primary.unit}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: style.ui.text }}>
          {site.description}
        </p>

        {/* Significance */}
        {site.significance && (
          <div 
            className="p-4 rounded-xl border-l-4"
            style={{ 
              background: `${color}10`,
              borderColor: color,
            }}
          >
            <p className="text-sm italic" style={{ color: style.ui.text }}>
              "{site.significance}"
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs" style={{ color: style.ui.textMuted }}>Type</div>
            <div className="text-sm capitalize" style={{ color: style.ui.text }}>
              {site.type.replace('-', ' ')}
            </div>
          </div>
          {site.operator && (
            <div>
              <div className="text-xs" style={{ color: style.ui.textMuted }}>Operator</div>
              <div className="text-sm" style={{ color: style.ui.text }}>{site.operator}</div>
            </div>
          )}
          {site.startYear && (
            <div>
              <div className="text-xs" style={{ color: style.ui.textMuted }}>Since</div>
              <div className="font-mono text-sm" style={{ color: style.ui.text }}>{site.startYear}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${style.ui.border}` }}>
          <span className="font-mono text-xs" style={{ color: style.ui.textMuted }}>
            {site.coordinates[1].toFixed(4)}°, {site.coordinates[0].toFixed(4)}°
          </span>
          <a
            href={`https://www.google.com/maps?q=${site.coordinates[1]},${site.coordinates[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors"
            style={{ color }}
          >
            Open in Maps →
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}

// ============================================================================
// WHAT'S IN YOUR MODAL
// ============================================================================

function WhatsInModal({ 
  onClose,
  onSelectElement,
}: { 
  onClose: () => void;
  onSelectElement: (sym: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const product = PRODUCTS.find(p => p.id === selected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose} />
      
      <div className="relative bg-[#0a0a0f] rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-white/10 shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extralight text-white">What's In Your...</h2>
              <p className="text-white/50 mt-1">
                Every object connects to the Earth
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-xl hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
          {!selected ? (
            <div className="grid grid-cols-3 gap-6">
              {PRODUCTS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className="group flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all animate-fadeInUp"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-6xl group-hover:scale-125 transition-transform duration-300">
                    {p.icon}
                  </span>
                  <div className="text-center">
                    <div className="text-lg font-medium text-white">{p.name}</div>
                    <div className="text-xs text-white/40 mt-1">{p.tagline}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="animate-fadeIn">
              <button
                onClick={() => setSelected(null)}
                className="text-white/50 hover:text-white transition-colors mb-6 flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Back
              </button>

              <div className="flex items-start gap-6 mb-8">
                <span className="text-7xl">{product!.icon}</span>
                <div>
                  <h3 className="text-3xl font-light text-white">{product!.name}</h3>
                  <p className="text-white/50 mt-2">{product!.tagline}</p>
                </div>
              </div>

              <div className="space-y-4">
                {product!.elements.map((el, i) => {
                  const elementData = ELEMENTS.find(e => e.symbol === el.symbol);
                  return (
                    <button
                      key={el.symbol}
                      onClick={() => onSelectElement(el.symbol)}
                      className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left group animate-fadeInUp"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center font-mono text-xl font-bold text-white shadow-lg"
                        style={{ 
                          background: elementData?.color || '#888',
                          boxShadow: `0 4px 20px ${elementData?.glowColor || 'transparent'}`,
                        }}
                      >
                        {el.symbol}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium">{el.name}</span>
                          <span className="text-white/30">→</span>
                          <span className="text-white/50">{el.part}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {el.countries.map(c => (
                            <span key={c.code} className="text-sm text-white/40">
                              {c.name}{c.percentage ? ` (${c.percentage}%)` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                      {el.amount && (
                        <span className="font-mono text-sm text-white/30">{el.amount}</span>
                      )}
                      <svg className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" viewBox="0 0 20 20" fill="none">
                        <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.4s ease-out both; }
      `}</style>
    </div>
  );
}