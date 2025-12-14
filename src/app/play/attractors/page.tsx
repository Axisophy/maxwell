'use client'

import WidgetFrame from '@/components/WidgetFrame'
import RosslerAttractor from '@/components/widgets/RosslerAttractor'
// Future imports:
// import LorenzAttractor from '@/components/widgets/LorenzAttractor'
// import ThomasAttractor from '@/components/widgets/ThomasAttractor'

export default function AttractorsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Page header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">
            Strange Attractors
          </h1>
          <p className="text-base md:text-lg text-black max-w-2xl">
            Chaotic systems that never repeat, yet always stay bounded. These mathematical
            objects were discovered in the 1960s and 70s — shapes that emerge from simple
            equations but contain infinite complexity.
          </p>
        </div>

        {/* Widget grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          {/* Rössler Attractor */}
          <WidgetFrame
            title="Rössler Attractor"
            description="Discovered by Otto Rössler in 1976 while studying chemical reactions. The simplest strange attractor — just three equations create this endlessly spiralling, never-repeating shape. Adjust parameters a, b, and c to see how small changes create dramatically different patterns."
            source="Mathematical simulation"
            status="ok"
          >
            <RosslerAttractor />
          </WidgetFrame>

          {/* Placeholder: Lorenz Attractor */}
          <WidgetFrame
            title="Lorenz Attractor"
            description="Coming soon. The butterfly effect, visualised — Edward Lorenz discovered this in 1963 while modelling weather."
            source="Mathematical simulation"
            status="loading"
          >
            <div className="aspect-square flex items-center justify-center bg-[#1a1a1a] rounded-lg m-4">
              <div className="text-center text-white/30">
                <div className="text-4xl mb-4">🦋</div>
                <div className="text-sm">Coming soon</div>
              </div>
            </div>
          </WidgetFrame>

          {/* Placeholder: Thomas Attractor */}
          <WidgetFrame
            title="Thomas Attractor"
            description="Coming soon. A cyclically symmetric attractor discovered by René Thomas."
            source="Mathematical simulation"
            status="loading"
          >
            <div className="aspect-square flex items-center justify-center bg-[#1a1a1a] rounded-lg m-4">
              <div className="text-center text-white/30">
                <div className="text-4xl mb-4">∞</div>
                <div className="text-sm">Coming soon</div>
              </div>
            </div>
          </WidgetFrame>

          {/* Placeholder: Aizawa Attractor */}
          <WidgetFrame
            title="Aizawa Attractor"
            description="Coming soon. A beautiful torus-shaped strange attractor."
            source="Mathematical simulation"
            status="loading"
          >
            <div className="aspect-square flex items-center justify-center bg-[#1a1a1a] rounded-lg m-4">
              <div className="text-center text-white/30">
                <div className="text-4xl mb-4">◎</div>
                <div className="text-sm">Coming soon</div>
              </div>
            </div>
          </WidgetFrame>

        </div>

        {/* Context section */}
        <div className="mt-12 md:mt-16 max-w-2xl">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            What is a Strange Attractor?
          </h2>
          <div className="space-y-4 text-base text-black/70">
            <p>
              An attractor is where a system naturally tends to end up. Drop a marble in a bowl
              and it settles at the bottom — that's a simple attractor, a single point.
            </p>
            <p>
              A <em>strange</em> attractor is different. The system never settles. It keeps
              moving forever, tracing out an intricate shape, never exactly repeating its path
              but never leaving the attractor either. It's bounded chaos.
            </p>
            <p>
              These shapes are fractal — zoom in and you find infinite detail. They appear in
              weather systems, fluid turbulence, population dynamics, and the beating of the
              human heart.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile bottom padding for nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
