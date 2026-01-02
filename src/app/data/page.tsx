'use client'

import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { DataIcon } from '@/components/icons'

// ============================================================================
// KEY NUMBERS - Fundamental constants and counts (VitalSign style)
// ============================================================================

const keyNumbers = [
  // Row 1 -Fundamental physics
  { value: '299,792,458', label: 'Speed of light (m/s)', href: '/data/fabric/constants' },
  { value: '13.787 Bn', label: 'Age of universe (years)', href: '/data/fabric/cosmology' },
  { value: '1.616×10⁻³⁵', label: 'Planck length (m)', href: '/data/fabric/scale' },
  { value: '2.725', label: 'CMB temperature (K)', href: '/data/fabric/cosmology' },

  // Row 2 -Constants & matter
  { value: '1/137.036', label: 'Fine structure constant', href: '/data/fabric/constants' },
  { value: '6.674×10⁻¹¹', label: 'Gravitational constant', href: '/data/fabric/constants' },
  { value: '118', label: 'Elements', href: '/data/elements' },
  { value: '3,352', label: 'Known nuclides', href: '/data/elements/nuclides' },

  // Row 3 -Chemistry & life
  { value: '6.022×10²³', label: 'Avogadro\'s number', href: '/data/fabric/constants' },
  { value: '~8.7 M', label: 'Estimated species', href: '/data/life' },
  { value: '3.2 Bn', label: 'Human genome (base pairs)', href: '/data/life/genome' },
  { value: '4.543 Bn', label: 'Earth\'s age (years)', href: '/data/earth/timescale' },

  // Row 4 -The cosmos
  { value: '~2 T', label: 'Observable galaxies', href: '/data/cosmos/galaxies' },
  { value: '5,700+', label: 'Confirmed exoplanets', href: '/data/cosmos/exoplanets' },
  { value: '4.246', label: 'Light years to Proxima', href: '/data/cosmos/stars' },
  { value: '93 Bn', label: 'Observable universe diameter (ly)', href: '/data/fabric/scale' },
]

// ============================================================================
// DATA CATEGORIES
// ============================================================================

interface DataItem {
  title: string
  href: string
  status: 'ready' | 'coming-soon'
  description?: string
}

interface Category {
  id: string
  title: string
  description: string
  href: string
  items: DataItem[]
  comingSoon?: boolean
}

