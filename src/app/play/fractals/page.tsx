'use client'

import WidgetFrame from '@/components/WidgetFrame'
import FractalExplorer from '@/components/widgets/FractalExplorer'

export default function FractalsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Page header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">
            Fractals
          </h1>
          <p className="text-base md:text-lg text-black max-w-2xl">
            Infinite complexity from simple equations. Zoom in forever and find the same
            patterns repeating at every scale - the geometry of coastlines, mountains,
            and the branching of trees.
          </p>
        </div>

        {/* Widget grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          {/* Fractal Explorer */}
          <WidgetFrame
            title="Fractal Explorer"
            description="Explore the Mandelbrot and Julia sets - the most famous fractals in mathematics. Click to zoom in and discover infinite detail. Each point represents whether a simple equation escapes to infinity or stays bounded."
            source="Mathematical visualisation"
            status="ok"
          >
            <FractalExplorer />
          </WidgetFrame>

          {/* Placeholder: Julia Set */}
          <WidgetFrame
            title="Julia Sets"
            description="Coming soon. The Mandelbrot set's infinite family of cousins - each point in the Mandelbrot corresponds to a unique Julia set."
            source="Mathematical visualisation"
            status="loading"
          >
            <div className="aspect-square flex items-center justify-center bg-[#1a1a1a] rounded-lg m-4">
              <div className="text-center text-white/30">
                <div className="text-4xl mb-4">*</div>
                <div className="text-sm">Coming soon</div>
              </div>
            </div>
          </WidgetFrame>

        </div>

        {/* Context section */}
        <div className="mt-12 md:mt-16 max-w-2xl">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">
            What is a Fractal?
          </h2>
          <div className="space-y-4 text-base text-black/70">
            <p>
              A fractal is a shape that contains smaller copies of itself at every scale.
              Zoom into a coastline on a map and you'll find the same jagged patterns
              repeating - bays within bays within bays, forever.
            </p>
            <p>
              The Mandelbrot set, discovered by Benoit Mandelbrot in 1980, is generated
              by a remarkably simple equation: z = z² + c. For each point c in the
              complex plane, we ask: does this equation explode to infinity, or stay
              bounded? The boundary between these two behaviours creates infinite detail.
            </p>
            <p>
              Fractals appear throughout nature: in ferns, lightning bolts, river
              networks, blood vessels, and the distribution of galaxies. They're
              the hidden geometry of roughness.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile bottom padding for nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
