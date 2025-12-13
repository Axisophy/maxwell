import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  
  // Delete the auth cookie
  cookieStore.delete('mxwll-preview-auth')
  
  return NextResponse.json({ success: true })
}

// Also support GET for easy browser access
export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete('mxwll-preview-auth')
  
  // Redirect to landing page
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
}
