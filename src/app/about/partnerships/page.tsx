import Link from 'next/link'

export const metadata = {
  title: 'Partnerships — MXWLL',
  description: 'Institutional and corporate partnerships with MXWLL. Bring your science to curious audiences worldwide.',
}

export default function PartnershipsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="px-4 md:px-8 lg:px-12 pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-full md:max-w-[640px] lg:max-w-[720px] md:mx-auto">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-8">
            Partnerships
          </h1>

          <p className="text-base md:text-lg text-black mb-8">
            Universities, research institutions, museums, science organisations, and companies — we're building partnerships to bring your work to curious audiences worldwide. Beautiful presentation, effortless engagement.
          </p>

          {/* For institutions */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6 first:mt-0">For Research Institutions</h2>
            <p className="text-base md:text-lg text-black mb-5">
              Your research deserves to reach beyond academic journals. MXWLL provides the presentation layer that makes your work accessible to intelligent, curious audiences who genuinely want to understand.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Data visualisation</h3>
                <p className="text-base md:text-lg text-black">We transform your data streams and datasets into beautiful, interactive visualisations that people actually want to explore.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Public engagement</h3>
                <p className="text-base md:text-lg text-black">Reach audiences who care about science without dumbing it down. Your work, presented properly.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Educational resources</h3>
                <p className="text-base md:text-lg text-black">Tools and content that educators can use in classrooms, with proper attribution to your institution.</p>
              </div>
            </div>
          </section>

          {/* For corporations */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6">For Corporate Partners</h2>
            <p className="text-base md:text-lg text-black mb-5">
              Science and technology companies have stories to tell. We help you tell them without it feeling like marketing.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Widget sponsorship</h3>
                <p className="text-base md:text-lg text-black">Associate your brand with specific data streams or tools that align with your work.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Content partnerships</h3>
                <p className="text-base md:text-lg text-black">Collaborative content that showcases your science without compromising editorial integrity.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">STEM recruitment</h3>
                <p className="text-base md:text-lg text-black">Reach the next generation of scientists and engineers through genuine engagement, not advertising.</p>
              </div>
            </div>
          </section>

          {/* Who we're talking to */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6">Who We're Talking To</h2>
            <p className="text-base md:text-lg text-black mb-5">
              We're actively developing relationships with:
            </p>
            <ul className="text-base md:text-lg text-black space-y-2">
              <li>— UK research universities (Oxford, Cambridge, Imperial, UCL, and others)</li>
              <li>— International research institutions (CERN, ESA, Max Planck Institutes)</li>
              <li>— Science museums and educational organisations</li>
              <li>— Energy companies (National Grid, renewable energy providers)</li>
              <li>— Space and aerospace organisations</li>
              <li>— Technology companies with science-focused missions</li>
            </ul>
          </section>

          {/* Get in touch */}
          <section className="bg-black text-white -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-12">
            <h2 className="text-2xl md:text-3xl font-light mb-4">Start a Conversation</h2>
            <p className="text-base md:text-lg text-white/80 mb-6">
              If your institution or organisation would like to explore partnership opportunities, we'd love to hear from you.
            </p>
            <a 
              href="mailto:hello@mxwll.io?subject=Partnership%20Enquiry"
              className="inline-block text-base md:text-lg underline underline-offset-4 hover:no-underline"
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