// Fundamental Forces Data
// The four fundamental forces, their properties, carriers, and interactions

// Force type
export interface Force {
  id: string;
  name: string;
  shortName: string;
  relativeStrength: number; // Strong = 1
  strengthDisplay: string;
  range: number | null; // meters, null = infinite
  rangeDisplay: string;
  carrier: {
    name: string;
    symbol: string;
    mass: number | null; // GeV, null = massless
    massDisplay: string;
    count?: number; // e.g., 8 gluons
    selfInteracting: boolean;
  };
  actsOn: string;
  charge: string; // What "charge" it couples to
  couplingConstant: string;
  couplingValue: number;
  inStandardModel: boolean;
  gaugeGroup?: string; // U(1), SU(2), SU(3)
  color: string;
  keyProperty: string;
  effects: string[];
  discovery: {
    year: number;
    event: string;
    researchers?: string[];
  };
  description: string;
}

export const FORCES: Force[] = [
  {
    id: 'strong',
    name: 'Strong Nuclear Force',
    shortName: 'Strong',
    relativeStrength: 1,
    strengthDisplay: '1',
    range: 1e-15,
    rangeDisplay: '~10⁻¹⁵ m',
    carrier: {
      name: 'Gluon',
      symbol: 'g',
      mass: 0,
      massDisplay: '0',
      count: 8,
      selfInteracting: true,
    },
    actsOn: 'Quarks',
    charge: 'Color charge',
    couplingConstant: 'αs',
    couplingValue: 0.118,
    inStandardModel: true,
    gaugeGroup: 'SU(3)',
    color: '#e11d48', // Rose
    keyProperty: 'Asymptotic freedom — gets weaker at short distances, stronger at long distances. Quarks can never be isolated.',
    effects: [
      'Binds quarks into hadrons (protons, neutrons)',
      'Holds atomic nuclei together (residual strong force)',
      'Nuclear binding energy',
      'Quark confinement',
    ],
    discovery: {
      year: 1973,
      event: 'Asymptotic freedom discovered (QCD)',
      researchers: ['Gross', 'Wilczek', 'Politzer'],
    },
    description: 'The strongest force in nature. Binds quarks together so tightly they can never be separated. Carried by gluons, which themselves carry color charge and interact with each other.',
  },
  {
    id: 'electromagnetic',
    name: 'Electromagnetic Force',
    shortName: 'EM',
    relativeStrength: 1 / 137,
    strengthDisplay: '1/137',
    range: null,
    rangeDisplay: '∞',
    carrier: {
      name: 'Photon',
      symbol: 'γ',
      mass: 0,
      massDisplay: '0',
      selfInteracting: false,
    },
    actsOn: 'Charged particles',
    charge: 'Electric charge',
    couplingConstant: 'α',
    couplingValue: 1 / 137.036,
    inStandardModel: true,
    gaugeGroup: 'U(1)',
    color: '#eab308', // Yellow
    keyProperty: 'Long-range force. Responsible for almost all everyday phenomena except gravity.',
    effects: [
      'Atomic structure (electron orbitals)',
      'Chemical bonding',
      'Light and all electromagnetic radiation',
      'Electricity and magnetism',
      'Electronics, optics, materials',
    ],
    discovery: {
      year: 1865,
      event: 'Maxwell\'s equations unify electricity and magnetism',
      researchers: ['Maxwell'],
    },
    description: 'The force between electric charges. Responsible for light, chemistry, and nearly all everyday phenomena. The photon is massless, giving the force infinite range.',
  },
  {
    id: 'weak',
    name: 'Weak Nuclear Force',
    shortName: 'Weak',
    relativeStrength: 1e-6,
    strengthDisplay: '10⁻⁶',
    range: 1e-18,
    rangeDisplay: '~10⁻¹⁸ m',
    carrier: {
      name: 'W and Z bosons',
      symbol: 'W±, Z⁰',
      mass: 80.4, // W boson mass in GeV
      massDisplay: '80–91 GeV',
      count: 3,
      selfInteracting: true,
    },
    actsOn: 'All fermions',
    charge: 'Weak isospin',
    couplingConstant: 'gW',
    couplingValue: 0.65,
    inStandardModel: true,
    gaugeGroup: 'SU(2)',
    color: '#22c55e', // Green
    keyProperty: 'The only force that changes quark and lepton flavors. Violates parity symmetry.',
    effects: [
      'Beta decay (neutron → proton + electron + antineutrino)',
      'Neutrino interactions',
      'Flavor-changing processes',
      'Parity violation',
      'Nuclear fusion in stars (pp chain)',
    ],
    discovery: {
      year: 1983,
      event: 'W and Z bosons discovered at CERN',
      researchers: ['Rubbia', 'van der Meer'],
    },
    description: 'The only force that can change one type of quark into another. Responsible for radioactive beta decay. Very short range because the carrier bosons are massive.',
  },
  {
    id: 'gravity',
    name: 'Gravity',
    shortName: 'Gravity',
    relativeStrength: 6e-39,
    strengthDisplay: '~10⁻³⁸',
    range: null,
    rangeDisplay: '∞',
    carrier: {
      name: 'Graviton',
      symbol: 'G',
      mass: 0,
      massDisplay: '0 (theoretical)',
      selfInteracting: true,
    },
    actsOn: 'All mass/energy',
    charge: 'Mass-energy',
    couplingConstant: 'GN',
    couplingValue: 6.674e-11,
    inStandardModel: false,
    color: '#6b7280', // Gray
    keyProperty: 'Always attractive. Universal — acts on everything with mass or energy. Dominates at cosmic scales.',
    effects: [
      'Planetary orbits',
      'Tides',
      'Weight',
      'Galaxy formation',
      'Black holes',
      'Gravitational waves',
    ],
    discovery: {
      year: 1687,
      event: 'Newton\'s law of universal gravitation',
      researchers: ['Newton'],
    },
    description: 'The weakest force, but the only one that accumulates without limit. Dominates at large scales because it\'s always attractive and acts on everything. Not included in the Standard Model — described by General Relativity.',
  },
];

