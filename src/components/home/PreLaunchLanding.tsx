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
    <main className="fixed inset-0 z-[100] bg-[#f5f5f5] flex flex-col items-center justify-center px-6">
      <div
        className={`max-w-lg w-full transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Logo */}
        <div className="mb-12">
          <Logo className="h-8 text-black" />
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-[1.15] tracking-[-0.02em] mb-6">
          The quality layer
          <br />
          <span className="text-black/30">for science.</span>
        </h1>

        {/* One line description */}
        <p className="text-base md:text-lg text-black/50 mb-10">
          A digital science observatory. Coming soon.
        </p>

        {/* Email signup */}
        {status === 'success' ? (
          <div className="bg-black text-white px-5 py-4 rounded-lg">
            <p className="text-sm">You're on the list. We'll be in touch.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 bg-white border border-black/10 rounded-lg text-black placeholder:text-black/30 focus:outline-none focus:border-black/20 transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? '...' : 'Notify me'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="mt-3 text-sm text-red-600">{message}</p>
        )}
      </div>
    </main>
  )
}
