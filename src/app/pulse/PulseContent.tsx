'use client'

import { useState, useMemo } from 'react'
import { PulsePost, PulseTopic } from '@/lib/pulse'
import TopicFilter from '@/components/pulse/TopicFilter'
import FeaturedCard from '@/components/pulse/FeaturedCard'
import PulseCard from '@/components/pulse/PulseCard'

interface PulseContentProps {
  allPosts: PulsePost[]
  featuredPost: PulsePost | null
}

export default function PulseContent({ allPosts, featuredPost }: PulseContentProps) {
  const [activeTopic, setActiveTopic] = useState<'all' | PulseTopic>('all')

  const filteredPosts = useMemo(() => {
    const nonFeatured = allPosts.filter((p) => !p.featured)
    if (activeTopic === 'all') {
      return nonFeatured
    }
    return nonFeatured.filter((p) => p.topic === activeTopic)
  }, [allPosts, activeTopic])

  return (
    <>
      {/* Featured Frame */}
      {featuredPost && (
        <div className="mb-px">
          <FeaturedCard post={featuredPost} />
        </div>
      )}

      {/* Filter Frame */}
      <div className="mb-px">
        <div className="bg-white rounded-lg p-2 md:p-4">
          <TopicFilter activeTopic={activeTopic} onTopicChange={setActiveTopic} />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
        {filteredPosts.map((post) => (
          <PulseCard key={post.slug} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-black/40">No posts yet in this category.</p>
        </div>
      )}
    </>
  )
}
