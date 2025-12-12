'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Radio, Wifi, Sun, Eye, Zap, Activity, 
  Smartphone, Satellite, Camera, Thermometer,
  ChevronLeft, ChevronRight, Info, X
} from 'lucide-react'

// ===========================================
// ELECTROMAGNETIC SPECTRUM PAGE
// ===========================================
// Interactive exploration from radio waves to gamma rays

interface SpectrumBand {
  id: string
  name: string
  wavelengthMin: number // in meters
  wavelengthMax: number
  frequencyMin: number // in Hz
  frequencyMax: number
  color: string
  bgColor: string
  description: string
  howItWorks: string
  applications: string[]
  dangers: string[]
  funFact: string
  icon: React.ReactNode
  visibleToHumans: boolean
}

const SPECTRUM_BANDS: SpectrumBand[] = [
  {
    id: 'radio',
    name: 'Radio Waves',
    wavelengthMin: 1,
    wavelengthMax: 100000,
    frequencyMin: 3e3,
    frequencyMax: 3e11,
    color: '#f43f5e',
    bgColor: '#fef2f2',
    description: 'The longest wavelengths in the EM spectrum. Used for broadcasting, communication, and astronomy.',
    howItWorks: 'Radio waves are produced by accelerating electric charges, typically in antennas. They can travel through walls and around obstacles by diffraction.',
    applications: ['AM/FM radio broadcasting', 'Television signals', 'GPS navigation', 'Radio astronomy', 'MRI medical imaging'],
    dangers: ['Generally considered safe at normal exposure levels'],
    funFact: 'The cosmic microwave background radiation — afterglow of the Big Bang — is detected as radio waves.',
    icon: <Radio className="w-5 h-5" />,
    visibleToHumans: false,
  },
  {
    id: 'microwave',
    name: 'Microwaves',
    wavelengthMin: 0.001,
    wavelengthMax: 1,
    frequencyMin: 3e8,
    frequencyMax: 3e11,
    color: '#f97316',
    bgColor: '#fff7ed',
    description: 'Shorter than radio waves, used for cooking, communication, and radar. WiFi and Bluetooth operate in this range.',
    howItWorks: 'Microwaves cause water molecules to vibrate and rotate, generating heat. This is why they heat food effectively but not dry materials.',
    applications: ['Microwave ovens', 'WiFi and Bluetooth', '5G networks', 'Radar systems', 'Satellite communication'],
    dangers: ['Can cause heating of body tissues at high power', 'Cataracts possible with prolonged exposure'],
    funFact: 'The microwave oven was discovered by accident when Percy Spencer noticed his chocolate bar melted near a radar set.',
    icon: <Wifi className="w-5 h-5" />,
    visibleToHumans: false,
  },
  {
    id: 'infrared',
    name: 'Infrared',
    wavelengthMin: 7e-7,
    wavelengthMax: 0.001,
    frequencyMin: 3e11,
    frequencyMax: 4.3e14,
    color: '#dc2626',
    bgColor: '#fef2f2',
    description: 'Heat radiation. Everything above absolute zero emits infrared. Used for thermal imaging, remote controls, and astronomy.',
    howItWorks: 'All objects emit infrared radiation based on their temperature (blackbody radiation). Warmer objects emit more and at shorter wavelengths.',
    applications: ['Thermal cameras', 'TV remote controls', 'Night vision', 'Heat lamps', 'Infrared astronomy'],
    dangers: ['Can cause burns and eye damage at high intensity', 'Glass blowers\' cataract'],
    funFact: 'Pit vipers can "see" infrared radiation using special heat-sensing organs, allowing them to hunt in complete darkness.',
    icon: <Thermometer className="w-5 h-5" />,
    visibleToHumans: false,
  },
  {
    id: 'visible',
    name: 'Visible Light',
    wavelengthMin: 3.8e-7,
    wavelengthMax: 7e-7,
    frequencyMin: 4.3e14,
    frequencyMax: 7.9e14,
    color: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)',
    bgColor: 'linear-gradient(90deg, #fef2f2, #fffbeb, #f0fdf4, #eff6ff, #faf5ff)',
    description: 'The only part of the spectrum visible to human eyes. A tiny sliver of the full electromagnetic range.',
    howItWorks: 'Different wavelengths of visible light are perceived as different colors. Red has the longest wavelength (~700nm), violet the shortest (~400nm).',
    applications: ['Human vision', 'Photography', 'Fiber optics', 'Photosynthesis', 'Solar panels'],
    dangers: ['Bright light can damage the retina', 'Blue light may affect sleep cycles'],
    funFact: 'The visible spectrum is less than 0.0035% of the full electromagnetic spectrum. We\'re nearly blind to most of what\'s out there.',
    icon: <Eye className="w-5 h-5" />,
    visibleToHumans: true,
  },
  {
    id: 'ultraviolet',
    name: 'Ultraviolet',
    wavelengthMin: 1e-8,
    wavelengthMax: 3.8e-7,
    frequencyMin: 7.9e14,
    frequencyMax: 3e16,
    color: '#8b5cf6',
    bgColor: '#faf5ff',
    description: 'Higher energy than visible light. Causes sunburn and vitamin D production. Used for sterilization and forensics.',
    howItWorks: 'UV light has enough energy to break molecular bonds in DNA and cause chemical reactions. This is why it\'s both useful for sterilization and dangerous for skin.',
    applications: ['Sterilization and disinfection', 'Vitamin D synthesis in skin', 'Fluorescent materials', 'Forensics (blood detection)', 'Lithography for chips'],
    dangers: ['Sunburn', 'Skin cancer', 'Cataracts', 'Suppressed immune system'],
    funFact: 'Bees can see ultraviolet light, and many flowers have UV patterns invisible to humans that guide bees to nectar.',
    icon: <Sun className="w-5 h-5" />,
    visibleToHumans: false,
  },
  {
    id: 'xray',
    name: 'X-Rays',
    wavelengthMin: 1e-11,
    wavelengthMax: 1e-8,
    frequencyMin: 3e16,
    frequencyMax: 3e19,
    color: '#06b6d4',
    bgColor: '#ecfeff',
    description: 'Penetrating radiation that passes through soft tissue but not bone. Revolutionary for medical imaging.',
    howItWorks: 'X-rays are produced when high-speed electrons hit a metal target. They pass through soft tissue but are absorbed by denser materials like bone and metal.',
    applications: ['Medical imaging', 'Airport security', 'X-ray crystallography', 'Cancer treatment', 'Industrial inspection'],
    dangers: ['DNA damage', 'Increased cancer risk', 'Tissue damage at high doses'],
    funFact: 'The first X-ray image was of Wilhelm Röntgen\'s wife\'s hand. She reportedly said "I have seen my death."',
    icon: <Activity className="w-5 h-5" />,
    visibleToHumans: false,
  },
  {
    id: 'gamma',
    name: 'Gamma Rays',
    wavelengthMin: 1e-14,
    wavelengthMax: 1e-11,
    frequencyMin: 3e19,
    frequencyMax: 3e22,
    color: '#22c55e',
    bgColor: '#f0fdf4',
    description: 'The highest energy electromagnetic radiation. Produced by nuclear reactions and cosmic events.',
    howItWorks: 'Gamma rays originate from nuclear reactions, radioactive decay, and the most violent events in the universe. They can penetrate most materials and ionize atoms.',
    applications: ['Cancer radiotherapy', 'Sterilization of medical equipment', 'Gamma-ray astronomy', 'Nuclear physics research', 'Food irradiation'],
    dangers: ['Severe tissue damage', 'Acute radiation syndrome', 'Cancer', 'Genetic damage'],
    funFact: 'Gamma-ray bursts are the brightest events in the universe — a single burst can release more energy in seconds than the Sun will in its 10-billion year lifetime.',
    icon: <Zap className="w-5 h-5" />,
    visibleToHumans: false,
  },
]

