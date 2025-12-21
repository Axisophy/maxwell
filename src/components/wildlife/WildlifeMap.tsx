'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { TrackedAnimal, AnimalCategory, categoryColors } from '@/lib/wildlife/types'

interface WildlifeMapProps {
  animals: TrackedAnimal[]
  selectedAnimal: TrackedAnimal | null
  onAnimalSelect: (animal: TrackedAnimal | null) => void
  filter: AnimalCategory | 'all'
}

// Create SVG marker icon for each category
function createAnimalIcon(category: AnimalCategory, isSelected: boolean): L.DivIcon {
  const color = categoryColors[category]
  const size = isSelected ? 32 : 24
  const innerSize = isSelected ? 16 : 12

  return L.divIcon({
    className: 'wildlife-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
        ${isSelected ? 'transform: scale(1.1);' : ''}
      ">
        <div style="
          width: ${innerSize}px;
          height: ${innerSize}px;
          background: white;
          border-radius: 50%;
          opacity: 0.9;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export default function WildlifeMap({
  animals,
  selectedAnimal,
  onAnimalSelect,
  filter,
}: WildlifeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const trackLayerRef = useRef<L.Polyline | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Filter animals by category
  const filteredAnimals = filter === 'all'
    ? animals
    : animals.filter(a => a.category === filter)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const bounds = L.latLngBounds(
      L.latLng(-85, -180),
      L.latLng(85, 180)
    )

    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 12,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      attributionControl: false,
      zoomControl: true,
      scrollWheelZoom: false,
      worldCopyJump: false,
    })

    // Dark CARTO tiles
    const tileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        maxZoom: 19,
        noWrap: true,
      }
    )

    tileLayer.on('load', () => {
      setIsLoading(false)
    })

    tileLayer.addTo(map)
    mapInstanceRef.current = map

    // Fallback loading timeout
    setTimeout(() => setIsLoading(false), 2000)

    return () => {
      map.remove()
      mapInstanceRef.current = null
      markersRef.current.clear()
    }
  }, [])

  // Update markers when animals or filter changes
  const updateMarkers = useCallback(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Remove markers that are no longer in filtered list
    markersRef.current.forEach((marker, id) => {
      if (!filteredAnimals.find(a => a.id === id)) {
        marker.remove()
        markersRef.current.delete(id)
      }
    })

    // Add or update markers
    filteredAnimals.forEach(animal => {
      const isSelected = selectedAnimal?.id === animal.id
      const existingMarker = markersRef.current.get(animal.id)

      if (existingMarker) {
        // Update icon if selection changed
        existingMarker.setIcon(createAnimalIcon(animal.category, isSelected))
      } else {
        // Create new marker
        const marker = L.marker(
          [animal.currentLocation.lat, animal.currentLocation.lng],
          { icon: createAnimalIcon(animal.category, isSelected) }
        )

        marker.on('click', () => {
          onAnimalSelect(animal)
        })

        marker.bindTooltip(
          `<strong>${animal.name}</strong><br/>${animal.speciesCommon}`,
          {
            direction: 'top',
            offset: [0, -12],
            className: 'wildlife-tooltip',
          }
        )

        marker.addTo(map)
        markersRef.current.set(animal.id, marker)
      }
    })
  }, [filteredAnimals, selectedAnimal, onAnimalSelect])

  useEffect(() => {
    updateMarkers()
  }, [updateMarkers])

  // Draw track for selected animal
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Remove existing track
    if (trackLayerRef.current) {
      trackLayerRef.current.remove()
      trackLayerRef.current = null
    }

    // Draw new track if animal is selected
    if (selectedAnimal && selectedAnimal.recentTrack.length > 0) {
      const trackPoints: L.LatLngExpression[] = selectedAnimal.recentTrack.map(
        point => [point.lat, point.lng]
      )

      // Create gradient-like effect with multiple lines
      const segments: L.Polyline[] = []
      for (let i = 1; i < trackPoints.length; i++) {
        const opacity = 0.2 + (i / trackPoints.length) * 0.8
        const segment = L.polyline(
          [trackPoints[i - 1], trackPoints[i]],
          {
            color: categoryColors[selectedAnimal.category],
            weight: 3,
            opacity: opacity,
          }
        )
        segment.addTo(map)
        segments.push(segment)
      }

      // Store reference for cleanup (use last segment as reference)
      if (segments.length > 0) {
        trackLayerRef.current = segments[segments.length - 1]
      }

      // Pan to selected animal
      map.flyTo(
        [selectedAnimal.currentLocation.lat, selectedAnimal.currentLocation.lng],
        6,
        { duration: 1 }
      )
    }

    return () => {
      // Cleanup on unmount or animal change
    }
  }, [selectedAnimal])

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full bg-[#1a1a1e] rounded-xl" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1e]/90 z-[1000] rounded-xl">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 z-[500]">
        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Species</p>
        <div className="space-y-1.5">
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border border-white/30"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-white/70 capitalize">{cat}s</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        .wildlife-marker {
          background: transparent !important;
          border: none !important;
        }
        .wildlife-tooltip {
          background: rgba(0, 0, 0, 0.9);
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 12px;
          padding: 6px 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .wildlife-tooltip::before {
          border-top-color: rgba(0, 0, 0, 0.9) !important;
        }
        .leaflet-container {
          background: #1a1a1e;
          font-family: inherit;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        }
        .leaflet-control-zoom a {
          background: rgba(0,0,0,0.8) !important;
          color: white !important;
          border: none !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(0,0,0,0.95) !important;
        }
        .leaflet-control-zoom-in {
          border-radius: 6px 6px 0 0 !important;
        }
        .leaflet-control-zoom-out {
          border-radius: 0 0 6px 6px !important;
        }
      `}</style>
    </div>
  )
}
