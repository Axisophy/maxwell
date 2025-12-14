import { NextResponse } from 'next/server';
import { generateMockSummary } from '@/lib/unrest/mock-data';

// Cache the data for 30 seconds
let cachedData: ReturnType<typeof generateMockSummary> | null = null;
let lastFetch = 0;
const CACHE_DURATION = 30000;

export async function GET() {
  const now = Date.now();
  
  if (cachedData && now - lastFetch < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }
  
  try {
    cachedData = generateMockSummary();
    lastFetch = now;
    
    return NextResponse.json(cachedData);
  } catch (error) {
    console.error('Error fetching unrest summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unrest summary' },
      { status: 500 }
    );
  }
}

export const revalidate = 30;
