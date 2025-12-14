import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Send to Loops
    const res = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: normalizedEmail,
        source: 'prelaunch-landing',
      }),
    })

    if (!res.ok) {
      const error = await res.json()
      // "Contact already exists" is fine
      if (error.message?.includes('already exists')) {
        return NextResponse.json({ message: "You're already on the list!" })
      }
      throw new Error(error.message || 'Loops API error')
    }

    return NextResponse.json({ message: 'Successfully subscribed!' })

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
