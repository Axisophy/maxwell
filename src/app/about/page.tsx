import Link from 'next/link'
import { PageShell, BreadcrumbFrame, PageHeaderFrame, breadcrumbItems } from '@/components/ui'

export const metadata = {
  title: 'About - MXWLL',
  description: 'MXWLL is the quality layer for science. We curate and present science the way it deserves to be presented.',
}

export default function AboutPage() {
  return (
    <PageShell>
      <BreadcrumbFrame
        variant="light"
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['About']
        )}
      />

      <PageHeaderFrame
        variant="light"
        title="About"
        description="MXWLL curates and presents science the way it deserves to be presented."
      />

      {/* Content Frame */}
      <div className="bg-white rounded-lg p-4 md:p-8 mb-px">
        <div className="max-w-2xl">

          {/* The problem */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6 first:mt-0">The Problem</h2>
            <p className="text-base md:text-lg text-black mb-5">
              All the science is already out there.
            </p>
            <p className="text-base md:text-lg text-black mb-5">
              NASA publishes live solar imagery. NOAA streams space weather data. USGS tracks every earthquake in real time. Thousands of papers are published daily on arXiv. The great works of Darwin, Maxwell, Faraday, and Euclid are in the public domain.
            </p>
            <p className="text-base md:text-lg text-black">
              But finding it means wading through government websites designed in 2003, paywalled journals with hostile interfaces, PDFs that haven't been touched since they were scanned, algorithmic noise and clickbait "science news", and social media distortion.
            </p>
          </section>

          {/* The solution */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6">The Solution</h2>
            <p className="text-base md:text-lg text-black mb-5">
              MXWLL curates and presents science the way it deserves to be presented.
            </p>
            <p className="text-base md:text-lg text-black mb-5">
              We take freely available data, feeds, texts, and tools - and we design them with the care usually reserved for luxury products or art books. We cut through the noise. We make the invisible visible. We create a single, trustworthy place where curious people can encounter real science.
            </p>
            <p className="text-base md:text-lg text-black">
              <span className="font-medium">This is not science education.</span> We're not explaining things to people who don't care. <span className="font-medium">This is not science news.</span> We're not chasing clicks with "Scientists say..." headlines. <span className="font-medium">This is science, presented properly.</span> For people who are already curious and deserve better than what currently exists.
            </p>
          </section>

          {/* What MXWLL offers */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6">What We Offer</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Live Data Visualisations</h3>
                <p className="text-base md:text-lg text-black">Real-time feeds from NASA, NOAA, weather satellites, and other sources. Each presented as a beautifully designed widget with its own visual personality.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">The Vault</h3>
                <p className="text-base md:text-lg text-black">Public domain scientific texts - Euclid, Darwin, Newton, Faraday - presented as readable digital editions. Commentary on modern works. Landmark papers. Multiple discovery pathways.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Scientific Tools</h3>
                <p className="text-base md:text-lg text-black">Calculators, visualisers, explorers - designed with craft and personality. Useful and beautiful.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">A Curated Experience</h3>
                <p className="text-base md:text-lg text-black">Not everything. The right things, presented so well that people keep coming back.</p>
              </div>
            </div>
          </section>

          {/* The name */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6">The Name</h2>
            <p className="text-base md:text-lg text-black">
              Named for James Clerk Maxwell, who unified electricity, magnetism, and light. His equations are foundational to modern physics. The vowel-less spelling is deliberate - visually distinctive and unmistakably modern.
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
    </PageShell>
  )
}