'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// GRAVITATIONAL WAVES WIDGET
// ===========================================
// Shows LIGO/Virgo detector status and events
// Data: GraceDB / LIGO
// ===========================================

interface Detector {
  id: string
  name: string
  location: string
  status: 'observing' | 'offline' | 'engineering' | 'maintenance'
  uptime24h: number
}

interface GravWaveEvent {
  id: string
  timestamp: string
  type: 'BBH' | 'BNS' | 'NSBH' | 'Unknown'
  distance: number
  significance: number
}

interface GravWaveData {
  timestamp: string
  detectors: Detector[]
  currentRun: {
    name: string
    startDate: string
    eventsDetected: number
  }
  recentEvents: GravWaveEvent[]
  totalDetections: number
  isListening: boolean
  note: string
  error?: string
}

// Event type labels
const EVENT_TYPES = {
  BBH: 'Black Hole Merger',
  BNS: 'Neutron Star Merger',
  NSBH: 'NS-Black Hole',
  Unknown: 'Unknown',
}

// ===========================================
// STRAIN VISUALIZATION
// ===========================================

function StrainViz({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 100 24" className="w-full h-[1.5em]">
      {/* Baseline */}
      <line x1="0" y1="12" x2="100" y2="12" stroke="#e5e5e5" strokeWidth="0.5" />
      
      {/* Strain waveform */}
      {isActive ? (
        <path
          d="M 0 12 Q 10 12 15 10 Q 20 8 25 12 Q 30 16 35 12 Q 40 8 45 12 Q 50 16 55 12 Q 60 8 65 12 Q 70 16 75 12 Q 80 8 85 12 Q 90 14 100 12"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.5"
          opacity="0.8"
        >
          <animate
            attributeName="d"
            dur="2s"
            repeatCount="indefinite"
            values="
              M 0 12 Q 10 12 15 10 Q 20 8 25 12 Q 30 16 35 12 Q 40 8 45 12 Q 50 16 55 12 Q 60 8 65 12 Q 70 16 75 12 Q 80 8 85 12 Q 90 14 100 12;
              M 0 12 Q 10 14 15 12 Q 20 10 25 12 Q 30 14 35 12 Q 40 10 45 12 Q 50 14 55 12 Q 60 10 65 12 Q 70 14 75 12 Q 80 10 85 12 Q 90 12 100 12;
              M 0 12 Q 10 12 15 10 Q 20 8 25 12 Q 30 16 35 12 Q 40 8 45 12 Q 50 16 55 12 Q 60 8 65 12 Q 70 16 75 12 Q 80 8 85 12 Q 90 14 100 12
            "
          />
        </path>
      ) : (
        <line x1="0" y1="12" x2="100" y2="12" stroke="#9ca3af" strokeWidth="1" />
      )}
    </svg>
  )
}

// ===========================================
// DETECTOR STATUS COMPONENT
// ===========================================

