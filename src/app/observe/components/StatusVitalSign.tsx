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
      <div className="p-4 bg-black rounded-lg animate-pulse">
        <div className="h-4 bg-white/10 rounded mx-auto w-20 md:w-24 mb-2" />
        <div className="h-14 md:h-20 bg-white/10 rounded mx-auto w-28 md:w-36" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="block p-4 text-center bg-black rounded-lg hover:bg-neutral-900 transition-colors"
    >
      {/* Label - above the status */}
      <div className="text-xs md:text-sm text-white/50 uppercase tracking-wide mb-2">
        {label}{context ? ` · ${context}` : ''}
      </div>

      {/* Status text */}
      <div className={`
        text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] tabular-nums uppercase
        ${colors[statusColor]}
      `}>
        {status}
      </div>
    </Link>
  )
}
