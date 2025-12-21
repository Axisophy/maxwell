// ===========================================
// THE PERMISSIBLE UNIVERSE - BIG QUESTIONS
// ===========================================

import { BigQuestion, DarkMatterCandidate, EMSpectrumBand } from './types'

export const BIG_QUESTIONS: BigQuestion[] = [
  {
    id: 'universe-black-hole',
    number: 1,
    title: 'Is the Universe a Black Hole?',
    hook: 'Both the instanton and the Hubble radius lie on the Schwarzschild line.',
    content: `The universe has always been on the Schwarzschild line as it expanded. Both the smallest possible object (the instanton at Planck scale) and the largest (the Hubble radius) sit exactly on this boundary.

Does this mean we're inside a black hole?

The catch: The Schwarzschild solution assumes empty space surrounds the black hole. Our universe isn't surrounded by empty Minkowski space - or is it?`,
    relatedConcepts: ['General relativity', 'Cosmological models', 'White holes', 'Holographic principle'],
  },
  {
    id: 'desert-gap',
    number: 2,
    title: 'What Fills the Gap?',
    hook: '17 orders of magnitude with no known particles.',
    content: `Between the top quark (173 GeV) and the Planck scale (10¹⁹ GeV), there are 17 orders of magnitude with no known particles.

Is this "desert" real, or are there undiscovered particles waiting to be found with bigger colliders?

Candidates include: supersymmetric partners, GUT bosons, string excitations, right-handed neutrinos.`,
    relatedConcepts: ['Hierarchy problem', 'Naturalness', 'Future colliders', 'Supersymmetry'],
    diagramHighlight: { massMin: -20, massMax: -5, radiusMin: -20, radiusMax: -10 },
  },
  {
    id: 'below-planck',
    number: 3,
    title: 'What Happens Below the Planck Length?',
    hook: 'No object can be smaller than the Planck length - but why?',
    content: `The diagram shows "sub-Planckian unknown" in the far left. No object can be smaller than the Planck length (10⁻³³ cm).

Does space itself become discrete? Does the concept of "size" break down entirely?

Theories addressing this include: Loop quantum gravity (discrete spacetime), string theory (minimum length), and noncommutative geometry.`,
    relatedConcepts: ['Loop quantum gravity', 'String theory', 'Noncommutative geometry', 'Quantum foam'],
    diagramHighlight: { massMin: -45, massMax: -5, radiusMin: -40, radiusMax: -33 },
  },
  {
    id: 'instanton',
    number: 4,
    title: 'The Instanton Question',
    hook: 'Where three limits meet: what are the degrees of freedom?',
    content: `At the Planck scale, three lines meet: Compton, Schwarzschild, and nuclear density. An object here would simultaneously be:
• The smallest possible black hole
• The highest energy photon
• At nuclear density

What ARE the degrees of freedom at this scale? This is perhaps the deepest question in physics.`,
    relatedConcepts: ['Quantum gravity', 'Holographic principle', 'Bekenstein bound', 'Planck scale'],
    diagramHighlight: { massMin: -6, massMax: -4, radiusMin: -34, radiusMax: -32 },
  },
  {
    id: 'matter-antimatter',
    number: 5,
    title: 'Why Is There Anything?',
    hook: 'The universe contains matter but almost no antimatter.',
    content: `The laws of physics treat matter and antimatter almost identically. Yet the universe contains matter but almost no antimatter.

Something broke the symmetry in the first fraction of a second. We don't know what.

Current understanding: CP violation exists but is too weak. Baryogenesis requires new physics we haven't discovered.`,
    relatedConcepts: ['Sakharov conditions', 'Leptogenesis', 'CP violation', 'Baryogenesis'],
  },
  {
    id: 'dark-universe',
    number: 6,
    title: 'What Is 95% of the Universe?',
    hook: 'Only 5% is made of atoms. The rest is unknown.',
    content: `Only 5% of the universe is made of atoms - the stuff we can see and touch. The rest:
• ~27% dark matter (unknown particles that clump gravitationally)
• ~68% dark energy (unknown field that accelerates cosmic expansion)

We've mapped something we don't understand. The Permissible Universe shows the 5% we know - the rest is invisible.`,
    relatedConcepts: ['WIMP searches', 'Axion experiments', 'Cosmological constant problem', 'Modified gravity'],
  },
]

