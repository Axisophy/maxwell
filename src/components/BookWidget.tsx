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
    bg: '#ffffff',
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
    bg: '#f5f0e6',
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
    bg: '#d4c5b5',
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
  if (len <= 15) return '2.4em'      // Short: "Elements", "Opticks"
  if (len <= 25) return '2em'        // Medium: "On the Origin of Species"
  if (len <= 40) return '1.6em'      // Long: "Dialogue Concerning Two Chief World Systems"
  if (len <= 60) return '1.3em'      // Very long
  return '1.1em'                      // Extremely long
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
          {/* Left edge / spine */}
          <div 
            className="absolute left-0 top-0 bottom-0"
            style={{ 
              width: '10%',
              backgroundColor: style.accent,
              opacity: 0.3,
            }}
          />

          {/* Content area */}
          <div 
            className="absolute"
            style={{
              left: '10%',
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            {/* Author */}
            <div
              className="absolute w-full px-[1em]"
              style={{ top: '8%' }}
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

            {/* Series graphic */}
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

            {/* Title - dynamic sizing */}
            <div
              className="absolute w-full px-[1em]"
              style={{ 
                top: '62%',
                bottom: '15%',
              }}
            >
              <h3 
                className="font-serif leading-tight"
                style={{ 
                  fontSize: titleSize,
                  color: style.text,
                }}
              >
                {title}
              </h3>
            </div>

            {/* Logo placeholder */}
            <div
              className="absolute w-full px-[1em]"
              style={{ bottom: '5%' }}
            >
              <p 
                className="font-sans tracking-widest"
                style={{ 
                  fontSize: '0.55em',
                  color: style.text,
                  opacity: 0.5,
                }}
              >
                MXWLL EDITIONS
              </p>
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
            className="font-serif leading-tight mb-[0.3em]"
            style={{ fontSize: '1.4em' }}
          >
            {title}
          </h3>

          {/* Author + dates */}
          <p 
            className="font-sans mb-[1em]"
            style={{ 
              fontSize: '0.9em',
              color: '#666666',
            }}
          >
            {author}{authorDates ? `, ${authorDates}` : ''}
          </p>

          {/* Description */}
          {description && (
            <p 
              className="font-sans leading-relaxed flex-1 overflow-hidden"
              style={{ 
                fontSize: '0.85em',
                color: '#333333',
              }}
            >
              {description}
            </p>
          )}

          {/* Meta info */}
          <div 
            className="mt-[0.8em] pt-[0.8em] border-t border-gray-200"
            style={{ fontSize: '0.75em' }}
          >
            <div className="flex flex-wrap gap-x-[1em] gap-y-[0.3em] text-gray-500">
              <span>{yearDisplay}</span>
              {pageCount && <span>{pageCount} pages</span>}
              {readingTime && <span>{readingTime}</span>}
            </div>
            <p 
              className="mt-[0.5em]"
              style={{ color: style.accent !== '#ffffff' ? style.accent : '#666666' }}
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