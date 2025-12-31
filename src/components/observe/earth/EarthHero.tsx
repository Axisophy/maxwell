'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface EarthHeroProps {
  className?: string
}

export default function EarthHero({ className = '' }: EarthHeroProps) {
  const [imageKey, setImageKey] = useState(0)
  const [currentView, setCurrentView] = useState<'pacific' | 'atlantic'>('pacific')

  useEffect(() => {
    // Refresh images periodically
    const interval = setInterval(() => {
      setImageKey((k) => k + 1)
    }, 10 * 60 * 1000) // Every 10 minutes

    return () => clearInterval(interval)
  }, [])

  // Himawari-8 covers Pacific, GOES-16 covers Atlantic/Americas
  const himawariUrl = `https://www.jma.go.jp/bosai/himawari/data/satimg/20241230/233000/fd/fd_/B13/TBB/1/1/1/0_0.png`
  const goesUrl = `https://cdn.star.nesdis.noaa.gov/GOES16/ABI/FD/GEOCOLOR/678x678.jpg?${imageKey}`

  return (
    <div className={`${className}`}>
      {/* View selector */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setCurrentView('pacific')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'pacific'
              ? 'bg-white/10 text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Pacific (Himawari-9)
        </button>
        <button
          onClick={() => setCurrentView('atlantic')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'atlantic'
              ? 'bg-white/10 text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Americas (GOES-16)
        </button>
      </div>

      {/* Hero image */}
      <div className="relative bg-[#0f0f14] rounded-xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-[500px] max-h-[500px] aspect-square mx-auto">
            {currentView === 'atlantic' ? (
              <Image
                src={goesUrl}
                alt="Earth from GOES-16"
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <Image
                src="https://www.data.jma.go.jp/mscweb/data/himawari/img/fd_/fd__trm_0000.jpg"
                alt="Earth from Himawari-9"
                fill
                className="object-contain"
                unoptimized
              />
            )}
          </div>
        </div>

        {/* Overlay info */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-white/40 mb-1">
              {currentView === 'pacific' ? 'Himawari-9 (JMA)' : 'GOES-16 (NOAA)'}
            </p>
            <p className="text-sm text-white/70">
              {currentView === 'pacific'
                ? 'Full disk view of Pacific basin'
                : 'GeoColor composite of Americas'}
            </p>
          </div>
          <div className="text-right">
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-mono rounded">
              LIVE
            </span>
          </div>
        </div>

        {/* Vignette effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />
      </div>

      {/* Quick facts */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <p className="text-2xl font-light text-white">12,742</p>
          <p className="text-xs text-white/40">km diameter</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <p className="text-2xl font-light text-white">71%</p>
          <p className="text-xs text-white/40">water surface</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <p className="text-2xl font-light text-white">8B+</p>
          <p className="text-xs text-white/40">humans</p>
        </div>
      </div>
    </div>
  )
}