export const DARK_MATTER_CANDIDATES: DarkMatterCandidate[] = [
  {
    id: 'wimp',
    name: 'WIMPs',
    massMin: -23,
    massMax: -20,
    radiusMin: -13,
    radiusMax: -11,
    line: 'compton',
    motivation: 'Supersymmetry predicts stable heavy particles that interact weakly',
    status: 'constrained',
    experiments: ['LUX-ZEPLIN', 'XENONnT', 'PandaX'],
    description: 'The classic dark matter candidate. Decades of searches have found nothing, pushing the allowed parameter space ever smaller.',
  },
  {
    id: 'axion',
    name: 'Axions',
    massMin: -37,
    massMax: -32,
    radiusMin: -3,
    radiusMax: 2,
    line: 'compton',
    motivation: 'Originally proposed to solve the strong CP problem - dark matter is a bonus',
    status: 'searching',
    experiments: ['ADMX', 'HAYSTAC', 'ABRACADABRA', 'CASPEr'],
    description: 'An elegant solution to two problems at once. If axions exist, they would form an invisible field oscillating everywhere in the universe.',
  },
  {
    id: 'sterile_neutrino',
    name: 'Sterile Neutrinos',
    massMin: -30,
    massMax: -27,
    radiusMin: -8,
    radiusMax: -5,
    line: 'compton',
    motivation: "Right-handed neutrinos that don't interact via weak force",
    status: 'constrained',
    experiments: ['X-ray telescopes', 'KATRIN'],
    description: 'A 3.5 keV X-ray line was spotted in galaxy clusters - possibly sterile neutrino decay. Or possibly not.',
  },
  {
    id: 'pbh_stellar',
    name: 'Primordial BHs (stellar)',
    massMin: 33,
    massMax: 35,
    radiusMin: 5,
    radiusMax: 7,
    line: 'schwarzschild',
    motivation: 'Black holes formed in the early universe, before stars',
    status: 'constrained',
    experiments: ['LIGO/Virgo', 'Microlensing surveys'],
    description: 'LIGO detected black hole mergers with masses hard to explain from stellar evolution. Could some be primordial?',
  },
  {
    id: 'pbh_light',
    name: 'Primordial BHs (light)',
    massMin: 17,
    massMax: 23,
    radiusMin: -8,
    radiusMax: -5,
    line: 'schwarzschild',
    motivation: 'Lighter PBHs in the "asteroid mass window"',
    status: 'searching',
    experiments: ['Microlensing', 'Gravitational wave searches'],
    description: "A mass window where PBHs could be all the dark matter remains open. Hard to detect but not ruled out.",
  },
]

export const EM_SPECTRUM: EMSpectrumBand[] = [
  { id: 'radio', label: 'Radio', color: '#ef4444', massMin: -45, massMax: -42 },
  { id: 'microwave', label: 'Microwave', color: '#f97316', massMin: -42, massMax: -39 },
  { id: 'infrared', label: 'Infrared', color: '#eab308', massMin: -39, massMax: -33 },
  { id: 'visible', label: 'Visible', color: '#22c55e', massMin: -33.5, massMax: -33 },
  { id: 'uv', label: 'UV', color: '#3b82f6', massMin: -33, massMax: -31 },
  { id: 'xray', label: 'X-ray', color: '#8b5cf6', massMin: -31, massMax: -28 },
  { id: 'gamma', label: 'Gamma', color: '#ec4899', massMin: -28, massMax: -20 },
]
