'use client'

import Link from 'next/link'

interface VitalSignProps {
  value: string | number
  label: string
  href: string
  status?: 'normal' | 'elevated' | 'warning' | 'critical'
  loading?: boolean
}

export default function VitalSign({
  value,
  label,
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
      <div className="p-2 md:p-4 bg-black rounded-lg animate-pulse">
        <div className="h-3 md:h-4 bg-white/10 rounded w-16 md:w-24 mb-1 md:mb-2" />
        <div className="h-8 md:h-20 bg-white/10 rounded w-20 md:w-36" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="block p-2 md:p-4 text-left bg-black rounded-lg hover:bg-neutral-900 transition-colors"
    >
      {/* Label - above the number */}
      <div className="text-[10px] md:text-xs text-white/50 uppercase mb-1 md:mb-2">
        {label}
      </div>

      {/* Primary number */}
      <div className={`
        text-2xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] tabular-nums
        ${statusColors[status]}
      `}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </Link>
  )
}
