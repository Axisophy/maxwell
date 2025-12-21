'use client'

import { useState, useEffect } from 'react'

const WAVELENGTHS = {
  '0193': { label: 'AIA 193Å', description: 'Corona at 1.2 million K' },
  '0171': { label: 'AIA 171Å', description: 'Corona at 600,000 K' },
  '0304': { label: 'AIA 304Å', description: 'Chromosphere at 50,000 K' },
  '0131': { label: 'AIA 131Å', description: 'Flare plasma at 10 million K' },
  'HMIIC': { label: 'HMI', description: 'Visible light surface' },
} as const

type WavelengthKey = keyof typeof WAVELENGTHS

interface SDOViewerProps {
  defaultWavelength?: WavelengthKey
  size?: 'normal' | 'large'
}

export default function SDOViewer({
  defaultWavelength = '0193',
  size = 'normal'
}: SDOViewerProps) {
  const [wavelength, setWavelength] = useState<WavelengthKey>(defaultWavelength)
  const [isLoading, setIsLoading] = useState(true)
  const [imageKey, setImageKey] = useState(0)

  const imageSize = size === 'large' ? 2048 : 1024
  const imageUrl = `https://sdo.gsfc.nasa.gov/assets/img/latest/latest_${imageSize}_${wavelength}.jpg`

  useEffect(() => {
    const interval = setInterval(() => {
      setImageKey(prev => prev + 1)
      setIsLoading(true)
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#1a1a1e] rounded-xl overflow-hidden">
      {/* Image container */}
      <div className={`relative ${size === 'large' ? 'aspect-square md:aspect-[4/3]' : 'aspect-square'} bg-black`}>
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-white/50 text-sm font-mono">Loading...</div>
          </div>
        )}

        {/* Solar image */}
        <img
          key={imageKey}
          src={`${imageUrl}?t=${imageKey}`}
          alt={`Sun at ${WAVELENGTHS[wavelength].label}`}
          className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        {/* Wavelength indicator overlay */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-xs font-mono text-white/80">{WAVELENGTHS[wavelength].label}</span>
        </div>

        {/* Live indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
          </span>
          <span className="text-[10px] font-mono text-white/60">LIVE</span>
        </div>

        {/* SDO label */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-xs font-mono text-white/80">NASA SDO</span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4">
        {/* Wavelength selector */}
        <div className="flex bg-white/5 rounded-lg p-1">
          {(Object.keys(WAVELENGTHS) as WavelengthKey[]).map((key) => (
            <button
              key={key}
              onClick={() => { setWavelength(key); setIsLoading(true) }}
              className={`
                flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors
                ${wavelength === key
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/60'
                }
              `}
            >
              {WAVELENGTHS[key].label}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="mt-3 text-center">
          <p className="text-xs text-white/40">
            {WAVELENGTHS[wavelength].description}
          </p>
        </div>
      </div>
    </div>
  )
}
