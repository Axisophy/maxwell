import Link from 'next/link'
import { PageShell, BreadcrumbFrame, PageHeaderFrame, breadcrumbItems } from '@/components/ui'

export const metadata = {
  title: 'Collaborations - MXWLL',
  description: 'Collaborate with MXWLL. Suggest new content, share your research, or work with us.',
}

export default function CollaborationsPage() {
  return (
    <PageShell>
      <BreadcrumbFrame
        variant="light"
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['Collaborations']
        )}
      />

      <PageHeaderFrame
        variant="light"
        title="Collaborations"
        description="MXWLL is built by people who love science, for people who love science. We're always interested in hearing from our community - whether you've spotted an amazing data source, have research you'd like featured, or want to work together."
      />

      {/* Content Frame */}
      <div className="bg-white rounded-lg p-4 md:p-8 mb-px">
        <div className="max-w-2xl">

          {/* For everyone */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6 first:mt-0">Got a Suggestion?</h2>
            <p className="text-base md:text-lg text-black mb-5">
              Found a fantastic data feed we should feature? Know of a public domain text we're missing? Have an idea for a widget that would be amazing? We genuinely want to hear it.
            </p>
            <p className="text-base md:text-lg text-black mb-5">
              Some of our best content ideas have come from users. You're exploring different corners of science than we are, and you see things we miss.
            </p>
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-medium text-black mb-3">What makes a good suggestion:</h3>
              <ul className="text-base md:text-lg text-black space-y-2">
                <li>- Real-time data that's freely accessible</li>
                <li>- Public domain scientific texts or papers</li>
                <li>- Interactive visualisations that explain something beautifully</li>
                <li>- Anything that makes you think "more people should see this"</li>
              </ul>
            </div>
          </section>

          {/* For scientists */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6">For Scientists & Researchers</h2>
            <p className="text-base md:text-lg text-black mb-5">
              If you're working on something fascinating and want it to reach a broader audience, we'd love to talk. MXWLL can be the presentation layer for your work - reaching curious, intelligent people who genuinely want to understand.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Live data streams</h3>
                <p className="text-base md:text-lg text-black">If your research generates real-time data, we can turn it into a beautiful, accessible visualisation.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Research highlights</h3>
                <p className="text-base md:text-lg text-black">Significant findings that deserve a wider audience than a journal article typically reaches.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Educational content</h3>
                <p className="text-base md:text-lg text-black">Explanations, visualisations, or tools that help people understand your field.</p>
              </div>
            </div>
          </section>

          {/* For institutions */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6">For Institutions & Companies</h2>
            <p className="text-base md:text-lg text-black mb-5">
              Looking for more formal partnership arrangements? We work with universities, research institutions, museums, and science-focused companies to bring their work to our audience.
            </p>
            <Link 
              href="/about/partnerships" 
              className="inline-block text-base md:text-lg text-black underline underline-offset-4 hover:no-underline"
            >
              Learn about institutional partnerships →
            </Link>
          </section>

          {/* Get in touch */}
          <section className="bg-black text-white -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-12">
            <h2 className="text-2xl md:text-3xl font-light mb-4">Share Your Ideas</h2>
            <p className="text-base md:text-lg text-white/80 mb-6">
              Whether it's a quick suggestion or a full collaboration proposal, we'd love to hear from you.
            </p>
            <a 
              href="mailto:hello@mxwll.io?subject=Collaboration"
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
    </PageShell>
  )
}