// Helper to format wavelength for display
function formatWavelength(meters: number): string {
  if (meters >= 1) {
    return `${meters.toLocaleString()} m`
  } else if (meters >= 0.001) {
    return `${(meters * 1000).toFixed(1)} mm`
  } else if (meters >= 1e-6) {
    return `${(meters * 1e6).toFixed(1)} μm`
  } else if (meters >= 1e-9) {
    return `${(meters * 1e9).toFixed(1)} nm`
  } else if (meters >= 1e-12) {
    return `${(meters * 1e12).toFixed(2)} pm`
  } else {
    return `${(meters * 1e15).toFixed(2)} fm`
  }
}

// Helper to format frequency for display
function formatFrequency(hz: number): string {
  if (hz >= 1e18) {
    return `${(hz / 1e18).toFixed(1)} EHz`
  } else if (hz >= 1e15) {
    return `${(hz / 1e15).toFixed(1)} PHz`
  } else if (hz >= 1e12) {
    return `${(hz / 1e12).toFixed(1)} THz`
  } else if (hz >= 1e9) {
    return `${(hz / 1e9).toFixed(1)} GHz`
  } else if (hz >= 1e6) {
    return `${(hz / 1e6).toFixed(1)} MHz`
  } else if (hz >= 1e3) {
    return `${(hz / 1e3).toFixed(1)} kHz`
  } else {
    return `${hz.toFixed(1)} Hz`
  }
}

