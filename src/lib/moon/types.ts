// Types for Lunar Atlas exploration page

export interface LunarFeature {
  id: string;
  name: string;
  type: FeatureType;
  category: FeatureCategory;
  coordinates: [number, number]; // [lat, lng] in selenographic coordinates
  properties: FeatureProperties;
}

export type FeatureType =
  | 'mare'
  | 'crater'
  | 'mountain'
  | 'rille'
  | 'landing-site'
  | 'eva-route'
  | 'sample-point'
  | 'rover-traverse';

export type FeatureCategory =
  | 'geography'
  | 'geology'
  | 'apollo'
  | 'soviet'
  | 'modern'
  | 'science'
  | 'future';

export interface FeatureProperties {
  description?: string;
  diameter?: number;       // km, for craters
  area?: number;           // km², for maria
  elevation?: number;      // m, for mountains
  mission?: string;        // Apollo 11, Luna 17, etc.
  date?: string;           // ISO date
  crew?: string[];
  duration?: string;
  samples?: number;        // kg collected
  distance?: number;       // km traveled (for traverses)
  dataPageUrl?: string;    // Link to /data/moon/[feature]
  externalUrl?: string;    // Link to NASA, etc.
  imageUrl?: string;
}

export interface LunarLayer {
  id: string;
  name: string;
  category: FeatureCategory;
  visible: boolean;
  color: string;
  icon?: string;
}

export interface LayerGroup {
  id: string;
  name: string;
  layers: LunarLayer[];
  expanded: boolean;
}

// Apollo mission data
export interface ApolloMission {
  id: string;
  name: string;
  number: number;
  landingSite: string;
  coordinates: [number, number];
  date: string;
  crew: {
    commander: string;
    lmpilot: string;
    cmpilot: string;
  };
  duration: {
    surface: string;
    eva: string;
  };
  samples: number; // kg
  roverDistance?: number; // km, for J-missions
  highlights: string[];
}

// GeoJSON types for Leaflet
export interface LunarGeoJSON {
  type: 'FeatureCollection';
  features: LunarGeoJSONFeature[];
}

export interface LunarGeoJSONFeature {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Point' | 'Polygon' | 'LineString' | 'MultiPolygon';
    coordinates: number[] | number[][] | number[][][];
  };
  properties: {
    name: string;
    type: FeatureType;
    category: FeatureCategory;
    [key: string]: unknown;
  };
}

// Current lunar phase for terminator display
export interface LunarPhaseData {
  phase: number;           // 0-1 (0 = new, 0.5 = full)
  illumination: number;    // percentage
  age: number;             // days since new moon
  phaseName: string;
  terminatorLongitude: number; // degrees
}
