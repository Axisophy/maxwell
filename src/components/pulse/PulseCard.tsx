import Link from 'next/link'
import Image from 'next/image'
import { PulsePost, formatLabel, formatShortDate } from '@/lib/pulse'

interface PulseCardProps {
  post: PulsePost
}

export default function PulseCard({ post }: PulseCardProps) {
  // Different card layouts based on format
  switch (post.format) {
    case 'number':
      return <NumberCard post={post} />
    case 'question':
      return <QuestionCard post={post} />
    case 'signal':
      return <SignalCard post={post} />
    case 'postcard':
      return <PostcardCard post={post} />
    default:
      return <StandardCard post={post} />
  }
}

// Standard card for most formats
function StandardCard({ post }: { post: PulsePost }) {
  return (
    <Link
      href={`/pulse/${post.slug}`}
      className="block bg-white rounded-lg overflow-hidden hover:ring-2 hover:ring-black/10 transition-all"
    >
      {post.image && (
        <div className="relative aspect-video bg-black/5">
          <Image src={post.image} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div className="p-2 md:p-4">
        <div className="text-xs text-black/50 uppercase tracking-wider">
          {formatLabel(post.format)} · {post.topic}
        </div>

        <h3 className="text-lg md:text-xl font-serif font-bold mt-2">{post.title}</h3>

        {post.excerpt && (
          <p className="text-sm text-black/60 mt-2 line-clamp-2">{post.excerpt}</p>
        )}

        <div className="text-xs text-black/50 mt-3">
          {post.readTime} min read · {formatShortDate(post.date)}
        </div>
      </div>
    </Link>
  )
}

// The Number - typography dominates
function NumberCard({ post }: { post: PulsePost }) {
  return (
    <Link
      href={`/pulse/${post.slug}`}
      className="flex flex-col justify-center bg-white rounded-lg p-2 md:p-4 min-h-[280px] hover:ring-2 hover:ring-black/10 transition-all"
    >
      <div className="text-xs text-black/50 uppercase tracking-wider text-center">
        The Number · {post.topic}
      </div>

      <div className="py-6 md:py-8 text-center">
        <div className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black">
          {post.number}
        </div>
      </div>

      <p className="text-sm text-black/60 text-center">{post.excerpt}</p>

      <div className="text-xs text-black/50 mt-4 text-center">
        {formatShortDate(post.date)}
      </div>
    </Link>
  )
}

// The Question - quote-led
function QuestionCard({ post }: { post: PulsePost }) {
  return (
    <Link
      href={`/pulse/${post.slug}`}
      className="block bg-white rounded-lg p-2 md:p-4 hover:ring-2 hover:ring-black/10 transition-all"
    >
      <div className="text-xs text-black/50 uppercase tracking-wider">
        The Question · {post.topic}
      </div>

      <p className="text-lg md:text-xl font-serif font-bold italic mt-3">"{post.question}"</p>

      <div className="flex items-center gap-3 mt-4">
        {post.respondentImage && (
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black/10">
            <Image
              src={post.respondentImage}
              alt={post.respondent || ''}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <div className="text-sm font-medium">{post.respondent}</div>
          <div className="text-xs text-black/50">{post.respondentTitle}</div>
        </div>
      </div>

      <div className="text-xs text-black/50 mt-3">{formatShortDate(post.date)}</div>
    </Link>
  )
}

// Signal - compact, timestamp forward
function SignalCard({ post }: { post: PulsePost }) {
  const date = new Date(post.date)
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <Link
      href={`/pulse/${post.slug}`}
      className="block bg-white rounded-lg p-2 md:p-4 hover:ring-2 hover:ring-black/10 transition-all"
    >
      <div className="text-xs text-black/50 uppercase tracking-wider">
        Signal · {post.topic} · {formatShortDate(post.date)}, {time}
      </div>

      <p className="text-sm mt-2">{post.title}</p>

      {post.observeLinks && post.observeLinks.length > 0 && (
        <div className="text-xs text-black/50 mt-2">
          → Related: {post.observeLinks[0].label}
        </div>
      )}
    </Link>
  )
}

// Postcard - full-bleed image
function PostcardCard({ post }: { post: PulsePost }) {
  return (
    <Link
      href={`/pulse/${post.slug}`}
      className="block h-full bg-white rounded-lg overflow-hidden hover:ring-2 hover:ring-black/10 transition-all"
    >
      <div className="relative aspect-[4/3]">
        {post.image && (
          <Image src={post.image} alt={post.title} fill className="object-cover" />
        )}

        <div className="absolute inset-x-0 bottom-0 p-2 md:p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="text-xs text-white/70 uppercase tracking-wider">
            Postcard · {post.topic}
          </div>
          <h3 className="text-white font-serif font-bold mt-1">{post.title}</h3>
        </div>
      </div>
    </Link>
  )
}
