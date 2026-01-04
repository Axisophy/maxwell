'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
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
  AU,
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
  DISPLAY_SCALES,
  getRadius,
} from '@/lib/orbital/constants'

interface OrbitalSceneProps {
  time: Date
  showOrbits?: boolean
  showInnerPlanets?: boolean
  showOuterPlanets?: boolean
  focusTarget?: string | null
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

// Map body names to Astronomy.Body
const ASTRONOMY_BODIES: Record<string, Astronomy.Body> = {
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  earth: Astronomy.Body.Earth,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
}

// Sun component
function Sun() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[DISPLAY_SCALES.sun, 32, 32]} />
        <meshBasicMaterial color={BODY_COLORS.sun} />
      </mesh>
      <pointLight
        color={0xffffff}
        intensity={LIGHTING.sunIntensity}
        distance={0}
        decay={0}
      />
    </group>
  )
}

// Earth component with rotation
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

// Generic planet component
function Planet({
  name,
  position,
  color,
  isSelected,
}: {
  name: string
  position: Vector3D
  color: number
  isSelected?: boolean
}) {
  const radius = ORBITAL_RADII[name] || 1
  const baseSize = radius > 5 ? 3 : radius > 1 ? 1.5 : 1
  const size = isSelected ? baseSize * 1.3 : baseSize

  return (
    <mesh position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

/**
 * Traced orbit path - generates path by calculating actual positions over one orbital period.
 * This ensures the orbit path always connects to the body's current position.
 */
function TracedOrbitPath({
  bodyName,
  color,
  time,
  segments = 128,
}: {
  bodyName: string
  color: string
  time: Date
  segments?: number
}) {
  const points = useMemo(() => {
    try {
      const pts: THREE.Vector3[] = []
      const period = ORBITAL_PERIODS[bodyName] || 365.25
      const msPerSegment = (period * 24 * 60 * 60 * 1000) / segments

      for (let i = 0; i <= segments; i++) {
        const t = new Date(time.getTime() - (period * 24 * 60 * 60 * 1000) + (i * msPerSegment))

        const body = ASTRONOMY_BODIES[bodyName]
        if (body) {
          const pos = getHeliocentricPosition(body, t).position
          pts.push(new THREE.Vector3(pos.x, pos.y, pos.z))
        }
      }

      return pts
    } catch (error) {
      console.warn(`Failed to generate orbit path for ${bodyName}:`, error)
      return []
    }
  }, [bodyName, time, segments])

  if (points.length === 0) return null

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

/**
 * Moon orbit path - draws the Moon's orbit centered on Earth's current position.
 * Uses geocentric moon positions offset by Earth's heliocentric position.
 */
function MoonOrbitPath({
  earthPosition,
  time,
  color = '#888888',
  segments = 64,
}: {
  earthPosition: Vector3D
  time: Date
  color?: string
  segments?: number
}) {
  const points = useMemo(() => {
    try {
      const pts: THREE.Vector3[] = []
      const period = ORBITAL_PERIODS.moon
      const msPerSegment = (period * 24 * 60 * 60 * 1000) / segments

      for (let i = 0; i <= segments; i++) {
        const t = new Date(time.getTime() - (period * 24 * 60 * 60 * 1000) + (i * msPerSegment))

        // Get moon position relative to Earth (geocentric)
        const moonGeo = getMoonPosition(t).position

        // Offset by Earth's current position to keep orbit visually attached to Earth
        pts.push(new THREE.Vector3(
          earthPosition.x + moonGeo.x,
          earthPosition.y + moonGeo.y,
          earthPosition.z + moonGeo.z
        ))
      }

      return pts
    } catch (error) {
      console.warn('Failed to generate Moon orbit path:', error)
      return []
    }
  }, [earthPosition, time, segments])

  if (points.length === 0) return null

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
  const previousFocusRef = useRef<string | null>(null)
  const animationRef = useRef<{
    startTime: number
    startPos: THREE.Vector3
    startTarget: THREE.Vector3
    endPos: THREE.Vector3
    endTarget: THREE.Vector3
  } | null>(null)

  // Get focus distance based on target
  const getFocusDistance = (target: string | null | undefined): number => {
    if (!target) return CAMERA.focusDistances.sun
    return (CAMERA.focusDistances as Record<string, number>)[target] || CAMERA.focusDistances.earth
  }

  // Get target position
  const getTargetPosition = (target: string | null | undefined): THREE.Vector3 => {
    if (!target || target === 'sun') {
      return new THREE.Vector3(0, 0, 0)
    }
    if (target === 'moon') {
      return new THREE.Vector3(moonPosition.x, moonPosition.y, moonPosition.z)
    }
    const planet = planetPositions[target]
    if (planet) {
      return new THREE.Vector3(
        planet.position.x,
        planet.position.y,
        planet.position.z
      )
    }
    return new THREE.Vector3(0, 0, 0)
  }

  // Smooth camera animation
  useFrame(() => {
    if (!animationRef.current || !controlsRef.current) return

    const elapsed = Date.now() - animationRef.current.startTime
    const progress = Math.min(elapsed / CAMERA.transitionDuration, 1)

    // Ease out cubic for smooth deceleration
    const eased = 1 - Math.pow(1 - progress, 3)

    // Interpolate position
    camera.position.lerpVectors(
      animationRef.current.startPos,
      animationRef.current.endPos,
      eased
    )

    // Interpolate target
    controlsRef.current.target.lerpVectors(
      animationRef.current.startTarget,
      animationRef.current.endTarget,
      eased
    )

    if (progress >= 1) {
      animationRef.current = null
    }
  })

  // Start animation when focus changes
  useFrame(() => {
    if (!focusTarget || focusTarget === previousFocusRef.current) return
    if (!controlsRef.current) return

    const targetPos = getTargetPosition(focusTarget)
    const distance = getFocusDistance(focusTarget)

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

    previousFocusRef.current = focusTarget
  })

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

// Main scene content
function SceneContent({
  time,
  showOrbits = true,
  showInnerPlanets = true,
  showOuterPlanets = true,
  focusTarget,
}: OrbitalSceneProps) {
  // Get all planet positions with error handling
  const planetPositions = useMemo(() => {
    try {
      return getAllPlanetPositions(time)
    } catch (error) {
      console.warn('Failed to calculate planet positions:', error)
      return {}
    }
  }, [time])

  // Get moon position (heliocentric for rendering)
  const moonHelioPos = useMemo(() => {
    try {
      return getMoonHeliocentricPosition(time).position
    } catch (error) {
      console.warn('Failed to calculate Moon position:', error)
      return { x: AU + 0.00257 * AU, y: 0, z: 0 }
    }
  }, [time])

  // Get Earth position for moon orbit centering
  const earthPos = planetPositions.earth?.position || { x: AU, y: 0, z: 0 }

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

      {/* Planet orbit paths (traced from actual positions) */}
      {showOrbits && PLANETS.map(p => {
        const show = p.inner ? showInnerPlanets : showOuterPlanets
        if (!show) return null
        return (
          <TracedOrbitPath
            key={`orbit-${p.name}`}
            bodyName={p.name}
            color={`#${PLANET_COLORS[p.name].toString(16).padStart(6, '0')}`}
            time={time}
            segments={p.inner ? ORBIT_PATH.segments.inner : ORBIT_PATH.segments.outer}
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

      {/* Moon */}
      {showInnerPlanets && (
        <Moon position={moonHelioPos} />
      )}

      {/* Moon orbit path (centered on Earth) */}
      {showOrbits && showInnerPlanets && (
        <MoonOrbitPath
          earthPosition={earthPos}
          time={time}
          color="#888888"
          segments={ORBIT_PATH.segments.moon}
        />
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
