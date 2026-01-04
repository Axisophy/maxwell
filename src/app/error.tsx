'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to your error reporting service
    console.error('MXWLL Error:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb frame */}
        <div className="mb-px">
          <div className="bg-white rounded-lg py-1 md:py-2 px-2 md:px-4">
            <nav className="flex items-center gap-2 text-sm text-black/50">
              <a href="/" className="hover:text-black">MXWLL</a>
              <span>/</span>
              <span className="text-black">Error</span>
            </nav>
          </div>
        </div>

        {/* Content frame */}
        <div className="bg-white rounded-lg p-4 md:p-8">
          <div className="max-w-xl">

            {/* Error indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs font-mono text-red-500 uppercase tracking-wider">
                System Error
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase mb-4">
              Something Went Wrong
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-black/60 mb-8">
              An unexpected error occurred while loading this page.
              This has been logged and we'll look into it.
            </p>

            {/* Error details (development only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-black rounded-lg p-4 mb-8">
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
                  Error Details
                </div>
                <pre className="text-xs font-mono text-white/80 overflow-x-auto">
                  {error.message}
                </pre>
                {error.digest && (
                  <div className="text-xs font-mono text-white/40 mt-2">
                    Digest: {error.digest}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => reset()}
                className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded hover:bg-black/80 transition-colors"
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-5 py-2.5 bg-neutral-200 text-black text-sm font-medium rounded hover:bg-neutral-300 transition-colors"
              >
                Return Home
              </a>
            </div>

          </div>
        </div>

        {/* Help text */}
        <div className="bg-white rounded-lg p-4 mt-px">
          <p className="text-sm text-black/40">
            If this problem persists, please let us know via the feedback button.
          </p>
        </div>

      </div>
    </main>
  )
}
