import Link from 'next/link'

export const metadata = {
  title: 'Partnerships — MXWLL',
  description: 'Institutional and corporate partnerships with MXWLL. Bring your science to curious audiences worldwide.',
}

export default function PartnershipsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="px-4 md:px-8 lg:px-12 py-12 md:py-24">
        <div className="max-w-3xl">
          {/* Header */}
          <h1 
            className="text-4xl md:text-6xl font-bold text-black mb-8"
            style={{ letterSpacing: '-0.02em' }}
          >
            Partnerships
          </h1>

          <p className="text-lg text-black/80 leading-relaxed mb-8">
            Universities, research institutions, museums, science organisations, and companies — we're building partnerships to bring your work to curious audiences worldwide. Beautiful presentation, effortless engagement.
          </p>

          {/* For institutions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-4">For Research Institutions</h2>
            <p className="text-lg text-black/80 leading-relaxed mb-4">
              Your research deserves to reach beyond academic journals. MXWLL provides the presentation layer that makes your work accessible to intelligent, curious audiences who genuinely want to understand.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-black">Data visualisation</h3>
                <p className="text-black/80">We transform your data streams and datasets into beautiful, interactive visualisations that people actually want to explore.</p>
              </div>
              <div>
                <h3 className="font-bold text-black">Public engagement</h3>
                <p className="text-black/80">Reach audiences who care about science without dumbing it down. Your work, presented properly.</p>
              </div>
              <div>
                <h3 className="font-bold text-black">Educational resources</h3>
                <p className="text-black/80">Tools and content that educators can use in classrooms, with proper attribution to your institution.</p>
              </div>
            </div>
          </section>

          {/* For corporations */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-4">For Corporate Partners</h2>
            <p className="text-lg text-black/80 leading-relaxed mb-4">
              Science and technology companies have stories to tell. We help you tell them without it feeling like marketing.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-black">Widget sponsorship</h3>
                <p className="text-black/80">Associate your brand with specific data streams or tools that align with your work.</p>
              </div>
              <div>
                <h3 className="font-bold text-black">Content partnerships</h3>
                <p className="text-black/80">Collaborative content that showcases your science without compromising editorial integrity.</p>
              </div>
              <div>
                <h3 className="font-bold text-black">STEM recruitment</h3>
                <p className="text-black/80">Reach the next generation of scientists and engineers through genuine engagement, not advertising.</p>
              </div>
            </div>
          </section>

          {/* Who we're talking to */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-4">Who We're Talking To</h2>
            <p className="text-lg text-black/80 leading-relaxed mb-4">
              We're actively developing relationships with:
            </p>
            <ul className="list-disc list-inside text-lg text-black/80 space-y-2">
              <li>UK research universities (Oxford, Cambridge, Imperial, UCL, and others)</li>
              <li>International research institutions (CERN, ESA, Max Planck Institutes)</li>
              <li>Science museums and educational organisations</li>
              <li>Energy companies (National Grid, renewable energy providers)</li>
              <li>Space and aerospace organisations</li>
              <li>Technology companies with science-focused missions</li>
            </ul>
          </section>

          {/* Get in touch */}
          <section className="bg-black text-white -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-12">
            <h2 className="text-2xl font-bold mb-4">Start a Conversation</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              If your institution or organisation would like to explore partnership opportunities, we'd love to hear from you.
            </p>
            <a 
              href="mailto:hello@mxwll.io?subject=Partnership%20Enquiry"
              className="inline-block text-lg underline underline-offset-4 hover:no-underline"
            >
              hello@mxwll.io →
            </a>
          </section>

          {/* Other pages */}
          <section className="pt-8 mt-12 border-t border-black/10">
            <div className="flex flex-wrap gap-6">
              <Link 
                href="/about" 
                className="text-black underline underline-offset-4 hover:no-underline"
              >
                About MXWLL →
              </Link>
              <Link 
                href="/about/advertising" 
                className="text-black underline underline-offset-4 hover:no-underline"
              >
                Advertising →
              </Link>
              <Link 
                href="/collaborations" 
                className="text-black underline underline-offset-4 hover:no-underline"
              >
                Collaborations →
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