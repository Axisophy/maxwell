'use client'

import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import * as satellite from 'satellite.js'

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
const CONSTELLATION_COLORS: Record<string, string> = {
  stations: '#ff6b6b',
  gps: '#4ecdc4',
  weather: '#45b7d1',
  science: '#f7dc6f',
  starlink: '#95a5a6',
}

interface SatelliteRecord {
  name: string
  noradId: string
  group: string
  line1: string
  line2: string
}

interface SatelliteData {
  name: string
  noradId: string
  group: string
  satrec: satellite.SatRec
  lat?: number
  lng?: number
  alt?: number
}

interface SatelliteGlobeProps {
  satelliteRecords: SatelliteRecord[]
  onSelectSatellite: (sat: SatelliteData | null) => void
  selectedSatellite: SatelliteData | null
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
          // Test propagation
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
      .filter((d): d is SatelliteData => d !== null)
  }, [satelliteRecords])

  // Update positions every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate current positions - use pointsData format
  const pointsData = useMemo(() => {
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
          altitude: geo.height / EARTH_RADIUS_KM, // Normalized to globe radius
          color: CONSTELLATION_COLORS[sat.group] || '#ffffff',
          radius: sat.group === 'stations' ? 0.4 : 0.15,
        }
      })
      .filter(
        (d): d is SatelliteData & { lat: number; lng: number; altitude: number; color: string; radius: number } =>
          d !== null && !isNaN(d.lat!) && !isNaN(d.lng!) && !isNaN(d.altitude!)
      )
  }, [satData, time])

  // Calculate orbit path for selected satellite
  const pathsData = useMemo(() => {
    if (!selectedSatellite?.satrec) return []

    const points: Array<[number, number, number]> = []
    const now = time.getTime()

    // Get orbital period
    const meanMotion = selectedSatellite.satrec.no // rad/min
    const periodMs = ((2 * Math.PI) / meanMotion) * 60 * 1000

    // Calculate full orbit, starting half orbit ago
    const steps = 180
    const startTime = now - periodMs / 2

    for (let i = 0; i <= steps; i++) {
      const t = new Date(startTime + (i / steps) * periodMs)
      const posVel = satellite.propagate(selectedSatellite.satrec, t)

      if (posVel && typeof posVel.position !== 'boolean' && posVel.position) {
        const gmst = satellite.gstime(t)
        const geo = satellite.eciToGeodetic(posVel.position, gmst)

        points.push([
          satellite.degreesLong(geo.longitude),
          satellite.degreesLat(geo.latitude),
          geo.height / EARTH_RADIUS_KM,
        ])
      }
    }

    return [points]
  }, [selectedSatellite, time])

  // Globe initialization
  useEffect(() => {
    if (globeRef.current && globeReady) {
      globeRef.current.pointOfView({ altitude: 2.5 })
      globeRef.current.controls().autoRotate = true
      globeRef.current.controls().autoRotateSpeed = 0.3
    }
  }, [globeReady])

  // Click handler
  const handlePointClick = useCallback(
    (point: object | null) => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = false
      }
      onSelectSatellite(point as SatelliteData | null)
    },
    [onSelectSatellite]
  )

  // Hover handler - change cursor
  const handlePointHover = useCallback((point: object | null) => {
    document.body.style.cursor = point ? 'pointer' : 'auto'
  }, [])

  return (
    <Globe
      ref={globeRef}
      width={width}
      height={height}
      onGlobeReady={() => setGlobeReady(true)}
      // Globe appearance
      globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
      backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
      // Points (satellites) - simpler API than customLayer
      pointsData={pointsData}
      pointLat="lat"
      pointLng="lng"
      pointAltitude="altitude"
      pointColor="color"
      pointRadius="radius"
      pointsMerge={false}
      onPointClick={handlePointClick}
      onPointHover={handlePointHover}
      // Paths (orbit)
      pathsData={pathsData}
      pathPoints={(d: any) => d}
      pathPointLat={(p: any) => p[1]}
      pathPointLng={(p: any) => p[0]}
      pathPointAlt={(p: any) => p[2]}
      pathColor={() => '#ffdf20'}
      pathStroke={2}
      pathDashLength={0.01}
      pathDashGap={0.004}
      pathDashAnimateTime={100000}
      // Interaction
      enablePointerInteraction={true}
    />
  )
}
