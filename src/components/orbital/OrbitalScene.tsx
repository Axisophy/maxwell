'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { OrbitControls, Stars, Line } from '@react-three/drei'
import * as THREE from 'three'
import {
  getEarthPosition,
  getMoonPosition,
  getMoonHeliocentricPosition,
  getOrbitalElements,
  generateOrbitPath,
  Vector3D,
} from '@/lib/orbital/bodies'
import { getRadius, SCALE } from '@/lib/orbital/constants'

interface OrbitalSceneProps {
  time: Date
  showOrbits?: boolean
  focusTarget?: 'sun' | 'earth' | 'moon' | null
  onCameraMove?: (position: Vector3D) => void
}

// Sun component with glow effect
function Sun() {
  // Scale down sun for visibility at solar system scale
  // Real sun would be ~696 units, but we scale to ~20 for visibility
  const displayRadius = 20

  return (
    <group>
      {/* Core sun */}
      <mesh>
        <sphereGeometry args={[displayRadius, 32, 32]} />
        <meshBasicMaterial color={0xffff00} />
      </mesh>
      {/* Point light */}
      <pointLight color={0xffffff} intensity={2} distance={0} decay={0} />
    </group>
  )
}

// Earth component
function Earth({ position }: { position: Vector3D }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const radius = getRadius('earth')
  // Scale up for visibility at solar system scale
  const displayRadius = radius * 10

  // Rotate Earth on its axis
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[displayRadius, 32, 32]} />
        <meshStandardMaterial color={0x4a90d9} />
      </mesh>
    </group>
  )
}

// Moon component
function Moon({ position }: { position: Vector3D }) {
  const radius = getRadius('moon')
  // Scale up for visibility
  const displayRadius = radius * 10

  return (
    <mesh position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[displayRadius, 16, 16]} />
      <meshStandardMaterial color={0x888888} />
    </mesh>
  )
}

// Orbit path component
function OrbitPath({
  center,
  bodyName,
  color = '#444444',
}: {
  center: Vector3D
  bodyName: string
  color?: string
}) {
  const elements = getOrbitalElements(bodyName)
  const points = useMemo(() => {
    const orbitPoints = generateOrbitPath(center, elements, 128)
    return orbitPoints.map(p => [p.x, p.y, p.z] as [number, number, number])
  }, [center.x, center.y, center.z, elements])

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      opacity={0.5}
      transparent
    />
  )
}

// Camera controller with floating origin
function CameraController({
  focusTarget,
  earthPosition,
  moonPosition,
}: {
  focusTarget?: 'sun' | 'earth' | 'moon' | null
  earthPosition: Vector3D
  moonPosition: Vector3D
}) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (!focusTarget || !controlsRef.current) return

    let target: THREE.Vector3
    let distance: number

    switch (focusTarget) {
      case 'sun':
        target = new THREE.Vector3(0, 0, 0)
        distance = 500
        break
      case 'earth':
        target = new THREE.Vector3(earthPosition.x, earthPosition.y, earthPosition.z)
        distance = 200
        break
      case 'moon':
        target = new THREE.Vector3(moonPosition.x, moonPosition.y, moonPosition.z)
        distance = 50
        break
      default:
        return
    }

    // Animate camera to target
    controlsRef.current.target.copy(target)
    camera.position.set(target.x + distance, target.y + distance * 0.5, target.z + distance)
  }, [focusTarget, earthPosition, moonPosition, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      enableZoom={true}
      zoomSpeed={1.5}
      minDistance={1}
      maxDistance={1000000}
    />
  )
}

// Main scene content
function SceneContent({
  time,
  showOrbits = true,
  focusTarget,
}: OrbitalSceneProps) {
  // Calculate positions
  const earthPos = useMemo(() => getEarthPosition(time).position, [time])
  const moonHelioPos = useMemo(() => getMoonHeliocentricPosition(time).position, [time])

  // Sun is at origin
  const sunPos: Vector3D = { x: 0, y: 0, z: 0 }

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />

      {/* Stars background */}
      <Stars radius={300000} depth={100000} count={5000} factor={100} fade speed={0} />

      {/* Sun at origin */}
      <Sun />

      {/* Earth's orbit */}
      {showOrbits && <OrbitPath center={sunPos} bodyName="earth" color="#4a90d9" />}

      {/* Earth */}
      <Earth position={earthPos} />

      {/* Moon's orbit (around Earth) */}
      {showOrbits && <OrbitPath center={earthPos} bodyName="moon" color="#666666" />}

      {/* Moon (heliocentric position for correct rendering) */}
      <Moon position={moonHelioPos} />

      {/* Camera controls */}
      <CameraController
        focusTarget={focusTarget}
        earthPosition={earthPos}
        moonPosition={moonHelioPos}
      />
    </>
  )
}

// Main exported component
export default function OrbitalScene({
  time,
  showOrbits = true,
  focusTarget,
}: OrbitalSceneProps) {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 1000000,
        position: [300000, 100000, 300000],
      }}
      gl={{
        logarithmicDepthBuffer: true,
        antialias: true,
      }}
      style={{ background: '#000000' }}
    >
      <SceneContent
        time={time}
        showOrbits={showOrbits}
        focusTarget={focusTarget}
      />
    </Canvas>
  )
}
