'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import MetricCard from './MetricCard'
import { DatasetMetadata } from '../../lib/types'

// ===========================================
// METRIC CATEGORY PANEL
// ===========================================
// Collapsible panel containing metric cards for a category

interface MetricCategoryProps {
  name: string
  description: string
  datasets: DatasetMetadata[]
  activeDatasets: string[]
  onToggleDataset: (id: string) => void
  defaultExpanded?: boolean
}

export default function MetricCategory({
  name,
  description,
  datasets,
  activeDatasets,
  onToggleDataset,
  defaultExpanded = false,
}: MetricCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  
  // Count active datasets in this category
  const activeCount = datasets.filter(d => activeDatasets.includes(d.id)).length

  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
      {/* Header (clickable to expand/collapse) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-base font-medium text-neutral-900">
            {name}
          </h3>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">
              {activeCount} active
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 hidden sm:block">
            {description}
          </span>
          <ChevronDown 
            className={`w-5 h-5 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      
      {/* Content */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-1">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {datasets.map(dataset => (
              <MetricCard
                key={dataset.id}
                dataset={dataset}
                isActive={activeDatasets.includes(dataset.id)}
                onToggle={() => onToggleDataset(dataset.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
