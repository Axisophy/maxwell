import Link from 'next/link'

export const metadata = {
  title: 'Contact — MXWLL',
  description: 'Get in touch with the MXWLL team.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="px-4 md:px-8 lg:px-12 pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-full md:max-w-[640px] lg:max-w-[720px] md:mx-auto">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-8">
            Contact
          </h1>

          <p className="text-base md:text-lg text-black mb-8">
            We'd love to hear from you. Whether you have a question, suggestion, or just want to say hello.
          </p>

          {/* Email */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6 first:mt-0">Email</h2>
            <p className="text-base md:text-lg text-black mb-5">
              The best way to reach us is by email:
            </p>
            <a 
              href="mailto:hello@mxwll.io"
              className="text-2xl md:text-3xl font-light text-black underline underline-offset-4 hover:no-underline"
            >
              hello@mxwll.io
            </a>
          </section>

          {/* What to contact about */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-black mt-12 mb-6">What can we help with?</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-black mb-2">General enquiries</h3>
                <p className="text-base md:text-lg text-black">Questions about MXWLL, how to use the site, or just to say hello.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Suggestions</h3>
                <p className="text-base md:text-lg text-black">Ideas for new widgets, data sources, features, or content. We genuinely want to hear them.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Bug reports</h3>
                <p className="text-base md:text-lg text-black">Found something broken? Let us know and we'll fix it.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Press enquiries</h3>
                <p className="text-base md:text-lg text-black">Journalists and media — we're happy to talk.</p>
              </div>
            </div>
          </section>

          {/* Other pages */}
          <section className="pt-8 border-t border-black/10">
            <p className="text-sm text-black/50 mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap gap-6">
              <Link 
                href="/collaborations" 
                className="text-black underline underline-offset-4 hover:no-underline"
              >
                Collaborations →
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
              <Link 
                href="/about/advertising" 
                className="text-black underline underline-offset-4 hover:no-underline"
              >
                Advertising →
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