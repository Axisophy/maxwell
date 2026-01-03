// Complete Element Data for MXWLL Periodic Table
// All 118 elements with comprehensive properties
// Sources: IUPAC, NIST ASD, CRC Handbook of Chemistry and Physics

export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number | string; // string for unstable elements like "[294]"
  category: ElementCategory;
  group: number | null; // null for lanthanides/actinides
  period: number;
  block: 's' | 'p' | 'd' | 'f';
  electronConfiguration: string;
  electronConfigurationSemantic: string;
  electronegativity: number | null;
  atomicRadius: number | null; // pm
  ionizationEnergy: number | null; // kJ/mol
  electronAffinity: number | null; // kJ/mol
  meltingPoint: number | null; // K
  boilingPoint: number | null; // K
  density: number | null; // g/cm³
  stateAtSTP: 'solid' | 'liquid' | 'gas';
  discoveryYear: number | null;
  discoveredBy: string | null;
  abundance: {
    earth: number | null; // ppm in Earth's crust
    universe: number | null; // relative to Si = 1,000,000
  };
  oxidationStates: number[];
}

export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'alkali-metal': 'Alkali Metal',
  'alkaline-earth': 'Alkaline Earth Metal',
  'transition-metal': 'Transition Metal',
  'post-transition-metal': 'Post-Transition Metal',
  'metalloid': 'Metalloid',
  'nonmetal': 'Nonmetal',
  'halogen': 'Halogen',
  'noble-gas': 'Noble Gas',
  'lanthanide': 'Lanthanide',
  'actinide': 'Actinide',
};

