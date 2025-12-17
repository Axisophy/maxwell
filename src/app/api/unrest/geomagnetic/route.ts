import { NextResponse } from 'next/server';

interface KpData {
  kp: number;
  timestamp: string;
  gScale: number;
}

interface SolarWindData {
  speed: number;
  density: number;
  bz: number;
}

let cachedData: { kp: KpData | null; solarWind: SolarWindData | null; lastFetch: number } = {
  kp: null,
  solarWind: null,
  lastFetch: 0,
};

const CACHE_DURATION = 60000; // 1 minute

export async function GET() {
  const now = Date.now();

  if (cachedData.kp && now - cachedData.lastFetch < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }

  try {
    // Fetch Kp index from NOAA SWPC
    const kpResponse = await fetch(
      'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
      { next: { revalidate: 60 } }
    );

    let kpData: KpData | null = null;

    if (kpResponse.ok) {
      const kpRaw = await kpResponse.json();
      // Data format: [["time_tag", "Kp", "Kp_fraction", ...], ["2025-12-17 12:00:00", "4", "4.33", ...]]
      if (kpRaw.length > 1) {
        const latest = kpRaw[kpRaw.length - 1];
        const kpValue = parseFloat(latest[1]) || 0;
        kpData = {
          kp: kpValue,
          timestamp: latest[0],
          gScale: kpValue >= 9 ? 5 : kpValue >= 8 ? 4 : kpValue >= 7 ? 3 : kpValue >= 6 ? 2 : kpValue >= 5 ? 1 : 0,
        };
      }
    }

    // Fetch solar wind data
    let solarWindData: SolarWindData | null = null;
    try {
      const windResponse = await fetch(
        'https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json',
        { next: { revalidate: 60 } }
      );

      if (windResponse.ok) {
        const windRaw = await windResponse.json();
        if (windRaw.length > 1) {
          const latest = windRaw[windRaw.length - 1];
          solarWindData = {
            speed: parseFloat(latest[2]) || 0,
            density: parseFloat(latest[1]) || 0,
            bz: 0, // Would need mag data for this
          };
        }
      }
    } catch (err) {
      console.error('Error fetching solar wind:', err);
    }

    cachedData = {
      kp: kpData,
      solarWind: solarWindData,
      lastFetch: now,
    };

    return NextResponse.json(cachedData);
  } catch (error) {
    console.error('Error fetching geomagnetic data:', error);
    return NextResponse.json({ error: 'Failed to fetch geomagnetic data' }, { status: 500 });
  }
}

export const revalidate = 60;
