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
  } catch {
    // Directory exists
  }
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
