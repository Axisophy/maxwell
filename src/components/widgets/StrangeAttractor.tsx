'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'

interface AttractorParams {
  a: number
  b: number
  c: number
}

// Knob component - for pointer devices
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
    <div className="flex flex-col items-center gap-[0.4em]">
      <div 
        className="w-[3em] h-[3em] rounded-full bg-gradient-to-b from-[#e8e8e8] to-[#c8c8c8] border border-[#999] cursor-pointer relative select-none"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.3)'
        }}
        onMouseDown={handleMouseDown}
      >
        <div 
          className="absolute inset-[0.15em] rounded-full border border-[#bbb]"
          style={{
            background: 'repeating-conic-gradient(from 0deg, #d0d0d0 0deg 3deg, #b8b8b8 3deg 6deg)'
          }}
        />
        <div className="absolute inset-[0.5em] rounded-full bg-gradient-to-b from-[#f0f0f0] to-[#d8d8d8]" />
        <div 
          className="absolute top-1/2 left-1/2 w-[0.2em] h-[1em] bg-[#333] origin-bottom rounded-full"
          style={{
            transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
            transformOrigin: 'center bottom'
          }}
        />
      </div>
      <span className="text-[0.5em] font-mono text-[#444] uppercase tracking-wider font-medium">{label}</span>
      <span className="text-[0.45em] font-mono text-[#666]">{value.toFixed(2)}</span>
    </div>
  )
}

// Slider component - for touch devices, Braun-styled
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
      <span className="text-[11px] font-mono text-[#444] uppercase tracking-wider font-medium w-12">{label}</span>
      <div className="flex-1 relative h-12 flex items-center">
        <div 
          className="absolute inset-x-0 h-3 rounded-full"
          style={{
            background: 'linear-gradient(180deg, #a0a0a0 0%, #c8c8c8 50%, #b8b8b8 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(255,255,255,0.5)'
          }}
        />
        <div 
          className="absolute left-0 h-3 rounded-full"
          style={{ 
            width: `${percentage}%`,
            background: 'linear-gradient(180deg, #555 0%, #777 50%, #666 100%)',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={(max - min) / 100}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-x-0 w-full h-12 opacity-0 cursor-pointer z-10"
        />
        <div 
          className="absolute w-8 h-8 rounded-full pointer-events-none"
          style={{ 
            left: `calc(${percentage}% - 16px)`,
            background: 'linear-gradient(180deg, #f0f0f0 0%, #d0d0d0 50%, #c0c0c0 100%)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.1)',
            border: '1px solid #999'
          }}
        />
      </div>
      <span className="text-[11px] font-mono text-[#666] w-12 text-right">{value.toFixed(2)}</span>
    </div>
  )
}

