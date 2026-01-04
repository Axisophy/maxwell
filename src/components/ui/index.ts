/**
 * MXWLL UI Component Library
 *
 * Standardised, reusable components that encode design decisions.
 * All components work in both Server and Client Components.
 *
 * @example
 * import { PageShell, BreadcrumbFrame, breadcrumbItems } from '@/components/ui'
 */

// Layout
export { PageShell } from './PageShell'

// Navigation
export { BreadcrumbFrame, breadcrumbItems } from './BreadcrumbFrame'
export type { BreadcrumbItem } from './BreadcrumbFrame'

// Legacy Breadcrumb (without frame wrapper) - prefer BreadcrumbFrame for new code
export { default as Breadcrumb } from './Breadcrumb'
