'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import BookWidget, { type Series } from '@/components/BookWidget'

type SortOption = 'chronological' | 'alphabetical-title' | 'alphabetical-author'
type Era = 'all' | 'ancient' | 'renaissance' | 'modern'

// Book data with intellectual series assignments
// Note: Books are DISPLAYED chronologically but DESIGNED by series
const books = [
  {
    slug: 'elements',
    title: 'Elements',
    author: 'Euclid',
    year: -300,
    yearDisplay: '~300 BCE',
    era: 'ancient' as Era,
    series: 'geometry' as Series,
  },
  {
    slug: 'history-of-animals',
    title: 'The History of Animals',
    author: 'Aristotle',
    year: -350,
    yearDisplay: '~350 BCE',
    era: 'ancient' as Era,
    series: 'natural-philosophy' as Series,
  },
  {
    slug: 'revolutions',
    title: 'On the Revolutions of Heavenly Spheres',
    author: 'Copernicus',
    year: 1543,
    yearDisplay: '1543',
    era: 'renaissance' as Era,
    series: 'heavens' as Series,
  },
  {
    slug: 'dialogue',
    title: 'Dialogue Concerning Two Chief World Systems',
    author: 'Galileo',
    year: 1632,
    yearDisplay: '1632',
    era: 'renaissance' as Era,
    series: 'heavens' as Series,
  },
  {
    slug: 'micrographia',
    title: 'Micrographia',
    author: 'Robert Hooke',
    year: 1665,
    yearDisplay: '1665',
    era: 'renaissance' as Era,
    series: 'observers' as Series,
  },
  {
    slug: 'principia',
    title: 'Principia Mathematica',
    author: 'Isaac Newton',
    year: 1687,
    yearDisplay: '1687',
    era: 'renaissance' as Era,
    series: 'forces-fields' as Series,
  },
  {
    slug: 'origin-of-species',
    title: 'On the Origin of Species',
    author: 'Charles Darwin',
    year: 1859,
    yearDisplay: '1859',
    era: 'modern' as Era,
    series: 'living-world' as Series,
  },
  {
    slug: 'electromagnetic-field',
    title: 'A Dynamical Theory of the Electromagnetic Field',
    author: 'James Clerk Maxwell',
    year: 1865,
    yearDisplay: '1865',
    era: 'modern' as Era,
    series: 'forces-fields' as Series,
  },
  {
    slug: 'plant-hybridization',
    title: 'Experiments on Plant Hybridization',
    author: 'Gregor Mendel',
    year: 1866,
    yearDisplay: '1866',
    era: 'modern' as Era,
    series: 'living-world' as Series,
  },
]

const eraLabels: Record<Era, string> = {
  all: 'All Eras',
  ancient: 'Ancient',
  renaissance: 'Renaissance',
  modern: 'Modern',
}

function VaultContent() {
  const searchParams = useSearchParams()
  const eraParam = searchParams.get('era') as Era | null
  
  const [sortBy, setSortBy] = useState<SortOption>('chronological')
  const [expandedBook, setExpandedBook] = useState<string | null>(null)
  
  const currentEra: Era = eraParam && ['ancient', 'renaissance', 'modern'].includes(eraParam) 
    ? eraParam 
    : 'all'

  // Filter by era
  const filteredBooks = currentEra === 'all' 
    ? books 
    : books.filter(book => book.era === currentEra)

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'chronological':
        return a.year - b.year
      case 'alphabetical-title':
        return a.title.localeCompare(b.title)
      case 'alphabetical-author':
        return a.author.localeCompare(b.author)
      default:
        return 0
    }
  })

  const handleBookClick = (slug: string) => {
    setExpandedBook(expandedBook === slug ? null : slug)
    // TODO: This will open the reader view
    console.log('Open book:', slug)
  }

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-sans-display font-light text-text-primary">
            {currentEra === 'all' ? 'Vault' : eraLabels[currentEra]}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {sortedBooks.length} {sortedBooks.length === 1 ? 'work' : 'works'}
          </p>
        </div>

        {/* Sort control */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm text-text-primary bg-transparent border border-border-light rounded px-2 py-1 focus:outline-none"
          >
            <option value="chronological">Chronological</option>
            <option value="alphabetical-title">Title A–Z</option>
            <option value="alphabetical-author">Author A–Z</option>
          </select>
        </div>
      </div>

      {/* Book grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {sortedBooks.map((book) => (
          <BookWidget
            key={book.slug}
            slug={book.slug}
            title={book.title}
            author={book.author}
            yearDisplay={book.yearDisplay}
            series={book.series}
            onClick={() => handleBookClick(book.slug)}
          />
        ))}
      </div>
    </>
  )
}

export default function VaultPage() {
  return (
    <main className="w-full px-8 lg:px-12 py-8">
      <Suspense fallback={<div className="text-text-muted">Loading...</div>}>
        <VaultContent />
      </Suspense>
    </main>
  )
}