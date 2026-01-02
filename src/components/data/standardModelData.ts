// Standard Model Particle Data
// All 17 fundamental particles with properties, interactions, and discovery info

export type ParticleType = 'quark' | 'lepton' | 'gauge-boson' | 'scalar-boson';
export type ParticleCategory = 'fermion' | 'boson';
export type Generation = 1 | 2 | 3 | null;

export interface Particle {
  id: string;
  symbol: string;
  name: string;
  type: ParticleType;
  category: ParticleCategory;
  generation: Generation;

  // Properties
  mass: number; // in MeV/c²
  massUncertainty?: string; // e.g., "±0.5" or range
  massDisplay: string; // formatted for display
  charge: number; // in units of e
  chargeDisplay: string; // e.g., "+⅔", "−1", "0"
  spin: number; // in units of ℏ
  spinDisplay: string; // e.g., "½", "1"
  colorCharge: boolean; // carries color charge (quarks, gluons)

  // Interactions (couples to these forces)
  electromagnetic: boolean;
  weak: boolean;
  strong: boolean;
  higgs: boolean; // couples to Higgs field (has mass via Higgs mechanism)

  // Discovery
  discoveredYear: number;
  discoveredAt: string;
  discoveredBy?: string;

  // Additional
  antiparticle: string; // name of antiparticle
  lifetime?: string; // for unstable particles
  notes?: string;
}

// Mass reference points for log scale (in MeV)
export const MASS_SCALE = {
  min: 0.0000001, // ~0.1 eV (neutrino lower bound estimate)
  max: 200000, // ~200 GeV (top quark region)
};

// Convert mass to log scale position (0-1)
export function massToLogScale(mass: number): number {
  if (mass <= 0) return 0;
  const logMin = Math.log10(MASS_SCALE.min);
  const logMax = Math.log10(MASS_SCALE.max);
  const logMass = Math.log10(mass);
  return Math.max(0, Math.min(1, (logMass - logMin) / (logMax - logMin)));
}

