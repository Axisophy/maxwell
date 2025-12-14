import { NextResponse } from 'next/server';
import { generateMockLightning } from '@/lib/unrest/mock-data';

let cachedData: ReturnType<typeof generateMockLightning> | null = null;
let lastFetch = 0;
const CACHE_DURATION = 30000;

export async function GET() {
  const now = Date.now();
  
  if (cachedData && now - lastFetch < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }
  
  try {
    // TODO: Replace with real GOES-R GLM data
    cachedData = generateMockLightning();
    lastFetch = now;
    return NextResponse.json(cachedData);
  } catch (error) {
    console.error('Error fetching lightning data:', error);
    return NextResponse.json({ error: 'Failed to fetch lightning data' }, { status: 500 });
  }
}

export const revalidate = 30;
