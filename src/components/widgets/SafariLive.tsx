'use client'

import { useState, useEffect } from 'react'

// African wildlife feeds from Explore.org / Africam
const FEEDS = {
  wateringHole: {
    label: 'Watering Hole',
    location: 'Mpala Research Centre',
    region: 'Laikipia, Kenya',
    videoId: 'ydYDqZQpim8',
    lat: '0.29°N',
    lon: '36.90°E',
  },
  river: {
    label: 'River',
    location: 'Mpala Research Centre',
    region: 'Laikipia, Kenya',
    videoId: 'gDmc5ySvKHg',
    lat: '0.29°N',
    lon: '36.90°E',
  },
  tau: {
    label: 'Tau Waterhole',
    location: 'Madikwe Game Reserve',
    region: 'South Africa',
    videoId: 'AxMpKrVMpMo',
    lat: '24.75°S',
    lon: '26.27°E',
  },
} as const

type FeedKey = keyof typeof FEEDS

export default function SafariLive() {
  const [activeFeed, setActiveFeed] = useState<FeedKey>('wateringHole')
  const [currentTime, setCurrentTime] = useState<string>('')
  const feed = FEEDS[activeFeed]

  // Update time for the location
  useEffect(() => {
    const updateTime = () => {
      const timezone = activeFeed === 'tau' ? 'Africa/Johannesburg' : 'Africa/Nairobi'
      const time = new Date().toLocaleTimeString('en-GB', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
      })
      setCurrentTime(time)
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [activeFeed])

  return (
    <div className="aspect-square w-full h-full flex flex-col bg-[#bfb5a0]">
      
      {/* Video viewport */}
      <div className="flex-1 m-3 mb-2 relative overflow-hidden rounded-lg">
        {/* Video embed */}
        <iframe
          src={`https://www.youtube.com/embed/${feed.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1`}
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />

        {/* Live indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
          <div className="w-1.5 h-1.5 rounded-full bg-status-live animate-pulse" />
          <span className="text-[10px] font-sans font-medium text-white tracking-wider">
            LIVE
          </span>
        </div>

        {/* Location info */}
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1.5 rounded">
          <p className="text-xs font-sans font-medium text-white">
            {feed.location}
          </p>
          <p className="text-[10px] font-sans text-white/70 mt-0.5">
            {feed.region} · {currentTime}
          </p>
        </div>

        {/* Coordinates */}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
          <span className="text-[10px] font-mono text-white/70">
            {feed.lat} {feed.lon}
          </span>
        </div>
      </div>

      {/* Control panel */}
      <div className="px-3 pb-3 pt-1">
        <div className="flex items-center justify-center gap-2">
          {Object.entries(FEEDS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setActiveFeed(key as FeedKey)}
              className={`
                px-4 py-2 rounded-lg text-xs font-sans font-medium
                transition-all duration-150
                ${activeFeed === key 
                  ? 'bg-text-primary text-white' 
                  : 'bg-white/50 text-text-primary hover:bg-white/70'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}