'use client'

import { useState, useEffect } from 'react'

export default function PreLaunchLanding() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'You\'re on the list.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Connection failed. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 md:px-12 py-8">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-black">
            MXWLL
          </span>
          <span className="text-xs md:text-sm font-light text-black/40 tracking-wide">
            coming soon
          </span>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 pb-24">
        <div
          className={`max-w-3xl transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-black leading-[1.1] tracking-[-0.02em] mb-8">
            The quality layer
            <br />
            <span className="text-black/30">for science.</span>
          </h1>

          {/* Description */}
          <div
            className={`space-y-6 mb-12 transition-all duration-1000 delay-200 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-lg md:text-xl font-light text-black/70 max-w-xl leading-relaxed">
              Live data from NASA, NOAA, and observatories worldwide. Curated scientific texts.
              Interactive tools. All presented with the care usually reserved for luxury products.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-black/40 font-mono">
              <span>Real-time solar imagery</span>
              <span>•</span>
              <span>Space weather</span>
              <span>•</span>
              <span>Earthquakes</span>
              <span>•</span>
              <span>Climate data</span>
            </div>
          </div>

          {/* Email signup */}
          <div
            className={`transition-all duration-1000 delay-400 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {status === 'success' ? (
              <div className="bg-black text-white px-6 py-5 rounded-xl max-w-md">
                <p className="font-medium mb-1">You&apos;re in.</p>
                <p className="text-sm text-white/60">
                  We&apos;ll let you know when MXWLL is ready.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md">
                <label className="block text-xs font-medium text-black/50 uppercase tracking-wider mb-3">
                  Get notified at launch
                </label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-4 py-3 bg-white border border-black/10 rounded-lg text-black placeholder:text-black/30 focus:outline-none focus:border-black/30 transition-colors font-mono text-sm"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {status === 'loading' ? 'Joining...' : 'Join waitlist'}
                  </button>
                </div>
                {status === 'error' && (
                  <p className="mt-3 text-sm text-red-600">{message}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Preview cards */}
      <div
        className={`relative z-10 px-6 md:px-12 pb-16 transition-all duration-1000 delay-600 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl">
          {[
            { label: 'OBSERVE', desc: 'Live data feeds' },
            { label: 'DATA', desc: 'Reference datasets' },
            { label: 'VAULT', desc: 'Scientific texts' },
            { label: 'PLAY', desc: 'Interactive tools' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl p-4 md:p-5"
              style={{ animationDelay: `${600 + i * 100}ms` }}
            >
              <span className="text-xs font-mono text-black/40 tracking-wider">{item.label}</span>
              <p className="text-sm text-black/60 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`relative z-10 px-6 md:px-12 py-8 border-t border-black/5 transition-all duration-1000 delay-800 ease-out ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-black/40">
          <p>A digital science observatory. Named for James Clerk Maxwell.</p>
          <p className="font-mono">mxwll.io</p>
        </div>
      </footer>
    </main>
  )
}
