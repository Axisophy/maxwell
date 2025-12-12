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
  } catch {
    // Directory exists
  }
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
