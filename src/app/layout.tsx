import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import MobileHeader from '@/components/MobileHeader'
import MobileNav from '@/components/MobileNav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'MXWLL - A Digital Laboratory',
  description: 'Live data feeds, interactive instruments, scientific tools, and reference charts. Science, beautifully observed.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

// Clerk appearance config to match MXWLL design system
const clerkAppearance = {
  variables: {
    colorPrimary: '#000000',
    colorText: '#000000',
    colorTextSecondary: 'rgba(0, 0, 0, 0.5)',
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorInputText: '#000000',
    borderRadius: '8px',
  },
  elements: {
    card: 'shadow-none border border-neutral-200 rounded-xl bg-white',
    headerTitle: 'font-normal text-xl',
    headerSubtitle: 'text-neutral-500 text-sm',
    formButtonPrimary: 'bg-black hover:bg-neutral-800 text-white font-medium rounded-lg h-10 text-sm',
    formFieldInput: 'border-neutral-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black h-10',
    formFieldLabel: 'text-neutral-700 font-normal text-sm',
    footerActionLink: 'text-black hover:text-neutral-600',
    dividerLine: 'bg-neutral-200',
    dividerText: 'text-neutral-400 text-xs',
    socialButtonsBlockButton: 'border-neutral-200 hover:bg-neutral-50 rounded-lg h-10',
    socialButtonsBlockButtonText: 'font-normal text-sm',
    userButtonPopoverCard: 'shadow-lg border border-neutral-200 rounded-xl',
    userButtonPopoverActionButton: 'hover:bg-neutral-100 rounded-lg',
    userButtonPopoverFooter: 'hidden',
    modalBackdrop: 'bg-black/50 backdrop-blur-sm',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <head>
          {/* Adobe Fonts - Neue Haas Grotesk, Sabon, Input Mono, Trade Gothic, Sausage */}
          <link rel="stylesheet" href="https://use.typekit.net/toy5zlj.css" />
          
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-37GEW93SEC"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-37GEW93SEC');
            `}
          </Script>
        </head>
        <body className="min-h-screen flex flex-col font-sans bg-black text-white">
          {/* Desktop header */}
          <Header />
          
          {/* Mobile header (fixed top) */}
          <MobileHeader />
          
          {/* Main content with padding for fixed mobile nav */}
          <main className="flex-1 pt-14 pb-16 md:pt-0 md:pb-0">
            {children}
          </main>
          
          {/* Mobile bottom nav (fixed bottom) */}
          <MobileNav />
          
          {/* Desktop footer */}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}