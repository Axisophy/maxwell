import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'vault')

export interface VaultBook {
  slug: string
  title: string
  author: string
  authorDates?: string
  year: number
  yearDisplay: string
  series: string
  description?: string
  chapters: Chapter[]
  content: string
}

export interface Chapter {
  id: string
  title: string
  level: number // 1 for main chapters, 2 for sub-sections
}

/**
 * Get a single book by slug
 */
export function getVaultBook(slug: string): VaultBook | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  
  // Extract chapters from headings
  const chapters = extractChapters(content)
  
  return {
    slug,
    title: data.title,
    author: data.author,
    authorDates: data.authorDates,
    year: data.year,
    yearDisplay: data.yearDisplay,
    series: data.series,
    description: data.description,
    chapters,
    content,
  }
}

/**
 * Get all available vault books (metadata only)
 */
export function getAllVaultBooks(): Omit<VaultBook, 'content' | 'chapters'>[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return []
  }
  
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'))
  
  return files.map(filename => {
    const slug = filename.replace('.mdx', '')
    const filePath = path.join(CONTENT_DIR, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)
    
    return {
      slug,
      title: data.title,
      author: data.author,
      authorDates: data.authorDates,
      year: data.year,
      yearDisplay: data.yearDisplay,
      series: data.series,
      description: data.description,
    }
  })
}

/**
 * Extract chapter headings from markdown content
 */
function extractChapters(content: string): Chapter[] {
  const chapters: Chapter[] = []
  const lines = content.split('\n')
  
  for (const line of lines) {
    // Match ## or ### headings
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length - 1 // ## = level 1, ### = level 2
      const title = match[2].trim()
      const id = slugify(title)
      chapters.push({ id, title, level })
    }
  }
  
  return chapters
}

/**
 * Convert a heading to a URL-safe slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
