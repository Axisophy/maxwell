'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// NASA SDO wavelength options - codes need leading zeros for URL
const WAVELENGTHS = {
  '0193': { label: 'AIA 193Å', description: 'Corona (1.2M K)', color: 'teal' },
  '0171': { label: 'AIA 171Å', description: 'Corona (600K K)', color: 'gold' },
  '0304': { label: 'AIA 304Å', description: 'Chromosphere (50K K)', color: 'red' },
  '0131': { label: 'AIA 131Å', description: 'Flare plasma (10M K)', color: 'cyan' },
  'HMIIC': { label: 'HMI', description: 'Visible surface', color: 'orange' },
} as const

type WavelengthKey = keyof typeof WAVELENGTHS

interface SolarLiveProps {
  defaultWavelength?: WavelengthKey
  size?: number
}

export default function SolarLive({ 
  defaultWavelength = '0193',
  size = 512 
}: SolarLiveProps) {
  const [wavelength, setWavelength] = useState<WavelengthKey>(defaultWavelength)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [imageKey, setImageKey] = useState(0)

  // NASA SDO image URL - uses latest images
  const imageUrl = `https://sdo.gsfc.nasa.gov/assets/img/latest/latest_${size}_${wavelength}.jpg`

  // Refresh image every 5 minutes (NASA updates ~every 15 mins, but we check more often)
  useEffect(() => {
    const interval = setInterval(() => {
      setImageKey(prev => prev + 1)
      setLastUpdate(new Date())
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="aspect-square w-full h-full max-w-full max-h-full bg-black flex flex-col">
      {/* Eyepiece view - takes up most of the square */}
      <div className="flex-1 relative flex items-center justify-center p-4 min-h-0">
        {/* Circular mask container */}
        <div className="relative aspect-square h-full max-h-full max-w-full">
          {/* Outer ring - telescope eyepiece effect */}
          <div className="absolute inset-0 rounded-full border-2 border-neutral-700 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]" />
          
          {/* Inner vignette overlay */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none z-10"
            style={{
              background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.9) 100%)'
            }}
          />

          {/* Sun image */}
          <div className="absolute inset-[3%] rounded-full overflow-hidden bg-black">
            <Image
              key={imageKey}
              src={imageUrl}
              alt={`Sun in ${WAVELENGTHS[wavelength].label}`}
              fill
              className="object-cover"
              unoptimized // NASA images are external
              priority
            />
          </div>

          {/* Subtle crosshairs */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute top-1/2 left-[5%] right-[5%] h-px bg-white/10" />
            <div className="absolute left-1/2 top-[5%] bottom-[5%] w-px bg-white/10" />
          </div>
        </div>
      </div>

      {/* Controls bar - inside the square */}
      <div className="px-4 py-3 border-t border-neutral-800 flex items-center justify-between shrink-0">
        {/* Wavelength selector */}
        <div className="flex gap-1 flex-wrap">
          {Object.entries(WAVELENGTHS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setWavelength(key as WavelengthKey)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                wavelength === key
                  ? 'bg-white/20 text-white'
                  : 'text-neutral-500 hover:text-white hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Timestamp */}
        <div className="text-xs text-neutral-500">
          {formatTime(lastUpdate)}
        </div>
      </div>
    </div>
  )
}