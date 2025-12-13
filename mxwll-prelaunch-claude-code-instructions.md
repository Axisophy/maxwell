# MXWLL Pre-Launch Protection System

## What This Does

1. Replaces the homepage with a beautiful pre-launch landing page that captures emails
2. Password-protects all other pages (observe, vault, tools, etc.)
3. Adds magic link system so I can generate unique access URLs for specific people
4. Adds a login page for people who have the password

## Instructions for Implementation

Please implement all of the following in my Maxwell project. After adding each file, verify it has no syntax errors. At the end, tell me what environment variables I need to add to Vercel.

---

## Step 1: Create the middleware (password protection)

Create `middleware.ts` in the project root:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that should be publicly accessible (no password required)
const PUBLIC_ROUTES = [
  '/',              // Pre-launch landing page
  '/login',         // Login page for reviewers
  '/api/subscribe', // Email signup API
]

// Route prefixes that should be publicly accessible
const PUBLIC_PREFIXES = [
  '/access/',       // Magic access links
]

// Check if a path matches any public route
function isPublicRoute(pathname: string): boolean {
  // Exact matches
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true
  }
  
  // Prefix matches (e.g., /access/xyz)
  if (PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return true
  }
  
  // Static assets and Next.js internals should always be accessible
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') // Files with extensions (images, fonts, etc.)
  ) {
    return true
  }
  
  return false
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }
  
  // Check for authentication cookie
  const authCookie = request.cookies.get('mxwll-preview-auth')
  
  // If authenticated, allow access
  if (authCookie?.value === process.env.PREVIEW_AUTH_TOKEN) {
    return NextResponse.next()
  }
  
  // Not authenticated - redirect to login
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('redirect', pathname)
  
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

---

## Step 2: Backup and replace the homepage

First, rename the existing homepage so we don't lose it:

```bash
mv app/page.tsx app/home-original.tsx
```

Then create the new pre-launch landing page at `app/page.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function PrelaunchPage() {
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
                <p className="font-medium mb-1">You're in.</p>
                <p className="text-sm text-white/60">
                  We'll let you know when MXWLL is ready.
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
```

---

## Step 3: Create the login page

Create `app/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
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
    <main className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-6">
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
    </main>
  )
}
```

---

## Step 4: Create API routes

