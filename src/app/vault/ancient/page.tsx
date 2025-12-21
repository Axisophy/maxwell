import BookWidget from '@/components/BookWidget'
import { getBooksByEra } from '@/lib/books'

export default function AncientPage() {
  const books = getBooksByEra('ancient')

  return (
    <main className="min-h-screen bg-shell-light">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />
      
      <div className="px-4 md:px-8 lg:px-12 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-text-primary mb-2">Ancient</h1>
          <p className="text-text-muted max-w-2xl">
            Before 1500 - The foundations of scientific thought from Euclid, Aristotle, 
            Archimedes, and the classical world.
          </p>
          <p className="text-sm text-text-muted mt-2">{books.length} works</p>
        </div>

        {/* Book grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {books.map((book) => (
            <BookWidget
              key={book.slug}
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
          ))}
        </div>
      </div>
      
      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}