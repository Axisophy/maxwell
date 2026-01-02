'use client'

import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Stars, useTexture, Line } from '@react-three/drei'
import * as THREE from 'three'
import {
  SatellitePosition,
  OrbitPoint,
  latLonAltToVector3,
} from '@/lib/satellites/propagate'
import { CONSTELLATION_COLORS, ConstellationGroup } from '@/lib/satellites/types'

interface SatelliteGlobeProps {
  satellites: SatellitePosition[]
  selectedSatellite: SatellitePosition | null
  orbitPath: OrbitPoint[]
  onSelectSatellite: (sat: SatellitePosition | null) => void
  isLoading?: boolean
}

// Earth component with texture
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null)

  // NASA Blue Marble texture (public domain)
  const texture = useTexture(
    'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg'
  )

  // Rotate Earth slowly
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.01
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={1} metalness={0} />
    </mesh>
  )
}

// Atmosphere glow effect
function Atmosphere() {
  return (
    <mesh scale={[1.015, 1.015, 1.015]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#4d9fff"
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

// Satellite instances - uses InstancedMesh for reliable click detection
function SatelliteInstances({
  satellites,
  onSelect,
}: {
  satellites: SatellitePosition[]
  onSelect: (sat: SatellitePosition | null) => void
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  // Map instance index to satellite
  const indexToSat = useMemo(() => {
    const map = new Map<number, SatellitePosition>()
    satellites.forEach((sat, i) => map.set(i, sat))
    return map
  }, [satellites])

  // Update instance matrices and colors
  useEffect(() => {
    if (!meshRef.current) return

    const dummy = new THREE.Object3D()
    const color = new THREE.Color()

    satellites.forEach((sat, i) => {
      // Position
      const pos = latLonAltToVector3(sat.latitude, sat.longitude, sat.altitude)
      dummy.position.set(pos.x, pos.y, pos.z)

      // Scale - stations larger
      const scale = sat.group === 'stations' ? 0.012 : 0.006
      dummy.scale.setScalar(scale)

      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)

      // Color
      color.set(CONSTELLATION_COLORS[sat.group as ConstellationGroup] || '#ffffff')
      meshRef.current!.setColorAt(i, color)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  }, [satellites])

  // Handle pointer events
  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      if (e.instanceId !== undefined) {
        const sat = indexToSat.get(e.instanceId)
        if (sat) {
          setHovered(sat.noradId)
          document.body.style.cursor = 'pointer'
        }
      }
    },
    [indexToSat]
  )

  const handlePointerOut = useCallback(() => {
    setHovered(null)
    document.body.style.cursor = 'auto'
  }, [])

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      if (e.instanceId !== undefined) {
        const sat = indexToSat.get(e.instanceId)
        onSelect(sat || null)
      }
    },
    [indexToSat, onSelect]
  )

  if (satellites.length === 0) return null

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, satellites.length]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.9} />
    </instancedMesh>
  )
}

// Selected satellite highlight
function SelectedSatelliteMarker({ satellite }: { satellite: SatellitePosition }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const pos = latLonAltToVector3(satellite.latitude, satellite.longitude, satellite.altitude)

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={meshRef} position={[pos.x, pos.y, pos.z]}>
      <sphereGeometry args={[0.015, 16, 16]} />
      <meshBasicMaterial color="#ffdf20" transparent opacity={0.8} />
    </mesh>
  )
}

// Orbit path visualization
function OrbitPath({ points }: { points: OrbitPoint[] }) {
  const linePoints = useMemo(() => {
    return points.map((point) => {
      const pos = latLonAltToVector3(point.latitude, point.longitude, point.altitude)
      return [pos.x, pos.y, pos.z] as [number, number, number]
    })
  }, [points])

  if (linePoints.length < 2) return null

  return (
    <Line
      points={linePoints}
      color="#ffdf20"
      lineWidth={1}
      transparent
      opacity={0.6}
    />
  )
}

// Loading indicator
function LoadingIndicator() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 2
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 2]}>
      <ringGeometry args={[0.1, 0.12, 32]} />
      <meshBasicMaterial color="#ffdf20" transparent opacity={0.8} />
    </mesh>
  )
}

// Main scene component
function Scene({
  satellites,
  selectedSatellite,
  orbitPath,
  onSelectSatellite,
  isLoading,
}: SatelliteGlobeProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />

      {/* Starfield background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Earth */}
      <Earth />
      <Atmosphere />

      {/* Satellites */}
      {satellites.length > 0 && (
        <SatelliteInstances
          satellites={satellites}
          onSelect={onSelectSatellite}
        />
      )}

      {/* Selected satellite marker */}
      {selectedSatellite && <SelectedSatelliteMarker satellite={selectedSatellite} />}

      {/* Orbit path */}
      {orbitPath.length > 0 && <OrbitPath points={orbitPath} />}

      {/* Loading indicator */}
      {isLoading && <LoadingIndicator />}

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={10}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        makeDefault={false}
      />
    </>
  )
}

// Main exported component
export default function SatelliteGlobe(props: SatelliteGlobeProps) {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  return (
    <div
      ref={setContainerRef}
      className="w-full h-full bg-black rounded-lg overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#000' }}
        eventSource={containerRef || undefined}
        eventPrefix="client"
      >
        <Scene {...props} />
      </Canvas>
    </div>
  )
}
