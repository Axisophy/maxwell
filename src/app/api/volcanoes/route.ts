import { NextResponse } from 'next/server'

// ===========================================
// VOLCANO WATCH API
// ===========================================
// Data source: Smithsonian Global Volcanism Program
// https://volcano.si.edu/reports_weekly.cfm
// Secondary: USGS Volcano Hazards Program
// ===========================================

interface Volcano {
  id: string
  name: string
  country: string
  region: string
  latitude: number
  longitude: number
  elevation: number
  type: string
  alertLevel: 'normal' | 'advisory' | 'watch' | 'warning'
  lastEruption: string
  currentActivity?: string
  aviationCode?: 'green' | 'yellow' | 'orange' | 'red'
}

// Cache for 1 hour (data updates weekly)
let cache: { data: VolcanoResponse; timestamp: number } | null = null
const CACHE_DURATION = 60 * 60 * 1000

interface VolcanoResponse {
  timestamp: string
  summary: {
    activeCount: number
    elevatedCount: number
    advisoryCount: number
  }
  volcanoes: Volcano[]
}

// Current volcanic activity (as of late 2025)
// Source: Smithsonian GVP Weekly Reports
const ACTIVE_VOLCANOES: Volcano[] = [
  {
    id: 'kilauea',
    name: 'Kīlauea',
    country: 'United States',
    region: 'Hawaii',
    latitude: 19.421,
    longitude: -155.287,
    elevation: 1222,
    type: 'Shield volcano',
    alertLevel: 'warning',
    lastEruption: '2024-ongoing',
    currentActivity: 'Intermittent lava lake activity in Halemaʻumaʻu crater',
    aviationCode: 'orange',
  },
  {
    id: 'etna',
    name: 'Etna',
    country: 'Italy',
    region: 'Sicily',
    latitude: 37.748,
    longitude: 14.999,
    elevation: 3357,
    type: 'Stratovolcano',
    alertLevel: 'watch',
    lastEruption: '2024-ongoing',
    currentActivity: 'Strombolian activity from summit craters',
    aviationCode: 'yellow',
  },
  {
    id: 'stromboli',
    name: 'Stromboli',
    country: 'Italy',
    region: 'Aeolian Islands',
    latitude: 38.789,
    longitude: 15.213,
    elevation: 924,
    type: 'Stratovolcano',
    alertLevel: 'watch',
    lastEruption: '2024-ongoing',
    currentActivity: 'Persistent strombolian explosions',
    aviationCode: 'yellow',
  },
  {
    id: 'fagradalsfjall',
    name: 'Fagradalsfjall',
    country: 'Iceland',
    region: 'Reykjanes Peninsula',
    latitude: 63.903,
    longitude: -22.273,
    elevation: 385,
    type: 'Shield volcano',
    alertLevel: 'advisory',
    lastEruption: '2024',
    currentActivity: 'Increased seismicity in Svartsengi area',
    aviationCode: 'yellow',
  },
  {
    id: 'popocatepetl',
    name: 'Popocatépetl',
    country: 'Mexico',
    region: 'Central Mexico',
    latitude: 19.023,
    longitude: -98.622,
    elevation: 5426,
    type: 'Stratovolcano',
    alertLevel: 'watch',
    lastEruption: '2024-ongoing',
    currentActivity: 'Moderate explosions and ash emissions',
    aviationCode: 'yellow',
  },
  {
    id: 'fuego',
    name: 'Fuego',
    country: 'Guatemala',
    region: 'Central America',
    latitude: 14.473,
    longitude: -90.880,
    elevation: 3763,
    type: 'Stratovolcano',
    alertLevel: 'warning',
    lastEruption: '2024-ongoing',
    currentActivity: 'Frequent explosions and pyroclastic flows',
    aviationCode: 'orange',
  },
  {
    id: 'semeru',
    name: 'Semeru',
    country: 'Indonesia',
    region: 'Java',
    latitude: -8.108,
    longitude: 112.922,
    elevation: 3676,
    type: 'Stratovolcano',
    alertLevel: 'warning',
    lastEruption: '2024-ongoing',
    currentActivity: 'Continuous ash emissions and pyroclastic flows',
    aviationCode: 'orange',
  },
  {
    id: 'sakurajima',
    name: 'Sakurajima',
    country: 'Japan',
    region: 'Kyushu',
    latitude: 31.585,
    longitude: 130.657,
    elevation: 1117,
    type: 'Stratovolcano',
    alertLevel: 'watch',
    lastEruption: '2024-ongoing',
    currentActivity: 'Frequent vulcanian explosions from Minamidake crater',
    aviationCode: 'yellow',
  },
  {
    id: 'dukono',
    name: 'Dukono',
    country: 'Indonesia',
    region: 'Halmahera',
    latitude: 1.693,
    longitude: 127.894,
    elevation: 1229,
    type: 'Complex volcano',
    alertLevel: 'advisory',
    lastEruption: '2024-ongoing',
    currentActivity: 'Continuous ash emissions',
    aviationCode: 'yellow',
  },
  {
    id: 'lewotolok',
    name: 'Lewotolok',
    country: 'Indonesia',
    region: 'Lembata Island',
    latitude: -8.274,
    longitude: 123.508,
    elevation: 1423,
    type: 'Stratovolcano',
    alertLevel: 'advisory',
    lastEruption: '2024',
    currentActivity: 'Elevated seismicity and fumarolic activity',
  },
  {
    id: 'merapi',
    name: 'Merapi',
    country: 'Indonesia',
    region: 'Java',
    latitude: -7.540,
    longitude: 110.446,
    elevation: 2968,
    type: 'Stratovolcano',
    alertLevel: 'watch',
    lastEruption: '2024-ongoing',
    currentActivity: 'Lava dome growth and pyroclastic flows',
    aviationCode: 'orange',
  },
  {
    id: 'sheveluch',
    name: 'Sheveluch',
    country: 'Russia',
    region: 'Kamchatka',
    latitude: 56.653,
    longitude: 161.360,
    elevation: 3283,
    type: 'Stratovolcano',
    alertLevel: 'watch',
    lastEruption: '2024-ongoing',
    currentActivity: 'Lava dome growth with occasional explosions',
    aviationCode: 'orange',
  },
]

export async function GET() {
  // Check cache
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data)
  }

  try {
    // TODO: In production, scrape Smithsonian GVP weekly report
    // or integrate with USGS API for US volcanoes
    // For now, use curated data based on recent reports

    const activeCount = ACTIVE_VOLCANOES.filter(v => v.alertLevel === 'warning').length
    const watchCount = ACTIVE_VOLCANOES.filter(v => v.alertLevel === 'watch').length
    const advisoryCount = ACTIVE_VOLCANOES.filter(v => v.alertLevel === 'advisory').length

    const data: VolcanoResponse = {
      timestamp: new Date().toISOString(),
      summary: {
        activeCount,
        elevatedCount: watchCount,
        advisoryCount,
      },
      volcanoes: ACTIVE_VOLCANOES.sort((a, b) => {
        // Sort by alert level (warning first)
        const levels = { warning: 0, watch: 1, advisory: 2, normal: 3 }
        return levels[a.alertLevel] - levels[b.alertLevel]
      }),
    }

    cache = { data, timestamp: Date.now() }
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in volcanoes API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch volcano data' },
      { status: 500 }
    )
  }
}

export const revalidate = 3600 // Revalidate every hour
