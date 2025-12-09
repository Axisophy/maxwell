'use client'

import { useState, useEffect } from 'react'

// ===========================================
// WORLD MAP COMPONENT
// ===========================================
// Uses static SVG world map with marker overlay
// Map: flekschas/simple-world-map (CC BY-SA 3.0)
// Projection: Equirectangular
// ===========================================

interface WorldMapProps {
  className?: string
  oceanColor?: string
  landColor?: string
  children?: React.ReactNode
}

// The source SVG viewBox: "30.767 241.591 784.077 458.627"
const VIEW_X = 30.767
const VIEW_Y = 241.591
const VIEW_WIDTH = 784.077
const VIEW_HEIGHT = 458.627

// Convert lat/lng to SVG coordinates
export function latLonToXY(
  lat: number, 
  lon: number
): { x: number; y: number } {
  const x = VIEW_X + ((lon + 180) / 360) * VIEW_WIDTH
  const y = VIEW_Y + ((90 - lat) / 180) * VIEW_HEIGHT
  return { x, y }
}

export default function WorldMap({
  className = '',
  oceanColor = '#0f172a',
  landColor = '#1e3a5f',
  children,
}: WorldMapProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null)

  useEffect(() => {
    fetch('/maps/world-map.svg')
      .then(res => res.text())
      .then(text => {
        // Extract just the path elements from the SVG
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'image/svg+xml')
        const paths = doc.querySelectorAll('path')
        
        // Convert paths to string with our fill color
        let pathsHtml = ''
        paths.forEach(path => {
          const d = path.getAttribute('d')
          if (d) {
            pathsHtml += `<path d="${d}" />`
          }
        })
        
        setSvgContent(pathsHtml)
      })
      .catch(err => console.error('Failed to load map:', err))
  }, [])

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Ocean background */}
        <rect 
          x={VIEW_X} 
          y={VIEW_Y} 
          width={VIEW_WIDTH} 
          height={VIEW_HEIGHT} 
          fill={oceanColor} 
        />
        
        {/* Land masses */}
        {svgContent && (
          <g 
            fill={landColor} 
            stroke="none"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
        
        {/* Markers overlay */}
        {children}
      </svg>
    </div>
  )
}