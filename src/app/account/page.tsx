import { UserProfile } from '@clerk/nextjs'

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-shell-light">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="px-4 md:px-8 lg:px-12 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-text-primary">Account</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your profile and preferences
          </p>
        </div>

        {/* Clerk UserProfile component */}
        <div className="max-w-3xl">
          <UserProfile
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none border border-neutral-200 rounded-xl bg-white w-full',
                navbar: 'hidden',
                pageScrollBox: 'p-0',
                profilePage: 'p-6',
                profileSectionTitle: 'text-lg font-normal text-black border-b border-neutral-100 pb-2 mb-4',
                profileSectionContent: 'text-sm',
                formButtonPrimary: 'bg-black hover:bg-neutral-800 text-white font-medium rounded-lg h-10 text-sm',
                formFieldInput: 'border-neutral-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black h-10',
                formFieldLabel: 'text-neutral-700 font-normal text-sm',
                avatarBox: 'w-16 h-16',
              },
            }}
          />
        </div>
      </div>

      {/* Mobile bottom padding for nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
