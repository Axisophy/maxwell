'use client'

import { useState, useEffect, useRef } from 'react'

// ===========================================
// COSMIC RAYS THROUGH YOU
// ===========================================
// Personal cosmic ray statistics based on location
// Shows how many particles pass through your body
// ===========================================

export default function CosmicRaysThrough() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [altitude, setAltitude] = useState(0) // meters
  const [latitude, setLatitude] = useState(51.5) // degrees
  const [muonsPerMinute, setMuonsPerMinute] = useState(10000)
  const [totalToday, setTotalToday] = useState(0)
  const [counter, setCounter] = useState(0)
  const [flashes, setFlashes] = useState<{id: number, x: number, y: number}[]>([])
  
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
  
  // Get location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude)
          if (pos.coords.altitude) {
            setAltitude(pos.coords.altitude)
          }
        },
        () => {
          // Default to sea level mid-latitude
        }
      )
    }
  }, [])
  
  // Calculate muon rate based on altitude and latitude
  useEffect(() => {
    // Base rate at sea level is ~10,000 muons/minute per person
    const seaLevelRate = 10000
    
    // Rate increases ~2x per 1500m altitude (exponential growth)
    const altitudeFactor = Math.pow(2, altitude / 1500)
    
    // Rate varies with latitude due to geomagnetic cutoff
    // Higher at poles, lower at equator
    const latRad = Math.abs(latitude) * Math.PI / 180
    const latitudeFactor = 1 + 0.3 * Math.sin(latRad)
    
    const rate = Math.round(seaLevelRate * altitudeFactor * latitudeFactor)
    setMuonsPerMinute(rate)
    
    // Calculate total since midnight
    const now = new Date()
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const minutesSinceMidnight = (now.getTime() - midnight.getTime()) / 60000
    setTotalToday(Math.round(rate * minutesSinceMidnight))
  }, [altitude, latitude])
  
  // Live counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(c => c + Math.floor(muonsPerMinute / 60))
    }, 1000)
    return () => clearInterval(interval)
  }, [muonsPerMinute])
  
  // Flash animation for particle hits
  useEffect(() => {
    const interval = setInterval(() => {
      // Add random flash
      const newFlash = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100
      }
      setFlashes(f => [...f, newFlash])
      
      // Remove after animation
      setTimeout(() => {
        setFlashes(f => f.filter(fl => fl.id !== newFlash.id))
      }, 500)
    }, 200 / (muonsPerMinute / 10000))
    
    return () => clearInterval(interval)
  }, [muonsPerMinute])
  
  const formatBigNumber = (n: number): string => {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
    return n.toLocaleString()
  }
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-[#0f0f23] rounded-xl p-[1em] h-full flex flex-col relative overflow-hidden">
      {/* Particle flash effects */}
      {flashes.map(flash => (
        <div
          key={flash.id}
          className="absolute w-[0.5em] h-[0.5em] rounded-full bg-cyan-400 animate-ping pointer-events-none"
          style={{ left: `${flash.x}%`, top: `${flash.y}%`, opacity: 0.6 }}
        />
      ))}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.5em] relative z-10">
        <div className="text-[0.625em] font-medium text-cyan-400/60 uppercase tracking-wider">
          COSMIC RAYS
        </div>
        <div className="flex items-center gap-[0.25em]">
          <div className="w-[0.375em] h-[0.375em] rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[0.5em] text-cyan-400/60">DETECTING</span>
        </div>
      </div>
      
      {/* Main stat */}
      <div className="text-center mb-[0.75em] relative z-10">
        <div className="text-[0.5em] text-white/40 mb-[0.25em]">MUONS THROUGH YOU</div>
        <div className="font-mono text-[2.5em] font-bold text-cyan-400 leading-none">
          ~{formatBigNumber(muonsPerMinute)}
        </div>
        <div className="text-[0.625em] text-white/40">per minute</div>
      </div>
      
      {/* Body silhouette with particles */}
      <div className="flex-1 relative flex items-center justify-center min-h-0">
        <div className="relative">
          {/* Simple body silhouette */}
          <svg viewBox="0 0 60 100" className="h-[8em] w-auto opacity-20">
            <ellipse cx="30" cy="12" rx="10" ry="12" fill="white" />
            <rect x="20" y="24" width="20" height="35" rx="5" fill="white" />
            <rect x="10" y="27" width="8" height="25" rx="3" fill="white" />
            <rect x="42" y="27" width="8" height="25" rx="3" fill="white" />
            <rect x="22" y="59" width="7" height="35" rx="3" fill="white" />
            <rect x="31" y="59" width="7" height="35" rx="3" fill="white" />
          </svg>
          
          {/* Particle streak lines */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-[0.125em] bg-gradient-to-b from-cyan-400 to-transparent animate-fall"
                style={{
                  left: `${20 + i * 15}%`,
                  height: '100%',
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '1s',
                  opacity: 0.4
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-[0.5em] relative z-10 mt-[0.5em]">
        <div className="bg-white/5 rounded-lg p-[0.5em]">
          <div className="text-[0.4375em] text-white/30 uppercase">Today</div>
          <div className="font-mono text-[0.875em] text-white font-medium">
            {formatBigNumber(totalToday)}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-[0.5em]">
          <div className="text-[0.4375em] text-white/30 uppercase">Since Loading</div>
          <div className="font-mono text-[0.875em] text-white font-medium">
            {formatBigNumber(counter)}
          </div>
        </div>
      </div>
      
      {/* Location info */}
      <div className="mt-[0.5em] pt-[0.5em] border-t border-white/10 relative z-10">
        <div className="flex items-center justify-between text-[0.5em]">
          <div className="text-white/30">
            <span className="font-mono">{latitude.toFixed(1)}°</span> lat, <span className="font-mono">{altitude}m</span> alt
          </div>
          <button
            onClick={() => setAltitude(a => a === 0 ? 3000 : a === 3000 ? 10000 : 0)}
            className="text-cyan-400/60 hover:text-cyan-400"
          >
            Try: {altitude === 0 ? 'Mountain' : altitude === 3000 ? 'Airplane' : 'Sea Level'}
          </button>
        </div>
      </div>
      
      {/* Explanation */}
      <div className="mt-[0.375em] text-[0.4375em] text-white/20 relative z-10">
        Cosmic rays from supernovae create muon showers when they hit the atmosphere. 
        Higher altitude = more muons.
      </div>
      
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-100%); opacity: 0.6; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-fall {
          animation: fall 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
