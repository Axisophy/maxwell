'use client'

import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import * as satellite from 'satellite.js'
import * as THREE from 'three'

// Dynamic import to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
    </div>
  ),
})

const EARTH_RADIUS_KM = 6371

// Constellation colors
const CONSTELLATION_COLORS: Record<string, number> = {
  stations: 0xff6b6b,
  gps: 0x4ecdc4,
  weather: 0x45b7d1,
  science: 0xf7dc6f,
  starlink: 0x95a5a6,
}

interface SatelliteRecord {
  name: string
  noradId: string
  group: string
  line1: string
  line2: string
}

interface SatellitePosition {
  name: string
  noradId: string
  group: string
  satrec: satellite.SatRec
  lat: number
  lng: number
  alt: number
}

interface SatelliteGlobeProps {
  satelliteRecords: SatelliteRecord[]
  onSelectSatellite: (sat: SatellitePosition | null) => void
  selectedSatellite: SatellitePosition | null
  width: number
  height: number
}

export default function SatelliteGlobe({
  satelliteRecords,
  onSelectSatellite,
  selectedSatellite,
  width,
  height,
}: SatelliteGlobeProps) {
  const globeRef = useRef<any>(null)
  const [time, setTime] = useState(new Date())
  const [globeReady, setGlobeReady] = useState(false)

  // Initialize satellite records with SGP4
  const satData = useMemo(() => {
    return satelliteRecords
      .map((rec) => {
        try {
          const satrec = satellite.twoline2satrec(rec.line1, rec.line2)
          const testPos = satellite.propagate(satrec, new Date())
          if (!testPos || typeof testPos.position === 'boolean' || !testPos.position) return null

          return {
            name: rec.name,
            noradId: rec.noradId,
            group: rec.group,
            satrec,
          }
        } catch {
          return null
        }
      })
      .filter((d): d is { name: string; noradId: string; group: string; satrec: satellite.SatRec } => d !== null)
  }, [satelliteRecords])

  // Update positions every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate current positions
  const satellitePositions = useMemo(() => {
    return satData
      .map((sat) => {
        const posVel = satellite.propagate(sat.satrec, time)
        if (!posVel || typeof posVel.position === 'boolean' || !posVel.position) return null

        const gmst = satellite.gstime(time)
        const geo = satellite.eciToGeodetic(posVel.position, gmst)

        return {
          ...sat,
          lat: satellite.degreesLat(geo.latitude),
          lng: satellite.degreesLong(geo.longitude),
          alt: geo.height / EARTH_RADIUS_KM,
        }
      })
      .filter(
        (d): d is SatellitePosition =>
          d !== null && !isNaN(d.lat) && !isNaN(d.lng) && !isNaN(d.alt)
      )
  }, [satData, time])

  // Calculate orbit path for selected satellite
  const pathsData = useMemo(() => {
    if (!selectedSatellite?.satrec) return []

    const points: Array<{ lat: number; lng: number; alt: number }> = []
    const now = time.getTime()
    const meanMotion = selectedSatellite.satrec.no
    const periodMs = ((2 * Math.PI) / meanMotion) * 60 * 1000
    const steps = 180
    const startTime = now - periodMs / 2

    for (let i = 0; i <= steps; i++) {
      const t = new Date(startTime + (i / steps) * periodMs)
      const posVel = satellite.propagate(selectedSatellite.satrec, t)

      if (posVel && typeof posVel.position !== 'boolean' && posVel.position) {
        const gmst = satellite.gstime(t)
        const geo = satellite.eciToGeodetic(posVel.position, gmst)

        points.push({
          lat: satellite.degreesLat(geo.latitude),
          lng: satellite.degreesLong(geo.longitude),
          alt: geo.height / EARTH_RADIUS_KM,
        })
      }
    }

    return [{ points }]
  }, [selectedSatellite, time])

  // Globe initialization
  useEffect(() => {
    if (globeRef.current && globeReady) {
      globeRef.current.pointOfView({ altitude: 2.5 })
      globeRef.current.controls().autoRotate = true
      globeRef.current.controls().autoRotateSpeed = 0.3
    }
  }, [globeReady])

  // Custom object creator - small spheres for satellites
  const createSatelliteObject = useCallback((d: object) => {
    const sat = d as SatellitePosition
    const size = sat.group === 'stations' ? 1.5 : 0.6
    const geometry = new THREE.SphereGeometry(size, 8, 8)
    const material = new THREE.MeshBasicMaterial({
      color: CONSTELLATION_COLORS[sat.group] || 0xffffff,
      transparent: true,
      opacity: 0.9,
    })
    return new THREE.Mesh(geometry, material)
  }, [])

  // Update satellite positions
  const updateSatellitePosition = useCallback((obj: THREE.Object3D, d: object) => {
    const sat = d as SatellitePosition
    if (globeRef.current) {
      const coords = globeRef.current.getCoords(sat.lat, sat.lng, sat.alt)
      if (coords) {
        obj.position.set(coords.x, coords.y, coords.z)
      }
    }
  }, [])

  // Click handler
  const handleClick = useCallback(
    (d: object | null) => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = false
      }
      onSelectSatellite(d as SatellitePosition | null)
    },
    [onSelectSatellite]
  )

  // Hover handler
  const handleHover = useCallback((d: object | null) => {
    document.body.style.cursor = d ? 'pointer' : 'auto'
  }, [])

  return (
    <Globe
      ref={globeRef}
      width={width}
      height={height}
      onGlobeReady={() => setGlobeReady(true)}
      globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
      backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
      // Custom layer for satellites (spheres at altitude)
      customLayerData={satellitePositions}
      customThreeObject={createSatelliteObject}
      customThreeObjectUpdate={updateSatellitePosition}
      onCustomLayerClick={handleClick}
      onCustomLayerHover={handleHover}
      // Orbit paths
      pathsData={pathsData}
      pathPoints="points"
      pathPointLat="lat"
      pathPointLng="lng"
      pathPointAlt="alt"
      pathColor={() => '#ffdf20'}
      pathStroke={2}
      pathDashLength={0.01}
      pathDashGap={0.004}
      pathDashAnimateTime={100000}
      enablePointerInteraction={true}
    />
  )
}
