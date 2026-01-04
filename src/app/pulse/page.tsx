import { getAllPosts, getFeaturedPost } from '@/lib/pulse.server'
import { PageShell, BreadcrumbFrame, breadcrumbItems } from '@/components/ui'
import PulseContent from './PulseContent'

export const metadata = {
  title: 'Pulse | MXWLL',
  description: 'The editorial voice for science. Retrospective, not reactive.',
}

export default function PulsePage() {
  const allPosts = getAllPosts()
  const featuredPost = getFeaturedPost()

  return (
    <PageShell>
      <BreadcrumbFrame
        variant="light"
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['Pulse']
        )}
      />

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

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </PageShell>
  )
}
