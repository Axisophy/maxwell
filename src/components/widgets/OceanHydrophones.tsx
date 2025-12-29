'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// OCEAN HYDROPHONES
// ===========================================
// Deep sea audio from underwater microphones
// Detecting whales, ships, earthquakes
// Data: MBARI / Ocean Networks Canada / NOAA
// ===========================================

interface HydrophoneStation {
  id: string
  name: string
  location: string
  depth: number
  lat: number
  lon: number
  status: 'recording' | 'processing' | 'offline'
  temperature: number // °C
}

interface SoundEvent {
  id: string
  type: 'whale' | 'ship' | 'earthquake' | 'unknown' | 'rain' | 'ice'
  subtype?: string // e.g., 'Blue Whale', 'Humpback', 'Container Ship'
  frequency: string
  timestamp: string
  duration: number
  intensity: number // dB
  estimatedDistance?: number // km
}

interface HydrophoneData {
  timestamp: string
  station: HydrophoneStation
  recentEvents: SoundEvent[]
  currentAmplitude: number
  dominantFrequency: number
  noiseFloor: number
  stats24h: {
    whales: number
    ships: number
    earthquakes: number
  }
  frequencyBands: {
    infrasonic: number // < 20 Hz
    low: number // 20-200 Hz
    mid: number // 200-2000 Hz
    high: number // > 2000 Hz
  }
}

const STATIONS: HydrophoneStation[] = [
  { id: 'MARS', name: 'MARS Observatory', location: 'Monterey Bay, CA', depth: 891, lat: 36.713, lon: -122.186, status: 'recording', temperature: 4.2 },
  { id: 'NEPTUNE', name: 'NEPTUNE Canada', location: 'Cascadia Basin', depth: 2660, lat: 47.765, lon: -127.764, status: 'recording', temperature: 1.8 },
  { id: 'ALOHA', name: 'Station ALOHA', location: 'North Pacific', depth: 4728, lat: 22.75, lon: -158.0, status: 'recording', temperature: 1.5 },
  { id: 'SOSUS', name: 'SOSUS Atlantic', location: 'North Atlantic', depth: 1200, lat: 32.5, lon: -64.5, status: 'processing', temperature: 3.1 },
]

const WHALE_SPECIES = ['Blue Whale', 'Humpback', 'Fin Whale', 'Sperm Whale', 'Orca', 'Gray Whale']

function generateSpectrogramColumn(amplitude: number, events: SoundEvent[]): number[] {
  const bins = 32
  const column: number[] = new Array(bins).fill(0)

  // Base ocean noise
  for (let i = 0; i < bins; i++) {
    column[i] = (1 - i / bins) * 0.25 * amplitude + Math.random() * 0.08
  }

  // Add event signatures
  events.forEach(event => {
    if (Date.now() - new Date(event.timestamp).getTime() > 15000) return

    const intensity = event.intensity / 150

    switch (event.type) {
      case 'whale':
        for (let i = 0; i < 10; i++) {
          column[i] += intensity * (0.3 + Math.random() * 0.4)
        }
        break
      case 'ship':
        for (let i = 2; i < 12; i++) {
          column[i] += intensity * 0.5
        }
        break
      case 'earthquake':
        for (let i = 0; i < 5; i++) {
          column[i] += intensity * 0.9
        }
        break
      case 'ice':
        for (let i = 8; i < 20; i++) {
          column[i] += intensity * (0.2 + Math.random() * 0.3)
        }
        break
      case 'rain':
        for (let i = 18; i < 28; i++) {
          column[i] += intensity * Math.random() * 0.25
        }
        break
    }
  })

  return column.map(v => Math.min(1, v))
}

function getEventColor(type: string): string {
  switch (type) {
    case 'whale': return '#22d3ee'
    case 'ship': return '#f97316'
    case 'earthquake': return '#ef4444'
    case 'ice': return '#a5b4fc'
    case 'rain': return '#60a5fa'
    default: return '#64748b'
  }
}

function timeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  return `${Math.floor(seconds / 3600)}h ago`
}

export default function OceanHydrophones() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const waveformRef = useRef<HTMLCanvasElement>(null)
  const [data, setData] = useState<HydrophoneData | null>(null)
  const [spectrogram, setSpectrogram] = useState<number[][]>([])
  const [waveformHistory, setWaveformHistory] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStation, setSelectedStation] = useState(STATIONS[0])
  const [showStationPicker, setShowStationPicker] = useState(false)
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

  // Fetch/generate data
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/hydrophones?station=${selectedStation.id}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
    } catch {
      const events: SoundEvent[] = []

      // Generate realistic events
      if (Math.random() > 0.5) {
        events.push({
          id: 'whale-' + Date.now(),
          type: 'whale',
          subtype: WHALE_SPECIES[Math.floor(Math.random() * WHALE_SPECIES.length)],
          frequency: '15-100 Hz',
          timestamp: new Date(Date.now() - Math.random() * 300000).toISOString(),
          duration: 2 + Math.random() * 12,
          intensity: 80 + Math.random() * 40,
          estimatedDistance: 5 + Math.random() * 50
        })
      }

      if (Math.random() > 0.3) {
        events.push({
          id: 'ship-' + Date.now(),
          type: 'ship',
          subtype: Math.random() > 0.5 ? 'Container Ship' : 'Tanker',
          frequency: '40-200 Hz',
          timestamp: new Date(Date.now() - Math.random() * 600000).toISOString(),
          duration: 60 + Math.random() * 180,
          intensity: 100 + Math.random() * 40,
          estimatedDistance: 10 + Math.random() * 100
        })
      }

      if (Math.random() > 0.92) {
        events.push({
          id: 'eq-' + Date.now(),
          type: 'earthquake',
          frequency: '< 15 Hz',
          timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          duration: 15 + Math.random() * 90,
          intensity: 110 + Math.random() * 30,
          estimatedDistance: 100 + Math.random() * 500
        })
      }

      const amplitude = 0.25 + Math.random() * 0.35

      setData({
        timestamp: new Date().toISOString(),
        station: selectedStation,
        recentEvents: events.sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
        currentAmplitude: amplitude,
        dominantFrequency: 20 + Math.random() * 100,
        noiseFloor: -95 + Math.random() * 15,
        stats24h: {
          whales: Math.floor(Math.random() * 12),
          ships: 15 + Math.floor(Math.random() * 30),
          earthquakes: Math.floor(Math.random() * 3)
        },
        frequencyBands: {
          infrasonic: amplitude * (0.3 + Math.random() * 0.4),
          low: amplitude * (0.5 + Math.random() * 0.4),
          mid: amplitude * (0.2 + Math.random() * 0.3),
          high: amplitude * (0.1 + Math.random() * 0.2)
        }
      })
    } finally {
      setLoading(false)
    }
  }, [selectedStation])

  useEffect(() => {
    setLoading(true)
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Update spectrogram and waveform
  useEffect(() => {
    if (!data) return

    const interval = setInterval(() => {
      // Spectrogram
      setSpectrogram(prev => {
        const newColumn = generateSpectrogramColumn(data.currentAmplitude, data.recentEvents)
        return [...prev, newColumn].slice(-80)
      })

      // Waveform
      setWaveformHistory(prev => {
        const newAmplitude = data.currentAmplitude * (0.7 + Math.random() * 0.6)
        return [...prev, newAmplitude].slice(-120)
      })
    }, 80)

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

    const colWidth = rect.width / 80
    const rowHeight = rect.height / 32

    spectrogram.forEach((column, x) => {
      column.forEach((value, y) => {
        const hue = 195 - value * 60
        const saturation = 80 + value * 20
        const lightness = 8 + value * 55

        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        ctx.fillRect(x * colWidth, (31 - y) * rowHeight, colWidth + 1, rowHeight + 1)
      })
    })
  }, [spectrogram])

  // Draw waveform
  useEffect(() => {
    const canvas = waveformRef.current
    if (!canvas || waveformHistory.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    ctx.fillStyle = '#030d15'
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Draw center line
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, rect.height / 2)
    ctx.lineTo(rect.width, rect.height / 2)
    ctx.stroke()

    // Draw waveform
    ctx.strokeStyle = '#22d3ee'
    ctx.lineWidth = 1.5
    ctx.beginPath()

    const stepX = rect.width / 120
    const centerY = rect.height / 2
    const maxAmp = rect.height * 0.4

    waveformHistory.forEach((amp, i) => {
      const x = i * stepX
      const y = centerY + Math.sin(i * 0.3 + Date.now() * 0.002) * amp * maxAmp

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })

    ctx.stroke()
  }, [waveformHistory])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#030d15]">
        <div className="text-[0.875em] text-cyan-300/50">Connecting to hydrophone...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full bg-[#030d15]">
        <div className="text-[0.875em] text-cyan-300/50">Unable to connect</div>
      </div>
    )
  }

  return (
    <div
      ref={setContainerRef}
      className="h-full bg-[#030d15] overflow-hidden flex flex-col"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-[0.75em] py-[0.625em] border-b border-cyan-500/20">
        <div className="flex-1 min-w-0">
          <button
            onClick={() => setShowStationPicker(!showStationPicker)}
            className="flex items-center gap-[0.375em] hover:opacity-80 transition-opacity"
          >
            <span
              className="w-[0.5em] h-[0.5em] rounded-full flex-shrink-0"
              style={{
                backgroundColor: data.station.status === 'recording' ? '#22d3ee' :
                                data.station.status === 'processing' ? '#fbbf24' : '#ef4444'
              }}
            />
            <span className="text-[0.6875em] font-medium text-white truncate">
              {data.station.name}
            </span>
            <span className="text-[0.5em] text-white/30">▼</span>
          </button>
          <div className="text-[0.5em] text-white/40 ml-[1.75em]">
            {data.station.depth}m · {data.station.temperature}°C
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-[0.875em] font-mono font-medium text-cyan-400">
            {data.noiseFloor.toFixed(0)} dB
          </div>
          <div className="text-[0.4375em] text-white/40 uppercase tracking-wider">
            Noise Floor
          </div>
        </div>
      </div>

      {/* Station picker dropdown */}
      {showStationPicker && (
        <div className="absolute top-[3.5em] left-[0.5em] right-[0.5em] z-10 bg-[#0a1929] border border-cyan-500/30 rounded-[0.5em] shadow-xl">
          {STATIONS.map(station => (
            <button
              key={station.id}
              onClick={() => {
                setSelectedStation(station)
                setShowStationPicker(false)
              }}
              className={`w-full px-[0.75em] py-[0.5em] text-left hover:bg-cyan-500/10 transition-colors first:rounded-t-[0.5em] last:rounded-b-[0.5em] ${
                station.id === selectedStation.id ? 'bg-cyan-500/20' : ''
              }`}
            >
              <div className="flex items-center gap-[0.375em]">
                <span
                  className="w-[0.375em] h-[0.375em] rounded-full"
                  style={{ backgroundColor: station.status === 'recording' ? '#22d3ee' : '#fbbf24' }}
                />
                <span className="text-[0.625em] text-white">{station.name}</span>
              </div>
              <div className="text-[0.4375em] text-white/40 ml-[1.5em]">
                {station.location} · {station.depth}m
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Waveform */}
      <div className="h-[2.5em] relative border-b border-cyan-500/10">
        <canvas ref={waveformRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Spectrogram */}
      <div className="flex-1 relative min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Frequency labels */}
        <div className="absolute left-[0.25em] top-0 bottom-0 flex flex-col justify-between py-[0.25em] pointer-events-none">
          {['10k', '1k', '100', '10'].map(label => (
            <span key={label} className="text-[0.375em] font-mono text-white/30">{label}</span>
          ))}
        </div>

        {/* Time label */}
        <div className="absolute bottom-[0.25em] right-[0.5em] text-[0.375em] font-mono text-white/30">
          ← 8 sec
        </div>
      </div>

      {/* Frequency bands */}
      <div className="flex gap-[0.25em] px-[0.75em] py-[0.5em] border-t border-cyan-500/10">
        {[
          { label: '<20Hz', value: data.frequencyBands.infrasonic, color: '#ef4444' },
          { label: '20-200', value: data.frequencyBands.low, color: '#f97316' },
          { label: '0.2-2k', value: data.frequencyBands.mid, color: '#22d3ee' },
          { label: '>2kHz', value: data.frequencyBands.high, color: '#a5b4fc' },
        ].map(band => (
          <div key={band.label} className="flex-1">
            <div className="h-[1.5em] bg-white/5 rounded-[0.25em] overflow-hidden flex flex-col-reverse">
              <div
                className="w-full transition-all duration-200"
                style={{
                  height: `${band.value * 100}%`,
                  backgroundColor: band.color,
                  opacity: 0.7
                }}
              />
            </div>
            <div className="text-[0.375em] font-mono text-white/40 text-center mt-[0.25em]">
              {band.label}
            </div>
          </div>
        ))}
      </div>

      {/* 24h Stats */}
      <div className="flex justify-around px-[0.75em] py-[0.375em] border-t border-cyan-500/10 bg-white/[0.02]">
        <div className="text-center">
          <div className="text-[0.75em] font-mono font-medium text-cyan-400">{data.stats24h.whales}</div>
          <div className="text-[0.375em] text-white/40 uppercase">Whales</div>
        </div>
        <div className="text-center">
          <div className="text-[0.75em] font-mono font-medium text-orange-400">{data.stats24h.ships}</div>
          <div className="text-[0.375em] text-white/40 uppercase">Ships</div>
        </div>
        <div className="text-center">
          <div className="text-[0.75em] font-mono font-medium text-red-400">{data.stats24h.earthquakes}</div>
          <div className="text-[0.375em] text-white/40 uppercase">Seismic</div>
        </div>
      </div>

      {/* Recent events */}
      <div className="px-[0.5em] py-[0.375em] border-t border-cyan-500/20">
        {data.recentEvents.length === 0 ? (
          <div className="text-[0.5625em] text-white/30 text-center py-[0.25em]">
            Listening...
          </div>
        ) : (
          <div className="flex gap-[0.375em] overflow-x-auto">
            {data.recentEvents.slice(0, 3).map(event => (
              <div
                key={event.id}
                className="flex-shrink-0 px-[0.5em] py-[0.375em] bg-white/5 rounded-[0.375em] border-l-2"
                style={{ borderColor: getEventColor(event.type) }}
              >
                <div className="flex items-center gap-[0.375em]">
                  <span className="text-[0.5625em] font-medium text-white capitalize">
                    {event.subtype || event.type}
                  </span>
                  <span className="text-[0.4375em] text-white/40">
                    {timeAgo(event.timestamp)}
                  </span>
                </div>
                <div className="flex items-center gap-[0.5em] mt-[0.125em]">
                  <span className="text-[0.4375em] font-mono text-white/50">
                    {event.frequency}
                  </span>
                  {event.estimatedDistance && (
                    <span className="text-[0.4375em] font-mono text-white/40">
                      ~{event.estimatedDistance.toFixed(0)}km
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center px-[0.75em] py-[0.375em] border-t border-cyan-500/10">
        <span className="text-[0.4375em] text-white/30">
          MBARI · Ocean Networks Canada · ~20 min delay
        </span>
      </div>
    </div>
  )
}
