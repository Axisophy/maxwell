'use client'

import { ReactNode, useState, useEffect, useRef } from 'react'

interface WidgetInfo {
  description: string
  source?: string
  sourceUrl?: string
  controls?: { name: string; description: string }[]
}

interface WidgetFrameProps {
  title: string
  status?: 'live' | 'ok' | 'error' | 'loading'
  children: ReactNode
  info?: WidgetInfo
}

/**
 * WidgetFrame - Unified widget container
 * 
 * Structure:
 * ┌─────────────────────────────────────────┐
 * │  WIDGET FRAME (header)                  │
 * └─────────────────────────────────────────┘
 *          ↓ 8px gap (0.5em)
 * ┌─────────────────────────────────────────┐
 * │                                         │
 * │  WIDGET CONTENT                         │
 * │                                         │
 * └─────────────────────────────────────────┘
 * 
 * All measurements use em units for proportional scaling.
 * Reference: 400px width = 16px base font-size
 */
export default function WidgetFrame({
  title,
  status = 'ok',
  children,
  info,
}: WidgetFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [showInfo, setShowInfo] = useState(false)

  // Scale base font-size with container width
  // Reference: 400px = 16px base (scale factor: width ÷ 25)
  useEffect(() => {
    if (!containerRef.current) return

    const updateSize = () => {
      const width = containerRef.current?.clientWidth || 400
      setBaseFontSize(width / 25)
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const statusColour = {
    live: '#22c55e',
    ok: '#22c55e',
    error: '#ef4444',
    loading: '#f59e0b',
  }[status]

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Frame (Header) */}
      <div
        className="flex flex-col"
        style={{
          backgroundColor: '#e5e5e5',
          borderRadius: '0.75em',
          overflow: 'hidden',
        }}
      >
        {/* Title bar - height: 3em (48px at 400px) */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '0 1em', height: '3em' }}
        >
          {/* Title */}
          <span
            className="font-sans"
            style={{ fontSize: '1.125em', fontWeight: 400 }}
          >
            {title}
          </span>

          {/* Right side: status + info button */}
          <div className="flex items-center" style={{ gap: '0.75em' }}>
            {/* Status indicator */}
            <div
              className={status === 'live' ? 'animate-pulse' : ''}
              style={{
                width: '0.5em',
                height: '0.5em',
                borderRadius: '50%',
                backgroundColor: statusColour,
              }}
            />

            {/* Info button */}
            {info && (
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="transition-opacity"
                style={{
                  opacity: showInfo ? 1 : 0.4,
                  width: '1.25em',
                  height: '1.25em',
                }}
                aria-label={showInfo ? 'Hide info' : 'Show info'}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Info panel (expanded) */}
        {info && showInfo && (
          <div
            style={{
              padding: '1em',
              borderTop: '1px solid #d0d0d0',
            }}
          >
            {/* Description */}
            <p style={{ fontSize: '0.875em', marginBottom: '0.75em' }}>
              {info.description}
            </p>

            {/* Source */}
            {info.source && (
              <div style={{ marginBottom: info.controls ? '0.75em' : 0 }}>
                <span
                  style={{
                    fontSize: '0.625em',
                    fontWeight: 500,
                    opacity: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginBottom: '0.25em',
                  }}
                >
                  Source
                </span>
                {info.sourceUrl ? (
                  <a
                    href={info.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.875em', opacity: 0.8 }}
                    className="hover:opacity-100 transition-opacity"
                  >
                    {info.source}
                  </a>
                ) : (
                  <span style={{ fontSize: '0.875em', opacity: 0.8 }}>
                    {info.source}
                  </span>
                )}
              </div>
            )}

            {/* Controls */}
            {info.controls && info.controls.length > 0 && (
              <div>
                <span
                  style={{
                    fontSize: '0.625em',
                    fontWeight: 500,
                    opacity: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginBottom: '0.25em',
                  }}
                >
                  Controls
                </span>
                <ul style={{ fontSize: '0.875em', opacity: 0.8 }}>
                  {info.controls.map((control, i) => (
                    <li key={i}>
                      <span style={{ fontWeight: 500, opacity: 1 }}>
                        {control.name}
                      </span>
                      <span style={{ margin: '0 0.25em' }}>—</span>
                      {control.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gap between frame and content: 0.5em (8px at 400px) */}
      <div style={{ height: '0.5em' }} />

      {/* Content block */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75em',
          padding: '1em',
        }}
      >
        {children}
      </div>
    </div>
  )
}