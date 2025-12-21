import Link from 'next/link'

export const metadata = {
  title: 'Pulse | MXWLL',
  description: 'Science news, partner highlights, and updates from MXWLL.',
}

export default function PulsePage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-8 md:pb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">
          Pulse
        </h1>
        <p className="text-base md:text-lg text-black/70 max-w-2xl">
          Science news, partner highlights, and updates from MXWLL. 
          The heartbeat of the scientific world, curated with care.
        </p>
      </div>

      {/* Coming Soon Content */}
      <div className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Coming Soon Card */}
          <div className="p-8 md:p-12 bg-white rounded-xl border border-black/5">
            <p className="text-sm text-black/50 uppercase tracking-wider mb-4">Coming Soon</p>
            <h2 className="text-2xl md:text-3xl font-light text-black mb-4">
              The Pulse is warming up
            </h2>
            <p className="text-base text-black/70 leading-relaxed mb-6">
              We're building something special here - a curated stream of science news, 
              partner discoveries, and MXWLL updates. Think of it as your morning briefing 
              for the scientifically curious.
            </p>
            <p className="text-sm text-black/50">
              Want to be notified when we launch? 
              <Link href="/about/contact" className="text-black underline underline-offset-4 hover:no-underline ml-1">
                Get in touch
              </Link>
            </p>
          </div>

          {/* What to Expect */}
          <div className="p-8 md:p-12 bg-white rounded-xl border border-black/5">
            <h2 className="text-lg font-medium text-black mb-4">What to expect</h2>
            <div className="space-y-4 text-base text-black/70">
              <div>
                <p className="font-medium text-black mb-1">Latest Discoveries</p>
                <p>Curated science news from trusted sources, beautifully presented.</p>
              </div>
              <div>
                <p className="font-medium text-black mb-1">Partner Highlights</p>
                <p>Featured research and data from our institutional partners.</p>
              </div>
              <div>
                <p className="font-medium text-black mb-1">MXWLL Updates</p>
                <p>New widgets, features, and content as they launch.</p>
              </div>
            </div>
          </div>

        </div>

        {/* In the meantime */}
        <div className="mt-8 p-6 md:p-8 bg-black text-white rounded-xl">
          <p className="text-sm text-white/50 uppercase tracking-wider mb-3">In the meantime</p>
          <p className="text-lg font-light text-white/90 mb-4">
            Check out what's already live on MXWLL:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/observe/vital-signs" 
              className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              Vital Signs →
            </Link>
            <Link 
              href="/observe/your-dashboard" 
              className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              Your Dashboard →
            </Link>
            <Link 
              href="/vault" 
              className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              The Vault →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}