export const PARTICLES: Particle[] = [
  // ============================================
  // QUARKS (Generation I, II, III)
  // ============================================
  {
    id: 'up',
    symbol: 'u',
    name: 'Up',
    type: 'quark',
    category: 'fermion',
    generation: 1,
    mass: 2.2,
    massUncertainty: '±0.5',
    massDisplay: '2.2 MeV',
    charge: 2/3,
    chargeDisplay: '+⅔',
    spin: 0.5,
    spinDisplay: '½',
    colorCharge: true,
    electromagnetic: true,
    weak: true,
    strong: true,
    higgs: true,
    discoveredYear: 1968,
    discoveredAt: 'SLAC',
    antiparticle: 'Anti-up',
    notes: 'Lightest quark. Component of protons (uud) and neutrons (udd).',
  },
  {
    id: 'down',
    symbol: 'd',
    name: 'Down',
    type: 'quark',
    category: 'fermion',
    generation: 1,
    mass: 4.7,
    massUncertainty: '±0.5',
    massDisplay: '4.7 MeV',
    charge: -1/3,
    chargeDisplay: '−⅓',
    spin: 0.5,
    spinDisplay: '½',
    colorCharge: true,
    electromagnetic: true,
    weak: true,
    strong: true,
    higgs: true,
    discoveredYear: 1968,
    discoveredAt: 'SLAC',
    antiparticle: 'Anti-down',
    notes: 'Component of protons (uud) and neutrons (udd).',
  },
  {
    id: 'charm',
    symbol: 'c',
    name: 'Charm',
    type: 'quark',
    category: 'fermion',
    generation: 2,
    mass: 1270,
    massUncertainty: '±30',
    massDisplay: '1.27 GeV',
    charge: 2/3,
    chargeDisplay: '+⅔',
    spin: 0.5,
    spinDisplay: '½',
    colorCharge: true,
    electromagnetic: true,
    weak: true,
    strong: true,
    higgs: true,
    discoveredYear: 1974,
    discoveredAt: 'SLAC & BNL',
    discoveredBy: 'Richter & Ting',
    antiparticle: 'Anti-charm',
    notes: 'Discovered via J/ψ meson. November Revolution of particle physics.',
  },
  {
    id: 'strange',
    symbol: 's',
    name: 'Strange',
    type: 'quark',
    category: 'fermion',
    generation: 2,
    mass: 95,
    massUncertainty: '±5',
    massDisplay: '95 MeV',
    charge: -1/3,
    chargeDisplay: '−⅓',
    spin: 0.5,
    spinDisplay: '½',
    colorCharge: true,
    electromagnetic: true,
    weak: true,
    strong: true,
    higgs: true,
    discoveredYear: 1947,
    discoveredAt: 'Manchester',
    antiparticle: 'Anti-strange',
    notes: 'First evidence of quarks beyond up/down. Named for "strange" decay patterns.',
  },
  {
    id: 'top',
    symbol: 't',
    name: 'Top',
    type: 'quark',
    category: 'fermion',
    generation: 3,
    mass: 172760,
    massUncertainty: '±300',
    massDisplay: '172.76 GeV',
    charge: 2/3,
    chargeDisplay: '+⅔',
    spin: 0.5,
    spinDisplay: '½',
    colorCharge: true,
    electromagnetic: true,
    weak: true,
    strong: true,
    higgs: true,
    discoveredYear: 1995,
    discoveredAt: 'Fermilab',
    antiparticle: 'Anti-top',
    lifetime: '5×10⁻²⁵ s',
    notes: 'Heaviest known elementary particle. Mass ~185× proton. Decays before hadronizing.',
  },
  {
    id: 'bottom',
    symbol: 'b',
    name: 'Bottom',
    type: 'quark',
    category: 'fermion',
    generation: 3,
    mass: 4180,
    massUncertainty: '±30',
    massDisplay: '4.18 GeV',
    charge: -1/3,
    chargeDisplay: '−⅓',
    spin: 0.5,
    spinDisplay: '½',
    colorCharge: true,
    electromagnetic: true,
    weak: true,
    strong: true,
    higgs: true,
    discoveredYear: 1977,
    discoveredAt: 'Fermilab',
    discoveredBy: 'Leon Lederman',
    antiparticle: 'Anti-bottom',
    notes: 'Also called "beauty quark". Key for studying CP violation.',
  },

  // ============================================
  // LEPTONS (Generation I, II, III)
  // ============================================
  {
    id: 'electron',
    symbol: 'e',
    name: 'Electron',
    type: 'lepton',
    category: 'fermion',
    generation: 1,
    mass: 0.511,
    massDisplay: '0.511 MeV',
    charge: -1,
    chargeDisplay: '−1',
    spin: 0.5,
    spinDisplay: '½',
    colorCharge: false,
    electromagnetic: true,
    weak: true,
    strong: false,
    higgs: true,
    discoveredYear: 1897,
    discoveredAt: 'Cambridge',
    discoveredBy: 'J.J. Thomson',
    antiparticle: 'Positron',
    notes: 'First elementary particle discovered. Stable. Orbits atomic nuclei.',
  },
  {
    id: 'electron-neutrino',
    symbol: 'νe',
    name: 'Electron neutrino',
    type: 'lepton',
    category: 'fermion',
    generation: 1,
    mass: 0.0000012, // upper limit ~1.2 eV
    massDisplay: '<1.2 eV',
    charge: 0,
    chargeDisplay: '0',
    spin: 0.5,
    spinDisplay: '½',
    colorCharge: false,
    electromagnetic: false,
    weak: true,
    strong: false,
    higgs: true, // mass mechanism still debated
    discoveredYear: 1956,
    discoveredAt: 'Savannah River',
    discoveredBy: 'Cowan & Reines',
    antiparticle: 'Electron antineutrino',
    notes: 'Postulated by Pauli (1930) to explain beta decay. Extremely weakly interacting.',
  },
  {
    id: 'muon',
    symbol: 'μ',
    name: 'Muon',
    type: 'lepton',
    category: 'fermion',
    generation: 2,
    mass: 105.66,
    massDisplay: '105.66 MeV',
    charge: -1,
    chargeDisplay: '−1',
    spin: 0.5,
    spinDisplay: '½',
    colorCharge: false,
    electromagnetic: true,
    weak: true,
    strong: false,
    higgs: true,
    discoveredYear: 1936,
    discoveredAt: 'Caltech',
    discoveredBy: 'Anderson & Neddermeyer',
    antiparticle: 'Antimuon',
    lifetime: '2.2 μs',
    notes: '"Who ordered that?" — I.I. Rabi. ~207× electron mass.',
  },
  {
    id: 'muon-neutrino',
    symbol: 'νμ',
    name: 'Muon neutrino',
    type: 'lepton',
    category: 'fermion',
    generation: 2,
    mass: 0.00017, // upper limit ~0.17 MeV
    massDisplay: '<0.17 MeV',
    charge: 0,
    chargeDisplay: '0',
    spin: 0.5,
    spinDisplay: '½',
    colorCharge: false,
    electromagnetic: false,
    weak: true,
    strong: false,
    higgs: true,
    discoveredYear: 1962,
    discoveredAt: 'BNL',
    discoveredBy: 'Lederman, Schwartz, Steinberger',
    antiparticle: 'Muon antineutrino',
    notes: 'Proved neutrino flavours are distinct. Nobel Prize 1988.',
  },
  {
    id: 'tau',
    symbol: 'τ',
    name: 'Tau',
    type: 'lepton',
    category: 'fermion',
    generation: 3,
    mass: 1776.86,
    massDisplay: '1.777 GeV',
    charge: -1,
    chargeDisplay: '−1',
    spin: 0.5,
    spinDisplay: '½',
    colorCharge: false,
    electromagnetic: true,
    weak: true,
    strong: false,
    higgs: true,
    discoveredYear: 1975,
    discoveredAt: 'SLAC',
    discoveredBy: 'Martin Perl',
    antiparticle: 'Antitau',
    lifetime: '2.9×10⁻¹³ s',
    notes: 'Heaviest lepton. ~3477× electron mass. Can decay to hadrons.',
  },
  {
    id: 'tau-neutrino',
    symbol: 'ντ',
    name: 'Tau neutrino',
    type: 'lepton',
    category: 'fermion',
    generation: 3,
    mass: 0.0182, // upper limit ~18.2 MeV
    massDisplay: '<18.2 MeV',
    charge: 0,
    chargeDisplay: '0',
    spin: 0.5,
    spinDisplay: '½',
    colorCharge: false,
    electromagnetic: false,
    weak: true,
    strong: false,
    higgs: true,
    discoveredYear: 2000,
    discoveredAt: 'Fermilab (DONUT)',
    antiparticle: 'Tau antineutrino',
    notes: 'Last Standard Model fermion directly observed.',
  },

  // ============================================
  // GAUGE BOSONS (Force carriers)
  // ============================================
  {
    id: 'photon',
    symbol: 'γ',
    name: 'Photon',
    type: 'gauge-boson',
    category: 'boson',
    generation: null,
    mass: 0,
    massDisplay: '0',
    charge: 0,
    chargeDisplay: '0',
    spin: 1,
    spinDisplay: '1',
    colorCharge: false,
    electromagnetic: true, // IS the EM force carrier
    weak: false,
    strong: false,
    higgs: false, // massless, doesn't couple to Higgs
    discoveredYear: 1905,
    discoveredAt: 'Theoretical',
    discoveredBy: 'Einstein (photoelectric)',
    antiparticle: 'Self',
    notes: 'Electromagnetic force carrier. Massless. Infinite range.',
  },
  {
    id: 'gluon',
    symbol: 'g',
    name: 'Gluon',
    type: 'gauge-boson',
    category: 'boson',
    generation: null,
    mass: 0,
    massDisplay: '0',
    charge: 0,
    chargeDisplay: '0',
    spin: 1,
    spinDisplay: '1',
    colorCharge: true, // carries color charge!
    electromagnetic: false,
    weak: false,
    strong: true, // IS the strong force carrier
    higgs: false,
    discoveredYear: 1979,
    discoveredAt: 'DESY (PETRA)',
    antiparticle: 'Self',
    notes: 'Strong force carrier. 8 types (color combinations). Carries color charge itself.',
  },
  {
    id: 'w-boson',
    symbol: 'W',
    name: 'W boson',
    type: 'gauge-boson',
    category: 'boson',
    generation: null,
    mass: 80377,
    massUncertainty: '±12',
    massDisplay: '80.377 GeV',
    charge: 1, // W+ and W-
    chargeDisplay: '±1',
    spin: 1,
    spinDisplay: '1',
    colorCharge: false,
    electromagnetic: true, // charged, so couples to photon
    weak: true, // IS a weak force carrier
    strong: false,
    higgs: true,
    discoveredYear: 1983,
    discoveredAt: 'CERN (UA1, UA2)',
    discoveredBy: 'Rubbia & van der Meer',
    antiparticle: 'W⁺ ↔ W⁻',
    lifetime: '3×10⁻²⁵ s',
    notes: 'Weak force carrier. Mediates charged current interactions. Changes quark/lepton flavour.',
  },
  {
    id: 'z-boson',
    symbol: 'Z',
    name: 'Z boson',
    type: 'gauge-boson',
    category: 'boson',
    generation: null,
    mass: 91187.6,
    massUncertainty: '±2.1',
    massDisplay: '91.188 GeV',
    charge: 0,
    chargeDisplay: '0',
    spin: 1,
    spinDisplay: '1',
    colorCharge: false,
    electromagnetic: false,
    weak: true, // IS a weak force carrier
    strong: false,
    higgs: true,
    discoveredYear: 1983,
    discoveredAt: 'CERN (UA1, UA2)',
    discoveredBy: 'Rubbia & van der Meer',
    antiparticle: 'Self',
    lifetime: '3×10⁻²⁵ s',
    notes: 'Weak force carrier. Mediates neutral current interactions. Does not change flavour.',
  },

  // ============================================
  // SCALAR BOSON (Higgs)
  // ============================================
  {
    id: 'higgs',
    symbol: 'H',
    name: 'Higgs boson',
    type: 'scalar-boson',
    category: 'boson',
    generation: null,
    mass: 125250,
    massUncertainty: '±170',
    massDisplay: '125.25 GeV',
    charge: 0,
    chargeDisplay: '0',
    spin: 0,
    spinDisplay: '0',
    colorCharge: false,
    electromagnetic: false,
    weak: true, // couples to W, Z
    strong: false,
    higgs: true, // couples to itself
    discoveredYear: 2012,
    discoveredAt: 'CERN (ATLAS, CMS)',
    antiparticle: 'Self',
    lifetime: '1.6×10⁻²² s',
    notes: 'Gives mass to W, Z, and fermions via Higgs mechanism. Last Standard Model particle discovered.',
  },
];

