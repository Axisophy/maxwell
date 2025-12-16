'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import type { VaultBook, Chapter } from '@/lib/vault-content'

interface BookReaderProps {
  book: VaultBook
}

export default function BookReader({ book }: BookReaderProps) {
  const [tocOpen, setTocOpen] = useState(false)
  const [activeChapter, setActiveChapter] = useState<string>('')

  // Track which chapter is currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    // Observe all chapter headings
    book.chapters.forEach(chapter => {
      const el = document.getElementById(chapter.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [book.chapters])

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Mobile top spacing */}
      <div className="h-14 md:hidden" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#fafafa]/95 backdrop-blur-sm border-b border-black/5">
        <div className="px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between">
          <Link 
            href="/vault" 
            className="text-sm text-black/50 hover:text-black transition-colors"
          >
            ← Back to Vault
          </Link>
          
          {/* Mobile TOC toggle */}
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="md:hidden text-sm text-black/50 hover:text-black"
          >
            Contents
          </button>
        </div>
      </header>

      {/* Mobile TOC drawer */}
      {tocOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setTocOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white p-6 overflow-y-auto">
            <button
              onClick={() => setTocOpen(false)}
              className="absolute top-4 right-4 text-black/50"
            >
              ✕
            </button>
            <h3 className="font-medium text-sm uppercase tracking-wider text-black/50 mb-4">
              Contents
            </h3>
            <TableOfContents 
              chapters={book.chapters} 
              activeChapter={activeChapter}
              onSelect={() => setTocOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
        <div className="max-w-[640px] mx-auto">
          {/* Title block */}
          <div className="text-center mb-12 md:mb-16">
            <h1 
              className="text-2xl md:text-3xl lg:text-4xl uppercase leading-tight mb-4"
              style={{ 
                fontFamily: 'trade-gothic-next-condensed, sans-serif',
                fontWeight: 700,
              }}
            >
              {book.title}
            </h1>
            <p className="text-base text-black/60 mb-1">
              {book.author}
            </p>
            <p className="text-sm text-black/40">
              {book.yearDisplay}
            </p>
          </div>

          {/* Desktop TOC */}
          <div className="hidden md:block mb-12 p-6 bg-white rounded-lg border border-black/10">
            <h3 className="font-medium text-sm uppercase tracking-wider text-black/50 mb-4">
              Contents
            </h3>
            <TableOfContents 
              chapters={book.chapters} 
              activeChapter={activeChapter}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center mb-12">
            <div className="w-16 h-px bg-black/20" />
            <div className="w-2 h-2 rounded-full bg-black/20 mx-4" />
            <div className="w-16 h-px bg-black/20" />
          </div>

          {/* Content */}
          <article className="prose-vault">
            <ReactMarkdown
              components={{
                h2: ({ children }) => {
                  const text = String(children)
                  const id = slugify(text)
                  return (
                    <h2 
                      id={id} 
                      className="scroll-mt-24 text-xl md:text-2xl font-light uppercase tracking-wide text-center mt-16 mb-8 pt-8 border-t border-black/10"
                    >
                      {children}
                    </h2>
                  )
                },
                h3: ({ children }) => {
                  const text = String(children)
                  const id = slugify(text)
                  return (
                    <h3 
                      id={id}
                      className="scroll-mt-24 text-lg font-medium mt-10 mb-4"
                    >
                      {children}
                    </h3>
                  )
                },
                p: ({ children }) => (
                  <p 
                    className="mb-6 leading-[1.75]"
                    style={{ 
                      fontFamily: 'sabon, Georgia, serif',
                      fontSize: '1.125rem',
                    }}
                  >
                    {children}
                  </p>
                ),
                blockquote: ({ children }) => (
                  <blockquote 
                    className="border-l-2 border-black/20 pl-6 my-8 italic"
                    style={{ fontFamily: 'sabon, Georgia, serif' }}
                  >
                    {children}
                  </blockquote>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
              }}
            >
              {book.content}
            </ReactMarkdown>
          </article>

          {/* End divider */}
          <div className="flex items-center justify-center mt-16 mb-8">
            <div className="w-8 h-px bg-black/20" />
            <div className="mx-4 text-black/30 text-sm">THE END</div>
            <div className="w-8 h-px bg-black/20" />
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-black/40 mb-8">
            <p>This text is in the public domain.</p>
            <p className="mt-2">
              <Link href="/vault" className="underline hover:text-black">
                Return to the Vault
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile bottom spacing */}
      <div className="h-20 md:hidden" />
    </div>
  )
}

/**
 * Table of contents component
 */
function TableOfContents({ 
  chapters, 
  activeChapter,
  onSelect,
}: { 
  chapters: Chapter[]
  activeChapter: string
  onSelect?: () => void
}) {
  return (
    <nav className="space-y-1">
      {chapters.map((chapter) => (
        <a
          key={chapter.id}
          href={`#${chapter.id}`}
          onClick={onSelect}
          className={`
            block py-1.5 text-sm transition-colors
            ${chapter.level === 2 ? 'pl-4' : ''}
            ${activeChapter === chapter.id 
              ? 'text-black font-medium' 
              : 'text-black/50 hover:text-black'
            }
          `}
        >
          {chapter.title}
        </a>
      ))}
    </nav>
  )
}

/**
 * Convert text to URL-safe slug (must match lib/vault-content.ts)
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
