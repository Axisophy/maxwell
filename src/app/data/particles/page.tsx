'use client'

import { useState } from 'react'
import { Info, ExternalLink } from 'lucide-react'

// ===========================================
// STANDARD MODEL PAGE
// ===========================================
// The fundamental particles of physics

type ParticleType = 'quark' | 'lepton' | 'gauge-boson' | 'scalar-boson'

interface Particle {
  id: string
  symbol: string
  name: string
  type: ParticleType
  generation?: 1 | 2 | 3
  mass: string
  charge: number // -1, -2/3, -1/3, 0, 1/3, 2/3, 1
  spin: string
  discovered: number
  discoveredAt?: string
  color?: boolean // For quarks
  antiparticle?: string
  description: string
  role: string
}

const PARTICLES: Particle[] = [
  // ============ QUARKS ============
  // Generation 1
  {
    id: 'u',
    symbol: 'u',
    name: 'Up',
    type: 'quark',
    generation: 1,
    mass: '2.2 MeV/c²',
    charge: 2/3,
    spin: '½',
    discovered: 1968,
    discoveredAt: 'SLAC',
    color: true,
    antiparticle: 'ū',
    description: 'The lightest quark. Two up quarks and one down quark make a proton.',
    role: 'Building block of protons and neutrons',
  },
  {
    id: 'd',
    symbol: 'd',
    name: 'Down',
    type: 'quark',
    generation: 1,
    mass: '4.7 MeV/c²',
    charge: -1/3,
    spin: '½',
    discovered: 1968,
    discoveredAt: 'SLAC',
    color: true,
    antiparticle: 'd̄',
    description: 'Slightly heavier than up. One up and two down quarks make a neutron.',
    role: 'Building block of protons and neutrons',
  },
  // Generation 2
  {
    id: 'c',
    symbol: 'c',
    name: 'Charm',
    type: 'quark',
    generation: 2,
    mass: '1.27 GeV/c²',
    charge: 2/3,
    spin: '½',
    discovered: 1974,
    discoveredAt: 'SLAC & BNL',
    color: true,
    antiparticle: 'c̄',
    description: 'Discovered in the "November Revolution" of 1974. About 500× heavier than up.',
    role: 'Found in charm mesons (D mesons)',
  },
  {
    id: 's',
    symbol: 's',
    name: 'Strange',
    type: 'quark',
    generation: 2,
    mass: '96 MeV/c²',
    charge: -1/3,
    spin: '½',
    discovered: 1968,
    color: true,
    antiparticle: 's̄',
    description: 'Named for the "strange" behaviour of particles containing it.',
    role: 'Found in kaons and hyperons',
  },
  // Generation 3
  {
    id: 't',
    symbol: 't',
    name: 'Top',
    type: 'quark',
    generation: 3,
    mass: '173 GeV/c²',
    charge: 2/3,
    spin: '½',
    discovered: 1995,
    discoveredAt: 'Fermilab',
    color: true,
    antiparticle: 't̄',
    description: 'The heaviest quark — about as heavy as a gold atom. Decays before forming hadrons.',
    role: 'Too heavy to form stable hadrons',
  },
  {
    id: 'b',
    symbol: 'b',
    name: 'Bottom',
    type: 'quark',
    generation: 3,
    mass: '4.18 GeV/c²',
    charge: -1/3,
    spin: '½',
    discovered: 1977,
    discoveredAt: 'Fermilab',
    color: true,
    antiparticle: 'b̄',
    description: 'Also called "beauty". Forms B mesons used in CP violation studies.',
    role: 'Found in B mesons',
  },

  // ============ LEPTONS ============
  // Generation 1
  {
    id: 'e',
    symbol: 'e⁻',
    name: 'Electron',
    type: 'lepton',
    generation: 1,
    mass: '0.511 MeV/c²',
    charge: -1,
    spin: '½',
    discovered: 1897,
    discoveredAt: 'Cambridge',
    antiparticle: 'e⁺',
    description: 'The first particle to be discovered. Orbits atomic nuclei.',
    role: 'Atomic structure, electricity, chemistry',
  },
  {
    id: 've',
    symbol: 'νₑ',
    name: 'Electron Neutrino',
    type: 'lepton',
    generation: 1,
    mass: '< 1.1 eV/c²',
    charge: 0,
    spin: '½',
    discovered: 1956,
    antiparticle: 'ν̄ₑ',
    description: 'Nearly massless, barely interacts. Trillions pass through you every second.',
    role: 'Beta decay, solar fusion',
  },
  // Generation 2
  {
    id: 'mu',
    symbol: 'μ⁻',
    name: 'Muon',
    type: 'lepton',
    generation: 2,
    mass: '106 MeV/c²',
    charge: -1,
    spin: '½',
    discovered: 1936,
    antiparticle: 'μ⁺',
    description: '"Who ordered that?" A heavy electron that decays in 2.2 μs.',
    role: 'Cosmic ray showers, muon tomography',
  },
  {
    id: 'vmu',
    symbol: 'νμ',
    name: 'Muon Neutrino',
    type: 'lepton',
    generation: 2,
    mass: '< 0.19 MeV/c²',
    charge: 0,
    spin: '½',
    discovered: 1962,
    antiparticle: 'ν̄μ',
    description: 'The second neutrino type. Proved that neutrino flavors are distinct.',
    role: 'Produced in muon decay',
  },
  // Generation 3
  {
    id: 'tau',
    symbol: 'τ⁻',
    name: 'Tau',
    type: 'lepton',
    generation: 3,
    mass: '1.78 GeV/c²',
    charge: -1,
    spin: '½',
    discovered: 1975,
    discoveredAt: 'SLAC',
    antiparticle: 'τ⁺',
    description: 'The heaviest lepton — heavier than a proton. Decays in 10⁻¹³ seconds.',
    role: 'Rare decays, particle physics research',
  },
  {
    id: 'vtau',
    symbol: 'ντ',
    name: 'Tau Neutrino',
    type: 'lepton',
    generation: 3,
    mass: '< 18.2 MeV/c²',
    charge: 0,
    spin: '½',
    discovered: 2000,
    discoveredAt: 'Fermilab',
    antiparticle: 'ν̄τ',
    description: 'The last neutrino to be directly observed. Completes the third generation.',
    role: 'Produced in tau decay',
  },

  // ============ GAUGE BOSONS ============
  {
    id: 'photon',
    symbol: 'γ',
    name: 'Photon',
    type: 'gauge-boson',
    mass: '0',
    charge: 0,
    spin: '1',
    discovered: 1923,
    description: 'The quantum of light. Mediates all electromagnetic interactions.',
    role: 'Electromagnetic force carrier',
  },
  {
    id: 'gluon',
    symbol: 'g',
    name: 'Gluon',
    type: 'gauge-boson',
    mass: '0',
    charge: 0,
    spin: '1',
    discovered: 1979,
    discoveredAt: 'DESY',
    color: true,
    description: 'Holds quarks together. Carries color charge, so gluons also attract each other.',
    role: 'Strong force carrier (8 types)',
  },
  {
    id: 'W+',
    symbol: 'W⁺',
    name: 'W⁺ Boson',
    type: 'gauge-boson',
    mass: '80.4 GeV/c²',
    charge: 1,
    spin: '1',
    discovered: 1983,
    discoveredAt: 'CERN',
    description: 'Mediates the charged weak interaction. Changes quarks from one type to another.',
    role: 'Weak force carrier (charged)',
  },
  {
    id: 'W-',
    symbol: 'W⁻',
    name: 'W⁻ Boson',
    type: 'gauge-boson',
    mass: '80.4 GeV/c²',
    charge: -1,
    spin: '1',
    discovered: 1983,
    discoveredAt: 'CERN',
    description: 'Antiparticle of W⁺. Mediates beta decay.',
    role: 'Weak force carrier (charged)',
  },
  {
    id: 'Z',
    symbol: 'Z⁰',
    name: 'Z Boson',
    type: 'gauge-boson',
    mass: '91.2 GeV/c²',
    charge: 0,
    spin: '1',
    discovered: 1983,
    discoveredAt: 'CERN',
    description: 'The neutral weak boson. Mediates neutral current interactions.',
    role: 'Weak force carrier (neutral)',
  },

  // ============ SCALAR BOSONS ============
  {
    id: 'higgs',
    symbol: 'H⁰',
    name: 'Higgs Boson',
    type: 'scalar-boson',
    mass: '125 GeV/c²',
    charge: 0,
    spin: '0',
    discovered: 2012,
    discoveredAt: 'CERN LHC',
    description: 'Excitation of the Higgs field that gives particles their mass. The final piece of the Standard Model.',
    role: 'Mass generation mechanism',
  },
]

