'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface FunctionEntry {
  id: string
  expression: string
  color: string
  visible: boolean
}

const COLORS = ['#000000', '#e6007e', '#22c55e', '#3b82f6']

const PRESETS = {
  linear: [
    { name: 'y = x', expr: 'x' },
    { name: 'y = 2x', expr: '2*x' },
    { name: 'y = x + 1', expr: 'x + 1' },
    { name: 'y = -x', expr: '-x' },
  ],
  quadratic: [
    { name: 'y = x²', expr: 'x^2' },
    { name: 'y = -x²', expr: '-x^2' },
    { name: 'y = (x-2)²', expr: '(x-2)^2' },
    { name: 'y = x² - 4', expr: 'x^2 - 4' },
  ],
  trig: [
    { name: 'y = sin(x)', expr: 'sin(x)' },
    { name: 'y = cos(x)', expr: 'cos(x)' },
    { name: 'y = tan(x)', expr: 'tan(x)' },
    { name: 'y = 2sin(x)', expr: '2*sin(x)' },
  ],
  exponential: [
    { name: 'y = eˣ', expr: 'exp(x)' },
    { name: 'y = e⁻ˣ', expr: 'exp(-x)' },
    { name: 'y = 2ˣ', expr: '2^x' },
  ],
  logarithmic: [
    { name: 'y = ln(x)', expr: 'ln(x)' },
    { name: 'y = log(x)', expr: 'log(x)' },
  ],
  other: [
    { name: 'y = 1/x', expr: '1/x' },
    { name: 'y = √x', expr: 'sqrt(x)' },
    { name: 'y = |x|', expr: 'abs(x)' },
  ],
}

