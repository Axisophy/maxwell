'use client'

import WidgetFrame from '@/components/WidgetFrame'
import SolarLive from '@/components/widgets/SolarLive'
import HimawariLive from '@/components/widgets/HimawariLive'
import SpaceWeather from '@/components/widgets/SpaceWeather'
import AirQuality from '@/components/widgets/AirQuality'
import APOD from '@/components/widgets/APOD'
import AuroraForecast from '@/components/widgets/AuroraForecast'
import CO2Now from '@/components/widgets/CO2Now'
import DSCOVREpic from '@/components/widgets/DSCOVREpic'
import EarthquakesLive from '@/components/widgets/EarthquakesLive'
import ISSTracker from '@/components/widgets/ISSTracker'

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

          {/* Air Quality */}
          <WidgetFrame
            title="Air Quality"
            info={{
              description:
                'Current air quality index based on your location. Shows PM2.5 levels and comparison to WHO guidelines. Expand to see individual pollutant readings.',
              source: 'OpenAQ',
            }}
            status="live"
          >
            <AirQuality />
          </WidgetFrame>

          {/* Astronomy Picture of the Day */}
          <WidgetFrame
            title="Picture of the Day"
            info={{
              description:
                "NASA's Astronomy Picture of the Day. Each day a different image or photograph of our universe is featured, along with a brief explanation written by a professional astronomer.",
              source: 'NASA APOD',
            }}
            status="ok"
          >
            <APOD />
          </WidgetFrame>

          {/* Aurora Forecast */}
          <WidgetFrame
            title="Aurora Forecast"
            info={{
              description:
                'Will you see aurora tonight? Based on geomagnetic activity forecasts and your latitude. Best viewing is on clear nights, away from city lights, between 10pm and 2am.',
              source: 'NOAA Space Weather Prediction Center',
            }}
            status="live"
          >
            <AuroraForecast />
          </WidgetFrame>

          {/* CO2 Now */}
          <WidgetFrame
            title="CO₂ Now"
            info={{
              description:
                'Current atmospheric carbon dioxide concentration measured at Mauna Loa Observatory, Hawaii. The Keeling Curve measurements began in 1958 and represent the longest continuous record of atmospheric CO₂.',
              source: 'NOAA Global Monitoring Laboratory',
            }}
            status="ok"
          >
            <CO2Now />
          </WidgetFrame>

          {/* DSCOVR EPIC */}
          <WidgetFrame
            title="Earth from L1"
            info={{
              description:
                'DSCOVR orbits the L1 Lagrange point, 1.5 million km from Earth, where the gravity of the Sun and Earth balance. From there it always sees the sunlit side of our planet — Earth as a distant traveller would see it.',
              source: 'NASA DSCOVR EPIC Camera',
            }}
            status="live"
          >
            <DSCOVREpic />
          </WidgetFrame>

        </div>
      </div>

          {/* Earthquakes Live */}
          <WidgetFrame
            title="Earthquakes"
            info={{
              description:
                'Real-time seismic activity showing earthquakes magnitude 4.5 and above. Colour indicates severity: yellow (M4-5), orange (M5-6), red (M6-7), dark red (M7+).',
              source: 'USGS Earthquake Hazards Program',
            }}
            status="live"
          >
            <EarthquakesLive />
          </WidgetFrame>

          {/* ISS Tracker */}
          <WidgetFrame
            title="ISS Tracker"
            info={{
              description:
                'Real-time position of the International Space Station, orbiting at approximately 420 km altitude and 27,600 km/h. Updates every 30 seconds.',
              source: 'Where The ISS At / Open Notify',
            }}
            status="live"
          >
            <ISSTracker />
          </WidgetFrame>

      {/* Mobile bottom padding for nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}