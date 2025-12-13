import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Path to store subscribers (in production, use a database or email service)
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
  // Ensure directory exists
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
    
    // Validate email
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
    
    // Get existing subscribers
    const subscribers = await getSubscribers()
    
    // Check if already subscribed
    if (subscribers.some(s => s.email === normalizedEmail)) {
      return NextResponse.json(
        { message: 'You\'re already on the list!' },
        { status: 200 }
      )
    }
    
    // Add new subscriber
    const newSubscriber: Subscriber = {
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
      source: 'prelaunch-landing',
    }
    
    subscribers.push(newSubscriber)
    await saveSubscribers(subscribers)
    
    // Log for now (in production, you might want to notify via email/Slack)
    console.log(`New subscriber: ${normalizedEmail}`)
    
    // Optional: Send to external service (Mailchimp, ConvertKit, etc.)
    // await sendToMailchimp(normalizedEmail)
    // await sendToConvertKit(normalizedEmail)
    
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

// GET endpoint to check subscriber count (protected by middleware in production)
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
