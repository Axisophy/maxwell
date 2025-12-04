import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MAXWELL — A Digital Laboratory for Looking at Science',
  description: 'Live data feeds, interactive instruments, scientific tools, and reference charts. Science, beautifully observed.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        {/* Adobe Fonts - Futura 100 */}
        {/* Replace XXXXXXX with your Adobe Fonts Web Project ID */}
        <link rel="stylesheet" href="https://use.typekit.net/toy5zlj.css" />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
