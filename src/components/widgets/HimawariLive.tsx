'use client'

import { useState, useEffect, useCallback } from 'react'

const IMAGE_TYPES = {
  'D531106': { label: 'True Color', description: 'Visible RGB composite' },
  'INFRARED_FULL': { label: 'Infrared', description: 'Thermal IR' },
} as const

type ImageTypeKey = keyof typeof IMAGE_TYPES

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

  const getLatestImageTime = useCallback(() => {
    const now = new Date()
    now.setMinutes(Math.floor((now.getMinutes() - 30) / 10) * 10)
    now.setSeconds(0)
    now.setMilliseconds(0)
    return now
  }, [])

  const buildImageUrl = useCallback((time: Date, type: ImageTypeKey) => {
    const year = time.getUTCFullYear()
    const month = String(time.getUTCMonth() + 1).padStart(2, '0')
    const day = String(time.getUTCDate()).padStart(2, '0')
    const hour = String(time.getUTCHours()).padStart(2, '0')
    const minute = String(time.getUTCMinutes()).padStart(2, '0')
    return `https://himawari8.nict.go.jp/img/${type}/1d/550/${year}/${month}/${day}/${hour}${minute}00_0_0.png`
  }, [])

  const generateAnimationFrames = useCallback((latestTime: Date, type: ImageTypeKey, durationHours: number) => {
    const frames: string[] = []
    const frameCount = durationHours * 6
    for (let i = frameCount - 1; i >= 0; i--) {
      const frameTime = new Date(latestTime.getTime() - i * 10 * 60 * 1000)
      frames.push(buildImageUrl(frameTime, type))
    }
    return frames
  }, [buildImageUrl])

  useEffect(() => {
    const updateImage = () => {
      const time = getLatestImageTime()
      setCurrentTime(time)
      setImageUrl(buildImageUrl(time, imageType))
      setAnimationFrames(generateAnimationFrames(time, imageType, animationDuration))
      setImageError(false)
    }
    updateImage()
    const interval = setInterval(updateImage, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [imageType, animationDuration, getLatestImageTime, buildImageUrl, generateAnimationFrames])

  useEffect(() => {
    if (!isAnimating || animationFrames.length === 0) return
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

  const handleImageTypeChange = (type: ImageTypeKey) => {
    setImageType(type)
    setIsAnimating(false)
    setImageError(false)
  }

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

            {/* Atmospheric edge glow */}
            <div 
              className="absolute inset-[2%] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, transparent 85%, rgba(100, 180, 255, 0.1) 95%, rgba(50, 100, 200, 0.2) 100%)'
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
          <div 
            className="flex p-1 rounded-lg"
            style={{ backgroundColor: '#e5e5e5' }}
          >
            {Object.entries(IMAGE_TYPES).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => handleImageTypeChange(key as ImageTypeKey)}
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
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
          <div 
            className="flex p-1 rounded-lg"
            style={{ backgroundColor: '#e5e5e5' }}
          >
            {ANIMATION_DURATIONS.map((hours) => (
              <button
                key={hours}
                onClick={() => {
                  setAnimationDuration(hours)
                  if (!isAnimating) setIsAnimating(true)
                  setAnimationIndex(0)
                }}
                className="px-2 py-1 text-xs font-medium rounded-md transition-colors"
                style={{
                  backgroundColor: isAnimating && animationDuration === hours ? '#000000' : 'transparent',
                  color: isAnimating && animationDuration === hours ? '#ffffff' : 'rgba(0,0,0,0.5)',
                }}
              >
                {hours}h
              </button>
            ))}
            {isAnimating && (
              <button
                onClick={() => setIsAnimating(false)}
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
            {IMAGE_TYPES[imageType].description}
          </span>
          <span className="text-xs font-mono text-text-muted">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </div>
  )
}