export default function GraphCalculator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [functions, setFunctions] = useState<FunctionEntry[]>([
    { id: '1', expression: 'sin(x)', color: COLORS[0], visible: true }
  ])
  
  const [viewWindow, setViewWindow] = useState({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10
  })
  
  const [showGrid, setShowGrid] = useState(true)
  const [showAxes, setShowAxes] = useState(true)
  const [traceMode, setTraceMode] = useState(false)
  const [traceX, setTraceX] = useState<number | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [presetCategory, setPresetCategory] = useState<string | null>(null)

  // Parse and evaluate expression
  const evaluate = useCallback((expression: string, x: number): number => {
    try {
      // Replace common notations
      let expr = expression
        .replace(/\^/g, '**')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/exp\(/g, 'Math.exp(')
        .replace(/pi/g, 'Math.PI')
        .replace(/e(?![xp])/g, 'Math.E')
      
      // Create function and evaluate
      const fn = new Function('x', `return ${expr}`)
      const result = fn(x)
      return typeof result === 'number' && isFinite(result) ? result : NaN
    } catch {
      return NaN
    }
  }, [])

  // Draw the graph
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    ctx.scale(dpr, dpr)
    
    const width = rect.width
    const height = rect.height
    
    // Colors based on mode
    const bgColor = darkMode ? '#0a0a0f' : '#ffffff'
    const gridColor = darkMode ? '#1a1a2e' : '#e5e5e5'
    const axisColor = darkMode ? '#333344' : '#cccccc'
    const textColor = darkMode ? '#666688' : '#999999'
    
    // Clear
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)
    
    // Coordinate transforms
    const { xMin, xMax, yMin, yMax } = viewWindow
    const xScale = width / (xMax - xMin)
    const yScale = height / (yMax - yMin)
    
    const toCanvasX = (x: number) => (x - xMin) * xScale
    const toCanvasY = (y: number) => height - (y - yMin) * yScale
    const toMathX = (cx: number) => cx / xScale + xMin
    const toMathY = (cy: number) => yMax - cy / yScale
    
    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 1
      
      // Determine grid spacing
      const xRange = xMax - xMin
      const yRange = yMax - yMin
      const xStep = Math.pow(10, Math.floor(Math.log10(xRange / 5)))
      const yStep = Math.pow(10, Math.floor(Math.log10(yRange / 5)))
      
      // Vertical lines
      for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
        const cx = toCanvasX(x)
        ctx.beginPath()
        ctx.moveTo(cx, 0)
        ctx.lineTo(cx, height)
        ctx.stroke()
      }
      
      // Horizontal lines
      for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
        const cy = toCanvasY(y)
        ctx.beginPath()
        ctx.moveTo(0, cy)
        ctx.lineTo(width, cy)
        ctx.stroke()
      }
    }
    
    // Draw axes
    if (showAxes) {
      ctx.strokeStyle = axisColor
      ctx.lineWidth = 2
      
      // X axis
      if (yMin <= 0 && yMax >= 0) {
        const cy = toCanvasY(0)
        ctx.beginPath()
        ctx.moveTo(0, cy)
        ctx.lineTo(width, cy)
        ctx.stroke()
      }
      
      // Y axis
      if (xMin <= 0 && xMax >= 0) {
        const cx = toCanvasX(0)
        ctx.beginPath()
        ctx.moveTo(cx, 0)
        ctx.lineTo(cx, height)
        ctx.stroke()
      }
      
      // Labels
      ctx.font = '12px monospace'
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      
      const xStep = Math.pow(10, Math.floor(Math.log10((xMax - xMin) / 5)))
      for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
        if (Math.abs(x) > 0.001) {
          const cx = toCanvasX(x)
          const cy = toCanvasY(0)
          if (cy > 0 && cy < height - 20) {
            ctx.fillText(x.toString(), cx, Math.min(cy + 15, height - 5))
          }
        }
      }
    }
    
    // Draw functions
    functions.forEach(fn => {
      if (!fn.visible || !fn.expression.trim()) return
      
      ctx.strokeStyle = darkMode && fn.color === '#000000' ? '#00ff88' : fn.color
      ctx.lineWidth = 2
      ctx.beginPath()
      
      let started = false
      const step = (xMax - xMin) / width
      
      for (let cx = 0; cx <= width; cx++) {
        const x = toMathX(cx)
        const y = evaluate(fn.expression, x)
        
        if (!isNaN(y) && isFinite(y)) {
          const cy = toCanvasY(y)
          if (cy >= -1000 && cy <= height + 1000) {
            if (!started) {
              ctx.moveTo(cx, cy)
              started = true
            } else {
              ctx.lineTo(cx, cy)
            }
          } else {
            started = false
          }
        } else {
          started = false
        }
      }
      
      ctx.stroke()
    })
    
    // Draw trace
    if (traceMode && traceX !== null) {
      const cx = toCanvasX(traceX)
      
      // Vertical line
      ctx.strokeStyle = darkMode ? '#444466' : '#cccccc'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(cx, 0)
      ctx.lineTo(cx, height)
      ctx.stroke()
      ctx.setLineDash([])
      
      // Points on functions
      functions.forEach(fn => {
        if (!fn.visible || !fn.expression.trim()) return
        
        const y = evaluate(fn.expression, traceX)
        if (!isNaN(y) && isFinite(y)) {
          const cy = toCanvasY(y)
          
          // Draw point
          ctx.fillStyle = fn.color
          ctx.beginPath()
          ctx.arc(cx, cy, 5, 0, Math.PI * 2)
          ctx.fill()
          
          // Draw coordinate
          ctx.fillStyle = darkMode ? '#ffffff' : '#000000'
          ctx.font = '12px monospace'
          ctx.textAlign = 'left'
          ctx.fillText(`(${traceX.toFixed(2)}, ${y.toFixed(2)})`, cx + 10, cy - 10)
        }
      })
    }
  }, [functions, viewWindow, showGrid, showAxes, traceMode, traceX, darkMode, evaluate])

  // Draw on changes
  useEffect(() => {
    draw()
    
    const handleResize = () => draw()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [draw])

  // Handle mouse move for trace
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!traceMode) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const { xMin, xMax } = viewWindow
    const x = cx / rect.width * (xMax - xMin) + xMin
    setTraceX(x)
  }

  // Zoom functions
  const zoom = (factor: number) => {
    const { xMin, xMax, yMin, yMax } = viewWindow
    const xCenter = (xMin + xMax) / 2
    const yCenter = (yMin + yMax) / 2
    const xRange = (xMax - xMin) / factor
    const yRange = (yMax - yMin) / factor
    
    setViewWindow({
      xMin: xCenter - xRange / 2,
      xMax: xCenter + xRange / 2,
      yMin: yCenter - yRange / 2,
      yMax: yCenter + yRange / 2
    })
  }

  const resetView = () => {
    setViewWindow({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })
  }

  // Function management
  const addFunction = () => {
    if (functions.length >= 4) return
    setFunctions([...functions, {
      id: Date.now().toString(),
      expression: '',
      color: COLORS[functions.length],
      visible: true
    }])
  }

  const updateFunction = (id: string, updates: Partial<FunctionEntry>) => {
    setFunctions(functions.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const removeFunction = (id: string) => {
    if (functions.length <= 1) return
    setFunctions(functions.filter(f => f.id !== id))
  }

  const loadPreset = (expr: string) => {
    if (functions.length > 0) {
      updateFunction(functions[0].id, { expression: expr })
    }
    setPresetCategory(null)
  }

  return (
    <div className="space-y-4">
      {/* Function Inputs */}
      <div className="space-y-2">
        {functions.map((fn, idx) => (
          <div key={fn.id} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: fn.color }}
            />
            <span className="font-mono text-black/60 shrink-0">f{idx + 1}(x) =</span>
            <input
              type="text"
              value={fn.expression}
              onChange={(e) => updateFunction(fn.id, { expression: e.target.value })}
              placeholder="e.g., sin(x), x^2, sqrt(x)"
              className="flex-1 px-3 py-2 font-mono bg-neutral-100 rounded-lg border-0 focus:ring-2 focus:ring-black"
            />
            <button
              onClick={() => updateFunction(fn.id, { visible: !fn.visible })}
              className={`px-3 py-2 rounded-lg ${fn.visible ? 'bg-neutral-200' : 'bg-neutral-100 text-black/40'}`}
            >
              {fn.visible ? '👁' : '👁‍🗨'}
            </button>
            {functions.length > 1 && (
              <button
                onClick={() => removeFunction(fn.id)}
                className="px-3 py-2 rounded-lg bg-neutral-100 text-black/40 hover:bg-red-100 hover:text-red-500"
              >
                ×
              </button>
            )}
          </div>
        ))}
        
        {functions.length < 4 && (
          <button
            onClick={addFunction}
            className="text-sm text-black/40 hover:text-black"
          >
            + Add function
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => zoom(1.5)}
          className="px-3 py-2 bg-neutral-200 rounded-lg hover:bg-neutral-300"
        >
          Zoom +
        </button>
        <button
          onClick={() => zoom(0.67)}
          className="px-3 py-2 bg-neutral-200 rounded-lg hover:bg-neutral-300"
        >
          Zoom −
        </button>
        <button
          onClick={resetView}
          className="px-3 py-2 bg-neutral-200 rounded-lg hover:bg-neutral-300"
        >
          Reset
        </button>
        <div className="w-px h-6 bg-neutral-300" />
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`px-3 py-2 rounded-lg ${showGrid ? 'bg-neutral-300' : 'bg-neutral-200'}`}
        >
          Grid
        </button>
        <button
          onClick={() => setShowAxes(!showAxes)}
          className={`px-3 py-2 rounded-lg ${showAxes ? 'bg-neutral-300' : 'bg-neutral-200'}`}
        >
          Axes
        </button>
        <button
          onClick={() => setTraceMode(!traceMode)}
          className={`px-3 py-2 rounded-lg ${traceMode ? 'bg-black text-white' : 'bg-neutral-200'}`}
        >
          Trace
        </button>
        <div className="w-px h-6 bg-neutral-300" />
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-black text-white' : 'bg-neutral-200'}`}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
        
        {/* Presets dropdown */}
        <div className="relative">
          <button
            onClick={() => setPresetCategory(presetCategory ? null : 'linear')}
            className="px-3 py-2 bg-neutral-200 rounded-lg hover:bg-neutral-300"
          >
            Presets ▾
          </button>
          
          {presetCategory && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 z-10 min-w-[200px]">
              <div className="flex border-b border-neutral-200">
                {Object.keys(PRESETS).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setPresetCategory(cat)}
                    className={`px-2 py-1 text-xs ${presetCategory === cat ? 'bg-neutral-100' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="p-2 space-y-1">
                {PRESETS[presetCategory as keyof typeof PRESETS]?.map(preset => (
                  <button
                    key={preset.expr}
                    onClick={() => loadPreset(preset.expr)}
                    className="w-full text-left px-2 py-1 text-sm hover:bg-neutral-100 rounded"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Graph Canvas */}
      <div 
        ref={containerRef}
        className="relative rounded-xl overflow-hidden border border-neutral-200"
        style={{ height: '400px' }}
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTraceX(null)}
          className="absolute inset-0 cursor-crosshair"
        />
      </div>

      {/* Syntax help */}
      <div className="text-sm text-black/40 space-y-1">
        <p><strong>Syntax:</strong> Use x as variable. Operators: + − * / ^ (power)</p>
        <p><strong>Functions:</strong> sin, cos, tan, sqrt, abs, ln, log, exp</p>
        <p><strong>Constants:</strong> pi, e</p>
      </div>
    </div>
  )
}
