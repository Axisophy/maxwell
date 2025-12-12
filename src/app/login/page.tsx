'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/observe'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push(redirect)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid password')
      }
    } catch {
      setError('Connection failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <Link href="/" className="block mb-12 text-center">
        <span className="text-2xl font-bold tracking-[-0.03em] text-black">
          MXWLL
        </span>
      </Link>

      {/* Login box */}
      <div className="bg-white rounded-xl p-8 border border-black/5 shadow-sm">
        <h1 className="text-xl font-light text-black mb-2">
          Preview Access
        </h1>
        <p className="text-sm text-black/50 mb-6">
          Enter the password to access the development site.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full px-4 py-3 bg-[#f5f5f5] border border-black/10 rounded-lg text-black placeholder:text-black/30 focus:outline-none focus:border-black/30 transition-colors mb-4"
          />

          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>

      {/* Back link */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-black/40 hover:text-black transition-colors"
        >
          ← Back to landing page
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-6">
      <Suspense fallback={
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <span className="text-2xl font-bold tracking-[-0.03em] text-black">MXWLL</span>
          </div>
          <div className="bg-white rounded-xl p-8 border border-black/5 shadow-sm">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  )
}
