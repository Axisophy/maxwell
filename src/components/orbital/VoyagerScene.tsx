'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Line } from '@react-three/drei'
import * as THREE from 'three'
import {
  VOYAGER_1,
  VOYAGER_2,
  VoyagerMission,
  getVoyagerPosition,
  getTrajectoryToDate,
  auToScene,
} from '@/lib/orbital/voyager-data'
import {
  getAllPlanetPositions,
} from '@/lib/orbital/bodies'
import { AU, getRadius } from '@/lib/orbital/constants'

interface VoyagerSceneProps {
  time: Date
  showOrbits?: boolean
  showPlanets?: boolean
  focusTarget?: 'sun' | 'voyager1' | 'voyager2' | 'overview' | null
}

// Sun component (scaled for visibility)
function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color={0xffff00} />
      <pointLight color={0xffffff} intensity={2} distance={0} decay={0} />
    </mesh>
  )
}

// Planet component
function Planet({
  position,
  radius,
  color,
}: {
  position: { x: number; y: number; z: number }
  radius: number
  color: number
  name: string
}) {
  // Scale planets for visibility (they'd be invisible otherwise)
  const displayRadius = Math.max(radius * 500, 0.5)

  return (
    <mesh position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[displayRadius, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// Voyager spacecraft component
function Voyager({
  mission,
  time,
  isSelected,
}: {
  mission: VoyagerMission
  time: Date
  isSelected: boolean
}) {
  const position = getVoyagerPosition(mission, time)
  if (!position) return null

  const scenePos = auToScene(position)
  const size = isSelected ? 1.5 : 1

  return (
    <group position={[scenePos.x, scenePos.y, scenePos.z]}>
      {/* Spacecraft marker */}
      <mesh>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={mission.color}
          transparent
          opacity={isSelected ? 1 : 0.8}
        />
      </mesh>
      {/* Glow ring when selected */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.5, size * 2, 32]} />
          <meshBasicMaterial
            color={mission.color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}

// Trajectory path component
function TrajectoryPath({
  mission,
  time,
}: {
  mission: VoyagerMission
  time: Date
}) {
  const points = useMemo(() => {
    return getTrajectoryToDate(mission, time)
  }, [mission, time])

  if (points.length < 2) return null

  const linePoints = points.map(p => new THREE.Vector3(p.x, p.y, p.z))

  return (
    <Line
      points={linePoints}
      color={mission.color}
      lineWidth={1}
      transparent
      opacity={0.6}
    />
  )
}

// Planet orbit paths (simplified circles)
function PlanetOrbit({
  radius,
  color = 0x333333
}: {
  radius: number
  color?: number
}) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ))
    }
    return pts
  }, [radius])

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.5}
      transparent
      opacity={0.3}
    />
  )
}

// Camera controller
function CameraController({
  focusTarget,
  voyager1Pos,
  voyager2Pos,
}: {
  focusTarget?: string | null
  voyager1Pos: { x: number; y: number; z: number } | null
  voyager2Pos: { x: number; y: number; z: number } | null
}) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const previousFocusRef = useRef<string | null>(null)

  useFrame(() => {
    if (focusTarget === previousFocusRef.current) return
    if (!controlsRef.current) return

    previousFocusRef.current = focusTarget as string | null

    let target: THREE.Vector3
    let distance: number

    switch (focusTarget) {
      case 'sun':
        target = new THREE.Vector3(0, 0, 0)
        distance = 100 * AU  // Show inner solar system
        break
      case 'voyager1':
        if (!voyager1Pos) return
        target = new THREE.Vector3(voyager1Pos.x, voyager1Pos.y, voyager1Pos.z)
        distance = 20 * AU
        break
      case 'voyager2':
        if (!voyager2Pos) return
        target = new THREE.Vector3(voyager2Pos.x, voyager2Pos.y, voyager2Pos.z)
        distance = 20 * AU
        break
      case 'overview':
      default:
        target = new THREE.Vector3(0, 0, 0)
        distance = 200 * AU  // Show full mission scope
        break
    }

    controlsRef.current.target.copy(target)
    camera.position.set(
      target.x + distance * 0.7,
      target.y + distance * 0.5,
      target.z + distance * 0.7
    )
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      enableZoom={true}
      zoomSpeed={1.5}
      minDistance={1}
      maxDistance={500 * AU}
    />
  )
}

// Main scene content
function SceneContent({
  time,
  showOrbits = true,
  showPlanets = true,
  focusTarget,
}: VoyagerSceneProps) {
  // Get planet positions
  const planets = useMemo(() => {
    if (!showPlanets) return null
    return getAllPlanetPositions(time)
  }, [time, showPlanets])

  // Planet colors and orbital radii (in AU, then converted)
  const planetData = [
    { name: 'jupiter', color: 0xd4a574, orbitRadius: 5.2 },
    { name: 'saturn', color: 0xf4d59e, orbitRadius: 9.5 },
    { name: 'uranus', color: 0x9fc5e8, orbitRadius: 19.2 },
    { name: 'neptune', color: 0x5b7bb3, orbitRadius: 30.1 },
  ]

  // Get Voyager positions for camera
  const v1Pos = getVoyagerPosition(VOYAGER_1, time)
  const v2Pos = getVoyagerPosition(VOYAGER_2, time)
  const v1Scene = v1Pos ? auToScene(v1Pos) : null
  const v2Scene = v2Pos ? auToScene(v2Pos) : null

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />

      {/* Stars */}
      <Stars
        radius={1000 * AU}
        depth={500 * AU}
        count={3000}
        factor={AU * 10}
        fade
        speed={0}
      />

      {/* Sun */}
      <Sun />

      {/* Planet orbits */}
      {showOrbits && planetData.map(p => (
        <PlanetOrbit key={p.name} radius={p.orbitRadius * AU} />
      ))}

      {/* Planets */}
      {planets && planetData.map(p => {
        const pos = planets[p.name]
        if (!pos) return null
        return (
          <Planet
            key={p.name}
            name={p.name}
            position={pos.position}
            radius={getRadius(p.name as any) || 1}
            color={p.color}
          />
        )
      })}

      {/* Voyager 1 trajectory and spacecraft */}
      <TrajectoryPath mission={VOYAGER_1} time={time} />
      <Voyager
        mission={VOYAGER_1}
        time={time}
        isSelected={focusTarget === 'voyager1'}
      />

      {/* Voyager 2 trajectory and spacecraft */}
      <TrajectoryPath mission={VOYAGER_2} time={time} />
      <Voyager
        mission={VOYAGER_2}
        time={time}
        isSelected={focusTarget === 'voyager2'}
      />

      {/* Camera controls */}
      <CameraController
        focusTarget={focusTarget}
        voyager1Pos={v1Scene}
        voyager2Pos={v2Scene}
      />
    </>
  )
}

// Main exported component
export default function VoyagerScene(props: VoyagerSceneProps) {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 2000 * AU,
        position: [100 * AU, 50 * AU, 100 * AU],
      }}
      gl={{
        logarithmicDepthBuffer: true,
        antialias: true,
      }}
      style={{ background: '#000000' }}
    >
      <SceneContent {...props} />
    </Canvas>
  )
}
