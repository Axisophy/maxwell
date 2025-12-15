import { NextResponse } from 'next/server'

// European radiation monitoring (EURDEP)
export async function GET() {
  try {
    const mockData = {
      timestamp: new Date().toISOString(),
      stations: [
        { id: 'UK001', country: 'UK', city: 'London', lat: 51.5, lng: -0.12, value: 0.08, unit: 'µSv/h', status: 'normal' },
        { id: 'DE001', country: 'Germany', city: 'Berlin', lat: 52.52, lng: 13.4, value: 0.09, unit: 'µSv/h', status: 'normal' },
        { id: 'FR001', country: 'France', city: 'Paris', lat: 48.85, lng: 2.35, value: 0.07, unit: 'µSv/h', status: 'normal' },
        { id: 'PL001', country: 'Poland', city: 'Warsaw', lat: 52.23, lng: 21.01, value: 0.085, unit: 'µSv/h', status: 'normal' },
        { id: 'ES001', country: 'Spain', city: 'Madrid', lat: 40.42, lng: -3.7, value: 0.11, unit: 'µSv/h', status: 'normal' },
        { id: 'IT001', country: 'Italy', city: 'Rome', lat: 41.9, lng: 12.5, value: 0.095, unit: 'µSv/h', status: 'normal' },
        { id: 'SE001', country: 'Sweden', city: 'Stockholm', lat: 59.33, lng: 18.07, value: 0.06, unit: 'µSv/h', status: 'normal' },
        { id: 'NO001', country: 'Norway', city: 'Oslo', lat: 59.91, lng: 10.75, value: 0.07, unit: 'µSv/h', status: 'normal' }
      ],
      averageEurope: 0.082,
      normalRange: { min: 0.05, max: 0.15 },
      alertThreshold: 0.3,
      totalStations: 5500,
      source: 'EURDEP'
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Radiation API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch radiation data' },
      { status: 500 }
    )
  }
}