const TYPE_CONFIG = {
  'quark': { label: 'Quarks', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-100', text: 'text-purple-800' },
  'lepton': { label: 'Leptons', color: 'from-green-500 to-green-600', bg: 'bg-green-100', text: 'text-green-800' },
  'gauge-boson': { label: 'Gauge Bosons', color: 'from-red-500 to-red-600', bg: 'bg-red-100', text: 'text-red-800' },
  'scalar-boson': { label: 'Scalar Bosons', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-100', text: 'text-amber-800' },
}

export default function StandardModelPage() {
  const [selectedParticle, setSelectedParticle] = useState<Particle | null>(null)
  const [showAntimatter, setShowAntimatter] = useState(false)

  const quarks = PARTICLES.filter(p => p.type === 'quark')
  const leptons = PARTICLES.filter(p => p.type === 'lepton')
  const gaugeBosons = PARTICLES.filter(p => p.type === 'gauge-boson')
  const scalarBosons = PARTICLES.filter(p => p.type === 'scalar-boson')

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            The Standard Model
          </h1>
          <p className="text-base md:text-lg text-neutral-600 max-w-3xl">
            The most successful theory in physics. 17 fundamental particles — 6 quarks, 6 leptons, 
            4 gauge bosons, and the Higgs — explain nearly all observed phenomena (except gravity).
          </p>
        </div>

        {/* Quick overview */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">6</div>
              <div className="text-sm text-purple-800">Quarks</div>
              <div className="text-xs text-purple-600">Make up protons & neutrons</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600">6</div>
              <div className="text-sm text-green-800">Leptons</div>
              <div className="text-xs text-green-600">Include electrons & neutrinos</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-3xl font-bold text-red-600">4</div>
              <div className="text-sm text-red-800">Gauge Bosons</div>
              <div className="text-xs text-red-600">Carry the forces</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="text-3xl font-bold text-amber-600">1</div>
              <div className="text-sm text-amber-800">Scalar Boson</div>
              <div className="text-xs text-amber-600">The Higgs</div>
            </div>
          </div>
        </div>

        {/* Main grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Particle grid - 8 cols */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quarks */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-lg font-medium text-purple-800 mb-4 flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-purple-600" />
                Quarks
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {quarks.map(p => (
                  <ParticleCard 
                    key={p.id} 
                    particle={p} 
                    onClick={() => setSelectedParticle(p)}
                    isSelected={selectedParticle?.id === p.id}
                  />
                ))}
              </div>
              <div className="mt-3 flex gap-4 text-xs text-neutral-500">
                <span>Generation: 1 → 2 → 3 (increasing mass)</span>
              </div>
            </div>

            {/* Leptons */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-lg font-medium text-green-800 mb-4 flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-green-600" />
                Leptons
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {leptons.map(p => (
                  <ParticleCard 
                    key={p.id} 
                    particle={p} 
                    onClick={() => setSelectedParticle(p)}
                    isSelected={selectedParticle?.id === p.id}
                  />
                ))}
              </div>
            </div>

            {/* Bosons */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-lg font-medium text-red-800 mb-4 flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500 to-red-600" />
                Force Carriers (Bosons)
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[...gaugeBosons, ...scalarBosons].map(p => (
                  <ParticleCard 
                    key={p.id} 
                    particle={p} 
                    onClick={() => setSelectedParticle(p)}
                    isSelected={selectedParticle?.id === p.id}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Detail panel - 4 cols */}
          <div className="lg:col-span-4">
            {selectedParticle ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 sticky top-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`text-5xl font-serif italic ${TYPE_CONFIG[selectedParticle.type].text}`}>
                      {selectedParticle.symbol}
                    </div>
                    <h3 className="text-xl font-medium text-neutral-900 mt-2">
                      {selectedParticle.name}
                    </h3>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${TYPE_CONFIG[selectedParticle.type].bg} ${TYPE_CONFIG[selectedParticle.type].text}`}>
                      {TYPE_CONFIG[selectedParticle.type].label}
                      {selectedParticle.generation && ` · Gen ${selectedParticle.generation}`}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedParticle(null)}
                    className="p-1 hover:bg-neutral-100 rounded text-neutral-400"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-neutral-600 mb-4">
                  {selectedParticle.description}
                </p>

                <div className="space-y-3">
                  <PropertyRow label="Mass" value={selectedParticle.mass} />
                  <PropertyRow label="Charge" value={formatCharge(selectedParticle.charge)} />
                  <PropertyRow label="Spin" value={selectedParticle.spin} />
                  <PropertyRow label="Discovered" value={`${selectedParticle.discovered}${selectedParticle.discoveredAt ? ` (${selectedParticle.discoveredAt})` : ''}`} />
                  {selectedParticle.antiparticle && (
                    <PropertyRow label="Antiparticle" value={selectedParticle.antiparticle} />
                  )}
                  {selectedParticle.color && (
                    <PropertyRow label="Color charge" value="Yes (r, g, b)" />
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Role in Nature
                  </div>
                  <p className="text-sm text-neutral-700">{selectedParticle.role}</p>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-100 rounded-2xl p-8 text-center text-neutral-500 sticky top-4">
                <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Click a particle to see details</p>
              </div>
            )}
          </div>
        </div>

        {/* The forces */}
        <div className="mt-8 bg-white rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">
            The Four Fundamental Forces
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ForceCard
              name="Strong"
              carrier="Gluons (8)"
              range="~10⁻¹⁵ m"
              strength="1"
              affects="Quarks, gluons"
              color="purple"
            />
            <ForceCard
              name="Electromagnetic"
              carrier="Photon"
              range="∞"
              strength="10⁻²"
              affects="Charged particles"
              color="blue"
            />
            <ForceCard
              name="Weak"
              carrier="W±, Z⁰"
              range="~10⁻¹⁸ m"
              strength="10⁻⁶"
              affects="All fermions"
              color="orange"
            />
            <ForceCard
              name="Gravity"
              carrier="Graviton?"
              range="∞"
              strength="10⁻³⁸"
              affects="All mass/energy"
              color="gray"
              note="Not in Standard Model"
            />
          </div>
        </div>

        {/* What's missing */}
        <div className="mt-8 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-medium mb-4">What the Standard Model Doesn't Explain</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-white/10 rounded-lg">
              <div className="font-medium mb-1">Gravity</div>
              <div className="text-white/70">General relativity doesn't fit with quantum mechanics</div>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <div className="font-medium mb-1">Dark Matter</div>
              <div className="text-white/70">85% of the universe's mass is unknown</div>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <div className="font-medium mb-1">Dark Energy</div>
              <div className="text-white/70">The universe's accelerating expansion</div>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <div className="font-medium mb-1">Matter/Antimatter Asymmetry</div>
              <div className="text-white/70">Why there's more matter than antimatter</div>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <div className="font-medium mb-1">Neutrino Masses</div>
              <div className="text-white/70">Added ad-hoc, origin unknown</div>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <div className="font-medium mb-1">Why 17 Particles?</div>
              <div className="text-white/70">Why these masses and coupling constants?</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// Helper components
function ParticleCard({ 
  particle, 
  onClick, 
  isSelected 
}: { 
  particle: Particle
  onClick: () => void
  isSelected: boolean 
}) {
  const config = TYPE_CONFIG[particle.type]
  
  return (
    <button
      onClick={onClick}
      className={`
        p-3 rounded-xl text-center transition-all
        ${isSelected 
          ? `bg-gradient-to-br ${config.color} text-white shadow-lg scale-105` 
          : `${config.bg} hover:scale-105`
        }
      `}
    >
      <div className={`text-2xl font-serif italic ${isSelected ? 'text-white' : config.text}`}>
        {particle.symbol}
      </div>
      <div className={`text-xs mt-1 ${isSelected ? 'text-white/90' : 'text-neutral-600'}`}>
        {particle.name}
      </div>
    </button>
  )
}

function PropertyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="font-mono text-neutral-900">{value}</span>
    </div>
  )
}

function ForceCard({ 
  name, 
  carrier, 
  range, 
  strength, 
  affects, 
  color,
  note 
}: { 
  name: string
  carrier: string
  range: string
  strength: string
  affects: string
  color: string
  note?: string
}) {
  const colorMap: Record<string, string> = {
    purple: 'border-purple-300 bg-purple-50',
    blue: 'border-blue-300 bg-blue-50',
    orange: 'border-orange-300 bg-orange-50',
    gray: 'border-neutral-300 bg-neutral-50',
  }
  
  return (
    <div className={`p-4 rounded-xl border ${colorMap[color]}`}>
      <div className="font-medium text-neutral-900 mb-2">{name}</div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Carrier</span>
          <span className="font-mono">{carrier}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Range</span>
          <span className="font-mono">{range}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Relative strength</span>
          <span className="font-mono">{strength}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Affects</span>
          <span className="text-neutral-700">{affects}</span>
        </div>
      </div>
      {note && (
        <div className="mt-2 text-xs text-neutral-500 italic">{note}</div>
      )}
    </div>
  )
}

function formatCharge(charge: number | string): string {
  if (charge === 0) return '0'
  if (charge === 1) return '+1'
  if (charge === -1) return '−1'
  if (charge === 2/3) return '+⅔'
  if (charge === -2/3) return '−⅔'
  if (charge === 1/3) return '+⅓'
  if (charge === -1/3) return '−⅓'
  return String(charge)
}