const categories: Category[] = [
  {
    id: 'fabric',
    title: 'The Fabric',
    description: 'What reality is woven from -particles, forces, constants, and the structure of the universe.',
    href: '/data/fabric',
    items: [
      { title: 'Standard Model', href: '/data/fabric/particles', status: 'ready', description: 'The particles of matter' },
      { title: 'Fundamental Forces', href: '/data/fabric/forces', status: 'ready', description: 'The four forces' },
      { title: 'Fundamental Constants', href: '/data/fabric/constants', status: 'ready', description: 'The numbers reality runs on' },
      { title: 'EM Spectrum', href: '/data/fabric/spectrum', status: 'ready', description: 'Radio waves to gamma rays' },
      { title: 'Scale of the Universe', href: '/data/fabric/scale', status: 'coming-soon', description: 'Powers of 10, quarks to cosmos' },
      { title: 'Permissible Universe', href: '/data/fabric/permissible-universe', status: 'ready', description: 'Mass-radius diagram of everything' },
      { title: 'Big Bang & Cosmology', href: '/data/fabric/cosmology', status: 'coming-soon', description: 'Origin and structure of the universe' },
    ],
  },
  {
    id: 'elements',
    title: 'Elements',
    description: 'Chemistry and matter -elements, isotopes, molecules, materials, and how things are made.',
    href: '/data/elements',
    items: [
      { title: 'Periodic Table', href: '/data/elements/periodic-table', status: 'coming-soon', description: 'The 118 elements' },
      { title: 'Chart of Nuclides', href: '/data/elements/nuclides', status: 'ready', description: 'Every known isotope' },
      { title: 'Molecules', href: '/data/elements/molecules', status: 'coming-soon', description: 'Common molecular structures' },
      { title: 'Materials', href: '/data/elements/materials', status: 'coming-soon', description: 'Steel, concrete, polymers, and more' },
      { title: 'Crystal Systems', href: '/data/elements/crystals', status: 'coming-soon', description: 'The 7 crystal systems' },
      { title: 'Chemical Bonds', href: '/data/elements/bonds', status: 'coming-soon', description: 'How atoms connect' },
      { title: 'Engineering', href: '/data/elements/engineering', status: 'coming-soon', description: 'Structures, systems, technologies' },
    ],
  },
  {
    id: 'life',
    title: 'Life',
    description: 'Living systems -from genetic code to ecosystems, metabolism to species.',
    href: '/data/life',
    items: [
      { title: 'Genetic Code', href: '/data/life/genetic-code', status: 'coming-soon', description: 'Codons and amino acids' },
      { title: 'Genome Explorer', href: '/data/life/genome', status: 'coming-soon', description: 'Chromosomes, genes, and variants' },
      { title: 'Metabolic Pathways', href: '/data/life/metabolism', status: 'coming-soon', description: 'Glycolysis, Krebs cycle, and more' },
      { title: 'Tree of Life', href: '/data/life/tree-of-life', status: 'coming-soon', description: 'Phylogenetic relationships' },
      { title: 'Bestiary', href: '/data/life/bestiary', status: 'coming-soon', description: 'Species database' },
      { title: 'Anatomical Systems', href: '/data/life/anatomy', status: 'coming-soon', description: 'Human body systems' },
      { title: 'Proteins', href: '/data/life/proteins', status: 'coming-soon', description: '3D protein structures' },
    ],
  },
  {
    id: 'earth',
    title: 'Earth',
    description: 'Our planet -geology, climate, tectonics, and the systems that shape it.',
    href: '/data/earth',
    items: [
      { title: 'Climate Data Centre', href: '/data/earth/climate', status: 'ready', description: '38 climate datasets' },
      { title: 'Geological Timescale', href: '/data/earth/timescale', status: 'coming-soon', description: '4.5 billion years of history' },
      { title: 'Extraction Map', href: '/data/earth/extraction', status: 'ready', description: 'Where we mine the earth' },
      { title: 'Tectonic Plates', href: '/data/earth/tectonics', status: 'coming-soon', description: 'Plate boundaries and motion' },
      { title: 'Atmosphere', href: '/data/earth/atmosphere', status: 'coming-soon', description: 'Layers of air' },
      { title: 'Oceans', href: '/data/earth/oceans', status: 'coming-soon', description: 'Zones, currents, and chemistry' },
    ],
  },
  {
    id: 'cosmos',
    title: 'The Cosmos',
    description: 'Everything beyond Earth -the Solar System, stars, galaxies, and the distant universe.',
    href: '/data/cosmos',
    items: [
      { title: 'Solar System', href: '/data/cosmos/solar-system', status: 'ready', description: 'The Sun, planets, and moons' },
      { title: 'Stellar Classification', href: '/data/cosmos/stars', status: 'coming-soon', description: 'OBAFGKM and the HR diagram' },
      { title: 'Constellations', href: '/data/cosmos/constellations', status: 'coming-soon', description: 'All 88 official constellations' },
      { title: 'Messier Objects', href: '/data/cosmos/messier', status: 'coming-soon', description: '110 deep-sky objects' },
      { title: 'Galaxies', href: '/data/cosmos/galaxies', status: 'coming-soon', description: 'Types, Local Group, and beyond' },
      { title: 'Exoplanets', href: '/data/cosmos/exoplanets', status: 'coming-soon', description: 'Worlds around other stars' },
    ],
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'Abstract structures -numbers, geometry, equations, and topology.',
    href: '/data/mathematics',
    items: [
      { title: 'Number Sequences', href: '/data/mathematics/sequences', status: 'coming-soon', description: 'Primes, Fibonacci, and more' },
      { title: 'Geometry', href: '/data/mathematics/geometry', status: 'coming-soon', description: 'Platonic solids and tessellations' },
      { title: 'Famous Equations', href: '/data/mathematics/equations', status: 'coming-soon', description: 'The equations that changed everything' },
      { title: 'Topology', href: '/data/mathematics/topology', status: 'coming-soon', description: 'Surfaces, manifolds, and knots' },
    ],
  },
  {
    id: 'society',
    title: 'Society',
    description: 'Human systems -psychology, anthropology, linguistics, and economics.',
    href: '/data/society',
    comingSoon: true,
    items: [
      { title: 'Psychology', href: '/data/society/psychology', status: 'coming-soon', description: 'Mind and behaviour' },
      { title: 'Anthropology', href: '/data/society/anthropology', status: 'coming-soon', description: 'Human cultures and evolution' },
      { title: 'Linguistics', href: '/data/society/linguistics', status: 'coming-soon', description: 'Language structures' },
      { title: 'Economics', href: '/data/society/economics', status: 'coming-soon', description: 'Systems of exchange' },
    ],
  },
]

