import { NextResponse } from 'next/server'

export const revalidate = 60 // Cache for 60 seconds

function getKpStatus(kp: number): string {
  if (kp <= 2) return 'quiet'
  if (kp <= 4) return 'unsettled'
  if (kp <= 6) return 'storm'
  return 'severe storm'
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  try {
    // Fetch from multiple sources in parallel
    const [
      earthquakesRes,
      spaceWeatherRes,
      ukEnergyRes,
      cosmicRaysRes,
      lhcRes,
    ] = await Promise.allSettled([
      fetch(`${baseUrl}/api/earthquakes`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/space-weather`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/uk-energy`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/cosmic-rays`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/lhc`, { next: { revalidate: 60 } }),
    ])

    // Parse successful responses with fallbacks
    const earthquakes = earthquakesRes.status === 'fulfilled' && earthquakesRes.value.ok
      ? await earthquakesRes.value.json()
      : null

    const spaceWeather = spaceWeatherRes.status === 'fulfilled' && spaceWeatherRes.value.ok
      ? await spaceWeatherRes.value.json()
      : null

    const ukEnergy = ukEnergyRes.status === 'fulfilled' && ukEnergyRes.value.ok
      ? await ukEnergyRes.value.json()
      : null

    const cosmicRays = cosmicRaysRes.status === 'fulfilled' && cosmicRaysRes.value.ok
      ? await cosmicRaysRes.value.json()
      : null

    const lhc = lhcRes.status === 'fulfilled' && lhcRes.value.ok
      ? await lhcRes.value.json()
      : null

    // Extract Kp value from space weather
    const kpValue = spaceWeather?.kpIndex?.value ?? spaceWeather?.kp_index ?? 3

    // Extract carbon intensity (handle both object and number formats)
    const carbonIntensity = typeof ukEnergy?.intensity === 'object'
      ? (ukEnergy.intensity.actual ?? ukEnergy.intensity.forecast ?? 186)
      : (ukEnergy?.intensity || 186)

    // Aggregate into vital signs response
    const vitalSigns = {
      earthquakes: {
        count: earthquakes?.features?.length ?? earthquakes?.count ?? 47,
        period: '24h',
      },
      co2: {
        value: 426.8, // Could fetch from NOAA, but updates weekly
        unit: 'ppm',
      },
      solarWind: {
        speed: spaceWeather?.solarWind?.speed ?? spaceWeather?.solar_wind_speed ?? 412,
        unit: 'km/s',
      },
      population: {
        count: 8147000000 + Math.floor((Date.now() - new Date('2024-01-01').getTime()) / 1000 * 2.5),
        growthPerSecond: 2.5,
      },
      kpIndex: {
        value: kpValue,
        status: getKpStatus(kpValue),
      },
      cosmicRays: {
        flux: cosmicRays?.globalAverage?.count ?? cosmicRays?.flux ?? 6847,
        unit: 'counts/min',
        deviation: cosmicRays?.globalAverage?.deviation ?? 0,
      },
      ukGrid: {
        demand: ukEnergy?.demand ?? 32.4,
        unit: 'GW',
        carbonIntensity,
      },
      fires: {
        count: 12847, // Would fetch from FIRMS
        period: '24h',
      },
      lhc: {
        status: lhc?.machineMode ?? lhc?.status ?? 'STABLE BEAMS',
        beamEnergy: lhc?.beamEnergy ?? 6.8,
      },

      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(vitalSigns, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })

  } catch (error) {
    console.error('Error fetching vital signs:', error)

    // Return fallback data
    return NextResponse.json({
      earthquakes: { count: 47, period: '24h' },
      co2: { value: 426.8, unit: 'ppm' },
      solarWind: { speed: 412, unit: 'km/s' },
      population: { count: 8147000000, growthPerSecond: 2.5 },
      kpIndex: { value: 3, status: 'quiet' },
      cosmicRays: { flux: 6847, unit: 'counts/min', deviation: 0 },
      ukGrid: { demand: 32.4, unit: 'GW', carbonIntensity: 186 },
      fires: { count: 12847, period: '24h' },
      lhc: { status: 'STABLE BEAMS', beamEnergy: 6.8 },
      updatedAt: new Date().toISOString(),
    })
  }
}
