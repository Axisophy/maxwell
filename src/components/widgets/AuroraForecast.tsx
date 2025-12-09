'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// AURORA FORECAST WIDGET
// ===========================================
// Answers: "Will I see aurora tonight?"
// Defaults to user's location
// Shows clear yes/no/maybe based on Kp vs latitude
// Data: NOAA SWPC via /api/aurora (cached server-side)
// ===========================================

interface AuroraData {
  current: {
    kp: number
    status: string
  }
  forecast: {
    tonight: number
    tomorrow: number
  }
  timestamp: string
}

// Kp required to see aurora at a given latitude
// Based on NOAA aurora viewing guidelines
function getRequiredKp(latitude: number): number {
  const absLat = Math.abs(latitude)
  if (absLat >= 67) return 0
  if (absLat >= 65) return 1
  if (absLat >= 63) return 2
  if (absLat >= 61) return 3
  if (absLat >= 58) return 4
  if (absLat >= 55) return 5
  if (absLat >= 52) return 6
  if (absLat >= 50) return 7
  if (absLat >= 48) return 8
  if (absLat >= 45) return 9
  return 10 // Essentially impossible
}

// Get visibility verdict
function getVerdict(kpForecast: number, requiredKp: number): {
  answer: 'yes' | 'maybe' | 'unlikely' | 'no'
  message: string
  color: string
} {
  if (requiredKp > 9) {
    return {
      answer: 'no',
      message: 'Too far south for aurora',
      color: '#6b7280', // grey
    }
  }
  
  if (kpForecast >= requiredKp + 1) {
    return {
      answer: 'yes',
      message: 'Good chance tonight',
      color: '#22c55e', // green
    }
  }
  
  if (kpForecast >= requiredKp) {
    return {
      answer: 'maybe',
      message: 'Possible if skies are clear',
      color: '#eab308', // yellow
    }
  }
  
  if (kpForecast >= requiredKp - 1) {
    return {
      answer: 'unlikely',
      message: 'Unlikely, but watch for surges',
      color: '#f97316', // orange
    }
  }
  
  return {
    answer: 'no',
    message: 'Not expected tonight',
    color: '#ef4444', // red
  }
}

export default function AuroraForecast() {
  const [data, setData] = useState<AuroraData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [latitude, setLatitude] = useState<number | null>(null)
  const [locationStatus, setLocationStatus] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [locationName, setLocationName] = useState<string>('')

  // Request user location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLocationStatus('granted')
          // Simple hemisphere indicator
          const lat = position.coords.latitude
          if (lat > 60) setLocationName('High latitude')
          else if (lat > 50) setLocationName('Northern region')
          else if (lat > 40) setLocationName('Mid-latitude')
          else if (lat > 0) setLocationName('Low latitude')
          else setLocationName('Southern hemisphere')
        },
        () => {
          // Default to London latitude
          setLatitude(51.5)
          setLocationStatus('denied')
          setLocationName('London (default)')
        },
        { timeout: 5000 }
      )
    } else {
      setLatitude(51.5)
      setLocationStatus('denied')
      setLocationName('London (default)')
    }
  }, [])

  // Fetch aurora data
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/aurora')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      
      setData(result)
      setError(null)
    } catch (err) {
      console.error('Error fetching aurora data:', err)
      setError('Unable to fetch data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch when ready
  useEffect(() => {
    if (locationStatus !== 'pending') {
      fetchData()
      const interval = setInterval(fetchData, 15 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [fetchData, locationStatus])

  // Calculate verdict
  const requiredKp = latitude ? getRequiredKp(latitude) : 5
  const verdict = data ? getVerdict(data.forecast.tonight, requiredKp) : null

  // Loading state
  if (isLoading || locationStatus === 'pending') {
    return (
      <div className="w-full aspect-[4/3] flex items-center justify-center">
        <div className="text-text-muted text-sm animate-pulse">
          {locationStatus === 'pending' ? 'Getting location...' : 'Loading...'}
        </div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div className="w-full aspect-[4/3] flex items-center justify-center">
        <div className="text-red-500 text-sm">{error || 'No data'}</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Location */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-text-primary">{locationName}</span>
        <span className="text-xs text-text-muted font-mono">NOAA</span>
      </div>

      {/* Main verdict */}
      <div className="text-center py-6">
        <div 
          className="text-5xl font-bold capitalize mb-2"
          style={{ color: verdict?.color }}
        >
          {verdict?.answer}
        </div>
        <div className="text-sm text-text-muted">
          {verdict?.message}
        </div>
      </div>

      {/* Kp comparison */}
      <div className="border-t border-[#e5e5e5] pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-center flex-1">
            <div className="text-xs text-text-muted uppercase tracking-wide mb-1">Tonight</div>
            <div className="font-mono text-2xl font-bold" style={{ color: verdict?.color }}>
              Kp {data.forecast.tonight}
            </div>
          </div>
          <div className="text-text-muted text-lg">/</div>
          <div className="text-center flex-1">
            <div className="text-xs text-text-muted uppercase tracking-wide mb-1">You need</div>
            <div className="font-mono text-2xl font-medium text-text-primary">
              Kp {requiredKp}+
            </div>
          </div>
        </div>

        {/* Simple bar visualisation */}
        <div className="relative h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
          {/* Required threshold marker */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-text-primary z-10"
            style={{ left: `${(requiredKp / 9) * 100}%` }}
          />
          {/* Tonight's forecast */}
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${(data.forecast.tonight / 9) * 100}%`,
              backgroundColor: verdict?.color,
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-text-muted">Kp 0</span>
          <span className="text-[10px] text-text-muted">Kp 9</span>
        </div>
      </div>

      {/* Tomorrow preview */}
      <div className="flex items-center justify-between border-t border-[#e5e5e5] pt-3 mt-4">
        <span className="text-xs text-text-muted">Tomorrow night</span>
        <span className="text-xs font-mono text-text-muted">
          Kp {data.forecast.tomorrow} forecast
        </span>
      </div>
    </div>
  )
}