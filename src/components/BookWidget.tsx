'use client'

// Intellectual series for design grouping (independent of chronological display)
type Series = 'geometry' | 'natural-philosophy' | 'heavens' | 'forces-fields' | 'living-world' | 'observers'

interface BookWidgetProps {
  slug: string
  title: string
  author: string
  yearDisplay: string
  series: Series
  onClick?: () => void
}

// Series-based styling
const seriesStyles: Record<Series, {
  bgColor: string
  textColor: string
  accentColor?: string
}> = {
  'geometry': {
    bgColor: '#ffffff',
    textColor: '#000000',
  },
  'natural-philosophy': {
    bgColor: '#f5f0e6',
    textColor: '#000000',
    accentColor: '#8b7355',
  },
  'heavens': {
    bgColor: '#0a1628',
    textColor: '#ffffff',
    accentColor: '#c9a227',
  },
  'forces-fields': {
    bgColor: '#1a1a2e',
    textColor: '#ffffff',
    accentColor: '#e63946',
  },
  'living-world': {
    bgColor: '#2d4739',
    textColor: '#ffffff',
    accentColor: '#a7c4a0',
  },
  'observers': {
    bgColor: '#e8e4dc',
    textColor: '#000000',
    accentColor: '#8b7355',
  },
}

// Maxwell Editions logo (serif version)
function MaxwellEditionsLogo({ color = '#000000' }: { color?: string }) {
  return (
    <svg 
      viewBox="0 0 536.77 86.38" 
      className="h-[10px] w-auto"
      fill={color}
      style={{ opacity: 0.7 }}
    >
      <path d="M18.48,64.68c0,14,1.82,16.38,13.44,16.38v2.94H0v-2.94c11.62,0,13.3-2.38,13.3-16.38V19.18C13.3,5.18,11.62,2.94,0,2.94V0h23.8l29.68,68.18L83.02,0h21.98v2.94c-11.76,0-13.44,2.24-13.44,16.24v45.5c0,14,1.68,16.38,13.44,16.38v2.94h-37.8v-2.94c11.62,0,13.3-2.38,13.3-16.38V19.04l-29.12,67.34h-1.82L18.48,14.84v49.84Z"/>
      <path d="M129.28,70.42c-3.5,8.26-3.5,10.64,7.56,10.64v2.94h-26.46v-2.94c8.54,0,9.8-1.68,14.42-12.18l20.58-47.88h1.96l20.58,47.88c4.62,10.5,6.3,12.18,13.72,12.18v2.94h-31.36v-2.94c10.08,0,11.06-2.38,7.56-10.64l-2.8-6.44h-22.96l-2.8,6.44ZM143.56,37.38l-9.24,21.42h18.48l-9.24-21.42Z"/>
      <path d="M209.51,70.42c-6.3,8.12-4.48,10.64,3.64,10.64v2.94h-26.32v-2.94c6.58,0,10.36-3.22,17.5-12.18l11.48-14.56-11.2-15.82c-6.58-9.52-9.52-12.32-16.8-12.32v-2.8h31.36v2.8c-8.96,0-9.1,2.8-3.64,10.64l6.58,9.66,7.7-9.66c6.58-8.54,4.9-10.64-3.64-10.64v-2.8h26.32v2.8c-7.14,0-10.64,3.5-17.5,12.32l-9.8,12.18,12.74,18.2c6.58,9.38,10.22,12.18,16.94,12.18v2.94h-31.36v-2.94c8.82,0,9.24-2.38,3.5-10.64l-8.12-11.62-9.38,11.62Z"/>
      <path d="M321.77,65.38l9.66-28.56c2.8-8.26,1.54-10.64-7.42-10.64v-2.8h26.32v2.8c-8.68,0-10.92,2.1-14.28,12.32l-16.1,47.88h-1.82l-14.28-43.82-14.56,43.82h-1.82l-15.54-47.88c-3.36-10.22-5.6-12.32-13.72-12.32v-2.8h31.08v2.8c-8.26,0-10.36,1.96-7.56,10.64l9.38,28.56,14.14-42h2.8l13.72,42Z"/>
      <path d="M406.91,69.86l.7-2.8h2.8l-1.12,16.94h-52.36v-2.8c9.38,0,11.06-2.38,11.06-16.38v-22.4c0-14-1.68-16.24-11.06-16.24v-2.8h49l1.12,16.8h-2.94l-.7-2.8c-1.54-6.44-3.36-8.96-16.1-8.96h-9.38v20.86h.84c14,0,15.12-1.68,15.12-11.06h2.8v27.3h-2.8c0-9.24-1.12-11.06-15.12-11.06h-.84v8.12c0,14,1.68,16.24,11.06,16.24h1.68c12.74,0,14.56-2.38,16.24-8.96Z"/>
      <path d="M417.07,26.18v-2.8h32.06v2.8c-9.38,0-11.06,2.24-11.06,16.24v20.16c0,14,1.68,16.24,11.06,16.24h4.9c12.88,0,14.56-2.38,16.24-8.96l.7-2.8h2.94l-.98,16.94h-55.86v-2.8c9.38,0,11.06-2.38,11.06-16.38v-22.4c0-14-1.68-16.24-11.06-16.24Z"/>
      <path d="M479.93,26.18v-2.8h32.06v2.8c-9.38,0-11.06,2.24-11.06,16.24v20.16c0,14,1.68,16.24,11.06,16.24h4.9c12.88,0,14.56-2.38,16.24-8.96l.7-2.8h2.94l-.98,16.94h-55.86v-2.8c9.38,0,11.06-2.38,11.06-16.38v-22.4c0-14-1.68-16.24-11.06-16.24Z"/>
    </svg>
  )
}

