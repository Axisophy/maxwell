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
    normal: 'text-black',
    elevated: 'text-amber-600',
    warning: 'text-orange-600',
    critical: 'text-red-600',
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 text-center animate-pulse">
        <div className="h-14 md:h-20 bg-black/5 rounded mb-3 mx-auto w-28 md:w-36" />
        <div className="h-4 bg-black/5 rounded mx-auto w-20 md:w-24" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="block p-5 md:p-8 text-center hover:bg-white rounded-xl transition-colors group"
    >
      {/* Primary number */}
      <div className={`
        text-4xl md:text-5xl lg:text-6xl font-light font-mono tracking-tight tabular-nums
        ${statusColors[status]}
      `}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>

      {/* Unit / label */}
      <div className="text-sm md:text-base text-black/50 uppercase tracking-wider mt-2">
        {unit}
      </div>

      {/* Context */}
      {context && (
        <div className="text-xs md:text-sm text-black/40 mt-1">
          {context}
        </div>
      )}

      {/* Hover indicator */}
      <div className="text-xs text-black/30 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        Explore →
      </div>
    </Link>
  )
}
