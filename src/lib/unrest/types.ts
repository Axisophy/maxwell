// Unrest data types

export interface LightningStrike {
  id: string;
  lat: number;
  lng: number;
  timestamp: number;
  intensity: number;
  type: 'cloud-ground' | 'cloud-cloud';
}

export interface LightningData {
  strikes: LightningStrike[];
  stats: {
    strikesPerMinute: number;
    activeCells: number;
    mostActiveRegion: string;
    coverage: string;
  };
  lastUpdated: string;
}

export interface Earthquake {
  id: string;
  lat: number;
  lng: number;
  depth: number;
  magnitude: number;
  place: string;
  time: number;
  url: string;
}

export interface SeismicStation {
  code: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  waveform: number[];
  lastUpdate: number;
}

export interface SeismicData {
  stations: SeismicStation[];
  recentEvents: Earthquake[];
  stats: {
    eventsLast24h: number;
    largestMagnitude: number;
    largestLocation: string;
  };
  lastUpdated: string;
}

export interface Storm {
  id: string;
  name: string;
  type: 'hurricane' | 'typhoon' | 'cyclone' | 'tropical-storm';
  category: number | null;
  lat: number;
  lng: number;
  windSpeed: number;
  pressure: number;
  movement: string;
}

export interface Volcano {
  id: string;
  name: string;
  lat: number;
  lng: number;
  alertLevel: 'green' | 'yellow' | 'orange' | 'red';
  country: string;
}

export interface UnrestMapData {
  lightning: LightningStrike[];
  earthquakes: Earthquake[];
  storms: Storm[];
  volcanoes: Volcano[];
  lastUpdated: string;
}

export type UnrestLayer = 'lightning' | 'seismic' | 'storms' | 'volcanic';