// Particle type for matrix
export interface Particle {
  id: string;
  name: string;
  symbol: string;
  type: 'quark' | 'lepton' | 'boson';
  generation?: number;
  mass: number; // GeV
  charge: number; // electric charge
  colorCharge: boolean;
  weakIsospin: boolean;
  // Which forces act on this particle
  strong: boolean;
  electromagnetic: boolean;
  weak: boolean;
  gravity: boolean; // Everything with mass
}

export const PARTICLES: Particle[] = [
  // Quarks (all feel strong, EM if charged, weak, gravity)
  { id: 'up', name: 'Up', symbol: 'u', type: 'quark', generation: 1, mass: 0.0022, charge: 2/3, colorCharge: true, weakIsospin: true, strong: true, electromagnetic: true, weak: true, gravity: true },
  { id: 'down', name: 'Down', symbol: 'd', type: 'quark', generation: 1, mass: 0.0047, charge: -1/3, colorCharge: true, weakIsospin: true, strong: true, electromagnetic: true, weak: true, gravity: true },
  { id: 'charm', name: 'Charm', symbol: 'c', type: 'quark', generation: 2, mass: 1.27, charge: 2/3, colorCharge: true, weakIsospin: true, strong: true, electromagnetic: true, weak: true, gravity: true },
  { id: 'strange', name: 'Strange', symbol: 's', type: 'quark', generation: 2, mass: 0.093, charge: -1/3, colorCharge: true, weakIsospin: true, strong: true, electromagnetic: true, weak: true, gravity: true },
  { id: 'top', name: 'Top', symbol: 't', type: 'quark', generation: 3, mass: 172.76, charge: 2/3, colorCharge: true, weakIsospin: true, strong: true, electromagnetic: true, weak: true, gravity: true },
  { id: 'bottom', name: 'Bottom', symbol: 'b', type: 'quark', generation: 3, mass: 4.18, charge: -1/3, colorCharge: true, weakIsospin: true, strong: true, electromagnetic: true, weak: true, gravity: true },

  // Leptons (no strong force)
  { id: 'electron', name: 'Electron', symbol: 'e', type: 'lepton', generation: 1, mass: 0.000511, charge: -1, colorCharge: false, weakIsospin: true, strong: false, electromagnetic: true, weak: true, gravity: true },
  { id: 'electron-neutrino', name: 'Electron Neutrino', symbol: 'νe', type: 'lepton', generation: 1, mass: 0, charge: 0, colorCharge: false, weakIsospin: true, strong: false, electromagnetic: false, weak: true, gravity: true },
  { id: 'muon', name: 'Muon', symbol: 'μ', type: 'lepton', generation: 2, mass: 0.1057, charge: -1, colorCharge: false, weakIsospin: true, strong: false, electromagnetic: true, weak: true, gravity: true },
  { id: 'muon-neutrino', name: 'Muon Neutrino', symbol: 'νμ', type: 'lepton', generation: 2, mass: 0, charge: 0, colorCharge: false, weakIsospin: true, strong: false, electromagnetic: false, weak: true, gravity: true },
  { id: 'tau', name: 'Tau', symbol: 'τ', type: 'lepton', generation: 3, mass: 1.777, charge: -1, colorCharge: false, weakIsospin: true, strong: false, electromagnetic: true, weak: true, gravity: true },
  { id: 'tau-neutrino', name: 'Tau Neutrino', symbol: 'ντ', type: 'lepton', generation: 3, mass: 0, charge: 0, colorCharge: false, weakIsospin: true, strong: false, electromagnetic: false, weak: true, gravity: true },

  // Force carriers
  { id: 'photon', name: 'Photon', symbol: 'γ', type: 'boson', mass: 0, charge: 0, colorCharge: false, weakIsospin: false, strong: false, electromagnetic: false, weak: false, gravity: false },
  { id: 'gluon', name: 'Gluon', symbol: 'g', type: 'boson', mass: 0, charge: 0, colorCharge: true, weakIsospin: false, strong: true, electromagnetic: false, weak: false, gravity: false },
  { id: 'w-boson', name: 'W Boson', symbol: 'W±', type: 'boson', mass: 80.4, charge: 1, colorCharge: false, weakIsospin: true, strong: false, electromagnetic: true, weak: true, gravity: true },
  { id: 'z-boson', name: 'Z Boson', symbol: 'Z⁰', type: 'boson', mass: 91.2, charge: 0, colorCharge: false, weakIsospin: true, strong: false, electromagnetic: false, weak: true, gravity: true },
  { id: 'higgs', name: 'Higgs', symbol: 'H', type: 'boson', mass: 125.1, charge: 0, colorCharge: false, weakIsospin: true, strong: false, electromagnetic: false, weak: true, gravity: true },
];

