'use client';

import { useState } from 'react';
import Link from 'next/link';

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-white/30">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-white/50 hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// SI Base Units
const SI_BASE_UNITS = [
  { quantity: 'Length', unit: 'metre', symbol: 'm', definition: 'Distance light travels in 1/299,792,458 of a second' },
  { quantity: 'Mass', unit: 'kilogram', symbol: 'kg', definition: 'Defined by the Planck constant h = 6.62607015×10⁻³⁴ J·s' },
  { quantity: 'Time', unit: 'second', symbol: 's', definition: '9,192,631,770 periods of caesium-133 radiation' },
  { quantity: 'Electric current', unit: 'ampere', symbol: 'A', definition: 'Flow of 1/(1.602176634×10⁻¹⁹) elementary charges per second' },
  { quantity: 'Temperature', unit: 'kelvin', symbol: 'K', definition: 'Defined by the Boltzmann constant k = 1.380649×10⁻²³ J/K' },
  { quantity: 'Amount of substance', unit: 'mole', symbol: 'mol', definition: "Exactly 6.02214076×10²³ entities (Avogadro's number)" },
  { quantity: 'Luminous intensity', unit: 'candela', symbol: 'cd', definition: 'Luminous efficacy of 540 THz radiation is 683 lm/W' },
];

// SI Prefixes
const SI_PREFIXES = [
  { prefix: 'quetta', symbol: 'Q', factor: '10³⁰', example: '1 Qm = 10³⁰ metres' },
  { prefix: 'ronna', symbol: 'R', factor: '10²⁷', example: '1 Rm = 10²⁷ metres' },
  { prefix: 'yotta', symbol: 'Y', factor: '10²⁴', example: '1 Ym ≈ 106 light-years' },
  { prefix: 'zetta', symbol: 'Z', factor: '10²¹', example: '1 ZB = 1 trillion gigabytes' },
  { prefix: 'exa', symbol: 'E', factor: '10¹⁸', example: "Earth's mass ≈ 6 Eg" },
  { prefix: 'peta', symbol: 'P', factor: '10¹⁵', example: '1 PHz = 1000 THz' },
  { prefix: 'tera', symbol: 'T', factor: '10¹²', example: '1 TB = 1000 GB' },
  { prefix: 'giga', symbol: 'G', factor: '10⁹', example: '1 GHz = 1 billion Hz' },
  { prefix: 'mega', symbol: 'M', factor: '10⁶', example: '1 MW = 1 million watts' },
  { prefix: 'kilo', symbol: 'k', factor: '10³', example: '1 km = 1000 m' },
  { prefix: 'hecto', symbol: 'h', factor: '10²', example: '1 hPa (hectopascal)' },
  { prefix: 'deca', symbol: 'da', factor: '10¹', example: '1 dag = 10 g' },
  { prefix: '—', symbol: '—', factor: '10⁰', example: 'base unit' },
  { prefix: 'deci', symbol: 'd', factor: '10⁻¹', example: '1 dL = 0.1 L' },
  { prefix: 'centi', symbol: 'c', factor: '10⁻²', example: '1 cm = 0.01 m' },
  { prefix: 'milli', symbol: 'm', factor: '10⁻³', example: '1 mm = 0.001 m' },
  { prefix: 'micro', symbol: 'μ', factor: '10⁻⁶', example: '1 μm = 1 micron' },
  { prefix: 'nano', symbol: 'n', factor: '10⁻⁹', example: '1 nm ≈ 10 atoms wide' },
  { prefix: 'pico', symbol: 'p', factor: '10⁻¹²', example: '1 pF (picofarad)' },
  { prefix: 'femto', symbol: 'f', factor: '10⁻¹⁵', example: '1 fm ≈ proton radius' },
  { prefix: 'atto', symbol: 'a', factor: '10⁻¹⁸', example: '1 as (attosecond)' },
  { prefix: 'zepto', symbol: 'z', factor: '10⁻²¹', example: '1 zm' },
  { prefix: 'yocto', symbol: 'y', factor: '10⁻²⁴', example: '1 ym' },
  { prefix: 'ronto', symbol: 'r', factor: '10⁻²⁷', example: '1 rm' },
  { prefix: 'quecto', symbol: 'q', factor: '10⁻³⁰', example: '1 qm' },
];

