import { NextResponse } from 'next/server';
import { Earthquake } from '@/lib/unrest/types';

let cachedData: Earthquake[] | null = null;
let lastFetch = 0;
const CACHE_DURATION = 60000; // 1 minute

export async function GET() {
  const now = Date.now();
  
  if (cachedData && now - lastFetch < CACHE_DURATION) {
    return NextResponse.json({ earthquakes: cachedData, lastUpdated: new Date(lastFetch).toISOString() });
  }
  
  try {
    // Fetch real USGS earthquake data (M4.5+ in last 24 hours)
    const response = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson',
      { next: { revalidate: 60 } }
    );
    
    if (!response.ok) {
      throw new Error('USGS API error');
    }
    
    const data = await response.json();
    
    const earthquakes: Earthquake[] = data.features.map((feature: any) => ({
      id: feature.id,
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
      depth: feature.geometry.coordinates[2],
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: feature.properties.time,
      url: feature.properties.url,
    }));
    
    cachedData = earthquakes;
    lastFetch = now;
    
    return NextResponse.json({ 
      earthquakes, 
      lastUpdated: new Date().toISOString(),
      count: earthquakes.length 
    });
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    
    // Return cached data if available, even if stale
    if (cachedData) {
      return NextResponse.json({ 
        earthquakes: cachedData, 
        lastUpdated: new Date(lastFetch).toISOString(),
        stale: true 
      });
    }
    
    return NextResponse.json({ error: 'Failed to fetch earthquake data' }, { status: 500 });
  }
}

export const revalidate = 60;
