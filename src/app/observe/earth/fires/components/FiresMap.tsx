'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Fire {
  id: string
  lat: number
  lon: number
  brightness: number
  confidence: 'high' | 'nominal' | 'low'
  frp: number
  satellite: string
  timestamp: string
  region: string
}

interface FiresMapProps {
  fires: Fire[]
  loading?: boolean
  className?: string
}

export default function FiresMap({ fires, loading = false, className = '' }: FiresMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.CircleMarker[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 12,
      zoomControl: true,
      attributionControl: false,
    })

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map)

    // Attribution
    L.control.attribution({
      position: 'bottomright',
      prefix: false,
    }).addTo(map).addAttribution('© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/attributions">CARTO</a>')

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update markers when fires change
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add new markers
    fires.forEach((fire) => {
      const color = fire.confidence === 'high' ? '#ef4444' :
                    fire.confidence === 'nominal' ? '#f97316' : '#eab308'

      const radius = Math.max(3, Math.min(10, fire.frp / 10))

      const marker = L.circleMarker([fire.lat, fire.lon], {
        radius,
        fillColor: color,
        fillOpacity: 0.7,
        color: color,
        weight: 1,
        opacity: 0.9,
      })

      marker.bindPopup(`
        <div style="font-family: system-ui; font-size: 12px; line-height: 1.4;">
          <div style="font-weight: 600; margin-bottom: 4px;">${fire.region}</div>
          <div style="color: #666;">
            <div>FRP: <strong>${fire.frp.toFixed(1)} MW</strong></div>
            <div>Confidence: ${fire.confidence}</div>
            <div>Sensor: ${fire.satellite}</div>
            <div>Brightness: ${fire.brightness}K</div>
          </div>
        </div>
      `)

      marker.addTo(map)
      markersRef.current.push(marker)
    })
  }, [fires])

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full" />

      {loading && (
        <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center">
          <div className="text-white/50 text-sm">Loading fire data...</div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs text-white">
        <div className="text-white/50 mb-2">Confidence</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>Nominal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Low</span>
        </div>
      </div>
    </div>
  )
}