// Particle Physics Units
const PARTICLE_UNITS = [
  {
    unit: 'electronvolt',
    symbol: 'eV',
    definition: 'Energy gained by an electron accelerated through 1 volt',
    value: '1.602×10⁻¹⁹ joules',
    usage: 'Photon energies, atomic physics'
  },
  {
    unit: 'kiloelectronvolt',
    symbol: 'keV',
    definition: '1,000 electronvolts',
    value: '1.602×10⁻¹⁶ joules',
    usage: 'X-rays, nuclear physics'
  },
  {
    unit: 'megaelectronvolt',
    symbol: 'MeV',
    definition: '1,000,000 electronvolts',
    value: '1.602×10⁻¹³ joules',
    usage: 'Nuclear reactions, light particles'
  },
  {
    unit: 'gigaelectronvolt',
    symbol: 'GeV',
    definition: '1,000,000,000 electronvolts',
    value: '1.602×10⁻¹⁰ joules',
    usage: 'Protons, heavy particles, Higgs'
  },
  {
    unit: 'teraelectronvolt',
    symbol: 'TeV',
    definition: '1,000,000,000,000 electronvolts',
    value: '1.602×10⁻⁷ joules',
    usage: 'LHC collision energies'
  },
];

// Natural Units explanation
const NATURAL_UNITS = [
  { quantity: 'Speed', convention: 'c = 1', meaning: 'Speeds measured as fractions of light speed' },
  { quantity: 'Action', convention: 'ℏ = 1', meaning: 'Quantum of angular momentum = 1' },
  { quantity: 'Energy', convention: 'eV, MeV, GeV', meaning: 'Everything in electronvolts' },
  { quantity: 'Mass', convention: 'eV/c²', meaning: 'E = mc² means mass and energy are equivalent' },
  { quantity: 'Length', convention: 'ℏc/eV', meaning: '1 GeV⁻¹ ≈ 0.2 femtometres' },
  { quantity: 'Time', convention: 'ℏ/eV', meaning: '1 GeV⁻¹ ≈ 6.6×10⁻²⁵ seconds' },
];

// Astronomical Units
const ASTRO_UNITS = [
  {
    unit: 'Astronomical Unit',
    symbol: 'AU',
    value: '149,597,870.7 km',
    definition: 'Mean Earth-Sun distance',
    usage: 'Solar System distances'
  },
  {
    unit: 'Light-year',
    symbol: 'ly',
    value: '9.461×10¹² km',
    definition: 'Distance light travels in one year',
    usage: 'Stellar distances'
  },
  {
    unit: 'Parsec',
    symbol: 'pc',
    value: '3.086×10¹³ km (3.26 ly)',
    definition: 'Distance at which 1 AU subtends 1 arcsecond',
    usage: 'Stellar and galactic distances'
  },
  {
    unit: 'Solar mass',
    symbol: 'M☉',
    value: '1.989×10³⁰ kg',
    definition: 'Mass of our Sun',
    usage: 'Stellar and black hole masses'
  },
  {
    unit: 'Solar luminosity',
    symbol: 'L☉',
    value: '3.828×10²⁶ W',
    definition: 'Total power output of our Sun',
    usage: 'Stellar brightness'
  },
  {
    unit: 'Earth mass',
    symbol: 'M⊕',
    value: '5.972×10²⁴ kg',
    definition: 'Mass of Earth',
    usage: 'Planetary masses'
  },
];

