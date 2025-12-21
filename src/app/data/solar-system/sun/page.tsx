'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'

// =============================================================================
// THE SUN
// =============================================================================
// Visual approach: Orange/yellow warm palette, SDO + SOHO imagery integration
// Template: Text + Media (content-rich page with hero image)
// =============================================================================

// SDO Wavelengths - matches SolarLive widget
const SDO_WAVELENGTHS = {
  '0193': { label: 'AIA 193Å', description: 'Corona at 1.2 million K', color: '#ff9500' },
  '0171': { label: 'AIA 171Å', description: 'Corona at 600,000 K', color: '#ffcc00' },
  '0304': { label: 'AIA 304Å', description: 'Chromosphere at 50,000 K', color: '#ff3b30' },
  '0131': { label: 'AIA 131Å', description: 'Flare plasma at 10 million K', color: '#00bcd4' },
  'HMIIC': { label: 'HMI', description: 'Visible light surface', color: '#8e8e93' },
} as const

type WavelengthKey = keyof typeof SDO_WAVELENGTHS

// SOHO Coronagraph views
const CORONAGRAPH_VIEWS = {
  'C2': { label: 'C2', description: 'Inner corona', range: '2-6 solar radii' },
  'C3': { label: 'C3', description: 'Outer corona', range: '3.7-30 solar radii' },
} as const

type CoronagraphKey = keyof typeof CORONAGRAPH_VIEWS

// Key data
const sunData = {
  name: 'The Sun',
  subtitle: 'Our Star',
  type: 'G-type main-sequence star (G2V)',
  
  diameter: { value: '1,392,700', unit: 'km', comparison: '109× Earth' },
  mass: { value: '1.989 × 10³⁰', unit: 'kg', comparison: '333,000× Earth' },
  coreTemp: { value: '~15,000,000', unit: '°C' },
  surfaceTemp: { value: '~5,500', unit: '°C' },
  age: { value: '4.6', unit: 'billion years' },
  rotationEquator: { value: '25.05', unit: 'days' },
  
  // Composition
  hydrogen: 73.46,
  helium: 24.85,
  oxygen: 0.77,
  carbon: 0.29,
  iron: 0.16,
  other: 0.47,
}

// Solar layers
const solarLayers = [
  { name: 'Core', depth: '0-0.2 R☉', temp: '15 million °C', description: 'Where nuclear fusion occurs. Hydrogen fuses into helium, releasing energy.' },
  { name: 'Radiative Zone', depth: '0.2-0.7 R☉', temp: '7-2 million °C', description: 'Energy moves outward via radiation. Photons bounce randomly, taking ~170,000 years to cross.' },
  { name: 'Convective Zone', depth: '0.7-1.0 R☉', temp: '2 million-5,500 °C', description: 'Hot plasma rises, cools, and sinks in giant convection cells. Takes about a week to cross.' },
  { name: 'Photosphere', depth: 'Surface', temp: '5,500 °C', description: 'The visible surface. Only 500 km thick. Where sunspots and granulation are visible.' },
  { name: 'Chromosphere', depth: '0-2,000 km above', temp: '4,000-25,000 °C', description: 'Lower atmosphere. Visible during eclipses as a reddish glow. Home to spicules and prominences.' },
  { name: 'Corona', depth: 'Extends millions of km', temp: '1-3 million °C', description: 'Outer atmosphere. Mysteriously hotter than the surface. Visible during total eclipses.' },
]

// Space missions
const missions = [
  { name: 'Pioneer 5-9', years: '1959-1968', status: 'Complete', description: 'First solar observation satellites' },
  { name: 'Helios 1 & 2', years: '1974-1985', status: 'Complete', description: 'Closest approach 0.29 AU' },
  { name: 'SOHO', years: '1995-present', status: 'Active', description: 'Solar and Heliospheric Observatory at L1' },
  { name: 'STEREO', years: '2006-present', status: 'Active', description: 'Twin spacecraft for 3D solar imaging' },
  { name: 'SDO', years: '2010-present', status: 'Active', description: 'Solar Dynamics Observatory — high-res imaging' },
  { name: 'Parker Solar Probe', years: '2018-present', status: 'Active', description: 'Will approach within 6.2 million km' },
  { name: 'Solar Orbiter', years: '2020-present', status: 'Active', description: 'ESA/NASA mission to study solar poles' },
]

