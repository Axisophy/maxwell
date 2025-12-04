import TodayStrip from '@/components/TodayStrip'
import WidgetFrame from '@/components/WidgetFrame'
import SolarLive from '@/components/widgets/SolarLive'
import DeepSeaLive from '@/components/widgets/DeepSeaLive'
import HimawariLive from '@/components/widgets/HimawariLive'
import StrangeAttractor from '@/components/widgets/StrangeAttractor'

export default function Home() {
  return (
    <>
      <TodayStrip />
      
      <div className="px-12 lg:px-16 py-8">
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

          {/* Space Weather - Placeholder */}
          <WidgetFrame title="Space Weather" isLive timestamp="Updated 1m ago" aspectRatio="square">
            <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20">
              <span className="text-sm text-[var(--text-muted)]">NOAA SWPC Data</span>
            </div>
          </WidgetFrame>

          {/* Deep Sea Live - spans 2 columns on larger screens */}
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

          {/* UK Energy Now - Placeholder */}
          <WidgetFrame title="UK Energy Now" isLive timestamp="Updated 30s ago" aspectRatio="square">
            <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gradient-to-br from-green-900/20 to-emerald-900/20">
              <span className="text-sm text-[var(--text-muted)]">Carbon Intensity API</span>
            </div>
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