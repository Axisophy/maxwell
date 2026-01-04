import { ReactNode } from 'react'

/**
 * PageHeaderFrame - Standardised page header component
 *
 * Part of the MXWLL UI component library.
 * Works in both Server Components and Client Components.
 *
 * @example
 * // Light variant
 * <PageHeaderFrame
 *   variant="light"
 *   title="Observe"
 *   description="Live science happening right now. Real-time data from NASA, NOAA, CERN, and observatories worldwide."
 * />
 *
 * @example
 * // Dark variant
 * <PageHeaderFrame
 *   variant="dark"
 *   title="Solar Observatory"
 *   description="Real-time views of the Sun from NASA's Solar Dynamics Observatory."
 * />
 */

// ============================================================================
// Types
// ============================================================================

interface PageHeaderFrameProps {
  /** Colour scheme - 'light' for white frames, 'dark' for dark grey frames */
  variant: 'light' | 'dark'
  /** Page title (displayed in bold uppercase) */
  title: string
  /** Page description */
  description: string | ReactNode
  /** Additional className for the outer wrapper */
  className?: string
}

// ============================================================================
// Design Tokens
// ============================================================================

const variants = {
  light: {
    frame: 'bg-white',
    title: 'text-black',
    description: 'text-black/60',
  },
  dark: {
    frame: 'bg-[#1d1d1d]',
    title: 'text-white',
    description: 'text-white/60',
  },
}

// ============================================================================
// Main Component
// ============================================================================

export function PageHeaderFrame({
  variant,
  title,
  description,
  className = '',
}: PageHeaderFrameProps) {
  const styles = variants[variant]

  return (
    <section className={`${styles.frame} rounded-lg p-2 md:p-4 mb-px ${className}`}>
      <h1
        className={`
          text-3xl md:text-4xl lg:text-5xl
          font-sans font-bold
          tracking-[-0.03em]
          ${styles.title}
          mb-3
        `}
      >
        {title}
      </h1>
      <p className={`text-base md:text-lg ${styles.description} max-w-2xl`}>
        {description}
      </p>
    </section>
  )
}

// ============================================================================
// Default Export
// ============================================================================

export default PageHeaderFrame
