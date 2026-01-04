import Link from 'next/link'
import { PageShell, BreadcrumbFrame, PageHeaderFrame, breadcrumbItems } from '@/components/ui'

export const metadata = {
  title: 'Investment - MXWLL',
  description: 'Investment opportunities with MXWLL. Building the quality layer for science.',
}

export default function InvestmentPage() {
  return (
    <PageShell>
      <BreadcrumbFrame
        variant="light"
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['About', '/about'],
          ['Investment']
        )}
      />

      <PageHeaderFrame
        variant="light"
        title="Investment"
        description="MXWLL is building the quality layer for science - a platform that combines beautiful design, live data, and deep content. We're seeking partners who share our vision for transforming how the world engages with science."
      />

      {/* Content Frame */}
      <div className="bg-white rounded-lg p-4 md:p-8 mb-px">
        <div className="max-w-2xl">

          {/* The opportunity */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6 first:mt-0">The Opportunity</h2>
            <p className="text-base md:text-lg text-black mb-5">
              Science communication is broken. The raw material - data, research, historical texts - is abundant and largely free. What's missing is the presentation layer: the curation, design, and craft that makes it accessible, beautiful, and trustworthy.
            </p>
            <p className="text-base md:text-lg text-black">
              MXWLL follows a proven model: <span className="font-medium">taste + presentation + trust = value</span>. Flightradar24 built a billion-dollar business presenting publicly available flight data beautifully. We're applying the same principle to science.
            </p>
          </section>

          {/* What makes us different */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6">What Makes Us Different</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Design-led approach</h3>
                <p className="text-base md:text-lg text-black">We apply product-design thinking to science presentation. Every widget, every page, every interaction is crafted with the care usually reserved for luxury products.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Curation over aggregation</h3>
                <p className="text-base md:text-lg text-black">We're not trying to be comprehensive. We choose the right things and present them exceptionally well.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Multiple revenue streams</h3>
                <p className="text-base md:text-lg text-black">Premium subscriptions, institutional partnerships, educational licensing, and curated advertising - a sustainable model that doesn't compromise user experience.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Deep content moat</h3>
                <p className="text-base md:text-lg text-black">The Vault contains 2,500 years of scientific literature, beautifully formatted. This isn't easily replicated.</p>
              </div>
            </div>
          </section>

          {/* Who we're looking for */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6">Who We're Looking For</h2>
            <p className="text-base md:text-lg text-black mb-5">
              We're interested in speaking with:
            </p>
            <ul className="text-base md:text-lg text-black space-y-2 mb-5">
              <li>- Science-passionate angels who want to see science communicated better</li>
              <li>- EdTech investors who see the educational potential</li>
              <li>- Impact investors optimising for social impact alongside returns</li>
              <li>- Strategic partners in science, media, or technology</li>
            </ul>
            <p className="text-base md:text-lg text-black">
              We're not just looking for capital. We value investors who bring networks, expertise, and genuine enthusiasm for the mission.
            </p>
          </section>

          {/* Get in touch */}
          <section className="bg-black text-white -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-12">
            <h2 className="text-2xl md:text-3xl font-light mb-4">Start a Conversation</h2>
            <p className="text-base md:text-lg text-white/80 mb-6">
              If you're interested in learning more about MXWLL and exploring investment opportunities, we'd love to hear from you.
            </p>
            <a 
              href="mailto:hello@mxwll.io?subject=Investment%20Enquiry"
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
                href="/about/partnerships"
                className="text-black underline underline-offset-4 hover:no-underline"
              >
                Institutional partnerships →
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