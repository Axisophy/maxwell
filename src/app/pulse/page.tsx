import Link from 'next/link'
import { getAllPosts, getFeaturedPost } from '@/lib/pulse.server'
import PulseContent from './PulseContent'

export const metadata = {
  title: 'Pulse | MXWLL',
  description: 'The editorial voice for science. Retrospective, not reactive.',
}

export default function PulsePage() {
  const allPosts = getAllPosts()
  const featuredPost = getFeaturedPost()

  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">
        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="bg-white rounded-lg py-1 md:py-2 px-2 md:px-4">
            <nav className="flex items-center gap-2 text-sm text-black/50">
              <Link href="/" className="hover:text-black transition-colors">
                MXWLL
              </Link>
              <span className="text-black/30">/</span>
              <span className="text-black">Pulse</span>
            </nav>
          </div>
        </div>

        {/* Header Frame */}
        <div className="mb-px">
          <div className="bg-white rounded-lg p-2 md:p-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase">
              Pulse
            </h1>
            <p className="text-sm text-black/60 mt-2">
              The editorial voice for science. Retrospective, not reactive.
            </p>
          </div>
        </div>

        {/* Client component handles filtering */}
        <PulseContent allPosts={allPosts} featuredPost={featuredPost} />
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
