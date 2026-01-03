/**
 * MXWLL Orbital Engine - Time Controller
 *
 * Manages simulation time with play/pause and speed control
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { TIME_SPEEDS } from './constants'

// Re-export TIME_SPEEDS for convenience
export { TIME_SPEEDS }

export interface TimeState {
  // Current simulation time (Date object)
  current: Date
  // Whether simulation is playing
  isPlaying: boolean
  // Speed multiplier (1 = real-time)
  speed: number
  // Reference to real wall-clock time when we last updated
  lastUpdate: number
}

export interface TimeController {
  time: Date
  isPlaying: boolean
  speed: number
  play: () => void
  pause: () => void
  toggle: () => void
  setSpeed: (speed: number) => void
  setTime: (time: Date) => void
  reset: () => void
}

export function useTimeController(initialTime?: Date): TimeController {
  const [state, setState] = useState<TimeState>(() => ({
    current: initialTime || new Date(),
    isPlaying: true,
    speed: 1,
    lastUpdate: performance.now(),
  }))

  const stateRef = useRef(state)
  stateRef.current = state

  // Animation frame loop
  useEffect(() => {
    let animationId: number

    const tick = () => {
      const now = performance.now()
      const { isPlaying, speed, lastUpdate } = stateRef.current

      if (isPlaying) {
        // Calculate elapsed real time in milliseconds
        const elapsed = now - lastUpdate
        // Apply speed multiplier to get simulation time delta
        const simElapsed = elapsed * speed

        setState(prev => ({
          ...prev,
          current: new Date(prev.current.getTime() + simElapsed),
          lastUpdate: now,
        }))
      } else {
        // Update lastUpdate even when paused to avoid time jump on resume
        setState(prev => ({ ...prev, lastUpdate: now }))
      }

      animationId = requestAnimationFrame(tick)
    }

    animationId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationId)
  }, [])

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true, lastUpdate: performance.now() }))
  }, [])

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }))
  }, [])

  const toggle = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
      lastUpdate: performance.now(),
    }))
  }, [])

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed, lastUpdate: performance.now() }))
  }, [])

  const setTime = useCallback((time: Date) => {
    setState(prev => ({ ...prev, current: time, lastUpdate: performance.now() }))
  }, [])

  const reset = useCallback(() => {
    setState({
      current: new Date(),
      isPlaying: true,
      speed: 1,
      lastUpdate: performance.now(),
    })
  }, [])

  return {
    time: state.current,
    isPlaying: state.isPlaying,
    speed: state.speed,
    play,
    pause,
    toggle,
    setSpeed,
    setTime,
    reset,
  }
}

// Format time for display
export function formatSimTime(date: Date): string {
  return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
}

// Format speed for display
export function formatSpeed(speed: number): string {
  if (speed >= 2592000) return `${(speed / 2592000).toFixed(0)} month/s`
  if (speed >= 604800) return `${(speed / 604800).toFixed(0)} week/s`
  if (speed >= 86400) return `${(speed / 86400).toFixed(0)} day/s`
  if (speed >= 3600) return `${(speed / 3600).toFixed(0)} hr/s`
  if (speed >= 60) return `${(speed / 60).toFixed(0)} min/s`
  return `${speed}x`
}
