'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// STOPWATCH / TIMER
// ===========================================
// Precision timing instrument
// Chronograph aesthetic
// ===========================================

interface Lap {
  number: number
  time: number
  split: number
}

export default function StopwatchTimer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch')
  
  // Stopwatch state
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])
  const startTimeRef = useRef<number>(0)
  const elapsedRef = useRef<number>(0)
  
  // Timer state
  const [timerDuration, setTimerDuration] = useState(5 * 60 * 1000) // 5 minutes default
  const [timerRemaining, setTimerRemaining] = useState(5 * 60 * 1000)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerFinished, setTimerFinished] = useState(false)
  const timerStartRef = useRef<number>(0)
  const timerRemainingRef = useRef<number>(5 * 60 * 1000)
  
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
  
  // Stopwatch logic
  useEffect(() => {
    if (!isRunning) return
    
    const interval = setInterval(() => {
      setElapsed(elapsedRef.current + (Date.now() - startTimeRef.current))
    }, 10)
    
    return () => clearInterval(interval)
  }, [isRunning])
  
  const startStopwatch = () => {
    startTimeRef.current = Date.now()
    setIsRunning(true)
  }
  
  const stopStopwatch = () => {
    elapsedRef.current = elapsed
    setIsRunning(false)
  }
  
  const resetStopwatch = () => {
    setIsRunning(false)
    setElapsed(0)
    elapsedRef.current = 0
    setLaps([])
  }
  
  const recordLap = () => {
    if (!isRunning) return
    const newLap: Lap = {
      number: laps.length + 1,
      time: elapsed,
      split: laps.length > 0 ? elapsed - laps[laps.length - 1].time : elapsed
    }
    setLaps([...laps, newLap])
  }
  
  // Timer logic
  useEffect(() => {
    if (!timerRunning) return
    
    const interval = setInterval(() => {
      const remaining = timerRemainingRef.current - (Date.now() - timerStartRef.current)
      if (remaining <= 0) {
        setTimerRemaining(0)
        setTimerRunning(false)
        setTimerFinished(true)
      } else {
        setTimerRemaining(remaining)
      }
    }, 10)
    
    return () => clearInterval(interval)
  }, [timerRunning])
  
  const startTimer = () => {
    if (timerRemaining <= 0) return
    timerStartRef.current = Date.now()
    timerRemainingRef.current = timerRemaining
    setTimerRunning(true)
    setTimerFinished(false)
  }
  
  const stopTimer = () => {
    timerRemainingRef.current = timerRemaining
    setTimerRunning(false)
  }
  
  const resetTimer = () => {
    setTimerRunning(false)
    setTimerRemaining(timerDuration)
    timerRemainingRef.current = timerDuration
    setTimerFinished(false)
  }
  
  const adjustTimer = (delta: number) => {
    if (timerRunning) return
    const newDuration = Math.max(0, timerDuration + delta)
    setTimerDuration(newDuration)
    setTimerRemaining(newDuration)
    timerRemainingRef.current = newDuration
  }
  
  // Format time
  const formatTime = useCallback((ms: number, showMs: boolean = true) => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const centiseconds = Math.floor((ms % 1000) / 10)
    
    if (hours > 0) {
      return showMs 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
        : `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return showMs
      ? `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
      : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [])
  
  // Timer presets
  const timerPresets = [
    { label: '1m', ms: 60000 },
    { label: '3m', ms: 180000 },
    { label: '5m', ms: 300000 },
    { label: '10m', ms: 600000 },
    { label: '15m', ms: 900000 },
    { label: '30m', ms: 1800000 },
  ]
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-[#1a1a1a] rounded-xl p-[1em] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.75em]">
        <div>
          <div className="text-[0.625em] font-medium text-white/40 uppercase tracking-wider">
            CHRONOGRAPH
          </div>
        </div>
        
        {/* Mode toggle */}
        <div className="flex bg-black/30 rounded-lg p-[0.125em]">
          <button
            onClick={() => setMode('stopwatch')}
            className={`px-[0.625em] py-[0.25em] rounded text-[0.5em] font-medium transition-colors ${
              mode === 'stopwatch' ? 'bg-white text-black' : 'text-white/50'
            }`}
          >
            STOPWATCH
          </button>
          <button
            onClick={() => setMode('timer')}
            className={`px-[0.625em] py-[0.25em] rounded text-[0.5em] font-medium transition-colors ${
              mode === 'timer' ? 'bg-white text-black' : 'text-white/50'
            }`}
          >
            TIMER
          </button>
        </div>
      </div>
      
      {mode === 'stopwatch' ? (
        <>
          {/* Stopwatch display */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative">
              {/* Main time display */}
              <div className="text-[2.5em] font-mono font-bold text-white tracking-tight">
                {formatTime(elapsed)}
              </div>
              
              {/* Subdial - last lap */}
              {laps.length > 0 && (
                <div className="absolute -top-[1.5em] left-1/2 -translate-x-1/2 text-center">
                  <div className="text-[0.35em] text-white/30 uppercase">Last Lap</div>
                  <div className="text-[0.5em] font-mono text-amber-500">
                    {formatTime(laps[laps.length - 1].split)}
                  </div>
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex gap-[0.5em] mt-[1em]">
              {!isRunning ? (
                <>
                  <button
                    onClick={startStopwatch}
                    className="w-[4em] h-[4em] rounded-full bg-emerald-600 text-white font-medium text-[0.625em] hover:bg-emerald-500 transition-colors shadow-lg"
                  >
                    START
                  </button>
                  {elapsed > 0 && (
                    <button
                      onClick={resetStopwatch}
                      className="w-[4em] h-[4em] rounded-full bg-white/10 text-white/60 font-medium text-[0.625em] hover:bg-white/20 transition-colors"
                    >
                      RESET
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={stopStopwatch}
                    className="w-[4em] h-[4em] rounded-full bg-red-600 text-white font-medium text-[0.625em] hover:bg-red-500 transition-colors shadow-lg"
                  >
                    STOP
                  </button>
                  <button
                    onClick={recordLap}
                    className="w-[4em] h-[4em] rounded-full bg-white/10 text-white font-medium text-[0.625em] hover:bg-white/20 transition-colors"
                  >
                    LAP
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Lap list */}
          {laps.length > 0 && (
            <div className="mt-[0.75em] pt-[0.5em] border-t border-white/10 max-h-[6em] overflow-y-auto">
              <div className="space-y-[0.25em]">
                {[...laps].reverse().map((lap) => (
                  <div key={lap.number} className="flex items-center justify-between text-[0.5em] font-mono">
                    <span className="text-white/40">Lap {lap.number}</span>
                    <span className="text-amber-500">{formatTime(lap.split)}</span>
                    <span className="text-white/60">{formatTime(lap.time)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Timer display */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Circular progress */}
            <div className="relative">
              <svg className="w-[10em] h-[10em] -rotate-90">
                {/* Background circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                />
                {/* Progress circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke={timerFinished ? '#ef4444' : '#3b82f6'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - timerRemaining / timerDuration)}`}
                  className="transition-all duration-100"
                />
              </svg>
              
              {/* Time inside circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`text-[1.75em] font-mono font-bold ${timerFinished ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {formatTime(timerRemaining, false)}
                </div>
              </div>
            </div>
            
            {/* Timer adjust buttons */}
            {!timerRunning && !timerFinished && (
              <div className="flex gap-[0.25em] mt-[0.5em]">
                <button
                  onClick={() => adjustTimer(-60000)}
                  className="px-[0.5em] py-[0.25em] bg-white/10 rounded text-[0.5em] text-white/60 hover:bg-white/20"
                >
                  -1m
                </button>
                <button
                  onClick={() => adjustTimer(-10000)}
                  className="px-[0.5em] py-[0.25em] bg-white/10 rounded text-[0.5em] text-white/60 hover:bg-white/20"
                >
                  -10s
                </button>
                <button
                  onClick={() => adjustTimer(10000)}
                  className="px-[0.5em] py-[0.25em] bg-white/10 rounded text-[0.5em] text-white/60 hover:bg-white/20"
                >
                  +10s
                </button>
                <button
                  onClick={() => adjustTimer(60000)}
                  className="px-[0.5em] py-[0.25em] bg-white/10 rounded text-[0.5em] text-white/60 hover:bg-white/20"
                >
                  +1m
                </button>
              </div>
            )}
            
            {/* Controls */}
            <div className="flex gap-[0.5em] mt-[0.75em]">
              {!timerRunning ? (
                <>
                  <button
                    onClick={timerFinished ? resetTimer : startTimer}
                    className={`w-[4em] h-[4em] rounded-full font-medium text-[0.625em] shadow-lg transition-colors ${
                      timerFinished 
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                  >
                    {timerFinished ? 'RESET' : 'START'}
                  </button>
                  {!timerFinished && timerRemaining !== timerDuration && (
                    <button
                      onClick={resetTimer}
                      className="w-[4em] h-[4em] rounded-full bg-white/10 text-white/60 font-medium text-[0.625em] hover:bg-white/20 transition-colors"
                    >
                      RESET
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={stopTimer}
                    className="w-[4em] h-[4em] rounded-full bg-red-600 text-white font-medium text-[0.625em] hover:bg-red-500 transition-colors shadow-lg"
                  >
                    PAUSE
                  </button>
                  <button
                    onClick={resetTimer}
                    className="w-[4em] h-[4em] rounded-full bg-white/10 text-white/60 font-medium text-[0.625em] hover:bg-white/20 transition-colors"
                  >
                    RESET
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Presets */}
          <div className="mt-[0.5em] pt-[0.5em] border-t border-white/10">
            <div className="flex justify-center gap-[0.375em]">
              {timerPresets.map(({ label, ms }) => (
                <button
                  key={label}
                  onClick={() => {
                    if (!timerRunning) {
                      setTimerDuration(ms)
                      setTimerRemaining(ms)
                      timerRemainingRef.current = ms
                      setTimerFinished(false)
                    }
                  }}
                  disabled={timerRunning}
                  className={`px-[0.5em] py-[0.25em] rounded text-[0.5em] font-mono transition-colors ${
                    timerDuration === ms && !timerRunning
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-white/40 hover:bg-white/10'
                  } ${timerRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
