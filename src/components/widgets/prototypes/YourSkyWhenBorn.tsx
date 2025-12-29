'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================================
// YOUR SKY WHEN BORN
// ===========================================
// Shows the night sky at your birth date/time/location
// Personal astronomical history
// ===========================================

interface Star {
  name: string
  ra: number  // Right ascension in hours
  dec: number // Declination in degrees
  mag: number // Apparent magnitude
}

// Bright stars data
const brightStars: Star[] = [
  { name: 'Sirius', ra: 6.752, dec: -16.72, mag: -1.46 },
  { name: 'Canopus', ra: 6.399, dec: -52.70, mag: -0.74 },
  { name: 'Arcturus', ra: 14.261, dec: 19.18, mag: -0.05 },
  { name: 'Vega', ra: 18.616, dec: 38.78, mag: 0.03 },
  { name: 'Capella', ra: 5.278, dec: 46.00, mag: 0.08 },
  { name: 'Rigel', ra: 5.242, dec: -8.20, mag: 0.13 },
  { name: 'Procyon', ra: 7.655, dec: 5.22, mag: 0.34 },
  { name: 'Betelgeuse', ra: 5.919, dec: 7.41, mag: 0.42 },
  { name: 'Altair', ra: 19.846, dec: 8.87, mag: 0.76 },
  { name: 'Aldebaran', ra: 4.599, dec: 16.51, mag: 0.85 },
  { name: 'Spica', ra: 13.420, dec: -11.16, mag: 0.97 },
  { name: 'Antares', ra: 16.490, dec: -26.43, mag: 1.06 },
  { name: 'Pollux', ra: 7.755, dec: 28.03, mag: 1.14 },
  { name: 'Fomalhaut', ra: 22.961, dec: -29.62, mag: 1.16 },
  { name: 'Deneb', ra: 20.690, dec: 45.28, mag: 1.25 },
  { name: 'Regulus', ra: 10.139, dec: 11.97, mag: 1.36 },
  { name: 'Castor', ra: 7.577, dec: 31.89, mag: 1.58 },
  { name: 'Polaris', ra: 2.530, dec: 89.26, mag: 1.98 },
]

