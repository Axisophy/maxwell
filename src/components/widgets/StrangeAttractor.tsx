'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'

// Rössler attractor parameters
interface AttractorParams {
  a: number
  b: number
  c: number
}

// Maxwell Logo
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
    </svg>
  )
}

// Knob component - for pointer devices (desktop)
function Knob({ 
  value, 
  min, 
  max, 
  onChange, 
  label,
}: { 
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  label: string
}) {
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startValue = useRef(0)

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

  const normalizedValue = (value - min) / (max - min)
  const rotation = -135 + normalizedValue * 270

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className="w-16 h-16 rounded-full bg-gradient-to-b from-[#e8e8e8] to-[#c8c8c8] border border-[#999] shadow-md cursor-pointer relative select-none"
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
          className="absolute top-1/2 left-1/2 w-1 h-6 bg-[#333] origin-bottom rounded-full"
          style={{
            transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
            transformOrigin: 'center bottom'
          }}
        />
      </div>
      <span className="text-xs font-mono text-[#444] uppercase tracking-wider font-medium">{label}</span>
      <span className="text-[11px] font-mono text-[#666]">{value.toFixed(2)}</span>
    </div>
  )
}

// Slider component - for touch devices (mobile/tablet)
function Slider({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  label: string
}) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs font-mono text-[#444] uppercase tracking-wider font-medium w-6">{label}</span>
      <div className="flex-1 relative h-10 flex items-center">
        {/* Track background */}
        <div 
          className="absolute inset-x-0 h-2 rounded-full bg-[#c8c8c8]"
          style={{
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
          }}
        />
        {/* Filled track */}
        <div 
          className="absolute left-0 h-2 rounded-full bg-gradient-to-r from-[#666] to-[#888]"
          style={{ width: `${percentage}%` }}
        />
        {/* Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={(max - min) / 100}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-x-0 w-full h-10 opacity-0 cursor-pointer z-10"
        />
        <div 
          className="absolute w-6 h-6 rounded-full bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border border-[#999] pointer-events-none"
          style={{ 
            left: `calc(${percentage}% - 12px)`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)'
          }}
        />
      </div>
      <span className="text-[11px] font-mono text-[#666] w-12 text-right">{value.toFixed(2)}</span>
    </div>
  )
}

// View toggle buttons - shared between touch and pointer
function ViewToggle({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-1 bg-[#2a2a2a] p-1.5 rounded">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all rounded-sm font-medium ${
            value === option 
              ? 'bg-[#e8e8e8] text-[#222]' 
              : 'text-[#666] hover:text-[#aaa]'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

// Play/Pause button - shared
function PlayPauseButton({
  isRunning,
  onClick,
  size = 'large'
}: {
  isRunning: boolean
  onClick: () => void
  size?: 'large' | 'small'
}) {
  const sizeClass = size === 'large' ? 'w-14 h-14' : 'w-10 h-10'
  const iconSize = size === 'large' ? 'w-2 h-5' : 'w-1.5 h-4'
  
  return (
    <button 
      onClick={onClick}
      className={`${sizeClass} rounded-full border-2 transition-all flex items-center justify-center ${
        isRunning 
          ? 'bg-[#333] border-[#222]' 
          : 'bg-status-live border-[#22c55e]'
      }`}
      style={{
        boxShadow: isRunning 
          ? 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.3)'
          : 'inset 0 2px 4px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.3)'
      }}
    >
      {isRunning ? (
        <div className="flex gap-1">
          <div className={`${iconSize} bg-white rounded-sm`} />
          <div className={`${iconSize} bg-white rounded-sm`} />
        </div>
      ) : (
        <div 
          className="w-0 h-0 ml-0.5"
          style={{
            borderLeft: size === 'large' ? '10px solid white' : '8px solid white',
            borderTop: size === 'large' ? '6px solid transparent' : '5px solid transparent',
            borderBottom: size === 'large' ? '6px solid transparent' : '5px solid transparent',
          }}
        />
      )}
    </button>
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
  const [isTouch, setIsTouch] = useState(false)

  // Detect input method
  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches)
    }
    checkTouch()
    window.matchMedia('(pointer: coarse)').addEventListener('change', checkTouch)
    return () => {
      window.matchMedia('(pointer: coarse)').removeEventListener('change', checkTouch)
    }
  }, [])

  // Refs for animation loop
  const viewRef = useRef(view)
  const zoomRef = useRef(zoom)
  const speedRef = useRef(speed)
  const isRunningRef = useRef(isRunning)

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
    
    for (let i = 0; i < 1000; i++) {
      const dx = -y - z
      const dy = x + a * y
      const dz = b + z * (x - c)
      x += dx * dt
      y += dy * dt
      z += dz * dt
    }
    
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
  }, [])

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0f)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(0, 0, 30)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const points = computeAttractor(params)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    
    const colors: number[] = []
    for (let i = 0; i < points.length; i++) {
      const t = i / points.length
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
    if (!lineRef.current) return
    
    const points = computeAttractor(params)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    
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

  // TOUCH VERSION (mobile/tablet)
  if (isTouch) {
    return (
      <div className="aspect-square w-full h-full flex flex-col bg-gradient-to-b from-[#e8e8e8] to-[#d0d0d0] rounded-xl overflow-hidden">
        {/* Display */}
        <div className="flex-1 m-3 mb-2 rounded-lg overflow-hidden border border-[#333]" style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)' }}>
          <div ref={containerRef} className="w-full h-full" />
        </div>
        
        {/* Controls */}
        <div className="px-4 pb-4 space-y-3">
          {/* Parameter sliders */}
          <Slider value={params.a} min={0.05} max={0.5} onChange={(v) => setParams(p => ({ ...p, a: v }))} label="a" />
          <Slider value={params.b} min={0.05} max={0.5} onChange={(v) => setParams(p => ({ ...p, b: v }))} label="b" />
          <Slider value={params.c} min={3} max={10} onChange={(v) => setParams(p => ({ ...p, c: v }))} label="c" />
          
          {/* View toggles and play/pause */}
          <div className="flex items-center justify-between pt-2">
            <ViewToggle options={['3D', 'XY', 'XZ', 'YZ']} value={view} onChange={setView} />
            <PlayPauseButton isRunning={isRunning} onClick={() => setIsRunning(!isRunning)} size="small" />
          </div>
          
          {/* Logo */}
          <div className="flex justify-center pt-1">
            <MaxwellLogo className="h-6 w-auto text-[#333]" />
          </div>
        </div>
      </div>
    )
  }

  // POINTER VERSION (desktop)
  return (
    <div className="w-full h-full flex flex-col">
      <div 
        className="flex-1 flex flex-col rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #e8e8e8 0%, #d8d8d8 50%, #c8c8c8 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        {/* Top bezel */}
        <div className="flex items-center justify-end px-4 py-2 border-b border-[#bbb]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#888] tracking-wider">Rössler Attractor</span>
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-status-live animate-pulse' : 'bg-amber-500'}`} />
          </div>
        </div>
        
        {/* Display screen */}
        <div 
          className="mx-4 mt-3 rounded-sm overflow-hidden border border-[#333] aspect-[4/3]" 
          style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)' }}
        >
          <div ref={containerRef} className="w-full h-full" />
        </div>
        
        {/* Control panel */}
        <div 
          className="flex-1 px-6 py-4 border-t border-[#bbb] mt-3"
          style={{ background: 'linear-gradient(180deg, #e0e0e0 0%, #d0d0d0 100%)' }}
        >
          <div className="flex items-start justify-between">
            {/* Logo */}
            <div className="pt-4">
              <MaxwellLogo className="h-10 w-auto text-[#000]" />
            </div>
            
            {/* Parameter knobs */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-[#444] uppercase tracking-wider font-medium mb-2">Parameters</span>
              <div className="flex gap-3">
                <Knob value={params.a} min={0.05} max={0.5} onChange={(v) => setParams(p => ({ ...p, a: v }))} label="a" />
                <Knob value={params.b} min={0.05} max={0.5} onChange={(v) => setParams(p => ({ ...p, b: v }))} label="b" />
                <Knob value={params.c} min={3} max={10} onChange={(v) => setParams(p => ({ ...p, c: v }))} label="c" />
              </div>
            </div>
            
            {/* View selector */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-[#444] uppercase tracking-wider font-medium mb-2">View</span>
              <ViewToggle options={['3D', 'XY', 'XZ', 'YZ']} value={view} onChange={setView} />
            </div>
            
            {/* Display controls */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-[#444] uppercase tracking-wider font-medium mb-2">Display</span>
              <div className="flex gap-3 items-start">
                <Knob value={zoom} min={0.5} max={3} onChange={setZoom} label="zoom" />
                <Knob value={speed} min={0} max={2} onChange={setSpeed} label="speed" />
                <div className="flex flex-col items-center gap-2">
                  <PlayPauseButton isRunning={isRunning} onClick={() => setIsRunning(!isRunning)} size="large" />
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