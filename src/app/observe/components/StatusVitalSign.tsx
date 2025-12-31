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
        <div className="h-10 md:h-12 bg-white/10 rounded mb-3 mx-auto w-32 md:w-40" />
        <div className="h-4 bg-white/10 rounded mx-auto w-16 md:w-20" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="block p-4 text-center bg-black rounded-lg hover:bg-neutral-900 transition-colors"
    >
      {/* Status text */}
      <div className={`
        text-2xl md:text-3xl lg:text-4xl font-light tracking-tight uppercase
        ${colors[statusColor]}
      `}>
        {status}
      </div>

      {/* Label */}
      <div className="text-xs md:text-sm text-white/50 uppercase mb-2">
        {label}
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
