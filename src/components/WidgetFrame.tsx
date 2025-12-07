'use client'

import { ReactNode, useState } from 'react'

interface WidgetInfo {
  description: string
  sources?: { name: string; url?: string }[]
  controls?: { name: string; description: string }[]
  notes?: string
}

interface WidgetFrameProps {
  title: string
  isLive?: boolean
  timestamp?: string
  children: ReactNode
  className?: string
  aspectRatio?: 'square' | 'video' | 'wide'
  info?: WidgetInfo
}

export default function WidgetFrame({
  title,
  isLive = false,
  timestamp,
  children,
  className = '',
  aspectRatio = 'square',
  info,
}: WidgetFrameProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const header = (
    <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--widget-border)] shrink-0">
      <div className="flex items-center gap-3">
        <h3 className={`font-normal text-black ${isExpanded ? 'text-xl' : 'text-sm'}`}>{title}</h3>
        {isLive && (
          <span className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e6007e] animate-pulse" />
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {timestamp && (
          <span className="text-xs font-normal text-black/60">{timestamp}</span>
        )}
        {/* Info button */}
        {info && (
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-1 rounded transition-colors ${
              showInfo 
                ? 'bg-black text-white' 
                : 'text-black/50 hover:text-black hover:bg-[var(--shell-bg)]'
            }`}
            aria-label={showInfo ? 'Hide info' : 'Show info'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>
        )}
        {/* Expand/Collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded transition-colors text-black/50 hover:text-black hover:bg-[var(--shell-bg)]"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )

  const infoPanel = info && showInfo && (
    <div className="px-4 py-3 bg-[var(--shell-bg)] border-b border-[var(--widget-border)] text-sm">
      {/* Description */}
      <p className="text-black font-medium mb-3">{info.description}</p>
      
      {/* Sources */}
      {info.sources && info.sources.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-black uppercase tracking-wide mb-1">
            Source{info.sources.length > 1 ? 's' : ''}
          </h4>
          <ul className="space-y-0.5">
            {info.sources.map((source, i) => (
              <li key={i} className="text-black/70 font-medium">
                {source.url ? (
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#e6007e] transition-colors"
                  >
                    {source.name}
                  </a>
                ) : (
                  source.name
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Controls */}
      {info.controls && info.controls.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-black uppercase tracking-wide mb-1">Controls</h4>
          <ul className="space-y-1">
            {info.controls.map((control, i) => (
              <li key={i} className="text-black/70 font-medium">
                <span className="text-black">{control.name}</span>
                <span className="mx-1 font-extralight">—</span>
                {control.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Notes */}
      {info.notes && (
        <p className="text-xs text-black/60 italic">{info.notes}</p>
      )}
    </div>
  )

  // Expanded: full screen overlay with centered, height-scaled content
  if (isExpanded) {
    const aspectValue = aspectRatio === 'square' ? '1/1' : aspectRatio === 'video' ? '16/9' : '2/1'
    
    return (
      <div className="fixed inset-0 z-50 bg-[var(--shell-bg)] p-8">
        <div className="w-full h-full flex flex-col widget-frame">
          {header}
          {infoPanel}
          
          {/* Content area - centers the widget, scales to fit within bounds */}
          <div className="flex-1 flex items-center justify-center p-8 min-h-0 overflow-hidden">
            <div 
              className="h-full w-auto max-w-full"
              style={{ aspectRatio: aspectValue }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Normal: in grid
  const aspectValue = aspectRatio === 'square' ? '1/1' : aspectRatio === 'video' ? '16/9' : '2/1'
  
  return (
    <div className={`widget-frame flex flex-col ${className}`}>
      {header}
      {infoPanel}
      {/* Content area with padding, maintaining aspect ratio */}
      <div className="p-4">
        <div 
          className="w-full"
          style={{ aspectRatio: aspectValue }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}