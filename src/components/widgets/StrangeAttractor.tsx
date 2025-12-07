'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'

// Rössler attractor parameters
interface AttractorParams {
  a: number
  b: number
  c: number
}

// Maxwell Logo for widget
function MaxwellLogo({ className = '' }: { className?: string }) {
    return (
      <svg viewBox="0 0 245.47 77.52" className={className} fill="currentColor">
        <path d="M24.94,33.89c0-12.15,0-19.63.19-27.36-1.06,4.42-2.45,9.79-7.3,27.36h-4.7C8.95,18.53,7.66,14.02,5.74,6.53c.1,4.03.14,7.63.14,27.36H.5V0h8.3c4.51,16.03,5.95,20.88,6.86,24.91.82-3.94,2.02-8.83,6.53-24.91h7.97v33.89h-5.23Z"/>
        <path d="M54.17,33.89l-2.35-7.92h-10.42l-2.35,7.92h-6.05L43.56,0h6.62l10.08,33.89h-6.1ZM50.61,20.98c-2.4-8.69-3.12-11.71-3.89-14.93-.82,3.31-1.63,6.19-4.13,14.93h8.02Z"/>
        <path d="M81.17,33.89c-4.42-8.54-5.81-11.14-6.77-13.06-.91,1.97-2.02,4.32-6.43,13.06h-6.24l9.27-17.81L62.69,0h6.38c3.26,6.62,4.66,9.6,5.66,11.71,1.06-2.02,2.11-4.27,5.81-11.71h6.24l-8.69,16.13,9.55,17.76h-6.48Z"/>
        <path d="M112.43,33.89c-3.22-15.79-4.03-19.92-4.99-25.59-.82,5.57-1.63,9.79-4.99,25.59h-6.53L88.67,0h6.05c3.31,16.08,4.13,20.07,5.09,25.87.91-6.1,1.73-9.7,4.9-25.87h5.47c2.93,14.26,4.13,19.54,5.14,25.87.77-5.71,1.39-9.46,4.66-25.87h5.9l-6.96,33.89h-6.48Z"/>
        <path d="M128.68,33.89V0h19.54v5.23h-13.97v8.64h12.82v5.23h-12.82v9.55h14.79v5.23h-20.35Z"/>
        <path d="M152.8,33.89V0h5.57v28.66h12.67v5.23h-18.24Z"/>
        <path d="M174.3,33.89V0h5.57v28.66h12.67v5.23h-18.24Z"/>
        <path d="M0,77.09v-17.57h1.91v2.88c.94-2.2,2.38-3.1,4-3.1.54,0,.97.04,1.48.22v2.3c-.54-.36-1.12-.47-1.58-.47-.94,0-1.76.47-2.38,1.26-1.22,1.48-1.48,3.1-1.48,5.87v8.6H0Z"/>
        <path d="M15.07,77.52c-4.25,0-6.52-3.82-6.52-9.32s2.63-9.07,6.77-9.07,6.33,3.46,6.33,9.29-2.59,9.11-6.59,9.11ZM15.25,60.89c-2.88,0-4.72,2.66-4.72,7.05,0,4.82,1.69,7.74,4.57,7.74s4.54-2.63,4.54-7.24-1.62-7.56-4.39-7.56ZM11.47,55.67v-3.02h1.84v3.02h-1.84ZM17.16,55.67v-3.02h1.84v3.02h-1.84Z"/>
        <path d="M25.35,72.16c.68,2.2,2.02,3.53,4.03,3.53s3.35-1.04,3.35-3.06c0-1.62-.72-2.52-2.99-3.38l-1.69-.65c-2.56-.97-3.71-2.56-3.71-4.82,0-2.74,2.05-4.64,5.15-4.64,2.92,0,4.36,1.44,5.15,4.1l-1.87.65c-.65-2.2-1.91-2.99-3.46-2.99-1.87,0-3.02,1.08-3.02,2.81,0,1.4.58,2.34,2.63,3.06l1.55.58c2.95,1.04,4.21,2.52,4.21,5.15,0,3.13-2.12,5.04-5.36,5.04-3.02,0-4.97-1.76-5.83-4.54l1.87-.83Z"/>
        <path d="M38.53,72.16c.68,2.2,2.02,3.53,4.03,3.53s3.35-1.04,3.35-3.06c0-1.62-.72-2.52-2.99-3.38l-1.69-.65c-2.56-.97-3.71-2.56-3.71-4.82,0-2.74,2.05-4.64,5.15-4.64,2.92,0,4.36,1.44,5.15,4.1l-1.87.65c-.65-2.2-1.91-2.99-3.46-2.99-1.87,0-3.02,1.08-3.02,2.81,0,1.4.58,2.34,2.63,3.06l1.55.58c2.95,1.04,4.21,2.52,4.21,5.15,0,3.13-2.12,5.04-5.36,5.04-3.02,0-4.97-1.76-5.83-4.54l1.87-.83Z"/>
        <path d="M51,77.09v-25.41h1.94v25.41h-1.94Z"/>
        <path d="M63.13,77.52c-4.46,0-6.88-3.49-6.88-9.43,0-5.58,2.56-8.96,6.59-8.96s6.05,3.06,6.19,9.32h-10.8c0,5.22,2.27,7.24,4.93,7.24,2.16,0,3.35-1.19,3.85-3.71l1.98.4c-.65,3.17-2.52,5.15-5.87,5.15ZM66.88,66.69c-.11-3.31-1.19-5.79-4.07-5.79-2.63,0-4.25,1.98-4.54,5.79h8.6Z"/>
        <path d="M72.2,77.09v-17.57h1.91v2.88c.94-2.2,2.38-3.1,4-3.1.54,0,.97.04,1.48.22v2.3c-.54-.36-1.12-.47-1.58-.47-.94,0-1.76.47-2.38,1.26-1.22,1.48-1.48,3.1-1.48,5.87v8.6h-1.94Z"/>
        <path d="M98.91,77.2c-1.62,0-2.56-.76-2.66-2.63-1.04,1.73-2.41,2.81-4.86,2.81-2.7,0-4.46-1.98-4.46-4.86,0-1.91.68-3.35,2.2-4.28,1.48-.94,3.71-1.44,6.91-1.84v-1.51c0-2.84-.86-4-3.02-4s-3.35,1.3-3.6,3.85l-1.94-.14c.36-4,2.63-5.47,5.69-5.47,1.73,0,3.06.5,3.85,1.62.79,1.12.94,2.48.94,5.11v7.23c0,.4.04,1.19.14,1.44.22.65.54.9,1.26.9.18,0,.43-.04.61-.07v1.69c-.32.07-.72.14-1.04.14ZM90.2,69.68c-.94.61-1.33,1.69-1.33,2.7,0,2.02,1.12,3.2,2.92,3.2,1.3,0,2.23-.58,3.02-1.48.94-1.12,1.22-2.23,1.22-4.9v-1.12c-2.95.32-4.72.79-5.83,1.58Z"/>
        <path d="M107.8,77.06c-.61.22-1.37.32-1.91.32-2.3,0-3.17-1.33-3.17-4.54v-11.48h-2.7v-1.84h2.7v-6.37h1.94v6.37h3.06v1.84h-3.06v11.55c0,2.09.68,2.56,1.73,2.56.4,0,.9-.07,1.4-.36v1.94Z"/>
        <path d="M116.97,77.06c-.61.22-1.37.32-1.91.32-2.3,0-3.17-1.33-3.17-4.54v-11.48h-2.7v-1.84h2.7v-6.37h1.94v6.37h3.06v1.84h-3.06v11.55c0,2.09.68,2.56,1.73,2.56.4,0,.9-.07,1.4-.36v1.94Z"/>
        <path d="M119.47,77.09v-17.57h1.91v2.88c.94-2.2,2.38-3.1,4-3.1.54,0,.97.04,1.48.22v2.3c-.54-.36-1.12-.47-1.58-.47-.94,0-1.76.47-2.38,1.26-1.22,1.48-1.48,3.1-1.48,5.87v8.6h-1.94Z"/>
        <path d="M139.98,77.2c-1.62,0-2.56-.76-2.66-2.63-1.04,1.73-2.41,2.81-4.86,2.81-2.7,0-4.46-1.98-4.46-4.86,0-1.91.68-3.35,2.2-4.28,1.48-.94,3.71-1.44,6.91-1.84v-1.51c0-2.84-.86-4-3.02-4s-3.35,1.3-3.6,3.85l-1.94-.14c.36-4,2.63-5.47,5.69-5.47,1.73,0,3.06.5,3.85,1.62.79,1.12.94,2.48.94,5.11v7.23c0,.4.04,1.19.14,1.44.22.65.54.9,1.26.9.18,0,.43-.04.61-.07v1.69c-.32.07-.72.14-1.04.14ZM131.27,69.68c-.94.61-1.33,1.69-1.33,2.7,0,2.02,1.12,3.2,2.92,3.2,1.3,0,2.23-.58,3.02-1.48.94-1.12,1.22-2.23,1.22-4.9v-1.12c-2.95.32-4.72.79-5.83,1.58Z"/>
        <path d="M148.49,77.52c-4.03,0-6.41-3.49-6.41-9.32s2.63-9.07,6.69-9.07c3.17,0,4.61,1.94,5.11,5.15l-2.02.43c-.36-2.74-1.44-3.78-3.24-3.78-2.81,0-4.57,2.63-4.57,7.38,0,4.5,1.66,7.38,4.57,7.38,2.12,0,3.13-1.44,3.46-3.71l1.94.36c-.5,2.63-1.8,5.18-5.54,5.18Z"/>
        <path d="M162.88,77.06c-.61.22-1.37.32-1.91.32-2.3,0-3.17-1.33-3.17-4.54v-11.48h-2.7v-1.84h2.7v-6.37h1.94v6.37h3.06v1.84h-3.06v11.55c0,2.09.68,2.56,1.73,2.56.4,0,.9-.07,1.4-.36v1.94Z"/>
        <path d="M170.58,77.52c-4.25,0-6.52-3.82-6.52-9.32s2.63-9.07,6.77-9.07,6.33,3.46,6.33,9.29-2.59,9.11-6.59,9.11ZM170.76,60.89c-2.88,0-4.72,2.66-4.72,7.05,0,4.82,1.69,7.74,4.57,7.74s4.54-2.63,4.54-7.24-1.62-7.56-4.39-7.56Z"/>
        <path d="M180.5,77.09v-17.57h1.91v2.88c.94-2.2,2.38-3.1,4-3.1.54,0,.97.04,1.48.22v2.3c-.54-.36-1.12-.47-1.58-.47-.94,0-1.76.47-2.38,1.26-1.22,1.48-1.48,3.1-1.48,5.87v8.6h-1.94Z"/>
        <path d="M214.41,77.09v-10.87c0-1.62-.14-3.02-.65-3.85-.47-.72-1.22-1.15-2.3-1.15-1.33,0-2.41.86-3.17,2.23-.65,1.26-.76,2.52-.76,4.46v9.18h-1.98v-10.87c0-1.91-.22-3.2-.72-4-.47-.68-1.15-1.01-2.12-1.01-.72,0-2.16.5-3.13,2.27-.68,1.26-.9,2.7-.9,4.36v9.25h-1.94v-17.57h1.91v3.17c1.04-2.41,2.92-3.46,4.75-3.46,2.12,0,3.42,1.15,3.85,3.46.97-2.45,2.74-3.46,4.75-3.46,1.58,0,3.06.61,3.78,2.23.4.9.58,2.12.58,3.92v11.7h-1.94Z"/>
        <path d="M230.13,77.09l-4.82-9.07-2.84,3.6v5.47h-1.94v-25.41h1.94v17.06l6.91-9.21h2.41l-5.11,6.73,5.8,10.83h-2.34Z"/>
        <path d="M236.74,77.09h-2.2v-4.1h2.2v4.1Z"/>
        <path d="M239.68,55.85c2.34-.29,3.6-1.44,4-3.78h1.8v25.02h-2.05v-20.88c-1.01.97-2.2,1.44-3.74,1.55v-1.91Z"/>
      </svg>
    )
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
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startValue = useRef(0)

  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-14 h-14',
    large: 'w-20 h-20'
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
    <div className="flex flex-col items-center gap-2">
      <div 
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-b from-[#e8e8e8] to-[#c8c8c8] border border-[#999] shadow-md cursor-pointer relative select-none`}
        style={{
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.3)'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Knurled texture ring */}
        <div 
          className="absolute inset-1.5 rounded-full border border-[#bbb]"
          style={{
            background: 'repeating-conic-gradient(from 0deg, #d0d0d0 0deg 3deg, #b8b8b8 3deg 6deg)'
          }}
        />
        {/* Center cap */}
        <div className="absolute inset-3 rounded-full bg-gradient-to-b from-[#f0f0f0] to-[#d8d8d8]" />
        {/* Indicator line */}
        <div 
          className="absolute top-1/2 left-1/2 w-1 bg-[#333] origin-bottom rounded-full"
          style={{
            height: size === 'large' ? '32px' : size === 'medium' ? '22px' : '16px',
            transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
            transformOrigin: 'center bottom'
          }}
        />
      </div>
      <span className="text-xs font-mono text-[#444] uppercase tracking-wider font-medium">{label}</span>
      <span className="text-[11px] font-mono text-[#888]">{value.toFixed(2)}</span>
    </div>
  )
}

// Toggle switch component
function ToggleSwitch({
  options,
  value,
  onChange,
  label,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-mono text-[#444] uppercase tracking-wider font-medium">{label}</span>
      <div className="flex gap-1 bg-[#2a2a2a] p-2 rounded">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all rounded-sm font-medium ${
              value === option 
                ? 'bg-[#e8e8e8] text-[#222]' 
                : 'text-[#666] hover:text-[#aaa]'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
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

  // Refs to track current values in animation loop
  const viewRef = useRef(view)
  const zoomRef = useRef(zoom)
  const speedRef = useRef(speed)
  const isRunningRef = useRef(isRunning)

  // Keep refs in sync with state
  useEffect(() => { viewRef.current = view }, [view])
  useEffect(() => { zoomRef.current = zoom }, [zoom])
  useEffect(() => { speedRef.current = speed }, [speed])
  useEffect(() => { isRunningRef.current = isRunning }, [isRunning])

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
      
      if (lineRef.current) {
        // Update camera zoom
        if (cameraRef.current) {
          cameraRef.current.position.z = 30 / zoomRef.current
        }
        
        // Apply rotation based on view mode
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
        {/* Top bezel - minimal */}
        <div className="flex items-center justify-end px-4 py-2 border-b border-[#bbb]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#888] tracking-wider">Rössler Attractor</span>
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
          </div>
        </div>
        
        {/* Black display screen */}
        <div 
          className="mx-4 mt-3 rounded-sm overflow-hidden border border-[#333] aspect-[4/3]" 
          style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)' }}
        >
          <div ref={containerRef} className="w-full h-full" />
        </div>
        
        {/* Control panel - Braun style */}
        <div 
          className="flex-1 px-8 py-5 border-t border-[#bbb] mt-3"
          style={{
            background: 'linear-gradient(180deg, #e0e0e0 0%, #d0d0d0 100%)'
          }}
        >
          {/* Main controls row */}
          <div className="flex items-start justify-between">
            
            {/* Logo - bottom left */}
            <div className="flex flex-col justify-end h-full pt-6">
              <MaxwellLogo className="h-12 w-auto text-[#000]" />
            </div>
            
            {/* Parameter knobs section */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-[#444] uppercase tracking-wider font-medium mb-3">Parameters</span>
              <div className="flex gap-4">
                <Knob 
                  value={params.a} 
                  min={0.05} 
                  max={0.5} 
                  onChange={(v) => setParams(p => ({ ...p, a: v }))}
                  label="a"
                  size="large"
                />
                <Knob 
                  value={params.b} 
                  min={0.05} 
                  max={0.5} 
                  onChange={(v) => setParams(p => ({ ...p, b: v }))}
                  label="b"
                  size="large"
                />
                <Knob 
                  value={params.c} 
                  min={3} 
                  max={10} 
                  onChange={(v) => setParams(p => ({ ...p, c: v }))}
                  label="c"
                  size="large"
                />
              </div>
            </div>
            
            {/* View selector */}
            <ToggleSwitch 
              options={['3D', 'XY', 'XZ', 'YZ']}
              value={view}
              onChange={setView}
              label="View"
            />
            
            {/* Display controls */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-[#444] uppercase tracking-wider font-medium mb-3">Display</span>
              <div className="flex gap-4 items-start">
                <Knob 
                  value={zoom} 
                  min={0.5} 
                  max={3} 
                  onChange={setZoom}
                  label="zoom"
                  size="large"
                />
                <Knob 
                  value={speed} 
                  min={0} 
                  max={2} 
                  onChange={setSpeed}
                  label="speed"
                  size="large"
                />
                {/* Play/Pause button - aligned with knobs */}
                <div className="flex flex-col items-center gap-2">
                  <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className={`w-20 h-20 rounded-full border-2 transition-all flex items-center justify-center ${
                      isRunning 
                        ? 'bg-[#333] border-[#222] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)]' 
                        : 'bg-[#4ade80] border-[#22c55e] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.3)]'
                    }`}
                    title={isRunning ? 'Pause rotation' : 'Resume rotation'}
                  >
                    {isRunning ? (
                      /* Pause icon */
                      <div className="flex gap-1.5">
                        <div className="w-2 h-6 bg-white rounded-sm" />
                        <div className="w-2 h-6 bg-white rounded-sm" />
                      </div>
                    ) : (
                      /* Play icon */
                      <div className="w-0 h-0 border-l-[14px] border-l-white border-y-[9px] border-y-transparent ml-1" />
                    )}
                  </button>
                  <span className="text-xs font-mono text-[#444] uppercase tracking-wider font-medium">
                    {isRunning ? 'pause' : 'play'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}