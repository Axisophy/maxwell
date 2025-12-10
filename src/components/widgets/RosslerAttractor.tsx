'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'

// ===========================================
// RÖSSLER ATTRACTOR WIDGET
// ===========================================
// A strange attractor - a chaotic system that creates
// beautiful, never-repeating patterns. Discovered by
// Otto Rössler in 1976 while studying chemical reactions.
// ===========================================

interface AttractorParams {
  a: number
  b: number
  c: number
}

const DEFAULT_PARAMS: AttractorParams = { a: 0.2, b: 0.2, c: 5.7 }

export default function RosslerAttractor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const lineRef = useRef<THREE.Line | null>(null)
  const animationRef = useRef<number>(0)

  const [params, setParams] = useState<AttractorParams>(DEFAULT_PARAMS)
  const [view, setView] = useState<string>('3D')
  const [zoom, setZoom] = useState(1)
  const [speed, setSpeed] = useState(0.5)
  const [isRunning, setIsRunning] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Refs for animation loop
  const viewRef = useRef(view)
  const zoomRef = useRef(zoom)
  const speedRef = useRef(speed)
  const isRunningRef = useRef(isRunning)

  useEffect(() => {
    viewRef.current = view
  }, [view])
  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])
  useEffect(() => {
    speedRef.current = speed
  }, [speed])
  useEffect(() => {
    isRunningRef.current = isRunning
  }, [isRunning])

  // Compute attractor points
  const computeAttractor = useCallback(
    (p: AttractorParams, numPoints: number = 50000) => {
      const { a, b, c } = p
      const points: THREE.Vector3[] = []

      let x = 0.1,
        y = 0,
        z = 0
      const dt = 0.01

      // Warm up
      for (let i = 0; i < 1000; i++) {
        const dx = -y - z
        const dy = x + a * y
        const dz = b + z * (x - c)
        x += dx * dt
        y += dy * dt
        z += dz * dt
      }

      // Generate points
      for (let i = 0; i < numPoints; i++) {
        const dx = -y - z
        const dy = x + a * y
        const dz = b + z * (x - c)
        x += dx * dt
        y += dy * dt
        z += dz * dt
        points.push(new THREE.Vector3(x * 0.5, y * 0.5, z * 0.5))
      }

      return points
    },
    []
  )

  // Initialize Three.js
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !mounted) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    if (width === 0 || height === 0) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a1a)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(0, 0, 30)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create attractor line
    const points = computeAttractor(params)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    // Color gradient along the line
    const colors: number[] = []
    for (let i = 0; i < points.length; i++) {
      const t = i / points.length
      // Amber to teal gradient
      colors.push(0.9 - t * 0.7, 0.5 + t * 0.3, 0.2 + t * 0.6)
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    })
    const line = new THREE.Line(geometry, material)
    scene.add(line)
    lineRef.current = line

    // Animation
    let time = 0
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      if (lineRef.current && cameraRef.current) {
        cameraRef.current.position.z = 30 / zoomRef.current

        const currentView = viewRef.current
        if (currentView === '3D') {
          if (isRunningRef.current) {
            time += 0.005 * speedRef.current
          }
          lineRef.current.rotation.y = time
          lineRef.current.rotation.x = Math.sin(time * 0.5) * 0.3
        } else if (currentView === 'XY') {
          lineRef.current.rotation.set(0, 0, 0)
        } else if (currentView === 'XZ') {
          lineRef.current.rotation.set(-Math.PI / 2, 0, 0)
        } else if (currentView === 'YZ') {
          lineRef.current.rotation.set(0, Math.PI / 2, 0)
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      if (w === 0 || h === 0) return
      cameraRef.current.aspect = w / h
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(animationRef.current)
      resizeObserver.disconnect()
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [mounted, computeAttractor, params])

  // Update attractor when params change
  useEffect(() => {
    if (!lineRef.current) return

    const points = computeAttractor(params)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    const colors: number[] = []
    for (let i = 0; i < points.length; i++) {
      const t = i / points.length
      colors.push(0.9 - t * 0.7, 0.5 + t * 0.3, 0.2 + t * 0.6)
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    lineRef.current.geometry.dispose()
    lineRef.current.geometry = geometry
  }, [params, computeAttractor])

  // Reset to defaults
  const reset = () => {
    setParams(DEFAULT_PARAMS)
    setZoom(1)
    setSpeed(0.5)
    setView('3D')
    setIsRunning(true)
  }

  return (
    <div className="p-4 space-y-4">
      {/* 3D Canvas */}
      <div
        ref={containerRef}
        className="w-full aspect-square bg-[#1a1a1a] rounded-lg overflow-hidden"
      />

      {/* View selector */}
      <div className="flex gap-1 p-1 bg-[#e5e5e5] rounded-lg">
        {['3D', 'XY', 'XZ', 'YZ'].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="flex-1 py-2 text-sm font-mono rounded-md transition-colors"
            style={{
              backgroundColor: view === v ? '#ffffff' : 'transparent',
              color: view === v ? '#000000' : 'rgba(0,0,0,0.5)',
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: isRunning ? '#e5e5e5' : '#000000',
            color: isRunning ? '#000000' : '#ffffff',
          }}
        >
          {isRunning ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          onClick={reset}
          className="flex-1 py-2.5 bg-[#e5e5e5] rounded-lg text-sm font-medium hover:bg-[#d5d5d5] transition-colors"
        >
          ↺ Reset
        </button>
      </div>

      {/* Expandable settings */}
      <div>
        <button
          onClick={() => setShowControls(!showControls)}
          className="w-full flex items-center justify-between py-2 text-sm text-black/50 hover:text-black transition-colors"
        >
          <span>Settings</span>
          <svg
            className={`w-4 h-4 transition-transform ${showControls ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showControls && (
          <div className="space-y-4 pt-2">
            {/* Parameters section */}
            <div className="p-3 bg-[#f5f5f5] rounded-lg space-y-3">
              <div className="text-[10px] text-black/50 uppercase tracking-wide">
                Equation Parameters
              </div>

              {/* Parameter a */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-mono">a</span>
                  <span className="text-sm font-mono text-black/50">{params.a.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.01"
                  value={params.a}
                  onChange={(e) => setParams((p) => ({ ...p, a: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-[#e5e5e5] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:border
                    [&::-webkit-slider-thumb]:border-[#cccccc]
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:shadow-sm
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              {/* Parameter b */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-mono">b</span>
                  <span className="text-sm font-mono text-black/50">{params.b.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.01"
                  value={params.b}
                  onChange={(e) => setParams((p) => ({ ...p, b: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-[#e5e5e5] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:border
                    [&::-webkit-slider-thumb]:border-[#cccccc]
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:shadow-sm
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              {/* Parameter c */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-mono">c</span>
                  <span className="text-sm font-mono text-black/50">{params.c.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="0.1"
                  value={params.c}
                  onChange={(e) => setParams((p) => ({ ...p, c: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-[#e5e5e5] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:border
                    [&::-webkit-slider-thumb]:border-[#cccccc]
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:shadow-sm
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>

            {/* Display section */}
            <div className="space-y-3">
              {/* Zoom */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Zoom</span>
                  <span className="text-sm font-mono text-black/50">{zoom.toFixed(1)}×</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#e5e5e5] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:border
                    [&::-webkit-slider-thumb]:border-[#cccccc]
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:shadow-sm
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              {/* Speed */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Rotation Speed</span>
                  <span className="text-sm font-mono text-black/50">{speed.toFixed(1)}×</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#e5e5e5] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:border
                    [&::-webkit-slider-thumb]:border-[#cccccc]
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:shadow-sm
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              {/* Speed presets */}
              <div className="flex gap-1">
                {[0, 0.5, 1, 1.5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className="flex-1 py-1.5 text-xs font-mono rounded transition-colors"
                    style={{
                      backgroundColor: speed === s ? '#000000' : '#e5e5e5',
                      color: speed === s ? '#ffffff' : 'rgba(0,0,0,0.5)',
                    }}
                  >
                    {s === 0 ? 'Stop' : `${s}×`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}