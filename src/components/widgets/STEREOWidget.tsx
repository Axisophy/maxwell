'use client'

import { useState, useEffect, useRef } from 'react'
import { Info } from 'lucide-react'

/**
 * STEREO-A Widget
 * 
 * Dashboard widget showing live beacon imagery from NASA's STEREO-A spacecraft.
 * STEREO-A orbits the Sun ahead of Earth, providing a unique view of approaching
 * solar activity before it reaches us.
 * 
 * Data Source: NASA STEREO Science Center
 * Update: Daily during DSN contacts (~3 hours/day)
 */

interface STEREOWidgetProps {
  className?: string
}

type Instrument = 'euvi_195' | 'euvi_304' | 'cor1' | 'cor2'

const INSTRUMENTS: { id: Instrument; label: string; desc: string }[] = [
  { id: 'euvi_195', label: '195Å', desc: 'Corona' },
  { id: 'euvi_304', label: '304Å', desc: 'Chromosphere' },
  { id: 'cor1', label: 'COR1', desc: 'Inner Corona' },
  { id: 'cor2', label: 'COR2', desc: 'Outer Corona' },
]

export default function STEREOWidget({ className = '' }: STEREOWidgetProps) {
  const [instrument, setInstrument] = useState<Instrument>('euvi_195')
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [position, setPosition] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)

  // Calculate STEREO-A position (degrees ahead of Earth)
  useEffect(() => {
    const calculatePosition = () => {
      // STEREO-A was ~156° ahead in Jan 2020, drifting ~22° per year closer
      const refDate = new Date('2020-01-01')
      const now = new Date()
      const yearsElapsed = (now.getTime() - refDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      const currentPosition = 156 - (yearsElapsed * 22)
      setPosition(Math.max(0, Math.round(currentPosition)))
    }
    calculatePosition()
  }, [])

  // Dynamic font sizing based on container width
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setBaseFontSize(width / 25)
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const getImageUrl = (inst: Instrument): string => {
    const base = 'https://stereo-ssc.nascom.nasa.gov/beacon/beacon_secchi/latest_256'
    const map: Record<Instrument, string> = {
      euvi_195: `${base}/ahead_euvi_195_latest.jpg`,
      euvi_304: `${base}/ahead_euvi_304_latest.jpg`,
      cor1: `${base}/ahead_cor1_latest.jpg`,
      cor2: `${base}/ahead_cor2_latest.jpg`,
    }
    return map[inst]
  }

  const handleInstrumentChange = (inst: Instrument) => {
    setImageLoaded(false)
    setImageError(false)
    setInstrument(inst)
  }

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col ${className}`}
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Widget Frame (Header) */}
      <div 
        className="flex items-center justify-between bg-[#e5e5e5] px-[1em] rounded-t-[0.75em]"
        style={{ height: '3em' }}
      >
        <div className="flex items-center gap-[0.5em]">
          <span className="font-normal text-black" style={{ fontSize: '1.125em' }}>
            STEREO-A
          </span>
          <span 
            className="px-[0.4em] py-[0.15em] bg-amber-100 text-amber-700 font-mono rounded"
            style={{ fontSize: '0.625em' }}
          >
            {position}° AHEAD
          </span>
        </div>
        <div className="flex items-center gap-[0.5em]">
          {/* Status indicator */}
          <div className="relative">
            <div 
              className={`rounded-full ${imageLoaded ? 'bg-green-500' : imageError ? 'bg-red-500' : 'bg-amber-500'}`}
              style={{ width: '0.5em', height: '0.5em' }}
            />
            {imageLoaded && (
              <div 
                className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"
                style={{ width: '0.5em', height: '0.5em' }}
              />
            )}
          </div>
          {/* Info button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-black/40 hover:text-black transition-colors"
          >
            <Info style={{ width: '1.25em', height: '1.25em' }} />
          </button>
        </div>
      </div>

      {/* Info Panel (expandable) */}
      {showInfo && (
        <div className="bg-[#e5e5e5] px-[1em] py-[0.75em] border-t border-[#d0d0d0]">
          <p className="text-black/60 leading-relaxed mb-[0.5em]" style={{ fontSize: '0.875em' }}>
            STEREO-A orbits the Sun ahead of Earth, giving us advance warning of 
            approaching solar activity. The "far side" of the Sun becomes visible 
            before it rotates to face Earth.
          </p>
          <div className="border-t border-[#d0d0d0] pt-[0.5em] mt-[0.5em]">
            <span className="text-black/40 uppercase tracking-wider" style={{ fontSize: '0.625em' }}>
              Source
            </span>
            <p className="text-black" style={{ fontSize: '0.75em' }}>
              NASA STEREO Science Center • Beacon Data
            </p>
          </div>
        </div>
      )}

      {/* Widget Content */}
      <div 
        className="flex-1 bg-white p-[1em] rounded-b-[0.75em]"
        style={{ marginTop: '0.5em' }}
      >
        {/* Instrument Selector */}
        <div className="flex gap-[0.25em] mb-[0.75em]">
          {INSTRUMENTS.map((inst) => (
            <button
              key={inst.id}
              onClick={() => handleInstrumentChange(inst.id)}
              className={`
                flex-1 py-[0.4em] rounded-[0.5em] font-medium transition-all
                ${instrument === inst.id 
                  ? 'bg-black text-white' 
                  : 'bg-[#e5e5e5] text-black/50 hover:bg-[#d5d5d5]'
                }
              `}
              style={{ fontSize: '0.75em' }}
            >
              {inst.label}
            </button>
          ))}
        </div>

        {/* Image Container */}
        <div className="relative aspect-square bg-black rounded-[0.5em] overflow-hidden">
          {/* Loading state */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"
                style={{ width: '2em', height: '2em' }}
              />
            </div>
          )}
          
          {/* Error state */}
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
              <span style={{ fontSize: '2em' }}>☀</span>
              <span style={{ fontSize: '0.75em' }}>No signal</span>
            </div>
          )}

          {/* Image */}
          <img
            src={getImageUrl(instrument)}
            alt={`STEREO-A ${INSTRUMENTS.find(i => i.id === instrument)?.label}`}
            className={`w-full h-full object-contain transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />

          {/* BEACON badge */}
          <div 
            className="absolute top-[0.5em] left-[0.5em] px-[0.4em] py-[0.15em] bg-amber-500/90 text-black font-mono rounded"
            style={{ fontSize: '0.5em' }}
          >
            BEACON
          </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center mt-[0.5em]">
          <span className="text-black/40 font-mono" style={{ fontSize: '0.625em' }}>
            {INSTRUMENTS.find(i => i.id === instrument)?.desc}
          </span>
          <span className="text-black/40 font-mono" style={{ fontSize: '0.625em' }}>
            Updates daily
          </span>
        </div>
      </div>
    </div>
  )
}
