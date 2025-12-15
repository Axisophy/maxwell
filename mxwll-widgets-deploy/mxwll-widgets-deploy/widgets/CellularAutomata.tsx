'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// CELLULAR AUTOMATA
// ===========================================
// Conway's Game of Life and other automata rules
// Design: Retro terminal aesthetic
// ===========================================

export default function CellularAutomata() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [isRunning, setIsRunning] = useState(false)
  const [generation, setGeneration] = useState(0)
  const [population, setPopulation] = useState(0)
  const [rule, setRule] = useState<'life' | 'highlife' | 'seeds' | 'day-night'>('life')
  const [speed, setSpeed] = useState(100)
  
  const gridSize = 60
  const gridRef = useRef<boolean[][]>([])
  const intervalRef = useRef<NodeJS.Timeout>()
  
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
  
  const initGrid = useCallback((pattern: 'random' | 'clear' | 'glider' | 'pulsar' | 'gosper') => {
    const grid: boolean[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false))
    
    if (pattern === 'random') {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          grid[i][j] = Math.random() > 0.7
        }
      }
    } else if (pattern === 'glider') {
      const cx = Math.floor(gridSize / 4)
      const cy = Math.floor(gridSize / 4)
      grid[cy][cx+1] = true
      grid[cy+1][cx+2] = true
      grid[cy+2][cx] = true
      grid[cy+2][cx+1] = true
      grid[cy+2][cx+2] = true
    } else if (pattern === 'pulsar') {
      const cx = Math.floor(gridSize / 2)
      const cy = Math.floor(gridSize / 2)
      const pulsar = [
        [-6,-4],[-6,-3],[-6,-2],[-4,-6],[-3,-6],[-2,-6],
        [-6,2],[-6,3],[-6,4],[-4,6],[-3,6],[-2,6],
        [6,-4],[6,-3],[6,-2],[4,-6],[3,-6],[2,-6],
        [6,2],[6,3],[6,4],[4,6],[3,6],[2,6],
        [-1,-4],[-1,-3],[-1,-2],[1,-4],[1,-3],[1,-2],
        [-1,2],[-1,3],[-1,4],[1,2],[1,3],[1,4],
        [-4,-1],[-3,-1],[-2,-1],[-4,1],[-3,1],[-2,1],
        [4,-1],[3,-1],[2,-1],[4,1],[3,1],[2,1]
      ]
      pulsar.forEach(([dy, dx]) => {
        if (cy+dy >= 0 && cy+dy < gridSize && cx+dx >= 0 && cx+dx < gridSize) {
          grid[cy+dy][cx+dx] = true
        }
      })
    } else if (pattern === 'gosper') {
      const cx = 5
      const cy = Math.floor(gridSize / 2) - 5
      const gosper = [
        [0,24],[1,22],[1,24],[2,12],[2,13],[2,20],[2,21],[2,34],[2,35],
        [3,11],[3,15],[3,20],[3,21],[3,34],[3,35],[4,0],[4,1],[4,10],
        [4,16],[4,20],[4,21],[5,0],[5,1],[5,10],[5,14],[5,16],[5,17],
        [5,22],[5,24],[6,10],[6,16],[6,24],[7,11],[7,15],[8,12],[8,13]
      ]
      gosper.forEach(([dy, dx]) => {
        if (cy+dy >= 0 && cy+dy < gridSize && cx+dx >= 0 && cx+dx < gridSize) {
          grid[cy+dy][cx+dx] = true
        }
      })
    }
    
    gridRef.current = grid
    setGeneration(0)
    countPopulation(grid)
  }, [])
  
  useEffect(() => {
    initGrid('random')
  }, [initGrid])
  
  const countPopulation = (grid: boolean[][]) => {
    let count = 0
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j]) count++
      }
    }
    setPopulation(count)
  }
  
  const countNeighbors = (grid: boolean[][], x: number, y: number): number => {
    let count = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        const nx = (x + i + gridSize) % gridSize
        const ny = (y + j + gridSize) % gridSize
        if (grid[nx][ny]) count++
      }
    }
    return count
  }
  
  const step = useCallback(() => {
    const grid = gridRef.current
    const newGrid: boolean[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false))
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const neighbors = countNeighbors(grid, i, j)
        const alive = grid[i][j]
        
        // Apply rule
        if (rule === 'life') {
          // B3/S23
          newGrid[i][j] = alive ? (neighbors === 2 || neighbors === 3) : (neighbors === 3)
        } else if (rule === 'highlife') {
          // B36/S23
          newGrid[i][j] = alive ? (neighbors === 2 || neighbors === 3) : (neighbors === 3 || neighbors === 6)
        } else if (rule === 'seeds') {
          // B2/S (no survival)
          newGrid[i][j] = !alive && neighbors === 2
        } else if (rule === 'day-night') {
          // B3678/S34678
          const birth = [3,6,7,8].includes(neighbors)
          const survive = [3,4,6,7,8].includes(neighbors)
          newGrid[i][j] = alive ? survive : birth
        }
      }
    }
    
    gridRef.current = newGrid
    setGeneration(g => g + 1)
    countPopulation(newGrid)
  }, [rule])
  
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(step, speed)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, speed, step])
  
  // Draw grid
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const cellSize = canvas.width / gridSize
    
    // Clear
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw cells
    const grid = gridRef.current
    ctx.fillStyle = '#00ff00'
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i] && grid[i][j]) {
          ctx.fillRect(j * cellSize + 0.5, i * cellSize + 0.5, cellSize - 1, cellSize - 1)
        }
      }
    }
    
    // Grid lines (subtle)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, canvas.height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(canvas.width, i * cellSize)
      ctx.stroke()
    }
  }, [generation, population])
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const x = Math.floor((e.clientX - rect.left) * scaleX / (canvas.width / gridSize))
    const y = Math.floor((e.clientY - rect.top) * scaleY / (canvas.height / gridSize))
    
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      gridRef.current[y][x] = !gridRef.current[y][x]
      countPopulation(gridRef.current)
      setGeneration(g => g) // Force re-render
    }
  }
  
  const rules = [
    { id: 'life', name: 'Life', desc: 'B3/S23' },
    { id: 'highlife', name: 'HighLife', desc: 'B36/S23' },
    { id: 'seeds', name: 'Seeds', desc: 'B2/S' },
    { id: 'day-night', name: 'Day&Night', desc: 'B3678/S34678' },
  ]
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-[#0a0a0a] rounded-xl p-[1em] h-full flex flex-col">
      {/* Header - Terminal style */}
      <div className="flex items-center justify-between mb-[0.5em]">
        <div className="flex items-center gap-[0.5em]">
          <div className="flex gap-[0.25em]">
            <div className="w-[0.5em] h-[0.5em] rounded-full bg-[#ff5f56]" />
            <div className="w-[0.5em] h-[0.5em] rounded-full bg-[#ffbd2e]" />
            <div className="w-[0.5em] h-[0.5em] rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[0.625em] font-mono text-[#00ff00]/60">
            cellular_automata.exe
          </span>
        </div>
        <div className="font-mono text-[0.5em] text-[#00ff00]/40">
          GEN:{generation.toString().padStart(5, '0')}
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 relative min-h-0">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          onClick={handleCanvasClick}
          className="w-full h-full rounded cursor-crosshair"
        />
      </div>
      
      {/* Stats bar */}
      <div className="mt-[0.5em] flex items-center gap-[1em] font-mono text-[0.5em] text-[#00ff00]">
        <span>POP: {population}</span>
        <span>RULE: {rules.find(r => r.id === rule)?.desc}</span>
        <span className={isRunning ? 'animate-pulse' : ''}>
          {isRunning ? '● RUNNING' : '○ PAUSED'}
        </span>
      </div>
      
      {/* Controls */}
      <div className="mt-[0.5em] pt-[0.5em] border-t border-[#00ff00]/20">
        <div className="flex items-center gap-[0.5em] mb-[0.5em]">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-[0.5em] py-[0.25em] rounded text-[0.5em] font-mono transition-colors ${
              isRunning 
                ? 'bg-[#00ff00] text-[#0a0a0a]' 
                : 'border border-[#00ff00] text-[#00ff00]'
            }`}
          >
            {isRunning ? '⏸ PAUSE' : '▶ START'}
          </button>
          <button
            onClick={step}
            disabled={isRunning}
            className="px-[0.5em] py-[0.25em] rounded text-[0.5em] font-mono border border-[#00ff00]/40 text-[#00ff00]/60 hover:border-[#00ff00] hover:text-[#00ff00] disabled:opacity-30"
          >
            ⏭ STEP
          </button>
          <div className="flex-1" />
          <select
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="px-[0.375em] py-[0.25em] rounded text-[0.5em] font-mono bg-transparent border border-[#00ff00]/40 text-[#00ff00] cursor-pointer"
          >
            <option value={200}>SLOW</option>
            <option value={100}>MED</option>
            <option value={50}>FAST</option>
            <option value={16}>MAX</option>
          </select>
        </div>
        
        {/* Rules */}
        <div className="flex gap-[0.25em] mb-[0.5em]">
          {rules.map(r => (
            <button
              key={r.id}
              onClick={() => setRule(r.id as typeof rule)}
              className={`px-[0.375em] py-[0.125em] rounded text-[0.4375em] font-mono transition-colors ${
                rule === r.id
                  ? 'bg-[#00ff00] text-[#0a0a0a]'
                  : 'border border-[#00ff00]/30 text-[#00ff00]/60 hover:border-[#00ff00]'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
        
        {/* Patterns */}
        <div className="flex gap-[0.25em]">
          <span className="text-[0.4375em] font-mono text-[#00ff00]/40 mr-[0.25em]">LOAD:</span>
          {['random', 'clear', 'glider', 'pulsar', 'gosper'].map(p => (
            <button
              key={p}
              onClick={() => initGrid(p as any)}
              className="px-[0.375em] py-[0.125em] rounded text-[0.375em] font-mono border border-[#00ff00]/20 text-[#00ff00]/40 hover:border-[#00ff00]/60 hover:text-[#00ff00]/80"
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
