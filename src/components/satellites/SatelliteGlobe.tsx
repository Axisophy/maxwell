'use client'

import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber'
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
  // Using a reliable CDN source
  const texture = useTexture(
    'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg'
  )

  // Rotate Earth slowly (once per day = very slow)
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

// Satellite points visualization
function SatellitePoints({
  satellites,
  selectedSatellite,
  onSelect,
}: {
  satellites: SatellitePosition[]
  selectedSatellite: SatellitePosition | null
  onSelect: (sat: SatellitePosition | null) => void
}) {
  const pointsRef = useRef<THREE.Points>(null)
  const { camera, raycaster, pointer } = useThree()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Create geometry from positions
  const { geometry, satelliteMap } = useMemo(() => {
    const positions: number[] = []
    const colors: number[] = []
    const sizes: number[] = []
    const map: Map<number, SatellitePosition> = new Map()

    satellites.forEach((sat, index) => {
      const pos = latLonAltToVector3(sat.latitude, sat.longitude, sat.altitude)
      positions.push(pos.x, pos.y, pos.z)

      // Color based on group - use shared constants
      const color = new THREE.Color(CONSTELLATION_COLORS[sat.group as ConstellationGroup] || '#ffffff')
      colors.push(color.r, color.g, color.b)

      // Size based on importance - larger dots for visibility
      const size = sat.group === 'stations' ? 0.04 : 0.02
      sizes.push(size)

      map.set(index, sat)
    })

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

    return { geometry: geo, satelliteMap: map }
  }, [satellites])

  // Handle click on satellites
  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation()

      if (!pointsRef.current) return

      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObject(pointsRef.current)

      if (intersects.length > 0 && intersects[0].index !== undefined) {
        const sat = satelliteMap.get(intersects[0].index)
        if (sat) {
          onSelect(sat)
        }
      }
    },
    [camera, raycaster, pointer, satelliteMap, onSelect]
  )

  // Custom shader for better point rendering
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          selectedId: { value: -1 },
        },
        vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (500.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
        fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
        transparent: true,
        depthWrite: false,
      }),
    []
  )

  // Handle hover for pointer cursor
  const handlePointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation()
      if (!pointsRef.current) return
      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObject(pointsRef.current)
      if (intersects.length > 0 && intersects[0].index !== undefined) {
        setHoveredIndex(intersects[0].index)
        document.body.style.cursor = 'pointer'
      } else {
        setHoveredIndex(null)
        document.body.style.cursor = 'default'
      }
    },
    [camera, raycaster, pointer]
  )

  const handlePointerLeave = useCallback(() => {
    setHoveredIndex(null)
    document.body.style.cursor = 'default'
  }, [])

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    />
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
        <SatellitePoints
          satellites={satellites}
          selectedSatellite={selectedSatellite}
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
      />
    </>
  )
}

// Main exported component
export default function SatelliteGlobe(props: SatelliteGlobeProps) {
  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#000' }}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  )
}
