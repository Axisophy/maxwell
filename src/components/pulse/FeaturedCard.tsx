import Link from 'next/link'
import Image from 'next/image'
import { PulsePost, formatLabel, formatDate } from '@/lib/pulse'

interface FeaturedCardProps {
  post: PulsePost
}

export default function FeaturedCard({ post }: FeaturedCardProps) {
  return (
    <Link
      href={`/pulse/${post.slug}`}
      className="block bg-white rounded-lg overflow-hidden hover:ring-2 hover:ring-black/10 transition-all"
    >
      {post.image && (
        <div className="relative aspect-[21/9] bg-black/5">
          <Image src={post.image} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div className="p-2 md:p-4">
        <div className="text-xs text-black/50 uppercase tracking-wider">
          {formatLabel(post.format)} · {post.topic}
        </div>

        <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mt-2">{post.title}</h2>

        {post.excerpt && (
          <p className="text-sm text-black/60 mt-2 max-w-2xl">{post.excerpt}</p>
        )}

        <div className="text-xs text-black/50 mt-4">
          {post.readTime} min read · {formatDate(post.date)}
        </div>
      </div>
    </Link>
  )
}
