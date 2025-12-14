'use client'

import { useState, useEffect } from 'react'
import Logo from '@/components/Logo'

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
    <main className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 md:px-12">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/prelaunch/prelaunch-bg.jpg)' }}
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div
        className={`relative z-10 max-w-xl w-full transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Logo */}
        <div className="mb-10">
          <Logo className="h-12 md:h-16 w-auto text-white" />
        </div>

        {/* Headline */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-[1.3] tracking-[-0.01em] mb-4">
          A digital laboratory.
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed">
          Science happening now, presented properly.
        </p>

        {/* Coming soon + CTA */}
        <p className="text-sm text-white/50 uppercase tracking-wider mb-6">
          Coming soon
        </p>

        {/* Email signup */}
        {status === 'success' ? (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-4 rounded-lg">
            <p className="text-sm">You're on the list. We'll be in touch.</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-white/60 mb-3">
              Sign up for prelaunch updates and early access.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-5 py-3 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {status === 'loading' ? '...' : 'Notify me'}
              </button>
            </form>
          </div>
        )}
        {status === 'error' && (
          <p className="mt-3 text-sm text-red-400">{message}</p>
        )}
      </div>

      {/* Image credit - small, bottom right */}
      <div className="absolute bottom-4 right-4 z-10">
        <p className="text-[10px] text-white/30">
          NASA / ESA / CSA / JWST
        </p>
      </div>
    </main>
  )
}
