'use client'

import { useState, useEffect } from 'react'

// African wildlife feeds
const FEEDS = {
  wateringHole: {
    label: 'Watering hole',
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
    label: 'Tau waterhole',
    location: 'Madikwe Game Reserve',
    region: 'South Africa',
    videoId: 'AxMpKrVMpMo',
    lat: '24.75°S',
    lon: '26.27°E',
  },
} as const

type FeedKey = keyof typeof FEEDS

// Info icon
function InfoIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

// Expand icon
function ExpandIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}

interface SafariLiveProps {
  onExpand?: () => void
}

export default function SafariLive({ onExpand }: SafariLiveProps) {
  const [activeFeed, setActiveFeed] = useState<FeedKey>('wateringHole')
  const [currentTime, setCurrentTime] = useState<string>('')
  const [showInfo, setShowInfo] = useState(false)
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
    <div 
      className="w-full flex flex-col"
      style={{ 
        fontSize: 'calc(100cqw / 25)', // Scale factor: 400px / 25 = 16px base
        containerType: 'inline-size'
      }}
    >
      {/* Title bar - separate box */}
      <div 
        className="flex items-center justify-between bg-[#d9d9d9]"
        style={{
          padding: '0.75em 1em',
          borderRadius: '0.75em',
          marginBottom: '0.5em',
        }}
      >
        <span 
          className="font-sans text-black"
          style={{ fontSize: '1.25em', fontWeight: 400 }}
        >
          Safari Live
        </span>
        <div className="flex items-center" style={{ gap: '0.5em' }}>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`transition-colors ${showInfo ? 'text-black' : 'text-black/50 hover:text-black'}`}
            aria-label={showInfo ? 'Hide info' : 'Show info'}
          >
            <InfoIcon style={{ width: '1em', height: '1em' }} />
          </button>
          <button
            onClick={onExpand}
            className="text-black/50 hover:text-black transition-colors"
            aria-label="Expand"
          >
            <ExpandIcon style={{ width: '1em', height: '1em' }} />
          </button>
        </div>
      </div>

      {/* Info dropdown */}
      {showInfo && (
        <div 
          className="bg-[#d9d9d9] text-black"
          style={{
            padding: '1em',
            borderRadius: '0.75em',
            marginBottom: '0.5em',
            fontSize: '0.875em',
          }}
        >
          <p style={{ marginBottom: '0.5em' }}>
            Live wildlife cameras from African research centres and game reserves.
          </p>
          <p className="text-black/60" style={{ fontSize: '0.85em' }}>
            Source: Explore.org / Africam
          </p>
        </div>
      )}

      {/* Main widget */}
      <div 
        className="bg-[#BFE6B5] flex flex-col"
        style={{
          borderRadius: '0.75em',
          padding: '1em',
        }}
      >
        {/* Video area */}
        <div 
          className="relative overflow-hidden bg-black"
          style={{
            aspectRatio: '16 / 9',
            borderRadius: '0.5em',
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${feed.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1`}
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>

        {/* Bottom section: info panel + buttons */}
        <div 
          className="flex"
          style={{ 
            marginTop: '0.75em',
            gap: '0.75em',
          }}
        >
          {/* Info panel */}
          <div 
            className="flex-1 bg-[#4d4d4d] text-white flex flex-col justify-between"
            style={{
              borderRadius: '0.5em',
              padding: '0.875em',
            }}
          >
            <div>
              <span 
                className="font-sans uppercase tracking-wider text-white/60"
                style={{ fontSize: '0.625em' }}
              >
                Location:
              </span>
              <p 
                className="font-sans font-medium text-white"
                style={{ fontSize: '1.125em', marginTop: '0.125em' }}
              >
                {feed.location}
              </p>
            </div>
            <div className="flex items-end justify-between" style={{ marginTop: '1em' }}>
              <div>
                <p 
                  className="font-sans text-white/60"
                  style={{ fontSize: '0.75em' }}
                >
                  {feed.region} · {currentTime}
                </p>
                <p 
                  className="font-mono text-white/60"
                  style={{ fontSize: '0.75em', marginTop: '0.125em' }}
                >
                  {feed.lat} {feed.lon}
                </p>
              </div>
              <div className="flex items-center" style={{ gap: '0.375em' }}>
                <div 
                  className="rounded-full bg-[#22c55e]"
                  style={{ width: '0.5em', height: '0.5em' }}
                />
                <span 
                  className="font-sans font-medium text-white"
                  style={{ fontSize: '0.75em' }}
                >
                  LIVE
                </span>
              </div>
            </div>
          </div>

          {/* Buttons - stacked vertically */}
          <div 
            className="flex flex-col"
            style={{ gap: '0.5em' }}
          >
            {Object.entries(FEEDS).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setActiveFeed(key as FeedKey)}
                className="font-sans font-medium text-white transition-colors"
                style={{
                  backgroundColor: activeFeed === key ? '#73966A' : '#9bbe92',
                  padding: '0.625em 1.25em',
                  borderRadius: '0.5em',
                  fontSize: '0.875em',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}