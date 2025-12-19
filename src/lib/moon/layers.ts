import { LayerGroup, LunarLayer } from './types';

// Default layer configuration
export const defaultLayers: LayerGroup[] = [
  {
    id: 'geography',
    name: 'Geography',
    expanded: true,
    layers: [
      {
        id: 'maria',
        name: 'Maria (Seas)',
        category: 'geography',
        visible: true,
        color: '#3b82f6', // blue-500
        icon: 'circle',
      },
      {
        id: 'craters',
        name: 'Major Craters',
        category: 'geography',
        visible: true,
        color: '#f59e0b', // amber-500
        icon: 'circle-dot',
      },
      {
        id: 'mountains',
        name: 'Mountains',
        category: 'geography',
        visible: false,
        color: '#10b981', // emerald-500
        icon: 'mountain',
      },
      {
        id: 'rilles',
        name: 'Rilles',
        category: 'geography',
        visible: false,
        color: '#8b5cf6', // violet-500
        icon: 'route',
      },
    ],
  },
  {
    id: 'exploration',
    name: 'Human Exploration',
    expanded: true,
    layers: [
      {
        id: 'apollo-sites',
        name: 'Apollo Landing Sites',
        category: 'apollo',
        visible: true,
        color: '#ef4444', // red-500
        icon: 'flag',
      },
      {
        id: 'apollo-traverses',
        name: 'Apollo EVA Routes',
        category: 'apollo',
        visible: false,
        color: '#f97316', // orange-500
        icon: 'route',
      },
      {
        id: 'soviet-sites',
        name: 'Soviet Missions',
        category: 'soviet',
        visible: false,
        color: '#dc2626', // red-600
        icon: 'star',
      },
      {
        id: 'modern-sites',
        name: 'Modern Missions',
        category: 'modern',
        visible: false,
        color: '#06b6d4', // cyan-500
        icon: 'satellite',
      },
    ],
  },
  {
    id: 'science',
    name: 'Scientific Features',
    expanded: false,
    layers: [
      {
        id: 'psr',
        name: 'Permanently Shadowed Regions',
        category: 'science',
        visible: false,
        color: '#1e3a5f', // dark blue
        icon: 'moon',
      },
      {
        id: 'mascons',
        name: 'Mass Concentrations',
        category: 'science',
        visible: false,
        color: '#7c3aed', // purple
        icon: 'target',
      },
    ],
  },
  {
    id: 'observation',
    name: 'Observation',
    expanded: false,
    layers: [
      {
        id: 'terminator',
        name: 'Current Terminator',
        category: 'geography',
        visible: false,
        color: '#fbbf24', // yellow-400
        icon: 'sun',
      },
    ],
  },
];

// Get all visible layer IDs
export function getVisibleLayerIds(groups: LayerGroup[]): string[] {
  return groups
    .flatMap(g => g.layers)
    .filter(l => l.visible)
    .map(l => l.id);
}

// Toggle layer visibility
export function toggleLayer(
  groups: LayerGroup[],
  layerId: string
): LayerGroup[] {
  return groups.map(group => ({
    ...group,
    layers: group.layers.map(layer =>
      layer.id === layerId
        ? { ...layer, visible: !layer.visible }
        : layer
    ),
  }));
}

// Toggle group expansion
export function toggleGroup(
  groups: LayerGroup[],
  groupId: string
): LayerGroup[] {
  return groups.map(group =>
    group.id === groupId
      ? { ...group, expanded: !group.expanded }
      : group
  );
}

// Get layer by ID
export function getLayerById(
  groups: LayerGroup[],
  layerId: string
): LunarLayer | undefined {
  for (const group of groups) {
    const layer = group.layers.find(l => l.id === layerId);
    if (layer) return layer;
  }
  return undefined;
}
