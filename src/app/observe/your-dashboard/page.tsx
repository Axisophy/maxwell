export default function YourDashboardPage() {
  return (
    <main className="min-h-screen bg-shell-light">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-xl">
          <h1 className="text-2xl font-light text-text-primary mb-4">
            Your Dashboard
          </h1>
          <p className="text-text-secondary">
            Your custom dashboard is coming soon. You'll be able to choose which
            widgets to display and arrange them how you like.
          </p>
        </div>
      </div>

      {/* Mobile bottom padding for nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
