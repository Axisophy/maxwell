'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageShell, BreadcrumbFrame, PageHeaderFrame, breadcrumbItems } from '@/components/ui'
import { DataIcon } from '@/components/icons'
import { Search, Copy, Check } from 'lucide-react'

// ============================================================================
// TYPES & DATA
// ============================================================================

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
    symbol: 'kB',
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
    symbol: 'me',
    name: 'Electron Mass',
    value: '9.1093837015 × 10⁻³¹',
    unit: 'kg',
    uncertainty: '±0.0000000028 × 10⁻³¹',
    category: 'atomic',
    description: 'Mass of an electron at rest. About 1/1836 of the proton mass.',
    usedIn: ['Atomic physics', 'Quantum mechanics', 'Particle physics'],
    relatedConstants: ['mp'],
  },
  {
    id: 'mp',
    symbol: 'mp',
    name: 'Proton Mass',
    value: '1.67262192369 × 10⁻²⁷',
    unit: 'kg',
    uncertainty: '±0.00000000051 × 10⁻²⁷',
    category: 'atomic',
    description: 'Mass of a proton at rest. Approximately 1836 times the electron mass.',
    usedIn: ['Nuclear physics', 'Mass spectrometry', 'Particle physics'],
    relatedConstants: ['me', 'mn', 'u'],
  },
  {
    id: 'mn',
    symbol: 'mn',
    name: 'Neutron Mass',
    value: '1.67492749804 × 10⁻²⁷',
    unit: 'kg',
    uncertainty: '±0.00000000095 × 10⁻²⁷',
    category: 'atomic',
    description: 'Mass of a neutron at rest. Slightly heavier than a proton, which is why free neutrons decay.',
    usedIn: ['Nuclear physics', 'Beta decay', 'Neutron stars'],
    relatedConstants: ['mp', 'u'],
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
    symbol: 'NA',
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
    relatedConstants: ['ℏ', 'me', 'e', 'ε₀'],
  },
  {
    id: 'Ry',
    symbol: 'R∞',
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
    relatedConstants: ['kB', 'h', 'c'],
  },
  {
    id: 'R',
    symbol: 'R',
    name: 'Gas Constant',
    value: '8.314462618',
    unit: 'J/(mol·K)',
    uncertainty: 'exact (derived)',
    category: 'other',
    description: 'Links pressure, volume, and temperature for ideal gases. R = NA × kB.',
    usedIn: ['Ideal gas law', 'Thermodynamics', 'Chemistry'],
    relatedConstants: ['NA', 'kB'],
  },
]

