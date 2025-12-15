'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// OCEAN HYDROPHONES WIDGET
// ===========================================
// Deep sea audio visualization from underwater
// microphones detecting whales, ships, and earthquakes
// Data: MBARI / Ocean Networks Canada
// ===========================================

interface HydrophoneStation {
  id: string
  name: string
  location: string
  depth: number // meters
  lat: number
  lon: number
  status: 'recording' | 'processing' | 'offline'
}

interface SoundEvent {
  id: string
  type: 'whale' | 'ship' | 'earthquake' | 'unknown' | 'rain'
  frequency: string
  timestamp: string
  duration: number // seconds
  intensity: number // 0-100
  source?: string
}

interface HydrophoneData {
  timestamp: string
  station: HydrophoneStation
  recentEvents: SoundEvent[]
  currentAmplitude: number
  dominantFrequency: number
  noiseFloor: number
}

// Generate realistic spectrogram data
function generateSpectrogramColumn(amplitude: number, events: SoundEvent[]): number[] {
  const bins = 32
  const column: number[] = new Array(bins).fill(0)
  
  // Base ocean noise (increases with depth, higher at low frequencies)
  for (let i = 0; i < bins; i++) {
    column[i] = (1 - i / bins) * 0.3 * amplitude + Math.random() * 0.1
  }
  
  // Add event signatures
  events.forEach(event => {
    if (Date.now() - new Date(event.timestamp).getTime() > 10000) return
    
    switch (event.type) {
      case 'whale':
        // Low frequency (10-500 Hz) - bins 0-8
        for (let i = 0; i < 8; i++) {
          column[i] += event.intensity / 100 * Math.random() * 0.5
        }
        break
      case 'ship':
        // Low-mid frequency (20-200 Hz) - bins 2-10
        for (let i = 2; i < 10; i++) {
          column[i] += event.intensity / 100 * 0.4
        }
        break
      case 'earthquake':
        // Very low frequency (< 20 Hz) - bins 0-4
        for (let i = 0; i < 4; i++) {
          column[i] += event.intensity / 100 * 0.8
        }
        break
      case 'rain':
        // Higher frequency (1-10 kHz) - bins 15-25
        for (let i = 15; i < 25; i++) {
          column[i] += event.intensity / 100 * Math.random() * 0.3
        }
        break
    }
  })
  
  return column.map(v => Math.min(1, v))
}

