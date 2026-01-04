'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { OrbitControls, Stars, Line } from '@react-three/drei'
import * as THREE from 'three'
import {
  getEarthPosition,
  getMoonPosition,
  getMoonHeliocentricPosition,
  getAllPlanetPositions,
  getHeliocentricPosition,
  Vector3D,
} from '@/lib/orbital/bodies'
import * as Astronomy from 'astronomy-engine'
import {
  getRadius,
  AU,
  DISPLAY_SCALES,
  CAMERA,
  CONTROLS,
  ANIMATION,
  STARS as STARS_CONFIG,
  ORBIT_PATH,
  LIGHTING,
  BODY_COLORS,
  PLANET_COLORS,
  ORBITAL_PERIODS,
  ORBITAL_RADII,
} from '@/lib/orbital/constants'

interface OrbitalSceneProps {
  time: Date
  showOrbits?: boolean
  showInnerPlanets?: boolean
  showOuterPlanets?: boolean
  focusTarget?: string | null
  onCameraMove?: (position: Vector3D) => void
}

// Sun component
function Sun() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[DISPLAY_SCALES.sun, 32, 32]} />
        <meshBasicMaterial color={BODY_COLORS.sun} />
      </mesh>
      <pointLight color={0xffffff} intensity={LIGHTING.sunIntensity} distance={0} decay={0} />
    </group>
  )
}

// Earth component
function Earth({ position }: { position: Vector3D }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const displayRadius = getRadius('earth') * DISPLAY_SCALES.planet

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += ANIMATION.earthRotation
    }
  })

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[displayRadius, 32, 32]} />
        <meshStandardMaterial color={BODY_COLORS.earth} />
      </mesh>
    </group>
  )
}

// Moon component
function Moon({ position }: { position: Vector3D }) {
  const displayRadius = getRadius('moon') * DISPLAY_SCALES.planet

  return (
    <mesh position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[displayRadius, 16, 16]} />
      <meshStandardMaterial color={BODY_COLORS.moon} />
    </mesh>
  )
}

// Generate orbit path by tracing actual body positions over one period
function OrbitPath({
  bodyName,
  color = '#444444',
  segments = 128,
  time,
}: {
  bodyName: string
  color?: string
  segments?: number
  time: Date
}) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const period = ORBITAL_PERIODS[bodyName] || 365.25
    const msPerSegment = (period * 24 * 60 * 60 * 1000) / segments

    for (let i = 0; i <= segments; i++) {
      const t = new Date(time.getTime() - (period * 24 * 60 * 60 * 1000) + (i * msPerSegment))

      if (bodyName === 'moon') {
        const pos = getMoonHeliocentricPosition(t).position
        pts.push(new THREE.Vector3(pos.x, pos.y, pos.z))
      } else {
        // Map body name to Astronomy.Body
        const bodyMap: Record<string, Astronomy.Body> = {
          mercury: Astronomy.Body.Mercury,
          venus: Astronomy.Body.Venus,
          earth: Astronomy.Body.Earth,
          mars: Astronomy.Body.Mars,
          jupiter: Astronomy.Body.Jupiter,
          saturn: Astronomy.Body.Saturn,
          uranus: Astronomy.Body.Uranus,
          neptune: Astronomy.Body.Neptune,
        }
        const body = bodyMap[bodyName]
        if (body) {
          const pos = getHeliocentricPosition(body, t).position
          pts.push(new THREE.Vector3(pos.x, pos.y, pos.z))
        }
      }
    }

    return pts
  }, [bodyName, segments, time])

  return (
    <Line
      points={points}
      color={color}
      lineWidth={ORBIT_PATH.lineWidth}
      opacity={ORBIT_PATH.opacity}
      transparent
    />
  )
}

