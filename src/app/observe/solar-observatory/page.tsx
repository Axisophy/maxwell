import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import StatusBar from '@/components/observe/solar-observatory/StatusBar'
import SDOViewer from '@/components/observe/solar-observatory/SDOViewer'
import SOHOViewer from '@/components/observe/solar-observatory/SOHOViewer'
import STEREOViewer from '@/components/observe/solar-observatory/STEREOViewer'
import XRayFluxMonitor from '@/components/observe/solar-observatory/XRayFluxMonitor'
import SolarWindMonitor from '@/components/observe/solar-observatory/SolarWindMonitor'
import GeomagActivity from '@/components/observe/solar-observatory/GeomagActivity'
import ProtonFluxIndicator from '@/components/observe/solar-observatory/ProtonFluxIndicator'
import AuroraOval from '@/components/observe/solar-observatory/AuroraOval'
import SolarCyclePosition from '@/components/observe/solar-observatory/SolarCyclePosition'

export const metadata: Metadata = {
  title: 'Solar Observatory | MXWLL',
  description: 'Live solar observation from multiple spacecraft. Real-time imagery from NASA SDO, SOHO, and STEREO-A. Space weather monitoring including X-ray flux, solar wind, and geomagnetic activity.',
}

export default function SolarObservatoryPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: 'MXWLL', href: '/' },
              { label: 'Observe', href: '/observe' },
              { label: 'Solar Observatory' },
            ]}
            theme="dark"
            className="mb-2"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-3">
            Solar Observatory
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl">
            Live observation of our star from multiple spacecraft. Real-time imagery and space weather monitoring.
          </p>
        </div>

        {/* Status Bar */}
        <StatusBar className="mb-8" />

        {/* ===== PRIMARY VIEWERS ===== */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Solar Disk
          </h2>
          
          {/* SDO - Primary viewer */}
          <div className="mb-6">
            <SDOViewer size="large" />
          </div>

          {/* STEREO-A - Different angle */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <STEREOViewer />
            <div className="bg-[#0f0f14] rounded-xl p-6 flex flex-col justify-center">
              <h3 className="text-lg font-medium text-white mb-3">Why Two Views?</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                SDO orbits Earth, showing us the Sun-facing side. STEREO-A orbits the Sun 
                slightly faster, gradually moving ahead of Earth. This unique vantage point 
                lets us see coronal mass ejections (CMEs) heading toward us before they&apos;re 
                visible from Earth.
              </p>
              <p className="text-sm text-white/60 leading-relaxed">
                When STEREO-A&apos;s EUVI shows activity on the left limb of the Sun, that 
                region will rotate to face Earth in the coming days — giving us advance 
                warning of potentially geoeffective active regions.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CORONAGRAPHS ===== */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Coronagraphs
          </h2>
          <p className="text-sm text-white/50 mb-4 max-w-2xl">
            These instruments block the bright solar disk to reveal the faint outer corona. 
            Essential for detecting CMEs heading into space.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SOHOViewer instrument="c2" />
            <SOHOViewer instrument="c3" />
          </div>
        </section>

        {/* ===== SPACE WEATHER ===== */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Space Weather
          </h2>
          <p className="text-sm text-white/50 mb-4 max-w-2xl">
            Real-time conditions in the Sun-Earth environment. Solar wind measurements from 
            DSCOVR at L1 provide 15-60 minutes warning before impacts reach Earth.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* X-Ray Flux - flare detection */}
            <XRayFluxMonitor className="lg:col-span-2 lg:row-span-2" />
            
            {/* Solar Wind - from DSCOVR */}
            <SolarWindMonitor className="lg:col-span-2 lg:row-span-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Geomagnetic Activity - Kp index */}
            <GeomagActivity />
            
            {/* Proton Flux - radiation storms */}
            <ProtonFluxIndicator />
          </div>
        </section>

        {/* ===== AURORA FORECAST ===== */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider">
              Aurora Forecast
            </h2>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-mono rounded">
              OVATION PRIME
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuroraOval />
            <div className="bg-[#0f0f14] rounded-xl p-5 flex flex-col justify-center">
              <h3 className="text-sm font-medium text-white mb-3">Aurora Visibility</h3>
              <p className="text-xs text-white/50 leading-relaxed mb-3">
                The OVATION Prime model predicts aurora probability based on current
                solar wind conditions measured at L1. Brighter areas indicate higher
                chances of visible aurora.
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                Aurora is most visible during local night, away from light pollution,
                when the Kp index is elevated. The auroral oval expands toward lower
                latitudes during geomagnetic storms.
              </p>
            </div>
          </div>
        </section>

        {/* ===== SOLAR CYCLE POSITION ===== */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider">
              Solar Cycle 25
            </h2>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-mono rounded">
              CYCLE POSITION
            </span>
          </div>
          
          <SolarCyclePosition />
        </section>

        {/* ===== CONTEXT: UNDERSTANDING THE DATA ===== */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Understanding Solar Activity
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Solar Flares */}
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <h3 className="text-sm font-medium text-white">Solar Flares</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Sudden releases of magnetic energy, classified A through X. 
                X-class flares are the strongest. They cause immediate radio 
                blackouts and can trigger radiation storms within minutes.
              </p>
            </div>

            {/* CMEs */}
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <h3 className="text-sm font-medium text-white">CMEs</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Coronal mass ejections are billion-ton clouds of magnetized plasma. 
                They travel at 250-3000 km/s and take 1-4 days to reach Earth. 
                The coronagraphs above show CMEs leaving the Sun.
              </p>
            </div>

            {/* Geomagnetic Storms */}
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <h3 className="text-sm font-medium text-white">Geomagnetic Storms</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                When CMEs or fast solar wind impact Earth&apos;s magnetosphere. 
                The Kp index measures this disturbance. Higher Kp means aurora 
                visible at lower latitudes and possible technology disruptions.
              </p>
            </div>
          </div>
        </section>

        {/* ===== MISSIONS ===== */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Active Missions
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-4">
              <h3 className="text-sm font-medium text-white mb-1">SDO</h3>
              <p className="text-xs text-white/40 mb-2">Solar Dynamics Observatory</p>
              <p className="text-[10px] text-white/30">Launched 2010 • NASA</p>
            </div>
            
            <div className="bg-[#0f0f14] rounded-xl p-4">
              <h3 className="text-sm font-medium text-white mb-1">SOHO</h3>
              <p className="text-xs text-white/40 mb-2">Solar & Heliospheric Observatory</p>
              <p className="text-[10px] text-white/30">Launched 1995 • ESA/NASA</p>
            </div>
            
            <div className="bg-[#0f0f14] rounded-xl p-4">
              <h3 className="text-sm font-medium text-white mb-1">STEREO-A</h3>
              <p className="text-xs text-white/40 mb-2">Solar Terrestrial Relations</p>
              <p className="text-[10px] text-white/30">Launched 2006 • NASA</p>
            </div>
            
            <div className="bg-[#0f0f14] rounded-xl p-4">
              <h3 className="text-sm font-medium text-white mb-1">DSCOVR</h3>
              <p className="text-xs text-white/40 mb-2">Deep Space Climate Observatory</p>
              <p className="text-[10px] text-white/30">Launched 2015 • NOAA</p>
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/data/solar-system/sun"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Learn more about the Sun →
            </Link>
            <Link
              href="/observe"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Back to Observe
            </Link>
          </div>

          {/* Data Sources */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/30 mb-3">Data Sources</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/40">
              <div>
                <p className="text-white/60 mb-1">Solar Imagery</p>
                <p>NASA SDO (AIA)</p>
                <p>SOHO LASCO</p>
                <p>STEREO SECCHI</p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Space Weather</p>
                <p>NOAA SWPC</p>
                <p>GOES X-ray</p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Solar Wind</p>
                <p>DSCOVR @ L1</p>
                <p>ACE (backup)</p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Geomagnetic</p>
                <p>Planetary K Index</p>
                <p>NOAA Scales</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/20">
              Data updates: SDO ~15 min • SOHO ~30 min • STEREO daily • Space weather ~1 min
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
