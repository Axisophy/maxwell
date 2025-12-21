'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// DEEP SPACE NETWORK WIDGET
// ===========================================
// Shows which NASA dishes are talking to spacecraft
// Data: NASA DSN Now (eyes.nasa.gov)
// ===========================================

interface DishData {
  name: string
  azimuthAngle: number
  elevationAngle: number
  isActive: boolean
  targets: {
    name: string
    spacecraft: string
  }[]
}

interface StationData {
  id: string
  name: string
  location: string
  dishes: DishData[]
}

interface DSNData {
  timestamp: string
  stations: StationData[]
  activeSpacecraft: string[]
  totalDishes: number
  activeDishes: number
  error?: string
}

// ===========================================
// DISH ICON COMPONENT
// ===========================================

function DishIcon({ 
  isActive, 
  size = 40,
  spacecraft 
}: { 
  isActive: boolean
  size?: number
  spacecraft?: string 
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 40 40" className="w-full h-full">
        {/* Signal waves when transmitting */}
        {isActive && (
          <>
            <path
              d="M 20 8 Q 28 8 28 16"
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.5"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.6;0.2;0.6"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M 20 4 Q 32 4 32 16"
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.5"
              opacity="0.4"
            >
              <animate
                attributeName="opacity"
                values="0.4;0.1;0.4"
                dur="1.5s"
                repeatCount="indefinite"
                begin="0.3s"
              />
            </path>
          </>
        )}
        
        {/* Dish base/pedestal */}
        <rect x="17" y="28" width="6" height="8" fill={isActive ? '#22c55e' : '#9ca3af'} rx="1" />
        
        {/* Dish */}
        <ellipse 
          cx="20" 
          cy="20" 
          rx="14" 
          ry="6" 
          fill="none" 
          stroke={isActive ? '#22c55e' : '#9ca3af'} 
          strokeWidth="2"
          transform="rotate(-30 20 20)"
        />
        
        {/* Feed horn */}
        <circle 
          cx="20" 
          cy="14" 
          r="2" 
          fill={isActive ? '#22c55e' : '#9ca3af'} 
        />
        <line 
          x1="20" y1="16" x2="20" y2="22" 
          stroke={isActive ? '#22c55e' : '#9ca3af'} 
          strokeWidth="1.5" 
        />
      </svg>
      
      {/* Spacecraft label */}
      {spacecraft && isActive && (
        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[0.5em] px-1 rounded font-medium whitespace-nowrap">
          {spacecraft.length > 8 ? spacecraft.substring(0, 8) : spacecraft}
        </div>
      )}
    </div>
  )
}

// ===========================================
// STATION COMPONENT
// ===========================================

function Station({ station }: { station: StationData }) {
  const activeDishes = station.dishes.filter(d => d.isActive)
  const primaryTarget = activeDishes[0]?.targets[0]?.spacecraft
  
  return (
    <div className="text-center">
      {/* Station name */}
      <div className="text-[0.7em] font-medium text-black/60 uppercase tracking-wider mb-1">
        {station.name}
      </div>
      
      {/* Dishes */}
      <div className="flex justify-center gap-1 mb-1">
        {station.dishes.slice(0, 3).map((dish) => (
          <DishIcon 
            key={dish.name}
            isActive={dish.isActive}
            size={32}
            spacecraft={dish.targets[0]?.spacecraft}
          />
        ))}
        {station.dishes.length > 3 && (
          <div className="flex items-center justify-center w-8 h-8 text-[0.6em] text-black/40">
            +{station.dishes.length - 3}
          </div>
        )}
      </div>
      
      {/* Location */}
      <div className="text-[0.6em] text-black/40">
        {station.location}
      </div>
    </div>
  )
}

// ===========================================
// MAIN WIDGET
// ===========================================

