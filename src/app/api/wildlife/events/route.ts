import { NextResponse } from 'next/server'
import { demoEvents } from '@/lib/wildlife/demo-data'

export async function GET() {
  // For now, return demo events
  // TODO: Generate events dynamically from animal data patterns

  return NextResponse.json({
    events: demoEvents,
    timestamp: new Date().toISOString(),
    source: 'demo',
  })
}
