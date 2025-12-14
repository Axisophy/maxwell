import { NextResponse } from 'next/server';
import { generateMockSeismic } from '@/lib/unrest/mock-data';

let cachedData: ReturnType<typeof generateMockSeismic> | null = null;
let lastFetch = 0;
const CACHE_DURATION = 60000;

export async function GET() {
  const now = Date.now();
  
  if (cachedData && now - lastFetch < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }
  
  try {
    // TODO: Replace with real IRIS/FDSN data
    cachedData = generateMockSeismic();
    lastFetch = now;
    return NextResponse.json(cachedData);
  } catch (error) {
    console.error('Error fetching seismic data:', error);
    return NextResponse.json({ error: 'Failed to fetch seismic data' }, { status: 500 });
  }
}

export const revalidate = 60;