export const CATEGORY_COLORS: Record<ElementCategory, { bg: string; text: string }> = {
  'alkali-metal': { bg: 'bg-rose-500/20', text: 'text-rose-400' },
  'alkaline-earth': { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  'transition-metal': { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  'post-transition-metal': { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  'metalloid': { bg: 'bg-teal-500/20', text: 'text-teal-400' },
  'nonmetal': { bg: 'bg-sky-500/20', text: 'text-sky-400' },
  'halogen': { bg: 'bg-violet-500/20', text: 'text-violet-400' },
  'noble-gas': { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  'lanthanide': { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  'actinide': { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-400' },
};

// Element position in standard 18-column layout
export function getElementPosition(element: Element): { row: number; col: number } {
  const { atomicNumber, group, period } = element;
  
  // Lanthanides (57-71)
  if (atomicNumber >= 57 && atomicNumber <= 71) {
    return { row: 8, col: atomicNumber - 57 + 3 };
  }
  
  // Actinides (89-103)
  if (atomicNumber >= 89 && atomicNumber <= 103) {
    return { row: 9, col: atomicNumber - 89 + 3 };
  }
  
  // Main table elements
  if (group !== null) {
    return { row: period, col: group };
  }
  
  return { row: period, col: 1 };
}

// Helper functions
export function getElement(atomicNumber: number): Element | undefined {
  return ELEMENTS.find(e => e.atomicNumber === atomicNumber);
}

export function getElementBySymbol(symbol: string): Element | undefined {
  return ELEMENTS.find(e => e.symbol.toLowerCase() === symbol.toLowerCase());
}

export function getElementsByCategory(category: ElementCategory): Element[] {
  return ELEMENTS.filter(e => e.category === category);
}

export function getElementsByPeriod(period: number): Element[] {
  return ELEMENTS.filter(e => e.period === period);
}

export function getElementsByGroup(group: number): Element[] {
  return ELEMENTS.filter(e => e.group === group);
}

export function formatTemperature(kelvin: number | null, unit: 'K' | 'C' | 'F' = 'K'): string {
  if (kelvin === null) return '—';
  switch (unit) {
    case 'K': return `${kelvin} K`;
    case 'C': return `${Math.round(kelvin - 273.15)} °C`;
    case 'F': return `${Math.round((kelvin - 273.15) * 9/5 + 32)} °F`;
  }
}

export function formatAtomicMass(mass: number | string): string {
  if (typeof mass === 'string') return mass;
  return mass.toFixed(mass < 10 ? 4 : 3);
}

// All 118 Elements
export const ELEMENTS: Element[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PERIOD 1
  // ═══════════════════════════════════════════════════════════════════════════
  {
    atomicNumber: 1, symbol: 'H', name: 'Hydrogen', atomicMass: 1.008,
    category: 'nonmetal', group: 1, period: 1, block: 's',
    electronConfiguration: '1s¹', electronConfigurationSemantic: '1s¹',
    electronegativity: 2.20, atomicRadius: 53, ionizationEnergy: 1312, electronAffinity: 73,
    meltingPoint: 14, boilingPoint: 20, density: 0.00008988, stateAtSTP: 'gas',
    discoveryYear: 1766, discoveredBy: 'Henry Cavendish',
    abundance: { earth: 1400, universe: 739000 }, oxidationStates: [-1, 1],
  },
  {
    atomicNumber: 2, symbol: 'He', name: 'Helium', atomicMass: 4.0026,
    category: 'noble-gas', group: 18, period: 1, block: 's',
    electronConfiguration: '1s²', electronConfigurationSemantic: '1s²',
    electronegativity: null, atomicRadius: 31, ionizationEnergy: 2372, electronAffinity: 0,
    meltingPoint: null, boilingPoint: 4, density: 0.0001785, stateAtSTP: 'gas',
    discoveryYear: 1868, discoveredBy: 'Pierre Janssen',
    abundance: { earth: 0.008, universe: 240000 }, oxidationStates: [0],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PERIOD 2
  // ═══════════════════════════════════════════════════════════════════════════
  {
    atomicNumber: 3, symbol: 'Li', name: 'Lithium', atomicMass: 6.94,
    category: 'alkali-metal', group: 1, period: 2, block: 's',
    electronConfiguration: '[He] 2s¹', electronConfigurationSemantic: '[He] 2s¹',
    electronegativity: 0.98, atomicRadius: 167, ionizationEnergy: 520, electronAffinity: 60,
    meltingPoint: 454, boilingPoint: 1615, density: 0.534, stateAtSTP: 'solid',
    discoveryYear: 1817, discoveredBy: 'Johan August Arfwedson',
    abundance: { earth: 20, universe: 6 }, oxidationStates: [1],
  },
  {
    atomicNumber: 4, symbol: 'Be', name: 'Beryllium', atomicMass: 9.0122,
    category: 'alkaline-earth', group: 2, period: 2, block: 's',
    electronConfiguration: '[He] 2s²', electronConfigurationSemantic: '[He] 2s²',
    electronegativity: 1.57, atomicRadius: 112, ionizationEnergy: 900, electronAffinity: 0,
    meltingPoint: 1560, boilingPoint: 2744, density: 1.85, stateAtSTP: 'solid',
    discoveryYear: 1798, discoveredBy: 'Louis Nicolas Vauquelin',
    abundance: { earth: 2.8, universe: 1 }, oxidationStates: [2],
  },
  {
    atomicNumber: 5, symbol: 'B', name: 'Boron', atomicMass: 10.81,
    category: 'metalloid', group: 13, period: 2, block: 'p',
    electronConfiguration: '[He] 2s² 2p¹', electronConfigurationSemantic: '[He] 2s² 2p¹',
    electronegativity: 2.04, atomicRadius: 87, ionizationEnergy: 801, electronAffinity: 27,
    meltingPoint: 2349, boilingPoint: 4200, density: 2.34, stateAtSTP: 'solid',
    discoveryYear: 1808, discoveredBy: 'Joseph Louis Gay-Lussac',
    abundance: { earth: 10, universe: 1 }, oxidationStates: [3],
  },
  {
    atomicNumber: 6, symbol: 'C', name: 'Carbon', atomicMass: 12.011,
    category: 'nonmetal', group: 14, period: 2, block: 'p',
    electronConfiguration: '[He] 2s² 2p²', electronConfigurationSemantic: '[He] 2s² 2p²',
    electronegativity: 2.55, atomicRadius: 77, ionizationEnergy: 1086, electronAffinity: 122,
    meltingPoint: 3823, boilingPoint: 4098, density: 2.267, stateAtSTP: 'solid',
    discoveryYear: null, discoveredBy: null,
    abundance: { earth: 200, universe: 4600 }, oxidationStates: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
  },
  {
    atomicNumber: 7, symbol: 'N', name: 'Nitrogen', atomicMass: 14.007,
    category: 'nonmetal', group: 15, period: 2, block: 'p',
    electronConfiguration: '[He] 2s² 2p³', electronConfigurationSemantic: '[He] 2s² 2p³',
    electronegativity: 3.04, atomicRadius: 75, ionizationEnergy: 1402, electronAffinity: 7,
    meltingPoint: 63, boilingPoint: 77, density: 0.0012506, stateAtSTP: 'gas',
    discoveryYear: 1772, discoveredBy: 'Daniel Rutherford',
    abundance: { earth: 19, universe: 1000 }, oxidationStates: [-3, -2, -1, 1, 2, 3, 4, 5],
  },
  {
    atomicNumber: 8, symbol: 'O', name: 'Oxygen', atomicMass: 15.999,
    category: 'nonmetal', group: 16, period: 2, block: 'p',
    electronConfiguration: '[He] 2s² 2p⁴', electronConfigurationSemantic: '[He] 2s² 2p⁴',
    electronegativity: 3.44, atomicRadius: 73, ionizationEnergy: 1314, electronAffinity: 141,
    meltingPoint: 54, boilingPoint: 90, density: 0.001429, stateAtSTP: 'gas',
    discoveryYear: 1774, discoveredBy: 'Joseph Priestley',
    abundance: { earth: 461000, universe: 10400 }, oxidationStates: [-2, -1, 1, 2],
  },
  {
    atomicNumber: 9, symbol: 'F', name: 'Fluorine', atomicMass: 18.998,
    category: 'halogen', group: 17, period: 2, block: 'p',
    electronConfiguration: '[He] 2s² 2p⁵', electronConfigurationSemantic: '[He] 2s² 2p⁵',
    electronegativity: 3.98, atomicRadius: 71, ionizationEnergy: 1681, electronAffinity: 328,
    meltingPoint: 53, boilingPoint: 85, density: 0.001696, stateAtSTP: 'gas',
    discoveryYear: 1886, discoveredBy: 'Henri Moissan',
    abundance: { earth: 585, universe: 400 }, oxidationStates: [-1],
  },
  {
    atomicNumber: 10, symbol: 'Ne', name: 'Neon', atomicMass: 20.180,
    category: 'noble-gas', group: 18, period: 2, block: 'p',
    electronConfiguration: '[He] 2s² 2p⁶', electronConfigurationSemantic: '[He] 2s² 2p⁶',
    electronegativity: null, atomicRadius: 38, ionizationEnergy: 2081, electronAffinity: 0,
    meltingPoint: 25, boilingPoint: 27, density: 0.0008999, stateAtSTP: 'gas',
    discoveryYear: 1898, discoveredBy: 'William Ramsay',
    abundance: { earth: 0.005, universe: 1340 }, oxidationStates: [0],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PERIOD 3
  // ═══════════════════════════════════════════════════════════════════════════
  {
    atomicNumber: 11, symbol: 'Na', name: 'Sodium', atomicMass: 22.990,
    category: 'alkali-metal', group: 1, period: 3, block: 's',
    electronConfiguration: '[Ne] 3s¹', electronConfigurationSemantic: '[Ne] 3s¹',
    electronegativity: 0.93, atomicRadius: 190, ionizationEnergy: 496, electronAffinity: 53,
    meltingPoint: 371, boilingPoint: 1156, density: 0.971, stateAtSTP: 'solid',
    discoveryYear: 1807, discoveredBy: 'Humphry Davy',
    abundance: { earth: 23600, universe: 33 }, oxidationStates: [-1, 1],
  },
  {
    atomicNumber: 12, symbol: 'Mg', name: 'Magnesium', atomicMass: 24.305,
    category: 'alkaline-earth', group: 2, period: 3, block: 's',
    electronConfiguration: '[Ne] 3s²', electronConfigurationSemantic: '[Ne] 3s²',
    electronegativity: 1.31, atomicRadius: 145, ionizationEnergy: 738, electronAffinity: 0,
    meltingPoint: 923, boilingPoint: 1363, density: 1.738, stateAtSTP: 'solid',
    discoveryYear: 1755, discoveredBy: 'Joseph Black',
    abundance: { earth: 23300, universe: 580 }, oxidationStates: [2],
  },
  {
    atomicNumber: 13, symbol: 'Al', name: 'Aluminium', atomicMass: 26.982,
    category: 'post-transition-metal', group: 13, period: 3, block: 'p',
    electronConfiguration: '[Ne] 3s² 3p¹', electronConfigurationSemantic: '[Ne] 3s² 3p¹',
    electronegativity: 1.61, atomicRadius: 118, ionizationEnergy: 578, electronAffinity: 43,
    meltingPoint: 933, boilingPoint: 2792, density: 2.698, stateAtSTP: 'solid',
    discoveryYear: 1825, discoveredBy: 'Hans Christian Ørsted',
    abundance: { earth: 82300, universe: 58 }, oxidationStates: [3],
  },
  {
    atomicNumber: 14, symbol: 'Si', name: 'Silicon', atomicMass: 28.085,
    category: 'metalloid', group: 14, period: 3, block: 'p',
    electronConfiguration: '[Ne] 3s² 3p²', electronConfigurationSemantic: '[Ne] 3s² 3p²',
    electronegativity: 1.90, atomicRadius: 111, ionizationEnergy: 786, electronAffinity: 134,
    meltingPoint: 1687, boilingPoint: 3538, density: 2.3296, stateAtSTP: 'solid',
    discoveryYear: 1824, discoveredBy: 'Jöns Jacob Berzelius',
    abundance: { earth: 282000, universe: 650 }, oxidationStates: [-4, -3, -2, -1, 1, 2, 3, 4],
  },
  {
    atomicNumber: 15, symbol: 'P', name: 'Phosphorus', atomicMass: 30.974,
    category: 'nonmetal', group: 15, period: 3, block: 'p',
    electronConfiguration: '[Ne] 3s² 3p³', electronConfigurationSemantic: '[Ne] 3s² 3p³',
    electronegativity: 2.19, atomicRadius: 98, ionizationEnergy: 1012, electronAffinity: 72,
    meltingPoint: 317, boilingPoint: 554, density: 1.82, stateAtSTP: 'solid',
    discoveryYear: 1669, discoveredBy: 'Hennig Brand',
    abundance: { earth: 1050, universe: 7 }, oxidationStates: [-3, -2, -1, 1, 2, 3, 4, 5],
  },
  {
    atomicNumber: 16, symbol: 'S', name: 'Sulfur', atomicMass: 32.06,
    category: 'nonmetal', group: 16, period: 3, block: 'p',
    electronConfiguration: '[Ne] 3s² 3p⁴', electronConfigurationSemantic: '[Ne] 3s² 3p⁴',
    electronegativity: 2.58, atomicRadius: 88, ionizationEnergy: 1000, electronAffinity: 200,
    meltingPoint: 388, boilingPoint: 718, density: 2.067, stateAtSTP: 'solid',
    discoveryYear: null, discoveredBy: null,
    abundance: { earth: 350, universe: 440 }, oxidationStates: [-2, -1, 1, 2, 3, 4, 5, 6],
  },
  {
    atomicNumber: 17, symbol: 'Cl', name: 'Chlorine', atomicMass: 35.45,
    category: 'halogen', group: 17, period: 3, block: 'p',
    electronConfiguration: '[Ne] 3s² 3p⁵', electronConfigurationSemantic: '[Ne] 3s² 3p⁵',
    electronegativity: 3.16, atomicRadius: 79, ionizationEnergy: 1251, electronAffinity: 349,
    meltingPoint: 172, boilingPoint: 239, density: 0.003214, stateAtSTP: 'gas',
    discoveryYear: 1774, discoveredBy: 'Carl Wilhelm Scheele',
    abundance: { earth: 145, universe: 1 }, oxidationStates: [-1, 1, 2, 3, 4, 5, 6, 7],
  },
  {
    atomicNumber: 18, symbol: 'Ar', name: 'Argon', atomicMass: 39.948,
    category: 'noble-gas', group: 18, period: 3, block: 'p',
    electronConfiguration: '[Ne] 3s² 3p⁶', electronConfigurationSemantic: '[Ne] 3s² 3p⁶',
    electronegativity: null, atomicRadius: 71, ionizationEnergy: 1521, electronAffinity: 0,
    meltingPoint: 84, boilingPoint: 87, density: 0.0017837, stateAtSTP: 'gas',
    discoveryYear: 1894, discoveredBy: 'Lord Rayleigh',
    abundance: { earth: 3.5, universe: 77 }, oxidationStates: [0],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PERIOD 4
  // ═══════════════════════════════════════════════════════════════════════════
  {
    atomicNumber: 19, symbol: 'K', name: 'Potassium', atomicMass: 39.098,
    category: 'alkali-metal', group: 1, period: 4, block: 's',
    electronConfiguration: '[Ar] 4s¹', electronConfigurationSemantic: '[Ar] 4s¹',
    electronegativity: 0.82, atomicRadius: 243, ionizationEnergy: 419, electronAffinity: 48,
    meltingPoint: 337, boilingPoint: 1032, density: 0.862, stateAtSTP: 'solid',
    discoveryYear: 1807, discoveredBy: 'Humphry Davy',
    abundance: { earth: 20900, universe: 3 }, oxidationStates: [1],
  },
  {
    atomicNumber: 20, symbol: 'Ca', name: 'Calcium', atomicMass: 40.078,
    category: 'alkaline-earth', group: 2, period: 4, block: 's',
    electronConfiguration: '[Ar] 4s²', electronConfigurationSemantic: '[Ar] 4s²',
    electronegativity: 1.00, atomicRadius: 194, ionizationEnergy: 590, electronAffinity: 2,
    meltingPoint: 1115, boilingPoint: 1757, density: 1.54, stateAtSTP: 'solid',
    discoveryYear: 1808, discoveredBy: 'Humphry Davy',
    abundance: { earth: 41500, universe: 60 }, oxidationStates: [2],
  },
  {
    atomicNumber: 21, symbol: 'Sc', name: 'Scandium', atomicMass: 44.956,
    category: 'transition-metal', group: 3, period: 4, block: 'd',
    electronConfiguration: '[Ar] 3d¹ 4s²', electronConfigurationSemantic: '[Ar] 3d¹ 4s²',
    electronegativity: 1.36, atomicRadius: 184, ionizationEnergy: 633, electronAffinity: 18,
    meltingPoint: 1814, boilingPoint: 3109, density: 2.989, stateAtSTP: 'solid',
    discoveryYear: 1879, discoveredBy: 'Lars Fredrik Nilson',
    abundance: { earth: 22, universe: 3 }, oxidationStates: [3],
  },
  {
    atomicNumber: 22, symbol: 'Ti', name: 'Titanium', atomicMass: 47.867,
    category: 'transition-metal', group: 4, period: 4, block: 'd',
    electronConfiguration: '[Ar] 3d² 4s²', electronConfigurationSemantic: '[Ar] 3d² 4s²',
    electronegativity: 1.54, atomicRadius: 176, ionizationEnergy: 659, electronAffinity: 8,
    meltingPoint: 1941, boilingPoint: 3560, density: 4.54, stateAtSTP: 'solid',
    discoveryYear: 1791, discoveredBy: 'William Gregor',
    abundance: { earth: 5650, universe: 3 }, oxidationStates: [-1, 2, 3, 4],
  },
  {
    atomicNumber: 23, symbol: 'V', name: 'Vanadium', atomicMass: 50.942,
    category: 'transition-metal', group: 5, period: 4, block: 'd',
    electronConfiguration: '[Ar] 3d³ 4s²', electronConfigurationSemantic: '[Ar] 3d³ 4s²',
    electronegativity: 1.63, atomicRadius: 171, ionizationEnergy: 651, electronAffinity: 51,
    meltingPoint: 2183, boilingPoint: 3680, density: 6.11, stateAtSTP: 'solid',
    discoveryYear: 1801, discoveredBy: 'Andrés Manuel del Río',
    abundance: { earth: 120, universe: 1 }, oxidationStates: [-1, 2, 3, 4, 5],
  },
  {
    atomicNumber: 24, symbol: 'Cr', name: 'Chromium', atomicMass: 51.996,
    category: 'transition-metal', group: 6, period: 4, block: 'd',
    electronConfiguration: '[Ar] 3d⁵ 4s¹', electronConfigurationSemantic: '[Ar] 3d⁵ 4s¹',
    electronegativity: 1.66, atomicRadius: 166, ionizationEnergy: 653, electronAffinity: 64,
    meltingPoint: 2180, boilingPoint: 2944, density: 7.15, stateAtSTP: 'solid',
    discoveryYear: 1794, discoveredBy: 'Louis Nicolas Vauquelin',
    abundance: { earth: 102, universe: 15 }, oxidationStates: [-2, -1, 1, 2, 3, 4, 5, 6],
  },
  {
    atomicNumber: 25, symbol: 'Mn', name: 'Manganese', atomicMass: 54.938,
    category: 'transition-metal', group: 7, period: 4, block: 'd',
    electronConfiguration: '[Ar] 3d⁵ 4s²', electronConfigurationSemantic: '[Ar] 3d⁵ 4s²',
    electronegativity: 1.55, atomicRadius: 161, ionizationEnergy: 717, electronAffinity: 0,
    meltingPoint: 1519, boilingPoint: 2334, density: 7.44, stateAtSTP: 'solid',
    discoveryYear: 1774, discoveredBy: 'Johan Gottlieb Gahn',
    abundance: { earth: 950, universe: 8 }, oxidationStates: [-3, -2, -1, 1, 2, 3, 4, 5, 6, 7],
  },
  {
    atomicNumber: 26, symbol: 'Fe', name: 'Iron', atomicMass: 55.845,
    category: 'transition-metal', group: 8, period: 4, block: 'd',
    electronConfiguration: '[Ar] 3d⁶ 4s²', electronConfigurationSemantic: '[Ar] 3d⁶ 4s²',
    electronegativity: 1.83, atomicRadius: 156, ionizationEnergy: 762, electronAffinity: 16,
    meltingPoint: 1811, boilingPoint: 3134, density: 7.874, stateAtSTP: 'solid',
    discoveryYear: null, discoveredBy: null,
    abundance: { earth: 56300, universe: 1090 }, oxidationStates: [-2, -1, 1, 2, 3, 4, 5, 6],
  },
  {
    atomicNumber: 27, symbol: 'Co', name: 'Cobalt', atomicMass: 58.933,
    category: 'transition-metal', group: 9, period: 4, block: 'd',
    electronConfiguration: '[Ar] 3d⁷ 4s²', electronConfigurationSemantic: '[Ar] 3d⁷ 4s²',
    electronegativity: 1.88, atomicRadius: 152, ionizationEnergy: 760, electronAffinity: 64,
    meltingPoint: 1768, boilingPoint: 3200, density: 8.86, stateAtSTP: 'solid',
    discoveryYear: 1735, discoveredBy: 'Georg Brandt',
    abundance: { earth: 25, universe: 3 }, oxidationStates: [-1, 1, 2, 3, 4, 5],
  },
  {
    atomicNumber: 28, symbol: 'Ni', name: 'Nickel', atomicMass: 58.693,
    category: 'transition-metal', group: 10, period: 4, block: 'd',
    electronConfiguration: '[Ar] 3d⁸ 4s²', electronConfigurationSemantic: '[Ar] 3d⁸ 4s²',
    electronegativity: 1.91, atomicRadius: 149, ionizationEnergy: 737, electronAffinity: 112,
    meltingPoint: 1728, boilingPoint: 3186, density: 8.912, stateAtSTP: 'solid',
    discoveryYear: 1751, discoveredBy: 'Axel Fredrik Cronstedt',
    abundance: { earth: 84, universe: 49 }, oxidationStates: [-1, 1, 2, 3, 4],
  },
  {
    atomicNumber: 29, symbol: 'Cu', name: 'Copper', atomicMass: 63.546,
    category: 'transition-metal', group: 11, period: 4, block: 'd',
    electronConfiguration: '[Ar] 3d¹⁰ 4s¹', electronConfigurationSemantic: '[Ar] 3d¹⁰ 4s¹',
    electronegativity: 1.90, atomicRadius: 145, ionizationEnergy: 745, electronAffinity: 119,
    meltingPoint: 1358, boilingPoint: 2835, density: 8.96, stateAtSTP: 'solid',
    discoveryYear: null, discoveredBy: null,
    abundance: { earth: 60, universe: 0.6 }, oxidationStates: [1, 2, 3, 4],
  },
  {
    atomicNumber: 30, symbol: 'Zn', name: 'Zinc', atomicMass: 65.38,
    category: 'transition-metal', group: 12, period: 4, block: 'd',
    electronConfiguration: '[Ar] 3d¹⁰ 4s²', electronConfigurationSemantic: '[Ar] 3d¹⁰ 4s²',
    electronegativity: 1.65, atomicRadius: 142, ionizationEnergy: 906, electronAffinity: 0,
    meltingPoint: 693, boilingPoint: 1180, density: 7.134, stateAtSTP: 'solid',
    discoveryYear: null, discoveredBy: null,
    abundance: { earth: 70, universe: 0.3 }, oxidationStates: [2],
  },
  {
    atomicNumber: 31, symbol: 'Ga', name: 'Gallium', atomicMass: 69.723,
    category: 'post-transition-metal', group: 13, period: 4, block: 'p',
    electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p¹', electronConfigurationSemantic: '[Ar] 3d¹⁰ 4s² 4p¹',
    electronegativity: 1.81, atomicRadius: 136, ionizationEnergy: 579, electronAffinity: 41,
    meltingPoint: 303, boilingPoint: 2477, density: 5.907, stateAtSTP: 'solid',
    discoveryYear: 1875, discoveredBy: 'Lecoq de Boisbaudran',
    abundance: { earth: 19, universe: 0.01 }, oxidationStates: [1, 2, 3],
  },
  {
    atomicNumber: 32, symbol: 'Ge', name: 'Germanium', atomicMass: 72.630,
    category: 'metalloid', group: 14, period: 4, block: 'p',
    electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p²', electronConfigurationSemantic: '[Ar] 3d¹⁰ 4s² 4p²',
    electronegativity: 2.01, atomicRadius: 125, ionizationEnergy: 762, electronAffinity: 119,
    meltingPoint: 1211, boilingPoint: 3106, density: 5.323, stateAtSTP: 'solid',
    discoveryYear: 1886, discoveredBy: 'Clemens Winkler',
    abundance: { earth: 1.5, universe: 0.2 }, oxidationStates: [-4, 1, 2, 3, 4],
  },
  {
    atomicNumber: 33, symbol: 'As', name: 'Arsenic', atomicMass: 74.922,
    category: 'metalloid', group: 15, period: 4, block: 'p',
    electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p³', electronConfigurationSemantic: '[Ar] 3d¹⁰ 4s² 4p³',
    electronegativity: 2.18, atomicRadius: 114, ionizationEnergy: 947, electronAffinity: 78,
    meltingPoint: 1090, boilingPoint: 887, density: 5.776, stateAtSTP: 'solid',
    discoveryYear: null, discoveredBy: null,
    abundance: { earth: 1.8, universe: 0.008 }, oxidationStates: [-3, 2, 3, 5],
  },
  {
    atomicNumber: 34, symbol: 'Se', name: 'Selenium', atomicMass: 78.971,
    category: 'nonmetal', group: 16, period: 4, block: 'p',
    electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁴', electronConfigurationSemantic: '[Ar] 3d¹⁰ 4s² 4p⁴',
    electronegativity: 2.55, atomicRadius: 103, ionizationEnergy: 941, electronAffinity: 195,
    meltingPoint: 494, boilingPoint: 958, density: 4.809, stateAtSTP: 'solid',
    discoveryYear: 1817, discoveredBy: 'Jöns Jacob Berzelius',
    abundance: { earth: 0.05, universe: 0.03 }, oxidationStates: [-2, 2, 4, 6],
  },
  {
    atomicNumber: 35, symbol: 'Br', name: 'Bromine', atomicMass: 79.904,
    category: 'halogen', group: 17, period: 4, block: 'p',
    electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁵', electronConfigurationSemantic: '[Ar] 3d¹⁰ 4s² 4p⁵',
    electronegativity: 2.96, atomicRadius: 94, ionizationEnergy: 1140, electronAffinity: 325,
    meltingPoint: 266, boilingPoint: 332, density: 3.122, stateAtSTP: 'liquid',
    discoveryYear: 1826, discoveredBy: 'Antoine Jérôme Balard',
    abundance: { earth: 2.4, universe: 0.007 }, oxidationStates: [-1, 1, 3, 4, 5, 7],
  },
  {
    atomicNumber: 36, symbol: 'Kr', name: 'Krypton', atomicMass: 83.798,
    category: 'noble-gas', group: 18, period: 4, block: 'p',
    electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁶', electronConfigurationSemantic: '[Ar] 3d¹⁰ 4s² 4p⁶',
    electronegativity: 3.00, atomicRadius: 88, ionizationEnergy: 1351, electronAffinity: 0,
    meltingPoint: 116, boilingPoint: 120, density: 0.003733, stateAtSTP: 'gas',
    discoveryYear: 1898, discoveredBy: 'William Ramsay',
    abundance: { earth: 0.0001, universe: 0.00004 }, oxidationStates: [0, 2],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PERIOD 5
  // ═══════════════════════════════════════════════════════════════════════════
  {
    atomicNumber: 37, symbol: 'Rb', name: 'Rubidium', atomicMass: 85.468,
    category: 'alkali-metal', group: 1, period: 5, block: 's',
    electronConfiguration: '[Kr] 5s¹', electronConfigurationSemantic: '[Kr] 5s¹',
    electronegativity: 0.82, atomicRadius: 265, ionizationEnergy: 403, electronAffinity: 47,
    meltingPoint: 312, boilingPoint: 961, density: 1.532, stateAtSTP: 'solid',
    discoveryYear: 1861, discoveredBy: 'Robert Bunsen',
    abundance: { earth: 90, universe: 0.01 }, oxidationStates: [1],
  },
  {
    atomicNumber: 38, symbol: 'Sr', name: 'Strontium', atomicMass: 87.62,
    category: 'alkaline-earth', group: 2, period: 5, block: 's',
    electronConfiguration: '[Kr] 5s²', electronConfigurationSemantic: '[Kr] 5s²',
    electronegativity: 0.95, atomicRadius: 219, ionizationEnergy: 550, electronAffinity: 5,
    meltingPoint: 1050, boilingPoint: 1655, density: 2.64, stateAtSTP: 'solid',
    discoveryYear: 1790, discoveredBy: 'Adair Crawford',
    abundance: { earth: 370, universe: 0.04 }, oxidationStates: [2],
  },
  {
    atomicNumber: 39, symbol: 'Y', name: 'Yttrium', atomicMass: 88.906,
    category: 'transition-metal', group: 3, period: 5, block: 'd',
    electronConfiguration: '[Kr] 4d¹ 5s²', electronConfigurationSemantic: '[Kr] 4d¹ 5s²',
    electronegativity: 1.22, atomicRadius: 212, ionizationEnergy: 600, electronAffinity: 30,
    meltingPoint: 1799, boilingPoint: 3609, density: 4.469, stateAtSTP: 'solid',
    discoveryYear: 1794, discoveredBy: 'Johan Gadolin',
    abundance: { earth: 33, universe: 0.007 }, oxidationStates: [3],
  },
  {
    atomicNumber: 40, symbol: 'Zr', name: 'Zirconium', atomicMass: 91.224,
    category: 'transition-metal', group: 4, period: 5, block: 'd',
    electronConfiguration: '[Kr] 4d² 5s²', electronConfigurationSemantic: '[Kr] 4d² 5s²',
    electronegativity: 1.33, atomicRadius: 206, ionizationEnergy: 640, electronAffinity: 41,
    meltingPoint: 2128, boilingPoint: 4682, density: 6.506, stateAtSTP: 'solid',
    discoveryYear: 1789, discoveredBy: 'Martin Heinrich Klaproth',
    abundance: { earth: 165, universe: 0.05 }, oxidationStates: [4],
  },
  {
    atomicNumber: 41, symbol: 'Nb', name: 'Niobium', atomicMass: 92.906,
    category: 'transition-metal', group: 5, period: 5, block: 'd',
    electronConfiguration: '[Kr] 4d⁴ 5s¹', electronConfigurationSemantic: '[Kr] 4d⁴ 5s¹',
    electronegativity: 1.6, atomicRadius: 198, ionizationEnergy: 652, electronAffinity: 86,
    meltingPoint: 2750, boilingPoint: 5017, density: 8.57, stateAtSTP: 'solid',
    discoveryYear: 1801, discoveredBy: 'Charles Hatchett',
    abundance: { earth: 20, universe: 0.002 }, oxidationStates: [-1, 2, 3, 4, 5],
  },
  {
    atomicNumber: 42, symbol: 'Mo', name: 'Molybdenum', atomicMass: 95.95,
    category: 'transition-metal', group: 6, period: 5, block: 'd',
    electronConfiguration: '[Kr] 4d⁵ 5s¹', electronConfigurationSemantic: '[Kr] 4d⁵ 5s¹',
    electronegativity: 2.16, atomicRadius: 190, ionizationEnergy: 684, electronAffinity: 72,
    meltingPoint: 2896, boilingPoint: 4912, density: 10.22, stateAtSTP: 'solid',
    discoveryYear: 1781, discoveredBy: 'Carl Wilhelm Scheele',
    abundance: { earth: 1.2, universe: 0.005 }, oxidationStates: [-2, -1, 1, 2, 3, 4, 5, 6],
  },
  {
    atomicNumber: 43, symbol: 'Tc', name: 'Technetium', atomicMass: '[98]',
    category: 'transition-metal', group: 7, period: 5, block: 'd',
    electronConfiguration: '[Kr] 4d⁵ 5s²', electronConfigurationSemantic: '[Kr] 4d⁵ 5s²',
    electronegativity: 1.9, atomicRadius: 183, ionizationEnergy: 702, electronAffinity: 53,
    meltingPoint: 2430, boilingPoint: 4538, density: 11.5, stateAtSTP: 'solid',
    discoveryYear: 1937, discoveredBy: 'Carlo Perrier',
    abundance: { earth: null, universe: null }, oxidationStates: [-3, -1, 1, 2, 3, 4, 5, 6, 7],
  },
  {
    atomicNumber: 44, symbol: 'Ru', name: 'Ruthenium', atomicMass: 101.07,
    category: 'transition-metal', group: 8, period: 5, block: 'd',
    electronConfiguration: '[Kr] 4d⁷ 5s¹', electronConfigurationSemantic: '[Kr] 4d⁷ 5s¹',
    electronegativity: 2.2, atomicRadius: 178, ionizationEnergy: 710, electronAffinity: 101,
    meltingPoint: 2607, boilingPoint: 4423, density: 12.37, stateAtSTP: 'solid',
    discoveryYear: 1844, discoveredBy: 'Karl Ernst Claus',
    abundance: { earth: 0.001, universe: 0.004 }, oxidationStates: [-2, 1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    atomicNumber: 45, symbol: 'Rh', name: 'Rhodium', atomicMass: 102.91,
    category: 'transition-metal', group: 9, period: 5, block: 'd',
    electronConfiguration: '[Kr] 4d⁸ 5s¹', electronConfigurationSemantic: '[Kr] 4d⁸ 5s¹',
    electronegativity: 2.28, atomicRadius: 173, ionizationEnergy: 720, electronAffinity: 110,
    meltingPoint: 2237, boilingPoint: 3968, density: 12.41, stateAtSTP: 'solid',
    discoveryYear: 1803, discoveredBy: 'William Hyde Wollaston',
    abundance: { earth: 0.001, universe: 0.0006 }, oxidationStates: [-1, 1, 2, 3, 4, 5, 6],
  },
  {
    atomicNumber: 46, symbol: 'Pd', name: 'Palladium', atomicMass: 106.42,
    category: 'transition-metal', group: 10, period: 5, block: 'd',
    electronConfiguration: '[Kr] 4d¹⁰', electronConfigurationSemantic: '[Kr] 4d¹⁰',
    electronegativity: 2.20, atomicRadius: 169, ionizationEnergy: 804, electronAffinity: 54,
    meltingPoint: 1828, boilingPoint: 3236, density: 12.02, stateAtSTP: 'solid',
    discoveryYear: 1803, discoveredBy: 'William Hyde Wollaston',
    abundance: { earth: 0.015, universe: 0.002 }, oxidationStates: [2, 4],
  },
  {
    atomicNumber: 47, symbol: 'Ag', name: 'Silver', atomicMass: 107.87,
    category: 'transition-metal', group: 11, period: 5, block: 'd',
    electronConfiguration: '[Kr] 4d¹⁰ 5s¹', electronConfigurationSemantic: '[Kr] 4d¹⁰ 5s¹',
    electronegativity: 1.93, atomicRadius: 165, ionizationEnergy: 731, electronAffinity: 126,
    meltingPoint: 1235, boilingPoint: 2435, density: 10.501, stateAtSTP: 'solid',
    discoveryYear: null, discoveredBy: null,
    abundance: { earth: 0.075, universe: 0.0006 }, oxidationStates: [1, 2, 3],
  },
  {
    atomicNumber: 48, symbol: 'Cd', name: 'Cadmium', atomicMass: 112.41,
    category: 'transition-metal', group: 12, period: 5, block: 'd',
    electronConfiguration: '[Kr] 4d¹⁰ 5s²', electronConfigurationSemantic: '[Kr] 4d¹⁰ 5s²',
    electronegativity: 1.69, atomicRadius: 161, ionizationEnergy: 868, electronAffinity: 0,
    meltingPoint: 594, boilingPoint: 1040, density: 8.69, stateAtSTP: 'solid',
    discoveryYear: 1817, discoveredBy: 'Karl Samuel Leberecht Hermann',
    abundance: { earth: 0.15, universe: 0.002 }, oxidationStates: [2],
  },
  {
    atomicNumber: 49, symbol: 'In', name: 'Indium', atomicMass: 114.82,
    category: 'post-transition-metal', group: 13, period: 5, block: 'p',
    electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p¹', electronConfigurationSemantic: '[Kr] 4d¹⁰ 5s² 5p¹',
    electronegativity: 1.78, atomicRadius: 156, ionizationEnergy: 558, electronAffinity: 39,
    meltingPoint: 430, boilingPoint: 2345, density: 7.31, stateAtSTP: 'solid',
    discoveryYear: 1863, discoveredBy: 'Ferdinand Reich',
    abundance: { earth: 0.25, universe: 0.0003 }, oxidationStates: [1, 3],
  },
  {
    atomicNumber: 50, symbol: 'Sn', name: 'Tin', atomicMass: 118.71,
    category: 'post-transition-metal', group: 14, period: 5, block: 'p',
    electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p²', electronConfigurationSemantic: '[Kr] 4d¹⁰ 5s² 5p²',
    electronegativity: 1.96, atomicRadius: 145, ionizationEnergy: 709, electronAffinity: 107,
    meltingPoint: 505, boilingPoint: 2875, density: 7.287, stateAtSTP: 'solid',
    discoveryYear: null, discoveredBy: null,
    abundance: { earth: 2.3, universe: 0.004 }, oxidationStates: [-4, 2, 4],
  },
  {
    atomicNumber: 51, symbol: 'Sb', name: 'Antimony', atomicMass: 121.76,
    category: 'metalloid', group: 15, period: 5, block: 'p',
    electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p³', electronConfigurationSemantic: '[Kr] 4d¹⁰ 5s² 5p³',
    electronegativity: 2.05, atomicRadius: 133, ionizationEnergy: 834, electronAffinity: 103,
    meltingPoint: 904, boilingPoint: 1860, density: 6.685, stateAtSTP: 'solid',
    discoveryYear: null, discoveredBy: null,
    abundance: { earth: 0.2, universe: 0.0004 }, oxidationStates: [-3, 3, 5],
  },
  {
    atomicNumber: 52, symbol: 'Te', name: 'Tellurium', atomicMass: 127.60,
    category: 'metalloid', group: 16, period: 5, block: 'p',
    electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁴', electronConfigurationSemantic: '[Kr] 4d¹⁰ 5s² 5p⁴',
    electronegativity: 2.1, atomicRadius: 123, ionizationEnergy: 869, electronAffinity: 190,
    meltingPoint: 723, boilingPoint: 1261, density: 6.232, stateAtSTP: 'solid',
    discoveryYear: 1783, discoveredBy: 'Franz-Joseph Müller von Reichenstein',
    abundance: { earth: 0.001, universe: 0.009 }, oxidationStates: [-2, 2, 4, 6],
  },
  {
    atomicNumber: 53, symbol: 'I', name: 'Iodine', atomicMass: 126.90,
    category: 'halogen', group: 17, period: 5, block: 'p',
    electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁵', electronConfigurationSemantic: '[Kr] 4d¹⁰ 5s² 5p⁵',
    electronegativity: 2.66, atomicRadius: 115, ionizationEnergy: 1008, electronAffinity: 295,
    meltingPoint: 387, boilingPoint: 457, density: 4.93, stateAtSTP: 'solid',
    discoveryYear: 1811, discoveredBy: 'Bernard Courtois',
    abundance: { earth: 0.45, universe: 0.001 }, oxidationStates: [-1, 1, 3, 5, 7],
  },
  {
    atomicNumber: 54, symbol: 'Xe', name: 'Xenon', atomicMass: 131.29,
    category: 'noble-gas', group: 18, period: 5, block: 'p',
    electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁶', electronConfigurationSemantic: '[Kr] 4d¹⁰ 5s² 5p⁶',
    electronegativity: 2.6, atomicRadius: 108, ionizationEnergy: 1170, electronAffinity: 0,
    meltingPoint: 161, boilingPoint: 165, density: 0.005887, stateAtSTP: 'gas',
    discoveryYear: 1898, discoveredBy: 'William Ramsay',
    abundance: { earth: 0.00003, universe: 0.00001 }, oxidationStates: [0, 2, 4, 6, 8],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PERIOD 6 (including Lanthanides)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    atomicNumber: 55, symbol: 'Cs', name: 'Caesium', atomicMass: 132.91,
    category: 'alkali-metal', group: 1, period: 6, block: 's',
    electronConfiguration: '[Xe] 6s¹', electronConfigurationSemantic: '[Xe] 6s¹',
    electronegativity: 0.79, atomicRadius: 298, ionizationEnergy: 376, electronAffinity: 46,
    meltingPoint: 302, boilingPoint: 944, density: 1.873, stateAtSTP: 'solid',
    discoveryYear: 1860, discoveredBy: 'Robert Bunsen',
    abundance: { earth: 3, universe: 0.0008 }, oxidationStates: [1],
  },
  {
    atomicNumber: 56, symbol: 'Ba', name: 'Barium', atomicMass: 137.33,
    category: 'alkaline-earth', group: 2, period: 6, block: 's',
    electronConfiguration: '[Xe] 6s²', electronConfigurationSemantic: '[Xe] 6s²',
    electronegativity: 0.89, atomicRadius: 253, ionizationEnergy: 503, electronAffinity: 14,
    meltingPoint: 1000, boilingPoint: 2170, density: 3.594, stateAtSTP: 'solid',
    discoveryYear: 1808, discoveredBy: 'Humphry Davy',
    abundance: { earth: 425, universe: 0.01 }, oxidationStates: [2],
  },
  // LANTHANIDES (57-71)
  {
    atomicNumber: 57, symbol: 'La', name: 'Lanthanum', atomicMass: 138.91,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 5d¹ 6s²', electronConfigurationSemantic: '[Xe] 5d¹ 6s²',
    electronegativity: 1.1, atomicRadius: 195, ionizationEnergy: 538, electronAffinity: 48,
    meltingPoint: 1193, boilingPoint: 3737, density: 6.145, stateAtSTP: 'solid',
    discoveryYear: 1839, discoveredBy: 'Carl Gustaf Mosander',
    abundance: { earth: 39, universe: 0.002 }, oxidationStates: [3],
  },
  {
    atomicNumber: 58, symbol: 'Ce', name: 'Cerium', atomicMass: 140.12,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f¹ 5d¹ 6s²', electronConfigurationSemantic: '[Xe] 4f¹ 5d¹ 6s²',
    electronegativity: 1.12, atomicRadius: 185, ionizationEnergy: 534, electronAffinity: 50,
    meltingPoint: 1068, boilingPoint: 3716, density: 6.77, stateAtSTP: 'solid',
    discoveryYear: 1803, discoveredBy: 'Jöns Jacob Berzelius',
    abundance: { earth: 66.5, universe: 0.001 }, oxidationStates: [3, 4],
  },
  {
    atomicNumber: 59, symbol: 'Pr', name: 'Praseodymium', atomicMass: 140.91,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f³ 6s²', electronConfigurationSemantic: '[Xe] 4f³ 6s²',
    electronegativity: 1.13, atomicRadius: 182, ionizationEnergy: 527, electronAffinity: 50,
    meltingPoint: 1208, boilingPoint: 3793, density: 6.77, stateAtSTP: 'solid',
    discoveryYear: 1885, discoveredBy: 'Carl Auer von Welsbach',
    abundance: { earth: 9.2, universe: 0.0002 }, oxidationStates: [2, 3, 4],
  },
  {
    atomicNumber: 60, symbol: 'Nd', name: 'Neodymium', atomicMass: 144.24,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f⁴ 6s²', electronConfigurationSemantic: '[Xe] 4f⁴ 6s²',
    electronegativity: 1.14, atomicRadius: 181, ionizationEnergy: 533, electronAffinity: 50,
    meltingPoint: 1297, boilingPoint: 3347, density: 7.01, stateAtSTP: 'solid',
    discoveryYear: 1885, discoveredBy: 'Carl Auer von Welsbach',
    abundance: { earth: 41.5, universe: 0.001 }, oxidationStates: [2, 3],
  },
  {
    atomicNumber: 61, symbol: 'Pm', name: 'Promethium', atomicMass: '[145]',
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f⁵ 6s²', electronConfigurationSemantic: '[Xe] 4f⁵ 6s²',
    electronegativity: 1.13, atomicRadius: 183, ionizationEnergy: 540, electronAffinity: 50,
    meltingPoint: 1315, boilingPoint: 3273, density: 7.26, stateAtSTP: 'solid',
    discoveryYear: 1945, discoveredBy: 'Chien Shiung Wu',
    abundance: { earth: null, universe: null }, oxidationStates: [3],
  },
  {
    atomicNumber: 62, symbol: 'Sm', name: 'Samarium', atomicMass: 150.36,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f⁶ 6s²', electronConfigurationSemantic: '[Xe] 4f⁶ 6s²',
    electronegativity: 1.17, atomicRadius: 180, ionizationEnergy: 545, electronAffinity: 50,
    meltingPoint: 1345, boilingPoint: 2067, density: 7.52, stateAtSTP: 'solid',
    discoveryYear: 1879, discoveredBy: 'Lecoq de Boisbaudran',
    abundance: { earth: 7.05, universe: 0.0005 }, oxidationStates: [2, 3],
  },
  {
    atomicNumber: 63, symbol: 'Eu', name: 'Europium', atomicMass: 151.96,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f⁷ 6s²', electronConfigurationSemantic: '[Xe] 4f⁷ 6s²',
    electronegativity: 1.2, atomicRadius: 180, ionizationEnergy: 547, electronAffinity: 50,
    meltingPoint: 1099, boilingPoint: 1802, density: 5.24, stateAtSTP: 'solid',
    discoveryYear: 1901, discoveredBy: 'Eugène-Anatole Demarçay',
    abundance: { earth: 2, universe: 0.0005 }, oxidationStates: [2, 3],
  },
  {
    atomicNumber: 64, symbol: 'Gd', name: 'Gadolinium', atomicMass: 157.25,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f⁷ 5d¹ 6s²', electronConfigurationSemantic: '[Xe] 4f⁷ 5d¹ 6s²',
    electronegativity: 1.2, atomicRadius: 180, ionizationEnergy: 593, electronAffinity: 50,
    meltingPoint: 1585, boilingPoint: 3546, density: 7.90, stateAtSTP: 'solid',
    discoveryYear: 1880, discoveredBy: 'Jean Charles Galissard de Marignac',
    abundance: { earth: 6.2, universe: 0.002 }, oxidationStates: [1, 2, 3],
  },
  {
    atomicNumber: 65, symbol: 'Tb', name: 'Terbium', atomicMass: 158.93,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f⁹ 6s²', electronConfigurationSemantic: '[Xe] 4f⁹ 6s²',
    electronegativity: 1.2, atomicRadius: 177, ionizationEnergy: 566, electronAffinity: 50,
    meltingPoint: 1629, boilingPoint: 3503, density: 8.23, stateAtSTP: 'solid',
    discoveryYear: 1843, discoveredBy: 'Carl Gustaf Mosander',
    abundance: { earth: 1.2, universe: 0.00005 }, oxidationStates: [1, 3, 4],
  },
  {
    atomicNumber: 66, symbol: 'Dy', name: 'Dysprosium', atomicMass: 162.50,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f¹⁰ 6s²', electronConfigurationSemantic: '[Xe] 4f¹⁰ 6s²',
    electronegativity: 1.22, atomicRadius: 178, ionizationEnergy: 573, electronAffinity: 50,
    meltingPoint: 1680, boilingPoint: 2840, density: 8.55, stateAtSTP: 'solid',
    discoveryYear: 1886, discoveredBy: 'Lecoq de Boisbaudran',
    abundance: { earth: 5.2, universe: 0.002 }, oxidationStates: [2, 3],
  },
  {
    atomicNumber: 67, symbol: 'Ho', name: 'Holmium', atomicMass: 164.93,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f¹¹ 6s²', electronConfigurationSemantic: '[Xe] 4f¹¹ 6s²',
    electronegativity: 1.23, atomicRadius: 176, ionizationEnergy: 581, electronAffinity: 50,
    meltingPoint: 1734, boilingPoint: 2993, density: 8.80, stateAtSTP: 'solid',
    discoveryYear: 1878, discoveredBy: 'Marc Delafontaine',
    abundance: { earth: 1.3, universe: 0.0005 }, oxidationStates: [3],
  },
  {
    atomicNumber: 68, symbol: 'Er', name: 'Erbium', atomicMass: 167.26,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f¹² 6s²', electronConfigurationSemantic: '[Xe] 4f¹² 6s²',
    electronegativity: 1.24, atomicRadius: 176, ionizationEnergy: 589, electronAffinity: 50,
    meltingPoint: 1802, boilingPoint: 3141, density: 9.07, stateAtSTP: 'solid',
    discoveryYear: 1843, discoveredBy: 'Carl Gustaf Mosander',
    abundance: { earth: 3.5, universe: 0.0002 }, oxidationStates: [3],
  },
  {
    atomicNumber: 69, symbol: 'Tm', name: 'Thulium', atomicMass: 168.93,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f¹³ 6s²', electronConfigurationSemantic: '[Xe] 4f¹³ 6s²',
    electronegativity: 1.25, atomicRadius: 176, ionizationEnergy: 597, electronAffinity: 50,
    meltingPoint: 1818, boilingPoint: 2223, density: 9.32, stateAtSTP: 'solid',
    discoveryYear: 1879, discoveredBy: 'Per Teodor Cleve',
    abundance: { earth: 0.52, universe: 0.00001 }, oxidationStates: [2, 3],
  },
  {
    atomicNumber: 70, symbol: 'Yb', name: 'Ytterbium', atomicMass: 173.05,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f¹⁴ 6s²', electronConfigurationSemantic: '[Xe] 4f¹⁴ 6s²',
    electronegativity: 1.1, atomicRadius: 176, ionizationEnergy: 603, electronAffinity: 50,
    meltingPoint: 1097, boilingPoint: 1469, density: 6.90, stateAtSTP: 'solid',
    discoveryYear: 1878, discoveredBy: 'Jean Charles Galissard de Marignac',
    abundance: { earth: 3.2, universe: 0.0002 }, oxidationStates: [2, 3],
  },
  {
    atomicNumber: 71, symbol: 'Lu', name: 'Lutetium', atomicMass: 174.97,
    category: 'lanthanide', group: null, period: 6, block: 'f',
    electronConfiguration: '[Xe] 4f¹⁴ 5d¹ 6s²', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d¹ 6s²',
    electronegativity: 1.27, atomicRadius: 174, ionizationEnergy: 524, electronAffinity: 50,
    meltingPoint: 1925, boilingPoint: 3675, density: 9.84, stateAtSTP: 'solid',
    discoveryYear: 1907, discoveredBy: 'Georges Urbain',
    abundance: { earth: 0.8, universe: 0.00001 }, oxidationStates: [3],
  },
  // Period 6 d-block (72-80)
  {
    atomicNumber: 72, symbol: 'Hf', name: 'Hafnium', atomicMass: 178.49,
    category: 'transition-metal', group: 4, period: 6, block: 'd',
    electronConfiguration: '[Xe] 4f¹⁴ 5d² 6s²', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d² 6s²',
    electronegativity: 1.3, atomicRadius: 208, ionizationEnergy: 659, electronAffinity: 0,
    meltingPoint: 2506, boilingPoint: 4876, density: 13.31, stateAtSTP: 'solid',
    discoveryYear: 1923, discoveredBy: 'Dirk Coster',
    abundance: { earth: 3, universe: 0.0007 }, oxidationStates: [4],
  },
  {
    atomicNumber: 73, symbol: 'Ta', name: 'Tantalum', atomicMass: 180.95,
    category: 'transition-metal', group: 5, period: 6, block: 'd',
    electronConfiguration: '[Xe] 4f¹⁴ 5d³ 6s²', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d³ 6s²',
    electronegativity: 1.5, atomicRadius: 200, ionizationEnergy: 761, electronAffinity: 31,
    meltingPoint: 3290, boilingPoint: 5731, density: 16.65, stateAtSTP: 'solid',
    discoveryYear: 1802, discoveredBy: 'Anders Gustaf Ekeberg',
    abundance: { earth: 2, universe: 0.00001 }, oxidationStates: [-1, 2, 3, 4, 5],
  },
  {
    atomicNumber: 74, symbol: 'W', name: 'Tungsten', atomicMass: 183.84,
    category: 'transition-metal', group: 6, period: 6, block: 'd',
    electronConfiguration: '[Xe] 4f¹⁴ 5d⁴ 6s²', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d⁴ 6s²',
    electronegativity: 2.36, atomicRadius: 193, ionizationEnergy: 770, electronAffinity: 79,
    meltingPoint: 3695, boilingPoint: 5828, density: 19.25, stateAtSTP: 'solid',
    discoveryYear: 1783, discoveredBy: 'Juan José Elhuyar',
    abundance: { earth: 1.3, universe: 0.0005 }, oxidationStates: [-2, -1, 1, 2, 3, 4, 5, 6],
  },
  {
    atomicNumber: 75, symbol: 'Re', name: 'Rhenium', atomicMass: 186.21,
    category: 'transition-metal', group: 7, period: 6, block: 'd',
    electronConfiguration: '[Xe] 4f¹⁴ 5d⁵ 6s²', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d⁵ 6s²',
    electronegativity: 1.9, atomicRadius: 188, ionizationEnergy: 760, electronAffinity: 14,
    meltingPoint: 3459, boilingPoint: 5869, density: 21.02, stateAtSTP: 'solid',
    discoveryYear: 1925, discoveredBy: 'Masataka Ogawa',
    abundance: { earth: 0.0007, universe: 0.00002 }, oxidationStates: [-3, -1, 1, 2, 3, 4, 5, 6, 7],
  },
  {
    atomicNumber: 76, symbol: 'Os', name: 'Osmium', atomicMass: 190.23,
    category: 'transition-metal', group: 8, period: 6, block: 'd',
    electronConfiguration: '[Xe] 4f¹⁴ 5d⁶ 6s²', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d⁶ 6s²',
    electronegativity: 2.2, atomicRadius: 185, ionizationEnergy: 840, electronAffinity: 106,
    meltingPoint: 3306, boilingPoint: 5285, density: 22.59, stateAtSTP: 'solid',
    discoveryYear: 1803, discoveredBy: 'Smithson Tennant',
    abundance: { earth: 0.0015, universe: 0.003 }, oxidationStates: [-2, -1, 1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    atomicNumber: 77, symbol: 'Ir', name: 'Iridium', atomicMass: 192.22,
    category: 'transition-metal', group: 9, period: 6, block: 'd',
    electronConfiguration: '[Xe] 4f¹⁴ 5d⁷ 6s²', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d⁷ 6s²',
    electronegativity: 2.2, atomicRadius: 180, ionizationEnergy: 880, electronAffinity: 151,
    meltingPoint: 2719, boilingPoint: 4701, density: 22.56, stateAtSTP: 'solid',
    discoveryYear: 1803, discoveredBy: 'Smithson Tennant',
    abundance: { earth: 0.001, universe: 0.002 }, oxidationStates: [-3, -1, 1, 2, 3, 4, 5, 6],
  },
  {
    atomicNumber: 78, symbol: 'Pt', name: 'Platinum', atomicMass: 195.08,
    category: 'transition-metal', group: 10, period: 6, block: 'd',
    electronConfiguration: '[Xe] 4f¹⁴ 5d⁹ 6s¹', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d⁹ 6s¹',
    electronegativity: 2.28, atomicRadius: 177, ionizationEnergy: 870, electronAffinity: 205,
    meltingPoint: 2041, boilingPoint: 4098, density: 21.45, stateAtSTP: 'solid',
    discoveryYear: 1735, discoveredBy: 'Antonio de Ulloa',
    abundance: { earth: 0.005, universe: 0.005 }, oxidationStates: [2, 4, 5, 6],
  },
  {
    atomicNumber: 79, symbol: 'Au', name: 'Gold', atomicMass: 196.97,
    category: 'transition-metal', group: 11, period: 6, block: 'd',
    electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
    electronegativity: 2.54, atomicRadius: 174, ionizationEnergy: 890, electronAffinity: 223,
    meltingPoint: 1337, boilingPoint: 3129, density: 19.282, stateAtSTP: 'solid',
    discoveryYear: null, discoveredBy: null,
    abundance: { earth: 0.004, universe: 0.0006 }, oxidationStates: [-1, 1, 2, 3, 5],
  },
  {
    atomicNumber: 80, symbol: 'Hg', name: 'Mercury', atomicMass: 200.59,
    category: 'transition-metal', group: 12, period: 6, block: 'd',
    electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d¹⁰ 6s²',
    electronegativity: 2.0, atomicRadius: 171, ionizationEnergy: 1007, electronAffinity: 0,
    meltingPoint: 234, boilingPoint: 630, density: 13.534, stateAtSTP: 'liquid',
    discoveryYear: null, discoveredBy: null,
    abundance: { earth: 0.085, universe: 0.001 }, oxidationStates: [1, 2],
  },
  // Period 6 p-block (81-86)
  {
    atomicNumber: 81, symbol: 'Tl', name: 'Thallium', atomicMass: 204.38,
    category: 'post-transition-metal', group: 13, period: 6, block: 'p',
    electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹',
    electronegativity: 1.62, atomicRadius: 156, ionizationEnergy: 589, electronAffinity: 19,
    meltingPoint: 577, boilingPoint: 1746, density: 11.85, stateAtSTP: 'solid',
    discoveryYear: 1861, discoveredBy: 'William Crookes',
    abundance: { earth: 0.85, universe: 0.0005 }, oxidationStates: [1, 3],
  },
  {
    atomicNumber: 82, symbol: 'Pb', name: 'Lead', atomicMass: 207.2,
    category: 'post-transition-metal', group: 14, period: 6, block: 'p',
    electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²',
    electronegativity: 2.33, atomicRadius: 154, ionizationEnergy: 716, electronAffinity: 35,
    meltingPoint: 601, boilingPoint: 2022, density: 11.342, stateAtSTP: 'solid',
    discoveryYear: null, discoveredBy: null,
    abundance: { earth: 14, universe: 0.01 }, oxidationStates: [-4, 2, 4],
  },
  {
    atomicNumber: 83, symbol: 'Bi', name: 'Bismuth', atomicMass: 208.98,
    category: 'post-transition-metal', group: 15, period: 6, block: 'p',
    electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³',
    electronegativity: 2.02, atomicRadius: 143, ionizationEnergy: 703, electronAffinity: 91,
    meltingPoint: 545, boilingPoint: 1837, density: 9.78, stateAtSTP: 'solid',
    discoveryYear: 1753, discoveredBy: 'Claude François Geoffroy',
    abundance: { earth: 0.009, universe: 0.0007 }, oxidationStates: [-3, 3, 5],
  },
  {
    atomicNumber: 84, symbol: 'Po', name: 'Polonium', atomicMass: '[209]',
    category: 'metalloid', group: 16, period: 6, block: 'p',
    electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴',
    electronegativity: 2.0, atomicRadius: 135, ionizationEnergy: 812, electronAffinity: 183,
    meltingPoint: 527, boilingPoint: 1235, density: 9.20, stateAtSTP: 'solid',
    discoveryYear: 1898, discoveredBy: 'Marie Curie',
    abundance: { earth: null, universe: null }, oxidationStates: [-2, 2, 4, 6],
  },
  {
    atomicNumber: 85, symbol: 'At', name: 'Astatine', atomicMass: '[210]',
    category: 'halogen', group: 17, period: 6, block: 'p',
    electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵',
    electronegativity: 2.2, atomicRadius: null, ionizationEnergy: 890, electronAffinity: 270,
    meltingPoint: 575, boilingPoint: 610, density: 7, stateAtSTP: 'solid',
    discoveryYear: 1940, discoveredBy: 'Dale R. Corson',
    abundance: { earth: null, universe: null }, oxidationStates: [-1, 1, 3, 5, 7],
  },
  {
    atomicNumber: 86, symbol: 'Rn', name: 'Radon', atomicMass: '[222]',
    category: 'noble-gas', group: 18, period: 6, block: 'p',
    electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', electronConfigurationSemantic: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶',
    electronegativity: 2.2, atomicRadius: 120, ionizationEnergy: 1037, electronAffinity: 0,
    meltingPoint: 202, boilingPoint: 211, density: 0.00973, stateAtSTP: 'gas',
    discoveryYear: 1900, discoveredBy: 'Friedrich Ernst Dorn',
    abundance: { earth: null, universe: null }, oxidationStates: [0, 2],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PERIOD 7 (including Actinides)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    atomicNumber: 87, symbol: 'Fr', name: 'Francium', atomicMass: '[223]',
    category: 'alkali-metal', group: 1, period: 7, block: 's',
    electronConfiguration: '[Rn] 7s¹', electronConfigurationSemantic: '[Rn] 7s¹',
    electronegativity: 0.79, atomicRadius: 348, ionizationEnergy: 380, electronAffinity: null,
    meltingPoint: 300, boilingPoint: 950, density: 1.87, stateAtSTP: 'solid',
    discoveryYear: 1939, discoveredBy: 'Marguerite Perey',
    abundance: { earth: null, universe: null }, oxidationStates: [1],
  },
  {
    atomicNumber: 88, symbol: 'Ra', name: 'Radium', atomicMass: '[226]',
    category: 'alkaline-earth', group: 2, period: 7, block: 's',
    electronConfiguration: '[Rn] 7s²', electronConfigurationSemantic: '[Rn] 7s²',
    electronegativity: 0.9, atomicRadius: 283, ionizationEnergy: 509, electronAffinity: null,
    meltingPoint: 973, boilingPoint: 2010, density: 5.5, stateAtSTP: 'solid',
    discoveryYear: 1898, discoveredBy: 'Marie Curie',
    abundance: { earth: null, universe: null }, oxidationStates: [2],
  },
  // ACTINIDES (89-103)
  {
    atomicNumber: 89, symbol: 'Ac', name: 'Actinium', atomicMass: '[227]',
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 6d¹ 7s²', electronConfigurationSemantic: '[Rn] 6d¹ 7s²',
    electronegativity: 1.1, atomicRadius: 195, ionizationEnergy: 499, electronAffinity: null,
    meltingPoint: 1323, boilingPoint: 3471, density: 10.07, stateAtSTP: 'solid',
    discoveryYear: 1899, discoveredBy: 'André-Louis Debierne',
    abundance: { earth: null, universe: null }, oxidationStates: [3],
  },
  {
    atomicNumber: 90, symbol: 'Th', name: 'Thorium', atomicMass: 232.04,
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 6d² 7s²', electronConfigurationSemantic: '[Rn] 6d² 7s²',
    electronegativity: 1.3, atomicRadius: 180, ionizationEnergy: 587, electronAffinity: null,
    meltingPoint: 2023, boilingPoint: 5061, density: 11.72, stateAtSTP: 'solid',
    discoveryYear: 1829, discoveredBy: 'Jöns Jacob Berzelius',
    abundance: { earth: 9.6, universe: 0.00004 }, oxidationStates: [4],
  },
  {
    atomicNumber: 91, symbol: 'Pa', name: 'Protactinium', atomicMass: 231.04,
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 5f² 6d¹ 7s²', electronConfigurationSemantic: '[Rn] 5f² 6d¹ 7s²',
    electronegativity: 1.5, atomicRadius: 180, ionizationEnergy: 568, electronAffinity: null,
    meltingPoint: 1841, boilingPoint: 4300, density: 15.37, stateAtSTP: 'solid',
    discoveryYear: 1913, discoveredBy: 'Kasimir Fajans',
    abundance: { earth: null, universe: null }, oxidationStates: [3, 4, 5],
  },
  {
    atomicNumber: 92, symbol: 'U', name: 'Uranium', atomicMass: 238.03,
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 5f³ 6d¹ 7s²', electronConfigurationSemantic: '[Rn] 5f³ 6d¹ 7s²',
    electronegativity: 1.38, atomicRadius: 175, ionizationEnergy: 598, electronAffinity: null,
    meltingPoint: 1405, boilingPoint: 4404, density: 18.95, stateAtSTP: 'solid',
    discoveryYear: 1789, discoveredBy: 'Martin Heinrich Klaproth',
    abundance: { earth: 2.7, universe: 0.00002 }, oxidationStates: [3, 4, 5, 6],
  },
  {
    atomicNumber: 93, symbol: 'Np', name: 'Neptunium', atomicMass: '[237]',
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 5f⁴ 6d¹ 7s²', electronConfigurationSemantic: '[Rn] 5f⁴ 6d¹ 7s²',
    electronegativity: 1.36, atomicRadius: 175, ionizationEnergy: 605, electronAffinity: null,
    meltingPoint: 917, boilingPoint: 4175, density: 20.45, stateAtSTP: 'solid',
    discoveryYear: 1940, discoveredBy: 'Edwin McMillan',
    abundance: { earth: null, universe: null }, oxidationStates: [3, 4, 5, 6, 7],
  },
  {
    atomicNumber: 94, symbol: 'Pu', name: 'Plutonium', atomicMass: '[244]',
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 5f⁶ 7s²', electronConfigurationSemantic: '[Rn] 5f⁶ 7s²',
    electronegativity: 1.28, atomicRadius: 175, ionizationEnergy: 585, electronAffinity: null,
    meltingPoint: 913, boilingPoint: 3501, density: 19.84, stateAtSTP: 'solid',
    discoveryYear: 1940, discoveredBy: 'Glenn T. Seaborg',
    abundance: { earth: null, universe: null }, oxidationStates: [3, 4, 5, 6, 7],
  },
  {
    atomicNumber: 95, symbol: 'Am', name: 'Americium', atomicMass: '[243]',
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 5f⁷ 7s²', electronConfigurationSemantic: '[Rn] 5f⁷ 7s²',
    electronegativity: 1.3, atomicRadius: 175, ionizationEnergy: 578, electronAffinity: null,
    meltingPoint: 1449, boilingPoint: 2880, density: 13.69, stateAtSTP: 'solid',
    discoveryYear: 1944, discoveredBy: 'Glenn T. Seaborg',
    abundance: { earth: null, universe: null }, oxidationStates: [2, 3, 4, 5, 6],
  },
  {
    atomicNumber: 96, symbol: 'Cm', name: 'Curium', atomicMass: '[247]',
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 5f⁷ 6d¹ 7s²', electronConfigurationSemantic: '[Rn] 5f⁷ 6d¹ 7s²',
    electronegativity: 1.3, atomicRadius: 174, ionizationEnergy: 581, electronAffinity: null,
    meltingPoint: 1613, boilingPoint: 3383, density: 13.51, stateAtSTP: 'solid',
    discoveryYear: 1944, discoveredBy: 'Glenn T. Seaborg',
    abundance: { earth: null, universe: null }, oxidationStates: [3, 4],
  },
  {
    atomicNumber: 97, symbol: 'Bk', name: 'Berkelium', atomicMass: '[247]',
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 5f⁹ 7s²', electronConfigurationSemantic: '[Rn] 5f⁹ 7s²',
    electronegativity: 1.3, atomicRadius: 170, ionizationEnergy: 601, electronAffinity: null,
    meltingPoint: 1259, boilingPoint: 2900, density: 14.79, stateAtSTP: 'solid',
    discoveryYear: 1949, discoveredBy: 'Lawrence Berkeley National Laboratory',
    abundance: { earth: null, universe: null }, oxidationStates: [3, 4],
  },
  {
    atomicNumber: 98, symbol: 'Cf', name: 'Californium', atomicMass: '[251]',
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 5f¹⁰ 7s²', electronConfigurationSemantic: '[Rn] 5f¹⁰ 7s²',
    electronegativity: 1.3, atomicRadius: 169, ionizationEnergy: 608, electronAffinity: null,
    meltingPoint: 1173, boilingPoint: 1743, density: 15.1, stateAtSTP: 'solid',
    discoveryYear: 1950, discoveredBy: 'Lawrence Berkeley National Laboratory',
    abundance: { earth: null, universe: null }, oxidationStates: [2, 3, 4],
  },
  {
    atomicNumber: 99, symbol: 'Es', name: 'Einsteinium', atomicMass: '[252]',
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 5f¹¹ 7s²', electronConfigurationSemantic: '[Rn] 5f¹¹ 7s²',
    electronegativity: 1.3, atomicRadius: null, ionizationEnergy: 619, electronAffinity: null,
    meltingPoint: 1133, boilingPoint: 1269, density: 8.84, stateAtSTP: 'solid',
    discoveryYear: 1952, discoveredBy: 'Lawrence Berkeley National Laboratory',
    abundance: { earth: null, universe: null }, oxidationStates: [2, 3],
  },
  {
    atomicNumber: 100, symbol: 'Fm', name: 'Fermium', atomicMass: '[257]',
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 5f¹² 7s²', electronConfigurationSemantic: '[Rn] 5f¹² 7s²',
    electronegativity: 1.3, atomicRadius: null, ionizationEnergy: 629, electronAffinity: null,
    meltingPoint: 1800, boilingPoint: null, density: null, stateAtSTP: 'solid',
    discoveryYear: 1952, discoveredBy: 'Lawrence Berkeley National Laboratory',
    abundance: { earth: null, universe: null }, oxidationStates: [2, 3],
  },
  {
    atomicNumber: 101, symbol: 'Md', name: 'Mendelevium', atomicMass: '[258]',
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 5f¹³ 7s²', electronConfigurationSemantic: '[Rn] 5f¹³ 7s²',
    electronegativity: 1.3, atomicRadius: null, ionizationEnergy: 635, electronAffinity: null,
    meltingPoint: 1100, boilingPoint: null, density: null, stateAtSTP: 'solid',
    discoveryYear: 1955, discoveredBy: 'Lawrence Berkeley National Laboratory',
    abundance: { earth: null, universe: null }, oxidationStates: [2, 3],
  },
  {
    atomicNumber: 102, symbol: 'No', name: 'Nobelium', atomicMass: '[259]',
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 5f¹⁴ 7s²', electronConfigurationSemantic: '[Rn] 5f¹⁴ 7s²',
    electronegativity: 1.3, atomicRadius: null, ionizationEnergy: 642, electronAffinity: null,
    meltingPoint: 1100, boilingPoint: null, density: null, stateAtSTP: 'solid',
    discoveryYear: 1958, discoveredBy: 'Joint Institute for Nuclear Research',
    abundance: { earth: null, universe: null }, oxidationStates: [2, 3],
  },
  {
    atomicNumber: 103, symbol: 'Lr', name: 'Lawrencium', atomicMass: '[266]',
    category: 'actinide', group: null, period: 7, block: 'f',
    electronConfiguration: '[Rn] 5f¹⁴ 7s² 7p¹', electronConfigurationSemantic: '[Rn] 5f¹⁴ 7s² 7p¹',
    electronegativity: 1.3, atomicRadius: null, ionizationEnergy: 470, electronAffinity: null,
    meltingPoint: 1900, boilingPoint: null, density: null, stateAtSTP: 'solid',
    discoveryYear: 1961, discoveredBy: 'Lawrence Berkeley National Laboratory',
    abundance: { earth: null, universe: null }, oxidationStates: [3],
  },
  // TRANSACTINIDES (104-118)
  {
    atomicNumber: 104, symbol: 'Rf', name: 'Rutherfordium', atomicMass: '[267]',
    category: 'transition-metal', group: 4, period: 7, block: 'd',
    electronConfiguration: '[Rn] 5f¹⁴ 6d² 7s²', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d² 7s²',
    electronegativity: null, atomicRadius: null, ionizationEnergy: 580, electronAffinity: null,
    meltingPoint: 2400, boilingPoint: 5800, density: 23.2, stateAtSTP: 'solid',
    discoveryYear: 1969, discoveredBy: 'Joint Institute for Nuclear Research',
    abundance: { earth: null, universe: null }, oxidationStates: [4],
  },
  {
    atomicNumber: 105, symbol: 'Db', name: 'Dubnium', atomicMass: '[268]',
    category: 'transition-metal', group: 5, period: 7, block: 'd',
    electronConfiguration: '[Rn] 5f¹⁴ 6d³ 7s²', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d³ 7s²',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: null, boilingPoint: null, density: 29.3, stateAtSTP: 'solid',
    discoveryYear: 1970, discoveredBy: 'Joint Institute for Nuclear Research',
    abundance: { earth: null, universe: null }, oxidationStates: [5],
  },
  {
    atomicNumber: 106, symbol: 'Sg', name: 'Seaborgium', atomicMass: '[269]',
    category: 'transition-metal', group: 6, period: 7, block: 'd',
    electronConfiguration: '[Rn] 5f¹⁴ 6d⁴ 7s²', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d⁴ 7s²',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: null, boilingPoint: null, density: 35, stateAtSTP: 'solid',
    discoveryYear: 1974, discoveredBy: 'Lawrence Berkeley National Laboratory',
    abundance: { earth: null, universe: null }, oxidationStates: [6],
  },
  {
    atomicNumber: 107, symbol: 'Bh', name: 'Bohrium', atomicMass: '[270]',
    category: 'transition-metal', group: 7, period: 7, block: 'd',
    electronConfiguration: '[Rn] 5f¹⁴ 6d⁵ 7s²', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d⁵ 7s²',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: null, boilingPoint: null, density: 37.1, stateAtSTP: 'solid',
    discoveryYear: 1981, discoveredBy: 'GSI Helmholtz Centre',
    abundance: { earth: null, universe: null }, oxidationStates: [7],
  },
  {
    atomicNumber: 108, symbol: 'Hs', name: 'Hassium', atomicMass: '[277]',
    category: 'transition-metal', group: 8, period: 7, block: 'd',
    electronConfiguration: '[Rn] 5f¹⁴ 6d⁶ 7s²', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d⁶ 7s²',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: null, boilingPoint: null, density: 40.7, stateAtSTP: 'solid',
    discoveryYear: 1984, discoveredBy: 'GSI Helmholtz Centre',
    abundance: { earth: null, universe: null }, oxidationStates: [8],
  },
  {
    atomicNumber: 109, symbol: 'Mt', name: 'Meitnerium', atomicMass: '[278]',
    category: 'transition-metal', group: 9, period: 7, block: 'd',
    electronConfiguration: '[Rn] 5f¹⁴ 6d⁷ 7s²', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d⁷ 7s²',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: null, boilingPoint: null, density: 37.4, stateAtSTP: 'solid',
    discoveryYear: 1982, discoveredBy: 'GSI Helmholtz Centre',
    abundance: { earth: null, universe: null }, oxidationStates: [],
  },
  {
    atomicNumber: 110, symbol: 'Ds', name: 'Darmstadtium', atomicMass: '[281]',
    category: 'transition-metal', group: 10, period: 7, block: 'd',
    electronConfiguration: '[Rn] 5f¹⁴ 6d⁸ 7s²', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d⁸ 7s²',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: null, boilingPoint: null, density: 34.8, stateAtSTP: 'solid',
    discoveryYear: 1994, discoveredBy: 'GSI Helmholtz Centre',
    abundance: { earth: null, universe: null }, oxidationStates: [],
  },
  {
    atomicNumber: 111, symbol: 'Rg', name: 'Roentgenium', atomicMass: '[282]',
    category: 'transition-metal', group: 11, period: 7, block: 'd',
    electronConfiguration: '[Rn] 5f¹⁴ 6d⁹ 7s²', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d⁹ 7s²',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: null, boilingPoint: null, density: 28.7, stateAtSTP: 'solid',
    discoveryYear: 1994, discoveredBy: 'GSI Helmholtz Centre',
    abundance: { earth: null, universe: null }, oxidationStates: [],
  },
  {
    atomicNumber: 112, symbol: 'Cn', name: 'Copernicium', atomicMass: '[285]',
    category: 'transition-metal', group: 12, period: 7, block: 'd',
    electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d¹⁰ 7s²',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: null, boilingPoint: null, density: 23.7, stateAtSTP: 'gas',
    discoveryYear: 1996, discoveredBy: 'GSI Helmholtz Centre',
    abundance: { earth: null, universe: null }, oxidationStates: [2],
  },
  {
    atomicNumber: 113, symbol: 'Nh', name: 'Nihonium', atomicMass: '[286]',
    category: 'post-transition-metal', group: 13, period: 7, block: 'p',
    electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: 700, boilingPoint: 1400, density: 16, stateAtSTP: 'solid',
    discoveryYear: 2004, discoveredBy: 'RIKEN',
    abundance: { earth: null, universe: null }, oxidationStates: [],
  },
  {
    atomicNumber: 114, symbol: 'Fl', name: 'Flerovium', atomicMass: '[289]',
    category: 'post-transition-metal', group: 14, period: 7, block: 'p',
    electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: null, boilingPoint: null, density: 14, stateAtSTP: 'gas',
    discoveryYear: 1998, discoveredBy: 'Joint Institute for Nuclear Research',
    abundance: { earth: null, universe: null }, oxidationStates: [],
  },
  {
    atomicNumber: 115, symbol: 'Mc', name: 'Moscovium', atomicMass: '[290]',
    category: 'post-transition-metal', group: 15, period: 7, block: 'p',
    electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: 700, boilingPoint: 1400, density: 13.5, stateAtSTP: 'solid',
    discoveryYear: 2003, discoveredBy: 'Joint Institute for Nuclear Research',
    abundance: { earth: null, universe: null }, oxidationStates: [],
  },
  {
    atomicNumber: 116, symbol: 'Lv', name: 'Livermorium', atomicMass: '[293]',
    category: 'post-transition-metal', group: 16, period: 7, block: 'p',
    electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: 709, boilingPoint: 1085, density: 12.9, stateAtSTP: 'solid',
    discoveryYear: 2000, discoveredBy: 'Joint Institute for Nuclear Research',
    abundance: { earth: null, universe: null }, oxidationStates: [],
  },
  {
    atomicNumber: 117, symbol: 'Ts', name: 'Tennessine', atomicMass: '[294]',
    category: 'halogen', group: 17, period: 7, block: 'p',
    electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: 723, boilingPoint: 883, density: 7.2, stateAtSTP: 'solid',
    discoveryYear: 2010, discoveredBy: 'Joint Institute for Nuclear Research',
    abundance: { earth: null, universe: null }, oxidationStates: [],
  },
  {
    atomicNumber: 118, symbol: 'Og', name: 'Oganesson', atomicMass: '[294]',
    category: 'noble-gas', group: 18, period: 7, block: 'p',
    electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', electronConfigurationSemantic: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶',
    electronegativity: null, atomicRadius: null, ionizationEnergy: null, electronAffinity: null,
    meltingPoint: 325, boilingPoint: 450, density: 5, stateAtSTP: 'solid',
    discoveryYear: 2006, discoveredBy: 'Joint Institute for Nuclear Research',
    abundance: { earth: null, universe: null }, oxidationStates: [],
  },
];