### Create `app/api/auth/login/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    const correctPassword = process.env.PREVIEW_PASSWORD
    
    if (!correctPassword) {
      console.error('PREVIEW_PASSWORD environment variable not set')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    if (password !== correctPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
    
    const authToken = process.env.PREVIEW_AUTH_TOKEN
    
    if (!authToken) {
      console.error('PREVIEW_AUTH_TOKEN environment variable not set')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    const cookieStore = await cookies()
    
    cookieStore.set('mxwll-preview-auth', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
```

### Create `app/api/auth/logout/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('mxwll-preview-auth')
  return NextResponse.json({ success: true })
}

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete('mxwll-preview-auth')
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
}
```

### Create `app/api/subscribe/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json')

interface Subscriber {
  email: string
  subscribedAt: string
  source: string
}

async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  const dir = path.dirname(SUBSCRIBERS_FILE)
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {
    // Directory might already exist
  }
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2))
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    
    const normalizedEmail = email.toLowerCase().trim()
    
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }
    
    const subscribers = await getSubscribers()
    
    if (subscribers.some(s => s.email === normalizedEmail)) {
      return NextResponse.json(
        { message: 'You\'re already on the list!' },
        { status: 200 }
      )
    }
    
    const newSubscriber: Subscriber = {
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
      source: 'prelaunch-landing',
    }
    
    subscribers.push(newSubscriber)
    await saveSubscribers(subscribers)
    
    console.log(`New subscriber: ${normalizedEmail}`)
    
    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const subscribers = await getSubscribers()
    return NextResponse.json({
      count: subscribers.length,
      subscribers: subscribers.map(s => ({
        email: s.email,
        subscribedAt: s.subscribedAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}
```

---

## Step 5: Create magic link system

### Create `app/access/[token]/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { promises as fs } from 'fs'
import path from 'path'

const ACCESS_TOKENS_FILE = path.join(process.cwd(), 'data', 'access-tokens.json')

interface AccessToken {
  token: string
  name: string
  createdAt: string
  usedAt?: string
  usedCount: number
  maxUses?: number
  expiresAt?: string
  active: boolean
}

async function getTokens(): Promise<AccessToken[]> {
  try {
    const data = await fs.readFile(ACCESS_TOKENS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveTokens(tokens: AccessToken[]): Promise<void> {
  const dir = path.dirname(ACCESS_TOKENS_FILE)
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {}
  await fs.writeFile(ACCESS_TOKENS_FILE, JSON.stringify(tokens, null, 2))
}

function errorPage(title: string, message: string) {
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head><title>${title} - MXWLL</title>
      <style>
        body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
        .box { text-align: center; padding: 3rem; }
        h1 { font-size: 1.5rem; font-weight: 300; margin-bottom: 1rem; }
        p { color: #666; margin-bottom: 2rem; }
        a { color: black; }
      </style></head>
      <body><div class="box"><h1>${title}</h1><p>${message}</p><a href="/">← Back to MXWLL</a></div></body>
    </html>`,
    { status: 403, headers: { 'Content-Type': 'text/html' } }
  )
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const tokens = await getTokens()
  const accessToken = tokens.find(t => t.token === token)
  
  if (!accessToken) {
    return errorPage('Invalid Link', 'This link isn\'t valid. It may have been revoked.')
  }
  
  if (!accessToken.active) {
    return errorPage('Link Deactivated', 'This link has been deactivated.')
  }
  
  if (accessToken.expiresAt && new Date(accessToken.expiresAt) < new Date()) {
    return errorPage('Link Expired', 'This link has expired.')
  }
  
  if (accessToken.maxUses && accessToken.usedCount >= accessToken.maxUses) {
    return errorPage('Link Limit Reached', 'This link has reached its usage limit.')
  }
  
  // Valid - update usage
  accessToken.usedAt = new Date().toISOString()
  accessToken.usedCount += 1
  await saveTokens(tokens)
  
  // Set auth cookie
  const authToken = process.env.PREVIEW_AUTH_TOKEN
  if (!authToken) {
    return new NextResponse('Server configuration error', { status: 500 })
  }
  
  const cookieStore = await cookies()
  cookieStore.set('mxwll-preview-auth', authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mxwll.io'
  return NextResponse.redirect(new URL('/observe', baseUrl))
}
```

### Create `app/api/admin/tokens/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const ACCESS_TOKENS_FILE = path.join(process.cwd(), 'data', 'access-tokens.json')

interface AccessToken {
  token: string
  name: string
  createdAt: string
  usedAt?: string
  usedCount: number
  maxUses?: number
  expiresAt?: string
  active: boolean
}

async function getTokens(): Promise<AccessToken[]> {
  try {
    const data = await fs.readFile(ACCESS_TOKENS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveTokens(tokens: AccessToken[]): Promise<void> {
  const dir = path.dirname(ACCESS_TOKENS_FILE)
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {}
  await fs.writeFile(ACCESS_TOKENS_FILE, JSON.stringify(tokens, null, 2))
}

function generateToken(): string {
  return crypto.randomBytes(12).toString('base64url')
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const adminKey = searchParams.get('key')
  
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const tokens = await getTokens()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mxwll.io'
  
  const tokensWithUrls = tokens.map(t => ({
    ...t,
    url: `${baseUrl}/access/${t.token}`
  }))
  
  return NextResponse.json({ tokens: tokensWithUrls })
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('key')
    
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { name, maxUses, expiresInDays } = body
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    
    const tokens = await getTokens()
    
    const newToken: AccessToken = {
      token: generateToken(),
      name,
      createdAt: new Date().toISOString(),
      usedCount: 0,
      active: true,
    }
    
    if (maxUses) newToken.maxUses = maxUses
    
    if (expiresInDays) {
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + expiresInDays)
      newToken.expiresAt = expiry.toISOString()
    }
    
    tokens.push(newToken)
    await saveTokens(tokens)
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mxwll.io'
    
    return NextResponse.json({
      success: true,
      token: newToken,
      url: `${baseUrl}/access/${newToken.token}`,
      message: `Share this link with ${name}: ${baseUrl}/access/${newToken.token}`
    })
    
  } catch (error) {
    console.error('Token creation error:', error)
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('key')
    const tokenToDelete = searchParams.get('token')
    
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!tokenToDelete) {
      return NextResponse.json({ error: 'Token parameter required' }, { status: 400 })
    }
    
    const tokens = await getTokens()
    const token = tokens.find(t => t.token === tokenToDelete)
    
    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }
    
    token.active = false
    await saveTokens(tokens)
    
    return NextResponse.json({ success: true, message: `Token for "${token.name}" deactivated` })
    
  } catch (error) {
    console.error('Token deletion error:', error)
    return NextResponse.json({ error: 'Failed to deactivate token' }, { status: 500 })
  }
}
```

---

## Step 6: Create data directory and initial files

```bash
mkdir -p data
echo "[]" > data/subscribers.json
echo "[]" > data/access-tokens.json
```

---

## Step 7: Update .gitignore

Add these lines to `.gitignore`:

```
data/subscribers.json
data/access-tokens.json
```

---

## Step 8: Verify everything works

1. Run `npm run dev` and check:
   - Homepage (/) shows the pre-launch landing page
   - Email signup works
   - Visiting /observe redirects to /login
   - Login page appears

2. Check for TypeScript errors: `npm run build`

---

## Environment Variables Required

Tell Simon to add these to Vercel (Settings → Environment Variables):

| Variable | What to set | How to generate |
|----------|-------------|-----------------|
| `PREVIEW_PASSWORD` | A memorable password like `maxwell-preview-2025` | Choose one |
| `PREVIEW_AUTH_TOKEN` | Random 64-character string | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_KEY` | Random 32-character string | `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"` |
| `NEXT_PUBLIC_SITE_URL` | `https://mxwll.io` | Just type it |

---

## How Simon Uses This

**To let someone in with a magic link:**
```bash
curl -X POST "https://mxwll.io/api/admin/tokens?key=ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Sarah - design feedback"}'
```

This returns a URL like `https://mxwll.io/access/xK9mN2pQ7rS1` that he sends to Sarah.

**To see all access links:**
```bash
curl "https://mxwll.io/api/admin/tokens?key=ADMIN_KEY"
```

**To revoke someone's link:**
```bash
curl -X DELETE "https://mxwll.io/api/admin/tokens?key=ADMIN_KEY&token=xK9mN2pQ7rS1"
```