// Count ready vs coming soon
const stats = categories.reduce(
  (acc, cat) => {
    cat.items.forEach((item) => {
      if (item.status === 'ready') acc.ready++
      else acc.comingSoon++
    })
    return acc
  },
  { ready: 0, comingSoon: 0 }
)

export default function DataPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="block bg-white rounded-lg py-1 md:py-2 px-2 md:px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Data' },
              ]}
              theme="light"
            />
          </div>
        </div>

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <DataIcon className="text-black mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase mb-3">
              Data
            </h1>
            <p className="text-base md:text-lg text-black/60 max-w-2xl">
              Reference datasets, interactive visualisations, and encyclopaedic coverage.
              The raw material of science, presented properly.
            </p>
            <p className="text-sm text-black/40 mt-2">
              {stats.ready} datasets ready · {stats.comingSoon} coming soon
            </p>
          </section>

          {/* Key Numbers Frame - VitalSign style */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-6">
              Key Numbers
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              {keyNumbers.map((num) => (
                <Link
                  key={num.href + num.value}
                  href={num.href}
                  className="block p-2 md:p-4 text-left bg-black rounded-lg hover:bg-neutral-900 transition-colors"
                >
                  <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1 md:mb-2">
                    {num.label}
                  </div>
                  <div className="text-lg md:text-3xl lg:text-4xl font-bold tracking-[-0.03em] tabular-nums text-white">
                    {num.value}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Categories - Each category gets its own frame */}
          {categories.map((category) => (
            <section
              key={category.id}
              id={category.id}
              className={`bg-white rounded-lg p-2 md:p-4 ${category.comingSoon ? 'opacity-50' : ''}`}
            >
              {/* Category Header - Links to section landing page */}
              <div className="mb-4 md:mb-6">
                <div className="flex items-center gap-3 mb-2">
                  {category.comingSoon ? (
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-black/50 uppercase">
                      {category.title}
                    </h2>
                  ) : (
                    <Link
                      href={category.href}
                      className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase hover:text-black/70 transition-colors"
                    >
                      {category.title}
                    </Link>
                  )}
                  {category.comingSoon && (
                    <span className="text-xs text-black/30 uppercase">Coming Soon</span>
                  )}
                </div>
                <p className="text-sm text-black/50">
                  {category.description}
                </p>
              </div>

              {/* Items Grid - PortalCard style */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
                {category.items.map((item) => (
                  <DataCard key={item.href} item={item} />
                ))}
              </div>
            </section>
          ))}

          {/* Footer Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <p className="text-sm text-black/50 max-w-2xl">
              Everything connects. Elements link to where they're mined, which links to
              when those deposits formed, which links to the geological timescale, which
              links to what was alive. Follow the threads.
            </p>
          </section>

        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}

// ============================================================================
// Data Card Component - PortalCard style (black frame on white background)
// ============================================================================

function DataCard({ item }: { item: DataItem }) {
  const isReady = item.status === 'ready'

  if (isReady) {
    return (
      <Link
        href={item.href}
        className="block p-2 md:p-4 bg-black rounded-lg border border-white/10 hover:border-white/30 transition-colors"
      >
        <h3 className="text-2xl md:text-3xl font-light text-white uppercase mb-2">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-sm text-white/50">{item.description}</p>
        )}
      </Link>
    )
  }

  // Coming soon - muted black frame
  return (
    <div className="p-2 md:p-4 bg-black/50 rounded-lg">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-2xl md:text-3xl font-light text-white/40 uppercase">
          {item.title}
        </h3>
        <span className="flex-shrink-0 text-xs text-white/30 uppercase mt-2">Soon</span>
      </div>
      {item.description && (
        <p className="text-sm text-white/30">{item.description}</p>
      )}
    </div>
  )
}
