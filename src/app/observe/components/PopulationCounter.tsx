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
      className="block p-4 text-center bg-black rounded-lg hover:bg-neutral-900 transition-colors"
    >
      {/* Primary number - slightly smaller due to length */}
      <div className="text-3xl md:text-4xl lg:text-5xl font-light font-mono tracking-tight tabular-nums text-white">
        {formatted}
      </div>

      {/* Unit / label */}
      <div className="text-xs md:text-sm text-white/50 uppercase mb-2">
        humans
      </div>

      {/* Context */}
      <div className="text-xs md:text-sm text-white/40 mt-1">
        and counting
      </div>
    </Link>
  )
}
