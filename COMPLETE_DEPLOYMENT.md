# MXWLL DATA SECTION - Complete Deployment Package

**Created:** December 13, 2025  
**Includes:** 
- Updated DATA landing page (8 categories)
- Updated Header navigation
- Complete Permissible Universe visualization (17 files)

---

## Prerequisites

```bash
npm install d3 @types/d3
```

---

## Directory Structure

```
src/
├── components/
│   └── Header.tsx                        # UPDATE
└── app/
    └── data/
        ├── page.tsx                      # REPLACE (new 8-category structure)
        └── permissible-universe/
            ├── page.tsx                  # CREATE
            ├── lib/
            │   ├── index.ts              # CREATE
            │   ├── types.ts              # CREATE
            │   ├── constants.ts          # CREATE
            │   ├── boundaries.ts         # CREATE
            │   ├── epochs.ts             # CREATE
            │   ├── objects.ts            # CREATE
            │   └── objects-part2.ts      # CREATE
            └── components/
                ├── index.ts              # CREATE
                ├── CosmicDiagram.tsx     # CREATE
                ├── ObjectModal.tsx       # CREATE
                ├── BoundaryModal.tsx     # CREATE
                ├── CategoryFilter.tsx    # CREATE
                ├── SearchBox.tsx         # CREATE
                ├── ViewToggle.tsx        # CREATE
                └── LimitsView.tsx        # CREATE
```

---

## Deployment Steps

1. Run: `npm install d3 @types/d3`
2. Create directory: `src/app/data/permissible-universe/lib/`
3. Create directory: `src/app/data/permissible-universe/components/`
4. Create all files below in their specified locations
5. Run `npm run build` to verify
6. Deploy

---

## FILE: src/components/Header.tsx

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Logo from './Logo'

const navItems = [
  { href: '/observe', label: 'observe' },
  { href: '/pulse', label: 'pulse' },
  { href: '/tools', label: 'tools' },
  { href: '/data', label: 'data' },
  { href: '/vault', label: 'vault' },
  { href: '/play', label: 'play' },
]

// Submenus - using category names for DATA
const observeSubmenu = [
  { href: '/observe/vital-signs', label: 'Vital Signs', active: true },
  { href: '/observe/dashboard', label: 'Dashboard', active: true },
]

const pulseSubmenu = [
  { href: '/pulse', label: 'Latest', active: false },
  { href: '#', label: 'Partner Highlights', active: false },
  { href: '#', label: 'Archive', active: false },
]

const toolsSubmenu = [
  { href: '#', label: 'Calculate', active: false },
  { href: '#', label: 'Measure', active: false },
  { href: '#', label: 'Explore', active: false },
]

// Data submenu - key live pages across categories
const dataSubmenu = [
  { href: '/data/permissible-universe', label: 'Permissible Universe', active: true },
  { href: '/data/particles', label: 'Standard Model', active: true },
  { href: '/data/nuclides', label: 'Nuclides', active: true },
  { href: '/data/climate', label: 'Climate', active: true },
  { href: '/data/extraction', label: 'Extraction', active: true },
  { href: '/data/constants', label: 'Constants', active: true },
  { href: '/data/spectrum', label: 'Spectrum', active: true },
]

const vaultSubmenu = [
  { href: '/vault/ancient', label: 'Ancient', active: true },
  { href: '/vault/renaissance', label: 'Renaissance', active: true },
  { href: '/vault/modern', label: 'Modern', active: true },
  { href: '/vault/scientific-fiction', label: 'Scientific Fiction', active: true },
  { href: '/vault/paths', label: 'Reading Paths', active: true },
]

const playSubmenu = [
  { href: '#', label: 'Games', active: false },
  { href: '#', label: 'Simulations', active: false },
]

