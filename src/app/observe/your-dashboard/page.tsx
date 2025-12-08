'use client'

import WidgetFrame from '@/components/WidgetFrame'
import SolarLive from '@/components/widgets/SolarLive'
import HimawariLive from '@/components/widgets/HimawariLive'
import SpaceWeather from '@/components/widgets/SpaceWeather'

export default function YourDashboardPage() {
  return (
    <main className="min-h-screen bg-shell-light">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />
      
      <div className="px-4 md:px-8 lg:px-12 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-light text-text-primary">Your Dashboard</h1>
        </div>

        {/* Widget grid: 1 col mobile, 2 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          {/* Solar Live */}
          <WidgetFrame
            title="Solar Live"
            info={{
              description:
                "Real-time imagery of the Sun from NASA's Solar Dynamics Observatory. Switch between wavelengths to see different layers of the solar atmosphere.",
              source: 'NASA Solar Dynamics Observatory',
            }}
            status="live"
          >
            <SolarLive />
          </WidgetFrame>

          {/* Himawari Pacific Disc */}
          <WidgetFrame
            title="Pacific Disc"
            info={{
              description:
                'Full-disc Earth imagery from the Himawari-9 satellite, showing the Pacific Ocean and Asia-Pacific region. Updated every 10 minutes.',
              source: 'NICT Japan / Himawari-9',
            }}
            status="live"
          >
            <HimawariLive />
          </WidgetFrame>

          {/* Space Weather */}
          <WidgetFrame
            title="Space Weather"
            info={{
              description:
                'Current space weather conditions including geomagnetic activity (Kp index), solar wind speed, and X-ray flux levels.',
              source: 'NOAA Space Weather Prediction Center',
            }}
            status="live"
          >
            <SpaceWeather />
          </WidgetFrame>

        </div>
      </div>

      {/* Mobile bottom padding for nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}