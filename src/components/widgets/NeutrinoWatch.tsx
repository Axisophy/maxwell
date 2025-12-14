'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// NEUTRINO WATCH WIDGET
// ===========================================
// Shows neutrino detections from IceCube, Antarctica
// Data: IceCube / GCN alerts
// ===========================================

interface NeutrinoEvent {
  id: string
  timestamp: string
  energy: number
  direction?: {
    ra: number
    dec: number
  }
  type: 'track' | 'cascade' | 'unknown'
  significance: 'gold' | 'bronze' | 'standard'
}

interface NeutrinoData {
  timestamp: string
  recentEvents: NeutrinoEvent[]
  stats: {
    last24h: number
    last7d: number
    totalAstrophysical: number
  }
  detectorStatus: 'online' | 'offline' | 'partial'
  note?: string
  error?: string
}

// ===========================================
// ICE CUBE VISUALIZATION
// ===========================================

function IceCubeViz({ hasRecentEvent }: { hasRecentEvent: boolean }) {
  return (
    <div className="relative w-full aspect-square max-w-[10em] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Ice surface */}
        <defs>
          <linearGradient id="iceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
        </defs>
        
        {/* Detector volume - cube in ice */}
        <path
          d="M 20 30 L 50 15 L 80 30 L 80 70 L 50 85 L 20 70 Z"
          fill="url(#iceGradient)"
          opacity="0.4"
          stroke="#0ea5e9"
          strokeWidth="1"
        />
        
        {/* Front face */}
        <path
          d="M 20 30 L 50 45 L 50 85 L 20 70 Z"
          fill="#0c4a6e"
          opacity="0.3"
        />
        
        {/* Top face */}
        <path
          d="M 20 30 L 50 15 L 80 30 L 50 45 Z"
          fill="#38bdf8"
          opacity="0.2"
        />
        
        {/* Sensor strings (dots) */}
        {[25, 35, 45, 55, 65, 75].map((x) => (
          <g key={x}>
            {[35, 45, 55, 65, 75].map((y) => (
              <circle
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r="1.5"
                fill="#22d3ee"
                opacity="0.6"
              />
            ))}
          </g>
        ))}
        
        {/* Neutrino event flash */}
        {hasRecentEvent && (
          <g>
            <circle cx="50" cy="50" r="3" fill="#fbbf24">
              <animate
                attributeName="r"
                values="3;15;3"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50" cy="50" r="2" fill="#fbbf24" />
          </g>
        )}
        
        {/* Incoming neutrino line when event */}
        {hasRecentEvent && (
          <line
            x1="10"
            y1="10"
            x2="50"
            y2="50"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeDasharray="3,3"
            opacity="0.6"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-6"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </line>
        )}
        
        {/* Ice surface line */}
        <line x1="5" y1="20" x2="95" y2="20" stroke="#38bdf8" strokeWidth="1" opacity="0.5" />
        <text x="50" y="12" textAnchor="middle" className="text-[6px] fill-black/40">Antarctic Ice</text>
      </svg>
    </div>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function NeutrinoWatch() {
  const [data, setData] = useState<NeutrinoData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/neutrinos')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      console.error('Neutrino fetch error:', err)
      setError('Unable to reach IceCube')
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

  // Format large numbers
  const formatNumber = (n: number): string => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(0) + 'k'
    return n.toString()
  }

  // Format time ago
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
          <div className="text-black/40 text-[0.875em]">Connecting to IceCube...</div>
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

  const hasRecentEvent = data.recentEvents.length > 0
  const latestEvent = data.recentEvents[0]

  return (
    <div className="p-[1em]">
      {/* Detector status */}
      <div className="flex justify-center mb-[0.5em]">
        <div className={`
          inline-flex items-center gap-[0.375em] px-[0.75em] py-[0.25em] rounded-full text-[0.75em]
          ${data.detectorStatus === 'online' ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600'}
        `}>
          <div className={`w-[0.4em] h-[0.4em] rounded-full ${data.detectorStatus === 'online' ? 'bg-cyan-500' : 'bg-gray-400'}`} />
          IceCube {data.detectorStatus === 'online' ? 'Listening' : 'Offline'}
        </div>
      </div>

      {/* Ice cube visualization */}
      <IceCubeViz hasRecentEvent={hasRecentEvent} />

      {/* Recent high-energy event */}
      {hasRecentEvent && latestEvent && (
        <div className="mt-[0.5em] p-[0.5em] bg-amber-50 rounded-[0.5em] border border-amber-200">
          <div className="flex items-center justify-between mb-[0.25em]">
            <span className={`
              text-[0.65em] px-[0.5em] py-[0.125em] rounded font-medium uppercase
              ${latestEvent.significance === 'gold' ? 'bg-amber-400 text-amber-900' : 'bg-amber-200 text-amber-800'}
            `}>
              {latestEvent.significance} Alert
            </span>
            <span className="text-[0.65em] text-amber-700">
              {timeAgo(latestEvent.timestamp)}
            </span>
          </div>
          <div className="text-[0.8em] text-amber-900">
            <span className="font-mono font-medium">{latestEvent.energy} TeV</span> neutrino detected
          </div>
          {latestEvent.direction && (
            <div className="text-[0.65em] text-amber-700 mt-[0.125em]">
              Direction: RA {latestEvent.direction.ra}°, Dec {latestEvent.direction.dec}°
            </div>
          )}
        </div>
      )}

      {/* No recent events message */}
      {!hasRecentEvent && (
        <div className="mt-[0.5em] p-[0.5em] bg-cyan-50 rounded-[0.5em] text-center">
          <div className="text-[0.75em] text-cyan-800">
            Watching for high-energy cosmic neutrinos
          </div>
          <div className="text-[0.65em] text-cyan-600 mt-[0.125em]">
            ~1 astrophysical neutrino detected per month
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-[0.375em] mt-[0.75em]">
        <div className="text-center p-[0.375em] bg-black/5 rounded-[0.375em]">
          <div className="text-[0.6em] text-black/50 uppercase tracking-wider">24h Events</div>
          <div className="font-mono text-[1em] font-bold">{formatNumber(data.stats.last24h)}</div>
        </div>
        <div className="text-center p-[0.375em] bg-black/5 rounded-[0.375em]">
          <div className="text-[0.6em] text-black/50 uppercase tracking-wider">7d Events</div>
          <div className="font-mono text-[1em] font-bold">{formatNumber(data.stats.last7d)}</div>
        </div>
        <div className="text-center p-[0.375em] bg-black/5 rounded-[0.375em]">
          <div className="text-[0.6em] text-black/50 uppercase tracking-wider">Cosmic Total</div>
          <div className="font-mono text-[1em] font-bold">{data.stats.totalAstrophysical}</div>
        </div>
      </div>

      {/* Context */}
      <div className="mt-[0.75em] text-[0.7em] text-black/50 text-center leading-relaxed">
        1 km³ of Antarctic ice • 5,160 optical sensors • 2.5 km deep
      </div>
    </div>
  )
}
