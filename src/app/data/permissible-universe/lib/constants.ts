// ===========================================
// THE PERMISSIBLE UNIVERSE - CONSTANTS
// ===========================================

import { CategoryMeta, ChartConfig, ObjectCategory } from './types'

export const PHYSICS = {
  c: 2.998e10,
  G: 6.674e-8,
  h: 6.626e-27,
  hbar: 1.055e-27,
  planckLength: 1.616e-33,
  planckMass: 2.176e-5,
  planckTime: 5.391e-44,
  planckEnergy: 1.956e16,
  electronMass: 9.109e-28,
  protonMass: 1.673e-24,
  neutronMass: 1.675e-24,
  solarMass: 1.989e33,
  solarRadius: 6.96e10,
  earthMass: 5.972e27,
  earthRadius: 6.371e8,
  hubbleRadius: 4.4e28,
  logPlanckLength: -33,
  logPlanckMass: -5,
  logHubbleRadius: 28,
}

export const SCHWARZSCHILD_INTERCEPT = -27.83
export const COMPTON_INTERCEPT = -36.65

export const CHART_CONFIG: ChartConfig = {
  logRadiusRange: [-40, 50],
  logMassRange: [-45, 65],
  showMpcAxis: true,
  showGeVAxis: true,
  showSolarMassAxis: true,
  gridSpacing: 10,
  minorGridSpacing: 5,
}

export const INITIAL_VIEW = {
  center: { logR: 2, logM: 4.7 },
  zoom: 1,
}

export const CATEGORIES: Record<ObjectCategory, CategoryMeta> = {
  'fundamental-particles': {
    id: 'fundamental-particles',
    name: 'Fundamental Particles',
    shortName: 'Particles',
    description: 'Quarks, leptons, and bosons',
    color: '#8b5cf6',
    icon: 'Atom',
    order: 1,
  },
  'composite-particles': {
    id: 'composite-particles',
    name: 'Composite Particles',
    shortName: 'Hadrons',
    description: 'Protons, neutrons, and other bound states',
    color: '#a855f7',
    icon: 'Circle',
    order: 2,
  },
  'atoms-molecules': {
    id: 'atoms-molecules',
    name: 'Atoms & Molecules',
    shortName: 'Atoms',
    description: 'From hydrogen to complex molecules',
    color: '#06b6d4',
    icon: 'Hexagon',
    order: 3,
  },
  'viruses-cells': {
    id: 'viruses-cells',
    name: 'Viruses & Cells',
    shortName: 'Biology',
    description: 'The machinery of life',
    color: '#10b981',
    icon: 'Bug',
    order: 4,
  },
  'macroscopic-life': {
    id: 'macroscopic-life',
    name: 'Macroscopic Life',
    shortName: 'Life',
    description: 'Visible organisms',
    color: '#22c55e',
    icon: 'TreeDeciduous',
    order: 5,
  },
  'solar-system': {
    id: 'solar-system',
    name: 'Solar System Bodies',
    shortName: 'Planets',
    description: 'Asteroids, moons, planets',
    color: '#f59e0b',
    icon: 'Globe',
    order: 6,
  },
  'stars': {
    id: 'stars',
    name: 'Stars',
    shortName: 'Stars',
    description: 'From brown dwarfs to supergiants',
    color: '#f97316',
    icon: 'Sun',
    order: 7,
  },
  'stellar-remnants': {
    id: 'stellar-remnants',
    name: 'Stellar Remnants',
    shortName: 'Remnants',
    description: 'White dwarfs, neutron stars',
    color: '#ef4444',
    icon: 'Sparkles',
    order: 8,
  },
  'black-holes': {
    id: 'black-holes',
    name: 'Black Holes',
    shortName: 'Black Holes',
    description: 'From stellar mass to supermassive',
    color: '#1f2937',
    icon: 'CircleDot',
    order: 9,
  },
  'stellar-structures': {
    id: 'stellar-structures',
    name: 'Stellar Structures',
    shortName: 'Clusters',
    description: 'Star clusters, nebulae',
    color: '#ec4899',
    icon: 'Stars',
    order: 10,
  },
  'galaxies': {
    id: 'galaxies',
    name: 'Galaxies',
    shortName: 'Galaxies',
    description: 'From dwarf galaxies to giant ellipticals',
    color: '#6366f1',
    icon: 'Orbit',
    order: 11,
  },
  'large-scale-structure': {
    id: 'large-scale-structure',
    name: 'Large Scale Structure',
    shortName: 'Cosmic',
    description: 'Galaxy clusters, superclusters, voids',
    color: '#3b82f6',
    icon: 'Network',
    order: 12,
  },
  'exotic-theoretical': {
    id: 'exotic-theoretical',
    name: 'Exotic & Theoretical',
    shortName: 'Exotic',
    description: 'Theoretical objects and extreme states',
    color: '#94a3b8',
    icon: 'HelpCircle',
    order: 13,
  },
}

export const BOUNDARY_COLORS = {
  schwarzschild: { line: '#991b1b', fill: 'rgba(153, 27, 27, 0.15)' },
  compton: { line: '#1e40af', fill: 'rgba(30, 64, 175, 0.15)' },
  planck: { line: '#4b5563', fill: 'rgba(75, 85, 99, 0.2)' },
  hubble: { line: '#065f46', fill: 'rgba(6, 95, 70, 0.1)' },
}

export const EPOCH_COLORS = {
  planck: '#6b7280',
  gut: '#9ca3af',
  electroweak: '#d1d5db',
  nuclear: '#fbbf24',
  atomic: '#f59e0b',
  recombination: '#ef4444',
  now: '#22c55e',
}

export function formatLogValue(logValue: number, unit: string): string {
  if (logValue === 0) return `1 ${unit}`
  if (logValue > 0 && logValue < 4) {
    return `${Math.pow(10, logValue).toFixed(0)} ${unit}`
  }
  return `10^${logValue.toFixed(0)} ${unit}`
}

export function formatSuperscript(logValue: number): string {
  const rounded = Math.round(logValue)
  const superscripts: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '-': '⁻',
  }
  return rounded.toString().split('').map(c => superscripts[c] || c).join('')
}
