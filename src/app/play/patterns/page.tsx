'use client'

import WidgetFrame from '@/components/WidgetFrame'
import PendulumWave from '@/components/widgets/PendulumWave'
import CellularAutomata from '@/components/widgets/CellularAutomata'
import ReactionDiffusion from '@/components/widgets/ReactionDiffusion'

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
            description="Fifteen pendulums, each with a slightly different period. They start in phase, drift apart creating mesmerising wave patterns, then eventually realign. The full cycle takes about 6 seconds."
            source="Simple harmonic motion simulation"
            status="ok"
          >
            <PendulumWave />
          </WidgetFrame>

          {/* Cellular Automata */}
          <WidgetFrame
            title="Cellular Automata"
            description="Elementary cellular automata and Conway's Game of Life — simple rules creating complex, emergent patterns from nothing but local interactions."
            source="Rule-based simulation"
            status="ok"
          >
            <CellularAutomata />
          </WidgetFrame>

          {/* Reaction-Diffusion */}
          <WidgetFrame
            title="Reaction-Diffusion"
            description="The Gray-Scott model — the mathematics behind leopard spots, zebra stripes, and fingerprints. Watch Turing patterns emerge from chemical chaos."
            source="Turing pattern simulation"
            status="ok"
          >
            <ReactionDiffusion />
          </WidgetFrame>

        </div>
      </div>

      {/* Mobile bottom padding for nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
