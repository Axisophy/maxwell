import ThePulse from '@/components/ThePulse'
import WidgetFrame from '@/components/WidgetFrame'
import SolarLive from '@/components/widgets/SolarLive'
// import DeepSeaLive from '@/components/widgets/DeepSeaLive'  // ARCHIVED
import SafariLive from '@/components/widgets/SafariLive'
import HimawariLive from '@/components/widgets/HimawariLive'
import StrangeAttractor from '@/components/widgets/StrangeAttractor'
import SpaceWeather from '@/components/widgets/SpaceWeather'
import UKEnergyNow from '@/components/widgets/UKEnergyNow'
import MoonPhase from '@/components/widgets/MoonPhase';
import ISSTracker from '@/components/widgets/ISSTracker';
import APOD from '@/components/widgets/APOD';
import CO2Now from '@/components/widgets/CO2Now';
import EarthquakesLive from '@/components/widgets/EarthquakesLive';
import LaunchCountdown from '@/components/widgets/LaunchCountdown';
import AuroraForecast from '@/components/widgets/AuroraForecast';
import NearEarthAsteroids from '@/components/widgets/NearEarthAsteroids';
import DSCOVREpic from '@/components/widgets/DSCOVREpic';
import AirQuality from '@/components/widgets/AirQuality';
import UKTides from '@/components/widgets/UKTides';
import WorldPopulation from '@/components/widgets/WorldPopulation';
import PendulumWave from '@/components/widgets/PendulumWave';
import NuclearReactors from '@/components/widgets/NuclearReactors';
import LightTravel from '@/components/widgets/LightTravel';
import ElementExplorer from '@/components/widgets/ElementExplorer';