function DetectorStatus({ detector }: { detector: Detector }) {
  const statusColors = {
    observing: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    offline: { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' },
    engineering: { bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500' },
    maintenance: { bg: 'bg-amber-100', text: 'text-amber-600', dot: 'bg-amber-500' },
  }
  
  const colors = statusColors[detector.status]
  
  return (
    <div className="text-center">
      <div className="text-[0.65em] font-medium text-black/60 uppercase tracking-wider mb-[0.25em]">
        {detector.name}
      </div>
      
      {/* Strain viz */}
      <div className="mb-[0.25em]">
        <StrainViz isActive={detector.status === 'observing'} />
      </div>
      
      {/* Status badge */}
      <div className={`inline-flex items-center gap-[0.25em] px-[0.5em] py-[0.125em] rounded-full text-[0.6em] ${colors.bg}`}>
        <div className={`w-[0.4em] h-[0.4em] rounded-full ${colors.dot}`}>
          {detector.status === 'observing' && (
            <span className={`absolute w-[0.4em] h-[0.4em] rounded-full ${colors.dot} animate-ping opacity-50`} />
          )}
        </div>
        <span className={colors.text}>
          {detector.status === 'observing' ? 'Observing' : 
           detector.status === 'engineering' ? 'Testing' :
           detector.status === 'maintenance' ? 'Maintenance' : 'Offline'}
        </span>
      </div>
    </div>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function GravitationalWaves() {
  const [data, setData] = useState<GravWaveData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/gravitational-waves')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      
      if (result.error) {
        setError(result.error)
      } else {
        setData(result)
        setError(null)
      }
    } catch (err) {
      console.error('Grav wave fetch error:', err)
      setError('Unable to reach LIGO')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Update every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Time ago helper
  const timeAgo = (timestamp: string): string => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="p-[1em] flex items-center justify-center h-[16em]">
        <div className="text-center">
          <div className="text-black/40 text-[0.875em]">Connecting to LIGO...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !data) {
    return (
      <div className="p-[1em] flex items-center justify-center h-[16em]">
        <div className="text-center">
          <div className="text-red-500 text-[0.875em]">{error}</div>
          <button 
            onClick={fetchData}
            className="mt-2 text-[0.75em] text-black/50 hover:text-black"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const latestEvent = data.recentEvents[0]

  return (
    <div className="p-[1em]">
      {/* Status header */}
      <div className="flex justify-center mb-[0.75em]">
        <div className={`
          inline-flex items-center gap-[0.375em] px-[0.75em] py-[0.375em] rounded-full text-[0.875em]
          ${data.isListening 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-600'
          }
        `}>
          <div className={`w-[0.5em] h-[0.5em] rounded-full ${data.isListening ? 'bg-green-500' : 'bg-gray-400'}`}>
            {data.isListening && (
              <span className="absolute w-[0.5em] h-[0.5em] rounded-full bg-green-500 animate-ping opacity-50" />
            )}
          </div>
          {data.isListening ? 'Listening to Spacetime' : 'Detectors Offline'}
        </div>
      </div>

      {/* Detectors grid */}
      <div className="grid grid-cols-3 gap-[0.5em] mb-[0.75em]">
        {data.detectors.map((detector) => (
          <DetectorStatus key={detector.id} detector={detector} />
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-[0.5em] mb-[0.75em]">
        <div className="text-center p-[0.5em] bg-black/5 rounded-[0.5em]">
          <div className="text-[0.6em] text-black/50 uppercase tracking-wider">Run {data.currentRun.name}</div>
          <div className="font-mono text-[1.25em] font-bold">{data.currentRun.eventsDetected}</div>
          <div className="text-[0.6em] text-black/40">events</div>
        </div>
        <div className="text-center p-[0.5em] bg-black/5 rounded-[0.5em]">
          <div className="text-[0.6em] text-black/50 uppercase tracking-wider">All Time</div>
          <div className="font-mono text-[1.25em] font-bold">{data.totalDetections}</div>
          <div className="text-[0.6em] text-black/40">detections</div>
        </div>
      </div>

      {/* Latest event */}
      {latestEvent && (
        <div className="p-[0.5em] bg-purple-50 rounded-[0.5em] border border-purple-200">
          <div className="flex items-center justify-between mb-[0.25em]">
            <span className="text-[0.7em] font-medium text-purple-800">
              Last Detection
            </span>
            <span className="text-[0.65em] text-purple-600">
              {timeAgo(latestEvent.timestamp)}
            </span>
          </div>
          <div className="text-[0.8em] text-purple-900">
            <span className="font-mono font-medium">{latestEvent.id}</span>
            <span className="text-purple-600"> — {EVENT_TYPES[latestEvent.type]}</span>
          </div>
          <div className="text-[0.65em] text-purple-600 mt-[0.125em]">
            {latestEvent.distance.toLocaleString()} Mpc away • {latestEvent.significance}σ significance
          </div>
        </div>
      )}

      {/* Note */}
      <div className="mt-[0.75em] text-[0.7em] text-black/50 text-center">
        {data.note}
      </div>

      {/* Update time */}
      <div className="mt-[0.5em] text-[0.625em] text-black/30 text-center">
        Updated {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}
