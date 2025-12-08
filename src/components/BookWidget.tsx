'use client'

import { useState } from 'react'
import Link from 'next/link'

// Expanded intellectual series for design grouping
type Series = 
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

// Series-based styling
const seriesStyles: Record<Series, {
  bgColor: string
  textColor: string
  accentColor?: string
  label: string
}> = {
  'geometry': {
    bgColor: '#ffffff',
    textColor: '#000000',
    label: 'Geometry',
  },
  'natural-philosophy': {
    bgColor: '#f5f0e6',
    textColor: '#000000',
    accentColor: '#8b7355',
    label: 'Natural Philosophy',
  },
  'heavens': {
    bgColor: '#0a1628',
    textColor: '#ffffff',
    accentColor: '#c9a227',
    label: 'The Heavens',
  },
  'forces-fields': {
    bgColor: '#1a1a2e',
    textColor: '#ffffff',
    accentColor: '#e63946',
    label: 'Forces & Fields',
  },
  'living-world': {
    bgColor: '#2d4739',
    textColor: '#ffffff',
    accentColor: '#a7c4a0',
    label: 'The Living World',
  },
  'observers': {
    bgColor: '#e8e4dc',
    textColor: '#000000',
    accentColor: '#8b7355',
    label: 'Observers',
  },
  'chemistry': {
    bgColor: '#4a3728',
    textColor: '#ffffff',
    accentColor: '#d4a574',
    label: 'Chemistry',
  },
  'medicine': {
    bgColor: '#6b2c2c',
    textColor: '#ffffff',
    accentColor: '#f5e6d3',
    label: 'Medicine',
  },
  'mathematics': {
    bgColor: '#000000',
    textColor: '#ffffff',
    accentColor: '#ffffff',
    label: 'Mathematics',
  },
  'scientific-fiction': {
    bgColor: '#2d1f1f',
    textColor: '#ffffff',
    accentColor: '#c9a227',
    label: 'Scientific Fiction',
  },
}

// MXWLL Editions logo placeholder (update when final logo ready)
function MXWLLEditionsLogo({ color = '#000000' }: { color?: string }) {
  return (
    <div 
      style={{ 
        color, 
        opacity: 0.7,
        fontSize: '0.5em',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 500,
        letterSpacing: '0.1em',
      }}
    >
      MXWLL EDITIONS
    </div>
  )
}

