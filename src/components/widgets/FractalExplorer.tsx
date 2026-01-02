'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// FRACTAL EXPLORER
// ===========================================
// Interactive Mandelbrot and Julia set exploration
// Design: Warm analogue aesthetic
// ===========================================

export default function FractalExplorer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [mode, setMode] = useState<'mandelbrot' | 'julia'>('mandelbrot')
  const [centerX, setCenterX] = useState(-0.5)
  const [centerY, setCenterY] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [maxIter, setMaxIter] = useState(100)
  const [juliaC, setJuliaC] = useState({ x: -0.7, y: 0.27 })
  const [colorScheme, setColorScheme] = useState<'warm' | 'ocean' | 'fire' | 'psychedelic'>('warm')
  const [rendering, setRendering] = useState(false)
  
  const width = 300
  const height = 300
  
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
  
  // Color schemes
  const getColor = useCallback((iter: number, maxIter: number): [number, number, number] => {
    if (iter === maxIter) return [0, 0, 0]
    
    const t = iter / maxIter
    
    switch (colorScheme) {
      case 'warm':
        return [
          Math.floor(255 * Math.pow(t, 0.5)),
          Math.floor(180 * t),
          Math.floor(100 * Math.pow(t, 2))
        ]
      case 'ocean':
        return [
          Math.floor(50 * t),
          Math.floor(150 * Math.pow(t, 0.7)),
          Math.floor(255 * Math.pow(t, 0.5))
        ]
      case 'fire':
        return [
          Math.floor(255 * Math.min(1, t * 2)),
          Math.floor(255 * Math.pow(t, 1.5)),
          Math.floor(255 * Math.pow(t, 3))
        ]
      case 'psychedelic':
        return [
          Math.floor(127.5 * (1 + Math.sin(t * 20))),
          Math.floor(127.5 * (1 + Math.sin(t * 20 + 2))),
          Math.floor(127.5 * (1 + Math.sin(t * 20 + 4)))
        ]
      default:
        return [Math.floor(255 * t), Math.floor(255 * t), Math.floor(255 * t)]
    }
  }, [colorScheme])
  
  // Mandelbrot iteration
  const mandelbrot = (cx: number, cy: number): number => {
    let x = 0, y = 0
    let iter = 0
    
    while (x * x + y * y <= 4 && iter < maxIter) {
      const xtemp = x * x - y * y + cx
      y = 2 * x * y + cy
      x = xtemp
      iter++
    }
    
    // Smooth coloring
    if (iter < maxIter) {
      const log_zn = Math.log(x * x + y * y) / 2
      const nu = Math.log(log_zn / Math.log(2)) / Math.log(2)
      iter = iter + 1 - nu
    }
    
    return iter
  }
  
  // Julia iteration
  const julia = (zx: number, zy: number): number => {
    let x = zx, y = zy
    let iter = 0
    
    while (x * x + y * y <= 4 && iter < maxIter) {
      const xtemp = x * x - y * y + juliaC.x
      y = 2 * x * y + juliaC.y
      x = xtemp
      iter++
    }
    
    // Smooth coloring
    if (iter < maxIter) {
      const log_zn = Math.log(x * x + y * y) / 2
      const nu = Math.log(log_zn / Math.log(2)) / Math.log(2)
      iter = iter + 1 - nu
    }
    
    return iter
  }
  
  // Render fractal
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    setRendering(true)
    
    const imageData = ctx.createImageData(width, height)
    const scale = 3 / (zoom * width)
    
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const x0 = (px - width / 2) * scale + centerX
        const y0 = (py - height / 2) * scale + centerY
        
        const iter = mode === 'mandelbrot' ? mandelbrot(x0, y0) : julia(x0, y0)
        const [r, g, b] = getColor(iter, maxIter)
        
        const idx = (py * width + px) * 4
        imageData.data[idx] = r
        imageData.data[idx + 1] = g
        imageData.data[idx + 2] = b
        imageData.data[idx + 3] = 255
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
    setRendering(false)
  }, [centerX, centerY, zoom, maxIter, mode, juliaC, getColor])
  
  useEffect(() => {
    render()
  }, [render])
  
  // Handle click to zoom
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const px = (e.clientX - rect.left) * (width / rect.width)
    const py = (e.clientY - rect.top) * (height / rect.height)
    
    const scale = 3 / (zoom * width)
    const newX = (px - width / 2) * scale + centerX
    const newY = (py - height / 2) * scale + centerY
    
    if (e.shiftKey) {
      // Shift+click: zoom out
      setZoom(z => z / 2)
    } else {
      // Click: zoom in and recenter
      setCenterX(newX)
      setCenterY(newY)
      setZoom(z => z * 2)
    }
  }
  
  // Reset view
  const resetView = () => {
    if (mode === 'mandelbrot') {
      setCenterX(-0.5)
      setCenterY(0)
    } else {
      setCenterX(0)
      setCenterY(0)
    }
    setZoom(1)
  }
  
  // Interesting locations
  const presets = mode === 'mandelbrot' ? [
    { name: 'Overview', x: -0.5, y: 0, z: 1 },
    { name: 'Seahorse Valley', x: -0.745, y: 0.113, z: 100 },
    { name: 'Elephant Valley', x: 0.275, y: 0.006, z: 50 },
    { name: 'Triple Spiral', x: -0.088, y: 0.654, z: 200 },
  ] : [
    { name: 'Classic', cx: -0.7, cy: 0.27015 },
    { name: 'Dendrite', cx: 0, cy: 1 },
    { name: 'Siegel Disk', cx: -0.391, cy: -0.587 },
    { name: 'Rabbit', cx: -0.123, cy: 0.745 },
  ]
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-[#1a1810] rounded-xl p-[1em] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.5em]">
        <div className="flex items-center gap-[0.5em]">
          {(['mandelbrot', 'julia'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); resetView(); }}
              className={`px-[0.5em] py-[0.25em] rounded text-[0.5em] font-medium transition-colors ${
                mode === m
                  ? 'bg-amber-600 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={resetView}
          className="px-[0.5em] py-[0.25em] rounded text-[0.5em] font-medium bg-white/10 text-white/60 hover:bg-white/20"
        >
          ↺ Reset
        </button>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 relative flex items-center justify-center min-h-0">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onClick={handleClick}
          className={`max-w-full max-h-full rounded-lg cursor-crosshair ${rendering ? 'opacity-75' : ''}`}
          style={{ imageRendering: 'auto' }}
        />
        {rendering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[0.75em] text-white/60">Rendering...</div>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="mt-[0.5em] pt-[0.5em] border-t border-white/10">
        {/* Color schemes */}
        <div className="flex gap-[0.25em] mb-[0.5em]">
          {(['warm', 'ocean', 'fire', 'psychedelic'] as const).map(c => (
            <button
              key={c}
              onClick={() => setColorScheme(c)}
              className={`flex-1 py-[0.25em] rounded text-[0.4375em] font-medium transition-colors ${
                colorScheme === c
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Presets */}
        <div className="flex gap-[0.25em] mb-[0.5em]">
          <span className="text-[0.4375em] text-white/30 self-center">Go to:</span>
          {presets.slice(0, 3).map((p) => (
            <button
              key={p.name}
              onClick={() => {
                if ('z' in p) {
                  setCenterX(p.x)
                  setCenterY(p.y)
                  setZoom(p.z)
                } else {
                  setJuliaC({ x: p.cx, y: p.cy })
                  setCenterX(0)
                  setCenterY(0)
                  setZoom(1)
                }
              }}
              className="px-[0.375em] py-[0.125em] rounded text-[0.375em] bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
            >
              {p.name}
            </button>
          ))}
        </div>
        
        {/* Info */}
        <div className="flex items-center justify-between text-[0.4375em] text-white/30">
          <span>Click to zoom in • Shift+click to zoom out</span>
          <span className="font-mono">
            {zoom.toFixed(0)}× • ({centerX.toFixed(4)}, {centerY.toFixed(4)})
          </span>
        </div>
      </div>
    </div>
  )
}
