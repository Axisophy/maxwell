'use client'

import { useState, useEffect, useRef } from 'react'

// ===========================================
// WHAT'S BELOW YOU
// ===========================================
// Geological layers beneath your location
// Shows the journey from surface to core
// ===========================================

interface Layer {
  name: string
  depth: string
  thickness: string
  material: string
  temp: string
  color: string
  description: string
}

const globalLayers: Layer[] = [
  {
    name: 'Surface',
    depth: '0 m',
    thickness: '~1 m',
    material: 'Soil, vegetation',
    temp: '10-20°C',
    color: '#8B7355',
    description: 'Where you stand. Organic matter, roots, insects.'
  },
  {
    name: 'Subsoil',
    depth: '1-10 m',
    thickness: '~10 m',
    material: 'Clay, sand, gravel',
    temp: '10-15°C',
    color: '#A0826D',
    description: 'Weathered rock, minerals. Groundwater flows here.'
  },
  {
    name: 'Bedrock',
    depth: '10-100 m',
    thickness: '~100 m',
    material: 'Varies by location',
    temp: '15-25°C',
    color: '#6B6B6B',
    description: 'Solid rock. Age varies from millions to billions of years.'
  },
  {
    name: 'Upper Crust',
    depth: '0-15 km',
    thickness: '15 km',
    material: 'Granite, sedimentary',
    temp: '25-400°C',
    color: '#A0522D',
    description: 'Continental crust. Mining depths rarely exceed 4 km.'
  },
  {
    name: 'Lower Crust',
    depth: '15-35 km',
    thickness: '20 km',
    material: 'Basalt, metamorphic',
    temp: '400-600°C',
    color: '#8B4513',
    description: 'Denser rock. Temperature rises ~25°C per km.'
  },
  {
    name: 'Mohorovičić Discontinuity',
    depth: '35 km',
    thickness: 'Boundary',
    material: 'Transition zone',
    temp: '~600°C',
    color: '#FF6B6B',
    description: 'The Moho. Seismic waves change speed here.'
  },
  {
    name: 'Upper Mantle',
    depth: '35-410 km',
    thickness: '375 km',
    material: 'Peridotite',
    temp: '600-900°C',
    color: '#CD5C5C',
    description: 'Solid but slowly flowing rock. Convection drives tectonics.'
  },
  {
    name: 'Transition Zone',
    depth: '410-660 km',
    thickness: '250 km',
    material: 'High-pressure minerals',
    temp: '1,200-1,400°C',
    color: '#B22222',
    description: 'Minerals transform under extreme pressure.'
  },
  {
    name: 'Lower Mantle',
    depth: '660-2,900 km',
    thickness: '2,240 km',
    material: 'Bridgmanite',
    temp: '1,400-3,000°C',
    color: '#8B0000',
    description: 'Extremely viscous. Slabs of subducted crust sink here.'
  },
  {
    name: 'Outer Core',
    depth: '2,900-5,150 km',
    thickness: '2,250 km',
    material: 'Liquid iron-nickel',
    temp: '4,000-6,000°C',
    color: '#FF4500',
    description: 'Liquid metal. Convection creates Earth\'s magnetic field.'
  },
  {
    name: 'Inner Core',
    depth: '5,150-6,371 km',
    thickness: '1,221 km',
    material: 'Solid iron-nickel',
    temp: '~5,500°C',
    color: '#FFD700',
    description: 'Solid despite heat—pressure keeps it from melting. Hot as the Sun\'s surface.'
  },
]

export default function WhatsBelowYou() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null)
  const [scrollDepth, setScrollDepth] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  
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
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const scrollPercent = target.scrollTop / (target.scrollHeight - target.clientHeight)
    setScrollDepth(Math.round(scrollPercent * 6371))
  }
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-gradient-to-b from-[#87CEEB] via-[#8B4513] to-[#FFD700] rounded-xl p-[1em] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.5em]">
        <div>
          <div className="text-[0.625em] font-medium text-white/80 uppercase tracking-wider">
            WHAT'S BELOW YOU
          </div>
          <div className="text-[0.5em] text-white/50">
            Journey to Earth's center
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[1em] font-bold text-white">
            {scrollDepth.toLocaleString()} km
          </div>
          <div className="text-[0.4375em] text-white/50">depth</div>
        </div>
      </div>
      
      {/* Depth indicator bar */}
      <div className="h-[0.5em] bg-white/20 rounded-full mb-[0.5em] overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#87CEEB] via-[#CD5C5C] to-[#FFD700] rounded-full transition-all"
          style={{ width: `${(scrollDepth / 6371) * 100}%` }}
        />
      </div>
      
      {/* Layer list */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-[0.25em] min-h-0 pr-[0.25em]"
      >
        {globalLayers.map((layer) => (
          <button
            key={layer.name}
            onClick={() => setSelectedLayer(selectedLayer?.name === layer.name ? null : layer)}
            className={`w-full text-left p-[0.5em] rounded-lg transition-all ${
              selectedLayer?.name === layer.name 
                ? 'bg-white/20 ring-2 ring-white/40' 
                : 'bg-white/10 hover:bg-white/15'
            }`}
          >
            <div className="flex items-center gap-[0.5em]">
              <div 
                className="w-[1em] h-[1em] rounded-full flex-shrink-0 border border-white/20"
                style={{ backgroundColor: layer.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[0.75em] font-medium text-white truncate">
                    {layer.name}
                  </span>
                  <span className="text-[0.5em] font-mono text-white/50 ml-[0.5em]">
                    {layer.depth}
                  </span>
                </div>
                <div className="text-[0.5em] text-white/40">
                  {layer.material}
                </div>
              </div>
            </div>
            
            {selectedLayer?.name === layer.name && (
              <div className="mt-[0.5em] pt-[0.5em] border-t border-white/10">
                <div className="grid grid-cols-2 gap-[0.5em] text-[0.5em] mb-[0.375em]">
                  <div>
                    <span className="text-white/40">Thickness: </span>
                    <span className="text-white">{layer.thickness}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Temperature: </span>
                    <span className="text-white">{layer.temp}</span>
                  </div>
                </div>
                <p className="text-[0.5em] text-white/60 leading-relaxed">
                  {layer.description}
                </p>
              </div>
            )}
          </button>
        ))}
        
        {/* Center of Earth message */}
        <div className="text-center py-[1em]">
          <div className="text-[2em]">🌍</div>
          <div className="text-[0.625em] text-white/60 font-medium">
            CENTER OF EARTH
          </div>
          <div className="text-[0.5em] text-white/40">
            6,371 km below your feet
          </div>
        </div>
      </div>
      
      {/* Fun facts footer */}
      <div className="mt-[0.5em] pt-[0.5em] border-t border-white/10">
        <div className="text-[0.4375em] text-white/30">
          💡 The deepest humans have drilled is 12.3 km (Kola Superdeep Borehole).
          That's only 0.2% of the way to the center.
        </div>
      </div>
    </div>
  )
}
