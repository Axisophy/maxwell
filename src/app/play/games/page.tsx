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

          {/* Ptolemy - Science Quiz - Special styling to match game */}
          <WidgetFrame
            title="Ptolemy"
            description="A science quiz game that takes you from curious child to world expert. Ten difficulty tiers spanning scientific knowledge. Answer quickly, build streaks, and climb to mastery."
            source="MXWLL Original"
            status="ok"
          >
            <Link
              href="/play/games/ptolemy"
              className="aspect-square flex flex-col items-center justify-center p-8 group transition-all hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)',
              }}
            >
              {/* Title in Strelka Ultra */}
              <h3
                className="text-3xl md:text-4xl mb-2 text-center"
                style={{
                  fontFamily: '"strelka", sans-serif',
                  fontWeight: 800,
                  color: '#78350f',
                  textShadow: '1px 1px 0 #fbbf24'
                }}
              >
                PTOLEMY
              </h3>

              {/* Subtitle */}
              <p
                className="text-sm mb-4"
                style={{
                  fontFamily: '"strelka", sans-serif',
                  fontWeight: 800,
                  color: '#92400e'
                }}
              >
                The Science Quiz
              </p>

              {/* Description */}
              <p className="text-amber-800 text-sm text-center mb-4 max-w-xs">
                Test your knowledge of the cosmos, life, and everything in between.
              </p>

              {/* Stats in Input Mono */}
              <div
                className="flex flex-wrap justify-center gap-3 text-xs mb-6"
                style={{ fontFamily: '"Input Mono", monospace' }}
              >
                <span className="bg-white/60 px-2 py-1 rounded text-amber-700">250 questions</span>
                <span className="bg-white/60 px-2 py-1 rounded text-amber-700">10 tiers</span>
                <span className="bg-white/60 px-2 py-1 rounded text-amber-700">∞ replayable</span>
              </div>

              <p
                className="text-sm font-medium group-hover:underline"
                style={{
                  fontFamily: '"strelka", sans-serif',
                  fontWeight: 800,
                  color: '#78350f'
                }}
              >
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
