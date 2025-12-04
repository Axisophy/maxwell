'use client'

import { useState } from 'react'

// Available deep sea feeds
const FEEDS = {
  reef: {
    label: 'REEF',
    location: 'Aquarium of the Pacific',
    depth: '~5m',
    videoId: 'DHUnz4dyb54',
    lat: '33.8°N',
    lon: '118.2°W',
  },
  cavern: {
    label: 'CAVERN',
    location: 'Blue Cavern',
    depth: '~10m',
    videoId: 'yuhnCtTPtZo',
    lat: '33.8°N',
    lon: '118.2°W',
  },
} as const

type FeedKey = keyof typeof FEEDS

export default function DeepSeaLive() {
  const [activeFeed, setActiveFeed] = useState<FeedKey>('reef')
  const feed = FEEDS[activeFeed]

  return (
    <div className="aspect-video w-full h-full max-w-full max-h-full bg-[#0a0a0f] flex flex-col">
      {/* Viewport - takes up most of the space */}
      <div className="flex-1 relative min-h-0">
        {/* Video embed */}
        <iframe
          src={`https://www.youtube.com/embed/${feed.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        
        {/* Glass/depth overlay effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 50%, rgba(0, 20, 40, 0.4) 100%),
              linear-gradient(to bottom, transparent 80%, rgba(0, 10, 20, 0.5) 100%)
            `,
            boxShadow: 'inset 0 0 60px rgba(0, 30, 60, 0.5)',
          }}
        />

        {/* Subtle scanlines */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
          }}
        />

        {/* Top-left status indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-mono text-red-500/80 tracking-wider">REC</span>
        </div>

        {/* Depth overlay - top right */}
        <div className="absolute top-3 right-3 text-right font-mono">
          <div className="text-[10px] text-cyan-400/60 tracking-wider">DEPTH</div>
          <div className="text-lg text-cyan-400/90 tracking-wide">{feed.depth}</div>
        </div>
      </div>

      {/* Control Panel - inside the aspect ratio */}
      <div className="h-24 bg-[#1a1a1e] border-t-2 border-[#2a2a2e] relative shrink-0">
        {/* Panel screws */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#2a2a2e] shadow-inner" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2a2a2e] shadow-inner" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#2a2a2e] shadow-inner" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#2a2a2e] shadow-inner" />

        <div className="h-full px-4 py-2 flex items-center justify-between">
          
          {/* Left section - Feed selector */}
          <div className="flex flex-col gap-1">
            <div className="text-[8px] text-amber-500/70 tracking-[0.2em] font-mono">FEED SELECT</div>
            <div className="flex gap-2">
              {Object.entries(FEEDS).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setActiveFeed(key as FeedKey)}
                  className="relative group"
                >
                  {/* Toggle switch housing */}
                  <div className={`
                    w-12 h-7 rounded-sm 
                    bg-[#0d0d0f] 
                    border-2 border-[#2a2a2e]
                    shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]
                    flex items-center justify-center
                    transition-all duration-150
                    ${activeFeed === key ? 'border-amber-600/50' : ''}
                  `}>
                    {/* Toggle switch */}
                    <div className={`
                      w-8 h-4 rounded-sm relative
                      bg-gradient-to-b from-[#3a3a3e] to-[#2a2a2e]
                      shadow-[0_2px_4px_rgba(0,0,0,0.3)]
                      transition-all duration-150
                      ${activeFeed === key ? 'translate-y-[-1px]' : 'translate-y-[1px]'}
                    `}>
                      {/* Indicator light */}
                      <div className={`
                        absolute -top-1 left-1/2 -translate-x-1/2
                        w-1.5 h-1.5 rounded-full
                        transition-all duration-150
                        ${activeFeed === key 
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' 
                          : 'bg-[#2a2a2e]'
                        }
                      `} />
                    </div>
                  </div>
                  {/* Label */}
                  <div className={`
                    text-[7px] font-mono tracking-wider text-center mt-0.5
                    transition-colors duration-150
                    ${activeFeed === key ? 'text-amber-400' : 'text-neutral-500'}
                  `}>
                    {label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center section - Depth gauge */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-[8px] text-amber-500/70 tracking-[0.2em] font-mono">PRESSURE</div>
            <div className="relative w-14 h-8">
              {/* Gauge background */}
              <svg viewBox="0 0 64 40" className="w-full h-full">
                {/* Gauge arc background */}
                <path
                  d="M 8 36 A 28 28 0 0 1 56 36"
                  fill="none"
                  stroke="#2a2a2e"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Gauge arc filled */}
                <path
                  d="M 8 36 A 28 28 0 0 1 56 36"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="88"
                  strokeDashoffset="44"
                />
                {/* Tick marks */}
                <line x1="10" y1="32" x2="14" y2="28" stroke="#3a3a3e" strokeWidth="1" />
                <line x1="32" y1="10" x2="32" y2="16" stroke="#3a3a3e" strokeWidth="1" />
                <line x1="54" y1="32" x2="50" y2="28" stroke="#3a3a3e" strokeWidth="1" />
                {/* Needle */}
                <line 
                  x1="32" y1="36" x2="20" y2="20" 
                  stroke="#ff6b35" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                {/* Needle center */}
                <circle cx="32" cy="36" r="3" fill="#ff6b35" />
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="text-[7px] font-mono text-amber-400/80">ATM</div>
          </div>

          {/* Right section - Location & Status */}
          <div className="flex flex-col items-end gap-1">
            <div className="text-[8px] text-amber-500/70 tracking-[0.2em] font-mono">LOCATION</div>
            <div className="font-mono text-right">
              <div className="text-[10px] text-green-400/90 tracking-wide">{feed.location.toUpperCase()}</div>
              <div className="text-[9px] text-green-400/60">
                {feed.lat} {feed.lon}
              </div>
            </div>
            
            {/* Status lights */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                <span className="text-[7px] font-mono text-neutral-500">PWR</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                <span className="text-[7px] font-mono text-neutral-500">SIG</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                <span className="text-[7px] font-mono text-neutral-500">LIVE</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}