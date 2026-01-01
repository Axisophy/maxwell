'use client'

import { useState, useEffect } from 'react'

// ===========================================
// SOLAR DISK WIDGET
// ===========================================
// Shows live imagery from NASA Solar Dynamics Observatory
// Data: NASA SDO (direct image URLs - CORS allowed)
// Design: Square format showing full solar disk
// ===========================================

const WAVELENGTHS = {
  '0193': { label: '193Å', description: 'Corona at 1.2 million K', group: 'corona' },
  '0171': { label: '171Å', description: 'Corona at 600,000 K', group: 'corona' },
  '0304': { label: '304Å', description: 'Chromosphere at 50,000 K', group: 'corona' },
  '0131': { label: '131Å', description: 'Flare plasma at 10 million K', group: 'corona' },
  'HMIIC': { label: 'HMI Vis', description: 'Visible light surface', group: 'surface' },
  'HMIB': { label: 'HMI Mag', description: 'Magnetic field polarity', group: 'surface' },
} as const

type WavelengthKey = keyof typeof WAVELENGTHS

interface SolarDiskProps {
  defaultWavelength?: WavelengthKey
  size?: 512 | 1024 | 2048
}

export default function SolarDisk({
  defaultWavelength = '0193',
  size = 1024
}: SolarDiskProps) {
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
    <div className="p-2 md:p-4">
      {/* Image container - square format, full solar disk visible */}
      <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-white/50 text-sm font-mono">Loading...</div>
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
      </div>

      {/* Wavelength selectors - black boxes with gap-px */}
      <div className="mt-3 space-y-px">
        {/* Corona views (top row) */}
        <div className="flex gap-px">
          {(Object.keys(WAVELENGTHS) as WavelengthKey[])
            .filter(key => WAVELENGTHS[key].group === 'corona')
            .map((key) => (
              <button
                key={key}
                onClick={() => { setWavelength(key); setIsLoading(true) }}
                className={`
                  flex-1 px-2 py-2 text-xs font-medium rounded-lg transition-colors
                  ${wavelength === key
                    ? 'bg-[#ff0000] text-white'
                    : 'bg-black text-white/60 hover:text-white'
                  }
                `}
              >
                {WAVELENGTHS[key].label}
              </button>
            ))}
        </div>

        {/* Surface views (bottom row) */}
        <div className="flex gap-px">
          {(Object.keys(WAVELENGTHS) as WavelengthKey[])
            .filter(key => WAVELENGTHS[key].group === 'surface')
            .map((key) => (
              <button
                key={key}
                onClick={() => { setWavelength(key); setIsLoading(true) }}
                className={`
                  flex-1 px-2 py-2 text-xs font-medium rounded-lg transition-colors
                  ${wavelength === key
                    ? 'bg-[#ff0000] text-white'
                    : 'bg-black text-white/60 hover:text-white'
                  }
                `}
              >
                {WAVELENGTHS[key].label}
              </button>
            ))}
        </div>
      </div>

      {/* Description */}
      <div className="mt-3 text-center">
        <p className="text-sm text-black">
          {WAVELENGTHS[wavelength].description}
        </p>
      </div>

      {/* Update frequency note */}
      <div className="mt-2 text-center">
        <p className="text-xs text-black/40">
          Images update every ~15 minutes from NASA SDO
        </p>
      </div>
    </div>
  )
}