export default function YourSkyWhenBorn() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [birthDate, setBirthDate] = useState('1977-06-15')
  const [birthTime, setBirthTime] = useState('03:00')
  const [latitude, setLatitude] = useState(51.5) // London default
  const [visibleStars, setVisibleStars] = useState<Star[]>([])
  const [selectedStar, setSelectedStar] = useState<Star | null>(null)
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setBaseFontSize(width / 25)
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
  
  // Calculate sidereal time at given date/time
  const getSiderealTime = useCallback((date: Date, longitude: number): number => {
    // Julian date calculation
    const jd = date.getTime() / 86400000 + 2440587.5
    const T = (jd - 2451545.0) / 36525
    
    // Greenwich Mean Sidereal Time
    let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
               0.000387933 * T * T - T * T * T / 38710000
    
    // Local Sidereal Time
    let lst = gmst + longitude
    lst = ((lst % 360) + 360) % 360
    
    return lst / 15 // Convert to hours
  }, [])
  
  // Calculate if star is visible and its position
  const calculateStarPosition = useCallback((star: Star, lst: number, lat: number): { alt: number, az: number } | null => {
    const latRad = lat * Math.PI / 180
    const decRad = star.dec * Math.PI / 180
    
    // Hour angle
    let ha = (lst - star.ra) * 15 * Math.PI / 180
    
    // Altitude
    const sinAlt = Math.sin(decRad) * Math.sin(latRad) +
                   Math.cos(decRad) * Math.cos(latRad) * Math.cos(ha)
    const alt = Math.asin(sinAlt) * 180 / Math.PI
    
    if (alt < 0) return null // Below horizon
    
    // Azimuth
    const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) /
                  (Math.cos(latRad) * Math.cos(alt * Math.PI / 180))
    let az = Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180 / Math.PI
    
    if (Math.sin(ha) > 0) az = 360 - az
    
    return { alt, az }
  }, [])
  
  // Draw sky map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20
    
    // Parse date/time
    const [year, month, day] = birthDate.split('-').map(Number)
    const [hours, minutes] = birthTime.split(':').map(Number)
    const date = new Date(year, month - 1, day, hours, minutes)
    
    // Get sidereal time (assuming 0° longitude for simplicity)
    const lst = getSiderealTime(date, 0)
    
    // Clear canvas - night sky gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    gradient.addColorStop(0, '#0a0a1a')
    gradient.addColorStop(1, '#000510')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fill()
    
    // Draw horizon ring
    ctx.strokeStyle = '#1a1a3a'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()
    
    // Draw cardinal directions
    ctx.fillStyle = '#4a4a6a'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('N', centerX, centerY - radius + 15)
    ctx.fillText('S', centerX, centerY + radius - 5)
    ctx.fillText('E', centerX - radius + 10, centerY + 4)
    ctx.fillText('W', centerX + radius - 10, centerY + 4)
    
    // Calculate and draw visible stars
    const visible: Star[] = []
    
    brightStars.forEach(star => {
      const pos = calculateStarPosition(star, lst, latitude)
      if (!pos) return
      
      visible.push(star)
      
      // Project to canvas (stereographic projection)
      const r = radius * (90 - pos.alt) / 90
      const theta = (pos.az - 180) * Math.PI / 180
      const x = centerX + r * Math.sin(theta)
      const y = centerY - r * Math.cos(theta)
      
      // Star size based on magnitude
      const size = Math.max(1, 4 - star.mag)
      
      // Draw star
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = star.mag < 0.5 ? '#ffffff' : star.mag < 1.5 ? '#e0e0ff' : '#a0a0c0'
      ctx.fill()
      
      // Draw name for brightest stars
      if (star.mag < 1) {
        ctx.fillStyle = '#6a6a8a'
        ctx.font = '8px sans-serif'
        ctx.fillText(star.name, x + 5, y - 5)
      }
    })
    
    setVisibleStars(visible)
    
    // Draw zenith marker
    ctx.beginPath()
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2)
    ctx.strokeStyle = '#3a3a5a'
    ctx.lineWidth = 1
    ctx.stroke()
    
  }, [birthDate, birthTime, latitude, getSiderealTime, calculateStarPosition])
  
  const getZodiacSign = (date: string): { sign: string, symbol: string } => {
    const [, month, day] = date.split('-').map(Number)
    const md = month * 100 + day
    
    if (md >= 321 && md <= 419) return { sign: 'Aries', symbol: '♈' }
    if (md >= 420 && md <= 520) return { sign: 'Taurus', symbol: '♉' }
    if (md >= 521 && md <= 620) return { sign: 'Gemini', symbol: '♊' }
    if (md >= 621 && md <= 722) return { sign: 'Cancer', symbol: '♋' }
    if (md >= 723 && md <= 822) return { sign: 'Leo', symbol: '♌' }
    if (md >= 823 && md <= 922) return { sign: 'Virgo', symbol: '♍' }
    if (md >= 923 && md <= 1022) return { sign: 'Libra', symbol: '♎' }
    if (md >= 1023 && md <= 1121) return { sign: 'Scorpio', symbol: '♏' }
    if (md >= 1122 && md <= 1221) return { sign: 'Sagittarius', symbol: '♐' }
    if (md >= 1222 || md <= 119) return { sign: 'Capricorn', symbol: '♑' }
    if (md >= 120 && md <= 218) return { sign: 'Aquarius', symbol: '♒' }
    return { sign: 'Pisces', symbol: '♓' }
  }
  
  const zodiac = getZodiacSign(birthDate)
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-[#0a0a1a] rounded-xl p-[1em] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.5em]">
        <div>
          <div className="text-[0.625em] font-medium text-indigo-300/60 uppercase tracking-wider">
            YOUR SKY WHEN BORN
          </div>
        </div>
        <div className="flex items-center gap-[0.25em]">
          <span className="text-[1.25em]">{zodiac.symbol}</span>
          <span className="text-[0.625em] text-indigo-300/60">{zodiac.sign}</span>
        </div>
      </div>
      
      {/* Date/Time inputs */}
      <div className="flex gap-[0.5em] mb-[0.5em]">
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="flex-1 px-[0.5em] py-[0.25em] rounded bg-white/5 border border-white/10 text-[0.625em] text-white font-mono focus:outline-none focus:border-indigo-500/50"
        />
        <input
          type="time"
          value={birthTime}
          onChange={(e) => setBirthTime(e.target.value)}
          className="w-[5em] px-[0.5em] py-[0.25em] rounded bg-white/5 border border-white/10 text-[0.625em] text-white font-mono focus:outline-none focus:border-indigo-500/50"
        />
      </div>
      
      {/* Sky map */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="max-w-full max-h-full rounded-full"
        />
      </div>
      
      {/* Stats */}
      <div className="mt-[0.5em] grid grid-cols-2 gap-[0.5em]">
        <div className="bg-white/5 rounded-lg p-[0.5em]">
          <div className="text-[0.4375em] text-white/30 uppercase">Stars Visible</div>
          <div className="font-mono text-[0.875em] text-white font-medium">
            {visibleStars.length}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-[0.5em]">
          <div className="text-[0.4375em] text-white/30 uppercase">Brightest</div>
          <div className="text-[0.75em] text-white font-medium truncate">
            {visibleStars.sort((a, b) => a.mag - b.mag)[0]?.name || '-'}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-[0.5em] text-[0.4375em] text-white/20 text-center">
        The stars above when you took your first breath
      </div>
    </div>
  )
}
