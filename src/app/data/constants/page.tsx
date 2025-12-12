'use client'

import { useState } from 'react'
import { Search, Copy, Check, Info, ExternalLink } from 'lucide-react'

// ===========================================
// CONSTANTS PAGE
// ===========================================
// Mathematical and physical constants - the numbers the universe is built on

type ConstantCategory = 'universal' | 'electromagnetic' | 'atomic' | 'mathematical' | 'other'

interface Constant {
  id: string
  symbol: string
  name: string
  value: string
  unit: string
  uncertainty?: string
  category: ConstantCategory
  description: string
  usedIn: string[]
  relatedConstants?: string[]
  namedAfter?: string
  yearDefined?: number
}

const CONSTANTS: Constant[] = [
  // Universal / Fundamental
  {
    id: 'c',
    symbol: 'c',
    name: 'Speed of Light in Vacuum',
    value: '299,792,458',
    unit: 'm/s',
    uncertainty: 'exact (defined)',
    category: 'universal',
    description: 'The maximum speed at which information or matter can travel. Since 1983, the metre is defined by fixing c at exactly this value.',
    usedIn: ['Special relativity', 'E=mc²', 'Electromagnetic waves', 'GPS'],
    yearDefined: 1983,
  },
  {
    id: 'G',
    symbol: 'G',
    name: 'Gravitational Constant',
    value: '6.67430 × 10⁻¹¹',
    unit: 'm³/(kg·s²)',
    uncertainty: '±0.00015',
    category: 'universal',
    description: 'Determines the strength of gravitational attraction between masses. First measured by Cavendish in 1798.',
    usedIn: ['Newton\'s law of gravity', 'General relativity', 'Orbital mechanics'],
    namedAfter: 'Newton',
    yearDefined: 1798,
  },
  {
    id: 'h',
    symbol: 'h',
    name: 'Planck Constant',
    value: '6.62607015 × 10⁻³⁴',
    unit: 'J·s',
    uncertainty: 'exact (defined)',
    category: 'universal',
    description: 'The fundamental quantum of action. Sets the scale at which quantum effects become important. Since 2019, used to define the kilogram.',
    usedIn: ['Quantum mechanics', 'E=hf', 'Uncertainty principle', 'Photon energy'],
    namedAfter: 'Max Planck',
    yearDefined: 1900,
    relatedConstants: ['ℏ'],
  },
  {
    id: 'hbar',
    symbol: 'ℏ',
    name: 'Reduced Planck Constant',
    value: '1.054571817 × 10⁻³⁴',
    unit: 'J·s',
    uncertainty: 'exact (derived)',
    category: 'universal',
    description: 'Planck constant divided by 2π. More natural for angular momentum and wave equations.',
    usedIn: ['Angular momentum quantization', 'Schrödinger equation'],
    relatedConstants: ['h'],
  },
  {
    id: 'k',
    symbol: 'k_B',
    name: 'Boltzmann Constant',
    value: '1.380649 × 10⁻²³',
    unit: 'J/K',
    uncertainty: 'exact (defined)',
    category: 'universal',
    description: 'Links temperature to energy at the molecular level. The thermal energy per degree of freedom is ½kT.',
    usedIn: ['Thermodynamics', 'Statistical mechanics', 'Ideal gas law'],
    namedAfter: 'Ludwig Boltzmann',
  },
  
  // Electromagnetic
  {
    id: 'e',
    symbol: 'e',
    name: 'Elementary Charge',
    value: '1.602176634 × 10⁻¹⁹',
    unit: 'C',
    uncertainty: 'exact (defined)',
    category: 'electromagnetic',
    description: 'The electric charge of a proton (or the negative of an electron\'s charge). The smallest free charge in nature.',
    usedIn: ['Electrostatics', 'Electronics', 'Particle physics'],
  },
  {
    id: 'epsilon0',
    symbol: 'ε₀',
    name: 'Vacuum Permittivity',
    value: '8.8541878128 × 10⁻¹²',
    unit: 'F/m',
    uncertainty: 'derived from c and μ₀',
    category: 'electromagnetic',
    description: 'Determines the strength of electric interactions in vacuum. Appears in Coulomb\'s law and Maxwell\'s equations.',
    usedIn: ['Coulomb\'s law', 'Capacitance', 'Maxwell\'s equations'],
    relatedConstants: ['μ₀', 'c'],
  },
  {
    id: 'mu0',
    symbol: 'μ₀',
    name: 'Vacuum Permeability',
    value: '1.25663706212 × 10⁻⁶',
    unit: 'H/m',
    uncertainty: 'derived',
    category: 'electromagnetic',
    description: 'Determines the strength of magnetic interactions in vacuum. Related to speed of light by c = 1/√(ε₀μ₀).',
    usedIn: ['Magnetism', 'Inductance', 'Maxwell\'s equations'],
    relatedConstants: ['ε₀', 'c'],
  },
  {
    id: 'alpha',
    symbol: 'α',
    name: 'Fine Structure Constant',
    value: '1/137.035999084',
    unit: 'dimensionless',
    uncertainty: '≈ 7.297×10⁻³',
    category: 'electromagnetic',
    description: 'The dimensionless coupling constant for electromagnetism. Determines the strength of electromagnetic interaction between charged particles.',
    usedIn: ['QED', 'Atomic spectra', 'Electron g-factor'],
    relatedConstants: ['e', 'ℏ', 'c', 'ε₀'],
  },
  
  // Atomic
  {
    id: 'me',
    symbol: 'm_e',
    name: 'Electron Mass',
    value: '9.1093837015 × 10⁻³¹',
    unit: 'kg',
    uncertainty: '±0.0000000028 × 10⁻³¹',
    category: 'atomic',
    description: 'Mass of an electron at rest. About 1/1836 of the proton mass.',
    usedIn: ['Atomic physics', 'Quantum mechanics', 'Particle physics'],
    relatedConstants: ['m_p'],
  },
  {
    id: 'mp',
    symbol: 'm_p',
    name: 'Proton Mass',
    value: '1.67262192369 × 10⁻²⁷',
    unit: 'kg',
    uncertainty: '±0.00000000051 × 10⁻²⁷',
    category: 'atomic',
    description: 'Mass of a proton at rest. Approximately 1836 times the electron mass.',
    usedIn: ['Nuclear physics', 'Mass spectrometry', 'Particle physics'],
    relatedConstants: ['m_e', 'm_n', 'u'],
  },
  {
    id: 'mn',
    symbol: 'm_n',
    name: 'Neutron Mass',
    value: '1.67492749804 × 10⁻²⁷',
    unit: 'kg',
    uncertainty: '±0.00000000095 × 10⁻²⁷',
    category: 'atomic',
    description: 'Mass of a neutron at rest. Slightly heavier than a proton, which is why free neutrons decay.',
    usedIn: ['Nuclear physics', 'Beta decay', 'Neutron stars'],
    relatedConstants: ['m_p', 'u'],
  },
  {
    id: 'u',
    symbol: 'u',
    name: 'Atomic Mass Unit (Dalton)',
    value: '1.66053906660 × 10⁻²⁷',
    unit: 'kg',
    uncertainty: '±0.00000000050 × 10⁻²⁷',
    category: 'atomic',
    description: 'Defined as 1/12 of the mass of a carbon-12 atom. Convenient for expressing atomic masses.',
    usedIn: ['Chemistry', 'Mass spectrometry', 'Nuclear physics'],
  },
  {
    id: 'Na',
    symbol: 'N_A',
    name: 'Avogadro Constant',
    value: '6.02214076 × 10²³',
    unit: 'mol⁻¹',
    uncertainty: 'exact (defined)',
    category: 'atomic',
    description: 'Number of particles in one mole. Links atomic and macroscopic scales.',
    usedIn: ['Chemistry', 'Thermodynamics', 'Statistical mechanics'],
    namedAfter: 'Amedeo Avogadro',
  },
  {
    id: 'a0',
    symbol: 'a₀',
    name: 'Bohr Radius',
    value: '5.29177210903 × 10⁻¹¹',
    unit: 'm',
    uncertainty: '±0.00000000080 × 10⁻¹¹',
    category: 'atomic',
    description: 'The most probable distance between nucleus and electron in a hydrogen atom\'s ground state.',
    usedIn: ['Atomic physics', 'Quantum chemistry', 'Electron orbitals'],
    namedAfter: 'Niels Bohr',
    relatedConstants: ['ℏ', 'm_e', 'e', 'ε₀'],
  },
  {
    id: 'Ry',
    symbol: 'R_∞',
    name: 'Rydberg Constant',
    value: '10,973,731.568160',
    unit: 'm⁻¹',
    uncertainty: '±0.000021',
    category: 'atomic',
    description: 'Determines the wavelengths of spectral lines. One of the most precisely measured constants.',
    usedIn: ['Spectroscopy', 'Atomic transitions', 'Hydrogen spectrum'],
    namedAfter: 'Johannes Rydberg',
  },
  
  // Mathematical
  {
    id: 'pi',
    symbol: 'π',
    name: 'Pi',
    value: '3.14159265358979...',
    unit: 'dimensionless',
    uncertainty: 'irrational',
    category: 'mathematical',
    description: 'Ratio of a circle\'s circumference to its diameter. Appears throughout mathematics and physics.',
    usedIn: ['Geometry', 'Trigonometry', 'Wave equations', 'Fourier analysis'],
  },
  {
    id: 'euler',
    symbol: 'e',
    name: 'Euler\'s Number',
    value: '2.71828182845905...',
    unit: 'dimensionless',
    uncertainty: 'irrational',
    category: 'mathematical',
    description: 'Base of natural logarithms. The unique number where the derivative of eˣ is itself.',
    usedIn: ['Calculus', 'Exponential growth/decay', 'Compound interest', 'Probability'],
    namedAfter: 'Leonhard Euler',
  },
  {
    id: 'phi',
    symbol: 'φ',
    name: 'Golden Ratio',
    value: '1.61803398874989...',
    unit: 'dimensionless',
    uncertainty: 'irrational',
    category: 'mathematical',
    description: 'The ratio where the whole is to the larger part as the larger part is to the smaller. Appears in art, architecture, and nature.',
    usedIn: ['Fibonacci sequence', 'Aesthetics', 'Phyllotaxis', 'Penrose tiling'],
  },
  {
    id: 'gamma',
    symbol: 'γ',
    name: 'Euler-Mascheroni Constant',
    value: '0.57721566490153...',
    unit: 'dimensionless',
    uncertainty: 'possibly irrational',
    category: 'mathematical',
    description: 'The limiting difference between the harmonic series and the natural logarithm.',
    usedIn: ['Number theory', 'Analysis', 'Riemann zeta function'],
    namedAfter: 'Euler & Mascheroni',
  },
  {
    id: 'sqrt2',
    symbol: '√2',
    name: 'Pythagoras\' Constant',
    value: '1.41421356237310...',
    unit: 'dimensionless',
    uncertainty: 'irrational',
    category: 'mathematical',
    description: 'The diagonal of a unit square. The first known irrational number, discovered by the Pythagoreans.',
    usedIn: ['Geometry', 'Paper sizes (A4)', 'Octave frequency ratios'],
  },
  
  // Other
  {
    id: 'sigma',
    symbol: 'σ',
    name: 'Stefan-Boltzmann Constant',
    value: '5.670374419 × 10⁻⁸',
    unit: 'W/(m²·K⁴)',
    uncertainty: 'exact (derived)',
    category: 'other',
    description: 'Determines the total power radiated by a black body. P = σAT⁴.',
    usedIn: ['Blackbody radiation', 'Climate science', 'Astrophysics'],
    relatedConstants: ['k_B', 'h', 'c'],
  },
  {
    id: 'R',
    symbol: 'R',
    name: 'Gas Constant',
    value: '8.314462618',
    unit: 'J/(mol·K)',
    uncertainty: 'exact (derived)',
    category: 'other',
    description: 'Links pressure, volume, and temperature for ideal gases. R = N_A × k_B.',
    usedIn: ['Ideal gas law', 'Thermodynamics', 'Chemistry'],
    relatedConstants: ['N_A', 'k_B'],
  },
]

