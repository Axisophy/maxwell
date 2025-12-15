'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// REACTION-DIFFUSION
// ===========================================
// Turing patterns - mathematical basis of biological patterns
// Gray-Scott model simulation
// ===========================================

export default function ReactionDiffusion() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [isRunning, setIsRunning] = useState(true)
  const [pattern, setPattern] = useState<'mitosis' | 'coral' | 'spots' | 'stripes' | 'maze'>('coral')
  const [generation, setGeneration] = useState(0)
  
  const gridRef = useRef<{ u: Float32Array, v: Float32Array } | null>(null)
  const animationRef = useRef<number>()
  
  const width = 128
  const height = 128
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth
        setBaseFontSize(w / 25)
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
  
  // Pattern parameters (Gray-Scott model)
  const params = {
    mitosis: { f: 0.0367, k: 0.0649, Du: 0.16, Dv: 0.08 },
    coral: { f: 0.0545, k: 0.062, Du: 0.16, Dv: 0.08 },
    spots: { f: 0.03, k: 0.062, Du: 0.16, Dv: 0.08 },
    stripes: { f: 0.022, k: 0.051, Du: 0.16, Dv: 0.08 },
    maze: { f: 0.029, k: 0.057, Du: 0.16, Dv: 0.08 },
  }
  
  // Initialize grid
  const initGrid = useCallback(() => {
    const u = new Float32Array(width * height)
    const v = new Float32Array(width * height)
    
    // Fill with U=1, V=0
    for (let i = 0; i < width * height; i++) {
      u[i] = 1
      v[i] = 0
    }
    
    // Add some seed areas
    const cx = width / 2
    const cy = height / 2
    const r = 10
    
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const dx = x - cx
        const dy = y - cy
        if (dx * dx + dy * dy < r * r) {
          const idx = y * width + x
          u[idx] = 0.5 + Math.random() * 0.1
          v[idx] = 0.25 + Math.random() * 0.1
        }
      }
    }
    
    // Add some random seeds
    for (let i = 0; i < 5; i++) {
      const sx = Math.floor(Math.random() * width)
      const sy = Math.floor(Math.random() * height)
      for (let dx = -3; dx <= 3; dx++) {
        for (let dy = -3; dy <= 3; dy++) {
          const x = (sx + dx + width) % width
          const y = (sy + dy + height) % height
          const idx = y * width + x
          u[idx] = 0.5 + Math.random() * 0.1
          v[idx] = 0.25 + Math.random() * 0.1
        }
      }
    }
    
    gridRef.current = { u, v }
    setGeneration(0)
  }, [])
  
  useEffect(() => {
    initGrid()
  }, [initGrid, pattern])
  
  // Laplacian calculation with wrap-around
  const laplacian = (arr: Float32Array, x: number, y: number): number => {
    const idx = y * width + x
    const left = y * width + ((x - 1 + width) % width)
    const right = y * width + ((x + 1) % width)
    const up = ((y - 1 + height) % height) * width + x
    const down = ((y + 1) % height) * width + x
    
    // 5-point stencil
    return arr[left] + arr[right] + arr[up] + arr[down] - 4 * arr[idx]
  }
  
  // Simulation step
  const step = useCallback(() => {
    if (!gridRef.current) return
    
    const { u, v } = gridRef.current
    const { f, k, Du, Dv } = params[pattern]
    
    const newU = new Float32Array(width * height)
    const newV = new Float32Array(width * height)
    
    const dt = 1.0
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x
        const uVal = u[idx]
        const vVal = v[idx]
        
        const lapU = laplacian(u, x, y)
        const lapV = laplacian(v, x, y)
        
        const uvv = uVal * vVal * vVal
        
        newU[idx] = uVal + dt * (Du * lapU - uvv + f * (1 - uVal))
        newV[idx] = vVal + dt * (Dv * lapV + uvv - (k + f) * vVal)
        
        // Clamp values
        newU[idx] = Math.max(0, Math.min(1, newU[idx]))
        newV[idx] = Math.max(0, Math.min(1, newV[idx]))
      }
    }
    
    gridRef.current = { u: newU, v: newV }
    setGeneration(g => g + 1)
  }, [pattern])
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const imageData = ctx.createImageData(width, height)
    
    const animate = () => {
      if (isRunning) {
        // Run multiple steps per frame for faster evolution
        for (let i = 0; i < 8; i++) {
          step()
        }
      }
      
      if (gridRef.current) {
        const { v } = gridRef.current
        
        // Render
        for (let i = 0; i < width * height; i++) {
          const val = Math.floor((1 - v[i]) * 255)
          const px = i * 4
          
          // Organic color scheme
          imageData.data[px] = Math.floor(val * 0.9)     // R
          imageData.data[px + 1] = Math.floor(val * 0.95) // G
          imageData.data[px + 2] = val                    // B
          imageData.data[px + 3] = 255                    // A
        }
        
        ctx.putImageData(imageData, 0, 0)
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isRunning, step])
  
  // Add seed on click
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gridRef.current) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = width / rect.width
    const scaleY = height / rect.height
    
    const cx = Math.floor((e.clientX - rect.left) * scaleX)
    const cy = Math.floor((e.clientY - rect.top) * scaleY)
    
    const { u, v } = gridRef.current
    
    for (let dx = -5; dx <= 5; dx++) {
      for (let dy = -5; dy <= 5; dy++) {
        if (dx * dx + dy * dy > 25) continue
        const x = (cx + dx + width) % width
        const y = (cy + dy + height) % height
        const idx = y * width + x
        u[idx] = 0.5 + Math.random() * 0.1
        v[idx] = 0.25 + Math.random() * 0.1
      }
    }
  }
  
  const patternInfo = {
    mitosis: 'Self-replicating spots',
    coral: 'Coral-like growth',
    spots: 'Leopard spots',
    stripes: 'Zebra stripes',
    maze: 'Labyrinthine patterns',
  }
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-white rounded-xl p-[1em] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.5em]">
        <div>
          <div className="text-[0.625em] font-medium text-black/40 uppercase tracking-wider">
            REACTION-DIFFUSION
          </div>
          <div className="text-[0.4375em] text-black/30">
            Turing patterns • Gray-Scott model
          </div>
        </div>
        <div className="flex items-center gap-[0.5em]">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-[0.5em] py-[0.25em] rounded text-[0.5em] font-medium transition-colors ${
              isRunning ? 'bg-emerald-500 text-white' : 'bg-black/10 text-black/60'
            }`}
          >
            {isRunning ? '▶ RUN' : '⏸ PAUSE'}
          </button>
          <button
            onClick={initGrid}
            className="px-[0.5em] py-[0.25em] rounded text-[0.5em] font-medium bg-black/10 text-black/60 hover:bg-black/20"
          >
            ↺ RESET
          </button>
        </div>
      </div>
      
      {/* Pattern selector */}
      <div className="flex gap-[0.25em] mb-[0.5em] overflow-x-auto">
        {(Object.keys(params) as Array<keyof typeof params>).map(p => (
          <button
            key={p}
            onClick={() => setPattern(p)}
            className={`px-[0.5em] py-[0.25em] rounded text-[0.5em] font-medium whitespace-nowrap transition-colors ${
              pattern === p
                ? 'bg-black text-white'
                : 'bg-black/5 text-black/60 hover:bg-black/10'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Canvas */}
      <div className="flex-1 relative flex items-center justify-center min-h-0">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onClick={handleClick}
          className="w-full h-full object-contain rounded-lg cursor-crosshair"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      
      {/* Info */}
      <div className="mt-[0.5em] pt-[0.5em] border-t border-black/5">
        <div className="flex items-center justify-between text-[0.5em]">
          <span className="text-black/40">
            {patternInfo[pattern]} • Click to add seeds
          </span>
          <span className="font-mono text-black/30">
            Gen {generation.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