export default function Home() {
  return (
    <>
      <ThePulse />
      
      <div className="px-8 lg:px-12 py-8">
        {/* Widget Grid - max 3 columns, responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          
          {/* Solar Live - square widget */}
          <WidgetFrame 
            title="Solar Live" 
            isLive 
            aspectRatio="square"
            info={{
              description: "Live imagery of the Sun from NASA's Solar Dynamics Observatory (SDO), a spacecraft launched in 2010 that observes the Sun continuously from geosynchronous orbit.",
              sources: [
                { name: "NASA Solar Dynamics Observatory", url: "https://sdo.gsfc.nasa.gov/" }
              ],
              controls: [
                { name: "AIA 193Å", description: "Extreme ultraviolet showing the solar corona at ~1.2 million K — reveals coronal loops and holes" },
                { name: "AIA 171Å", description: "Coronal loops at ~600,000 K — good for seeing magnetic field structures" },
                { name: "AIA 304Å", description: "Chromosphere at ~50,000 K — shows prominences and filaments" },
                { name: "AIA 131Å", description: "Flare plasma at ~10 million K — highlights the hottest material during solar flares" },
                { name: "HMI", description: "Visible light photosphere — the Sun's 'surface' showing sunspots" }
              ],
              notes: "Images update approximately every 15 minutes. Different wavelengths reveal different layers and temperatures of the solar atmosphere."
            }}
          >
            <SolarLive />
          </WidgetFrame>

          {/* Himawari-8 Pacific Disc */}
          <WidgetFrame 
            title="Pacific Disc" 
            isLive 
            aspectRatio="square"
            info={{
              description: "Full-disc view of Earth from Himawari-9, a Japanese geostationary weather satellite positioned at 140.7°E. The satellite captures a new image every 10 minutes, providing continuous coverage of the Asia-Pacific region.",
              sources: [
                { name: "NICT Science Cloud / Himawari Real-time Web", url: "https://himawari8.nict.go.jp/" },
                { name: "Japan Meteorological Agency (JMA)", url: "https://www.jma.go.jp/jma/jma-eng/satellite/index.html" }
              ],
              controls: [
                { name: "True Color", description: "RGB composite from visible bands, showing Earth as the human eye would see it" },
                { name: "Infrared", description: "Thermal infrared (10.4µm), showing heat radiation — useful for night viewing and cloud heights" },
                { name: "3h / 6h / 12h / 24h", description: "Animate the last N hours of imagery as a timelapse loop" }
              ],
              notes: "Images have approximately 30 minutes delay. Maintenance windows occur at 02:40 and 14:40 UTC daily."
            }}
          >
            <HimawariLive />
          </WidgetFrame>

          {/* Space Weather */}
          <WidgetFrame 
            title="Space Weather" 
            isLive 
            aspectRatio="square"
            info={{
              description: "Real-time space weather conditions from NOAA's Space Weather Prediction Center. Monitors solar activity and its effects on Earth's magnetosphere.",
              sources: [
                { name: "NOAA Space Weather Prediction Center", url: "https://www.swpc.noaa.gov/" }
              ],
              controls: [
                { name: "Kp Index", description: "Planetary geomagnetic activity index (0-9). Higher values indicate stronger geomagnetic storms and better aurora visibility." },
                { name: "Solar Wind", description: "Speed and density of the solar wind plasma flowing past Earth." },
                { name: "X-ray Flux", description: "Solar X-ray emission levels indicating flare activity." }
              ],
              notes: "Data updates every few minutes. Kp ≥5 indicates geomagnetic storm conditions with potential aurora visibility at lower latitudes."
            }}
          >
            <SpaceWeather />
          </WidgetFrame>

         {/* Deep Sea Live - ARCHIVED - kept for potential future use
          <WidgetFrame 
            title="Deep Sea Live" 
            isLive 
            className="lg:col-span-2" 
            aspectRatio="video"
            info={{
              description: "Live underwater camera feeds from aquariums and marine research stations. Watch fish, coral, and other marine life in real-time.",
              sources: [
                { name: "Aquarium of the Pacific", url: "https://www.aquariumofpacific.org/" }
              ],
              controls: [
                { name: "REEF", description: "Tropical reef exhibit — colourful coral fish and reef ecosystem" },
                { name: "CAVERN", description: "Blue Cavern exhibit — Southern California kelp forest habitat" }
              ],
              notes: "Stream availability depends on the source. Feeds may occasionally go offline for maintenance or technical issues."
            }}
          >
            <DeepSeaLive />
          </WidgetFrame>
*/}

          {/* UK Energy Now */}
          <WidgetFrame 
            title="UK Energy Now" 
            isLive 
            aspectRatio="square"
            info={{
              description: "Real-time electricity generation mix for Great Britain, showing how power is being generated right now across different fuel types.",
              sources: [
                { name: "National Grid ESO Carbon Intensity API", url: "https://carbonintensity.org.uk/" }
              ],
              controls: [
                { name: "Generation Mix", description: "Percentage breakdown of electricity by source: gas, wind, nuclear, solar, hydro, imports, biomass, and coal." },
                { name: "Carbon Intensity", description: "Grams of CO₂ emitted per kilowatt-hour of electricity. Lower is cleaner." }
              ],
              notes: "Data from National Grid ESO, updated every 30 minutes. Carbon intensity varies throughout the day based on demand and renewable availability."
            }}
          >
            <UKEnergyNow />
          </WidgetFrame>

          {/* Safari Live - African wildlife webcams */}
          <WidgetFrame 
            title="Safari Live" 
            isLive 
            aspectRatio="square"
            info={{
              description: "Live wildlife cameras from African research stations and game reserves. Watch elephants, hippos, giraffes, zebras, and other animals gather at watering holes in their natural habitat.",
              sources: [
                { name: "Mpala Research Centre", url: "https://www.mpalalive.org/" },
                { name: "Explore.org", url: "https://explore.org/livecams/african-wildlife" },
                { name: "Africam", url: "https://africam.com/" }
              ],
              controls: [
                { name: "Watering Hole", description: "Hippo pool at Mpala Research Centre, Laikipia, Kenya" },
                { name: "River", description: "Ewaso Ng'iro river view upstream from the watering hole" },
                { name: "Tau", description: "Tau waterhole at Madikwe Game Reserve, South Africa" }
              ],
              notes: "Best viewing at dawn and dusk (East African Time: UTC+3). Video IDs may need periodic updates as livestreams restart. Night feeds use infrared — expect monochrome footage after sunset."
            }}
          >
            <SafariLive />
          </WidgetFrame>

          {/* Strange Attractor - Braun T1000 inspired */}
          <WidgetFrame 
            title="Strange Attractor" 
            timestamp="Rössler System"
            aspectRatio="square"
            info={{
              description: "Interactive visualisation of the Rössler attractor, a chaotic system discovered by Otto Rössler in 1976. The system demonstrates deterministic chaos — simple equations producing infinitely complex, non-repeating trajectories.",
              sources: [
                { name: "Rössler, O.E. (1976) 'An Equation for Continuous Chaos'" }
              ],
              controls: [
                { name: "a, b, c knobs", description: "System parameters. Standard values: a=0.2, b=0.2, c=5.7. Drag up/down to adjust." },
                { name: "Projection", description: "View angle — 3D (rotating), XY, XZ, or YZ plane projections" },
                { name: "Zoom", description: "Camera distance" },
                { name: "Speed", description: "Rotation speed (3D mode only)" },
                { name: "Run/Stop", description: "Pause or resume the animation" }
              ],
              notes: "dx/dt = −y − z, dy/dt = x + ay, dz/dt = b + z(x − c). 50,000 points computed via Euler integration."
            }}
          >
            <StrangeAttractor />
          </WidgetFrame>

          {/* Moon Phase - Lunar cycle tracker */}
<WidgetFrame 
  title="Moon Phase" 
  aspectRatio="square"
  info={{
    description: "Real-time moon phase calculated from astronomical algorithms. Shows current illumination, phase name, and lunar age. Add your location for moonrise and moonset times.",
    sources: [
      { name: "Astronomical Algorithms", url: "https://en.wikipedia.org/wiki/Astronomical_Algorithms" },
      { name: "SunCalc Library", url: "https://github.com/mourner/suncalc" }
    ],
    controls: [
      { name: "Date Navigation", description: "Browse any date — the moon phase is calculated, not fetched" },
      { name: "Location", description: "Enable location for rise/set times specific to your position" }
    ],
    notes: "Pure calculation — no API required, works offline. Moon age counts days since the last new moon (synodic month ≈ 29.53 days). Next full/new moon predictions accurate to within a day."
  }}
>
  <MoonPhase />
</WidgetFrame>


{/* ISS Tracker - International Space Station position */}
<WidgetFrame 
  title="ISS Tracker" 
  isLive
  aspectRatio="square"
  info={{
    description: "Live position of the International Space Station as it orbits Earth at 27,600 km/h. Updates every 5 seconds. Also shows current crew members and which spacecraft they arrived on.",
    sources: [
      { name: "Open Notify API", url: "http://open-notify.org/" },
      { name: "NASA ISS Program", url: "https://www.nasa.gov/mission_pages/station/main/index.html" }
    ],
    controls: [
      { name: "World Map", description: "Simplified projection showing current position and recent ground track" },
      { name: "Crew List", description: "All humans currently in space, grouped by spacecraft" }
    ],
    notes: "The ISS completes one orbit every ~92 minutes, experiencing 16 sunrises per day. Ground track shifts westward with each orbit due to Earth's rotation. Altitude varies between 370–460 km depending on orbital adjustments."
  }}
>
  <ISSTracker />
</WidgetFrame>


{/* APOD - NASA Astronomy Picture of the Day */}
<WidgetFrame 
  title="Astronomy Picture of the Day" 
  aspectRatio="square"
  info={{
    description: "NASA's curated daily astronomy image with expert explanation. Running since June 16, 1995 — one of the internet's longest-running astronomy resources. Occasionally features video instead of images.",
    sources: [
      { name: "NASA APOD", url: "https://apod.nasa.gov/" },
      { name: "NASA API", url: "https://api.nasa.gov/" }
    ],
    controls: [
      { name: "Date Navigation", description: "Browse the full archive back to 1995" },
      { name: "Random", description: "Jump to a random date from nearly 30 years of images" },
      { name: "HD Link", description: "View full resolution image (when available)" }
    ],
    notes: "Images are selected by professional astronomers Robert Nemiroff and Jerry Bonnell. The archive contains over 10,000 images spanning amateur astrophotography, space telescopes, planetary missions, and cosmic phenomena."
  }}
>
  <APOD />
</WidgetFrame>


{/* CO2 Now - Atmospheric carbon dioxide */}
<WidgetFrame 
  title="CO₂ Now" 
  aspectRatio="square"
  info={{
    description: "Current atmospheric carbon dioxide concentration measured at Mauna Loa Observatory, Hawaii. The 'Keeling Curve' — continuous measurements since 1958 — is the longest continuous record of atmospheric CO₂.",
    sources: [
      { name: "NOAA Global Monitoring Lab", url: "https://gml.noaa.gov/ccgg/trends/" },
      { name: "Scripps CO₂ Program", url: "https://scrippsco2.ucsd.edu/" }
    ],
    controls: [
      { name: "Current Reading", description: "Latest monthly average in parts per million (ppm)" },
      { name: "Trend Sparkline", description: "12-month pattern showing seasonal variation" },
      { name: "Context Panel", description: "Explains what the number means and why it matters" }
    ],
    notes: "CO₂ levels cycle annually: rising in Northern Hemisphere winter (plants dormant), falling in summer (photosynthesis absorbs CO₂). Pre-industrial levels were ~280 ppm; current levels exceed anything in 800,000 years of ice core records."
  }}
>
  <CO2Now />
</WidgetFrame>

{/* Earthquakes Live - Global seismic activity */}
<WidgetFrame 
  title="Earthquakes" 
  isLive
  aspectRatio="square"
  info={{
    description: "Real-time global earthquake data from the USGS Earthquake Hazards Program. Filter by magnitude and time range to see seismic activity worldwide.",
    sources: [
      { name: "USGS Earthquake Hazards Program", url: "https://earthquake.usgs.gov/" },
      { name: "USGS API Documentation", url: "https://earthquake.usgs.gov/fdsnws/event/1/" }
    ],
    controls: [
      { name: "Time Range", description: "Filter by past hour, day, week, or month" },
      { name: "Magnitude", description: "Minimum magnitude threshold (M2.5+ to M6.5+)" },
      { name: "Map", description: "Click markers to see event details" }
    ],
    notes: "Earthquake data updates every 5 minutes. Magnitude colors: green (M3), yellow (M4), orange (M5), red (M6), dark red (M7+). Tsunami warnings shown where applicable."
  }}
>
  <EarthquakesLive />
</WidgetFrame>


{/* Launch Countdown - Next rocket launch */}
<WidgetFrame 
  title="Next Launch" 
  aspectRatio="square"
  info={{
    description: "Countdown to the next rocket launch worldwide. See mission details, rocket type, launch provider, and pad location. Updates automatically as launch windows change.",
    sources: [
      { name: "The Space Devs", url: "https://thespacedevs.com/" },
      { name: "Launch Library 2 API", url: "https://ll.thespacedevs.com/2.2.0/docs/" }
    ],
    controls: [
      { name: "Countdown", description: "Live countdown to NET (No Earlier Than) time" },
      { name: "Status", description: "Go for launch, TBD, TBC, Hold, etc." },
      { name: "Upcoming", description: "Click upcoming launches to see their details" }
    ],
    notes: "Launch times are NET (No Earlier Than) and may slip. Status updates in real-time. API has 15 requests/hour limit — data refreshes every 15 minutes."
  }}
>
  <LaunchCountdown />
</WidgetFrame>


{/* Aurora Forecast - Northern Lights prediction */}
<WidgetFrame 
  title="Aurora Forecast" 
  aspectRatio="square"
  info={{
    description: "Planetary geomagnetic activity (Kp index) and aurora viewing probability. The Kp index predicts how far south the aurora borealis will be visible.",
    sources: [
      { name: "NOAA Space Weather Prediction Center", url: "https://www.swpc.noaa.gov/" },
      { name: "NOAA Kp Index", url: "https://services.swpc.noaa.gov/products/" }
    ],
    controls: [
      { name: "Kp Gauge", description: "Current planetary geomagnetic activity (0-9 scale)" },
      { name: "Location Check", description: "Enable location to see if aurora is visible from your position" },
      { name: "24h Forecast", description: "Predicted Kp values for the next 24 hours" }
    ],
    notes: "Kp 5+ = minor storm (visible ~55° latitude). Kp 7+ = strong storm (visible ~50° latitude). Best viewing: clear skies, away from light pollution, 10pm–2am. Solar wind speed and density affect aurora intensity."
  }}
>
  <AuroraForecast />
</WidgetFrame>


{/* Near-Earth Asteroids - Close approaches */}
<WidgetFrame 
  title="Near-Earth Asteroids" 
  aspectRatio="square"
  info={{
    description: "Upcoming asteroid close approaches to Earth from NASA's Center for Near-Earth Object Studies. Shows distance in lunar distances (LD), estimated size, and velocity.",
    sources: [
      { name: "NASA JPL CNEOS", url: "https://cneos.jpl.nasa.gov/" },
      { name: "JPL Small-Body Database", url: "https://ssd.jpl.nasa.gov/" }
    ],
    controls: [
      { name: "Time Range", description: "View approaches for next 7, 30, or 90 days" },
      { name: "PHA Filter", description: "Show only Potentially Hazardous Asteroids" },
      { name: "Distance Scale", description: "Visual comparison to Moon's distance" }
    ],
    notes: "1 LD (Lunar Distance) = 384,400 km. PHA = Potentially Hazardous Asteroid (H < 22, close orbit). Size estimated from absolute magnitude assuming typical albedo. Red = closer than Moon, amber = within 5 LD."
  }}
>
  <NearEarthAsteroids />
</WidgetFrame>


{/* DSCOVR EPIC - Earth from L1 */}
<WidgetFrame 
  title="DSCOVR EPIC" 
  aspectRatio="square"
  info={{
    description: "Earth as seen from the DSCOVR spacecraft at the L1 Lagrange point, 1.5 million km from Earth. The camera always sees the sunlit side of our planet — the 'pale blue dot' from deep space.",
    sources: [
      { name: "NASA DSCOVR Mission", url: "https://www.nesdis.noaa.gov/current-satellite-missions/currently-flying/dscovr-deep-space-climate-observatory" },
      { name: "EPIC API", url: "https://epic.gsfc.nasa.gov/about/api" }
    ],
    controls: [
      { name: "Natural/Enhanced", description: "True color or enhanced vegetation/ocean contrast" },
      { name: "Image Navigation", description: "Multiple images captured each day as Earth rotates" },
      { name: "Date Navigation", description: "Browse the archive (typically 1-2 day delay)" }
    ],
    notes: "DSCOVR orbits L1 where Earth and Sun gravity balance. From this vantage point, it always sees Earth fully lit. Centroid coordinates show which part of Earth faces the camera. Images taken every 1-2 hours."
  }}
>
  <DSCOVREpic />
</WidgetFrame>


{/* Air Quality - UK focused */}
<WidgetFrame 
  title="Air Quality" 
  aspectRatio="square"
  info={{
    description: "Real-time air quality index and pollutant levels. Shows AQI, PM2.5, PM10, NO₂, and O₃ with WHO guideline comparisons and health recommendations.",
    sources: [
      { name: "OpenAQ", url: "https://openaq.org/" },
      { name: "WHO Air Quality Guidelines", url: "https://www.who.int/news-room/feature-stories/detail/what-are-the-who-air-quality-guidelines" }
    ],
    controls: [
      { name: "City Selection", description: "Choose from UK cities or use your location" },
      { name: "AQI Gauge", description: "Overall air quality index based on PM2.5" },
      { name: "Pollutant Bars", description: "Individual pollutants vs WHO guidelines" }
    ],
    notes: "AQI calculated from PM2.5 using US EPA scale. Black markers show WHO annual guidelines. Red values exceed safe levels. Good = 0-50, Moderate = 51-100, Unhealthy for Sensitive = 101-150."
  }}
>
  <AirQuality />
</WidgetFrame>


{/* UK Tides - Coastal tide predictions */}
<WidgetFrame 
  title="UK Tides" 
  aspectRatio="square"
  info={{
    description: "Tide times and heights for UK coastal locations. Shows current tide state (rising/falling), today's high and low tides, and a 24-hour tide curve.",
    sources: [
      { name: "Simplified harmonic calculation", url: "#" },
      { name: "For official data: UKHO Admiralty", url: "https://www.admiralty.co.uk/ukho/Pages/Easytide.aspx" }
    ],
    controls: [
      { name: "Location", description: "Select from UK coastal locations" },
      { name: "Tide Curve", description: "24-hour visualization with current time marker" },
      { name: "Events", description: "Today's high and low tide times and heights" }
    ],
    notes: "⚠️ Approximate predictions only — do not use for navigation. Based on simplified lunar harmonics. Real tides affected by weather, atmospheric pressure, and complex coastal geometry. Check official sources for safety-critical decisions."
  }}
>
  <UKTides />
</WidgetFrame>

{/* World Population - Live counter */}
<WidgetFrame 
  title="World Population" 
  isLive
  aspectRatio="square"
  info={{
    description: "Estimated world population updating in real-time based on UN World Population Prospects birth and death rates. Watch humanity grow by ~2.5 people every second.",
    sources: [
      { name: "UN World Population Prospects", url: "https://population.un.org/wpp/" },
      { name: "Worldometer (methodology)", url: "https://www.worldometers.info/world-population/" }
    ],
    controls: [
      { name: "Live Counter", description: "Estimated current population extrapolated from UN data" },
      { name: "Birth/Death Rates", description: "Per-second rates driving population change" },
      { name: "Milestones", description: "Historical billion-person milestones" }
    ],
    notes: "Based on UN 2024 estimates: ~140M births/year, ~60M deaths/year, ~80M net growth. Counter is an estimate — actual population unknowable in real-time. 8 billion reached November 2022."
  }}
>
  <WorldPopulation />
</WidgetFrame>


{/* Nuclear Reactors - Global statistics */}
<WidgetFrame 
  title="Nuclear Reactors" 
  aspectRatio="square"
  info={{
    description: "Global nuclear power reactor statistics from the IAEA Power Reactor Information System. Operating reactors, construction pipeline, and electricity generation by country.",
    sources: [
      { name: "IAEA PRIS", url: "https://pris.iaea.org/PRIS/home.aspx" },
      { name: "World Nuclear Association", url: "https://world-nuclear.org/" }
    ],
    controls: [
      { name: "Global Stats", description: "Total operating reactors and capacity worldwide" },
      { name: "Country Breakdown", description: "Reactors and nuclear share by country" },
      { name: "Construction", description: "Reactors currently under construction" }
    ],
    notes: "Data snapshot from IAEA PRIS. ~440 operating reactors worldwide generating ~10% of global electricity. France leads in nuclear share (~65%), China leads in new construction."
  }}
>
  <NuclearReactors />
</WidgetFrame>


{/* Element Explorer - Periodic table */}
<WidgetFrame 
  title="Element Explorer" 
  aspectRatio="square"
  info={{
    description: "Explore the periodic table one element at a time. See atomic properties, electron configuration, discovery history, and physical characteristics for each element.",
    sources: [
      { name: "IUPAC Periodic Table", url: "https://iupac.org/what-we-do/periodic-table-of-elements/" },
      { name: "PubChem", url: "https://pubchem.ncbi.nlm.nih.gov/periodic-table/" }
    ],
    controls: [
      { name: "Random Element", description: "Discover a random element from the 118" },
      { name: "Element of the Day", description: "Featured element based on date" },
      { name: "Properties", description: "Atomic mass, phase, density, melting/boiling points" }
    ],
    notes: "118 confirmed elements. Categories include alkali metals, noble gases, transition metals, lanthanides, actinides, and more. Elements 113-118 were confirmed 2016."
  }}
>
  <ElementExplorer />
</WidgetFrame>


{/* Light Travel - Distance calculator */}
<WidgetFrame 
  title="Light Travel" 
  aspectRatio="square"
  info={{
    description: "Watch how far light travels in real-time. Since you opened this widget, light has journeyed incredible distances — compare to cosmic landmarks like the Moon, Sun, and nearest stars.",
    sources: [
      { name: "Speed of Light (NIST)", url: "https://physics.nist.gov/cgi-bin/cuu/Value?c" }
    ],
    controls: [
      { name: "Distance Counter", description: "Real-time distance light has traveled this session" },
      { name: "Landmarks", description: "Compare to distances: Moon, Sun, Proxima Centauri" },
      { name: "Unit Toggle", description: "View in km, AU, or light-seconds" }
    ],
    notes: "Speed of light: 299,792,458 m/s (exact, by definition). Light reaches the Moon in ~1.3 seconds, the Sun in ~8.3 minutes, Proxima Centauri in ~4.2 years."
  }}
>
  <LightTravel />
</WidgetFrame>


{/* Pendulum Wave - Physics simulation */}
<WidgetFrame 
  title="Pendulum Wave" 
  aspectRatio="square"
  info={{
    description: "A mesmerising physics demonstration: pendulums of slightly different lengths create evolving wave patterns as they drift in and out of phase over a complete cycle.",
    sources: [
      { name: "Harvard Natural Sciences", url: "https://sciencedemonstrations.fas.harvard.edu/presentations/pendulum-waves" }
    ],
    controls: [
      { name: "Play/Pause", description: "Control the simulation" },
      { name: "Pendulum Count", description: "Adjust number of pendulums (typically 15-20)" },
      { name: "Speed", description: "Simulation speed multiplier" }
    ],
    notes: "Each pendulum has a slightly different period. They start aligned, form traveling waves, chaos, standing waves, then realign — a complete cycle takes ~60 seconds at normal speed."
  }}
>
  <PendulumWave />
</WidgetFrame>




        </div>
      </div>
    </>
  )
}
