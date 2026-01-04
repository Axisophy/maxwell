import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const PULSE_DIR = path.join(process.cwd(), 'content/pulse')

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

export function getAllPosts(): PulsePost[] {
  if (!fs.existsSync(PULSE_DIR)) {
    return []
  }

  const files = fs.readdirSync(PULSE_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((filename) => {
    const filePath = path.join(PULSE_DIR, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: filename.replace('.mdx', ''),
      content,
      ...data,
    } as PulsePost
  })

  // Sort by featuredOrder first (if set), then by date
  return posts.sort((a, b) => {
    if (a.featuredOrder !== null && b.featuredOrder !== null) {
      return a.featuredOrder - b.featuredOrder
    }
    if (a.featuredOrder !== null) return -1
    if (b.featuredOrder !== null) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getPostBySlug(slug: string): PulsePost | null {
  const filePath = path.join(PULSE_DIR, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    content,
    ...data,
  } as PulsePost
}

export function getPostsByTopic(topic: PulseTopic): PulsePost[] {
  return getAllPosts().filter((post) => post.topic === topic)
}

export function getFeaturedPost(): PulsePost | null {
  const posts = getAllPosts()
  return posts.find((post) => post.featured) || posts[0] || null
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
