'use client'

import { useState, useEffect } from 'react'

// African wildlife feeds from Explore.org / Africam
// NOTE: YouTube video IDs are dynamic and may need periodic updates
// To find current IDs: Visit explore.org/livecams/african-wildlife, 
// inspect the YouTube embed, or check their YouTube channel
const FEEDS = {
  wateringHole: {
    label: 'Watering Hole',
    sublabel: 'Hippo Pool',
    location: 'Mpala Research Centre',
    region: 'Laikipia, Kenya',
    videoId: 'ydYDqZQpim8', // May need updating
    lat: '0.29°N',
    lon: '36.90°E',
  },
  river: {
    label: 'River',
    sublabel: 'Ewaso Ng\'iro',
    location: 'Mpala Research Centre',
    region: 'Laikipia, Kenya',
    videoId: 'gDmc5ySvKHg', // May need updating
    lat: '0.29°N',
    lon: '36.90°E',
  },
  tau: {
    label: 'Tau',
    sublabel: 'Waterhole',
    location: 'Madikwe Game Reserve',
    region: 'North West, South Africa',
    videoId: 'AxMpKrVMpMo', // May need updating - Africam feed
    lat: '24.75°S',
    lon: '26.27°E',
  },
} as const

type FeedKey = keyof typeof FEEDS

export default function SafariLive() {
  const [activeFeed, setActiveFeed] = useState<FeedKey>('wateringHole')
  const [currentTime, setCurrentTime] = useState<string>('')
  const feed = FEEDS[activeFeed]

  // Update time for the location (East African Time for Kenya, CAT for South Africa)
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
        className="aspect-square w-full h-full flex flex-col relative"
        style={{
        background: 'linear-gradient(180deg, #e8e0c8 0%, #d8cfb5 100%)',
        }}
    >
      {/* Canvas texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h6v6H0z' fill='none'/%3E%3Cpath d='M0 0h1v1H0zM2 2h1v1H2zM4 4h1v1H4zM1 3h1v1H1zM3 5h1v1H3zM5 1h1v1H5z' fill='%23000'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top header strip */}
      <div className="px-4 pt-3 pb-2 relative z-10">
        <div className="flex items-baseline justify-between">
          <h3 
            className="text-sm tracking-wide"
            style={{ 
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: '#5c5040',
              fontWeight: 400,
            }}
          >
            {feed.location}
          </h3>
          <span 
            className="text-xs"
            style={{ 
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: '#7a7060',
            }}
          >
            {currentTime} local
          </span>
        </div>
        <p 
          className="text-xs mt-0.5"
          style={{ 
            fontFamily: 'Georgia, "Times New Roman", serif',
            color: '#8a8070',
            fontStyle: 'italic',
          }}
        >
          {feed.region}
        </p>
      </div>

      {/* Video viewport - rectangular within the square */}
      <div className="flex-1 px-4 pb-2 min-h-0 relative z-10">
        <div 
          className="w-full h-full relative overflow-hidden"
          style={{
            borderRadius: '3px',
            boxShadow: `
              inset 0 2px 4px rgba(0,0,0,0.2),
              0 1px 0 rgba(255,255,255,0.3),
              0 4px 8px rgba(0,0,0,0.15)
            `,
            border: '1px solid #a09080',
          }}
        >
          {/* Video embed */}
          <iframe
            src={`https://www.youtube.com/embed/${feed.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1`}
            className="absolute inset-0 w-full h-full"
            style={{ 
              border: 'none',
              background: '#1a1a1a',
            }}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />

          {/* Subtle vignette */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.15)',
            }}
          />

          {/* Live indicator */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span 
              className="text-[10px] text-white/90 tracking-wider"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              LIVE
            </span>
          </div>

          {/* Coordinates overlay */}
          <div 
            className="absolute bottom-2 right-2 text-right bg-black/40 px-2 py-1 rounded"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <div className="text-[9px] text-white/70">
              {feed.lat} · {feed.lon}
            </div>
          </div>
        </div>
      </div>

      {/* Control panel - brass/leather aesthetic */}
      <div 
        className="px-4 pb-4 pt-2 relative z-10"
      >
        {/* Feed selector buttons */}
        <div className="flex items-center justify-center gap-3">
          {Object.entries(FEEDS).map(([key, { label, sublabel }]) => (
            <button
              key={key}
              onClick={() => setActiveFeed(key as FeedKey)}
              className="group relative"
            >
              {/* Button body - brass/leather look */}
              <div 
                className={`
                  px-4 py-2 rounded-sm relative overflow-hidden
                  transition-all duration-150
                  ${activeFeed === key 
                    ? 'translate-y-[1px]' 
                    : 'hover:translate-y-[0.5px]'
                  }
                `}
                style={{
                  background: activeFeed === key
                    ? 'linear-gradient(180deg, #8b7355 0%, #6b5540 100%)'
                    : 'linear-gradient(180deg, #a08b70 0%, #8a7560 100%)',
                  boxShadow: activeFeed === key
                    ? 'inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 1px rgba(255,255,255,0.2)'
                    : '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                  border: '1px solid #5a4a35',
                }}
              >
                {/* Leather texture hint */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h4v4H0z' fill='none'/%3E%3Ccircle cx='2' cy='2' r='0.5' fill='%23000'/%3E%3C/svg%3E")`,
                  }}
                />
                
                {/* Button text */}
                <div className="relative">
                  <span 
                    className="text-xs tracking-wide block"
                    style={{ 
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      color: activeFeed === key ? '#f5f0e5' : '#f0ebe0',
                      textShadow: '0 1px 1px rgba(0,0,0,0.3)',
                      fontWeight: 400,
                    }}
                  >
                    {label}
                  </span>
                  <span 
                    className="text-[9px] block mt-0.5"
                    style={{ 
                      fontFamily: 'Georgia, serif',
                      color: activeFeed === key ? '#d0c8b8' : '#c8c0b0',
                      fontStyle: 'italic',
                    }}
                  >
                    {sublabel}
                  </span>
                </div>

                {/* Brass corner accents */}
                <div 
                  className="absolute top-0.5 left-0.5 w-1.5 h-1.5"
                  style={{
                    borderTop: '1px solid rgba(255,220,150,0.3)',
                    borderLeft: '1px solid rgba(255,220,150,0.3)',
                  }}
                />
                <div 
                  className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5"
                  style={{
                    borderBottom: '1px solid rgba(0,0,0,0.2)',
                    borderRight: '1px solid rgba(0,0,0,0.2)',
                  }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Brass plate label at bottom */}
        <div className="mt-3 flex justify-center">
          <div 
            className="px-4 py-1 rounded-sm"
            style={{
              background: 'linear-gradient(180deg, #c9b896 0%, #a89878 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.2)',
              border: '1px solid #8a7a60',
            }}
          >
            <span 
              className="text-[10px] tracking-[0.15em]"
              style={{ 
                fontFamily: 'Georgia, "Times New Roman", serif',
                color: '#4a4030',
                fontWeight: 400,
              }}
            >
              AFRICAN WILDLIFE · LIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}