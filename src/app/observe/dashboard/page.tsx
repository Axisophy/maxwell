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
import LaunchCountdown from '@/components/widgets/LaunchCountdown'
import LightTravel from '@/components/widgets/LightTravel'
import MoonPhase from '@/components/widgets/MoonPhase'
import NearEarthAsteroids from '@/components/widgets/NearEarthAsteroids'
import NuclearReactors from '@/components/widgets/NuclearReactors'
import UKEnergy from '@/components/widgets/UKEnergy'
import WorldPopulation from '@/components/widgets/WorldPopulation'
import UKTides from '@/components/widgets/UKTides'



export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-shell-light">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="px-4 md:px-8 lg:px-12 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-text-primary">Dashboard</h1>
        </div>

        {/* Widget grid: 1 col mobile, 2 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

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

          <WidgetFrame
          title="Nuclear Reactors"
          info={{
            description: "Live nuclear power output from UK, France, and US. Global statistics show all 440 operating reactors worldwide and 62 under construction.",
            source: "Carbon Intensity API (UK), RTE éCO2mix (France), NRC (US), IAEA PRIS (Global)"
          }}
          status="live"
          >
            <NuclearReactors />
          </WidgetFrame>

          <WidgetFrame
            title="UK Energy"
            info={{
              description: "Live carbon intensity and generation mix for Great Britain's electricity grid. Shows how clean the grid is right now and what's generating the power.",
              source: "National Grid ESO via Carbon Intensity API"
            }}
            status="live"
          >
            <UKEnergy />
          </WidgetFrame>

          <WidgetFrame
            title="Tides"
            info={{
              description: "Tide predictions for coastal locations worldwide, calculated using simplified harmonic analysis. Shows high and low tide times, current water level, and a 24-hour tide curve. Times shown are local to the selected station.",
              source: "Harmonic calculation from tidal constants. Approximate predictions only — not for navigation. Check official sources (UKHO Admiralty, NOAA) for critical decisions."
            }}
            status="ok"
          >
            <UKTides />
          </WidgetFrame>

          <WidgetFrame
            title="World Population"
            info={{
              description: "Live estimate of Earth's human population, calculated from UN World Population Prospects 2024 data. The counter shows births and deaths happening in real time based on global averages.",
              source: "UN World Population Prospects 2024"
            }}
            status="ok"
          >
            <WorldPopulation />
          </WidgetFrame>

          {/* Launch Countdown */}
          <WidgetFrame
            title="Next Launch"
            info={{
              description:
                'Countdown to the next rocket launch worldwide. Shows mission details, launch provider, and location. Tap upcoming launches to see their countdown.',
              source: 'The Space Devs Launch Library',
            }}
            status="live"
          >
            <LaunchCountdown />
          </WidgetFrame>

          {/* Light Travel */}
          <WidgetFrame
            title="Light Travel"
            info={{
              description:
                'How far has light traveled since you opened this widget? A real-time counter showing the distance light covers at 299,792,458 metres per second.',
              source: 'Calculation based on the speed of light in vacuum',
            }}
            status="live"
          >
            <LightTravel />
          </WidgetFrame>

          {/* Moon Phase */}
          <WidgetFrame
            title="Moon Phase"
            info={{
              description:
                'Current lunar phase with illumination percentage. The Moon completes a full cycle every 29.5 days, from new moon through full moon and back.',
              source: 'Calculated using SunCalc library',
            }}
            status="ok"
          >
            <MoonPhase />
          </WidgetFrame>

          <WidgetFrame
          title="Near-Earth Asteroids"
          info={{
            description: "Upcoming asteroid close approaches to Earth. Distance shown in lunar distances (LD) — 1 LD equals the Moon's distance from Earth (~384,400 km). PHA = Potentially Hazardous Asteroid.",
            source: "NASA JPL Small-Body Database"
          }}
          status="live"
        >
          <NearEarthAsteroids />
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

      {/* Mobile bottom padding for nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
