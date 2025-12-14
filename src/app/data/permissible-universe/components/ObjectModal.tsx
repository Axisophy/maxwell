'use client'

import React from 'react'
import { X, ChevronRight } from 'lucide-react'
import { CosmicObject } from '../lib/types'
import { CATEGORIES } from '../lib/constants'
import { getObject } from '../lib/index'

interface Props {
  object: CosmicObject
  explanationLevel: 1 | 2 | 3 | 4
  onLevelChange: (level: 1 | 2 | 3 | 4) => void
  onClose: () => void
  onObjectClick: (id: string) => void
}

const LEVEL_LABELS = {
  1: { name: 'Accessible', description: 'Anyone can understand' },
  2: { name: 'Intuitive', description: 'High school physics' },
  3: { name: 'Technical', description: 'Undergraduate level' },
  4: { name: 'Advanced', description: 'Graduate level' },
}

export function ObjectModal({
  object,
  explanationLevel,
  onLevelChange,
  onClose,
  onObjectClick,
}: Props) {
  const category = CATEGORIES[object.category]
  
  const getExplanation = () => {
    switch (explanationLevel) {
      case 1: return object.explanations.accessible
      case 2: return object.explanations.intuitive
      case 3: return object.explanations.technical
      case 4: return object.explanations.advanced || object.explanations.technical
      default: return object.explanations.accessible
    }
  }

  const relatedObjects = object.nearbyObjects
    .map(id => getObject(id))
    .filter(Boolean) as CosmicObject[]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#111118] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        <div className="sticky top-0 bg-[#111118] border-b border-white/10 px-6 py-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider">{category.name}</span>
            </div>
            <h2 className="text-2xl font-light text-white">{object.name}</h2>
            <p className="text-white/60 text-sm mt-1">{object.tagline}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">Radius</div>
              <div className="text-xl font-mono text-white">{object.radius.formatted}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">Mass</div>
              <div className="text-xl font-mono text-white">{object.mass.formatted}</div>
            </div>
          </div>
          
          {object.discovered && (
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Discovery</div>
              <p className="text-white/80 text-sm">
                Discovered in <span className="text-white font-medium">{object.discovered.year}</span> by{' '}
                <span className="text-white font-medium">{object.discovered.by}</span>
                {object.discovered.how && <span className="text-white/60"> ({object.discovered.how})</span>}
              </p>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">Overview</h3>
            <p className="text-white/80 leading-relaxed whitespace-pre-line">{object.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">Why This Size?</h3>
            <p className="text-white/80 leading-relaxed">{object.whyThisSize}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">Deeper Understanding</h3>
            <div className="flex gap-1 bg-white/5 rounded-xl p-1">
              {([1, 2, 3, 4] as const).map((level) => {
                const hasContent = level === 4 ? !!object.explanations.advanced : true
                return (
                  <button
                    key={level}
                    onClick={() => hasContent && onLevelChange(level)}
                    disabled={!hasContent}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors
                      ${explanationLevel === level ? 'bg-white text-black' : hasContent ? 'text-white/60 hover:bg-white/10' : 'text-white/20 cursor-not-allowed'}`}
                  >
                    <div>{LEVEL_LABELS[level].name}</div>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-white/40 mt-2 text-center">{LEVEL_LABELS[explanationLevel].description}</p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-5 mb-6">
            <p className="text-white/80 leading-relaxed whitespace-pre-line text-sm">{getExplanation()}</p>
          </div>
          
          {relatedObjects.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">Related Objects</h3>
              <div className="flex flex-wrap gap-2">
                {relatedObjects.map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => onObjectClick(rel.id)}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors group"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORIES[rel.category].color }} />
                    <span className="text-sm text-white/80">{rel.name}</span>
                    <ChevronRight className="w-3 h-3 text-white/40 group-hover:text-white/60" />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {object.relatedBoundaries.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">Related Boundaries</h3>
              <div className="flex flex-wrap gap-2">
                {object.relatedBoundaries.map(boundaryId => (
                  <span key={boundaryId} className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white/60">
                    {boundaryId.charAt(0).toUpperCase() + boundaryId.slice(1)} Limit
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