// Map nav items to their submenus
const submenus: Record<string, typeof observeSubmenu> = {
  '/observe': observeSubmenu,
  '/pulse': pulseSubmenu,
  '/tools': toolsSubmenu,
  '/data': dataSubmenu,
  '/vault': vaultSubmenu,
  '/play': playSubmenu,
}

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="hidden md:block w-full px-4 md:px-8 lg:px-12 py-6 border-b border-black/10 bg-white">
      <div className="grid grid-cols-12 items-start">
        {/* Logo + tagline: cols 1-2 */}
        <div className="col-span-2">
          <Link href="/" className="block group">
            <Logo className="h-14 w-auto text-black" />
            <span className="text-xs text-black/60 tracking-wide mt-1 block">
              a digital laboratory
            </span>
          </Link>
        </div>

        {/* Navigation: cols 3-10 */}
        <div className="col-span-8 flex items-start gap-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname?.startsWith(item.href + '/')

            const submenu = submenus[item.href]

            return (
              <div key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`text-xl font-light tracking-wide cursor-pointer block leading-none ${
                    isActive ? 'text-black' : 'text-black'
                  }`}
                >
                  {item.label}
                </Link>

                {/* Submenu */}
                {submenu && (
                  <div className="mt-3 space-y-0.5">
                    {submenu.map((subItem) =>
                      subItem.active ? (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className={`block text-sm cursor-pointer ${
                            pathname === subItem.href 
                              ? 'text-black font-medium' 
                              : 'text-black'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ) : (
                        <span
                          key={subItem.label}
                          className="block text-sm text-black/40"
                        >
                          {subItem.label}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Auth: cols 11-12 */}
        <div className="col-span-2 flex justify-end items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm text-black/60 hover:text-black transition-colors cursor-pointer">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <Link
              href="/account"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              Account
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
```

---

## FILE: src/app/data/page.tsx

```tsx
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
              <section key={category.id}>
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
```

---

## FILE: src/app/data/permissible-universe/page.tsx
```tsx
'use client'

// ===========================================
// THE PERMISSIBLE UNIVERSE
// ===========================================
// An interactive mass-radius diagram showing everything
// that can exist in the universe

import React, { useState, useCallback, useMemo } from 'react'
import { CosmicObject, ObjectCategory, ViewMode, ModalState } from './lib/types'
import { 
  ALL_OBJECTS, 
  getObject, 
  searchObjects, 
  CATEGORIES, 
  CHART_CONFIG, 
  INITIAL_VIEW,
  BOUNDARY_LIST,
  BOUNDARIES,
} from './lib/index'
import { 
  CosmicDiagram,
  ObjectModal,
  BoundaryModal,
  CategoryFilter,
  SearchBox,
  ViewToggle,
  LimitsView,
} from './components'

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────

export default function PermissibleUniversePage() {
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [visibleCategories, setVisibleCategories] = useState<Set<ObjectCategory>>(
    new Set(Object.keys(CATEGORIES) as ObjectCategory[])
  )
  const [showEpochs, setShowEpochs] = useState(false)
  const [showDomination, setShowDomination] = useState(false)
  
  // Search
  const [searchQuery, setSearchQuery] = useState('')
  const searchResults = useMemo(() => 
    searchQuery ? searchObjects(searchQuery) : [],
    [searchQuery]
  )
  
  // Modal state
  const [modal, setModal] = useState<ModalState>({
    type: null,
    id: null,
    explanationLevel: 1,
  })
  
  // Hover state (for tooltip)
  const [hoveredObject, setHoveredObject] = useState<string | null>(null)
  
  // Filter objects
  const visibleObjects = useMemo(() => {
    let objects = ALL_OBJECTS.filter(obj => visibleCategories.has(obj.category))
    
    // If searching, highlight search results
    if (searchQuery && searchResults.length > 0) {
      const searchIds = new Set(searchResults.map(o => o.id))
      objects = objects.map(obj => ({
        ...obj,
        _isSearchResult: searchIds.has(obj.id),
      }))
    }
    
    return objects
  }, [visibleCategories, searchQuery, searchResults])
  
  // Handlers
  const handleObjectClick = useCallback((id: string) => {
    setModal({ type: 'object', id, explanationLevel: 1 })
  }, [])
  
  const handleBoundaryClick = useCallback((id: string) => {
    setModal({ type: 'boundary', id, explanationLevel: 1 })
  }, [])
  
  const handleCloseModal = useCallback(() => {
    setModal({ type: null, id: null, explanationLevel: 1 })
  }, [])
  
  const handleExplanationLevelChange = useCallback((level: 1 | 2 | 3 | 4) => {
    setModal(prev => ({ ...prev, explanationLevel: level }))
  }, [])
  
  const toggleCategory = useCallback((category: ObjectCategory) => {
    setVisibleCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }, [])
  
  const showAllCategories = useCallback(() => {
    setVisibleCategories(new Set(Object.keys(CATEGORIES) as ObjectCategory[]))
  }, [])
  
  const hideAllCategories = useCallback(() => {
    setVisibleCategories(new Set())
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="px-4 md:px-8 lg:px-12 py-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            {/* Title */}
            <div>
              <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">
                MXWLL / Data
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">
                The Permissible Universe
              </h1>
              <p className="text-white/60 mt-2 max-w-2xl text-sm md:text-base">
                A map of everything that can exist: from quarks to superclusters, 
                bounded by the laws of physics. The forbidden zones show where 
                nature draws the line.
              </p>
            </div>
            
            {/* View Toggle */}
            <ViewToggle 
              mode={viewMode} 
              onChange={setViewMode} 
            />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative">
        {viewMode === 'map' ? (
          <>
            {/* Controls Bar */}
            <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-20">
              <div className="px-4 md:px-8 lg:px-12 py-3">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Search */}
                  <div className="flex-shrink-0 w-full md:w-64">
                    <SearchBox 
                      value={searchQuery}
                      onChange={setSearchQuery}
                      results={searchResults}
                      onResultClick={handleObjectClick}
                    />
                  </div>
                  
                  {/* Category Filters */}
                  <div className="flex-1 overflow-x-auto">
                    <CategoryFilter
                      categories={CATEGORIES}
                      visible={visibleCategories}
                      onToggle={toggleCategory}
                      onShowAll={showAllCategories}
                      onHideAll={hideAllCategories}
                    />
                  </div>
                  
                  {/* Overlay toggles */}
                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showEpochs}
                        onChange={(e) => setShowEpochs(e.target.checked)}
                        className="w-3 h-3 rounded border-white/30 bg-transparent"
                      />
                      <span className="text-white/60">Epochs</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDomination}
                        onChange={(e) => setShowDomination(e.target.checked)}
                        className="w-3 h-3 rounded border-white/30 bg-transparent"
                      />
                      <span className="text-white/60">Ω Regions</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Diagram */}
            <div className="relative" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
              <CosmicDiagram
                objects={visibleObjects}
                boundaries={BOUNDARY_LIST}
                showEpochs={showEpochs}
                showDomination={showDomination}
                onObjectClick={handleObjectClick}
                onObjectHover={setHoveredObject}
                onBoundaryClick={handleBoundaryClick}
                initialView={INITIAL_VIEW}
              />
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs max-w-xs">
                <div className="font-medium text-white/80 mb-2">Forbidden Zones</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-red-800"></div>
                    <span className="text-white/60">Schwarzschild (black hole)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-blue-800"></div>
                    <span className="text-white/60">Compton (quantum limit)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-gray-500 opacity-50" style={{ borderStyle: 'dashed' }}></div>
                    <span className="text-white/60">Planck scale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-teal-800 opacity-50"></div>
                    <span className="text-white/60">Hubble radius</span>
                  </div>
                </div>
              </div>
              
              {/* Object count */}
              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white/40 font-mono">
                {visibleObjects.length} objects
              </div>
            </div>
          </>
        ) : (
          /* Limits View */
          <LimitsView 
            boundaries={BOUNDARY_LIST}
            onBoundaryClick={handleBoundaryClick}
          />
        )}
      </main>
      
      {/* Object Modal */}
      {modal.type === 'object' && modal.id && (
        <ObjectModal
          object={getObject(modal.id)!}
          explanationLevel={modal.explanationLevel}
          onLevelChange={handleExplanationLevelChange}
          onClose={handleCloseModal}
          onObjectClick={handleObjectClick}
        />
      )}
      
      {/* Boundary Modal */}
      {modal.type === 'boundary' && modal.id && (
        <BoundaryModal
          boundary={BOUNDARIES[modal.id]}
          explanationLevel={modal.explanationLevel}
          onLevelChange={handleExplanationLevelChange}
          onClose={handleCloseModal}
          onObjectClick={handleObjectClick}
        />
      )}
    </div>
  )
}
```

---

## FILE: src/app/data/permissible-universe/lib/types.ts
```tsx
// ===========================================
// THE PERMISSIBLE UNIVERSE - TYPE DEFINITIONS
// ===========================================
// Data structures for objects, boundaries, epochs,
// and the cosmic diagram

// ─────────────────────────────────────────────
// OBJECT CATEGORIES
// ─────────────────────────────────────────────

export type ObjectCategory = 
  | 'fundamental-particles'
  | 'composite-particles'
  | 'atoms-molecules'
  | 'viruses-cells'
  | 'macroscopic-life'
  | 'solar-system'
  | 'stars'
  | 'stellar-remnants'
  | 'black-holes'
  | 'stellar-structures'
  | 'galaxies'
  | 'large-scale-structure'
  | 'exotic-theoretical'

export interface CategoryMeta {
  id: ObjectCategory
  name: string
  shortName: string
  description: string
  color: string
  icon: string // Lucide icon name
  order: number // Display order
}

// ─────────────────────────────────────────────
// COSMIC OBJECTS
// ─────────────────────────────────────────────

export interface CosmicObject {
  id: string
  name: string
  category: ObjectCategory
  
  // Position on the diagram (log scale)
  // Using cm for radius and grams for mass (cgs units)
  logRadius: number      // log₁₀(radius in cm)
  logMass: number        // log₁₀(mass in grams)
  
  // Human-readable values with appropriate units
  radius: {
    value: number
    unit: string
    formatted: string    // e.g., "1.4 km" or "10⁻¹³ cm"
  }
  mass: {
    value: number
    unit: string
    formatted: string    // e.g., "2 M☉" or "938 MeV/c²"
  }
  
  // Content
  tagline: string           // One-liner hook (< 100 chars)
  description: string       // 2-3 paragraphs
  whyThisSize: string       // Physics of why it exists here
  
  // Explanation depth levels
  explanations: {
    accessible: string      // Anyone can understand
    intuitive: string       // High school physics
    technical: string       // Undergraduate level
    advanced?: string       // Graduate level (optional)
  }
  
  // Cross-references
  nearbyObjects: string[]   // Object IDs at similar scale
  relatedBoundaries: string[] // Boundary IDs this relates to
  relatedEpochs: string[]   // Epoch IDs when this was relevant
  
  // Metadata
  discovered?: {
    year: number
    by: string
    how?: string
  }
  
  // Visual overrides
  notable?: boolean         // Featured/important object
  labelOffset?: { x: number; y: number } // Adjust label position
}

// ─────────────────────────────────────────────
// BOUNDARIES (Forbidden Zones)
// ─────────────────────────────────────────────

export interface Boundary {
  id: string
  name: string
  shortName: string
  
  // The physics
  equation: string          // LaTeX-style equation
  equationExplained: string // Plain English of the equation
  
  // Visual representation
  // Function that returns logRadius for a given logMass
  // This defines the line on the diagram
  lineType: 'schwarzschild' | 'compton' | 'planck-vertical' | 'hubble-horizontal'
  
  // For linear boundaries: logR = slope * logM + intercept
  slope?: number
  intercept?: number
  
  // For vertical/horizontal lines
  constantValue?: number
  
  // Which side is "forbidden"
  forbiddenSide: 'above' | 'below' | 'left' | 'right'
  
  // Appearance
  color: string
  fillColor: string         // Semi-transparent fill for region
  dashPattern?: number[]
  
  // Rich content - 4 depth levels
  explanations: {
    accessible: string      // L1: Anyone
    intuitive: string       // L2: High school
    technical: string       // L3: Undergraduate  
    advanced: string        // L4: Graduate
  }
  
  // The profound question
  counterfactual: string    // "What if this limit didn't exist?"
  implications: string[]    // Consequences of this boundary
  
  // Objects that define or sit near this boundary
  definingObjects: string[]
}

// ─────────────────────────────────────────────
// EPOCHS (Cosmological Eras)
// ─────────────────────────────────────────────

export interface Epoch {
  id: string
  name: string
  shortName: string
  
  // Time information
  timeAfterBigBang: string  // e.g., "10⁻⁴³ s"
  logTime: number           // log₁₀(seconds after Big Bang)
  temperature: string       // e.g., "10³² K"
  logTemperature: number    // log₁₀(Kelvin)
  energy: string            // e.g., "10¹⁹ GeV"
  logEnergy: number         // log₁₀(GeV)
  
  // Position as diagonal line on the diagram
  // These appear as epoch transitions
  logRadiusIntercept: number
  
  // Content
  description: string
  keyEvents: string[]
  
  // Physics at this epoch
  dominantPhysics: string   // What laws dominated
  particlesPresent: string[] // What existed
  
  // Appearance
  color: string
  labelPosition: { logR: number; logM: number }
}

// ─────────────────────────────────────────────
// DOMINATION ERAS (Ω parameters)
// ─────────────────────────────────────────────

export type DominationType = 
  | 'planckian'     // Ω_Λᵢ - quantum gravity
  | 'radiation'     // Ω_r - radiation dominated
  | 'matter'        // Ω_m - matter dominated  
  | 'dark-energy'   // Ω_Λ - dark energy dominated

export interface DominationEra {
  id: DominationType
  name: string
  symbol: string       // Ω_r, Ω_m, etc.
  
  // Region on diagram (polygon vertices)
  // Defined as array of [logRadius, logMass] points
  region: [number, number][]
  
  color: string
  description: string
  
  // When this era began/ended
  startTime?: string
  endTime?: string
}

// ─────────────────────────────────────────────
// VIEW STATE
// ─────────────────────────────────────────────

export type ViewMode = 'map' | 'limits'

export interface ViewState {
  mode: ViewMode
  
  // Map view state
  center: { logR: number; logM: number }
  zoom: number
  
  // Filters
  visibleCategories: Set<ObjectCategory>
  showEpochs: boolean
  showDomination: boolean
  showBoundaryLabels: boolean
  
  // Selection
  selectedObject: string | null
  selectedBoundary: string | null
  hoveredObject: string | null
  
  // Search
  searchQuery: string
}

// ─────────────────────────────────────────────
// MODAL STATE
// ─────────────────────────────────────────────

export interface ModalState {
  type: 'object' | 'boundary' | null
  id: string | null
  explanationLevel: 1 | 2 | 3 | 4
}

// ─────────────────────────────────────────────
// CHART CONFIGURATION
// ─────────────────────────────────────────────

export interface ChartConfig {
  // Axis ranges (log scale)
  logRadiusRange: [number, number]  // e.g., [-40, 50] in cm
  logMassRange: [number, number]    // e.g., [-45, 60] in grams
  
  // Alternative axis labels
  showMpcAxis: boolean              // Top axis in Mpc
  showGeVAxis: boolean              // Right axis in GeV/c²
  showSolarMassAxis: boolean        // Right axis in M☉
  
  // Display options
  gridSpacing: number               // Major gridlines every N orders of magnitude
  minorGridSpacing: number          // Minor gridlines
}

// ─────────────────────────────────────────────
// TOOLTIP DATA
// ─────────────────────────────────────────────

export interface TooltipData {
  type: 'object' | 'boundary'
  id: string
  position: { x: number; y: number }
}
```

---

## FILE: src/app/data/permissible-universe/lib/constants.ts
```tsx
// ===========================================
// THE PERMISSIBLE UNIVERSE - CONSTANTS
// ===========================================
// Physical constants, axis ranges, colors, categories

import { CategoryMeta, ChartConfig, ObjectCategory } from './types'

// ─────────────────────────────────────────────
// PHYSICAL CONSTANTS
// ─────────────────────────────────────────────

export const PHYSICS = {
  // Fundamental constants
  c: 2.998e10,                    // Speed of light (cm/s)
  G: 6.674e-8,                    // Gravitational constant (cm³/g/s²)
  h: 6.626e-27,                   // Planck constant (erg·s)
  hbar: 1.055e-27,                // Reduced Planck constant (erg·s)
  
  // Planck units
  planckLength: 1.616e-33,        // cm
  planckMass: 2.176e-5,           // g
  planckTime: 5.391e-44,          // s
  planckEnergy: 1.956e16,         // erg
  
  // Particle masses (in grams)
  electronMass: 9.109e-28,
  protonMass: 1.673e-24,
  neutronMass: 1.675e-24,
  
  // Astronomical units
  solarMass: 1.989e33,            // g
  solarRadius: 6.96e10,           // cm
  earthMass: 5.972e27,            // g
  earthRadius: 6.371e8,           // cm
  
  // Cosmological
  hubbleRadius: 4.4e28,           // cm (approximate)
  
  // Log values for diagram
  logPlanckLength: -33,
  logPlanckMass: -5,
  logHubbleRadius: 28,
}

// ─────────────────────────────────────────────
// BOUNDARY EQUATIONS
// ─────────────────────────────────────────────

// Schwarzschild radius: R_s = 2GM/c²
// In log form: log(R) = log(M) + log(2G/c²)
// log(2G/c²) ≈ log(2 × 6.674e-8 / 9e20) ≈ log(1.48e-28) ≈ -27.83
export const SCHWARZSCHILD_INTERCEPT = -27.83

// Compton wavelength: λ_c = h/(mc)
// In log form: log(R) = -log(M) + log(h/c)
// log(h/c) ≈ log(6.626e-27 / 3e10) ≈ log(2.2e-37) ≈ -36.65
export const COMPTON_INTERCEPT = -36.65

// ─────────────────────────────────────────────
// CHART CONFIGURATION
// ─────────────────────────────────────────────

export const CHART_CONFIG: ChartConfig = {
  // Full range of the diagram
  // Radius: from sub-Planck to beyond Hubble radius
  logRadiusRange: [-40, 50],    // cm
  
  // Mass: from particle masses to cosmic structures  
  logMassRange: [-45, 65],      // grams
  
  // Alternative axes
  showMpcAxis: true,
  showGeVAxis: true,
  showSolarMassAxis: true,
  
  // Grid
  gridSpacing: 10,
  minorGridSpacing: 5,
}

// Initial view centered on human scale
export const INITIAL_VIEW = {
  center: { logR: 2, logM: 4.7 },  // ~1m radius, ~50kg mass
  zoom: 1,
}

// ─────────────────────────────────────────────
// CATEGORY DEFINITIONS
// ─────────────────────────────────────────────

export const CATEGORIES: Record<ObjectCategory, CategoryMeta> = {
  'fundamental-particles': {
    id: 'fundamental-particles',
    name: 'Fundamental Particles',
    shortName: 'Particles',
    description: 'Quarks, leptons, and bosons – the indivisible building blocks',
    color: '#8b5cf6',  // Purple
    icon: 'Atom',
    order: 1,
  },
  'composite-particles': {
    id: 'composite-particles',
    name: 'Composite Particles',
    shortName: 'Hadrons',
    description: 'Protons, neutrons, and other bound states of quarks',
    color: '#a855f7',  // Light purple
    icon: 'Circle',
    order: 2,
  },
  'atoms-molecules': {
    id: 'atoms-molecules',
    name: 'Atoms & Molecules',
    shortName: 'Atoms',
    description: 'From hydrogen to complex organic molecules',
    color: '#06b6d4',  // Cyan
    icon: 'Hexagon',
    order: 3,
  },
  'viruses-cells': {
    id: 'viruses-cells',
    name: 'Viruses & Cells',
    shortName: 'Biology',
    description: 'The machinery of life, from viruses to cells',
    color: '#10b981',  // Emerald
    icon: 'Bug',
    order: 4,
  },
  'macroscopic-life': {
    id: 'macroscopic-life',
    name: 'Macroscopic Life',
    shortName: 'Life',
    description: 'Visible organisms from fleas to whales',
    color: '#22c55e',  // Green
    icon: 'TreeDeciduous',
    order: 5,
  },
  'solar-system': {
    id: 'solar-system',
    name: 'Solar System Bodies',
    shortName: 'Planets',
    description: 'Asteroids, moons, planets, and dwarf planets',
    color: '#f59e0b',  // Amber
    icon: 'Globe',
    order: 6,
  },
  'stars': {
    id: 'stars',
    name: 'Stars',
    shortName: 'Stars',
    description: 'From brown dwarfs to supergiants',
    color: '#f97316',  // Orange
    icon: 'Sun',
    order: 7,
  },
  'stellar-remnants': {
    id: 'stellar-remnants',
    name: 'Stellar Remnants',
    shortName: 'Remnants',
    description: 'White dwarfs, neutron stars, and pulsars',
    color: '#ef4444',  // Red
    icon: 'Sparkles',
    order: 8,
  },
  'black-holes': {
    id: 'black-holes',
    name: 'Black Holes',
    shortName: 'Black Holes',
    description: 'From stellar mass to supermassive',
    color: '#1f2937',  // Dark gray
    icon: 'CircleDot',
    order: 9,
  },
  'stellar-structures': {
    id: 'stellar-structures',
    name: 'Stellar Structures',
    shortName: 'Clusters',
    description: 'Star clusters, nebulae, and stellar nurseries',
    color: '#ec4899',  // Pink
    icon: 'Stars',
    order: 10,
  },
  'galaxies': {
    id: 'galaxies',
    name: 'Galaxies',
    shortName: 'Galaxies',
    description: 'From dwarf galaxies to giant ellipticals',
    color: '#6366f1',  // Indigo
    icon: 'Orbit',
    order: 11,
  },
  'large-scale-structure': {
    id: 'large-scale-structure',
    name: 'Large Scale Structure',
    shortName: 'Cosmic',
    description: 'Galaxy clusters, superclusters, voids, and the cosmic web',
    color: '#3b82f6',  // Blue
    icon: 'Network',
    order: 12,
  },
  'exotic-theoretical': {
    id: 'exotic-theoretical',
    name: 'Exotic & Theoretical',
    shortName: 'Exotic',
    description: 'Theoretical objects and extreme states of matter',
    color: '#94a3b8',  // Slate
    icon: 'HelpCircle',
    order: 13,
  },
}

// ─────────────────────────────────────────────
// BOUNDARY COLORS
// ─────────────────────────────────────────────

export const BOUNDARY_COLORS = {
  schwarzschild: {
    line: '#991b1b',      // Dark red
    fill: 'rgba(153, 27, 27, 0.15)',
  },
  compton: {
    line: '#1e40af',      // Dark blue
    fill: 'rgba(30, 64, 175, 0.15)',
  },
  planck: {
    line: '#4b5563',      // Gray
    fill: 'rgba(75, 85, 99, 0.2)',
  },
  hubble: {
    line: '#065f46',      // Dark teal
    fill: 'rgba(6, 95, 70, 0.1)',
  },
}

// ─────────────────────────────────────────────
// EPOCH COLORS
// ─────────────────────────────────────────────

export const EPOCH_COLORS = {
  planck: '#6b7280',
  gut: '#9ca3af',
  electroweak: '#d1d5db',
  nuclear: '#fbbf24',
  atomic: '#f59e0b',
  recombination: '#ef4444',
  now: '#22c55e',
}

// ─────────────────────────────────────────────
// DOMINATION ERA COLORS
// ─────────────────────────────────────────────

export const DOMINATION_COLORS = {
  planckian: 'rgba(107, 114, 128, 0.3)',     // Gray
  radiation: 'rgba(239, 68, 68, 0.2)',        // Red tint
  matter: 'rgba(59, 130, 246, 0.15)',         // Blue tint
  'dark-energy': 'rgba(209, 213, 219, 0.2)',  // Light gray
}

// ─────────────────────────────────────────────
// UNIT CONVERSIONS
// ─────────────────────────────────────────────

export const UNIT_CONVERSIONS = {
  // Radius conversions FROM cm
  cmToM: 1e-2,
  cmToKm: 1e-5,
  cmToAU: 6.685e-14,
  cmToPc: 3.241e-19,
  cmToMpc: 3.241e-25,
  cmToLy: 1.057e-18,
  
  // Mass conversions FROM grams
  gToKg: 1e-3,
  gToSolarMass: 5.028e-34,
  gToEarthMass: 1.674e-28,
  gToGeV: 5.61e23,  // g to GeV/c²
  gToMeV: 5.61e26,
  gToEV: 5.61e32,
}

// ─────────────────────────────────────────────
// FORMATTING HELPERS
// ─────────────────────────────────────────────

export function formatLogValue(logValue: number, unit: string): string {
  if (logValue === 0) return `1 ${unit}`
  if (logValue > 0 && logValue < 4) {
    return `${Math.pow(10, logValue).toFixed(0)} ${unit}`
  }
  if (logValue < 0 && logValue > -4) {
    return `${Math.pow(10, logValue).toFixed(Math.abs(Math.floor(logValue)))} ${unit}`
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
  
  const str = rounded.toString()
  return str.split('').map(c => superscripts[c] || c).join('')
}
```

---

## FILE: src/app/data/permissible-universe/lib/index.ts
```tsx
// ===========================================
// THE PERMISSIBLE UNIVERSE - MAIN INDEX
// ===========================================
// Re-exports all data and provides search/filter utilities

import { CosmicObject, ObjectCategory } from './types'
import { COSMIC_OBJECTS } from './objects'
import { ALL_COSMIC_OBJECTS_PART2 } from './objects-part2'
import { CATEGORIES } from './constants'

// Re-export everything from other modules
export * from './types'
export * from './constants'
export { BOUNDARIES, BOUNDARY_LIST, getBoundaryLogRadius } from './boundaries'
export { EPOCHS, EPOCH_LIST, DOMINATION_ERAS, DOMINATION_LIST } from './epochs'

// ─────────────────────────────────────────────
// COMBINED OBJECT LIST
// ─────────────────────────────────────────────

export const ALL_OBJECTS: CosmicObject[] = [
  ...COSMIC_OBJECTS,
  ...ALL_COSMIC_OBJECTS_PART2,
]

// Create lookup map
export const OBJECTS_MAP = new Map<string, CosmicObject>(
  ALL_OBJECTS.map(obj => [obj.id, obj])
)

// ─────────────────────────────────────────────
// LOOKUP FUNCTIONS
// ─────────────────────────────────────────────

export function getObject(id: string): CosmicObject | undefined {
  return OBJECTS_MAP.get(id)
}

export function getObjectsByCategory(category: ObjectCategory): CosmicObject[] {
  return ALL_OBJECTS.filter(obj => obj.category === category)
}

export function getNotableObjects(): CosmicObject[] {
  return ALL_OBJECTS.filter(obj => obj.notable)
}

// ─────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────

export function searchObjects(query: string): CosmicObject[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  
  return ALL_OBJECTS.filter(obj => {
    const searchFields = [
      obj.name,
      obj.tagline,
      obj.description,
      CATEGORIES[obj.category].name,
    ].join(' ').toLowerCase()
    
    return searchFields.includes(q)
  })
}

// ─────────────────────────────────────────────
// SPATIAL QUERIES
// ─────────────────────────────────────────────

export function getObjectsInRegion(
  logRadiusMin: number,
  logRadiusMax: number,
  logMassMin: number,
  logMassMax: number
): CosmicObject[] {
  return ALL_OBJECTS.filter(obj =>
    obj.logRadius >= logRadiusMin &&
    obj.logRadius <= logRadiusMax &&
    obj.logMass >= logMassMin &&
    obj.logMass <= logMassMax
  )
}

export function getNearbyObjects(
  targetId: string,
  count: number = 5
): CosmicObject[] {
  const target = OBJECTS_MAP.get(targetId)
  if (!target) return []
  
  // Sort by distance in log-log space
  const withDistance = ALL_OBJECTS
    .filter(obj => obj.id !== targetId)
    .map(obj => ({
      obj,
      distance: Math.sqrt(
        Math.pow(obj.logRadius - target.logRadius, 2) +
        Math.pow(obj.logMass - target.logMass, 2)
      )
    }))
    .sort((a, b) => a.distance - b.distance)
  
  return withDistance.slice(0, count).map(x => x.obj)
}

// ─────────────────────────────────────────────
// STATISTICS
// ─────────────────────────────────────────────

export function getObjectStats() {
  const byCategory: Record<ObjectCategory, number> = {} as any
  
  for (const cat of Object.keys(CATEGORIES) as ObjectCategory[]) {
    byCategory[cat] = ALL_OBJECTS.filter(o => o.category === cat).length
  }
  
  return {
    total: ALL_OBJECTS.length,
    byCategory,
    notable: ALL_OBJECTS.filter(o => o.notable).length,
    withAdvanced: ALL_OBJECTS.filter(o => o.explanations.advanced).length,
  }
}

// ─────────────────────────────────────────────
// AXIS RANGE HELPERS
// ─────────────────────────────────────────────

export function getObjectBounds() {
  let minR = Infinity, maxR = -Infinity
  let minM = Infinity, maxM = -Infinity
  
  for (const obj of ALL_OBJECTS) {
    minR = Math.min(minR, obj.logRadius)
    maxR = Math.max(maxR, obj.logRadius)
    minM = Math.min(minM, obj.logMass)
    maxM = Math.max(maxM, obj.logMass)
  }
  
  return {
    logRadius: { min: minR, max: maxR },
    logMass: { min: minM, max: maxM },
  }
}
```

---

## FILE: src/app/data/permissible-universe/lib/boundaries.ts
```tsx
// ===========================================
// THE PERMISSIBLE UNIVERSE - BOUNDARIES
// ===========================================
// The forbidden zones: Schwarzschild, Compton, Planck, Hubble

import { Boundary } from './types'
import { SCHWARZSCHILD_INTERCEPT, COMPTON_INTERCEPT, BOUNDARY_COLORS, PHYSICS } from './constants'

// ─────────────────────────────────────────────
// THE FOUR FUNDAMENTAL BOUNDARIES
// ─────────────────────────────────────────────

export const BOUNDARIES: Record<string, Boundary> = {
  
  // ═══════════════════════════════════════════
  // SCHWARZSCHILD LIMIT
  // "Too much mass in too little space"
  // ═══════════════════════════════════════════
  'schwarzschild': {
    id: 'schwarzschild',
    name: 'Schwarzschild Limit',
    shortName: 'Black Hole Boundary',
    
    equation: 'R_s = \\frac{2GM}{c^2}',
    equationExplained: 'The radius equals twice the gravitational constant times mass, divided by the speed of light squared',
    
    lineType: 'schwarzschild',
    slope: 1,
    intercept: SCHWARZSCHILD_INTERCEPT,
    forbiddenSide: 'above',
    
    color: BOUNDARY_COLORS.schwarzschild.line,
    fillColor: BOUNDARY_COLORS.schwarzschild.fill,
    
    explanations: {
      accessible: `Imagine throwing a ball upward. The harder you throw, the higher it goes before falling back. Now imagine throwing it so hard it never comes back – that's escape velocity.

For every object, there's a speed you'd need to escape its gravity forever. The more massive and compact something is, the higher that escape speed.

The Schwarzschild limit is where escape velocity equals the speed of light. Beyond this line, nothing – not even light – can escape. Everything above this boundary has collapsed into a black hole.

This is why there are no "big dense things that aren't black holes." If you compress enough mass into a small enough space, gravity wins, period.`,

      intuitive: `The escape velocity from any object is v = √(2GM/R). If we set v = c (speed of light), we get the Schwarzschild radius: R_s = 2GM/c².

This creates a diagonal line on our mass-radius diagram with slope 1 (in log-log space). Everything above this line would require faster-than-light escape – which is impossible.

The remarkable thing: this is a hard boundary. There's no physical process that can create a stable object above this line. If matter crosses it, it must collapse into a singularity.

This explains why neutron stars have a maximum mass (~3 M☉). Push beyond that, and no force in the universe can prevent collapse.`,

      technical: `The Schwarzschild metric describes spacetime around a spherically symmetric mass:

ds² = -(1 - R_s/r)c²dt² + (1 - R_s/r)⁻¹dr² + r²dΩ²

At r = R_s = 2GM/c², the metric becomes singular – this is the event horizon.

The boundary represents the condition where the gravitational radius equals the physical radius. For any mass M, if compressed to radius R < R_s, an event horizon forms.

Key physics:
• Inside R_s, all worldlines lead to r = 0 (the singularity)
• The coordinate singularity at R_s is removable (Eddington-Finkelstein coordinates)
• The singularity at r = 0 is physical (geodesic incompleteness)

The Tolman-Oppenheimer-Volkoff limit (~3 M☉) marks where neutron degeneracy pressure fails against gravity, leading to black hole formation.`,

      advanced: `The Schwarzschild solution is the unique spherically symmetric vacuum solution to Einstein's field equations (Birkhoff's theorem).

The surface R = R_s is a null hypersurface – the event horizon – where the Killing vector ∂/∂t becomes null. Inside, the r coordinate becomes timelike, forcing all matter inexorably toward the singularity.

The Penrose diagram reveals the causal structure:
• Region I: External universe
• Region II: Black hole interior (inevitable singularity)
• Regions III, IV: White hole and parallel universe (mathematically present but physically inaccessible)

Quantum considerations (Hawking radiation) suggest black holes evaporate on timescales t ~ M³, with temperature T = ℏc³/(8πGMk_B). This creates the information paradox – does information falling past the horizon ever escape?

The holographic principle suggests the maximum entropy of a region scales with surface area, not volume: S_max = A/(4l_P²), where l_P is the Planck length. This implies fundamental limits on information density that connect to black hole physics.`
    },
    
    counterfactual: `If the Schwarzschild limit didn't exist, you could compress matter indefinitely. Stars wouldn't have maximum masses. You could, in principle, create an object of any density.

The universe would be stranger: no black holes, no event horizons, no information paradox. Gravity would never "win" completely. But the theory of general relativity would be fundamentally different – light would always be able to escape from any gravitational field, no matter how strong.`,

    implications: [
      'Black holes exist as inevitable endpoints of gravitational collapse',
      'There is a maximum mass for neutron stars (~3 M☉)',
      'Event horizons create one-way boundaries in spacetime',
      'The information paradox emerges from quantum effects near horizons',
    ],
    
    definingObjects: ['stellar-bh', 'sagittarius-a', 'm87-bh', 'primordial-bh'],
  },

  // ═══════════════════════════════════════════
  // COMPTON LIMIT
  // "Below this, particles are fuzzy"
  // ═══════════════════════════════════════════
  'compton': {
    id: 'compton',
    name: 'Compton Wavelength Limit',
    shortName: 'Quantum Limit',
    
    equation: '\\lambda_C = \\frac{h}{mc}',
    equationExplained: 'The Compton wavelength equals Planck constant divided by mass times speed of light',
    
    lineType: 'compton',
    slope: -1,
    intercept: COMPTON_INTERCEPT,
    forbiddenSide: 'below',
    
    color: BOUNDARY_COLORS.compton.line,
    fillColor: BOUNDARY_COLORS.compton.fill,
    
    explanations: {
      accessible: `Particles aren't tiny billiard balls – they're fuzzy. Every particle has a wave nature, and that wave has a size called the Compton wavelength.

Here's the strange part: if you try to pin down where a particle is more precisely than its Compton wavelength, you need so much energy that you create new particles. You're no longer measuring the original particle – you're creating a particle zoo.

This means there's a fundamental limit to how small we can say something is. Below the Compton limit, "size" stops making sense. A particle isn't "at" any location – it's a probability cloud spread over at least its Compton wavelength.

This is why electrons don't spiral into atomic nuclei. Quantum mechanics sets a minimum scale for matter.`,

      intuitive: `The Heisenberg uncertainty principle states: ΔxΔp ≥ ℏ/2. To localize a particle to size Δx, you need momentum uncertainty Δp ≥ ℏ/(2Δx).

The Compton wavelength λ_C = h/(mc) is where the momentum uncertainty equals the particle's rest mass energy: Δp·c ≈ mc².

Below this scale, trying to measure position requires energies exceeding 2mc² – enough to create particle-antiparticle pairs. Your "measurement" creates new particles, destroying any meaning of "the particle's position."

This is why quantum field theory replaces quantum mechanics at small scales. You can't talk about single particles below their Compton wavelength – only fields that can create and destroy particles.`,

      technical: `The Compton wavelength emerges from relativistic quantum mechanics. For a free particle of mass m, the Klein-Gordon equation:

(∂²/∂t² - c²∇² + m²c⁴/ℏ²)ψ = 0

has characteristic length scale λ_C = ℏ/(mc) = h/(mc).

Physical interpretation:
• λ_C is where quantum and relativistic effects become equally important
• Below λ_C, the position-space wavefunction cannot be localized without pair production
• The dressed propagator in QFT shows the electron is surrounded by virtual pairs within ~λ_C

For the electron, λ_C ≈ 2.4 × 10⁻¹⁰ cm – larger than the classical electron radius r_e = e²/(m_ec²) ≈ 2.8 × 10⁻¹³ cm by a factor of ~137 (the fine structure constant α⁻¹).

The Compton scattering formula Δλ = λ_C(1 - cos θ) directly reveals this scale experimentally.`,

      advanced: `The Compton wavelength fundamentally constrains localization in relativistic quantum mechanics.

In QFT, the propagator for a scalar field:
G(x-y) = ∫d⁴p/(2π)⁴ · e^(-ip·(x-y))/(p² - m² + iε)

decays as e^(-m|x-y|) for spacelike separation – the particle is "smeared" over its Compton wavelength.

The LSZ reduction formula shows that asymptotic states must be wavepackets with spatial extent ≥ λ_C. Below this, the particle number is not well-defined.

Connection to the diagram: The Compton line has slope -1 because λ_C ∝ 1/m. As mass increases, Compton wavelength decreases. The line intersects the Schwarzschild line at the Planck scale – where quantum gravity becomes unavoidable.

Interestingly, at the Planck mass, λ_C = R_s = l_P – the particle's quantum size equals its Schwarzschild radius. This is the ultimate boundary of semiclassical physics.`
    },
    
    counterfactual: `Without the Compton limit, particles could be arbitrarily small. Atoms wouldn't have definite sizes – electrons could spiral into nuclei. Chemistry would be radically different, if possible at all.

The quantum world would behave classically at all scales. There would be no uncertainty principle, no wave-particle duality, no fundamental "fuzziness." Particles would be perfect points.

But this would require abandoning both quantum mechanics and special relativity – the Compton wavelength emerges from their combination. It's not a contingent feature; it's what "mass" means in a quantum relativistic universe.`,

    implications: [
      'Particles cannot be localized below their Compton wavelength',
      'Trying to probe smaller scales creates particle-antiparticle pairs',
      'Atoms have definite sizes because of quantum effects',
      'The transition from QM to QFT occurs at this scale',
    ],
    
    definingObjects: ['electron', 'proton', 'neutron', 'quark-up'],
  },

  // ═══════════════════════════════════════════
  // PLANCK SCALE
  // "Where physics breaks down"
  // ═══════════════════════════════════════════
  'planck': {
    id: 'planck',
    name: 'Planck Scale',
    shortName: 'Planckian Unknown',
    
    equation: 'l_P = \\sqrt{\\frac{\\hbar G}{c^3}}',
    equationExplained: 'The Planck length equals the square root of reduced Planck constant times gravitational constant, divided by speed of light cubed',
    
    lineType: 'planck-vertical',
    constantValue: PHYSICS.logPlanckLength,
    forbiddenSide: 'left',
    
    color: BOUNDARY_COLORS.planck.line,
    fillColor: BOUNDARY_COLORS.planck.fill,
    dashPattern: [4, 4],
    
    explanations: {
      accessible: `At a certain unimaginably small scale, all of physics breaks down. This is the Planck length: about 10⁻³³ centimeters – so small that a single atom is as big compared to it as the observable universe is compared to an atom.

At this scale, our theories of gravity and quantum mechanics clash irreconcilably. Spacetime itself might be foamy, fluctuating, or quantized. We genuinely don't know.

The Planck scale is unique because it's built from the fundamental constants themselves: the speed of light (c), the quantum of action (ℏ), and Newton's constant (G). Any universe with these constants has this scale.

Below the Planck length, the concept of "distance" may not exist. This isn't just unknown physics – it might be unknowable physics.`,

      intuitive: `The Planck length l_P = √(ℏG/c³) ≈ 1.6 × 10⁻³³ cm combines the three fundamental constants that govern space (c), quanta (ℏ), and gravity (G).

Here's why it matters: imagine trying to probe smaller and smaller distances. You need higher and higher energies (uncertainty principle). But energy gravitates. Eventually, probing below the Planck length would require so much energy concentrated in so small a space that you'd create a black hole.

Your "microscope" swallows itself. The act of measurement destroys what you're trying to measure.

This is the Planck scale paradox: the tools of physics (measurement, space, time) become self-referentially inconsistent.`,

      technical: `The Planck scale emerges where quantum mechanics and general relativity become equally important.

The relevant Planck units:
• l_P = √(ℏG/c³) ≈ 1.616 × 10⁻³³ cm
• t_P = √(ℏG/c⁵) ≈ 5.391 × 10⁻⁴⁴ s
• m_P = √(ℏc/G) ≈ 2.176 × 10⁻⁵ g ≈ 1.22 × 10¹⁹ GeV/c²
• E_P = √(ℏc⁵/G) ≈ 1.22 × 10¹⁹ GeV

At E ~ E_P or L ~ l_P:
• Gravitational self-energy of a quantum fluctuation ~ ℏc/L ~ Gm²/L implies m ~ m_P
• The Schwarzschild radius of a Planck mass equals its Compton wavelength: both equal l_P

Quantum gravity effects become O(1). The loop expansion of gravity in ℏ breaks down. Spacetime may be:
• Foamy (Wheeler's spacetime foam)
• Discrete (loop quantum gravity)
• Higher-dimensional (string theory)
• Emergent (holographic scenarios)`,

      advanced: `The Planck scale represents the UV completion problem of quantum gravity.

GR is non-renormalizable: loop corrections introduce divergences requiring infinite counterterms. The effective field theory expansion:

L = √g[R/16πG + c₁R² + c₂R_μν² + ...]

has dimensionless coefficients c_i ~ O(1) in Planck units, but the R, R², ... terms scale differently with energy, and infinite terms would be needed above E_P.

Candidate solutions:

String Theory: Replaces point particles with extended objects (strings of length l_s ~ l_P), softening UV behavior. Extra dimensions, branes, and dualities emerge.

Loop Quantum Gravity: Quantizes geometry directly. Area and volume spectra have minimum eigenvalues ~ l_P² and l_P³. Spacetime is discrete at Planck scale.

Asymptotic Safety: Posits a non-Gaussian UV fixed point where GR remains consistent but strongly coupled. Requires functional renormalization group analysis.

Holographic Principle: Information in a region scales with surface area: S ≤ A/(4l_P²). Bulk spacetime may emerge from boundary degrees of freedom (AdS/CFT).

No current theory is experimentally verified at Planck energies.`
    },
    
    counterfactual: `The Planck scale isn't optional – it emerges from the fundamental constants. A universe with quantum mechanics (ℏ), gravity (G), and relativity (c) inevitably has this scale.

The only way to eliminate it would be to change the constants themselves. Make G = 0, and gravity disappears – no Planck scale needed, but also no stars, no galaxies, no structure. Make ℏ = 0, and quantum mechanics disappears – classical determinism everywhere, but no atoms, no chemistry.

The Planck scale is the price of a universe with both quantum effects and gravity.`,

    implications: [
      'Quantum gravity effects become important',
      'Spacetime may be discrete or emergent',
      'Current physics theories are incomplete below this scale',
      'The Compton and Schwarzschild limits intersect here',
    ],
    
    definingObjects: ['planck-mass', 'instanton'],
  },

  // ═══════════════════════════════════════════
  // HUBBLE RADIUS
  // "The edge of the observable"
  // ═══════════════════════════════════════════
  'hubble': {
    id: 'hubble',
    name: 'Hubble Radius',
    shortName: 'Cosmic Horizon',
    
    equation: 'R_H = \\frac{c}{H_0}',
    equationExplained: 'The Hubble radius equals the speed of light divided by the Hubble constant',
    
    lineType: 'hubble-horizontal',
    constantValue: Math.log10(PHYSICS.hubbleRadius),
    forbiddenSide: 'right',
    
    color: BOUNDARY_COLORS.hubble.line,
    fillColor: BOUNDARY_COLORS.hubble.fill,
    dashPattern: [8, 4],
    
    explanations: {
      accessible: `The universe has a kind of edge – not a wall in space, but a horizon in time and light.

The Hubble radius is the distance at which space expands so fast that light from there can never reach us. It's about 14 billion light-years away. Beyond it, the universe exists, but it's causally disconnected from us.

This isn't because of any physical barrier. It's because space between us and distant regions is expanding faster than light can travel across it. Every day, more of the universe slips permanently beyond our horizon.

The observable universe is finite not because the universe ends, but because information has speed limits.`,

      intuitive: `Hubble's law states that distant galaxies recede with velocity v = H₀d, where H₀ ≈ 70 km/s/Mpc is the Hubble constant.

At distance d = c/H₀ (the Hubble radius, ~14 billion light-years), recession velocity equals light speed. Beyond this, galaxies recede superluminally – not violating relativity, because it's space itself expanding, not motion through space.

Light emitted from beyond the Hubble radius is "swimming against the current" – for now. Due to acceleration of expansion (dark energy), the Hubble radius is growing slower than space itself. Eventually, galaxies currently visible will cross the horizon permanently.

The particle horizon (~46 billion light-years) is larger – it's everything that has ever been causally connected to us since the Big Bang.`,

      technical: `The Hubble radius R_H = c/H(t) is a time-dependent quantity in an expanding universe described by the FLRW metric:

ds² = -c²dt² + a(t)²[dr²/(1-kr²) + r²dΩ²]

where a(t) is the scale factor and H = ȧ/a.

Key cosmological horizons:
• Hubble radius: R_H = c/H ≈ 4.4 × 10²⁸ cm
• Particle horizon: χ_PH = c∫₀^t dt'/a(t') ≈ 4.4 × 10²⁸ cm comoving
• Event horizon: χ_EH = c∫_t^∞ dt'/a(t') – exists only if ∫ converges (requires acceleration)

In a universe with cosmological constant Λ:
• a(t) → e^(Ht) at late times
• H → √(Λ/3) = const
• Event horizon freezes at R_EH = c/H_∞

Our universe is transitioning from matter-dominated to Λ-dominated, causing acceleration and eventual horizon freeze.`,

      advanced: `The cosmic horizons encode deep aspects of spacetime structure and thermodynamics.

De Sitter thermodynamics: A cosmological horizon has temperature T = ℏH/(2πk_B) and entropy S = πc³/(GℏH²). This parallels black hole thermodynamics – both are null surfaces with associated entropy.

The holographic bound applies: S ≤ A/(4l_P²), where A is horizon area. This suggests fundamental limits on information content of the observable universe.

Inflation creates a "stretched" horizon: during exponential expansion, microscopic scales become macroscopic. Quantum fluctuations become classical perturbations – the seeds of structure formation.

The horizon problem: Without inflation, causally disconnected regions share identical CMB temperatures. Inflation explains this by placing them in causal contact before rapid expansion separated them.

The measure problem in eternal inflation: if the universe is infinite, how do we define probabilities? Different horizon structures give different answers – an unresolved foundational issue.`
    },
    
    counterfactual: `Without a cosmic horizon – if light could travel arbitrarily far instantly – the universe would look radically different.

Olbers' paradox would apply: every line of sight would end on a star, making the night sky bright as the sun. The finite speed of light and finite age of the universe are why the sky is dark.

More profoundly: without horizons, the universe would have no causal structure. The past and future would be equally accessible. Thermodynamics would be ungrounded – there would be no arrow of time defined by expansion.

The horizon isn't a limitation – it's what makes time and causality possible.`,

    implications: [
      'The observable universe is finite, but the universe itself may be infinite',
      'Distant galaxies are receding faster than light',
      'Information has permanent limits due to cosmic expansion',
      'The night sky is dark because of finite light-travel time',
    ],
    
    definingObjects: ['hubble-radius', 'observable-universe', 'supercluster-laniakea'],
  },
}

// ─────────────────────────────────────────────
// HELPER: Get boundary line equation
// ─────────────────────────────────────────────

export function getBoundaryLogRadius(boundary: Boundary, logMass: number): number | null {
  switch (boundary.lineType) {
    case 'schwarzschild':
    case 'compton':
      // Linear in log-log space: logR = slope * logM + intercept
      return (boundary.slope ?? 0) * logMass + (boundary.intercept ?? 0)
    
    case 'planck-vertical':
      // Vertical line at constant logRadius
      return boundary.constantValue ?? null
    
    case 'hubble-horizontal':
      // This is actually about size, not mass, but marks the cosmic limit
      return boundary.constantValue ?? null
    
    default:
      return null
  }
}

// ─────────────────────────────────────────────
// EXPORT ALL BOUNDARIES AS ARRAY
// ─────────────────────────────────────────────

export const BOUNDARY_LIST = Object.values(BOUNDARIES)
```

---

## FILE: src/app/data/permissible-universe/lib/epochs.ts
```tsx
// ===========================================
// THE PERMISSIBLE UNIVERSE - EPOCHS
// ===========================================
// Cosmological eras from Planck time to now

import { Epoch, DominationEra, DominationType } from './types'
import { EPOCH_COLORS, DOMINATION_COLORS } from './constants'

// ─────────────────────────────────────────────
// COSMIC EPOCHS (Diagonal Lines on Diagram)
// ─────────────────────────────────────────────
// These represent key transitions in the early universe
// They appear as labeled diagonal lines showing the
// characteristic energy/temperature at each era

export const EPOCHS: Record<string, Epoch> = {
  
  'planck': {
    id: 'planck',
    name: 'Planck Epoch',
    shortName: 'Planck',
    
    timeAfterBigBang: '10⁻⁴³ s',
    logTime: -43,
    temperature: '10³² K',
    logTemperature: 32,
    energy: '10¹⁹ GeV',
    logEnergy: 19,
    
    logRadiusIntercept: -43,
    
    description: `The Planck epoch spans from t = 0 to t ≈ 10⁻⁴³ seconds after the Big Bang. During this era, all four fundamental forces were unified, and quantum gravitational effects dominated. Our current physics cannot describe this epoch – general relativity and quantum mechanics are both inadequate here.`,
    
    keyEvents: [
      'All four forces unified',
      'Quantum gravity dominated',
      'Spacetime itself may have been quantized',
      'No current theory adequately describes this era',
    ],
    
    dominantPhysics: 'Quantum gravity (unknown theory)',
    particlesPresent: ['Unknown – possibly pre-particle quantum state'],
    
    color: EPOCH_COLORS.planck,
    labelPosition: { logR: -35, logM: 0 },
  },
  
  'gut': {
    id: 'gut',
    name: 'Grand Unification Epoch',
    shortName: 'GUT',
    
    timeAfterBigBang: '10⁻³⁶ s',
    logTime: -36,
    temperature: '10²⁸ K',
    logTemperature: 28,
    energy: '10¹⁵ GeV',
    logEnergy: 15,
    
    logRadiusIntercept: -32.5,
    
    description: `During the GUT epoch (10⁻⁴³ to 10⁻³⁶ s), gravity separated from the other three forces, which remained unified in a single "grand unified" interaction. GUT theories predict magnetic monopoles and proton decay, though neither has been observed.`,
    
    keyEvents: [
      'Gravity separates from unified force',
      'Strong, weak, and EM still unified',
      'Magnetic monopoles may have formed',
      'Conditions for inflation established',
    ],
    
    dominantPhysics: 'Grand Unified Theory (hypothetical)',
    particlesPresent: ['X and Y bosons (hypothetical)', 'Quarks and leptons unified'],
    
    color: EPOCH_COLORS.gut,
    labelPosition: { logR: -28, logM: 5 },
  },
  
  'electroweak': {
    id: 'electroweak',
    name: 'Electroweak Epoch',
    shortName: 'EW',
    
    timeAfterBigBang: '10⁻¹² s',
    logTime: -12,
    temperature: '10¹⁵ K',
    logTemperature: 15,
    energy: '100 GeV',
    logEnergy: 2,
    
    logRadiusIntercept: -11.5,
    
    description: `From 10⁻³⁶ to 10⁻¹² seconds, the strong force separated, leaving electromagnetism and the weak force still unified. This era ended with electroweak symmetry breaking, when the Higgs field acquired its vacuum expectation value, giving mass to W and Z bosons.`,
    
    keyEvents: [
      'Strong force separates (QCD becomes distinct)',
      'Electroweak force still unified',
      'Universe filled with quark-gluon plasma',
      'Inflation may have occurred during this era',
    ],
    
    dominantPhysics: 'Electroweak theory (confirmed)',
    particlesPresent: ['Quarks', 'Gluons', 'W/Z bosons (massless)', 'Leptons', 'Higgs field'],
    
    color: EPOCH_COLORS.electroweak,
    labelPosition: { logR: -8, logM: 10 },
  },
  
  'nuclear': {
    id: 'nuclear',
    name: 'Quark Epoch / Hadron Epoch',
    shortName: 'Nuclear',
    
    timeAfterBigBang: '10⁻⁶ s',
    logTime: -6,
    temperature: '10¹² K',
    logTemperature: 12,
    energy: '100 MeV',
    logEnergy: -1,
    
    logRadiusIntercept: -5.5,
    
    description: `From 10⁻¹² to 10⁻⁶ seconds (Quark epoch) and 10⁻⁶ to 1 second (Hadron epoch), the universe cooled through the QCD phase transition. Free quarks became confined into hadrons (protons, neutrons). Baryon asymmetry was established – the slight matter-antimatter imbalance that allows us to exist.`,
    
    keyEvents: [
      'Electroweak symmetry breaking (10⁻¹² s)',
      'Higgs gives mass to particles',
      'QCD confinement – quarks form hadrons',
      'Baryon asymmetry established',
      'Most antimatter annihilates',
    ],
    
    dominantPhysics: 'Standard Model (confirmed)',
    particlesPresent: ['Protons', 'Neutrons', 'Mesons', 'Electrons', 'Neutrinos', 'Photons'],
    
    color: EPOCH_COLORS.nuclear,
    labelPosition: { logR: -2, logM: 15 },
  },
  
  'atomic': {
    id: 'atomic',
    name: 'Lepton Epoch / Nucleosynthesis',
    shortName: 'Atomic',
    
    timeAfterBigBang: '10³ s (~ 20 min)',
    logTime: 3,
    temperature: '10⁹ K',
    logTemperature: 9,
    energy: '0.1 MeV',
    logEnergy: -4,
    
    logRadiusIntercept: 3.5,
    
    description: `From 1 second to 20 minutes, leptons (electrons, neutrinos) dominated. Big Bang nucleosynthesis occurred: protons and neutrons fused into light nuclei (hydrogen, helium, lithium). The primordial abundances we measure today were set in these 20 minutes.`,
    
    keyEvents: [
      'Neutrinos decouple (1 s)',
      'Electron-positron annihilation',
      'Big Bang nucleosynthesis (3-20 min)',
      'H, He, Li abundances established',
      '~75% H, ~25% He by mass',
    ],
    
    dominantPhysics: 'Nuclear physics (well understood)',
    particlesPresent: ['Protons', 'Neutrons', 'Electrons', 'Photons', 'Neutrinos', 'Light nuclei'],
    
    color: EPOCH_COLORS.atomic,
    labelPosition: { logR: 6, logM: 20 },
  },
  
  'recombination': {
    id: 'recombination',
    name: 'Recombination',
    shortName: 'Recomb',
    
    timeAfterBigBang: '380,000 years',
    logTime: 13,
    temperature: '3000 K',
    logTemperature: 3.5,
    energy: '0.3 eV',
    logEnergy: -9.5,
    
    logRadiusIntercept: 13.5,
    
    description: `At 380,000 years, the universe cooled enough for electrons to combine with nuclei to form neutral atoms. Photons decoupled from matter – the universe became transparent. These photons are now the Cosmic Microwave Background, stretched by expansion to microwave wavelengths.`,
    
    keyEvents: [
      'Electrons combine with nuclei (neutral atoms form)',
      'Universe becomes transparent to light',
      'Photon decoupling – CMB is released',
      'CMB temperature: 3000 K → now 2.7 K',
      'Dark ages begin (no stars yet)',
    ],
    
    dominantPhysics: 'Atomic physics, plasma physics',
    particlesPresent: ['Neutral atoms (H, He)', 'Photons (decoupled)', 'Dark matter', 'Neutrinos'],
    
    color: EPOCH_COLORS.recombination,
    labelPosition: { logR: 16, logM: 30 },
  },
  
  'now': {
    id: 'now',
    name: 'Present Day',
    shortName: 'Now',
    
    timeAfterBigBang: '13.8 billion years',
    logTime: 17.6,
    temperature: '2.7 K',
    logTemperature: 0.4,
    energy: '2.3 × 10⁻⁴ eV',
    logEnergy: -13.6,
    
    logRadiusIntercept: 28,
    
    description: `The present epoch: 13.8 billion years after the Big Bang. Galaxies, stars, and planets have formed. The universe is accelerating in its expansion, driven by dark energy. We exist in a brief window between the formation of heavy elements in stars and the eventual heat death.`,
    
    keyEvents: [
      'First stars formed (~100-400 Myr)',
      'First galaxies formed (~500 Myr)',
      'Solar system formed (4.6 Gyr ago)',
      'Life appeared on Earth (~4 Gyr ago)',
      'Humans (~300,000 years ago)',
      'Now: dark energy dominates expansion',
    ],
    
    dominantPhysics: 'All Standard Model physics, plus gravity',
    particlesPresent: ['Everything from quarks to superclusters'],
    
    color: EPOCH_COLORS.now,
    labelPosition: { logR: 26, logM: 55 },
  },
}

// ─────────────────────────────────────────────
// DOMINATION ERAS (Ω Parameters)
// ─────────────────────────────────────────────
// These represent which component dominated the
// energy density of the universe at different scales

export const DOMINATION_ERAS: Record<DominationType, DominationEra> = {
  
  'planckian': {
    id: 'planckian',
    name: 'Planckian Unknown',
    symbol: 'Ω_Λᵢ',
    
    // Far left region of diagram
    region: [
      [-45, -50],
      [-33, -50],
      [-33, 70],
      [-45, 70],
    ],
    
    color: DOMINATION_COLORS.planckian,
    description: 'The region below the Planck scale where our physics breaks down entirely. Quantum gravity effects dominate.',
    
    startTime: undefined,
    endTime: 'Planck time (10⁻⁴³ s)',
  },
  
  'radiation': {
    id: 'radiation',
    name: 'Radiation Dominated',
    symbol: 'Ω_r',
    
    // Upper region where radiation energy dominated
    region: [
      [-33, 40],
      [15, 40],
      [15, 70],
      [-33, 70],
    ],
    
    color: DOMINATION_COLORS.radiation,
    description: 'The early universe was dominated by radiation (photons and relativistic particles). Energy density fell as a⁻⁴.',
    
    startTime: 'Planck time',
    endTime: '~47,000 years after Big Bang',
  },
  
  'matter': {
    id: 'matter',
    name: 'Matter Dominated',
    symbol: 'Ω_m',
    
    // Central region
    region: [
      [-10, -10],
      [25, -10],
      [25, 50],
      [-10, 50],
    ],
    
    color: DOMINATION_COLORS.matter,
    description: 'Matter (both ordinary and dark) dominated the energy density. Structure formed as matter clumped gravitationally. Energy density fell as a⁻³.',
    
    startTime: '~47,000 years',
    endTime: '~9.8 billion years (z ≈ 0.4)',
  },
  
  'dark-energy': {
    id: 'dark-energy',
    name: 'Dark Energy Dominated',
    symbol: 'Ω_Λ',
    
    // Lower right region
    region: [
      [20, -50],
      [55, -50],
      [55, 20],
      [20, 20],
    ],
    
    color: DOMINATION_COLORS['dark-energy'],
    description: 'Dark energy now dominates, driving accelerated expansion. Its energy density remains roughly constant as space expands.',
    
    startTime: '~9.8 billion years ago',
    endTime: 'Forever (in ΛCDM)',
  },
}

// ─────────────────────────────────────────────
// EPOCH HELPERS
// ─────────────────────────────────────────────

export const EPOCH_LIST = Object.values(EPOCHS)
export const DOMINATION_LIST = Object.values(DOMINATION_ERAS)

// Get epoch by approximate log time
export function getEpochForLogTime(logTime: number): Epoch | null {
  // Find the epoch whose time is closest
  let closest: Epoch | null = null
  let minDiff = Infinity
  
  for (const epoch of EPOCH_LIST) {
    const diff = Math.abs(epoch.logTime - logTime)
    if (diff < minDiff) {
      minDiff = diff
      closest = epoch
    }
  }
  
  return closest
}
```

---

## FILE: src/app/data/permissible-universe/lib/objects.ts
```tsx
// ===========================================
// THE PERMISSIBLE UNIVERSE - OBJECTS
// ===========================================
// The catalogue of cosmic objects from quarks to superclusters
// Part 1: Fundamental through Solar System

import { CosmicObject } from './types'

// ─────────────────────────────────────────────
// FUNDAMENTAL PARTICLES
// ─────────────────────────────────────────────

const FUNDAMENTAL_PARTICLES: CosmicObject[] = [
  {
    id: 'quark-up',
    name: 'Up Quark',
    category: 'fundamental-particles',
    
    logRadius: -17.5,  // ~3 × 10⁻¹⁸ cm (upper limit from scattering)
    logMass: -27.3,    // 2.2 MeV/c² ≈ 4 × 10⁻²⁷ g
    
    radius: { value: 3, unit: 'am', formatted: '< 10⁻¹⁸ m' },
    mass: { value: 2.2, unit: 'MeV/c²', formatted: '2.2 MeV/c²' },
    
    tagline: 'The lightest quark, found in every proton and neutron',
    description: `The up quark is one of six quark flavors and one of the two that make up ordinary matter. Every proton contains two up quarks and one down quark; every neutron contains one up and two down. Along with the electron, the up quark is one of just three particles needed to build every atom in the universe.`,
    whyThisSize: `Quarks have no known internal structure – they appear point-like in all experiments. The "size" shown is an upper limit from deep inelastic scattering experiments at HERA. Their Compton wavelength (~10⁻¹⁴ cm) is much larger than any structural size.`,
    
    explanations: {
      accessible: `Quarks are the building blocks inside protons and neutrons. The up quark is the lightest, with an electric charge of +2/3. It's held together with other quarks by gluons, never found alone in nature.`,
      intuitive: `In the Standard Model, the up quark is part of the first generation of matter. Its mass of 2.2 MeV/c² comes from interaction with the Higgs field. Quarks carry "color charge" and interact via the strong force.`,
      technical: `The up quark has quantum numbers: Q = +2/3, I₃ = +1/2, B = 1/3, S = C = B' = T = 0. Its mass is a running parameter in QCD: m_u(2 GeV) ≈ 2.2 MeV in MS̄ scheme. Confinement prevents isolation – free color charge would have infinite energy.`,
      advanced: `The u-quark propagator receives radiative corrections from gluon loops, making the current mass scale-dependent. The ratio m_u/m_d ≈ 0.4-0.6 affects isospin violation and the proton-neutron mass difference. Lattice QCD provides non-perturbative calculations.`,
    },
    
    nearbyObjects: ['quark-down', 'electron', 'gluon'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['electroweak', 'nuclear'],
    
    discovered: { year: 1968, by: 'SLAC experiments', how: 'Deep inelastic scattering' },
    notable: true,
  },
  
  {
    id: 'quark-down',
    name: 'Down Quark',
    category: 'fundamental-particles',
    
    logRadius: -17.5,
    logMass: -26.9,    // 4.7 MeV/c²
    
    radius: { value: 3, unit: 'am', formatted: '< 10⁻¹⁸ m' },
    mass: { value: 4.7, unit: 'MeV/c²', formatted: '4.7 MeV/c²' },
    
    tagline: 'Partner to the up quark in ordinary matter',
    description: `The down quark is slightly heavier than the up quark, with a charge of -1/3. This mass difference, though tiny, has enormous consequences: it makes neutrons heavier than protons, causing free neutrons to decay. If down quarks were lighter, protons would decay instead, and atoms couldn't exist.`,
    whyThisSize: `Like the up quark, the down quark appears point-like. The slight mass difference from the up quark comes from different Higgs couplings and QCD effects.`,
    
    explanations: {
      accessible: `The down quark carries charge -1/3 and is found in both protons (1 down, 2 up) and neutrons (2 down, 1 up). Its mass – just slightly more than the up quark – determines which nuclear reactions are possible.`,
      intuitive: `The down quark's slightly larger mass comes from its different Yukawa coupling to the Higgs field. The mass difference m_d - m_u ≈ 2.5 MeV explains why neutrons decay into protons (beta decay), not vice versa.`,
      technical: `With m_d(2 GeV) ≈ 4.7 MeV (MS̄), the d-quark is ~2× heavier than the u-quark. This breaks isospin symmetry and affects: neutron lifetime, pion mass splitting, nuclear stability, and hadronic physics.`,
    },
    
    nearbyObjects: ['quark-up', 'electron', 'proton'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['nuclear'],
    
    discovered: { year: 1968, by: 'SLAC experiments' },
  },
  
  {
    id: 'electron',
    name: 'Electron',
    category: 'fundamental-particles',
    
    logRadius: -20.6,  // Compton wavelength ~3.8 × 10⁻¹¹ cm, but structureless to 10⁻²⁰
    logMass: -27.04,   // 0.511 MeV/c² = 9.1 × 10⁻²⁸ g
    
    radius: { value: 0.5, unit: 'MeV/c²', formatted: '< 10⁻²⁰ m' },
    mass: { value: 0.511, unit: 'MeV/c²', formatted: '0.511 MeV/c²' },
    
    tagline: 'The particle that makes chemistry possible',
    description: `The electron is perhaps the most important particle for everyday existence. Its negative charge binds atoms together, creating all of chemistry. Every electric current, every chemical bond, every light we see involves electrons. Yet the electron itself is pointlike – experiments show no structure down to 10⁻²⁰ meters.`,
    whyThisSize: `The electron appears structurally pointlike but is "smeared" over its Compton wavelength (~10⁻¹¹ cm) in quantum mechanics. Below this scale, pair production prevents further localization. The diagram shows its experimental size limit.`,
    
    explanations: {
      accessible: `The electron orbits atomic nuclei and carries the electrical current in wires. It was the first subatomic particle discovered (1897) and remains the lightest charged particle known.`,
      intuitive: `With mass 0.511 MeV/c² and charge -e, the electron is a lepton (doesn't feel strong force). Its magnetic moment reveals QED: g ≈ 2.00231..., matching theory to 12 decimal places – the most precise prediction in physics.`,
      technical: `The electron is a spin-1/2 fermion obeying the Dirac equation. QED describes its interactions with photons to extraordinary precision. The anomalous magnetic moment (g-2)/2 = α/(2π) + O(α²) probes physics beyond the Standard Model.`,
      advanced: `The electron's g-2 is calculated to 5 loops in QED plus hadronic and electroweak corrections. Current experimental value differs from SM prediction by ~4.2σ (Fermilab 2023), potentially indicating new physics. The electron EDM constrains CP violation.`,
    },
    
    nearbyObjects: ['muon', 'quark-up', 'neutrino-electron'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['electroweak', 'atomic'],
    
    discovered: { year: 1897, by: 'J.J. Thomson', how: 'Cathode ray experiments' },
    notable: true,
  },
  
  {
    id: 'neutrino-electron',
    name: 'Electron Neutrino',
    category: 'fundamental-particles',
    
    logRadius: -20,    // Unknown; Compton wavelength for ~1 eV mass
    logMass: -32,      // ~1 eV/c² upper limit ≈ 10⁻³² g
    
    radius: { value: 1, unit: 'eV/c²', formatted: 'Pointlike' },
    mass: { value: 1, unit: 'eV/c²', formatted: '< 1 eV/c²' },
    
    tagline: 'The ghost particle that passes through Earth',
    description: `Neutrinos are the most elusive particles in the Standard Model. They interact only via the weak force, so ghostly that a typical neutrino can pass through a light-year of lead without interacting. Yet 100 trillion neutrinos from the Sun pass through your body every second. Their tiny but non-zero mass was only confirmed in 1998.`,
    whyThisSize: `Neutrino mass was long assumed to be zero. Neutrino oscillations proved otherwise – but the mass is so tiny (< 1 eV) that the Compton wavelength is macroscopic. Neutrinos have no known internal structure.`,
    
    explanations: {
      accessible: `Neutrinos are produced in nuclear reactions (like in the Sun) and barely interact with matter. Trillions pass through you undetected right now. Their ability to "oscillate" between types proved they have mass.`,
      intuitive: `Three flavors exist (electron, muon, tau), each paired with a charged lepton. They're left-handed only in the Standard Model. Mass arises from physics beyond SM – possibly right-handed partners or Majorana nature.`,
      technical: `Neutrino oscillations imply non-zero mass differences: Δm²₂₁ ≈ 7.5×10⁻⁵ eV², |Δm²₃₁| ≈ 2.5×10⁻³ eV². The PMNS matrix describes mixing. Absolute mass scale from cosmology: Σmᵥ < 0.12 eV (Planck).`,
      advanced: `The seesaw mechanism explains tiny masses via heavy right-handed neutrinos: mᵥ ~ v²/M_R. Neutrinoless double beta decay would prove Majorana nature. CP violation in neutrino sector may explain baryon asymmetry (leptogenesis).`,
    },
    
    nearbyObjects: ['electron', 'photon', 'higgs'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['atomic'],
    
    discovered: { year: 1956, by: 'Cowan & Reines', how: 'Reactor neutrino detection' },
  },
  
  {
    id: 'higgs',
    name: 'Higgs Boson',
    category: 'fundamental-particles',
    
    logRadius: -16.8,  // ~10⁻¹⁷ cm (interaction range)
    logMass: -22.1,    // 125 GeV/c² ≈ 2.2 × 10⁻²² g
    
    radius: { value: 125, unit: 'GeV/c²', formatted: '~10⁻¹⁸ m' },
    mass: { value: 125, unit: 'GeV/c²', formatted: '125 GeV/c²' },
    
    tagline: 'The particle that gives mass to matter',
    description: `The Higgs boson is the quantum of the Higgs field – a field that permeates all of space. Other particles gain mass by interacting with this field: the more strongly a particle couples to the Higgs, the heavier it is. Predicted in 1964, the Higgs was finally discovered at CERN in 2012, completing the Standard Model.`,
    whyThisSize: `The Higgs is much heavier than other bosons (photon, gluon are massless; W/Z are ~80-90 GeV). This mass – why 125 GeV and not higher or lower – is unexplained and connects to the hierarchy problem.`,
    
    explanations: {
      accessible: `The Higgs field fills all of space. Particles moving through it interact with it, and this interaction appears as mass. The Higgs boson is a ripple in this field, produced at particle colliders.`,
      intuitive: `The Higgs mechanism breaks electroweak symmetry spontaneously. Before breaking, W and Z bosons are massless; after, they acquire mass from the Higgs field's vacuum expectation value v ≈ 246 GeV.`,
      technical: `The Higgs potential V(φ) = -μ²|φ|² + λ|φ|⁴ has minimum at |φ| = v/√2. Fluctuations around the minimum give the Higgs boson mass m_H = √(2λ)v. Current precision: m_H = 125.25 ± 0.17 GeV.`,
      advanced: `The hierarchy problem: m_H receives quadratic quantum corrections ~ Λ² from every mass scale. Without fine-tuning or new physics (supersymmetry, compositeness, extra dimensions), m_H should be at the Planck scale.`,
    },
    
    nearbyObjects: ['w-boson', 'z-boson', 'quark-top'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['electroweak'],
    
    discovered: { year: 2012, by: 'ATLAS and CMS (CERN)', how: 'LHC proton collisions' },
    notable: true,
  },
  
  {
    id: 'photon',
    name: 'Photon',
    category: 'fundamental-particles',
    
    logRadius: -10,    // No intrinsic size; wavelength varies
    logMass: -50,      // Massless (< 10⁻⁵⁰ g experimental limit)
    
    radius: { value: 0, unit: '', formatted: 'Massless' },
    mass: { value: 0, unit: '', formatted: '0' },
    
    tagline: 'Light itself, the messenger of electromagnetism',
    description: `The photon is the quantum of light – every beam of light is a stream of photons. Massless and traveling at the universal speed limit, photons carry the electromagnetic force between charged particles. Radio waves, microwaves, visible light, X-rays, and gamma rays are all photons, differing only in frequency.`,
    whyThisSize: `The photon has zero rest mass (to exceptional precision: < 10⁻¹⁸ eV). Its "size" is its wavelength, which can range from radio waves (kilometers) to gamma rays (10⁻¹⁴ m). The diagram position shows masslessness.`,
    
    explanations: {
      accessible: `Light is made of photons – particles with no mass that travel at 299,792,458 m/s. Different colors are photons with different energies. Photons also carry the electric and magnetic forces.`,
      intuitive: `As the gauge boson of U(1)_EM, the photon mediates electromagnetic interactions. Its masslessness comes from gauge symmetry – a mass term would break gauge invariance.`,
      technical: `Experimentally, m_γ < 10⁻¹⁸ eV from geomagnetic field measurements. The Proca equation describes massive spin-1 particles; the limit is how close we've verified Maxwell's equations.`,
    },
    
    nearbyObjects: ['gluon', 'electron', 'w-boson'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['recombination'],
    
    discovered: { year: 1905, by: 'Einstein', how: 'Photoelectric effect explanation' },
    notable: true,
  },
]

// ─────────────────────────────────────────────
// COMPOSITE PARTICLES
// ─────────────────────────────────────────────

const COMPOSITE_PARTICLES: CosmicObject[] = [
  {
    id: 'proton',
    name: 'Proton',
    category: 'composite-particles',
    
    logRadius: -13.1,  // ~8.8 × 10⁻¹⁴ cm
    logMass: -23.78,   // 938 MeV/c² = 1.67 × 10⁻²⁴ g
    
    radius: { value: 0.88, unit: 'fm', formatted: '0.88 fm' },
    mass: { value: 938, unit: 'MeV/c²', formatted: '938 MeV/c²' },
    
    tagline: 'The stable heart of every atom',
    description: `The proton is one of nature's success stories: stable (or nearly so – lifetime > 10³⁴ years), positively charged, and found in every atomic nucleus. Two up quarks and one down quark, bound by gluons, create a particle whose mass is 100× greater than its constituent quarks. Most of a proton's mass comes from the energy of the strong force holding it together.`,
    whyThisSize: `The proton radius (~0.88 fm) is set by QCD confinement – the scale at which the strong force becomes infinitely strong and quarks cannot escape. This is the characteristic size of all hadrons.`,
    
    explanations: {
      accessible: `The proton is found in every atom's nucleus. Its positive charge balances the electron's negative charge. A hydrogen atom is just one proton with one electron.`,
      intuitive: `The proton's mass (938 MeV) is mostly binding energy, not quark masses (~10 MeV total). This demonstrates E = mc²: the strong force energy manifests as mass.`,
      technical: `The proton charge radius r_p = 0.8414(19) fm (muonic hydrogen, 2019) resolved the "proton radius puzzle." Structure functions from DIS reveal parton distribution functions.`,
      advanced: `Lattice QCD calculates proton mass from first principles: m_p = m_u + m_d + m_g + ⟨kinetic energy⟩ + ⟨potential energy⟩. The nucleon sigma term σ_πN measures pion-nucleon coupling.`,
    },
    
    nearbyObjects: ['neutron', 'pion-plus', 'quark-up'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['nuclear'],
    
    discovered: { year: 1917, by: 'Rutherford', how: 'Nuclear transmutation experiments' },
    notable: true,
  },
  
  {
    id: 'neutron',
    name: 'Neutron',
    category: 'composite-particles',
    
    logRadius: -13.1,
    logMass: -23.77,   // 939.6 MeV/c²
    
    radius: { value: 0.86, unit: 'fm', formatted: '~0.86 fm' },
    mass: { value: 939.6, unit: 'MeV/c²', formatted: '939.6 MeV/c²' },
    
    tagline: 'The unstable partner in atomic nuclei',
    description: `The neutron is the proton's slightly heavier partner. Though stable inside nuclei, a free neutron decays in about 10 minutes via beta decay: neutron → proton + electron + antineutrino. This instability, caused by the down quark being heavier than the up quark, shapes which nuclei are stable and powers nuclear reactors.`,
    whyThisSize: `Nearly identical to the proton in size – both are set by QCD confinement. The mass difference (1.3 MeV) comes from the d-quark being heavier than the u-quark, plus electromagnetic effects.`,
    
    explanations: {
      accessible: `Neutrons have no electric charge but are essential for atomic nuclei. Without them, protons would repel each other and no elements beyond hydrogen could exist.`,
      intuitive: `Free neutrons decay: n → p + e⁻ + ν̄_e (τ ≈ 880 s). Inside nuclei, this is suppressed by energy considerations. The neutron-proton mass difference (1.293 MeV) drives beta decay.`,
      technical: `The neutron lifetime (τ = 877.75 ± 0.28 s bottle method vs 887.7 ± 1.2 s beam method) shows a 4σ discrepancy – the "neutron lifetime puzzle."`,
    },
    
    nearbyObjects: ['proton', 'quark-down', 'pion-minus'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['nuclear', 'atomic'],
    
    discovered: { year: 1932, by: 'Chadwick', how: 'Beryllium bombardment' },
    notable: true,
  },
  
  {
    id: 'qgp',
    name: 'Quark-Gluon Plasma',
    category: 'composite-particles',
    
    logRadius: -11,    // Created in ~10⁻¹¹ cm droplets at RHIC/LHC
    logMass: -18,      // Variable – depends on collision
    
    radius: { value: 5, unit: 'fm', formatted: '~5-10 fm droplets' },
    mass: { value: 1000, unit: 'GeV', formatted: '~TeV scale' },
    
    tagline: 'The primordial soup of the early universe, recreated on Earth',
    description: `In the first microseconds after the Big Bang, the universe was too hot for protons and neutrons. Quarks and gluons flowed freely in a plasma state. This quark-gluon plasma (QGP) is now recreated in heavy-ion collisions at RHIC and LHC. Surprisingly, QGP behaves like a nearly perfect liquid, not a gas.`,
    whyThisSize: `QGP exists only at extreme temperatures (>2 trillion K) and densities. At RHIC/LHC, gold or lead nuclei collide to create tiny QGP droplets lasting ~10⁻²³ seconds before hadronizing.`,
    
    explanations: {
      accessible: `For a brief instant after the Big Bang, there were no protons or neutrons – just a hot soup of quarks and gluons. Scientists recreate this in particle colliders.`,
      intuitive: `Above the QCD deconfinement temperature T_c ≈ 170 MeV (~2 trillion K), hadrons "melt" into constituent quarks and gluons. The phase transition is a crossover, not first-order.`,
      technical: `QGP viscosity η/s ≈ 1/(4π) approaches the conjectured lower bound from AdS/CFT. Jet quenching and collective flow confirm strong coupling. Lattice QCD predicts T_c and equation of state.`,
    },
    
    nearbyObjects: ['proton', 'quark-up', 'gluon'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['nuclear'],
    
    discovered: { year: 2005, by: 'RHIC experiments', how: 'Gold-gold collisions' },
    notable: true,
  },
]

// ─────────────────────────────────────────────
// ATOMS & MOLECULES
// ─────────────────────────────────────────────

const ATOMS_MOLECULES: CosmicObject[] = [
  {
    id: 'hydrogen-atom',
    name: 'Hydrogen Atom',
    category: 'atoms-molecules',
    
    logRadius: -8.3,   // Bohr radius ~5.3 × 10⁻⁹ cm
    logMass: -23.8,    // ~1.67 × 10⁻²⁴ g
    
    radius: { value: 53, unit: 'pm', formatted: '53 pm (Bohr radius)' },
    mass: { value: 1.008, unit: 'u', formatted: '1.008 u' },
    
    tagline: 'The simplest atom, and 75% of all atoms in the universe',
    description: `Hydrogen is the simplest atom: one proton, one electron. It's also the most abundant, comprising about 75% of the universe's ordinary matter by mass. Hydrogen fusion powers stars, including our Sun. The quantum mechanics of hydrogen – its discrete energy levels – was the first triumph of quantum theory.`,
    whyThisSize: `The Bohr radius a₀ = ℏ²/(mₑe²) ≈ 53 pm is where quantum pressure balances electric attraction. This sets the scale for all atoms. Hydrogen is the prototype.`,
    
    explanations: {
      accessible: `Hydrogen has one proton and one electron. When hydrogen atoms fuse into helium in the Sun's core, the lost mass becomes the energy that lights our world.`,
      intuitive: `The Bohr model gives atomic sizes: a₀ = 53 pm. Real orbitals are probability clouds, but Bohr radius sets the scale. Energy levels E_n = -13.6/n² eV explain atomic spectra.`,
      technical: `The hydrogen spectrum is exactly solvable: eigenstates ψ_nlm, energies E_n = -m_e·e⁴/(2ℏ²n²). Fine structure (α² corrections) and Lamb shift (QED) test fundamental physics.`,
    },
    
    nearbyObjects: ['proton', 'helium-atom', 'electron'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['recombination'],
    
    discovered: { year: 1766, by: 'Cavendish', how: 'Isolated as a gas' },
    notable: true,
  },
  
  {
    id: 'dna-double-helix',
    name: 'DNA Double Helix',
    category: 'atoms-molecules',
    
    logRadius: -7,     // 2nm diameter
    logMass: -8,       // Varies with length; human genome ~10⁻⁸ g
    
    radius: { value: 2, unit: 'nm', formatted: '2 nm diameter' },
    mass: { value: 3.1, unit: 'billion Da', formatted: '~10⁻¹¹ g per human genome' },
    
    tagline: 'The molecule that encodes all known life',
    description: `DNA is the information molecule of life: a twisted ladder of nucleotides that encodes the instructions for building every living organism. A single human cell contains about 2 meters of DNA packed into a nucleus just 6 micrometers across. The genetic code – the mapping from DNA to proteins – is nearly universal across all life.`,
    whyThisSize: `The 2nm diameter is set by the geometry of base pairing: adenine-thymine and guanine-cytosine. The sugar-phosphate backbone provides the structural framework. Length varies from viral genomes (thousands of base pairs) to plant genomes (billions).`,
    
    explanations: {
      accessible: `DNA is like a twisted ladder made of four "letters" (A, T, G, C). The sequence of these letters is a code that tells cells how to build proteins and run the machinery of life.`,
      intuitive: `The double helix structure (discovered 1953) explains replication: each strand serves as a template for its complement. Base pairs are ~0.34 nm apart; 10 bp per turn.`,
      technical: `DNA stores information at ~2 bits per base pair. Human genome: ~3 billion bp = ~6 billion bits ≈ 750 MB. Polymerases read/copy at ~1000 bp/s with error rates ~10⁻⁹ after proofreading.`,
    },
    
    nearbyObjects: ['ribosome', 'protein-hemoglobin', 'virus-bacteriophage'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    
    discovered: { year: 1953, by: 'Watson, Crick, Franklin, Wilkins', how: 'X-ray crystallography' },
    notable: true,
  },
  
  {
    id: 'water-molecule',
    name: 'Water Molecule',
    category: 'atoms-molecules',
    
    logRadius: -8.5,   // ~3 Å diameter
    logMass: -22.5,    // 18 Da ≈ 3 × 10⁻²³ g
    
    radius: { value: 2.75, unit: 'Å', formatted: '~2.75 Å' },
    mass: { value: 18, unit: 'Da', formatted: '18 Da' },
    
    tagline: 'The molecule of life, with extraordinary properties',
    description: `Water is the most important molecule for life: it covers 71% of Earth's surface, makes up 60% of your body, and participates in nearly every biochemical reaction. Its unusual properties (high surface tension, liquid at room temperature, ice floating) arise from hydrogen bonding between H₂O molecules.`,
    whyThisSize: `The H-O-H bond angle (104.5°) and O-H bond length (0.96 Å) arise from oxygen's electron configuration. The bent geometry creates a dipole moment, enabling hydrogen bonding.`,
    
    explanations: {
      accessible: `Water molecules are bent, with oxygen in the middle and two hydrogens at an angle. This shape makes water slightly charged on each end, allowing molecules to stick together.`,
      intuitive: `Water's 104.5° bond angle (not 90° from p-orbitals or 109° from sp³) comes from repulsion between bonding and lone pairs. The resulting dipole (1.85 D) enables H-bonding.`,
      technical: `Each water molecule can form 4 hydrogen bonds (2 donor, 2 acceptor). The tetrahedral H-bond network explains ice structure, high heat capacity, and anomalous density maximum at 4°C.`,
    },
    
    nearbyObjects: ['hydrogen-atom', 'carbon-dioxide', 'ammonia'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    
    notable: true,
  },
]

// ─────────────────────────────────────────────
// VIRUSES & CELLS
// ─────────────────────────────────────────────

const VIRUSES_CELLS: CosmicObject[] = [
  {
    id: 'virus-sars-cov-2',
    name: 'SARS-CoV-2',
    category: 'viruses-cells',
    
    logRadius: -5.1,   // ~80-120 nm diameter
    logMass: -15,      // ~1 femtogram
    
    radius: { value: 100, unit: 'nm', formatted: '~100 nm diameter' },
    mass: { value: 1, unit: 'fg', formatted: '~1 fg' },
    
    tagline: 'The virus that changed the world in 2020',
    description: `SARS-CoV-2 is the coronavirus responsible for COVID-19. A sphere about 100 nanometers across, studded with spike proteins, it contains a single strand of RNA encoding ~30,000 nucleotides. This tiny package infected hundreds of millions and killed millions, demonstrating how something 1000× smaller than a human cell can reshape civilizations.`,
    whyThisSize: `Coronaviruses need to package their genome (~30 kb RNA) plus proteins. The spike proteins (~10 nm each) create the characteristic "crown." This size allows airborne transmission via respiratory droplets.`,
    
    explanations: {
      accessible: `COVID is caused by a tiny virus, 1000× smaller than a human cell. It has a sphere with spikes that latch onto our cells, injecting RNA that hijacks the cell's machinery to make more viruses.`,
      intuitive: `The virus is ~100 nm: larger than most proteins, smaller than bacteria. It carries ~30 kb of RNA (compared to 3 billion bp in human DNA). Mutation rate ~10⁻³ per site per year drives variant emergence.`,
      technical: `Structure: lipid bilayer envelope, S/M/E/N proteins, +ssRNA genome. Spike receptor-binding domain binds ACE2 with K_d ~15 nM. Viral load peaks ~10⁹ copies/mL in respiratory tract.`,
    },
    
    nearbyObjects: ['virus-bacteriophage', 'ribosome', 'bacterium-ecoli'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    
    discovered: { year: 2020, by: 'Chinese researchers', how: 'Genome sequencing' },
    notable: true,
  },
  
  {
    id: 'bacterium-ecoli',
    name: 'E. coli Bacterium',
    category: 'viruses-cells',
    
    logRadius: -4,     // ~1-2 μm
    logMass: -12,      // ~1 picogram
    
    radius: { value: 1, unit: 'μm', formatted: '~1-2 μm' },
    mass: { value: 1, unit: 'pg', formatted: '~1 pg' },
    
    tagline: 'The workhorse of molecular biology, living in your gut right now',
    description: `Escherichia coli is a rod-shaped bacterium that lives in the intestines of warm-blooded animals, including humans. Though some strains cause disease, most are harmless or beneficial. E. coli is the most studied organism in biology – the model system for understanding genes, proteins, and metabolism. Trillions live in your gut right now.`,
    whyThisSize: `Bacterial size is constrained by diffusion: nutrients and waste must reach all parts of the cell. At ~1 μm, E. coli optimizes surface area to volume while fitting a 4.6 million base pair genome.`,
    
    explanations: {
      accessible: `E. coli bacteria live in your intestines and help digest food. Scientists use them to study how life works because they're simple and grow fast (dividing every 20 minutes).`,
      intuitive: `With ~4,300 genes in 4.6 Mb of DNA, E. coli is a complete organism: metabolism, replication, gene regulation. Generation time ~20 min under optimal conditions. ~10⁸ ribosomes per cell.`,
      technical: `E. coli K-12 is the reference genome. Transcription: ~50-90 nucleotides/s. Translation: ~20 amino acids/s. Proteome: ~4,000 proteins per cell. Metabolic network: ~2,000 reactions.`,
    },
    
    nearbyObjects: ['virus-bacteriophage', 'human-red-blood-cell', 'mitochondrion'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    
    discovered: { year: 1885, by: 'Theodor Escherich' },
    notable: true,
  },
  
  {
    id: 'human-red-blood-cell',
    name: 'Human Red Blood Cell',
    category: 'viruses-cells',
    
    logRadius: -3.1,   // ~8 μm diameter
    logMass: -10,      // ~90 femtograms
    
    radius: { value: 8, unit: 'μm', formatted: '~8 μm diameter' },
    mass: { value: 90, unit: 'pg', formatted: '~90 pg' },
    
    tagline: 'Oxygen taxi: 25 trillion serve your body',
    description: `Red blood cells are biconcave discs about 8 micrometers across – perfectly shaped to squeeze through capillaries smaller than themselves. Each contains 270 million hemoglobin molecules, each carrying 4 oxygen molecules. Your body contains about 25 trillion red blood cells, replaced at a rate of 2 million per second.`,
    whyThisSize: `The 8 μm diameter and biconcave shape maximize surface area for gas exchange while allowing passage through 3 μm capillaries. Lacking a nucleus, red blood cells are pure oxygen-delivery machines.`,
    
    explanations: {
      accessible: `Red blood cells carry oxygen from lungs to tissues and return carbon dioxide for exhaling. Their unusual shape – like a donut without a hole – helps them squeeze through tiny blood vessels.`,
      intuitive: `Mature red blood cells have no nucleus or organelles – they're bags of hemoglobin. ~270 million Hb molecules per cell × 4 O₂ per Hb = ~1 billion O₂ molecules capacity per cell.`,
      technical: `RBC lifespan ~120 days. Deformability index (ability to pass through 3 μm filters) is a diagnostic marker. Hemoglobin O₂ binding: cooperative with Hill coefficient ~2.8.`,
    },
    
    nearbyObjects: ['bacterium-ecoli', 'human-sperm-cell', 'paramecium'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
  },
]

// ─────────────────────────────────────────────
// MACROSCOPIC LIFE
// ─────────────────────────────────────────────

const MACROSCOPIC_LIFE: CosmicObject[] = [
  {
    id: 'flea',
    name: 'Flea',
    category: 'macroscopic-life',
    
    logRadius: -1.5,   // ~2-3 mm
    logMass: -3,       // ~1 mg
    
    radius: { value: 2, unit: 'mm', formatted: '2-3 mm' },
    mass: { value: 1, unit: 'mg', formatted: '~1 mg' },
    
    tagline: 'The champion jumper, visible to the naked eye',
    description: `Fleas are tiny insects that can jump 150× their body length – equivalent to a human jumping over a skyscraper. They're at the boundary of macroscopic life: just visible to the naked eye, yet with complete organ systems. Their jumping ability comes from a protein called resilin that stores and releases energy like a super-efficient spring.`,
    whyThisSize: `At ~2mm, fleas are large enough for complex organs but small enough that surface effects (like air resistance) dominate over inertia, enabling their extraordinary jumps.`,
    
    explanations: {
      accessible: `Fleas are tiny jumping insects that feed on blood. Despite their size, they have hearts, brains, and all the organs of larger animals. They can jump 100× their body length.`,
      intuitive: `Flea jumps: ~200g acceleration, ~1 m/s takeoff velocity, powered by compressed resilin (96% energy return). The catapult mechanism explains how small organisms generate disproportionate power.`,
      technical: `Scaling laws: power ∝ mass, so small animals can't generate large absolute forces. Fleas cheat via elastic energy storage – resilin pre-loaded by muscles over ~100 ms, released in ~1 ms.`,
    },
    
    nearbyObjects: ['fruit-fly', 'ant', 'human'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
  },
  
  {
    id: 'human',
    name: 'Human',
    category: 'macroscopic-life',
    
    logRadius: 2.2,    // ~1.7 m height (using half-height as radius)
    logMass: 4.85,     // ~70 kg = 7 × 10⁴ g
    
    radius: { value: 1.7, unit: 'm', formatted: '~1.7 m' },
    mass: { value: 70, unit: 'kg', formatted: '~70 kg' },
    
    tagline: 'The observer, roughly in the middle of the cosmic scale',
    description: `Humans occupy a remarkable position on the mass-radius diagram: roughly in the middle of the permissible zone, between atoms and galaxies. With ~37 trillion cells, 206 bones, and 86 billion neurons, we're complex enough to ask questions about the diagram itself. Our size is set by the compromise between gravity and the strength of chemical bonds.`,
    whyThisSize: `Land animal size is limited by the strength of bones (∝ cross-section ∝ r²) vs. weight (∝ volume ∝ r³). Above ~10 tons, legs would need to be impractically thick. Below ~1 mm, surface tension dominates.`,
    
    explanations: {
      accessible: `You're made of about 37 trillion cells, containing roughly 7 octillion atoms (7,000,000,000,000,000,000,000,000,000). Your atoms were forged in stars billions of years ago.`,
      intuitive: `Human body: 60% water by mass. ~7 billion billion billion atoms. Most abundant: oxygen (65%), carbon (18%), hydrogen (10%), nitrogen (3%). Trace elements essential for enzymes.`,
      technical: `Metabolic rate ~80W. Neural computation: ~20W, ~10¹⁵ synapses. Information processing estimates vary from 10 bits/s (conscious) to 10¹⁰ bits/s (total sensory).`,
      advanced: `Humans exist in a narrow "habitable zone" of the diagram: large enough for complex neural networks, small enough for planetary gravity. The anthropic principle asks why.`,
    },
    
    nearbyObjects: ['blue-whale', 'elephant', 'flea'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
    labelOffset: { x: 10, y: -10 },
  },
  
  {
    id: 'blue-whale',
    name: 'Blue Whale',
    category: 'macroscopic-life',
    
    logRadius: 3.4,    // ~25-30 m
    logMass: 8.2,      // ~150,000 kg
    
    radius: { value: 30, unit: 'm', formatted: '~30 m' },
    mass: { value: 150, unit: 'tonnes', formatted: '~150 tonnes' },
    
    tagline: 'The largest animal ever to exist on Earth',
    description: `The blue whale is the largest animal known to have ever lived – larger than any dinosaur. At up to 30 meters long and 150 tonnes, it's supported by water's buoyancy; it couldn't survive on land. Its heart is the size of a small car, beating 8-10 times per minute. A blue whale's tongue alone weighs as much as an elephant.`,
    whyThisSize: `Aquatic animals can be larger than terrestrial ones because water supports their weight. The limit is metabolic: sustaining such mass requires consuming 4 tonnes of krill daily, filtering 90 tonnes of water per mouthful.`,
    
    explanations: {
      accessible: `Blue whales are so big that their heart is the size of a car, and a small child could crawl through their arteries. They're bigger than any dinosaur ever was.`,
      intuitive: `Body size scales: metabolic rate ∝ mass^0.75 (Kleiber's law). A 150-tonne whale needs ~300× more food than a 70 kg human, not 2000×. Efficiency increases with size.`,
      technical: `Diving physiology: bradycardia to 2 bpm during dives, blood oxygen stores in myoglobin, lactate tolerance. Maximum dive depth ~500m, duration ~30 min.`,
    },
    
    nearbyObjects: ['human', 'elephant', 'sequoia'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
  },
]

// ─────────────────────────────────────────────
// SOLAR SYSTEM BODIES
// ─────────────────────────────────────────────

const SOLAR_SYSTEM: CosmicObject[] = [
  {
    id: 'earth',
    name: 'Earth',
    category: 'solar-system',
    
    logRadius: 8.8,    // 6,371 km = 6.4 × 10⁸ cm
    logMass: 27.8,     // 5.97 × 10²⁷ g
    
    radius: { value: 6371, unit: 'km', formatted: '6,371 km' },
    mass: { value: 5.97, unit: '×10²⁴ kg', formatted: '5.97 × 10²⁴ kg' },
    
    tagline: 'The only known harbor for life in the cosmos',
    description: `Earth is the largest rocky planet in our solar system and the only place where life is confirmed to exist. Its size allows it to retain a thick atmosphere; its distance from the Sun places it in the habitable zone; its magnetic field shields life from solar radiation. 4.5 billion years old, it's geologically active with plate tectonics continuously recycling its surface.`,
    whyThisSize: `Earth's mass is set by the amount of rock and metal that accreted in its orbital zone. It's large enough for geological activity and atmosphere retention, small enough to remain rocky rather than becoming a gas giant.`,
    
    explanations: {
      accessible: `Earth is the perfect size: big enough to hold an atmosphere but small enough to have a solid surface. It's the only rocky planet with liquid water oceans and active plate tectonics.`,
      intuitive: `Mean density 5.5 g/cm³ implies iron core + rocky mantle. Surface gravity 9.8 m/s². Escape velocity 11.2 km/s – enough to retain N₂, O₂, H₂O but not H₂ or He.`,
      technical: `Earth's heat budget: ~47 TW total, ~50% from radioactive decay (U, Th, K), ~50% primordial heat. Drives plate tectonics and magnetic dynamo. Without internal heat, would be geologically dead like Mars.`,
    },
    
    nearbyObjects: ['moon', 'venus', 'mars'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    
    discovered: { year: 1543, by: 'Copernicus (as a planet)', how: 'Heliocentric model' },
    notable: true,
  },
  
  {
    id: 'moon',
    name: 'The Moon',
    category: 'solar-system',
    
    logRadius: 8.24,   // 1,737 km
    logMass: 25.87,    // 7.35 × 10²⁵ g
    
    radius: { value: 1737, unit: 'km', formatted: '1,737 km' },
    mass: { value: 7.35, unit: '×10²² kg', formatted: '7.35 × 10²² kg' },
    
    tagline: 'Earth's companion, the only world humans have walked on beyond Earth',
    description: `The Moon is Earth's only natural satellite and the fifth-largest moon in the solar system. It likely formed from debris after a Mars-sized body collided with early Earth. The Moon stabilizes Earth's axial tilt, creates tides, and has inspired human culture since prehistory. Twelve humans have walked on its surface.`,
    whyThisSize: `The Moon is unusually large relative to its planet (~1/81 Earth's mass). This giant impact origin explains both its size and its low density (lacking iron core material).`,
    
    explanations: {
      accessible: `The Moon formed when a Mars-sized planet crashed into Earth billions of years ago. The debris coalesced into our Moon. It's slowly moving away from Earth – 3.8 cm per year.`,
      intuitive: `Tidal locking: Moon's rotation = orbital period (27.3 days), so one face always points toward Earth. Tidal forces are slowing Earth's rotation and pushing Moon outward.`,
      technical: `Giant impact hypothesis supported by: Moon's lack of iron core, isotopic similarity to Earth, high angular momentum of Earth-Moon system. Impact ~4.5 Gya, Moon formed within ~100 Myr.`,
    },
    
    nearbyObjects: ['earth', 'mars', 'phobos'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
  },
  
  {
    id: 'jupiter',
    name: 'Jupiter',
    category: 'solar-system',
    
    logRadius: 9.85,   // 69,911 km
    logMass: 30.28,    // 1.9 × 10³⁰ g
    
    radius: { value: 69911, unit: 'km', formatted: '69,911 km' },
    mass: { value: 1.9, unit: '×10²⁷ kg', formatted: '1.9 × 10²⁷ kg (318 M⊕)' },
    
    tagline: 'The king of planets, failed star, solar system's guardian',
    description: `Jupiter is the largest planet in our solar system – so massive that it contains more matter than all other planets combined. Yet it's only 1/1000 the mass of the Sun, far short of the ~80× Jupiter masses needed for hydrogen fusion. Its immense gravity has shaped the solar system, deflecting asteroids and comets that might otherwise strike Earth.`,
    whyThisSize: `Jupiter accumulated most of the gas in the outer solar system. Its growth stopped when the Sun ignited and blew away remaining gas. At 10-20× its current mass, it would have become a brown dwarf.`,
    
    explanations: {
      accessible: `Jupiter is so big that 1,300 Earths could fit inside it. It's made mostly of hydrogen and helium, like a small star that never ignited. Its Great Red Spot is a storm bigger than Earth.`,
      intuitive: `Jupiter's core: ~10-20 Earth masses of rock/ice, compressed to ~20,000 K. Above: metallic hydrogen (electron-degenerate) generating magnetic field 20,000× Earth's.`,
      technical: `Jupiter radiates 1.7× energy it receives from Sun – gravitational contraction heating. Kelvin-Helmholtz cooling time ~10⁹ years. Core pressure ~40 Mbar, density ~20 g/cm³.`,
    },
    
    nearbyObjects: ['saturn', 'sun', 'brown-dwarf'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
  },
]

// ─────────────────────────────────────────────
// EXPORT ALL OBJECTS
// ─────────────────────────────────────────────

export const COSMIC_OBJECTS: CosmicObject[] = [
  ...FUNDAMENTAL_PARTICLES,
  ...COMPOSITE_PARTICLES,
  ...ATOMS_MOLECULES,
  ...VIRUSES_CELLS,
  ...MACROSCOPIC_LIFE,
  ...SOLAR_SYSTEM,
]

// Create lookup map
export const OBJECTS_MAP = new Map<string, CosmicObject>(
  COSMIC_OBJECTS.map(obj => [obj.id, obj])
)

export function getObject(id: string): CosmicObject | undefined {
  return OBJECTS_MAP.get(id)
}
```

---

## FILE: src/app/data/permissible-universe/lib/objects-part2.ts
```tsx
// ===========================================
// THE PERMISSIBLE UNIVERSE - OBJECTS (Part 2)
// ===========================================
// Stars, stellar remnants, black holes, galaxies, cosmic structures

import { CosmicObject } from './types'

// ─────────────────────────────────────────────
// STARS
// ─────────────────────────────────────────────

export const STARS: CosmicObject[] = [
  {
    id: 'sun',
    name: 'The Sun',
    category: 'stars',
    
    logRadius: 10.84,  // 6.96 × 10¹⁰ cm
    logMass: 33.3,     // 1.99 × 10³³ g
    
    radius: { value: 696000, unit: 'km', formatted: '696,000 km' },
    mass: { value: 1, unit: 'M☉', formatted: '1 M☉ (Solar mass)' },
    
    tagline: 'Our star, a typical G-type main sequence star',
    description: `The Sun is a middle-aged, medium-sized star – a ball of plasma 1.4 million kilometers across, fusing 600 million tonnes of hydrogen into helium every second. It's been burning for 4.6 billion years and will continue for another 5 billion before expanding into a red giant. Every second, it radiates more energy than humanity has used in all of history.`,
    whyThisSize: `A star's size balances gravity (compression) against radiation pressure (expansion). The Sun sits on the main sequence: fusing hydrogen into helium at a steady rate. More massive stars are larger but burn faster.`,
    
    explanations: {
      accessible: `The Sun is a giant ball of hot gas, mostly hydrogen. In its core, hydrogen atoms smash together to form helium, releasing the energy we see as sunlight. It's so big that a million Earths could fit inside.`,
      intuitive: `Core conditions: 15 million K, 250 billion atm. pp-chain fusion: 4¹H → ⁴He + 2e⁺ + 2νₑ + γ. Luminosity L☉ = 3.83 × 10²⁶ W. The Sun loses 4 million tonnes per second as radiated energy (E = mc²).`,
      technical: `Solar model: density ρ(r), temperature T(r), luminosity L(r) from hydrostatic equilibrium, energy transport (radiation/convection), and nuclear burning. Standard Solar Model matches helioseismology within 0.1%.`,
      advanced: `Solar neutrino problem (1960s-2000s): measured νₑ flux was 1/3 predicted. Resolution: neutrino oscillations (νₑ → νμ, ντ). Confirmed by SNO (2001), proving massive neutrinos beyond Standard Model.`,
    },
    
    nearbyObjects: ['proxima-centauri', 'red-giant', 'jupiter'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    
    notable: true,
    labelOffset: { x: 0, y: -15 },
  },
  
  {
    id: 'red-giant',
    name: 'Red Giant (typical)',
    category: 'stars',
    
    logRadius: 12.7,   // ~50 R☉
    logMass: 33.3,     // ~1 M☉
    
    radius: { value: 50, unit: 'R☉', formatted: '~50 R☉' },
    mass: { value: 1, unit: 'M☉', formatted: '~1-2 M☉' },
    
    tagline: 'What the Sun will become in 5 billion years',
    description: `Red giants are evolved stars that have exhausted core hydrogen. The core contracts and heats, igniting hydrogen burning in a shell and causing the outer layers to expand and cool (hence "red"). A sun-like star expands ~100× to engulf Mercury, Venus, and possibly Earth. This is our Sun's future.`,
    whyThisSize: `When core hydrogen depletes, the core contracts (no radiation pressure). Gravitational energy heats hydrogen shell, which burns vigorously, inflating outer layers. Lower surface temperature → red color.`,
    
    explanations: {
      accessible: `When a star runs out of hydrogen fuel in its core, it swells up into a red giant. Our Sun will do this in about 5 billion years, growing so large it might swallow Earth.`,
      intuitive: `Red giant branch: core contracts → shell H-burning → envelope expands. Tip of RGB: core reaches 10⁸ K → helium flash → core He-burning begins. Then: horizontal branch.`,
      technical: `Post-main sequence evolution follows the Schönberg-Chandrasekhar limit: when isothermal core mass exceeds ~0.1 M_star, core contracts on thermal timescale, not nuclear.`,
    },
    
    nearbyObjects: ['sun', 'white-dwarf', 'planetary-nebula'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
  },
  
  {
    id: 'betelgeuse',
    name: 'Betelgeuse',
    category: 'stars',
    
    logRadius: 13.8,   // ~900 R☉
    logMass: 34.1,     // ~15 M☉
    
    radius: { value: 900, unit: 'R☉', formatted: '~900 R☉' },
    mass: { value: 15, unit: 'M☉', formatted: '~15-20 M☉' },
    
    tagline: 'The red supergiant that will explode "soon" (in astronomical terms)',
    description: `Betelgeuse is a red supergiant in Orion's shoulder, so large that if placed at the Sun's position, it would engulf Jupiter. It has exhausted its core hydrogen, then helium, and is now fusing heavier elements. Within the next 100,000 years, its core will collapse, triggering a Type II supernova visible in daylight from Earth.`,
    whyThisSize: `Red supergiants are massive stars (>8 M☉) in late evolution. Core fusion of heavy elements can't support the star; it's inflated by vigorous shell burning. Such stars are doomed to explode.`,
    
    explanations: {
      accessible: `Betelgeuse is one of the largest stars we can see. It's so huge that light takes hours to cross it. It's also old and unstable – it could explode any time in the next 100,000 years.`,
      intuitive: `Betelgeuse: ~10 Myr old (massive stars die young). Current phase: core carbon burning, ~1000 years left. When iron core forms, no fusion releases energy → core collapse → supernova.`,
      technical: `Betelgeuse's "dimming" (2019-2020) was dust ejection, not imminent supernova. Pulsation period ~400 days. Expected supernova luminosity ~10⁴² erg/s; apparent magnitude ~ -12 from Earth.`,
    },
    
    nearbyObjects: ['red-giant', 'supernova-remnant', 'neutron-star'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    
    discovered: { year: 1836, by: 'John Herschel', how: 'First observed variability' },
    notable: true,
  },
  
  {
    id: 'brown-dwarf',
    name: 'Brown Dwarf',
    category: 'stars',
    
    logRadius: 9.8,    // ~0.8-1.2 R_Jupiter
    logMass: 31.4,     // 13-80 M_Jupiter
    
    radius: { value: 1, unit: 'R_J', formatted: '~1 R_Jupiter' },
    mass: { value: 40, unit: 'M_J', formatted: '~13-80 M_Jupiter' },
    
    tagline: 'Failed stars – too small to sustain hydrogen fusion',
    description: `Brown dwarfs are "failed stars": too massive to be planets, too small to sustain hydrogen fusion. Between about 13 and 80 Jupiter masses, they can fuse deuterium briefly but never achieve the stable hydrogen burning of true stars. They cool slowly over billions of years, glowing in infrared.`,
    whyThisSize: `Below ~0.08 M☉ (80 M_J), core temperature never reaches 10 million K for hydrogen fusion. The object contracts until electron degeneracy pressure halts collapse, fixing the radius near Jupiter's.`,
    
    explanations: {
      accessible: `Brown dwarfs are between planets and stars. They form like stars but are too small to "ignite." They glow faintly from leftover heat, slowly cooling forever.`,
      intuitive: `Hydrogen burning minimum mass: 0.075 M☉. Below this, electron degeneracy supports the object at R ~ R_J. Deuterium burning (>13 M_J) and lithium burning (>65 M_J) provide brief energy.`,
      technical: `Brown dwarf interiors: partially degenerate. Mass-radius relation: R ∝ M⁻¹/³ for fully degenerate; R roughly constant across brown dwarf range. Spectral types L, T, Y by temperature.`,
    },
    
    nearbyObjects: ['jupiter', 'sun', 'red-dwarf'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    
    discovered: { year: 1995, by: 'Multiple teams', how: 'First confirmed: Teide 1, Gliese 229B' },
  },
]

// ─────────────────────────────────────────────
// STELLAR REMNANTS
// ─────────────────────────────────────────────

export const STELLAR_REMNANTS: CosmicObject[] = [
  {
    id: 'white-dwarf',
    name: 'White Dwarf',
    category: 'stellar-remnants',
    
    logRadius: 8.8,    // ~Earth-sized, ~6000 km
    logMass: 33.1,     // ~0.6 M☉
    
    radius: { value: 6000, unit: 'km', formatted: '~Earth radius' },
    mass: { value: 0.6, unit: 'M☉', formatted: '~0.6 M☉' },
    
    tagline: 'A dead star the size of Earth but the mass of the Sun',
    description: `White dwarfs are the cores of dead stars, compressed to Earth-size with the mass of the Sun. They're supported not by fusion but by electron degeneracy pressure – a quantum effect that prevents electrons from being squeezed closer. A teaspoon would weigh 5 tonnes. They slowly cool over billions of years, eventually becoming cold, dark "black dwarfs."`,
    whyThisSize: `When a sun-like star exhausts its fuel, the core collapses until electron degeneracy halts it. This quantum pressure creates a maximum mass (Chandrasekhar limit, 1.4 M☉) and fixes the size near Earth's.`,
    
    explanations: {
      accessible: `White dwarfs are dead star cores – so dense that a spoonful weighs as much as an elephant. They're made of carbon and oxygen, no longer fusing, just slowly cooling forever.`,
      intuitive: `Electron degeneracy: Pauli exclusion principle prevents electrons from occupying same state. Pressure P ∝ ρ^(5/3) (non-relativistic). Mass-radius: R ∝ M⁻¹/³. More massive = smaller.`,
      technical: `Chandrasekhar limit: at M > 1.4 M☉, electrons become relativistic, P ∝ ρ^(4/3), unable to support the star → collapse. Cooling timescale ~10 Gyr for crystallization. GAIA constrains cooling models.`,
      advanced: `White dwarf seismology: g-mode pulsations in DAV (ZZ Ceti) stars probe interior structure. Crystallization releases latent heat, causing "cooling delay." C/O ratio probes ¹²C(α,γ)¹⁶O rate in progenitor.`,
    },
    
    nearbyObjects: ['neutron-star', 'red-giant', 'earth'],
    relatedBoundaries: ['schwarzschild'],
    relatedEpochs: ['now'],
    notable: true,
  },
  
  {
    id: 'neutron-star',
    name: 'Neutron Star',
    category: 'stellar-remnants',
    
    logRadius: 6,      // ~10 km
    logMass: 33.45,    // ~1.4 M☉
    
    radius: { value: 10, unit: 'km', formatted: '~10-15 km' },
    mass: { value: 1.4, unit: 'M☉', formatted: '~1.4-2 M☉' },
    
    tagline: 'A city-sized star with density beyond imagination',
    description: `Neutron stars are the collapsed cores of massive stars, so dense that a sugar cube would weigh a billion tonnes. They're held up not by electron degeneracy but by neutron degeneracy – protons and electrons have merged into neutrons. Surface gravity is 200 billion g; escape velocity is 1/3 light speed. Many spin hundreds of times per second as pulsars.`,
    whyThisSize: `When a star above ~8 M☉ dies, the core collapse overcomes electron degeneracy. Protons and electrons combine into neutrons, which then support the star through neutron degeneracy pressure. Maximum mass ~2 M☉.`,
    
    explanations: {
      accessible: `Neutron stars pack the Sun's mass into a city-sized ball. They're so dense that a teaspoon weighs billions of tonnes. Many spin rapidly and emit beams of radiation – we see these as pulsars.`,
      intuitive: `Formation: core collapse supernova. Electron capture: p + e → n + νₑ. Central density ~10¹⁵ g/cm³ (nuclear density). Surface: solid crust of heavy nuclei over neutron superfluid.`,
      technical: `Equation of state uncertain: nuclear matter at supra-nuclear density. Mass-radius observations constrain EOS. Maximum mass (TOV limit) ~2.2 M☉ depending on EOS. Gravitational wave constraints from mergers.`,
      advanced: `Neutron star interiors: n-p-e matter, hyperons, or deconfined quarks? Color superconductivity at highest densities? r-mode instabilities limit spin frequencies. Superfluidity affects cooling (neutrino emission) and glitch dynamics.`,
    },
    
    nearbyObjects: ['white-dwarf', 'pulsar', 'magnetar', 'stellar-bh'],
    relatedBoundaries: ['schwarzschild', 'compton'],
    relatedEpochs: ['now'],
    
    discovered: { year: 1967, by: 'Jocelyn Bell Burnell', how: 'Radio pulsar discovery' },
    notable: true,
  },
  
  {
    id: 'magnetar',
    name: 'Magnetar',
    category: 'stellar-remnants',
    
    logRadius: 6,      // ~10 km (like neutron star)
    logMass: 33.45,    // ~1.4 M☉
    
    radius: { value: 10, unit: 'km', formatted: '~10 km' },
    mass: { value: 1.4, unit: 'M☉', formatted: '~1.4 M☉' },
    
    tagline: 'Neutron stars with the strongest magnetic fields in the universe',
    description: `Magnetars are neutron stars with magnetic fields a quadrillion times stronger than Earth's – so intense that at halfway to the Moon, they'd erase every credit card on Earth. Their field decay powers sporadic bursts of X-rays and gamma rays. In 2004, magnetar SGR 1806-20 released more energy in 0.1 seconds than the Sun emits in 100,000 years.`,
    whyThisSize: `Magnetars have the same size as regular neutron stars – their distinction is magnetic, not gravitational. The extreme fields (10¹⁴-10¹⁵ Gauss) may form during rapid rotation at birth.`,
    
    explanations: {
      accessible: `Magnetars have the most powerful magnets in the universe – a trillion times stronger than a fridge magnet. They occasionally release huge bursts of energy that can be detected across the galaxy.`,
      intuitive: `Magnetic field energy: B²R³ ~ 10⁴⁶ erg. Field decay heats crust, powers X-ray emission and bursts. Giant flares release ~10⁴⁶ erg – one magnetar dominated cosmic gamma-ray flux for months.`,
      technical: `Magnetar model: fossil field + dynamo at birth. B > B_QED = m²c³/(eℏ) = 4.4×10¹³ G → vacuum birefringence, pair production, exotic QED effects. ~30 known magnetars, lifetime ~10⁴ yr as active.`,
    },
    
    nearbyObjects: ['neutron-star', 'pulsar'],
    relatedBoundaries: ['schwarzschild'],
    relatedEpochs: ['now'],
    
    discovered: { year: 1992, by: 'Duncan & Thompson (theory)', how: 'Soft gamma repeaters explained' },
  },
]

// ─────────────────────────────────────────────
// BLACK HOLES
// ─────────────────────────────────────────────

export const BLACK_HOLES: CosmicObject[] = [
  {
    id: 'stellar-bh',
    name: 'Stellar Mass Black Hole',
    category: 'black-holes',
    
    logRadius: 6.4,    // ~30 km for 10 M☉
    logMass: 34.3,     // ~10 M☉
    
    radius: { value: 30, unit: 'km', formatted: '~30 km (horizon)' },
    mass: { value: 10, unit: 'M☉', formatted: '~5-50 M☉' },
    
    tagline: 'Dead massive stars collapsed beyond the point of no return',
    description: `Stellar black holes form when massive stars (>~25 M☉) die. Their cores collapse past the neutron star stage into a singularity – a point of infinite density surrounded by an event horizon from which nothing escapes. A 10 M☉ black hole has a horizon just 30 km across. We detect them by their gravity: swallowing companion stars, bending light, merging in pairs.`,
    whyThisSize: `The event horizon radius R_s = 2GM/c² scales linearly with mass: 3 km per solar mass. A 10 M☉ black hole has horizon radius ~30 km. Inside, matter falls inevitably toward the singularity.`,
    
    explanations: {
      accessible: `When the biggest stars die, gravity wins completely. The core collapses into a point, surrounded by a zone from which nothing can escape – not even light. This is a black hole.`,
      intuitive: `Event horizon: surface where escape velocity = c. Time dilation: clocks stop at horizon (from outside). Hawking radiation: black holes slowly evaporate, but stellar BHs would take 10⁶⁷ years.`,
      technical: `LIGO detects BH-BH mergers. First detection (GW150914): 36 + 29 → 62 M☉ BH + 3 M☉ gravitational waves. Mass gap between neutron stars (~2.5 M☉) and lightest BHs (~5 M☉) under investigation.`,
      advanced: `BH no-hair theorem: Kerr-Newman family characterized by M, J, Q only. Information paradox: unitarity vs. classical no-escape. ER=EPR conjecture: entanglement creates wormhole-like connections.`,
    },
    
    nearbyObjects: ['neutron-star', 'sagittarius-a', 'neutron-star'],
    relatedBoundaries: ['schwarzschild'],
    relatedEpochs: ['now'],
    notable: true,
  },
  
  {
    id: 'sagittarius-a',
    name: 'Sagittarius A*',
    category: 'black-holes',
    
    logRadius: 12.1,   // ~12 million km (event horizon)
    logMass: 39.8,     // 4 × 10⁶ M☉
    
    radius: { value: 12, unit: 'million km', formatted: '~12 million km' },
    mass: { value: 4, unit: 'million M☉', formatted: '4 × 10⁶ M☉' },
    
    tagline: 'The supermassive black hole at the heart of our galaxy',
    description: `Sagittarius A* (Sgr A*) is the supermassive black hole at the Milky Way's center, 4 million times the Sun's mass. We've watched stars orbit it at up to 3% light speed, proving its nature. In 2022, the Event Horizon Telescope imaged its shadow – a dark silhouette against glowing hot gas. It's 26,000 light-years away and (thankfully) quiescent.`,
    whyThisSize: `Supermassive black holes grow by accreting gas and merging with other black holes over billions of years. How the first "seeds" formed remains debated. Sgr A* is actually small for a galaxy's central black hole.`,
    
    explanations: {
      accessible: `At the center of our galaxy sits a black hole 4 million times heavier than the Sun. Stars orbit around it like planets around the Sun, but much faster – one completes an orbit in just 16 years.`,
      intuitive: `S2 star orbit: period 16 yr, closest approach 120 AU at 7,650 km/s (2.5% c). Gravitational redshift and Schwarzschild precession observed – testing GR in strong field. Nobel Prize 2020.`,
      technical: `EHT image (2022): ring diameter ~52 μas matches predicted shadow size 5√3 GM/c² for 4 million M☉. Hot spot orbiting at ~30% c. Relatively low accretion: L ~ 10⁻⁸ L_Edd.`,
      advanced: `Sgr A* variability: flares in IR and X-ray from magnetic reconnection near horizon. G objects (dusty objects with stellar cores?) orbit at ~100 AU. GRAVITY instrument tests GR to unprecedented precision.`,
    },
    
    nearbyObjects: ['stellar-bh', 'm87-bh', 'milky-way'],
    relatedBoundaries: ['schwarzschild'],
    relatedEpochs: ['now'],
    
    discovered: { year: 1974, by: 'Balick & Brown', how: 'Radio observations' },
    notable: true,
  },
  
  {
    id: 'm87-bh',
    name: 'M87* (First Imaged Black Hole)',
    category: 'black-holes',
    
    logRadius: 14.8,   // ~400 AU
    logMass: 42.8,     // 6.5 × 10⁹ M☉
    
    radius: { value: 400, unit: 'AU', formatted: '~400 AU (larger than our solar system)' },
    mass: { value: 6.5, unit: 'billion M☉', formatted: '6.5 × 10⁹ M☉' },
    
    tagline: 'The first black hole ever directly imaged, in galaxy M87',
    description: `M87* was the first black hole ever directly imaged (2019) – a glowing ring of hot gas surrounding a dark shadow. At 6.5 billion solar masses, its event horizon is larger than our entire solar system. It sits at the center of the giant elliptical galaxy M87, 55 million light-years away, and powers a relativistic jet 5,000 light-years long.`,
    whyThisSize: `M87* is one of the largest known black holes, ~1,500× more massive than Sgr A*. Its huge size and bright accretion disk made it an ideal first target for the Event Horizon Telescope.`,
    
    explanations: {
      accessible: `In 2019, astronomers released the first picture of a black hole – M87*. The image shows a bright ring of hot gas swirling around a dark shadow. This black hole is so big our solar system would fit inside it.`,
      intuitive: `EHT: array of radio telescopes across Earth forming Earth-sized virtual telescope. Resolution 20 μas – could read a newspaper in New York from Paris. M87* shadow diameter 42 ± 3 μas, consistent with GR.`,
      technical: `M87 jet powered by Blandford-Znajek mechanism: frame dragging extracts rotational energy. Jet power ~10⁴² erg/s. Black hole spin a/M ~ 0.9 from jet modeling. Polarized EHT images reveal magnetic field structure.`,
    },
    
    nearbyObjects: ['sagittarius-a', 'quasar', 'galaxy-m87'],
    relatedBoundaries: ['schwarzschild'],
    relatedEpochs: ['now'],
    
    discovered: { year: 2019, by: 'Event Horizon Telescope', how: 'Radio interferometry imaging' },
    notable: true,
  },
]

// ─────────────────────────────────────────────
// STELLAR STRUCTURES
// ─────────────────────────────────────────────

export const STELLAR_STRUCTURES: CosmicObject[] = [
  {
    id: 'globular-cluster',
    name: 'Globular Cluster (typical)',
    category: 'stellar-structures',
    
    logRadius: 19,     // ~100 light-years = 10¹⁹ cm
    logMass: 38.5,     // ~10⁵ M☉
    
    radius: { value: 100, unit: 'light-years', formatted: '~100 ly' },
    mass: { value: 100000, unit: 'M☉', formatted: '~10⁵-10⁶ M☉' },
    
    tagline: 'Ancient spherical cities of a million stars',
    description: `Globular clusters are dense spherical collections of hundreds of thousands of ancient stars, bound by mutual gravity. They orbit galaxies in halos, and their stars are among the oldest in the universe – 12-13 billion years. Their age makes them cosmic fossils, preserving information about early star formation.`,
    whyThisSize: `Globular clusters formed early when gas clouds collapsed. Their tight binding kept them intact for billions of years. Core densities can reach 1,000 stars per cubic parsec – vs. ~0.1 near the Sun.`,
    
    explanations: {
      accessible: `Globular clusters are balls of ancient stars – some of the oldest objects in the universe. The Milky Way has about 150 of them, each containing hundreds of thousands of stars packed into a small space.`,
      intuitive: `Age from HR diagram turnoff: stars leaving main sequence reveal age. GCs: 11-13 Gyr, near universe age. Metal-poor ([Fe/H] ~ -1.5) from early formation. Dynamical relaxation drives mass segregation.`,
      technical: `GC formation scenarios: in-situ vs. accreted from dwarf galaxies. GCs host multiple stellar populations (spreads in Na, O, He) – self-enrichment from first generation AGB stars. Intermediate-mass black holes (10³-10⁴ M☉) may exist in cores.`,
    },
    
    nearbyObjects: ['star-cluster-open', 'milky-way', 'red-giant'],
    relatedBoundaries: [],
    relatedEpochs: ['recombination', 'now'],
    notable: true,
  },
]

// ─────────────────────────────────────────────
// GALAXIES
// ─────────────────────────────────────────────

export const GALAXIES: CosmicObject[] = [
  {
    id: 'milky-way',
    name: 'Milky Way Galaxy',
    category: 'galaxies',
    
    logRadius: 22.7,   // ~100,000 ly = 10²³ cm
    logMass: 45,       // ~1.5 × 10¹² M☉ (including dark matter)
    
    radius: { value: 100000, unit: 'light-years', formatted: '~100,000 ly' },
    mass: { value: 1.5, unit: 'trillion M☉', formatted: '~1.5 × 10¹² M☉' },
    
    tagline: 'Our home galaxy, a spiral of 200 billion stars',
    description: `The Milky Way is a barred spiral galaxy containing 200-400 billion stars, including our Sun. The visible disk is 100,000 light-years across, but a dark matter halo extends much further. Our solar system is located 26,000 light-years from the center, orbiting once every 230 million years. We're part of the Local Group, on a collision course with Andromeda in 4 billion years.`,
    whyThisSize: `Galaxy sizes result from the interplay of gravity, angular momentum, and feedback from star formation and black holes. The Milky Way is a typical large spiral – larger than most galaxies but dwarfed by giant ellipticals.`,
    
    explanations: {
      accessible: `The Milky Way is our galaxy – a vast pinwheel of stars that appears as a glowing band across the night sky. Our Sun is one of hundreds of billions of stars, located about halfway to the edge.`,
      intuitive: `Disk rotation: flat rotation curve v ~ 220 km/s implies dark matter halo (visible matter alone would give declining v(r)). Disk scale length ~3 kpc. Bulge: old stars. Bar: 27 kly long.`,
      technical: `Gaia mission: precise positions and motions for ~2 billion stars. Phase-space structure reveals merger history (Gaia-Enceladus merger ~10 Gyr ago). Stellar halo streams from accreted dwarf galaxies.`,
      advanced: `Milky Way mass from satellite dynamics, halo star velocities, escape velocity: M_200 ~ 1-2 × 10¹² M☉. Baryon fraction ~5% (rest is dark matter). Star formation rate ~1.5 M☉/yr.`,
    },
    
    nearbyObjects: ['andromeda', 'sagittarius-a', 'globular-cluster'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
  },
  
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy (M31)',
    category: 'galaxies',
    
    logRadius: 23,     // ~220,000 ly
    logMass: 45.2,     // ~10¹² M☉
    
    radius: { value: 220000, unit: 'light-years', formatted: '~220,000 ly' },
    mass: { value: 1, unit: 'trillion M☉', formatted: '~10¹² M☉' },
    
    tagline: 'Our nearest large galactic neighbor, approaching at 110 km/s',
    description: `Andromeda is the nearest large galaxy to the Milky Way, 2.5 million light-years away. Visible to the naked eye as a fuzzy patch in dark skies, its light left before humans evolved. It contains roughly a trillion stars and is approaching us at 110 km/s. In about 4 billion years, it will merge with the Milky Way to form "Milkomeda."`,
    whyThisSize: `Andromeda is slightly larger than the Milky Way – perhaps from earlier mergers. The two are the dominant galaxies in the Local Group; their merger is gravitationally inevitable.`,
    
    explanations: {
      accessible: `Andromeda is the most distant object visible to the naked eye – 2.5 million light-years away. It's heading toward us, and in 4 billion years, our galaxies will collide and merge into one.`,
      intuitive: `Blueshift: Andromeda is one of few galaxies moving toward us (local gravity overcomes cosmic expansion). Merger timeline: first pass 4 Gyr, final coalescence 6 Gyr. Sun likely survives but relocates.`,
      technical: `Stellar mass ~10¹¹ M☉, comparable to MW. Higher bulge-to-disk ratio suggests different merger history. M31* (central SMBH): ~10⁸ M☉, 25× larger than Sgr A*.`,
    },
    
    nearbyObjects: ['milky-way', 'triangulum', 'dwarf-galaxy'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
  },
]

// ─────────────────────────────────────────────
// LARGE SCALE STRUCTURE
// ─────────────────────────────────────────────

export const LARGE_SCALE: CosmicObject[] = [
  {
    id: 'supercluster-laniakea',
    name: 'Laniakea Supercluster',
    category: 'large-scale-structure',
    
    logRadius: 24.7,   // ~500 million ly
    logMass: 48,       // ~10¹⁷ M☉
    
    radius: { value: 500, unit: 'million ly', formatted: '~500 million ly' },
    mass: { value: 100, unit: 'quadrillion M☉', formatted: '~10¹⁷ M☉' },
    
    tagline: 'Our cosmic neighborhood – 100,000 galaxies flowing together',
    description: `Laniakea ("immense heaven" in Hawaiian) is our home supercluster – a vast basin of gravitational attraction containing 100,000 galaxies, including the Milky Way. All these galaxies flow toward a gravitational focus called the Great Attractor. Superclusters aren't bound structures; they're transient features that cosmic expansion will eventually tear apart.`,
    whyThisSize: `Superclusters form where multiple galaxy clusters are gravitationally linked. Laniakea is defined by shared flow toward the Great Attractor, not by binding – it's not isolated from cosmic expansion.`,
    
    explanations: {
      accessible: `Our galaxy is part of a vast structure containing 100,000 galaxies, all slowly flowing toward a common center. This supercluster, Laniakea, is so big that light takes 500 million years to cross it.`,
      intuitive: `Peculiar velocity flows: galaxies move ~600 km/s toward Great Attractor region beyond Hydra-Centaurus. Laniakea defined by watershed: galaxies inside flow inward; outside flow to other attractors.`,
      technical: `Peculiar velocity reconstruction from redshift surveys (Cosmicflows). Laniakea not gravitationally bound – will not collapse. Dark energy will isolate it over ~100 Gyr.`,
    },
    
    nearbyObjects: ['virgo-cluster', 'milky-way', 'great-wall'],
    relatedBoundaries: ['hubble'],
    relatedEpochs: ['now'],
    notable: true,
  },
  
  {
    id: 'observable-universe',
    name: 'Observable Universe',
    category: 'large-scale-structure',
    
    logRadius: 28.1,   // ~93 billion ly = 4.4 × 10²⁸ cm
    logMass: 56,       // ~10⁵³ kg (ordinary matter)
    
    radius: { value: 46.5, unit: 'billion ly', formatted: '46.5 billion ly radius' },
    mass: { value: 10, unit: '⁵³ kg', formatted: '~10⁵³ kg visible matter' },
    
    tagline: 'Everything we can ever see – and it is not everything there is',
    description: `The observable universe is a sphere centered on Earth containing everything light has had time to reach us since the Big Bang – about 93 billion light-years across. It contains roughly 2 trillion galaxies, 10²⁴ stars, and 10⁸⁰ atoms. But this is not the whole universe: space likely extends far beyond, possibly infinitely. We simply can't see it.`,
    whyThisSize: `The observable universe is a horizon, not an edge. The 46.5 billion light-year radius (despite 13.8 Gyr age) reflects cosmic expansion: space stretched while light traveled toward us.`,
    
    explanations: {
      accessible: `The observable universe is everything we can see – but it's not everything that exists. Light from farther away hasn't had time to reach us. The universe might be infinite; we just can't know.`,
      intuitive: `Particle horizon: 46.5 Gly comoving radius. Why >13.8 Gly? Space expanded while light traveled. Event horizon (future limit) is different and shrinking due to accelerated expansion.`,
      technical: `Comoving volume: 4 × 10⁸⁰ m³. Contains ~10⁵³ kg baryons, ~10⁸⁰ atoms. Cosmic microwave background comes from z ≈ 1100, surface of last scattering. Inflation makes observable universe homogeneous.`,
      advanced: `Observable universe is causally disconnected from regions beyond particle horizon. Eternal inflation → multiverse: other "bubble universes" may exist beyond any observational possibility. Cosmological principle (homogeneity, isotropy) is an assumption, testable statistically.`,
    },
    
    nearbyObjects: ['hubble-radius', 'supercluster-laniakea', 'cmb'],
    relatedBoundaries: ['hubble'],
    relatedEpochs: ['recombination', 'now'],
    notable: true,
    labelOffset: { x: 0, y: 15 },
  },
  
  {
    id: 'hubble-radius',
    name: 'Hubble Radius',
    category: 'large-scale-structure',
    
    logRadius: 28,     // ~14.4 billion ly ≈ 4.4 × 10²⁸ cm
    logMass: 55,       // Mass within Hubble sphere
    
    radius: { value: 14.4, unit: 'billion ly', formatted: '14.4 billion ly' },
    mass: { value: 10, unit: '⁵² kg', formatted: '~10⁵² kg within' },
    
    tagline: 'The distance beyond which space expands faster than light',
    description: `The Hubble radius (or Hubble distance) is where the recession velocity due to cosmic expansion equals the speed of light. Objects beyond this distance are receding superluminally – but this doesn't violate relativity, because it's space itself expanding, not motion through space. The Hubble radius is not the same as the observable universe.`,
    whyThisSize: `R_H = c/H₀ ≈ 14.4 billion light-years, where H₀ ≈ 70 km/s/Mpc. This is a proper distance in today's coordinates. The edge of the observable universe is farther because of past expansion history.`,
    
    explanations: {
      accessible: `At a certain distance, space expands so fast that light can never catch up. Beyond the Hubble radius, galaxies are receding faster than light – but they haven't broken any speed limit; space itself is stretching.`,
      intuitive: `Hubble law: v = H₀d. At d = c/H₀, v = c. This is today's Hubble radius. But photons can travel from beyond R_H if they entered when R_H was smaller. Cosmic horizons are subtle.`,
      technical: `Hubble radius is time-dependent: R_H(t) = c/H(t). In matter-dominated era, R_H grew. In dark-energy era, R_H → const = c√(3/Λ). The event horizon freezes.`,
    },
    
    nearbyObjects: ['observable-universe', 'supercluster-laniakea'],
    relatedBoundaries: ['hubble'],
    relatedEpochs: ['now'],
    notable: true,
  },
]

// ─────────────────────────────────────────────
// EXOTIC & THEORETICAL
// ─────────────────────────────────────────────

export const EXOTIC: CosmicObject[] = [
  {
    id: 'planck-mass',
    name: 'Planck Mass',
    category: 'exotic-theoretical',
    
    logRadius: -33,    // Planck length
    logMass: -5,       // Planck mass ≈ 2.2 × 10⁻⁵ g
    
    radius: { value: 1.6, unit: '× 10⁻³⁵ m', formatted: '1.6 × 10⁻³⁵ m' },
    mass: { value: 22, unit: 'μg', formatted: '~22 μg' },
    
    tagline: 'Where quantum mechanics and gravity meet – the intersection point',
    description: `The Planck mass is the unique mass where the Compton wavelength equals the Schwarzschild radius – where quantum mechanics and general relativity become equally important. At about 22 micrograms (comparable to a small grain of sand), it's strangely macroscopic. A particle at Planck mass would be a black hole the size of the Planck length.`,
    whyThisSize: `Setting λ_Compton = R_Schwarzschild gives m_P = √(ℏc/G) ≈ 2.2 × 10⁻⁵ g. This is where all three fundamental scales (ℏ, c, G) matter equally. Any theory of quantum gravity must work here.`,
    
    explanations: {
      accessible: `The Planck mass is special: it's where quantum "fuzziness" and black hole formation happen at the same scale. Surprisingly, it's about the mass of a grain of sand – big enough to almost see!`,
      intuitive: `Planck mass = √(ℏc/G) ≈ 22 μg ≈ 1.22 × 10¹⁹ GeV/c². At this mass, λ_C = R_S = l_P. An object at Planck mass-scale would be simultaneously quantum and gravitationally extreme.`,
      technical: `Why is Planck mass "big"? Gravity is weak: G is small in natural units. The hierarchy problem: why m_H << m_P? Unknown physics must stabilize Higgs mass far below Planck scale.`,
      advanced: `Black hole remnants: if Hawking evaporation stops at Planck mass, relics could be dark matter. String theory: characteristic scale ~l_P; Planck mass is natural unit. Trans-Planckian physics remains speculative.`,
    },
    
    nearbyObjects: ['electron', 'proton', 'primordial-bh'],
    relatedBoundaries: ['planck', 'schwarzschild', 'compton'],
    relatedEpochs: ['planck'],
    notable: true,
  },
  
  {
    id: 'primordial-bh',
    name: 'Primordial Black Hole',
    category: 'exotic-theoretical',
    
    logRadius: -4,     // ~1 km for 10¹⁵ g
    logMass: 15,       // 10¹⁵ g (asteroid mass)
    
    radius: { value: 1, unit: 'fm', formatted: '~10⁻¹³ cm' },
    mass: { value: 10, unit: '¹⁵ g', formatted: '~10¹⁵ g (asteroid mass)' },
    
    tagline: 'Hypothetical black holes from the early universe – still evaporating today',
    description: `Primordial black holes (PBHs) could have formed in the early universe from density fluctuations, before stars existed. Unlike stellar black holes, they could be any mass – even microscopic. PBHs with initial mass ~10¹⁵ g would be evaporating via Hawking radiation right now, potentially detectable. PBHs are a dark matter candidate.`,
    whyThisSize: `Hawking evaporation: smaller BHs are hotter and evaporate faster. A BH of initial mass 10¹⁵ g evaporates in ~13.8 Gyr – exactly the age of the universe. Lighter PBHs have already evaporated; heavier survive.`,
    
    explanations: {
      accessible: `In the early universe, when everything was extremely dense, some regions may have collapsed into tiny black holes. The smallest ones have already evaporated; others might still exist as dark matter.`,
      intuitive: `Hawking temperature: T = ℏc³/(8πGMk_B) ∝ 1/M. Lifetime: t ∝ M³. M ~ 10¹⁵ g gives t ~ age of universe. Final evaporation: burst of gamma rays at ~10²⁰ eV.`,
      technical: `PBH abundance constrained by: evaporation (gamma-ray background), microlensing, gravitational wave observations. PBH dark matter viable in "asteroid mass" window (~10¹⁷-10²² g).`,
    },
    
    nearbyObjects: ['stellar-bh', 'planck-mass'],
    relatedBoundaries: ['schwarzschild'],
    relatedEpochs: ['planck', 'gut'],
    notable: true,
  },
]

// ─────────────────────────────────────────────
// EXPORT ALL
// ─────────────────────────────────────────────

export const ALL_COSMIC_OBJECTS_PART2: CosmicObject[] = [
  ...STARS,
  ...STELLAR_REMNANTS,
  ...BLACK_HOLES,
  ...STELLAR_STRUCTURES,
  ...GALAXIES,
  ...LARGE_SCALE,
  ...EXOTIC,
]
```

---

## FILE: src/app/data/permissible-universe/components/index.ts
```tsx
// ===========================================
// PERMISSIBLE UNIVERSE - COMPONENTS INDEX
// ===========================================

export { CosmicDiagram } from './CosmicDiagram'
export { ObjectModal } from './ObjectModal'
export { BoundaryModal } from './BoundaryModal'
export { CategoryFilter } from './CategoryFilter'
export { SearchBox } from './SearchBox'
export { ViewToggle } from './ViewToggle'
export { LimitsView } from './LimitsView'
```

---

## FILE: src/app/data/permissible-universe/components/CosmicDiagram.tsx
```tsx
'use client'

// ===========================================
// COSMIC DIAGRAM - D3 Visualization
// ===========================================
// Interactive pan/zoom diagram showing objects and boundaries

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { CosmicObject, Boundary } from '../lib/types'
import { CATEGORIES, BOUNDARY_COLORS, formatSuperscript } from '../lib/constants'
import { EPOCH_LIST, DOMINATION_LIST } from '../lib/epochs'
import { getBoundaryLogRadius } from '../lib/boundaries'

interface Props {
  objects: CosmicObject[]
  boundaries: Boundary[]
  showEpochs: boolean
  showDomination: boolean
  onObjectClick: (id: string) => void
  onObjectHover: (id: string | null) => void
  onBoundaryClick: (id: string) => void
  initialView: { center: { logR: number; logM: number }; zoom: number }
}

export function CosmicDiagram({
  objects,
  boundaries,
  showEpochs,
  showDomination,
  onObjectClick,
  onObjectHover,
  onBoundaryClick,
  initialView,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    object: CosmicObject | null
  }>({ visible: false, x: 0, y: 0, object: null })

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Main D3 rendering
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 50, right: 80, bottom: 60, left: 80 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    // Scales (log-log, but we're already in log space)
    const xScale = d3.scaleLinear()
      .domain([-45, 65]) // log mass range (grams)
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([-40, 30]) // log radius range (cm) - inverted so small is bottom
      .range([height, 0])

    // Create main group with zoom
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Clip path for content
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'chart-clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height)

    const chartArea = g.append('g')
      .attr('clip-path', 'url(#chart-clip)')

    // ─────────────────────────────────────────
    // GRID
    // ─────────────────────────────────────────
    
    const gridGroup = chartArea.append('g').attr('class', 'grid')
    
    // Vertical grid lines (mass)
    for (let m = -40; m <= 60; m += 10) {
      gridGroup.append('line')
        .attr('x1', xScale(m))
        .attr('x2', xScale(m))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', 'white')
        .attr('stroke-opacity', m % 20 === 0 ? 0.15 : 0.05)
        .attr('stroke-width', 1)
    }
    
    // Horizontal grid lines (radius)
    for (let r = -40; r <= 30; r += 10) {
      gridGroup.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(r))
        .attr('y2', yScale(r))
        .attr('stroke', 'white')
        .attr('stroke-opacity', r % 20 === 0 ? 0.15 : 0.05)
        .attr('stroke-width', 1)
    }

    // ─────────────────────────────────────────
    // DOMINATION REGIONS (if enabled)
    // ─────────────────────────────────────────
    
    if (showDomination) {
      const domGroup = chartArea.append('g').attr('class', 'domination')
      
      for (const era of DOMINATION_LIST) {
        const points = era.region.map(([logR, logM]) => 
          [xScale(logM), yScale(logR)] as [number, number]
        )
        
        domGroup.append('polygon')
          .attr('points', points.map(p => p.join(',')).join(' '))
          .attr('fill', era.color)
          .attr('stroke', 'none')
      }
    }

    // ─────────────────────────────────────────
    // BOUNDARY REGIONS (Forbidden Zones)
    // ─────────────────────────────────────────
    
    const boundaryGroup = chartArea.append('g').attr('class', 'boundaries')
    
    for (const boundary of boundaries) {
      if (boundary.lineType === 'schwarzschild') {
        // Diagonal line: logR = logM + intercept
        // Fill above the line
        const path = d3.path()
        const x1 = xScale(-45)
        const y1 = yScale(-45 + (boundary.intercept ?? 0))
        const x2 = xScale(65)
        const y2 = yScale(65 + (boundary.intercept ?? 0))
        
        // Create polygon: line + top edge
        const polygon = [
          [x1, Math.max(0, y1)],
          [x2, Math.max(0, y2)],
          [x2, 0],
          [x1, 0],
        ]
        
        boundaryGroup.append('polygon')
          .attr('points', polygon.map(p => p.join(',')).join(' '))
          .attr('fill', boundary.fillColor)
          .attr('stroke', 'none')
        
        boundaryGroup.append('line')
          .attr('x1', x1)
          .attr('y1', y1)
          .attr('x2', x2)
          .attr('y2', y2)
          .attr('stroke', boundary.color)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', boundary.dashPattern?.join(',') || 'none')
          .style('cursor', 'pointer')
          .on('click', () => onBoundaryClick(boundary.id))
        
        // Label
        boundaryGroup.append('text')
          .attr('x', xScale(45))
          .attr('y', yScale(45 + (boundary.intercept ?? 0)) - 8)
          .attr('fill', boundary.color)
          .attr('font-size', '10px')
          .attr('font-family', 'monospace')
          .text('SCHWARZSCHILD LIMIT')
          .style('cursor', 'pointer')
          .on('click', () => onBoundaryClick(boundary.id))
      }
      
      if (boundary.lineType === 'compton') {
        // Diagonal line: logR = -logM + intercept
        const x1 = xScale(-45)
        const y1 = yScale(45 + (boundary.intercept ?? 0))
        const x2 = xScale(65)
        const y2 = yScale(-65 + (boundary.intercept ?? 0))
        
        // Fill below the line
        const polygon = [
          [x1, Math.min(height, y1)],
          [x2, Math.min(height, y2)],
          [x2, height],
          [x1, height],
        ]
        
        boundaryGroup.append('polygon')
          .attr('points', polygon.map(p => p.join(',')).join(' '))
          .attr('fill', boundary.fillColor)
          .attr('stroke', 'none')
        
        boundaryGroup.append('line')
          .attr('x1', x1)
          .attr('y1', y1)
          .attr('x2', x2)
          .attr('y2', y2)
          .attr('stroke', boundary.color)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', boundary.dashPattern?.join(',') || 'none')
          .style('cursor', 'pointer')
          .on('click', () => onBoundaryClick(boundary.id))
        
        // Label
        boundaryGroup.append('text')
          .attr('x', xScale(-30))
          .attr('y', yScale(30 + (boundary.intercept ?? 0)) + 15)
          .attr('fill', boundary.color)
          .attr('font-size', '10px')
          .attr('font-family', 'monospace')
          .text('COMPTON LIMIT')
          .style('cursor', 'pointer')
          .on('click', () => onBoundaryClick(boundary.id))
      }
      
      if (boundary.lineType === 'planck-vertical') {
        const x = xScale(-5) // Planck mass position
        
        boundaryGroup.append('line')
          .attr('x1', x)
          .attr('x2', x)
          .attr('y1', 0)
          .attr('y2', height)
          .attr('stroke', boundary.color)
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,4')
          .attr('opacity', 0.6)
        
        // Vertical fill to the left (below Planck mass)
        boundaryGroup.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', x)
          .attr('height', height)
          .attr('fill', boundary.fillColor)
      }
      
      if (boundary.lineType === 'hubble-horizontal') {
        const y = yScale(28) // Hubble radius
        
        boundaryGroup.append('line')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', y)
          .attr('y2', y)
          .attr('stroke', boundary.color)
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '8,4')
          .attr('opacity', 0.6)
        
        boundaryGroup.append('text')
          .attr('x', width - 10)
          .attr('y', y - 5)
          .attr('fill', boundary.color)
          .attr('font-size', '10px')
          .attr('font-family', 'monospace')
          .attr('text-anchor', 'end')
          .text('HUBBLE RADIUS')
      }
    }

    // ─────────────────────────────────────────
    // EPOCH LINES (if enabled)
    // ─────────────────────────────────────────
    
    if (showEpochs) {
      const epochGroup = chartArea.append('g').attr('class', 'epochs')
      
      for (const epoch of EPOCH_LIST) {
        // Diagonal lines representing different epochs
        const y = yScale(epoch.logRadiusIntercept)
        
        epochGroup.append('line')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', y)
          .attr('y2', y)
          .attr('stroke', epoch.color)
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '2,4')
          .attr('opacity', 0.4)
        
        epochGroup.append('text')
          .attr('x', 5)
          .attr('y', y - 3)
          .attr('fill', epoch.color)
          .attr('font-size', '9px')
          .attr('opacity', 0.7)
          .text(epoch.shortName)
      }
    }

    // ─────────────────────────────────────────
    // OBJECTS
    // ─────────────────────────────────────────
    
    const objectsGroup = chartArea.append('g').attr('class', 'objects')
    
    for (const obj of objects) {
      const x = xScale(obj.logMass)
      const y = yScale(obj.logRadius)
      const color = CATEGORIES[obj.category].color
      const isNotable = obj.notable
      const radius = isNotable ? 6 : 4
      
      // Skip if outside visible area
      if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue
      
      const group = objectsGroup.append('g')
        .attr('transform', `translate(${x},${y})`)
        .style('cursor', 'pointer')
        .on('click', () => onObjectClick(obj.id))
        .on('mouseenter', (event) => {
          onObjectHover(obj.id)
          setTooltip({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            object: obj,
          })
        })
        .on('mouseleave', () => {
          onObjectHover(null)
          setTooltip(prev => ({ ...prev, visible: false }))
        })
      
      // Outer glow for notable objects
      if (isNotable) {
        group.append('circle')
          .attr('r', radius + 3)
          .attr('fill', color)
          .attr('opacity', 0.2)
      }
      
      // Main dot
      group.append('circle')
        .attr('r', radius)
        .attr('fill', color)
        .attr('stroke', 'white')
        .attr('stroke-width', isNotable ? 1.5 : 0.5)
        .attr('stroke-opacity', 0.5)
      
      // Label for notable objects
      if (isNotable) {
        const labelOffset = obj.labelOffset || { x: 8, y: 3 }
        group.append('text')
          .attr('x', labelOffset.x)
          .attr('y', labelOffset.y)
          .attr('fill', 'white')
          .attr('font-size', '10px')
          .attr('font-weight', '500')
          .attr('opacity', 0.9)
          .text(obj.name)
      }
    }

    // ─────────────────────────────────────────
    // AXES
    // ─────────────────────────────────────────
    
    // X-axis (Mass)
    const xAxis = d3.axisBottom(xScale)
      .tickValues([-40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60])
      .tickFormat(d => `10${formatSuperscript(d as number)}`)
    
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .attr('color', 'white')
      .attr('opacity', 0.6)
    
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 45)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('opacity', 0.8)
      .text('Mass (grams)')
    
    // Y-axis (Radius)
    const yAxis = d3.axisLeft(yScale)
      .tickValues([-30, -20, -10, 0, 10, 20])
      .tickFormat(d => `10${formatSuperscript(d as number)}`)
    
    g.append('g')
      .call(yAxis)
      .attr('color', 'white')
      .attr('opacity', 0.6)
    
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -55)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('opacity', 0.8)
      .text('Radius (cm)')

    // ─────────────────────────────────────────
    // ZOOM BEHAVIOR
    // ─────────────────────────────────────────
    
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 10])
      .on('zoom', (event) => {
        chartArea.attr('transform', event.transform)
      })
    
    svg.call(zoom)

  }, [dimensions, objects, boundaries, showEpochs, showDomination, onObjectClick, onObjectHover, onBoundaryClick])

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="bg-[#0a0a0f]"
      />
      
      {/* Tooltip */}
      {tooltip.visible && tooltip.object && (
        <div
          className="fixed z-50 pointer-events-none bg-black/90 backdrop-blur-sm rounded-lg p-3 max-w-xs border border-white/20"
          style={{
            left: tooltip.x + 15,
            top: tooltip.y - 10,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: CATEGORIES[tooltip.object.category].color }}
            />
            <span className="font-medium text-sm">{tooltip.object.name}</span>
          </div>
          <p className="text-xs text-white/60 mb-2">{tooltip.object.tagline}</p>
          <div className="flex gap-4 text-xs font-mono text-white/50">
            <span>R: {tooltip.object.radius.formatted}</span>
            <span>M: {tooltip.object.mass.formatted}</span>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## FILE: src/app/data/permissible-universe/components/ObjectModal.tsx
```tsx
'use client'

// ===========================================
// OBJECT MODAL
// ===========================================
// Full modal with object details and 4 explanation levels

import React from 'react'
import { X, ExternalLink, ChevronRight } from 'lucide-react'
import { CosmicObject } from '../lib/types'
import { CATEGORIES } from '../lib/constants'
import { getObject } from '../lib/index'

interface Props {
  object: CosmicObject
  explanationLevel: 1 | 2 | 3 | 4
  onLevelChange: (level: 1 | 2 | 3 | 4) => void
  onClose: () => void
  onObjectClick: (id: string) => void
}

const LEVEL_LABELS = {
  1: { name: 'Accessible', description: 'Anyone can understand' },
  2: { name: 'Intuitive', description: 'High school physics' },
  3: { name: 'Technical', description: 'Undergraduate level' },
  4: { name: 'Advanced', description: 'Graduate level' },
}

export function ObjectModal({
  object,
  explanationLevel,
  onLevelChange,
  onClose,
  onObjectClick,
}: Props) {
  const category = CATEGORIES[object.category]
  
  const getExplanation = () => {
    switch (explanationLevel) {
      case 1: return object.explanations.accessible
      case 2: return object.explanations.intuitive
      case 3: return object.explanations.technical
      case 4: return object.explanations.advanced || object.explanations.technical
      default: return object.explanations.accessible
    }
  }

  const relatedObjects = object.nearbyObjects
    .map(id => getObject(id))
    .filter(Boolean) as CosmicObject[]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#111118] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-[#111118] border-b border-white/10 px-6 py-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                {category.name}
              </span>
            </div>
            <h2 className="text-2xl font-light text-white">{object.name}</h2>
            <p className="text-white/60 text-sm mt-1">{object.tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">
          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">
                Radius
              </div>
              <div className="text-xl font-mono text-white">
                {object.radius.formatted}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">
                Mass
              </div>
              <div className="text-xl font-mono text-white">
                {object.mass.formatted}
              </div>
            </div>
          </div>
          
          {/* Discovery info */}
          {object.discovered && (
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">
                Discovery
              </div>
              <p className="text-white/80 text-sm">
                Discovered in <span className="text-white font-medium">{object.discovered.year}</span> by{' '}
                <span className="text-white font-medium">{object.discovered.by}</span>
                {object.discovered.how && (
                  <span className="text-white/60"> ({object.discovered.how})</span>
                )}
              </p>
            </div>
          )}
          
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
              Overview
            </h3>
            <p className="text-white/80 leading-relaxed whitespace-pre-line">
              {object.description}
            </p>
          </div>
          
          {/* Why This Size */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
              Why This Size?
            </h3>
            <p className="text-white/80 leading-relaxed">
              {object.whyThisSize}
            </p>
          </div>
          
          {/* Explanation Level Selector */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
              Deeper Understanding
            </h3>
            <div className="flex gap-1 bg-white/5 rounded-xl p-1">
              {([1, 2, 3, 4] as const).map((level) => {
                const hasContent = level === 4 
                  ? !!object.explanations.advanced 
                  : true
                
                return (
                  <button
                    key={level}
                    onClick={() => hasContent && onLevelChange(level)}
                    disabled={!hasContent}
                    className={`
                      flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors
                      ${explanationLevel === level 
                        ? 'bg-white text-black' 
                        : hasContent
                          ? 'text-white/60 hover:bg-white/10'
                          : 'text-white/20 cursor-not-allowed'
                      }
                    `}
                  >
                    <div>{LEVEL_LABELS[level].name}</div>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-white/40 mt-2 text-center">
              {LEVEL_LABELS[explanationLevel].description}
            </p>
          </div>
          
          {/* Explanation Content */}
          <div className="bg-white/5 rounded-xl p-5 mb-6">
            <p className="text-white/80 leading-relaxed whitespace-pre-line text-sm">
              {getExplanation()}
            </p>
          </div>
          
          {/* Related Objects */}
          {relatedObjects.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                Related Objects
              </h3>
              <div className="flex flex-wrap gap-2">
                {relatedObjects.map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => onObjectClick(rel.id)}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors group"
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: CATEGORIES[rel.category].color }}
                    />
                    <span className="text-sm text-white/80">{rel.name}</span>
                    <ChevronRight className="w-3 h-3 text-white/40 group-hover:text-white/60" />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Related Boundaries */}
          {object.relatedBoundaries.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                Related Boundaries
              </h3>
              <div className="flex flex-wrap gap-2">
                {object.relatedBoundaries.map(boundaryId => (
                  <span
                    key={boundaryId}
                    className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white/60"
                  >
                    {boundaryId.charAt(0).toUpperCase() + boundaryId.slice(1)} Limit
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## FILE: src/app/data/permissible-universe/components/BoundaryModal.tsx
```tsx
'use client'

// ===========================================
// BOUNDARY MODAL
// ===========================================
// Full modal with boundary details and 4 explanation levels

import React from 'react'
import { X, ChevronRight, AlertTriangle } from 'lucide-react'
import { Boundary } from '../lib/types'
import { getObject } from '../lib/index'
import { CATEGORIES } from '../lib/constants'

interface Props {
  boundary: Boundary
  explanationLevel: 1 | 2 | 3 | 4
  onLevelChange: (level: 1 | 2 | 3 | 4) => void
  onClose: () => void
  onObjectClick: (id: string) => void
}

const LEVEL_LABELS = {
  1: { name: 'Accessible', description: 'Anyone can understand' },
  2: { name: 'Intuitive', description: 'High school physics' },
  3: { name: 'Technical', description: 'Undergraduate level' },
  4: { name: 'Advanced', description: 'Graduate level' },
}

export function BoundaryModal({
  boundary,
  explanationLevel,
  onLevelChange,
  onClose,
  onObjectClick,
}: Props) {
  
  const getExplanation = () => {
    switch (explanationLevel) {
      case 1: return boundary.explanations.accessible
      case 2: return boundary.explanations.intuitive
      case 3: return boundary.explanations.technical
      case 4: return boundary.explanations.advanced
      default: return boundary.explanations.accessible
    }
  }

  const definingObjects = boundary.definingObjects
    .map(id => getObject(id))
    .filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#111118] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        {/* Header */}
        <div 
          className="sticky top-0 border-b border-white/10 px-6 py-4 flex items-start justify-between"
          style={{ backgroundColor: boundary.color + '20' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4" style={{ color: boundary.color }} />
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: boundary.color }}>
                Forbidden Zone
              </span>
            </div>
            <h2 className="text-2xl font-light text-white">{boundary.name}</h2>
            <p className="text-white/60 text-sm mt-1">{boundary.shortName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">
          {/* Equation */}
          <div className="bg-white/5 rounded-xl p-5 mb-6 text-center">
            <div className="text-3xl font-mono text-white mb-2">
              {boundary.equation
                .replace(/\\frac{(.+?)}{(.+?)}/g, '($1)/($2)')
                .replace(/\\/g, '')
                .replace(/_/g, '₍')
                .replace(/\^/g, '^')
              }
            </div>
            <p className="text-sm text-white/50">
              {boundary.equationExplained}
            </p>
          </div>
          
          {/* Explanation Level Selector */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
              Understanding the Boundary
            </h3>
            <div className="flex gap-1 bg-white/5 rounded-xl p-1">
              {([1, 2, 3, 4] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => onLevelChange(level)}
                  className={`
                    flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors
                    ${explanationLevel === level 
                      ? 'bg-white text-black' 
                      : 'text-white/60 hover:bg-white/10'
                    }
                  `}
                >
                  <div>{LEVEL_LABELS[level].name}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-2 text-center">
              {LEVEL_LABELS[explanationLevel].description}
            </p>
          </div>
          
          {/* Explanation Content */}
          <div className="bg-white/5 rounded-xl p-5 mb-6">
            <p className="text-white/80 leading-relaxed whitespace-pre-line text-sm">
              {getExplanation()}
            </p>
          </div>
          
          {/* Counterfactual */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
              What If This Limit Didn't Exist?
            </h3>
            <div className="bg-gradient-to-r from-white/5 to-transparent rounded-xl p-5 border-l-2" style={{ borderColor: boundary.color }}>
              <p className="text-white/80 leading-relaxed whitespace-pre-line text-sm">
                {boundary.counterfactual}
              </p>
            </div>
          </div>
          
          {/* Implications */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
              Implications
            </h3>
            <ul className="space-y-2">
              {boundary.implications.map((impl, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                  <div 
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: boundary.color }}
                  />
                  <span>{impl}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Defining Objects */}
          {definingObjects.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                Objects at This Boundary
              </h3>
              <div className="flex flex-wrap gap-2">
                {definingObjects.map(obj => obj && (
                  <button
                    key={obj.id}
                    onClick={() => onObjectClick(obj.id)}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors group"
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: CATEGORIES[obj.category].color }}
                    />
                    <span className="text-sm text-white/80">{obj.name}</span>
                    <ChevronRight className="w-3 h-3 text-white/40 group-hover:text-white/60" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## FILE: src/app/data/permissible-universe/components/CategoryFilter.tsx
```tsx
'use client'

// ===========================================
// CATEGORY FILTER
// ===========================================
// Toggle buttons for filtering objects by category

import React from 'react'
import { ObjectCategory, CategoryMeta } from '../lib/types'

interface Props {
  categories: Record<ObjectCategory, CategoryMeta>
  visible: Set<ObjectCategory>
  onToggle: (category: ObjectCategory) => void
  onShowAll: () => void
  onHideAll: () => void
}

export function CategoryFilter({
  categories,
  visible,
  onToggle,
  onShowAll,
  onHideAll,
}: Props) {
  const categoryList = Object.values(categories).sort((a, b) => a.order - b.order)
  const allVisible = visible.size === categoryList.length
  const noneVisible = visible.size === 0

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* All/None buttons */}
      <div className="flex gap-1 mr-2">
        <button
          onClick={onShowAll}
          className={`
            px-2 py-1 text-xs rounded transition-colors
            ${allVisible 
              ? 'bg-white/20 text-white' 
              : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
            }
          `}
        >
          All
        </button>
        <button
          onClick={onHideAll}
          className={`
            px-2 py-1 text-xs rounded transition-colors
            ${noneVisible 
              ? 'bg-white/20 text-white' 
              : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
            }
          `}
        >
          None
        </button>
      </div>

      {/* Category toggles */}
      {categoryList.map((cat) => {
        const isVisible = visible.has(cat.id)
        
        return (
          <button
            key={cat.id}
            onClick={() => onToggle(cat.id)}
            className={`
              flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-all
              ${isVisible 
                ? 'bg-white/10 text-white' 
                : 'bg-transparent text-white/30 hover:text-white/50'
              }
            `}
          >
            <span
              className="w-2 h-2 rounded-full transition-opacity"
              style={{ 
                backgroundColor: cat.color,
                opacity: isVisible ? 1 : 0.3,
              }}
            />
            <span className="hidden sm:inline">{cat.shortName}</span>
          </button>
        )
      })}
    </div>
  )
}
```

---

## FILE: src/app/data/permissible-universe/components/SearchBox.tsx
```tsx
'use client'

// ===========================================
// SEARCH BOX
// ===========================================
// Search input with dropdown results

import React, { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { CosmicObject } from '../lib/types'
import { CATEGORIES } from '../lib/constants'

interface Props {
  value: string
  onChange: (value: string) => void
  results: CosmicObject[]
  onResultClick: (id: string) => void
}

export function SearchBox({
  value,
  onChange,
  results,
  onResultClick,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResultClick = (id: string) => {
    onResultClick(id)
    setIsOpen(false)
    onChange('')
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search objects..."
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-8 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-3 h-3 text-white/40" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && value && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1f] border border-white/10 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
          {results.slice(0, 10).map((obj) => (
            <button
              key={obj.id}
              onClick={() => handleResultClick(obj.id)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors text-left"
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORIES[obj.category].color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">{obj.name}</div>
                <div className="text-xs text-white/40 truncate">{obj.tagline}</div>
              </div>
            </button>
          ))}
          {results.length > 10 && (
            <div className="px-3 py-2 text-xs text-white/30 text-center">
              +{results.length - 10} more results
            </div>
          )}
        </div>
      )}

      {/* No results */}
      {isOpen && value && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1f] border border-white/10 rounded-lg p-3 text-sm text-white/40 text-center">
          No objects found
        </div>
      )}
    </div>
  )
}
```

---

## FILE: src/app/data/permissible-universe/components/ViewToggle.tsx
```tsx
'use client'

// ===========================================
// VIEW TOGGLE
// ===========================================
// Switch between Map and Limits views

import React from 'react'
import { Map, ListTree } from 'lucide-react'
import { ViewMode } from '../lib/types'

interface Props {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
}

export function ViewToggle({ mode, onChange }: Props) {
  return (
    <div className="flex bg-white/5 rounded-lg p-1">
      <button
        onClick={() => onChange('map')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
          ${mode === 'map' 
            ? 'bg-white text-black' 
            : 'text-white/60 hover:text-white hover:bg-white/5'
          }
        `}
      >
        <Map className="w-4 h-4" />
        <span>The Map</span>
      </button>
      <button
        onClick={() => onChange('limits')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
          ${mode === 'limits' 
            ? 'bg-white text-black' 
            : 'text-white/60 hover:text-white hover:bg-white/5'
          }
        `}
      >
        <ListTree className="w-4 h-4" />
        <span>The Limits</span>
      </button>
    </div>
  )
}
```

---

## FILE: src/app/data/permissible-universe/components/LimitsView.tsx
```tsx
'use client'

// ===========================================
// LIMITS VIEW
// ===========================================
// Card-based view showing the four fundamental limits

import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Boundary } from '../lib/types'
import { BOUNDARY_COLORS } from '../lib/constants'

interface Props {
  boundaries: Boundary[]
  onBoundaryClick: (id: string) => void
}

const BOUNDARY_ICONS: Record<string, string> = {
  schwarzschild: '⚫',
  compton: '〰️',
  planck: '⚛️',
  hubble: '🌌',
}

const BOUNDARY_SUBTITLES: Record<string, string> = {
  schwarzschild: 'The Black Hole Limit',
  compton: 'The Quantum Limit',
  planck: 'The Resolution of Reality',
  hubble: 'The Edge of the Observable',
}

export function LimitsView({ boundaries, onBoundaryClick }: Props) {
  return (
    <div className="px-4 md:px-8 lg:px-12 py-8 md:py-12">
      {/* Intro */}
      <div className="max-w-3xl mb-12">
        <h2 className="text-2xl md:text-3xl font-light mb-4">
          The Four Limits
        </h2>
        <p className="text-white/60 leading-relaxed">
          The universe permits only certain combinations of mass and size. 
          These four boundaries carve out the "permissible" zone where matter, 
          energy, and structure can exist. Beyond them lie the forbidden regions — 
          where the laws of physics say "nothing here."
        </p>
      </div>

      {/* Boundary Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {boundaries.map((boundary) => {
          const colors = BOUNDARY_COLORS[boundary.id as keyof typeof BOUNDARY_COLORS]
          
          return (
            <button
              key={boundary.id}
              onClick={() => onBoundaryClick(boundary.id)}
              className="group text-left bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{BOUNDARY_ICONS[boundary.id]}</span>
                    <h3 className="text-xl font-medium text-white">
                      {boundary.name}
                    </h3>
                  </div>
                  <p className="text-sm text-white/50">
                    {BOUNDARY_SUBTITLES[boundary.id]}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
              </div>

              {/* Equation */}
              <div 
                className="inline-block font-mono text-sm px-3 py-1.5 rounded-lg mb-4"
                style={{ 
                  backgroundColor: colors?.fill || 'rgba(255,255,255,0.1)',
                  color: colors?.line || 'white',
                }}
              >
                {boundary.equation}
              </div>

              {/* Description */}
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                {boundary.explanations.accessible}
              </p>

              {/* What it forbids */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/40">Forbids:</span>
                <span 
                  className="px-2 py-0.5 rounded"
                  style={{ 
                    backgroundColor: colors?.fill || 'rgba(255,255,255,0.1)',
                    color: colors?.line || 'white',
                  }}
                >
                  {boundary.forbiddenSide === 'above' && 'Region above the line'}
                  {boundary.forbiddenSide === 'below' && 'Region below the line'}
                  {boundary.forbiddenSide === 'left' && 'Region to the left'}
                  {boundary.forbiddenSide === 'right' && 'Region to the right'}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* The Intersection */}
      <div className="mt-12 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-6 md:p-8">
        <h3 className="text-xl font-medium mb-4">
          Where They Meet
        </h3>
        <p className="text-white/60 leading-relaxed mb-6">
          The Schwarzschild and Compton lines intersect at a single point: the 
          <span className="text-white font-medium"> Planck mass</span> (~22 micrograms, 
          10<sup>-5</sup> grams). This is the only mass where an object could be 
          simultaneously a black hole and a quantum particle. It marks the boundary 
          where general relativity and quantum mechanics must somehow merge — the 
          domain of quantum gravity, still not fully understood.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="bg-white/5 rounded-lg px-4 py-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Planck Mass</div>
            <div className="font-mono text-white">2.18 × 10⁻⁵ g</div>
          </div>
          <div className="bg-white/5 rounded-lg px-4 py-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Planck Length</div>
            <div className="font-mono text-white">1.62 × 10⁻³³ cm</div>
          </div>
          <div className="bg-white/5 rounded-lg px-4 py-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Planck Time</div>
            <div className="font-mono text-white">5.39 × 10⁻⁴⁴ s</div>
          </div>
        </div>
      </div>

      {/* Why It Matters */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-xl p-5">
          <h4 className="font-medium mb-2">No Arbitrary Sizes</h4>
          <p className="text-sm text-white/60">
            You can't make a stable object of any mass at any size. 
            A grain of sand compressed to Planck length would become a black hole. 
            An electron expanded to a meter would violate quantum mechanics.
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-5">
          <h4 className="font-medium mb-2">Fine-Tuned Universe</h4>
          <p className="text-sm text-white/60">
            The fundamental constants (G, ℏ, c) set these boundaries. 
            Different constants would give different limits — and possibly 
            no "permissible" zone where complexity can exist.
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-5">
          <h4 className="font-medium mb-2">We Live in the Middle</h4>
          <p className="text-sm text-white/60">
            Humans, planets, and stars occupy a comfortable middle ground. 
            Not so small we're quantum fuzzy. Not so dense we collapse. 
            Not so large we exceed the cosmic horizon.
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

