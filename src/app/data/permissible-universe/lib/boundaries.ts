// ===========================================
// THE PERMISSIBLE UNIVERSE - BOUNDARIES
// ===========================================

import { Boundary } from './types'
import { BOUNDARY_COLORS, SCHWARZSCHILD_INTERCEPT, COMPTON_INTERCEPT } from './constants'

export const BOUNDARIES: Record<string, Boundary> = {
  schwarzschild: {
    id: 'schwarzschild',
    name: 'Schwarzschild Limit',
    shortName: 'Black Hole Limit',
    equation: 'R_s = 2GM/c²',
    equationExplained: 'Radius equals twice gravitational constant times mass divided by speed of light squared',
    lineType: 'schwarzschild',
    slope: 1,
    intercept: SCHWARZSCHILD_INTERCEPT,
    forbiddenSide: 'above',
    color: BOUNDARY_COLORS.schwarzschild.line,
    fillColor: BOUNDARY_COLORS.schwarzschild.fill,
    explanations: {
      accessible: 'If you pack too much mass into too small a space, gravity becomes so strong that not even light can escape. This creates a black hole. The Schwarzschild limit marks this point of no return.',
      intuitive: 'The escape velocity from a surface is v = √(2GM/R). When R shrinks enough that v = c, light cannot escape. This defines the event horizon. Anything crossing it is lost to the outside universe.',
      technical: 'The Schwarzschild radius R_s = 2GM/c² emerges from the Schwarzschild metric, the unique spherically symmetric vacuum solution to Einstein field equations. At r = R_s, the metric component g_tt → 0, creating a coordinate singularity (the event horizon).',
      advanced: 'The Penrose singularity theorem shows that once an event horizon forms, geodesic incompleteness is inevitable – a true singularity must exist inside. The no-hair theorem constrains black holes to mass, charge, and angular momentum only.',
    },
    counterfactual: 'Without the Schwarzschild limit, matter could be compressed indefinitely. Stars could collapse to arbitrary density without forming horizons. There would be no black holes, no information paradox, no Hawking radiation. The universe would lack its strangest objects.',
    implications: [
      'Black holes exist and can trap light',
      'Gravitational waves from merging black holes',
      'Event horizons hide singularities',
      'Maximum density for any given mass',
    ],
    definingObjects: ['stellar-bh', 'sagittarius-a', 'm87-bh', 'neutron-star'],
  },
  compton: {
    id: 'compton',
    name: 'Compton Limit',
    shortName: 'Quantum Limit',
    equation: 'λ_C = h/mc',
    equationExplained: 'Compton wavelength equals Planck constant divided by mass times speed of light',
    lineType: 'compton',
    slope: -1,
    intercept: COMPTON_INTERCEPT,
    forbiddenSide: 'below',
    color: BOUNDARY_COLORS.compton.line,
    fillColor: BOUNDARY_COLORS.compton.fill,
    explanations: {
      accessible: 'Quantum mechanics says everything is a wave. The heavier something is, the shorter its wavelength. If you try to confine a particle smaller than its wavelength, quantum effects make it impossible – the particle becomes fuzzy and delocalized.',
      intuitive: 'The Heisenberg uncertainty principle says Δx·Δp ≥ ℏ/2. Confining a particle to size R requires momentum uncertainty Δp ~ ℏ/R. Below the Compton wavelength, this momentum creates enough energy (E = pc) to generate new particles.',
      technical: 'The Compton wavelength λ_C = h/mc defines where relativistic quantum mechanics becomes essential. Below this scale, the particle concept breaks down – virtual pair creation becomes significant, and quantum field theory is required.',
      advanced: 'Below the Compton wavelength, the single-particle approximation fails. The Dirac sea picture shows why: confining an electron below λ_C requires energies exceeding 2m_ec², allowing e⁺e⁻ pair creation from vacuum fluctuations.',
    },
    counterfactual: 'Without the Compton limit, particles could be localized to arbitrary precision. Atoms would be infinitely small and stable. Chemistry would be deterministic, not probabilistic. The quantum nature of reality would vanish.',
    implications: [
      'Particles cannot be localized below their Compton wavelength',
      'Electron orbits in atoms have minimum size',
      'Virtual particles exist at small scales',
      'Quantum field theory becomes necessary',
    ],
    definingObjects: ['electron', 'proton', 'neutron'],
  },
  planck: {
    id: 'planck',
    name: 'Planck Scale',
    shortName: 'Resolution of Reality',
    equation: 'l_P = √(ℏG/c³)',
    equationExplained: 'Planck length equals square root of reduced Planck constant times gravitational constant divided by speed of light cubed',
    lineType: 'planck-vertical',
    constantValue: -33,
    forbiddenSide: 'left',
    color: BOUNDARY_COLORS.planck.line,
    fillColor: BOUNDARY_COLORS.planck.fill,
    dashPattern: [4, 4],
    explanations: {
      accessible: 'At the Planck scale, both quantum mechanics and gravity become equally important. Our current theories break down here – we need quantum gravity to understand what happens. It is the smallest meaningful distance.',
      intuitive: 'Quantum mechanics has a minimum action (ℏ), gravity has a strength (G), and nothing goes faster than light (c). Combining these gives the Planck length ~10⁻³³ cm – where quantum effects and gravity collide.',
      technical: 'The Planck length l_P = √(ℏG/c³) ≈ 1.6×10⁻³³ cm is where the Compton wavelength equals the Schwarzschild radius. At this scale, spacetime itself may be quantized, and classical geometry breaks down.',
      advanced: 'Loop quantum gravity suggests spacetime has discrete structure at the Planck scale. String theory requires extra dimensions compactified near l_P. The holographic principle implies information density is bounded by Planck-scale bits per area.',
    },
    counterfactual: 'Without the Planck scale, space and time could be infinitely divided. Singularities would be truly pointlike. There would be no natural cutoff for quantum field theories, and the universe would require infinite information to describe.',
    implications: [
      'Spacetime may be discrete at this scale',
      'Quantum gravity effects dominate',
      'Current physics theories break down',
      'Natural unit system for the universe',
    ],
    definingObjects: ['planck-mass'],
  },
  hubble: {
    id: 'hubble',
    name: 'Hubble Radius',
    shortName: 'Cosmic Horizon',
    equation: 'R_H = c/H₀',
    equationExplained: 'Hubble radius equals speed of light divided by Hubble constant',
    lineType: 'hubble-horizontal',
    constantValue: 28,
    forbiddenSide: 'above',
    color: BOUNDARY_COLORS.hubble.line,
    fillColor: BOUNDARY_COLORS.hubble.fill,
    dashPattern: [8, 4],
    explanations: {
      accessible: 'The universe is expanding. At a certain distance, space is stretching faster than light can travel through it. Beyond this Hubble radius, nothing that happens can ever affect us – it is the edge of our cosmic horizon.',
      intuitive: 'Hubble law: v = H₀d. At the Hubble radius d = c/H₀, recession velocity equals c. Objects beyond this are receding superluminally, but this is space expanding, not motion through space – it does not violate relativity.',
      technical: 'The Hubble radius R_H = c/H₀ ≈ 14.4 Gly is where cosmic expansion velocity equals c. This is distinct from the particle horizon (observable universe) and the event horizon (future visibility limit).',
      advanced: 'In de Sitter space (pure dark energy), the Hubble radius is constant and becomes a true event horizon. In our universe, dark energy is causing R_H to asymptotically approach a constant, freezing out distant galaxies forever.',
    },
    counterfactual: 'Without the Hubble limit, the observable universe would be infinite. We could receive signals from arbitrarily far away. Cosmic expansion would not isolate regions of space. The universe would be fundamentally different.',
    implications: [
      'Observable universe has finite size',
      'Cannot receive signals from beyond horizon',
      'Dark energy determines future visibility',
      'Cosmic isolation is inevitable',
    ],
    definingObjects: ['observable-universe', 'hubble-radius'],
  },
}

export const BOUNDARY_LIST = Object.values(BOUNDARIES)

export function getBoundaryLogRadius(boundaryId: string, logMass: number): number | null {
  const boundary = BOUNDARIES[boundaryId]
  if (!boundary) return null
  
  switch (boundary.lineType) {
    case 'schwarzschild':
      return logMass + (boundary.intercept ?? SCHWARZSCHILD_INTERCEPT)
    case 'compton':
      return -logMass + (boundary.intercept ?? COMPTON_INTERCEPT)
    case 'planck-vertical':
      return boundary.constantValue ?? -33
    case 'hubble-horizontal':
      return boundary.constantValue ?? 28
    default:
      return null
  }
}
