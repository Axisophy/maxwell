'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// NASA SDO wavelength options
const WAVELENGTHS = {
  '0193': { label: 'AIA 193Å', description: 'Corona (1.2M K)' },
  '0171': { label: 'AIA 171Å', description: 'Corona (600K K)' },
  '0304': { label: 'AIA 304Å', description: 'Chromosphere (50K K)' },
  '0131': { label: 'AIA 131Å', description: 'Flare plasma (10M K)' },
  'HMIIC': { label: 'HMI', description: 'Visible surface' },
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

  const imageUrl = `https://sdo.gsfc.nasa.gov/assets/img/latest/latest_${size}_${wavelength}.jpg`

  useEffect(() => {
    const interval = setInterval(() => {
      setImageKey(prev => prev + 1)
      setLastUpdate(new Date())
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="w-full">
      {/* Image container - circular viewport */}
      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
          {/* Outer ring - telescope eyepiece effect */}
          <div className="absolute inset-0 flex items-center justify-center p-[4%]">
            <div className="relative w-full h-full">
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
                  unoptimized
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
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4">
        {/* Wavelength selector - segmented control style */}
        <div 
          className="flex p-1 rounded-lg"
          style={{ backgroundColor: '#e5e5e5' }}
        >
          {Object.entries(WAVELENGTHS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setWavelength(key as WavelengthKey)}
              className="flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors"
              style={{
                backgroundColor: wavelength === key ? '#ffffff' : 'transparent',
                color: wavelength === key ? '#000000' : 'rgba(0,0,0,0.5)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Timestamp and source */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e5e5e5]">
          <span className="text-xs text-text-muted">
            {WAVELENGTHS[wavelength].description}
          </span>
          <span className="text-xs font-mono text-text-muted">
            {formatTime(lastUpdate)}
          </span>
        </div>
      </div>
    </div>
  )
}