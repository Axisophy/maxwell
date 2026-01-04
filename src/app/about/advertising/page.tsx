import Link from 'next/link'
import { PageShell, BreadcrumbFrame, PageHeaderFrame, breadcrumbItems } from '@/components/ui'

export const metadata = {
  title: 'Advertising - MXWLL',
  description: 'Advertising with MXWLL. Curated, relevant, high-quality advertising that respects our audience.',
}

export default function AdvertisingPage() {
  return (
    <PageShell>
      <BreadcrumbFrame
        variant="light"
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['About', '/about'],
          ['Advertising']
        )}
      />

      <PageHeaderFrame
        variant="light"
        title="Advertising"
        description="MXWLL is developing an advertising model that respects both our audience and our partners. We believe advertising can be valuable - when it's relevant, high-quality, and carefully curated."
      />

      {/* Content Frame */}
      <div className="bg-white rounded-lg p-4 md:p-8 mb-px">
        <div className="max-w-2xl">

          {/* Our approach */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6 first:mt-0">Our Approach</h2>
            <p className="text-base md:text-lg text-black mb-5">
              We're not interested in programmatic advertising, pop-ups, or anything that degrades the user experience. Instead, we're building something closer to the Monocle model: carefully selected partners whose products and services genuinely align with our audience's interests.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Curated, not algorithmic</h3>
                <p className="text-base md:text-lg text-black">Every advertiser is hand-selected. We choose partners whose offerings genuinely complement the MXWLL experience.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Quality over quantity</h3>
                <p className="text-base md:text-lg text-black">Fewer, better placements. We'd rather have one excellent partner than twenty mediocre ones.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Editorial control</h3>
                <p className="text-base md:text-lg text-black">We maintain full control over what appears on MXWLL. Our audience trusts us, and we don't compromise that.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Designed integration</h3>
                <p className="text-base md:text-lg text-black">Advertising on MXWLL looks like it belongs on MXWLL. Beautiful design applies to everything.</p>
              </div>
            </div>
          </section>

          {/* Who we're looking for */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6">Ideal Partners</h2>
            <p className="text-base md:text-lg text-black mb-5">
              Our audience is curious, educated, and interested in science, technology, design, and quality. They appreciate thoughtful products and services. They don't respond well to aggressive marketing.
            </p>
            <p className="text-base md:text-lg text-black mb-5">
              We're particularly interested in partners from:
            </p>
            <ul className="text-base md:text-lg text-black space-y-2 mb-5">
              <li>- Scientific instruments and equipment</li>
              <li>- Educational technology and services</li>
              <li>- Quality consumer electronics</li>
              <li>- Books, publications, and media</li>
              <li>- Travel and exploration</li>
              <li>- Design-led products and services</li>
              <li>- Sustainability and environmental technology</li>
            </ul>
          </section>

          {/* What we offer */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6">What We Offer</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Sponsored content</h3>
                <p className="text-base md:text-lg text-black">Beautifully designed content that tells your story, clearly marked as sponsored but editorially independent.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Widget sponsorship</h3>
                <p className="text-base md:text-lg text-black">Associate your brand with specific data visualisations or tools that align with your work.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Newsletter sponsorship</h3>
                <p className="text-base md:text-lg text-black">Reach our engaged email audience with thoughtfully integrated placements.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Custom opportunities</h3>
                <p className="text-base md:text-lg text-black">We're open to creative partnerships that go beyond standard advertising formats.</p>
              </div>
            </div>
          </section>

          {/* Get in touch */}
          <section className="bg-black text-white -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-12">
            <h2 className="text-2xl md:text-3xl font-light mb-4">Start a Conversation</h2>
            <p className="text-base md:text-lg text-white/80 mb-6">
              If your brand aligns with our values and you'd like to explore advertising opportunities, we'd love to hear from you.
            </p>
            <a 
              href="mailto:hello@mxwll.io?subject=Advertising%20Enquiry"
              className="inline-block text-base md:text-lg underline underline-offset-4 hover:no-underline"
            >
              hello@mxwll.io →
            </a>
          </section>

          {/* Other pages */}
          <section className="pt-8 mt-12 border-t border-black/10">
            <div className="flex flex-wrap gap-6">
              <Link
                href="/about/partnerships"
                className="text-black underline underline-offset-4 hover:no-underline"
              >
                Institutional partnerships →
              </Link>
              <Link
                href="/about"
                className="text-black underline underline-offset-4 hover:no-underline"
              >
                About MXWLL →
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