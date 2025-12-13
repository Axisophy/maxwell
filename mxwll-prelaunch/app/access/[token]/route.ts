import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { promises as fs } from 'fs'
import path from 'path'

const ACCESS_TOKENS_FILE = path.join(process.cwd(), 'data', 'access-tokens.json')

interface AccessToken {
  token: string
  name: string           // Who this is for (e.g., "Sarah - design feedback")
  createdAt: string
  usedAt?: string
  usedCount: number
  maxUses?: number       // Optional limit (undefined = unlimited)
  expiresAt?: string     // Optional expiry
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
  } catch {
    // Directory exists
  }
  await fs.writeFile(ACCESS_TOKENS_FILE, JSON.stringify(tokens, null, 2))
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  
  // Find the token
  const tokens = await getTokens()
  const accessToken = tokens.find(t => t.token === token)
  
  // Token not found
  if (!accessToken) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invalid Link - MXWLL</title>
          <style>
            body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
            .box { text-align: center; padding: 3rem; }
            h1 { font-size: 1.5rem; font-weight: 300; margin-bottom: 1rem; }
            p { color: #666; margin-bottom: 2rem; }
            a { color: black; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>This link isn't valid</h1>
            <p>It may have expired or been revoked.</p>
            <a href="/">← Back to MXWLL</a>
          </div>
        </body>
      </html>
      `,
      { 
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
  
  // Check if active
  if (!accessToken.active) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Link Deactivated - MXWLL</title>
          <style>
            body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
            .box { text-align: center; padding: 3rem; }
            h1 { font-size: 1.5rem; font-weight: 300; margin-bottom: 1rem; }
            p { color: #666; margin-bottom: 2rem; }
            a { color: black; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>This link has been deactivated</h1>
            <p>Contact the site owner for a new link.</p>
            <a href="/">← Back to MXWLL</a>
          </div>
        </body>
      </html>
      `,
      { 
        status: 403,
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
  
  // Check expiry
  if (accessToken.expiresAt && new Date(accessToken.expiresAt) < new Date()) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Link Expired - MXWLL</title>
          <style>
            body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
            .box { text-align: center; padding: 3rem; }
            h1 { font-size: 1.5rem; font-weight: 300; margin-bottom: 1rem; }
            p { color: #666; margin-bottom: 2rem; }
            a { color: black; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>This link has expired</h1>
            <p>Contact the site owner for a new link.</p>
            <a href="/">← Back to MXWLL</a>
          </div>
        </body>
      </html>
      `,
      { 
        status: 403,
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
  
  // Check max uses
  if (accessToken.maxUses && accessToken.usedCount >= accessToken.maxUses) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Link Limit Reached - MXWLL</title>
          <style>
            body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
            .box { text-align: center; padding: 3rem; }
            h1 { font-size: 1.5rem; font-weight: 300; margin-bottom: 1rem; }
            p { color: #666; margin-bottom: 2rem; }
            a { color: black; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>This link has reached its usage limit</h1>
            <p>Contact the site owner for a new link.</p>
            <a href="/">← Back to MXWLL</a>
          </div>
        </body>
      </html>
      `,
      { 
        status: 403,
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
  
  // Valid token - update usage stats
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
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
  
  // Redirect to the main site
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mxwll.io'
  return NextResponse.redirect(new URL('/observe', baseUrl))
}
