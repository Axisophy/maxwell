import Link from 'next/link'

const eras = [
  {
    id: 'ancient',
    name: 'Ancient',
    period: 'Before 1500',
    description: 'The foundations of scientific thought from Euclid, Aristotle, and the classical world.',
    count: 25,
  },
  {
    id: 'renaissance',
    name: 'Renaissance',
    period: '1500–1800',
    description: 'The scientific revolution: Copernicus, Galileo, Newton, and the birth of modern science.',
    count: 40,
  },
  {
    id: 'modern',
    name: 'Modern',
    period: '1800–1950',
    description: 'Darwin, Maxwell, Einstein, and the explosive growth of scientific knowledge.',
    count: 95,
  },
]

export default function VaultPage() {
  return (
    <main className="min-h-screen bg-shell-light">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />
      
      <div className="px-8 lg:px-12 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-text-primary mb-2">Vault</h1>
          <p className="text-text-muted max-w-2xl">
            A curated collection of scientific texts spanning 2,500 years of human inquiry. 
            Public domain works presented as beautiful, readable digital editions.
          </p>
        </div>

        {/* Era cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {eras.map((era) => (
            <Link
              key={era.id}
              href={`/knowledge?era=${era.id}`}
              className="bg-white rounded-xl border border-[#e5e5e5] p-6 hover:border-text-primary transition-colors group"
            >
              <h2 className="text-xl font-normal text-text-primary mb-1 group-hover:underline">
                {era.name}
              </h2>
              <span className="text-sm text-text-muted block mb-3">{era.period}</span>
              <p className="text-sm text-text-primary mb-4">{era.description}</p>
              <span className="text-xs text-text-muted">
                {era.count} works →
              </span>
            </Link>
          ))}
        </div>

        {/* Additional sections */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
            <h3 className="text-lg font-normal text-text-primary mb-2">Canon</h3>
            <p className="text-sm text-text-muted mb-4">
              Commentary on significant modern books still under copyright. 
              Our take on Kuhn, Dawkins, Sagan, and more.
            </p>
            <span className="text-xs text-text-muted">Coming soon</span>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
            <h3 className="text-lg font-normal text-text-primary mb-2">Papers</h3>
            <p className="text-sm text-text-muted mb-4">
              Landmark journal articles where breakthroughs first appeared. 
              Many are surprisingly short.
            </p>
            <span className="text-xs text-text-muted">Coming soon</span>
          </div>
        </div>
      </div>
      
      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}