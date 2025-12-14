import { NextResponse } from 'next/server';
import { generateMockSeismic } from '@/lib/unrest/mock-data';

// Cache the data for 60 seconds
let cachedData: ReturnType<typeof generateMockSeismic> | null = null;
let lastFetch = 0;
const CACHE_DURATION = 60000; // 60 seconds

export async function GET() {
  const now = Date.now();
  
  // Return cached data if fresh
  if (cachedData && now - lastFetch < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }
  
  // TODO: Replace with real IRIS/FDSN and USGS data fetch
  // For now, use mock data
  try {
    cachedData = generateMockSeismic();
    lastFetch = now;
    
    return NextResponse.json(cachedData);
  } catch (error) {
    console.error('Error fetching seismic data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seismic data' },
      { status: 500 }
    );
  }
}

// Revalidate every 60 seconds
export const revalidate = 60;