// Distance scales where different forces dominate
export interface Scale {
  id: string;
  name: string;
  distance: number; // meters
  distanceDisplay: string;
  dominantForces: string[]; // force IDs in order of dominance
  phenomena: string[];
  description: string;
}

export const SCALES: Scale[] = [
  {
    id: 'planck',
    name: 'Planck Scale',
    distance: 1.6e-35,
    distanceDisplay: '10⁻³⁵ m',
    dominantForces: ['gravity', 'strong', 'electromagnetic', 'weak'],
    phenomena: ['Quantum gravity effects', 'All forces possibly unified', 'Unknown physics'],
    description: 'The scale where quantum effects and gravity both matter. No current theory describes physics here.',
  },
  {
    id: 'subnuclear',
    name: 'Sub-nuclear',
    distance: 1e-18,
    distanceDisplay: '10⁻¹⁸ m',
    dominantForces: ['strong', 'weak', 'electromagnetic'],
    phenomena: ['Electroweak unification', 'W/Z boson range', 'Deep inelastic scattering'],
    description: 'The scale of weak interactions. At high energies here, electromagnetic and weak forces unify.',
  },
  {
    id: 'nuclear',
    name: 'Nuclear',
    distance: 1e-15,
    distanceDisplay: '10⁻¹⁵ m',
    dominantForces: ['strong', 'electromagnetic'],
    phenomena: ['Quarks confined in hadrons', 'Nuclear binding', 'Fission and fusion', 'Alpha/beta decay'],
    description: 'The strong force dominates. Quarks are bound into protons and neutrons. Nuclear reactions occur.',
  },
  {
    id: 'atomic',
    name: 'Atomic',
    distance: 1e-10,
    distanceDisplay: '10⁻¹⁰ m',
    dominantForces: ['electromagnetic'],
    phenomena: ['Electron orbitals', 'Chemical bonding', 'Atomic spectra', 'Molecules'],
    description: 'Electromagnetic force dominates. Strong/weak forces confined to nucleus. Chemistry happens here.',
  },
  {
    id: 'molecular',
    name: 'Molecular',
    distance: 1e-9,
    distanceDisplay: '10⁻⁹ m',
    dominantForces: ['electromagnetic'],
    phenomena: ['Proteins', 'DNA', 'Nanotechnology', 'Van der Waals forces'],
    description: 'Still electromagnetic. Complex molecules, biological structures.',
  },
  {
    id: 'human',
    name: 'Human',
    distance: 1,
    distanceDisplay: '1 m',
    dominantForces: ['electromagnetic', 'gravity'],
    phenomena: ['Weight', 'Friction', 'Materials', 'Light', 'Sound'],
    description: 'Electromagnetic force (chemistry, materials, light) and gravity (weight, falling).',
  },
  {
    id: 'planetary',
    name: 'Planetary',
    distance: 1e7,
    distanceDisplay: '10⁷ m',
    dominantForces: ['gravity'],
    phenomena: ['Orbits', 'Tides', 'Atmosphere', 'Magnetic field'],
    description: 'Gravity dominates. Holds planets together, creates orbits.',
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    distance: 1e22,
    distanceDisplay: '10²² m',
    dominantForces: ['gravity'],
    phenomena: ['Galaxy formation', 'Dark matter effects', 'Expansion of universe', 'Black holes'],
    description: 'Gravity is the only force that matters at this scale. Shapes the large-scale structure of the universe.',
  },
];

