// ===========================================
// PULSE TYPES AND UTILITIES
// ===========================================
// Shared types and formatting functions for Pulse section
// This file is safe to import from both client and server components
// ===========================================

export type PulseFormat =
  | 'signal'
  | 'field-note'
  | 'number'
  | 'question'
  | 'diagram'
  | 'inventory'
  | 'process'
  | 'comparison'
  | 'dispatch'
  | 'profile'
  | 'essay'
  | 'postcard'
  | 'special'
  | 'experiment'

export type PulseTopic = 'space' | 'earth' | 'life' | 'infra' | 'detectors'

export interface PulsePost {
  slug: string
  title: string
  format: PulseFormat
  topic: PulseTopic
  date: string
  featured: boolean
  featuredOrder: number | null
  excerpt: string
  readTime: number
  image?: string
  imageCaption?: string
  imageCredit?: string
  // Format-specific
  number?: string
  question?: string
  respondent?: string
  respondentTitle?: string
  respondentImage?: string
  // Cross-links
  observeLinks?: Array<{ label: string; href: string }>
  relatedPosts?: string[]
  // Content
  content: string
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatLabel(format: PulseFormat): string {
  const labels: Record<PulseFormat, string> = {
    signal: 'Signal',
    'field-note': 'Field Note',
    number: 'The Number',
    question: 'The Question',
    diagram: 'The Diagram',
    inventory: 'The Inventory',
    process: 'The Process',
    comparison: 'The Comparison',
    dispatch: 'Dispatch',
    profile: 'Profile',
    essay: 'Essay',
    postcard: 'Postcard',
    special: 'Special',
    experiment: 'Experiment',
  }
  return labels[format] || format
}