export default function SunPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-6 md:pt-8 lg:pt-12 pb-16 md:pb-20 lg:pb-24">
        
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Data', href: '/data' },
            { label: 'Solar System', href: '/data/solar-system' },
            { label: 'Sun' },
          ]}
        />

        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-2">
            {sunData.name}
          </h1>
          <p className="text-xl md:text-2xl text-black/60 font-light">
            {sunData.subtitle}
          </p>
          <p className="text-sm text-black/40 mt-2 font-mono">
            {sunData.type}
          </p>
        </header>

        {/* Live Imagery Section - SDO + SOHO side by side */}
        <section className="mb-8 md:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <SDOViewer />
            <SOHOCoronagraph />
          </div>
        </section>

        {/* Key Facts Grid */}
        <section className="mb-8 md:mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            <FactCard label="Diameter" value={sunData.diameter.value} unit={sunData.diameter.unit} comparison={sunData.diameter.comparison} />
            <FactCard label="Mass" value={sunData.mass.value} unit={sunData.mass.unit} comparison={sunData.mass.comparison} />
            <FactCard label="Core Temperature" value={sunData.coreTemp.value} unit={sunData.coreTemp.unit} />
            <FactCard label="Surface Temperature" value={sunData.surfaceTemp.value} unit={sunData.surfaceTemp.unit} />
            <FactCard label="Age" value={sunData.age.value} unit={sunData.age.unit} />
            <FactCard label="Rotation (Equator)" value={sunData.rotationEquator.value} unit={sunData.rotationEquator.unit} />
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            
            {/* Overview */}
            <ContentSection title="Overview">
              <p className="text-black/80 leading-relaxed mb-4">
                The Sun is the star at the center of our Solar System. It's a nearly perfect 
                sphere of hot plasma, generating energy through nuclear fusion in its core. 
                This energy, released as light and heat, makes life on Earth possible.
              </p>
              <p className="text-black/80 leading-relaxed mb-4">
                Despite being an ordinary G-type main-sequence star, the Sun contains 99.86% 
                of the total mass of the Solar System. Its gravitational influence extends 
                far beyond the planets, reaching to the hypothetical Oort Cloud at the edge 
                of interstellar space.
              </p>
              <p className="text-black/80 leading-relaxed">
                The Sun formed approximately 4.6 billion years ago from the gravitational 
                collapse of a region within a large molecular cloud. It has enough hydrogen 
                fuel to continue burning for another 5 billion years, after which it will 
                expand into a red giant before eventually shedding its outer layers and 
                becoming a white dwarf.
              </p>
            </ContentSection>

            {/* Structure */}
            <ContentSection title="Structure">
              <p className="text-black/80 leading-relaxed mb-6">
                The Sun has a layered structure, with energy generated in the core 
                gradually making its way outward through radiation and convection.
              </p>
              <div className="space-y-4">
                {solarLayers.map((layer, i) => (
                  <div key={layer.name} className="flex gap-4 p-4 bg-[#f5f5f5] rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-sm font-medium">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                        <h4 className="font-medium text-black">{layer.name}</h4>
                        <span className="text-xs font-mono text-black/40">{layer.depth}</span>
                        <span className="text-xs font-mono text-orange-600">{layer.temp}</span>
                      </div>
                      <p className="text-sm text-black/60">{layer.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ContentSection>

            {/* Solar Activity */}
            <ContentSection title="Solar Activity">
              <p className="text-black/80 leading-relaxed mb-4">
                The Sun is far from static. Its surface and atmosphere display constant 
                activity driven by complex magnetic field interactions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <ActivityCard title="Sunspots" description="Cooler, darker regions on the photosphere caused by magnetic field concentrations. They follow an 11-year cycle." />
                <ActivityCard title="Solar Flares" description="Sudden bursts of radiation from magnetic energy release. Can affect radio communications on Earth." />
                <ActivityCard title="Coronal Mass Ejections" description="Massive expulsions of plasma and magnetic field. Can trigger geomagnetic storms and auroras." />
                <ActivityCard title="Solar Wind" description="Continuous stream of charged particles flowing outward at 400-800 km/s. Creates the heliosphere." />
              </div>

              <p className="text-black/80 leading-relaxed">
                The <strong>11-year solar cycle</strong> sees the Sun oscillate between 
                solar minimum (few sunspots) and solar maximum (many sunspots). At maximum, 
                the Sun's magnetic poles flip. We're currently in Solar Cycle 25, 
                with maximum expected around 2025.
              </p>
            </ContentSection>

            {/* Exploration */}
            <ContentSection title="Exploration">
              <p className="text-black/80 leading-relaxed mb-6">
                Humans have been observing the Sun for millennia, but space-based observation 
                began in the 1960s. Today, a fleet of spacecraft monitors our star continuously.
              </p>
              <div className="space-y-3">
                {missions.map((mission) => (
                  <div key={mission.name} className="flex items-start gap-4 p-3 bg-[#f5f5f5] rounded-lg">
                    <div className="flex-shrink-0">
                      <span className={`inline-block w-2 h-2 rounded-full mt-2 ${mission.status === 'Active' ? 'bg-green-500' : 'bg-black/20'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h4 className="font-medium text-black">{mission.name}</h4>
                        <span className="text-xs font-mono text-black/40">{mission.years}</span>
                      </div>
                      <p className="text-sm text-black/60">{mission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ContentSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Composition */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
                Composition
              </h3>
              <div className="space-y-3">
                <CompositionBar label="Hydrogen" value={sunData.hydrogen} color="bg-yellow-400" />
                <CompositionBar label="Helium" value={sunData.helium} color="bg-orange-400" />
                <CompositionBar label="Oxygen" value={sunData.oxygen} color="bg-blue-400" />
                <CompositionBar label="Carbon" value={sunData.carbon} color="bg-gray-600" />
                <CompositionBar label="Iron" value={sunData.iron} color="bg-red-600" />
                <CompositionBar label="Other" value={sunData.other} color="bg-purple-400" />
              </div>
              <p className="text-xs text-black/40 mt-4">
                By mass. The Sun is ~91% hydrogen by number of atoms.
              </p>
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
                More Facts
              </h3>
              <div className="space-y-3 text-sm">
                <QuickFact label="Light travel time to Earth" value="8 min 20 sec" />
                <QuickFact label="Energy output" value="3.8 × 10²⁶ watts" />
                <QuickFact label="Galactic orbit" value="225-250 million years" />
                <QuickFact label="Distance from galactic center" value="26,000 light-years" />
                <QuickFact label="Spectral class" value="G2V" />
                <QuickFact label="Absolute magnitude" value="+4.83" />
              </div>
            </div>

            {/* Related */}
            <div className="bg-[#e5e5e5] rounded-xl p-5">
              <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
                Related
              </h3>
              <div className="space-y-2">
                <RelatedLink href="/observe/your-dashboard" label="Solar Live Widget" />
                <RelatedLink href="/data/solar-system" label="Solar System Overview" />
                <RelatedLink href="/data/solar-system/earth" label="Earth" />
                <RelatedLink href="/data/spectrum" label="Electromagnetic Spectrum" />
                <RelatedLink href="/data/particles" label="Standard Model" />
              </div>
            </div>

            {/* Data Sources */}
            <div className="bg-[#e5e5e5] rounded-xl p-5">
              <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
                Data Sources
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/50">SDO Imagery</span>
                  <span className="text-black">NASA SDO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Coronagraph</span>
                  <span className="text-black">NASA/ESA SOHO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Physical data</span>
                  <span className="text-black">NASA Planetary Factsheet</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-12 pt-8 border-t border-black/10">
          <div className="flex items-center justify-between">
            <Link href="/data/solar-system" className="flex items-center gap-2 text-black/50 hover:text-black transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Solar System</span>
            </Link>
            <Link href="/data/solar-system/mercury" className="flex items-center gap-2 text-black/50 hover:text-black transition-colors">
              <span>Mercury</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </nav>
      </div>
    </main>
  )
}

// =============================================================================
// SDO Solar Viewer Component - Square format with wavelength controls
// =============================================================================

function SDOViewer() {
  const [wavelength, setWavelength] = useState<WavelengthKey>('0193')
  const [isLoading, setIsLoading] = useState(true)
  const [imageKey, setImageKey] = useState(0)

  // NASA SDO direct URLs - same as SolarLive widget
  const imageUrl = `https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_${wavelength}.jpg`
  const currentWavelength = SDO_WAVELENGTHS[wavelength]

  const handleRefresh = () => {
    setIsLoading(true)
    setImageKey(prev => prev + 1)
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#e5e5e5] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-black">Solar Dynamics Observatory</h3>
          <p className="text-xs text-black/50">Live imagery • Updates every 15 minutes</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
          title="Refresh image"
        >
          <RefreshCw className={`w-4 h-4 text-black/40 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Image - Square format, shows full solar disk */}
      <div className="relative aspect-square bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-white/50 text-sm font-mono">Loading...</div>
          </div>
        )}
        <img
          key={imageKey}
          src={`${imageUrl}?t=${imageKey}`}
          alt={`Sun at ${currentWavelength.label}`}
          className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
        
        {/* Wavelength indicator overlay */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-xs font-mono text-white/80">{currentWavelength.label}</span>
        </div>

        {/* Live indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-mono text-white/60">LIVE</span>
        </div>
      </div>

      {/* Wavelength selector */}
      <div className="p-3 border-t border-[#e5e5e5]">
        <div className="flex bg-[#e5e5e5] rounded-lg p-1">
          {(Object.keys(SDO_WAVELENGTHS) as WavelengthKey[]).map((key) => (
            <button
              key={key}
              onClick={() => { setWavelength(key); setIsLoading(true) }}
              className={`
                flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors
                ${wavelength === key 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-black/50 hover:text-black'
                }
              `}
            >
              {SDO_WAVELENGTHS[key].label}
            </button>
          ))}
        </div>
        <p className="text-xs text-black/50 text-center mt-2">
          {currentWavelength.description}
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// SOHO Coronagraph Component - Square format with C2/C3 toggle
// =============================================================================

function SOHOCoronagraph() {
  const [view, setView] = useState<CoronagraphKey>('C2')
  const [isLoading, setIsLoading] = useState(true)
  const [imageKey, setImageKey] = useState(0)

  // SOHO LASCO direct URLs - same as SOHOCoronagraph widget
  const coronagraphUrls = {
    C2: 'https://soho.nascom.nasa.gov/data/realtime/c2/512/latest.jpg',
    C3: 'https://soho.nascom.nasa.gov/data/realtime/c3/512/latest.jpg',
  }

  const imageUrl = coronagraphUrls[view]
  const currentView = CORONAGRAPH_VIEWS[view]

  const handleRefresh = () => {
    setIsLoading(true)
    setImageKey(prev => prev + 1)
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#e5e5e5] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-black">SOHO Coronagraph</h3>
          <p className="text-xs text-black/50">Corona via artificial eclipse • Updates every 30 mins</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
          title="Refresh image"
        >
          <RefreshCw className={`w-4 h-4 text-black/40 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Image - Square format, shows full coronagraph */}
      <div className="relative aspect-square bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-white/50 text-sm font-mono">Loading corona...</div>
          </div>
        )}
        <img
          key={`${view}-${imageKey}`}
          src={`${imageUrl}?t=${imageKey}`}
          alt={`SOHO LASCO ${view} Coronagraph`}
          className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
        
        {/* LASCO label */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-xs font-mono text-white/80">LASCO {view}</span>
        </div>
        
        {/* Sun size indicator */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
          <div className="w-2 h-2 rounded-full bg-white/70 border border-white/30" />
          <span className="text-xs font-mono text-white/60">Sun size</span>
        </div>

        {/* Live indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-mono text-white/60">LIVE</span>
        </div>
      </div>

      {/* View selector */}
      <div className="p-3 border-t border-[#e5e5e5]">
        <div className="flex bg-[#e5e5e5] rounded-lg p-1">
          {(Object.keys(CORONAGRAPH_VIEWS) as CoronagraphKey[]).map((key) => (
            <button
              key={key}
              onClick={() => { setView(key); setIsLoading(true) }}
              className={`
                flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors
                ${view === key 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-black/50 hover:text-black'
                }
              `}
            >
              {key}
              <span className="ml-1 font-normal opacity-60">
                {CORONAGRAPH_VIEWS[key].description}
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-black/50 text-center mt-2">
          Viewing {currentView.range} from the Sun
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// Shared Components
// =============================================================================

function FactCard({ label, value, unit, comparison }: { label: string; value: string; unit: string; comparison?: string }) {
  return (
    <div className="bg-white rounded-xl p-4">
      <p className="text-xs font-medium text-black/40 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg md:text-xl font-mono font-medium text-black">{value}</p>
      <p className="text-xs font-mono text-black/50">{unit}</p>
      {comparison && <p className="text-xs text-black/40 mt-1">{comparison}</p>}
    </div>
  )
}

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl p-5 md:p-6">
      <h2 className="text-lg md:text-xl font-light text-black mb-4">{title}</h2>
      {children}
    </section>
  )
}

function ActivityCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 bg-[#f5f5f5] rounded-lg">
      <h4 className="font-medium text-black mb-1">{title}</h4>
      <p className="text-sm text-black/60">{description}</p>
    </div>
  )
}

function CompositionBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-black/60">{label}</span>
        <span className="font-mono text-black">{value}%</span>
      </div>
      <div className="h-2 bg-[#f5f5f5] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  )
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-black/50">{label}</span>
      <span className="font-mono text-black text-right">{value}</span>
    </div>
  )
}

function RelatedLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block text-sm text-black/60 hover:text-black transition-colors">
      {label} →
    </Link>
  )
}