import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb frame */}
        <div className="mb-px">
          <div className="bg-white rounded-lg py-1 md:py-2 px-2 md:px-4">
            <nav className="flex items-center gap-2 text-sm text-black/50">
              <Link href="/" className="hover:text-black">MXWLL</Link>
              <span>/</span>
              <span className="text-black">Not Found</span>
            </nav>
          </div>
        </div>

        {/* Content frame */}
        <div className="bg-white rounded-lg p-4 md:p-8">
          <div className="max-w-xl">

            {/* 404 indicator */}
            <div className="mb-6">
              <span className="text-6xl md:text-8xl font-bold text-black/10 font-mono">
                404
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase mb-4">
              Page Not Found
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-black/60 mb-8">
              The page you're looking for doesn't exist, has been moved,
              or is temporarily unavailable.
            </p>

            {/* Suggestions */}
            <div className="bg-black rounded-lg p-4 mb-8">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
                Try These Instead
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/observe"
                  className="text-sm text-white hover:text-white/80 transition-colors"
                >
                  Observe →
                </Link>
                <Link
                  href="/observe/space/solar-observatory"
                  className="text-sm text-white hover:text-white/80 transition-colors"
                >
                  Solar Observatory →
                </Link>
                <Link
                  href="/observe/earth"
                  className="text-sm text-white hover:text-white/80 transition-colors"
                >
                  Earth →
                </Link>
                <Link
                  href="/vault"
                  className="text-sm text-white hover:text-white/80 transition-colors"
                >
                  Vault →
                </Link>
                <Link
                  href="/observe/detectors"
                  className="text-sm text-white hover:text-white/80 transition-colors"
                >
                  Detectors →
                </Link>
                <Link
                  href="/play"
                  className="text-sm text-white hover:text-white/80 transition-colors"
                >
                  Play →
                </Link>
              </div>
            </div>

            {/* Action */}
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-black text-white text-sm font-medium rounded hover:bg-black/80 transition-colors"
            >
              Return Home
            </Link>

          </div>
        </div>

        {/* Search suggestion */}
        <div className="bg-white rounded-lg p-4 mt-px">
          <p className="text-sm text-black/40">
            Looking for something specific? Try navigating from the homepage
            or check the section menus.
          </p>
        </div>

      </div>
    </main>
  )
}
