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
      {/* Label - above the number */}
      <div className="text-xs md:text-sm text-white/50 uppercase tracking-wide mb-2">
        Humans
      </div>

      {/* Primary number */}
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] tabular-nums text-white">
        {formatted}
      </div>
    </Link>
  )
}
