// File: src/app/api/pulse/route.ts

import { NextResponse } from 'next/server'

export const revalidate = 300 // Cache for 5 minutes

interface EarthquakeFeature {
  properties: {
    mag: number
    place: string
    time: number
  }
}

interface EarthquakeData {
  features: EarthquakeFeature[]
}

interface KpDataPoint {
  time_tag: string
  kp: string
}

interface ISSPosition {
  iss_position: {
    latitude: string
    longitude: string
  }
}

interface Launch {
  name: string
  net: string
  rocket?: {
    configuration?: {
      name: string
    }
  }
  launch_service_provider?: {
    name: string
  }
}

interface LaunchData {
  results: Launch[]
}

function getRegionFromCoords(lat: number, lng: number): string {
  // Polar regions
  if (lat > 66) return 'Arctic'
  if (lat < -66) return 'Antarctic'
  
  // Continents first (more specific)
  if (lat > 25 && lat < 72 && lng > -170 && lng < -50) return 'North America'
  if (lat > -56 && lat < 12 && lng > -82 && lng < -34) return 'South America'
  if (lat > 36 && lat < 71 && lng > -11 && lng < 40) return 'Europe'
  if (lat > -35 && lat < 37 && lng > -18 && lng < 52) return 'Africa'
  if (lat > 5 && lat < 78 && lng > 26 && lng < 180) return 'Asia'
  if (lat > 5 && lat < 55 && lng > 60 && lng < 150) return 'Asia'
  if (lat > -47 && lat < -10 && lng > 113 && lng < 154) return 'Australia'
  if (lat > -47 && lat < -34 && lng > 166 && lng < 179) return 'New Zealand'
  
  // Oceans (catch remaining)
  if (lng > 100 || lng < -100) {
    if (lat > 0) return 'North Pacific'
    return 'South Pacific'
  }
  
  if (lng > -80 && lng < 0) {
    if (lat > 0) return 'North Atlantic'
    return 'South Atlantic'
  }
  
  if (lng > 20 && lng < 100 && lat < 30 && lat > -40) {
    return 'Indian Ocean'
  }
  
  // Default fallback
  return 'Pacific'
}

function getSolarStatusText(kp: number): string {
  if (kp >= 7) return 'Storm'
  if (kp >= 5) return 'Active'
  if (kp >= 4) return 'Unsettled'
  if (kp >= 2) return 'Low'
  return 'Quiet'
}

export async function GET() {
  try {
    const [earthquakeRes, kpRes, issRes, launchRes, uvRes] = await Promise.allSettled([
      fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=4&limit=500', {
        next: { revalidate: 300 }
      }),
      fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json', {
        next: { revalidate: 300 }
      }),
      fetch('https://api.open-notify.org/iss-now.json', {
        next: { revalidate: 60 }
      }),
      fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=3', {
        next: { revalidate: 300 }
      }),
      fetch('https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current=uv_index', {
        next: { revalidate: 300 }
      })
    ])

    const data: {
      earthquakes: { count: number; significant: { mag: number; place: string; time: number }[]; daily: number[] }
      co2: { current: number; trend: number[] }
      solar: { status: string; kp: number; kpHistory: number[] }
      iss: { lat: number; lng: number; region: string }
      launches: { name: string; net: string; rocket: string }[]
      uv: { index: number; level: string }
    } = {
      earthquakes: { count: 0, significant: [], daily: [] },
      co2: { current: 426.8, trend: [] },
      solar: { status: 'Low', kp: 2, kpHistory: [] },
      iss: { lat: 0, lng: 0, region: 'Unknown' },
      launches: [],
      uv: { index: 0, level: 'Low' }
    }

    // Generate CO2 trend (placeholder - real API returns text file)
    const base = 420
    for (let i = 0; i < 30; i++) {
      const seasonal = Math.sin((i / 30) * Math.PI * 2) * 3
      const upward = (i / 30) * 2
      data.co2.trend.push(base + seasonal + upward + Math.random() * 0.5)
    }
    data.co2.current = data.co2.trend[data.co2.trend.length - 1]

    // Process earthquake data
    if (earthquakeRes.status === 'fulfilled' && earthquakeRes.value.ok) {
      const eqData: EarthquakeData = await earthquakeRes.value.json()
      const now = Date.now()
      const oneDayAgo = now - 24 * 60 * 60 * 1000
      
      const recentQuakes = eqData.features.filter(f => f.properties.time > oneDayAgo)
      data.earthquakes.count = recentQuakes.length
      data.earthquakes.significant = recentQuakes
        .filter(f => f.properties.mag >= 5)
        .slice(0, 5)
        .map(f => ({
          mag: f.properties.mag,
          place: f.properties.place,
          time: f.properties.time
        }))
      
      // Daily counts for sparkline (last 7 days)
      for (let i = 6; i >= 0; i--) {
        const dayStart = now - (i + 1) * 24 * 60 * 60 * 1000
        const dayEnd = now - i * 24 * 60 * 60 * 1000
        const count = eqData.features.filter(f => 
          f.properties.time >= dayStart && f.properties.time < dayEnd
        ).length
        data.earthquakes.daily.push(count)
      }
    }

    // Process Kp/solar data
    if (kpRes.status === 'fulfilled' && kpRes.value.ok) {
      const kpData: KpDataPoint[] = await kpRes.value.json()
      const kpValues = kpData.slice(1).map(row => parseFloat(row.kp) || 0)
      const latestKp = kpValues[kpValues.length - 1] || 2
      data.solar.kp = Math.round(latestKp)
      data.solar.status = getSolarStatusText(latestKp)
      data.solar.kpHistory = kpValues.slice(-24)
    }

    // Process ISS data
    if (issRes.status === 'fulfilled' && issRes.value.ok) {
      const issData: ISSPosition = await issRes.value.json()
      const lat = parseFloat(issData.iss_position.latitude)
      const lng = parseFloat(issData.iss_position.longitude)
      data.iss.lat = lat
      data.iss.lng = lng
      data.iss.region = getRegionFromCoords(lat, lng)
    }

    // Process launch data
    if (launchRes.status === 'fulfilled' && launchRes.value.ok) {
      const launchData: LaunchData = await launchRes.value.json()
      data.launches = (launchData.results || []).slice(0, 3).map(l => ({
        name: l.name,
        net: l.net,
        rocket: l.rocket?.configuration?.name || 'Rocket'
      }))
    }

    // Process UV data
    if (uvRes.status === 'fulfilled' && uvRes.value.ok) {
      const uvData = await uvRes.value.json()
      const uvIndex = Math.round(uvData.current?.uv_index || 0)
      data.uv.index = uvIndex
      if (uvIndex <= 2) data.uv.level = 'Low'
      else if (uvIndex <= 5) data.uv.level = 'Moderate'
      else if (uvIndex <= 7) data.uv.level = 'High'
      else if (uvIndex <= 10) data.uv.level = 'Very High'
      else data.uv.level = 'Extreme'
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Pulse API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}