import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import crypto from 'crypto'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const TOKENS_KEY = 'mxwll:access-tokens'

interface AccessToken {
  token: string
  name: string
  email?: string
  createdAt: string
  usedAt?: string
  usedCount: number
  maxUses?: number
  expiresAt?: string
  active: boolean
}

async function getTokens(): Promise<AccessToken[]> {
  const tokens = await redis.get<AccessToken[]>(TOKENS_KEY)
  return tokens || []
}

async function saveTokens(tokens: AccessToken[]): Promise<void> {
  await redis.set(TOKENS_KEY, tokens)
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
    const { name, email, maxUses, expiresInDays } = body

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

    if (email) newToken.email = email
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
