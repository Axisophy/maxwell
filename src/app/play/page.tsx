import Link from 'next/link'
import { Orbit, Grid3X3, Gamepad2, Waves } from 'lucide-react'

const playCategories = [
  {
    href: '/play/attractors',
    title: 'Attractors',
    description: 'Strange attractors rendered as beautiful design objects. Rössler, Lorenz, and more.',
    icon: Orbit,
  },
  {
    href: '/play/fractals',
    title: 'Fractals',
    description: 'Infinite complexity at every scale. Mandelbrot, Julia sets, and fractal explorers.',
    icon: Grid3X3,
  },
  {
    href: '/play/patterns',
    title: 'Patterns',
    description: 'Emergent complexity from simple rules. Cellular automata, reaction-diffusion, pendulums.',
    icon: Waves,
  },
  {
    href: '/play/games',
    title: 'Games',
    description: 'Science-themed games and simulations. Game theory, orbital mechanics, and more.',
    icon: Gamepad2,
  },
]

export default function PlayPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />
      
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">Play</h1>
          <p className="text-base md:text-lg text-black max-w-2xl">
            Mathematical visualisations, interactive simulations, and science-themed games. 
            Beautiful complexity you can explore and manipulate.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {playCategories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.href}
                href={category.href}
                className="bg-white rounded-xl border border-[#e5e5e5] p-6 hover:border-black transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#f5f5f5] rounded-lg">
                    <Icon size={24} className="text-black/50" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-black mb-1 group-hover:underline">
                      {category.title}
                    </h2>
                    <p className="text-sm text-black/50">{category.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Coming soon note */}
        <div className="mt-12 text-sm text-black/50 max-w-2xl">
          More explorations coming soon - including the Rössler Attractor, Pendulum Wave, 
          and Game Theory Trainer.
        </div>
      </div>
      
      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}