'use client'

import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { PlayIcon } from '@/components/icons'

const playCategories = [
  {
    href: '/play/attractors',
    title: 'Attractors',
    description: 'Strange attractors rendered as beautiful design objects. Rössler, Lorenz, Aizawa, and more.',
  },
  {
    href: '/play/fractals',
    title: 'Fractals',
    description: 'Infinite complexity at every scale. Mandelbrot, Julia sets, and fractal explorers.',
  },
  {
    href: '/play/patterns',
    title: 'Patterns',
    description: 'Emergent complexity from simple rules. Cellular automata, reaction-diffusion, pendulums.',
  },
  {
    href: '/play/games',
    title: 'Games',
    description: 'Science-themed games and simulations. Game theory, orbital mechanics, and more.',
  },
]

const featuredExplorations = [
  {
    href: '/play/attractors/lorenz',
    title: 'Lorenz Attractor',
    description: 'The butterfly that started chaos theory',
  },
  {
    href: '/play/attractors/rossler',
    title: 'Rössler Attractor',
    description: 'Elegant spiral chaos in three dimensions',
  },
  {
    href: '/play/attractors/aizawa',
    title: 'Aizawa Attractor',
    description: 'A torus-like strange attractor',
  },
]

// VitalSign component
function PlayVitalSign({
  value,
  label,
  href,
}: {
  value: string | number
  label: string
  href?: string
}) {
  const content = (
    <div className={`p-2 md:p-4 text-left bg-black rounded-lg ${href ? 'hover:bg-neutral-900 transition-colors' : ''}`}>
      <div className="text-[10px] md:text-xs text-white/50 uppercase mb-1 md:mb-2">
        {label}
      </div>
      <div className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] tabular-nums text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  )

  if (href) {
    return <Link href={href} className="block">{content}</Link>
  }
  return content
}

// Category Card
function CategoryCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block p-2 md:p-4 bg-black rounded-lg border border-white/10 hover:border-white/30 transition-colors"
    >
      <h2 className="text-2xl md:text-3xl font-light text-white uppercase mb-2">
        {title}
      </h2>
      <p className="text-sm text-white/50">
        {description}
      </p>
    </Link>
  )
}

// Exploration Card
function ExplorationCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block p-2 md:p-4 bg-black rounded-lg border border-white/10 hover:border-white/30 transition-colors"
    >
      <h3 className="text-lg md:text-xl font-light text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-white/50">
        {description}
      </p>
    </Link>
  )
}

// Coming Soon Card
function ComingSoonCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="block p-2 md:p-4 bg-black rounded-lg border border-white/10 opacity-50">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-xl md:text-2xl font-light text-white uppercase">
          {title}
        </h2>
        <span className="text-[10px] text-white/40 uppercase tracking-wider">
          Coming Soon
        </span>
      </div>
      <p className="text-sm text-white/50">
        {description}
      </p>
    </div>
  )
}

export default function PlayPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="block bg-white rounded-lg py-1 md:py-2 px-2 md:px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Play' },
              ]}
              theme="light"
            />
          </div>
        </div>

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <PlayIcon className="text-black mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase mb-3">
              Play
            </h1>
            <p className="text-base md:text-lg text-black/60 max-w-2xl">
              Mathematical visualisations, interactive simulations, and science-themed games.
              Beautiful complexity you can explore and manipulate.
            </p>
          </section>

          {/* Stats Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              Explorations
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              <PlayVitalSign
                value={playCategories.length}
                label="Categories"
              />
              <PlayVitalSign
                value="3"
                label="Attractors"
                href="/play/attractors"
              />
              <PlayVitalSign
                value="2"
                label="Fractals"
                href="/play/fractals"
              />
              <PlayVitalSign
                value="∞"
                label="Possibilities"
              />
            </div>
          </section>

          {/* Featured Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              Featured
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
              {featuredExplorations.map((exploration) => (
                <ExplorationCard
                  key={exploration.href}
                  title={exploration.title}
                  description={exploration.description}
                  href={exploration.href}
                />
              ))}
            </div>
          </section>

          {/* Categories Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              Categories
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {playCategories.map((category) => (
                <CategoryCard
                  key={category.href}
                  title={category.title}
                  description={category.description}
                  href={category.href}
                />
              ))}
            </div>
          </section>

          {/* Coming Soon Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              Coming Soon
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
              <ComingSoonCard
                title="Pendulum Wave"
                description="Mesmerising patterns from 15 pendulums of different lengths."
              />
              <ComingSoonCard
                title="Game Theory"
                description="Play iterated prisoner's dilemma against classic strategies."
              />
              <ComingSoonCard
                title="Orbital Mechanics"
                description="Launch satellites and explore gravitational dynamics."
              />
            </div>
          </section>

          {/* Design Philosophy Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              Design Philosophy
            </div>
            <div className="max-w-2xl space-y-3 text-sm text-black/60">
              <p>
                Every visualisation here treats mathematics as a design medium. These aren't
                educational toys or simplified demonstrations — they're the real equations,
                rendered with the same care you'd expect from a design object.
              </p>
              <p>
                Parameters are exposed. Colours are considered. Each piece invites you to
                explore the space of possibilities that emerges from simple rules.
              </p>
            </div>
          </section>

          {/* Cross-references Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-sm text-black/40 uppercase tracking-wider mb-3">
              Related
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/vault"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Vault Library →
              </Link>
              <Link
                href="/data"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Data Reference →
              </Link>
              <Link
                href="/observe"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Observe →
              </Link>
            </div>
          </section>

        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
