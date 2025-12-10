'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Series definitions with colours and graphics
export type Series = 
  | 'geometry' 
  | 'natural-philosophy' 
  | 'heavens' 
  | 'forces-fields' 
  | 'living-world' 
  | 'observers'
  | 'chemistry'
  | 'medicine'
  | 'mathematics'
  | 'scientific-fiction'

interface SeriesStyle {
  bg: string
  text: string
  accent: string
  graphic: React.ReactNode
  label: string
}

const seriesStyles: Record<Series, SeriesStyle> = {
  'geometry': {
    bg: '#f0f0f0',
    text: '#000000',
    accent: '#000000',
    label: 'Geometry',
    graphic: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <circle cx="50" cy="60" r="25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
  'natural-philosophy': {
    bg: '#e5d9c3',
    text: '#000000',
    accent: '#8b4513',
    label: 'Natural Philosophy',
    graphic: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50 20 Q30 50 50 80 Q70 50 50 20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
  'heavens': {
    bg: '#1a1a2e',
    text: '#ffffff',
    accent: '#ffd700',
    label: 'The Heavens',
    graphic: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.3" />
        <circle cx="50" cy="20" r="2" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  'forces-fields': {
    bg: '#1a0a2e',
    text: '#ffffff',
    accent: '#ff4444',
    label: 'Forces & Fields',
    graphic: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M20 50 Q35 30 50 50 Q65 70 80 50" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path d="M20 40 Q35 20 50 40 Q65 60 80 40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path d="M20 60 Q35 40 50 60 Q65 80 80 60" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
  'living-world': {
    bg: '#0a2618',
    text: '#ffffff',
    accent: '#90ee90',
    label: 'The Living World',
    graphic: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50 90 L50 50 M50 50 Q30 30 50 20 Q70 30 50 50" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path d="M50 60 Q30 55 25 45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path d="M50 60 Q70 55 75 45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
  'observers': {
    bg: '#c2b198',
    text: '#000000',
    accent: '#5c4033',
    label: 'The Observers',
    graphic: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  'chemistry': {
    bg: '#2d1f14',
    text: '#ffffff',
    accent: '#f59e0b',
    label: 'Chemistry',
    graphic: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon points="50,25 72,38 72,62 50,75 28,62 28,38" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <line x1="28" y1="38" x2="72" y2="62" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <line x1="72" y1="38" x2="28" y2="62" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      </svg>
    ),
  },
  'medicine': {
    bg: '#4a0e0e',
    text: '#ffffff',
    accent: '#f5e6d3',
    label: 'Medicine',
    graphic: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M15 50 L30 50 L35 35 L45 65 L55 35 L65 65 L70 50 L85 50" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
  },
  'mathematics': {
    bg: '#000000',
    text: '#ffffff',
    accent: '#ffffff',
    label: 'Mathematics',
    graphic: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M25 50 Q25 25 50 25 Q75 25 75 50 Q75 75 50 75 Q25 75 25 50 M50 25 Q50 50 75 50 Q50 50 50 75 Q50 50 25 50 Q50 50 50 25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
  'scientific-fiction': {
    bg: '#2a0a0a',
    text: '#ffffff',
    accent: '#ffd700',
    label: 'Scientific Fiction',
    graphic: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50 85 L50 35 M40 45 L50 35 L60 45 M35 85 L65 85 M30 85 L35 75 L65 75 L70 85" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <circle cx="50" cy="25" r="5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
}

// Calculate title font size based on length
function getTitleSize(title: string): string {
  const len = title.length
  if (len <= 15) return '2.4em'
  if (len <= 25) return '2em'
  if (len <= 40) return '1.6em'
  if (len <= 60) return '1.3em'
  return '1.1em'
}

interface BookWidgetProps {
  slug: string
  title: string
  author: string
  authorDates?: string
  yearDisplay: string
  series: Series
  description?: string
  readingTime?: string
  pageCount?: number
}

export default function BookWidget({
  slug,
  title,
  author,
  authorDates,
  yearDisplay,
  series,
  description,
  readingTime,
  pageCount,
}: BookWidgetProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const router = useRouter()
  const style = seriesStyles[series]
  const titleSize = getTitleSize(title)

  const handleStartReading = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/vault/${slug}`)
  }

  return (
    <div 
      className="w-full cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{ 
          aspectRatio: '2 / 3',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
    {/* Front - Book Cover */}
<div
  className="absolute inset-0 rounded-sm overflow-hidden"
  style={{ 
    backfaceVisibility: 'hidden',
    backgroundColor: style.bg,
    color: style.text,
    fontSize: 'clamp(10px, 2.5vw, 12px)',
  }}
>
  {/* Content area - percentage padding scales with container */}
  <div className="absolute inset-0 px-[8%]">
    {/* Author */}
    <div
      className="absolute w-full"
      style={{ top: '8%', left: '8%', right: '8%', width: 'auto' }}
    >
      <p 
        className="font-sans uppercase tracking-widest"
        style={{ 
          fontSize: '0.8em',
          color: style.text,
          opacity: 0.7,
        }}
      >
        {author}
      </p>
    </div>

    {/* Series graphic - unchanged */}
    <div
      className="absolute"
      style={{
        top: '18%',
        left: '10%',
        right: '10%',
        height: '40%',
        color: style.accent,
        opacity: 0.4,
      }}
    >
      {style.graphic}
    </div>

    {/* Title - percentage positioning */}
    <div
      className="absolute"
      style={{ 
        top: '62%',
        bottom: '15%',
        left: '8%',
        right: '8%',
      }}
    >
      <h3 
        className="leading-tight uppercase"
        style={{ 
          fontFamily: 'trade-gothic-next-condensed, sans-serif',
          fontWeight: 700,
          fontSize: titleSize,
          color: style.text,
        }}
      >
        {title}
      </h3>
    </div>

    {/* MXWLL Logo - percentage positioning */}
    <div
      className="absolute"
      style={{ bottom: '5%', left: '8%' }}
    >
      <svg 
        viewBox="0 0 401 86.38" 
        style={{ 
          width: '5em',
          height: 'auto',
          fill: style.text,
          opacity: 0.5,
        }}
      >
                <path d="M18.48,64.68c0,14,1.82,16.38,13.44,16.38v2.94H0v-2.94c11.62,0,13.3-2.38,13.3-16.38V19.18C13.3,5.18,11.62,2.94,0,2.94V0h23.8l29.68,68.18L83.02,0h21.98v2.94c-11.76,0-13.44,2.24-13.44,16.24v45.5c0,14,1.68,16.38,13.44,16.38v2.94h-37.8v-2.94c11.62,0,13.3-2.38,13.3-16.38V19.04l-29.12,67.34h-1.82L18.48,14.84v49.84Z"/>
                <path d="M133.88,70.42c-6.3,8.12-4.48,10.64,3.64,10.64v2.94h-26.32v-2.94c6.58,0,10.36-3.22,17.5-12.18l11.48-14.56-11.2-15.82c-6.58-9.52-9.52-12.32-16.8-12.32v-2.8h31.36v2.8c-8.96,0-9.1,2.8-3.64,10.64l6.58,9.66,7.7-9.66c6.58-8.54,4.9-10.64-3.64-10.64v-2.8h26.32v2.8c-7.14,0-10.64,3.5-17.5,12.32l-9.8,12.18,12.74,18.2c6.58,9.38,10.22,12.18,16.94,12.18v2.94h-31.36v-2.94c8.82,0,9.24-2.38,3.5-10.64l-8.12-11.62-9.38,11.62Z"/>
                <path d="M246.15,65.38l9.66-28.56c2.8-8.26,1.54-10.64-7.42-10.64v-2.8h26.32v2.8c-8.68,0-10.92,2.1-14.28,12.32l-16.1,47.88h-1.82l-14.28-43.82-14.56,43.82h-1.82l-15.54-47.88c-3.36-10.22-5.6-12.32-13.72-12.32v-2.8h31.08v2.8c-8.26,0-10.36,1.96-7.56,10.64l9.38,28.56,14.14-42h2.8l13.72,42Z"/>
                <path d="M281.3,26.18v-2.8h32.06v2.8c-9.38,0-11.06,2.24-11.06,16.24v20.16c0,14,1.68,16.24,11.06,16.24h4.9c12.88,0,14.56-2.38,16.24-8.96l.7-2.8h2.94l-.98,16.94h-55.86v-2.8c9.38,0,11.06-2.38,11.06-16.38v-22.4c0-14-1.68-16.24-11.06-16.24Z"/>
                <path d="M344.16,26.18v-2.8h32.06v2.8c-9.38,0-11.06,2.24-11.06,16.24v20.16c0,14,1.68,16.24,11.06,16.24h4.9c12.88,0,14.56-2.38,16.24-8.96l.7-2.8h2.94l-.98,16.94h-55.86v-2.8c9.38,0,11.06-2.38,11.06-16.38v-22.4c0-14-1.68-16.24-11.06-16.24Z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Back - Info Card */}
        <div
          className="absolute inset-0 rounded-sm overflow-hidden p-[1em] flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontSize: 'clamp(10px, 2.5vw, 12px)',
            border: '1px solid #e5e5e5',
          }}
        >
          {/* Title */}
          <h3 
            className="leading-tight mb-[0.3em]"
            style={{ 
              fontFamily: 'trade-gothic-next-condensed, sans-serif',
              fontWeight: 700,
              fontSize: '1.4em',
            }}
          >
            {title}
          </h3>

          {/* Author + dates */}
          <p 
            className="font-sans mb-[1em]"
            style={{ 
              fontSize: '0.9em',
              opacity: 0.5,
            }}
          >
            {author}{authorDates ? `, ${authorDates}` : ''}
          </p>

          {/* Description */}
          {description && (
            <p 
              className="font-sans leading-relaxed flex-1 overflow-hidden"
              style={{ fontSize: '0.85em' }}
            >
              {description}
            </p>
          )}

          {/* Meta info */}
          <div 
            className="mt-[0.8em] pt-[0.8em]"
            style={{ 
              fontSize: '0.75em',
              borderTop: '1px solid #e5e5e5',
            }}
          >
            <div 
              className="flex flex-wrap gap-x-[1em] gap-y-[0.3em]"
              style={{ opacity: 0.5 }}
            >
              <span>{yearDisplay}</span>
              {pageCount && <span>{pageCount} pages</span>}
              {readingTime && <span>{readingTime}</span>}
            </div>
            <p 
              className="mt-[0.5em]"
              style={{ 
                color: style.accent !== '#ffffff' ? style.accent : 'inherit', 
                opacity: style.accent === '#ffffff' ? 0.5 : 1,
              }}
            >
              {style.label}
            </p>
          </div>

          {/* Start Reading button */}
          <button
            onClick={handleStartReading}
            className="mt-[0.8em] w-full py-[0.6em] bg-black text-white text-center font-sans rounded"
            style={{ fontSize: '0.85em' }}
          >
            Start Reading →
          </button>
        </div>
      </div>
    </div>
  )
}