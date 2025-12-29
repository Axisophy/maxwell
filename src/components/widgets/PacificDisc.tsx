'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// PACIFIC DISC WIDGET
// ===========================================
// Full-disc Earth imagery from Himawari-8/9
// Data: NICT Japan (direct URL - no CORS issues for img tags)
// Updates every 10 minutes
// ===========================================

const IMAGE_TYPES = {
  D531106: { label: 'True Color', description: 'Visible RGB composite' },
  INFRARED_FULL: { label: 'Infrared', description: 'Thermal IR channel' },
} as const

type ImageTypeKey = keyof typeof IMAGE_TYPES

const ANIMATION_DURATIONS = [3, 6, 12, 24] as const
type AnimationDuration = (typeof ANIMATION_DURATIONS)[number]

export default function PacificDisc() {
  const [imageType, setImageType] = useState<ImageTypeKey>('D531106')
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDuration, setAnimationDuration] = useState<AnimationDuration>(3)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isPreloading, setIsPreloading] = useState(false)

  // Refs
  const animationFrames = useRef<string[]>([])
  const animationTimer = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)

  // Responsive scaling
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400
      setBaseFontSize(width / 25)
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Get latest available image time (Himawari has ~30 min delay)
  const getLatestImageTime = useCallback(() => {
    const now = new Date()
    now.setMinutes(Math.floor((now.getMinutes() - 30) / 10) * 10)
    now.setSeconds(0)
    now.setMilliseconds(0)
    return now
  }, [])

  // Build direct URL for an image
  const buildImageUrl = useCallback((time: Date, type: ImageTypeKey) => {
    const year = time.getUTCFullYear()
    const month = String(time.getUTCMonth() + 1).padStart(2, '0')
    const day = String(time.getUTCDate()).padStart(2, '0')
    const hour = String(time.getUTCHours()).padStart(2, '0')
    const minute = String(time.getUTCMinutes()).padStart(2, '0')
    return `https://himawari8.nict.go.jp/img/${type}/1d/550/${year}/${month}/${day}/${hour}${minute}00_0_0.png`
  }, [])

  // Current static image URL
  const [staticImageUrl, setStaticImageUrl] = useState<string>('')

  // Initialize and update static image
  useEffect(() => {
    const time = getLatestImageTime()
    setCurrentTime(time)
    setStaticImageUrl(buildImageUrl(time, imageType))
    setImageError(false)
    setImageLoaded(false)
  }, [imageType, getLatestImageTime, buildImageUrl])

  // Refresh static image every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        const time = getLatestImageTime()
        setCurrentTime(time)
        setStaticImageUrl(buildImageUrl(time, imageType))
      }
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [imageType, isAnimating, getLatestImageTime, buildImageUrl])

  // Stop animation
  const stopAnimation = useCallback(() => {
    if (animationTimer.current) {
      window.clearInterval(animationTimer.current)
      animationTimer.current = null
    }
    setIsAnimating(false)
    setCurrentFrameIndex(0)
    animationFrames.current = []
  }, [])

  // Preload images and start animation
  const startAnimation = useCallback(async (hours: AnimationDuration) => {
    stopAnimation()
    setAnimationDuration(hours)
    setIsPreloading(true)

    const latestTime = getLatestImageTime()
    const frameCount = hours * 6
    const frames: string[] = []

    for (let i = frameCount - 1; i >= 0; i--) {
      const frameTime = new Date(latestTime.getTime() - i * 10 * 60 * 1000)
      frames.push(buildImageUrl(frameTime, imageType))
    }

    const preloadPromises = frames.map((url) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve()
        img.src = url
      })
    })

    await Promise.all(preloadPromises)

    animationFrames.current = frames
    setIsPreloading(false)
    setIsAnimating(true)
    setCurrentFrameIndex(0)

    const frameDelay = hours <= 6 ? 150 : hours <= 12 ? 100 : 80

    animationTimer.current = window.setInterval(() => {
      setCurrentFrameIndex((prev) => {
        const next = prev + 1
        return next >= frames.length ? 0 : next
      })
    }, frameDelay)
  }, [stopAnimation, getLatestImageTime, buildImageUrl, imageType])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimer.current) {
        window.clearInterval(animationTimer.current)
      }
    }
  }, [])

  const handleImageTypeChange = (type: ImageTypeKey) => {
    stopAnimation()
    setImageType(type)
    setImageError(false)
  }

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--'
    return (
      date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      }) + ' UTC'
    )
  }

  const displayUrl = isAnimating && animationFrames.current.length > 0
    ? animationFrames.current[currentFrameIndex]
    : staticImageUrl

  return (
    <div
      ref={containerRef}
      className="bg-[#1a1a1e] p-[1em] h-full"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.75em]">
        <div className="flex items-center gap-[0.5em]">
          <span className="relative flex h-[0.5em] w-[0.5em]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
          </span>
          <span className="text-[0.875em] font-medium text-white">Pacific Disc</span>
        </div>
        <span className="text-[0.6875em] text-white/40">NICT · Himawari</span>
      </div>

      {/* Earth disc image */}
      <div className="bg-white/5 rounded-[0.5em] p-[0.5em] mb-[0.75em]">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0 rounded-[0.375em] overflow-hidden bg-[#0a0a12] flex items-center justify-center">
            {/* Loading spinner */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-[2em] h-[2em] border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            )}

            {/* Preloading overlay */}
            {isPreloading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                <span className="text-[0.75em] text-white/60">Loading {animationDuration}h...</span>
              </div>
            )}

            {/* Earth image */}
            <div className="absolute inset-[4%]">
              {displayUrl && (
                <img
                  key={displayUrl}
                  src={displayUrl}
                  alt="Himawari Pacific view"
                  className={`w-full h-full object-contain rounded-full transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            {/* Atmospheric glow */}
            <div
              className="absolute inset-[4%] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, transparent 85%, rgba(100, 180, 255, 0.1) 95%, rgba(50, 100, 200, 0.15) 100%)',
              }}
            />

            {/* Error state */}
            {imageError && !isAnimating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[0.75em] text-white/40">Image unavailable</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-[0.5em] mb-[0.5em]">
        <span className="text-[0.6875em] text-white/40 w-[3em]">View</span>
        <div className="flex bg-white/10 rounded-[0.375em] p-[0.125em]">
          {Object.entries(IMAGE_TYPES).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => handleImageTypeChange(key as ImageTypeKey)}
              disabled={isPreloading}
              className={`px-[0.625em] py-[0.375em] text-[0.6875em] font-medium rounded-[0.25em] transition-colors disabled:opacity-50 ${
                imageType === key
                  ? 'bg-white text-black'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Animation controls */}
      <div className="flex items-center gap-[0.5em] mb-[0.75em]">
        <span className="text-[0.6875em] text-white/40 w-[3em]">Loop</span>
        <div className="flex bg-white/10 rounded-[0.375em] p-[0.125em]">
          {ANIMATION_DURATIONS.map((hours) => (
            <button
              key={hours}
              onClick={() => startAnimation(hours)}
              disabled={isPreloading}
              className={`px-[0.5em] py-[0.375em] text-[0.6875em] font-medium rounded-[0.25em] transition-colors disabled:opacity-50 ${
                isAnimating && animationDuration === hours
                  ? 'bg-white text-black'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              {hours}h
            </button>
          ))}
          {isAnimating && (
            <button
              onClick={stopAnimation}
              className="px-[0.5em] py-[0.375em] text-[0.6875em] font-medium rounded-[0.25em] bg-white/20 text-white ml-[0.25em]"
            >
              ■
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[0.5em] border-t border-white/10">
        <span className="text-[0.6875em] text-white/40">
          {isPreloading
            ? 'Loading frames...'
            : isAnimating
              ? `${animationDuration}h animation`
              : IMAGE_TYPES[imageType].description}
        </span>
        <span className="text-[0.6875em] font-mono text-white/40">{formatTime(currentTime)}</span>
      </div>
    </div>
  )
}
