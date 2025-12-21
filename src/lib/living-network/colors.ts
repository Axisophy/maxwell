export const kingdomColors: Record<string, string> = {
  bacteria: '#5B7B8C',    // Blue-grey
  archaea: '#D4763A',     // Deep orange
  animalia: '#E85D5D',    // Coral red
  plantae: '#2D8B4E',     // Forest green
  fungi: '#A67C52',       // Warm brown
  protista: '#3A9B9B',    // Teal
  chromista: '#C9A227',   // Golden yellow
};

export const domainColors: Record<string, string> = {
  bacteria: '#5B7B8C',
  archaea: '#D4763A',
  eukarya: '#6B7280',     // Neutral grey (contains multiple kingdoms)
};

// Get colour for any taxon based on its kingdom ancestor
export function getTaxonColor(taxonId: string, kingdomId?: string): string {
  if (kingdomColors[taxonId]) return kingdomColors[taxonId];
  if (domainColors[taxonId]) return domainColors[taxonId];
  if (kingdomId && kingdomColors[kingdomId]) return kingdomColors[kingdomId];
  return '#6B7280'; // Default grey
}

// Extinct version of colour (reduced opacity or desaturated)
export function getExtinctColor(baseColor: string): string {
  // Return same colour but we'll apply opacity in CSS
  return baseColor;
}