// View toggle - shared
function ViewToggle({
  options,
  value,
  onChange,
  size = 'normal'
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  size?: 'normal' | 'small'
}) {
  const padding = size === 'small' ? 'px-3 py-2' : 'px-[0.8em] py-[0.4em]'
  const text = size === 'small' ? 'text-xs' : 'text-[0.5em]'
  
  return (
    <div 
      className="flex gap-[0.2em] p-[0.3em] rounded"
      style={{
        background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
      }}
    >
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`${padding} ${text} font-mono uppercase tracking-wider transition-all rounded-sm font-medium ${
            value === option 
              ? 'bg-[#e8e8e8] text-[#222]' 
              : 'text-[#666] hover:text-[#999]'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

// Play/Pause button
function PlayPauseButton({
  isRunning,
  onClick,
  size = 'normal'
}: {
  isRunning: boolean
  onClick: () => void
  size?: 'normal' | 'small'
}) {
  const sizeClass = size === 'small' ? 'w-12 h-12' : 'w-[3em] h-[3em]'
  
  return (
    <button 
      onClick={onClick}
      className={`${sizeClass} rounded-full border-2 transition-all flex items-center justify-center ${
        isRunning 
          ? 'bg-[#333] border-[#222]' 
          : 'bg-[#4ade80] border-[#22c55e]'
      }`}
      style={{
        boxShadow: isRunning 
          ? 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.3)'
          : 'inset 0 2px 4px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.3)'
      }}
    >
      {isRunning ? (
        <div className="flex gap-[0.15em]">
          <div className="w-[0.25em] h-[0.8em] bg-white rounded-sm" />
          <div className="w-[0.25em] h-[0.8em] bg-white rounded-sm" />
        </div>
      ) : (
        <div 
          className="w-0 h-0 ml-[0.1em]"
          style={{
            borderLeft: '0.5em solid white',
            borderTop: '0.35em solid transparent',
            borderBottom: '0.35em solid transparent',
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
  const [mounted, setMounted] = useState(false)

  // Detect input method after mount
  useEffect(() => {
    setMounted(true)
    const checkTouch = () => {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches)
    }
    checkTouch()
    const mq = window.matchMedia('(pointer: coarse)')
    mq.addEventListener('change', checkTouch)
    return () => mq.removeEventListener('change', checkTouch)
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

  // Initialize Three.js - runs after mount when containerRef is available
  useEffect(() => {
    if (!containerRef.current || !mounted) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    if (width === 0 || height === 0) return

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
      colors.push(0.2 + t * 0.6, 0.8 - t * 0.5, 0.9)
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

    // Handle resize
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
  }, [mounted, computeAttractor, isTouch])

  // Update attractor when params change
  useEffect(() => {
    if (!lineRef.current) return
    
    const points = computeAttractor(params)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    
    const colors: number[] = []
    for (let i = 0; i < points.length; i++) {
      const t = i / points.length
      colors.push(0.2 + t * 0.6, 0.8 - t * 0.5, 0.9)
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    
    lineRef.current.geometry.dispose()
    lineRef.current.geometry = geometry
  }, [params, computeAttractor])

  // TOUCH VERSION (mobile/tablet) - Braun aesthetic with sliders
  if (isTouch) {
    return (
      <div 
        className="aspect-square w-full h-full flex flex-col rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #e8e8e8 0%, #d8d8d8 50%, #c8c8c8 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        {/* Top bar */}
        <div 
          className="flex items-center justify-between px-4 py-2"
          style={{ 
            background: 'linear-gradient(180deg, #d8d8d8 0%, #c8c8c8 100%)',
            borderBottom: '1px solid #aaa'
          }}
        >
          <div>
            <span className="text-xs font-sans font-medium text-[#333] tracking-wide">MAXWELL</span>
            <span className="text-[10px] font-mono text-[#666] ml-2">Rössler Attractor mk.1</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
        </div>
        
        {/* Display screen */}
        <div 
          className="mx-3 mt-3 rounded-sm overflow-hidden flex-1 min-h-0"
          style={{ 
            border: '2px solid #222',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.5)'
          }}
        >
          <div ref={containerRef} className="w-full h-full" />
        </div>
        
        {/* Control panel */}
        <div 
          className="px-4 py-4 space-y-2"
          style={{ 
            background: 'linear-gradient(180deg, #d0d0d0 0%, #c0c0c0 100%)',
            borderTop: '1px solid #bbb'
          }}
        >
          {/* Parameter sliders */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#555] uppercase tracking-wider">Parameters</span>
            <Slider value={params.a} min={0.05} max={0.5} onChange={(v) => setParams(p => ({ ...p, a: v }))} label="a" />
            <Slider value={params.b} min={0.05} max={0.5} onChange={(v) => setParams(p => ({ ...p, b: v }))} label="b" />
            <Slider value={params.c} min={3} max={10} onChange={(v) => setParams(p => ({ ...p, c: v }))} label="c" />
          </div>
          
          {/* Display sliders */}
          <div className="space-y-1 pt-2 border-t border-[#bbb]">
            <span className="text-[10px] font-mono text-[#555] uppercase tracking-wider">Display</span>
            <Slider value={zoom} min={0.5} max={3} onChange={setZoom} label="zoom" />
            <Slider value={speed} min={0} max={2} onChange={setSpeed} label="speed" />
          </div>
          
          {/* View toggles and play/pause */}
          <div className="flex items-center justify-between pt-3">
            <ViewToggle options={['3D', 'XY', 'XZ', 'YZ']} value={view} onChange={setView} size="small" />
            <PlayPauseButton isRunning={isRunning} onClick={() => setIsRunning(!isRunning)} size="small" />
          </div>
        </div>
      </div>
    )
  }

  // POINTER VERSION (desktop) - Braun T1000 style, scales uniformly
  // Using em units so everything scales with font-size
  return (
    <div 
      className="aspect-square w-full h-full flex flex-col rounded-xl overflow-hidden"
      style={{
        fontSize: 'min(2.5vw, 16px)', // Scale factor - controls entire widget
        background: 'linear-gradient(180deg, #e8e8e8 0%, #d8d8d8 50%, #c8c8c8 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.15)'
      }}
    >
      {/* Top bezel */}
      <div 
        className="flex items-center justify-between px-[1em] py-[0.5em]"
        style={{ 
          background: 'linear-gradient(180deg, #d8d8d8 0%, #c8c8c8 100%)',
          borderBottom: '1px solid #aaa'
        }}
      >
        <div>
          <span className="text-[0.6em] font-sans font-medium text-[#333] tracking-wide">MAXWELL</span>
          <span className="text-[0.5em] font-mono text-[#666] ml-[0.5em]">Rössler Attractor mk.1</span>
        </div>
        <div className={`w-[0.5em] h-[0.5em] rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
      </div>
      
      {/* Display screen */}
      <div 
        className="mx-[1em] mt-[0.8em] rounded-sm overflow-hidden"
        style={{ 
          aspectRatio: '4/3',
          border: '2px solid #222',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.5)'
        }}
      >
        <div ref={containerRef} className="w-full h-full" />
      </div>
      
      {/* Control panel */}
      <div 
        className="flex-1 px-[1em] py-[0.8em] mt-[0.5em] flex items-center justify-between"
        style={{ 
          background: 'linear-gradient(180deg, #d0d0d0 0%, #c0c0c0 100%)',
          borderTop: '1px solid #bbb'
        }}
      >
        {/* Logo section */}
        <div className="flex flex-col">
          <span className="text-[0.7em] font-sans font-bold text-[#222] tracking-wide">MAXWELL</span>
          <span className="text-[0.4em] font-mono text-[#666] tracking-wider">Rössler Attractor mk.1</span>
        </div>
        
        {/* Parameters */}
        <div className="flex flex-col items-center">
          <span className="text-[0.45em] font-mono text-[#555] uppercase tracking-wider mb-[0.4em]">Parameters</span>
          <div className="flex gap-[0.6em]">
            <Knob value={params.a} min={0.05} max={0.5} onChange={(v) => setParams(p => ({ ...p, a: v }))} label="a" />
            <Knob value={params.b} min={0.05} max={0.5} onChange={(v) => setParams(p => ({ ...p, b: v }))} label="b" />
            <Knob value={params.c} min={3} max={10} onChange={(v) => setParams(p => ({ ...p, c: v }))} label="c" />
          </div>
        </div>
        
        {/* View */}
        <div className="flex flex-col items-center">
          <span className="text-[0.45em] font-mono text-[#555] uppercase tracking-wider mb-[0.4em]">View</span>
          <ViewToggle options={['3D', 'XY', 'XZ', 'YZ']} value={view} onChange={setView} />
        </div>
        
        {/* Display controls */}
        <div className="flex flex-col items-center">
          <span className="text-[0.45em] font-mono text-[#555] uppercase tracking-wider mb-[0.4em]">Display</span>
          <div className="flex gap-[0.6em] items-start">
            <Knob value={zoom} min={0.5} max={3} onChange={setZoom} label="zoom" />
            <Knob value={speed} min={0} max={2} onChange={setSpeed} label="speed" />
            <div className="flex flex-col items-center gap-[0.3em]">
              <PlayPauseButton isRunning={isRunning} onClick={() => setIsRunning(!isRunning)} />
              <span className="text-[0.45em] font-mono text-[#555] uppercase tracking-wider">
                {isRunning ? 'pause' : 'play'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}