export default function DeepSpaceNetwork() {
  const [data, setData] = useState<DSNData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/dsn')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      
      if (result.error) {
        setError(result.error)
      } else {
        setData(result)
        setError(null)
      }
    } catch (err) {
      console.error('DSN fetch error:', err)
      setError('Unable to reach DSN')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Update every 30 seconds
    const interval = setInterval(fetchData, 30 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="p-[1em] flex items-center justify-center h-[16em]">
        <div className="text-center">
          <div className="text-black/40 text-[0.875em]">Contacting Deep Space Network...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !data) {
    return (
      <div className="p-[1em] flex items-center justify-center h-[16em]">
        <div className="text-center">
          <div className="text-red-500 text-[0.875em]">{error}</div>
          <button 
            onClick={fetchData}
            className="mt-2 text-[0.75em] text-black/50 hover:text-black"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  // Get all active spacecraft with unique names
  const activeSpacecraft = data.activeSpacecraft.slice(0, 6)
  
  // Get the most interesting target (Voyager, JWST, etc.)
  const priorityTargets = ['Voyager 1', 'Voyager 2', 'James Webb', 'Perseverance', 'New Horizons', 'Juno']
  const featuredTarget = priorityTargets.find(t => data.activeSpacecraft.includes(t)) || data.activeSpacecraft[0]

  return (
    <div className="p-[1em]">
      {/* Header stat */}
      <div className="text-center mb-[1em]">
        <div className="text-[0.7em] text-black/50 uppercase tracking-wider mb-[0.25em]">
          Active Communications
        </div>
        <div className="flex items-baseline justify-center gap-[0.25em]">
          <span className="font-mono text-[2em] font-bold text-black">
            {data.activeDishes}
          </span>
          <span className="text-[1em] text-black/50">
            / {data.totalDishes} dishes
          </span>
        </div>
      </div>

      {/* Three stations */}
      <div className="grid grid-cols-3 gap-[0.5em] mb-[1em]">
        {data.stations.map((station) => (
          <Station key={station.id} station={station} />
        ))}
        {/* Fill empty slots if less than 3 stations */}
        {data.stations.length < 3 && Array(3 - data.stations.length).fill(0).map((_, i) => (
          <div key={`empty-${i}`} className="text-center opacity-30">
            <div className="text-[0.7em] font-medium text-black/60 uppercase tracking-wider mb-1">
              -
            </div>
            <div className="flex justify-center">
              <DishIcon isActive={false} size={32} />
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5] my-[0.75em]" />

      {/* Active spacecraft list */}
      {activeSpacecraft.length > 0 && (
        <div>
          <div className="text-[0.7em] text-black/50 uppercase tracking-wider mb-[0.5em]">
            Now Communicating With
          </div>
          <div className="flex flex-wrap gap-[0.375em]">
            {activeSpacecraft.map((spacecraft) => (
              <span 
                key={spacecraft}
                className={`
                  text-[0.75em] px-[0.5em] py-[0.125em] rounded-full
                  ${spacecraft === featuredTarget 
                    ? 'bg-green-100 text-green-700 font-medium' 
                    : 'bg-black/5 text-black/70'
                  }
                `}
              >
                {spacecraft}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Featured callout for Voyager */}
      {(featuredTarget === 'Voyager 1' || featuredTarget === 'Voyager 2') && (
        <div className="mt-[0.75em] p-[0.5em] bg-black/5 rounded-[0.5em]">
          <div className="text-[0.7em] text-black/70">
            <span className="font-medium">{featuredTarget}</span> is {featuredTarget === 'Voyager 1' ? '24.5' : '20.5'} billion km away.
            <span className="text-black/50"> Signal travel time: {featuredTarget === 'Voyager 1' ? '22h 47m' : '19h 2m'}</span>
          </div>
        </div>
      )}

      {/* Update time */}
      <div className="mt-[0.75em] text-[0.625em] text-black/30 text-center">
        Updated {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
      </div>
    </div>
  )
}
