'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// LORENZ ATTRACTOR
// ===========================================
// The butterfly attractor - chaos theory visualization
// Design: Teenage Engineering inspired (clean, playful, precise)
// ===========================================

interface Point3D {
  x: number
  y: number
  z: number
}

export default function LorenzAttractor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [isRunning, setIsRunning] = useState(true)
  const [sigma, setSigma] = useState(10)
  const [rho, setRho] = useState(28)
  const [beta, setBeta] = useState(8/3)
  const [rotationY, setRotationY] = useState(0)
  const [trail, setTrail] = useState<Point3D[]>([])
  const [stats, setStats] = useState({ x: 0, y: 0, z: 0 })
  
  const pointRef = useRef<Point3D>({ x: 0.1, y: 0, z: 0 })
  const trailRef = useRef<Point3D[]>([])
  const animationRef = useRef<number>()
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setBaseFontSize(width / 25)
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
  
  const lorenzStep = useCallback((p: Point3D, dt: number) => {
    const dx = sigma * (p.y - p.x) * dt
    const dy = (p.x * (rho - p.z) - p.y) * dt
    const dz = (p.x * p.y - beta * p.z) * dt
    return {
      x: p.x + dx,
      y: p.y + dy,
      z: p.z + dz
    }
  }, [sigma, rho, beta])
  
  const project = useCallback((p: Point3D, width: number, height: number): { x: number, y: number } => {
    const scale = 8
    const cosY = Math.cos(rotationY)
    const sinY = Math.sin(rotationY)
    
    const rx = p.x * cosY - p.z * sinY
    const rz = p.x * sinY + p.z * cosY
    
    const perspective = 60 / (60 + rz * 0.5)
    
    return {
      x: width / 2 + rx * scale * perspective,
      y: height / 2 - (p.y - 25) * scale * perspective * 0.6
    }
  }, [rotationY])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const animate = () => {
      const width = canvas.width
      const height = canvas.height
      
      // Clear with slight fade for trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.fillRect(0, 0, width, height)
      
      if (isRunning) {
        // Perform multiple steps per frame for smoothness
        for (let i = 0; i < 5; i++) {
          pointRef.current = lorenzStep(pointRef.current, 0.005)
          trailRef.current.push({ ...pointRef.current })
          if (trailRef.current.length > 2000) {
            trailRef.current.shift()
          }
        }
        
        setStats({
          x: pointRef.current.x,
          y: pointRef.current.y,
          z: pointRef.current.z
        })
        
        // Auto-rotate
        setRotationY(r => r + 0.003)
      }
      
      // Draw trail
      const points = trailRef.current
      if (points.length > 1) {
        ctx.beginPath()
        const first = project(points[0], width, height)
        ctx.moveTo(first.x, first.y)
        
        for (let i = 1; i < points.length; i++) {
          const projected = project(points[i], width, height)
          ctx.lineTo(projected.x, projected.y)
        }
        
        // Teenage Engineering orange gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, '#ff6600')
        gradient.addColorStop(0.5, '#ff9933')
        gradient.addColorStop(1, '#ff6600')
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
        
        // Draw current point
        const current = project(pointRef.current, width, height)
        ctx.beginPath()
        ctx.arc(current.x, current.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#ff3300'
        ctx.fill()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1
        ctx.stroke()
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isRunning, lorenzStep, project])
  
  const reset = () => {
    pointRef.current = { x: 0.1 + Math.random() * 0.01, y: 0, z: 0 }
    trailRef.current = []
  }
  
  const presets = [
    { name: 'Classic', sigma: 10, rho: 28, beta: 8/3 },
    { name: 'Tight', sigma: 10, rho: 24, beta: 8/3 },
    { name: 'Wild', sigma: 14, rho: 35, beta: 8/3 },
    { name: 'Spiral', sigma: 10, rho: 15, beta: 8/3 },
  ]
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-white rounded-xl p-[1em] h-full flex flex-col">
      {/* Header - Teenage Engineering style */}
      <div className="flex items-center justify-between mb-[0.5em]">
        <div className="flex items-center gap-[0.5em]">
          <div className="w-[0.5em] h-[0.5em] rounded-full bg-[#ff6600]" />
          <span className="text-[0.625em] font-medium text-black/60 uppercase tracking-wider">
            LORENZ SYSTEM
          </span>
        </div>
        <div className="flex items-center gap-[0.5em]">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-[0.5em] py-[0.25em] rounded text-[0.5em] font-mono font-medium transition-colors ${
              isRunning ? 'bg-[#ff6600] text-white' : 'bg-black/10 text-black/60'
            }`}
          >
            {isRunning ? '▶ RUN' : '⏸ PAUSE'}
          </button>
          <button
            onClick={reset}
            className="px-[0.5em] py-[0.25em] rounded text-[0.5em] font-mono font-medium bg-black/10 text-black/60 hover:bg-black/20"
          >
            ↺ RESET
          </button>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 relative bg-white rounded-lg overflow-hidden border border-black/5 min-h-0">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full h-full"
        />
        
        {/* Axis labels */}
        <div className="absolute bottom-[0.5em] left-[0.5em] text-[0.5em] font-mono text-black/30">X</div>
        <div className="absolute top-[0.5em] left-[0.5em] text-[0.5em] font-mono text-black/30">Y</div>
        <div className="absolute bottom-[0.5em] right-[0.5em] text-[0.5em] font-mono text-black/30">Z</div>
      </div>
      
      {/* Stats display - monospace, precise */}
      <div className="mt-[0.5em] grid grid-cols-3 gap-[0.5em]">
        {['x', 'y', 'z'].map(axis => (
          <div key={axis} className="bg-black/[0.02] rounded px-[0.5em] py-[0.375em]">
            <div className="text-[0.5em] font-mono text-black/40 uppercase">{axis}</div>
            <div className="font-mono text-[0.75em] font-medium text-black">
              {stats[axis as keyof typeof stats].toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Parameters - Teenage Engineering knob style */}
      <div className="mt-[0.5em] pt-[0.5em] border-t border-black/5">
        <div className="flex items-center justify-between mb-[0.375em]">
          <span className="text-[0.5em] font-mono text-black/40">PARAMETERS</span>
          <div className="flex gap-[0.25em]">
            {presets.map(p => (
              <button
                key={p.name}
                onClick={() => {
                  setSigma(p.sigma)
                  setRho(p.rho)
                  setBeta(p.beta)
                  reset()
                }}
                className="px-[0.375em] py-[0.125em] rounded text-[0.4375em] font-mono bg-black/5 text-black/60 hover:bg-[#ff6600] hover:text-white transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-[0.5em]">
          <div>
            <div className="text-[0.4375em] font-mono text-black/40 mb-[0.125em]">σ (sigma)</div>
            <input
              type="range"
              min="5"
              max="20"
              step="0.5"
              value={sigma}
              onChange={(e) => setSigma(parseFloat(e.target.value))}
              className="w-full h-[0.25em] bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[0.75em] [&::-webkit-slider-thumb]:h-[0.75em] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ff6600]"
            />
            <div className="text-[0.4375em] font-mono text-black/60 text-center">{sigma}</div>
          </div>
          <div>
            <div className="text-[0.4375em] font-mono text-black/40 mb-[0.125em]">ρ (rho)</div>
            <input
              type="range"
              min="10"
              max="40"
              step="0.5"
              value={rho}
              onChange={(e) => setRho(parseFloat(e.target.value))}
              className="w-full h-[0.25em] bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[0.75em] [&::-webkit-slider-thumb]:h-[0.75em] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ff6600]"
            />
            <div className="text-[0.4375em] font-mono text-black/60 text-center">{rho}</div>
          </div>
          <div>
            <div className="text-[0.4375em] font-mono text-black/40 mb-[0.125em]">β (beta)</div>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={beta}
              onChange={(e) => setBeta(parseFloat(e.target.value))}
              className="w-full h-[0.25em] bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[0.75em] [&::-webkit-slider-thumb]:h-[0.75em] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ff6600]"
            />
            <div className="text-[0.4375em] font-mono text-black/60 text-center">{beta.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-[0.375em] text-center text-[0.4375em] text-black/30 font-mono">
        MXWLL • PLAY/ATTRACTORS
      </div>
    </div>
  )
}
