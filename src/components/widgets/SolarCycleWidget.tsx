'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

/**
 * SolarCycleWidget
 * 
 * Dashboard widget showing current position in Solar Cycle 25.
 * Displays sunspot number, cycle progress, and activity level.
 * 
 * MXWLL Design System compliant:
 * - WidgetFrame header: 3em height, #e5e5e5 background
 * - Content area: white background, 1em padding
 * - Dynamic font sizing: baseFontSize = containerWidth / 25
 * - All measurements in em units
 * 
 * Data source: NOAA SWPC (updated monthly)
 */

interface SolarCycleData {
  currentSunspotNumber: number
  smoothedSunspotNumber: number
  cycleProgress: number // 0-100
  yearsIntoСycle: number
  expectedPeakYear: number
  activityLevel: 'minimum' | 'rising' | 'maximum' | 'declining'
  lastUpdate: string
}

type WidgetStatus = 'loading' | 'loaded' | 'error'

export default function SolarCycleWidget() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [showInfo, setShowInfo] = useState(false)
  const [status, setStatus] = useState<WidgetStatus>('loading')
  const [data, setData] = useState<SolarCycleData | null>(null)

  // Dynamic sizing based on container width
  useEffect(() => {
    if (!containerRef.current) return

    const updateSize = () => {
      const width = containerRef.current?.clientWidth || 400
      setBaseFontSize(width / 25)
    }

    updateSize()
    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  // Fetch solar cycle data
  const fetchData = useCallback(async () => {
    try {
      // Solar Cycle 25 started December 2019
      // Expected peak: July 2025 (±8 months)
      // Expected maximum sunspot number: 137-173
      
      const cycleStart = new Date('2019-12-01')
      const now = new Date()
      const expectedPeak = new Date('2025-07-01')
      const expectedEnd = new Date('2030-12-01') // ~11 year cycle
      
      const totalCycleDays = expectedEnd.getTime() - cycleStart.getTime()
      const daysSinceStart = now.getTime() - cycleStart.getTime()
      const cycleProgress = Math.min(100, Math.max(0, (daysSinceStart / totalCycleDays) * 100))
      
      const yearsIntoСycle = daysSinceStart / (365.25 * 24 * 60 * 60 * 1000)
      
      // Determine activity phase
      let activityLevel: SolarCycleData['activityLevel'] = 'rising'
      if (yearsIntoСycle < 1) {
        activityLevel = 'minimum'
      } else if (now < expectedPeak) {
        activityLevel = 'rising'
      } else if (yearsIntoСycle < 7) {
        activityLevel = 'maximum'
      } else {
        activityLevel = 'declining'
      }

      // Try to fetch actual sunspot data from NOAA
      // Fallback to calculated estimate if API unavailable
      let currentSunspotNumber = 150 // Reasonable estimate for late 2025
      let smoothedSunspotNumber = 145
      
      try {
        const response = await fetch(
          'https://services.swpc.noaa.gov/json/solar-cycle/observed-solar-cycle-indices.json'
        )
        if (response.ok) {
          const indices = await response.json()
          if (indices && indices.length > 0) {
            const latest = indices[indices.length - 1]
            currentSunspotNumber = latest.ssn || currentSunspotNumber
            smoothedSunspotNumber = latest['smoothed_ssn'] || smoothedSunspotNumber
          }
        }
      } catch {
        // Use estimates if API fails
      }

      setData({
        currentSunspotNumber,
        smoothedSunspotNumber,
        cycleProgress,
        yearsIntoСycle,
        expectedPeakYear: 2025,
        activityLevel,
        lastUpdate: now.toISOString()
      })
      setStatus('loaded')
    } catch (error) {
      console.error('Failed to calculate solar cycle data:', error)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Refresh daily (cycle data changes slowly)
    const interval = setInterval(fetchData, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  const getActivityColor = (level: SolarCycleData['activityLevel']) => {
    switch (level) {
      case 'minimum': return '#64748b' // slate
      case 'rising': return '#f59e0b' // amber
      case 'maximum': return '#ef4444' // red
      case 'declining': return '#3b82f6' // blue
    }
  }

  const getActivityLabel = (level: SolarCycleData['activityLevel']) => {
    switch (level) {
      case 'minimum': return 'Solar Minimum'
      case 'rising': return 'Rising Phase'
      case 'maximum': return 'Solar Maximum'
      case 'declining': return 'Declining Phase'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return '#f59e0b'
      case 'loaded': return '#22c55e'
      case 'error': return '#ef4444'
    }
  }

  return (
    <div 
      ref={containerRef}
      style={{ fontSize: `${baseFontSize}px` }}
      className="w-full"
    >
      {/* Widget Frame Header */}
      <div 
        className="flex items-center justify-between"
        style={{
          height: '3em',
          padding: '0 1em',
          backgroundColor: '#e5e5e5',
          borderRadius: '0.75em'
        }}
      >
        <span style={{ fontSize: '1.125em', fontWeight: 400 }}>
          Solar Cycle 25
        </span>
        
        <div className="flex items-center" style={{ gap: '0.75em' }}>
          {/* Status indicator */}
          <div 
            className={status === 'loaded' ? 'animate-pulse' : ''}
            style={{
              width: '0.5em',
              height: '0.5em',
              borderRadius: '50%',
              backgroundColor: getStatusColor()
            }}
          />
          
          {/* Info button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            style={{
              width: '1.25em',
              height: '1.25em',
              opacity: showInfo ? 1 : 0.4,
              transition: 'opacity 150ms'
            }}
            className="hover:opacity-100"
            aria-label="Toggle info panel"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Info Panel (expandable) */}
      {showInfo && (
        <div 
          style={{
            backgroundColor: '#e5e5e5',
            padding: '1em',
            marginTop: '1px',
            borderRadius: '0 0 0.75em 0.75em',
            fontSize: '0.75em',
            color: 'rgba(0,0,0,0.6)'
          }}
        >
          <p style={{ marginBottom: '0.5em' }}>
            Solar Cycle 25 began in December 2019. The sun follows an approximately 
            11-year cycle of activity, with sunspot numbers rising and falling.
          </p>
          <p style={{ fontSize: '0.875em', opacity: 0.7 }}>
            Source: NOAA Space Weather Prediction Center
          </p>
        </div>
      )}

      {/* Widget Content */}
      <div 
        style={{
          marginTop: '0.5em',
          padding: '1em',
          backgroundColor: '#ffffff',
          borderRadius: '0.75em'
        }}
      >
        {status === 'loading' && (
          <div 
            className="flex items-center justify-center"
            style={{ height: '10em' }}
          >
            <div 
              className="animate-spin"
              style={{
                width: '2em',
                height: '2em',
                border: '2px solid #e5e5e5',
                borderTopColor: '#000',
                borderRadius: '50%'
              }}
            />
          </div>
        )}

        {status === 'error' && (
          <div 
            className="flex flex-col items-center justify-center"
            style={{ height: '10em', color: 'rgba(0,0,0,0.5)' }}
          >
            <span style={{ fontSize: '2em', marginBottom: '0.25em' }}>⚠</span>
            <span style={{ fontSize: '0.75em' }}>Data unavailable</span>
          </div>
        )}

        {status === 'loaded' && data && (
          <div>
            {/* Activity Level Badge */}
            <div className="flex items-center justify-between" style={{ marginBottom: '1em' }}>
              <span 
                style={{ 
                  fontSize: '0.6875em', 
                  fontWeight: 500,
                  color: 'rgba(0,0,0,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Current Phase
              </span>
              <span
                style={{
                  fontSize: '0.625em',
                  fontWeight: 500,
                  padding: '0.25em 0.75em',
                  borderRadius: '9999px',
                  backgroundColor: getActivityColor(data.activityLevel),
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {getActivityLabel(data.activityLevel)}
              </span>
            </div>

            {/* Cycle Progress Arc */}
            <div 
              className="flex justify-center"
              style={{ marginBottom: '1em' }}
            >
              <svg 
                viewBox="0 0 120 70" 
                style={{ width: '100%', maxWidth: '12em', height: 'auto' }}
              >
                {/* Background arc */}
                <path
                  d="M 10 60 A 50 50 0 0 1 110 60"
                  fill="none"
                  stroke="#e5e5e5"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                
                {/* Progress arc */}
                <path
                  d="M 10 60 A 50 50 0 0 1 110 60"
                  fill="none"
                  stroke={getActivityColor(data.activityLevel)}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${data.cycleProgress * 1.57} 157`}
                />
                
                {/* Cycle markers */}
                {[0, 25, 50, 75, 100].map((pct, i) => {
                  const angle = (Math.PI * pct) / 100
                  const x = 60 - 50 * Math.cos(angle)
                  const y = 60 - 50 * Math.sin(angle)
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="2"
                      fill={pct <= data.cycleProgress ? getActivityColor(data.activityLevel) : '#d1d5db'}
                    />
                  )
                })}
                
                {/* Center text */}
                <text
                  x="60"
                  y="50"
                  textAnchor="middle"
                  style={{ 
                    fontSize: '14px', 
                    fontFamily: 'var(--font-mono, monospace)',
                    fontWeight: 700 
                  }}
                  fill="#000"
                >
                  {data.yearsIntoСycle.toFixed(1)}
                </text>
                <text
                  x="60"
                  y="62"
                  textAnchor="middle"
                  style={{ 
                    fontSize: '6px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                  fill="rgba(0,0,0,0.4)"
                >
                  Years
                </text>
              </svg>
            </div>

            {/* Sunspot Numbers */}
            <div 
              className="grid grid-cols-2"
              style={{ gap: '0.75em', marginBottom: '0.75em' }}
            >
              <div 
                style={{ 
                  padding: '0.75em',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '0.5em',
                  textAlign: 'center'
                }}
              >
                <div 
                  style={{ 
                    fontSize: '1.5em', 
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono, monospace)'
                  }}
                >
                  {data.currentSunspotNumber}
                </div>
                <div 
                  style={{ 
                    fontSize: '0.625em',
                    color: 'rgba(0,0,0,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginTop: '0.25em'
                  }}
                >
                  Sunspot Number
                </div>
              </div>
              
              <div 
                style={{ 
                  padding: '0.75em',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '0.5em',
                  textAlign: 'center'
                }}
              >
                <div 
                  style={{ 
                    fontSize: '1.5em', 
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono, monospace)'
                  }}
                >
                  {Math.round(data.cycleProgress)}%
                </div>
                <div 
                  style={{ 
                    fontSize: '0.625em',
                    color: 'rgba(0,0,0,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginTop: '0.25em'
                  }}
                >
                  Cycle Progress
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ fontSize: '0.6875em', color: 'rgba(0,0,0,0.5)' }}>
              <div className="flex justify-between" style={{ marginBottom: '0.25em' }}>
                <span>Dec 2019</span>
                <span style={{ fontWeight: 500, color: '#000' }}>
                  Peak ~{data.expectedPeakYear}
                </span>
                <span>~2030</span>
              </div>
              <div 
                style={{ 
                  height: '0.25em',
                  backgroundColor: '#e5e5e5',
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}
              >
                <div 
                  style={{ 
                    height: '100%',
                    width: `${data.cycleProgress}%`,
                    backgroundColor: getActivityColor(data.activityLevel),
                    borderRadius: '9999px'
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div 
              className="flex items-center justify-between"
              style={{ 
                marginTop: '1em',
                paddingTop: '0.75em',
                borderTop: '1px solid #e5e5e5',
                fontSize: '0.6875em',
                color: 'rgba(0,0,0,0.4)'
              }}
            >
              <span>NOAA SWPC</span>
              <span>Updated monthly</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
