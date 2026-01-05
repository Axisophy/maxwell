'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import {
  COMETS,
  Comet,
  CometPosition,
  getCometPosition,
  generateCometOrbit,
} from '@/lib/orbital/comets-data'
import { AU, PLANET_COLORS } from '@/lib/orbital/constants'

interface CometsSceneProps {
  time: Date
  selectedComet: string | null
  onSelectComet: (id: string | null) => void
  showOrbits?: boolean
  showPlanetOrbits?: boolean
  showLabels?: boolean
  visibleComets?: string[]
}

// Sun component
function Sun() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color={0xffdd44} />
      </mesh>
      <pointLight color={0xffffff} intensity={2} distance={0} decay={0} />
    </group>
  )
}

// Reference planet orbits (simplified circles)
function PlanetOrbitRing({
  name,
  radiusAU,
  color,
}: {
  name: string
  radiusAU: number
  color: number
}) {
  const radius = radiusAU * AU

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const segments = 64
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ))
    }
    return pts
  }, [radius])

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={0.3}
        transparent
        opacity={0.15}
      />
      {/* Label at one point on the orbit */}
      <Html
        position={[radius, 0, 0]}
        center
        style={{
          color: `#${color.toString(16).padStart(6, '0')}`,
          fontSize: '9px',
          opacity: 0.4,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </Html>
    </group>
  )
}

// Comet tail component
function CometTail({
  position,
  tailDirection,
  distance,
  color,
  isSelected,
}: {
  position: CometPosition
  tailDirection: { x: number; y: number; z: number }
  distance: number
  color: number
  isSelected: boolean
}) {
  // Tail length depends on distance from Sun (shorter when far away)
  const baseTailLength = Math.max(0.5, 5 / Math.sqrt(distance)) * AU
  const tailLength = isSelected ? baseTailLength * 1.2 : baseTailLength

  // Only show tail if close enough to Sun
  if (distance > 5) return null

  const points = [
    new THREE.Vector3(position.x * AU, position.z * AU, position.y * AU),
    new THREE.Vector3(
      (position.x + tailDirection.x * tailLength / AU) * AU,
      (position.z + tailDirection.z * tailLength / AU) * AU,
      (position.y + tailDirection.y * tailLength / AU) * AU
    ),
  ]

  return (
    <Line
      points={points}
      color={color}
      lineWidth={isSelected ? 3 : 2}
      transparent
      opacity={isSelected ? 0.8 : 0.5}
    />
  )
}

// Comet marker component
function CometMarker({
  comet,
  position,
  isSelected,
  onSelect,
  showLabel,
}: {
  comet: Comet
  position: CometPosition
  isSelected: boolean
  onSelect: () => void
  showLabel: boolean
}) {
  const size = isSelected ? 1.5 : 1

  // Position in scene coordinates (swap y/z for Three.js)
  const scenePos = {
    x: position.x * AU,
    y: position.z * AU,
    z: position.y * AU,
  }

  return (
    <group position={[scenePos.x, scenePos.y, scenePos.z]}>
      {/* Comet nucleus */}
      <mesh onClick={onSelect}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={comet.color}
          transparent
          opacity={isSelected ? 1 : 0.8}
        />
      </mesh>

      {/* Coma (fuzzy atmosphere) */}
      {position.distance < 5 && (
        <mesh>
          <sphereGeometry args={[size * 2, 16, 16]} />
          <meshBasicMaterial
            color={comet.color}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 2, size * 2.5, 32]} />
          <meshBasicMaterial
            color={comet.color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Tail */}
      <CometTail
        position={position}
        tailDirection={position.tailDirection}
        distance={position.distance}
        color={comet.color}
        isSelected={isSelected}
      />

      {/* Label */}
      {showLabel && (
        <Html
          position={[0, size * 4, 0]}
          center
          style={{
            color: `#${comet.color.toString(16).padStart(6, '0')}`,
            fontSize: '10px',
            fontWeight: isSelected ? 600 : 400,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textShadow: '0 0 10px rgba(0,0,0,0.9)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            opacity: isSelected ? 1 : 0.7,
          }}
        >
          {comet.name}
        </Html>
      )}
    </group>
  )
}

// Comet orbit path
function CometOrbitPath({
  comet,
  isSelected,
}: {
  comet: Comet
  isSelected: boolean
}) {
  const points = useMemo(() => {
    const orbitPoints = generateCometOrbit(comet, 512)
    return orbitPoints.map(p => new THREE.Vector3(p.x * AU, p.z * AU, p.y * AU))
  }, [comet])

  if (points.length < 2) return null

  return (
    <Line
      points={points}
      color={comet.color}
      lineWidth={isSelected ? 1 : 0.5}
      transparent
      opacity={isSelected ? 0.6 : 0.2}
      dashed={!isSelected}
      dashSize={isSelected ? 0 : 10}
      gapSize={isSelected ? 0 : 5}
    />
  )
}

