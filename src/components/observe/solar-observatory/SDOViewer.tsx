'use client'

import { useState, useEffect } from 'react'

interface SDOViewerProps {
  size?: 'default' | 'large'
  className?: string
}

type SDOWavelength = '0193' | '0171' | '0304' | '0131' | '0211' | '0335' | '1600' | '1700' | 'HMIIC' | 'HMIB'

interface WavelengthConfig {
  id: SDOWavelength
  label: string
  description: string
  color: string
  temperature?: string
}

const wavelengths: WavelengthConfig[] = [
  { 
    id: '0193', 
    label: '193 Å', 
    description: 'Corona and hot flare plasma',
    color: '#FFD700',
    temperature: '1.2 million °C'
  },
  { 
    id: '0171', 
    label: '171 Å', 
    description: 'Quiet corona and upper transition region',
    color: '#FFD700',
    temperature: '1 million °C'
  },
  { 
    id: '0304', 
    label: '304 Å', 
    description: 'Chromosphere and transition region',
    color: '#FF4500',
    temperature: '50,000 °C'
  },
  { 
    id: '0131', 
    label: '131 Å', 
    description: 'Flaring regions',
    color: '#00CED1',
    temperature: '10 million °C'
  },
  { 
    id: '0211', 
    label: '211 Å', 
    description: 'Active regions',
    color: '#9370DB',
    temperature: '2 million °C'
  },
  { 
    id: '0335', 
    label: '335 Å', 
    description: 'Active regions',
    color: '#1E90FF',
    temperature: '2.5 million °C'
  },
  { 
    id: 'HMIIC', 
    label: 'HMI Continuum', 
    description: 'Visible light (sunspots)',
    color: '#FFFFFF',
  },
  { 
    id: 'HMIB', 
    label: 'HMI Magnetogram', 
    description: 'Magnetic field polarity',
    color: '#FFFFFF',
  },
]

export default function SDOViewer({ size = 'default', className = '' }: SDOViewerProps) {
  const [selectedWavelength, setSelectedWavelength] = useState<SDOWavelength>('0193')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const currentWavelength = wavelengths.find(w => w.id === selectedWavelength)!
  const imageSize = size === 'large' ? '1024' : '512'

  useEffect(() => {
    const loadImage = () => {
      setIsLoading(true)
      setError(null)
      
      // SDO image URL pattern
      const url = `https://sdo.gsfc.nasa.gov/assets/img/latest/latest_${imageSize}_${selectedWavelength}.jpg?t=${Date.now()}`
      setImageUrl(url)
      setLastUpdate(new Date())
    }

    loadImage()

    // Refresh every 5 minutes
    const interval = setInterval(loadImage, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [selectedWavelength, imageSize])

  const handleImageLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setError('Image temporarily unavailable')
  }

  return (
    <div className={`bg-[#0f0f14] rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-white/40">LIVE</span>
          </div>
          <h3 className="text-sm font-medium text-white">NASA SDO</h3>
        </div>
        <span className="text-xs text-white/40 font-mono">Geosynchronous Orbit</span>
      </div>

      {/* Wavelength Selector */}
      <div className="px-4 py-2 border-b border-white/10 bg-black/30 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {wavelengths.map((wavelength) => (
            <button
              key={wavelength.id}
              onClick={() => setSelectedWavelength(wavelength.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all whitespace-nowrap ${
                selectedWavelength === wavelength.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              {wavelength.label}
            </button>
          ))}
        </div>
      </div>

      {/* Image Container */}
      <div className={`relative bg-black ${size === 'large' ? 'aspect-square' : 'aspect-square'}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              <span className="text-xs text-white/40 font-mono">Loading imagery...</span>
            </div>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="text-white/20 text-6xl mb-2">☉</div>
              <p className="text-sm text-white/40">{error}</p>
              <p className="text-xs text-white/30 mt-1">Retrying...</p>
            </div>
          </div>
        ) : (
          imageUrl && (
            <img
              src={imageUrl}
              alt={`Sun in ${currentWavelength.label}`}
              className="w-full h-full object-contain"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )
        )}

        {/* Wavelength Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-sm text-white font-medium">{currentWavelength.description}</p>
          {currentWavelength.temperature && (
            <p className="text-xs text-white/50 mt-1">{currentWavelength.temperature}</p>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 border-t border-white/10 bg-black/20 flex items-center justify-between">
        <div className="text-xs text-white/40">
          Solar Dynamics Observatory • AIA Instrument
        </div>
        {lastUpdate && (
          <span className="text-xs text-white/30 font-mono">
            {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
          </span>
        )}
      </div>
    </div>
  )
}
