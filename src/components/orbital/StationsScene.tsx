'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import {
  SPACE_STATIONS,
  SpaceStation,
  TLEData,
  propagateSimple,
  generateOrbitPath,
  EARTH_RADIUS_SCENE,
} from '@/lib/orbital/stations-data'

interface StationsSceneProps {
  time: Date
  tleData: Record<string, TLEData>
  selectedStation: string | null
  onSelectStation: (id: string | null) => void
  showOrbits?: boolean
  showLabels?: boolean
}

// Earth component with day/night texture approximation
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Slow rotation to show Earth turning
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0001
    }
  })

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[EARTH_RADIUS_SCENE, 64, 64]} />
        <meshStandardMaterial
          color={0x2244aa}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS_SCENE * 1.02, 64, 64]} />
        <meshBasicMaterial
          color={0x88aaff}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Equator ring for reference */}
      <Line
        points={(() => {
          const pts: THREE.Vector3[] = []
          for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2
            pts.push(new THREE.Vector3(
              Math.cos(angle) * EARTH_RADIUS_SCENE * 1.001,
              0,
              Math.sin(angle) * EARTH_RADIUS_SCENE * 1.001
            ))
          }
          return pts
        })()}
        color={0x444466}
        lineWidth={0.5}
        transparent
        opacity={0.3}
      />
    </group>
  )
}

// Station marker component
function StationMarker({
  station,
  position,
  isSelected,
  onSelect,
  showLabel,
}: {
  station: SpaceStation
  position: { x: number; y: number; z: number }
  isSelected: boolean
  onSelect: () => void
  showLabel: boolean
}) {
  const size = isSelected ? 0.15 : 0.1

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Station marker */}
      <mesh onClick={onSelect}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={station.color}
          transparent
          opacity={isSelected ? 1 : 0.8}
        />
      </mesh>

      {/* Pulse ring when selected */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.5, size * 2, 32]} />
          <meshBasicMaterial
            color={station.color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Label */}
      {showLabel && (
        <Html
          position={[0, size * 3, 0]}
          center
          style={{
            color: `#${station.color.toString(16).padStart(6, '0')}`,
            fontSize: '10px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textShadow: '0 0 10px rgba(0,0,0,0.9)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {station.name.split(' ')[0]}
        </Html>
      )}
    </group>
  )
}

// Orbit path component
function OrbitPath({
  station,
  tle,
  time,
  isSelected,
}: {
  station: SpaceStation
  tle: TLEData
  time: Date
  isSelected: boolean
}) {
  const points = useMemo(() => {
    return generateOrbitPath(tle, time, station.orbitPeriodMinutes, 128)
  }, [tle, time, station.orbitPeriodMinutes])

  const linePoints = points.map(p => new THREE.Vector3(p.x, p.y, p.z))

  return (
    <Line
      points={linePoints}
      color={station.color}
      lineWidth={isSelected ? 1.5 : 0.5}
      transparent
      opacity={isSelected ? 0.8 : 0.3}
    />
  )
}

// Ground track (shows path over Earth's surface)
function GroundTrack({
  station,
  tle,
  time,
  isSelected,
}: {
  station: SpaceStation
  tle: TLEData
  time: Date
  isSelected: boolean
}) {
  if (!isSelected) return null

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    // Show past 45 minutes and future 45 minutes of ground track
    for (let i = -45; i <= 45; i += 1) {
      const t = new Date(time.getTime() + i * 60 * 1000)
      const pos = propagateSimple(tle, t)

      // Convert lat/lon to position on Earth surface
      const latRad = pos.latitude * Math.PI / 180
      const lonRad = pos.longitude * Math.PI / 180

      const surfaceRadius = EARTH_RADIUS_SCENE * 1.002
      const x = surfaceRadius * Math.cos(latRad) * Math.cos(lonRad)
      const y = surfaceRadius * Math.sin(latRad)
      const z = surfaceRadius * Math.cos(latRad) * Math.sin(lonRad)

      pts.push(new THREE.Vector3(x, y, z))
    }
    return pts
  }, [tle, time])

  return (
    <Line
      points={points}
      color={station.color}
      lineWidth={2}
      transparent
      opacity={0.6}
      dashed
      dashSize={0.1}
      gapSize={0.05}
    />
  )
}

// Camera controller
function CameraController({
  selectedStation,
  stationPositions,
}: {
  selectedStation: string | null
  stationPositions: Record<string, { x: number; y: number; z: number }>
}) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const previousSelectionRef = useRef<string | null>(null)

  useEffect(() => {
    if (selectedStation === previousSelectionRef.current) return
    previousSelectionRef.current = selectedStation

    if (!controlsRef.current) return

    if (selectedStation && stationPositions[selectedStation]) {
      const pos = stationPositions[selectedStation]
      const target = new THREE.Vector3(pos.x, pos.y, pos.z)
      const distance = 5  // Close zoom on station

      controlsRef.current.target.copy(target)
      camera.position.set(
        target.x + distance,
        target.y + distance * 0.5,
        target.z + distance
      )
    } else {
      // Overview - show whole Earth
      controlsRef.current.target.set(0, 0, 0)
      camera.position.set(20, 10, 20)
    }
  }, [selectedStation, stationPositions, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      enableZoom={true}
      zoomSpeed={1.5}
      minDistance={8}
      maxDistance={50}
    />
  )
}

// Main scene content
function SceneContent({
  time,
  tleData,
  selectedStation,
  onSelectStation,
  showOrbits = true,
  showLabels = true,
}: StationsSceneProps) {
  // Calculate station positions
  const stationPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; z: number }> = {}

    SPACE_STATIONS.forEach(station => {
      const tle = tleData[station.id]
      if (tle) {
        const pos = propagateSimple(tle, time)
        positions[station.id] = { x: pos.x, y: pos.y, z: pos.z }
      }
    })

    return positions
  }, [time, tleData])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 5, 5]} intensity={1} />

      {/* Stars background */}
      <Stars
        radius={300}
        depth={100}
        count={3000}
        factor={4}
        fade
        speed={0}
      />

      {/* Earth */}
      <Earth />

      {/* Stations */}
      {SPACE_STATIONS.map(station => {
        const tle = tleData[station.id]
        const position = stationPositions[station.id]

        if (!tle || !position) return null

        return (
          <group key={station.id}>
            {/* Orbit path */}
            {showOrbits && (
              <OrbitPath
                station={station}
                tle={tle}
                time={time}
                isSelected={selectedStation === station.id}
              />
            )}

            {/* Ground track */}
            <GroundTrack
              station={station}
              tle={tle}
              time={time}
              isSelected={selectedStation === station.id}
            />

            {/* Station marker */}
            <StationMarker
              station={station}
              position={position}
              isSelected={selectedStation === station.id}
              onSelect={() => onSelectStation(
                selectedStation === station.id ? null : station.id
              )}
              showLabel={showLabels}
            />
          </group>
        )
      })}

      {/* Camera controls */}
      <CameraController
        selectedStation={selectedStation}
        stationPositions={stationPositions}
      />
    </>
  )
}

// Main exported component
export default function StationsScene(props: StationsSceneProps) {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 1000,
        position: [20, 10, 20],
      }}
      gl={{
        antialias: true,
      }}
      style={{ background: '#000000' }}
    >
      <SceneContent {...props} />
    </Canvas>
  )
}