// Common Derived Units
const DERIVED_UNITS = [
  { quantity: 'Force', unit: 'newton', symbol: 'N', equivalent: 'kg·m/s²' },
  { quantity: 'Energy', unit: 'joule', symbol: 'J', equivalent: 'kg·m²/s² = N·m' },
  { quantity: 'Power', unit: 'watt', symbol: 'W', equivalent: 'J/s = kg·m²/s³' },
  { quantity: 'Pressure', unit: 'pascal', symbol: 'Pa', equivalent: 'N/m² = kg/(m·s²)' },
  { quantity: 'Electric charge', unit: 'coulomb', symbol: 'C', equivalent: 'A·s' },
  { quantity: 'Voltage', unit: 'volt', symbol: 'V', equivalent: 'W/A = J/C' },
  { quantity: 'Resistance', unit: 'ohm', symbol: 'Ω', equivalent: 'V/A' },
  { quantity: 'Capacitance', unit: 'farad', symbol: 'F', equivalent: 'C/V' },
  { quantity: 'Magnetic flux', unit: 'weber', symbol: 'Wb', equivalent: 'V·s' },
  { quantity: 'Magnetic field', unit: 'tesla', symbol: 'T', equivalent: 'Wb/m² = kg/(A·s²)' },
  { quantity: 'Frequency', unit: 'hertz', symbol: 'Hz', equivalent: 's⁻¹' },
  { quantity: 'Radioactivity', unit: 'becquerel', symbol: 'Bq', equivalent: 's⁻¹ (decays/second)' },
  { quantity: 'Absorbed dose', unit: 'gray', symbol: 'Gy', equivalent: 'J/kg' },
  { quantity: 'Equivalent dose', unit: 'sievert', symbol: 'Sv', equivalent: 'J/kg (weighted)' },
];

