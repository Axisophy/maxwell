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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
