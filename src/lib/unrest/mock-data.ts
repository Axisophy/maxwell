// Mock data generators for Unrest

import { 
  LightningStrike, 
  LightningData, 
  SeismicStation, 
  SeismicData, 
  Earthquake,
  Storm,
  Volcano,
  UnrestMapData
} from './types';

// Storm cells for lightning generation
const STORM_CELLS = [
  { lat: 25.5, lng: -90.5, name: 'Gulf of Mexico' },
  { lat: 10.0, lng: -65.0, name: 'Caribbean' },
  { lat: -5.0, lng: -60.0, name: 'Amazon Basin' },
  { lat: 35.0, lng: -95.0, name: 'Central US' },
  { lat: -25.0, lng: -55.0, name: 'South America' },
  { lat: 5.0, lng: 25.0, name: 'Central Africa' },
  { lat: -10.0, lng: 130.0, name: 'Northern Australia' },
  { lat: 25.0, lng: 80.0, name: 'Bay of Bengal' },
];

export function generateMockLightning(): LightningData {
  const now = Date.now();
  const strikes: LightningStrike[] = [];
  
  // Pick 3-5 active cells
  const activeCells = STORM_CELLS
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 3);
  
  activeCells.forEach(cell => {
    const strikeCount = Math.floor(Math.random() * 80) + 20;
    for (let i = 0; i < strikeCount; i++) {
      strikes.push({
        id: `strike-${now}-${Math.random().toString(36).substr(2, 9)}`,
        lat: cell.lat + (Math.random() - 0.5) * 6,
        lng: cell.lng + (Math.random() - 0.5) * 6,
        timestamp: now - Math.random() * 300000,
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
      coverage: 'Global',
    },
    lastUpdated: new Date().toISOString(),
  };
}

// Seismic stations
const SEISMIC_STATIONS = [
  { code: 'BFO', name: 'Black Forest Observatory', location: 'Germany', lat: 48.33, lng: 8.33 },
  { code: 'HRV', name: 'Harvard', location: 'USA', lat: 42.51, lng: -71.56 },
  { code: 'ANMO', name: 'Albuquerque', location: 'USA', lat: 34.95, lng: -106.46 },
  { code: 'KEV', name: 'Kevo', location: 'Finland', lat: 69.76, lng: 27.01 },
  { code: 'CTAO', name: 'Charters Towers', location: 'Australia', lat: -20.09, lng: 146.25 },
  { code: 'TATO', name: 'Taipei', location: 'Taiwan', lat: 24.97, lng: 121.49 },
  { code: 'LPAZ', name: 'La Paz', location: 'Bolivia', lat: -16.29, lng: -68.13 },
  { code: 'KONO', name: 'Kongsberg', location: 'Norway', lat: 59.65, lng: 9.60 },
  { code: 'LSZ', name: 'Lusaka', location: 'Zambia', lat: -15.28, lng: 28.19 },
];

const EARTHQUAKE_REGIONS = [
  { place: 'Chile', lat: -33.45, lng: -70.67 },
  { place: 'Japan', lat: 35.68, lng: 139.69 },
  { place: 'Indonesia', lat: -6.21, lng: 106.85 },
  { place: 'Alaska', lat: 61.22, lng: -149.90 },
  { place: 'California', lat: 36.78, lng: -119.42 },
  { place: 'New Zealand', lat: -41.29, lng: 174.78 },
  { place: 'Peru', lat: -12.05, lng: -77.04 },
  { place: 'Philippines', lat: 14.60, lng: 120.98 },
  { place: 'Turkey', lat: 39.93, lng: 32.86 },
  { place: 'Iran', lat: 35.69, lng: 51.39 },
];

function generateWaveform(length: number = 100): number[] {
  const waveform: number[] = [];
  let value = 0;
  
  for (let i = 0; i < length; i++) {
    value += (Math.random() - 0.5) * 0.15;
    value *= 0.97;
    if (Math.random() > 0.95) {
      value += (Math.random() - 0.5) * 0.6;
    }
    waveform.push(Math.max(-1, Math.min(1, value)));
  }
  
  return waveform;
}

export function generateMockSeismic(): SeismicData {
  const now = Date.now();
  
  const stations: SeismicStation[] = SEISMIC_STATIONS.map(s => ({
    ...s,
    waveform: generateWaveform(100),
    lastUpdate: now,
  }));
  
  const eventCount = Math.floor(Math.random() * 20) + 25;
  const recentEvents: Earthquake[] = [];
  
  for (let i = 0; i < eventCount; i++) {
    const loc = EARTHQUAKE_REGIONS[Math.floor(Math.random() * EARTHQUAKE_REGIONS.length)];
    const magnitude = Math.random() * 3.5 + 4;
    
    recentEvents.push({
      id: `eq-${now}-${i}`,
      lat: loc.lat + (Math.random() - 0.5) * 8,
      lng: loc.lng + (Math.random() - 0.5) * 8,
      depth: Math.floor(Math.random() * 150) + 10,
      magnitude: Math.round(magnitude * 10) / 10,
      place: `${Math.floor(Math.random() * 100 + 10)}km ${['N', 'S', 'E', 'W'][Math.floor(Math.random() * 4)]} of ${loc.place}`,
      time: now - Math.random() * 86400000,
      url: '#',
    });
  }
  
  recentEvents.sort((a, b) => b.time - a.time);
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

export function generateMockStorms(): Storm[] {
  const stormCount = Math.random() > 0.4 ? Math.floor(Math.random() * 3) + 1 : 0;
  const names = ['Alpha', 'Beta', 'Gamma', 'Delta'];
  const storms: Storm[] = [];
  
  for (let i = 0; i < stormCount; i++) {
    const isHurricane = Math.random() > 0.4;
    storms.push({
      id: `storm-${i}`,
      name: names[i],
      type: isHurricane ? 'hurricane' : 'tropical-storm',
      category: isHurricane ? Math.floor(Math.random() * 5) + 1 : null,
      lat: 15 + Math.random() * 20,
      lng: -60 - Math.random() * 50,
      windSpeed: 50 + Math.random() * 100,
      pressure: 950 + Math.random() * 50,
      movement: `${['N', 'NW', 'W'][Math.floor(Math.random() * 3)]} at ${Math.floor(Math.random() * 15 + 5)} mph`,
    });
  }
  
  return storms;
}

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

export function generateMockVolcanoes(): Volcano[] {
  const alertLevels: ('green' | 'yellow' | 'orange' | 'red')[] = ['green', 'yellow', 'orange', 'red'];
  
  return VOLCANOES.map((v, i) => ({
    id: `volcano-${i}`,
    ...v,
    alertLevel: alertLevels[Math.floor(Math.random() * (Math.random() > 0.7 ? 4 : 2))],
  }));
}

export function generateMockMapData(): UnrestMapData {
  const lightning = generateMockLightning();
  const seismic = generateMockSeismic();
  
  return {
    lightning: lightning.strikes,
    earthquakes: seismic.recentEvents,
    storms: generateMockStorms(),
    volcanoes: generateMockVolcanoes(),
    lastUpdated: new Date().toISOString(),
  };
}
