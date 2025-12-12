// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define Clerk protected routes that require authentication
const isClerkProtectedRoute = createRouteMatcher([
  '/observe/your-dashboard(.*)',
  '/account(.*)',
  '/api/user(.*)',
])

// Routes that should be publicly accessible (no pre-launch password required)
const PUBLIC_ROUTES = [
  '/',              // Pre-launch landing page
  '/login',         // Login page for reviewers
  '/api/subscribe', // Email signup API
  '/api/auth/login',
  '/api/auth/logout',
]

// Route prefixes that should be publicly accessible
const PUBLIC_PREFIXES = [
  '/access/',       // Magic access links
  '/api/admin/',    // Admin API (has its own key auth)
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

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const pathname = req.nextUrl.pathname

  // Allow public routes without pre-launch auth
  if (!isPublicRoute(pathname)) {
    // Check for pre-launch authentication cookie
    const authCookie = req.cookies.get('mxwll-preview-auth')

    // If not authenticated for pre-launch, redirect to login
    if (authCookie?.value !== process.env.PREVIEW_AUTH_TOKEN) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Apply Clerk protection for user-specific routes
  if (isClerkProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
