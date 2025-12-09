import Link from 'next/link'

export const metadata = {
  title: 'About — MXWLL',
  description: 'MXWLL is the quality layer for science. We curate and present science the way it deserves to be presented.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="px-4 md:px-8 lg:px-12 py-12 md:py-24">
        <div className="max-w-3xl">
          {/* Header */}
          <h1 
            className="text-4xl md:text-6xl font-bold text-black mb-8"
            style={{ letterSpacing: '-0.02em' }}
          >
            About MXWLL
          </h1>

          {/* The problem */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-4">The Problem</h2>
            <p className="text-lg text-black/80 leading-relaxed mb-4">
              All the science is already out there.
            </p>
            <p className="text-lg text-black/80 leading-relaxed mb-4">
              NASA publishes live solar imagery. NOAA streams space weather data. USGS tracks every earthquake in real time. Thousands of papers are published daily on arXiv. The great works of Darwin, Maxwell, Faraday, and Euclid are in the public domain.
            </p>
            <p className="text-lg text-black/80 leading-relaxed">
              But finding it means wading through government websites designed in 2003, paywalled journals with hostile interfaces, PDFs that haven't been touched since they were scanned, algorithmic noise and clickbait "science news", and social media distortion.
            </p>
          </section>

          {/* The solution */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-4">The Solution</h2>
            <p className="text-lg text-black/80 leading-relaxed mb-4">
              MXWLL curates and presents science the way it deserves to be presented.
            </p>
            <p className="text-lg text-black/80 leading-relaxed mb-4">
              We take freely available data, feeds, texts, and tools — and we design them with the care usually reserved for luxury products or art books. We cut through the noise. We make the invisible visible. We create a single, trustworthy place where curious people can encounter real science.
            </p>
            <p className="text-lg text-black/80 leading-relaxed">
              <strong>This is not science education.</strong> We're not explaining things to people who don't care. <strong>This is not science news.</strong> We're not chasing clicks with "Scientists say..." headlines. <strong>This is science, presented properly.</strong> For people who are already curious and deserve better than what currently exists.
            </p>
          </section>

          {/* What MXWLL offers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-4">What We Offer</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-black">Live Data Visualisations</h3>
                <p className="text-black/80">Real-time feeds from NASA, NOAA, weather satellites, and other sources. Each presented as a beautifully designed widget with its own visual personality.</p>
              </div>
              <div>
                <h3 className="font-bold text-black">The Vault</h3>
                <p className="text-black/80">Public domain scientific texts — Euclid, Darwin, Newton, Faraday — presented as readable digital editions. Commentary on modern works. Landmark papers. Multiple discovery pathways.</p>
              </div>
              <div>
                <h3 className="font-bold text-black">Scientific Tools</h3>
                <p className="text-black/80">Calculators, visualisers, explorers — designed with craft and personality. Useful and beautiful.</p>
              </div>
              <div>
                <h3 className="font-bold text-black">A Curated Experience</h3>
                <p className="text-black/80">Not everything. The right things, presented so well that people keep coming back.</p>
              </div>
            </div>
          </section>

          {/* The name */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-4">The Name</h2>
            <p className="text-lg text-black/80 leading-relaxed">
              Named for James Clerk Maxwell, who unified electricity, magnetism, and light. His equations are foundational to modern physics. The vowel-less spelling is deliberate — visually distinctive and unmistakably modern.
            </p>
          </section>

          {/* Links */}
          <section className="pt-8 border-t border-black/10">
            <div className="flex flex-wrap gap-6">
              <Link 
                href="/about/contact" 
                className="text-black underline underline-offset-4 hover:no-underline"
              >
                Contact us →
              </Link>
              <Link 
                href="/about/partnerships" 
                className="text-black underline underline-offset-4 hover:no-underline"
              >
                Institutional partnerships →
              </Link>
              <Link 
                href="/about/investment" 
                className="text-black underline underline-offset-4 hover:no-underline"
              >
                Investment opportunities →
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