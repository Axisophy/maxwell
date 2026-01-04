'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

/**
 * BreadcrumbFrame - A standardised breadcrumb navigation component
 *
 * Part of the MXWLL UI component library.
 * Encapsulates all design decisions for breadcrumb frames across the site.
 *
 * @example
 * // Light variant (white frame on black background)
 * <BreadcrumbFrame variant="light">
 *   <BreadcrumbFrame.Link href="/">MXWLL</BreadcrumbFrame.Link>
 *   <BreadcrumbFrame.Link href="/observe">Observe</BreadcrumbFrame.Link>
 *   <BreadcrumbFrame.Current>Space Weather</BreadcrumbFrame.Current>
 * </BreadcrumbFrame>
 *
 * @example
 * // Dark variant with section icon
 * <BreadcrumbFrame variant="dark" icon={<WaveIcon className="w-4 h-4" />}>
 *   <BreadcrumbFrame.Link href="/">MXWLL</BreadcrumbFrame.Link>
 *   <BreadcrumbFrame.Link href="/observe/space">Space</BreadcrumbFrame.Link>
 *   <BreadcrumbFrame.Current>Solar Observatory</BreadcrumbFrame.Current>
 * </BreadcrumbFrame>
 *
 * @example
 * // Using items array for simpler cases
 * <BreadcrumbFrame
 *   variant="light"
 *   items={[
 *     { label: 'MXWLL', href: '/' },
 *     { label: 'Observe', href: '/observe' },
 *     { label: 'Space Weather' },
 *   ]}
 * />
 */

// ============================================================================
// Types
// ============================================================================

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbFrameProps {
  /** Colour scheme - 'light' for white frames, 'dark' for dark grey frames */
  variant: 'light' | 'dark'
  /** Optional section icon displayed before breadcrumb links */
  icon?: ReactNode
  /** Children (use BreadcrumbFrame.Link and BreadcrumbFrame.Current) */
  children?: ReactNode
  /** Alternative: pass items as an array */
  items?: BreadcrumbItem[]
  /** Additional className for the outer wrapper */
  className?: string
}

interface BreadcrumbLinkProps {
  href: string
  children: ReactNode
}

interface BreadcrumbCurrentProps {
  children: ReactNode
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
    iconColor: 'text-black/40',
  },
  dark: {
    frame: 'bg-[#1d1d1d]',
    text: 'text-white/50',
    textHover: 'hover:text-white',
    textCurrent: 'text-white',
    separator: 'text-white/30',
    iconColor: 'text-white/40',
  },
}

// ============================================================================
// Sub-components
// ============================================================================

function BreadcrumbLink({ href, children }: BreadcrumbLinkProps) {
  // Styling is applied by parent via CSS variables or context
  // For now, we rely on the parent's className cascade
  return (
    <Link href={href} className="breadcrumb-link transition-colors">
      {children}
    </Link>
  )
}

function BreadcrumbCurrent({ children }: BreadcrumbCurrentProps) {
  return <span className="breadcrumb-current">{children}</span>
}

function BreadcrumbSeparator() {
  return <span className="breadcrumb-separator">/</span>
}

// ============================================================================
// Main Component
// ============================================================================

export function BreadcrumbFrame({
  variant,
  icon,
  children,
  items,
  className = '',
}: BreadcrumbFrameProps) {
  const styles = variants[variant]

  // If items array provided, render from that
  const renderFromItems = () => {
    if (!items || items.length === 0) return null

    return items.map((item, index) => {
      const isLast = index === items.length - 1

      return (
        <span key={item.label} className="flex items-center gap-2">
          {index > 0 && <span className={styles.separator}>/</span>}
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
    })
  }

  // Process children to inject separators and styling
  const renderFromChildren = () => {
    if (!children) return null

    const childArray = Array.isArray(children) ? children : [children]
    const processedChildren: ReactNode[] = []

    childArray.forEach((child, index) => {
      if (index > 0) {
        processedChildren.push(
          <span key={`sep-${index}`} className={styles.separator}>
            /
          </span>
        )
      }
      processedChildren.push(child)
    })

    return processedChildren
  }

  return (
    <div className={`mb-px ${className}`}>
      <div className={`${styles.frame} rounded-lg py-1 md:py-2 px-2 md:px-4`}>
        <nav
          className={`flex items-center gap-2 text-sm ${styles.text}`}
          aria-label="Breadcrumb"
          style={
            {
              // CSS custom properties for child styling
              '--breadcrumb-text': styles.text,
              '--breadcrumb-hover': styles.textHover,
              '--breadcrumb-current': styles.textCurrent,
            } as React.CSSProperties
          }
        >
          {/* Optional section icon */}
          {icon && <span className={`${styles.iconColor} flex-shrink-0`}>{icon}</span>}

          {/* Breadcrumb links */}
          <div className="flex items-center gap-2 flex-wrap">
            {items ? renderFromItems() : renderFromChildren()}
          </div>
        </nav>
      </div>
    </div>
  )
}

// Attach sub-components for compound component pattern
BreadcrumbFrame.Link = BreadcrumbLink
BreadcrumbFrame.Current = BreadcrumbCurrent
BreadcrumbFrame.Separator = BreadcrumbSeparator

// ============================================================================
// Simplified API - BreadcrumbItems helper
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
export function breadcrumbItems(...args: ([string, string] | [string])[]): BreadcrumbItem[] {
  return args.map(([label, href]) => ({
    label,
    ...(href && { href }),
  }))
}

// ============================================================================
// Default Export
// ============================================================================

export default BreadcrumbFrame
