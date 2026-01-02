'use client'

import Link from 'next/link'

interface StatusVitalSignProps {
  status: string
  label: string
  context?: string
  href: string
  statusColor?: 'green' | 'amber' | 'red' | 'neutral'
  loading?: boolean
}

export default function StatusVitalSign({
  status,
  label,
  context,
  href,
  statusColor = 'neutral',
  loading = false
}: StatusVitalSignProps) {

  const colors = {
    green: 'text-emerald-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
    neutral: 'text-white',
  }

  if (loading) {
    return (
      <div className="p-2 md:p-4 bg-black rounded-lg animate-pulse">
        <div className="h-3 md:h-4 bg-white/10 rounded w-16 md:w-24 mb-1 md:mb-2" />
        <div className="h-6 md:h-20 bg-white/10 rounded w-20 md:w-36" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="block p-2 md:p-4 text-left bg-black rounded-lg hover:bg-neutral-900 transition-colors"
    >
      {/* Label - above the status */}
      <div className="text-[9px] md:text-[10px] lg:text-xs text-white/50 uppercase mb-1 md:mb-2">
        {label}{context ? ` · ${context}` : ''}
      </div>

      {/* Status text */}
      <div className={`
        text-base md:text-2xl lg:text-4xl font-bold tracking-[-0.03em] tabular-nums uppercase
        ${colors[statusColor]}
      `}>
        {status}
      </div>
    </Link>
  )
}
