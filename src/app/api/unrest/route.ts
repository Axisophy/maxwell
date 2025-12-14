import { NextResponse } from 'next/server';
import { generateMockMapData, generateMockLightning, generateMockStorms, generateMockVolcanoes } from '@/lib/unrest/mock-data';
import { Earthquake } from '@/lib/unrest/types';

let cachedData: any = null;
let lastFetch = 0;
const CACHE_DURATION = 30000;

export async function GET() {
  const now = Date.now();
  
  if (cachedData && now - lastFetch < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }
  
  try {
    // Fetch real earthquake data from USGS
    let earthquakes: Earthquake[] = [];
    try {
      const eqResponse = await fetch(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson',
        { next: { revalidate: 60 } }
      );
      
      if (eqResponse.ok) {
        const eqData = await eqResponse.json();
        earthquakes = eqData.features.map((feature: any) => ({
          id: feature.id,
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          depth: feature.geometry.coordinates[2],
          magnitude: feature.properties.mag,
          place: feature.properties.place,
          time: feature.properties.time,
          url: feature.properties.url,
        }));
      }
    } catch (err) {
      console.error('Error fetching USGS data:', err);
    }
    
    // Get mock data for other sources (until we connect real APIs)
    const lightning = generateMockLightning();
    const storms = generateMockStorms();
    const volcanoes = generateMockVolcanoes();
    
    cachedData = {
      lightning: lightning.strikes,
      lightningStats: lightning.stats,
      earthquakes,
      earthquakeStats: {
        count: earthquakes.length,
        largest: earthquakes.length > 0 
          ? earthquakes.reduce((max, eq) => eq.magnitude > max.magnitude ? eq : max, earthquakes[0])
          : null,
      },
      storms,
      stormStats: {
        count: storms.length,
        strongest: storms.length > 0
          ? storms.reduce((max, s) => (s.category || 0) > (max.category || 0) ? s : max, storms[0])
          : null,
      },
      volcanoes,
      volcanoStats: {
        elevated: volcanoes.filter(v => v.alertLevel !== 'green').length,
        red: volcanoes.filter(v => v.alertLevel === 'red').length,
      },
      lastUpdated: new Date().toISOString(),
    };
    
    lastFetch = now;
    return NextResponse.json(cachedData);
  } catch (error) {
    console.error('Error fetching map data:', error);
    return NextResponse.json({ error: 'Failed to fetch map data' }, { status: 500 });
  }
}

export const revalidate = 30;
