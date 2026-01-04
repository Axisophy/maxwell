import { getAllPosts, getFeaturedPost } from '@/lib/pulse.server'
import { PageShell, BreadcrumbFrame, PageHeaderFrame, breadcrumbItems } from '@/components/ui'
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

      <PageHeaderFrame
        variant="light"
        title="Pulse"
        description="The editorial voice for science. Retrospective, not reactive."
      />

      {/* Client component handles filtering */}
      <PulseContent allPosts={allPosts} featuredPost={featuredPost} />

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </PageShell>
  )
}