// Helper functions
export function getParticle(id: string): Particle | undefined {
  return PARTICLES.find(p => p.id === id);
}

export function getParticlesByType(type: ParticleType): Particle[] {
  return PARTICLES.filter(p => p.type === type);
}

export function getParticlesByGeneration(gen: Generation): Particle[] {
  return PARTICLES.filter(p => p.generation === gen);
}

export function getParticlesWithInteraction(interaction: 'electromagnetic' | 'weak' | 'strong' | 'higgs'): Particle[] {
  return PARTICLES.filter(p => p[interaction]);
}

// Interaction colors
export const INTERACTION_COLORS = {
  electromagnetic: '#3b82f6', // blue
  weak: '#f59e0b', // amber
  strong: '#ef4444', // red
  higgs: '#8b5cf6', // purple
};

// Particle type colors (for subtle backgrounds)
export const TYPE_COLORS = {
  quark: '#262626',
  lepton: '#262626',
  'gauge-boson': '#262626',
  'scalar-boson': '#262626',
};

// Discovery timeline data
export const DISCOVERY_TIMELINE = [
  { year: 1897, particles: ['electron'], event: 'J.J. Thomson discovers electron' },
  { year: 1905, particles: ['photon'], event: 'Einstein explains photoelectric effect' },
  { year: 1936, particles: ['muon'], event: 'Muon discovered in cosmic rays' },
  { year: 1947, particles: ['strange'], event: 'Strange particles observed' },
  { year: 1956, particles: ['electron-neutrino'], event: 'Neutrino detected at reactor' },
  { year: 1962, particles: ['muon-neutrino'], event: 'Second neutrino type found' },
  { year: 1968, particles: ['up', 'down'], event: 'Deep inelastic scattering reveals quarks' },
  { year: 1974, particles: ['charm'], event: 'November Revolution: J/ψ discovered' },
  { year: 1975, particles: ['tau'], event: 'Tau lepton discovered' },
  { year: 1977, particles: ['bottom'], event: 'Bottom quark discovered' },
  { year: 1979, particles: ['gluon'], event: 'Three-jet events reveal gluon' },
  { year: 1983, particles: ['w-boson', 'z-boson'], event: 'W and Z bosons discovered' },
  { year: 1995, particles: ['top'], event: 'Top quark discovered' },
  { year: 2000, particles: ['tau-neutrino'], event: 'Tau neutrino directly observed' },
  { year: 2012, particles: ['higgs'], event: 'Higgs boson discovered' },
];

