import ThePulse from '@/components/ThePulse'
import WidgetFrame from '@/components/WidgetFrame'
import SolarLive from '@/components/widgets/SolarLive'
// import DeepSeaLive from '@/components/widgets/DeepSeaLive'  // ARCHIVED
import SafariLive from '@/components/widgets/SafariLive'
import HimawariLive from '@/components/widgets/HimawariLive'
import StrangeAttractor from '@/components/widgets/StrangeAttractor'
import SpaceWeather from '@/components/widgets/SpaceWeather'
import UKEnergyNow from '@/components/widgets/UKEnergyNow'

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

        </div>
      </div>
    </>
  )
}
