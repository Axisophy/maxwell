import Link from 'next/link'
import { getBooksByEra } from '@/lib/books'
import { readingPaths } from '@/lib/reading-paths'

const eras = [
  {
    id: 'ancient',
    href: '/vault/ancient',
    name: 'Ancient',
    period: 'Before 1500',
    description: 'The foundations of scientific thought from Euclid, Aristotle, and the classical world.',
  },
  {
    id: 'renaissance',
    href: '/vault/renaissance',
    name: 'Renaissance',
    period: '1500–1800',
    description: 'The Scientific Revolution: Copernicus, Galileo, Newton, and the birth of modern science.',
  },
  {
    id: 'modern',
    href: '/vault/modern',
    name: 'Modern',
    period: '1800–1950',
    description: 'Darwin, Maxwell, Einstein, and the explosive growth of scientific knowledge.',
  },
  {
    id: 'scientific-fiction',
    href: '/vault/scientific-fiction',
    name: 'Scientific Fiction',
    period: '1818–1920',
    description: 'Shelley, Verne, Wells, Čapek — the birth of science fiction as a literary form.',
  },
]

export default function VaultPage() {
  // Get a few featured paths
  const featuredPaths = readingPaths.slice(0, 3)

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="h-14 md:hidden" />
      
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">Vault</h1>
          <p className="text-base md:text-lg text-black max-w-2xl">
            A curated collection of scientific texts spanning 2,500 years of human inquiry. 
            Public domain works presented as beautiful, readable digital editions.
          </p>
        </div>

        {/* Browse by Era */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">Browse by Era</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eras.map((era) => {
              const books = getBooksByEra(era.id as any)
              return (
                <Link
                  key={era.id}
                  href={era.href}
                  className="bg-white rounded-xl border border-[#e5e5e5] p-5 hover:border-black transition-colors group"
                >
                  <h3 className="text-lg font-medium text-black mb-1 group-hover:underline">
                    {era.name}
                  </h3>
                  <span className="text-sm text-black/50 block mb-2">{era.period}</span>
                  <p className="text-sm text-black mb-3">{era.description}</p>
                  <span className="text-xs text-black/50">
                    {books.length} works →
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Reading Paths */}
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-light text-black">Reading Paths</h2>
            <Link 
              href="/vault/paths" 
              className="text-sm text-black/50 hover:text-black"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredPaths.map((path) => (
              <Link
                key={path.slug}
                href={`/vault/paths/${path.slug}`}
                className="bg-white rounded-xl border border-[#e5e5e5] p-5 hover:border-black transition-colors group"
              >
                <p className="text-base font-medium text-black mb-2 group-hover:underline">
                  "{path.question}"
                </p>
                <p className="text-sm text-black/50 line-clamp-2">{path.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Coming Soon */}
        <section>
          <h2 className="text-xl md:text-2xl font-light text-black mb-4">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-5 opacity-70">
              <h3 className="text-base font-medium text-black mb-2">Canon</h3>
              <p className="text-sm text-black/50">
                Commentary on significant modern books still under copyright. 
                Our take on Kuhn, Dawkins, Sagan, and more.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e5e5] p-5 opacity-70">
              <h3 className="text-base font-medium text-black mb-2">Papers</h3>
              <p className="text-sm text-black/50">
                Landmark journal articles where breakthroughs first appeared. 
                Watson & Crick's DNA paper is one page.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e5e5] p-5 opacity-70">
              <h3 className="text-base font-medium text-black mb-2">Maps & Timelines</h3>
              <p className="text-sm text-black/50">
                Visual discovery — trace who influenced whom, 
                see where ideas emerged geographically.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e5e5] p-5 opacity-70">
              <h3 className="text-base font-medium text-black mb-2">Your Library</h3>
              <p className="text-sm text-black/50">
                Track what you've read, save favourites, 
                pick up where you left off.
              </p>
            </div>
          </div>
        </section>
      </div>
      
      <div className="h-20 md:hidden" />
    </main>
  )
}