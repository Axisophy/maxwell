// src/lib/dashboard/widget-sets.ts
// Curated widget set configurations

export interface WidgetSet {
  id: string;
  name: string;
  description: string;
  widgets: string[];
  isDefault?: boolean;
}

export const WIDGET_SETS: WidgetSet[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Our curated selection of live science',
    isDefault: true,
    widgets: [
      'solar-disk',
      'earthquakes',
      'moon-phase',
      'uk-energy',
      'space-weather',
      'apod',
      'world-population',
      'lightning',
      'iss-tracker',
      'himawari'
    ]
  },
  {
    id: 'space',
    name: 'Space',
    description: 'Solar system, satellites, and beyond',
    widgets: [
      'solar-disk',
      'space-weather',
      'moon-phase',
      'iss-tracker',
      'near-earth-asteroids',
      'launch-countdown',
      'aurora-forecast',
      'jwst-latest',
      'mars-rover',
      'deep-space-network',
      'solar-corona',
      'satellites-above'
    ]
  },
  {
    id: 'earth',
    name: 'Earth',
    description: 'Our planet in motion',
    widgets: [
      'earthquakes',
      'tides',
      'himawari',
      'dscovr-epic',
      'lightning',
      'seismic-pulse',
      'active-fires',
      'magnetic-field',
      'glacier-watch',
      'ocean-hydrophones',
      'whats-below-you'
    ]
  },
  {
    id: 'environment',
    name: 'Environment & Climate',
    description: 'Weather, energy, atmosphere',
    widgets: [
      'uk-energy',
      'co2-now',
      'air-quality',
      'nuclear-reactors',
      'active-fires',
      'european-radiation',
      'glacier-watch',
      'pollen-forecast',
      'your-air-journey',
      'world-population'
    ]
  },
  {
    id: 'physics',
    name: 'Physics & Particles',
    description: 'Accelerators, detectors, cosmic rays',
    widgets: [
      'lhc-status',
      'neutrino-watch',
      'gravitational-waves',
      'cosmic-rays',
      'light-travel',
      'cosmic-rays-through',
      'your-background-dose'
    ]
  },
  {
    id: 'life',
    name: 'Life & Ecology',
    description: 'Biology and the living world',
    widgets: [
      'ebird-live',
      'inaturalist-live',
      'ocean-hydrophones',
      'pollen-forecast',
      'world-population'
    ]
  },
  {
    id: 'images',
    name: 'Images & Video',
    description: 'Live feeds and cameras',
    widgets: [
      'solar-disk',
      'himawari',
      'dscovr-epic',
      'apod',
      'jwst-latest',
      'mars-rover',
      'solar-corona'
    ]
  },
  {
    id: 'personal',
    name: 'Personal',
    description: 'Science where you are',
    widgets: [
      'satellites-above',
      'air-quality',
      'aurora-forecast',
      'star-map',
      'your-sky-when-born',
      'whats-below-you',
      'your-air-journey',
      'your-background-dose',
      'cosmic-rays-through',
      'magnetic-field-strength',
      'pollen-forecast',
      'tides'
    ]
  }
];

// All sets available to unregistered users for now
// Later: restrict some to registered users by slicing this array
export const PUBLIC_SETS = WIDGET_SETS;

// Helper functions
export function getDefaultSet(): WidgetSet {
  return WIDGET_SETS.find(set => set.isDefault) || WIDGET_SETS[0];
}

export function getSetById(id: string): WidgetSet | undefined {
  return WIDGET_SETS.find(set => set.id === id);
}

export function getAllSetIds(): string[] {
  return WIDGET_SETS.map(set => set.id);
}