const CATEGORY_CONFIG: Record<ConstantCategory, { label: string; count: number }> = {
  universal: { label: 'Universal', count: CONSTANTS.filter(c => c.category === 'universal').length },
  electromagnetic: { label: 'Electromagnetic', count: CONSTANTS.filter(c => c.category === 'electromagnetic').length },
  atomic: { label: 'Atomic & Nuclear', count: CONSTANTS.filter(c => c.category === 'atomic').length },
  mathematical: { label: 'Mathematical', count: CONSTANTS.filter(c => c.category === 'mathematical').length },
  other: { label: 'Other', count: CONSTANTS.filter(c => c.category === 'other').length },
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

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
    <PageShell>
      <BreadcrumbFrame
        variant="light"
        icon={<DataIcon className="w-4 h-4" />}
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['Data', '/data'],
          ['The Fabric', '/data/fabric'],
          ['Constants']
        )}
      />

      <PageHeaderFrame
        variant="light"
        title="Fundamental Constants"
        description={`The ${CONSTANTS.length} numbers the universe is built on. Physical constants determine the strength of forces, the size of atoms, and the speed limit of the cosmos.`}
      />

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Search & Filter Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                <input
                  type="text"
                  placeholder="Search constants..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/5 border-0 rounded-lg text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Category filter - yellow/black toggle pattern */}
              <div className="flex flex-wrap gap-px">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors uppercase ${
                    selectedCategory === 'all'
                      ? 'bg-black text-white'
                      : 'bg-black/10 text-black/60 hover:text-black'
                  }`}
                >
                  All ({CONSTANTS.length})
                </button>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as ConstantCategory)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors uppercase ${
                      selectedCategory === key
                        ? 'bg-black text-white'
                        : 'bg-black/10 text-black/60 hover:text-black'
                    }`}
                  >
                    {config.label} ({config.count})
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Constants List Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="flex flex-col gap-px">
              {filteredConstants.map(c => (
                <ConstantCard
                  key={c.id}
                  constant={c}
                  isExpanded={expandedId === c.id}
                  isCopied={copiedId === c.id}
                  onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
                  onCopy={() => copyValue(c)}
                />
              ))}
            </div>

            {filteredConstants.length === 0 && (
              <div className="p-8 text-center text-black/40">
                No constants match your search.
              </div>
            )}
          </section>

          {/* Source Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-sm text-black/50 max-w-2xl">
              <strong className="text-black/70">Source:</strong> Values from CODATA 2022 recommended values,
              maintained by NIST. Since 2019, the SI base units are defined by fixing the values
              of h, e, k<sub>B</sub>, and N<sub>A</sub>.
            </div>
          </section>

          {/* Cross-references Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-sm text-black/40 uppercase tracking-wider mb-3">
              Related
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/data/fabric"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                The Fabric →
              </Link>
              <Link
                href="/data/fabric/particles"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Standard Model →
              </Link>
              <Link
                href="/data/mathematics"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Mathematics →
              </Link>
            </div>
          </section>

        </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </PageShell>
  )
}

// ============================================================================
// Constant Card Component
// ============================================================================

function ConstantCard({
  constant: c,
  isExpanded,
  isCopied,
  onToggle,
  onCopy,
}: {
  constant: Constant
  isExpanded: boolean
  isCopied: boolean
  onToggle: () => void
  onCopy: () => void
}) {
  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {/* Main row */}
      <div
        className="p-3 md:p-4 flex items-start gap-3 md:gap-4 cursor-pointer hover:bg-neutral-900 transition-colors"
        onClick={onToggle}
      >
        {/* Symbol - uses math font */}
        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/10 rounded-lg flex-shrink-0">
          <span className="text-xl md:text-2xl font-math italic text-white">
            {c.symbol}
          </span>
        </div>

        {/* Name and value */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base font-medium text-white mb-1">{c.name}</h3>
          <div className="font-mono text-lg md:text-xl text-white/80 mb-1">
            {c.value} <span className="text-white/40 text-sm">{c.unit}</span>
          </div>
          <p className="text-xs md:text-sm text-white/40 line-clamp-2">
            {c.description}
          </p>
        </div>

        {/* Copy button */}
        <button
          onClick={e => {
            e.stopPropagation()
            onCopy()
          }}
          className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors flex-shrink-0"
          title="Copy value"
        >
          {isCopied ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 md:px-4 pb-3 md:pb-4 pt-2 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                Used In
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.usedIn.map((use, i) => (
                  <span key={i} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-lg">
                    {use}
                  </span>
                ))}
              </div>
            </div>

            {c.uncertainty && (
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                  Uncertainty
                </div>
                <p className="text-sm text-white/70">{c.uncertainty}</p>
              </div>
            )}

            {c.namedAfter && (
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                  Named After
                </div>
                <p className="text-sm text-white/70">{c.namedAfter}</p>
              </div>
            )}

            {c.yearDefined && (
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                  First Measured/Defined
                </div>
                <p className="text-sm text-white/70">{c.yearDefined}</p>
              </div>
            )}

            {c.relatedConstants && (
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                  Related Constants
                </div>
                <div className="flex gap-2">
                  {c.relatedConstants.map((rel, i) => (
                    <span key={i} className="font-math italic text-white/70">
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
}
