'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import {
  VOYAGER_1,
  VOYAGER_2,
  VoyagerMission,
  MissionMilestone,
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
  showHeliopause?: boolean
  showFlybyMarkers?: boolean
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

// Planet component with labels
function Planet({
  position,
  radius,
  color,
  name,
}: {
  position: { x: number; y: number; z: number }
  radius: number
  color: number
  name: string
}) {
  // Make planets much more visible at solar system scale
  // Real planets would be invisible, so we exaggerate significantly
  const displayRadius = name === 'jupiter' ? 3 :
                        name === 'saturn' ? 2.5 :
                        name === 'uranus' ? 1.8 :
                        name === 'neptune' ? 1.8 : 1

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh>
        <sphereGeometry args={[displayRadius, 24, 24]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Add a subtle glow ring to make planets more visible */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[displayRadius * 1.2, displayRadius * 1.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Planet label */}
      <Html
        position={[0, displayRadius * 2.5, 0]}
        center
        style={{
          color: 'white',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          opacity: 0.7,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </Html>
    </group>
  )
}

// Voyager spacecraft component
function Voyager({
  mission,
  time,
  isSelected,
  showLabel = true,
}: {
  mission: VoyagerMission
  time: Date
  isSelected: boolean
  showLabel?: boolean
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
      {/* Spacecraft label */}
      {showLabel && (
        <Html
          position={[0, size * 3, 0]}
          center
          style={{
            color: mission.id === 'voyager1' ? '#00ff88' : '#00aaff',
            fontSize: '11px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textShadow: '0 0 10px rgba(0,0,0,0.8)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {mission.name}
          <div style={{ fontSize: '9px', opacity: 0.7, marginTop: '2px' }}>
            {position.distance.toFixed(1)} AU
          </div>
        </Html>
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
      lineWidth={2}
      transparent
      opacity={0.8}
    />
  )
}

// Planetary orbit ring (simplified circular orbits)
function PlanetOrbitRing({
  semiMajorAxisAU,
  color = 0x333333,
  opacity = 0.2
}: {
  semiMajorAxisAU: number
  color?: number
  opacity?: number
}) {
  const radius = semiMajorAxisAU * AU

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,  // Ecliptic plane
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
      opacity={opacity}
    />
  )
}

// Heliopause boundary sphere
function Heliopause({ show }: { show: boolean }) {
  if (!show) return null

  const radius = 120 * AU  // Approximately 120 AU

  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 32]} />
      <meshBasicMaterial
        color={0x8844aa}
        transparent
        opacity={0.03}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

// Heliosphere ring at the ecliptic
function HeliosphereRing({ show }: { show: boolean }) {
  if (!show) return null

  const radius = 120 * AU

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ))
    }
    return pts
  }, [])

  return (
    <Line
      points={points}
      color={0x8844aa}
      lineWidth={1}
      transparent
      opacity={0.3}
    />
  )
}

// Flyby marker component
function FlybyMarker({
  mission,
  milestone,
}: {
  mission: VoyagerMission
  milestone: MissionMilestone
}) {
  const position = useMemo(() => {
    const pos = getVoyagerPosition(mission, new Date(milestone.date))
    return pos ? auToScene(pos) : null
  }, [mission, milestone])

  if (!position || !milestone.body) return null

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Marker sphere */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color={0xffffff} />
      </mesh>
      {/* Pulse ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.5, 32]} />
        <meshBasicMaterial
          color={mission.color}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// Distance scale bar
function DistanceScale() {
  const scaleLength = 10 * AU  // 10 AU scale bar

  return (
    <group position={[-50 * AU, -20 * AU, 0]}>
      {/* Scale line */}
      <Line
        points={[
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(scaleLength, 0, 0),
        ]}
        color={0xffffff}
        lineWidth={2}
        transparent
        opacity={0.5}
      />
      {/* End caps */}
      <Line
        points={[
          new THREE.Vector3(0, -AU, 0),
          new THREE.Vector3(0, AU, 0),
        ]}
        color={0xffffff}
        lineWidth={2}
        transparent
        opacity={0.5}
      />
      <Line
        points={[
          new THREE.Vector3(scaleLength, -AU, 0),
          new THREE.Vector3(scaleLength, AU, 0),
        ]}
        color={0xffffff}
        lineWidth={2}
        transparent
        opacity={0.5}
      />
      {/* Label */}
      <Html
        position={[scaleLength / 2, -3 * AU, 0]}
        center
        style={{
          color: 'white',
          fontSize: '10px',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      >
        10 AU (~1.5 billion km)
      </Html>
    </group>
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
  showHeliopause = false,
  showFlybyMarkers = false,
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

  // Get flyby milestones for current time
  const v1Flybys = useMemo(() =>
    VOYAGER_1.milestones.filter(m => m.body && m.date <= time.toISOString().split('T')[0]),
    [time]
  )
  const v2Flybys = useMemo(() =>
    VOYAGER_2.milestones.filter(m => m.body && m.date <= time.toISOString().split('T')[0]),
    [time]
  )

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

      {/* Heliopause boundary */}
      <Heliopause show={showHeliopause} />
      <HeliosphereRing show={showHeliopause} />

      {/* Planet orbits */}
      {showOrbits && planetData.map(p => (
        <PlanetOrbitRing
          key={p.name}
          semiMajorAxisAU={p.orbitRadius}
          color={p.color}
          opacity={0.4}
        />
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

      {/* Flyby markers */}
      {showFlybyMarkers && v1Flybys.map(milestone => (
        <FlybyMarker
          key={`v1-${milestone.date}`}
          mission={VOYAGER_1}
          milestone={milestone}
        />
      ))}
      {showFlybyMarkers && v2Flybys.map(milestone => (
        <FlybyMarker
          key={`v2-${milestone.date}`}
          mission={VOYAGER_2}
          milestone={milestone}
        />
      ))}

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

      {/* Distance scale */}
      <DistanceScale />

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
