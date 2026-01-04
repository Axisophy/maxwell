'use client'

import { PulseTopic } from '@/lib/pulse'

interface TopicFilterProps {
  activeTopic: 'all' | PulseTopic
  onTopicChange: (topic: 'all' | PulseTopic) => void
}

const topics: Array<{ id: 'all' | PulseTopic; label: string }> = [
  { id: 'all', label: 'ALL' },
  { id: 'space', label: 'SPACE' },
  { id: 'earth', label: 'EARTH' },
  { id: 'life', label: 'LIFE' },
  { id: 'infra', label: 'INFRA' },
  { id: 'detectors', label: 'DETECTORS' },
]

export default function TopicFilter({ activeTopic, onTopicChange }: TopicFilterProps) {
  return (
    <div className="flex flex-wrap gap-px">
      {topics.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onTopicChange(topic.id)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-lg
            transition-colors uppercase tracking-wider
            ${
              activeTopic === topic.id
                ? 'bg-[#ffdf20] text-black'
                : 'bg-black/5 text-black/60 hover:text-black hover:bg-black/10'
            }
          `}
        >
          {topic.label}
        </button>
      ))}
    </div>
  )
}
