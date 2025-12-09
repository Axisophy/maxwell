import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import MobileHeader from '@/components/MobileHeader'
import MobileNav from '@/components/MobileNav'
import Footer from '@/components/Footer'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MXWLL — A Digital Laboratory',
  description: 'Live data feeds, interactive instruments, scientific tools, and reference charts. Science, beautifully observed.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // For iPhone notch/safe areas
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
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
      <body className="min-h-screen flex flex-col font-sans bg-shell-light text-text-primary">
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
  )
}