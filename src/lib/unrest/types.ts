// Unrest data types

export interface LightningStrike {
  id: string;
  lat: number;
  lng: number;
  timestamp: number; // Unix ms
  intensity: number; // 0-1
  type: 'cloud-ground' | 'cloud-cloud';
}

export interface LightningData {
  strikes: LightningStrike[];
  stats: {
    strikesPerMinute: number;
    activeCells: number;
    mostActiveRegion: string;
    coverage: string; // e.g., "Americas"
  };
  lastUpdated: string;
}

export interface Earthquake {
  id: string;
  lat: number;
  lng: number;
  depth: number; // km
  magnitude: number;
  place: string;
  time: number; // Unix ms
  url: string;
}

export interface SeismicStation {
  code: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  waveform: number[]; // Normalized values -1 to 1
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
  windSpeed: number; // mph
  pressure: number; // mb
  movement: string;
  forecast: { lat: number; lng: number; time: number }[];
}

export interface StormData {
  active: Storm[];
  stats: {
    activeCount: number;
    strongestName: string;
    strongestCategory: number | null;
  };
  lastUpdated: string;
}

export interface Volcano {
  id: string;
  name: string;
  lat: number;
  lng: number;
  alertLevel: 'green' | 'yellow' | 'orange' | 'red';
  lastEruption: string | null;
  country: string;
}

export interface VolcanicData {
  active: Volcano[];
  stats: {
    alertCount: number;
    redAlerts: number;
  };
  lastUpdated: string;
}

export interface UnrestSummary {
  lightning: {
    strikesPerMinute: number;
    activeCells: number;
  };
  seismic: {
    eventsLast24h: number;
    largestMagnitude: number;
    largestLocation: string;
  };
  storms: {
    activeCount: number;
  };
  volcanic: {
    alertCount: number;
  };
  lastUpdated: string;
}

export type UnrestView = 'all' | 'lightning' | 'seismic' | 'storms' | 'volcanic' | 'extremes';
