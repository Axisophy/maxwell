import Link from 'next/link'
import WidgetFrame from '@/components/WidgetFrame'

export const metadata = {
  title: 'Games | MXWLL',
  description: 'Science-themed games and simulations. Game theory, quizzes, and interactive challenges.',
}

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Page header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">
            Games
          </h1>
          <p className="text-base md:text-lg text-black max-w-2xl">
            Science-themed games and interactive challenges. Test your knowledge,
            explore game theory, and simulate orbital mechanics.
          </p>
        </div>

        {/* Widget grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          {/* Ptolemy - Science Quiz */}
          <WidgetFrame
            title="Ptolemy"
            description="A science quiz game that takes you from curious child to world expert. Five difficulty tiers spanning 13 categories of scientific knowledge. Answer quickly, build streaks, and climb the ranks from Ptolemy to Planck."
            source="MXWLL Original"
            status="ok"
          >
            <Link
              href="/play/games/ptolemy"
              className="aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-8 group hover:from-amber-100 hover:to-orange-200 transition-colors"
            >
              <div className="text-6xl mb-4">🦉</div>
              <h3 className="text-xl font-medium text-black mb-2 group-hover:underline">
                Ptolemy
              </h3>
              <p className="text-sm text-black/60 text-center mb-4">
                The Science Quiz
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="bg-white/60 px-2 py-1 rounded">5 tiers</span>
                <span className="bg-white/60 px-2 py-1 rounded">13 categories</span>
                <span className="bg-white/60 px-2 py-1 rounded">1000+ questions</span>
              </div>
              <p className="mt-6 text-sm font-medium text-black/70">
                Play now →
              </p>
            </Link>
          </WidgetFrame>

          {/* Placeholder: Orbits */}
          <WidgetFrame
            title="Orbital Mechanics"
            description="Coming soon. Launch satellites, plot trajectories, and master the physics of spaceflight."
            source="Simulation"
            status="loading"
          >
            <div className="aspect-square flex items-center justify-center bg-[#1a1a1a] rounded-lg m-4">
              <div className="text-center text-white/30">
                <div className="text-4xl mb-4">🚀</div>
                <div className="text-sm">Coming soon</div>
              </div>
            </div>
          </WidgetFrame>

          {/* Placeholder: Game Theory */}
          <WidgetFrame
            title="Game Theory Trainer"
            description="Coming soon. Prisoner's dilemma, Nash equilibrium, and strategic decision making."
            source="Simulation"
            status="loading"
          >
            <div className="aspect-square flex items-center justify-center bg-[#1a1a1a] rounded-lg m-4">
              <div className="text-center text-white/30">
                <div className="text-4xl mb-4">🎲</div>
                <div className="text-sm">Coming soon</div>
              </div>
            </div>
          </WidgetFrame>

          {/* Placeholder: Taxonomy */}
          <WidgetFrame
            title="Taxonomy Tree"
            description="Coming soon. Navigate the tree of life. Identify species, learn classification, explore biodiversity."
            source="Educational game"
            status="loading"
          >
            <div className="aspect-square flex items-center justify-center bg-[#1a1a1a] rounded-lg m-4">
              <div className="text-center text-white/30">
                <div className="text-4xl mb-4">🌳</div>
                <div className="text-sm">Coming soon</div>
              </div>
            </div>
          </WidgetFrame>

        </div>

        {/* Context section */}
        <div className="mt-12 md:mt-16 max-w-2xl">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            Learn Through Play
          </h2>
          <div className="space-y-4 text-base text-black/70">
            <p>
              Games are one of the best ways to learn. They provide immediate feedback,
              create intrinsic motivation, and make abstract concepts tangible.
            </p>
            <p>
              Each game here is designed to teach something real — whether it&apos;s the
              factual knowledge in Ptolemy, the strategic thinking in game theory, or
              the intuitive physics of orbital mechanics.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile bottom padding for nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
