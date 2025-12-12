import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-shell-light flex flex-col">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-light tracking-wide">MXWLL</span>
            </Link>
            <h1 className="text-xl font-light text-text-primary">Create your account</h1>
            <p className="text-sm text-text-secondary mt-1">
              Join the laboratory
            </p>
          </div>

          {/* Clerk SignUp */}
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none border-0 bg-transparent p-0 w-full',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border-neutral-200 hover:bg-neutral-50 rounded-lg h-11',
                socialButtonsBlockButtonText: 'font-normal text-sm',
                dividerLine: 'bg-neutral-200',
                dividerText: 'text-neutral-400 text-xs bg-shell-light',
                formFieldInput: 'border-neutral-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black h-11',
                formFieldLabel: 'text-neutral-700 font-normal text-sm',
                formButtonPrimary: 'bg-black hover:bg-neutral-800 text-white font-medium rounded-lg h-11 text-sm',
                footerAction: 'justify-center',
                footerActionLink: 'text-black hover:text-neutral-600 font-medium',
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