'use client'

import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'

// ============================================================================
// DATA SECTION - 6 CATEGORIES
// ============================================================================
// 1. THE COSMOS - Universe at every scale (merged Universe + Astronomy basics)
// 2. MATTER - Elements, isotopes, molecules, materials
// 3. LIFE - Biology, genetics, species
// 4. EARTH - Our planet's systems
// 5. MATHEMATICS - Pure math
// 6. DEEP SKY - Beyond the Solar System
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
  items: DataItem[]
}

const categories: Category[] = [
  {
    id: 'cosmos',
    title: 'The Cosmos',
    description: 'The universe at every scale - from fundamental constants to the solar system.',
    items: [
      { title: 'Solar System', href: '/data/solar-system', status: 'ready', description: 'The Sun, eight planets, and everything in between' },
      { title: 'Scale of the Universe', href: '/data/scale', status: 'coming-soon', description: 'Powers of 10, from quarks to cosmos' },
      { title: 'Fundamental Constants', href: '/data/constants', status: 'ready', description: 'The numbers the universe is built on' },
      { title: 'EM Spectrum', href: '/data/spectrum', status: 'ready', description: 'Radio waves to gamma rays' },
      { title: 'Permissible Universe', href: '/data/permissible-universe', status: 'ready', description: 'Mass-radius diagram of everything' },
      { title: 'Standard Model', href: '/data/particles', status: 'ready', description: 'The particles of matter' },
    ],
  },
  {
    id: 'matter',
    title: 'Matter',
    description: 'What everything is made of - elements, isotopes, molecules, and materials.',
    items: [
      { title: 'Periodic Table', href: '/data/elements', status: 'coming-soon', description: 'The 118 elements' },
      { title: 'Chart of Nuclides', href: '/data/nuclides', status: 'ready', description: 'Every known isotope' },
      { title: 'Crystal Systems', href: '/data/crystals', status: 'coming-soon', description: 'The 7 crystal systems and 14 Bravais lattices' },
      { title: 'Chemical Bonds', href: '/data/bonds', status: 'coming-soon', description: 'How atoms connect' },
      { title: 'Molecules', href: '/data/molecules', status: 'coming-soon', description: 'Common molecular structures' },
      { title: 'Materials', href: '/data/materials', status: 'coming-soon', description: 'Steel, concrete, polymers, and more' },
    ],
  },
  {
    id: 'life',
    title: 'Life',
    description: 'Biology from molecules to ecosystems - genetics, metabolism, and species.',
    items: [
      { title: 'Genetic Code', href: '/data/genetic-code', status: 'coming-soon', description: 'Codons and amino acids' },
      { title: 'Genome Explorer', href: '/data/genome', status: 'coming-soon', description: 'Chromosomes, genes, and variants' },
      { title: 'Metabolic Pathways', href: '/data/metabolism', status: 'coming-soon', description: 'Glycolysis, Krebs cycle, and more' },
      { title: 'Tree of Life', href: '/data/tree-of-life', status: 'coming-soon', description: 'Phylogenetic relationships' },
      { title: 'Bestiary', href: '/data/bestiary', status: 'coming-soon', description: 'Species database' },
      { title: 'Anatomical Systems', href: '/data/anatomy', status: 'coming-soon', description: 'Human body systems' },
      { title: 'Proteins', href: '/data/proteins', status: 'coming-soon', description: '3D protein structures' },
    ],
  },
  {
    id: 'earth',
    title: 'Earth',
    description: 'Our planet - climate, geology, tectonics, and the systems that shape it.',
    items: [
      { title: 'Climate Data Centre', href: '/data/climate', status: 'ready', description: '38 climate datasets' },
      { title: 'Unrest', href: '/data/unrest', status: 'ready', description: 'Earthquakes, volcanoes, and storms' },
      { title: 'Geological Timescale', href: '/data/time', status: 'coming-soon', description: '4.5 billion years of Earth history' },
      { title: 'Extraction Map', href: '/data/extraction', status: 'ready', description: 'Where we mine the earth' },
      { title: 'Tectonic Plates', href: '/data/tectonics', status: 'coming-soon', description: 'Plate boundaries and motion' },
      { title: 'Atmosphere', href: '/data/atmosphere', status: 'coming-soon', description: 'Layers of air' },
      { title: 'Oceans', href: '/data/oceans', status: 'coming-soon', description: 'Zones, currents, and chemistry' },
    ],
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'Pure mathematics - numbers, geometry, equations, and topology.',
    items: [
      { title: 'Number Sequences', href: '/data/sequences', status: 'coming-soon', description: 'Primes, Fibonacci, and more' },
      { title: 'Geometry', href: '/data/geometry', status: 'coming-soon', description: 'Platonic solids and tessellations' },
      { title: 'Famous Equations', href: '/data/equations', status: 'coming-soon', description: 'The equations that changed everything' },
      { title: 'Topology', href: '/data/topology', status: 'coming-soon', description: 'Surfaces, manifolds, and knots' },
    ],
  },
  {
    id: 'deep-sky',
    title: 'Deep Sky',
    description: 'Beyond the Solar System - stars, galaxies, and the distant universe.',
    items: [
      { title: 'Constellations', href: '/data/constellations', status: 'coming-soon', description: 'All 88 official constellations' },
      { title: 'Messier Objects', href: '/data/messier', status: 'coming-soon', description: '110 deep-sky objects' },
      { title: 'Stellar Classification', href: '/data/stars', status: 'coming-soon', description: 'OBAFGKM and the HR diagram' },
      { title: 'Galaxies', href: '/data/galaxies', status: 'coming-soon', description: 'Types, Local Group, and beyond' },
      { title: 'Exoplanets', href: '/data/exoplanets', status: 'coming-soon', description: 'Worlds around other stars' },
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
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Data' },
            ]}
            theme="light"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Data
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            Reference datasets, interactive visualizations, and tools. The raw material
            of science, presented properly.
          </p>
          <p className="text-sm text-black/40 mt-2">
            {stats.ready} ready · {stats.comingSoon} coming soon
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12 md:space-y-16">
          {categories.map((category) => (
            <section key={category.id} id={category.id}>
              {/* Category Header */}
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-light text-black mb-1">
                  {category.title}
                </h2>
                <p className="text-sm text-black/50">
                  {category.description}
                </p>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {category.items.map((item) => (
                  <DataCard key={item.href} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-black/10">
          <p className="text-sm text-black/40 max-w-2xl">
            Everything connects. Elements link to where they're mined, which links to
            when those deposits formed, which links to the geological timescale, which
            links to what was alive. Follow the threads.
          </p>
        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}

// ============================================================================
// Data Card Component
// ============================================================================

function DataCard({ item }: { item: DataItem }) {
  const isReady = item.status === 'ready'

  if (isReady) {
    return (
      <Link
        href={item.href}
        className="block p-4 md:p-5 bg-white rounded-xl border border-transparent hover:border-black transition-colors group"
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-medium text-black group-hover:text-[#e6007e] transition-colors">
            {item.title}
          </h3>
          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-1.5" />
        </div>
        {item.description && (
          <p className="text-sm text-black/50">{item.description}</p>
        )}
      </Link>
    )
  }

  return (
    <div className="p-4 md:p-5 bg-[#e5e5e5] rounded-xl">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="text-base font-medium text-black/40">{item.title}</h3>
        <span className="flex-shrink-0 text-xs text-black/30 mt-0.5">Soon</span>
      </div>
      {item.description && (
        <p className="text-sm text-black/30">{item.description}</p>
      )}
    </div>
  )
}
