'use client'

import { ReactNode } from 'react'

export interface StatusItem {
  label: string
  value: string | number
  unit?: string
  color?: 'default' | 'emerald' | 'amber' | 'orange' | 'red' | 'cyan' | 'purple'
  note?: string
}

export interface StatusBadge {
  label: string
  status: 'quiet' | 'active' | 'warning' | 'alert' | 'critical'
}

interface StatusBarProps {
  items: StatusItem[]
  badge?: StatusBadge
  theme?: 'light' | 'dark'
  loading?: boolean
  loadingText?: string
  showLiveIndicator?: boolean
  className?: string
  children?: ReactNode
}

const getValueColor = (color: StatusItem['color'], theme: 'light' | 'dark') => {
  const isDark = theme === 'dark'
  switch (color) {
    case 'emerald':
      return isDark ? 'text-emerald-400' : 'text-emerald-600'
    case 'amber':
      return isDark ? 'text-amber-400' : 'text-amber-600'
    case 'orange':
      return isDark ? 'text-orange-400' : 'text-orange-600'
    case 'red':
      return isDark ? 'text-red-400' : 'text-red-600'
    case 'cyan':
      return isDark ? 'text-cyan-400' : 'text-cyan-600'
    case 'purple':
      return isDark ? 'text-purple-400' : 'text-purple-600'
    default:
      return isDark ? 'text-white' : 'text-black'
  }
}

const getBadgeStyles = (status: StatusBadge['status']) => {
  switch (status) {
    case 'critical':
      return 'bg-red-500/20 text-red-400'
    case 'alert':
      return 'bg-orange-500/20 text-orange-400'
    case 'warning':
      return 'bg-amber-500/20 text-amber-400'
    case 'active':
      return 'bg-yellow-500/20 text-yellow-400'
    default:
      return 'bg-emerald-500/20 text-emerald-400'
  }
}

export default function StatusBar({
  items,
  badge,
  theme = 'dark',
  loading = false,
  loadingText = 'Loading...',
  showLiveIndicator = true,
  className = '',
  children,
}: StatusBarProps) {
  const isDark = theme === 'dark'
  const bgColor = isDark ? 'bg-[#0f0f14]' : 'bg-white'
  const labelColor = isDark ? 'text-white/40' : 'text-black/50'
  const unitColor = isDark ? 'text-white/30' : 'text-black/40'

  if (loading) {
    return (
      <div className={`${bgColor} rounded-xl p-4 ${className}`}>
        <div className={`flex items-center gap-2 ${labelColor} text-sm`}>
          <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/20'} animate-pulse`} />
          {loadingText}
        </div>
      </div>
    )
  }

  return (
    <div className={`${bgColor} rounded-xl p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-4 md:gap-8">
        {/* Live indicator */}
        {showLiveIndicator && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`text-xs font-mono ${labelColor} uppercase`}>Live</span>
          </div>
        )}

        {/* Status items */}
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className={`text-xs ${labelColor}`}>{item.label}</span>
            <span className={`text-lg font-mono font-bold ${getValueColor(item.color, theme)}`}>
              {item.value}
            </span>
            {item.unit && (
              <span className={`text-xs ${unitColor}`}>{item.unit}</span>
            )}
            {item.note && (
              <span className={`text-xs ${unitColor}`}>({item.note})</span>
            )}
          </div>
        ))}

        {/* Custom children */}
        {children}

        {/* Status badge */}
        {badge && (
          <div className="ml-auto">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeStyles(badge.status)}`}>
              {badge.label}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
