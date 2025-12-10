'use client'

import WidgetFrame from '@/components/WidgetFrame'
import PendulumWave from '@/components/widgets/PendulumWave'
// Future imports:
// import CellularAutomata from '@/components/widgets/CellularAutomata'
// import ReactionDiffusion from '@/components/widgets/ReactionDiffusion'

export default function PatternsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Page header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">
            Patterns
          </h1>
          <p className="text-base md:text-lg text-black max-w-2xl">
            Watch order emerge from chaos. These simulations show how simple rules 
            create complex, beautiful patterns — the same mathematics that shapes 
            snowflakes, zebra stripes, and galaxy spirals.
          </p>
        </div>

        {/* Widget grid: 1 col mobile, 2 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          {/* Pendulum Wave */}
          <WidgetFrame
            title="Pendulum Wave"
            info={{
              description:
                'Fifteen pendulums, each with a slightly different period. They start in phase, drift apart creating mesmerising wave patterns, then eventually realign. The full cycle takes about 6 seconds.',
              source: 'Simple harmonic motion simulation',
              controls: [
                { name: 'Trails', description: 'Show motion trails for visual effect' },
                { name: 'Speed', description: 'Adjust simulation speed from 0.25× to 3×' },
              ],
            }}
            status="ok"
          >
            <PendulumWave />
          </WidgetFrame>

          {/* Placeholder: Cellular Automata */}
          <WidgetFrame
            title="Cellular Automata"
            info={{
              description: 'Coming soon. Elementary cellular automata — simple rules creating complex patterns.',
              source: 'Rule-based simulation',
            }}
            status="loading"
          >
            <div className="p-8 text-center text-black/30">
              <div className="text-4xl mb-4">🔲</div>
              <div className="text-sm">Coming soon</div>
            </div>
          </WidgetFrame>

          {/* Placeholder: Reaction-Diffusion */}
          <WidgetFrame
            title="Reaction-Diffusion"
            info={{
              description: 'Coming soon. The Gray-Scott model — chemistry that creates leopard spots and fingerprints.',
              source: 'Turing pattern simulation',
            }}
            status="loading"
          >
            <div className="p-8 text-center text-black/30">
              <div className="text-4xl mb-4">🌊</div>
              <div className="text-sm">Coming soon</div>
            </div>
          </WidgetFrame>

        </div>
      </div>

      {/* Mobile bottom padding for nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}