// Placeholder graphic component - will be replaced with actual series graphics
function SeriesGraphic({ series, color }: { series: Series; color?: string }) {
  const style = seriesStyles[series]
  const graphicColor = color || style.accentColor || style.textColor
  
  switch (series) {
    case 'geometry':
      // Euclidean construction - intersecting circles
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="70" cy="100" r="50" fill="none" stroke={graphicColor} strokeWidth="0.75" />
          <circle cx="130" cy="100" r="50" fill="none" stroke={graphicColor} strokeWidth="0.75" />
          <line x1="100" y1="57" x2="100" y2="143" stroke={graphicColor} strokeWidth="0.75" />
        </svg>
      )
    case 'heavens':
      // Orbital ellipses
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <ellipse cx="100" cy="100" rx="90" ry="35" fill="none" stroke={graphicColor} strokeWidth="0.5" />
          <ellipse cx="100" cy="100" rx="60" ry="23" fill="none" stroke={graphicColor} strokeWidth="0.5" />
          <ellipse cx="100" cy="100" rx="35" ry="14" fill="none" stroke={graphicColor} strokeWidth="0.5" />
          <circle cx="100" cy="100" r="4" fill={graphicColor} />
        </svg>
      )
    case 'forces-fields':
      // Wave interference / concentric circles
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
      // Branching / tree pattern
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
      // Lens / optical diagram
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <ellipse cx="100" cy="100" rx="25" ry="70" fill="none" stroke={graphicColor} strokeWidth="0.75" />
          <line x1="10" y1="100" x2="75" y2="100" stroke={graphicColor} strokeWidth="0.5" />
          <line x1="125" y1="100" x2="190" y2="100" stroke={graphicColor} strokeWidth="0.5" />
          <line x1="10" y1="70" x2="75" y2="100" stroke={graphicColor} strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="125" y1="100" x2="190" y2="130" stroke={graphicColor} strokeWidth="0.5" strokeDasharray="2,2" />
        </svg>
      )
    case 'natural-philosophy':
    default:
      // Classical column / architectural
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
  yearDisplay, 
  series,
  onClick 
}: BookWidgetProps) {
  const style = seriesStyles[series]

  return (
    <div
      onClick={onClick}
      className="aspect-[2/3] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg relative"
      style={{ backgroundColor: style.bgColor }}
    >
      {/* Graphic - positioned in middle area, takes advantage of vertical space */}
      <div 
        className="absolute"
        style={{
          top: '18%',
          left: '16.66%',
          right: '10%',
          height: '45%',
          opacity: 0.5,
        }}
      >
        <SeriesGraphic series={series} />
      </div>

      {/* Text content - all left-aligned at 1/6 (16.66%) from left */}
      
      {/* Author - at top, Trade Gothic Next Regular */}
      <div 
        className="absolute uppercase tracking-[0.15em]"
        style={{ 
          top: '8%',
          left: '16.66%',
          right: '8%',
          color: style.textColor,
          fontSize: '11px',
          fontFamily: '"trade-gothic-next", "Helvetica Neue", sans-serif',
          fontWeight: 400,
        }}
      >
        {author}
      </div>

      {/* Title - at 3/4 down (72%), Trade Gothic Next Compressed Heavy */}
      <div 
        className="absolute uppercase leading-[0.95]"
        style={{ 
          top: '72%',
          left: '16.66%',
          right: '8%',
          color: style.textColor,
          fontSize: '24px',
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
          left: '16.66%',
        }}
      >
        <MaxwellEditionsLogo color={style.textColor} />
      </div>
    </div>
  )
}

// Export types for use in page
export type { Series }
export { seriesStyles }