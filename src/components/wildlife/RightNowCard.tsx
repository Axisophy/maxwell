'use client'

import { useState, useEffect } from 'react'
import { RightNowEvent } from '@/lib/wildlife/types'

interface RightNowCardProps {
  events: RightNowEvent[]
  onViewOnMap: (event: RightNowEvent) => void
}

export default function RightNowCard({ events, onViewOnMap }: RightNowCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate through events
  useEffect(() => {
    if (events.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length)
    }, 8000)

    return () => clearInterval(timer)
  }, [events.length])

  if (events.length === 0) return null

  const currentEvent = events[currentIndex]

  return (
    <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-sm rounded-xl p-4 max-w-sm z-[500] shadow-xl">
      <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Right Now</p>
      <h3 className="text-lg font-medium text-white mb-1">{currentEvent.title}</h3>
      <p className="text-sm text-white/60 mb-3 leading-relaxed">{currentEvent.description}</p>

      <div className="flex items-center justify-between">
        <button
          onClick={() => onViewOnMap(currentEvent)}
          className="text-sm text-[#e6007e] hover:underline"
        >
          View on map →
        </button>

        {/* Navigation dots */}
        {events.length > 1 && (
          <div className="flex gap-1.5">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`View event ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Explore Why */}
      {currentEvent.exploreWhy && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Explore Why</p>
          <p className="text-xs text-white/50 leading-relaxed">{currentEvent.exploreWhy}</p>
        </div>
      )}
    </div>
  )
}
