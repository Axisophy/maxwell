'use client'

import { DatasetMetadata, formatValue } from '../../lib/datasets'

// ===========================================
// METRIC CARD COMPONENT
// ===========================================
// Displays a single climate metric with current value
// Can be toggled to add/remove from chart

interface MetricCardProps {
  dataset: DatasetMetadata
  isActive: boolean
  onToggle: () => void
}

export default function MetricCard({ dataset, isActive, onToggle }: MetricCardProps) {
  const { shortName, currentValue, changePerDecade, unitShort, direction, color } = dataset
  
  // Determine trend direction
  const isIncreasing = changePerDecade && changePerDecade > 0
  const trendBad = (direction === 'up-bad' && isIncreasing) || (direction === 'down-bad' && !isIncreasing)
  
  return (
    <button
      onClick={onToggle}
      className={`
        relative w-full p-4 rounded-xl border-2 transition-all duration-200
        text-left group
        ${isActive 
          ? 'border-current bg-neutral-50' 
          : 'border-transparent bg-white hover:bg-neutral-50 hover:border-neutral-200'
        }
      `}
      style={{ 
        borderColor: isActive ? color : undefined,
      }}
    >
      {/* Active indicator dot */}
      {isActive && (
        <div 
          className="absolute top-3 right-3 w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      
      {/* Label */}
      <div className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
        {shortName}
      </div>
      
      {/* Value */}
      <div className="flex items-baseline gap-1.5">
        <span 
          className="font-mono text-2xl font-bold"
          style={{ color: isActive ? color : '#000' }}
        >
          {currentValue !== undefined ? formatValue(currentValue, unitShort) : '—'}
        </span>
        <span className="text-sm text-neutral-400">
          {unitShort}
        </span>
      </div>
      
      {/* Trend */}
      {changePerDecade !== undefined && (
        <div className={`
          mt-1.5 text-xs font-mono
          ${trendBad ? 'text-red-500' : 'text-neutral-500'}
        `}>
          {isIncreasing ? '↑' : '↓'} {Math.abs(changePerDecade).toFixed(1)} / decade
        </div>
      )}
      
      {/* Add/Remove hint */}
      <div className={`
        mt-2 text-xs transition-opacity
        ${isActive ? 'text-neutral-500' : 'text-neutral-400 opacity-0 group-hover:opacity-100'}
      `}>
        {isActive ? 'Click to remove' : '+ Add to chart'}
      </div>
    </button>
  )
}
