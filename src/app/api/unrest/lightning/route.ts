import { NextResponse } from 'next/server';
import { generateMockLightning } from '@/lib/unrest/mock-data';

// Cache the data for 30 seconds
let cachedData: ReturnType<typeof generateMockLightning> | null = null;
let lastFetch = 0;
const CACHE_DURATION = 30000; // 30 seconds

export async function GET() {
  const now = Date.now();
  
  // Return cached data if fresh
  if (cachedData && now - lastFetch < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }
  
  // TODO: Replace with real GOES-R GLM data fetch
  // For now, use mock data
  try {
    cachedData = generateMockLightning();
    lastFetch = now;
    
    return NextResponse.json(cachedData);
  } catch (error) {
    console.error('Error fetching lightning data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lightning data' },
      { status: 500 }
    );
  }
}

// Revalidate every 30 seconds
export const revalidate = 30;