// Chart layout positions (for wall chart view)
export const CHART_LAYOUT = {
  // Quarks: columns 0-1, rows 0-2 (generations)
  quarks: [
    { id: 'up', col: 0, row: 0 },
    { id: 'down', col: 1, row: 0 },
    { id: 'charm', col: 0, row: 1 },
    { id: 'strange', col: 1, row: 1 },
    { id: 'top', col: 0, row: 2 },
    { id: 'bottom', col: 1, row: 2 },
  ],
  // Leptons: columns 2-3, rows 0-2
  leptons: [
    { id: 'electron', col: 2, row: 0 },
    { id: 'electron-neutrino', col: 3, row: 0 },
    { id: 'muon', col: 2, row: 1 },
    { id: 'muon-neutrino', col: 3, row: 1 },
    { id: 'tau', col: 2, row: 2 },
    { id: 'tau-neutrino', col: 3, row: 2 },
  ],
  // Gauge bosons: columns 4-5, rows 0-1
  gaugeBosons: [
    { id: 'photon', col: 4, row: 0 },
    { id: 'gluon', col: 5, row: 0 },
    { id: 'w-boson', col: 4, row: 1 },
    { id: 'z-boson', col: 5, row: 1 },
  ],
  // Higgs: column 4, row 2
  scalarBoson: [
    { id: 'higgs', col: 4, row: 2 },
  ],
};
