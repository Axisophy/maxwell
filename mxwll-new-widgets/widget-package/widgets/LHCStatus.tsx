'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// LHC STATUS WIDGET
// ===========================================
// Shows whether the world's biggest machine is running
// Data: CERN Vistars / LHC Dashboard
// ===========================================

interface LHCData {
  timestamp: string
  beamMode: string
  beamModeLabel: string
  beamModeColor: 'green' | 'amber' | 'grey' | 'blue'
  energy: number
  fillNumber: number | null
  isColliding: boolean
  experiments: string[]
  error?: string
}

// ===========================================
// LHC RING VISUALIZATION
// ===========================================

function LHCRing({ isColliding, beamMode }: { isColliding: boolean; beamMode: string }) {
  const ringColor = isColliding ? '#22c55e' : beamMode === 'NO BEAM' ? '#9ca3af' : '#f59e0b'
  
  return (
    <div className="relative w-full aspect-[2/1] flex items-center justify-center">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        {/* Ring outline */}
        <ellipse
          cx="100"
          cy="50"
          rx="85"
          ry="40"
          fill="none"
          stroke={ringColor}
          strokeWidth="3"
          opacity="0.3"
        />
        
        {/* Active beam paths when running */}
        {beamMode !== 'NO BEAM' && (
          <>
            {/* Beam 1 - clockwise */}
            <ellipse
              cx="100"
              cy="50"
              rx="85"
              ry="40"
              fill="none"
              stroke={ringColor}
              strokeWidth="2"
              strokeDasharray="20 10"
              opacity="0.8"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 100 50"
                to="360 100 50"
                dur="3s"
                repeatCount="indefinite"
              />
            </ellipse>
            
            {/* Beam 2 - counter-clockwise */}
            <ellipse
              cx="100"
              cy="50"
              rx="85"
              ry="40"
              fill="none"
              stroke={ringColor}
              strokeWidth="2"
              strokeDasharray="20 10"
              opacity="0.8"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 100 50"
                to="0 100 50"
                dur="3s"
                repeatCount="indefinite"
              />
            </ellipse>
          </>
        )}
        
        {/* Collision points (experiments) */}
        {/* ATLAS - top */}
        <circle cx="100" cy="10" r="6" fill={isColliding ? '#22c55e' : '#d1d5db'}>
          {isColliding && (
            <animate attributeName="r" values="6;8;6" dur="1s" repeatCount="indefinite" />
          )}
        </circle>
        <text x="100" y="4" textAnchor="middle" className="text-[6px] fill-black/50">ATLAS</text>
        
        {/* CMS - bottom */}
        <circle cx="100" cy="90" r="6" fill={isColliding ? '#22c55e' : '#d1d5db'}>
          {isColliding && (
            <animate attributeName="r" values="6;8;6" dur="1s" repeatCount="indefinite" begin="0.25s" />
          )}
        </circle>
        <text x="100" y="100" textAnchor="middle" className="text-[6px] fill-black/50">CMS</text>
        
        {/* ALICE - left */}
        <circle cx="15" cy="50" r="5" fill={isColliding ? '#22c55e' : '#d1d5db'}>
          {isColliding && (
            <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" begin="0.5s" />
          )}
        </circle>
        <text x="15" y="62" textAnchor="middle" className="text-[5px] fill-black/50">ALICE</text>
        
        {/* LHCb - right */}
        <circle cx="185" cy="50" r="5" fill={isColliding ? '#22c55e' : '#d1d5db'}>
          {isColliding && (
            <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" begin="0.75s" />
          )}
        </circle>
        <text x="185" y="62" textAnchor="middle" className="text-[5px] fill-black/50">LHCb</text>
        
        {/* Status text in center */}
        <text 
          x="100" 
          y="50" 
          textAnchor="middle" 
          dominantBaseline="middle"
          className="text-[10px] font-medium"
          fill={ringColor}
        >
          {isColliding ? 'COLLIDING' : beamMode === 'NO BEAM' ? 'OFFLINE' : 'PREPARING'}
        </text>
      </svg>
    </div>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function LHCStatus() {
  const [data, setData] = useState<LHCData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/lhc')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      
      if (result.error) {
        setError(result.error)
      } else {
        setData(result)
        setError(null)
      }
    } catch (err) {
      console.error('LHC fetch error:', err)
      setError('Unable to reach CERN')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Update every 60 seconds
    const interval = setInterval(fetchData, 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Status color mapping
  const statusColors = {
    green: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    grey: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  }

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="p-[1em] flex items-center justify-center h-[16em]">
        <div className="text-center">
          <div className="text-black/40 text-[0.875em]">Connecting to CERN...</div>
        </div>
      </div>
    )
  }

  // Error state with no data
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

  const colors = statusColors[data.beamModeColor]

  return (
    <div className="p-[1em]">
      {/* Status badge */}
      <div className="flex justify-center mb-[0.5em]">
        <div className={`inline-flex items-center gap-[0.375em] px-[0.75em] py-[0.375em] rounded-full ${colors.bg}`}>
          <div className={`w-[0.5em] h-[0.5em] rounded-full ${colors.dot}`}>
            {data.isColliding && (
              <span className={`absolute w-[0.5em] h-[0.5em] rounded-full ${colors.dot} animate-ping`} />
            )}
          </div>
          <span className={`text-[0.875em] font-medium ${colors.text}`}>
            {data.beamModeLabel}
          </span>
        </div>
      </div>

      {/* LHC Ring visualization */}
      <LHCRing isColliding={data.isColliding} beamMode={data.beamMode} />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-[0.5em] mt-[0.5em]">
        <div className="text-center p-[0.5em] bg-black/5 rounded-[0.375em]">
          <div className="text-[0.65em] text-black/50 uppercase tracking-wider">
            Beam Energy
          </div>
          <div className="font-mono text-[1.25em] font-bold text-black">
            {data.energy.toFixed(1)} <span className="text-[0.6em] font-normal">TeV</span>
          </div>
          <div className="text-[0.6em] text-black/40">per beam</div>
        </div>
        
        <div className="text-center p-[0.5em] bg-black/5 rounded-[0.375em]">
          <div className="text-[0.65em] text-black/50 uppercase tracking-wider">
            Fill Number
          </div>
          <div className="font-mono text-[1.25em] font-bold text-black">
            {data.fillNumber ? `#${data.fillNumber.toLocaleString()}` : '—'}
          </div>
          <div className="text-[0.6em] text-black/40">current run</div>
        </div>
      </div>

      {/* Context info when colliding */}
      {data.isColliding && (
        <div className="mt-[0.75em] p-[0.5em] bg-green-50 rounded-[0.5em] text-center">
          <div className="text-[0.75em] text-green-800">
            Protons circling <span className="font-mono font-medium">11,245</span> times per second
          </div>
          <div className="text-[0.65em] text-green-600 mt-[0.125em]">
            {data.energy * 2} TeV collision energy — recreating Big Bang conditions
          </div>
        </div>
      )}

      {/* Offline message */}
      {data.beamMode === 'NO BEAM' && (
        <div className="mt-[0.75em] p-[0.5em] bg-gray-50 rounded-[0.5em] text-center">
          <div className="text-[0.75em] text-gray-600">
            The LHC is currently not operating
          </div>
          <div className="text-[0.65em] text-gray-500 mt-[0.125em]">
            Check back later for the next physics run
          </div>
        </div>
      )}

      {/* Update time */}
      <div className="mt-[0.75em] text-[0.625em] text-black/30 text-center">
        Updated {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}
