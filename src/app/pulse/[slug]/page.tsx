import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/pulse.server'
import { formatLabel, formatDate } from '@/lib/pulse'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Not Found | MXWLL' }

  return {
    title: `${post.title} | Pulse | MXWLL`,
    description: post.excerpt,
  }
}

export default async function PulsePostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">
        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="bg-white rounded-lg py-1 md:py-2 px-2 md:px-4">
            <nav className="flex items-center gap-2 text-sm text-black/50">
              <Link href="/" className="hover:text-black">
                MXWLL
              </Link>
              <span>/</span>
              <Link href="/pulse" className="hover:text-black">
                Pulse
              </Link>
              <span>/</span>
              <span className="text-black">{formatLabel(post.format)}</span>
            </nav>
          </div>
        </div>

        {/* Header Frame */}
        <div className="mb-px">
          <div className="bg-white rounded-lg p-4 md:p-6">
            <div className="text-[10px] text-black/40 uppercase tracking-wider">
              {formatLabel(post.format)} · {post.topic}
            </div>

            <h1 className="text-3xl md:text-4xl font-light mt-2">{post.title}</h1>

            {post.excerpt && (
              <p className="text-base text-black/60 mt-3 max-w-2xl">{post.excerpt}</p>
            )}

            <div className="text-xs text-black/40 mt-4">
              {post.readTime} min read · {formatDate(post.date)}
            </div>
          </div>
        </div>

        {/* Hero Image Frame */}
        {post.image && (
          <div className="mb-px">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="relative aspect-video md:aspect-[21/9]">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>
              {(post.imageCaption || post.imageCredit) && (
                <div className="p-3 text-xs text-black/40">
                  {post.imageCaption}
                  {post.imageCredit && <span> Credit: {post.imageCredit}</span>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Frame */}
        <div className="mb-px">
          <div className="bg-white rounded-lg p-4 md:p-8">
            <article className="prose prose-lg max-w-2xl mx-auto prose-headings:font-light prose-p:text-black/80 prose-a:text-black prose-a:underline prose-a:underline-offset-4 hover:prose-a:no-underline">
              <MDXRemote source={post.content} />
            </article>
          </div>
        </div>

        {/* Cross-Links Frame */}
        <div className="mb-px">
          <div className="bg-white rounded-lg p-4">
            <div className="text-[10px] text-black/40 uppercase tracking-wider mb-3">
              Related
            </div>

            <div className="flex flex-wrap gap-4">
              {post.observeLinks?.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="text-sm text-black/60 hover:text-black transition-colors"
                >
                  → {link.label}
                </Link>
              ))}

              <Link
                href="/pulse"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                → More from Pulse
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
