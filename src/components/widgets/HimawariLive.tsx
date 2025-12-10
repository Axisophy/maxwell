'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ===========================================
// HIMAWARI LIVE WIDGET
// ===========================================
// Full-disc Earth imagery from Himawari-8/9
// Data: NICT Japan (direct URL - no CORS issues for img tags)
// Updates every 10 minutes
// ===========================================

const IMAGE_TYPES = {
  D531106: { label: 'True Color', description: 'Visible RGB composite' },
  INFRARED_FULL: { label: 'Infrared', description: 'Thermal IR' },
} as const

type ImageTypeKey = keyof typeof IMAGE_TYPES

const ANIMATION_DURATIONS = [3, 6, 12, 24] as const
type AnimationDuration = (typeof ANIMATION_DURATIONS)[number]

export default function HimawariLive() {
  const [imageType, setImageType] = useState<ImageTypeKey>('D531106')
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [imageError, setImageError] = useState(false)
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDuration, setAnimationDuration] = useState<AnimationDuration>(3)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isPreloading, setIsPreloading] = useState(false)
  
  // Refs
  const animationFrames = useRef<string[]>([])
  const animationTimer = useRef<number | null>(null)

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

    // Generate frame URLs
    const latestTime = getLatestImageTime()
    const frameCount = hours * 6
    const frames: string[] = []
    
    for (let i = frameCount - 1; i >= 0; i--) {
      const frameTime = new Date(latestTime.getTime() - i * 10 * 60 * 1000)
      frames.push(buildImageUrl(frameTime, imageType))
    }

    // Preload all frames
    const preloadPromises = frames.map((url) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve() // Continue even if some fail
        img.src = url
      })
    })

    await Promise.all(preloadPromises)
    
    // Store frames and start animation
    animationFrames.current = frames
    setIsPreloading(false)
    setIsAnimating(true)
    setCurrentFrameIndex(0)

    // Calculate frame delay
    const frameDelay = hours <= 6 ? 150 : hours <= 12 ? 100 : 80

    // Start animation loop using window.setInterval for proper typing
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

  // Handle image type change
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

  // Determine which image to display
  const displayUrl = isAnimating && animationFrames.current.length > 0
    ? animationFrames.current[currentFrameIndex]
    : staticImageUrl

  return (
    <div className="w-full">
      {/* Image container - Earth disc */}
      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0 bg-[#0a0a12] rounded-lg overflow-hidden flex items-center justify-center p-[4%]">
          <div className="relative w-full h-full">
            {/* Subtle outer glow */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow:
                  '0 0 40px rgba(100, 150, 255, 0.15), inset 0 0 20px rgba(0,0,0,0.5)',
              }}
            />

            {/* Earth image */}
            <div className="absolute inset-[2%] rounded-full overflow-hidden bg-[#0a0a12]">
              {displayUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={displayUrl}
                  src={displayUrl}
                  alt="Himawari Pacific view"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              )}
              {imageError && !isAnimating && (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-xs">
                  Image unavailable
                </div>
              )}
              {isPreloading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-neutral-300 text-xs">
                  Loading {animationDuration}h...
                </div>
              )}
            </div>

            {/* Atmospheric edge glow */}
            <div
              className="absolute inset-[2%] rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, transparent 85%, rgba(100, 180, 255, 0.1) 95%, rgba(50, 100, 200, 0.2) 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4">
        {/* Top row: Image type + Animation controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Image type selector */}
          <div className="flex p-1 rounded-lg" style={{ backgroundColor: '#e5e5e5' }}>
            {Object.entries(IMAGE_TYPES).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => handleImageTypeChange(key as ImageTypeKey)}
                disabled={isPreloading}
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: imageType === key ? '#ffffff' : 'transparent',
                  color: imageType === key ? '#000000' : 'rgba(0,0,0,0.5)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Animation duration selector */}
          <div className="flex p-1 rounded-lg" style={{ backgroundColor: '#e5e5e5' }}>
            {ANIMATION_DURATIONS.map((hours) => (
              <button
                key={hours}
                onClick={() => startAnimation(hours)}
                disabled={isPreloading}
                className="px-2 py-1 text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                style={{
                  backgroundColor:
                    isAnimating && animationDuration === hours ? '#000000' : 'transparent',
                  color:
                    isAnimating && animationDuration === hours ? '#ffffff' : 'rgba(0,0,0,0.5)',
                }}
              >
                {hours}h
              </button>
            ))}
            {isAnimating && (
              <button
                onClick={stopAnimation}
                className="px-2 py-1 text-xs font-medium rounded-md bg-white"
              >
                ■
              </button>
            )}
          </div>
        </div>

        {/* Bottom row: Description + Timestamp */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e5e5e5]">
          <span className="text-xs text-text-muted">
            {isPreloading
              ? 'Loading frames...'
              : isAnimating
                ? `${animationDuration}h animation`
                : IMAGE_TYPES[imageType].description}
          </span>
          <span className="text-xs font-mono text-text-muted">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  )
}