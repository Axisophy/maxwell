import Link from 'next/link'
import { ReactNode } from 'react'

/**
 * BreadcrumbFrame - A standardised breadcrumb navigation component
 *
 * Part of the MXWLL UI component library.
 * Works in both Server Components and Client Components.
 *
 * @example
 * // Light variant (white frame on black background)
 * <BreadcrumbFrame
 *   variant="light"
 *   items={breadcrumbItems(
 *     ['MXWLL', '/'],
 *     ['Observe', '/observe'],
 *     ['Space Weather']
 *   )}
 * />
 *
 * @example
 * // Dark variant with section icon
 * <BreadcrumbFrame
 *   variant="dark"
 *   icon={<WaveIcon className="w-4 h-4" />}
 *   items={breadcrumbItems(
 *     ['MXWLL', '/'],
 *     ['Observe', '/observe'],
 *     ['Space', '/observe/space'],
 *     ['Solar Observatory']
 *   )}
 * />
 */

// ============================================================================
// Types
// ============================================================================

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbFrameProps {
  /** Colour scheme - 'light' for white frames, 'dark' for dark grey frames */
  variant: 'light' | 'dark'
  /** Breadcrumb items array */
  items: BreadcrumbItem[]
  /** Optional section icon displayed before breadcrumb links */
  icon?: ReactNode
  /** Additional className for the outer wrapper */
  className?: string
}

// ============================================================================
// Design Tokens
// ============================================================================

const variants = {
  light: {
    frame: 'bg-white',
    text: 'text-black/50',
    textHover: 'hover:text-black',
    textCurrent: 'text-black',
    separator: 'text-black/30',
    iconColor: 'text-black',  // Full colour for section icon
  },
  dark: {
    frame: 'bg-[#1d1d1d]',
    text: 'text-white/50',
    textHover: 'hover:text-white',
    textCurrent: 'text-white',
    separator: 'text-white/30',
    iconColor: 'text-white',  // Full colour for section icon
  },
}

// ============================================================================
// Main Component
// ============================================================================

export function BreadcrumbFrame({
  variant,
  items,
  icon,
  className = '',
}: BreadcrumbFrameProps) {
  const styles = variants[variant]

  return (
    <div className={`mb-px ${className}`}>
      <div className={`${styles.frame} rounded-lg py-1 md:py-2 px-2 md:px-4`}>
        <nav
          className="flex items-center gap-2 text-xs font-sans"
          aria-label="Breadcrumb"
        >
          {/* Optional section icon */}
          {icon && (
            <span className={`${styles.iconColor} flex-shrink-0`}>
              {icon}
            </span>
          )}

          {/* Breadcrumb links */}
          <div className="flex items-center gap-2 flex-wrap">
            {items.map((item, index) => {
              const isLast = index === items.length - 1

              return (
                <span key={`${item.label}-${index}`} className="flex items-center gap-2">
                  {index > 0 && (
                    <span className={styles.separator}>/</span>
                  )}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className={`${styles.text} ${styles.textHover} transition-colors`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={styles.textCurrent}>{item.label}</span>
                  )}
                </span>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}

// ============================================================================
// Helper Function
// ============================================================================

/**
 * Helper function to create breadcrumb items array
 *
 * @example
 * const items = breadcrumbItems(
 *   ['MXWLL', '/'],
 *   ['Observe', '/observe'],
 *   ['Space Weather']  // No href = current page
 * )
 */
export function breadcrumbItems(
  ...args: ([string, string] | [string])[]
): BreadcrumbItem[] {
  return args.map(([label, href]) => ({
    label,
    ...(href && { href }),
  }))
}

// ============================================================================
// Default Export
// ============================================================================

export default BreadcrumbFrame
