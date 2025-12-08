export default function DataPage() {
    return (
      <main className="min-h-screen bg-shell-light">
        {/* Mobile top padding */}
        <div className="h-14 md:hidden" />
        
        <div className="px-4 md:px-8 lg:px-12 py-8">
          <h1 className="text-2xl font-medium mb-2">Data</h1>
          <p className="text-text-muted mb-8">
            Reference datasets beautifully presented — elements, particles, constants, and more.
          </p>
          
          <div className="text-sm text-text-muted">
            Coming soon — periodic table, standard model, electromagnetic spectrum, and more
          </div>
        </div>
        
        {/* Mobile bottom padding */}
        <div className="h-20 md:hidden" />
      </main>
    )
  }