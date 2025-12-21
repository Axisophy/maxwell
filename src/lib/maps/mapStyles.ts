// Shared Map Styles for MXWLL
// Reusable across Extraction Map, Lunar Atlas, and future map pages

export interface MapStyleConfig {
  id: string;
  name: string;
  description: string;
  baseStyle: string;
  isDark: boolean;
  customLayers: Record<string, string>;
  markerStyle: {
    border: string;
    shadow: string;
    glow: boolean;
    glowColor?: string;
    glowIntensity?: number;
  };
  ui: {
    bg: string;
    text: string;
    textMuted: string;
    border: string;
    panel: string;
  };
  preview: string;
}

export const MAP_STYLES: Record<string, MapStyleConfig> = {
  blueprint: {
    id: 'blueprint',
    name: 'Blueprint',
    description: 'Technical drawing',
    baseStyle: 'mapbox://styles/mapbox/dark-v11',
    isDark: true,
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

  terrain: {
    id: 'terrain',
    name: 'Terrain',
    description: 'Physical landscape',
    baseStyle: 'mapbox://styles/mapbox/outdoors-v12',
    isDark: false,
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

  political: {
    id: 'political',
    name: 'Political',
    description: 'Country boundaries',
    baseStyle: 'mapbox://styles/mapbox/light-v11',
    isDark: false,
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

  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Night view',
    baseStyle: 'mapbox://styles/mapbox/dark-v11',
    isDark: true,
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

  satellite: {
    id: 'satellite',
    name: 'Satellite',
    description: 'Earth imagery',
    baseStyle: 'mapbox://styles/mapbox/satellite-v9',
    isDark: true,
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

  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Abstract view',
    baseStyle: 'mapbox://styles/mapbox/light-v11',
    isDark: false,
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
};

export type MapStyleKey = keyof typeof MAP_STYLES;

export function getMapStyle(key: MapStyleKey): MapStyleConfig {
  return MAP_STYLES[key];
}

export function isDarkStyle(key: MapStyleKey): boolean {
  return MAP_STYLES[key]?.isDark ?? false;
}