const CATEGORY_CONFIG: Record<ConstantCategory, { label: string; color: string }> = {
  universal: { label: 'Universal', color: 'bg-purple-100 text-purple-800' },
  electromagnetic: { label: 'Electromagnetic', color: 'bg-blue-100 text-blue-800' },
  atomic: { label: 'Atomic & Nuclear', color: 'bg-green-100 text-green-800' },
  mathematical: { label: 'Mathematical', color: 'bg-amber-100 text-amber-800' },
  other: { label: 'Other', color: 'bg-neutral-100 text-neutral-800' },
}

export default function ConstantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ConstantCategory | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredConstants = CONSTANTS.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const copyValue = (c: Constant) => {
    navigator.clipboard.writeText(`${c.value} ${c.unit}`)
    setCopiedId(c.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Fundamental Constants
          </h1>
          <p className="text-base md:text-lg text-neutral-600 max-w-3xl">
            The numbers the universe is built on. Physical constants determine the strength of 
            forces, the size of atoms, and the speed limit of the cosmos. Mathematical constants 
            appear whenever we describe the world with equations.
          </p>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search constants..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                All
              </button>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as ConstantCategory)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === key
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Constants list */}
        <div className="space-y-3">
          {filteredConstants.map(c => {
            const isExpanded = expandedId === c.id
            const categoryConfig = CATEGORY_CONFIG[c.category]
            
            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden transition-all"
              >
                {/* Main row */}
                <div
                  className="p-4 md:p-5 flex items-start gap-4 cursor-pointer hover:bg-neutral-50"
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                >
                  {/* Symbol */}
                  <div className="w-16 h-16 flex items-center justify-center bg-neutral-100 rounded-xl flex-shrink-0">
                    <span className="text-2xl font-serif italic text-neutral-800">
                      {c.symbol}
                    </span>
                  </div>

                  {/* Name and value */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-medium text-neutral-900">{c.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${categoryConfig.color}`}>
                        {categoryConfig.label}
                      </span>
                    </div>
                    <div className="font-mono text-lg text-neutral-700 mb-1">
                      {c.value} <span className="text-neutral-400">{c.unit}</span>
                    </div>
                    <p className="text-sm text-neutral-500 line-clamp-2">
                      {c.description}
                    </p>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      copyValue(c)
                    }}
                    className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                    title="Copy value"
                  >
                    {copiedId === c.id ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 md:px-5 pb-4 md:pb-5 pt-2 border-t border-neutral-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                          Used In
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {c.usedIn.map((use, i) => (
                            <span key={i} className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-lg">
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>

                      {c.uncertainty && (
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                            Uncertainty
                          </h4>
                          <p className="text-sm text-neutral-700">{c.uncertainty}</p>
                        </div>
                      )}

                      {c.namedAfter && (
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                            Named After
                          </h4>
                          <p className="text-sm text-neutral-700">{c.namedAfter}</p>
                        </div>
                      )}

                      {c.yearDefined && (
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                            First Measured/Defined
                          </h4>
                          <p className="text-sm text-neutral-700">{c.yearDefined}</p>
                        </div>
                      )}

                      {c.relatedConstants && (
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                            Related Constants
                          </h4>
                          <div className="flex gap-2">
                            {c.relatedConstants.map((rel, i) => (
                              <span key={i} className="font-serif italic text-neutral-700">
                                {rel}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* CODATA note */}
        <div className="mt-8 p-4 bg-neutral-100 rounded-xl text-sm text-neutral-600">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Source:</strong> Values from CODATA 2022 recommended values. 
              Physical constants are maintained by NIST. Since 2019, the SI base units 
              are defined by fixing the values of h, e, k_B, and N_A.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}