'use client'

// ===========================================
// WORLD MAP COMPONENT
// ===========================================
// Uses static SVG world map with marker overlay
// Map: flekschas/simple-world-map (CC BY-SA 3.0)
// Projection: Equirectangular
// ===========================================

interface WorldMapProps {
  className?: string
  children?: React.ReactNode
}

// The source SVG has viewBox="0 0 1009.6727 665.96301"
// We need to map lat/lon to these coordinates
const MAP_WIDTH = 1009.6727
const MAP_HEIGHT = 665.96301

// Convert lat/lng to SVG coordinates
// Equirectangular projection: x = lon, y = -lat (scaled)
export function latLonToXY(
  lat: number, 
  lon: number
): { x: number; y: number } {
  // Map longitude (-180 to 180) to x (0 to MAP_WIDTH)
  const x = ((lon + 180) / 360) * MAP_WIDTH
  // Map latitude (90 to -90) to y (0 to MAP_HEIGHT)
  const y = ((90 - lat) / 180) * MAP_HEIGHT
  return { x, y }
}

export default function WorldMap({
  className = '',
  children,
}: WorldMapProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Base map image */}
      <img 
        src="/maps/world-map.svg" 
        alt="World map"
        className="w-full h-auto block"
        style={{
          filter: 'brightness(0.4) saturate(0.8)',
          background: '#0f172a',
        }}
      />
      
      {/* Marker overlay - positioned exactly over the map */}
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {children}
      </svg>
    </div>
  )
}