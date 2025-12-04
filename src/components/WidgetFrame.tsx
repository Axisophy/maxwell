import { ReactNode } from 'react'

interface WidgetFrameProps {
  title: string
  isLive?: boolean
  timestamp?: string
  children: ReactNode
  className?: string
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto'
}

export default function WidgetFrame({
  title,
  isLive = false,
  timestamp,
  children,
  className = '',
  aspectRatio = 'square',
}: WidgetFrameProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[2/1]',
    auto: '',
  }

  return (
    <div className={`widget-frame flex flex-col ${className}`}>
      {/* Header bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--widget-border)]">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium">{title}</h3>
          {isLive && (
            <span className="live-indicator flex items-center gap-1.5 text-xs text-accent-green">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              LIVE
            </span>
          )}
        </div>
        {timestamp && (
          <span className="text-xs text-[var(--text-muted)]">{timestamp}</span>
        )}
      </div>

      {/* Content area */}
      <div className={`flex-1 ${aspectClasses[aspectRatio]}`}>
        {children}
      </div>
    </div>
  )
}
