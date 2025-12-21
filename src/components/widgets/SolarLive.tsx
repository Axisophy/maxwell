'use client'

import { useState, useEffect } from 'react'

// ===========================================
// SOLAR LIVE WIDGET
// ===========================================
// Shows live imagery from NASA Solar Dynamics Observatory
// Data: NASA SDO (direct image URLs - CORS allowed)
// Design: Square format showing full solar disk
// ===========================================

const WAVELENGTHS = {
  '0193': { label: 'AIA 193Å', description: 'Corona at 1.2 million K' },
  '0171': { label: 'AIA 171Å', description: 'Corona at 600,000 K' },
  '0304': { label: 'AIA 304Å', description: 'Chromosphere at 50,000 K' },
  '0131': { label: 'AIA 131Å', description: 'Flare plasma at 10 million K' },
  'HMIIC': { label: 'HMI', description: 'Visible light surface' },
} as const

type WavelengthKey = keyof typeof WAVELENGTHS

interface SolarLiveProps {
  defaultWavelength?: WavelengthKey
  size?: 512 | 1024 | 2048
}

export default function SolarLive({ 
  defaultWavelength = '0193',
  size = 1024 
}: SolarLiveProps) {
  const [wavelength, setWavelength] = useState<WavelengthKey>(defaultWavelength)
  const [isLoading, setIsLoading] = useState(true)
  const [imageKey, setImageKey] = useState(0)

  // NASA SDO direct URL - images update every ~15 minutes
  const imageUrl = `https://sdo.gsfc.nasa.gov/assets/img/latest/latest_${size}_${wavelength}.jpg`

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setImageKey(prev => prev + 1)
      setIsLoading(true)
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-[1em]">
      {/* Image container - square format, full solar disk visible */}
      <div className="relative aspect-square bg-black rounded-[0.5em] overflow-hidden">
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-white/50 text-[0.875em] font-mono">Loading...</div>
          </div>
        )}

        {/* Solar image - object-contain ensures full disk is visible */}
        <img
          key={imageKey}
          src={`${imageUrl}?t=${imageKey}`}
          alt={`Sun at ${WAVELENGTHS[wavelength].label}`}
          className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        {/* Wavelength indicator overlay */}
        <div className="absolute bottom-[0.5em] left-[0.5em] bg-black/70 backdrop-blur-sm rounded-[0.25em] px-[0.5em] py-[0.25em]">
          <span className="text-[0.6875em] font-mono text-white/80">{WAVELENGTHS[wavelength].label}</span>
        </div>

        {/* Live indicator */}
        <div className="absolute top-[0.5em] right-[0.5em] flex items-center gap-[0.375em] bg-black/70 backdrop-blur-sm rounded-[0.25em] px-[0.5em] py-[0.25em]">
          <span className="relative flex h-[0.5em] w-[0.5em]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
          </span>
          <span className="text-[0.5625em] font-mono text-white/60">LIVE</span>
        </div>
      </div>

      {/* Wavelength selector */}
      <div className="mt-[0.75em]">
        <div className="flex bg-[#e5e5e5] rounded-[0.5em] p-[0.25em]">
          {(Object.keys(WAVELENGTHS) as WavelengthKey[]).map((key) => (
            <button
              key={key}
              onClick={() => { setWavelength(key); setIsLoading(true) }}
              className={`
                flex-1 px-[0.5em] py-[0.375em] text-[0.6875em] font-medium rounded-[0.375em] transition-colors
                ${wavelength === key 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-black/50 hover:text-black'
                }
              `}
            >
              {WAVELENGTHS[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mt-[0.5em] text-center">
        <p className="text-[0.6875em] text-black/50">
          {WAVELENGTHS[wavelength].description}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5] my-[0.75em]" />

      {/* Info text */}
      <div className="text-[0.6875em] text-black/40 text-center">
        Images update every ~15 minutes from NASA SDO
      </div>
    </div>
  )
}