// Section component
function UnitSection({
  id,
  title,
  description,
  children
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="space-y-px scroll-mt-20">
      <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
        <h2 className="text-xl md:text-2xl font-light text-white uppercase">{title}</h2>
        {description && <p className="text-xs md:text-sm text-white/50 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function UnitsPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb */}
        <div className="mb-px">
          <div className="bg-[#1d1d1d] rounded-lg py-1 md:py-2 px-2 md:px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Data', href: '/data' },
                { label: 'Units & Measurement' },
              ]}
            />
          </div>
        </div>

        {/* Header */}
        <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4 mb-px">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light text-white uppercase">
            Units & Measurement
          </h1>
          <p className="text-xs md:text-base text-white/60 mt-2 max-w-2xl">
            The language of quantitative science. From the seven SI base units to the specialised
            conventions of particle physics and astronomy — how we measure the universe.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4 mb-px">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Jump to</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'si-base', label: 'SI Base Units' },
              { id: 'si-prefixes', label: 'SI Prefixes' },
              { id: 'derived', label: 'Derived Units' },
              { id: 'particle', label: 'Particle Physics' },
              { id: 'natural', label: 'Natural Units' },
              { id: 'astronomical', label: 'Astronomical' },
            ].map((nav) => (
              <a
                key={nav.id}
                href={`#${nav.id}`}
                className="px-2 md:px-3 py-1 md:py-1.5 text-xs bg-white/10 text-white/60 rounded-lg hover:bg-white/15 hover:text-white transition-colors"
              >
                {nav.label}
              </a>
            ))}
          </div>
        </div>

        {/* SI Base Units */}
        <UnitSection
          id="si-base"
          title="SI Base Units"
          description="The seven fundamental units from which all other SI units are derived. Redefined in 2019 to be based on fundamental constants."
        >
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="space-y-px">
              {SI_BASE_UNITS.map((u) => (
                <div key={u.symbol} className="bg-black/30 rounded-lg p-2 md:p-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className="w-full md:w-32 flex-shrink-0">
                    <div className="text-xs text-white/40">{u.quantity}</div>
                    <div className="text-white font-medium">{u.unit}</div>
                  </div>
                  <div className="w-12 flex-shrink-0">
                    <span className="font-mono text-lg text-amber-400">{u.symbol}</span>
                  </div>
                  <div className="flex-1 text-xs text-white/60">{u.definition}</div>
                </div>
              ))}
            </div>
          </div>
        </UnitSection>

        {/* SI Prefixes */}
        <UnitSection
          id="si-prefixes"
          title="SI Prefixes"
          description="Powers of 10 from quetta (10³⁰) to quecto (10⁻³⁰). The newest prefixes (ronna, quetta, ronto, quecto) were added in 2022."
        >
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {SI_PREFIXES.map((p) => (
                <div
                  key={p.prefix}
                  className={`bg-black/30 rounded-lg p-2 md:p-3 flex items-center gap-3 ${p.prefix === '—' ? 'md:col-span-2 bg-white/5' : ''}`}
                >
                  <div className="w-16 flex-shrink-0">
                    <span className="font-mono text-sm text-amber-400">{p.symbol}</span>
                  </div>
                  <div className="w-20 flex-shrink-0 text-sm text-white">{p.prefix}</div>
                  <div className="w-16 flex-shrink-0 font-mono text-xs text-white/60">{p.factor}</div>
                  <div className="flex-1 text-xs text-white/40 hidden md:block">{p.example}</div>
                </div>
              ))}
            </div>
          </div>
        </UnitSection>

        {/* Derived Units */}
        <UnitSection
          id="derived"
          title="Derived SI Units"
          description="Units built from combinations of base units, given special names for convenience."
        >
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {DERIVED_UNITS.map((u) => (
                <div key={u.symbol} className="bg-black/30 rounded-lg p-2 md:p-3 flex items-center gap-3">
                  <div className="w-24 flex-shrink-0">
                    <div className="text-xs text-white/40">{u.quantity}</div>
                    <div className="text-sm text-white">{u.unit}</div>
                  </div>
                  <div className="w-12 flex-shrink-0">
                    <span className="font-mono text-lg text-amber-400">{u.symbol}</span>
                  </div>
                  <div className="flex-1 font-mono text-xs text-white/50">{u.equivalent}</div>
                </div>
              ))}
            </div>
          </div>
        </UnitSection>

        {/* Particle Physics Units */}
        <UnitSection
          id="particle"
          title="Particle Physics Units"
          description="Why do physicists measure mass in GeV instead of kilograms?"
        >
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="bg-black/30 rounded-lg p-3 md:p-4 mb-4">
              <h3 className="text-sm font-medium text-white mb-2">Why GeV instead of kilograms?</h3>
              <p className="text-xs text-white/60 mb-3">
                Einstein's famous equation E = mc² tells us that mass and energy are equivalent.
                In particle physics, it's more convenient to express everything in energy units because:
              </p>
              <ul className="text-xs text-white/50 space-y-1 ml-4 list-disc">
                <li>Particle masses in kg are tiny and awkward (proton: 1.67×10⁻²⁷ kg)</li>
                <li>Accelerators measure collision energy directly in electronvolts</li>
                <li>Conservation laws are cleaner when mass-energy is unified</li>
                <li>The speed of light c becomes 1 (dimensionless)</li>
              </ul>
              <p className="text-xs text-white/60 mt-3">
                <span className="text-amber-400">Example:</span> The proton mass is 938.3 MeV/c².
                Since c = 1 in natural units, we just say "938 MeV".
              </p>
            </div>

            <div className="space-y-px">
              {PARTICLE_UNITS.map((u) => (
                <div key={u.symbol} className="bg-black/30 rounded-lg p-2 md:p-3">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="font-mono text-lg text-amber-400 w-12">{u.symbol}</span>
                    <div>
                      <div className="text-sm text-white">{u.unit}</div>
                      <div className="text-xs text-white/50">{u.definition}</div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs ml-12">
                    <span className="text-white/40">= {u.value}</span>
                    <span className="text-white/30">Used for: {u.usage}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-black/30 rounded-lg p-3 md:p-4 mt-4">
              <h3 className="text-sm font-medium text-white mb-2">Quick conversions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="text-white/60">
                  <span className="text-amber-400">Electron:</span> 0.511 MeV = 9.11×10⁻³¹ kg
                </div>
                <div className="text-white/60">
                  <span className="text-amber-400">Proton:</span> 938.3 MeV = 1.67×10⁻²⁷ kg
                </div>
                <div className="text-white/60">
                  <span className="text-amber-400">Higgs:</span> 125 GeV = 2.23×10⁻²⁵ kg
                </div>
                <div className="text-white/60">
                  <span className="text-amber-400">Top quark:</span> 173 GeV = 3.08×10⁻²⁵ kg
                </div>
              </div>
            </div>
          </div>
        </UnitSection>

        {/* Natural Units */}
        <UnitSection
          id="natural"
          title="Natural Units"
          description="Setting fundamental constants to 1 simplifies equations and reveals the underlying physics."
        >
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="bg-black/30 rounded-lg p-3 md:p-4 mb-4">
              <p className="text-xs text-white/60">
                In natural units, we set c = ℏ = 1. This isn't just laziness — it reveals that
                these constants are conversion factors between human-scale units, not fundamental
                properties of nature. The speed of light is just "1" because it's the natural
                speed limit of the universe.
              </p>
            </div>

            <div className="space-y-px">
              {NATURAL_UNITS.map((u) => (
                <div key={u.quantity} className="bg-black/30 rounded-lg p-2 md:p-3 flex flex-col md:flex-row md:items-center gap-2">
                  <div className="w-24 flex-shrink-0 text-sm text-white">{u.quantity}</div>
                  <div className="w-24 flex-shrink-0 font-mono text-amber-400">{u.convention}</div>
                  <div className="flex-1 text-xs text-white/50">{u.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        </UnitSection>

        {/* Astronomical Units */}
        <UnitSection
          id="astronomical"
          title="Astronomical Units"
          description="At cosmic scales, metres become impractical. Astronomers use units tied to familiar objects: Earth, Sun, light."
        >
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="space-y-px">
              {ASTRO_UNITS.map((u) => (
                <div key={u.symbol} className="bg-black/30 rounded-lg p-2 md:p-3">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="font-mono text-lg text-amber-400 w-12">{u.symbol}</span>
                    <div>
                      <div className="text-sm text-white">{u.unit}</div>
                      <div className="text-xs text-white/50">{u.definition}</div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-xs ml-12">
                    <span className="font-mono text-white/60">= {u.value}</span>
                    <span className="text-white/30">Used for: {u.usage}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-black/30 rounded-lg p-3 md:p-4 mt-4">
              <h3 className="text-sm font-medium text-white mb-2">Scale reference</h3>
              <div className="space-y-1 text-xs text-white/50">
                <div>Earth → Moon: 1.3 light-seconds</div>
                <div>Earth → Sun: 8.3 light-minutes = 1 AU</div>
                <div>Sun → Proxima Centauri: 4.24 light-years = 1.3 pc</div>
                <div>Milky Way diameter: ~100,000 light-years = ~31 kpc</div>
                <div>Observable universe: ~93 billion light-years</div>
              </div>
            </div>
          </div>
        </UnitSection>

        {/* Cross-References */}
        <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4 mt-px">
          <div className="text-xs md:text-sm text-white/40 uppercase tracking-wider mb-3">Related</div>
          <div className="flex flex-wrap gap-3 md:gap-4 mb-4 md:mb-6">
            <Link href="/data/fabric/constants" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
              Physical Constants →
            </Link>
            <Link href="/data/fabric/particles" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
              Standard Model →
            </Link>
            <Link href="/data/fabric/scale" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
              Scale of the Universe →
            </Link>
            <Link href="/data/cosmos/solar-system" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
              Solar System →
            </Link>
          </div>

          <div className="pt-3 md:pt-4 border-t border-white/10">
            <div className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-wider mb-2">References</div>
            <div className="text-[10px] md:text-xs text-white/40">
              BIPM (Bureau International des Poids et Mesures) · NIST · IAU · Particle Data Group
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
