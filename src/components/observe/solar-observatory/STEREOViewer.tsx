'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface STEREOViewerProps {
  className?: string
}

type STEREOInstrument = 'euvi195' | 'euvi304' | 'cor1' | 'cor2'

interface InstrumentConfig {
  id: STEREOInstrument
  label: string
  description: string
  baseUrl: string
}

const instruments: InstrumentConfig[] = [
  {
    id: 'euvi195',
    label: 'EUVI 195Å',
    description: 'Corona at 1.5 million °C',
    baseUrl: 'https://stereo-ssc.nascom.nasa.gov/beacon/beacon_secchi/latest_1024/ahead_euvi_195_latest.jpg',
  },
  {
    id: 'euvi304',
    label: 'EUVI 304Å',
    description: 'Chromosphere at 80,000 °C',
    baseUrl: 'https://stereo-ssc.nascom.nasa.gov/beacon/beacon_secchi/latest_1024/ahead_euvi_304_latest.jpg',
  },
  {
    id: 'cor1',
    label: 'COR1',
    description: 'Inner coronagraph (1.4-4 R☉)',
    baseUrl: 'https://stereo-ssc.nascom.nasa.gov/beacon/beacon_secchi/latest_1024/ahead_cor1_latest.jpg',
  },
  {
    id: 'cor2',
    label: 'COR2',
    description: 'Outer coronagraph (2.5-15 R☉)',
    baseUrl: 'https://stereo-ssc.nascom.nasa.gov/beacon/beacon_secchi/latest_1024/ahead_cor2_latest.jpg',
  },
]

export default function STEREOViewer({ className = '' }: STEREOViewerProps) {
  const [selectedInstrument, setSelectedInstrument] = useState<STEREOInstrument>('euvi195')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const currentInstrument = instruments.find(i => i.id === selectedInstrument)!

  useEffect(() => {
    const loadImage = () => {
      setIsLoading(true)
      setError(null)
      
      // Add cache-busting timestamp
      const url = `${currentInstrument.baseUrl}?t=${Date.now()}`
      setImageUrl(url)
      setLastUpdate(new Date())
    }

    loadImage()

    // Refresh every 30 minutes (STEREO beacon updates during daily DSN contacts)
    const interval = setInterval(loadImage, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [selectedInstrument, currentInstrument.baseUrl])

  const handleImageLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setError('Beacon image unavailable')
  }

  // Calculate STEREO-A position (rough approximation)
  // STEREO-A drifts ~21.65° ahead of Earth per year, launched Oct 2006
  const launchDate = new Date('2006-10-25')
  const now = new Date()
  const yearsElapsed = (now.getTime() - launchDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  const degreesSeparation = (yearsElapsed * 21.65) % 360
  const formattedSeparation = degreesSeparation.toFixed(1)

  return (
    <div className={`bg-[#0f0f14] rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Status indicator - amber for delayed data */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-mono text-white/40">BEACON</span>
          </div>
          <h3 className="text-sm font-medium text-white">STEREO-A</h3>
        </div>
        <div className="text-xs text-white/40 font-mono">
          {formattedSeparation}° ahead of Earth
        </div>
      </div>

      {/* Instrument Selector */}
      <div className="px-4 py-2 border-b border-white/10 bg-black/30">
        <div className="flex gap-1">
          {instruments.map((instrument) => (
            <button
              key={instrument.id}
              onClick={() => setSelectedInstrument(instrument.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
                selectedInstrument === instrument.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              {instrument.label}
            </button>
          ))}
        </div>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              <span className="text-xs text-white/40 font-mono">Loading beacon...</span>
            </div>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="text-white/20 text-4xl mb-2">☉</div>
              <p className="text-xs text-white/40">{error}</p>
              <p className="text-xs text-white/30 mt-1">Check NASA STEREO status</p>
            </div>
          </div>
        ) : (
          imageUrl && (
            <img
              src={imageUrl}
              alt={`STEREO-A ${currentInstrument.label}`}
              className="w-full h-full object-contain"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )
        )}

        {/* Instrument Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-xs text-white/60">{currentInstrument.description}</p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 border-t border-white/10 bg-black/20">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-white/40">
              Updates: Daily (DSN contacts)
            </span>
          </div>
          {lastUpdate && (
            <span className="text-white/30 font-mono">
              Checked {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Context Panel */}
      <div className="px-4 py-3 border-t border-white/10 bg-[#0a0a0f]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <span className="text-amber-500 text-sm">↗</span>
          </div>
          <div>
            <p className="text-xs text-white/60 leading-relaxed">
              STEREO-A orbits the Sun slightly faster than Earth, providing a unique viewing angle. 
              It can detect CMEs heading toward Earth before they&apos;re visible from our planet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
