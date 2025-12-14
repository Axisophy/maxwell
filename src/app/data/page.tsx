import Link from 'next/link'
import {
  // Universe
  Scaling,
  Hash,
  Waves,
  Globe2,
  Star,
  Orbit,

  // Matter
  Sparkles,
  CircleDot,
  Atom,
  Layers,
  Box,

  // Chemistry
  Link2,
  FlaskConical,
  Flame,
  Hexagon,
  ScanLine,

  // Life
  Dna,
  GitBranch,
  Activity,
  TreeDeciduous,
  Bug,
  Heart,
  Boxes,

  // Earth
  Thermometer,
  Mountain,
  Pickaxe,
  Map,
  Wind,
  Droplets,

  // Mathematics
  Pi,
  Binary,
  Triangle,
  Equal,

  // Astronomy
  Moon,
  Telescope,
  Sun,
  GalleryHorizontalEnd,

  // Engineering
  Ruler,
  Building2,
  Cpu,

  // UI
  ArrowRight,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// DATA CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════

const dataCategories = [
  // ─────────────────────────────────────────────────────────────────────────
  // THE UNIVERSE
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'universe',
    title: 'The Universe',
    description: 'The structure of reality — scales, constants, and cosmic architecture.',
    pages: [
      {
        href: '/data/permissible-universe',
        title: 'The Permissible Universe',
        description: 'Where everything fits — the mass-radius diagram of reality.',
        icon: Scaling,
        ready: true,
        featured: true,
      },
      {
        href: '/data/scale',
        title: 'Scale of the Universe',
        description: 'Powers of 10 from quarks to cosmos — 45 orders of magnitude.',
        icon: Scaling,
        ready: false,
      },
      {
        href: '/data/constants',
        title: 'Fundamental Constants',
        description: 'c, G, h, π, e, φ — the numbers reality is built on.',
        icon: Hash,
        ready: true,
      },
      {
        href: '/data/spectrum',
        title: 'EM Spectrum',
        description: 'Radio waves to gamma rays — scroll through the invisible.',
        icon: Waves,
        ready: true,
      },
      {
        href: '/data/solar-system',
        title: 'Solar System',
        description: 'Explore the Sun, planets, moons, and everything in between.',
        icon: Globe2,
        ready: false,
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MATTER
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'matter',
    title: 'Matter',
    description: 'What everything is made of — from quarks to the materials we build with.',
    pages: [
      {
        href: '/data/particles',
        title: 'Standard Model',
        description: 'Quarks, leptons, and bosons — the fundamental particles of physics.',
        icon: Sparkles,
        ready: true,
      },
      {
        href: '/data/nuclides',
        title: 'Chart of Nuclides',
        description: 'Every known isotope mapped by protons and neutrons — the valley of stability.',
        icon: CircleDot,
        ready: true,
      },
      {
        href: '/data/elements',
        title: 'Periodic Table',
        description: '118 elements with properties, discovery stories, and cosmic origins.',
        icon: Atom,
        ready: false,
      },
      {
        href: '/data/materials',
        title: 'Materials Explorer',
        description: 'Steel, concrete, graphene — what we build civilisation with and why.',
        icon: Layers,
        ready: false,
      },
      {
        href: '/data/crystals',
        title: 'Crystal Systems',
        description: 'The 14 Bravais lattices and 7 crystal systems — nature\'s geometry.',
        icon: Box,
        ready: false,
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CHEMISTRY
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'chemistry',
    title: 'Chemistry',
    description: 'How matter combines and transforms — bonds, reactions, and thermodynamics.',
    pages: [
      {
        href: '/data/bonds',
        title: 'Chemical Bonds',
        description: 'Ionic, covalent, metallic, hydrogen — how atoms connect.',
        icon: Link2,
        ready: false,
      },
      {
        href: '/data/reactions',
        title: 'Reaction Types',
        description: 'Synthesis, decomposition, combustion, redox — how matter transforms.',
        icon: FlaskConical,
        ready: false,
      },
      {
        href: '/data/thermodynamics',
        title: 'Thermodynamics',
        description: 'Activation energies, Gibbs free energy, entropy — why reactions happen.',
        icon: Flame,
        ready: false,
      },
      {
        href: '/data/molecules',
        title: 'Molecular Structures',
        description: '3D molecules you can rotate and explore.',
        icon: Hexagon,
        ready: false,
      },
      {
        href: '/data/spectroscopy',
        title: 'Spectroscopy',
        description: 'IR, NMR, mass spec — how we identify molecules by their signatures.',
        icon: ScanLine,
        ready: false,
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LIFE
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'life',
    title: 'Life',
    description: 'Biology from molecules to ecosystems — genetics, metabolism, and species.',
    pages: [
      {
        href: '/data/genetic-code',
        title: 'Genetic Code',
        description: 'Codons to amino acids — the translation table of life.',
        icon: Dna,
        ready: false,
      },
      {
        href: '/data/genome',
        title: 'Genome Explorer',
        description: 'Zoom from 23 chromosomes to individual SNPs — find the gene for red hair.',
        icon: GitBranch,
        ready: false,
      },
      {
        href: '/data/pathways',
        title: 'Metabolic Pathways',
        description: 'Glycolysis, Krebs cycle, photosynthesis — how cells process energy.',
        icon: Activity,
        ready: false,
      },
      {
        href: '/data/tree-of-life',
        title: 'Tree of Life',
        description: 'Zoomable taxonomy from domains to species — all life connected.',
        icon: TreeDeciduous,
        ready: false,
      },
      {
        href: '/data/bestiary',
        title: 'Bestiary',
        description: 'Species database linked to geological time — who lived when.',
        icon: Bug,
        ready: false,
      },
      {
        href: '/data/anatomy',
        title: 'Anatomical Systems',
        description: 'Human body from organs to cells to molecules.',
        icon: Heart,
        ready: false,
      },
      {
        href: '/data/proteins',
        title: 'Protein Structures',
        description: '3D protein folds, domains, and the shapes that make life work.',
        icon: Boxes,
        ready: false,
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EARTH
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'earth',
    title: 'Earth',
    description: 'Our planet\'s systems and resources — climate, geology, and what we extract.',
    pages: [
      {
        href: '/data/climate',
        title: 'Climate Data Centre',
        description: 'Temperature, CO₂, ice extent, sea level — 38 datasets from leading institutions.',
        icon: Thermometer,
        ready: true,
      },
      {
        href: '/data/time',
        title: 'Geological Timescale',
        description: '4.5 billion years of Earth history — eons, eras, periods, and mass extinctions.',
        icon: Mountain,
        ready: false,
      },
      {
        href: '/data/extraction',
        title: 'Extraction Map',
        description: 'Where we mine each element — from lithium to rare earths.',
        icon: Pickaxe,
        ready: true,
      },
      {
        href: '/data/tectonics',
        title: 'Tectonic Plates',
        description: 'Plate boundaries, motion vectors, and the earthquake connection.',
        icon: Map,
        ready: false,
      },
      {
        href: '/data/atmosphere',
        title: 'Atmosphere',
        description: 'Layers, composition, and pressure — from troposphere to exosphere.',
        icon: Wind,
        ready: false,
      },
      {
        href: '/data/oceans',
        title: 'Ocean Systems',
        description: 'Currents, depth zones, salinity, and ocean chemistry.',
        icon: Droplets,
        ready: false,
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MATHEMATICS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'The language of pattern and structure — constants, sequences, and geometry.',
    pages: [
      {
        href: '/data/math-constants',
        title: 'Mathematical Constants',
        description: 'π, e, φ, γ — with millions of digits and where they appear.',
        icon: Pi,
        ready: false,
      },
      {
        href: '/data/sequences',
        title: 'Number Sequences',
        description: 'Primes, Fibonacci, triangular — the patterns in numbers.',
        icon: Binary,
        ready: false,
      },
      {
        href: '/data/geometry',
        title: 'Geometry',
        description: 'Platonic solids, tessellations, symmetry groups.',
        icon: Triangle,
        ready: false,
      },
      {
        href: '/data/equations',
        title: 'Famous Equations',
        description: 'E=mc², Maxwell\'s equations, Euler\'s identity — the greatest hits.',
        icon: Equal,
        ready: false,
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ASTRONOMY
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'astronomy',
    title: 'Astronomy',
    description: 'The sky and beyond — constellations, stars, and distant galaxies.',
    pages: [
      {
        href: '/data/constellations',
        title: 'Constellations',
        description: '88 official constellations with stories, stars, and seasonal visibility.',
        icon: Star,
        ready: false,
      },
      {
        href: '/data/messier',
        title: 'Messier Objects',
        description: 'The 110 famous deep-sky objects — galaxies, nebulae, and clusters.',
        icon: GalleryHorizontalEnd,
        ready: false,
      },
      {
        href: '/data/stellar-types',
        title: 'Stellar Classification',
        description: 'O B A F G K M — the spectral sequence and HR diagram.',
        icon: Sun,
        ready: false,
      },
      {
        href: '/data/galaxies',
        title: 'Galaxies',
        description: 'Spirals, ellipticals, irregulars — from the Local Group to the cosmic web.',
        icon: Orbit,
        ready: false,
      },
      {
        href: '/data/exoplanets',
        title: 'Exoplanet Catalogue',
        description: 'Thousands of known worlds orbiting other stars.',
        icon: Globe2,
        ready: false,
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ENGINEERING
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'engineering',
    title: 'Engineering',
    description: 'How we build things — materials properties, structures, and electronics.',
    pages: [
      {
        href: '/data/material-properties',
        title: 'Materials Properties',
        description: 'Young\'s modulus, tensile strength, conductivity — the numbers that matter.',
        icon: Ruler,
        ready: false,
      },
      {
        href: '/data/structures',
        title: 'Structural Forms',
        description: 'Beams, arches, trusses, shells — why shapes carry loads.',
        icon: Building2,
        ready: false,
      },
      {
        href: '/data/electronics',
        title: 'Electronics',
        description: 'Resistors, capacitors, transistors, semiconductors.',
        icon: Cpu,
        ready: false,
      },
    ]
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function DataPage() {
  // Find the featured item (Permissible Universe)
  const featuredPage = dataCategories
    .flatMap(cat => cat.pages)
    .find(page => page.featured)

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Page header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">Data</h1>
          <p className="text-base md:text-lg text-black/70 max-w-2xl">
            Reference datasets beautifully presented — from fundamental particles to
            distant galaxies. The raw material of science, designed with care.
          </p>
        </div>

        {/* Featured: The Permissible Universe */}
        {featuredPage && (
          <section className="mb-12 md:mb-16">
            <Link
              href={featuredPage.href}
              className="block bg-black rounded-xl p-6 md:p-8 lg:p-10 hover:bg-neutral-900 transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Scaling size={24} className="text-white" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                      Featured
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-2 group-hover:underline">
                    {featuredPage.title}
                  </h2>
                  <p className="text-base md:text-lg text-white/60 max-w-xl">
                    {featuredPage.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-white/40 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Categories */}
        <div className="space-y-12 md:space-y-16">
          {dataCategories.map((category) => {
            // Filter out featured items from normal display
            const pages = category.pages.filter(p => !p.featured)
            if (pages.length === 0) return null

            return (
              <section key={category.id} id={category.id}>
                {/* Category header */}
                <div className="mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-light text-black mb-1">
                    {category.title}
                  </h2>
                  <p className="text-sm text-black/50">
                    {category.description}
                  </p>
                </div>

                {/* Category pages */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pages.map((page) => {
                    const Icon = page.icon

                    if (!page.ready) {
                      return (
                        <div
                          key={page.href}
                          className="bg-white/50 rounded-xl border border-[#e5e5e5] p-5 opacity-60"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-[#f5f5f5] rounded-lg shrink-0">
                              <Icon size={20} className="text-black/30" strokeWidth={1.5} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-medium text-black/50 truncate">
                                  {page.title}
                                </h3>
                                <span className="text-[10px] px-1.5 py-0.5 bg-neutral-200 text-neutral-500 rounded shrink-0">
                                  Soon
                                </span>
                              </div>
                              <p className="text-sm text-black/30 line-clamp-2">{page.description}</p>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    return (
                      <Link
                        key={page.href}
                        href={page.href}
                        className="bg-white rounded-xl border border-[#e5e5e5] p-5 hover:border-black transition-colors group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 bg-[#f5f5f5] rounded-lg shrink-0 group-hover:bg-black/5 transition-colors">
                            <Icon size={20} className="text-black/60" strokeWidth={1.5} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-medium text-black mb-1 group-hover:underline truncate">
                              {page.title}
                            </h3>
                            <p className="text-sm text-black/50 line-clamp-2">{page.description}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        {/* Philosophy note */}
        <section className="mt-16 md:mt-20 pt-8 border-t border-black/10">
          <div className="max-w-2xl">
            <h2 className="text-lg font-medium text-black mb-3">Everything connects</h2>
            <p className="text-sm text-black/50 leading-relaxed">
              The DATA section isn't a collection of separate reference pages — it's an
              interconnected knowledge graph. Click on iron in the periodic table, and you
              can trace it to where it's mined, when those deposits formed, how it's used
              in steel, and why it makes your blood red. Every entry point leads everywhere else.
            </p>
          </div>
        </section>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