// Camera controller
function CameraController({
  selectedComet,
  cometPositions,
}: {
  selectedComet: string | null
  cometPositions: Record<string, CometPosition>
}) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const previousSelectionRef = useRef<string | null>(null)
  const animationRef = useRef<{
    startTime: number
    startPos: THREE.Vector3
    startTarget: THREE.Vector3
    endPos: THREE.Vector3
    endTarget: THREE.Vector3
  } | null>(null)

  // Smooth camera animation
  useFrame(() => {
    if (!animationRef.current || !controlsRef.current) return

    const elapsed = Date.now() - animationRef.current.startTime
    const progress = Math.min(elapsed / 1000, 1)
    const eased = 1 - Math.pow(1 - progress, 3)

    camera.position.lerpVectors(
      animationRef.current.startPos,
      animationRef.current.endPos,
      eased
    )

    controlsRef.current.target.lerpVectors(
      animationRef.current.startTarget,
      animationRef.current.endTarget,
      eased
    )

    if (progress >= 1) {
      animationRef.current = null
    }
  })

  // Start animation when selection changes
  useFrame(() => {
    if (selectedComet === previousSelectionRef.current) return
    previousSelectionRef.current = selectedComet

    if (!controlsRef.current) return

    let targetPos = new THREE.Vector3(0, 0, 0)
    let distance = 500

    if (selectedComet && cometPositions[selectedComet]) {
      const pos = cometPositions[selectedComet]
      targetPos = new THREE.Vector3(pos.x * AU, pos.z * AU, pos.y * AU)
      distance = Math.max(50, pos.distance * AU * 0.5)
    }

    animationRef.current = {
      startTime: Date.now(),
      startPos: camera.position.clone(),
      startTarget: controlsRef.current.target.clone(),
      endPos: new THREE.Vector3(
        targetPos.x + distance,
        targetPos.y + distance * 0.5,
        targetPos.z + distance
      ),
      endTarget: targetPos,
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      enableZoom
      zoomSpeed={1.5}
      minDistance={10}
      maxDistance={100000}
    />
  )
}

// Main scene content
function SceneContent({
  time,
  selectedComet,
  onSelectComet,
  showOrbits = true,
  showPlanetOrbits = true,
  showLabels = true,
  visibleComets,
}: CometsSceneProps) {
  // Calculate positions for all comets
  const cometPositions = useMemo(() => {
    const positions: Record<string, CometPosition> = {}
    COMETS.forEach(comet => {
      try {
        positions[comet.id] = getCometPosition(comet, time)
      } catch (error) {
        console.warn(`Failed to calculate position for ${comet.name}:`, error)
      }
    })
    return positions
  }, [time])

  // Filter visible comets
  const cometsToShow = visibleComets
    ? COMETS.filter(c => visibleComets.includes(c.id))
    : COMETS

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />

      {/* Stars background */}
      <Stars
        radius={50000}
        depth={10000}
        count={5000}
        factor={4}
        fade
        speed={0}
      />

      {/* Sun */}
      <Sun />

      {/* Reference planet orbits */}
      {showPlanetOrbits && (
        <>
          <PlanetOrbitRing name="Earth" radiusAU={1.0} color={PLANET_COLORS.earth} />
          <PlanetOrbitRing name="Mars" radiusAU={1.524} color={PLANET_COLORS.mars} />
          <PlanetOrbitRing name="Jupiter" radiusAU={5.203} color={PLANET_COLORS.jupiter} />
          <PlanetOrbitRing name="Saturn" radiusAU={9.537} color={PLANET_COLORS.saturn} />
          <PlanetOrbitRing name="Uranus" radiusAU={19.19} color={PLANET_COLORS.uranus} />
          <PlanetOrbitRing name="Neptune" radiusAU={30.07} color={PLANET_COLORS.neptune} />
        </>
      )}

      {/* Comet orbits */}
      {showOrbits && cometsToShow.map(comet => (
        <CometOrbitPath
          key={`orbit-${comet.id}`}
          comet={comet}
          isSelected={selectedComet === comet.id}
        />
      ))}

      {/* Comet markers */}
      {cometsToShow.map(comet => {
        const position = cometPositions[comet.id]
        if (!position) return null

        return (
          <CometMarker
            key={comet.id}
            comet={comet}
            position={position}
            isSelected={selectedComet === comet.id}
            onSelect={() => onSelectComet(
              selectedComet === comet.id ? null : comet.id
            )}
            showLabel={showLabels}
          />
        )
      })}

      {/* Camera controls */}
      <CameraController
        selectedComet={selectedComet}
        cometPositions={cometPositions}
      />
    </>
  )
}

// Main exported component
export default function CometsScene(props: CometsSceneProps) {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 1000000,
        position: [300, 150, 300],
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
