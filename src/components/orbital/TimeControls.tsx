'use client'

import { TimeController, formatSimTime, formatSpeed, TIME_SPEEDS } from '@/lib/orbital/time'

interface TimeControlsProps {
  controller: TimeController
}

export default function TimeControls({ controller }: TimeControlsProps) {
  const { time, isPlaying, speed, toggle, setSpeed, reset } = controller

  return (
    <div className="bg-black rounded-lg p-4">
      {/* Current time display */}
      <div className="mb-4">
        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
          Simulation Time
        </div>
        <div className="font-mono text-lg text-white">
          {formatSimTime(time)}
        </div>
      </div>

      {/* Play/Pause and Reset */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={toggle}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <button
          onClick={reset}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Reset to now"
          title="Reset to current time"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        <div className="ml-auto text-sm font-mono text-white/60">
          {formatSpeed(speed)}
        </div>
      </div>

      {/* Speed controls */}
      <div className="space-y-2">
        <div className="text-[10px] text-white/40 uppercase tracking-wider">
          Time Speed
        </div>
        <div className="flex flex-wrap gap-px">
          {TIME_SPEEDS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSpeed(value)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                ${speed === value
                  ? 'bg-[#ffdf20] text-black'
                  : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
