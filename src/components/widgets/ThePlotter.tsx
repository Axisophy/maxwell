'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// THE PLOTTER
// ===========================================
// Interactive function graphing tool
// Oscilloscope aesthetic
// ===========================================

interface Point {
  x: number
  y: number
}

const PRESETS = {
  'sine': { expr: 'sin(x)', label: 'Sine Wave' },
  'cosine': { expr: 'cos(x)', label: 'Cosine Wave' },
  'parabola': { expr: 'x^2', label: 'Parabola' },
  'cubic': { expr: 'x^3 - x', label: 'Cubic' },
  'exponential': { expr: 'exp(x)', label: 'Exponential' },
  'logarithm': { expr: 'log(x)', label: 'Logarithm' },
  'sinc': { expr: 'sin(x)/x', label: 'Sinc Function' },
  'gaussian': { expr: 'exp(-x^2)', label: 'Gaussian' },
  'tangent': { expr: 'tan(x)', label: 'Tangent' },
  'reciprocal': { expr: '1/x', label: 'Reciprocal' },
}

// Safe math parser
function evaluateExpression(expr: string, x: number): number | null {
  try {
    // Replace math functions with Math.
    let safe = expr
      .replace(/\^/g, '**')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/exp\(/g, 'Math.exp(')
      .replace(/log\(/g, 'Math.log(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/pi/g, 'Math.PI')
      .replace(/e(?![xp])/g, 'Math.E')
    
    // eslint-disable-next-line no-new-func
    const fn = new Function('x', `return ${safe}`)
    const result = fn(x)
    
    if (typeof result !== 'number' || !isFinite(result)) {
      return null
    }
    return result
  } catch {
    return null
  }
}

export default function ThePlotter() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [expression, setExpression] = useState('sin(x)')
  const [inputValue, setInputValue] = useState('sin(x)')
  const [xMin, setXMin] = useState(-10)
  const [xMax, setXMax] = useState(10)
  const [yMin, setYMin] = useState(-5)
  const [yMax, setYMax] = useState(5)
  const [showGrid, setShowGrid] = useState(true)
  const [isValid, setIsValid] = useState(true)
  
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
  
  // Draw graph
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const width = canvas.width
    const height = canvas.height
    
    // Dark oscilloscope background
    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, width, height)
    
    // Coordinate transforms
    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height
    
    // Grid
    if (showGrid) {
      ctx.strokeStyle = '#1a2a1a'
      ctx.lineWidth = 1
      
      // Vertical grid lines
      const xStep = Math.pow(10, Math.floor(Math.log10(xMax - xMin)) - 1)
      for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
        const cx = toCanvasX(x)
        ctx.beginPath()
        ctx.moveTo(cx, 0)
        ctx.lineTo(cx, height)
        ctx.stroke()
      }
      
      // Horizontal grid lines
      const yStep = Math.pow(10, Math.floor(Math.log10(yMax - yMin)) - 1)
      for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
        const cy = toCanvasY(y)
        ctx.beginPath()
        ctx.moveTo(0, cy)
        ctx.lineTo(width, cy)
        ctx.stroke()
      }
    }
    
    // Axes
    ctx.strokeStyle = '#2a4a2a'
    ctx.lineWidth = 2
    
    // X-axis
    if (yMin <= 0 && yMax >= 0) {
      const y0 = toCanvasY(0)
      ctx.beginPath()
      ctx.moveTo(0, y0)
      ctx.lineTo(width, y0)
      ctx.stroke()
    }
    
    // Y-axis
    if (xMin <= 0 && xMax >= 0) {
      const x0 = toCanvasX(0)
      ctx.beginPath()
      ctx.moveTo(x0, 0)
      ctx.lineTo(x0, height)
      ctx.stroke()
    }
    
    // Plot function
    ctx.strokeStyle = '#00ff88'
    ctx.lineWidth = 2
    ctx.shadowColor = '#00ff88'
    ctx.shadowBlur = 4
    ctx.beginPath()
    
    let started = false
    const points: Point[] = []
    
    for (let px = 0; px < width; px++) {
      const x = xMin + (px / width) * (xMax - xMin)
      const y = evaluateExpression(expression, x)
      
      if (y !== null && y >= yMin - (yMax - yMin) && y <= yMax + (yMax - yMin)) {
        const cy = toCanvasY(y)
        points.push({ x: px, y: cy })
        
        if (!started) {
          ctx.moveTo(px, cy)
          started = true
        } else {
          ctx.lineTo(px, cy)
        }
      } else {
        // Discontinuity - start new path
        if (started) {
          ctx.stroke()
          ctx.beginPath()
          started = false
        }
      }
    }
    
    ctx.stroke()
    ctx.shadowBlur = 0
    
    // Axis labels
    ctx.fillStyle = '#4a6a4a'
    ctx.font = `${Math.max(10, baseFontSize * 0.5)}px monospace`
    ctx.textAlign = 'center'
    
    // X-axis labels
    const xLabelStep = (xMax - xMin) / 5
    for (let i = 0; i <= 5; i++) {
      const x = xMin + i * xLabelStep
      const cx = toCanvasX(x)
      ctx.fillText(x.toFixed(1), cx, height - 5)
    }
    
    // Y-axis labels
    ctx.textAlign = 'left'
    const yLabelStep = (yMax - yMin) / 5
    for (let i = 0; i <= 5; i++) {
      const y = yMin + i * yLabelStep
      const cy = toCanvasY(y)
      ctx.fillText(y.toFixed(1), 5, cy - 3)
    }
  }, [expression, xMin, xMax, yMin, yMax, showGrid, baseFontSize])
  
  useEffect(() => {
    draw()
  }, [draw])
  
  // Handle expression change
  const handleExpressionSubmit = () => {
    // Test if expression is valid
    const test = evaluateExpression(inputValue, 1)
    if (test !== null || inputValue.includes('/x')) {
      setExpression(inputValue)
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }
  
  // Zoom controls
  const zoomIn = () => {
    const xCenter = (xMin + xMax) / 2
    const yCenter = (yMin + yMax) / 2
    const xRange = (xMax - xMin) * 0.4
    const yRange = (yMax - yMin) * 0.4
    setXMin(xCenter - xRange)
    setXMax(xCenter + xRange)
    setYMin(yCenter - yRange)
    setYMax(yCenter + yRange)
  }
  
  const zoomOut = () => {
    const xCenter = (xMin + xMax) / 2
    const yCenter = (yMin + yMax) / 2
    const xRange = (xMax - xMin) * 0.75
    const yRange = (yMax - yMin) * 0.75
    setXMin(xCenter - xRange)
    setXMax(xCenter + xRange)
    setYMin(yCenter - yRange)
    setYMax(yCenter + yRange)
  }
  
  const resetView = () => {
    setXMin(-10)
    setXMax(10)
    setYMin(-5)
    setYMax(5)
  }
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-[#0a0a0f] rounded-xl p-[1em] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.5em]">
        <div>
          <div className="text-[0.625em] font-medium text-[#00ff88]/60 uppercase tracking-wider">
            THE PLOTTER
          </div>
          <div className="text-[0.4375em] text-[#00ff88]/30">
            Function Graphing • Oscilloscope Mode
          </div>
        </div>
        <div className="flex items-center gap-[0.375em]">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-[0.5em] py-[0.25em] rounded text-[0.5em] font-mono transition-colors ${
              showGrid ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-white/5 text-white/30'
            }`}
          >
            GRID
          </button>
        </div>
      </div>
      
      {/* Expression input */}
      <div className="flex gap-[0.375em] mb-[0.5em]">
        <div className="flex-1 relative">
          <span className="absolute left-[0.5em] top-1/2 -translate-y-1/2 text-[0.625em] font-mono text-[#00ff88]/50">
            y =
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExpressionSubmit()}
            className={`w-full bg-black/50 border ${isValid ? 'border-[#00ff88]/30' : 'border-red-500/50'} rounded px-[0.5em] pl-[2em] py-[0.375em] text-[0.625em] font-mono text-[#00ff88] focus:outline-none focus:border-[#00ff88]/60`}
            placeholder="sin(x)"
          />
        </div>
        <button
          onClick={handleExpressionSubmit}
          className="px-[0.75em] py-[0.375em] bg-[#00ff88]/20 text-[#00ff88] rounded text-[0.5em] font-mono hover:bg-[#00ff88]/30"
        >
          PLOT
        </button>
      </div>
      
      {/* Preset buttons */}
      <div className="flex gap-[0.25em] mb-[0.5em] overflow-x-auto pb-[0.25em]">
        {Object.entries(PRESETS).slice(0, 6).map(([key, { expr, label }]) => (
          <button
            key={key}
            onClick={() => {
              setInputValue(expr)
              setExpression(expr)
              setIsValid(true)
            }}
            className={`px-[0.5em] py-[0.25em] rounded text-[0.4375em] font-mono whitespace-nowrap transition-colors ${
              expression === expr
                ? 'bg-[#00ff88]/30 text-[#00ff88]'
                : 'bg-white/5 text-white/40 hover:bg-white/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      
      {/* Canvas */}
      <div className="flex-1 relative min-h-0 rounded-lg overflow-hidden border border-[#00ff88]/20">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full h-full"
        />
        
        {/* Zoom controls overlay */}
        <div className="absolute bottom-[0.5em] right-[0.5em] flex gap-[0.25em]">
          <button
            onClick={zoomIn}
            className="w-[1.5em] h-[1.5em] bg-black/70 border border-[#00ff88]/30 rounded text-[0.625em] font-mono text-[#00ff88] hover:bg-[#00ff88]/20"
          >
            +
          </button>
          <button
            onClick={zoomOut}
            className="w-[1.5em] h-[1.5em] bg-black/70 border border-[#00ff88]/30 rounded text-[0.625em] font-mono text-[#00ff88] hover:bg-[#00ff88]/20"
          >
            −
          </button>
          <button
            onClick={resetView}
            className="px-[0.5em] h-[1.5em] bg-black/70 border border-[#00ff88]/30 rounded text-[0.5em] font-mono text-[#00ff88] hover:bg-[#00ff88]/20"
          >
            RESET
          </button>
        </div>
        
        {/* Scanline effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)'
          }}
        />
      </div>
      
      {/* Footer */}
      <div className="mt-[0.5em] pt-[0.5em] border-t border-[#00ff88]/10">
        <div className="flex items-center justify-between text-[0.4375em] font-mono text-[#00ff88]/40">
          <span>
            x: [{xMin.toFixed(1)}, {xMax.toFixed(1)}] • y: [{yMin.toFixed(1)}, {yMax.toFixed(1)}]
          </span>
          <span>
            sin, cos, tan, exp, log, sqrt, abs, pi, e, ^
          </span>
        </div>
      </div>
    </div>
  )
}