export default function EMSpectrumPage() {
  const [selectedBand, setSelectedBand] = useState<SpectrumBand | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollSpectrum = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-3">
            Electromagnetic Spectrum
          </h1>
          <p className="text-base md:text-lg text-neutral-600 max-w-3xl">
            From radio waves to gamma rays — the full range of electromagnetic radiation.
            The visible spectrum is just a tiny sliver of what's out there.
          </p>
        </div>

        {/* Key Insight Box */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
              <Eye className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="font-medium text-neutral-900 mb-1">
                You're Nearly Blind
              </h2>
              <p className="text-neutral-600 text-sm">
                The visible spectrum — everything you can see — represents less than 0.0035% of 
                the electromagnetic spectrum. The rest is invisible: radio waves carrying your WiFi, 
                infrared from everything warm, X-rays passing through walls, gamma rays from distant 
                supernovas. Your eyes show you almost nothing of what's really there.
              </p>
            </div>
          </div>
        </div>

        {/* Full Spectrum Bar */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-neutral-900">The Full Spectrum</h2>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span>← Low energy / Long wavelength</span>
              <span className="mx-2">|</span>
              <span>High energy / Short wavelength →</span>
            </div>
          </div>

          {/* Scroll controls + Spectrum strip */}
          <div className="relative">
            <button 
              onClick={() => scrollSpectrum('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-neutral-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scrollSpectrum('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-neutral-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div 
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide px-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-1 min-w-max">
                {SPECTRUM_BANDS.map((band, index) => (
                  <button
                    key={band.id}
                    onClick={() => {
                      setSelectedBand(band)
                      setShowDetail(true)
                    }}
                    className={`
                      relative group flex flex-col items-center py-3 px-4 rounded-xl
                      transition-all duration-200 hover:scale-105
                      ${selectedBand?.id === band.id ? 'ring-2 ring-black ring-offset-2' : ''}
                    `}
                    style={{ 
                      background: band.id === 'visible' 
                        ? 'linear-gradient(90deg, #fef2f2, #fffbeb, #f0fdf4, #eff6ff, #faf5ff)' 
                        : band.bgColor 
                    }}
                  >
                    {/* Colored bar */}
                    <div 
                      className="w-full h-8 rounded-lg mb-2"
                      style={{ 
                        background: band.color,
                        minWidth: band.id === 'visible' ? '80px' : '60px'
                      }}
                    />
                    
                    {/* Icon */}
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                      style={{ color: band.id === 'visible' ? '#6b7280' : band.color }}
                    >
                      {band.icon}
                    </div>
                    
                    {/* Name */}
                    <span className="text-xs font-medium text-neutral-700 whitespace-nowrap">
                      {band.name}
                    </span>
                    
                    {/* Wavelength range */}
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {formatWavelength(band.wavelengthMax)}–{formatWavelength(band.wavelengthMin)}
                    </span>

                    {/* Visible marker */}
                    {band.visibleToHumans && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white flex items-center justify-center">
                        <Eye className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scale labels */}
          <div className="flex justify-between mt-4 px-8 text-xs text-neutral-500 font-mono">
            <span>~100 km</span>
            <span>1 m</span>
            <span>1 mm</span>
            <span>1 μm</span>
            <span>1 nm</span>
            <span>1 pm</span>
          </div>
        </div>

        {/* Band Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {SPECTRUM_BANDS.map(band => (
            <button
              key={band.id}
              onClick={() => {
                setSelectedBand(band)
                setShowDetail(true)
              }}
              className="bg-white rounded-xl border border-neutral-200 p-5 text-left hover:border-neutral-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: band.id === 'visible' ? 'linear-gradient(135deg, #ef4444, #eab308, #22c55e, #3b82f6, #8b5cf6)' : band.color }}
                >
                  {band.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-neutral-900">
                      {band.name}
                    </h3>
                    {band.visibleToHumans && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-black text-white rounded">
                        VISIBLE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                    {band.description}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs font-mono text-neutral-400">
                    <span>λ: {formatWavelength(band.wavelengthMax)}–{formatWavelength(band.wavelengthMin)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Physics Section */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h2 className="font-medium text-neutral-900 mb-4">The Physics</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">Wave-Particle Duality</h3>
              <p className="text-sm text-neutral-600">
                Light behaves as both a wave and a particle. The wave determines wavelength 
                and frequency; the particle (photon) determines energy. E = hf, where h is 
                Planck's constant.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">Speed of Light</h3>
              <p className="text-sm text-neutral-600">
                All electromagnetic radiation travels at exactly the same speed in vacuum: 
                c = 299,792,458 m/s. Only the wavelength and frequency change.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">The Relationship</h3>
              <p className="text-sm text-neutral-600 font-mono">
                c = λf<br/>
                Where c is speed of light, λ is wavelength, and f is frequency. 
                As wavelength decreases, frequency (and energy) increases.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedBand && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowDetail(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header with colored bar */}
            <div 
              className="h-3 rounded-t-2xl"
              style={{ background: selectedBand.color }}
            />
            
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                    style={{ background: selectedBand.id === 'visible' ? 'linear-gradient(135deg, #ef4444, #eab308, #22c55e, #3b82f6, #8b5cf6)' : selectedBand.color }}
                  >
                    {selectedBand.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-neutral-900">
                      {selectedBand.name}
                    </h2>
                    <div className="flex gap-3 text-sm font-mono text-neutral-500 mt-0.5">
                      <span>λ: {formatWavelength(selectedBand.wavelengthMax)} – {formatWavelength(selectedBand.wavelengthMin)}</span>
                      <span>•</span>
                      <span>f: {formatFrequency(selectedBand.frequencyMin)} – {formatFrequency(selectedBand.frequencyMax)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-neutral-700 mb-6">
                {selectedBand.description}
              </p>

              {/* How it works */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  How It Works
                </h3>
                <p className="text-sm text-neutral-600">
                  {selectedBand.howItWorks}
                </p>
              </div>

              {/* Applications */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Applications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBand.applications.map((app, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 text-sm rounded-full"
                      style={{ 
                        backgroundColor: selectedBand.bgColor,
                        color: selectedBand.id === 'visible' ? '#374151' : selectedBand.color
                      }}
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dangers */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Hazards
                </h3>
                <ul className="space-y-1">
                  {selectedBand.dangers.map((danger, i) => (
                    <li key={i} className="text-sm text-neutral-600 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">⚠</span>
                      <span>{danger}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fun fact */}
              <div 
                className="rounded-xl p-4"
                style={{ backgroundColor: selectedBand.bgColor }}
              >
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Did You Know?
                </h3>
                <p className="text-sm text-neutral-700">
                  {selectedBand.funFact}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}