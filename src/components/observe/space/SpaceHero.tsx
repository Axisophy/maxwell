'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SpaceHeroProps {
  className?: string
}

export default function SpaceHero({ className = '' }: SpaceHeroProps) {
  const [currentImage, setCurrentImage] = useState<'sdo' | 'earth'>('sdo')
  const [sdoTimestamp, setSdoTimestamp] = useState<string>('')
  const [imageKey, setImageKey] = useState(0)

  useEffect(() => {
    // Refresh images periodically
    const interval = setInterval(() => {
      setImageKey((k) => k + 1)
      setSdoTimestamp(new Date().toISOString())
    }, 5 * 60 * 1000) // Every 5 minutes

    setSdoTimestamp(new Date().toISOString())
    return () => clearInterval(interval)
  }, [])

  const sdoUrl = `https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0193.jpg?${imageKey}`
  const earthUrl = `https://epic.gsfc.nasa.gov/api/natural/images?api_key=DEMO_KEY`

  return (
    <div className={`${className}`}>
      {/* Image selector */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setCurrentImage('sdo')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentImage === 'sdo'
              ? 'bg-white/10 text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          The Sun
        </button>
        <button
          onClick={() => setCurrentImage('earth')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentImage === 'earth'
              ? 'bg-white/10 text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Earth from L1
        </button>
      </div>

      {/* Hero image */}
      <div className="relative bg-[#0f0f14] rounded-xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
        {currentImage === 'sdo' ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-[500px] max-h-[500px] aspect-square mx-auto">
                <Image
                  src={sdoUrl}
                  alt="Live Sun from SDO"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
            {/* Overlay info */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-white/40 mb-1">SDO AIA 193Å</p>
                <p className="text-sm text-white/70">Live solar corona (1.2 million K)</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-mono rounded">
                  LIVE
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0a0a0f] to-[#0f1420]">
              <div className="relative w-full h-full max-w-[400px] max-h-[400px] aspect-square mx-auto">
                <Image
                  src="https://epic.gsfc.nasa.gov/archive/natural/2024/01/01/png/epic_1b_20240101003633.png"
                  alt="Earth from DSCOVR EPIC"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
            {/* Overlay info */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-white/40 mb-1">DSCOVR EPIC</p>
                <p className="text-sm text-white/70">Earth from L1 (1.5 million km)</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-mono rounded">
                  DAILY
                </span>
              </div>
            </div>
          </>
        )}

        {/* Vignette effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />
      </div>

      {/* Quick facts */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-[#0f0f14] rounded-lg p-3 text-center">
          <p className="text-2xl font-light text-white">8.3</p>
          <p className="text-xs text-white/40">min to Sun</p>
        </div>
        <div className="bg-[#0f0f14] rounded-lg p-3 text-center">
          <p className="text-2xl font-light text-white">1.28</p>
          <p className="text-xs text-white/40">sec to Moon</p>
        </div>
        <div className="bg-[#0f0f14] rounded-lg p-3 text-center">
          <p className="text-2xl font-light text-white">~5</p>
          <p className="text-xs text-white/40">sec to L1</p>
        </div>
      </div>
    </div>
  )
}
