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
import LightningLive from '@/components/widgets/LightningLive'
import SeismicPulse from '@/components/widgets/SeismicPulse'
import DeepSpaceNetwork from '@/components/widgets/DeepSpaceNetwork'
import LHCStatus from '@/components/widgets/LHCStatus'
import NeutrinoWatch from '@/components/widgets/NeutrinoWatch'
import SatellitesAbove from '@/components/widgets/SatellitesAbove'
import SOHOCoronagraph from '@/components/widgets/SOHOCoronagraph'
import CosmicRayMonitor from '@/components/widgets/CosmicRayMonitor'
import GravitationalWaves from '@/components/widgets/GravitationalWaves'
import ActiveFires from '@/components/widgets/ActiveFires'
import CosmicRaysThrough from '@/components/widgets/CosmicRaysThrough'
import EBirdLive from '@/components/widgets/eBirdLive'
import EuropeanRadiationMap from '@/components/widgets/EuropeanRadiationMap'
import GlacierWatch from '@/components/widgets/GlacierWatch'
import INaturalistLive from '@/components/widgets/iNaturalistLive'
import ISSLivePosition from '@/components/widgets/ISSLivePosition'
import JWSTLatest from '@/components/widgets/JWSTLatest'
import MagneticField from '@/components/widgets/MagneticField'
import MagneticFieldStrength from '@/components/widgets/MagneticFieldStrength'
import MarsRoverImages from '@/components/widgets/MarsRoverImages'
import OceanHydrophones from '@/components/widgets/OceanHydrophones'
import PollenForecast from '@/components/widgets/PollenForecast'
import SeismographGrid from '@/components/widgets/SeismographGrid'
import StarMap from '@/components/widgets/StarMap'
import WhatsBelowYou from '@/components/widgets/WhatsBelowYou'
import YourAirJourney from '@/components/widgets/YourAirJourney'
import YourBackgroundDose from '@/components/widgets/YourBackgroundDose'
import YourSkyWhenBorn from '@/components/widgets/YourSkyWhenBorn'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-shell-light">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Page header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-text-primary">Dashboard</h1>
        </div>

        {/* Widget grid: 1 col mobile, 2 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

          {/* Solar Live */}
          <WidgetFrame
            title="Solar Live"
            description="Real-time imagery of the Sun from NASA's Solar Dynamics Observatory. Switch between wavelengths to see different layers of the solar atmosphere."
            source="NASA Solar Dynamics Observatory"
            status="live"
          >
            <SolarLive />
          </WidgetFrame>

          <WidgetFrame
            title="Nuclear Reactors"
            description="Live nuclear power output from UK, France, and US. Global statistics show all 440 operating reactors worldwide and 62 under construction."
            source="Carbon Intensity API (UK), RTE éCO2mix (France), NRC (US), IAEA PRIS (Global)"
            status="live"
          >
            <NuclearReactors />
          </WidgetFrame>

          <WidgetFrame
            title="UK Energy"
            description="Live carbon intensity and generation mix for Great Britain's electricity grid. Shows how clean the grid is right now and what's generating the power."
            source="National Grid ESO via Carbon Intensity API"
            status="live"
          >
            <UKEnergy />
          </WidgetFrame>

          <WidgetFrame
            title="Tides"
            description="Tide predictions for coastal locations worldwide, calculated using simplified harmonic analysis. Shows high and low tide times, current water level, and a 24-hour tide curve. Times shown are local to the selected station."
            source="Harmonic calculation from tidal constants. Approximate predictions only — not for navigation. Check official sources (UKHO Admiralty, NOAA) for critical decisions."
            status="ok"
          >
            <UKTides />
          </WidgetFrame>

          <WidgetFrame
            title="World Population"
            description="Live estimate of Earth's human population, calculated from UN World Population Prospects 2024 data. The counter shows births and deaths happening in real time based on global averages."
            source="UN World Population Prospects 2024"
            status="ok"
          >
            <WorldPopulation />
          </WidgetFrame>

          {/* Launch Countdown */}
          <WidgetFrame
            title="Next Launch"
            description="Countdown to the next rocket launch worldwide. Shows mission details, launch provider, and location. Tap upcoming launches to see their countdown."
            source="The Space Devs Launch Library"
            status="live"
          >
            <LaunchCountdown />
          </WidgetFrame>

          {/* Light Travel */}
          <WidgetFrame
            title="Light Travel"
            description="How far has light traveled since you opened this widget? A real-time counter showing the distance light covers at 299,792,458 metres per second."
            source="Calculation based on the speed of light in vacuum"
            status="live"
          >
            <LightTravel />
          </WidgetFrame>

          {/* Moon Phase */}
          <WidgetFrame
            title="Moon Phase"
            description="Current lunar phase with illumination percentage. The Moon completes a full cycle every 29.5 days, from new moon through full moon and back."
            source="Calculated using SunCalc library"
            status="ok"
          >
            <MoonPhase />
          </WidgetFrame>

          <WidgetFrame
            title="Near-Earth Asteroids"
            description="Upcoming asteroid close approaches to Earth. Distance shown in lunar distances (LD) — 1 LD equals the Moon's distance from Earth (~384,400 km). PHA = Potentially Hazardous Asteroid."
            source="NASA JPL Small-Body Database"
            status="live"
          >
            <NearEarthAsteroids />
          </WidgetFrame>

          {/* Himawari Pacific Disc */}
          <WidgetFrame
            title="Pacific Disc"
            description="Full-disc Earth imagery from the Himawari-9 satellite, showing the Pacific Ocean and Asia-Pacific region. Updated every 10 minutes."
            source="NICT Japan / Himawari-9"
            status="live"
          >
            <HimawariLive />
          </WidgetFrame>

          {/* Space Weather */}
          <WidgetFrame
            title="Space Weather"
            description="Current space weather conditions including geomagnetic activity (Kp index), solar wind speed, and X-ray flux levels."
            source="NOAA Space Weather Prediction Center"
            status="live"
          >
            <SpaceWeather />
          </WidgetFrame>

          {/* ISS Tracker */}
          <WidgetFrame
            title="ISS Tracker"
            description="Real-time position of the International Space Station, orbiting at approximately 420 km altitude and 27,600 km/h. Updates every 30 seconds."
            source="Where The ISS At / Open Notify"
            status="live"
          >
            <ISSTracker />
          </WidgetFrame>

          {/* Earthquakes Live */}
          <WidgetFrame
            title="Earthquakes"
            description="Real-time seismic activity showing earthquakes magnitude 4.5 and above. Colour indicates severity: yellow (M4-5), orange (M5-6), red (M6-7), dark red (M7+)."
            source="USGS Earthquake Hazards Program"
            status="live"
          >
            <EarthquakesLive />
          </WidgetFrame>

          {/* Lightning Live */}
          <WidgetFrame
            title="Lightning Live"
            description="Real-time lightning activity across the Americas. Yellow dots show recent strikes, with brightness indicating intensity. Updated continuously."
            source="GOES-R GLM Lightning Data"
            status="live"
          >
            <LightningLive />
          </WidgetFrame>

          {/* Seismic Pulse */}
          <WidgetFrame
            title="Seismic Pulse"
            description="Live seismograph traces from monitoring stations worldwide. Green waveforms show ground motion in real time. Stations selected for global coverage."
            source="IRIS/FDSN Seismic Network"
            status="live"
          >
            <SeismicPulse />
          </WidgetFrame>

          {/* Air Quality */}
          <WidgetFrame
            title="Air Quality"
            description="Current air quality index based on your location. Shows PM2.5 levels and comparison to WHO guidelines. Expand to see individual pollutant readings."
            source="OpenAQ"
            status="live"
          >
            <AirQuality />
          </WidgetFrame>

          {/* Aurora Forecast */}
          <WidgetFrame
            title="Aurora Forecast"
            description="Will you see aurora tonight? Based on geomagnetic activity forecasts and your latitude. Best viewing is on clear nights, away from city lights, between 10pm and 2am."
            source="NOAA Space Weather Prediction Center"
            status="live"
          >
            <AuroraForecast />
          </WidgetFrame>

          {/* Astronomy Picture of the Day */}
          <WidgetFrame
            title="Picture of the Day"
            description="NASA's Astronomy Picture of the Day. Each day a different image or photograph of our universe is featured, along with a brief explanation written by a professional astronomer."
            source="NASA APOD"
            status="ok"
          >
            <APOD />
          </WidgetFrame>

          {/* CO2 Now */}
          <WidgetFrame
            title="CO₂ Now"
            description="Current atmospheric carbon dioxide concentration measured at Mauna Loa Observatory, Hawaii. The Keeling Curve measurements began in 1958 and represent the longest continuous record of atmospheric CO₂."
            source="NOAA Global Monitoring Laboratory"
            status="ok"
          >
            <CO2Now />
          </WidgetFrame>

          {/* DSCOVR EPIC */}
          <WidgetFrame
            title="Earth from L1"
            description="DSCOVR orbits the L1 Lagrange point, 1.5 million km from Earth, where the gravity of the Sun and Earth balance. From there it always sees the sunlit side of our planet — Earth as a distant traveller would see it."
            source="NASA DSCOVR EPIC Camera"
            status="live"
          >
            <DSCOVREpic />
          </WidgetFrame>

          {/* Deep Space Network */}
          <WidgetFrame
            title="Deep Space Network"
            description="NASA's global array of giant radio antennas communicating with spacecraft across the solar system. Three stations in California, Spain, and Australia maintain contact with missions from Mars rovers to Voyager at the edge of interstellar space."
            source="NASA Jet Propulsion Laboratory"
            status="live"
          >
            <DeepSpaceNetwork />
          </WidgetFrame>

          {/* LHC Status */}
          <WidgetFrame
            title="LHC Status"
            description="The Large Hadron Collider is a 27km ring beneath Geneva that accelerates protons to 99.9999991% the speed of light. When beams collide, they recreate conditions a trillionth of a second after the Big Bang."
            source="CERN"
            status="live"
          >
            <LHCStatus />
          </WidgetFrame>

          {/* Neutrino Watch */}
          <WidgetFrame
            title="Neutrino Watch"
            description="IceCube is a cubic kilometer of Antarctic ice instrumented with 5,160 optical sensors. It detects neutrinos—particles so weakly interacting that trillions pass through you every second without touching anything."
            source="IceCube Neutrino Observatory"
            status="live"
          >
            <NeutrinoWatch />
          </WidgetFrame>

          {/* Satellites Above */}
          <WidgetFrame
            title="Satellites Above"
            description="Every tracked satellite currently overhead—GPS, Starlink, weather satellites, the ISS. At any moment, hundreds of satellites pass above your location."
            source="N2YO Satellite Database"
            status="live"
          >
            <SatellitesAbove />
          </WidgetFrame>

          {/* SOHO Coronagraph */}
          <WidgetFrame
            title="Solar Corona"
            description="SOHO's coronagraph creates an artificial eclipse—blocking the solar disk—to reveal the sun's ghostly outer atmosphere. Watch for coronal mass ejections blasting into space."
            source="SOHO/LASCO, ESA & NASA"
            status="live"
          >
            <SOHOCoronagraph />
          </WidgetFrame>

          {/* Cosmic Ray Monitor */}
          <WidgetFrame
            title="Cosmic Rays"
            description="Cosmic rays from supernovae constantly bombard Earth. Their flux varies inversely with solar activity—when the sun is quiet, more cosmic rays reach us. Neutron monitors worldwide track this invisible shower."
            source="Neutron Monitor Database (NMDB)"
            status="live"
          >
            <CosmicRayMonitor />
          </WidgetFrame>

          {/* Gravitational Waves */}
          <WidgetFrame
            title="Gravitational Waves"
            description="LIGO's twin 4km laser interferometers detect spacetime ripples from colliding black holes and neutron stars billions of light years away. The distortion measured is smaller than 1/10,000th the width of a proton."
            source="LIGO Scientific Collaboration"
            status="live"
          >
            <GravitationalWaves />
          </WidgetFrame>

          {/* Active Fires */}
          <WidgetFrame
            title="Active Fires"
            description="Real-time global wildfire monitoring from NASA's Fire Information for Resource Management System. Thermal anomalies detected by MODIS and VIIRS satellites in the last 24 hours."
            source="NASA FIRMS"
            status="live"
          >
            <ActiveFires />
          </WidgetFrame>

          {/* JWST Latest */}
          <WidgetFrame
            title="JWST Latest"
            description="The latest publicly released images from the James Webb Space Telescope — humanity's most powerful eye on the cosmos, orbiting 1.5 million km from Earth."
            source="Space Telescope Science Institute"
            status="live"
          >
            <JWSTLatest />
          </WidgetFrame>

          {/* Mars Rover Images */}
          <WidgetFrame
            title="Mars Rover Images"
            description="The latest photographs from NASA's Mars rovers — Curiosity and Perseverance — exploring the Martian surface right now."
            source="NASA Mars Exploration Program"
            status="live"
          >
            <MarsRoverImages />
          </WidgetFrame>

          {/* ISS Live Position */}
          <WidgetFrame
            title="ISS Live Position"
            description="The International Space Station orbits 420 km above Earth at 28,000 km/h, completing one orbit every 90 minutes. Track its position in real time."
            source="Open Notify"
            status="live"
          >
            <ISSLivePosition />
          </WidgetFrame>

          {/* European Radiation Map */}
          <WidgetFrame
            title="European Radiation"
            description="Real-time gamma dose rates from the European Radiological Data Exchange Platform — over 5,500 monitoring stations across Europe measuring background radiation."
            source="EURDEP"
            status="live"
          >
            <EuropeanRadiationMap />
          </WidgetFrame>

          {/* Glacier Watch */}
          <WidgetFrame
            title="Glacier Watch"
            description="Global glacier monitoring from the World Glacier Monitoring Service — tracking mass balance changes as Earth's ice responds to climate."
            source="WGMS"
            status="live"
          >
            <GlacierWatch />
          </WidgetFrame>

          {/* eBird Live */}
          <WidgetFrame
            title="eBird Live"
            description="Recent bird observations from the world's largest biodiversity citizen science project. What birds are being spotted near you right now?"
            source="Cornell Lab of Ornithology"
            status="live"
          >
            <EBirdLive />
          </WidgetFrame>

          {/* iNaturalist Live */}
          <WidgetFrame
            title="iNaturalist Live"
            description="Real-time nature observations from citizen scientists worldwide — every plant, insect, and animal being identified and recorded."
            source="iNaturalist"
            status="live"
          >
            <INaturalistLive />
          </WidgetFrame>

          {/* Ocean Hydrophones */}
          <WidgetFrame
            title="Ocean Hydrophones"
            description="Listen to the deep ocean — underwater microphones capturing whale songs, earthquakes, ship traffic, and the mysterious sounds of the abyss."
            source="Ocean Networks Canada / MBARI"
            status="live"
          >
            <OceanHydrophones />
          </WidgetFrame>

          {/* Seismograph Grid */}
          <WidgetFrame
            title="Seismograph Grid"
            description="Live seismic waveforms from monitoring stations worldwide. Watch the Earth breathe — continuous ground motion from microseisms, earthquakes, and human activity."
            source="IRIS Seismic Network"
            status="live"
          >
            <SeismographGrid />
          </WidgetFrame>

          {/* Magnetic Field */}
          <WidgetFrame
            title="Magnetic Field"
            description="Earth's magnetic field protects us from solar wind. Visualise real-time geomagnetic data showing field strength and disturbances."
            source="NOAA NCEI"
            status="live"
          >
            <MagneticField />
          </WidgetFrame>

          {/* Magnetic Field Strength */}
          <WidgetFrame
            title="Magnetic Field Strength"
            description="The magnetic field strength at your location — calculated from the World Magnetic Model. The field varies from ~25μT at the equator to ~65μT at the poles."
            source="NOAA WMM"
            status="ok"
          >
            <MagneticFieldStrength />
          </WidgetFrame>

          {/* Pollen Forecast */}
          <WidgetFrame
            title="Pollen Forecast"
            description="Current pollen levels at your location — tree, grass, and weed pollen counts affecting allergy sufferers."
            source="Pollen API"
            status="live"
          >
            <PollenForecast />
          </WidgetFrame>

          {/* Star Map */}
          <WidgetFrame
            title="Star Map"
            description="The night sky above you right now — stars, planets, and constellations visible from your location at this moment."
            source="Astronomical Calculation"
            status="ok"
          >
            <StarMap />
          </WidgetFrame>

          {/* Your Sky When Born */}
          <WidgetFrame
            title="Your Sky When Born"
            description="Enter your birth date and location to see exactly what stars and planets were overhead at the moment you arrived on Earth."
            source="Astronomical Calculation"
            status="ok"
          >
            <YourSkyWhenBorn />
          </WidgetFrame>

          {/* What's Below You */}
          <WidgetFrame
            title="What's Below You"
            description="Journey to the centre of the Earth — see the geological layers beneath your feet, from topsoil to the inner core 6,371 km down."
            source="Geological Data"
            status="ok"
          >
            <WhatsBelowYou />
          </WidgetFrame>

          {/* Your Air's Journey */}
          <WidgetFrame
            title="Your Air's Journey"
            description="Where has the air you're breathing been? Back-trajectory analysis shows the path of air masses arriving at your location over the past days."
            source="NOAA HYSPLIT Model"
            status="ok"
          >
            <YourAirJourney />
          </WidgetFrame>

          {/* Your Background Dose */}
          <WidgetFrame
            title="Your Background Dose"
            description="Calculate your personal annual radiation exposure — from cosmic rays, radon, medical scans, and the natural environment around you."
            source="Calculation based on UNSCEAR data"
            status="ok"
          >
            <YourBackgroundDose />
          </WidgetFrame>

          {/* Cosmic Rays Through You */}
          <WidgetFrame
            title="Cosmic Rays Through You"
            description="Right now, cosmic ray muons are passing through your body. Calculate how many based on your location, altitude, and the current solar activity."
            source="NMDB + Calculation"
            status="ok"
          >
            <CosmicRaysThrough />
          </WidgetFrame>

        </div>
      </div>

      {/* Mobile bottom padding for nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