// Planet component
function Planet({
  name,
  position,
  color,
  isSelected,
}: {
  name: string
  position: { x: number; y: number; z: number }
  color: number
  isSelected?: boolean
}) {
  // Scale planets for visibility - outer planets larger
  const baseSize = ORBITAL_RADII[name] > 5 ? 3 : ORBITAL_RADII[name] > 1 ? 1.5 : 1
  const size = isSelected ? baseSize * 1.3 : baseSize

  return (
    <mesh position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// Orbit ring for a planet (simplified circular)
function PlanetOrbitRing({
  radiusAU,
  color,
  opacity = 0.3,
}: {
  radiusAU: number
  color: number
  opacity?: number
}) {
  const radius = radiusAU * AU

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

// Camera controller with smooth transitions
function CameraController({
  focusTarget,
  planetPositions,
  moonPosition,
}: {
  focusTarget?: string | null
  planetPositions: Record<string, { position: Vector3D }>
  moonPosition: Vector3D
}) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const previousFocusRef = useRef<typeof focusTarget>(null)
  const animationRef = useRef<{ startTime: number; startPos: THREE.Vector3; startTarget: THREE.Vector3 } | null>(null)

  // Get focus distance based on target (outer planets need more distance)
  const getFocusDistance = (target: string | null | undefined): number => {
    if (!target || target === 'sun') return CAMERA.focusDistances.sun
    if (target === 'moon') return CAMERA.focusDistances.moon
    const radius = ORBITAL_RADII[target] || 1
    if (radius > 5) return 1000  // Outer planets
    if (radius > 1) return 400   // Mars
    return CAMERA.focusDistances.earth  // Inner planets
  }

  // Smooth camera transition using useFrame
  useFrame(() => {
    if (!animationRef.current || !controlsRef.current) return

    const elapsed = Date.now() - animationRef.current.startTime
    const progress = Math.min(elapsed / CAMERA.transitionDuration, 1)
    // Ease out cubic for smooth deceleration
    const eased = 1 - Math.pow(1 - progress, 3)

    if (progress >= 1) {
      animationRef.current = null
      return
    }

    // Interpolate camera position and target
    const currentTarget = controlsRef.current.target
    const targetPos = getTargetPosition(focusTarget, planetPositions, moonPosition)
    const distance = getFocusDistance(focusTarget)

    currentTarget.lerp(targetPos, eased * 0.1)

    const endPos = new THREE.Vector3(
      targetPos.x + distance,
      targetPos.y + distance * 0.5,
      targetPos.z + distance
    )
    camera.position.lerp(endPos, eased * 0.1)
  })

  useEffect(() => {
    if (!focusTarget || !controlsRef.current) return
    if (focusTarget === previousFocusRef.current) return

    // Start smooth transition
    animationRef.current = {
      startTime: Date.now(),
      startPos: camera.position.clone(),
      startTarget: controlsRef.current.target.clone(),
    }

    previousFocusRef.current = focusTarget
  }, [focusTarget, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={CONTROLS.dampingFactor}
      enableZoom
      enablePan
      enableRotate
      zoomSpeed={CONTROLS.zoomSpeed}
      minDistance={CONTROLS.minDistance}
      maxDistance={CONTROLS.maxDistance}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
    />
  )
}

// Helper to get target position based on focus
function getTargetPosition(
  focusTarget: string | null | undefined,
  planetPositions: Record<string, { position: Vector3D }>,
  moonPosition: Vector3D
): THREE.Vector3 {
  if (!focusTarget || focusTarget === 'sun') {
    return new THREE.Vector3(0, 0, 0)
  }
  if (focusTarget === 'moon') {
    return new THREE.Vector3(moonPosition.x, moonPosition.y, moonPosition.z)
  }
  const planet = planetPositions[focusTarget]
  if (planet) {
    return new THREE.Vector3(planet.position.x, planet.position.y, planet.position.z)
  }
  return new THREE.Vector3(0, 0, 0)
}

// Planet list with metadata
const PLANETS = [
  { name: 'mercury', inner: true },
  { name: 'venus', inner: true },
  { name: 'earth', inner: true },
  { name: 'mars', inner: true },
  { name: 'jupiter', inner: false },
  { name: 'saturn', inner: false },
  { name: 'uranus', inner: false },
  { name: 'neptune', inner: false },
]

// Main scene content
function SceneContent({
  time,
  showOrbits = true,
  showInnerPlanets = true,
  showOuterPlanets = true,
  focusTarget,
}: OrbitalSceneProps) {
  // Get all planet positions
  const planetPositions = useMemo(() => getAllPlanetPositions(time), [time])
  const moonHelioPos = useMemo(() => getMoonHeliocentricPosition(time).position, [time])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={LIGHTING.ambientIntensity} />

      {/* Stars background */}
      <Stars
        radius={STARS_CONFIG.radius}
        depth={STARS_CONFIG.depth}
        count={STARS_CONFIG.count}
        factor={STARS_CONFIG.factor}
        fade
        speed={0}
      />

      {/* Sun at origin */}
      <Sun />

      {/* Planet orbit rings */}
      {showOrbits && PLANETS.map(p => {
        const show = p.inner ? showInnerPlanets : showOuterPlanets
        if (!show) return null
        return (
          <PlanetOrbitRing
            key={`orbit-${p.name}`}
            radiusAU={ORBITAL_RADII[p.name]}
            color={PLANET_COLORS[p.name]}
            opacity={0.2}
          />
        )
      })}

      {/* Planets */}
      {PLANETS.map(p => {
        const show = p.inner ? showInnerPlanets : showOuterPlanets
        if (!show) return null
        const pos = planetPositions[p.name]
        if (!pos) return null

        // Use Earth component for earth (has rotation animation)
        if (p.name === 'earth') {
          return <Earth key={p.name} position={pos.position} />
        }

        return (
          <Planet
            key={p.name}
            name={p.name}
            position={pos.position}
            color={PLANET_COLORS[p.name]}
            isSelected={focusTarget === p.name}
          />
        )
      })}

      {/* Moon (special case - orbits Earth) */}
      {showInnerPlanets && (
        <Moon position={moonHelioPos} />
      )}

      {/* Moon orbit path (traced from actual positions) */}
      {showOrbits && showInnerPlanets && (
        <OrbitPath bodyName="moon" color="#888888" time={time} />
      )}

      {/* Camera controls */}
      <CameraController
        focusTarget={focusTarget}
        planetPositions={planetPositions}
        moonPosition={moonHelioPos}
      />
    </>
  )
}

// Main exported component
export default function OrbitalScene({
  time,
  showOrbits = true,
  showInnerPlanets = true,
  showOuterPlanets = true,
  focusTarget,
}: OrbitalSceneProps) {
  // Prevent scroll events from bubbling to page
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className="w-full h-full"
      onWheel={handleWheel}
      style={{ touchAction: 'none' }}
    >
      <Canvas
        camera={{
          fov: CAMERA.fov,
          near: CAMERA.near,
          far: CAMERA.far,
          position: CAMERA.initialPosition as [number, number, number],
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
          showInnerPlanets={showInnerPlanets}
          showOuterPlanets={showOuterPlanets}
          focusTarget={focusTarget}
        />
      </Canvas>
    </div>
  )
}