// Series graphic component
function SeriesGraphic({ series, color }: { series: Series; color?: string }) {
  const style = seriesStyles[series]
  const graphicColor = color || style.accentColor || style.textColor
  
  switch (series) {
    case 'geometry':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="70" cy="100" r="50" fill="none" stroke={graphicColor} strokeWidth="0.75" />
          <circle cx="130" cy="100" r="50" fill="none" stroke={graphicColor} strokeWidth="0.75" />
          <line x1="100" y1="57" x2="100" y2="143" stroke={graphicColor} strokeWidth="0.75" />
        </svg>
      )
    case 'heavens':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <ellipse cx="100" cy="100" rx="90" ry="35" fill="none" stroke={graphicColor} strokeWidth="0.5" />
          <ellipse cx="100" cy="100" rx="60" ry="23" fill="none" stroke={graphicColor} strokeWidth="0.5" />
          <ellipse cx="100" cy="100" rx="35" ry="14" fill="none" stroke={graphicColor} strokeWidth="0.5" />
          <circle cx="100" cy="100" r="4" fill={graphicColor} />
        </svg>
      )
    case 'forces-fields':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <circle 
              key={i} 
              cx="100" 
              cy="100" 
              r={12 * i} 
              fill="none" 
              stroke={graphicColor} 
              strokeWidth="0.5" 
            />
          ))}
        </svg>
      )
    case 'living-world':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path 
            d="M100 190 L100 100 M100 100 L50 40 M100 100 L150 40 M50 40 L25 10 M50 40 L75 10 M150 40 L125 10 M150 40 L175 10 M100 130 L70 90 M100 130 L130 90" 
            fill="none" 
            stroke={graphicColor} 
            strokeWidth="1" 
          />
        </svg>
      )
    case 'observers':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <ellipse cx="100" cy="100" rx="25" ry="70" fill="none" stroke={graphicColor} strokeWidth="0.75" />
          <line x1="10" y1="100" x2="75" y2="100" stroke={graphicColor} strokeWidth="0.5" />
          <line x1="125" y1="100" x2="190" y2="100" stroke={graphicColor} strokeWidth="0.5" />
          <line x1="10" y1="70" x2="75" y2="100" stroke={graphicColor} strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="125" y1="100" x2="190" y2="130" stroke={graphicColor} strokeWidth="0.5" strokeDasharray="2,2" />
        </svg>
      )
    case 'chemistry':
      // Hexagonal benzene-like structure
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <polygon 
            points="100,30 157,65 157,135 100,170 43,135 43,65" 
            fill="none" 
            stroke={graphicColor} 
            strokeWidth="0.75" 
          />
          <polygon 
            points="100,55 137,75 137,125 100,145 63,125 63,75" 
            fill="none" 
            stroke={graphicColor} 
            strokeWidth="0.5" 
          />
        </svg>
      )
    case 'medicine':
      // Caduceus-inspired / heartbeat line
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path 
            d="M20 100 L60 100 L80 60 L100 140 L120 60 L140 100 L180 100" 
            fill="none" 
            stroke={graphicColor} 
            strokeWidth="1" 
          />
        </svg>
      )
    case 'mathematics':
      // Infinity / möbius inspired
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path 
            d="M40 100 C40 60 70 60 100 100 C130 140 160 140 160 100 C160 60 130 60 100 100 C70 140 40 140 40 100" 
            fill="none" 
            stroke={graphicColor} 
            strokeWidth="0.75" 
          />
        </svg>
      )
    case 'scientific-fiction':
      // Rocket / futuristic
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path 
            d="M100 20 L120 80 L120 140 L110 160 L100 140 L90 160 L80 140 L80 80 Z" 
            fill="none" 
            stroke={graphicColor} 
            strokeWidth="0.75" 
          />
          <ellipse cx="100" cy="90" rx="15" ry="20" fill="none" stroke={graphicColor} strokeWidth="0.5" />
        </svg>
      )
    case 'natural-philosophy':
    default:
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="70" y="30" width="60" height="140" fill="none" stroke={graphicColor} strokeWidth="0.75" />
          <line x1="70" y1="45" x2="130" y2="45" stroke={graphicColor} strokeWidth="0.75" />
          <line x1="70" y1="155" x2="130" y2="155" stroke={graphicColor} strokeWidth="0.75" />
          <line x1="85" y1="45" x2="85" y2="155" stroke={graphicColor} strokeWidth="0.5" />
          <line x1="115" y1="45" x2="115" y2="155" stroke={graphicColor} strokeWidth="0.5" />
        </svg>
      )
  }
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
  const style = seriesStyles[series]

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleStartReading = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Navigation handled by Link
  }

  return (
    <div 
      className="aspect-[2/3] perspective-1000"
      style={{ perspective: '1000px' }}
    >
      <div 
        className="relative w-full h-full transition-transform duration-500"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT - Book Cover */}
        <div
          onClick={handleFlip}
          className="absolute inset-0 rounded-lg overflow-hidden cursor-pointer transition-shadow duration-200 hover:shadow-lg"
          style={{ 
            backgroundColor: style.bgColor,
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Use container width for em-based scaling */}
          <div className="relative w-full h-full text-[10px] sm:text-[12px]">
            
            {/* Graphic - positioned in middle area */}
            <div 
              className="absolute"
              style={{
                top: '18%',
                left: '10%',
                right: '10%',
                height: '40%',
                opacity: 0.4,
              }}
            >
              <SeriesGraphic series={series} />
            </div>

            {/* Author - at top */}
            <div 
              className="absolute uppercase"
              style={{ 
                top: '8%',
                left: '10%',
                right: '8%',
                color: style.textColor,
                fontSize: '1em',
                fontFamily: '"trade-gothic-next", "Helvetica Neue", sans-serif',
                fontWeight: 400,
                letterSpacing: '0.15em',
              }}
            >
              {author}
            </div>

            {/* Title - at 70% down */}
            <div 
              className="absolute uppercase leading-[0.95]"
              style={{ 
                top: '68%',
                left: '10%',
                right: '8%',
                color: style.textColor,
                fontSize: '2.2em',
                fontFamily: '"trade-gothic-next-compressed", "Arial Narrow", sans-serif',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              {title}
            </div>

            {/* Publisher logo - at bottom */}
            <div 
              className="absolute"
              style={{ 
                bottom: '6%',
                left: '10%',
              }}
            >
              <MXWLLEditionsLogo color={style.textColor} />
            </div>
          </div>
        </div>

        {/* BACK - Info Card */}
        <div
          onClick={handleFlip}
          className="absolute inset-0 rounded-lg overflow-hidden cursor-pointer"
          style={{ 
            backgroundColor: style.bgColor,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div 
            className="relative w-full h-full p-[10%] flex flex-col text-[10px] sm:text-[12px]"
            style={{ color: style.textColor }}
          >
            {/* Title */}
            <h3 
              className="font-bold leading-tight mb-1"
              style={{ 
                fontSize: '1.6em',
                fontFamily: '"trade-gothic-next-compressed", "Arial Narrow", sans-serif',
              }}
            >
              {title}
            </h3>

            {/* Author with dates */}
            <p 
              className="mb-3"
              style={{ 
                fontSize: '1em',
                opacity: 0.8,
              }}
            >
              {author}{authorDates && ` (${authorDates})`}
            </p>

            {/* Description */}
            {description && (
              <p 
                className="flex-1 overflow-hidden leading-relaxed"
                style={{ 
                  fontSize: '1.1em',
                  opacity: 0.9,
                  display: '-webkit-box',
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {description}
              </p>
            )}

            {/* Meta info */}
            <div 
              className="mt-auto pt-3 space-y-1"
              style={{ 
                fontSize: '0.9em',
                opacity: 0.7,
                borderTop: `1px solid ${style.textColor}20`,
              }}
            >
              <p>First published: {yearDisplay}</p>
              {pageCount && <p>{pageCount} pages</p>}
              {readingTime && <p>Reading time: {readingTime}</p>}
              <p className="capitalize">{seriesStyles[series].label}</p>
            </div>

            {/* Start Reading button */}
            <Link
              href={`/vault/${slug}`}
              onClick={handleStartReading}
              className="mt-3 block text-center py-2 rounded transition-opacity hover:opacity-80"
              style={{ 
                fontSize: '1.1em',
                fontWeight: 600,
                backgroundColor: style.accentColor || style.textColor,
                color: style.bgColor,
              }}
            >
              Start Reading
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export types for use in pages
export type { Series }
export { seriesStyles }