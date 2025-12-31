'use client'

import Link from 'next/link'

interface VitalSignProps {
  value: string | number
  unit: string
  context?: string
  href: string
  status?: 'normal' | 'elevated' | 'warning' | 'critical'
  loading?: boolean
}

export default function VitalSign({
  value,
  unit,
  context,
  href,
  status = 'normal',
  loading = false
}: VitalSignProps) {

  const statusColors = {
    normal: 'text-white',
    elevated: 'text-amber-400',
    warning: 'text-orange-400',
    critical: 'text-red-400',
  }

  if (loading) {
    return (
      <div className="p-4 bg-black rounded-lg animate-pulse">
        <div className="h-14 md:h-20 bg-white/10 rounded mb-3 mx-auto w-28 md:w-36" />
        <div className="h-4 bg-white/10 rounded mx-auto w-20 md:w-24" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="block p-4 text-center bg-black rounded-lg hover:bg-neutral-900 transition-colors"
    >
      {/* Primary number */}
      <div className={`
        text-4xl md:text-5xl lg:text-6xl font-light font-mono tracking-tight tabular-nums
        ${statusColors[status]}
      `}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>

      {/* Unit / label */}
      <div className="text-xs md:text-sm text-white/50 uppercase mb-2">
        {unit}
      </div>

      {/* Context */}
      {context && (
        <div className="text-xs md:text-sm text-white/40 mt-1">
          {context}
        </div>
      )}
    </Link>
  )
}
