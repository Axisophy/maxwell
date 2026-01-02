// ===========================================
// PERMISSIBLE UNIVERSE - LIB INDEX
// ===========================================

export * from './types'
export * from './constants'
export * from './boundaries'
export * from './epochs'

import { CosmicObject } from './types'
import { COSMIC_OBJECTS, OBJECTS_MAP, getObject as getObjectFromPart1 } from './objects'
import { ALL_COSMIC_OBJECTS_PART2 } from './objects-part2'

// Combine all objects
export const ALL_OBJECTS: CosmicObject[] = [
  ...COSMIC_OBJECTS,
  ...ALL_COSMIC_OBJECTS_PART2,
]

// Create combined lookup map
const COMBINED_MAP = new Map<string, CosmicObject>(
  ALL_OBJECTS.map(obj => [obj.id, obj])
)

export function getObject(id: string): CosmicObject | undefined {
  return COMBINED_MAP.get(id)
}

export function searchObjects(query: string): CosmicObject[] {
  const q = query.toLowerCase()
  return ALL_OBJECTS.filter(obj =>
    obj.name.toLowerCase().includes(q) ||
    obj.tagline.toLowerCase().includes(q) ||
    obj.description.toLowerCase().includes(q)
  )
}

// Re-export boundaries
export { BOUNDARIES, BOUNDARY_LIST, getBoundaryLogRadius } from './boundaries'
export { EPOCH_LIST, DOMINATION_LIST } from './epochs'