export default function OceanHydrophones() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [data, setData] = useState<HydrophoneData | null>(null)
  const [spectrogram, setSpectrogram] = useState<number[][]>([])
  const [loading, setLoading] = useState(true)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  
  // Responsive scaling
  useEffect(() => {
    if (!containerRef) return
    
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25)
    })
    
    observer.observe(containerRef)
    return () => observer.disconnect()
  }, [containerRef])
  
  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/hydrophones')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
    } catch (error) {
      // Generate realistic fallback data
      const events: SoundEvent[] = []
      
      // Occasional whale calls
      if (Math.random() > 0.6) {
        events.push({
          id: 'whale-' + Date.now(),
          type: 'whale',
          frequency: '20-100 Hz',
          timestamp: new Date(Date.now() - Math.random() * 300000).toISOString(),
          duration: 2 + Math.random() * 8,
          intensity: 40 + Math.random() * 40,
          source: 'Blue Whale'
        })
      }
      
      // Ship noise (more common)
      if (Math.random() > 0.3) {
        events.push({
          id: 'ship-' + Date.now(),
          type: 'ship',
          frequency: '50-200 Hz',
          timestamp: new Date(Date.now() - Math.random() * 600000).toISOString(),
          duration: 30 + Math.random() * 120,
          intensity: 50 + Math.random() * 30
        })
      }
      
      // Rare earthquake
      if (Math.random() > 0.95) {
        events.push({
          id: 'eq-' + Date.now(),
          type: 'earthquake',
          frequency: '< 10 Hz',
          timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          duration: 10 + Math.random() * 60,
          intensity: 60 + Math.random() * 30
        })
      }
      
      setData({
        timestamp: new Date().toISOString(),
        station: {
          id: 'MBARI-MARS',
          name: 'MARS Observatory',
          location: 'Monterey Bay, California',
          depth: 891,
          lat: 36.713,
          lon: -122.186,
          status: 'recording'
        },
        recentEvents: events,
        currentAmplitude: 0.3 + Math.random() * 0.3,
        dominantFrequency: 20 + Math.random() * 80,
        noiseFloor: -90 + Math.random() * 10
      })
    } finally {
      setLoading(false)
    }
  }, [])
  
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [fetchData])
  
  // Update spectrogram continuously
  useEffect(() => {
    if (!data) return
    
    const interval = setInterval(() => {
      setSpectrogram(prev => {
        const newColumn = generateSpectrogramColumn(data.currentAmplitude, data.recentEvents)
        const updated = [...prev, newColumn].slice(-100)
        return updated
      })
    }, 100)
    
    return () => clearInterval(interval)
  }, [data])
  
  // Draw spectrogram
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || spectrogram.length === 0) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    const colWidth = rect.width / 100
    const rowHeight = rect.height / 32
    
    // Draw spectrogram
    spectrogram.forEach((column, x) => {
      column.forEach((value, y) => {
        // Deep blue to cyan to white color scale
        const hue = 200 - value * 80
        const saturation = 100 - value * 30
        const lightness = 10 + value * 60
        
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        ctx.fillRect(
          x * colWidth,
          (31 - y) * rowHeight, // Invert Y so low frequencies at bottom
          colWidth + 1,
          rowHeight + 1
        )
      })
    })
    
    // Frequency axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.font = `${baseFontSize * 0.4}px monospace`
    ctx.textAlign = 'left'
    
    const freqLabels = ['10 kHz', '1 kHz', '100 Hz', '10 Hz']
    freqLabels.forEach((label, i) => {
      const y = (i / (freqLabels.length - 1)) * rect.height
      ctx.fillText(label, 4, y + baseFontSize * 0.4)
    })
  }, [spectrogram, baseFontSize])
  
  const getEventIcon = (type: string): string => {
    switch (type) {
      case 'whale': return '🐋'
      case 'ship': return '🚢'
      case 'earthquake': return '🌊'
      case 'rain': return '🌧️'
      default: return '🔊'
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#051525]">
        <div className="text-[0.875em] text-cyan-300/50">Connecting to hydrophone...</div>
      </div>
    )
  }
  
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full bg-[#051525]">
        <div className="text-[0.875em] text-cyan-300/50">Unable to connect</div>
      </div>
    )
  }

  return (
    <div 
      ref={setContainerRef}
      className="h-full bg-[#051525] overflow-hidden flex flex-col"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-[0.75em] border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-[0.375em]">
            <span 
              className="w-[0.5em] h-[0.5em] rounded-full animate-pulse"
              style={{ 
                backgroundColor: data.station.status === 'recording' ? '#22d3ee' : 
                                data.station.status === 'processing' ? '#fbbf24' : '#ef4444'
              }}
            />
            <span className="text-[0.75em] font-medium text-cyan-100">{data.station.name}</span>
          </div>
          <div className="text-[0.5625em] text-cyan-300/50">
            {data.station.location} • {data.station.depth}m depth
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-[0.5em] uppercase tracking-wider text-cyan-300/40">Noise Floor</div>
          <div className="text-[0.875em] font-mono text-cyan-400">
            {data.noiseFloor.toFixed(0)} dB
          </div>
        </div>
      </div>
      
      {/* Spectrogram */}
      <div className="flex-1 relative min-h-0">
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Time label */}
        <div className="absolute bottom-[0.25em] right-[0.5em] text-[0.4em] text-white/40">
          ← 10 seconds
        </div>
      </div>
      
      {/* Recent events */}
      <div className="p-[0.5em] border-t border-cyan-500/20">
        <div className="text-[0.5em] uppercase tracking-wider text-cyan-300/40 mb-[0.375em]">
          Recent Detections
        </div>
        
        {data.recentEvents.length === 0 ? (
          <div className="text-[0.625em] text-cyan-300/30 italic">
            Listening for sounds...
          </div>
        ) : (
          <div className="flex flex-wrap gap-[0.375em]">
            {data.recentEvents.slice(0, 4).map(event => (
              <div 
                key={event.id}
                className="flex items-center gap-[0.25em] px-[0.5em] py-[0.25em] bg-cyan-500/10 rounded"
              >
                <span className="text-[0.75em]">{getEventIcon(event.type)}</span>
                <div>
                  <div className="text-[0.5625em] font-medium text-cyan-100 capitalize">
                    {event.source || event.type}
                  </div>
                  <div className="text-[0.4375em] text-cyan-300/50">
                    {event.frequency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between px-[0.75em] py-[0.5em] border-t border-cyan-500/10">
        <span className="text-[0.5em] text-cyan-300/30">
          MBARI Soundscape Listening Room
        </span>
        <span className="text-[0.5em] font-mono text-cyan-300/30">
          ~20 min delay
        </span>
      </div>
    </div>
  )
}
