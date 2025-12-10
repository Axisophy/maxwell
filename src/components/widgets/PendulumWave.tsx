'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// PENDULUM WAVE WIDGET
// ===========================================
// Synchronized pendulums creating interference patterns
// Each has a slightly different period - they drift
// in and out of phase, creating mesmerising waves
// ===========================================

interface PendulumConfig {
  count: number
  minPeriod: number
  maxPeriod: number
  amplitude: number
}

const DEFAULT_CONFIG: PendulumConfig = {
  count: 15,
  minPeriod: 1.5,
  maxPeriod: 2.0,
  amplitude: 45,
}

// Calculate pendulum period based on index
function getPendulumPeriod(
  index: number,
  count: number,
  minPeriod: number,
  maxPeriod: number
): number {
  if (count === 1) return minPeriod
  return minPeriod + (index / (count - 1)) * (maxPeriod - minPeriod)
}

// Calculate pendulum angle at given time
function getPendulumAngle(time: number, period: number, amplitude: number): number {
  return amplitude * Math.sin((2 * Math.PI * time) / period)
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function PendulumWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [elapsed, setElapsed] = useState(0)
  const [showTrails, setShowTrails] = useState(false)
  const [showControls, setShowControls] = useState(false)

  // Time for all pendulums to return to starting phase
  const fullCycleTime = useCallback(() => {
    const { minPeriod, maxPeriod } = config
    return (minPeriod * maxPeriod) / (maxPeriod - minPeriod)
  }, [config])

  const cycleProgress = (elapsed % fullCycleTime()) / fullCycleTime()

  // Reset simulation
  const reset = useCallback(() => {
    setElapsed(0)
  }, [])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener('resize', resize)

    let lastTime = performance.now()
    let accumulatedTime = elapsed

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      if (!isPaused) {
        accumulatedTime += deltaTime * speed
        setElapsed(accumulatedTime)
      }

      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      // Clear canvas
      if (showTrails) {
        ctx.fillStyle = 'rgba(245, 245, 245, 0.15)'
      } else {
        ctx.fillStyle = '#f5f5f5'
      }
      ctx.fillRect(0, 0, width, height)

      // Pendulum dimensions
      const pendulumSpacing = width / (config.count + 1)
      const pivotY = 20
      const maxLength = height - pivotY - 30

      // Draw pendulums
      for (let i = 0; i < config.count; i++) {
        const x = pendulumSpacing * (i + 1)
        const period = getPendulumPeriod(i, config.count, config.minPeriod, config.maxPeriod)
        const angle = getPendulumAngle(accumulatedTime, period, config.amplitude)
        const angleRad = (angle * Math.PI) / 180

        // Pendulum length varies with period
        const lengthRatio = (period - config.minPeriod) / (config.maxPeriod - config.minPeriod)
        const length = maxLength * (0.5 + 0.5 * lengthRatio)

        // Calculate bob position
        const bobX = x + length * Math.sin(angleRad)
        const bobY = pivotY + length * Math.cos(angleRad)

        // Draw string
        ctx.beginPath()
        ctx.moveTo(x, pivotY)
        ctx.lineTo(bobX, bobY)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw bob - gradient from warm to cool
        const bobRadius = Math.max(4, Math.min(8, width / config.count / 3))
        const hue = 20 + (i / config.count) * 40 // Warm orange to amber range
        const lightness = 45 + (i / config.count) * 10

        ctx.beginPath()
        ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${hue}, 80%, ${lightness}%)`
        ctx.fill()

        // Subtle shadow
        ctx.beginPath()
        ctx.arc(bobX + 1, bobY + 1, bobRadius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
        ctx.fill()

        // Redraw bob on top of shadow
        ctx.beginPath()
        ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${hue}, 80%, ${lightness}%)`
        ctx.fill()
      }

      // Draw pivot bar
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, pivotY - 3, width, 6)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate(performance.now())

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [config, isPaused, speed, showTrails, elapsed])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const tenths = Math.floor((seconds % 1) * 10)
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`
    }
    return `${secs}.${tenths}`
  }

  return (
    <div className="p-4 space-y-4">
      {/* Canvas */}
      <div
        ref={containerRef}
        className="w-full aspect-[4/3] bg-[#f5f5f5] rounded-lg overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-3 bg-[#f5f5f5] rounded-lg">
          <div className="font-mono text-xl font-bold">{formatTime(elapsed)}</div>
          <div className="text-[10px] text-black/50 uppercase tracking-wide">elapsed</div>
        </div>
        <div className="text-center p-3 bg-[#f5f5f5] rounded-lg">
          <div className="font-mono text-xl font-bold">{Math.round(cycleProgress * 100)}%</div>
          <div className="text-[10px] text-black/50 uppercase tracking-wide">cycle</div>
        </div>
        <div className="text-center p-3 bg-[#f5f5f5] rounded-lg">
          <div className="font-mono text-xl font-bold">{fullCycleTime().toFixed(0)}s</div>
          <div className="text-[10px] text-black/50 uppercase tracking-wide">full cycle</div>
        </div>
      </div>

      {/* Cycle progress bar */}
      <div className="h-1.5 bg-[#e5e5e5] rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 transition-all duration-100"
          style={{ width: `${cycleProgress * 100}%` }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: isPaused ? '#000000' : '#e5e5e5',
            color: isPaused ? '#ffffff' : '#000000',
          }}
        >
          {isPaused ? '▶ Play' : '⏸ Pause'}
        </button>
        <button
          onClick={reset}
          className="flex-1 py-2.5 bg-[#e5e5e5] rounded-lg text-sm font-medium hover:bg-[#d5d5d5] transition-colors"
        >
          ↺ Reset
        </button>
        <button
          onClick={() => setShowTrails(!showTrails)}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: showTrails ? '#000000' : '#e5e5e5',
            color: showTrails ? '#ffffff' : '#000000',
          }}
        >
          Trails
        </button>
      </div>

      {/* Expandable controls */}
      <div>
        <button
          onClick={() => setShowControls(!showControls)}
          className="w-full flex items-center justify-between py-2 text-sm text-black/50 hover:text-black transition-colors"
        >
          <span>Settings</span>
          <svg
            className={`w-4 h-4 transition-transform ${showControls ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showControls && (
          <div className="space-y-4 pt-2">
            {/* Pendulum count */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Pendulums</span>
                <span className="font-mono text-sm text-black/50">{config.count}</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={config.count}
                onChange={(e) => {
                  setConfig({ ...config, count: parseInt(e.target.value) })
                  reset()
                }}
                className="w-full h-2 bg-[#e5e5e5] rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border
                  [&::-webkit-slider-thumb]:border-[#cccccc]
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:shadow-sm
                  [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Speed */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Speed</span>
                <span className="font-mono text-sm text-black/50">{speed}×</span>
              </div>
              <input
                type="range"
                min="0.25"
                max="3"
                step="0.25"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#e5e5e5] rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border
                  [&::-webkit-slider-thumb]:border-[#cccccc]
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:shadow-sm
                  [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Speed presets */}
            <div className="flex gap-1">
              {[0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className="flex-1 py-1.5 text-xs font-mono rounded transition-colors"
                  style={{
                    backgroundColor: speed === s ? '#000000' : '#e5e5e5',
                    color: speed === s ? '#ffffff' : 'rgba(0,0,0,0.5)',
                  }}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}