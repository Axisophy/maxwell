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
import {
  getRadius,
  SCALE,
  DISPLAY_SCALES,
  CAMERA,
  CONTROLS,
  ANIMATION,
  STARS as STARS_CONFIG,
  ORBIT_PATH,
  LIGHTING,
  BODY_COLORS,
} from '@/lib/orbital/constants'

interface OrbitalSceneProps {
  time: Date
  showOrbits?: boolean
  focusTarget?: 'sun' | 'earth' | 'moon' | null
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
    const orbitPoints = generateOrbitPath(center, elements, ORBIT_PATH.segments)
    return orbitPoints.map(p => [p.x, p.y, p.z] as [number, number, number])
  }, [center.x, center.y, center.z, elements])

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
  earthPosition,
  moonPosition,
}: {
  focusTarget?: 'sun' | 'earth' | 'moon' | null
  earthPosition: Vector3D
  moonPosition: Vector3D
}) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const previousFocusRef = useRef<typeof focusTarget>(null)
  const animationRef = useRef<{ startTime: number; startPos: THREE.Vector3; startTarget: THREE.Vector3 } | null>(null)

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
    const targetPos = getTargetPosition(focusTarget, earthPosition, moonPosition)
    const distance = CAMERA.focusDistances[focusTarget || 'sun'] || CAMERA.focusDistances.sun

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
  focusTarget: 'sun' | 'earth' | 'moon' | null | undefined,
  earthPosition: Vector3D,
  moonPosition: Vector3D
): THREE.Vector3 {
  switch (focusTarget) {
    case 'earth':
      return new THREE.Vector3(earthPosition.x, earthPosition.y, earthPosition.z)
    case 'moon':
      return new THREE.Vector3(moonPosition.x, moonPosition.y, moonPosition.z)
    case 'sun':
    default:
      return new THREE.Vector3(0, 0, 0)
  }
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
          focusTarget={focusTarget}
        />
      </Canvas>
    </div>
  )
}
