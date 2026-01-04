import { ReactNode } from 'react'

/**
 * PageShell - Standardised page wrapper component
 *
 * Provides the consistent black background and responsive padding
 * used across all MXWLL pages. Replaces scattered inline styles.
 *
 * @example
 * // Basic usage
 * <PageShell>
 *   <BreadcrumbFrame ... />
 *   <ContentFrame>...</ContentFrame>
 * </PageShell>
 *
 * @example
 * // With custom className
 * <PageShell className="some-additional-class">
 *   ...
 * </PageShell>
 */

// ============================================================================
// Design Tokens
// ============================================================================

/**
 * Page Layout Tokens
 *
 * These values are defined in the MXWLL Design System:
 *
 * | Breakpoint | Horizontal | Vertical (top) | Vertical (bottom) |
 * |------------|------------|----------------|-------------------|
 * | Mobile     | 8px        | 8px            | 16px              |
 * | Tablet+    | 16px       | 16px           | 32px              |
 *
 * Tailwind: px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8
 */

const SHELL_CLASSES = 'min-h-screen bg-black'
const CONTENT_CLASSES = 'px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8'

// ============================================================================
// Types
// ============================================================================

interface PageShellProps {
  /** Page content */
  children: ReactNode
  /** Additional className for the outer main element */
  className?: string
  /** Additional className for the inner content wrapper */
  contentClassName?: string
}

// ============================================================================
// Main Component
// ============================================================================

export function PageShell({
  children,
  className = '',
  contentClassName = '',
}: PageShellProps) {
  return (
    <main className={`${SHELL_CLASSES} ${className}`}>
      <div className={`${CONTENT_CLASSES} ${contentClassName}`}>
        {children}
      </div>
    </main>
  )
}

// ============================================================================
// Default Export
// ============================================================================

export default PageShell
