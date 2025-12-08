import Link from 'next/link'
import { readingPaths } from '@/lib/reading-paths'

export default function PathsPage() {
  const moodPaths = readingPaths.filter(p => p.category === 'mood')
  const depthPaths = readingPaths.filter(p => p.category === 'depth')

  return (
    <main className="min-h-screen bg-shell-light">
      <div className="h-14 md:hidden" />
      
      <div className="px-4 md:px-8 lg:px-12 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-text-primary mb-2">Reading Paths</h1>
          <p className="text-text-muted max-w-2xl">
            Curated journeys through the collection. Not sure where to start? 
            Tell us what you're in the mood for.
          </p>
        </div>

        {/* Mood-based paths */}
        <section className="mb-12">
          <h2 className="text-lg font-normal text-text-primary mb-4">What are you in the mood for?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moodPaths.map((path) => (
              <Link
                key={path.slug}
                href={`/vault/paths/${path.slug}`}
                className="bg-white rounded-xl border border-[#e5e5e5] p-5 hover:border-text-primary transition-colors group"
              >
                <p className="text-lg font-normal text-text-primary mb-2 group-hover:underline">
                  "{path.question}"
                </p>
                <p className="text-sm text-text-muted line-clamp-2">{path.description}</p>
                <span className="text-xs text-text-muted mt-3 block">
                  {path.bookSlugs.length} books →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Depth-based paths */}
        <section className="mb-12">
          <h2 className="text-lg font-normal text-text-primary mb-4">By difficulty</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {depthPaths.map((path) => (
              <Link
                key={path.slug}
                href={`/vault/paths/${path.slug}`}
                className="bg-white rounded-xl border border-[#e5e5e5] p-5 hover:border-text-primary transition-colors group"
              >
                <p className="text-lg font-normal text-text-primary mb-2 group-hover:underline">
                  {path.title}
                </p>
                <p className="text-sm text-text-muted line-clamp-2">{path.description}</p>
                <span className="text-xs text-text-muted mt-3 block">
                  {path.bookSlugs.length} books →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Future sections */}
        <section>
          <h2 className="text-lg font-normal text-text-primary mb-4">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-5">
              <p className="text-lg font-normal text-text-primary mb-2">Top 5 by Subject</p>
              <p className="text-sm text-text-muted">
                Biology, Physics, Mathematics, Philosophy of Science...
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-5">
              <p className="text-lg font-normal text-text-primary mb-2">Maps & Timelines</p>
              <p className="text-sm text-text-muted">
                Visual exploration — who influenced whom, where ideas emerged.
              </p>
            </div>
          </div>
        </section>
      </div>
      
      <div className="h-20 md:hidden" />
    </main>
  )
}