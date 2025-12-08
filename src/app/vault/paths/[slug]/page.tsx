import Link from 'next/link'
import { notFound } from 'next/navigation'
import BookWidget from '@/components/BookWidget'
import { getPathBySlug, readingPaths } from '@/lib/reading-paths'
import { getBookBySlug } from '@/lib/books'

export function generateStaticParams() {
  return readingPaths.map((path) => ({
    slug: path.slug,
  }))
}

export default function PathPage({ params }: { params: { slug: string } }) {
  const path = getPathBySlug(params.slug)
  
  if (!path) {
    notFound()
  }

  const books = path.bookSlugs
    .map(slug => getBookBySlug(slug))
    .filter((book): book is NonNullable<typeof book> => book !== undefined)

  return (
    <main className="min-h-screen bg-shell-light">
      <div className="h-14 md:hidden" />
      
      <div className="px-4 md:px-8 lg:px-12 py-8">
        {/* Back link */}
        <Link 
          href="/vault/paths" 
          className="text-sm text-text-muted hover:text-text-primary mb-6 block"
        >
          ← All Reading Paths
        </Link>

        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <p className="text-2xl md:text-3xl font-light text-text-primary mb-3">
            "{path.question}"
          </p>
          <p className="text-text-muted">{path.description}</p>
        </div>

        {/* Books with explanations */}
        <div className="space-y-8 md:space-y-12">
          {books.map((book, index) => (
            <div key={book.slug} className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] gap-6">
              {/* Book cover */}
              <div className="w-40 md:w-full">
                <BookWidget
                  slug={book.slug}
                  title={book.title}
                  author={book.author}
                  authorDates={book.authorDates}
                  yearDisplay={book.yearDisplay}
                  series={book.series}
                  description={book.description}
                  readingTime={book.readingTime}
                  pageCount={book.pageCount}
                />
              </div>

              {/* Explanation */}
              <div className="flex flex-col justify-center">
                <span className="text-xs text-text-muted mb-1">{index + 1} of {books.length}</span>
                <h2 className="text-xl font-normal text-text-primary mb-1">
                  {book.title}
                </h2>
                <p className="text-sm text-text-muted mb-3">
                  {book.author}{book.authorDates ? `, ${book.authorDates}` : ''} · {book.yearDisplay}
                </p>
                <p className="text-text-primary leading-relaxed">
                  {path.explanations[book.slug]}
                </p>
                <Link 
                  href={`/vault/${book.slug}`}
                  className="text-sm text-text-muted hover:text-text-primary mt-4 inline-block"
                >
                  Start reading →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-20 md:hidden" />
    </main>
  )
}