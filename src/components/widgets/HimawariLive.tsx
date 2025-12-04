'use client'

import { useState, useEffect, useCallback } from 'react'

// Himawari-8 image types available via NICT
// Note: Individual bands may use format like B01, B03, B08, B13 etc.
// Himawari-8 image types available via NICT
// Only including confirmed working types
const IMAGE_TYPES = {
    'D531106': { label: 'True Color', description: 'Visible RGB composite' },
    'INFRARED_FULL': { label: 'Infrared', description: 'Thermal IR' },
  } as const

type ImageTypeKey = keyof typeof IMAGE_TYPES

// Animation duration options (in hours)
const ANIMATION_DURATIONS = [3, 6, 12, 24] as const
type AnimationDuration = typeof ANIMATION_DURATIONS[number]

interface HimawariLiveProps {
  defaultImageType?: ImageTypeKey
}

export default function HimawariLive({ 
  defaultImageType = 'D531106'
}: HimawariLiveProps) {
  const [imageType, setImageType] = useState<ImageTypeKey>(defaultImageType)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDuration, setAnimationDuration] = useState<AnimationDuration>(3)
  const [animationFrames, setAnimationFrames] = useState<string[]>([])
  const [animationIndex, setAnimationIndex] = useState(0)
  const [imageError, setImageError] = useState(false)

  // Get the latest available image time (rounded to 10 minutes, with ~30min delay)
  const getLatestImageTime = useCallback(() => {
    const now = new Date()
    // Himawari images have about 30 minute delay
    now.setMinutes(Math.floor((now.getMinutes() - 30) / 10) * 10)
    now.setSeconds(0)
    now.setMilliseconds(0)
    return now
  }, [])

  // Build image URL for a given time
  const buildImageUrl = useCallback((time: Date, type: ImageTypeKey) => {
    const year = time.getUTCFullYear()
    const month = String(time.getUTCMonth() + 1).padStart(2, '0')
    const day = String(time.getUTCDate()).padStart(2, '0')
    const hour = String(time.getUTCHours()).padStart(2, '0')
    const minute = String(time.getUTCMinutes()).padStart(2, '0')
    
    // Using scale 1 (single 550px tile) for simplicity
    return `https://himawari8.nict.go.jp/img/${type}/1d/550/${year}/${month}/${day}/${hour}${minute}00_0_0.png`
  }, [])

  // Generate animation frames based on duration
  const generateAnimationFrames = useCallback((latestTime: Date, type: ImageTypeKey, durationHours: number) => {
    const frames: string[] = []
    const frameCount = durationHours * 6 // 6 frames per hour (10-min intervals)
    for (let i = frameCount - 1; i >= 0; i--) {
      const frameTime = new Date(latestTime.getTime() - i * 10 * 60 * 1000)
      frames.push(buildImageUrl(frameTime, type))
    }
    return frames
  }, [buildImageUrl])

  // Update current image
  useEffect(() => {
    const updateImage = () => {
      const time = getLatestImageTime()
      setCurrentTime(time)
      setImageUrl(buildImageUrl(time, imageType))
      setAnimationFrames(generateAnimationFrames(time, imageType, animationDuration))
      setImageError(false)
    }

    updateImage()
    
    // Refresh every 5 minutes
    const interval = setInterval(updateImage, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [imageType, animationDuration, getLatestImageTime, buildImageUrl, generateAnimationFrames])

  // Animation loop - speed varies with duration to keep total time reasonable
  useEffect(() => {
    if (!isAnimating || animationFrames.length === 0) return

    // Longer animations play faster per frame
    const frameDelay = animationDuration <= 6 ? 150 : animationDuration <= 12 ? 100 : 80

    const interval = setInterval(() => {
      setAnimationIndex(prev => (prev + 1) % animationFrames.length)
    }, frameDelay)

    return () => clearInterval(interval)
  }, [isAnimating, animationFrames.length, animationDuration])

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--'
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC'
    }) + ' UTC'
  }

  const displayUrl = isAnimating ? animationFrames[animationIndex] : imageUrl

  // Handle image type change - fall back to True Color if band doesn't work
  const handleImageTypeChange = (type: ImageTypeKey) => {
    setImageType(type)
    setIsAnimating(false)
    setImageError(false)
  }

  return (
    <div className="aspect-square w-full h-full max-w-full max-h-full bg-[#0a0a12] flex flex-col">
      {/* Image viewport - Earth disc */}
      <div className="flex-1 relative flex items-center justify-center p-3 min-h-0">
        {/* Circular frame for Earth */}
        <div className="relative aspect-square h-full max-h-full max-w-full">
          {/* Subtle outer glow */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: '0 0 40px rgba(100, 150, 255, 0.15), inset 0 0 20px rgba(0,0,0,0.5)'
            }}
          />
          
          {/* Earth image */}
          <div className="absolute inset-[2%] rounded-full overflow-hidden bg-[#0a0a12]">
            {displayUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayUrl}
                alt="Himawari-8 Pacific view"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            )}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-xs">
                Image unavailable
              </div>
            )}
          </div>

          {/* Subtle atmospheric edge glow */}
          <div 
            className="absolute inset-[2%] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, transparent 85%, rgba(100, 180, 255, 0.1) 95%, rgba(50, 100, 200, 0.2) 100%)'
            }}
          />
        </div>
      </div>

      {/* Controls bar */}
      <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between shrink-0">
        {/* Left: Image type selector */}
        <div className="flex gap-1 flex-wrap">
          {Object.entries(IMAGE_TYPES).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => handleImageTypeChange(key as ImageTypeKey)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                imageType === key
                  ? 'bg-white/20 text-white'
                  : 'text-neutral-500 hover:text-white hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right: Animation controls + Timestamp */}
        <div className="flex items-center gap-2">
          {/* Animation duration selector */}
          <div className="flex items-center gap-1">
            {ANIMATION_DURATIONS.map((hours) => (
              <button
                key={hours}
                onClick={() => {
                  setAnimationDuration(hours)
                  if (!isAnimating) {
                    setIsAnimating(true)
                  }
                  setAnimationIndex(0)
                }}
                className={`px-1.5 py-1 text-xs rounded transition-colors ${
                  isAnimating && animationDuration === hours
                    ? 'bg-blue-500/30 text-blue-300'
                    : 'text-neutral-500 hover:text-white hover:bg-white/10'
                }`}
              >
                {hours}h
              </button>
            ))}
            {isAnimating && (
              <button
                onClick={() => setIsAnimating(false)}
                className="px-1.5 py-1 text-xs rounded bg-white/10 text-white hover:bg-white/20"
              >
                ■
              </button>
            )}
          </div>

          {/* Timestamp */}
          <div className="text-xs text-neutral-500 font-mono ml-2">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>
    </div>
  )
}