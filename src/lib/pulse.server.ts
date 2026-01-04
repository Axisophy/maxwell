import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { PulsePost, PulseTopic } from './pulse'

// ===========================================
// PULSE SERVER UTILITIES
// ===========================================
// Server-only functions for reading MDX files
// Only import this file from Server Components or API routes
// ===========================================

const PULSE_DIR = path.join(process.cwd(), 'content/pulse')

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
