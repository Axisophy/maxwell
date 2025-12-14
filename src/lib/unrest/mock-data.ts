// Mock data generators for Unrest
// These simulate real data until we connect actual APIs

import { 
  LightningStrike, 
  LightningData, 
  SeismicStation, 
  SeismicData, 
  Earthquake,
  Storm,
  StormData,
  Volcano,
  VolcanicData,
  UnrestSummary 
} from './types';

// Generate random lightning strikes in the Americas
export function generateMockLightning(): LightningData {
  const now = Date.now();
  const strikes: LightningStrike[] = [];
  
  // Generate clusters of strikes (storm cells)
  const stormCells = [
    { lat: 25.5, lng: -90.5, name: 'Gulf of Mexico' },
    { lat: 10.0, lng: -65.0, name: 'Caribbean' },
    { lat: -5.0, lng: -60.0, name: 'Amazon Basin' },
    { lat: 35.0, lng: -95.0, name: 'Central US' },
    { lat: -25.0, lng: -55.0, name: 'South America' },
  ];
  
  // Pick 2-4 active cells
  const activeCells = stormCells
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 2);
  
  // Generate strikes for each cell
  activeCells.forEach(cell => {
    const strikeCount = Math.floor(Math.random() * 50) + 10;
    for (let i = 0; i < strikeCount; i++) {
      strikes.push({
        id: `strike-${now}-${Math.random().toString(36).substr(2, 9)}`,
        lat: cell.lat + (Math.random() - 0.5) * 4,
        lng: cell.lng + (Math.random() - 0.5) * 4,
        timestamp: now - Math.random() * 300000, // Last 5 minutes
        intensity: Math.random() * 0.7 + 0.3,
        type: Math.random() > 0.3 ? 'cloud-ground' : 'cloud-cloud',
      });
    }
  });
  
  const mostActive = activeCells[Math.floor(Math.random() * activeCells.length)];
  
  return {
    strikes,
    stats: {
      strikesPerMinute: Math.floor(strikes.length / 5 * 60),
      activeCells: activeCells.length,
      mostActiveRegion: mostActive.name,
      coverage: 'Americas',
    },
    lastUpdated: new Date().toISOString(),
  };
}

// Generate mock seismic waveforms
function generateWaveform(length: number = 100): number[] {
  const waveform: number[] = [];
  let value = 0;
  
  for (let i = 0; i < length; i++) {
    // Random walk with occasional spikes
    value += (Math.random() - 0.5) * 0.1;
    value *= 0.98; // Decay
    
    // Occasional larger movements
    if (Math.random() > 0.95) {
      value += (Math.random() - 0.5) * 0.5;
    }
    
    waveform.push(Math.max(-1, Math.min(1, value)));
  }
  
  return waveform;
}

// Mock seismic stations
const SEISMIC_STATIONS = [
  { code: 'BFO', name: 'Black Forest Observatory', location: 'Germany', lat: 48.33, lng: 8.33 },
  { code: 'HRV', name: 'Harvard, MA', location: 'USA', lat: 42.51, lng: -71.56 },
  { code: 'ANMO', name: 'Albuquerque, NM', location: 'USA', lat: 34.95, lng: -106.46 },
  { code: 'KEV', name: 'Kevo', location: 'Finland', lat: 69.76, lng: 27.01 },
  { code: 'CTAO', name: 'Charters Towers', location: 'Australia', lat: -20.09, lng: 146.25 },
  { code: 'TATO', name: 'Taipei', location: 'Taiwan', lat: 24.97, lng: 121.49 },
  { code: 'LPAZ', name: 'La Paz', location: 'Bolivia', lat: -16.29, lng: -68.13 },
  { code: 'KONO', name: 'Kongsberg', location: 'Norway', lat: 59.65, lng: 9.60 },
  { code: 'LSZ', name: 'Lusaka', location: 'Zambia', lat: -15.28, lng: 28.19 },
];

// Mock recent earthquakes
const EARTHQUAKE_LOCATIONS = [
  { place: 'Chile', lat: -33.45, lng: -70.67 },
  { place: 'Japan', lat: 35.68, lng: 139.69 },
  { place: 'Indonesia', lat: -6.21, lng: 106.85 },
  { place: 'Alaska', lat: 61.22, lng: -149.90 },
  { place: 'California', lat: 36.78, lng: -119.42 },
  { place: 'New Zealand', lat: -41.29, lng: 174.78 },
  { place: 'Peru', lat: -12.05, lng: -77.04 },
  { place: 'Philippines', lat: 14.60, lng: 120.98 },
];

