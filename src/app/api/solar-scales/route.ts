import { NextResponse } from 'next/server'

interface NOAAScalesResponse {
  [key: string]: {
    DateStamp: string
    TimeStamp: string
    R: { Scale: string | null; Text: string | null; MinorProb: string | null; MajorProb: string | null }
    S: { Scale: string | null; Text: string | null; Prob: string | null }
    G: { Scale: string | null; Text: string | null }
  }
}

export async function GET() {
  try {
    const response = await fetch('https://services.swpc.noaa.gov/products/noaa-scales.json', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error('Failed to fetch NOAA scales')
    }

    const data: NOAAScalesResponse = await response.json()

    // "-1" is observed, "0" is current, "1" is 24h forecast
    const observed = data['-1']
    const current = data['0']
    const forecast24h = data['1']

    // Calculate 24h max from current and forecast
    const getMax = (a: string | null, b: string | null): number => {
      const numA = a ? parseInt(a, 10) : 0
      const numB = b ? parseInt(b, 10) : 0
      return Math.max(numA, numB)
    }

    return NextResponse.json({
      r: {
        current: current?.R?.Scale ? parseInt(current.R.Scale, 10) : 0,
        text: current?.R?.Text || 'none',
        max24h: getMax(current?.R?.Scale, forecast24h?.G?.Scale), // G forecast has scale
        minorProb: forecast24h?.R?.MinorProb ? parseInt(forecast24h.R.MinorProb, 10) : null,
        majorProb: forecast24h?.R?.MajorProb ? parseInt(forecast24h.R.MajorProb, 10) : null,
      },
      s: {
        current: current?.S?.Scale ? parseInt(current.S.Scale, 10) : 0,
        text: current?.S?.Text || 'none',
        max24h: getMax(current?.S?.Scale, '0'),
        prob: forecast24h?.S?.Prob ? parseInt(forecast24h.S.Prob, 10) : null,
      },
      g: {
        current: current?.G?.Scale ? parseInt(current.G.Scale, 10) : 0,
        text: current?.G?.Text || 'none',
        max24h: forecast24h?.G?.Scale ? parseInt(forecast24h.G.Scale, 10) : 0,
        forecast24hText: forecast24h?.G?.Text || 'none',
      },
      flareProb: {
        c: forecast24h?.R?.MinorProb ? parseInt(forecast24h.R.MinorProb, 10) : null,
        m: forecast24h?.R?.MajorProb ? parseInt(forecast24h.R.MajorProb, 10) : null,
        x: null, // X-class probability not in this feed
      },
      timestamp: `${current?.DateStamp}T${current?.TimeStamp}Z`,
    })
  } catch (error) {
    console.error('Failed to fetch NOAA scales:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NOAA scales' },
      { status: 500 }
    )
  }
}
