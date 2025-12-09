import Link from 'next/link'

export const metadata = {
  title: 'Collaborations — MXWLL',
  description: 'Collaborate with MXWLL. Suggest new content, share your research, or work with us.',
}

export default function CollaborationsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="px-4 md:px-8 lg:px-12 py-12 md:py-24">
        <div className="max-w-3xl">
          {/* Header */}
          <h1 
            className="text-4xl md:text-6xl font-bold text-black mb-8"
            style={{ letterSpacing: '-0.02em' }}
          >
            Collaborations
          </h1>

          <p className="text-lg text-black/80 leading-relaxed mb-8">
            MXWLL is built by people who love science, for people who love science. We're always interested in hearing from our community — whether you've spotted an amazing data source, have research you'd like featured, or want to work together.
          </p>

          {/* For everyone */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-4">Got a Suggestion?</h2>
            <p className="text-lg text-black/80 leading-relaxed mb-4">
              Found a fantastic data feed we should feature? Know of a public domain text we're missing? Have an idea for a widget that would be amazing? We genuinely want to hear it.
            </p>
            <p className="text-lg text-black/80 leading-relaxed mb-4">
              Some of our best content ideas have come from users. You're exploring different corners of science than we are, and you see things we miss.
            </p>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-black mb-2">What makes a good suggestion:</h3>
              <ul className="list-disc list-inside text-black/80 space-y-1">
                <li>Real-time data that's freely accessible</li>
                <li>Public domain scientific texts or papers</li>
                <li>Interactive visualisations that explain something beautifully</li>
                <li>Anything that makes you think "more people should see this"</li>
              </ul>
            </div>
          </section>

          {/* For scientists */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-4">For Scientists & Researchers</h2>
            <p className="text-lg text-black/80 leading-relaxed mb-4">
              If you're working on something fascinating and want it to reach a broader audience, we'd love to talk. MXWLL can be the presentation layer for your work — reaching curious, intelligent people who genuinely want to understand.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-black">Live data streams</h3>
                <p className="text-black/80">If your research generates real-time data, we can turn it into a beautiful, accessible visualisation.</p>
              </div>
              <div>
                <h3 className="font-bold text-black">Research highlights</h3>
                <p className="text-black/80">Significant findings that deserve a wider audience than a journal article typically reaches.</p>
              </div>
              <div>
                <h3 className="font-bold text-black">Educational content</h3>
                <p className="text-black/80">Explanations, visualisations, or tools that help people understand your field.</p>
              </div>
            </div>
          </section>

          {/* For institutions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-4">For Institutions & Companies</h2>
            <p className="text-lg text-black/80 leading-relaxed mb-4">
              Looking for more formal partnership arrangements? We work with universities, research institutions, museums, and science-focused companies to bring their work to our audience.
            </p>
            <Link 
              href="/about/partnerships" 
              className="inline-block text-lg text-black underline underline-offset-4 hover:no-underline"
            >
              Learn about institutional partnerships →
            </Link>
          </section>

          {/* Get in touch */}
          <section className="bg-black text-white -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-12">
            <h2 className="text-2xl font-bold mb-4">Share Your Ideas</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              Whether it's a quick suggestion or a full collaboration proposal, we'd love to hear from you.
            </p>
            <a 
              href="mailto:hello@mxwll.io?subject=Collaboration"
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
                href="/about/contact" 
                className="text-black underline underline-offset-4 hover:no-underline"
              >
                Contact →
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