export function generateMockSeismic(): SeismicData {
  const now = Date.now();
  
  // Generate waveforms for stations
  const stations: SeismicStation[] = SEISMIC_STATIONS.map(s => ({
    ...s,
    waveform: generateWaveform(100),
    lastUpdate: now,
  }));
  
  // Generate recent earthquakes
  const eventCount = Math.floor(Math.random() * 15) + 30; // 30-45 events
  const recentEvents: Earthquake[] = [];
  
  for (let i = 0; i < eventCount; i++) {
    const loc = EARTHQUAKE_LOCATIONS[Math.floor(Math.random() * EARTHQUAKE_LOCATIONS.length)];
    const magnitude = Math.random() * 3 + 4; // 4.0 - 7.0
    
    recentEvents.push({
      id: `eq-${now}-${i}`,
      lat: loc.lat + (Math.random() - 0.5) * 5,
      lng: loc.lng + (Math.random() - 0.5) * 5,
      depth: Math.floor(Math.random() * 100) + 10,
      magnitude: Math.round(magnitude * 10) / 10,
      place: `${Math.floor(Math.random() * 100 + 10)}km ${['N', 'S', 'E', 'W'][Math.floor(Math.random() * 4)]} of ${loc.place}`,
      time: now - Math.random() * 86400000, // Last 24 hours
      url: '#',
    });
  }
  
  // Sort by time, newest first
  recentEvents.sort((a, b) => b.time - a.time);
  
  // Find largest
  const largest = recentEvents.reduce((max, eq) => eq.magnitude > max.magnitude ? eq : max, recentEvents[0]);
  
  return {
    stations,
    recentEvents,
    stats: {
      eventsLast24h: recentEvents.length,
      largestMagnitude: largest.magnitude,
      largestLocation: largest.place.split(' of ')[1] || largest.place,
    },
    lastUpdated: new Date().toISOString(),
  };
}

// Mock storm data
export function generateMockStorms(): StormData {
  const now = Date.now();
  
  // Sometimes there are no storms, sometimes a few
  const stormCount = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
  
  const stormNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
  const active: Storm[] = [];
  
  for (let i = 0; i < stormCount; i++) {
    const isHurricane = Math.random() > 0.4;
    const category = isHurricane ? Math.floor(Math.random() * 5) + 1 : null;
    
    active.push({
      id: `storm-${i}`,
      name: stormNames[i],
      type: isHurricane ? 'hurricane' : 'tropical-storm',
      category,
      lat: 15 + Math.random() * 15,
      lng: -60 - Math.random() * 40,
      windSpeed: category ? 74 + category * 20 : 50 + Math.random() * 20,
      pressure: category ? 980 - category * 10 : 1000 - Math.random() * 15,
      movement: `${['N', 'NW', 'W', 'NE'][Math.floor(Math.random() * 4)]} at ${Math.floor(Math.random() * 15 + 5)} mph`,
      forecast: [],
    });
  }
  
  const strongest = active.length > 0 
    ? active.reduce((max, s) => (s.category || 0) > (max.category || 0) ? s : max, active[0])
    : null;
  
  return {
    active,
    stats: {
      activeCount: active.length,
      strongestName: strongest?.name || 'None',
      strongestCategory: strongest?.category || null,
    },
    lastUpdated: new Date().toISOString(),
  };
}

// Mock volcanic data
const VOLCANOES = [
  { name: 'Kilauea', country: 'USA', lat: 19.41, lng: -155.29 },
  { name: 'Mount Etna', country: 'Italy', lat: 37.75, lng: 14.99 },
  { name: 'Stromboli', country: 'Italy', lat: 38.79, lng: 15.21 },
  { name: 'Sakurajima', country: 'Japan', lat: 31.58, lng: 130.66 },
  { name: 'Popocatépetl', country: 'Mexico', lat: 19.02, lng: -98.62 },
  { name: 'Merapi', country: 'Indonesia', lat: -7.54, lng: 110.45 },
  { name: 'Fuego', country: 'Guatemala', lat: 14.47, lng: -90.88 },
  { name: 'Piton de la Fournaise', country: 'Réunion', lat: -21.23, lng: 55.71 },
];

export function generateMockVolcanic(): VolcanicData {
  const alertLevels: ('green' | 'yellow' | 'orange' | 'red')[] = ['green', 'yellow', 'orange', 'red'];
  
  const active: Volcano[] = VOLCANOES.map((v, i) => ({
    id: `volcano-${i}`,
    ...v,
    alertLevel: alertLevels[Math.floor(Math.random() * (Math.random() > 0.7 ? 4 : 2))],
    lastEruption: Math.random() > 0.5 ? '2024' : null,
  }));
  
  const elevated = active.filter(v => v.alertLevel !== 'green');
  const redAlerts = active.filter(v => v.alertLevel === 'red');
  
  return {
    active,
    stats: {
      alertCount: elevated.length,
      redAlerts: redAlerts.length,
    },
    lastUpdated: new Date().toISOString(),
  };
}

// Combined summary
export function generateMockSummary(): UnrestSummary {
  const lightning = generateMockLightning();
  const seismic = generateMockSeismic();
  const storms = generateMockStorms();
  const volcanic = generateMockVolcanic();
  
  return {
    lightning: {
      strikesPerMinute: lightning.stats.strikesPerMinute,
      activeCells: lightning.stats.activeCells,
    },
    seismic: {
      eventsLast24h: seismic.stats.eventsLast24h,
      largestMagnitude: seismic.stats.largestMagnitude,
      largestLocation: seismic.stats.largestLocation,
    },
    storms: {
      activeCount: storms.stats.activeCount,
    },
    volcanic: {
      alertCount: volcanic.stats.alertCount,
    },
    lastUpdated: new Date().toISOString(),
  };
}
