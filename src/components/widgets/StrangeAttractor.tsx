'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'

// Rössler attractor parameters
interface AttractorParams {
  a: number
  b: number
  c: number
}

// Knob component - Braun-style rotary control
function Knob({ 
  value, 
  min, 
  max, 
  onChange, 
  label,
  size = 'medium'
}: { 
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  label: string
  size?: 'small' | 'medium' | 'large'
}) {
  const knobRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startValue = useRef(0)

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startY.current = e.clientY
    startValue.current = value
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return
    const delta = (startY.current - e.clientY) / 100
    const range = max - min
    const newValue = Math.max(min, Math.min(max, startValue.current + delta * range))
    onChange(newValue)
  }, [min, max, onChange])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  // Calculate rotation angle (270 degree range, from -135 to 135)
  const normalizedValue = (value - min) / (max - min)
  const rotation = -135 + normalizedValue * 270

  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        ref={knobRef}
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-b from-[#e8e8e8] to-[#c8c8c8] border border-[#999] shadow-md cursor-pointer relative select-none`}
        style={{
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.3)'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Knurled texture ring */}
        <div 
          className="absolute inset-1 rounded-full border border-[#bbb]"
          style={{
            background: 'repeating-conic-gradient(from 0deg, #d0d0d0 0deg 3deg, #b8b8b8 3deg 6deg)'
          }}
        />
        {/* Center cap */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-b from-[#f0f0f0] to-[#d8d8d8]" />
        {/* Indicator line */}
        <div 
          className="absolute top-1/2 left-1/2 w-0.5 bg-[#333] origin-bottom"
          style={{
            height: size === 'large' ? '24px' : size === 'medium' ? '18px' : '12px',
            transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
            transformOrigin: 'center bottom'
          }}
        />
      </div>
      <span className="text-[10px] font-mono text-[#666] uppercase tracking-wider">{label}</span>
      <span className="text-[9px] font-mono text-[#888]">{value.toFixed(2)}</span>
    </div>
  )
}

// Toggle switch component
function ToggleSwitch({
  options,
  value,
  onChange,
  label
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  label: string
}) {
  const currentIndex = options.indexOf(value)
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-0.5 bg-[#2a2a2a] p-1 rounded">
        {options.map((option, i) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-2 py-1 text-[9px] font-mono uppercase tracking-wider transition-all rounded-sm ${
              value === option 
                ? 'bg-[#e8e8e8] text-[#222]' 
                : 'text-[#888] hover:text-[#aaa]'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <span className="text-[10px] font-mono text-[#666] uppercase tracking-wider">{label}</span>
    </div>
  )
}

export default function StrangeAttractor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const lineRef = useRef<THREE.Line | null>(null)
  const animationRef = useRef<number>(0)
  
  const [params, setParams] = useState<AttractorParams>({ a: 0.2, b: 0.2, c: 5.7 })
  const [view, setView] = useState<string>('3D')
  const [zoom, setZoom] = useState(1)
  const [speed, setSpeed] = useState(0.5)
  const [isRunning, setIsRunning] = useState(true)

  // Rössler attractor computation
  const computeAttractor = useCallback((params: AttractorParams, numPoints: number = 50000) => {
    const { a, b, c } = params
    const points: THREE.Vector3[] = []
    
    let x = 0.1, y = 0, z = 0
    const dt = 0.01
    
    // Skip initial transient
    for (let i = 0; i < 1000; i++) {
      const dx = -y - z
      const dy = x + a * y
      const dz = b + z * (x - c)
      x += dx * dt
      y += dy * dt
      z += dz * dt
    }
    
    // Record trajectory
    for (let i = 0; i < numPoints; i++) {
      const dx = -y - z
      const dy = x + a * y
      const dz = b + z * (x - c)
      x += dx * dt
      y += dy * dt
      z += dz * dt
      
      // Scale and add point
      points.push(new THREE.Vector3(x * 0.5, y * 0.5, z * 0.5))
    }
    
    return points
  }, [])

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0f)
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

    // Create initial attractor
    const points = computeAttractor(params)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    
    // Create gradient colors along the path
    const colors: number[] = []
    for (let i = 0; i < points.length; i++) {
      const t = i / points.length
      // Cyan to magenta gradient
      const r = 0.2 + t * 0.6
      const g = 0.8 - t * 0.5
      const b = 0.9
      colors.push(r, g, b)
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.LineBasicMaterial({ 
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    })
    const line = new THREE.Line(geometry, material)
    scene.add(line)
    lineRef.current = line

    // Animation loop
    let time = 0
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      
      if (isRunning && lineRef.current) {
        time += 0.005 * speed
        
        // Rotate based on view mode
        if (view === '3D') {
          lineRef.current.rotation.y = time
          lineRef.current.rotation.x = Math.sin(time * 0.5) * 0.3
        } else if (view === 'XY') {
          lineRef.current.rotation.set(0, 0, 0)
        } else if (view === 'XZ') {
          lineRef.current.rotation.set(Math.PI / 2, 0, 0)
        } else if (view === 'YZ') {
          lineRef.current.rotation.set(0, Math.PI / 2, 0)
        }
      }
      
      if (cameraRef.current) {
        cameraRef.current.position.z = 30 / zoom
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Update attractor when params change
  useEffect(() => {
    if (!lineRef.current || !sceneRef.current) return
    
    const points = computeAttractor(params)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    
    // Recreate colors
    const colors: number[] = []
    for (let i = 0; i < points.length; i++) {
      const t = i / points.length
      const r = 0.2 + t * 0.6
      const g = 0.8 - t * 0.5
      const b = 0.9
      colors.push(r, g, b)
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    
    lineRef.current.geometry.dispose()
    lineRef.current.geometry = geometry
  }, [params, computeAttractor])

  // Update camera zoom
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = 30 / zoom
    }
  }, [zoom])

  return (
    <div className="w-full h-full flex flex-col">
      {/* Braun-style device housing */}
      <div 
        className="flex-1 flex flex-col rounded-lg overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #e8e8e8 0%, #d8d8d8 50%, #c8c8c8 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        {/* Top bezel with model name */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#bbb]">
          <span className="text-[9px] font-mono text-[#666] tracking-widest uppercase">Maxwell</span>
          <span className="text-[9px] font-mono text-[#888] tracking-wider">Rössler System</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-[8px] font-mono text-[#888]">{isRunning ? 'RUN' : 'STOP'}</span>
          </div>
        </div>
        
        {/* Black display screen */}
        <div className="flex-1 m-2 mb-0 rounded-sm overflow-hidden border border-[#333]" style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)' }}>
          <div ref={containerRef} className="w-full h-full" />
        </div>
        
        {/* Control panel - Braun style, compact */}
        <div 
          className="px-3 py-2 border-t border-[#bbb]"
          style={{
            background: 'linear-gradient(180deg, #e0e0e0 0%, #d0d0d0 100%)'
          }}
        >
          {/* Main controls row */}
          <div className="flex items-center justify-between gap-2">
            {/* Parameter knobs section */}
            <div className="flex gap-2">
              <Knob 
                value={params.a} 
                min={0.05} 
                max={0.5} 
                onChange={(v) => setParams(p => ({ ...p, a: v }))}
                label="a"
                size="small"
              />
              <Knob 
                value={params.b} 
                min={0.05} 
                max={0.5} 
                onChange={(v) => setParams(p => ({ ...p, b: v }))}
                label="b"
                size="small"
              />
              <Knob 
                value={params.c} 
                min={3} 
                max={10} 
                onChange={(v) => setParams(p => ({ ...p, c: v }))}
                label="c"
                size="small"
              />
            </div>
            
            {/* View selector */}
            <ToggleSwitch 
              options={['3D', 'XY', 'XZ', 'YZ']}
              value={view}
              onChange={setView}
              label=""
            />
            
            {/* Zoom and speed */}
            <div className="flex gap-2">
              <Knob 
                value={zoom} 
                min={0.5} 
                max={3} 
                onChange={setZoom}
                label="zoom"
                size="small"
              />
              <Knob 
                value={speed} 
                min={0} 
                max={2} 
                onChange={setSpeed}
                label="spd"
                size="small"
              />
            </div>
            
            {/* Run/Stop button */}
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`w-8 h-8 rounded-full border-2 transition-all flex-shrink-0 ${
                isRunning 
                  ? 'bg-[#ff4444] border-[#cc3333] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.3)]' 
                  : 'bg-[#44ff44] border-[#33cc33] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.3)]'
              }`}
              title={isRunning ? 'Stop' : 'Run'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}