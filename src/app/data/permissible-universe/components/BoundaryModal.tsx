'use client'

import React from 'react'
import { X, ChevronRight, AlertTriangle } from 'lucide-react'
import { Boundary } from '../lib/types'
import { getObject } from '../lib/index'
import { CATEGORIES } from '../lib/constants'

interface Props {
  boundary: Boundary
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

export function BoundaryModal({
  boundary,
  explanationLevel,
  onLevelChange,
  onClose,
  onObjectClick,
}: Props) {
  const getExplanation = () => {
    switch (explanationLevel) {
      case 1: return boundary.explanations.accessible
      case 2: return boundary.explanations.intuitive
      case 3: return boundary.explanations.technical
      case 4: return boundary.explanations.advanced
      default: return boundary.explanations.accessible
    }
  }

  const definingObjects = boundary.definingObjects.map(id => getObject(id)).filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#111118] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        <div className="sticky top-0 border-b border-white/10 px-6 py-4 flex items-start justify-between" style={{ backgroundColor: boundary.color + '20' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4" style={{ color: boundary.color }} />
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: boundary.color }}>Forbidden Zone</span>
            </div>
            <h2 className="text-2xl font-light text-white">{boundary.name}</h2>
            <p className="text-white/60 text-sm mt-1">{boundary.shortName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">
          <div className="bg-white/5 rounded-xl p-5 mb-6 text-center">
            <div className="text-3xl font-mono text-white mb-2">{boundary.equation}</div>
            <p className="text-sm text-white/50">{boundary.equationExplained}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">Understanding the Boundary</h3>
            <div className="flex gap-1 bg-white/5 rounded-xl p-1">
              {([1, 2, 3, 4] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => onLevelChange(level)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors
                    ${explanationLevel === level ? 'bg-white text-black' : 'text-white/60 hover:bg-white/10'}`}
                >
                  <div>{LEVEL_LABELS[level].name}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-2 text-center">{LEVEL_LABELS[explanationLevel].description}</p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-5 mb-6">
            <p className="text-white/80 leading-relaxed whitespace-pre-line text-sm">{getExplanation()}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">What If This Limit Didn't Exist?</h3>
            <div className="bg-gradient-to-r from-white/5 to-transparent rounded-xl p-5 border-l-2" style={{ borderColor: boundary.color }}>
              <p className="text-white/80 leading-relaxed whitespace-pre-line text-sm">{boundary.counterfactual}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">Implications</h3>
            <ul className="space-y-2">
              {boundary.implications.map((impl, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: boundary.color }} />
                  <span>{impl}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {definingObjects.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">Objects at This Boundary</h3>
              <div className="flex flex-wrap gap-2">
                {definingObjects.map(obj => obj && (
                  <button
                    key={obj.id}
                    onClick={() => onObjectClick(obj.id)}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors group"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORIES[obj.category].color }} />
                    <span className="text-sm text-white/80">{obj.name}</span>
                    <ChevronRight className="w-3 h-3 text-white/40 group-hover:text-white/60" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
