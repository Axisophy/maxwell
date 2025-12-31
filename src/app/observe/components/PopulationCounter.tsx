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
      className="block p-2 md:p-4 text-left bg-black rounded-lg hover:bg-neutral-900 transition-colors"
    >
      {/* Label - above the number */}
      <div className="text-[10px] md:text-xs text-white/50 uppercase mb-1 md:mb-2">
        Humans
      </div>

      {/* Primary number */}
      <div className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] tabular-nums text-white">
        {formatted}
      </div>
    </Link>
  )
}