// Unification data
export interface Unification {
  name: string;
  forces: string[];
  energy: number; // GeV
  energyDisplay: string;
  year?: number;
  status: 'confirmed' | 'theoretical';
  description: string;
}

export const UNIFICATIONS: Unification[] = [
  {
    name: 'Electroweak',
    forces: ['electromagnetic', 'weak'],
    energy: 246,
    energyDisplay: '~100 GeV',
    year: 1979,
    status: 'confirmed',
    description: 'Above ~100 GeV, the electromagnetic and weak forces merge into a single electroweak force. Confirmed by discovery of W and Z bosons.',
  },
  {
    name: 'Grand Unified',
    forces: ['electromagnetic', 'weak', 'strong'],
    energy: 1e16,
    energyDisplay: '~10¹⁶ GeV',
    status: 'theoretical',
    description: 'At extremely high energies, all three Standard Model forces may unify. Predicted by Grand Unified Theories (GUTs), but not yet testable.',
  },
  {
    name: 'Theory of Everything',
    forces: ['electromagnetic', 'weak', 'strong', 'gravity'],
    energy: 1.22e19,
    energyDisplay: '~10¹⁹ GeV (Planck)',
    status: 'theoretical',
    description: 'The hypothetical unification of all four forces, including gravity. Requires a theory of quantum gravity. String theory and loop quantum gravity are candidates.',
  },
];

// Comparative data for visualization
export interface ForceComparison {
  forceId: string;
  logStrength: number; // log10 of relative strength
  logRange: number; // log10 of range in meters (0 for infinite = use large value)
}

export const FORCE_COMPARISONS: ForceComparison[] = [
  { forceId: 'strong', logStrength: 0, logRange: -15 },
  { forceId: 'electromagnetic', logStrength: -2.14, logRange: 25 }, // Effectively infinite
  { forceId: 'weak', logStrength: -6, logRange: -18 },
  { forceId: 'gravity', logStrength: -38, logRange: 25 }, // Effectively infinite
];

// Helper functions
export function getForce(id: string): Force | undefined {
  return FORCES.find(f => f.id === id);
}

export function getParticle(id: string): Particle | undefined {
  return PARTICLES.find(p => p.id === id);
}

export function getParticlesByForce(forceId: string): Particle[] {
  return PARTICLES.filter(p => {
    switch (forceId) {
      case 'strong': return p.strong;
      case 'electromagnetic': return p.electromagnetic;
      case 'weak': return p.weak;
      case 'gravity': return p.gravity;
      default: return false;
    }
  });
}

export function getForcesByParticle(particleId: string): Force[] {
  const particle = getParticle(particleId);
  if (!particle) return [];

  return FORCES.filter(f => {
    switch (f.id) {
      case 'strong': return particle.strong;
      case 'electromagnetic': return particle.electromagnetic;
      case 'weak': return particle.weak;
      case 'gravity': return particle.gravity;
      default: return false;
    }
  });
}

export function getDominantForceAtScale(scaleId: string): Force | undefined {
  const scale = SCALES.find(s => s.id === scaleId);
  if (!scale || scale.dominantForces.length === 0) return undefined;
  return getForce(scale.dominantForces[0]);
}

// Format helpers
export function formatStrength(strength: number): string {
  if (strength === 1) return '1';
  if (strength >= 0.001) return `1/${Math.round(1/strength)}`;
  const exp = Math.floor(Math.log10(strength));
  return `10${toSuperscript(exp)}`;
}

export function toSuperscript(n: number): string {
  const superscripts: Record<string, string> = {
    '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³',
    '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  };
  return n.toString().split('').map(c => superscripts[c] || c).join('');
}

// Key statistics
export const STATS = {
  totalForces: 4,
  inStandardModel: 3,
  shortRange: 2,
  longRange: 2,
  strengthRange: 38, // orders of magnitude
  confirmedUnification: 1, // electroweak
};
