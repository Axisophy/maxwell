'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PopulationCounterProps {
  baseCount: number
  growthPerSecond?: number // ~2.5 people per second globally
  href: string
}

export default function PopulationCounter({
  baseCount,
  growthPerSecond = 2.5,
  href
}: PopulationCounterProps) {
  const [count, setCount] = useState(baseCount)

  useEffect(() => {
    setCount(baseCount)

    const interval = setInterval(() => {
      setCount(c => c + growthPerSecond)
    }, 1000)

    return () => clearInterval(interval)
  }, [baseCount, growthPerSecond])

  // Format with thousands separators
  const formatted = Math.floor(count).toLocaleString()

  return (
    <Link
      href={href}
      className="block p-5 md:p-8 text-center hover:bg-white rounded-xl transition-colors group"
    >
      {/* Primary number - slightly smaller due to length */}
      <div className="text-3xl md:text-4xl lg:text-5xl font-light font-mono tracking-tight tabular-nums text-black">
        {formatted}
      </div>

      {/* Unit / label */}
      <div className="text-sm md:text-base text-black/50 uppercase tracking-wider mt-2">
        humans
      </div>

      {/* Context */}
      <div className="text-xs md:text-sm text-black/40 mt-1">
        and counting
      </div>

      {/* Hover indicator */}
      <div className="text-xs text-black/30 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        Explore →
      </div>
    </Link>
  )
}
