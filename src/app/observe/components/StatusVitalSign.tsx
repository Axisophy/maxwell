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
    green: 'text-emerald-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
    neutral: 'text-black',
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 text-center animate-pulse">
        <div className="h-10 md:h-12 bg-black/5 rounded mb-3 mx-auto w-32 md:w-40" />
        <div className="h-4 bg-black/5 rounded mx-auto w-16 md:w-20" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="block p-5 md:p-8 text-center hover:bg-white rounded-xl transition-colors group"
    >
      {/* Status text */}
      <div className={`
        text-2xl md:text-3xl lg:text-4xl font-light tracking-tight uppercase
        ${colors[statusColor]}
      `}>
        {status}
      </div>

      {/* Label */}
      <div className="text-sm md:text-base text-black/50 uppercase tracking-wider mt-2">
        {label}
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
