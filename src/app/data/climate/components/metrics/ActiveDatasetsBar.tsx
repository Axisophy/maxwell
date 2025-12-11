'use client'

import { X } from 'lucide-react'
import { DATASETS, getDatasetColor } from '../../lib/datasets'

// ===========================================
// ACTIVE DATASETS BAR
// ===========================================
// Shows currently active datasets with remove buttons

interface ActiveDatasetsBarProps {
  activeDatasets: string[]
  onRemove: (id: string) => void
  onClearAll: () => void
}

export default function ActiveDatasetsBar({
  activeDatasets,
  onRemove,
  onClearAll,
}: ActiveDatasetsBarProps) {
  if (activeDatasets.length === 0) {
    return (
      <div className="flex items-center justify-between py-3 px-4 bg-neutral-50 rounded-xl">
        <span className="text-sm text-neutral-400">
          No datasets selected. Choose from the categories below.
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between py-2 px-4 bg-neutral-50 rounded-xl">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 mr-1">
          Showing:
        </span>
        
        {activeDatasets.map(id => {
          const dataset = DATASETS[id]
          const color = getDatasetColor(id)
          
          return (
            <button
              key={id}
              onClick={() => onRemove(id)}
              className="group flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-neutral-700">
                {dataset?.shortName || id}
              </span>
              <X className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
            </button>
          )
        })}
      </div>
      
      {activeDatasets.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
