'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-shell-light">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />
      
      <div className="px-8 lg:px-12 py-12 md:py-20">
        {/* Hero / Mission */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-text-primary mb-6">
            A digital laboratory
          </h1>
          <p className="text-xl md:text-2xl font-light text-text-muted leading-relaxed">
            Science is happening everywhere, all the time. Stars fusing. Particles decaying. 
            Data flowing. Mostly, you can't see it. We build windows.
          </p>
        </div>

        {/* Quick entry point */}
        <div className="mb-16">
          <Link 
            href="/observe/your-dashboard"
            className="inline-flex items-center gap-3 bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg font-medium">Enter the observatory</span>
            <span>→</span>
          </Link>
        </div>

        {/* WHO ARE YOU? Section */}
        <div className="mb-16">
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wide mb-6">
            Who are you?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Curious', href: '/observe/your-dashboard' },
              { label: 'Student', href: '/observe/your-dashboard' },
              { label: 'Researcher', href: '/observe/your-dashboard' },
              { label: 'Institution', href: '/about' },
              { label: 'Investor', href: '/about' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="bg-white px-4 py-3 rounded-lg text-center hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Sections preview */}
        <div>
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wide mb-6">
            Explore
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/observe"
              className="bg-white p-6 rounded-xl hover:shadow-md transition-shadow border border-gray-200"
            >
              <h3 className="text-lg font-medium mb-2">Observe</h3>
              <p className="text-sm text-text-muted">Live data from the sun, Earth, space, and beyond.</p>
            </Link>
            <Link 
              href="/tools"
              className="bg-white p-6 rounded-xl hover:shadow-md transition-shadow border border-gray-200"
            >
              <h3 className="text-lg font-medium mb-2">Tools</h3>
              <p className="text-sm text-text-muted">Scientific instruments that actually work.</p>
            </Link>
            <Link 
              href="/vault"
              className="bg-white p-6 rounded-xl hover:shadow-md transition-shadow border border-gray-200"
            >
              <h3 className="text-lg font-medium mb-2">Vault</h3>
              <p className="text-sm text-text-muted">2,500 years of scientific texts, beautifully presented.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}